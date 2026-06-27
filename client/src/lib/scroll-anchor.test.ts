import { describe, expect, it } from "vitest";

import {
  STICKY_ANCHOR_OFFSET_PX,
  computeAnchorScrollTop,
} from "@/lib/scroll-anchor";

describe("anchor scroll offsets", () => {
  it("clears the full sticky broadcast header stack plus breathing room", () => {
    expect(STICKY_ANCHOR_OFFSET_PX).toBe(168);
  });

  it("computes a viewport-safe scroll target from an element rect", () => {
    expect(computeAnchorScrollTop({ rectTop: 640, scrollY: 120 })).toBe(592);
  });

  it("does not produce negative scroll targets for anchors near the page top", () => {
    expect(computeAnchorScrollTop({ rectTop: 40, scrollY: 0 })).toBe(0);
  });
});
