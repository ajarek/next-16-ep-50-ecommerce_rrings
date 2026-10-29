"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Battery,
  ShieldCheck,
  Feather,
  Heart,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function HeroVideoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeFinish, setActiveFinish] = useState<"black" | "gold" | "silver">("black");
  const [heartRate, setHeartRate] = useState(68);

  const finishDetails = {
    black: {
      name: "Aura Ring Matte Black",
      price: "1 299 zł",
    },
    gold: {
      name: "Aura Ring Champagne Gold",
      price: "1 499 zł",
    },
    silver: {
      name: "Aura Ring Silver Titanium",
      price: "1 299 zł",
    },
  };

  // Subtle realistic live heart rate pulse fluctuation (e.g. 67-71 BPM)
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = prev + delta;
        return next >= 65 && next <= 72 ? next : 68;
      });
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Ambient background glow highlights */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-125 w-125 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-20 h-112.5 w-112.5 rounded-full bg-cyan-500/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & Specs */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300 shadow-[0_0_15px_rgba(229,184,105,0.15)]">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="tracking-widest uppercase text-[11px] font-semibold">
                NOWA GENERACJA AURA GEN 3
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl">
              Inteligentny pierścień
            </h1>
            <p className="mt-2 font-serif text-2xl font-light italic text-amber-200/90 sm:text-3xl">
              Twoje zdrowie, styl i technologia w jednym geście.
            </p>

            {/* Subtitle / Description */}
            <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Dostęp do danych o Twoim zdrowiu i regeneracji — w dowolnym miejscu
              i o każdej porze. Tytanowa obudowa lotnicza, wbudowany ekran LED oraz
              monitoring 24/7 bez rozpraszających powiadomień.
            </p>

            {/* Specs Trio Cards */}
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {/* Stat 1 */}
              <div className="group rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 transition hover:border-amber-500/40 hover:bg-zinc-900/90 sm:p-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  <Battery className="h-3 w-3 text-amber-400" />
                  <span>BATERIA</span>
                </div>
                <div className="mt-1 font-serif text-lg font-semibold text-white sm:text-xl">
                  Do 7 dni
                </div>
                <div className="text-[11px] text-zinc-500">Jedno ładowanie</div>
              </div>

              {/* Stat 2 */}
              <div className="group rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 transition hover:border-amber-500/40 hover:bg-zinc-900/90 sm:p-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  <ShieldCheck className="h-3 w-3 text-cyan-400" />
                  <span>STANDARD</span>
                </div>
                <div className="mt-1 font-serif text-lg font-semibold text-white sm:text-xl">
                  5ATM
                </div>
                <div className="text-[11px] text-zinc-500">Wodoodporność 50m</div>
              </div>

              {/* Stat 3 */}
              <div className="group rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 transition hover:border-amber-500/40 hover:bg-zinc-900/90 sm:p-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  <Feather className="h-3 w-3 text-amber-300" />
                  <span>WAGA</span>
                </div>
                <div className="mt-1 font-serif text-lg font-semibold text-white sm:text-xl">
                  3.8 g
                </div>
                <div className="text-[11px] text-zinc-500">Lekki jak piórko</div>
              </div>
            </div>

            {/* CTA Buttons Row */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <Link
                href="#produkty"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-amber-400/80 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_30px_rgba(229,184,105,0.35)] transition-all hover:brightness-105 active:scale-[0.98]"
              >
                <span>Zamów teraz z zestawem miarowym</span>
              </Link>

              <Link
                href="#technologia"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-3.5 text-xs font-semibold tracking-wider text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white"
              >
                <span>Odkryj technologię</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Social Proof / Rating */}
            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-zinc-800/70 pt-5 text-xs text-zinc-400">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="font-semibold text-zinc-200">4.9 / 5</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">
                Ponad 1 200 zweryfikowanych opinii w Polsce
              </span>
            </div>
          </div>

          {/* Right Column: Creative Video Showcase */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              {/* Outer decorative ambient glow ring */}
              <div
                className="absolute -inset-1.5 rounded-[2rem] bg-linear-to-r from-amber-500/30 via-cyan-500/20 to-amber-500/30 opacity-70 blur-xl transition-all duration-700"
                aria-hidden="true"
              />

              {/* Main Video Container Frame */}
              <div className="relative overflow-hidden rounded-[1.75rem] border border-amber-500/30 bg-zinc-950 shadow-2xl">
                {/* Unobstructed video frame */}
                <div className="relative aspect-16/10 sm:aspect-16/10 w-full overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    src="/videos/ring-video.mp4"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                  />

                  {/* Subtle top vignette only for badge readability */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/60 via-black/20 to-transparent" />

                  {/* Top HUD Overlay */}
                  <div className="absolute top-3.5 inset-x-3.5 sm:top-4 sm:inset-x-4 flex items-center justify-between z-10">
                    {/* Live biometrics badge with pulsing green light */}
                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/60 px-3 py-1 backdrop-blur-md">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300">
                        BIOMETRIA LIVE 24/7
                      </span>
                    </div>

                    {/* Media controls (Play/Pause, Sound) */}
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
                        title={isPlaying ? "Zatrzymaj wideo" : "Wznów wideo"}
                        aria-label={isPlaying ? "Zatrzymaj wideo" : "Wznów wideo"}
                      >
                        {isPlaying ? (
                          <Pause className="h-3.5 w-3.5" />
                        ) : (
                          <Play className="h-3.5 w-3.5 ml-0.5 fill-current" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
                        title={isMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
                        aria-label={isMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
                      >
                        {isMuted ? (
                          <VolumeX className="h-3.5 w-3.5" />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5 text-amber-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dedicated Status & Telemetry Card BELOW the video (no overlay, video is 100% visible) */}
                <div className="border-t border-zinc-800/80 bg-linear-to-b from-zinc-900/90 via-zinc-950/95 to-zinc-950/95 p-4 sm:p-5"> 
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-base font-semibold tracking-wide text-white">
                          Inteligentny pierścień
                        </h2>
                        <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 uppercase">
                          Gen 3
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Tytanowa powłoka lotnicza Ti-6Al • Sensory optyczne PPG
                      </p>
                    </div>

                    {/* Live status indicators */}
                    <div className="flex items-center gap-3 border-t border-zinc-800/80 pt-2 sm:border-t-0 sm:pt-0">
                      {/* Heart Rate Indicator */}
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 text-red-400 animate-pulse" />
                        <span className="font-mono text-xs font-bold text-white">
                          {heartRate} <span className="text-[10px] text-zinc-400 font-normal">BPM</span>
                        </span>
                      </div>

                      <div className="h-3.5 w-px bg-zinc-800" />

                      <div className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-xs font-semibold text-zinc-200">
                          Gotowość: 94%
                        </span>
                      </div>

                      <div className="h-3.5 w-px bg-zinc-800" />

                      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Zsynchronizowano</span>
                      </div>
                    </div>
                  </div>

                  {/* Finish preview & interactive selection */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-zinc-800/60 pt-3 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-[10px] uppercase tracking-wider">
                        Wykończenie:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveFinish("black")}
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${
                            activeFinish === "black"
                              ? "bg-zinc-800 text-white border border-amber-500/40 shadow-sm"
                              : "text-zinc-400 hover:text-zinc-200 bg-zinc-900/50"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-zinc-700 ring-1 ring-zinc-500" />
                          <span>Czarny</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveFinish("gold")}
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${
                            activeFinish === "gold"
                              ? "bg-zinc-800 text-amber-200 border border-amber-500/40 shadow-sm"
                              : "text-zinc-400 hover:text-zinc-200 bg-zinc-900/50"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-amber-400 ring-1 ring-amber-300" />
                          <span>Złoto</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveFinish("silver")}
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${
                            activeFinish === "silver"
                              ? "bg-zinc-800 text-zinc-200 border border-amber-500/40 shadow-sm"
                              : "text-zinc-400 hover:text-zinc-200 bg-zinc-900/50"
                          }`}
                        >
                          <span className="h-2 w-2 rounded-full bg-zinc-300 ring-1 ring-zinc-400" />
                          <span>Srebro</span>
                        </button>
                      </div>
                    </div>

                    <Link
                      href="#produkty"
                      className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition font-medium"
                    >
                      <span>{finishDetails[activeFinish].name} ({finishDetails[activeFinish].price})</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
