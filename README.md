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

## Kolekcje Firestore i system sprzedaży

Sprzedaż, magazyn i konsola administratora korzystają z tych samych kolekcji
Firestore:

- `products/{productId}` — katalog sklepu (nazwa, wykończenie, opis, cena,
  dostępne rozmiary, zdjęcie, `sortOrder`, `active`). Odczyt jest publiczny,
  zapis wyłącznie dla administratora. Sklep pokazuje katalog z Firestore, a
  dopóki kolekcja jest pusta, korzysta z danych w `lib/data.ts`.
- `inventory/{size}` — stan magazynowy dla rozmiaru (7–13), średnica i
  obwód. Odczyt i zapis wyłącznie dla administratora.
- `orders/{orderId}` — zamówienia składane z koszyka: pozycje, kwota, opcja
  Sizing Kit, status realizacji. Klient widzi tylko własne zamówienia,
  administrator czyta wszystkie i zmienia `status`.
- `users/{uid}` — profile użytkowników (patrz niżej).

Kolekcje `products` i `inventory` tworzą się automatycznie przy pierwszym
wejściu na `/admin` — zadanie `seedSalesCatalog()` (`lib/firebase/catalog.ts`)
uzupełnia brakujące dokumenty, nie nadpisując istniejących. Kolejne wejścia
niczego nie zmieniają.

Finalizacja zamówienia wymaga zalogowania. Zamówienie trafia do `orders` i
pojawia się w konsoli administratora na żywo (`onSnapshot`), podobnie jak
stany magazynowe. Przyjęcie partii w konsoli zwiększa stan atomowo
(`increment`).

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
