import React from "react";
import { Crown, Phone } from "lucide-react";

export function LocationVipBanner() {
  return (
    <section id="vip" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-r from-zinc-950 via-[#111218] to-zinc-950 p-6 shadow-[0_0_50px_rgba(229,184,105,0.08)] sm:p-8">
          {/* Ambient light glow */}
          <div
            className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
                <Crown className="h-6 w-6" />
              </span>
              <div className="max-w-2xl">
                <h2 className="font-serif text-xl font-medium text-white sm:text-2xl">
                  Potrzebujesz wizyty domowej lub prywatnego pokazu VIP?
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  Nasz zespół konsjerży biometrycznych obsługuje również
                  wizyty prywatne na terenie całego kraju.
                </p>
              </div>
            </div>

            <a
              href="tel:+48220001122"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-sm font-bold text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.35)] transition-all hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.5)] active:scale-95"
            >
              <Phone className="h-4 w-4" />
              <span className="font-mono tracking-wide">+48 22 000 11 22</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
