"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getUserInitials } from "@/lib/auth/display";

export function AccountMenu() {
  const { user, status, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await signOut();
    } catch (error) {
      console.warn(
        "[auth] Wylogowanie nie powiodło się.",
        error instanceof Error ? error.message : "nieznany błąd",
      );
    } finally {
      setIsOpen(false);
      setIsSigningOut(false);
      router.replace("/");
      router.refresh();
    }
  };

  if (status === "loading") {
    return (
      <span
        className="h-7 w-7 animate-pulse rounded-full border border-zinc-800 bg-zinc-900"
        aria-label="Ładowanie stanu konta"
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/logowanie"
        className="flex items-center gap-1.5 text-xs text-zinc-300 transition hover:text-amber-300"
      >
        <UserRound className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
        <span className="hidden md:inline">Logowanie</span>
      </Link>
    );
  }

  const displayName =
    user.displayName?.trim() || user.email?.split("@")[0] || "Konto AURA";
  const initials = getUserInitials(user.displayName, user.email);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-label={`Menu konta ${displayName}`}
        className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 py-1 pl-1 pr-2.5 text-xs text-zinc-200 transition hover:border-amber-500/40 hover:text-white"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-[10px] font-bold tracking-wide text-amber-300">
          {initials}
        </span>
        <span className="hidden max-w-24 truncate xl:inline">{displayName}</span>
        <ChevronDown
          className="h-3 w-3 text-zinc-500 transition-transform"
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-800 bg-[#0c0d12] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="border-b border-zinc-800/80 px-4 py-3">
            <p className="truncate text-xs font-semibold text-white">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-zinc-500">
              {user.email}
            </p>
            {isAdmin ? (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Administrator
              </span>
            ) : null}
          </div>

          {isAdmin ? (
            <div className="border-b border-zinc-800/80 p-1.5">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-800/80 hover:text-amber-300"
              >
                <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
                Konsola administratora
              </Link>
            </div>
          ) : null}

          <div className="p-1.5">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-zinc-300 transition hover:bg-zinc-800/80 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {isSigningOut ? "Wylogowywanie..." : "Wyloguj się"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
