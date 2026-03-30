import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getStripeServerClient(): Stripe {
  if (stripeClient) {
    return stripeClient;
  }

  stripeClient = new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'));
  return stripeClient;
}

export function getStripeWebhookSecret(): string {
  return getRequiredEnv('STRIPE_WEBHOOK_SECRET');
}

export function getStripeMembershipPriceId(): string {
  return getRequiredEnv('STRIPE_MEMBERSHIP_PRICE_ID');
}

export function getDefaultAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
}

export function normalizeCheckoutEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeTenantSlug(rawSlug: string): string {
  return rawSlug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
