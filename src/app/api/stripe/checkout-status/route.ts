import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { createRequestId, logger, serializeError } from '@/lib/logger';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const requestId = createRequestId();

  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id is required', requestId }, { status: 400 });
    }

    const admin = getFirebaseAdmin();
    const sessionSnap = await admin.firestore().collection('stripe_checkout_sessions').doc(sessionId).get();

    if (!sessionSnap.exists) {
      return NextResponse.json({ status: 'pending', requestId });
    }

    const data = sessionSnap.data() || {};
    return NextResponse.json(
      {
        status: data.status || 'pending',
        redirectPath: data.redirectPath || null,
        error: data.error || null,
        requestId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error('Failed to read Stripe checkout session status', {
      requestId,
      scope: 'api.stripe.checkout-status',
      error: serializeError(error),
    });

    return NextResponse.json(
      { error: error?.message || 'Failed to read checkout status.', requestId },
      { status: 500 }
    );
  }
}
