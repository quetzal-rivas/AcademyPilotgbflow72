import { NextResponse } from 'next/server';
import { createRequestId, logger, serializeError } from '@/lib/logger';
import { processStripeEvent, type StripeEventLike } from '@/lib/stripe-event-processing';

export const runtime = 'nodejs';

type EventBridgeEnvelope = {
  id?: string;
  source?: string;
  'detail-type'?: string;
  detail?: StripeEventLike;
};

function isAuthorized(req: Request): boolean {
  const configuredToken = process.env.STRIPE_EVENTBRIDGE_TOKEN;
  if (!configuredToken) {
    return true;
  }

  const authHeader = req.headers.get('authorization') || '';
  const tokenHeader = req.headers.get('x-eventbridge-token') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  return configuredToken === tokenHeader || configuredToken === bearerToken;
}

export async function POST(req: Request) {
  const requestId = createRequestId();

  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized', requestId }, { status: 401 });
    }

    const body = (await req.json()) as EventBridgeEnvelope;
    const detail = body?.detail;

    if (!detail?.id || !detail?.type) {
      return NextResponse.json({ error: 'Invalid EventBridge Stripe payload.', requestId }, { status: 400 });
    }

    const result = await processStripeEvent(detail, requestId);
    return NextResponse.json({ ...result, requestId });
  } catch (error: any) {
    logger.error('Stripe EventBridge handler failed', {
      requestId,
      scope: 'api.stripe.eventbridge',
      error: serializeError(error),
    });

    return NextResponse.json(
      { error: error?.message || 'Failed to process EventBridge event.', requestId },
      { status: 400 }
    );
  }
}
