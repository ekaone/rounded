# @ekaone/rounded

> Lightweight, zero-dependency rounding library for finance and payments.

## Features

- ✅ **Half Up** — standard receipt/POS rounding
- ✅ **Banker's Rounding** — round half to even, reduces cumulative bias
- ✅ **Cash Rounding** — nearest 0.05 / 0.10 / 0.25 etc.
- ✅ **Currency-aware** — correct decimal precision per ISO 4217 code
- ✅ **Null-safe** — invalid inputs return `null`, never throw
- ✅ **Float-safe** — guards against `0.1 + 0.2` drift
- ✅ **Zero dependencies**
- ✅ **Dual ESM + CJS** output with full TypeScript types

---

## Installation

```bash
npm install @ekaone/rounded
# or
yarn add @ekaone/rounded
# or
pnpm add @ekaone/rounded
```

---

## Quick Start

### Core rounding

```ts
import rounded from "@ekaone/rounded";

rounded(2.345)                         // → 2.35  (halfUp, 2dp default)
rounded(2.345, { precision: 2 })       // → 2.35
rounded(2.345, { method: "bankers" })  // → 2.34
rounded(NaN)                           // → null
rounded(null)                          // → null
rounded(Infinity)                      // → null
```

### Cash rounding

```ts
rounded.cash(1.03)                      // → 1.05  (default nearest: 0.05)
rounded.cash(1.02)                      // → 1.00
rounded.cash(1.07, { nearest: 0.10 })  // → 1.10
rounded.cash(1.13, { nearest: 0.25 })  // → 1.25
```

### Currency-aware rounding

```ts
rounded.currency(10.1265, "USD")                         // → 10.13
rounded.currency(1500.5,  "JPY")                         // → 1501
rounded.currency(10.1265, "KWD")                         // → 10.127
rounded.currency(10.125,  "USD", { method: "bankers" })  // → 10.12
```

---

## API

### `rounded(value, options?)` — default export

The main entry point. Rounds a number using the specified method and precision.

```ts
rounded(value: unknown, options?: RoundedOptions): number | null
```

| Parameter           | Type             | Default    | Description                   |
|---------------------|------------------|------------|-------------------------------|
| `value`             | `unknown`        | —          | The number to round           |
| `options.precision` | `number`         | `2`        | Number of decimal places      |
| `options.method`    | `RoundingMethod` | `"halfUp"` | Rounding algorithm to use     |

Returns `null` if `value` is `NaN`, `null`, `undefined`, `Infinity`, or `-Infinity`.

```ts
rounded(2.345)                                      // → 2.35
rounded(2.345, { precision: 4 })                    // → 2.345
rounded(2.345, { method: "bankers" })               // → 2.34
rounded(2.345, { precision: 2, method: "bankers" }) // → 2.34
rounded(NaN)                                        // → null
rounded(null)                                       // → null
```

---

### `rounded.cash(value, options?)` — cash rounding

Rounds to the nearest physical denomination. Useful when a currency has no low-denomination coins (e.g. Sweden, Australia, New Zealand).

```ts
rounded.cash(value: number, options?: CashOptions): number | null
```

| Parameter          | Type     | Default | Description                                 |
|--------------------|----------|---------|---------------------------------------------|
| `value`            | `number` | —       | The amount to round                         |
| `options.nearest`  | `number` | `0.05`  | The denomination increment to round toward  |

Returns `null` if `value` is invalid or if `nearest` is `0`, negative, or invalid.

```ts
rounded.cash(1.03)                      // → 1.05
rounded.cash(1.02)                      // → 1.00
rounded.cash(1.07, { nearest: 0.10 })  // → 1.10
rounded.cash(1.12, { nearest: 0.25 })  // → 1.00
rounded.cash(1.13, { nearest: 0.25 })  // → 1.25
rounded.cash(1.49, { nearest: 1 })     // → 1.00
rounded.cash(1.50, { nearest: 1 })     // → 2.00
rounded.cash(NaN)                      // → null
```

---

### `rounded.currency(value, code, options?)` — currency-aware rounding

Rounds a value to the correct number of decimal places for a given ISO 4217 currency code. Precision is looked up automatically from the built-in currency map.

```ts
rounded.currency(value: number, code: string, options?: CurrencyOptions): number | null
```

| Parameter        | Type                     | Default    | Description                               |
|------------------|--------------------------|------------|-------------------------------------------|
| `value`          | `number`                 | —          | The amount to round                       |
| `code`           | `string`                 | —          | ISO 4217 currency code (case-insensitive) |
| `options.method` | `CurrencyRoundingMethod` | `"halfUp"` | Rounding algorithm to use                 |

Returns `null` if `value` is invalid or if `code` is not a recognised currency.

```ts
rounded.currency(10.1265, "USD")                         // → 10.13   (2dp)
rounded.currency(10.1265, "usd")                         // → 10.13   (case-insensitive)
rounded.currency(1500.5,  "JPY")                         // → 1501    (0dp)
rounded.currency(10.1265, "KWD")                         // → 10.127  (3dp)
rounded.currency(10.125,  "USD", { method: "bankers" })  // → 10.12
rounded.currency(10.135,  "USD", { method: "bankers" })  // → 10.14
rounded.currency(10.5,    "XYZ")                         // → null    (unknown code)
```

---

### Named exports — low-level functions

All core functions are also exported individually for direct use without the `rounded` wrapper.

```ts
import { halfUp, bankers, cash, currency, CURRENCY_PRECISION } from "@ekaone/rounded";
```

#### `halfUp(value, precision)`

```ts
halfUp(value: number, precision: number): number
```

Standard half-up rounding. Ties (`x.5`) always round toward positive infinity. Does **not** perform input validation — pass a clean `number`.

```ts
halfUp(2.345, 2)   // → 2.35
halfUp(2.344, 2)   // → 2.34
halfUp(1.005, 2)   // → 1.01  (float-safe)
halfUp(-2.345, 2)  // → -2.34 (toward +infinity)
halfUp(2.5, 0)     // → 3
halfUp(1.23456, 4) // → 1.2346
```

#### `bankers(value, precision)`

```ts
bankers(value: number, precision: number): number
```

Banker's rounding (round half to even). Ties round to whichever neighbour has an even last digit, eliminating upward bias across large transaction sets. Does **not** perform input validation.

```ts
bankers(2.345, 2)  // → 2.34  (4 is even — stay)
bankers(2.355, 2)  // → 2.36  (5 is odd  — round up to 6)
bankers(2.5, 0)    // → 2     (2 is even — stay)
bankers(3.5, 0)    // → 4     (4 is even — round up)
bankers(-2.5, 0)   // → -2    (-2 is even — stay)
bankers(-3.5, 0)   // → -4    (-4 is even — round up)
```

#### `cash(value, options?)`

See [`rounded.cash`](#roundedcashvalue-options--cash-rounding) — this is the same function.

#### `currency(value, code, options?)`

See [`rounded.currency`](#roundedcurrencyvalue-code-options--currency-aware-rounding) — this is the same function.

#### `CURRENCY_PRECISION`

A read-only record mapping uppercase ISO 4217 currency codes to their decimal precision.

```ts
import { CURRENCY_PRECISION } from "@ekaone/rounded";

CURRENCY_PRECISION["USD"]  // → 2
CURRENCY_PRECISION["JPY"]  // → 0
CURRENCY_PRECISION["KWD"]  // → 3
```

---

## Types & Interfaces

All types are exported and fully available in TypeScript projects.

```ts
import type {
  RoundingMethod,
  RoundedOptions,
  CurrencyRoundingMethod,
  CurrencyOptions,
  CurrencyCode,
} from "@ekaone/rounded";
```

### `RoundingMethod`

The rounding algorithm used by `rounded()`.

```ts
type RoundingMethod = "halfUp" | "bankers";
```

| Value       | Behaviour                                        |
|-------------|--------------------------------------------------|
| `"halfUp"`  | Ties round toward positive infinity (default)    |
| `"bankers"` | Ties round to nearest even digit (reduces bias)  |

---

### `RoundedOptions`

Options accepted by the main `rounded()` function.

```ts
interface RoundedOptions {
  /** Number of decimal places to round to. Defaults to 2. */
  precision?: number;

  /** Rounding algorithm. Defaults to "halfUp". */
  method?: RoundingMethod;
}
```

---

### `CurrencyRoundingMethod`

The rounding algorithm used by `currency()`. Identical in values to `RoundingMethod`.

```ts
type CurrencyRoundingMethod = "halfUp" | "bankers";
```

---

### `CurrencyOptions`

Options accepted by `rounded.currency()` and the named `currency()` export.

```ts
interface CurrencyOptions {
  /** Rounding algorithm. Defaults to "halfUp". */
  method?: CurrencyRoundingMethod;
}
```

---

### `CashOptions`

Options accepted by `rounded.cash()` and the named `cash()` export.

```ts
interface CashOptions {
  /** The denomination to round toward. Must be a positive number. Defaults to 0.05. */
  nearest?: number;
}
```

---

### `CurrencyCode`

A union type of all supported ISO 4217 currency code strings, derived directly from the `CURRENCY_PRECISION` map.

```ts
type CurrencyCode = keyof typeof CURRENCY_PRECISION;
// → "USD" | "EUR" | "JPY" | "KWD" | ... (30+ codes)
```

Use this to constrain function arguments in your own code:

```ts
import type { CurrencyCode } from "@ekaone/rounded";
import { currency } from "@ekaone/rounded";

function formatAmount(value: number, code: CurrencyCode): string {
  const result = currency(value, code);
  return result !== null ? `${code} ${result.toFixed(2)}` : "—";
}
```

---

## Null-safety contract

Every public function that accepts user-facing input returns `number | null`. The library **never throws**. A `null` return always means the input was invalid.

| Input             | Returns  |
|-------------------|----------|
| `NaN`             | `null`   |
| `null`            | `null`   |
| `undefined`       | `null`   |
| `Infinity`        | `null`   |
| `-Infinity`       | `null`   |
| Unknown currency  | `null`   |
| `nearest <= 0`    | `null`   |
| Valid `number`    | `number` |

> The low-level named exports (`halfUp`, `bankers`) skip the null guard for performance. Only use them when you have already validated the input.

---

## Supported currencies

| Decimals | Currencies |
|----------|------------|
| **2**    | AED, AUD, BRL, CAD, CHF, CNY, EUR, GBP, HKD, ILS, INR, MXN, MYR, NOK, NZD, PHP, PLN, RON, SEK, SGD, THB, TRY, USD, ZAR |
| **0**    | BIF, CLP, DJF, GNF, IDR, JPY, KMF, KRW, MGA, PYG, RWF, UGX, VND, VUV, XAF, XOF, XPF |
| **3**    | BHD, IQD, JOD, KWD, LYD, OMR, TND |

---

## Rounding methods explained

| Method     | Tie behaviour                       | Best for                                    |
|------------|-------------------------------------|---------------------------------------------|
| `halfUp`   | 0.5 always rounds toward +∞         | Receipts, POS, customer-facing totals       |
| `bankers`  | 0.5 rounds to nearest even digit    | High-volume batch transactions, accounting  |

**Why Banker's Rounding?** With `halfUp`, every tie rounds the same direction, introducing a small but consistent upward bias. Over thousands of transactions this accumulates. `bankers` distributes ties evenly between up and down, keeping running totals statistically neutral.

---

## Float-safety

JavaScript's IEEE 754 floats produce surprising results like `1.005 * 100 = 100.49999...`, which would cause `1.005` to incorrectly round down to `1.00`. This library uses a string-based decimal shift strategy — converting via `toPrecision(15)` and manipulating digit positions as strings before any arithmetic — so tie values are always exact.

```ts
rounded(1.005)  // → 1.01  ✓  (naive Math.round(1.005 * 100) / 100 → 1.00 ✗)
rounded(1.045)  // → 1.05  ✓
rounded(1.055)  // → 1.06  ✓
```

---

## License

MIT © Eka Prasetia

## Links

- [NPM Package](https://www.npmjs.com/package/@ekaone/rounded)
- [GitHub Repository](https://github.com/ekaone/rounded)
- [Issue Tracker](https://github.com/ekaone/rounded/issues)