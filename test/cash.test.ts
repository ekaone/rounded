import { describe, it, expect } from "vitest";
import { cash } from "../src/core/cash";

describe("cash rounding", () => {
  describe("default nearest 0.05", () => {
    it("rounds up to nearest 0.05", () => {
      expect(cash(1.03)).toBe(1.05);
      expect(cash(1.08)).toBe(1.10);
    });

    it("rounds down to nearest 0.05", () => {
      expect(cash(1.02)).toBe(1.00);
      expect(cash(1.07)).toBe(1.05);
    });

    it("stays the same when already on boundary", () => {
      expect(cash(1.00)).toBe(1.00);
      expect(cash(1.05)).toBe(1.05);
      expect(cash(1.10)).toBe(1.10);
    });
  });

  describe("nearest 0.10", () => {
    it("rounds correctly", () => {
      expect(cash(1.04, { nearest: 0.10 })).toBe(1.00);
      expect(cash(1.05, { nearest: 0.10 })).toBe(1.10);
      expect(cash(1.09, { nearest: 0.10 })).toBe(1.10);
    });
  });

  describe("nearest 0.25", () => {
    it("rounds correctly", () => {
      expect(cash(1.12, { nearest: 0.25 })).toBe(1.00);
      expect(cash(1.13, { nearest: 0.25 })).toBe(1.25);
      expect(cash(1.37, { nearest: 0.25 })).toBe(1.25);
      expect(cash(1.38, { nearest: 0.25 })).toBe(1.50);
    });
  });

  describe("nearest whole number", () => {
    it("rounds to nearest 1.00", () => {
      expect(cash(1.49, { nearest: 1 })).toBe(1);
      expect(cash(1.50, { nearest: 1 })).toBe(2);
    });
  });

  describe("invalid inputs", () => {
    it("returns null for NaN", () => {
      expect(cash(NaN)).toBeNull();
    });

    it("returns null for Infinity", () => {
      expect(cash(Infinity)).toBeNull();
    });

    it("returns null for invalid nearest", () => {
      expect(cash(1.03, { nearest: 0 })).toBeNull();
      expect(cash(1.03, { nearest: -0.05 })).toBeNull();
    });
  });
});
