import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { AboutHeroSection } from "@/components/about-hero-section";
import { AboutStorySection } from "@/components/about-story-section";
import { AboutValuesSection } from "@/components/about-values-section";
import { AboutProcessSection } from "@/components/about-process-section";
import { AboutTeamSection } from "@/components/about-team-section";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "O nas | AURA RING — polska manufaktura biżuterii biometrycznej",
  description:
    "Poznaj zespół Aura Ring: inżynierów, jubilerów i fizjologów, którzy od 2019 roku tworzą w Warszawie inteligentny pierścień z tytanu medycznego. Nasza historia, zasady i proces produkcji.",
  keywords: [
    "aura ring o nas",
    "polski smart ring",
    "manufaktura aura ring",
    "zespół aura ring",
    "historia aura ring",
    "biżuteria biometryczna",
  ],
};

export default function AboutUsPage() {
  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <main className="flex-1">
        {/* Hero z wideo z pracowni */}
        <AboutHeroSection />

        {/* Historia marki i oś czasu */}
        <AboutStorySection />

        {/* Zasady, których nie negocjujemy */}
        <AboutValuesSection />

        {/* Proces powstawania pierścienia */}
        <AboutProcessSection />

        {/* Zespół i dyscypliny */}
        <AboutTeamSection />

        {/* Zamknięcie: zaproszenie do kolekcji i salonu */}
        <section className="relative py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-r from-zinc-950 via-[#111218] to-zinc-950 p-8 shadow-[0_0_50px_rgba(229,184,105,0.08)] sm:p-12">
              {/* Ambient light glow */}
              <div
                className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <h2 className="font-serif text-2xl font-normal text-white sm:text-3xl md:text-4xl">
                    Chcesz zobaczyć, jak Aura Ring leży na Twoim palcu?
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                    Zamów darmowy zestaw miarowy albo odwiedź jeden z czterech
                    salonów w Polsce — doradca dobierze wykończenie i rozmiar
                    podczas bezpłatnej konsultacji.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.35)] transition-all hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.5)] active:scale-95"
                  >
                    <span>Poznaj kolekcję</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/location"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-6 py-3.5 text-xs font-semibold text-zinc-200 transition hover:border-amber-500/50 hover:text-amber-200"
                  >
                    <MapPin className="h-4 w-4 text-amber-400" />
                    <span>Znajdź salon</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
