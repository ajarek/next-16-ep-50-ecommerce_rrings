import React from "react";
import { Quote } from "lucide-react";

const MILESTONES = [
  {
    year: "2019",
    title: "Trzy osoby, jeden garaż",
    description:
      "Zespół inżynierów z Politechniki Warszawskiej drukuje w 3D pierwszy prototyp obudowy z tytanu. Założenie było proste: zbudować pierścień, który nie wygląda jak tracker.",
  },
  {
    year: "2021",
    title: "240 uczestników testów klinicznych",
    description:
      "Walidacja sensorów PPG względem EKG w laboratorium partnerskim. Dokładność pomiaru tętna spoczynkowego osiąga 98,2% — wynik, który do dziś publikujemy w karcie produktu.",
  },
  {
    year: "2023",
    title: "Premiera Gen 1 i pierwszy salon",
    description:
      "Flagowy butik przy Placu Trzech Krzyży 12 w Warszawie. Pierwszego dnia przed wejściem ustawia się kolejka — pierwsze wykończenia wyprzedają się w 36 godzin.",
  },
  {
    year: "2024",
    title: "Ekran OLED i dwa nowe miasta",
    description:
      "Gen 2 z mikro-wyświetlaczem i ładowaniem Qi. Salony w Krakowie i Wrocławiu dołączają do warszawskiej pracowni.",
  },
  {
    year: "2025",
    title: "Gen 3, Gdańsk i 15 000 klientów",
    description:
      "Trzecia generacja pierścienia, butik w Galerii Bałtyckiej i ekspansja na rynki Europy Środkowej — bez abonamentu i bez ukrytych opłat.",
  },
];

export function AboutStorySection() {
  return (
    <section
      id="historia"
      className="relative border-b border-zinc-800/80 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Header + Quote */}
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              Nasza historia
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight tracking-tight text-white sm:text-4xl">
              Od prototypu z drukarki 3D do czterech salonów
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Nie zaczynaliśmy od biznesplanu, a od uporu. Chcieliśmy nosić
              biżuterię, która nie wymaga zdejmowania jej na noc — i która nie
              wygląda jak sportowy zegarek.
            </p>

            <figure className="mt-8 rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6">
              <Quote className="h-5 w-5 text-amber-400" />
              <blockquote className="mt-3 font-serif text-lg leading-snug text-zinc-200">
                „Nie projektujemy gadżetów. Projektujemy biżuterię, która
                rozumie organizm.”
              </blockquote>
              <figcaption className="mt-4 border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-500">
                <span className="font-semibold text-amber-300">
                  Marta Zielińska
                </span>{" "}
                • Współzałożycielka i CEO
              </figcaption>
            </figure>
          </div>

          {/* Right: Timeline */}
          <ol className="relative space-y-8 border-l border-zinc-800 pl-8 lg:col-span-8 lg:space-y-10">
            {MILESTONES.map((milestone) => (
              <li key={milestone.year} className="relative">
                <span
                  className="absolute -left-[41px] top-1 flex h-4 w-4 items-center justify-center rounded-full border border-amber-400/60 bg-[#070709]"
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                </span>
                <div className="font-mono text-[11px] font-bold tracking-widest text-amber-400">
                  {milestone.year}
                </div>
                <h3 className="mt-1 font-serif text-lg font-medium text-white">
                  {milestone.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-zinc-400">
                  {milestone.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
