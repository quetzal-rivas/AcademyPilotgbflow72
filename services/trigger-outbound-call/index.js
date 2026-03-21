const https = require('https');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const SALLY_AGENT_ID = process.env.SALLY_AGENT_ID;
const ELEVENLABS_PHONE_ID = process.env.ELEVENLABS_PHONE_ID;
const ACADEMY_PHONE = process.env.ACADEMY_PHONE;

/**
 * Trigger Outbound Call Service
 * 
 * Asynchronously invoked by the `transcript-webhook` service. It receives a list of unprocessed leads,
 * formats them into a summary message, and initiates an outbound call to the academy via the ElevenLabs API
 * using the "Sally" agent.
 */
exports.handler = async (event) => {
  console.log('--- TRIGGER OUTBOUND CALL ---');
  
  try {
    const { leads, transcript } = event;
    
    // 1. Validate Input
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      console.log('No leads provided in payload. Exiting.');
      return { success: true, message: 'No leads to process' };
    }
    
    // 2. Validate Configuration
    if (!ELEVENLABS_API_KEY || !SALLY_AGENT_ID || !ELEVENLABS_PHONE_ID || !ACADEMY_PHONE) {
      const missing = [];
      if (!ELEVENLABS_API_KEY) missing.push('ELEVENLABS_API_KEY');
      if (!SALLY_AGENT_ID) missing.push('SALLY_AGENT_ID');
      if (!ELEVENLABS_PHONE_ID) missing.push('ELEVENLABS_PHONE_ID');
      if (!ACADEMY_PHONE) missing.push('ACADEMY_PHONE');
      
      const errorMsg = `Missing required environment variables: ${missing.join(', ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    console.log(`Processing ${leads.length} leads for outbound call.`);

    // 3. Format Leads Summary
    const leadsSummary = leads.map((lead, idx) => {
      const dateStr = lead.visit_date ? ` wants to visit on ${lead.visit_date}` : ' unspecified visit date';
      const noteStr = lead.note ? `, note: ${lead.note}` : '';
      return `Lead ${idx + 1}: ${lead.name}, phone ${lead.phone}, interested in ${lead.clase},${dateStr}${noteStr}`;
    }).join('. ');

    // 4. Prepare Dynamic Variable for Agent
    const leadSummaryMessage = `Hello, this is Sally calling from Gracie Barra. We have ${leads.length} new student lead${leads.length > 1 ? 's' : ''}. Here are the details: ${leadsSummary}. What times work best for you this week to schedule their visits?`;
    
    // 5. Prepare ElevenLabs Request Payload
    const requestPayload = {
      agent_id: SALLY_AGENT_ID,
      agent_phone_number_id: ELEVENLABS_PHONE_ID,
      to_number: ACADEMY_PHONE,
      conversation_initiation_client_data: {
        dynamic_variables: {
          lead_summary: leadSummaryMessage, // The agent's prompt must use {{lead_summary}}
        },
        metadata: {
          lead_ids: leads.map(l => l.id),
          lead_count: leads.length,
          triggered_by: 'transcript_webhook',
        },
      },
    };

    console.log(`Initiating call to ${ACADEMY_PHONE} using agent ${SALLY_AGENT_ID}`);

    // 6. Execute API Call
    const callResult = await makeElevenLabsCall(requestPayload);
    
    console.log(`Outbound call initiated successfully. ConvID: ${callResult.conversation_id || 'N/A'}`);

    return {
      success: true, 
      message: 'Outbound call initiated',
      leads_processed: leads.length,
      conversation_id: callResult.conversation_id
    };

  } catch (error) {
    console.error('Trigger Outbound Call Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Wrapper for the ElevenLabs API call using standard http module
 */
function makeElevenLabsCall(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'api.elevenlabs.io',
      path: '/v1/convai/twilio/outbound-call',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(responseData)); } catch (e) { resolve({ raw: responseData }); }
        } else {
          reject(new Error(`ElevenLabs API ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}