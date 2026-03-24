
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const { getFirestore } = require('./firebase-admin'); // We need firestore for role lookups
const admin = require('firebase-admin');

const ssm = new AWS.SSM({ region: process.env.AWS_REGION || 'us-east-2' });

let AUTH_TOKEN = null;

/**
 * Tactical Credential Resolution
 * Fetches the AUTH_TOKEN from SSM if the env var points to a secure path.
 */
async function resolveAuthToken() {
  if (AUTH_TOKEN) return AUTH_TOKEN;

  const tokenPath = process.env.AUTH_TOKEN || '/app/auth-token';
  
  // If it doesn't look like a path, use it as a literal
  if (!tokenPath.startsWith('/')) {
    AUTH_TOKEN = tokenPath;
    return AUTH_TOKEN;
  }

  try {
    console.log(`Resolving Orchestrator Auth Token from SSM: ${tokenPath}`);
    const response = await ssm.getParameter({
      Name: tokenPath,
      WithDecryption: true
    }).promise();

    AUTH_TOKEN = response.Parameter.Value;
    return AUTH_TOKEN;
  } catch (err) {
    console.error("Critical Error: Failed to resolve Auth Token from SSM.", err);
    throw err;
  }
}

/**
 * Universal Tactical Orchestrator (Multi-Tenant & RBAC)
 * 
 * Acts as a secure API Gateway and router for backend services.
 * Now handles the heavy lifting of Firebase JWT verification and Role-Based
 * Access Control (RBAC) because the frontend runs on Cloudflare Edge.
 */
exports.handler = async (event) => {
  console.log('--- MISSION DIRECTIVE RECEIVED (AWS ORCHESTRATOR) ---');
  
  try {
    // 1. Service-to-Service Authorization (Verify Next.js Proxy)
    const activeToken = await resolveAuthToken();
    const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (token !== activeToken) {
      console.error('Handshake Failure: Unauthorized Access from untrusted source.');
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized Backend Access' }) };
    }

    // 2. Parse Mission Parameters
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action, payload, userJwt } = body;

    if (!action) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Mission directive "action" is missing.' }) };
    }

    // 3. User Identity Verification (Firebase JWT)
    if (!userJwt) {
        console.error('Security Alert: Request missing user JWT.');
        return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized: Missing user token' }) };
    }

    // Initialize Firebase Admin
    const firestoreDb = await getFirestore();
    let decodedToken;

    try {
      decodedToken = await admin.auth().verifyIdToken(userJwt);
    } catch (authError) {
      console.error('Security Alert: Invalid Firebase ID token.', authError);
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized: Invalid user token' }) };
    }

    // 4. Enforce Role-Based Access Control (RBAC) & Tenant Isolation
    const uid = decodedToken.uid;
    const userProfileDoc = await firestoreDb.collection('user_profiles').doc(uid).get();

    if (!userProfileDoc.exists) {
      console.error(`Security Alert: User profile not found for UID: ${uid}`);
      return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden: User profile missing' }) };
    }

    const userProfile = userProfileDoc.data();
    const authorizedRole = userProfile?.role;
    const authorizedTenant = userProfile?.tenantSlug;

    // --- Authorization Logic based on Action ---
    if (payload && payload.tenantSlug) {
        // Restricted actions for Academy Owners
        const OWNER_ACTIONS = ['GET_LEADS', 'MARK_PROCESSED', 'SCHEDULE_CALLBACK', 'SEND_EMAIL', 'UPDATE_LANDING_PAGE'];
        
        if (OWNER_ACTIONS.includes(action)) {
          if (authorizedRole !== 'academy_owner') {
             console.warn(`Security Alert: User ${uid} attempted owner action '${action}' without owner role.`);
             return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden: Insufficient permissions' }) };
          }

          // Check IDOR: Does the tenant they are asking for match the tenant they own?
          if (payload.tenantSlug !== authorizedTenant) {
             console.warn(`Security Alert (IDOR): User ${uid} (Tenant: ${authorizedTenant}) attempted to access data for Tenant: ${payload.tenantSlug}`);
             return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden: Cross-tenant access denied' }) };
          }
        }
    }

    console.log(`Authorization successful for UID: ${uid} (Role: ${authorizedRole}, Tenant: ${authorizedTenant}). Proxying action '${action}'.`);

    // 5. Dispatch to Specialized Sector
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

    const securePayload = {
        ...payload,
        _trustedContext: {
            uid: uid,
            role: authorizedRole,
            tenantSlug: authorizedTenant
        }
    };

    // 6. Invoke Specialized Handler
    const result = await lambda.invoke({
      FunctionName: targetFunction,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(securePayload) 
    }).promise();

    const responsePayload = JSON.parse(result.Payload);
    
    // 7. Relay Response
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
