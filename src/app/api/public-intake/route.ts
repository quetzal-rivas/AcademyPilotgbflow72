import { NextResponse } from 'next/server';

/**
 * Public Intake API Route
 * 
 * This route allows unauthenticated public clients (like the Free Trial landing page)
 * to submit data (like new leads) to the backend. It acts as a controlled gateway,
 * restricting the types of actions that can be performed without a JWT.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    // 1. Strict Action Allowlist for Public Endpoints
    const ALLOWED_PUBLIC_ACTIONS = ['ADD_LEAD'];
    
    if (!action || !ALLOWED_PUBLIC_ACTIONS.includes(action)) {
      console.warn(`Security Alert: Attempted unauthorized public action: ${action}`);
      return NextResponse.json({ error: 'Action not permitted' }, { status: 403 });
    }

    // 2. Validate Required Tenant Context
    if (!payload || !payload.tenantSlug) {
       console.error('Security Alert: Public intake request missing tenantSlug.');
       return NextResponse.json({ error: 'Bad Request: tenantSlug is required.' }, { status: 400 });
    }

    console.log(`Processing public intake action '${action}' for tenant '${payload.tenantSlug}'...`);

    // 3. Proxy to the Tactical Backend (AWS Lambda)
    // We use the same service-to-service auth token as the secure orchestrator,
    // because the Next.js server trusts this specific, limited public route.
    const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL;
    const ORCHESTRATOR_AUTH_TOKEN = process.env.ORCHESTRATOR_AUTH_TOKEN;

    if (!ORCHESTRATOR_URL || !ORCHESTRATOR_AUTH_TOKEN) {
      console.error("Server Configuration Error: Missing Orchestrator environment variables.");
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    const response = await fetch(ORCHESTRATOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ORCHESTRATOR_AUTH_TOKEN}`
      },
      body: JSON.stringify({ action, payload })
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error("Public Intake Proxy Error:", error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}