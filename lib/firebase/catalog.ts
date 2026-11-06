import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { PRODUCTS, SIZE_CHART } from "@/lib/data";
import type { RingProduct } from "@/types";

export const PRODUCTS_COLLECTION = "products";
export const INVENTORY_COLLECTION = "inventory";
export const ORDERS_COLLECTION = "orders";

const FINISHES: RingProduct["finish"][] = [
  "black",
  "gold",
  "silver",
  "blue",
  "gunmetal",
  "rose-gold",
];

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readFinish(value: unknown): RingProduct["finish"] | null {
  return typeof value === "string" && FINISHES.includes(value as RingProduct["finish"])
    ? (value as RingProduct["finish"])
    : null;
}

/**
 * Mapuje dokument Firestore na produkt sklepu. Dokument o niekompletnym
 * kształcie jest pomijany, aby pojedynczy błędny wpis nie psuł katalogu.
 */
function toRingProduct(
  id: string,
  data: Record<string, unknown>,
): RingProduct | null {
  const name = readString(data.name);
  const series = readString(data.series);
  const finish = readFinish(data.finish);
  const finishName = readString(data.finishName);
  const description = readString(data.description);
  const image = readString(data.image);
  const price = readNumber(data.price);

  if (!name || !series || !finish || !finishName || !description || !image || price === null) {
    return null;
  }

  const availableSizes = Array.isArray(data.availableSizes)
    ? data.availableSizes.filter(
        (size): size is number => typeof size === "number" && Number.isFinite(size),
      )
    : [];

  if (availableSizes.length === 0) return null;

  const badge = readString(data.badge);
  const originalPrice = readNumber(data.originalPrice);

  return {
    id,
    name,
    series,
    finish,
    finishName,
    description,
    price,
    image,
    availableSizes,
    ...(badge ? { badge } : {}),
    ...(originalPrice !== null ? { originalPrice } : {}),
  };
}

/** Subskrypcja publicznego katalogu produktów z Firestore. */
export function subscribeProducts(
  onProducts: (products: RingProduct[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirebaseDb(), PRODUCTS_COLLECTION),
    (snapshot) => {
      const products = snapshot.docs
        .slice()
        .sort((a, b) => {
          const orderA = readNumber(a.data().sortOrder) ?? 0;
          const orderB = readNumber(b.data().sortOrder) ?? 0;
          return orderA - orderB;
        })
        .filter((item) => item.data().active !== false)
        .map((item) => toRingProduct(item.id, item.data()))
        .filter((product): product is RingProduct => product !== null);

      onProducts(products);
    },
    onError,
  );
}

export interface CatalogSeedResult {
  productsCreated: number;
  inventoryCreated: number;
}

/**
 * Tworzy brakujące kolekcje `products` i `inventory` na podstawie katalogu
 * z `lib/data.ts`. Operacja jest idempotentna — istniejących dokumentów nie
 * nadpisuje, więc można ją bezpiecznie uruchamiać przy każdym wejściu do
 * konsoli administratora.
 */
export async function seedSalesCatalog(): Promise<CatalogSeedResult> {
  const db = getFirebaseDb();
  const [productSnapshot, inventorySnapshot] = await Promise.all([
    getDocs(collection(db, PRODUCTS_COLLECTION)),
    getDocs(collection(db, INVENTORY_COLLECTION)),
  ]);

  const existingProducts = new Set(productSnapshot.docs.map((item) => item.id));
  const existingInventory = new Set(inventorySnapshot.docs.map((item) => item.id));
  const batch = writeBatch(db);

  let productsCreated = 0;
  let inventoryCreated = 0;

  PRODUCTS.forEach((product, index) => {
    if (existingProducts.has(product.id)) return;

    batch.set(doc(db, PRODUCTS_COLLECTION, product.id), {
      name: product.name,
      series: product.series,
      finish: product.finish,
      finishName: product.finishName,
      description: product.description,
      price: product.price,
      image: product.image,
      availableSizes: product.availableSizes,
      ...(product.badge ? { badge: product.badge } : {}),
      ...(product.originalPrice !== undefined
        ? { originalPrice: product.originalPrice }
        : {}),
      sortOrder: index,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    productsCreated += 1;
  });

  // Stany początkowe odpowiadają danym demonstracyjnym dotychczasowej konsoli.
  const initialStock: Record<number, number> = {
    7: 142,
    8: 89,
    9: 14,
    10: 28,
    11: 115,
    12: 73,
    13: 62,
  };

  SIZE_CHART.forEach((entry) => {
    const sizeId = String(entry.size);
    if (existingInventory.has(sizeId)) return;

    batch.set(doc(db, INVENTORY_COLLECTION, sizeId), {
      size: entry.size,
      diameterMm: entry.diameterMm,
      circumferenceMm: entry.circumferenceMm,
      stock: initialStock[entry.size] ?? 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    inventoryCreated += 1;
  });

  if (productsCreated === 0 && inventoryCreated === 0) {
    return { productsCreated, inventoryCreated };
  }

  await batch.commit();
  return { productsCreated, inventoryCreated };
}
