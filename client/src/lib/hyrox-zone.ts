/**
 * HYROX Zone filter logic — the pure functions behind the /hyrox directory
 * (audience pills × type pills × live search), the race explainer's course
 * sequence and train-with resolution, and the Data Drops calendar (region
 * pills). Kept free of React so the behavior is unit-testable.
 */
import type {
  HyroxAudience,
  HyroxAudienceFilter,
  HyroxCalendarRow,
  HyroxCategory,
  HyroxKind,
  HyroxKindFilter,
  HyroxStation,
  HyroxTool,
} from "@/data/hyrox-zone";

/** Which kinds each type pill admits — "Tools" deliberately covers api. */
const KIND_FILTER_KINDS: Record<Exclude<HyroxKindFilter, "All types">, HyroxKind[]> = {
  Tools: ["tool", "api"],
  Datasets: ["dataset"],
  Models: ["model"],
};

/** Audience AND kind AND case-insensitive substring match over name + description. */
export const matchesHyroxTool = (
  tool: HyroxTool,
  aud: HyroxAudienceFilter,
  query: string,
  kind: HyroxKindFilter = "All types",
): boolean =>
  (aud === "All" || tool.aud === aud) &&
  (kind === "All types" || KIND_FILTER_KINDS[kind].includes(tool.kind)) &&
  (!query || `${tool.name} ${tool.desc}`.toLowerCase().includes(query.toLowerCase()));

export interface FilteredHyroxCategory extends HyroxCategory {
  shown: HyroxTool[];
}

/** Categories with their matching tools; categories left empty are dropped. */
export const filterHyroxCategories = (
  categories: HyroxCategory[],
  aud: HyroxAudienceFilter,
  query: string,
  kind: HyroxKindFilter = "All types",
): FilteredHyroxCategory[] =>
  categories
    .map((c) => ({ ...c, shown: c.tools.filter((t) => matchesHyroxTool(t, aud, query, kind)) }))
    .filter((c) => c.shown.length > 0);

export const countShownTools = (categories: FilteredHyroxCategory[]): number =>
  categories.reduce((n, c) => n + c.shown.length, 0);

/** Persona-card counts — derived from the data, never hardcoded. */
export const toolCountForAudience = (categories: HyroxCategory[], aud: HyroxAudience): number =>
  categories.flatMap((c) => c.tools).filter((t) => t.aud === aud).length;

/** Name → tool lookup for the explainer's "train it with" rows. */
export const hyroxToolsByName = (categories: HyroxCategory[]): Map<string, HyroxTool> =>
  new Map(categories.flatMap((c) => c.tools).map((t) => [t.name, t]));

/**
 * The course, as a clickable sequence: 8 × (1 km run → station), 16 segments.
 * Drives the explainer's auto-advancing strip.
 */
export type RaceSegment =
  | { type: "run"; runNumber: number }
  | { type: "station"; station: HyroxStation };

export const buildRaceSequence = (stations: HyroxStation[]): RaceSegment[] =>
  stations.flatMap((station, i): RaceSegment[] => [
    { type: "run", runNumber: i + 1 },
    { type: "station", station },
  ]);

/** Region pills — "All" plus each region in first-appearance order. */
export const hyroxCalendarRegions = (calendar: HyroxCalendarRow[]): string[] => [
  "All",
  ...Array.from(new Set(calendar.map((r) => r.region))),
];

export const filterHyroxCalendar = (calendar: HyroxCalendarRow[], region: string): HyroxCalendarRow[] =>
  calendar.filter((r) => region === "All" || r.region === region);
