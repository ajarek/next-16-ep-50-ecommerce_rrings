/**
 * Moduł przeznaczony wyłącznie do użycia po stronie serwera.
 * Weryfikuje Firebase ID Token przez Google Identity Toolkit (accounts:lookup),
 * dzięki czemu nie wymaga klucza Service Account Firebase Admin SDK.
 * Nie importuj tego pliku w Client Components.
 */
import { cookies } from "next/headers";
import { cache } from "react";

export const SESSION_COOKIE_NAME = "aura_session";
export const SESSION_MAX_AGE_SECONDS = 55 * 60;

const DEFAULT_ADMIN_EMAIL = "ajarek2101@gmail.com";
const IDENTITY_TOOLKIT_LOOKUP_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:lookup";

export interface SessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL).toLowerCase();
}

export function isAdminUser(
  user: Pick<SessionUser, "email"> | null | undefined,
): boolean {
  return (
    typeof user?.email === "string" &&
    user.email.trim().toLowerCase() === getAdminEmail()
  );
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function toSessionUser(rawUser: unknown): SessionUser | null {
  if (typeof rawUser !== "object" || rawUser === null) return null;

  const uid = "localId" in rawUser ? readString(rawUser.localId) : null;
  if (!uid) return null;

  return {
    uid,
    email: "email" in rawUser ? readString(rawUser.email) : null,
    displayName:
      "displayName" in rawUser ? readString(rawUser.displayName) : null,
    photoURL: "photoUrl" in rawUser ? readString(rawUser.photoUrl) : null,
    emailVerified:
      "emailVerified" in rawUser && rawUser.emailVerified === true,
  };
}

function readFirstLookupUser(payload: unknown): unknown {
  if (typeof payload !== "object" || payload === null) return null;
  if (!("users" in payload)) return null;

  const users = payload.users;
  return Array.isArray(users) && users.length > 0 ? users[0] : null;
}

/**
 * Sprawdza podpis, ważność i właściciela tokenu po stronie Google.
 * Zwraca dane użytkownika tylko dla tokenu aktywnego w projekcie Firebase.
 */
export async function verifyIdToken(
  idToken: string,
): Promise<SessionUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    console.error("[auth] Brak NEXT_PUBLIC_FIREBASE_API_KEY — nie można zweryfikować sesji.");
    return null;
  }

  try {
    const response = await fetch(`${IDENTITY_TOOLKIT_LOOKUP_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload: unknown = await response.json();
    return toSessionUser(readFirstLookupUser(payload));
  } catch (error) {
    console.error(
      "[auth] Weryfikacja tokenu nie powiodła się.",
      error instanceof Error ? error.message : "nieznany błąd",
    );
    return null;
  }
}

/** Zwraca zalogowanego użytkownika na podstawie cookie sesyjnego (raz na żądanie). */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const idToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!idToken) return null;

  return verifyIdToken(idToken);
});

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
