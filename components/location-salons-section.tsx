"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Clock,
  Store,
  Navigation,
  Contact,
  Wrench,
  RefreshCcw,
  ShieldCheck,
  ArrowRight,
  Check,
  MapPinned,
} from "lucide-react";
import { SALONS } from "@/lib/data";

// Leaflet wymaga `window`, dlatego mapa ładowana jest wyłącznie po stronie klienta
const LocationMap = dynamic(() => import("@/components/location-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0d12]">
      <MapPinned className="h-7 w-7 animate-pulse text-amber-400 motion-reduce:animate-none" />
      <p className="text-xs text-zinc-500">Ładowanie mapy salonów…</p>
    </div>
  ),
});

const CITY_FILTERS = [
  { id: "all", label: "Wszystkie" },
  { id: "Warszawa", label: "Warszawa" },
  { id: "Kraków", label: "Kraków" },
  { id: "Wrocław", label: "Wrocław" },
  { id: "Gdańsk", label: "Gdańsk" },
];

const MAP_PERKS = [
  {
    icon: Wrench,
    title: "Przymiarki 24h",
    description: "Zabierz testowy pierścień z tworzywa do domu na noc.",
  },
  {
    icon: RefreshCcw,
    title: "Wymiana od ręki",
    description:
      "Bezpłatna zamiana rozmiaru w salonie w ciągu 30 dni.",
  },
  {
    icon: ShieldCheck,
    title: "Prywatność danych",
    description: "Szyfrowanie biometryczne end-to-end zgodne z RODO.",
  },
];

export function LocationSalonsSection() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [selectedId, setSelectedId] = useState(SALONS[0].id);

  const filteredSalons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SALONS.filter((salon) => {
      const matchesCity = city === "all" || salon.city === city;
      const matchesQuery =
        !q ||
        salon.name.toLowerCase().includes(q) ||
        salon.city.toLowerCase().includes(q) ||
        salon.address.toLowerCase().includes(q) ||
        salon.tag.toLowerCase().includes(q);
      return matchesCity && matchesQuery;
    });
  }, [query, city]);

  const selectedSalon =
    filteredSalons.find((salon) => salon.id === selectedId) ??
    filteredSalons[0] ??
    SALONS[0];

  const navigationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${selectedSalon.name}, ${selectedSalon.address}`
  )}`;

  return (
    <section
      id="salony"
      className="relative border-b border-zinc-800/80 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search & Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Szukaj salonu wg ulicy, kodu pocztowego lub miasta..."
              aria-label="Szukaj salonu"
              className="w-full rounded-full border border-zinc-800 bg-zinc-900/70 py-3 pr-4 pl-11 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500/60 focus:outline-none"
            />
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filtruj salony według miasta"
          >
            {CITY_FILTERS.map((filter) => {
              const isActive = city === filter.id;
              const count =
                filter.id === "all"
                  ? SALONS.length
                  : SALONS.filter((salon) => salon.city === filter.id).length;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setCity(filter.id)}
                  aria-pressed={isActive}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? "border border-amber-400 bg-amber-400 text-zinc-950 font-bold"
                      : "border border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {filter.label}
                  {filter.id === "all" && ` (${count})`}
                </button>
              );
            })}
            <span
              className="cursor-not-allowed rounded-full border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-2 text-xs font-medium text-zinc-500"
              title="Salon w Poznaniu już wkrótce"
            >
              Poznań
              <span className="ml-1.5 text-[10px] font-bold tracking-wider text-amber-500/70">
                WKRÓTCE
              </span>
            </span>
          </div>
        </div>

        {/* Salons List + Map */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Salons List */}
          <div className="lg:col-span-5">
            <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
              <span className="font-semibold uppercase tracking-wider">
                Dostępne salony
              </span>
              <span>
                {filteredSalons.length} z {SALONS.length}
              </span>
            </div>

            <div className="flex max-h-none flex-col gap-4 lg:max-h-[620px] lg:overflow-y-auto lg:pr-1">
              {filteredSalons.length === 0 && (
                <div className="rounded-2xl border border-dashed border-zinc-800 bg-[#0d0e14] p-8 text-center">
                  <MapPin className="mx-auto h-6 w-6 text-zinc-600" />
                  <p className="mt-3 text-sm text-zinc-300">
                    Nie znaleziono salonu pasującego do zapytania.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCity("all");
                    }}
                    className="mt-3 text-xs font-semibold text-amber-400 transition hover:text-amber-300 cursor-pointer"
                  >
                    Wyczyść filtry
                  </button>
                </div>
              )}

              {filteredSalons.map((salon) => {
                const isSelected = salon.id === selectedSalon.id;
                return (
                  <article
                    key={salon.id}
                    className={`rounded-2xl border p-5 transition ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/5 shadow-[0_0_25px_rgba(229,184,105,0.1)]"
                        : "border-zinc-800 bg-[#0d0e14] hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-medium text-white">
                        {salon.name}
                      </h3>
                      {isSelected && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold tracking-wider text-amber-300">
                          <Check className="h-3 w-3" />
                          WYBRANY
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-amber-300">
                        {salon.tag}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-[10px] font-medium text-zinc-300">
                        <Clock className="h-3 w-3 text-emerald-400" />
                        {salon.hours}
                      </span>
                    </div>

                    <p className="mt-3 flex items-start gap-2 text-xs text-zinc-400">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
                      <span>{salon.address}</span>
                    </p>

                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {salon.details.map((detail) => (
                        <li
                          key={detail}
                          className="rounded-md bg-zinc-900/80 px-2 py-1 text-[10px] text-zinc-400"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4">
                      <button
                        type="button"
                        onClick={() => setSelectedId(salon.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 transition hover:text-amber-300 cursor-pointer"
                      >
                        <span>Wybierz ten salon</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href="#rezerwacja"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400 bg-amber-400 px-4 py-2 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 active:scale-95"
                      >
                        Rezerwuj wizytę
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right: Live Map (OpenStreetMap via Leaflet) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0d12] sm:aspect-[16/11]">
              <LocationMap
                salons={filteredSalons}
                selectedId={selectedSalon.id}
                onSelect={setSelectedId}
              />

              {/* Status pills (top right) */}
              <div className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/90 px-3 py-1.5 text-[11px] text-zinc-300 backdrop-blur">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  Czas oczekiwania:
                  <span className="font-semibold text-emerald-400">
                    Brak kolejki
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-zinc-950/90 px-3 py-1.5 text-[11px] text-emerald-300 backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Aktywny salon stacjonarny
                </span>
              </div>

              {/* Bottom overlay card */}
              <div className="absolute inset-x-3 bottom-9 z-10 rounded-xl border border-zinc-700/80 bg-zinc-950/92 p-4 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
                      <Store className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {selectedSalon.mapLabel}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {selectedSalon.name}, {selectedSalon.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={navigationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900/90 px-3.5 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-600 hover:text-white"
                    >
                      <Navigation className="h-3.5 w-3.5 text-amber-400" />
                      Nawiguj
                    </a>
                    <Link
                      href="#rezerwacja"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400 bg-amber-400 px-3.5 py-2 text-xs font-bold text-zinc-950 transition hover:bg-amber-300"
                    >
                      <Contact className="h-3.5 w-3.5" />
                      Wizytówka
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Map perks */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {MAP_PERKS.map((perk) => (
                <div
                  key={perk.title}
                  className="rounded-xl border border-zinc-800 bg-[#0d0e14] p-4"
                >
                  <perk.icon className="h-4.5 w-4.5 text-amber-400" />
                  <p className="mt-2 text-xs font-semibold text-white">
                    {perk.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                    {perk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
