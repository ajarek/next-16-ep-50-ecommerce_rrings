import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export interface CheckoutRequestItem {
  productId: string;
  name: string;
  finishName?: string;
  size: number;
  price: number;
  quantity: number;
  image?: string;
}

export interface CheckoutRequestBody {
  items: CheckoutRequestItem[];
  includeSizingKit?: boolean;
  userEmail?: string;
  userId?: string;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { items, includeSizingKit = false, userEmail, userId } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Koszyk jest pusty lub brak pozycji zamówienia." },
        { status: 400 },
      );
    }

    // Walidacja pozycji
    for (const item of items) {
      if (!item.name || typeof item.price !== "number" || item.price <= 0) {
        return NextResponse.json(
          { error: `Nieprawidłowe dane produktu: ${item.name || "Nieznany"}` },
          { status: 400 },
        );
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Nieprawidłowa ilość dla produktu: ${item.name}` },
          { status: 400 },
        );
      }
    }

    const stripe = getStripe();

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined) ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
      "http://localhost:3000";

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "pln",
        product_data: {
          name: `${item.name}${item.finishName ? ` — ${item.finishName}` : ""}`,
          description: `Inteligentny pierścień tytanowy AURA Gen 3 (Rozmiar: ${item.size})${
            includeSizingKit ? " + Darmowy Zestaw Miarowy Sizing Kit" : ""
          }`,
          images:
            item.image && item.image.startsWith("http")
              ? [item.image]
              : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Stripe operuje na groszach (cents)
      },
      quantity: item.quantity,
    }));

    // Tworzenie sesji Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: userEmail || undefined,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["PL", "DE", "FR", "GB", "US", "ES", "IT"],
      },
      metadata: {
        userId: userId || "guest",
        includeSizingKit: includeSizingKit ? "true" : "false",
        itemCount: String(items.reduce((acc, it) => acc + it.quantity, 0)),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("[Stripe Checkout Error]", error);
    const message =
      error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd.";

    return NextResponse.json(
      { error: `Błąd inicjalizacji płatności Stripe: ${message}` },
      { status: 500 },
    );
  }
}
