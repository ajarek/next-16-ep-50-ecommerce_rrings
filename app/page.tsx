import { CartProvider } from "@/context/cart-context";
import { Navbar } from "@/components/navbar";
import { HeroVideoSection } from "@/components/hero-video-section";
import { DisplayInnovationSection } from "@/components/display-innovation-section";
import { ProductFinishesSection } from "@/components/product-finishes-section";
import { SizingKitSection } from "@/components/sizing-kit-section";
import { ReviewsSection } from "@/components/reviews-section";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { SizeGuideModal } from "@/components/size-guide-modal";

export default function Home() {
  return (
    <CartProvider>
      <div className="relative min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
        <Navbar />
        <main className="flex-1">
          <HeroVideoSection />
          <DisplayInnovationSection />
          <ProductFinishesSection />
          <SizingKitSection />
          <ReviewsSection />
          <CtaBanner />
        </main>
        <Footer />

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <SizeGuideModal />
      </div>
    </CartProvider>
  );
}
