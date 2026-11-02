import type { Metadata } from "next";
import { LocationHeroSection } from "@/components/location-hero-section";
import { LocationSalonsSection } from "@/components/location-salons-section";
import { LocationExperienceSection } from "@/components/location-experience-section";
import { LocationReservationSection } from "@/components/location-reservation-section";
import { LocationFaqSection } from "@/components/location-faq-section";
import { LocationVipBanner } from "@/components/location-vip-banner";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Salony i Lokalizacja | AURA RING",
  description:
    "Odwiedź flagowe salony Aura Ring w Warszawie, Krakowie, Wrocławiu i Gdańsku. Bezpłatna przymiarka rozmiarów 6-13, diagnostyka PPG na miejscu i prywatna sesja pomiarowa z konsjerżem biometrycznym.",
  keywords: [
    "salony aura ring",
    "przymiarka smart ring",
    "punkt przymiarek",
    "salon biometryczny warszawa",
    "dobór rozmiaru pierścienia",
    "Aura Ring salon",
  ],
};

export default function LocationPage() {
  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <main className="flex-1">
        {/* Hero z nagłówkiem i pigułkami akcji */}
        <LocationHeroSection />

        {/* Wyszukiwarka salonów, lista i mapa */}
        <LocationSalonsSection />

        {/* Doświadczenie butikowe i metryki */}
        <LocationExperienceSection />

        {/* Formularz rezerwacji sesji pomiarowej */}
        <LocationReservationSection />

        {/* Najczęstsze pytania */}
        <LocationFaqSection />

        {/* Baner VIP / wizyty domowe */}
        <LocationVipBanner />
      </main>

      <Footer />
    </div>
  );
}
