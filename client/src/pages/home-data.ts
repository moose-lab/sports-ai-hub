/**
 * Sports AI Hub — landing page content that ISN'T the tool directory.
 * The directory itself (categories, tools, sport/capability/openness tags,
 * recipes) is real data from `@/lib/catalog` (synced from
 * awesome-sports-ai's data/catalog.json — see scripts/sync-catalog.mjs).
 * What's left here is generic site copy: the general LIVE ticker (the
 * permanent product feed, unrelated to the tool catalog) and the asset/repo
 * helpers used throughout the page.
 */

/** Resolve a file in client/public/assets/ against Vite's base path
 *  (the GitHub Pages build serves the site under /sports-ai-hub/). */
export const asset = (file: string): string =>
  `${import.meta.env.BASE_URL}assets/${file}`;

export const REPO = "https://github.com/moose-lab/awesome-sports-ai";

export type TickerKind = "score" | "tool" | "news" | "event";

export interface TickerItem {
  kind: TickerKind;
  text: string;
}

// LIVE broadcast ticker — typed feed items (news vs tool vs event)
export const ticker: TickerItem[] = [
  { kind: "score", text: "FIFA WORLD CUP 2026 · USA / CAN / MEX · 48 teams · 104 matches" },
  { kind: "tool", text: "TRENDING TOOL · statsbombpy — free StatsBomb event data into Python" },
  { kind: "news", text: "NBA FINALS 2026 · Knicks def. Spurs 4-1 · first title in 53 years" },
  { kind: "tool", text: "NEW · llm-match-commentator — bilingual EN/ES live commentary" },
  { kind: "news", text: "WNBA · Caitlin Clark gravity analytics now open-source" },
  { kind: "tool", text: "TRENDING TOOL · Roboflow Sports — CV detection & tracking workflows" },
  { kind: "event", text: "PICKLEBALL · fastest-growing US sport · 36M players" },
  { kind: "tool", text: "NEW · pickleball-court-mapper — 12 court lines detected via OpenCV" },
  { kind: "news", text: "MARKET · Sports AI projected to reach ~$50B by 2033" },
  { kind: "event", text: "CONTRIBUTORS WANTED · 8 open issues on awesome-sports-ai" },
];
