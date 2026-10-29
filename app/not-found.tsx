import type { Metadata } from "next"
import Link from "next/link"
import { Home, ShieldAlert, Compass } from "lucide-react"

export const metadata: Metadata = {
  title: "404 • Strona nie została znaleziona | Finance Tracker",
  description:
    "Strona, której szukasz, nie istnieje, została przeniesiona lub jest chwilowo niedostępna.",
}

/**
 * Strona błędu 404 w spójnym, nowoczesnym stylu Finance Tracker.
 * Wykorzystuje semantyczne zmienne motywu z globals.css, shader WebGL oraz szklany panel.
 */
export default function NotFound() {
  return (
    <main className='min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-black justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
      {/* Poświaty tła */}
      <div className='absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary/15 blur-[120px] pointer-events-none -z-10' />
      <div className='absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-secondary/15 blur-[140px] pointer-events-none -z-10' />

      {/* Główna szklana karta błędu 404 */}
      <div className='w-full max-w-xl glass-panel rounded-3xl p-8 sm:p-12 text-center shadow-2xl border border-border relative overflow-hidden'>
        {/* Odznaka błędu */}
        <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 border border-border backdrop-blur-xl shadow-sm mb-6'>
          <ShieldAlert className='w-4 h-4 text-secondary' />
          <span className='text-xs font-bold uppercase tracking-wider text-secondary'>
            Błąd 404 • Nie odnaleziono zasobu
          </span>
        </div>

        {/* Centralna ikona portfela i kompasu */}
        <div className='relative flex items-center justify-center my-4'>
          <div className='w-24 h-24 rounded-3xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_35px_var(--glow-primary)]'>
            <Compass className='w-12 h-12 animate-[spin_12s_linear_infinite]' />
          </div>
        </div>

        {/* Kod błędu i nagłówek */}
        <h1 className='text-5xl sm:text-6xl font-extrabold  mt-4'>404</h1>

        <h2 className='text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-2'>
          Ups! Zgubiliśmy drogę...
        </h2>

        {/* Opis w języku polskim */}
        <p className='text-sm sm:text-base text-on-surface-variant max-w-md mx-auto mt-3 leading-relaxed'>
          Adres URL, którego szukasz, nie istnieje, został przeniesiony lub
          wprowadzono błędną ścieżkę.
        </p>

        {/* Przyciski powrotu */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 w-full'>
          <Link
            href='/'
            className='flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/30'
          >
            <Home className='w-4 h-4' />
            <span>Wróć na stronę główną</span>
          </Link>
        </div>

        {/* Wskaźnik stanu systemu */}
        <div className='mt-8 pt-6 border-t border-border flex items-center justify-between text-xs text-on-surface-variant'>
          <div className='flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-primary animate-pulse' />
            <span>App Engine: Działa prawidłowo</span>
          </div>
          <span className='font-semibold text-primary'>Status 200 OK</span>
        </div>
      </div>
    </main>
  )
}
