import React from "react";

const TEAM = [
  {
    initials: "MZ",
    name: "Marta Zielińska",
    role: "Współzałożycielka i CEO",
    quote:
      "Chciałam biżuterii, która nie każe mi wybierać między stylem a zdrowiem.",
  },
  {
    initials: "JN",
    name: "dr Jakub Nowicki",
    role: "Dyrektor ds. technologii",
    quote:
      "Każdy czujnik kalibrujemy na podstawie ponad 12 000 godzin pomiarów.",
  },
  {
    initials: "AW",
    name: "Aleksandra Wrona",
    role: "Projektantka biżuterii",
    quote: "Tytan musi leżeć na palcu jak druga skóra — nigdy odwrotnie.",
  },
  {
    initials: "TK",
    name: "Tomasz Kępiński",
    role: "Kierownik konsjerży",
    quote:
      "W salonie zawsze zaczynamy od pytania, jak wygląda Twój zwykły dzień.",
  },
];

const DISCIPLINES = [
  { value: "12", label: "Inżynierów" },
  { value: "6", label: "Jubilerów" },
  { value: "4", label: "Fizjologów" },
  { value: "3", label: "Projektantów" },
];

export function AboutTeamSection() {
  return (
    <section
      id="zespol"
      className="relative border-b border-zinc-800/80 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Ludzie Aura
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-5xl">
            Zespół, który nosi to, co tworzy
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Każda osoba w pracowni jest jednocześnie użytkownikiem Aura Ring.
            Uwagi z własnego palca trafiają prosto do prototypu.
          </p>
        </div>

        {/* Dyscypliny */}
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {DISCIPLINES.map((discipline) => (
            <div
              key={discipline.label}
              className="rounded-xl border border-zinc-800 bg-[#0d0e14] px-4 py-3 text-center"
            >
              <div className="font-serif text-2xl font-semibold text-amber-300">
                {discipline.value}
              </div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {discipline.label}
              </div>
            </div>
          ))}
        </div>

        {/* Karty zespołu */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 transition hover:border-amber-500/40"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 font-serif text-sm font-semibold text-amber-300">
                  {member.initials}
                </div>
                <h3 className="mt-4 font-serif text-lg font-medium text-white">
                  {member.name}
                </h3>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                  {member.role}
                </div>
              </div>

              <p className="mt-4 border-t border-zinc-800/80 pt-4 text-xs italic leading-relaxed text-zinc-400">
                „{member.quote}”
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
