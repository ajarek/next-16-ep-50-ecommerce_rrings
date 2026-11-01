"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Truck,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

export function CartDrawer() {
  const {
    items,
    totalCount,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const [includeSizingKit, setIncludeSizingKit] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative flex h-full w-full max-w-md flex-col justify-between border-l border-zinc-800 bg-[#0d0e14] shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-amber-400" />
            <h3 className="font-serif text-lg font-medium text-white">
              Twój Koszyk
            </h3>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
              {totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Zamknij koszyk"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Alert Ribbon */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-emerald-500/10 px-6 py-2.5 text-xs text-emerald-300">
          <Truck className="h-4 w-4 shrink-0" />
          <span>Kwalifikujesz się do bezpłatnej dostawy kurierem DPD / InPost!</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {checkoutComplete ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h4 className="font-serif text-2xl font-medium text-white">
                Dziękujemy za zamówienie!
              </h4>
              <p className="mt-2 text-xs text-zinc-400 max-w-xs leading-relaxed">
                Potwierdzenie wraz z numerem śledzenia zostało wysłane. Twój Zestaw Miarowy wyruszy w drogę już jutro rano!
              </p>
              <button
                type="button"
                onClick={() => {
                  setCheckoutComplete(false);
                  setIsCartOpen(false);
                }}
                className="mt-6 rounded-xl border border-amber-400 bg-amber-400 px-6 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition"
              >
                Kontynuuj zakupy
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
              <ShoppingBag className="h-12 w-12 stroke-[1.5] mb-3 text-zinc-600" />
              <p className="text-sm">Twój koszyk jest obecnie pusty.</p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-xs text-amber-400 hover:underline font-semibold"
              >
                Przejdź do oferty pierścieni ➔
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5"
              >
                {/* Thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-medium text-white">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-red-400 transition"
                        title="Usuń z koszyka"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400">
                      <span>{item.finishName}</span>
                      <span>•</span>
                      <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-200">
                        Rozmiar: {item.size}
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 text-zinc-400 hover:text-white transition"
                        aria-label="Zmniejsz ilość"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-zinc-200">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 text-zinc-400 hover:text-white transition"
                        aria-label="Zwiększ ilość"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="font-serif text-sm font-bold text-white">
                      {(item.price * item.quantity).toLocaleString("pl-PL")} zł
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {!checkoutComplete && items.length > 0 && (
          <div className="border-t border-zinc-800 bg-[#0a0a0f] p-6 space-y-4">
            {/* Free Sizing Kit Option */}
            <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-300 transition hover:bg-zinc-900/80">
              <input
                type="checkbox"
                checked={includeSizingKit}
                onChange={(e) => setIncludeSizingKit(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
              />
              <div className="flex-1">
                <span className="font-semibold text-white">
                  Dołącz darmowy Zestaw Miarowy (0 zł)
                </span>
                <p className="text-[11px] text-zinc-500">
                  Wyślemy 8 wzorników przed wysyłką właściwego pierścienia.
                </p>
              </div>
            </label>

            {/* Total */}
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Wartość produktów:</span>
                <span className="text-zinc-200 font-mono">
                  {subtotal.toLocaleString("pl-PL")} zł
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dostawa ubezpieczona:</span>
                <span className="text-emerald-400 font-medium">Gratis (0 zł)</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800/80 pt-2 text-sm font-medium text-white">
                <span>Do zapłaty:</span>
                <span className="font-serif text-lg font-bold text-amber-300">
                  {subtotal.toLocaleString("pl-PL")} zł
                </span>
              </div>
            </div>

            {/* Checkout & Continue Shopping Actions */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.3)] hover:bg-amber-300 transition active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {isCheckingOut ? (
                  <span>Przetwarzanie płatności...</span>
                ) : (
                  <span>Przejdź do kasy</span>
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="group inline-flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-400 transition hover:text-amber-300 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Kontynuuj zakupy</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> Bezpieczna transakcja SSL
              </span>
              <span>•</span>
              <span>BLIK • Apple Pay • PayU • Raty 0%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

