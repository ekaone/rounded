import { describe, it, expect } from "vitest";
import { bankers } from "../src/core/bankers";

describe("bankers (round half to even)", () => {
  it("rounds ties to even — floor is even, stay", () => {
    expect(bankers(2.345, 2)).toBe(2.34); // 4 is even → stay
    expect(bankers(2.5, 0)).toBe(2);       // 2 is even → stay
    expect(bankers(4.5, 0)).toBe(4);       // 4 is even → stay
  });

  it("rounds ties to even — floor is odd, round up", () => {
    expect(bankers(2.355, 2)).toBe(2.36); // 5 is odd → round up to 6
    expect(bankers(3.5, 0)).toBe(4);       // 3 is odd → round up to 4
    expect(bankers(1.5, 0)).toBe(2);       // 1 is odd → round up to 2
  });

  it("rounds normally below .5", () => {
    expect(bankers(2.344, 2)).toBe(2.34);
    expect(bankers(2.4, 0)).toBe(2);
  });

  it("rounds normally above .5", () => {
    expect(bankers(2.346, 2)).toBe(2.35);
    expect(bankers(2.6, 0)).toBe(3);
  });

  it("handles negative numbers", () => {
    expect(bankers(-2.5, 0)).toBe(-2); // -3 is odd, -2 is even → -2
    expect(bankers(-3.5, 0)).toBe(-4); // -4 is even → -4
  });

  it("handles zero", () => {
    expect(bankers(0, 2)).toBe(0);
  });

  it("handles higher precision", () => {
    expect(bankers(1.23455, 4)).toBe(1.2346); // 5 is odd → 6
    expect(bankers(1.23445, 4)).toBe(1.2344); // 4 is even → stay
  });
});
