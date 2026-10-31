import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, RotateCcw, Ruler } from "lucide-react";
import { ProductFinishesSection } from "@/components/product-finishes-section";
import { SizingKitSection } from "@/components/sizing-kit-section";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Kolekcja Pierścieni Inteligentnych | AURA RING Gen 3",
  description:
    "Odkryj pełną kolekcję 8 unikalnych wykończeń inteligentnego pierścienia Aura Ring Gen 3. Tytan lotniczy, ekran OLED, biometria 24/7 i darmowy zestaw miarowy.",
  keywords: [
    "aura ring",
    "kolekcja pierścieni",
    "smart ring sklep",
    "pierścień tytanowy",
    "wykończenia aura ring",
    "monitor snu",
  ],
};

export default function ProductsPage() {
  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <main className="flex-1">
        {/* Page Hero & Breadcrumbs Header */}
        <section className="relative overflow-hidden border-b border-zinc-800/80 bg-linear-to-b from-zinc-950 via-[#0a0b10] to-[#070709] pt-8 pb-12 sm:pt-12 sm:pb-16">
          {/* Ambient Lighting */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav
              aria-label="Ścieżka powrotu"
              className="flex items-center gap-2 text-xs text-zinc-400"
            >
              <Link
                href="/"
                className="transition hover:text-amber-300"
              >
                Strona Główna
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
              <span className="font-medium text-amber-300">
                Kolekcja Produktów
              </span>
            </nav>

            {/* Header Content */}
            <div className="mt-6 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
                PEŁNY KATALOG AURA GEN 3
              </span>
              <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl">
                Kolekcja Pierścieni Aura Ring
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Wybierz wykończenie dopasowane do Twojego unikalnego stylu.
                Każdy pierścień wykonany jest z hipoalergicznego tytanu medycznego
                klasy Ti-6Al-4V z odporną na zarysowania powłoką PVD i zaawansowanym
                sensorem biometrycznym PPG.
              </p>
            </div>

            {/* Quick Guarantees Bar */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-t border-zinc-800/80 pt-6">
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <Truck className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Wysyłka kurierem w 24h</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <Ruler className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Darmowy zestaw miarowy</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <RotateCcw className="h-4 w-4 text-amber-400 shrink-0" />
                <span>30 dni na bezpłatną wymianę</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>2 lata gwarancji door-to-door</span>
              </div>
            </div>
          </div>
        </section>

        {/* Product Finishes Section */}
        <ProductFinishesSection />

        {/* Sizing Assistance Section */}
        <SizingKitSection />

        {/* Call to Action Banner */}
        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
