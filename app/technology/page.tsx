import type { Metadata } from "next";
import { TechnologyConfiguratorSection } from "@/components/technology-configurator-section";
import { TechnologySizeGuideSection } from "@/components/technology-size-guide-section";
import { TechnologySpecsSection } from "@/components/technology-specs-section";
import { TechnologySizingKitBanner } from "@/components/technology-sizing-kit-banner";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Technologia i Pomiary | AURA RING Gen 3",
  description:
    "Konfigurator Aura Ring Gen 3: wybierz wykończenie tytanu medycznego, wersję techniczną i rozmiar. Poznaj specyfikację sensorów PPG, kalkulator obwodu palca i darmowy Sizing Kit.",
  keywords: [
    "technologia aura ring",
    "konfigurator pierścienia",
    "rozmiar pierścienia",
    "sizing kit",
    "sensory PPG",
    "smart ring specyfikacja",
  ],
};

export default function TechnologyPage() {
  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <main className="flex-1">
        {/* Konfigurator modelu */}
        <TechnologyConfiguratorSection />

        {/* Przewodnik po doborze rozmiaru */}
        <TechnologySizeGuideSection />

        {/* Specyfikacja techniczna i sensoryczna */}
        <TechnologySpecsSection />

        {/* Darmowy zestaw pomiarowy */}
        <TechnologySizingKitBanner />
      </main>

      <Footer />
    </div>
  );
}
