import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  // Odczyt request.url musi być poza blokiem try — Next.js używa wyjątku
  // przerwania prerenderowania i nie wolno go tłumić.
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Brak identyfikatora sesji (session_id)." },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    });

    return NextResponse.json({
      id: session.id,
      paymentStatus: session.payment_status,
      customerDetails: session.customer_details,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency?.toUpperCase() || "PLN",
      metadata: session.metadata,
      lineItems: session.line_items?.data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        amountTotal: item.amount_total / 100,
      })),
    });
  } catch (error) {
    console.error("[Stripe Retrieve Session Error]", error);
    const message =
      error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd.";

    return NextResponse.json(
      { error: `Nie udało się pobrać szczegółów sesji: ${message}` },
      { status: 500 },
    );
  }
}

