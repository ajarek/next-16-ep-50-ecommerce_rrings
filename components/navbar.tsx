"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  LayoutDashboard,
  Globe,
  Menu,
  X,
  Loader2,
  LogOut,
  UserRound,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { AccountMenu } from "@/components/account-menu";

export function Navbar() {
  const { totalCount, setIsCartOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileSigningOut, setIsMobileSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: "Produkty", href: "/products" },
    { label: "O nas", href: "/about-us" },
    { label: "Salony i Lokalizacja", href: "/location" },
    { label: "Technologia & Pomiary", href: "/technology" },
  ];

  const handleMobileSignOut = async () => {
    if (isMobileSigningOut) return;

    setIsMobileSigningOut(true);

    try {
      await signOut();
    } catch (error) {
      console.warn(
        "[auth] Wylogowanie nie powiodło się.",
        error instanceof Error ? error.message : "nieznany błąd",
      );
    } finally {
      setMobileMenuOpen(false);
      setIsMobileSigningOut(false);
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#070709]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-linear-to-br from-zinc-800 to-zinc-950 shadow-[0_0_15px_rgba(229,184,105,0.15)] group-hover:border-amber-400/50">
            <span className="font-serif text-sm font-bold tracking-wider text-amber-300">
              A
            </span>
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold tracking-[0.2em] text-white">
              AURA RING
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === pathname ||
              (link.href === "/products" && pathname.startsWith("/products"));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs tracking-wider transition-colors relative py-1 ${
                  isActive
                    ? "font-semibold text-amber-300"
                    : "font-medium text-zinc-300 hover:text-amber-300"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(229,184,105,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side utility icons, account & cart */}
        <div className="hidden items-center gap-4 sm:flex">
          {/* Currency / Language selector */}
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            title="Waluta i język"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-amber-200/90">PLN</span>
            <span className="text-zinc-600">|</span>
            <span>PL</span>
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-lg border border-amber-500/40 bg-linear-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-200 shadow-[0_0_20px_rgba(229,184,105,0.12)] transition hover:border-amber-400 hover:bg-amber-500/25 active:scale-95"
            aria-label={`Koszyk z ${totalCount} produktami`}
          >
            <ShoppingBag className="h-4 w-4 text-amber-400" />
            <span>Koszyk</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-bold text-zinc-950">
              {totalCount}
            </span>
          </button>

          {/* Account / Login */}
          <AccountMenu />
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 text-amber-300"
            aria-label="Koszyk"
          >
            <ShoppingBag className="h-4 w-4" />
            {totalCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-zinc-950">
                {totalCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 hover:text-white"
            aria-label="Menu nawigacji"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-800 bg-[#0c0d12] px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive =
                link.href === pathname ||
                (link.href === "/products" && pathname.startsWith("/products"));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "font-semibold text-amber-300"
                      : "font-medium text-zinc-200 hover:text-amber-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 flex flex-col gap-3 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-amber-400" /> PLN / Polska
              </span>

              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-zinc-200">
                      {user.displayName?.trim() || user.email}
                    </p>
                    <p className="truncate text-[11px] text-zinc-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300"
                      >
                        <LayoutDashboard className="h-3 w-3" aria-hidden="true" />
                        Admin
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleMobileSignOut}
                      disabled={isMobileSigningOut}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isMobileSigningOut ? (
                        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                      ) : (
                        <LogOut className="h-3 w-3" aria-hidden="true" />
                      )}
                      Wyloguj
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/logowanie"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 font-semibold text-amber-300"
                  >
                    <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                    Zaloguj się
                  </Link>
                  <span className="text-zinc-600">•</span>
                  <Link
                    href="/rejestracja"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-zinc-300"
                  >
                    Utwórz konto
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
