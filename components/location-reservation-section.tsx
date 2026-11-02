"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, CheckCircle2, UserRound } from "lucide-react";
import { SALONS } from "@/lib/data";

const TIME_SLOTS = [
  { value: "11:00", label: "11:00 (Wolny termin)", available: true },
  { value: "12:30", label: "12:30 (Wolny termin)", available: true },
  { value: "14:00", label: "14:00 (Wolny termin)", available: true },
  { value: "15:30", label: "15:30 (Ostatnie wolne)", available: true },
  { value: "17:00", label: "17:00 (Wolny termin)", available: true },
  { value: "18:30", label: "18:30 (Zajęty)", available: false },
];

const AVAILABILITY_STYLES: Record<string, string> = {
  Dzisiaj: "bg-emerald-500/15 text-emerald-300",
  Jutro: "bg-amber-500/15 text-amber-300",
};

type FormErrors = Partial<
  Record<"date" | "time" | "name" | "email" | "phone" | "regulations", string>
>;

export function LocationReservationSection() {
  const [salonId, setSalonId] = useState(SALONS[0].id);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("11:00");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const selectedSalon = SALONS.find((salon) => salon.id === salonId) ?? SALONS[0];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};

    if (!date) nextErrors.date = "Wybierz termin wizyty w salonie.";
    if (!time) nextErrors.time = "Wybierz godzinę sesji pomiarowej.";
    if (name.trim().length < 3)
      nextErrors.name = "Podaj imię i nazwisko (minimum 3 znaki).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Podaj poprawny adres e-mail.";
    if (phone.replace(/\D/g, "").length < 9)
      nextErrors.phone = "Podaj poprawny numer telefonu.";
    if (!accepted)
      nextErrors.regulations =
        "Zaakceptuj regulamin przymiarek i politykę poufności.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  };

  const fieldClasses = (hasError?: string) =>
    `w-full rounded-xl border bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition ${
      hasError
        ? "border-red-500/70 focus:border-red-400"
        : "border-zinc-800 focus:border-amber-500/60"
    }`;

  if (submitted) {
    return (
      <section
        id="rezerwacja"
        className="relative border-b border-zinc-800/80 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
            <h2 className="mt-4 font-serif text-2xl text-white sm:text-3xl">
              Rezerwacja przyjęta!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Twoja prywatna sesja pomiarowa w salonie{" "}
              <span className="font-semibold text-amber-300">
                {selectedSalon.mapLabel}
              </span>{" "}
              została zarezerwowana na{" "}
              <span className="font-semibold text-amber-300">
                {date} o {time}
              </span>
              . Potwierdzenie wysłaliśmy na adres{" "}
              <span className="font-semibold text-amber-300">{email}</span>.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-xs font-semibold text-zinc-200 transition hover:border-amber-500/50 hover:text-white cursor-pointer"
            >
              Zarezerwuj kolejną wizytę
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="rezerwacja"
      className="relative overflow-hidden border-b border-zinc-800/80 py-14 sm:py-20"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-amber-500/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            <UserRound className="h-3.5 w-3.5" />
            Dedykowany konsjerż
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl">
            Zarezerwuj prywatną sesję pomiarową
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Bezpłatna 20-minutowa konsultacja biometryczna z ekspertem Aura.
            Sprawdź rozmiary, dobierz idealny profil pierścienia i skosztuj
            selektywnej kawy w naszym salonie.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto mt-10 max-w-3xl rounded-2xl border border-zinc-800 bg-[#0d0e14] p-6 sm:p-8"
        >
          {/* Step 1: Salon */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              1. Wybierz dogodny salon
            </legend>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SALONS.map((salon) => {
                const isSelected = salon.id === salonId;
                return (
                  <button
                    key={salon.id}
                    type="button"
                    onClick={() => setSalonId(salon.id)}
                    aria-pressed={isSelected}
                    className={`rounded-xl px-4 py-3 text-left transition cursor-pointer ${
                      isSelected
                        ? "border border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(229,184,105,0.1)]"
                        : "border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white">
                        {salon.city} • {salon.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                      )}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500">
                      Dostępność:
                      {salon.availability.map((slot) => (
                        <span
                          key={slot}
                          className={`rounded px-1.5 py-0.5 font-semibold ${
                            AVAILABILITY_STYLES[slot] ?? "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {slot}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Step 2 & 3: Date & Time */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reservation-date"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                2. Wybierz termin
              </label>
              <div className="relative mt-3">
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400" />
                <input
                  id="reservation-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  aria-invalid={Boolean(errors.date)}
                  className={`${fieldClasses(errors.date)} pl-11 [color-scheme:dark]`}
                />
              </div>
              {errors.date && (
                <p className="mt-1.5 text-[11px] text-red-400" role="alert">
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="reservation-time"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                3. Wybierz godzinę sesji
              </label>
              <div className="relative mt-3">
                <select
                  id="reservation-time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  aria-invalid={Boolean(errors.time)}
                  className={`${fieldClasses(errors.time)} appearance-none pr-10`}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option
                      key={slot.value}
                      value={slot.value}
                      disabled={!slot.available}
                    >
                      {slot.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              </div>
              {errors.time && (
                <p className="mt-1.5 text-[11px] text-red-400" role="alert">
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          {/* Step 4: Contact data */}
          <div className="mt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              4. Twoje dane kontaktowe
            </span>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="reservation-name" className="sr-only">
                  Imię i nazwisko
                </label>
                <input
                  id="reservation-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Imię i nazwisko"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  className={fieldClasses(errors.name)}
                />
                {errors.name && (
                  <p className="mt-1.5 text-[11px] text-red-400" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="reservation-email" className="sr-only">
                  Adres e-mail
                </label>
                <input
                  id="reservation-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Adres e-mail"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  className={fieldClasses(errors.email)}
                />
                {errors.email && (
                  <p className="mt-1.5 text-[11px] text-red-400" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="reservation-phone" className="sr-only">
                  Numer telefonu
                </label>
                <input
                  id="reservation-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Numer telefonu (+48)"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  className={fieldClasses(errors.phone)}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-[11px] text-red-400" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Regulations checkbox */}
          <div className="mt-6">
            <label
              htmlFor="reservation-regulations"
              className="flex cursor-pointer items-start gap-3"
            >
              <input
                id="reservation-regulations"
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                aria-invalid={Boolean(errors.regulations)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-amber-400"
              />
              <span className="text-xs leading-relaxed text-zinc-400">
                Akceptuję regulamin bezpłatnych przymiarek i politykę
                poufności biometrycznej.
              </span>
            </label>
            {errors.regulations && (
              <p className="mt-1.5 text-[11px] text-red-400" role="alert">
                {errors.regulations}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="mt-6 border-t border-zinc-800/80 pt-6 text-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-400 bg-amber-400 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-[0_0_25px_rgba(229,184,105,0.3)] transition-all hover:bg-amber-300 hover:shadow-[0_0_35px_rgba(229,184,105,0.45)] active:scale-95 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              Potwierdź rezerwację
            </button>
            <p className="mt-3 text-[11px] text-zinc-500">
              Bezpłatnie • Bez zobowiązań • Anulowanie do 2 h przed wizytą
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
