import { describe, it, expect } from "vitest";
import rounded from "../src/index";

describe("rounded() — main API", () => {
  describe("defaults (halfUp, precision 2)", () => {
    it("rounds correctly with defaults", () => {
      expect(rounded(2.345)).toBe(2.35);
      expect(rounded(2.344)).toBe(2.34);
      expect(rounded(0.005)).toBe(0.01);
    });
  });

  describe("precision option", () => {
    it("respects custom precision", () => {
      expect(rounded(2.3456, { precision: 3 })).toBe(2.346);
      expect(rounded(2.3,    { precision: 0 })).toBe(2);
      expect(rounded(2.6,    { precision: 0 })).toBe(3);
    });
  });

  describe("method option", () => {
    it("uses bankers rounding", () => {
      expect(rounded(2.345, { method: "bankers" })).toBe(2.34);
      expect(rounded(2.355, { method: "bankers" })).toBe(2.36);
    });

    it("uses halfUp by default", () => {
      expect(rounded(2.345, { method: "halfUp" })).toBe(2.35);
    });
  });

  describe("invalid inputs → null", () => {
    it("returns null for NaN", () => {
      expect(rounded(NaN)).toBeNull();
    });

    it("returns null for null", () => {
      expect(rounded(null)).toBeNull();
    });

    it("returns null for undefined", () => {
      expect(rounded(undefined)).toBeNull();
    });

    it("returns null for Infinity", () => {
      expect(rounded(Infinity)).toBeNull();
      expect(rounded(-Infinity)).toBeNull();
    });

    it("returns null for non-numeric strings", () => {
      expect(rounded("abc" as never)).toBeNull();
    });
  });

  describe("rounded.cash()", () => {
    it("delegates to cash rounding", () => {
      expect(rounded.cash(1.03)).toBe(1.05);
      expect(rounded.cash(1.07, { nearest: 0.10 })).toBe(1.10);
    });
  });

  describe("rounded.currency()", () => {
    it("delegates to currency rounding", () => {
      expect(rounded.currency(10.1265, "USD")).toBe(10.13);
      expect(rounded.currency(1500.5,  "JPY")).toBe(1501);
      expect(rounded.currency(10.1265, "KWD")).toBe(10.127);
    });
  });
});
