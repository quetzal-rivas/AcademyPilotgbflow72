import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

/**
 * Orchestrator Proxy API Route (Secure Gateway)
 * 
 * Acts as the ONLY entry point for the frontend to communicate with the tactical backend.
 * It enforces strict authentication and authorization before proxying requests to AWS Lambda.
 */
export async function POST(req: Request) {
  try {
    // 1. Extract and Verify the User's Identity (Firebase JWT)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Security Alert: Request missing Authorization header.');
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const adminAuth = getFirebaseAdmin().auth();
    let decodedToken;

    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (authError) {
      console.error('Security Alert: Invalid Firebase ID token.', authError);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // 2. Parse the Action Payload
    const body = await req.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Bad Request: Missing action' }, { status: 400 });
    }

    // 3. Enforce Role-Based Access Control (RBAC) & Tenant Isolation
    // --------------------------------------------------------------------------------
    // THE GOLDEN RULE: The token (decodedToken) is the undeniable source of truth.
    // We must verify the requested action and payload against the user's authorized role and tenant.
    // --------------------------------------------------------------------------------
    
    // For now, we expect the tenantSlug to be passed in the payload for routing/context.
    // In a fully locked-down system, we should ideally rely ONLY on custom claims (e.g., decodedToken.tenantSlug).
    // Since we haven't implemented custom claims yet, we will perform a real-time Firestore lookup
    // to verify the user's role and tenant ownership. This is secure, though slightly slower than custom claims.

    const firestore = getFirebaseAdmin().firestore();
    const userProfileDoc = await firestore.collection('user_profiles').doc(decodedToken.uid).get();

    if (!userProfileDoc.exists) {
      console.error(`Security Alert: User profile not found for UID: ${decodedToken.uid}`);
      return NextResponse.json({ error: 'Forbidden: User profile missing' }, { status: 403 });
    }

    const userProfile = userProfileDoc.data();
    const authorizedRole = userProfile?.role;
    const authorizedTenant = userProfile?.tenantSlug;

    // --- Authorization Logic based on Action ---
    if (action === 'GET_LEADS' || action === 'MARK_PROCESSED' || action === 'SCHEDULE_CALLBACK') {
      // These are Academy Owner actions.
      if (authorizedRole !== 'academy_owner') {
         console.warn(`Security Alert: User ${decodedToken.uid} attempted owner action '${action}' without owner role.`);
         return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
      }

      // Check IDOR: Does the tenant they are asking for match the tenant they own?
      if (payload.tenantSlug !== authorizedTenant) {
         console.warn(`Security Alert (IDOR): User ${decodedToken.uid} (Tenant: ${authorizedTenant}) attempted to access data for Tenant: ${payload.tenantSlug}`);
         return NextResponse.json({ error: 'Forbidden: Cross-tenant access denied' }, { status: 403 });
      }
    } 
    // Add logic here for Student actions (e.g., action === 'GET_MY_CLASSES')
    // Students should only be able to access data where payload.studentId === decodedToken.uid AND payload.tenantSlug === authorizedTenant

    console.log(`Authorization successful for UID: ${decodedToken.uid} (Role: ${authorizedRole}, Tenant: ${authorizedTenant}). Proxying action '${action}'.`);

    // 4. Proxy to the Tactical Backend (AWS Lambda)
    const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL;
    const ORCHESTRATOR_AUTH_TOKEN = process.env.ORCHESTRATOR_AUTH_TOKEN;

    if (!ORCHESTRATOR_URL || !ORCHESTRATOR_AUTH_TOKEN) {
      console.error("Server Configuration Error: Missing Orchestrator environment variables.");
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
    // We enhance the payload with trusted data from the verified token.
    // This allows backend microservices to rely on this data without re-verifying the user.
    const securePayload = {
        ...payload,
        _trustedContext: {
            uid: decodedToken.uid,
            role: authorizedRole,
            tenantSlug: authorizedTenant
        }
    };

    const response = await fetch(ORCHESTRATOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ORCHESTRATOR_AUTH_TOKEN}` // The service-to-service secret
      },
      body: JSON.stringify({ action, payload: securePayload })
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error("Orchestrator Proxy Error:", error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}