import { describe, expect, it } from "vitest";
import {
  computeStandings,
  hasLiveFixture,
  isUsableWorldCup,
  parseWorldCup,
  readableOn,
  slugify,
  statusOf,
  teamColor,
  type WorldCup,
} from "@/lib/worldcup";

describe("statusOf", () => {
  it("maps the upstream vocabulary", () => {
    expect(statusOf("Final")).toBe("final");
    expect(statusOf("Live")).toBe("live");
    expect(statusOf("Scheduled")).toBe("scheduled");
  });
  it("accepts common variants", () => {
    expect(statusOf("Full Time")).toBe("final");
    expect(statusOf("FT")).toBe("final");
    expect(statusOf("In Play")).toBe("live");
  });
  it("does NOT misread lookalike words (the word-boundary fix)", () => {
    expect(statusOf("Playoff")).toBe("scheduled"); // not "live"
    expect(statusOf("Full schedule TBD")).toBe("scheduled"); // not "final"
    expect(statusOf("")).toBe("scheduled");
  });
});

describe("slugify", () => {
  it("produces a stable, lowercase, hyphenated id", () => {
    expect(slugify("Jun 11 Mexico v South Africa")).toBe("jun-11-mexico-v-south-africa");
  });
  it("collapses runs and trims edges", () => {
    expect(slugify("  --A   B-- ")).toBe("a-b");
  });
  it("is deterministic", () => {
    expect(slugify("Jun 25 Germany v France")).toBe(slugify("Jun 25 Germany v France"));
  });
});

describe("isUsableWorldCup", () => {
  it("requires at least one fixture", () => {
    expect(isUsableWorldCup({ fixtures: [{}] } as unknown as WorldCup)).toBe(true);
    expect(isUsableWorldCup({ fixtures: [] } as unknown as WorldCup)).toBe(false);
    expect(isUsableWorldCup({} as unknown as WorldCup)).toBe(false);
  });
});

describe("hasLiveFixture", () => {
  it("is true only when a fixture is in play, and tolerates a bad shape", () => {
    expect(hasLiveFixture({ fixtures: [{ status: "live" }] } as unknown as WorldCup)).toBe(true);
    expect(hasLiveFixture({ fixtures: [{ status: "final" }] } as unknown as WorldCup)).toBe(false);
    expect(hasLiveFixture({} as unknown as WorldCup)).toBe(false);
  });
});

describe("teamColor / readableOn", () => {
  it("teamColor is a deterministic hex", () => {
    expect(teamColor("MEX")).toMatch(/^#[0-9a-f]{6}$/);
    expect(teamColor("MEX")).toBe(teamColor("MEX"));
  });
  it("readableOn picks contrasting foreground", () => {
    expect(readableOn("#FFFFFF")).toBe("#0D0F14");
    expect(readableOn("#000000")).toBe("#F0F2F5");
  });
});

const SAMPLE = {
  generatedDate: "2026-06-25",
  fifaWorldCup: {
    title: "FIFA World Cup 2026",
    confirmedFixtures: [
      { date: "Jun 11", match: "Mexico v South Africa", group: "Group A", venue: "Mexico City Stadium", tag: "Opener", status: "Final", score: "MEX 2 - RSA 0", insight: "Opening win" },
      { date: "Jun 11", match: "Canada v Croatia", group: "Group A", venue: "Toronto Stadium", tag: "Group", status: "Final", score: "CAN 1 - CRO 1", insight: "" },
      { date: "Jun 12", match: "Brazil v Serbia", group: "Group B", venue: "Miami Stadium", tag: "Group", status: "Scheduled", score: "3 p.m. ET", insight: "" },
      { date: "Jun 25", match: "Germany v France", group: "Group C", venue: "MetLife Stadium", tag: "Group", status: "Live", score: "GER 1 - FRA 0", insight: "" },
    ],
  },
};

describe("parseWorldCup", () => {
  const wc = parseWorldCup(SAMPLE);

  it("parses every fixture", () => {
    expect(wc.fixtures).toHaveLength(4);
  });

  it("reads a final result and codes", () => {
    const f = wc.fixtures[0];
    expect(f.status).toBe("final");
    expect(f.home.code).toBe("MEX");
    expect(f.home.score).toBe(2);
    expect(f.away.code).toBe("RSA");
    expect(f.away.score).toBe(0);
  });

  it("treats a scheduled fixture's score as a kickoff label (no numeric score)", () => {
    const f = wc.fixtures[2];
    expect(f.status).toBe("scheduled");
    expect(f.kickoff).toBe("3 p.m. ET");
    expect(f.home.score).toBeUndefined();
  });

  it("parses a live fixture's result-format score", () => {
    const f = wc.fixtures[3];
    expect(f.status).toBe("live");
    expect(f.home.code).toBe("GER");
    expect(f.home.score).toBe(1);
  });

  it("gives stable, position-independent ids", () => {
    expect(wc.fixtures[0].id).toBe("jun-11-mexico-v-south-africa");
    const ids = wc.fixtures.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length); // all unique
  });

  it("surfaces the feature day via generatedDate", () => {
    expect(wc.todayLabel).toBe("Jun 25");
    expect(wc.today.map((f) => f.home.code)).toEqual(["GER"]);
  });

  it("degrades safely on an empty payload", () => {
    expect(parseWorldCup({}).fixtures).toHaveLength(0);
    expect(parseWorldCup({ fifaWorldCup: {} }).fixtures).toHaveLength(0);
  });
});

describe("computeStandings", () => {
  const wc = parseWorldCup(SAMPLE);
  const groupA = wc.standings.find((g) => g.group === "Group A");

  it("counts only final results", () => {
    // Group A: MEX 2-0 RSA (win), CAN 1-1 CRO (draw)
    expect(groupA).toBeDefined();
    const mex = groupA!.rows.find((r) => r.code === "MEX")!;
    const rsa = groupA!.rows.find((r) => r.code === "RSA")!;
    const can = groupA!.rows.find((r) => r.code === "CAN")!;
    expect(mex.pts).toBe(3);
    expect(mex.gd).toBe(2);
    expect(rsa.pts).toBe(0);
    expect(can.pts).toBe(1); // draw
  });

  it("sorts the table by points then goal difference", () => {
    expect(groupA!.rows[0].code).toBe("MEX"); // top on points
  });

  it("excludes live/scheduled fixtures from any table", () => {
    // Group B (scheduled) and Group C (live) have no completed games → no group rows.
    expect(wc.standings.find((g) => g.group === "Group B")).toBeUndefined();
    expect(wc.standings.find((g) => g.group === "Group C")).toBeUndefined();
  });
});
