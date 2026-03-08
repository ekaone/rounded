/**
 * Returns null if the value is not a finite, safe number.
 * Covers: NaN, null, undefined, Infinity, -Infinity, non-numeric strings.
 */
export function guard(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}