"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  className?: string;
  label?: string;
}

export function SignOutButton({
  className,
  label = "Wyloguj się",
}: SignOutButtonProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

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
      router.replace("/");
      router.refresh();
      setIsSigningOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:border-amber-500/40 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {isSigningOut ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{isSigningOut ? "Wylogowywanie..." : label}</span>
    </button>
  );
}
