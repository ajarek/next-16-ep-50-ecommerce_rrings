"use client";

import React from "react";
import { Star, Shield, RotateCcw, Truck, Lock } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

export function ReviewsSection() {
  return (
    <section id="opinie" className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            ZAUFANIE I OPINIE
          </span>
          <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-5xl">
            Co mówią użytkownicy w Polsce?
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Średnia ocena 4.9/5 gwiazdek na podstawie ponad 1 200 zweryfikowanych
            zakupów.
          </p>
        </div>

        {/* Testimonials 3 Columns Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 transition hover:border-amber-500/40"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Title */}
                <h3 className="mt-4 font-serif text-lg font-medium text-white">
                  {testimonial.title}
                </h3>

                {/* Quote */}
                <p className="mt-2.5 text-xs leading-relaxed text-zinc-400 italic">
                  „{testimonial.quote}”
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 flex items-center gap-3 border-t border-zinc-800/80 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-xs font-semibold text-amber-300">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-200">
                    {testimonial.author}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {testimonial.location} • {testimonial.model}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Trust Badges Ribbon */}
        <div className="mt-12 rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Trust 1 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-200">
                  2 lata gwarancji
                </div>
                <div className="text-[11px] text-zinc-400">
                  Pełna ochrona door-to-door w Polsce
                </div>
              </div>
            </div>

            {/* Trust 2 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-200">
                  30 dni na zwrot
                </div>
                <div className="text-[11px] text-zinc-400">
                  Bezpłatna wymiana rozmiaru
                </div>
              </div>
            </div>

            {/* Trust 3 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-200">
                  Darmowa dostawa
                </div>
                <div className="text-[11px] text-zinc-400">
                  Kurier DPD / InPost Paczkomat
                </div>
              </div>
            </div>

            {/* Trust 4 */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-200">
                  Bezpieczne płatności
                </div>
                <div className="text-[11px] text-zinc-400">
                  BLIK, PayPo, karty płatnicze
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

