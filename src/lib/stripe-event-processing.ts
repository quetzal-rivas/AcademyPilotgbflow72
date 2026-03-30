import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { completeCheckoutOnboarding } from '@/lib/checkout-onboarding';
import { getDefaultAppUrl, getStripeServerClient } from '@/lib/stripe';

export type StripeEventLike = {
  id: string;
  type: string;
  data?: {
    object?: any;
  };
};

function isAlreadyExistsError(error: any): boolean {
  return error?.code === 6 || error?.message?.includes('Already exists');
}

async function ensureSnapshotEvent(event: StripeEventLike): Promise<StripeEventLike> {
  const hasObject = Boolean(event?.data?.object);
  if (hasObject) {
    return event;
  }

  const stripe = getStripeServerClient();
  const fetched = await stripe.events.retrieve(event.id);
  return fetched as unknown as StripeEventLike;
}

export async function processStripeEvent(
  eventLike: StripeEventLike,
  requestId: string
): Promise<{ received: true; duplicate?: true; handled?: boolean }> {
  const event = await ensureSnapshotEvent(eventLike);
  const admin = getFirebaseAdmin();
  const db = admin.firestore();
  const eventRef = db.collection('stripe_events').doc(event.id);

  try {
    await eventRef.create({
      status: 'processing',
      type: event.type,
      requestId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error: any) {
    if (isAlreadyExistsError(error)) {
      return { received: true, duplicate: true };
    }

    throw error;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data?.object || {};
    const metadata = session.metadata || {};
    const sessionId = session.id as string;

    const onboardingResult = await completeCheckoutOnboarding(
      {
        email: metadata.email || session.customer_details?.email || '',
        fullName: metadata.fullName || session.customer_details?.name || '',
        phoneNumber: metadata.phoneNumber || '',
        tenantSlug: metadata.tenantSlug || '',
        planTitle: metadata.planTitle || 'Strategic Plan',
      },
      {
        appBaseUrl: getDefaultAppUrl(),
        requestId,
      }
    );

    const updatePayload: Record<string, unknown> = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      stripeSessionId: sessionId,
      stripeEventId: event.id,
    };

    if (onboardingResult.error) {
      updatePayload.status = 'failed';
      updatePayload.error = onboardingResult.error;
      await db.collection('stripe_checkout_sessions').doc(sessionId).set(updatePayload, { merge: true });
      await eventRef.set(
        {
          status: 'failed',
          error: onboardingResult.error,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      return { received: true, handled: false };
    }

    updatePayload.status = 'provisioned';
    updatePayload.redirectPath = onboardingResult.redirectPath || null;
    updatePayload.tenantSlug = onboardingResult.tenantSlug || null;
    await db.collection('stripe_checkout_sessions').doc(sessionId).set(updatePayload, { merge: true });

    await eventRef.set(
      {
        status: 'processed',
        sessionId,
        tenantSlug: onboardingResult.tenantSlug || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { received: true, handled: true };
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data?.object || {};
    const sessionId = session.id as string;

    await db.collection('stripe_checkout_sessions').doc(sessionId).set(
      {
        status: 'expired',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        stripeEventId: event.id,
      },
      { merge: true }
    );

    await eventRef.set(
      {
        status: 'processed',
        sessionId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { received: true, handled: true };
  }

  await eventRef.set(
    {
      status: 'ignored',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { received: true, handled: true };
}
