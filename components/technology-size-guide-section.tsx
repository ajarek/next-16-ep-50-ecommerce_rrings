"use client";

import React, { useState } from "react";
import { Info, CheckCircle2 } from "lucide-react";

const SIZE_CIRCLES = [
  { size: 7, circumference: "5.50 cm", diameter: '1.75 cm (0.71")' },
  { size: 8, circumference: "5.75 cm", diameter: '1.83 cm (0.72")' },
  { size: 9, circumference: "6.00 cm", diameter: '1.98 cm (0.75")' },
  { size: 10, circumference: "6.28 cm", diameter: '2.00 cm (0.79")' },
  { size: 11, circumference: "6.54 cm", diameter: '2.08 cm (0.82")' },
  { size: 12, circumference: "6.79 cm", diameter: '2.16 cm (0.85")' },
  { size: 13, circumference: "7.00 cm", diameter: '2.25 cm (0.88")' },
];

const STEPS = [
  {
    title: "Krok 1: Owiń palec",
    text: "Weź nierozciągliwy pasek papieru lub sznurek i owiń go wokół nasady wybranego palca.",
  },
  {
    title: "Krok 2: Dopasuj pasek",
    text: "Dopasuj pasek ściśle do palca, upewniając się, że może swobodnie przejść przez kostkę stawu.",
  },
  {
    title: "Krok 3: Zaznacz łączenie",
    text: "Użyj cienkopisu lub ołówka, aby dokładnie oznaczyć punkt styku obu końców paska papieru.",
  },
  {
    title: "Krok 4: Zmierz linijką",
    text: "Rozłóż pasek płasko na stole i zmierz odcinek linijką w centymetrach. Porównaj z powyższą tabelą.",
  },
];

export function TechnologySizeGuideSection() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<{ size: number; value: number } | null>(
    null,
  );
  const [error, setError] = useState("");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(inputValue.replace(",", "."));

    if (Number.isNaN(parsed) || parsed < 4.5 || parsed > 8.5) {
      setResult(null);
      setError("Wpisz poprawny obwód palca w zakresie od 4,5 do 8,5 cm.");
      return;
    }

    setError("");
    const closest = SIZE_CIRCLES.reduce((prev, curr) => {
      const currDiff = Math.abs(
        parseFloat(curr.circumference.replace(",", ".")) - parsed,
      );
      const prevDiff = Math.abs(
        parseFloat(prev.circumference.replace(",", ".")) - parsed,
      );
      return currDiff < prevDiff ? curr : prev;
    });

    setResult({ size: closest.size, value: parsed });
  };

  return (
    <section id="rozmiary" className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-5xl">
            Przewodnik po Doborze Rozmiaru
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Dla optymalnego kontaktu sensorów optycznych PPG zalecamy noszenie
            pierścienia na palcu wskazującym, środkowym lub serdecznym
            dominującej ręki.
          </p>
        </div>

        {/* Size Circles */}
        <div className="mt-10 flex flex-wrap items-start justify-center gap-4 sm:gap-6">
          {SIZE_CIRCLES.map((item) => (
            <div key={item.size} className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-amber-500/40 bg-zinc-950 shadow-[0_0_20px_rgba(229,184,105,0.08)] transition hover:border-amber-400">
                <span className="font-serif text-lg font-bold text-white">
                  {item.size}#
                </span>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-medium text-zinc-300">
                  Obwód: {item.circumference}
                </div>
                <div className="mt-0.5 font-mono text-[10px] text-zinc-500">
                  Śr: {item.diameter}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to Measure */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <h3 className="font-serif text-xl font-medium text-white sm:text-2xl">
            Jak Zmierzyć Palec w Domu (4 Kroki)
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs text-zinc-300">
            <Info className="h-3.5 w-3.5 text-amber-400" />
            <span>Dokładność do 1 milimetra</span>
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-zinc-950">
                {index + 1}
              </span>
              <h4 className="mt-4 font-serif text-base font-medium text-white">
                {step.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* Calculator */}
        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-[#0d0e14] p-6 shadow-[0_0_40px_rgba(229,184,105,0.06)] sm:p-8">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-xl font-medium text-white sm:text-2xl">
                Kalkulator Obwodu
              </h3>
              <p className="mt-2 text-xs font-medium text-zinc-300">
                Wpisz swój obwód palca
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                Wprowadź wynik w centymetrach (np. 6.0), a natychmiast
                wskażemy rekomendowany rozmiar pierścienia.
              </p>
            </div>

            <form onSubmit={handleCalculate} noValidate>
              <label
                htmlFor="finger-circumference"
                className="block text-[11px] text-zinc-500"
              >
                Obwód palca w cm
              </label>
              <div className="mt-1.5 flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="finger-circumference"
                    type="text"
                    inputMode="decimal"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="np. 5.95"
                    aria-describedby={
                      error ? "circumference-error" : "circumference-hint"
                    }
                    aria-invalid={error ? true : undefined}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pr-12 pl-3.5 text-sm text-zinc-100 transition placeholder:text-zinc-600 focus:border-amber-500/60 focus:outline-none"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-zinc-500">
                    cm
                  </span>
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-zinc-200 cursor-pointer"
                >
                  Oblicz Rozmiar
                </button>
              </div>

              {error && (
                <p
                  id="circumference-error"
                  role="alert"
                  className="mt-2 text-[11px] text-red-400"
                >
                  {error}
                </p>
              )}

              {!error && (
                <p id="circumference-hint" className="sr-only">
                  Zakres od 4,5 do 8,5 cm.
                </p>
              )}

              {result && (
                <div
                  className="mt-3 flex items-center gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3"
                  role="status"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-300" />
                  <div>
                    <div className="text-xs text-zinc-300">
                      Obwód {result.value.toFixed(2).replace(".", ",")} cm →
                      rekomendowany rozmiar:
                    </div>
                    <div className="font-serif text-lg font-bold text-white">
                      Aura Ring {result.size}#
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
