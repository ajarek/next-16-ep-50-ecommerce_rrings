"use client";

import React from "react";
import { Package } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function TechnologySizingKitBanner() {
  const { openSizeGuide } = useCart();

  return (
    <section className="relative pb-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-r from-zinc-950 via-[#111218] to-zinc-950 p-6 shadow-[0_0_50px_rgba(229,184,105,0.08)] sm:p-8">
          {/* Ambient light glow */}
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
                <Package className="h-6 w-6" />
              </div>
              <div className="max-w-2xl">
                <h2 className="font-serif text-xl font-medium text-white sm:text-2xl">
                  Zamów darmowy zestaw pomiarowy AURA Sizing Kit
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  Otrzymaj pudełko z 7 próbnymi pierścieniami z tworzywa
                  sztucznego. Noś pierścień próbny przez 24 godziny, aby
                  sprawdzić komfort w trakcie snu i treningu, a potem zatwierdź
                  docelowy model.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openSizeGuide()}
              className="shrink-0 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-xs font-bold tracking-wider text-zinc-950 uppercase shadow-[0_0_25px_rgba(229,184,105,0.35)] transition-all hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.5)] active:scale-95 cursor-pointer"
            >
              Zamów bezpłatny Sizing Kit (0 PLN)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
