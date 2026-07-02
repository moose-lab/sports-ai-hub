/**
 * Sports AI Hub — FIFA World Cup 2026 live data.
 *
 * Source of truth: the `awesome-sports-ai` repo runs a scheduled job
 * (`sync-fifa-world-cup.mjs`, every ~5 min during the tournament window) that
 * commits a snapshot to `visualizations/source-data.json`.
 *
 * We no longer fetch that raw file directly (its ~5 min CDN edge TTL stacked on
 * the ~5 min cron made the live data lag 10+ min). Instead we hit the same-origin
 * `/api/worldcup` Pages Function, which overlays ESPN's ~6-second-fresh scores
 * onto the snapshot at request time. The shape is identical, so the parser below
 * is unchanged.
 *
 * The feed gives fixtures with a dual-purpose `score` field: a result like
 * "MEX 2 - RSA 0" (which also encodes the 3-letter team codes) when Final,
 * or a kickoff time like "3 p.m. ET" when Scheduled. We parse that into a
 * typed model, derive stable team colors (the feed has none), and compute
 * group standings from the final results.
 */

/**
 * Same-origin Cloudflare Pages Function (`functions/api/worldcup.ts`) that
 * overlays ESPN's live scores onto the GitHub snapshot — far fresher than the
 * raw feed's 5-min CDN. Override with `VITE_WC_SOURCE` (e.g. point straight at
 * raw in environments without the Function).
 */
export const WC_SOURCE_URL = import.meta.env?.VITE_WC_SOURCE ?? "/api/worldcup";

export type WcStatus = "final" | "scheduled" | "live";

export interface WcTeam {
  name: string;
  code: string;
  color: string;
  score?: number;
}

export interface WcFixture {
  id: string;
  date: string; // "Jun 24"
  /** Group table bucket. Empty for knockout fixtures. */
  group: string; // "Group A"
  /** User-facing phase/round label, e.g. "Group A" or "Round of 32". */
  round: string;
  venue: string;
  tag: string;
  status: WcStatus;
  home: WcTeam;
  away: WcTeam;
  /** Kickoff label for scheduled matches, e.g. "3 p.m. ET". */
  kickoff?: string;
  insight?: string;
}

export interface WcStandingRow {
  code: string;
  name: string;
  color: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export interface WcStandingGroup {
  group: string;
  rows: WcStandingRow[];
}

export interface WcStat {
  label: string;
  value: string;
}

export interface WcMilestone {
  label: string;
  date: string;
  detail: string;
}

export interface WcLink {
  label: string;
  url: string;
}

export interface WorldCup {
  title: string;
  subtitle: string;
  updated: string; // "Updated June 24, 2026"
  refDate: string; // "2026-06-24" (snapshot generatedDate)
  todayLabel: string; // "Jun 24" — the feature day surfaced on the carousel
  links: WcLink[];
  stats: WcStat[];
  summary: { label: string; window: string; detail: string };
  fixtures: WcFixture[];
  today: WcFixture[]; // live-first match window that drives the homepage carousel
  standings: WcStandingGroup[];
  milestones: WcMilestone[];
}

/* ── Helpers ─────────────────────────────────────────────────── */

/** Readable foreground for a team-color background (luminance test). */
export function readableOn(hex: string): string {
  const c = hex.replace("#", "");
  if (c.length < 6) return "#F0F2F5";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "#0D0F14" : "#F0F2F5";
}

/** Deterministic, distinct hex color for a team code (the feed has no colors). */
export function teamColor(code: string): string {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  const sat = 58 + (h % 18); // 58–75%
  const light = 46 + ((h >> 3) % 12); // 46–58%
  return hslToHex(hue, sat, light);
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const SCORE_RE = /^\s*([A-Za-z]{2,4})\s+(\d+)\s*[-–]\s*([A-Za-z]{2,4})\s+(\d+)\s*$/;
const normalizeName = (n: string) =>
  n.toLowerCase().replace(/\band\b/g, "").replace(/[^a-z]/g, "");

/** Stable, position-independent slug for a fixture id (date + match). */
export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function statusOf(raw: string): WcStatus {
  const s = (raw || "").toLowerCase();
  // Word-boundary matches so "Playoff"/"Full schedule" aren't misread as live/final.
  if (/\b(final|full[- ]?time|ft)\b/.test(s)) return "final";
  if (/\b(live|in[- ]?play|in progress)\b/.test(s)) return "live";
  return "scheduled";
}

/** Month/day → "Jun 24" to match the feed's fixture `date` strings. */
function refDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/**
 * Convert the feed's Eastern-time kickoff label ("11 p.m. ET") to UTC
 * ("03:00 UTC"). The 2026 tournament window (Jun–Jul) is entirely Eastern
 * Daylight Time, a fixed UTC-4 offset, so no DST branching is needed. Returns
 * the input unchanged when it isn't an ET clock time.
 */
export function toUtcKickoff(label: string): string {
  const m = label.match(/^\s*(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s*m\.?\s*ET\s*$/i);
  if (!m) return label;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toLowerCase() === "p") h += 12;
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const utc = (h + 4) % 24; // ET (EDT) → UTC
  return `${String(utc).padStart(2, "0")}:${String(min).padStart(2, "0")} UTC`;
}

/* ── Parsing ─────────────────────────────────────────────────── */

interface RawFixture {
  date: string;
  match: string;
  group?: string;
  round?: string;
  venue: string;
  tag: string;
  status: string;
  score: string;
  insight: string;
}

const GROUP_LABEL_RE = /^Group [A-L]$/i;

function groupLabelOf(f: RawFixture): string {
  const group = String(f.group || "").trim();
  return GROUP_LABEL_RE.test(group) ? group : "";
}

function roundLabelOf(f: RawFixture, group: string): string {
  return String(f.round || group || f.tag || "").trim();
}

function uniqueFixtures(pools: WcFixture[][]): WcFixture[] {
  const seen = new Set<string>();
  const out: WcFixture[] = [];
  for (const pool of pools) {
    for (const fixture of pool) {
      if (seen.has(fixture.id)) continue;
      seen.add(fixture.id);
      out.push(fixture);
    }
  }
  return out;
}

/** Parse the raw `source-data.json` object into the typed World Cup model. */
export function parseWorldCup(root: any): WorldCup {
  const fifa = root?.fifaWorldCup ?? {};
  const rawFixtures: RawFixture[] = Array.isArray(fifa.confirmedFixtures)
    ? fifa.confirmedFixtures
    : [];

  // Pass 1 — learn name→code from fixtures whose score encodes codes.
  const codeByName = new Map<string, string>();
  for (const f of rawFixtures) {
    const m = String(f.score || "").match(SCORE_RE);
    if (!m) continue;
    const names = String(f.match || "").split(/\s+v\s+/i);
    if (names.length === 2) {
      codeByName.set(normalizeName(names[0]), m[1].toUpperCase());
      codeByName.set(normalizeName(names[1]), m[3].toUpperCase());
    }
  }
  const codeFor = (name: string): string => {
    const key = normalizeName(name);
    const known = codeByName.get(key);
    if (known) return known;
    // Fallback: first letters of each word, up to 3 chars.
    const words = name.replace(/[^A-Za-z ]/g, "").trim().split(/\s+/);
    const abbr =
      words.length > 1
        ? words.map((w) => w[0]).join("").slice(0, 3)
        : name.replace(/[^A-Za-z]/g, "").slice(0, 3);
    return abbr.toUpperCase() || "TBD";
  };

  // Pass 2 — build typed fixtures.
  const fixtures: WcFixture[] = rawFixtures.map((f, i) => {
    const status = statusOf(f.status);
    const group = groupLabelOf(f);
    const round = roundLabelOf(f, group);
    const names = String(f.match || "").split(/\s+v\s+/i);
    const homeName = (names[0] || "Home").trim();
    const awayName = (names[1] || "Away").trim();
    const scoreMatch = String(f.score || "").match(SCORE_RE);

    let home: WcTeam;
    let away: WcTeam;
    let kickoff: string | undefined;

    if (scoreMatch) {
      const hCode = scoreMatch[1].toUpperCase();
      const aCode = scoreMatch[3].toUpperCase();
      home = { name: homeName, code: hCode, color: teamColor(hCode), score: Number(scoreMatch[2]) };
      away = { name: awayName, code: aCode, color: teamColor(aCode), score: Number(scoreMatch[4]) };
    } else {
      const hCode = codeFor(homeName);
      const aCode = codeFor(awayName);
      home = { name: homeName, code: hCode, color: teamColor(hCode) };
      away = { name: awayName, code: aCode, color: teamColor(aCode) };
      kickoff = toUtcKickoff(String(f.score || "").trim()) || undefined; // scheduled: score holds the time (shown in UTC)
    }

    return {
      // Stable across polls so a reordered/inserted fixture doesn't shift ids
      // and silently move the user's Match Center selection.
      id: slugify(`${f.date} ${f.match}`) || `fx${i}`,
      date: f.date,
      group,
      round,
      venue: f.venue,
      tag: f.tag,
      status,
      home,
      away,
      kickoff,
      insight: f.insight,
    };
  });

  const refDate: string = String(root?.generatedDate || "");
  const todayLabel = refDateLabel(refDate);
  const liveFixtures = fixtures.filter((f) => f.status === "live");
  const featureDayFixtures = fixtures.filter((f) => f.date === todayLabel);
  let today = uniqueFixtures([liveFixtures, featureDayFixtures]);
  if (today.length === 0) {
    // Fallback so the carousel is never empty: on dark days, prefer the latest
    // result day before falling forward to the next scheduled fixtures.
    const latestResultDay = [...fixtures].reverse().find((f) => f.status === "final")?.date;
    const pickDay = latestResultDay ?? fixtures.find((f) => f.status !== "final")?.date ?? fixtures[fixtures.length - 1]?.date;
    today = fixtures.filter((f) => f.date === pickDay);
  }

  return {
    title: fifa.title ?? "FIFA World Cup 2026",
    subtitle: fifa.subtitle ?? "",
    updated: fifa.updated ?? "",
    refDate,
    todayLabel,
    links: Array.isArray(fifa.links) ? fifa.links : [],
    stats: Array.isArray(fifa.stats) ? fifa.stats : [],
    summary: fifa.fixtureSummary ?? { label: "", window: "", detail: "" },
    fixtures,
    today,
    standings: computeStandings(fixtures),
    milestones: Array.isArray(fifa.milestones) ? fifa.milestones : [],
  };
}

/** Compute group tables from final results — the feed ships no standings. */
export function computeStandings(fixtures: WcFixture[]): WcStandingGroup[] {
  const groups = new Map<string, Map<string, WcStandingRow>>();

  const rowFor = (group: string, t: WcTeam): WcStandingRow => {
    if (!groups.has(group)) groups.set(group, new Map());
    const table = groups.get(group)!;
    let row = table.get(t.code);
    if (!row) {
      row = { code: t.code, name: t.name, color: t.color, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
      table.set(t.code, row);
    }
    return row;
  };

  for (const f of fixtures) {
    if (f.status !== "final" || f.home.score == null || f.away.score == null) continue;
    if (!f.group) continue;
    const h = rowFor(f.group, f.home);
    const a = rowFor(f.group, f.away);
    h.p++; a.p++;
    h.gf += f.home.score; h.ga += f.away.score;
    a.gf += f.away.score; a.ga += f.home.score;
    if (f.home.score > f.away.score) { h.w++; h.pts += 3; a.l++; }
    else if (f.home.score < f.away.score) { a.w++; a.pts += 3; h.l++; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  }

  const result: WcStandingGroup[] = [];
  for (const [group, table] of Array.from(groups.entries()).sort((x, y) => x[0].localeCompare(y[0]))) {
    const rows = Array.from(table.values());
    rows.forEach((r) => (r.gd = r.gf - r.ga));
    rows.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name));
    result.push({ group, rows });
  }
  return result;
}

export interface WorldCupSnapshot {
  /** Exact response body text — used by the hook for byte-level change detection. */
  raw: string;
  data: WorldCup;
}

/**
 * A snapshot is only usable if it carries at least one fixture. An empty or
 * unexpected payload (missing `fifaWorldCup`, missing/empty `confirmedFixtures`,
 * a 200 with the wrong shape) parses to zero fixtures — there is nothing to
 * render, so callers should treat it as a failure and retry rather than show an
 * empty World Cup zone.
 */
export function isUsableWorldCup(data: WorldCup): boolean {
  return Array.isArray(data.fixtures) && data.fixtures.length > 0;
}

/** Fetch + parse the live snapshot, keeping the raw body for change detection. */
export async function fetchWorldCupSnapshot(signal?: AbortSignal): Promise<WorldCupSnapshot> {
  const res = await fetch(WC_SOURCE_URL, { signal, cache: "no-store" });
  if (!res.ok) throw new Error(`World Cup feed responded ${res.status}`);
  const raw = await res.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("World Cup feed returned malformed data");
  }
  const data = parseWorldCup(parsed);
  // Treat an empty/unexpected payload as a failure so the hook retries it.
  if (!isUsableWorldCup(data)) throw new Error("World Cup feed returned no fixtures");
  return { raw, data };
}

/** True when any fixture is currently in play. */
export function hasLiveFixture(data: WorldCup): boolean {
  return Array.isArray(data.fixtures) && data.fixtures.some((f) => f.status === "live");
}

/* ── Hottest fixture ─────────────────────────────────────────── */

/** Marquee tags the feed uses for standout fixtures. */
const HOT_TAGS = /\b(marquee|opener|final|knockout|semi|quarter|host)\b/i;

/** A fixture worth a "HOT" label: in play now, or a marquee-tagged tie. */
export function isHot(f: WcFixture): boolean {
  return f.status === "live" || HOT_TAGS.test(f.tag || "");
}

/** Pick the marquee-tagged fixture from a set, else the first (feed order). */
function pickMarquee(pool: WcFixture[]): WcFixture | undefined {
  return pool.find((f) => HOT_TAGS.test(f.tag || "")) ?? pool[0];
}

/**
 * The single fixture to feature by default. Driven by live status — NOT the
 * snapshot's feature day — so a match still in play is never skipped when the
 * generatedDate has already rolled to the next day:
 *   1. a match in play right now (the live focus), else
 *   2. the hottest fixture of the nearest upcoming day (临近的热门赛事), else
 *   3. the most recent fixture once the tournament is over.
 * The feed is chronological, so the first scheduled fixture is the soonest.
 */
export function hottestFixture(data: WorldCup): WcFixture | undefined {
  const fixtures = data.fixtures;
  if (fixtures.length === 0) return undefined;

  const live = fixtures.filter((f) => f.status === "live");
  if (live.length > 0) return pickMarquee(live);

  const upcoming = fixtures.filter((f) => f.status === "scheduled");
  if (upcoming.length > 0) {
    const nextDay = upcoming[0].date; // earliest scheduled day
    return pickMarquee(upcoming.filter((f) => f.date === nextDay));
  }

  return fixtures[fixtures.length - 1];
}
