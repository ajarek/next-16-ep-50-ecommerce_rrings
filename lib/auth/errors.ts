const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Nieprawidłowy e-mail lub hasło. Spróbuj ponownie.",
  "auth/invalid-login-credentials":
    "Nieprawidłowy e-mail lub hasło. Spróbuj ponownie.",
  "auth/user-not-found": "Nie znaleziono konta z tym adresem e-mail.",
  "auth/wrong-password": "Nieprawidłowe hasło. Spróbuj ponownie.",
  "auth/invalid-email": "Podaj poprawny adres e-mail.",
  "auth/user-disabled": "To konto zostało zablokowane. Skontaktuj się z obsługą.",
  "auth/email-already-in-use": "Konto z tym adresem e-mail już istnieje.",
  "auth/weak-password": "Hasło jest zbyt słabe. Użyj co najmniej 8 znaków.",
  "auth/account-exists-with-different-credential":
    "Konto z tym adresem istnieje i używa innej metody logowania.",
  "auth/credential-already-in-use": "Ten sposób logowania jest już przypisany do innego konta.",
  "auth/popup-closed-by-user": "Logowanie Google zostało przerwane. Spróbuj ponownie.",
  "auth/cancelled-popup-request": "Poprzednie logowanie Google zostało anulowane.",
  "auth/popup-blocked":
    "Przeglądarka zablokowała okno logowania Google. Zezwól na wyskakujące okna i spróbuj ponownie.",
  "auth/operation-not-allowed":
    "Ta metoda logowania nie jest włączona w konfiguracji Firebase.",
  "auth/too-many-requests":
    "Zbyt wiele prób logowania. Odczekaj chwilę i spróbuj ponownie.",
  "auth/network-request-failed":
    "Brak połączenia z siecią. Sprawdź internet i spróbuj ponownie.",
  "auth/unauthorized-domain":
    "Ta domena nie jest autoryzowana w Firebase Authentication.",
  "auth/requires-recent-login": "Ze względów bezpieczeństwa zaloguj się ponownie.",
  "auth/missing-email": "Podaj adres e-mail.",
};

function readErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  if (!("code" in error)) return null;

  return typeof error.code === "string" ? error.code : null;
}

/** Tłumaczy kody błędów Firebase na komunikaty zrozumiałe dla użytkownika. */
export function getAuthErrorMessage(error: unknown): string {
  const code = readErrorCode(error);

  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }

  return "Nie udało się zakończyć operacji. Spróbuj ponownie za chwilę.";
}
