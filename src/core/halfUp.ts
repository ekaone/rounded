import { shiftDecimal } from "../utils/precision";

/**
 * Round Half Up — the standard "school" rounding.
 * Ties (x.5) always round away from zero toward positive infinity.
 *
 * @example
 * halfUp(2.345, 2)  // → 2.35
 * halfUp(2.344, 2)  // → 2.34
 * halfUp(1.005, 2)  // → 1.01  (float-safe)
 * halfUp(-2.345, 2) // → -2.34 (toward positive infinity)
 */
export function halfUp(value: number, precision: number): number {
  const f = Math.pow(10, precision);
  const shifted = shiftDecimal(value, precision);
  return Math.round(shifted) / f;
}
