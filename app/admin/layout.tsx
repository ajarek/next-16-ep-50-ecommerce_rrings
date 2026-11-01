import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konsola Monitoringu i Sprzedaży IoT | AURA TELEMETRY CLOUD",
  description:
    "Centralne zarządzanie dystrybucją pierścieni biometrycznych AURA Gen 3, procesami przymierzalnika Sizing Kit oraz przepływem danych telemetrycznych.",
};

export default function TechnologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

