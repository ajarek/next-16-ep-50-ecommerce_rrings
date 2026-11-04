import { connection } from "next/server";
import TechnologyConsolePage from "@/components/admin/admin-console";

// Widok admina czeka na weryfikację sesji — świadomie blokujemy nawigację.
export const instant = false;

/**
 * Konsola korzysta z danych klienckich i nie może zostać wyprerenderowana.
 * `connection()` gwarantuje, że jej HTML powstaje dopiero po sprawdzeniu
 * sesji w layoucie — statyczna powłoka nie zawiera widoku administratora.
 */
export default async function AdminPage() {
  await connection();

  return <TechnologyConsolePage />;
}
