import React from "react";
import Image from "next/image";
import { Hand, Droplets, Activity } from "lucide-react";

const STEPS = [
  {
    icon: Hand,
    title: "Dobór palca nośnego",
    description:
      "Rekomendujemy palec wskazujący lub środkowy dla najwyższej precyzji odczytów PPG i tętniczych naczyń krwionośnych.",
  },
  {
    icon: Droplets,
    title: "Test szczelności termicznej",
    description:
      "Sprawdzamy rotację obrączki przy naturalnych zmianach objętości palca w ciągu doby.",
  },
  {
    icon: Activity,
    title: "Synchroniczny podgląd telemetrii",
    description:
      "Konsultant połączy model demonstracyjny z aplikacją iPad, prezentując zmienność rytmu serca (HRV) w czasie rzeczywistym.",
  },
];

const METRICS = [
  {
    value: "7-10 dni",
    label: "Pracy na 1 ładowaniu",
    description:
      "Superkondensatorowa bateria ładowana bezprzewodowo w 40 min.",
  },
  {
    value: "0%",
    label: "Kompromisów estetycznych",
    description:
      "Wygląd luksusowej biżuterii, czujniki klasy klinicznej.",
  },
];

export function LocationExperienceSection() {
  return (
    <section
      id="doswiadczenie"
      className="relative border-b border-zinc-800/80 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          Doświadczenie butikowe
        </span>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl font-normal leading-tight tracking-tight text-white sm:text-4xl">
          Dotknij perfekcji tytanu. Sprawdź, jak leży na Twoim palcu.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Inteligentny pierścień Aura nie przypomina tradycyjnych trackerów
          fitness. W salonie przekonasz się o jego mikroskopijnej wadze
          (zaledwie 3,8 grama), gładkiej wewnętrznej powłoce z hipoalergicznej
          żywicy medycznej oraz subtelnym blasku powłok PVD: Obsidian Black,
          Pure Titanium, Champagne Gold oraz Rose Gold.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Steps */}
          <ol className="flex flex-col gap-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-2xl border border-zinc-800 bg-[#0d0e14] p-5 transition hover:border-amber-500/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
                  <step.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold tracking-wider text-amber-500">
                      0{index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Right: Visuals */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-zinc-800">
              <Image
                src="/images/ring-image-2.jpg"
                alt="Dłoń z pierścieniami Aura Ring w wykończeniu tytanowym"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/70 via-transparent to-zinc-950/20" />
              <span className="absolute left-4 top-4 rounded-lg border border-white/10 bg-zinc-950/85 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
                Paleta wykończeń PVD na żywo
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {METRICS.map((metric) => (
                <div
                  key={metric.value}
                  className="rounded-2xl border border-zinc-800 bg-[#0d0e14] p-5"
                >
                  <div className="font-serif text-3xl font-semibold text-white">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {metric.label}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
