import { describe, expect, it } from "vitest";
import { catalogToolFor, worldCupToolUrl } from "@/lib/worldcup-tools";
import type { WcToolkitTool } from "@/lib/worldcup";

const tool = (overrides: Partial<WcToolkitTool>): WcToolkitTool => ({
  name: "Tool",
  href: "https://example.com/tool",
  role: "Matchday workflow",
  ...overrides,
});

describe("catalogToolFor", () => {
  it("links the World Cup Roboflow entry to its catalog metadata", () => {
    expect(
      catalogToolFor(
        tool({
          name: "Roboflow Sports",
          href: "https://github.com/roboflow/sports",
        })
      )?.id
    ).toBe("roboflow-sports");
  });

  it("matches a repository prototype after normalizing its relative URL", () => {
    expect(
      catalogToolFor(
        tool({
          name: "llm-match-commentator",
          href: "prototypes/llm-match-commentator/",
        })
      )?.id
    ).toBe("llm-match-commentator");
  });
});

describe("worldCupToolUrl", () => {
  it("keeps external tool destinations unchanged", () => {
    expect(
      worldCupToolUrl(tool({ href: "https://github.com/roboflow/sports" }))
    ).toBe("https://github.com/roboflow/sports");
  });

  it("turns repository files and directories into working GitHub links", () => {
    expect(
      worldCupToolUrl(tool({ href: "scripts/sync-fifa-world-cup.mjs" }))
    ).toBe(
      "https://github.com/moose-lab/awesome-sports-ai/blob/main/scripts/sync-fifa-world-cup.mjs"
    );
    expect(
      worldCupToolUrl(tool({ href: "prototypes/llm-match-commentator/" }))
    ).toBe(
      "https://github.com/moose-lab/awesome-sports-ai/tree/main/prototypes/llm-match-commentator/"
    );
  });
});
