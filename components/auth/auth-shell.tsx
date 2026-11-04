import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Fingerprint,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

const BENEFITS = [
  {
    icon: Fingerprint,
    title: "Biometria pod kontrolą",
    description: "Historia snu, tętna i regeneracji w jednym miejscu.",
  },
  {
    icon: Sparkles,
    title: "Spersonalizowane wykończenia",
    description: "Zapisane rozmiary i preferencje kolejnych zamówień.",
  },
  {
    icon: Store,
    title: "Priorytet w salonach",
    description: "Rezerwacje przymiarów i odbiór bez czekania.",
  },
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <div className="relative flex-1 overflow-hidden border-b border-zinc-800/60 bg-[#070709]">
      {/* Ambient gold lighting */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-amber-400/5 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-16">
        {/* Brand panel */}
        <section className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(229,184,105,0.8)]" />
            AURA IDENTITY • GEN 3
          </span>

          <h2 className="mt-6 max-w-xl font-serif text-4xl font-normal leading-[1.12] tracking-tight text-white xl:text-5xl">
            Jedno konto.
            <span className="block bg-linear-to-r from-amber-200 via-amber-100 to-amber-400 bg-clip-text text-transparent">
              Cały ekosystem biometrii.
            </span>
          </h2>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            Zarządzaj pierścieniem, historią pomiarów i rezerwacjami w salonach
            AURA. Twoje dane pozostają zaszyfrowane i widoczne wyłącznie dla
            Ciebie.
          </p>

          <div className="relative mt-8 h-64 w-full max-w-md xl:h-72">
            <div
              className="absolute inset-8 rounded-full bg-amber-500/12 blur-3xl"
              aria-hidden="true"
            />
            <Image
              src="/images/ring-image-9.png"
              alt="Pierścień Aura Ring Gen 3 w wykończeniu Champagne Gold"
              fill
              priority
              sizes="(max-width: 1024px) 0px, 40vw"
              className="object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]"
            />
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400 backdrop-blur">
              Champagne Gold • Tytan klasy medycznej
            </span>
          </div>

          <ul className="mt-8 grid gap-3">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit.title}
                className="flex items-start gap-3 rounded-xl border border-zinc-800/70 bg-[#0c0d12]/70 px-4 py-3"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-300">
                  <benefit.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-zinc-100">
                    {benefit.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                    {benefit.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/80" aria-hidden="true" />
            Szyfrowanie end-to-end • Serwery w UE
          </div>
        </section>

        {/* Form panel */}
        <section className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="group mb-5 inline-flex items-center gap-2 text-[11px] font-medium text-zinc-400 transition hover:text-amber-300"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            Powrót do sklepu
          </Link>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0c0d12]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-8">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/50 to-transparent"
              aria-hidden="true"
            />

            {/* Compact mobile branding */}
            <div className="mb-6 flex items-center gap-2.5 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-linear-to-br from-zinc-800 to-zinc-950">
                <span className="font-serif text-sm font-bold text-amber-300">A</span>
              </div>
              <span className="font-serif text-base font-semibold tracking-[0.2em] text-white">
                AURA RING
              </span>
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-400">
              {eyebrow}
            </span>
            <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              {description}
            </p>

            <div className="mt-6">{children}</div>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-zinc-600">
            <ShieldCheck className="h-3 w-3 text-emerald-400/70" aria-hidden="true" />
            Bezpieczne uwierzytelnianie Firebase • Twoje hasło nigdy nie trafia do naszych serwerów
          </p>
        </section>
      </div>
    </div>
  );
}
