# AURA RING — sklep Next.js 16

Aplikacja e-commerce z App Router, TypeScript, Tailwind CSS v4 i Firebase.

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja działa pod [http://localhost:3000](http://localhost:3000).

## Konfiguracja Firebase

1. W konsoli Firebase utwórz projekt i aplikację sieciową.
2. W **Authentication → Sign-in method** włącz:
   - **Google**,
   - **Email/Password**.
3. W **Authentication → Settings → Authorized domains** dodaj `localhost`
   oraz domenę produkcyjną.
4. Utwórz bazę **Cloud Firestore** i wdróż reguły z pliku
   [`firestore.rules`](./firestore.rules) (konsola Firebase lub
   `firebase deploy --only firestore:rules`).
5. Skopiuj `.env.example` do `.env.local` i uzupełnij wartości z
   **Ustawienia projektu → Ogólne → Twoje aplikacje**:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ADMIN_EMAIL=
```

`ADMIN_EMAIL` wskazuje jedyne konto z dostępem do `/admin`. Domyślnie
używane jest konto `ajarek2101@gmail.com`. Wartość jest sprawdzana
wyłącznie po stronie serwera.

## Uwierzytelnianie i dostęp administratora

- Logowanie i rejestracja obsługują **Google** oraz **e-mail/hasło**
  (`context/auth-context.tsx`, strony `/logowanie` i `/rejestracja`).
- Profile użytkowników są zapisywane w Firestore w kolekcji `users/{uid}`
  (`lib/firebase/users.ts`). Reguły pozwalają czytać i edytować wyłącznie
  własny dokument; administrator ma tylko odczyt.
- Po zalogowaniu klient przekazuje Firebase ID Token do
  `POST /api/auth/session`. Token jest weryfikowany w Google Identity
  Toolkit (`accounts:lookup`) i zapisywany jako **httpOnly cookie**
  `aura_session`. Dzięki temu `app/admin/layout.tsx` może odrzucić
  nieuprawnione żądanie jeszcze przed wyrenderowaniem konsoli.
- Wylogowanie czyści sesję Firebase i cookie serwerowe.
- Strony `/admin`, `/logowanie` i `/rejestracja` nie są indeksowane.

## Przydatne skrypty

```bash
npm run dev    # serwer deweloperski
npm run build  # build produkcyjny
npm run start  # uruchomienie builda
npm run lint   # ESLint
```
