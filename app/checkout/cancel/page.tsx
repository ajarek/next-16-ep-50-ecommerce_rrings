"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex items-center justify-center px-4 py-16">
      <div className="relative max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-[#0d0e14]/90 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Poświata w tle */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[90px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <XCircle className="h-8 w-8 stroke-[1.75]" />
          </div>

          <h1 className="mt-5 font-serif text-2xl font-normal text-white sm:text-3xl">
            Płatność została anulowana
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-zinc-400">
            Żadne środki nie zostały pobrane z Twojej karty ani konta. Twoje
            wybrane pierścienie nadal czekają w koszyku.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3">
            <Link
              href="/products"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 transition hover:bg-amber-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Wróć do sklepu</span>
            </Link>

            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 py-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Strona główna</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

