/**
 * ISO 4217 decimal precision for supported currencies.
 * Key = uppercase currency code, Value = number of decimal places.
 */
export const CURRENCY_PRECISION: Readonly<Record<string, number>> = {
  // 2 decimal places — most common
  AED: 2, AUD: 2, BRL: 2, CAD: 2, CHF: 2,
  CNY: 2, EUR: 2, GBP: 2, HKD: 2, ILS: 2,
  INR: 2, MXN: 2, MYR: 2, NOK: 2, NZD: 2,
  PHP: 2, PLN: 2, RON: 2, SEK: 2, SGD: 2,
  THB: 2, TRY: 2, USD: 2, ZAR: 2,

  // 0 decimal places — no subunit
  BIF: 0, CLP: 0, DJF: 0, GNF: 0, IDR: 0,
  JPY: 0, KMF: 0, KRW: 0, MGA: 0, PYG: 0,
  RWF: 0, UGX: 0, VND: 0, VUV: 0, XAF: 0,
  XOF: 0, XPF: 0,

  // 3 decimal places — Gulf region & others
  BHD: 3, IQD: 3, JOD: 3, KWD: 3, LYD: 3,
  OMR: 3, TND: 3,
} as const;

export type CurrencyCode = keyof typeof CURRENCY_PRECISION;
