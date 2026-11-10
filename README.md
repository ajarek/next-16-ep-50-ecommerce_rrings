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

# Płatności Stripe (Test Mode)
STRIPE_SECRET_KEY=rk_test_... # lub sk_test_... (klucz serwerowy)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # opcjonalnie do weryfikacji webhooków
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`ADMIN_EMAIL` wskazuje jedyne konto z dostępem do `/admin`. Domyślnie
używane jest konto `ajarek2101@gmail.com`. Wartość jest sprawdzana
wyłącznie po stronie serwera.

## Płatności Stripe Checkout (Tryb Testowy)

Sklep posiada pełną integrację ze **Stripe Checkout** obsługującą płatności kartą, BLIK oraz Apple Pay w trybie testowym:

- **Panel testowy kasy:** [`/checkout`](http://localhost:3000/checkout) — strona umożliwiająca natychmiastowe przetestowanie zakupu dowolnego wariantu pierścienia Aura Ring Gen 3 bez konieczności przechodzenia przez koszyk.
- **Koszyk sklepowy:** Przycisk *„Przejdź do kasy”* w wysuwanym koszyku (`components/cart-drawer.tsx`) generuje sesję płatności Stripe i bezpiecznie przekierowuje klienta.
- **Endpointy backendu:**
  - `POST /api/checkout` (oraz alias `POST /api/create-checkout-session`) — tworzy sesję Stripe Checkout na podstawie zawartości koszyka.
  - `GET /api/checkout/session?session_id=...` — pobiera szczegóły potwierdzonej sesji dla strony sukcesu.
  - `POST /api/webhooks/stripe` — nasłuchuje zdarzeń Stripe (np. `checkout.session.completed`).
- **Strony powrotu:**
  - Sukces: `/checkout/success` (alias `/success`) — eleganckie potwierdzenie z podsumowaniem i statusem zamówienia.
  - Anulowanie: `/checkout/cancel` (alias `/cancel`) — bezpieczny powrót do koszyka.

### Testowanie Webhooków lokalnie przez Stripe CLI

Aby lokalnie przekazywać zdarzenia ze Stripe do endpointa webhooka:

```bash
# 1. Logowanie w Stripe CLI
stripe login

# 2. Przekierowanie webhooków do lokalnego serwera
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 3. Skopiuj wyświetlony sekret webhooka (whsec_...) do pliku .env jako:
# STRIPE_WEBHOOK_SECRET=whsec_...
```

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

## Wdrożenie na Vercel

1. Zaimportuj repozytorium w Vercel i pozostaw wykryty preset
   **Next.js** (bez własnego `vercel.json` i bez zmiany katalogu głównego).
2. W **Settings → Environment Variables** dodaj zmienne dla środowiska
   **Production** (i ewentualnie **Preview**):

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ADMIN_EMAIL=
   STRIPE_SECRET_KEY=sk_test_... lub rk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=https://twoja-domena.vercel.app
   ```

   Zmienne `NEXT_PUBLIC_*` są wbudowywane w bundle podczas builda, więc
   muszą być ustawione przed pierwszym wdrożeniem. `NEXT_PUBLIC_APP_URL`
   ustaw na produkcyjną domenę — jest używany w `sitemap.xml`,
   `robots.txt` oraz jako adres powrotu Stripe, gdy żądanie nie zawiera
   nagłówka `Origin`. Bez tej zmiennej aplikacja użyje adresu z
   `VERCEL_URL`, a `robots.txt`/`sitemap.xml` wskażą domenę wdrożenia.
3. W **Stripe → Developers → Webhooks** dodaj endpoint
   `https://twoja-domena.vercel.app/api/webhooks/stripe` i zasubskrybuj
   `checkout.session.completed`, `payment_intent.succeeded` oraz
   `payment_intent.payment_failed`. Skopiuj sekret `whsec_...` do
   `STRIPE_WEBHOOK_SECRET` i ponownie wdroż projekt. W produkcji webhook
   odrzuca żądania bez poprawnego podpisu.
4. W **Firebase → Authentication → Settings → Authorized domains** dodaj
   domenę produkcyjną (adresy podglądu Vercel trzeba dodawać pojedynczo —
   Firebase nie obsługuje wildcardów; alternatywą jest własna domena).
5. Wdróż reguły Firestore z pliku [`firestore.rules`](./firestore.rules)
   poleceniem `firebase deploy --only firestore:rules` lub w konsoli
   Firebase. Wdrożenie na Vercel nie publikuje reguł automatycznie.
6. Po wdrożeniu sprawdź `/`, `/products`, `/checkout`, logowanie oraz
   płatność testową kartą `4242 4242 4242 4242`.

## Przydatne skrypty

```bash
npm run dev    # serwer deweloperski
npm run build  # build produkcyjny
npm run start  # uruchomienie builda
npm run lint   # ESLint
```
