import React from "react";
import Link from "next/link";
import { ShieldCheck, Activity, User } from "lucide-react";

const HERO_PILLS = [
  {
    href: "#rezerwacja",
    icon: ShieldCheck,
    label: "Zarezerwuj przymiarkę 6-13",
    primary: true,
  },
  {
    href: "#doswiadczenie",
    icon: Activity,
    label: "Diagnostyka PPG na miejscu",
    primary: false,
  },
  {
    href: "#vip",
    icon: User,
    label: "Dedykowany konsjerż",
    primary: false,
  },
];

export function LocationHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800/80 bg-linear-to-b from-zinc-950 via-[#0a0b10] to-[#070709] pt-10 pb-14 sm:pt-14 sm:pb-20">
      {/* Ambient Lighting */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-72 w-72 rounded-full bg-cyan-500/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          Salony firmowe • Punkty przymiarek
        </span>

        {/* Main Headline */}
        <h1 className="mx-auto mt-5 max-w-4xl font-serif text-4xl font-normal leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Odwiedź nasze flagowe salony{" "}
          <span className="bg-linear-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Aura Ring
          </span>{" "}
          w Polsce i dopasuj swój idealny rozmiar na żywo
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Doświadcz dotyku chirurgicznego tytanu, przetestuj pełną paletę
          luksusowych wykończeń i skonsultuj parametry regeneracji z
          certyfikowanym doradcą biometrycznym.
        </p>

        {/* Action Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {HERO_PILLS.map((pill) => (
            <Link
              key={pill.label}
              href={pill.href}
              className={
                pill.primary
                  ? "inline-flex items-center gap-2 rounded-full border border-amber-400 bg-amber-400 px-5 py-2.5 text-xs font-bold tracking-wide text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.3)] transition-all hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.45)] active:scale-95"
                  : "inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-5 py-2.5 text-xs font-medium text-zinc-200 transition hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-200"
              }
            >
              <pill.icon
                className={`h-4 w-4 shrink-0 ${
                  pill.primary ? "text-zinc-950" : "text-amber-400"
                }`}
              />
              <span>{pill.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
