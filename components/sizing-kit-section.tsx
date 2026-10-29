"use client";

import React, { useState } from "react";
import { Mail, Download, Ruler } from "lucide-react";
import { SIZE_CHART } from "@/lib/data";
import { useCart } from "@/context/cart-context";

export function SizingKitSection() {
  const { openSizeGuide } = useCart();
  const [interactiveMm, setInteractiveMm] = useState(19.7);

  // Find closest size based on mm
  const closestSize = SIZE_CHART.reduce((prev, curr) => {
    return Math.abs(curr.diameterMm - interactiveMm) <
      Math.abs(prev.diameterMm - interactiveMm)
      ? curr
      : prev;
  });

  return (
    <section id="rozmiary" className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Card: Free Sizing Kit (7 cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 lg:col-span-7 sm:p-8">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
                <Mail className="h-3.5 w-3.5 text-amber-400" />
                <span>Bezstresowe dopasowanie</span>
              </div>

              {/* Title */}
              <h2 className="mt-4 font-serif text-3xl font-normal leading-tight text-white sm:text-4xl">
                Nie znasz swojego rozmiaru? Wyślemy darmowy Zestaw Miarowy.
              </h2>

              {/* Description */}
              <p className="mt-4 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                Wybierz opcję „Zestaw Miarowy” przy składaniu zamówienia. Wyślemy
                komplet 8 pierścieni testowych (rozmiary 7–13), abyś mógł
                przetestować komfort noszenia przez 24 godziny. Po potwierdzeniu
                rozmiaru w aplikacji natychmiast wysyłamy Twój tytanowy
                pierścień.
              </p>

              {/* 3 Steps */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4">
                  <div className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                    KROK 1
                  </div>
                  <p className="mt-1 text-xs text-zinc-300">
                    Zamów pierścień z darmowym zestawem miarowym.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4">
                  <div className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                    KROK 2
                  </div>
                  <p className="mt-1 text-xs text-zinc-300">
                    Noś plastikowy wzorzec przez dobę i sprawdź dopasowanie.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4">
                  <div className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                    KROK 3
                  </div>
                  <p className="mt-1 text-xs text-zinc-300">
                    Zatwierdź rozmiar online i ciesz się swoim Aura Ring.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-8 pt-4 border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-zinc-400">
                100% bezpłatna wysyłka wzorników w 24 godziny.
              </span>
              <button
                type="button"
                onClick={() => openSizeGuide()}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
              >
                <Ruler className="h-3.5 w-3.5" />
                <span>Otwórz wirtualną przymierzalnię</span>
              </button>
            </div>
          </div>

          {/* Right Card: Size Chart & Interactive Guide (5 cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 lg:col-span-5 sm:p-8">
            <div>
              {/* Header */}
              <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                ALTERNATYWNIE: POMIAR W DOMU
              </div>
              <h3 className="mt-1 font-serif text-xl font-normal text-white">
                Tabela Średnicy Wewnętrznej
              </h3>

              {/* Interactive mm Slider */}
              <div className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-950 p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Średnica palca:</span>
                  <span className="font-mono text-sm font-bold text-amber-300">
                    {interactiveMm.toFixed(1)} mm → Rozmiar {closestSize.size}
                  </span>
                </div>
                <input
                  type="range"
                  min="16.5"
                  max="23.0"
                  step="0.1"
                  value={interactiveMm}
                  onChange={(e) => setInteractiveMm(parseFloat(e.target.value))}
                  className="mt-2 w-full accent-amber-400 cursor-pointer"
                  aria-label="Symulator średnicy palca w milimetrach"
                />
              </div>

              {/* Table */}
              <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                      <th className="px-3.5 py-2 font-medium">Rozmiar</th>
                      <th className="px-3.5 py-2 text-right font-medium">
                        Średnica
                      </th>
                      <th className="px-3.5 py-2 text-right font-medium">
                        Obwód
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {SIZE_CHART.map((item) => {
                      const isMatched = closestSize.size === item.size;
                      return (
                        <tr
                          key={item.size}
                          onClick={() => setInteractiveMm(item.diameterMm)}
                          className={`cursor-pointer transition-colors ${
                            isMatched
                              ? "bg-amber-500/15 text-amber-200 font-semibold"
                              : "text-zinc-300 hover:bg-zinc-900/40"
                          }`}
                        >
                          <td className="px-3.5 py-2 flex items-center gap-1.5">
                            {isMatched && (
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            )}
                            <span>Rozmiar {item.size}</span>
                          </td>
                          <td className="px-3.5 py-2 text-right font-mono">
                            {item.diameterMm} mm
                          </td>
                          <td className="px-3.5 py-2 text-right font-mono text-zinc-500">
                            {item.circumferenceMm} mm
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Printable PDF Button */}
            <div className="mt-6 pt-4 border-t border-zinc-800/70">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 py-2.5 px-4 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition"
              >
                <Download className="h-3.5 w-3.5 text-amber-400" />
                <span>Pobierz miarkę w formacie PDF (do druku)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
