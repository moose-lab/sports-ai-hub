import { describe, expect, it } from "vitest";
import {
  hyroxAudiences,
  hyroxCalendar,
  hyroxCategories,
  hyroxPersonas,
  type HyroxCategory,
} from "@/data/hyrox-zone";
import {
  countShownTools,
  filterHyroxCalendar,
  filterHyroxCategories,
  hyroxCalendarRegions,
  matchesHyroxTool,
  toolCountForAudience,
} from "@/lib/hyrox-zone";

const FIXTURE: HyroxCategory[] = [
  {
    id: "a",
    name: "A",
    blurb: "",
    tools: [
      { name: "pyrox-client", desc: "Results into DataFrames", aud: "Builders", url: "#" },
      { name: "HYRESULT", desc: "Athlete profiles on the web", aud: "Athletes", url: "#" },
    ],
  },
  {
    id: "b",
    name: "B",
    blurb: "",
    tools: [{ name: "MMPose", desc: "Pose estimation toolbox", aud: "Coaches", url: "#" }],
  },
];

describe("hyrox zone directory filtering", () => {
  it("combines audience and query with AND, case-insensitively over name+desc", () => {
    const tool = FIXTURE[0].tools[0];
    expect(matchesHyroxTool(tool, "All", "")).toBe(true);
    expect(matchesHyroxTool(tool, "Builders", "DATAFRAMES")).toBe(true);
    expect(matchesHyroxTool(tool, "Athletes", "DataFrames")).toBe(false);
    expect(matchesHyroxTool(tool, "Builders", "pose")).toBe(false);
  });

  it("drops categories whose tools all filtered out and counts the rest", () => {
    const shown = filterHyroxCategories(FIXTURE, "Coaches", "");
    expect(shown.map((c) => c.id)).toEqual(["b"]);
    expect(countShownTools(shown)).toBe(1);

    const none = filterHyroxCategories(FIXTURE, "Creators", "");
    expect(none).toEqual([]);
    expect(countShownTools(none)).toBe(0);
  });

  it("derives persona counts from the data", () => {
    expect(toolCountForAudience(FIXTURE, "Builders")).toBe(1);
    expect(toolCountForAudience(FIXTURE, "Creators")).toBe(0);
  });
});

describe("hyrox zone shipped content", () => {
  it("ships the 16-tool × 4-scenario collection the zone copy promises", () => {
    expect(hyroxCategories).toHaveLength(4);
    expect(hyroxCategories.flatMap((c) => c.tools)).toHaveLength(16);
  });

  it("covers every persona with at least one tool and one filter pill", () => {
    for (const persona of hyroxPersonas) {
      expect(hyroxAudiences).toContain(persona.aud);
      expect(toolCountForAudience(hyroxCategories, persona.aud)).toBeGreaterThan(0);
    }
  });

  it("links every tool somewhere reachable (absolute http url)", () => {
    for (const tool of hyroxCategories.flatMap((c) => c.tools)) {
      expect(tool.url).toMatch(/^https:\/\//);
    }
  });
});

describe("hyrox calendar", () => {
  it("derives region pills in first-appearance order, All first", () => {
    expect(hyroxCalendarRegions(hyroxCalendar)).toEqual(["All", "Asia", "Oceania", "N. America", "Europe"]);
  });

  it("filters rows by region and passes everything through All", () => {
    expect(filterHyroxCalendar(hyroxCalendar, "All")).toHaveLength(hyroxCalendar.length);
    const europe = filterHyroxCalendar(hyroxCalendar, "Europe");
    expect(europe.length).toBeGreaterThan(0);
    expect(europe.every((r) => r.region === "Europe")).toBe(true);
  });
});
