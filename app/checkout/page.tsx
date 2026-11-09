"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Info,
  Sparkles,
  Loader2,
} from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { useAuth } from "@/context/auth-context";

export default function CheckoutTestPage() {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [selectedSize, setSelectedSize] = useState<number>(10);
  const [includeSizingKit, setIncludeSizingKit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartStripeCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId: selectedProduct.id,
              name: selectedProduct.name,
              finishName: selectedProduct.finishName,
              size: selectedSize,
              price: selectedProduct.price,
              quantity: 1,
              image: selectedProduct.image,
            },
          ],
          includeSizingKit,
          userEmail: user?.email || undefined,
          userId: user?.uid || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Nie udało się utworzyć sesji Stripe.");
      }

      // Bezpośrednie przekierowanie do oficjalnego formularza Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Błąd płatności:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Wystąpił nieoczekiwany problem przy łączeniu ze Stripe.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 selection:text-amber-200">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Panel Testowy Stripe Checkout (Test Mode)</span>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-white sm:text-5xl">
            Bezpieczna Kasa AURA RING
          </h1>
          <p className="mt-3 text-sm text-zinc-400 max-w-lg mx-auto">
            Przetestuj proces zakupowy i płatności Stripe. Wszystkie operacje
            wykonywane są w bezpiecznym środowisku sandbox.
          </p>
        </div>

        {/* Card info alert */}
        <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 text-xs text-amber-200/90 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">
              Instrukcja testowania w trybie Stripe Sandbox:
            </p>
            <p className="text-zinc-400">
              Użyj testowej karty Stripe:{" "}
              <code className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 font-mono text-amber-300">
                4242 4242 4242 4242
              </code>
              , dowolnej daty ważności w przyszłości (np. 12/28) oraz dowolnego 3-cyfrowego kodu CVC (np. 123). Możesz też przetestować BLIK testowy (kod 777123).
            </p>
          </div>
        </div>

        {/* Konfigurator produktu do testu */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Wybór produktu */}
          <div className="rounded-3xl border border-zinc-800 bg-[#0d0e14] p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-lg font-medium text-white">
              1. Wybierz model do testu
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {PRODUCTS.slice(0, 4).map((product) => {
                const isSelected = selectedProduct.id === product.id;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className={`flex flex-col items-center rounded-2xl border p-3 text-center transition cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/10 text-white shadow-[0_0_15px_rgba(229,184,105,0.15)]"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <span className="mt-2 text-xs font-medium line-clamp-1">
                      {product.finishName}
                    </span>
                    <span className="text-[11px] font-mono text-amber-300">
                      {product.price.toLocaleString("pl-PL")} zł
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Rozmiar */}
            <div>
              <label className="text-xs font-semibold text-zinc-300">
                Wybierz rozmiar:
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[7, 8, 9, 10, 11, 12, 13].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-9 w-9 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedSize === size
                        ? "border border-amber-400 bg-amber-400 text-zinc-950 font-bold"
                        : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Opcja Sizing Kit */}
            <label className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3.5 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSizingKit}
                onChange={(e) => setIncludeSizingKit(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-400"
              />
              <div>
                <span className="font-semibold text-white">
                  Dołącz darmowy Zestaw Miarowy (0 zł)
                </span>
                <p className="text-[11px] text-zinc-500">
                  Przesyłka 8 wzorników przed wysyłką pierścienia.
                </p>
              </div>
            </label>
          </div>

          {/* Podsumowanie i Przycisk Stripe */}
          <div className="rounded-3xl border border-zinc-800 bg-[#0d0e14] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <h2 className="font-serif text-lg font-medium text-white">
                2. Podsumowanie zamówienia
              </h2>

              <div className="mt-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-zinc-800">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-semibold text-white">
                      {selectedProduct.name}
                    </p>
                    <p className="text-zinc-400">
                      Wykończenie: {selectedProduct.finishName} • Rozmiar: {selectedSize}
                    </p>
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Wartość:</span>
                    <span className="text-zinc-200 font-mono">
                      {selectedProduct.price.toLocaleString("pl-PL")} zł
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wysyłka ubezpieczona DPD:</span>
                    <span className="text-emerald-400 font-medium">Gratis (0 zł)</span>
                  </div>
                  {includeSizingKit && (
                    <div className="flex justify-between text-amber-300">
                      <span>Zestaw Miarowy:</span>
                      <span>Gratis (0 zł)</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-zinc-800/80 pt-2 text-sm font-semibold text-white">
                    <span>Łącznie do zapłaty:</span>
                    <span className="font-serif text-lg text-amber-300">
                      {selectedProduct.price.toLocaleString("pl-PL")} zł
                    </span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleStartStripeCheckout}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-amber-400 bg-amber-400 py-4 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.3)] transition hover:bg-amber-300 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Inicjalizacja Stripe Checkout...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Zapłać przez Stripe (Test)</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Szyfrowanie SSL 256-bit
                </span>
                <span>•</span>
                <span>Karty • BLIK • Apple Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="text-xs text-zinc-400 hover:text-amber-300 transition underline underline-offset-4"
          >
            ← Wróć do pełnego katalogu pierścieni
          </Link>
        </div>
      </div>
    </div>
  );
}
