"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Settings,
  ShieldCheck,
  RotateCcw,
  BatteryCharging,
  Microscope,
  Scale,
  ShoppingCart,
  BarChart3,
  Ruler,
  Truck,
  Check,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { RingProduct } from "@/types";

const FINISHES = [
  {
    id: "black",
    label: "Matowy Czarny",
    sub: "Obsidian DLC",
    finish: "black" as const,
    finishName: "Czarny Mat",
    tag: "Wykończenie: Matowy Czarny (Obsidian)",
    coating: "Powłoka diamentopodobna DLC • Grade 5 Tytan",
    dot: "bg-zinc-950",
    image: "/images/ring-image-3.png",
  },
  {
    id: "gold",
    label: "Złoty Kruszec",
    sub: "18K PVD Champagne",
    finish: "gold" as const,
    finishName: "Złoto Szampańskie",
    tag: "Wykończenie: Złoty Kruszec (Champagne)",
    coating: "Powłoka PVD 18K • Grade 5 Tytan",
    dot: "bg-amber-400",
    image: "/images/ring-image-9.png",
  },
  {
    id: "silver",
    label: "Tytan Srebrny",
    sub: "Satin Pure Titanium",
    finish: "silver" as const,
    finishName: "Srebrny Tytan",
    tag: "Wykończenie: Tytan Srebrny (Satin)",
    coating: "Satin Pure Titanium • Grade 5 Tytan",
    dot: "bg-zinc-300",
    image: "/images/ring-image-4.png",
  },
];

const VERSIONS = [
  {
    id: "sport",
    name: "Active Sport",
    sub: "Odporność na uderzenia DLC",
    extra: 0,
  },
  {
    id: "elegance",
    name: "Elegance Titanium",
    sub: "+200 PLN (Polerowany)",
    extra: 200,
  },
];

const SIZES = [
  { size: 7, label: "5.5cm" },
  { size: 8, label: "5.75cm" },
  { size: 9, label: "6.0cm" },
  { size: 10, label: "6.28cm" },
  { size: 11, label: "6.54cm" },
  { size: 12, label: "6.79cm" },
  { size: 13, label: "7.0cm" },
];

const FEATURES = [
  {
    icon: BatteryCharging,
    title: "Do 7 dni baterii",
    sub: "Ładowanie indukcyjne 45 min",
  },
  {
    icon: Microscope,
    title: "Kliniczna dokładność",
    sub: "Zmienność HRV, SpO2, Temp.",
  },
  {
    icon: Scale,
    title: "Zaledwie 3,2 g",
    sub: "Hipoalergiczna powłoka",
  },
];

const PERKS = [
  {
    icon: Truck,
    text: "Ekspresowa wysyłka kurierska 24h • Darmowa dostawa w całej Polsce",
  },
  {
    icon: RotateCcw,
    text: "30 dni na bezpłatną wymianę rozmiaru bez zadawania pytań",
  },
  {
    icon: ShieldCheck,
    text: "2 lata pełnej gwarancji producenta oraz bezpłatny dostęp do aplikacji AURA iOS/Android",
  },
];

export function TechnologyConfiguratorSection() {
  const { addToCart, openSizeGuide } = useCart();

  const [finishId, setFinishId] = useState<string>("black");
  const [versionId, setVersionId] = useState<string>("sport");
  const [size, setSize] = useState<number>(9);
  const [engraving, setEngraving] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  const selectedFinish = FINISHES.find((f) => f.id === finishId) ?? FINISHES[0];
  const selectedVersion =
    VERSIONS.find((v) => v.id === versionId) ?? VERSIONS[0];
  const price = 1299 + selectedVersion.extra;

  const handleAddToCart = () => {
    const product: RingProduct = {
      id: `aura-ring-pro-${selectedFinish.id}-${selectedVersion.id}`,
      name: `Aura Ring Pro ${selectedVersion.name}`,
      series: "SMART RING TELEMETRY",
      finish: selectedFinish.finish,
      finishName: selectedFinish.finishName,
      description: engraving.trim()
        ? `Grawer laserowy: ${engraving.trim()}`
        : selectedFinish.coating,
      price,
      image: selectedFinish.image,
      availableSizes: SIZES.map((s) => s.size),
    };

    addToCart(product, size);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="relative overflow-hidden border-b border-zinc-800/80 bg-linear-to-b from-zinc-950 via-[#0a0b10] to-[#070709] pt-8 pb-16 sm:pt-12">
      {/* Ambient Lighting */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <Settings className="h-3.5 w-3.5" />
              <span>Konfigurator modelu • Kolekcja 2025</span>
            </span>
            <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl">
              AURA RING GEN III
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Wybierz wykończenie z tytanu medycznego, perfekcyjnie
              dopasowany rozmiar i zyskaj 24/7 telemetryczną analizę
              regeneracji.
            </p>
          </div>

          {/* Hero Badges */}
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs text-zinc-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Certyfikat 5ATM (100M)</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs text-zinc-200">
              <RotateCcw className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Darmowy zwrot i wymiana 30 dni</span>
            </span>
          </div>
        </div>

        {/* Main Configuration Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column: Image & Finish Selection */}
          <div>
            {/* Product Image */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950">
              <Image
                src="/images/ring-image-2.jpg"
                alt="Dłoń z trzema pierścieniami Aura Ring Gen III"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/70 via-transparent to-zinc-950/30" />

              {/* Selected Finish Tags */}
              <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
                <span className="rounded-lg border border-white/10 bg-zinc-950/85 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
                  {selectedFinish.tag}
                </span>
                <span className="rounded-lg border border-white/10 bg-zinc-950/85 px-3 py-1.5 text-[10px] text-zinc-300 backdrop-blur">
                  {selectedFinish.coating}
                </span>
              </div>

              {/* Sensor Indicator */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/85 px-3 py-1.5 text-[10px] text-zinc-300 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span>3x Czujnik PPG • Termometr NTC</span>
              </div>
            </div>

            {/* Finish Options */}
            <div
              className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
              role="group"
              aria-label="Wybór wykończenia"
            >
              {FINISHES.map((finish) => {
                const isSelected = finish.id === selectedFinish.id;
                return (
                  <button
                    key={finish.id}
                    type="button"
                    onClick={() => setFinishId(finish.id)}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition cursor-pointer ${
                      isSelected
                        ? "border border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(229,184,105,0.12)]"
                        : "border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 shrink-0 rounded-full ring-1 ring-inset ring-white/15 ${finish.dot}`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-white">
                        {finish.label}
                      </span>
                      <span className="block truncate text-[10px] text-zinc-500">
                        {finish.sub}
                      </span>
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Key Features */}
            <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <feature.icon className="h-5 w-5 shrink-0 text-amber-400" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white">
                      {feature.title}
                    </div>
                    <div className="mt-0.5 text-[11px] text-zinc-500">
                      {feature.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Configurator Card */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-6">
            {/* Card Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Smart Ring Telemetry
                </div>
                <h2 className="mt-1 font-serif text-2xl font-medium text-white">
                  Aura Ring Pro
                </h2>
              </div>
              <div className="text-right">
                <div className="font-serif text-3xl font-bold text-white">
                  {price.toLocaleString("pl-PL")} PLN
                </div>
                <div className="text-[11px] text-zinc-500">
                  zawiera 23% VAT
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-zinc-800/80 pt-5">
              {/* Step 1: Technical Version */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                1. Wybierz wersję techniczną
              </h3>
              <div
                className="mt-3 grid grid-cols-2 gap-3"
                role="group"
                aria-label="Wersja techniczna"
              >
                {VERSIONS.map((version) => {
                  const isSelected = version.id === selectedVersion.id;
                  return (
                    <button
                      key={version.id}
                      type="button"
                      onClick={() => setVersionId(version.id)}
                      aria-pressed={isSelected}
                      className={`rounded-xl px-4 py-3 text-left transition cursor-pointer ${
                        isSelected
                          ? "border border-amber-400 bg-amber-500/10"
                          : "border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white">
                          {version.name}
                        </span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                        )}
                      </span>
                      <span className="mt-1 block text-[11px] text-zinc-400">
                        {version.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Step 2: Ring Size */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  2. Rozmiar pierścienia (US/PL)
                </h3>
                <button
                  type="button"
                  onClick={() => openSizeGuide()}
                  className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 transition hover:text-amber-300 hover:underline cursor-pointer"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Tabela i jak mierzyć palec</span>
                </button>
              </div>

              <div
                className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-7"
                role="group"
                aria-label="Rozmiar pierścienia"
              >
                {SIZES.map((item) => {
                  const isSelected = item.size === size;
                  return (
                    <button
                      key={item.size}
                      type="button"
                      onClick={() => setSize(item.size)}
                      aria-pressed={isSelected}
                      aria-label={`Rozmiar ${item.size}, obwód ${item.label}`}
                      className={`flex flex-col items-center rounded-lg py-2 transition cursor-pointer ${
                        isSelected
                          ? "bg-amber-400 text-zinc-950 shadow-[0_0_12px_rgba(229,184,105,0.4)]"
                          : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <span className="text-xs font-bold">{item.size}#</span>
                      <span
                        className={`text-[10px] ${
                          isSelected ? "text-zinc-800" : "text-zinc-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => openSizeGuide()}
                className="mt-3 flex w-full items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-xs transition hover:border-amber-500/40 hover:bg-amber-500/5 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-zinc-300">
                  <Ruler className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Nie masz pewności co do rozmiaru?</span>
                </span>
                <span className="font-semibold text-amber-400">
                  Wyślij darmowy Sizing Kit
                </span>
              </button>

              {/* Step 3: Engraving */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  3. Personalizowany grawer laserowy (opcjonalnie)
                </h3>
                <span className="rounded border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-300">
                  GRATIS
                </span>
              </div>

              <div className="relative mt-3">
                <input
                  type="text"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value.slice(0, 16))}
                  maxLength={16}
                  placeholder="np. AURA • 2025 lub imię"
                  aria-label="Tekst graweru laserowego"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pr-14 pl-3.5 text-xs text-zinc-100 transition placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[11px] text-zinc-500">
                  {engraving.length}/16
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-zinc-500">
                Precyzyjny mikrograwer na wewnętrznej ściance tytanowego
                pierścienia.
              </p>

              {/* Perks */}
              <ul className="mt-5 space-y-2.5 border-t border-zinc-800/80 pt-5">
                {PERKS.map((perk) => (
                  <li key={perk.text} className="flex items-start gap-2.5">
                    <perk.icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span className="text-[11px] leading-relaxed text-zinc-400">
                      {perk.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isAdded
                    ? "bg-emerald-500 text-zinc-950"
                    : "bg-amber-400 text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.25)] hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.4)] active:scale-[0.98]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Dodano do koszyka!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      Dodaj do koszyka • {price.toLocaleString("pl-PL")} PLN
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
