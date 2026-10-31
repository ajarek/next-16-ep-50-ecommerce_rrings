import { HeroVideoSection } from "@/components/hero-video-section";
import { DisplayInnovationSection } from "@/components/display-innovation-section";
import { FeaturedProductsSection } from "@/components/featured-products-section";
import { SizingKitSection } from "@/components/sizing-kit-section";
import { ReviewsSection } from "@/components/reviews-section";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      <main className="flex-1">
        <HeroVideoSection />
        <DisplayInnovationSection />
        <FeaturedProductsSection />
        <SizingKitSection />
        <ReviewsSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
