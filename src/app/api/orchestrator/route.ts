import { NextResponse } from 'next/server';
import { createRequestId, logger, serializeError } from '@/lib/logger';

/**
 * Orchestrator Proxy API Route (Cloudflare Pages Compatible)
 * 
 * This route runs on the Cloudflare Edge network. It cannot use full Node.js libraries 
 * like 'firebase-admin'. Its sole purpose is to securely attach the backend service token
 * and forward the user's Firebase JWT to the AWS Lambda Orchestrator for actual verification.
 */
export const runtime = 'edge'; // Explicitly declare Edge runtime for Cloudflare

export async function POST(req: Request) {
  const requestId = req.headers.get('x-request-id') || createRequestId();

  try {
    // 1. Extract the User's Identity (Firebase JWT) from the frontend request
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Proxy alert: missing or invalid authorization header', {
        requestId,
        scope: 'api.orchestrator',
      });
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token', requestId }, { status: 401 });
    }

    // 2. Parse the Action Payload
    const body = await req.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Bad Request: Missing action', requestId }, { status: 400 });
    }

    // 3. Prepare the upstream request to AWS
    const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL;
    const ORCHESTRATOR_AUTH_TOKEN = process.env.ORCHESTRATOR_AUTH_TOKEN;

    if (!ORCHESTRATOR_URL || !ORCHESTRATOR_AUTH_TOKEN) {
      logger.error('Server configuration error: missing orchestrator env vars', {
        requestId,
        scope: 'api.orchestrator',
      });
      return NextResponse.json({ error: 'Internal Server Error', requestId }, { status: 500 });
    }

    logger.info('Proxying action to AWS orchestrator', {
      requestId,
      scope: 'api.orchestrator',
      action,
    });

    // 4. Proxy to the Tactical Backend (AWS Lambda)
    // We send BOTH the service-to-service token (in the header) AND the user's JWT (in the body)
    // so the AWS Orchestrator can verify both the source and the user.
    const response = await fetch(ORCHESTRATOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ORCHESTRATOR_AUTH_TOKEN}`,
        'x-request-id': requestId,
      },
      body: JSON.stringify({ 
        action, 
        payload,
        // Pass the user's JWT down to AWS for verification
        userJwt: authHeader.split('Bearer ')[1] 
      })
    });

    const data = await response.json();
    return NextResponse.json({ ...data, requestId }, { status: response.status });

  } catch (error: any) {
    logger.error('Orchestrator proxy error', {
      requestId,
      scope: 'api.orchestrator',
      error: serializeError(error),
    });

    const includeDetails = process.env.NODE_ENV !== 'production';

    return NextResponse.json(
      {
        error: 'Failed to process request on Edge',
        requestId,
        ...(includeDetails ? { details: error?.message || 'Unknown error' } : {}),
      },
      { status: 500 }
    );
  }
}