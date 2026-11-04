import type { User } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

/**
 * Utrzymuje profil w kolekcji users/{uid}. Dane są zapisywane z merge,
 * więc nie nadpisują przyszłych pól (np. preferencji użytkownika).
 * Błąd zapisu nie blokuje logowania — reguły Firestore decydują o dostępie.
 */
export async function syncUserProfile(user: User): Promise<void> {
  try {
    await setDoc(
      doc(getFirebaseDb(), "users", user.uid),
      {
        email: user.email ?? "",
        displayName:
          user.displayName?.trim() ||
          user.email?.split("@")[0] ||
          "Klient AURA",
        photoURL: user.photoURL,
        lastLoginAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.warn(
      "[firebase] Nie udało się zsynchronizować profilu użytkownika.",
      error instanceof Error ? error.message : "nieznany błąd",
    );
  }
}
