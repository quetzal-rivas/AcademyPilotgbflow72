import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { createRequestId, logger, serializeError } from '@/lib/logger';
import {
  getDefaultAppUrl,
  getStripeMembershipPriceId,
  getStripeServerClient,
  normalizeCheckoutEmail,
  normalizeTenantSlug,
} from '@/lib/stripe';

export const runtime = 'nodejs';

type CheckoutSessionPayload = {
  email: string;
  fullName: string;
  phoneNumber: string;
  tenantSlug: string;
  planTitle?: string;
  uiMode?: 'embedded' | 'redirect';
};

function resolveAppBaseUrl(req: Request): string {
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (host) {
    return `${proto}://${host}`;
  }

  return getDefaultAppUrl();
}

export async function POST(req: Request) {
  const requestId = createRequestId();

  try {
    const payload = (await req.json()) as CheckoutSessionPayload;
    const email = normalizeCheckoutEmail(payload.email || '');
    const fullName = (payload.fullName || '').trim();
    const phoneNumber = (payload.phoneNumber || '').trim();
    const tenantSlug = normalizeTenantSlug(payload.tenantSlug || '');
    const planTitle = (payload.planTitle || 'Strategic Plan').trim();
    const uiMode = payload.uiMode === 'embedded' ? 'embedded' : 'redirect';

    if (!email || !fullName || !phoneNumber || !tenantSlug) {
      return NextResponse.json({ error: 'Missing required checkout fields.', requestId }, { status: 400 });
    }

    const admin = getFirebaseAdmin();
    const db = admin.firestore();

    const [slugConflict, landingConflict] = await Promise.all([
      db.collection('user_profiles').where('tenantSlug', '==', tenantSlug).limit(1).get(),
      db.collection('landing_pages').doc(tenantSlug).get(),
    ]);

    if (!slugConflict.empty || landingConflict.exists) {
      return NextResponse.json(
        { error: `The academy slug '${tenantSlug}' is already in use.`, requestId },
        { status: 409 }
      );
    }

    try {
      await admin.auth().getUserByEmail(email);
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.', requestId },
        { status: 409 }
      );
    } catch (error: any) {
      if (error?.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    const stripe = getStripeServerClient();
    const appBaseUrl = resolveAppBaseUrl(req);
    const priceId = getStripeMembershipPriceId();

    const baseSessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: {
        email,
        fullName,
        phoneNumber,
        tenantSlug,
        planTitle,
      },
    };

    if (uiMode === 'embedded') {
      (baseSessionConfig as any).ui_mode = 'embedded_page';
      baseSessionConfig.return_url = `${appBaseUrl}/checkout?itemType=membership&checkoutStatus=processing&session_id={CHECKOUT_SESSION_ID}&slug=${encodeURIComponent(tenantSlug)}`;
    } else {
      baseSessionConfig.success_url = `${appBaseUrl}/checkout?itemType=membership&checkoutStatus=processing&session_id={CHECKOUT_SESSION_ID}&slug=${encodeURIComponent(tenantSlug)}`;
      baseSessionConfig.cancel_url = `${appBaseUrl}/checkout?itemType=membership&checkoutStatus=cancelled&slug=${encodeURIComponent(tenantSlug)}`;
    }

    const session = await stripe.checkout.sessions.create(
      baseSessionConfig,
      {
        idempotencyKey: `membership:v2:${uiMode}:${tenantSlug}:${email}:${planTitle}`,
      }
    );

    await db.collection('stripe_checkout_sessions').doc(session.id).set(
      {
        status: 'created',
        requestId,
        email,
        fullName,
        phoneNumber,
        tenantSlug,
        planTitle,
        stripeSessionId: session.id,
        stripePaymentStatus: session.payment_status,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    if (uiMode === 'embedded') {
      if (!session.client_secret) {
        throw new Error('Stripe checkout session did not include a client secret for embedded mode.');
      }

      return NextResponse.json({
        clientSecret: session.client_secret,
        sessionId: session.id,
        requestId,
      });
    }

    if (!session.url) {
      throw new Error('Stripe checkout session did not include a redirect URL.');
    }

    return NextResponse.json({ url: session.url, sessionId: session.id, requestId });
  } catch (error: any) {
    logger.error('Failed to create Stripe checkout session', {
      requestId,
      scope: 'api.stripe.checkout-session',
      error: serializeError(error),
    });

    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session.', requestId },
      { status: 500 }
    );
  }
}
