import React from "react";
import Image from "next/image";
import { MapPin, Ruler } from "lucide-react";

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Projekt i prototypowanie",
    description:
      "Rysunki techniczne, próby druku 3D i dobór geometrii wewnętrznej. Obudowę dopasowujemy do siedmiu rozmiarów, zanim powstanie pierwszy tytanowy egzemplarz.",
  },
  {
    number: "02",
    title: "Testy szczelności i biometrii",
    description:
      "Każda konstrukcja przechodzi próbę 5ATM oraz 240 godzinnych pomiarów referencyjnych. Odrzucamy wszystko, co odbiega od wzorca więcej niż o 2%.",
  },
  {
    number: "03",
    title: "Ręczne wykończenie",
    description:
      "Polerowanie, piaskowanie i powłoka PVD nakładana warstwa po warstwie. Kontrola wizualna odbywa się w powiększeniu 10x — przy naturalnym świetle.",
  },
  {
    number: "04",
    title: "Indywidualna kalibracja",
    description:
      "Każdy egzemplarz jest testowany na stanowisku PPG, parowany z aplikacją i pakowany w etui z ładowarką indukcyjną oraz certyfikatem.",
  },
];

const PROCESS_STATS = [
  { value: "3,8 g", label: "Wagi końcowej" },
  { value: "5ATM", label: "Szczelności" },
  { value: "48 h", label: "Od zamówienia do wysyłki" },
];

export function AboutProcessSection() {
  return (
    <section
      id="manufaktura"
      className="relative border-b border-zinc-800/80 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
              <Image
                src="/images/ring-image-2.jpg"
                alt="Dłoń z pierścieniami Aura Ring wykonanymi ręcznie w warszawskiej pracowni"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/85 via-transparent to-transparent" />

              <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                    Pracownia AURA RING
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-300">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    ul. Mokotowska 14, Warszawa
                  </p>
                </div>
                <span className="rounded-lg border border-white/10 bg-zinc-950/85 px-2.5 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur">
                  Ręczne wykończenie
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {PROCESS_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-zinc-800 bg-[#0d0e14] px-4 py-3"
                >
                  <div className="font-serif text-xl font-semibold text-white">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Steps */}
          <div className="lg:col-span-6">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              Manufaktura
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-tight tracking-tight text-white sm:text-4xl">
              Jak powstaje Aura Ring
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Nie składamy pierścieni z gotowych modułów. Od projektu obudowy po
              ostatni test szczelności każdy etap odbywa się w naszej pracowni
              na Mokotowie.
            </p>

            <div className="mt-8 flex flex-col">
              {PROCESS_STEPS.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex gap-4 py-5 ${
                    index === 0 ? "pt-0" : "border-t border-zinc-800/80"
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold tracking-widest text-amber-400/80">
                    {step.number}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-[11px] leading-relaxed text-zinc-400">
                Nie masz pewności co do rozmiaru? Każde zamówienie można
                rozpocząć od darmowego zestawu miarowego — bez zobowiązań i bez
                opłat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
