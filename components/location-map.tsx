"use client";

import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  AttributionControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Salon } from "@/types";

// Darmowe i otwarte kafelki OpenStreetMap — bez klucza API.
// Wymagana jest atrybucja © OpenStreetMap contributors.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const CITY_ZOOM = 13;

interface LocationMapProps {
  salons: Salon[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
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

function MapController({
  salons,
  selectedId,
}: {
  salons: Salon[];
  selectedId: string;
}) {
  const map = useMap();
  const prevViewKey = useRef<string | null>(null);
  const prevSelectedId = useRef<string | null>(null);

  useEffect(() => {
    const viewKey = salons.map((salon) => salon.id).join(",");
    const isFirstRender = prevViewKey.current === null;
    const viewChanged = prevViewKey.current !== viewKey;
    const selectionChanged = prevSelectedId.current !== selectedId;
    prevViewKey.current = viewKey;
    prevSelectedId.current = selectedId;

    if (salons.length === 0) return;

    const reduceMotion = prefersReducedMotion();

    const fitAll = () => {
      const bounds = L.latLngBounds(
        salons.map((salon): L.LatLngTuple => [salon.lat, salon.lng])
      );
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 11,
        animate: !reduceMotion,
      });
    };

    const goToSalon = (salon: Salon) => {
      const latlng: L.LatLngTuple = [salon.lat, salon.lng];
      if (reduceMotion) {
        map.setView(latlng, CITY_ZOOM, { animate: false });
      } else {
        map.flyTo(latlng, CITY_ZOOM, { duration: 0.9 });
      }
    };

    if (isFirstRender) {
      // Pierwszy widok: wszystkie widoczne salony naraz
      fitAll();
    } else if (viewChanged) {
      // Zmiana filtra/wyszukiwarki: dopasuj widok do wyników
      if (salons.length === 1) {
        goToSalon(salons[0]);
      } else {
        fitAll();
      }
    } else if (selectionChanged) {
      const selected = salons.find((salon) => salon.id === selectedId);
      if (selected) goToSalon(selected);
    }
  }, [salons, selectedId, map]);

  return null;
}

export default function LocationMap({
  salons,
  selectedId,
  onSelect,
}: LocationMapProps) {
  const initialSalon =
    salons.find((salon) => salon.id === selectedId) ?? salons[0];
  const center: L.LatLngTuple = initialSalon
    ? [initialSalon.lat, initialSalon.lng]
    : [52.2, 19.5];

  return (
    <MapContainer
      center={center}
      zoom={initialSalon ? CITY_ZOOM : 6}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      className="absolute inset-0 z-0 h-full w-full"
    >
      <TileLayer
        url={TILE_URL}
        attribution={TILE_ATTRIBUTION}
        maxZoom={19}
      />
      <ZoomControl position="topleft" />
      <AttributionControl position="bottomright" prefix="" />
      <MapController salons={salons} selectedId={selectedId} />
      {salons.map((salon) => {
        const isSelected = salon.id === selectedId;
        return (
          <Marker
            key={`${salon.id}-${isSelected}`}
            position={[salon.lat, salon.lng]}
            icon={createMarkerIcon(salon, isSelected)}
            zIndexOffset={isSelected ? 1000 : 0}
            eventHandlers={{ click: () => onSelect(salon.id) }}
          />
        );
      })}
    </MapContainer>
  );
}
