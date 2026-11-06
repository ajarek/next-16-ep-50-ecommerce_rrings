import {
  collection,
  doc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { INVENTORY_COLLECTION } from "@/lib/firebase/catalog";
import { SIZE_CHART } from "@/lib/data";
import type { InventoryEntry } from "@/types";

export const LOW_STOCK_THRESHOLD = 20;
export const REORDER_STOCK_THRESHOLD = 35;
export const STABLE_STOCK_THRESHOLD = 90;

export type StockStatusKey = "optimal" | "stable" | "low" | "reorder";

export interface StockStatus {
  key: StockStatusKey;
  label: string;
}

export function getStockStatus(stock: number): StockStatus {
  if (stock < LOW_STOCK_THRESHOLD) {
    return { key: "low", label: "NISKI STAN MAGAZYNU" };
  }
  if (stock < REORDER_STOCK_THRESHOLD) {
    return { key: "reorder", label: "Zamów dostawę" };
  }
  if (stock < STABLE_STOCK_THRESHOLD) {
    return { key: "stable", label: "Stabilny" };
  }
  return { key: "optimal", label: "Optymalny" };
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toInventoryEntry(
  id: string,
  data: Record<string, unknown>,
): InventoryEntry | null {
  const size = readNumber(data.size, Number.parseInt(id, 10));

  if (!Number.isFinite(size) || size <= 0) return null;

  const chartEntry = SIZE_CHART.find((item) => item.size === size);
  const updatedAt = data.updatedAt;

  return {
    size,
    diameterMm: readNumber(data.diameterMm, chartEntry?.diameterMm ?? 0),
    circumferenceMm: readNumber(
      data.circumferenceMm,
      chartEntry?.circumferenceMm ?? 0,
    ),
    stock: readNumber(data.stock),
    updatedAt:
      updatedAt instanceof Object && "toDate" in updatedAt
        ? (updatedAt as { toDate: () => Date }).toDate()
        : null,
  };
}

/** Subskrypcja stanów magazynowych — dostępna wyłącznie dla administratora. */
export function subscribeInventory(
  onInventory: (entries: InventoryEntry[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirebaseDb(), INVENTORY_COLLECTION),
    (snapshot) => {
      const entries = snapshot.docs
        .map((item) => toInventoryEntry(item.id, item.data()))
        .filter((entry): entry is InventoryEntry => entry !== null)
        .sort((a, b) => a.size - b.size);

      onInventory(entries);
    },
    onError,
  );
}

/**
 * Przyjmuje partię magazynową dla wybranego rozmiaru. `increment` jest
 * operacją atomową, więc równoległe dostawy nie zgubią sztuk.
 */
export async function receiveStockBatch(
  size: number,
  quantity: number,
  finish: string,
): Promise<void> {
  const chartEntry = SIZE_CHART.find((item) => item.size === size);

  await setDoc(
    doc(getFirebaseDb(), INVENTORY_COLLECTION, String(size)),
    {
      size,
      diameterMm: chartEntry?.diameterMm ?? 0,
      circumferenceMm: chartEntry?.circumferenceMm ?? 0,
      stock: increment(quantity),
      lastBatchQuantity: quantity,
      lastBatchFinish: finish,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
