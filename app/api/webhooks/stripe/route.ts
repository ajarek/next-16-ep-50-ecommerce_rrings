import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // W środowisku deweloperskim bez skonfigurowanego STRIPE_WEBHOOK_SECRET
      event = JSON.parse(body) as Stripe.Event;
      console.warn(
        "[Stripe Webhook] Ostrzeżenie: Otrzymano zdarzenie bez weryfikacji podpisu (brak STRIPE_WEBHOOK_SECRET).",
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Błąd weryfikacji";
    console.error(`[Stripe Webhook Error] ${message}`);
    return NextResponse.json(
      { error: `Błąd weryfikacji webhooka: ${message}` },
      { status: 400 },
    );
  }

  // Obsługa poszczególnych zdarzeń
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        `[Stripe Webhook] ✅ Opłacono zamówienie: ${session.id}, Kwota: ${
          session.amount_total ? session.amount_total / 100 : 0
        } ${session.currency?.toUpperCase()}`,
      );
      // Metadane przekazane podczas tworzenia sesji
      const userId = session.metadata?.userId;
      const includeSizingKit = session.metadata?.includeSizingKit === "true";
      console.log(
        `[Stripe Webhook] Dane klienta: ${session.customer_details?.email}, Użytkownik: ${userId}, SizingKit: ${includeSizingKit}`,
      );
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `[Stripe Webhook] Płatność zrealizowana pomyślnie: ${paymentIntent.id}`,
      );
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.warn(
        `[Stripe Webhook] ❌ Płatność odrzucona: ${paymentIntent.id}, powód: ${paymentIntent.last_payment_error?.message}`,
      );
      break;
    }

    default:
      console.log(`[Stripe Webhook] Nieobsługiwane zdarzenie: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

