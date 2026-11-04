/**
 * Przepuszcza wyłącznie wewnętrzne ścieżki aplikacji, aby parametr
 * ?redirect= nie mógł posłużyć do przekierowania na obcą domenę.
 */
export function sanitizeRedirect(
  target: string | null | undefined,
  fallback = "/",
): string {
  if (!target) return fallback;
  if (!target.startsWith("/") || target.startsWith("//")) return fallback;
  if (target.startsWith("/\\")) return fallback;

  return target;
}
