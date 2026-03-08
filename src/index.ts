import { guard } from "./utils/guard";
import { halfUp } from "./core/halfUp";
import { bankers } from "./core/bankers";
import { cash } from "./core/cash";
import { currency } from "./currency/currency";

export type RoundingMethod = "halfUp" | "bankers";

export interface RoundedOptions {
  /** Number of decimal places. Defaults to 2. */
  precision?: number;
  /** Rounding algorithm. Defaults to "halfUp". */
  method?: RoundingMethod;
}

/**
 * Round a number to a given precision using the specified method.
 * Returns null for invalid inputs (NaN, null, Infinity).
 *
 * @example
 * rounded(2.345)                          // → 2.35
 * rounded(2.345, { precision: 2 })        // → 2.35
 * rounded(2.345, { method: "bankers" })   // → 2.34
 * rounded(NaN)                            // → null
 */
function rounded(value: unknown, options: RoundedOptions = {}): number | null {
  const n = guard(value);
  if (n === null) return null;

  const precision = options.precision ?? 2;
  const method = options.method ?? "halfUp";

  return method === "bankers" ? bankers(n, precision) : halfUp(n, precision);
}

rounded.cash = cash;
rounded.currency = currency;

export { rounded, halfUp, bankers, cash, currency };
export { CURRENCY_PRECISION } from "./currency/currencyMap.js";
export type { CurrencyCode } from "./currency/currencyMap.js";
export type { CurrencyOptions, CurrencyRoundingMethod } from "./currency/currency.js";

export default rounded;
