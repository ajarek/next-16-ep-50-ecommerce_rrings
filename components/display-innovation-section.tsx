"use client";

import React from "react";
import Image from "next/image";
import {
  Moon,
  Activity,
  Thermometer,
  Zap,
  Droplets,
} from "lucide-react";

export function DisplayInnovationSection() {

  return (
    <section id="technologia" className="relative py-16 lg:py-24">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[160px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
            INNOWACJA WYŚWIETLACZA
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-5xl">
            Wielofunkcyjny ekran wyświetlacza
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Pierwszy inteligentny pierścień z subtelnie zintegrowanym ekranem
            OLED. Nie musisz już sięgać po smartfon, by sprawdzić aktualny
            czas, liczbę kroków, tętno czy stan naładowania baterii.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Bento Card 1: Large Left Column (7 cols) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 transition-all hover:border-amber-500/40 lg:col-span-7 sm:p-8">
            {/* Top Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase">
                MIKRO-MATRYCA LED
              </span>
              <span className="rounded-full border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-0.5 text-[10px] font-medium text-zinc-300">
                Ultra-niski pobór mocy
              </span>
            </div>

            {/* Subtitle */}
            <h3 className="mt-3 font-serif text-2xl font-normal text-white sm:text-3xl">
              Podgląd bez odblokowywania telefonu
            </h3>

            {/* Product Image */}
            <div className="relative my-6 aspect-16/10 w-full overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950">
              <Image
                src="/images/ring-image-4.png"
                alt="Inteligentny pierścień z wyświetlaczem OLED pokazującym liczbę kroków"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-transparent to-transparent" />
            </div>

            {/* Bottom Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-4 text-center sm:text-left">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Licznik kroków
                </div>
                <div className="mt-1 font-serif text-lg font-semibold text-white sm:text-xl">
                  23 858
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Tętno PPG
                </div>
                <div className="mt-1 font-serif text-lg font-semibold text-red-400 sm:text-xl">
                  98 BPM
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Wskaźnik energii
                </div>
                <div className="mt-1 font-serif text-lg font-semibold text-emerald-400 sm:text-xl">
                  100%
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Bento Card 2: Bio-Sensory Architecture (Top Right) */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 transition-all hover:border-amber-500/40">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950">
                <Image
                  src="/images/ring-image-3.png"
                  alt="Architektura Bio-Sensoryczna pierścienia Aura Ring na kamieniu bazaltowym"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="mt-5">
                <h3 className="font-serif text-xl font-normal text-white">
                  Architektura Bio-Sensoryczna
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  Złocone elektrody pomiarowe oraz czujniki optyczne wewnątrz
                  pierścienia mierzą tętno spoczynkowe, HRV i temperaturę ciała
                  bezpośrednio z naczyń krwionośnych palca.
                </p>
              </div>
            </div>

            {/* Bottom row of 2 mini bento cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Card 3: Qi Wireless Charging */}
              <div className="group rounded-2xl border border-zinc-800 bg-[#0d0e14] p-5 transition-all hover:border-amber-500/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
                  <Zap className="h-5 w-5" />
                </div>
                <h4 className="mt-3 font-serif text-base font-medium text-white">
                  Ładowanie Qi
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                  Elegancka bezprzewodowa stacja ładująca z portem USB-C w
                  komplecie.
                </p>
              </div>

              {/* Card 4: 5ATM Class */}
              <div className="group rounded-2xl border border-zinc-800 bg-[#0d0e14] p-5 transition-all hover:border-amber-500/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  <Droplets className="h-5 w-5" />
                </div>
                <h4 className="mt-3 font-serif text-base font-medium text-white">
                  Klasa 5ATM
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                  Pełna odporność na wodę do 50 metrów. Pływaj, bierz prysznic i
                  trenuj.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Pills Row */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <div className="flex items-start gap-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300">
              <Moon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                Monitorowanie Snu
              </div>
              <div className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                Szczegółowa analiza faz głębokiego snu, REM i wskaźnik regeneracji.
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                Tętno i HRV 24/7
              </div>
              <div className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                Ciągły monitoring zmienności rytmu zatokowego dla wczesnego wykrywania przemęczenia.
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              <Thermometer className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                Sensor Temperatury
              </div>
              <div className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                Wykrywa mikrozmiany temperatury ciała, sygnalizując pierwsze objawy infekcji.
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start gap-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/80">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200">
                Ekspresowe Ładowanie
              </div>
              <div className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                Do 100% baterii w jedyne 45 minut. Nawet 7 dni nieprzerwanej pracy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
