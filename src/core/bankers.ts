import { shiftDecimal } from "../utils/precision";

/**
 * Banker's Rounding — Round Half to Even.
 * Ties (x.5) round to the nearest even digit, reducing cumulative bias
 * across large sets of financial transactions.
 *
 * @example
 * bankers(2.345, 2) // → 2.34  (4 is even)
 * bankers(2.355, 2) // → 2.36  (6 is even)
 * bankers(2.5,   0) // → 2     (2 is even)
 * bankers(3.5,   0) // → 4     (4 is even)
 */
export function bankers(value: number, precision: number): number {
  const f = Math.pow(10, precision);
  const sign = value < 0 ? -1 : 1;

  // Work on the absolute value; restore sign after
  const shifted = shiftDecimal(Math.abs(value), precision);
  const floor = Math.floor(shifted);
  const diff = shifted - floor;

  let rounded: number;
  if (diff < 0.5) {
    rounded = floor;
  } else if (diff > 0.5) {
    rounded = floor + 1;
  } else {
    // Exactly 0.5 — round to even
    rounded = floor % 2 === 0 ? floor : floor + 1;
  }

  return (sign * rounded) / f;
}
