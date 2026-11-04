import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Logowanie | AURA RING",
  description:
    "Zaloguj się do konta AURA RING, aby zarządzać pierścieniem, historią biometrii i rezerwacjami w salonach.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <AuthShell
        eyebrow="AURA IDENTITY • LOGOWANIE"
        title="Witaj ponownie"
        description="Zaloguj się, aby wrócić do swojego pierścienia, danych biometrycznych i historii zamówień."
      >
        <LoginForm />
      </AuthShell>
    </main>
  );
}
