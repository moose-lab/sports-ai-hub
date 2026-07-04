/**
 * HYROX Zone filter logic — the pure functions behind the /hyrox directory
 * (audience pills × live search) and the Data Drops calendar (region pills).
 * Kept free of React so the behavior is unit-testable.
 */
import type {
  HyroxAudience,
  HyroxAudienceFilter,
  HyroxCalendarRow,
  HyroxCategory,
  HyroxTool,
} from "@/data/hyrox-zone";

/** Audience AND case-insensitive substring match over name + description. */
export const matchesHyroxTool = (tool: HyroxTool, aud: HyroxAudienceFilter, query: string): boolean =>
  (aud === "All" || tool.aud === aud) &&
  (!query || `${tool.name} ${tool.desc}`.toLowerCase().includes(query.toLowerCase()));

export interface FilteredHyroxCategory extends HyroxCategory {
  shown: HyroxTool[];
}

/** Categories with their matching tools; categories left empty are dropped. */
export const filterHyroxCategories = (
  categories: HyroxCategory[],
  aud: HyroxAudienceFilter,
  query: string,
): FilteredHyroxCategory[] =>
  categories
    .map((c) => ({ ...c, shown: c.tools.filter((t) => matchesHyroxTool(t, aud, query)) }))
    .filter((c) => c.shown.length > 0);

export const countShownTools = (categories: FilteredHyroxCategory[]): number =>
  categories.reduce((n, c) => n + c.shown.length, 0);

/** Persona-card counts — derived from the data, never hardcoded. */
export const toolCountForAudience = (categories: HyroxCategory[], aud: HyroxAudience): number =>
  categories.flatMap((c) => c.tools).filter((t) => t.aud === aud).length;

/** Region pills — "All" plus each region in first-appearance order. */
export const hyroxCalendarRegions = (calendar: HyroxCalendarRow[]): string[] => [
  "All",
  ...Array.from(new Set(calendar.map((r) => r.region))),
];

export const filterHyroxCalendar = (calendar: HyroxCalendarRow[], region: string): HyroxCalendarRow[] =>
  calendar.filter((r) => region === "All" || r.region === region);
