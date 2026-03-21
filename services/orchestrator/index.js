const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

const AUTH_TOKEN = process.env.AUTH_TOKEN || '123456789';

/**
 * Universal Tactical Orchestrator.
 * Acts as a secure API Gateway and router for backend services.
 * Receives mission directives from the Next.js server and fans out to specialized Lambda handlers.
 */
exports.handler = async (event) => {
  console.log('--- MISSION DIRECTIVE RECEIVED ---');
  
  try {
    // 1. Authorization Protocol
    const authHeader = event.headers?.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (token !== AUTH_TOKEN) {
      console.error('Handshake Failure: Unauthorized Access');
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    // 2. Parse Mission Parameters
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action, payload } = body;

    if (!action) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Mission directive "action" is missing.' }) };
    }

    console.log(`Action Initiated: ${action}`);

    // 3. Dispatch to Specialized Sector
    let targetFunction;
    switch (action) {
      case 'SEND_EMAIL':
        targetFunction = process.env.SES_HANDLER_FUNCTION_NAME;
        break;
      case 'ADD_LEAD':
        targetFunction = process.env.ADD_LEAD_FUNCTION_NAME;
        break;
      case 'GET_LEADS':
        targetFunction = process.env.GET_LEADS_FUNCTION_NAME;
        break;
      case 'MARK_PROCESSED':
        targetFunction = process.env.MARK_PROCESSED_FUNCTION_NAME;
        break;
      case 'SCHEDULE_CALLBACK':
        targetFunction = process.env.SCHEDULE_CALLBACK_FUNCTION_NAME;
        break;
      default:
        console.error(`Unknown action: ${action}`);
        return { statusCode: 400, body: JSON.stringify({ error: `Unknown action: ${action}` }) };
    }

    if (!targetFunction) {
      console.error(`Target function for action ${action} is not configured.`);
      return { statusCode: 500, body: JSON.stringify({ error: `Server Configuration Error for action: ${action}` }) };
    }

    console.log(`Invoking Tactical Handler: ${targetFunction}`);

    // 4. Invoke Specialized Handler
    const result = await lambda.invoke({
      FunctionName: targetFunction,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(payload) 
    }).promise();

    const responsePayload = JSON.parse(result.Payload);
    
    // 5. Relay Response
    return {
      statusCode: responsePayload.statusCode || 200,
      body: responsePayload.body || JSON.stringify(responsePayload)
    };

  } catch (error) {
    console.error('Matrix Failure: Orchestrator encountered a critical error.', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Matrix Error', details: error.message })
    };
  }
};