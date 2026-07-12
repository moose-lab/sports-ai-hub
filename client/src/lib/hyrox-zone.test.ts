import { describe, expect, it } from "vitest";
import {
  hyroxAudiences,
  hyroxCalendar,
  hyroxCategories,
  hyroxKinds,
  hyroxPersonas,
  hyroxRun,
  hyroxStations,
  hyroxZonePicks,
  type HyroxCategory,
} from "@/data/hyrox-zone";
import {
  buildRaceSequence,
  countShownTools,
  filterHyroxCalendar,
  filterHyroxCategories,
  hyroxCalendarRegions,
  hyroxToolsByName,
  matchesHyroxTool,
  toolCountForAudience,
} from "@/lib/hyrox-zone";

const FIXTURE: HyroxCategory[] = [
  {
    id: "a",
    name: "A",
    blurb: "",
    tools: [
      { name: "pyrox-client", kind: "tool", desc: "Results into DataFrames", aud: "Builders", url: "#" },
      { name: "results.hyrox.com", kind: "api", desc: "Official results portal", aud: "Athletes", url: "#" },
      { name: "HYRESULT", kind: "tool", desc: "Athlete profiles on the web", aud: "Athletes", url: "#" },
    ],
  },
  {
    id: "b",
    name: "B",
    blurb: "",
    tools: [
      { name: "MMPose", kind: "model", desc: "Pose estimation toolbox", aud: "Coaches", url: "#" },
      { name: "RepCount Dataset", kind: "dataset", desc: "Rep counting benchmark", aud: "Builders", url: "#" },
    ],
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

  it('filters by kind, with "Tools" covering both tool and api', () => {
    const [tool, api, ,] = FIXTURE[0].tools;
    const [model, dataset] = FIXTURE[1].tools;
    expect(matchesHyroxTool(tool, "All", "", "Tools")).toBe(true);
    expect(matchesHyroxTool(api, "All", "", "Tools")).toBe(true);
    expect(matchesHyroxTool(model, "All", "", "Tools")).toBe(false);
    expect(matchesHyroxTool(dataset, "All", "", "Datasets")).toBe(true);
    expect(matchesHyroxTool(model, "All", "", "Models")).toBe(true);
    expect(matchesHyroxTool(dataset, "All", "", "Models")).toBe(false);
    for (const t of [tool, api, model, dataset]) {
      expect(matchesHyroxTool(t, "All", "", "All types")).toBe(true);
    }
  });

  it("AND-combines audience, query, and kind", () => {
    const shown = filterHyroxCategories(FIXTURE, "Builders", "", "Datasets");
    expect(shown.map((c) => c.id)).toEqual(["b"]);
    expect(countShownTools(shown)).toBe(1);
    expect(filterHyroxCategories(FIXTURE, "Coaches", "", "Datasets")).toEqual([]);
    expect(filterHyroxCategories(FIXTURE, "Builders", "portal", "Tools")).toEqual([]);
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
    expect(toolCountForAudience(FIXTURE, "Builders")).toBe(2);
    expect(toolCountForAudience(FIXTURE, "Creators")).toBe(0);
  });

  it("resolves tools by name for the explainer's train-with rows", () => {
    const byName = hyroxToolsByName(FIXTURE);
    expect(byName.get("MMPose")?.kind).toBe("model");
    expect(byName.get("nope")).toBeUndefined();
  });
});

describe("race explainer sequence", () => {
  it("builds 16 segments alternating run → station, stations in race order", () => {
    const seq = buildRaceSequence(hyroxStations);
    expect(seq).toHaveLength(16);
    for (let i = 0; i < seq.length; i += 2) {
      const run = seq[i];
      const station = seq[i + 1];
      expect(run.type).toBe("run");
      if (run.type === "run") expect(run.runNumber).toBe(i / 2 + 1);
      expect(station.type).toBe("station");
      if (station.type === "station") expect(station.station.n).toBe(i / 2 + 1);
    }
  });
});

describe("hyrox zone shipped content", () => {
  it("ships the 6-category collection mirroring awesome-sports-ai, with kinds everywhere", () => {
    expect(hyroxCategories.map((c) => c.name)).toEqual([
      "Data, APIs & Feeds",
      "Analytics & Visualization",
      "Training & Performance",
      "Media, Highlights & Content",
      "Developer Tools",
      "Datasets & Research",
    ]);
    const tools = hyroxCategories.flatMap((c) => c.tools);
    expect(tools.length).toBeGreaterThanOrEqual(24);
    for (const tool of tools) {
      expect(["tool", "api", "dataset", "model"]).toContain(tool.kind);
    }
    // Every kind pill has something to show.
    expect(hyroxKinds).toEqual(["All types", "Tools", "Datasets", "Models"]);
    for (const kind of hyroxKinds) {
      expect(countShownTools(filterHyroxCategories(hyroxCategories, "All", "", kind))).toBeGreaterThan(0);
    }
  });

  it("keeps surfacing the HYROX Training Plan Skill for coding-agent plan generation", () => {
    const byName = hyroxToolsByName(hyroxCategories);
    const tool = byName.get("HYROX Training Plan Skill");
    const category = hyroxCategories.find((item) =>
      item.tools.some((candidate) => candidate.name === "HYROX Training Plan Skill"),
    );

    expect(tool).toBeDefined();
    expect(category?.id).toBe("training");
    expect(tool?.aud).toBe("Coaches");
    expect(tool?.kind).toBe("tool");
    expect(tool?.url).toBe("https://github.com/moose-lab/hyrox-training-plan-skill");
    expect(matchesHyroxTool(tool!, "Coaches", "coding agents")).toBe(true);
    expect(matchesHyroxTool(tool!, "Coaches", "training plan", "Tools")).toBe(true);
    expect(hyroxZonePicks).toContain("Training Plan Skill");
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

  it("resolves every explainer train-with reference to a directory entry", () => {
    const byName = hyroxToolsByName(hyroxCategories);
    const refs = [...hyroxStations.flatMap((s) => s.train), ...hyroxRun.train];
    for (const name of refs) {
      expect(byName.get(name), `train-with reference "${name}" should exist in the directory`).toBeDefined();
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
