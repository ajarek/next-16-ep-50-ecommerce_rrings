"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Truck, Check, ArrowRight, Sparkles } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { RingProduct } from "@/types";
import { useCart } from "@/context/cart-context";

export function FeaturedProductsSection() {
  const { addToCart, openSizeGuide } = useCart();

  // Only the first three products for the home page
  const featuredProducts = PRODUCTS.slice(0, 3);
  const remainingProducts = PRODUCTS.slice(3);

  // Selected sizes for each product (defaults: 10, 8, 11)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({
    "aura-ring-matte-black": 10,
    "aura-ring-champagne-gold": 8,
    "aura-ring-silver-titanium": 11,
  });

  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleSelectSize = (productId: string, size: number) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: RingProduct) => {
    const size = selectedSizes[product.id] || 10;
    addToCart(product, size);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <section id="produkty" className="relative py-16 lg:py-24">
      {/* Subtle ambient lighting behind products */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[160px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with delivery notice */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>FLAGOWA KOLEKCJA AURA GEN 3</span>
            </div>
            <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-5xl">
              Wybierz swoje wykończenie
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
              Trzy kultowe edycje wykonane z tytanu lotniczego z odporną na
              zarysowania powłoką PVD. Dostęp do pełnej palety 8 wykończeń w
              naszym katalogu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs text-zinc-300">
              <Truck className="h-4 w-4 text-amber-400" />
              <span>Darmowa wysyłka kurierem w 24h</span>
            </div>
          </div>
        </div>

        {/* 3 Featured Products Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => {
            const activeSize = selectedSizes[product.id] || 10;
            const isJustAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-6 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(229,184,105,0.12)]"
              >
                <div>
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold tracking-wider text-zinc-400 uppercase">
                      {product.series}
                    </span>
                    {product.badge && (
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          product.badge === "Bestseller"
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                            : product.badge === "Edycja Limitowana"
                            ? "bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border border-amber-500/30"
                            : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="relative my-6 aspect-square w-full overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950/80">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent" />
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-serif text-xl font-medium text-white group-hover:text-amber-200 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-bold text-white">
                      {product.price.toLocaleString("pl-PL")} zł
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      brutto z VAT
                    </span>
                  </div>

                  {/* Size Selector */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Wybierz rozmiar:</span>
                      <button
                        type="button"
                        onClick={() => openSizeGuide(product)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Jak zmierzyć?</span>
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {product.availableSizes.map((size) => {
                        const isSelected = activeSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSelectSize(product.id, size)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-400 text-zinc-950 shadow-[0_0_12px_rgba(229,184,105,0.4)] scale-105 font-bold"
                                : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      isJustAdded
                        ? "bg-emerald-500 text-zinc-950"
                        : "bg-amber-400/90 hover:bg-amber-400 text-zinc-950 shadow-[0_0_20px_rgba(229,184,105,0.2)] hover:shadow-[0_0_30px_rgba(229,184,105,0.35)]"
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Dodano do koszyka!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>Dodaj do koszyka</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Creative Full Collection Showcase Banner */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-r from-zinc-950 via-[#101218] to-zinc-950 p-6 sm:p-8 shadow-[0_0_40px_rgba(229,184,105,0.06)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Odkryj pełną kolekcję Aura Ring</span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-white sm:text-3xl">
                Szukasz innego odcienia lub wykończenia?
              </h3>
              <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm max-w-2xl">
                Oprócz 3 flagowych modeli nasza kolekcja obejmuje również edycje{" "}
                <span className="text-zinc-200">Gloss Black</span>,{" "}
                <span className="text-zinc-200">Brushed Silver</span>,{" "}
                <span className="text-zinc-200">Rose Gold</span>,{" "}
                <span className="text-zinc-200">Gunmetal</span> oraz limitowany{" "}
                <span className="text-cyan-300">Titanium Blue</span>.
              </p>

              {/* Remaining finishes preview pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                {remainingProducts.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1 text-[11px] text-zinc-300"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        p.finish === "black"
                          ? "bg-zinc-800 border border-zinc-600"
                          : p.finish === "silver"
                          ? "bg-zinc-300"
                          : p.finish === "rose-gold"
                          ? "bg-rose-400"
                          : p.finish === "gunmetal"
                          ? "bg-zinc-500"
                          : p.finish === "blue"
                          ? "bg-cyan-500"
                          : "bg-amber-400"
                      }`}
                    />
                    <span>{p.finishName}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.3)] transition-all hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.45)] active:scale-95 cursor-pointer"
              >
                <span>Przeglądaj wszystkie 8 modeli</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-[11px] text-zinc-500">
                Darmowy zestaw miarowy do każdego zamówienia
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

