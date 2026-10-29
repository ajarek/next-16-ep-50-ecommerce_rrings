"use client";

import React, { useEffect, useState } from "react";
import { X, Ruler, Mail } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { SIZE_CHART } from "@/lib/data";

export function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen, selectedProductForSizing } =
    useCart();
  const [sliderMm, setSliderMm] = useState(19.7);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSizeGuideOpen(false);
    };
    if (isSizeGuideOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isSizeGuideOpen, setIsSizeGuideOpen]);

  if (!isSizeGuideOpen) return null;

  const matchedSize = SIZE_CHART.reduce((prev, curr) => {
    return Math.abs(curr.diameterMm - sliderMm) <
      Math.abs(prev.diameterMm - sliderMm)
      ? curr
      : prev;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsSizeGuideOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-white">
                Przewodnik Doboru Rozmiaru
              </h3>
              <p className="text-xs text-zinc-400">
                {selectedProductForSizing
                  ? `Dla modelu: ${selectedProductForSizing.name}`
                  : "Aura Ring Gen 3"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-6">
          {/* Quick Explanation */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-zinc-300 leading-relaxed">
            <span className="font-semibold text-amber-300 block mb-1">
              Wskazówka jubilerska:
            </span>
            Aura Ring najlepiej nosić na palcu wskazującym, środkowym lub serdecznym dominującej ręki. Palec wskazujący zapewnia najbardziej stabilny odczyt pulsu i snu.
          </div>

          {/* Interactive Caliper Tool */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-400">Średnica wewnętrzna pierścionka:</span>
              <span className="font-mono text-sm font-bold text-amber-300">
                {sliderMm.toFixed(1)} mm
              </span>
            </div>

            <input
              type="range"
              min="16.5"
              max="23.0"
              step="0.1"
              value={sliderMm}
              onChange={(e) => setSliderMm(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />

            <div className="mt-4 flex items-center justify-between rounded-lg bg-zinc-900/90 p-3 text-xs border border-zinc-800">
              <div>
                <span className="text-zinc-400">Rekomendowany rozmiar Aura Ring:</span>
                <div className="font-serif text-lg font-bold text-white">
                  Rozmiar {matchedSize.size}
                </div>
              </div>
              <div className="text-right text-[11px] text-zinc-400">
                <div>Średnica: <strong className="text-zinc-200">{matchedSize.diameterMm} mm</strong></div>
                <div>Obwód palca: <strong className="text-zinc-200">{matchedSize.circumferenceMm} mm</strong></div>
              </div>
            </div>
          </div>

          {/* Full Table */}
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Rozmiar Aura</th>
                  <th className="px-4 py-2.5 font-medium">Średnica wewnętrzna</th>
                  <th className="px-4 py-2.5 font-medium">Obwód palca</th>
                  <th className="px-4 py-2.5 text-right font-medium">Dopasowanie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/40">
                {SIZE_CHART.map((item) => {
                  const isCurrent = matchedSize.size === item.size;
                  return (
                    <tr
                      key={item.size}
                      onClick={() => setSliderMm(item.diameterMm)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent
                          ? "bg-amber-500/15 text-amber-200 font-semibold"
                          : "text-zinc-300 hover:bg-zinc-900/50"
                      }`}
                    >
                      <td className="px-4 py-2.5 flex items-center gap-2">
                        {isCurrent ? (
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                        ) : (
                          <span className="h-2 w-2" />
                        )}
                        Rozmiar {item.size}
                      </td>
                      <td className="px-4 py-2.5 font-mono">{item.diameterMm} mm</td>
                      <td className="px-4 py-2.5 font-mono text-zinc-400">
                        {item.circumferenceMm} mm
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {isCurrent ? (
                          <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            Wybrany
                          </span>
                        ) : (
                          <span className="text-zinc-600 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Sizing Kit Free Assurance */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Nie masz pewności? Wyślemy darmowy Zestaw Miarowy
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Przymierz 8 wzorników w domu przed podjęciem ostatecznej decyzji.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="rounded-xl border border-amber-400 bg-amber-400 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition shrink-0"
            >
              Rozumiem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
