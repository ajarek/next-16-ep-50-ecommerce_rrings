# AGENTS.md --- Zasady pracy agentów AI

```{=html}
<!--
Instrukcje dla agentów AI pracujących w tym repozytorium.
W razie konfliktu pierwszeństwo mają: wymagania użytkownika,
bezpieczeństwo projektu, istniejąca architektura i konfiguracja repozytorium.
-->
```
## 1. Zasady nadrzędne

-   Przed rozpoczęciem pracy zapoznaj się ze strukturą projektu,
    `package.json`, plikiem lockfile, istniejącymi konwencjami oraz
    odpowiednimi plikami `README.md`, `DESIGN.md` i innymi instrukcjami
    projektu, jeśli istnieją.
-   Nie zakładaj, że projekt jest nowy. Najpierw sprawdź, jakie
    rozwiązania już istnieją i jak są używane.
-   Wprowadzaj najmniejszą zmianę, która poprawnie rozwiązuje zadanie.
-   Nie przebudowuj architektury, nie zmieniaj istniejących wzorców i
    nie usuwaj funkcjonalności bez uzasadnienia.
-   Nie dodawaj zależności, narzędzi ani abstrakcji, jeśli nie są
    potrzebne.
-   Nie zastępuj działającego rozwiązania innym tylko z powodu
    osobistych preferencji.
-   Nie deklaruj wykonania czynności, testów ani zmian, których
    faktycznie nie wykonano.
-   Jeśli wymaganie jest niejednoznaczne i może prowadzić do istotnej
    zmiany architektury, danych lub bezpieczeństwa, najpierw poproś o
    doprecyzowanie.
-   Nie umieszczaj w repozytorium sekretów, rzeczywistych danych
    użytkowników ani danych produkcyjnych.

## 2. Stos technologiczny i wersje

Docelowy stos projektu:

-   Next.js 16 --- App Router.
-   React --- wersja zgodna z Next.js i konfiguracją projektu.
-   TypeScript --- `strict` mode.
-   Tailwind CSS v4.
-   Firebase --- odpowiednio dobrane usługi, np. Authentication, Cloud
    Firestore i Cloud Storage, zależnie od wymagań aplikacji.

Zasady wersjonowania:

-   Rzeczywiste wersje bibliotek ustalaj na podstawie `package.json` i
    lockfile.
-   Nie zakładaj, że najnowsza wersja biblioteki jest już zainstalowana.
-   Nie aktualizuj Next.js, React, Firebase ani innych zależności bez
    potrzeby i bez uzasadnienia zgodnością lub wymaganiami zadania.
-   Przed użyciem API sprawdź, czy jest ono dostępne w wersji
    zainstalowanej w projekcie.
-   Nie mieszaj rozwiązań przeznaczonych dla różnych głównych wersji
    bibliotek.

## 3. Dokumentacja techniczna

-   Przed implementacją funkcjonalności Next.js sprawdź dokumentację
    odpowiadającą wersji zainstalowanej w projekcie.
-   W pierwszej kolejności korzystaj z dokumentacji lokalnej, jeśli jest
    dostępna: `node_modules/next/dist/docs/`.
-   Jeśli dokumentacja lokalna nie zawiera potrzebnych informacji,
    korzystaj z oficjalnej dokumentacji: https://nextjs.org/docs.
-   Sprawdzaj również dokumentację używanych bibliotek, szczególnie
    React, Firebase, Tailwind CSS i bibliotek UI.
-   Nie opieraj implementacji wyłącznie na pamięci, przykładach ze
    starszych wersji ani niezweryfikowanych fragmentach kodu.
-   Jeśli dokumentacja i istniejący kod projektu są sprzeczne, ustal
    przyczynę przed wprowadzeniem zmian.

## 4. Next.js i React

-   Korzystaj z App Router zgodnie z aktualną dokumentacją
    zainstalowanej wersji.
-   Domyślnie preferuj React Server Components.
-   Dodawaj dyrektywę `use client` tylko wtedy, gdy komponent
    rzeczywiście wymaga interaktywności, stanu klienta, obsługi zdarzeń
    lub API przeglądarki.
-   Nie przenoś całego komponentu do Client Component tylko dlatego, że
    używa biblioteki UI. W miarę możliwości wydziel mały komponent
    kliencki.
-   Nie używaj API przeglądarki podczas renderowania po stronie serwera.
-   Unikaj niepotrzebnych efektów `useEffect` i stanu, który można
    wyliczyć.
-   Dbaj o stabilność renderowania i unikaj błędów hydratacji.
-   Stosuj `next/image` do obrazów, gdy jest to uzasadnione; konfiguruj
    zewnętrzne źródła obrazów zgodnie z wymaganiami Next.js.
-   Preferuj `next/font` zamiast ręcznego ładowania fontów z
    zewnętrznych źródeł, jeśli projekt nie ma innego uzasadnionego
    rozwiązania.
-   Wykorzystuj mechanizmy `loading.tsx`, `error.tsx`, `not-found.tsx` i
    `Suspense`, gdy poprawiają obsługę stanów ładowania i błędów.
-   Nie używaj przestarzałych lub niezgodnych z bieżącą wersją API.

### Server Actions i Route Handlers

-   Używaj Server Actions przede wszystkim do mutacji danych
    inicjowanych przez interfejs aplikacji, np. wysyłania formularzy lub
    aktualizacji danych.
-   Używaj Route Handlers do webhooków, endpointów REST, integracji
    zewnętrznych i obsługi niestandardowych żądań HTTP.
-   Traktuj każdą Server Action jako publicznie dostępną granicę
    zaufania.
-   Każda Server Action musi samodzielnie weryfikować uwierzytelnienie,
    uprawnienia i poprawność danych.
-   Nie zakładaj, że ukrycie przycisku lub strony zabezpiecza operację.
-   Nie umieszczaj sekretów ani logiki wymagającej uprawnień
    administracyjnych w kodzie klienta.

## 5. Firebase --- architektura i bezpieczeństwo

### Zasady ogólne

-   Firebase Client SDK może być używany w Client Components oraz w
    modułach, które są bezpieczne do użycia po stronie klienta.
-   Firebase Admin SDK wykorzystuj wyłącznie po stronie serwera.
-   Nigdy nie importuj Firebase Admin SDK do Client Components ani do
    modułów, które mogą zostać dołączone do bundla przeglądarki.
-   Moduły zawierające operacje wyłącznie serwerowe oznaczaj
    `server-only`, jeśli jest to właściwe dla ich sposobu użycia.
-   Konfigurację pobieraj ze zmiennych środowiskowych.
-   Nie umieszczaj kluczy prywatnych, danych Service Account ani
    sekretów w kodzie, repozytorium, logach lub odpowiedziach wysyłanych
    do klienta.

### Zmienne Firebase

-   Zmienne wymagane w przeglądarce mogą mieć prefiks `NEXT_PUBLIC_`.
-   Zmienne publiczne Firebase Client SDK, w tym API key, nie są tym
    samym co prywatne dane uwierzytelniające konta administracyjnego.
-   Nie traktuj prefiksu `NEXT_PUBLIC_` jako sposobu ochrony sekretu:
    takie wartości są dostępne w kodzie klienta.
-   Dane Service Account, prywatne klucze i sekrety przechowuj wyłącznie
    w zmiennych serwerowych lub bezpiecznym systemie zarządzania
    sekretami.
-   Przed dodaniem zmiennej sprawdź `.env.example` i istniejącą
    konfigurację.
-   Nie commituj `.env.local` ani plików zawierających sekrety.
-   Utrzymuj aktualny `.env.example` z nazwami zmiennych i bez ich
    poufnych wartości.

### Firebase Authentication

-   Weryfikuj tożsamość użytkownika po stronie serwera przed wykonaniem
    operacji wymagającej uwierzytelnienia.
-   Jeśli serwer otrzymuje Firebase ID Token, weryfikuj go za pomocą
    Firebase Admin SDK i odpowiedniej metody dla danego scenariusza.
-   Nie ufaj identyfikatorowi użytkownika, roli ani uprawnieniom
    przesłanym samodzielnie przez przeglądarkę.
-   Pobieraj wiarygodną tożsamość z poprawnie zweryfikowanego tokenu lub
    bezpiecznej sesji serwerowej.
-   Kontroluj uprawnienia przy każdej operacji, również w Server Actions
    i Route Handlers.
-   Nie polegaj wyłącznie na ochronie interfejsu, middleware ani
    ukrywaniu elementów nawigacji.
-   Nie zapisuj haseł ani tokenów w `localStorage`.
-   Sposób przechowywania sesji i tokenów dobieraj do architektury
    aplikacji i aktualnej dokumentacji Firebase.

### Cloud Firestore

-   Zawsze projektuj i utrzymuj Firestore Security Rules zgodnie z
    modelem danych.
-   Stosuj zasadę najmniejszych uprawnień.
-   Ograniczaj odczyt i zapis do danych, do których użytkownik ma
    uprawnienia.
-   Weryfikuj właściciela dokumentu i uprawnienia do wykonywanej
    operacji.
-   Waliduj typy, strukturę i dopuszczalne wartości danych.
-   Nie stosuj reguł pozwalających wszystkim na nieograniczony odczyt
    lub zapis.
-   Pamiętaj, że Firebase Admin SDK omija Firestore Security Rules. Przy
    operacjach wykonywanych przez Admin SDK kontrolę uprawnień trzeba
    przeprowadzić w kodzie serwerowym.
-   Nie pobieraj większej ilości danych, niż wymaga dana funkcjonalność.
-   Uwzględniaj koszty zapytań, indeksy i limity Firebase.

### Cloud Storage

-   Stosuj Firebase Storage Security Rules.
-   Ograniczaj dostęp do plików zgodnie z tożsamością i uprawnieniami
    użytkownika.
-   Weryfikuj typ, rozmiar i dopuszczalność przesyłanych plików.
-   Nie ufaj wyłącznie nazwie pliku ani deklarowanemu przez klienta
    typowi MIME.
-   Nie przechowuj poufnych plików w publicznie dostępnych
    lokalizacjach.
-   Nie udostępniaj plików przez publiczne adresy, jeśli wymagają
    kontroli dostępu.

## 6. TypeScript, walidacja i formularze

-   Utrzymuj `strict` mode.
-   Unikaj `any`; preferuj precyzyjne typy, `unknown` i zawężanie typów.
-   Nie stosuj rzutowania typów wyłącznie po to, aby ukryć błąd.
-   Preferuj Zod do walidacji danych, jeśli jest już używany lub
    uzasadniony.
-   Waliduj dane po stronie serwera niezależnie od walidacji klienta.
-   Traktuj wszystkie dane wejściowe jako niezaufane.
-   Dla formularzy dobieraj React Hook Form i Zod do stopnia złożoności;
    nie dodawaj tych bibliotek do prostych formularzy bez potrzeby.
-   Komunikaty walidacyjne i błędy dla użytkownika powinny być
    zrozumiałe i napisane po polsku.
-   Zapewnij obsługę stanu wysyłania, błędu i sukcesu.
-   Zabezpieczaj operacje przed przypadkowym wielokrotnym wysłaniem,
    jeśli mogłoby to powodować duplikację danych lub płatności.

## 7. Styl kodu i nazewnictwo

-   Kod, komentarze, komunikaty UI i dokumentacja projektu powinny być
    domyślnie w języku polskim.
-   Nazwy zmiennych, funkcji, klas, komponentów, plików, folderów,
    endpointów i pól API mogą być w języku angielskim.
-   Nie tłumacz nazw API, bibliotek ani terminów technicznych.
-   Używaj nazw opisujących przeznaczenie elementu.
-   Unikaj zbędnych komentarzy; komentuj przede wszystkim decyzje,
    których nie da się łatwo wywnioskować z kodu.
-   Usuwaj nieużywane importy i niepotrzebny kod, ale nie usuwaj
    elementów, których użycie jest dynamiczne lub nieoczywiste bez
    wcześniejszego sprawdzenia.
-   Zachowuj spójny styl formatowania istniejącego projektu.

## 8. Interfejs użytkownika i design system

-   Preferuj istniejące komponenty UI i wzorce projektu.
-   Jeśli projekt używa shadcn/ui, korzystaj z istniejących komponentów
    i dostosowuj je do potrzeb zamiast tworzyć równoległy system.
-   Preferuj `lucide-react` do ikon, jeśli biblioteka jest
    zainstalowana.
-   Nie dodawaj biblioteki UI ani ikon, jeśli projekt ma już odpowiednie
    rozwiązanie.
-   Przed stworzeniem komponentu sprawdź, czy podobny już istnieje.
-   Zachowuj spójność kolorów, typografii, promieni, odstępów i stanów
    interakcji.
-   Jeśli istnieje `DESIGN.md`, przeczytaj go i traktuj jako źródło
    wytycznych wizualnych projektu.
-   Nie zastępuj istniejącego design systemu własnym bez wyraźnego
    uzasadnienia.
-   Style globalne zapisuj w istniejącym pliku globalnym; standardowa
    nazwa w App Router to często `app/globals.css`, ale respektuj
    faktyczną strukturę.
-   Jeśli przenosisz style z `DESIGN.md` do CSS lub Tailwind, zachowaj
    ich zamierzone znaczenie i dostosuj je do wersji Tailwind
    zainstalowanej w projekcie.

### Navbar i nawigacja

-   Umieszczaj Navbar w głównym `app/layout.tsx`, jeśli ma być wspólny
    dla całej aplikacji.
-   Jeśli część tras wymaga innego układu, rozważ odpowiednie route
    groups lub osobne layouty zamiast wymuszać jeden Navbar wszędzie.
-   Logo umieszczaj po lewej stronie i kieruj na stronę główną.
-   Przycisk zmiany motywu umieszczaj w logicznym, łatwo dostępnym
    miejscu, zwykle po prawej stronie nawigacji.
-   Menu mobilne powinno działać płynnie, być dostępne z klawiatury i
    nie utrudniać korzystania z treści.
-   Zapewnij zamykanie menu klawiszem Escape i po wybraniu linku, jeśli
    odpowiada to zachowaniu danego menu.
-   Stosuj odpowiednie `aria-label`, `aria-expanded` i semantyczne
    elementy.

### Motywy jasny i ciemny

-   Jeśli projekt oferuje zmianę motywu, zapewnij tryb jasny, ciemny i
    systemowy, o ile wymagania projektu nie stanowią inaczej.
-   Zapamiętuj wybór użytkownika zgodnie z przyjętym rozwiązaniem.
-   Unikaj błędów hydratacji podczas inicjalizacji motywu.
-   Zapewnij czytelność i odpowiedni kontrast w każdym trybie.
-   Nie wprowadzaj przełącznika motywu, jeśli projekt ma świadomie
    zdefiniowany pojedynczy motyw.

## 9. Tailwind CSS v4

-   Stosuj składnię i mechanizmy zgodne z Tailwind CSS v4.
-   Nie kopiuj bez sprawdzenia konfiguracji i składni z Tailwind CSS v3.
-   Korzystaj z istniejącej konfiguracji projektu i jego plików CSS.
-   Wykorzystuj zmienne CSS do definiowania kolorów, typografii i innych
    elementów design systemu, gdy jest to uzasadnione.
-   Zapewniaj spójne warianty jasny/ciemny, jeśli projekt obsługuje oba
    motywy.
-   Unikaj powielania klas i niepotrzebnych nadpisań CSS.
-   Nie twórz dodatkowych plików CSS, jeśli istniejące rozwiązanie jest
    wystarczające.

## 10. Animacje i efekty wizualne

-   Do animacji używaj biblioteki już obecnej w projekcie.
-   Jeśli potrzebna jest nowa biblioteka, najpierw uzasadnij jej
    dodanie.
-   Motion (dawniej Framer Motion) może być używany, jeśli jest zgodny z
    wersją projektu i jego potrzebami.
-   Animacje powinny wspierać zrozumienie interfejsu, a nie odwracać
    uwagę.
-   Unikaj nadmiernych animacji i efektów wpływających na wydajność.
-   WebGL, shadery, gradienty, grid i spotlight stosuj tylko wtedy, gdy
    pasują do charakteru projektu.
-   Zapewnij fallback dla urządzeń, które nie obsługują WebGL.
-   Uwzględniaj `prefers-reduced-motion`.
-   Preferuj animowanie właściwości, które nie powodują niepotrzebnego
    przeliczania układu strony.
-   Nie uruchamiaj kosztownych efektów bez potrzeby na urządzeniach
    mobilnych.

## 11. Architektura i organizacja projektu

-   Utrzymuj logikę biznesową poza komponentami React.
-   Przed utworzeniem nowego komponentu, hooka, helpera lub modułu
    sprawdź, czy podobne rozwiązanie już istnieje.
-   Przed dodaniem biblioteki sprawdź `package.json`.
-   Nie zmieniaj istniejącej architektury bez uzasadnienia.
-   Zachowuj istniejącą strukturę folderów, o ile nie utrudnia ona
    zadania.
-   Nie twórz abstrakcji na zapas.
-   Grupuj kod według funkcjonalności i odpowiedzialności.
-   Logikę serwerową oddzielaj od modułów używanych po stronie klienta.
-   Nie importuj modułów serwerowych do Client Components.

Przykładowy podział odpowiedzialności --- dostosuj go do istniejącej
struktury, nie twórz wszystkich katalogów automatycznie:

-   `app/` --- trasy, layouty i strony App Router.
-   `components/` --- współdzielone komponenty interfejsu.
-   `components/ui/` --- podstawowe komponenty UI, jeśli projekt taką
    konwencję stosuje.
-   `lib/` --- współdzielone funkcje i logika aplikacji.
-   `lib/firebase/` --- konfiguracja i integracja Firebase.
-   `hooks/` --- własne hooki React.
-   `schemas/` --- schematy walidacji, jeśli jest ich wystarczająco
    dużo.
-   `types/` --- współdzielone typy TypeScript, jeśli nie lepiej trzymać
    ich przy funkcjonalności.
-   `public/` --- wyłącznie zasoby dostępne publicznie.

Dane i zasoby:

-   Przykładowe dane umieszczaj w `public/data/` tylko wtedy, gdy mają
    być publicznie dostępne przez przeglądarkę.
-   Mocki, dane testowe i przykłady niezwiązane z publicznym dostępem
    przechowuj poza `public/`.
-   Nigdy nie umieszczaj w `public/` sekretów, danych osobowych ani
    rzeczywistych danych produkcyjnych.
-   Wygenerowane obrazy umieszczaj w `public/images/`, jeśli mają być
    publicznymi zasobami aplikacji.
-   Jeśli usuwasz plik, usuń go fizycznie, o ile użytkownik nie oczekuje
    zachowania go lub przeniesienia.
-   Nie pozostawiaj pustych folderów, jeśli nie są potrzebne.

## 12. Dostępność (a11y)

-   Stosuj semantyczny HTML.
-   Wszystkie elementy interaktywne muszą być dostępne z klawiatury.
-   Zapewnij widoczny stan fokusu.
-   Obrazy informacyjne wymagają odpowiednich tekstów `alt`; obrazy
    dekoracyjne powinny mieć pusty `alt`.
-   Formularze muszą mieć powiązane etykiety `label`.
-   Komunikaty błędów powinny być powiązane z odpowiednimi polami.
-   Nie polegaj wyłącznie na kolorze przy przekazywaniu informacji.
-   Zapewnij odpowiedni kontrast w trybie jasnym i ciemnym.
-   Uwzględniaj `prefers-reduced-motion`.
-   Stosuj ARIA tylko wtedy, gdy semantyczny HTML nie wystarcza.
-   Nie używaj elementów interaktywnych zagnieżdżonych w innych
    elementach interaktywnych.

## 13. SEO i metadane

-   Każda publiczna strona, która powinna być indeksowana, powinna mieć
    odpowiednie i możliwie unikalne metadata.
-   Korzystaj z Metadata API Next.js.
-   Stosuj prawidłową hierarchię nagłówków i semantyczną strukturę
    treści.
-   Ustawiaj canonical URL, jeśli jest to uzasadnione.
-   Dodawaj Open Graph i metadata dla platform społecznościowych, jeśli
    strona ma być udostępniana.
-   Przygotuj `sitemap` i `robots.txt`, jeśli są potrzebne dla
    publicznych tras.
-   Stosuj JSON-LD tylko wtedy, gdy dane strukturalne odpowiadają treści
    strony.
-   Strony prywatne, administracyjne i wymagające logowania nie powinny
    być indeksowane, jeśli nie są przeznaczone do publicznego
    wyszukiwania.
-   Nie traktuj `robots.txt` jako zabezpieczenia dostępu do danych.
-   Nie umieszczaj poufnych informacji w metadata.

## 14. Wydajność i niezawodność

-   Preferuj Server Components, aby ograniczać JavaScript wysyłany do
    przeglądarki.
-   Ograniczaj ilość danych pobieranych z Firebase do niezbędnego
    minimum.
-   Unikaj powtarzania tych samych zapytań i niepotrzebnych renderów.
-   Stosuj dynamic imports dla ciężkich komponentów, gdy przynosi to
    korzyść.
-   Optymalizuj obrazy i fonty zgodnie z możliwościami Next.js.
-   Zapewniaj stany ładowania, puste wyniki i czytelne komunikaty
    błędów.
-   Nie ujawniaj użytkownikowi technicznych szczegółów wyjątków,
    sekretów ani danych wewnętrznych.
-   Loguj błędy w sposób przydatny diagnostycznie, nie zapisując
    niepotrzebnych danych osobowych ani sekretów.

## 15. Obsługa błędów i stanów aplikacji

-   Korzystaj z `error.tsx`, `not-found.tsx` i innych mechanizmów
    obsługi błędów App Router, gdy są odpowiednie.
-   Obsługuj stany ładowania, błędu, sukcesu i braku danych.
-   Rozróżniaj błędy walidacji, autoryzacji, braku zasobu i błędy
    serwera.
-   Nie ukrywaj błędów przez puste bloki `catch`.
-   Nie zwracaj klientowi stosów wywołań ani wewnętrznych szczegółów
    błędów.
-   Komunikaty dla użytkownika formułuj po polsku i prostym językiem.

## 16. Kontrola jakości

Po każdej istotnej zmianie kodu dobierz kontrole do zakresu zadania:

1.  Uruchom sprawdzanie typów TypeScript, jeśli projekt ma odpowiedni
    skrypt.
2.  Uruchom ESLint lub skonfigurowany linting.
3.  Uruchom testy dotyczące zmienionej funkcjonalności, jeśli istnieją.
4.  Sprawdź potencjalne problemy z hydratacją.
5.  Zweryfikuj zgodność z App Router i wersjami używanych bibliotek.
6.  W razie potrzeby wykonaj build produkcyjny.
7.  Przy zmianach Firebase sprawdź reguły bezpieczeństwa i kontrolę
    uprawnień.
8.  Przy zmianach UI sprawdź responsywność i dostępność.

Dodatkowe zasady:

-   Najpierw sprawdź dostępne skrypty w `package.json`.
-   Nie zakładaj nazw skryptów --- używaj tych, które istnieją w
    projekcie.
-   Nie uruchamiaj pełnego zestawu kontroli dla zmian wyłącznie
    dokumentacyjnych lub tekstowych, jeśli nie jest to potrzebne.
-   Nie ignoruj błędów kompilacji ani ostrzeżeń związanych z
    bezpieczeństwem.
-   Nie zmieniaj konfiguracji wyłącznie po to, aby ukryć błędy.
-   Jeśli kontroli nie można uruchomić, podaj przyczynę.
-   Nie twierdź, że testy lub build zakończyły się powodzeniem, jeśli
    nie zostały wykonane.

## 17. Dokumentacja projektu i podsumowanie pracy

-   Jeśli zmiana wpływa na sposób instalacji, konfigurację, architekturę
    lub sposób korzystania z aplikacji, zaktualizuj `README.md`.
-   Zaktualizuj `AGENTS.md`, jeśli zmieniają się trwałe konwencje
    projektu.
-   Nie aktualizuj dokumentacji bez związku z zakresem zadania.
-   Po zakończeniu pracy przedstaw krótkie podsumowanie:
    -   co zostało zmienione,
    -   które pliki zostały dodane lub zmodyfikowane,
    -   jakie kontrole zostały wykonane,
    -   czy pozostały znane problemy lub zadania do wykonania.

## 18. Język i komunikacja

-   Domyślnym językiem komunikacji, dokumentacji projektu i interfejsu
    jest polski, chyba że użytkownik określi inaczej.
-   Nazwy technologii, API, bibliotek i standardowych terminów
    technicznych pozostawiaj w oryginalnej formie.
-   Jeśli podejmujesz istotną decyzję techniczną, krótko wyjaśnij jej
    powód.
-   Jeśli wymaganie użytkownika jest sprzeczne z bezpieczeństwem lub
    ograniczeniami technicznymi, wyjaśnij problem i zaproponuj
    bezpieczne rozwiązanie.
