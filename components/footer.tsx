"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function Footer() {
  const { openSizeGuide } = useCart();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-zinc-800/80 bg-[#06070a] pt-16 pb-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/30 bg-zinc-900">
                <span className="font-serif text-xs font-bold text-amber-300">
                  A
                </span>
              </div>
              <span className="font-serif text-lg font-semibold tracking-[0.2em] text-white">
                AURA RING
              </span>
            </Link>

            <p className="mt-4 text-xs leading-relaxed text-zinc-400 max-w-sm">
              Precyzyjna biometria zamknięta w luksusowym tytanie klasy medycznej.
              Odkryj harmonię regeneracji i elegancji.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5 text-xs text-zinc-300 w-fit">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Certyfikat wodoszczelności 5ATM (100M)</span>
            </div>
          </div>

          {/* Column 2: Przewodnik i Bezpieczeństwo (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Przewodnik i Bezpieczeństwo
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => openSizeGuide()}
                  className="hover:text-amber-300 transition text-left"
                >
                  Tabela rozmiarów i zestaw dopasowujący
                </button>
              </li>
              <li>
                <Link href="#technologia" className="hover:text-amber-300 transition">
                  Dożywotnia gwarancja na obudowę
                </Link>
              </li>
              <li>
                <Link href="#technologia" className="hover:text-amber-300 transition">
                  Standardy czujników biometrycznych PPG
                </Link>
              </li>
              <li>
                <Link href="#rozmiary" className="hover:text-amber-300 transition">
                  Zwroty i bezpłatna wymiana rozmiaru
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Salony w Polsce (2 cols) */}
          <div id="salony" className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Salony w Polsce
            </h4>
            <div className="mt-4 space-y-2.5 text-xs text-zinc-400">
              <p>Warszawa, Plac Trzech Krzyży 12</p>
              <p>Kraków, Pasaż 13, Rynek Główny</p>
              <p>Gdańsk, Długi Targ 24</p>
              <Link
                href="#kontakt"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 transition"
              >
                <span>Zarezerwuj prywatne dopasowanie</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Column 4: Newsletter - Klub Biometrii (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Klub Biometrii
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-zinc-400">
              Zapisz się do newslettera, aby otrzymać ekskluzywny dostęp do
              nowych wykończeń i analiz snu.
            </p>

            {isSubscribed ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Dziękujemy za dołączenie do Klubu Biometrii!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Twój adres e-mail"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-amber-400 bg-amber-400 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition shrink-0"
                >
                  Zapisz
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Subfooter */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-8 sm:flex-row text-xs text-zinc-500">
          <div>
            © 2026 AURA RING Polska Sp. z o.o. Wszelkie prawa zastrzeżone.
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="#polityka" className="hover:text-zinc-300 transition">
              Polityka Prywatności
            </Link>
            <span>•</span>
            <Link href="#regulamin" className="hover:text-zinc-300 transition">
              Regulamin Sklepu
            </Link>
            <span>•</span>
            <Link href="#cookies" className="hover:text-zinc-300 transition">
              Ustawienia Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

