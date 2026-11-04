"use client";

import { useMemo, useState, type FormEvent } from "react";
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
  MailCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { sanitizeRedirect } from "@/lib/auth/redirect";
import { FormField } from "@/components/auth/form-field";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { cn } from "@/lib/utils";

interface FieldErrors {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < 8) {
    return { score: 0, label: "Wymagane min. 8 znaków" };
  }

  if (score <= 2) return { score: 1, label: "Hasło podstawowe" };
  if (score === 3) return { score: 2, label: "Hasło dobre" };

  return { score: 3, label: "Hasło bardzo mocne" };
}

export function RegisterForm() {
  const router = useRouter();
  const { registerWithEmail, signInWithGoogle, isConfigured } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const isBusy = isSubmitting || isGoogleLoading;

  const navigateAfterRegister = () => {
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
    const cleanName = displayName.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) {
      nextErrors.displayName = "Podaj imię lub nazwę, której będziemy używać.";
    }

    if (!EMAIL_PATTERN.test(cleanEmail)) {
      nextErrors.email = "Podaj poprawny adres e-mail.";
    }

    if (password.length < 8) {
      nextErrors.password = "Hasło musi mieć co najmniej 8 znaków.";
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Hasła nie są identyczne.";
    }

    if (!acceptedTerms) {
      nextErrors.terms = "Zaakceptuj regulamin i politykę prywatności.";
    }

    setErrors(nextErrors);
    setFormError(null);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await registerWithEmail({
        displayName: cleanName,
        email: cleanEmail,
        password,
      });
      setCreatedEmail(cleanEmail);
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
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      navigateAfterRegister();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (createdEmail) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
          <MailCheck className="h-8 w-8" aria-hidden="true" />
        </div>

        <h2 className="mt-5 font-serif text-2xl font-normal text-white">
          Konto zostało utworzone
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-zinc-400">
          Wysłaliśmy wiadomość weryfikacyjną na adres{" "}
          <span className="font-medium text-zinc-200">{createdEmail}</span>.
          Potwierdź e-mail, aby w pełni korzystać z ekosystemu AURA.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.25)] transition hover:bg-amber-300"
          >
            <span>Przejdź do sklepu</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <Link
            href="/technology"
            className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300 transition hover:border-amber-500/40 hover:text-white"
          >
            Poznaj technologię AURA
          </Link>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-600">
          <ShieldCheck className="h-3 w-3 text-emerald-400/70" aria-hidden="true" />
          Twoje dane są chronione przez Firebase Authentication
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!isConfigured ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-xs text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Rejestracja jest chwilowo niedostępna — brak konfiguracji Firebase.
            Uzupełnij zmienne środowiskowe i uruchom aplikację ponownie.
          </span>
        </div>
      ) : null}

      <GoogleAuthButton
        onClick={handleGoogleSignIn}
        isLoading={isGoogleLoading}
        disabled={!isConfigured || isSubmitting}
        label="Zarejestruj się z Google"
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
          id="register-name"
          label="Imię i nazwisko"
          icon={UserRound}
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Jan Kowalski"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          error={errors.displayName}
          disabled={isSubmitting}
        />

        <FormField
          id="register-email"
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

        <div>
          <FormField
            id="register-password"
            label="Hasło"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            name="new-password"
            autoComplete="new-password"
            placeholder="Minimum 8 znaków"
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

          {password.length > 0 ? (
            <div className="mt-2 flex items-center gap-2" aria-live="polite">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3].map((level) => (
                  <span
                    key={level}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      strength.score >= level
                        ? strength.score === 1
                          ? "bg-amber-500"
                          : strength.score === 2
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        : "bg-zinc-800",
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium text-zinc-500">
                {strength.label}
              </span>
            </div>
          ) : null}
        </div>

        <FormField
          id="register-confirm-password"
          label="Powtórz hasło"
          icon={Lock}
          type={showConfirmPassword ? "text" : "password"}
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Powtórz hasło"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          trailing={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
              aria-label={showConfirmPassword ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          }
        />

        <div>
          <label className="flex items-start gap-2.5 text-[11px] leading-relaxed text-zinc-400">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => {
                setAcceptedTerms(event.target.checked);
                if (event.target.checked) {
                  setErrors((current) => ({ ...current, terms: undefined }));
                }
              }}
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? "register-terms-error" : undefined}
              className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-amber-400"
            />
            <span>
              Akceptuję{" "}
              <Link href="#regulamin" className="text-amber-300 hover:underline">
                regulamin sklepu
              </Link>{" "}
              oraz{" "}
              <Link href="#polityka" className="text-amber-300 hover:underline">
                politykę prywatności
              </Link>
              , w tym przetwarzanie danych w Firebase.
            </span>
          </label>

          {errors.terms ? (
            <p
              id="register-terms-error"
              role="alert"
              className="mt-1.5 text-[11px] font-medium text-red-400"
            >
              {errors.terms}
            </p>
          ) : null}
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

        <button
          type="submit"
          disabled={isBusy || !isConfigured}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400 bg-amber-400 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.25)] transition hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.4)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Tworzenie konta...</span>
            </>
          ) : (
            <>
              <span>Utwórz konto</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-zinc-500">
        Masz już konto?{" "}
        <Link
          href="/logowanie"
          className="font-semibold text-amber-300 transition hover:text-amber-200"
        >
          Zaloguj się
        </Link>
      </p>

      <div className="flex items-start gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-3.5 py-3 text-[10px] leading-relaxed text-zinc-500">
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/80" aria-hidden="true" />
        <span>
          Po rejestracji wyślemy link weryfikacyjny. Do tego czasu konto działa,
          ale dostęp do funkcji premium może być ograniczony.
        </span>
      </div>
    </div>
  );
}
