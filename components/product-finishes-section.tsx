"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Truck, Check, Sparkles, Filter } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { RingProduct } from "@/types";
import { useCart } from "@/context/cart-context";

export function ProductFinishesSection() {
  const { addToCart, openSizeGuide } = useCart();

  // Filter category state
  const [activeFilter, setActiveFilter] = useState<
    "all" | "black" | "gold" | "silver" | "special"
  >("all");

  // Selected sizes for each product (defaults to 10 if not set)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({
    "aura-ring-matte-black": 10,
    "aura-ring-champagne-gold": 8,
    "aura-ring-silver-titanium": 11,
    "onyx-ring-gloss-black": 10,
    "titan-ring-brushed-silver": 9,
    "nova-ring-rose-gold": 8,
    "shadow-ring-gunmetal": 11,
    "aurora-ring-titanium-blue": 10,
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

  // Filter products based on selected tab
  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "black") {
      return product.finish === "black" || product.finish === "gunmetal";
    }
    if (activeFilter === "gold") {
      return product.finish === "gold" || product.finish === "rose-gold";
    }
    if (activeFilter === "silver") {
      return product.finish === "silver";
    }
    if (activeFilter === "special") {
      return (
        product.finish === "blue" ||
        product.badge === "Edycja Limitowana" ||
        product.badge === "Limitowana edycja" ||
        product.badge === "Ekskluzywny"
      );
    }
    return true;
  });

  const filterTabs = [
    { id: "all", label: "Wszystkie modele", count: PRODUCTS.length },
    {
      id: "black",
      label: "Czerń & Grafit",
      count: PRODUCTS.filter((p) => p.finish === "black" || p.finish === "gunmetal").length,
    },
    {
      id: "gold",
      label: "Złoto & Luksus",
      count: PRODUCTS.filter((p) => p.finish === "gold" || p.finish === "rose-gold").length,
    },
    {
      id: "silver",
      label: "Srebro & Tytan",
      count: PRODUCTS.filter((p) => p.finish === "silver").length,
    },
    {
      id: "special",
      label: "Edycje Limitowane",
      count: PRODUCTS.filter(
        (p) =>
          p.finish === "blue" ||
          p.badge === "Edycja Limitowana" ||
          p.badge === "Limitowana edycja" ||
          p.badge === "Ekskluzywny"
      ).length,
    },
  ] as const;

  return (
    <section id="produkty" className="relative py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with delivery notice */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>KOLEKCJA AURA GEN 3</span>
            </div>
            <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-5xl">
              Wybierz swoje wykończenie
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
              Precyzyjnie frezowany tytan medyczny klasy lotniczej, pokryty
              odporną powłoką PVD i twardą powłoką diamentopodobną DLC.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs text-zinc-300 shrink-0">
            <Truck className="h-4 w-4 text-amber-400" />
            <span>Darmowa wysyłka kurierem w 24h</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-zinc-950 font-semibold shadow-[0_0_15px_rgba(229,184,105,0.25)]"
                      : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive
                        ? "bg-zinc-950/20 text-zinc-950 font-bold"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Filter className="h-3.5 w-3.5 text-amber-400" />
            <span>
              Wyświetlanie:{" "}
              <strong className="text-zinc-200">
                {filteredProducts.length}
              </strong>{" "}
              z {PRODUCTS.length} modeli
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const activeSize = selectedSizes[product.id] || 10;
            const isJustAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(229,184,105,0.12)]"
              >
                <div>
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold tracking-wider text-zinc-400 uppercase text-[10px]">
                      {product.series}
                    </span>
                    {product.badge && (
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          product.badge === "Bestseller"
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                            : product.badge === "Edycja Limitowana" ||
                              product.badge === "Limitowana edycja"
                            ? "bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border border-amber-500/30"
                            : product.badge === "Nowość"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : product.badge === "Ekskluzywny"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="relative my-5 aspect-square w-full overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950/80">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent" />
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-serif text-lg font-medium text-white group-hover:text-amber-200 transition-colors">
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
                  <div className="mt-4">
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
                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
                <div className="mt-5 pt-4 border-t border-zinc-800/80">
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
      </div>
    </section>
  );
}
