const https = require('https');
const { getFirestore } = require('./firebase-admin');

// Configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const CALLBACK_AGENT_ID = process.env.CALLBACK_AGENT_ID;
const CALLBACK_PHONE_ID = process.env.CALLBACK_PHONE_ID;

/**
 * Process Callback Queue Service
 * 
 * Invoked periodically by EventBridge. It checks the 'callback_queue' in Firestore for pending items,
 * verifies if the academy is currently within operational hours, and if so, initiates an outbound call
 * via the ElevenLabs API.
 */
exports.handler = async (event) => {
  console.log('--- PROCESS CALLBACK QUEUE ---');

  try {
    // 1. Validate Configuration
    if (!ELEVENLABS_API_KEY || !CALLBACK_AGENT_ID || !CALLBACK_PHONE_ID) {
      console.warn('Configuration incomplete. Skipping queue processing.');
      return { success: true, message: 'Configuration incomplete', processed: 0 };
    }

    const db = getFirestore();

    // 2. Check Operational Hours
    const isOperational = await checkOperationalHours(db);
    if (!isOperational) {
      console.log('Outside operational hours. Skipping queue processing.');
      return { success: true, message: 'Outside operational hours', processed: 0 };
    }

    // 3. Fetch Pending Items (FIFO, limit 1 per invocation)
    const snapshot = await db.collection('callback_queue')
      .where('status', '==', 'pending')
      .orderBy('created_at', 'asc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log('No pending items in queue.');
      return { success: true, message: 'No pending items', processed: 0 };
    }

    // 4. Process the Queue Item
    const doc = snapshot.docs[0];
    const queueItemId = doc.id;
    const queueItem = doc.data();
    
    console.log(`Processing queue item: ${queueItemId} for lead: ${queueItem.lead_name}`);

    // 4a. Check Scheduled Time
    if (queueItem.scheduled_for) {
      const scheduledTime = new Date(queueItem.scheduled_for);
      if (scheduledTime > new Date()) {
        console.log(`Item scheduled for future (${scheduledTime.toISOString()}). Skipping.`);
        return { success: true, message: 'Item scheduled for future', processed: 0, skipped: 1 };
      }
    }

    try {
      // 4b. Prepare and Execute Outbound Call
      const payload = {
        agent_id: CALLBACK_AGENT_ID,
        agent_phone_number_id: CALLBACK_PHONE_ID,
        to_number: queueItem.lead_phone,
        conversation_initiation_client_data: {
          dynamic_variables: {
            lead_name: queueItem.lead_name,
            lead_id: queueItem.lead_id,
            class_type: queueItem.clase,
            callback_message: queueItem.message,
          },
          metadata: { source: 'process_callback_queue', queue_item_id: queueItemId },
        },
      };

      const callResult = await makeOutboundCall(JSON.stringify(payload));
      
      // 4c. Update Queue Item to Completed
      await db.collection('callback_queue').doc(queueItemId).update({
        status: 'completed',
        completed_at: new Date(),
        conversation_id: callResult.conversation_id || null,
      });

      console.log(`Successfully initiated call. ConvID: ${callResult.conversation_id}`);
      return { success: true, processed: 1, failed: 0 };

    } catch (callError) {
      console.error(`Error initiating call for item ${queueItemId}:`, callError.message);
      
      // 4d. Handle Failure and Retries
      const attemptCount = (queueItem.attempt_count || 0) + 1;
      const maxRetries = 3;
      const newStatus = attemptCount < maxRetries ? 'pending' : 'failed';

      await db.collection('callback_queue').doc(queueItemId).update({
        status: newStatus,
        attempt_count: attemptCount,
        last_error: callError.message,
        last_attempt_at: new Date(),
      });

      return { success: false, processed: 0, failed: 1, error: callError.message };
    }

  } catch (error) {
    console.error('Queue Processing Error:', error);
    return { success: false, error: 'Internal Server Error', details: error.message };
  }
};

/**
 * Checks Firestore to determine if current time is within academy operational hours.
 */
async function checkOperationalHours(db) {
  try {
    const now = new Date();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    // Format to local HH:MM string, assuming server time is acceptable or needs timezone adjustment
    const currentTime = now.toLocaleString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', timeZone: process.env.TZ || 'America/New_York' });

    const scheduleDoc = await db.collection('schedule').doc('weekly').get();
    if (!scheduleDoc.exists) return true; // Default to open if no schedule

    const daySchedule = scheduleDoc.data()[dayOfWeek];
    if (!daySchedule || daySchedule.closed) return false;

    const { open, close } = daySchedule;
    if (!open || !close) return true; // Default open if schedule format is invalid

    return currentTime >= open && currentTime < close;
  } catch (error) {
    console.error('Error checking operational hours:', error);
    return true; // Fail open
  }
}

/**
 * Wrapper for the ElevenLabs API call using standard http module
 */
function makeOutboundCall(payload) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.elevenlabs.io',
      path: '/v1/convai/twilio/outbound-call', // Using twilio endpoint as per legacy code
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch (e) { resolve({ raw: data }); }
        } else {
          reject(new Error(`ElevenLabs API ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}