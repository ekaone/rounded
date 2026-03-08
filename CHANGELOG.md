# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-08

### Added
- Initial release
- `rounded()` default export with `halfUp` and `bankers` rounding methods
- `rounded.cash()` for physical denomination rounding (nearest 0.05 / 0.10 / 0.25 etc.)
- `rounded.currency()` for ISO 4217 currency-aware rounding
- Named exports: `halfUp`, `bankers`, `cash`, `currency`, `CURRENCY_PRECISION`
- `RoundingMethod`, `RoundedOptions`, `CurrencyRoundingMethod`, `CurrencyOptions`,
  `CashOptions`, and `CurrencyCode` TypeScript types
- `src/utils/guard.ts` — null-safety for all public inputs
- `src/utils/precision.ts` — string-based decimal shift to prevent float drift
- Full TypeScript support with type definitions in `dist/types`
- Zero dependencies
- Dual package support (CommonJS + ESM) via `tsconfig.esm.json` and `tsconfig.cjs.json`
- Post-build script `scripts/fix-cjs.mjs` to rename `.js → .cjs` and patch
  internal `require()` paths
- Test suite with Vitest covering `halfUp`, `bankers`, `cash`, `currency`,
  and the main `rounded()` wrapper

### Features
- **`halfUp`**: Standard receipt/POS rounding — ties always round toward +∞
- **`bankers`**: Round half to even — reduces cumulative bias in high-volume
  transaction sets
- **`cash`**: Rounds to nearest physical denomination — configurable via `nearest`
  option (default `0.05`)
- **`precision`**: Configurable decimal places on `rounded()`, default `2`
- **`method`**: Selectable rounding algorithm on `rounded()` and `rounded.currency()`

### Security
- Input validation via `guard()` — `NaN`, `null`, `undefined`, `Infinity`,
  and `-Infinity` all return `null`, never throw
- Float drift prevention via `toPrecision(15)` string-based decimal shifting
  before any arithmetic — guards against cases like `1.005 * 100 = 100.4999...`