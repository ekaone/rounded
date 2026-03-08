import { describe, it, expect } from "vitest";
import { halfUp } from "../src/core/halfUp";

describe("halfUp", () => {
  it("rounds up on .5 tie", () => {
    expect(halfUp(2.345, 2)).toBe(2.35);
    expect(halfUp(2.5, 0)).toBe(3);
    expect(halfUp(0.5, 0)).toBe(1);
  });

  it("rounds down below .5", () => {
    expect(halfUp(2.344, 2)).toBe(2.34);
    expect(halfUp(2.4, 0)).toBe(2);
  });

  it("handles zero precision", () => {
    expect(halfUp(2.6, 0)).toBe(3);
    expect(halfUp(2.4, 0)).toBe(2);
  });

  it("handles higher precision", () => {
    expect(halfUp(1.23456, 4)).toBe(1.2346);
    expect(halfUp(1.23454, 4)).toBe(1.2345);
  });

  it("handles negative numbers (toward +infinity)", () => {
    expect(halfUp(-2.5, 0)).toBe(-2);
    expect(halfUp(-2.345, 2)).toBe(-2.34);
  });

  it("handles floating point drift cases", () => {
    expect(halfUp(1.005, 2)).toBe(1.01);
    expect(halfUp(1.045, 2)).toBe(1.05);
    expect(halfUp(1.055, 2)).toBe(1.06);
  });

  it("handles zero", () => {
    expect(halfUp(0, 2)).toBe(0);
  });

  it("handles large numbers", () => {
    expect(halfUp(9999999.995, 2)).toBe(10000000.0);
  });
});
