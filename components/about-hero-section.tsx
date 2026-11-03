"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, ArrowRight, MapPin } from "lucide-react";

const HERO_STATS = [
  { value: "2019", label: "Założenie marki" },
  { value: "48", label: "Osób w zespole" },
  { value: "4", label: "Salony w Polsce" },
  { value: "15 000+", label: "Klientów w Europie" },
];

export function AboutHeroSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Startujemy od stanu pauzy — zdarzenie onPlay przełącza ikonę po autoodtwarzaniu
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Stan `isPlaying` aktualizuje zdarzenie onPause wideo
      video.pause();
      return;
    }

    video.play().catch(() => setIsPlaying(false));
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-zinc-800/80">
      {/* Wideo z pracowni AURA RING */}
      <video
        ref={videoRef}
        src="/videos/team.mp4"
        loop
        playsInline
        muted={isMuted}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />

      {/* Nakładki dla czytelności treści */}
      <div
        className="absolute inset-0 -z-10 bg-linear-to-r from-[#070709] via-[#070709]/85 to-[#070709]/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-[#070709] via-transparent to-[#070709]/70"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex min-h-[600px] flex-col justify-end pt-24 sm:min-h-[680px]">
          {/* Kontrolki wideo */}
          <div className="absolute right-0 top-6 z-10 flex items-center gap-2">
            <span className="hidden rounded-full border border-white/15 bg-zinc-950/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-300 backdrop-blur sm:inline-block">
              Kulisy pracowni
            </span>
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-zinc-950/60 p-1 backdrop-blur">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Zatrzymaj wideo" : "Wznów wideo"}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-amber-300" />
                )}
              </button>
            </div>
          </div>

          {/* Treść hero */}
          <div className="max-w-2xl pb-10 sm:pb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              O marce • Manufaktura w Warszawie
            </span>

            <h1 className="mt-4 font-serif text-4xl font-normal leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Za każdym pomiarem stoi{" "}
              <span className="bg-linear-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                człowiek
              </span>
              .
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              Aura Ring tworzą inżynierowie, jubilerzy i fizjolodzy. Od 2019
              roku projektujemy w Warszawie biżuterię, która mierzy zdrowie z
              kliniczną precyzją — bez ekranów, powiadomień i kompromisów.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.35)] transition-all hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.5)] active:scale-[0.98]"
              >
                Poznaj kolekcję
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/location"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-zinc-950/50 px-6 py-3.5 text-xs font-semibold tracking-wider text-zinc-100 backdrop-blur transition hover:border-amber-500/50 hover:text-amber-200"
              >
                <MapPin className="h-4 w-4 text-amber-400" />
                Odwiedź salon
              </Link>
            </div>
          </div>

          {/* Pasek statystyk */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 py-6 sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-2xl font-semibold text-white sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
