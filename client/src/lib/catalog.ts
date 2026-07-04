/**
 * Sports AI Hub — tool directory data.
 *
 * Source of truth: `client/src/data/catalog.json`, a build-time snapshot of
 * `moose-lab/awesome-sports-ai`'s `data/catalog.json` (see
 * `scripts/sync-catalog.mjs`, which refreshes it before every dev/build run).
 * Nothing about the directory — categories, tools, sport/capability/openness
 * tags, or builder recipes — is hand-typed here; it is all read from that
 * snapshot and, where the raw file has no display metadata (openness labels
 * and hints), given a small local dictionary below.
 */
import rawCatalog from "@/data/catalog.json";

export interface CatalogCategory {
  id: string;
  label: string;
  description: string;
}

export interface CatalogCapability {
  id: string;
  label: string;
}

export interface CatalogTool {
  id: string;
  title: string;
  url: string;
  description: string;
  categoryId: string;
  sportTags: string[];
  aiCapabilities: string[];
  openness: string;
}

export interface CatalogRecipe {
  id: string;
  title: string;
  goal: string;
  toolIds: string[];
}

export interface CatalogSceneStarterBuild {
  input: string;
  output: string;
  prototypeDirection: string;
}

export interface CatalogSceneSection {
  id: string;
  title: string;
  titleZh?: string;
  problem: string;
  toolIds: string[];
  crossDomainToolIds?: string[];
  starterBuild: CatalogSceneStarterBuild;
}

export interface CatalogSceneGap {
  id: string;
  title: string;
  description: string;
}

/** One sport-scene zone (e.g. HYROX) — the structured mirror of docs/sports/<slug>.md upstream. */
export interface CatalogScene {
  id: string;
  slug: string;
  sport: string;
  route: string;
  title: string;
  tagline: string;
  guidePath: string;
  catalogTags: string[];
  firstToolId: string;
  liveAppUrl?: string;
  sections: CatalogSceneSection[];
  gaps: CatalogSceneGap[];
}

interface Catalog {
  categories: CatalogCategory[];
  sportTags: string[];
  aiCapabilities: CatalogCapability[];
  openness: string[];
  tools: CatalogTool[];
  recipes: CatalogRecipe[];
  /** Optional: older snapshots predate the scenes collection. */
  scenes?: CatalogScene[];
}

export const catalog = rawCatalog as Catalog;

/** Defensive: a stale snapshot without `scenes` must not break the build. */
export const scenes: CatalogScene[] = catalog.scenes ?? [];

export const sceneBySlug = (slug: string): CatalogScene | undefined => scenes.find((s) => s.slug === slug);

export const toolById = (id: string): CatalogTool | undefined => catalog.tools.find((t) => t.id === id);

export const categoryById = (id: string): CatalogCategory | undefined =>
  catalog.categories.find((c) => c.id === id);

export const capabilityById = (id: string): CatalogCapability | undefined =>
  catalog.aiCapabilities.find((c) => c.id === id);

export const toolsByCategory = (categoryId: string): CatalogTool[] =>
  catalog.tools.filter((t) => t.categoryId === categoryId);

export const recipesForTool = (toolId: string): CatalogRecipe[] =>
  catalog.recipes.filter((r) => r.toolIds.includes(toolId));

/**
 * Sport tags actually used by at least one tool, in the catalog's own order.
 * Computed, never hand-listed — self-corrects if the catalog changes.
 */
export const activeSportTags: string[] = catalog.sportTags.filter((tag) =>
  catalog.tools.some((t) => t.sportTags.includes(tag)),
);

/** The complement: sport tags with zero tools today — Contribute's "claim it" list. */
export const emptySportTags: string[] = catalog.sportTags.filter((tag) => !activeSportTags.includes(tag));

/**
 * `catalog.openness` is a bare list of ids with no display metadata attached
 * (unlike `aiCapabilities`, which already carries a `label`). These are
 * authored UI copy, not upstream data, so they live here rather than in the
 * synced snapshot.
 */
export const OPENNESS_LABEL: Record<string, string> = {
  "open-source": "Open Source",
  "open-data": "Open Data",
  "open-api": "Open API",
  "free-dev-tier": "Free Dev Tier",
  "paper-benchmark": "Paper / Benchmark",
  "commercial-reference": "Commercial Reference",
};

export const OPENNESS_HINT: Record<string, string> = {
  "open-source": "Source code is public — inspect, run, and modify it freely.",
  "open-data": "The dataset itself is freely downloadable for research or products.",
  "open-api": "A public API is available with no paid tier required to start.",
  "free-dev-tier": "Has a genuine free tier for developers; paid tiers exist for scale.",
  "paper-benchmark": "An academic paper or benchmark reference, not a packaged tool.",
  "commercial-reference": "A commercial product included for context — not open or free.",
};

export type OpennessBadgeVariant = "solid" | "signal" | "amber" | "slate";

export const OPENNESS_BADGE_VARIANT: Record<string, OpennessBadgeVariant> = {
  "open-source": "solid",
  "open-api": "signal",
  "open-data": "signal",
  "free-dev-tier": "amber",
  "paper-benchmark": "amber",
  "commercial-reference": "slate",
};
