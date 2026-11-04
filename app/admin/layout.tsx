import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, ShieldAlert, ShieldCheck } from "lucide-react";
import { getSessionUser, isAdminUser } from "@/lib/firebase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

// Konsola celowo czeka na weryfikację sesji, zamiast pokazywać pośredni UI.
export const instant = false;

export const metadata: Metadata = {
  title: "Konsola Monitoringu i Sprzedaży IoT | AURA TELEMETRY CLOUD",
  description:
    "Centralne zarządzanie dystrybucją pierścieni biometrycznych AURA Gen 3, procesami przymierzalnika Sizing Kit oraz przepływem danych telemetrycznych.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Konsola musi być renderowana przy żądaniu — statyczna powłoka nie może
  // ujawniać widoku administratora przed weryfikacją sesji.
  await connection();

  const user = await getSessionUser();

  if (!user) {
    redirect("/logowanie?redirect=/admin");
  }

  if (!isAdminUser(user)) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#07080c] px-4 py-16">
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-red-500/25 bg-[#0d0e14] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
            <ShieldAlert className="h-8 w-8" aria-hidden="true" />
          </div>

          <span className="relative mt-5 inline-block text-[10px] font-semibold uppercase tracking-[0.24em] text-red-400">
            AURA TELEMETRY CLOUD • ODMOWA DOSTĘPU
          </span>
          <h1 className="relative mt-2 font-serif text-3xl font-normal text-white">
            Brak uprawnień
          </h1>
          <p className="relative mx-auto mt-3 max-w-sm text-xs leading-relaxed text-zinc-400">
            Konsola administracyjna jest dostępna wyłącznie dla konta
            administratora AURA. Twoje konto nie ma uprawnień do tego obszaru.
          </p>

          <div className="relative mt-5 rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-left">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              <ShieldCheck className="h-3 w-3 text-emerald-400/80" aria-hidden="true" />
              Zalogowane konto
            </p>
            <p className="mt-1 truncate text-xs font-medium text-zinc-200">
              {user.email ?? user.uid}
            </p>
          </div>

          <div className="relative mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-950 transition hover:bg-amber-300"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Wróć do sklepu
            </Link>
            <SignOutButton className="px-5 py-3 uppercase tracking-[0.16em]" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
