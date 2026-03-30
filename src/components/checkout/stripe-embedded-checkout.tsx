"use client";

import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export function StripeEmbeddedCheckout({ clientSecret }: { clientSecret: string }) {
  if (!stripePromise) {
    return (
      <div className="rounded-none border-2 border-destructive bg-destructive/10 p-4 text-xs font-bold uppercase tracking-wider text-destructive">
        Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. Add it to your environment to render embedded checkout.
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
