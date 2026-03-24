
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const { getFirestore } = require('./firebase-admin'); // We need firestore for role lookups
const admin = require('firebase-admin');

const ssm = new AWS.SSM({ region: process.env.AWS_REGION || 'us-east-2' });

let AUTH_TOKEN = null;

function log(level, message, meta = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const serialized = JSON.stringify(entry);
  if (level === 'error') {
    console.error(serialized);
    return;
  }

  if (level === 'warn') {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

function serializeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { value: String(error) };
}

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
 * Distinguishes between Service-Level trust and User-Level authorization.
 */
exports.handler = async (event) => {
  const requestId = event.headers?.['x-request-id'] || event.headers?.['X-Request-Id'] || event.requestContext?.requestId || `aws-${Date.now()}`;

  log('info', 'Mission directive received by AWS orchestrator', {
    requestId,
    scope: 'aws.orchestrator',
  });
  
  try {
    // 1. Service-to-Service Authorization (Verify Next.js Proxy)
    const activeToken = await resolveAuthToken();
    const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (token !== activeToken) {
      log('error', 'Handshake failure: unauthorized backend access', {
        requestId,
        scope: 'aws.orchestrator',
      });
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized Backend Access', requestId }) };
    }

    // 2. Parse Mission Parameters
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action, payload, userJwt } = body;

    if (!action) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Mission directive "action" is missing.', requestId }) };
    }

    // 3. Define Action Classes
    const OWNER_ACTIONS = ['GET_LEADS', 'MARK_PROCESSED', 'SCHEDULE_CALLBACK', 'UPDATE_LANDING_PAGE'];
    const SERVICE_ACTIONS = ['SEND_EMAIL', 'ADD_LEAD'];

    // Initialize Identity Matrix
    const firestoreDb = await getFirestore();
    let decodedToken = null;
    let uid = null;
    let userProfile = null;
    let authorizedRole = null;
    let authorizedTenant = null;

    // 4. User Identity Verification (If JWT is provided or required)
    if (userJwt) {
      try {
        decodedToken = await admin.auth().verifyIdToken(userJwt);
        uid = decodedToken.uid;
        const userProfileDoc = await firestoreDb.collection('user_profiles').doc(uid).get();

        if (userProfileDoc.exists) {
          userProfile = userProfileDoc.data();
          authorizedRole = userProfile?.role;
          authorizedTenant = userProfile?.tenantSlug;
        }
      } catch (authError) {
        log('error', 'Security alert: invalid Firebase ID token', {
          requestId,
          scope: 'aws.orchestrator',
          error: serializeError(authError),
        });
        return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized: Invalid user token', requestId }) };
      }
    }

    // 5. Enforce Access Control
    if (OWNER_ACTIONS.includes(action)) {
        if (!uid) {
            log('error', 'Security alert: owner action missing user JWT', {
              requestId,
              scope: 'aws.orchestrator',
              action,
            });
            return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized: Missing user token', requestId }) };
        }

        if (authorizedRole !== 'academy_owner') {
             log('warn', 'Security alert: owner action attempted without owner role', {
               requestId,
               scope: 'aws.orchestrator',
               action,
               uid,
               authorizedRole,
             });
             return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden: Insufficient permissions', requestId }) };
        }

        // Check IDOR: Does the tenant they are asking for match the tenant they own?
        if (payload && payload.tenantSlug && payload.tenantSlug !== authorizedTenant) {
             log('warn', 'Security alert: cross-tenant access denied', {
               requestId,
               scope: 'aws.orchestrator',
               uid,
               authorizedTenant,
               requestedTenant: payload.tenantSlug,
             });
             return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden: Cross-tenant access denied', requestId }) };
        }
    }

    log('info', 'Authorization successful. Proxying action to target sector', {
      requestId,
      scope: 'aws.orchestrator',
      action,
      uid,
    });

    // 6. Dispatch to Specialized Sector
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
        log('error', 'Unknown action requested', {
          requestId,
          scope: 'aws.orchestrator',
          action,
        });
        return { statusCode: 400, body: JSON.stringify({ error: `Unknown action: ${action}`, requestId }) };
    }

    if (!targetFunction) {
      log('error', 'Target function is not configured', {
        requestId,
        scope: 'aws.orchestrator',
        action,
      });
      return { statusCode: 500, body: JSON.stringify({ error: `Server Configuration Error for action: ${action}`, requestId }) };
    }

    const securePayload = {
        ...payload,
        _trustedContext: {
            uid: uid,
            role: authorizedRole,
            tenantSlug: authorizedTenant || payload?.tenantSlug,
            requestId,
        }
    };

    // 7. Invoke Specialized Handler
    const result = await lambda.invoke({
      FunctionName: targetFunction,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ body: securePayload }) // Wrap in body for standard lambda handling
    }).promise();

    const responsePayload = JSON.parse(result.Payload);
    
    // 8. Relay Response
    return {
      statusCode: responsePayload.statusCode || 200,
      body: responsePayload.body || JSON.stringify({ ...responsePayload, requestId })
    };

  } catch (error) {
    log('error', 'Matrix failure: orchestrator critical error', {
      requestId,
      scope: 'aws.orchestrator',
      error: serializeError(error),
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Matrix Error', details: error.message, requestId })
    };
  }
};
