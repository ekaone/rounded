import { describe, it, expect } from "vitest";
import { currency } from "../src/currency/currency";

describe("currency rounding", () => {
  describe("2 decimal currencies (USD, EUR, GBP...)", () => {
    it("rounds USD correctly", () => {
      expect(currency(10.1265, "USD")).toBe(10.13);
      expect(currency(10.124,  "USD")).toBe(10.12);
      expect(currency(10.005,  "USD")).toBe(10.01);
    });

    it("is case-insensitive", () => {
      expect(currency(10.125, "usd")).toBe(10.13);
      expect(currency(10.125, "Eur")).toBe(10.13);
    });

    it("rounds EUR correctly", () => {
      expect(currency(0.005, "EUR")).toBe(0.01);
    });

    it("rounds GBP correctly", () => {
      expect(currency(9.995, "GBP")).toBe(10.00);
    });
  });

  describe("0 decimal currencies (JPY, KRW, IDR...)", () => {
    it("rounds JPY to whole number", () => {
      expect(currency(1500.5, "JPY")).toBe(1501);
      expect(currency(1500.4, "JPY")).toBe(1500);
    });

    it("rounds KRW to whole number", () => {
      expect(currency(9999.9, "KRW")).toBe(10000);
    });
  });

  describe("3 decimal currencies (KWD, BHD...)", () => {
    it("rounds KWD to 3 decimal places", () => {
      expect(currency(10.1265, "KWD")).toBe(10.127);
      expect(currency(10.1264, "KWD")).toBe(10.126);
    });

    it("rounds BHD correctly", () => {
      expect(currency(1.0005, "BHD")).toBe(1.001);
    });
  });

  describe("method option", () => {
    it("uses bankers rounding when specified", () => {
      // 10.125 with bankers → 10.12 (2 is even)
      expect(currency(10.125, "USD", { method: "bankers" })).toBe(10.12);
      // 10.135 with bankers → 10.14 (3 is odd → up to 4)
      expect(currency(10.135, "USD", { method: "bankers" })).toBe(10.14);
    });

    it("defaults to halfUp", () => {
      expect(currency(10.125, "USD")).toBe(10.13);
    });
  });

  describe("invalid inputs", () => {
    it("returns null for NaN", () => {
      expect(currency(NaN, "USD")).toBeNull();
    });

    it("returns null for Infinity", () => {
      expect(currency(Infinity, "USD")).toBeNull();
    });

    it("returns null for unknown currency code", () => {
      expect(currency(10.5, "XYZ")).toBeNull();
      expect(currency(10.5, "")).toBeNull();
    });
  });
});
