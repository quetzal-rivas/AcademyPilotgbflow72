const admin = require('firebase-admin');
const AWS = require('aws-sdk');

const ssm = new AWS.SSM({ region: process.env.AWS_REGION || 'us-east-2' });

let firestore = null;
let firebaseInitialized = false;

/**
 * Initializes the Firebase Admin SDK dynamically at runtime by fetching the SecureString
 * credentials directly from AWS SSM Parameter Store.
 * 
 * Uses a singleton pattern to ensure the credentials are only fetched and 
 * initialized once per cold start.
 */
async function getFirestore() {
  if (firestore) {
    return firestore;
  }

  // If we are in an environment that already has default credentials, try that first
  if (!firebaseInitialized && process.env.USE_DEFAULT_CREDS) {
     admin.initializeApp();
     firestore = admin.firestore();
     firebaseInitialized = true;
     return firestore;
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || '/app/firebase-service-account';
  
  try {
    console.log(`Fetching Firebase Service Account from SSM: ${serviceAccountPath}`);
    const response = await ssm.getParameter({
      Name: serviceAccountPath,
      WithDecryption: true
    }).promise();

    const serviceAccountJson = response.Parameter.Value;
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firestore = admin.firestore();
    firebaseInitialized = true;
    console.log("Firebase Admin successfully initialized from SSM.");
    
    return firestore;
  } catch (error) {
    console.error("Critical Error: Failed to fetch or parse Firebase credentials from SSM.", error);
    throw error; // Let the caller handle the failure
  }
}

module.exports = { getFirestore };