"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Salon } from "@/types";

// Darmowe i otwarte kafelki OpenStreetMap — bez klucza API.
// Wymagana jest atrybucja © OpenStreetMap contributors.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const CITY_ZOOM = 13;
const POLAND_CENTER: L.LatLngTuple = [52.2, 19.5];
const POLAND_ZOOM = 6;

interface LocationMapProps {
  salons: Salon[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createMarkerIcon(salon: Salon, isSelected: boolean): L.DivIcon {
  const pinBackground = isSelected ? "#fbbf24" : "#27272a";
  const pinBorder = isSelected ? "#fde68a" : "#52525b";
  const pinColor = isSelected ? "#18181b" : "#d4d4d8";
  const pinShadow = isSelected
    ? "0 0 20px rgba(229,184,105,0.75)"
    : "0 4px 12px rgba(0,0,0,0.55)";
  const labelBackground = isSelected ? "rgba(9,9,11,0.95)" : "rgba(9,9,11,0.85)";
  const labelBorder = isSelected
    ? "rgba(229,184,105,0.55)"
    : "rgba(63,63,70,0.9)";
  const labelColor = isSelected ? "#fde68a" : "#a1a1aa";

  const pinSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

  return L.divIcon({
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: `
      <div style="position:relative;width:36px;height:36px;">
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:${pinBackground};border:2px solid ${pinBorder};box-shadow:${pinShadow};color:${pinColor};">
          ${pinSvg}
        </div>
        <div style="position:absolute;top:44px;left:50%;transform:translateX(-50%);white-space:nowrap;background:${labelBackground};border:1px solid ${labelBorder};color:${labelColor};border-radius:6px;padding:4px 8px;font-size:10px;font-weight:500;line-height:1;box-shadow:0 4px 10px rgba(0,0,0,0.45);">
          ${salon.mapLabel}
        </div>
      </div>`,
  });
}

export default function LocationMap({
  salons,
  selectedId,
  onSelect,
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  const prevViewKey = useRef<string | null>(null);
  const prevSelectedId = useRef<string | null>(null);

  // Zawsze aktualny callback bez ponownego inicjalizowania mapy
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Inicjalizacja mapy. Cleanup usuwa instancję Leafleta i zwalnia kontener,
  // dzięki czemu ponowne montowanie (React StrictMode) tworzy czystą mapę.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: POLAND_CENTER,
      zoom: POLAND_ZOOM,
      scrollWheelZoom: false,
      zoomControl: false,
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "topleft" }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Synchronizacja markerów i widoku z aktualnym filtrem oraz wyborem salonu
  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    const reduceMotion = prefersReducedMotion();
    const viewKey = salons.map((salon) => salon.id).join(",");
    const isFirstRender = prevViewKey.current === null;
    const viewChanged = prevViewKey.current !== viewKey;
    const selectionChanged = prevSelectedId.current !== selectedId;

    prevViewKey.current = viewKey;
    prevSelectedId.current = selectedId;

    // Odbudowa markerów
    markersLayer.clearLayers();
    salons.forEach((salon) => {
      const isSelected = salon.id === selectedId;
      const marker = L.marker([salon.lat, salon.lng], {
        icon: createMarkerIcon(salon, isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
        title: salon.mapLabel,
        alt: salon.mapLabel,
      });

      marker.on("click", () => onSelectRef.current(salon.id));
      markersLayer.addLayer(marker);
    });

    if (salons.length === 0) return;

    const goToSalon = (salon: Salon) => {
      const latlng: L.LatLngTuple = [salon.lat, salon.lng];
      if (reduceMotion) {
        map.setView(latlng, CITY_ZOOM, { animate: false });
      } else {
        map.flyTo(latlng, CITY_ZOOM, { duration: 0.9 });
      }
    };

    const fitAll = () => {
      const bounds = L.latLngBounds(
        salons.map((salon): L.LatLngTuple => [salon.lat, salon.lng])
      );
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 11,
        animate: !isFirstRender && !reduceMotion,
      });
    };

    if (isFirstRender || viewChanged) {
      // Pierwszy render lub zmiana filtra/wyszukiwarki
      if (salons.length === 1) {
        goToSalon(salons[0]);
      } else {
        fitAll();
      }
    } else if (selectionChanged) {
      const selected = salons.find((salon) => salon.id === selectedId);
      if (selected) goToSalon(selected);
    }
  }, [salons, selectedId]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full bg-[#0b0d12]"
    />
  );
}
