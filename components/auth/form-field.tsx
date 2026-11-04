import type { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export function FormField({
  id,
  label,
  icon: Icon,
  error,
  hint,
  trailing,
  className,
  ...props
}: FormFieldProps) {
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-3 pl-11 text-sm text-zinc-100 placeholder:text-zinc-600 transition",
            "focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
            trailing ? "pr-11" : "pr-3.5",
            error && "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/15",
            className,
          )}
          {...props}
        />

        {trailing ? (
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</div>
        ) : null}
      </div>

      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-[11px] font-medium leading-relaxed text-red-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
