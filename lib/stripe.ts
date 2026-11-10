import Stripe from "stripe";

/**
 * Klient Stripe SDK do operacji serwerowych.
 * Zgodnie z AGENTS.md, klucze sekretne Stripe (sk_test_... / rk_test_...)
 * mogą być używane wyłącznie po stronie serwera (Route Handlers, Server Actions).
 */

const stripeApiKey = process.env.STRIPE_SECRET_KEY?.trim();

let cachedStripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeApiKey) {
    throw new Error(
      "Brak klucza Stripe API. Ustaw zmienną STRIPE_SECRET_KEY (klucz serwerowy sk_test_... / rk_test_...).",
    );
  }

  if (!cachedStripe) {
    cachedStripe = new Stripe(stripeApiKey, {
      apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
      typescript: true,
      appInfo: {
        name: "Aura Ring E-commerce",
        version: "1.0.0",
      },
    });
  }

  return cachedStripe;
}

