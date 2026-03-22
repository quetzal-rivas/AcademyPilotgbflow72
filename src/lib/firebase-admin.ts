import * as admin from 'firebase-admin';

/**
 * Tactical Firebase Admin Matrix initialization.
 * Ensures the singleton instance is only initialized once within the server environment.
 */
export function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin;
  }

  // Tactical logic: Expecting service account key in environment variables for high-security deployment.
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) 
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Updated to the correct project ID based on the current environment
      projectId: process.env.FIREBASE_PROJECT_ID || 'studio-5472086834-71ab7',
    });
  } else {
    // Fallback: This may fail in strict production theaters if no SA key is provided.
    // It relies on Application Default Credentials (ADC)
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'studio-5472086834-71ab7'
    });
  }

  return admin;
}
