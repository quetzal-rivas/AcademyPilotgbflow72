const admin = require('firebase-admin');
const AWS = require('aws-sdk');

const ssm = new AWS.SSM({ region: process.env.AWS_REGION || 'us-east-2' });

let firestore = null;

function normalizeServiceAccount(input) {
  if (!input || typeof input !== 'object') {
    return input;
  }

  const normalized = {
    ...input,
    project_id: input.project_id || input.projectId,
    private_key: input.private_key || input.privateKey,
    client_email: input.client_email || input.clientEmail,
  };

  // Common issue when secrets are stored with escaped newlines.
  if (typeof normalized.private_key === 'string') {
    normalized.private_key = normalized.private_key.replace(/\\n/g, '\n');
  }

  return normalized;
}

/**
 * Initializes the Firebase Admin SDK and returns a Firestore instance.
 *
 * Supports two modes for FIREBASE_SERVICE_ACCOUNT env var:
 * - SSM path (starts with '/'): fetches the SecureString from AWS SSM Parameter Store
 * - Inline JSON string: parses directly
 *
 * Uses a singleton pattern to ensure initialization happens only once.
 */
async function getFirestore() {
  if (firestore) {
    return firestore;
  }

  const serviceAccountValue = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountValue) {
    throw new Error('Firebase service account credentials not found in environment variables.');
  }

  let rawJson;
  if (serviceAccountValue.startsWith('/')) {
    // Resolve from SSM Parameter Store
    console.log(`Resolving Firebase service account from SSM: ${serviceAccountValue}`);
    try {
      const response = await ssm.getParameter({
        Name: serviceAccountValue,
        WithDecryption: true,
      }).promise();
      rawJson = response.Parameter.Value;
    } catch (e) {
      console.error('Critical Error: Failed to resolve FIREBASE_SERVICE_ACCOUNT from SSM.', e.message);
      throw e;
    }
  } else {
    rawJson = serviceAccountValue;
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(rawJson);
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT must be valid JSON:', e.message);
    throw e;
  }

  serviceAccount = normalizeServiceAccount(serviceAccount);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  firestore = admin.firestore();
  return firestore;
}

module.exports = { getFirestore };