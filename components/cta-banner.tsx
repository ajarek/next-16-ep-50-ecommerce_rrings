"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-r from-zinc-950 via-[#111218] to-zinc-950 p-8 sm:p-12 shadow-[0_0_50px_rgba(229,184,105,0.08)]">
          {/* Ambient light glow */}
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl font-normal text-white sm:text-3xl md:text-4xl">
                Zadbaj o swoje zdrowie już dziś.
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                Dołącz do ponad 15 000 osób monitorujących regenerację z Aura Ring
                w Europie. Bez abonamentu i ukrytych opłat.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="#produkty"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.35)] transition-all hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.5)] active:scale-95"
              >
                <span>Wybierz Aura Ring</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
