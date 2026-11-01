import React from "react";
import { Cpu } from "lucide-react";

interface SpecRow {
  param: string;
  sport: string;
  elegance?: string;
}

const SPEC_ROWS: SpecRow[] = [
  {
    param: "Materiał zewnętrzny",
    sport: "Tytan Aerospace Grade 5 z matową powłoką węglową DLC",
    elegance:
      "Tytan Grade 5 z polerowanym wykończeniem PVD Champagne / Mirror",
  },
  {
    param: "Wnętrze i powłoka biokompatybilna",
    sport: "Hipoalergiczna żywica medyczna klasy USP VI (brak niklu, pełna biokompatybilność)",
  },
  {
    param: "Waga pierścienia",
    sport: "3,1 g – 3,5 g (w zależności od rozmiaru)",
    elegance: "3,2 g – 3,6 g (w zależności od rozmiaru)",
  },
  {
    param: "Sensory biometryczne",
    sport: "Zielone i podczerwone diody LED PPG (tętno 24/7, HRV, SpO2), czujnik temperatury NTC, 3-osiowy akcelerometr",
  },
  {
    param: "Wodoszczelność",
    sport: "Standard 5ATM / do 100 metrów głębokości (pływanie, prysznic, sauna)",
  },
  {
    param: "Czas pracy na baterii",
    sport: "Do 7 dni nieprzerwanej pracy • Pełne ładowanie w 45-60 minut na stacji USB-C",
  },
  {
    param: "Łączność i kompatybilność",
    sport: "Bluetooth Low Energy 5.3 • Apple Health • Google Fit • Aplikacja iOS 15+ / Android 10+",
  },
];

export function TechnologySpecsSection() {
  return (
    <section id="specyfikacja" className="relative border-t border-zinc-800/80 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <Cpu className="h-3.5 w-3.5" />
            <span>Precyzja inżynierii</span>
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-5xl">
            Specyfikacja Techniczna i Sensoryczna
          </h2>
        </div>

        {/* Specification Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800/90">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/90 text-[10px] uppercase tracking-wider text-zinc-400">
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Parametr
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Active Sport
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Elegance Titanium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 bg-[#0d0e14]">
                {SPEC_ROWS.map((row) => (
                  <tr key={row.param} className="transition hover:bg-zinc-900/40">
                    <th
                      scope="row"
                      className="px-5 py-4 align-top text-xs font-semibold text-zinc-200"
                    >
                      {row.param}
                    </th>
                    <td
                      className="px-5 py-4 align-top text-xs leading-relaxed text-zinc-400"
                      colSpan={row.elegance ? undefined : 2}
                    >
                      {row.sport}
                    </td>
                    {row.elegance && (
                      <td className="px-5 py-4 align-top text-xs leading-relaxed text-zinc-400">
                        {row.elegance}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
