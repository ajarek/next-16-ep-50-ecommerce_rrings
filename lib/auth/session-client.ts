import type { User } from "firebase/auth";

export interface SessionSyncResult {
  isAdmin: boolean;
}

function readIsAdmin(payload: unknown): boolean {
  if (typeof payload !== "object" || payload === null) return false;
  if (!("isAdmin" in payload)) return false;

  return payload.isAdmin === true;
}

/**
 * Przekazuje Firebase ID Token do Route Handlera, który weryfikuje go
 * i ustawia httpOnly cookie sesyjne. Dzięki temu serwer może chronić /admin.
 */
export async function syncServerSession(
  user: User,
): Promise<SessionSyncResult> {
  try {
    const idToken = await user.getIdToken();

    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    });

    if (!response.ok) return { isAdmin: false };

    const payload: unknown = await response.json();
    return { isAdmin: readIsAdmin(payload) };
  } catch (error) {
    console.warn(
      "[auth] Nie udało się odświeżyć sesji serwerowej.",
      error instanceof Error ? error.message : "nieznany błąd",
    );
    return { isAdmin: false };
  }
}

export async function clearServerSession(): Promise<void> {
  try {
    await fetch("/api/auth/session", {
      method: "DELETE",
      cache: "no-store",
    });
  } catch (error) {
    console.warn(
      "[auth] Nie udało się wyczyścić sesji serwerowej.",
      error instanceof Error ? error.message : "nieznany błąd",
    );
  }
}
