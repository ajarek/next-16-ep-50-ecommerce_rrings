import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Utwórz konto | AURA RING",
  description:
    "Dołącz do ekosystemu AURA RING — utwórz konto, aby synchronizować biometrię i zarządzać zamówieniami.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <AuthShell
        eyebrow="AURA IDENTITY • REJESTRACJA"
        title="Dołącz do ekosystemu"
        description="Utwórz konto w kilka chwil i zyskaj dostęp do spersonalizowanej biometrii, rozmiarów i rezerwacji."
      >
        <RegisterForm />
      </AuthShell>
    </main>
  );
}
