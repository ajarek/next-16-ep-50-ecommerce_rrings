"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Activity,
  Store,
  ArrowLeft,
  Search,
  Bell,
  Plus,
  Download,
  Radio,
  TrendingUp,
  Crown,
  CreditCard,
  Heart,
  Thermometer,
  BatteryCharging,
  CheckCircle2,
  SlidersHorizontal,
  MoreVertical,
  X,
  Zap,
  Menu,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getUserInitials } from "@/lib/auth/display";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { seedSalesCatalog } from "@/lib/firebase/catalog";
import {
  getStockStatus,
  receiveStockBatch,
  subscribeInventory,
  type StockStatusKey,
} from "@/lib/firebase/inventory";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  subscribeOrders,
  updateOrderStatus,
} from "@/lib/firebase/orders";
import { SIZE_CHART } from "@/lib/data";
import type { InventoryEntry, OrderStatus, RingProduct, SalesOrder } from "@/types";

interface SizeStock {
  size: number;
  diameter: string;
  stock: number;
  status: string;
  statusType: StockStatusKey;
}

const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  new: "border-cyan-500/30 bg-cyan-500/15 text-cyan-300",
  "sizing-sent": "border-amber-500/30 bg-amber-500/15 text-amber-300",
  "awaiting-size": "border-yellow-500/30 bg-yellow-500/15 text-yellow-300",
  "preparing-ring": "border-amber-500/30 bg-amber-500/15 text-amber-300",
  completed: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
};

const FINISH_DOT_COLORS: Record<RingProduct["finish"], string> = {
  black: "bg-zinc-700",
  gold: "bg-amber-400",
  silver: "bg-zinc-300",
  gunmetal: "bg-zinc-500",
  blue: "bg-cyan-400",
  "rose-gold": "bg-rose-400",
};

function formatAmount(value: number): string {
  return `${value.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} PLN`;
}

function getOrderSizeLabel(order: SalesOrder): string {
  const firstLine = order.items[0];
  if (!firstLine) return "Brak pozycji";

  const extraItems = order.items.length - 1;
  return extraItems > 0
    ? `Rozmiar ${firstLine.size}# (+${extraItems})`
    : `Rozmiar ${firstLine.size}#`;
}

export default function TechnologyConsolePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "pulpit" | "zamowienia" | "magazyn" | "telemetria" | "salony"
  >("pulpit");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const [searchQuery, setSearchQuery] = useState("");
  const [finishFilter, setFinishFilter] = useState("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeOrderMenu, setActiveOrderMenu] = useState<string | null>(null);

  // Modals & feedback states
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isOtaModalOpen, setIsOtaModalOpen] = useState(false);
  const [otaProgress, setOtaProgress] = useState(0);
  const [isOtaRunning, setIsOtaRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sprzedaż i magazyn czytamy na żywo z Firestore.
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [ordersState, setOrdersState] = useState<"loading" | "ready" | "error">(
    isFirebaseConfigured ? "loading" : "error",
  );
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [inventoryState, setInventoryState] = useState<
    "loading" | "ready" | "error"
  >(isFirebaseConfigured ? "loading" : "error");

  // Pierwsze wejście do konsoli tworzy brakujące kolekcje `products`,
  // `inventory` i subskrybuje kolekcję `orders`.
  useEffect(() => {
    // Reguły Firestore wymagają zalogowanego administratora — czekamy na sesję.
    if (!isFirebaseConfigured || !user) return;

    let cancelled = false;

    void seedSalesCatalog()
      .then((result) => {
        if (cancelled) return;
        if (result.productsCreated > 0 || result.inventoryCreated > 0) {
          setToastMessage(
            `Zsynchronizowano katalog z Firestore: ${result.productsCreated} produktów, ${result.inventoryCreated} rozmiarów magazynowych.`,
          );
          setTimeout(() => setToastMessage(null), 3500);
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.warn(
          "[firebase] Nie udało się utworzyć kolekcji sprzedaży.",
          error instanceof Error ? error.message : "nieznany błąd",
        );
      });

    const unsubscribeOrders = subscribeOrders(
      (nextOrders) => {
        setOrders(nextOrders);
        setOrdersState("ready");
      },
      (error) => {
        console.warn("[firebase] Nie udało się pobrać zamówień.", error.message);
        setOrdersState("error");
      },
    );

    const unsubscribeInventory = subscribeInventory(
      (nextInventory) => {
        setInventory(nextInventory);
        setInventoryState("ready");
      },
      (error) => {
        console.warn("[firebase] Nie udało się pobrać magazynu.", error.message);
        setInventoryState("error");
      },
    );

    return () => {
      cancelled = true;
      unsubscribeOrders();
      unsubscribeInventory();
    };
  }, [user]);

  const stockRows = useMemo<SizeStock[]>(() => {
    const bySize = new Map(inventory.map((entry) => [entry.size, entry]));

    return SIZE_CHART.map((entry) => {
      const stock = bySize.get(entry.size)?.stock ?? 0;
      const status = getStockStatus(stock);

      return {
        size: entry.size,
        diameter: `${entry.diameterMm} mm wewn.`,
        stock,
        status: status.label,
        statusType: status.key,
      };
    });
  }, [inventory]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) => {
      const searchable = [
        order.number,
        order.clientName,
        order.email,
        ...order.items.map((item) => item.name),
      ];

      return searchable.some((value) => value.toLowerCase().includes(query));
    });
  }, [orders, searchQuery]);

  const metrics = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todaysOrders = orders.filter(
      (order) => order.createdAt !== null && order.createdAt >= startOfToday,
    );

    const revenueToday = todaysOrders.reduce(
      (sum, order) => sum + order.subtotal,
      0,
    );

    const sizingKitCount = orders.filter((order) => order.includeSizingKit).length;

    const sizeCounts = new Map<number, number>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        sizeCounts.set(item.size, (sizeCounts.get(item.size) ?? 0) + item.quantity);
      });
    });

    const totalUnits = [...sizeCounts.values()].reduce(
      (sum, count) => sum + count,
      0,
    );

    const topSizes = [...sizeCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([size, count]) => ({
        size,
        share: totalUnits > 0 ? Math.round((count / totalUnits) * 100) : 0,
      }));

    return {
      revenueToday,
      sizingKitCount,
      topSizes,
      todaysOrderCount: todaysOrders.length,
    };
  }, [orders]);

  const stockWarnings = stockRows.filter(
    (row) => row.statusType === "low" || row.statusType === "reorder",
  ).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePushOta = () => {
    setIsOtaModalOpen(true);
    setIsOtaRunning(true);
    setOtaProgress(0);

    const interval = setInterval(() => {
      setOtaProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOtaRunning(false);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleAddStockSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const targetSize = Number.parseInt(String(formData.get("size")), 10);
    const finish = String(formData.get("finish") ?? "Matte Obsidian");
    const addCount = Number.parseInt(String(formData.get("amount")), 10);

    if (!Number.isFinite(targetSize) || !Number.isFinite(addCount) || addCount <= 0) {
      showToast("Podaj poprawny rozmiar i liczbę sztuk w dostawie.");
      return;
    }

    try {
      await receiveStockBatch(targetSize, addCount, finish);
      setIsAddStockOpen(false);
      showToast(
        `Pomyślnie przyjęto partię +${addCount} szt. dla rozmiaru ${targetSize}#!`,
      );
    } catch (error) {
      console.warn(
        "[firebase] Nie udało się przyjąć partii magazynowej.",
        error instanceof Error ? error.message : "nieznany błąd",
      );
      showToast("Nie udało się zapisać dostawy w Firestore.");
    }
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      showToast(
        `Zaktualizowano status zamówienia na „${ORDER_STATUS_LABELS[status]}”.`,
      );
    } catch (error) {
      console.warn(
        "[firebase] Nie udało się zaktualizować statusu zamówienia.",
        error instanceof Error ? error.message : "nieznany błąd",
      );
      showToast("Nie udało się zaktualizować statusu zamówienia w Firestore.");
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-amber-500/40 bg-zinc-950/95 px-4 py-3 text-xs font-medium text-amber-200 shadow-[0_0_30px_rgba(229,184,105,0.2)] animate-in fade-in slide-in-from-top-3">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* ================= LEFT SIDEBAR ================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-zinc-800/80 bg-[#090a0f] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            {/* Brand Logo */}
            <div className="flex h-16 items-center justify-between border-b border-zinc-800/80 px-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/40 bg-linear-to-br from-zinc-800 to-zinc-950 shadow-[0_0_15px_rgba(229,184,105,0.2)] group-hover:border-amber-400">
                  <span className="font-serif text-sm font-bold tracking-wider text-amber-300">
                    A
                  </span>
                  <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-base font-semibold tracking-[0.22em] text-white">
                    AURA
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="text-zinc-400 hover:text-white lg:hidden p-1"
                aria-label="Zamknij menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-3 space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("pulpit")}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium transition cursor-pointer ${
                  activeTab === "pulpit"
                    ? "bg-zinc-800/90 text-white border border-zinc-700/80 shadow-inner"
                    : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-4 w-4 text-amber-400" />
                  <span>Pulpit Główny</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("zamowienia")}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium transition cursor-pointer ${
                  activeTab === "zamowienia"
                    ? "bg-zinc-800/90 text-white border border-zinc-700/80 shadow-inner"
                    : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-zinc-400" />
                  <span>Zamówienia</span>
                </div>
                <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300">
                  {orders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("magazyn")}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium transition cursor-pointer ${
                  activeTab === "magazyn"
                    ? "bg-zinc-800/90 text-white border border-zinc-700/80 shadow-inner"
                    : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Boxes className="h-4 w-4 text-zinc-400" />
                  <span>Magazyn Pierścieni</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("telemetria")}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium transition cursor-pointer ${
                  activeTab === "telemetria"
                    ? "bg-zinc-800/90 text-white border border-zinc-700/80 shadow-inner"
                    : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  <span>Telemetria Klientów</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("salony")}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 font-medium transition cursor-pointer ${
                  activeTab === "salony"
                    ? "bg-zinc-800/90 text-white border border-zinc-700/80 shadow-inner"
                    : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Store className="h-4 w-4 text-zinc-400" />
                  <span>Salony Stacjonarne</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Bottom Sidebar Action: Back to store */}
          <div className="border-t border-zinc-800/80 p-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-amber-300 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-zinc-400 group-hover:text-amber-300" />
              <span>Wróć do sklepu</span>
            </Link>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800/80 bg-[#07080c]/90 px-4 sm:px-8 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="text-zinc-400 hover:text-white lg:hidden p-1.5 rounded-lg border border-zinc-800 bg-zinc-900"
                aria-label="Otwórz menu nawigacji"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
                SYSTEM OPERACYJNY / KONSOLA CENTRALNA
              </div>
            </div>

            {/* Right Action Icons & Administrator Profile */}
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => showToast("Wyszukiwarka globalna gotowa do indeksowania.")}
                className="rounded-full border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                title="Szukaj w systemie"
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => showToast("Brak nowych alertów krytycznych.")}
                className="relative rounded-full border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                title="Powiadomienia telemetryczne"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-400" />
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                <span className="text-xs text-zinc-300 font-medium hidden sm:inline max-w-[16rem] truncate">
                  {user?.email ?? "Administrator"}
                </span>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-zinc-800 text-xs font-semibold text-amber-300 shadow-[0_0_10px_rgba(229,184,105,0.2)]">
                  {getUserInitials(user?.displayName, user?.email)}
                </div>
              </div>
            </div>
          </header>

          {/* Page Body Container */}
          <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
            {/* Title & Action Buttons Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <span>AURA TELEMETRY CLOUD • POŁĄCZENIE AKTYWNE</span>
                </div>
                <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
                  Konsola Monitoringu i Sprzedaży IoT
                </h1>
                <p className="mt-2 text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  Centralne zarządzanie dystrybucją pierścieni biometrycznych AURA Gen 3, procesami
                  przymierzalnika Sizing Kit oraz przepływem danych telemetrycznych.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddStockOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 text-amber-400" />
                  <span>Dodaj partię magazynową</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Wygenerowano raport sprzedaży XLSX (${formatAmount(metrics.revenueToday)}).`,
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Raport sprzedaży</span>
                </button>

                <button
                  type="button"
                  onClick={handlePushOta}
                  className="flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(229,184,105,0.3)] transition hover:bg-amber-300 active:scale-95 cursor-pointer"
                >
                  <Radio className="h-3.5 w-3.5 text-zinc-950" />
                  <span>Push OTA Firmware</span>
                </button>
              </div>
            </div>

            {/* ================= 4 KPI METRIC CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Przychód Dzisiaj */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    <span>PRZYCHÓD DZISIAJ</span>
                    <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      <CreditCard className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-white tracking-tight">
                    {metrics.revenueToday.toLocaleString("pl-PL")}{" "}
                    <span className="text-lg font-sans font-normal text-zinc-400">PLN</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                      <TrendingUp className="h-3 w-3" />
                      {metrics.todaysOrderCount} zamówień
                    </span>
                    <span className="text-zinc-500">złożonych dzisiaj</span>
                  </div>
                </div>

                {/* Sparkline Curve */}
                <div className="mt-4 h-9 w-full">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 160 36">
                    <defs>
                      <linearGradient id="amberSpark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,32 Q25,28 50,22 T100,16 T135,10 T160,4 L160,36 L0,36 Z"
                      fill="url(#amberSpark)"
                    />
                    <path
                      d="M0,32 Q25,28 50,22 T100,16 T135,10 T160,4"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 2: Nowe Zamówienia */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    <span>NOWE ZAMÓWIENIA</span>
                    <div className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                      <ShoppingBag className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-white tracking-tight">
                    {orders.length}{" "}
                    <span className="text-sm font-sans font-normal text-zinc-400">zamówień</span>
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>{metrics.sizingKitCount} z zestawem pomiarowym (Sizing Kit)</span>
                  </div>
                </div>

                {/* Sizing Kit Progress Bar */}
                <div className="mt-5 space-y-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/80 flex">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{
                        width: `${
                          orders.length > 0
                            ? Math.round((metrics.sizingKitCount / orders.length) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Aktywne Pierścienie IoT */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    <span>AKTYWNE PIERŚCIENIE IOT</span>
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Radio className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-white tracking-tight">
                    14 250 <span className="text-sm font-sans font-normal text-zinc-400">online</span>
                  </div>
                  <div className="mt-2 text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>99.82% spójności telemetrii</span>
                  </div>
                </div>

                {/* Pulse wave line */}
                <div className="mt-4 h-9 w-full">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 160 36">
                    <path
                      d="M0,20 L30,20 L40,8 L50,30 L60,14 L70,24 L80,20 L110,20 L120,4 L130,32 L140,16 L150,22 L160,20"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 4: Top Rozmiary Matrycy */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    <span>TOP ROZMIARY MATRYCY</span>
                    <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      <Crown className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="mt-3 font-serif text-3xl font-bold text-amber-200 tracking-tight">
                    {metrics.topSizes.length > 0
                      ? metrics.topSizes
                          .slice(0, 2)
                          .map((item) => `${item.size}#`)
                          .join(" oraz ")
                      : "Brak danych"}
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-400">
                    <strong className="text-zinc-200 font-medium">
                      {metrics.topSizes[0]?.share ?? 0}%
                    </strong>{" "}
                    wolumenu sprzedaży
                  </div>
                </div>

                {/* Breakdown Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5 text-[10px]">
                  {metrics.topSizes.length > 0 ? (
                    metrics.topSizes.map((item) => (
                      <span
                        key={item.size}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 text-zinc-300 font-mono"
                      >
                        {item.size}# ({item.share}%)
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500">Brak sprzedaży w bazie.</span>
                  )}
                </div>
              </div>
            </div>

            {/* ================= MIDDLE ROW: TELEMETRY STREAM & FINISHES ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Panel: Telemetria Czujników PPG i Termometrii (8 cols) */}
              <div className="lg:col-span-8 rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-6 shadow-xl flex flex-col justify-between">
                <div>
                  {/* Panel Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-800/80">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                        BIOMETRIA CZASU RZECZYWISTEGO
                      </span>
                      <h2 className="mt-1 font-serif text-xl font-medium text-white">
                        Synchronizacja Czujników PPG i Termometrii
                      </h2>
                      <p className="mt-1 text-xs text-zinc-400">
                        Zagregowane strumienie z 14 250 aktywnych pierścieni (Tętno, Sen, Kroki, Temp.)
                      </p>
                    </div>

                    {/* Time Range Pills */}
                    <div className="flex items-center gap-1.5 self-start sm:self-center rounded-xl border border-zinc-800 bg-zinc-950 p-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setTimeRange("24h")}
                        className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                          timeRange === "24h"
                            ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Ostatnie 24h
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeRange("7d")}
                        className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                          timeRange === "7d"
                            ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        7 Dni
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeRange("30d")}
                        className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                          timeRange === "30d"
                            ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Miesiąc
                      </button>
                    </div>
                  </div>

                  {/* Telemetry Legend */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        <span>Tętno średnie: <strong className="text-white">64 BPM</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        <span>Regeneracja snu: <strong className="text-white">88%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-indigo-400" />
                        <span>Kroki dobowe: <strong className="text-white">9 417</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE STREAM</span>
                    </div>
                  </div>

                  {/* High Fidelity Multi-Wave SVG Chart */}
                  <div className="mt-6 h-52 w-full relative">
                    <svg className="h-full w-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Subtle Grid horizontal lines */}
                      <line x1="0" y1="40" x2="600" y2="40" stroke="#27272a" strokeWidth="0.8" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="600" y2="90" stroke="#27272a" strokeWidth="0.8" strokeDasharray="3 3" />
                      <line x1="0" y1="140" x2="600" y2="140" stroke="#27272a" strokeWidth="0.8" strokeDasharray="3 3" />

                      {/* Cyan wave Area Fill */}
                      <path
                        d="M0,130 C60,140 100,105 160,110 C220,115 260,70 320,65 C380,60 420,100 480,85 C540,70 570,55 600,60 L600,180 L0,180 Z"
                        fill="url(#cyanGradient)"
                      />

                      {/* Amber Wave Area Fill */}
                      <path
                        d="M0,150 C70,140 120,120 180,125 C240,130 300,95 360,90 C420,85 460,110 520,95 C560,85 580,75 600,80 L600,180 L0,180 Z"
                        fill="url(#amberGradient)"
                      />

                      {/* Cyan Wave Stroke */}
                      <path
                        d="M0,130 C60,140 100,105 160,110 C220,115 260,70 320,65 C380,60 420,100 480,85 C540,70 570,55 600,60"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Amber Wave Stroke */}
                      <path
                        d="M0,150 C70,140 120,120 180,125 C240,130 300,95 360,90 C420,85 460,110 520,95 C560,85 580,75 600,80"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />

                      {/* Interactive Peak Point */}
                      <circle cx="320" cy="65" r="4.5" fill="#22d3ee" stroke="#090a0f" strokeWidth="2" />
                      <circle cx="480" cy="85" r="3.5" fill="#fbbf24" stroke="#090a0f" strokeWidth="2" />
                    </svg>

                    {/* Time Axis Labels */}
                    <div className="mt-2 flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>00:00</span>
                      <span>04:00</span>
                      <span>08:00</span>
                      <span>12:00</span>
                      <span>16:00</span>
                      <span>20:00</span>
                      <span className="text-cyan-400 font-bold">TERAZ</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Accuracy & Telemetry Metric Strip */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                        Czujnik PPG Red/Green
                      </span>
                      <span className="text-xs font-bold text-white">
                        Dokładność 99.4%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Thermometer className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                        Matryca Termometryczna
                      </span>
                      <span className="text-xs font-bold text-white">
                        ± 0.05 °C
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <BatteryCharging className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                        Śr. czas baterii
                      </span>
                      <span className="text-xs font-bold text-white">
                        6.8 Dni
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Wykończenia Tytanowe (4 cols) */}
              <div className="lg:col-span-4 rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                      UDZIAŁ W SPRZEDAŻY
                    </span>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                      Model: Gen 3
                    </span>
                  </div>

                  <h2 className="mt-1 font-serif text-xl font-medium text-white">
                    Wykończenia Tytanowe
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    Preferencje klientów wg luksusowych powłok PVD
                  </p>

                  {/* Ring Image Preview with OLED Display Matrix Label */}
                  <div className="relative my-4 aspect-16/10 w-full overflow-hidden rounded-xl border border-zinc-800 bg-linear-to-b from-zinc-950 to-[#07080c] flex items-center justify-center group">
                    <Image
                      src="/images/ring-image-3.png"
                      alt="Aura Ring OLED Display Matrix"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2.5 left-3 rounded-md border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                      OLED Display Matrix
                    </span>
                  </div>

                  {/* Finishes Percentage Bars */}
                  <div className="space-y-3 pt-2 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-zinc-700" />
                          <span className="text-zinc-300 font-medium">Matte Obsidian Black</span>
                        </div>
                        <span className="font-mono font-bold text-white">52%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/80">
                        <div className="h-full bg-zinc-500 rounded-full" style={{ width: "52%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span className="text-zinc-300 font-medium">Champagne Gold</span>
                        </div>
                        <span className="font-mono font-bold text-white">31%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/80">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: "31%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-zinc-300" />
                          <span className="text-zinc-300 font-medium">Silver Titanium</span>
                        </div>
                        <span className="font-mono font-bold text-white">17%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/80">
                        <div className="h-full bg-zinc-300 rounded-full" style={{ width: "17%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sizing Kit Return Rate Tag */}
                <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs text-emerald-300">
                  <span>Wskaźnik zwrotów z rozmiaru: </span>
                  <strong className="text-emerald-400">&lt; 1.2% (dzięki Sizing Kit)</strong>
                </div>
              </div>
            </div>

            {/* ================= SIZE MATRIX & INVENTORY ================= */}
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-zinc-300">
                    LOGISTYKA MAGAZYNOWA
                  </span>
                  <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                    {stockWarnings} ostrz.
                  </span>
                </div>

                {/* Sort / Filter Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">Sortuj wg:</span>
                  <select
                    value={finishFilter}
                    onChange={(e) => setFinishFilter(e.target.value)}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300 focus:border-amber-400 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Wszystkie wykończenia</option>
                    <option value="matte">Matte Obsidian</option>
                    <option value="gold">Champagne Gold</option>
                    <option value="silver">Silver Titanium</option>
                  </select>
                </div>
              </div>

              <h2 className="font-serif text-lg font-medium text-white">
                Matryca Rozmiarów &amp; Stany Magazynowe
              </h2>
              {inventoryState !== "ready" && (
                <p
                  className={`text-[11px] ${
                    inventoryState === "error" ? "text-red-400" : "text-zinc-500"
                  }`}
                >
                  {inventoryState === "error"
                    ? "Nie udało się pobrać stanów magazynowych z Firestore."
                    : "Wczytywanie stanów magazynowych z Firestore…"}
                </p>
              )}

              {/* 7 Size Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {stockRows.map((item) => (
                  <div
                    key={item.size}
                    className={`rounded-xl p-3.5 border transition-all ${
                      item.statusType === "low"
                        ? "border-red-500/40 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.12)]"
                        : item.statusType === "reorder"
                        ? "border-amber-500/40 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.12)]"
                        : "border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700"
                    }`}
                  >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-base font-bold text-white">
                          {item.size}#
                        </span>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            item.statusType === "low"
                              ? "bg-red-400 animate-pulse"
                              : item.statusType === "reorder"
                              ? "bg-amber-400"
                              : "bg-cyan-400"
                          }`}
                        />
                      </div>

                      <div className="mt-1 text-[11px] text-zinc-500 font-mono">
                        {item.diameter}
                      </div>

                      <div className="mt-3 font-serif text-xl font-bold text-white">
                        {item.stock} <span className="text-xs font-sans text-zinc-400">szt.</span>
                      </div>

                      <div
                        className={`mt-1.5 text-[10px] font-semibold tracking-wider uppercase ${
                          item.statusType === "low"
                            ? "text-red-400"
                            : item.statusType === "reorder"
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* ================= RECENT ORDERS & SIZING KIT CYCLE ================= */}
            <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-cyan-400">
                    TRANSAKCJE BIEŻĄCE
                  </span>
                  <h2 className="mt-1 font-serif text-xl font-medium text-white">
                    Ostatnie Zamówienia &amp; Cykl Sizing Kit
                  </h2>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Szukaj ID, klienta..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-56 sm:w-64 rounded-xl border border-zinc-800 bg-zinc-950 pl-9 pr-3.5 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Filtry zaawansowane zostały zresetowane.")}
                    className="p-2 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700"
                    title="Filtry"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-950/80 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">ID ZAMÓWIENIA</th>
                      <th className="px-4 py-3">KLIENT</th>
                      <th className="px-4 py-3">MODEL &amp; WYKOŃCZENIE</th>
                      <th className="px-4 py-3">ROZMIAR</th>
                      <th className="px-4 py-3">STATUS REALIZACJI</th>
                      <th className="px-4 py-3">KWOTA</th>
                      <th className="px-4 py-3 text-right">AKCJE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-[#0c0d12]">
                    {ordersState !== "ready" && (
                      <tr>
                        <td
                          colSpan={7}
                          className={`px-4 py-6 text-center text-xs ${
                            ordersState === "error" ? "text-red-400" : "text-zinc-500"
                          }`}
                        >
                          {ordersState === "error"
                            ? "Nie udało się pobrać zamówień. Sprawdź konfigurację Firebase i uprawnienia konta administratora."
                            : "Wczytywanie zamówień z Firestore…"}
                        </td>
                      </tr>
                    )}

                    {ordersState === "ready" && filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-xs text-zinc-500">
                          Brak zamówień spełniających kryteria. Nowe zamówienia z koszyka pojawią się
                          tutaj automatycznie.
                        </td>
                      </tr>
                    )}

                    {filteredOrders.map((order) => {
                      const firstItem = order.items[0];

                      return (
                        <tr
                          key={order.id}
                          className="transition-colors hover:bg-zinc-900/40 relative"
                        >
                          <td className="px-4 py-3.5 font-mono font-semibold text-amber-300">
                            #{order.number}
                            <div className="mt-0.5 text-[10px] font-sans font-normal text-zinc-500">
                              {order.createdAt?.toLocaleDateString("pl-PL") ?? "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-white">{order.clientName}</div>
                            <div className="text-[11px] text-zinc-500 font-mono">{order.email}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5 text-zinc-200">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  firstItem
                                    ? FINISH_DOT_COLORS[firstItem.finish]
                                    : "bg-zinc-600"
                                }`}
                              />
                              <span>{firstItem?.name ?? "Brak pozycji"}</span>
                            </div>
                            {firstItem && (
                              <div className="mt-0.5 text-[11px] text-zinc-500">
                                {firstItem.finishName}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="rounded bg-zinc-800/80 px-2 py-0.5 text-[11px] text-zinc-300 font-mono">
                              {getOrderSizeLabel(order)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${ORDER_STATUS_BADGE_CLASSES[order.status]}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              <span>{ORDER_STATUS_LABELS[order.status]}</span>
                            </span>
                            <select
                              value={order.status}
                              onChange={(event) =>
                                void handleStatusChange(
                                  order.id,
                                  event.target.value as OrderStatus,
                                )
                              }
                              className="mt-1.5 block w-full max-w-60 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-[11px] text-zinc-300 focus:border-amber-400 focus:outline-none cursor-pointer"
                              aria-label={`Zmień status zamówienia ${order.number}`}
                            >
                              {ORDER_STATUS_FLOW.map((status) => (
                                <option key={status} value={status}>
                                  {ORDER_STATUS_LABELS[status]}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3.5 font-mono font-bold text-white">
                            {formatAmount(order.subtotal)}
                          </td>
                          <td className="px-4 py-3.5 text-right relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveOrderMenu(
                                  activeOrderMenu === order.id ? null : order.id,
                                )
                              }
                              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
                              aria-label={`Akcje dla zamówienia ${order.number}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {activeOrderMenu === order.id && (
                              <div className="absolute right-4 top-10 z-20 w-44 rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl text-left text-xs animate-in fade-in zoom-in-95">
                                <button
                                  type="button"
                                  onClick={() => {
                                    showToast(`Podgląd telemetrii dla ${order.clientName}`);
                                    setActiveOrderMenu(null);
                                  }}
                                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                >
                                  Telemetria pierścienia
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    showToast(`Wysłano powiadomienie do ${order.email}`);
                                    setActiveOrderMenu(null);
                                  }}
                                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                >
                                  Wyślij SMS / E-mail
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    showToast(`Szczegóły wysyłki #${order.number}`);
                                    setActiveOrderMenu(null);
                                  }}
                                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-amber-300 hover:bg-zinc-800"
                                >
                                  Etykieta kurierska DPD
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-zinc-500">
                <div>
                  Wyświetlono {filteredOrders.length} z {orders.length} zamówień
                </div>
                <div className="flex items-center gap-1.5 self-center">
                  <button
                    type="button"
                    onClick={() => showToast("Poprzednia strona zamówień")}
                    className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white text-xs cursor-pointer"
                  >
                    Poprzednia
                  </button>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-zinc-950 font-mono">
                    1
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast("Przejście do strony 2")}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400 hover:text-white font-mono cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Przejście do strony 3")}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400 hover:text-white font-mono cursor-pointer"
                  >
                    3
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("Następna strona zamówień")}
                    className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white text-xs cursor-pointer"
                  >
                    Następna
                  </button>
                </div>
              </div>
            </div>

            {/* ================= PHYSICAL SHOWROOMS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Showroom 1 */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-amber-400" />
                      <h3 className="font-serif text-base font-medium text-white">
                        Aura Boutique Warszawa
                      </h3>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      Otwarta
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">
                    ul. Mokotowska 49, Warszawa
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-800/80 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Stacje pomiaru na miejscu:</span>
                    <strong className="text-zinc-200">4 / 4 aktywne</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Dzisiejsze konsultacje:</span>
                    <strong className="text-amber-300">28 osób</strong>
                  </div>
                </div>
              </div>

              {/* Showroom 2 */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-amber-400" />
                      <h3 className="font-serif text-base font-medium text-white">
                        Aura Lounge Kraków
                      </h3>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      Otwarta
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">
                    Pasaż 13, Rynek Główny, Kraków
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-800/80 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Stacje pomiaru na miejscu:</span>
                    <strong className="text-zinc-200">3 / 3 aktywne</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Dzisiejsze konsultacje:</span>
                    <strong className="text-amber-300">19 osób</strong>
                  </div>
                </div>
              </div>

              {/* Showroom 3 */}
              <div className="rounded-2xl border border-zinc-800/90 bg-[#0d0e14] p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-amber-400" />
                      <h3 className="font-serif text-base font-medium text-white">
                        Aura Studio Gdańsk
                      </h3>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      Otwarta
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">
                    Długi Targ 18, Gdańsk
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-800/80 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Stacje pomiaru na miejscu:</span>
                    <strong className="text-zinc-200">2 / 2 aktywne</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Dzisiejsze konsultacje:</span>
                    <strong className="text-amber-300">14 osób</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ================= MODAL: ADD STOCK BATCH ================= */}
      {isAddStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddStockOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300">
                  <Plus className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-lg font-medium text-white">
                  Dodaj Partię Magazynową
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStockOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1.5">Wybierz rozmiar pierścienia:</label>
                <select
                  name="size"
                  defaultValue="9#"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  {stockRows.map((s) => (
                    <option key={s.size} value={s.size}>
                      Rozmiar {s.size}# ({s.diameter}) — Aktualny stan: {s.stock} szt.
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1.5">Wykończenie tytanowe:</label>
                <select
                  name="finish"
                  defaultValue="Matte Obsidian"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Matte Obsidian">Matte Obsidian Black (PVD)</option>
                  <option value="Champagne Gold">Champagne Gold (PVD)</option>
                  <option value="Silver Titanium">Silver Titanium (Surowy Tytan)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1.5">Liczba sztuk w dostawie:</label>
                <input
                  type="number"
                  name="amount"
                  defaultValue={50}
                  min={1}
                  max={500}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddStockOpen(false)}
                  className="rounded-xl border border-zinc-800 px-4 py-2.5 text-xs text-zinc-400 hover:text-white"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="rounded-xl border border-amber-400 bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition"
                >
                  Zatwierdź przyjęcie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PUSH OTA FIRMWARE ================= */}
      {isOtaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => !isOtaRunning && setIsOtaModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
                  <Radio className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-lg font-medium text-white">
                  OTA Firmware Update
                </h3>
              </div>
              {!isOtaRunning && (
                <button
                  type="button"
                  onClick={() => setIsOtaModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Docelowa wersja oprogramowania:</span>
                  <span className="font-mono font-bold text-amber-300">AURA-OS v3.4.12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Adresaci (aktywne pierścienie):</span>
                  <span className="font-mono text-cyan-300 font-bold">14 250 urządzeń</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Protokół transmisji:</span>
                  <span className="text-zinc-200">BLE 5.3 Encrypted / Cloud Queue</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-400">Postęp dystrybucji paczki:</span>
                  <span className="font-mono font-bold text-cyan-400">{otaProgress}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full bg-linear-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
                    style={{ width: `${otaProgress}%` }}
                  />
                </div>
              </div>

              {otaProgress === 100 && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Wszystkie pierścienie otrzymały paczkę OTA v3.4.12.</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isOtaRunning}
                  onClick={() => setIsOtaModalOpen(false)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {otaProgress === 100 ? "Zakończ" : "Ukryj"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
