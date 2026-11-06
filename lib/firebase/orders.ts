import type { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { ORDERS_COLLECTION } from "@/lib/firebase/catalog";
import type { CartItem, OrderLine, OrderStatus, SalesOrder } from "@/types";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "new",
  "sizing-sent",
  "awaiting-size",
  "preparing-ring",
  "completed",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Nowe zamówienie",
  "sizing-sent": "Wysłano Sizing Kit",
  "awaiting-size": "Oczekiwanie na wybór rozmiaru",
  "preparing-ring": "Przygotowano do wysyłki pierścienia",
  completed: "Zrealizowane (Aktywne IoT)",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    ORDER_STATUS_FLOW.includes(value as OrderStatus)
  );
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readTimestamp(value: unknown): Date | null {
  return value instanceof Object && "toDate" in value
    ? (value as { toDate: () => Date }).toDate()
    : null;
}

function readOrderLines(value: unknown): OrderLine[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((raw): OrderLine[] => {
    if (typeof raw !== "object" || raw === null) return [];

    const line = raw as Record<string, unknown>;
    const productId = readString(line.productId);

    if (!productId) return [];

    return [
      {
        lineId: readString(line.lineId),
        productId,
        name: readString(line.name),
        finishName: readString(line.finishName),
        finish: readString(line.finish) as OrderLine["finish"],
        size: readNumber(line.size),
        price: readNumber(line.price),
        quantity: readNumber(line.quantity),
        image: readString(line.image),
      },
    ];
  });
}

function toSalesOrder(id: string, data: Record<string, unknown>): SalesOrder | null {
  const userId = readString(data.userId);
  const number = readString(data.number);

  if (!userId || !number) return null;

  return {
    id,
    number,
    userId,
    email: readString(data.email),
    clientName: readString(data.clientName, "Klient AURA"),
    items: readOrderLines(data.items),
    subtotal: readNumber(data.subtotal),
    includeSizingKit: data.includeSizingKit === true,
    status: isOrderStatus(data.status) ? data.status : "new",
    createdAt: readTimestamp(data.createdAt),
    updatedAt: readTimestamp(data.updatedAt),
  };
}

/**
 * Subskrypcja wszystkich zamówień. Reguły Firestore dopuszczają pełny odczyt
 * kolekcji wyłącznie administratorowi, więc klient musi być zalogowany jako
 * konto z `ADMIN_EMAIL`.
 */
export function subscribeOrders(
  onOrders: (orders: SalesOrder[]) => void,
  onError: (error: Error) => void,
) {
  const ordersQuery = query(
    collection(getFirebaseDb(), ORDERS_COLLECTION),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      const orders = snapshot.docs
        .map((item) => toSalesOrder(item.id, item.data()))
        .filter((order): order is SalesOrder => order !== null);

      onOrders(orders);
    },
    onError,
  );
}

export interface CreateOrderInput {
  user: User;
  items: CartItem[];
  subtotal: number;
  includeSizingKit: boolean;
}

/**
 * Zapisuje zamówienie w kolekcji `orders`. Kwoty pochodzą z koszyka klienta,
 * dlatego ostateczne rozliczenie płatności musi je przeliczyć po stronie
 * serwera, gdy powstanie integracja płatności.
 */
export async function createOrder({
  user,
  items,
  subtotal,
  includeSizingKit,
}: CreateOrderInput): Promise<string> {
  if (!user.email) {
    throw new Error("Konto nie ma adresu e-mail wymaganego do złożenia zamówienia.");
  }

  if (items.length === 0) {
    throw new Error("Koszyk jest pusty.");
  }

  const number = `AUR-${Date.now().toString().slice(-6)}`;
  const clientName =
    user.displayName?.trim() || user.email.split("@")[0] || "Klient AURA";

  const lines: OrderLine[] = items.map((item) => ({
    lineId: item.id,
    productId: item.productId,
    name: item.name,
    finishName: item.finishName,
    finish: item.finish,
    size: item.size,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  }));

  await addDoc(collection(getFirebaseDb(), ORDERS_COLLECTION), {
    number,
    userId: user.uid,
    email: user.email,
    clientName,
    items: lines,
    subtotal,
    includeSizingKit,
    status: "new" satisfies OrderStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return number;
}

/** Zmiana statusu realizacji — dozwolona regułami tylko dla administratora. */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), ORDERS_COLLECTION, orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
