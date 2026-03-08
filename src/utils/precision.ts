/**
 * Shifts a number's decimal point right by `places` using string manipulation,
 * avoiding float multiplication drift (e.g. 1.005 * 100 = 100.4999...).
 *
 * Returns a float where the original value is scaled by 10^places, retaining
 * the fractional remainder needed for accurate tie-breaking.
 *
 * @example
 * shiftDecimal(1.005, 2)   // → 100.5   (not 100.4999...)
 * shiftDecimal(2.345, 2)   // → 234.5
 * shiftDecimal(10.1265, 3) // → 10126.5
 */
export function shiftDecimal(value: number, places: number): number {
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);

  // toPrecision(15) removes accumulated float noise from the representation
  const str = abs.toPrecision(15).replace(".", "");

  // Count integer digits in the original value
  const intDigits = abs >= 1 ? Math.floor(Math.log10(abs)) + 1 : 1;

  // New decimal position after shifting right by `places`
  const newPos = intDigits + places;
  const padded = str.padEnd(newPos + 5, "0");

  const intPart = padded.slice(0, newPos);
  const fracPart = padded.slice(newPos);

  return sign * parseFloat(intPart + "." + fracPart);
}
