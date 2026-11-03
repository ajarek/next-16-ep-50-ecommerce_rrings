import React from "react";
import { Microscope, Gem, ShieldCheck } from "lucide-react";

const VALUES = [
  {
    icon: Microscope,
    title: "Precyzja ponad marketing",
    description:
      "Każdy czujnik walidujemy w laboratorium partnerskim. Publikujemy realne odchylenia pomiarów i godziny testów, a nie tylko obietnice z broszury.",
    footnote: "98,2% zgodności z EKG",
  },
  {
    icon: Gem,
    title: "Design, który chce się nosić",
    description:
      "Tytan Grade 5, powłoki PVD i 3,8 grama wagi. Pierścień ma wyglądać jak biżuteria od jubilera — nie jak elektronika przyklejona do palca.",
    footnote: "4 wykończenia, 8 modeli",
  },
  {
    icon: ShieldCheck,
    title: "Prywatność jako fundament",
    description:
      "Dane biometryczne zostają na Twoim urządzeniu i w Twojej aplikacji. Szyfrowanie end-to-end, brak sprzedaży danych i pełna zgodność z RODO.",
    footnote: "Zero reklamowych profili",
  },
];

export function AboutValuesSection() {
  return (
    <section
      id="wartosci"
      className="relative border-b border-zinc-800/80 py-16 lg:py-24"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[150px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Nasze zasady
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-5xl">
            Trzy rzeczy, których nie negocjujemy
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Od pierwszego prototypu te same trzy zasady decydują o każdym
            detalu — od grubości obudowy po brzmienie powiadomień w aplikacji.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map((value, index) => (
            <article
              key={value.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 transition-all hover:border-amber-500/40 sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[11px] font-bold tracking-wider text-zinc-600">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-xl font-medium text-white">
                  {value.title}
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  {value.description}
                </p>
              </div>

              <div className="mt-6 border-t border-zinc-800/80 pt-4 text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
                {value.footnote}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
