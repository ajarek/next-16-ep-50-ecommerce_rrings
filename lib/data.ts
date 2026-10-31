import { RingProduct, Testimonial, SizeChartItem } from "@/types";

export const PRODUCTS: RingProduct[] = [
  {
    id: "aura-ring-matte-black",
    name: "Aura Ring Matte Black",
    series: "SERIA TITAN STEALTH",
    badge: "Bestseller",
    finish: "black",
    finishName: "Czarny Mat",
    description:
      "Głęboka czerń z satynową powłoką tytanową DLC. Odporny na zarysowania i odciski palców.",
    price: 1299,
    image: "/images/ring-image-3.png",
    availableSizes: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: "aura-ring-champagne-gold",
    name: "Aura Ring Champagne Gold",
    series: "SERIA FINE JEWELRY",
    badge: "Edycja Limitowana",
    finish: "gold",
    finishName: "Złoto Szampańskie",
    description:
      "Ciepłe 18-karatowe złocenie PVD na rdzeniu z tytanu medycznego. Niezrównany luksus i prestiż.",
    price: 1499,
    image: "/images/ring-image-9.png",
    availableSizes: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: "aura-ring-silver-titanium",
    name: "Aura Ring Silver Titanium",
    series: "SERIA PURE TITANIUM",
    badge: "Klasyk",
    finish: "silver",
    finishName: "Srebrny Tytan",
    description:
      "Polerowany naturalny tytan klasy lotniczej z lustrzanym połyskiem i chłodną elegancją.",
    price: 1299,
    image: "/images/ring-image-4.png",
    availableSizes: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: "onyx-ring-gloss-black",
    name: "Onyx Ring Gloss Black",
    series: "SERIA TITAN STEALTH",
    badge: "Nowość",
    finish: "black",
    finishName: "Czarny Połysk",
    description:
      "Intensywna czerń z eleganckim, lustrzanym wykończeniem. Minimalistyczny design podkreślający nowoczesny charakter.",
    price: 1399,
    image: "/images/ring-image-4.png",
    availableSizes: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: "titan-ring-brushed-silver",
    name: "Titan Ring Brushed Silver",
    series: "SERIA TITAN CLASSIC",
    badge: "Bestseller",
    finish: "silver",
    finishName: "Szczotkowane Srebro",
    description:
      "Naturalny odcień tytanu z precyzyjnie szczotkowaną powierzchnią. Ponadczasowa elegancja i wyjątkowa trwałość.",
    price: 1199,
    image: "/images/ring-image-5.png",
    availableSizes: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: "nova-ring-rose-gold",
    name: "Nova Ring Rose Gold",
    series: "SERIA TITAN LUXE",
    badge: "Limitowana edycja",
    finish: "rose-gold",
    finishName: "Różowe Złoto",
    description:
      "Wyrafinowane wykończenie w odcieniu różowego złota. Subtelny połysk i lekka konstrukcja z wysokiej jakości tytanu.",
    price: 1499,
    image: "/images/ring-image-6.png",
    availableSizes: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: "shadow-ring-gunmetal",
    name: "Shadow Ring Gunmetal",
    series: "SERIA TITAN STEALTH",
    badge: "Nowość",
    finish: "gunmetal",
    finishName: "Grafitowy Metal",
    description:
      "Ciemny grafitowy odcień z metalicznym wykończeniem. Industrialny styl połączony z minimalistyczną formą.",
    price: 1349,
    image: "/images/ring-image-7.png",
    availableSizes: [7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: "aurora-ring-titanium-blue",
    name: "Aurora Ring Titanium Blue",
    series: "SERIA TITAN SIGNATURE",
    badge: "Ekskluzywny",
    finish: "blue",
    finishName: "Titanium Blue",
    description:
      "Głęboki metaliczny błękit z nowoczesnym wykończeniem. Wyjątkowy kolor inspirowany technologią i elegancją.",
    price: 1449,
    image: "/images/ring-image-8.png",
    availableSizes: [7, 8, 9, 10, 11, 12, 13],
  },

];

export const SIZE_CHART: SizeChartItem[] = [
  { size: 7, diameterMm: 17.3, circumferenceMm: 54.4 },
  { size: 8, diameterMm: 18.1, circumferenceMm: 56.9 },
  { size: 9, diameterMm: 18.9, circumferenceMm: 59.4 },
  { size: 10, diameterMm: 19.7, circumferenceMm: 61.9 },
  { size: 11, diameterMm: 20.5, circumferenceMm: 64.4 },
  { size: 12, diameterMm: 21.3, circumferenceMm: 66.9 },
  { size: 13, diameterMm: 22.1, circumferenceMm: 69.4 },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "rev-1",
    rating: 5,
    title: "Ekran w pierścieniu to rewolucja",
    quote:
      "Przesiadłem się ze smartwatcha, który przeszkadzał mi w nocy. Aura Ring jest tak lekki, że zapominam o jego obecności. Fakt, że mogę spojrzeć na palec i od razu zobaczyć godzinę i kroki bez ekranu telefonu, jest genialny!",
    author: "Michał K.",
    initials: "MK",
    location: "Warszawa",
    model: "Aura Ring Matte Black",
  },
  {
    id: "rev-2",
    rating: 5,
    title: "Wersja Champagne Gold wygląda jak biżuteria",
    quote:
      "Obawiałam się, że pierścień biometryczny będzie wyglądał masywnie lub sportowo. Champagne Gold idealnie komponuje się z moimi pozostałymi pierścionkami. Analiza fazy REM i temperatury pomogła mi zoptymalizować sen.",
    author: "Aleksandra W.",
    initials: "AW",
    location: "Kraków",
    model: "Champagne Gold",
  },
  {
    id: "rev-3",
    rating: 5,
    title: "Bateria rzeczywiście trzyma 7 dni",
    quote:
      "Używam na basenie i siłowni – szczelność 5ATM działa bez zarzutu. Ładowanie raz w tygodniu przy niedzielnej kawie wystarcza w zupełności. Zestaw miarowy dotarł następnego dnia po złożeniu zamówienia.",
    author: "dr Piotr Z.",
    initials: "PZ",
    location: "Gdańsk",
    model: "Silver Titanium",
  },
];

