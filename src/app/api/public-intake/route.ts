import { NextResponse } from 'next/server';
import { createRequestId, logger, serializeError } from '@/lib/logger';

/**
 * Public Intake API Route
 * 
 * This route allows unauthenticated public clients (like the Free Trial landing page)
 * to submit data (like new leads) to the backend. It acts as a controlled gateway,
 * restricting the types of actions that can be performed without a JWT.
 */
export async function POST(req: Request) {
  const requestId = req.headers.get('x-request-id') || createRequestId();

  try {
    const body = await req.json();
    const { action, payload } = body;

    // 1. Strict Action Allowlist for Public Endpoints
    const ALLOWED_PUBLIC_ACTIONS = ['ADD_LEAD'];
    
    if (!action || !ALLOWED_PUBLIC_ACTIONS.includes(action)) {
      logger.warn('Security alert: attempted unauthorized public action', {
        requestId,
        scope: 'api.public-intake',
        action,
      });
      return NextResponse.json({ error: 'Action not permitted', requestId }, { status: 403 });
    }

    // 2. Validate Required Tenant Context
    if (!payload || !payload.tenantSlug) {
       logger.error('Security alert: public intake request missing tenantSlug', {
        requestId,
        scope: 'api.public-intake',
        action,
       });
       return NextResponse.json({ error: 'Bad Request: tenantSlug is required.', requestId }, { status: 400 });
    }

    logger.info('Processing public intake action', {
      requestId,
      scope: 'api.public-intake',
      action,
      tenantSlug: payload.tenantSlug,
    });

    // 3. Proxy to the Tactical Backend (AWS Lambda)
    // We use the same service-to-service auth token as the secure orchestrator,
    // because the Next.js server trusts this specific, limited public route.
    const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL;
    const ORCHESTRATOR_AUTH_TOKEN = process.env.ORCHESTRATOR_AUTH_TOKEN;

    if (!ORCHESTRATOR_URL || !ORCHESTRATOR_AUTH_TOKEN) {
      logger.error('Server configuration error: missing orchestrator environment variables', {
        requestId,
        scope: 'api.public-intake',
      });
      return NextResponse.json({ error: 'Internal Server Error', requestId }, { status: 500 });
    }

    const response = await fetch(ORCHESTRATOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ORCHESTRATOR_AUTH_TOKEN}`,
        'x-request-id': requestId,
      },
      body: JSON.stringify({ action, payload })
    });

    const data = await response.json();
    return NextResponse.json({ ...data, requestId }, { status: response.status });

  } catch (error: any) {
    logger.error('Public intake proxy error', {
      requestId,
      scope: 'api.public-intake',
      error: serializeError(error),
    });
    return NextResponse.json({ error: 'Failed to process request', details: error.message, requestId }, { status: 500 });
  }
}