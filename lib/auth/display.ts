/** Zwraca maksymalnie dwuliterowe inicjały dla awatara konta. */
export function getUserInitials(
  displayName: string | null | undefined,
  email: string | null | undefined,
): string {
  const source = displayName?.trim() || email?.split("@")[0] || "AURA";
  const parts = source.split(/[\s._-]+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}
