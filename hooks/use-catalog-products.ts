"use client";

import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { subscribeProducts } from "@/lib/firebase/catalog";
import { PRODUCTS } from "@/lib/data";
import type { RingProduct } from "@/types";

/**
 * Zwraca katalog z Firestore, a do czasu jego wczytania (lub gdy kolekcja
 * `products` jest jeszcze pusta) korzysta z katalogu zapisanego w projekcie.
 */
export function useCatalogProducts(): RingProduct[] {
  const [products, setProducts] = useState<RingProduct[]>(PRODUCTS);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    return subscribeProducts(
      (nextProducts) => {
        if (nextProducts.length > 0) setProducts(nextProducts);
      },
      (error) => {
        console.warn(
          "[firebase] Nie udało się pobrać katalogu produktów.",
          error.message,
        );
      },
    );
  }, []);

  return products;
}
