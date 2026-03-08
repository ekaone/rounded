import { guard } from "../utils/guard";
import { halfUp } from "../core/halfUp";
import { bankers } from "../core/bankers";
import { CURRENCY_PRECISION } from "./currencyMap";

export type CurrencyRoundingMethod = "halfUp" | "bankers";

export interface CurrencyOptions {
  /** Rounding method. Defaults to "halfUp". */
  method?: CurrencyRoundingMethod;
}

/**
 * Round a value to the correct decimal precision for a given ISO 4217 currency.
 * Returns null for invalid inputs or unknown currency codes.
 *
 * @example
 * currency(10.1265, "USD")               // → 10.13
 * currency(1500.5,  "JPY")               // → 1501
 * currency(10.1265, "KWD")               // → 10.127
 * currency(10.1265, "USD", { method: "bankers" }) // → 10.13
 */
export function currency(
  value: number,
  code: string,
  options: CurrencyOptions = {}
): number | null {
  const n = guard(value);
  if (n === null) return null;

  const upper = code.toUpperCase();
  const precision = CURRENCY_PRECISION[upper];

  if (precision === undefined) return null;

  const method = options.method ?? "halfUp";
  return method === "bankers" ? bankers(n, precision) : halfUp(n, precision);
}
