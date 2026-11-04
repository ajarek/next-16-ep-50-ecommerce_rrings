import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  isAdminUser,
  SESSION_COOKIE_NAME,
  verifyIdToken,
} from "@/lib/firebase/server";

const MAX_TOKEN_LENGTH = 4096;

function readIdToken(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  if (!("idToken" in payload)) return null;

  const idToken = payload.idToken;
  return typeof idToken === "string" && idToken.length > 0 ? idToken : null;
}

/**
 * Weryfikuje token po stronie Google i dopiero wtedy zapisuje httpOnly cookie.
 * Cookie nie jest dowodem tożsamości bez tej weryfikacji.
 */
export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe dane żądania." },
      { status: 400 },
    );
  }

  const idToken = readIdToken(payload);

  if (!idToken || idToken.length > MAX_TOKEN_LENGTH) {
    return NextResponse.json(
      { error: "Brak prawidłowego tokenu uwierzytelniającego." },
      { status: 400 },
    );
  }

  const user = await verifyIdToken(idToken);

  if (!user) {
    return NextResponse.json(
      { error: "Sesja wygasła lub token jest nieprawidłowy." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    user: {
      displayName: user.displayName,
      email: user.email,
    },
    isAdmin: isAdminUser(user),
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: idToken,
    ...getSessionCookieOptions(),
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    ...getSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
