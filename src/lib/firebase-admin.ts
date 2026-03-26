import * as admin from 'firebase-admin';

type ServiceAccountShape = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function parseServiceAccountFromEnv(): ServiceAccountShape | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ServiceAccountShape;
    if (parsed?.client_email && parsed?.private_key) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function parseServiceAccountFromSplitVars(): ServiceAccountShape | null {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) return null;

  return {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, '\n'),
  };
}

/**
 * Tactical Firebase Admin Matrix initialization.
 * Ensures the singleton instance is only initialized once within the server environment.
 */
export function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin;
  }

  const serviceAccount =
    parseServiceAccountFromEnv() || parseServiceAccountFromSplitVars();

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || 'studio-5472086834-71ab7',
    });
  } else {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'studio-5472086834-71ab7'
    });
  }

  return admin;
}
