import { describe, expect, it } from "vitest";

import {
  MATCH_SCOREBOARD_MOBILE_MAX_WIDTH_PX,
  scoreboardLayoutForViewport,
} from "@/components/worldcup/wc-match-layout";

describe("match scoreboard responsive layout", () => {
  it("uses the mobile scoreboard layout across issue #14 narrow widths", () => {
    expect(MATCH_SCOREBOARD_MOBILE_MAX_WIDTH_PX).toBe(640);

    for (const width of [375, 390, 430]) {
      expect(scoreboardLayoutForViewport(width)).toBe("mobile");
    }
  });

  it("keeps tablet and desktop scoreboards on the existing three-column layout", () => {
    for (const width of [641, 768, 1440]) {
      expect(scoreboardLayoutForViewport(width)).toBe("desktop");
    }
  });
});
