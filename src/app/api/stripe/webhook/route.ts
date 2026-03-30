import { NextResponse } from 'next/server';
import { createRequestId, logger, serializeError } from '@/lib/logger';
import { getStripeServerClient, getStripeWebhookSecret } from '@/lib/stripe';
import { processStripeEvent } from '@/lib/stripe-event-processing';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const requestId = createRequestId();

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header', requestId }, { status: 400 });
    }

    const payload = await req.text();
    const stripe = getStripeServerClient();
    const event = stripe.webhooks.constructEvent(payload, signature, getStripeWebhookSecret());
    const result = await processStripeEvent(event as any, requestId);
    return NextResponse.json({ ...result, requestId });
  } catch (error: any) {
    logger.error('Stripe webhook handling failed', {
      requestId,
      scope: 'api.stripe.webhook',
      error: serializeError(error),
    });

    return NextResponse.json({ error: error?.message || 'Webhook handling failed', requestId }, { status: 400 });
  }
}
