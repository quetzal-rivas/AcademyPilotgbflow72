const AWS = require('aws-sdk');
const { getFirestore } = require('./firebase-admin');

const lambda = new AWS.Lambda({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * Transcript Webhook Service
 * 
 * Invoked by ElevenLabs when a conversation ends. It extracts the transcript,
 * queries Firestore for unprocessed leads created within the last 24 hours,
 * and if any exist, asynchronously triggers the 'trigger-outbound-call' Lambda
 * to have the Sally agent report them to the academy.
 */
exports.handler = async (event) => {
  console.log('--- TRANSCRIPT WEBHOOK ---');

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const transcript = body?.transcript || body?.text || 'No transcript provided';
    
    console.log(`Received transcript preview: ${transcript.substring(0, 100)}...`);

    const db = getFirestore();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 1. Query for unprocessed leads from the last 24 hours
    const snapshot = await db.collection('leads')
      .where('processed', '==', false)
      .where('createdAt', '>=', twentyFourHoursAgo)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    if (snapshot.empty) {
      console.log('No unprocessed leads found in the last 24 hours. Skipping outbound call.');
      return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Processed. No action needed.' }) };
    }

    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${leads.length} unprocessed leads.`);

    // 2. Trigger Outbound Call Lambda (if enabled)
    if (process.env.TRIGGER_OUTBOUND === 'true') {
      const outboundLambdaName = process.env.OUTBOUND_LAMBDA_NAME || 'triggerOutboundCallHandler';
      console.log(`Triggering outbound Lambda: ${outboundLambdaName}`);

      try {
        await lambda.invoke({
          FunctionName: outboundLambdaName,
          InvocationType: 'Event', // Asynchronous invocation
          Payload: JSON.stringify({ leads, transcript })
        }).promise();
        console.log('Outbound call Lambda triggered successfully.');
      } catch (invokeError) {
        console.error('Failed to invoke outbound call Lambda:', invokeError);
      }
    } else {
      console.log('Skipping outbound call. TRIGGER_OUTBOUND is not set to "true".');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, unprocessedLeadsCount: leads.length })
    };

  } catch (error) {
    console.error('Transcript Webhook Error:', error);
    // Return 200 to ElevenLabs to prevent webhook retries on our internal errors
    return { statusCode: 200, body: JSON.stringify({ success: false, error: 'Internal processing error logged.' }) };
  }
};