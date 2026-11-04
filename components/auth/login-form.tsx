"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { sanitizeRedirect } from "@/lib/auth/redirect";
import { FormField } from "@/components/auth/form-field";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

interface FieldErrors {
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, sendPasswordReset, isConfigured } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const isBusy = isSubmitting || isGoogleLoading;

  const navigateAfterLogin = () => {
    const redirectParam = new URLSearchParams(window.location.search).get(
      "redirect",
    );
    router.replace(sanitizeRedirect(redirectParam));
    router.refresh();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    const nextErrors: FieldErrors = {};

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Podaj poprawny adres e-mail.";
    }

    if (!password) {
      nextErrors.password = "Podaj hasło do swojego konta.";
    }

    setErrors(nextErrors);
    setFormError(null);
    setResetMessage(null);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await signInWithEmail(email.trim(), password);
      navigateAfterLogin();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isBusy) return;

    setErrors({});
    setFormError(null);
    setResetMessage(null);
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      navigateAfterLogin();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setErrors({ email: "Wpisz adres e-mail, aby otrzymać link do resetu hasła." });
      setFormError(null);
      setResetMessage(null);
      return;
    }

    setIsResetting(true);
    setFormError(null);
    setResetMessage(null);

    try {
      await sendPasswordReset(email.trim());
      setResetMessage(
        `Wysłaliśmy link do ustawienia nowego hasła na adres ${email.trim()}.`,
      );
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-5">
      {!isConfigured ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-xs text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Logowanie jest chwilowo niedostępne — brak konfiguracji Firebase.
            Uzupełnij zmienne środowiskowe i uruchom aplikację ponownie.
          </span>
        </div>
      ) : null}

      <GoogleAuthButton
        onClick={handleGoogleSignIn}
        isLoading={isGoogleLoading}
        disabled={!isConfigured || isSubmitting}
        label="Kontynuuj z Google"
      />

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-zinc-800" />
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
          lub e-mailem
        </span>
        <span className="h-px flex-1 bg-zinc-800" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          id="login-email"
          label="Adres e-mail"
          icon={Mail}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="twoj@email.pl"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          disabled={isSubmitting}
        />

        <FormField
          id="login-password"
          label="Hasło"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          disabled={isSubmitting}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
              aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          }
        />

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={isResetting || isBusy}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 transition hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResetting ? (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            ) : null}
            Nie pamiętasz hasła?
          </button>
        </div>

        {formError ? (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-xs leading-relaxed text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{formError}</span>
          </div>
        ) : null}

        {resetMessage ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-3 text-xs leading-relaxed text-emerald-300"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{resetMessage}</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isBusy || !isConfigured}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.25)] transition hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.4)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Weryfikacja...</span>
            </>
          ) : (
            <>
              <span>Zaloguj się</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-zinc-500">
        Nie masz jeszcze konta?{" "}
        <Link
          href="/rejestracja"
          className="font-semibold text-amber-300 transition hover:text-amber-200"
        >
          Utwórz konto AURA
        </Link>
      </p>
    </div>
  );
}
