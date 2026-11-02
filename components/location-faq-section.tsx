"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Czy muszę wcześniej rezerwować termin wizyty w salonie?",
    answer:
      "Rezerwacja nie jest obowiązkowa, ale ją zalecamy. Dzięki niej doradca biometryczny przygotuje komplet przymiarek 6-13 oraz pełne wykończenia PVD wyłącznie dla Ciebie, a Ty unikniesz czekania w kolejce. Wizytę zarezerwujesz w 20 sekund w formularzu powyżej lub telefonicznie pod numerem +48 22 000 11 22.",
  },
  {
    question: "Czy rozmiary Aura Ring odpowiadają standardowym rozmiarom jubilerskim?",
    answer:
      "Tak. Skala 6-13 jest zgodna z amerykańską skalą jubilerską, a nasze wzorce mają dokładnie te same średnice wewnętrzne co tytanowe pierścienie. Różnica wynika wyłącznie z materiału: tytan jest sztywniejszy niż złoto, dlatego w salonie wykonujemy dodatkowy pomiar laserowy i test rotacji przy naturalnych zmianach objętości palca w ciągu doby.",
  },
  {
    question: "Jak działa gwarancja natychmiastowej wymiany rozmiaru w butiku?",
    answer:
      "Przez 30 dni od zakupu wymienisz rozmiar bezpłatnie w dowolnym salonie firmowym — bez pytania o przyczynę. Jeśli Twój rozmiar jest dostępny w magazynie salonu, wymiana trwa kilkanaście minut; w przeciwnym razie zamawiamy go z priorytetem i dostarczamy w 24 godziny.",
  },
  {
    question: "Czy w salonie mogę kupić pierścień i odebrać go natychmiast?",
    answer:
      "Tak. Salony w Warszawie, Krakowie, Wrocławiu i Gdańsku prowadzą własny magazyn — po przymiarce i kalibracji odbierasz gotowy Aura Ring od ręki, wraz z etui, ładowarką indukcyjną i certyfikatem 5ATM. Wybrane wykończenia mogą wymagać jednodniowego zamówienia z centrali.",
  },
];

export function LocationFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative border-b border-zinc-800/80 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            <HelpCircle className="h-3.5 w-3.5" />
            Najczęstsze pytania
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl">
            Wizyta w salonie i dobór rozmiaru
          </h2>
        </div>

        {/* Accordion */}
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-zinc-800/80 rounded-2xl border border-zinc-800 bg-[#0d0e14] px-5 sm:px-7">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isOpen ? "text-amber-300" : "text-zinc-100 hover:text-white"
                    }`}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-amber-400" : "text-zinc-500"
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p
                    className="pb-5 text-xs leading-relaxed text-zinc-400"
                    role="region"
                  >
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
