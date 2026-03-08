import { guard } from "../utils/guard";

/**
 * Cash Rounding — rounds to the nearest physical denomination.
 * Used when exact change isn't possible (e.g. no 1-cent coins).
 *
 * @param value   - The amount to round
 * @param nearest - The denomination to round to (default: 0.05)
 *
 * @example
 * cash(1.03)                  // → 1.05
 * cash(1.02)                  // → 1.00
 * cash(1.07, { nearest: 0.10 }) // → 1.10
 * cash(1.13, { nearest: 0.25 }) // → 1.25
 * cash(1.12, { nearest: 0.25 }) // → 1.00
 */
export function cash(
  value: number,
  options: { nearest?: number } = {}
): number | null {
  const n = guard(value);
  if (n === null) return null;

  const nearest = options.nearest ?? 0.05;
  const nearestGuard = guard(nearest);
  if (nearestGuard === null || nearestGuard <= 0) return null;

  // Multiply to avoid float drift, then round
  const factor = 1 / nearestGuard;
  return Math.round(n * factor) / factor;
}
