import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import { SizeGuideModal } from "@/components/size-guide-modal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURA RING | Luksusowy Inteligentny Pierścień Tytanowy Gen 3",
  description:
    "Inteligentny pierścień z ekranem dotykowym OLED, precyzyjną biometrią 24/7 i tytanową obudową lotniczą. Twoje zdrowie, sen i styl w jednym geście.",
  keywords: [
    "inteligentny pierścień",
    "smart ring",
    "aura ring",
    "monitorowanie snu",
    "biometria",
    "tytanowy pierścień",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pl"
      className={cn(
        "h-full dark antialiased scroll-smooth",
        inter.variable,
        cormorant.variable,
        geistSans.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col bg-[#070709] text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
        <CartProvider>
          <Navbar />
          {children}
          <CartDrawer />
          <SizeGuideModal />
        </CartProvider>
      </body>
    </html>
  );
}
