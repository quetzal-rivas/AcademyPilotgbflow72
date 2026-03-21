const { getFirestore } = require('./firebase-admin');

// Authorization token (should match the one in the Orchestrator)
const VALID_TOKEN = process.env.AUTH_TOKEN || '123456789';

/**
 * Mark Processed Service
 * 
 * Invoked by a webhook (typically from the Sally agent after completing a call) 
 * to mark a batch of leads as processed in Firestore. It updates the 'processed' flag
 * to true and records the timestamp and any provided metadata.
 */
exports.handler = async (event) => {
  console.log('--- MARK PROCESSED SERVICE ---');

  try {
    // 1. Authorization
    const authHeader = event.headers?.authorization || event.headers?.Authorization;
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token || token !== VALID_TOKEN) {
      console.warn('Unauthorized request. Ignoring.');
      // Returning 200 even on auth failure to avoid breaking the webhook sender (ElevenLabs)
      return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Ignored' }) };
    }

    // 2. Parse Payload
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { lead_ids, metadata } = body;

    if (!lead_ids || !Array.isArray(lead_ids) || lead_ids.length === 0) {
      console.error('Invalid payload: missing or empty lead_ids array');
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'lead_ids array is required' }) };
    }

    // 3. Update Firestore (Batch Write)
    const db = getFirestore();
    const batch = db.batch();
    const processedAt = new Date();

    lead_ids.forEach((leadId) => {
      const leadRef = db.collection('leads').doc(leadId);
      batch.update(leadRef, {
        processed: true,
        processedAt: processedAt,
        processedMetadata: metadata || {},
      });
    });

    await batch.commit();
    console.log(`Successfully marked ${lead_ids.length} leads as processed.`);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, count: lead_ids.length })
    };

  } catch (error) {
    console.error('Mark Processed Service Error:', error);
    // Returning 200 even on error to avoid breaking the webhook sender
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, error: 'Internal Server Error', details: error.message })
    };
  }
};