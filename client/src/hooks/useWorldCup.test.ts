import { describe, expect, it } from "vitest";
import { backoffDelay } from "@/hooks/useWorldCup";

describe("backoffDelay", () => {
  it("is zero when there are no failures", () => {
    expect(backoffDelay(0)).toBe(0);
    expect(backoffDelay(-1)).toBe(0);
  });

  it("doubles each consecutive failure", () => {
    expect(backoffDelay(1)).toBe(1_000);
    expect(backoffDelay(2)).toBe(2_000);
    expect(backoffDelay(3)).toBe(4_000);
    expect(backoffDelay(4)).toBe(8_000);
    expect(backoffDelay(5)).toBe(16_000);
  });

  it("caps at the maximum", () => {
    expect(backoffDelay(6)).toBe(30_000); // 32s → capped
    expect(backoffDelay(20)).toBe(30_000);
  });

  it("honors custom base/cap", () => {
    expect(backoffDelay(1, 500, 5_000)).toBe(500);
    expect(backoffDelay(5, 500, 5_000)).toBe(5_000); // 8000 → capped
  });
});
