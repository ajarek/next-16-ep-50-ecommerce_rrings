"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Truck,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Package,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

interface SessionData {
  id: string;
  paymentStatus: string;
  customerDetails?: {
    email?: string;
    name?: string;
  };
  amountTotal: number;
  currency: string;
  metadata?: {
    includeSizingKit?: string;
    itemCount?: string;
  };
  lineItems?: Array<{
    description: string;
    quantity: number;
    amountTotal: number;
  }>;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const hasClearedRef = useRef(false);

  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    // Czyścimy koszyk po udanym powrocie z bramki Stripe (dokładnie raz)
    if (!hasClearedRef.current) {
      hasClearedRef.current = true;
      clearCart();
    }

    if (!sessionId) return;

    let isMounted = true;
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && !data.error) {
          setSession(data);
        }
      })
      .catch((err) => console.warn("Nie udało się pobrać szczegółów sesji", err));

    return () => {
      isMounted = false;
    };
  }, [sessionId, clearCart]);

  const hasSizingKit = session?.metadata?.includeSizingKit === "true";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Karta Sukcesu */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#0d0e14]/90 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
        {/* Poświata w tle */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Ikona sukcesu */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle className="h-10 w-10 stroke-[1.75]" />
          </div>

          <span className="mt-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Płatność testowa zrealizowana (Stripe Sandbox)
          </span>

          <h1 className="mt-4 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl">
            Dziękujemy za zamówienie w AURA RING!
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-400">
            Transakcja testowa Stripe została pomyślnie przetworzona. Twoje
            zamówienie zostało zarejestrowane w naszym systemie produkcyjnym.
          </p>

          {sessionId && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 font-mono text-xs text-zinc-400">
              <span>Sesja Stripe:</span>
              <span className="text-amber-300">
                {sessionId.slice(0, 14)}...{sessionId.slice(-8)}
              </span>
            </div>
          )}
        </div>

        {/* Podsumowanie transakcji */}
        {session && (
          <div className="relative z-10 mt-10 rounded-2xl border border-zinc-800/90 bg-zinc-950/60 p-6 text-left">
            <h2 className="flex items-center gap-2 font-serif text-base font-medium text-white">
              <Package className="h-4 w-4 text-amber-400" />
              <span>Szczegóły płatności</span>
            </h2>

            <div className="mt-4 space-y-2 border-b border-zinc-800/80 pb-4 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Klient:</span>
                <span className="font-medium text-zinc-200">
                  {session.customerDetails?.name ||
                    session.customerDetails?.email ||
                    "Klient AURA"}
                </span>
              </div>
              {session.customerDetails?.email && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Adres e-mail:</span>
                  <span className="font-mono text-zinc-200">
                    {session.customerDetails.email}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500">Status płatności:</span>
                <span className="font-semibold text-emerald-400 uppercase">
                  {session.paymentStatus === "paid" ? "Opłacono" : session.paymentStatus}
                </span>
              </div>
            </div>

            {/* Pozycje zamówienia */}
            {session.lineItems && session.lineItems.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Zakupione pozycje:
                </span>
                {session.lineItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs text-zinc-300"
                  >
                    <span>
                      {item.description} (x{item.quantity})
                    </span>
                    <span className="font-mono font-medium text-zinc-200">
                      {item.amountTotal.toLocaleString("pl-PL")} zł
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-between border-t border-zinc-800/80 pt-4 text-sm font-semibold text-white">
              <span>Łączna kwota:</span>
              <span className="font-serif text-lg text-amber-300">
                {session.amountTotal.toLocaleString("pl-PL")} {session.currency}
              </span>
            </div>
          </div>
        )}

        {/* Kolejne kroki */}
        <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-left">
            <Ruler className="h-5 w-5 text-amber-400" />
            <h3 className="mt-2 text-xs font-semibold text-white">
              {hasSizingKit ? "Zestaw Miarowy w drodze" : "Dobór rozmiaru"}
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
              {hasSizingKit
                ? "Darmowy zestaw 8 próbników wyrusza jutro rano kurierem."
                : "Rozmiar został wybrany w zamówieniu i potwierdzony."}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-left">
            <Truck className="h-5 w-5 text-amber-400" />
            <h3 className="mt-2 text-xs font-semibold text-white">
              Ubezpieczona wysyłka
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
              Otrzymasz link do śledzenia przesyłki DPD / InPost na adres e-mail.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-left">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="mt-2 text-xs font-semibold text-white">
              2 lata gwarancji
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
              Bezpłatny serwis door-to-door oraz wsparcie techniczne 24/7.
            </p>
          </div>
        </div>

        {/* Przyciski akcji */}
        <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_20px_rgba(229,184,105,0.25)] transition hover:bg-amber-300 sm:w-auto"
          >
            <span>Przeglądaj ofertę</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white sm:w-auto"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Strona główna</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="py-24 text-center text-sm text-zinc-400">
            Weryfikacja sesji Stripe...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
