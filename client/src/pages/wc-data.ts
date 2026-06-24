/**
 * Sports AI Hub — FIFA World Cup 2026 feed.
 * Ported verbatim from the design handoff's `wc-live.jsx` WC_FEED.
 *
 * The World Cup is a SEASONAL feed framed as a once-a-day sync from the
 * awesome-sports-ai repo — NOT a real-time stream. So there is no "LIVE"
 * badge and no second-by-second ticking: an in-progress match shows its
 * snapshot minute (e.g. `IN PLAY · 67'`). All content is static.
 */

export type MatchStatus = "live" | "upcoming" | "ft";

export interface Team {
  name: string;
  code: string;
  color: string;
  score?: number;
}

export interface Match {
  id: string;
  status: MatchStatus;
  minute?: number;
  group: string;
  venue: string;
  home: Team;
  away: Team;
  kickoff: string;
}

export type EventType = "goal" | "yellow" | "sub";

export interface MatchEvent {
  minute: number;
  type: EventType;
  team: "home" | "away";
  text: string;
}

export interface StatLine {
  label: string;
  home: number;
  away: number;
  unit?: string;
}

export interface WinProb {
  home: number;
  draw: number;
  away: number;
}

export interface Player {
  n: number;
  name: string;
  pos: string;
}

export interface Lineup {
  formation: string;
  coach: string;
  /** Rows back-to-front: [GK], [defenders], [midfield], [attack]. */
  lines: Player[][];
}

export interface Featured {
  events: MatchEvent[];
  stats: StatLine[];
  winProb: WinProb;
  lineups: { home: Lineup; away: Lineup };
}

export interface StandingRow {
  name: string;
  code: string;
  color: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
}

export interface StandingGroup {
  group: string;
  rows: StandingRow[];
}

export interface Scorer {
  name: string;
  team: string;
  color: string;
  goals: number;
  assists: number;
}

export interface WcFeed {
  title: string;
  matchday: string;
  phase: string;
  dateLabel: string;
  syncedAt: string;
  featuredId: string;
  matches: Match[];
  featured: Featured;
  standings: StandingGroup[];
  scorers: Scorer[];
}

export const wcFeed: WcFeed = {
  title: "FIFA World Cup 2026",
  matchday: "Matchday 2",
  phase: "Group Stage",
  dateLabel: "Tuesday · June 24, 2026",
  syncedAt: "07:00 UTC",
  featuredId: "bra-arg",
  matches: [
    {
      id: "bra-arg",
      status: "live",
      minute: 67,
      group: "Group C",
      venue: "MetLife Stadium · New Jersey",
      home: { name: "Brazil", code: "BRA", color: "#FFCB05", score: 2 },
      away: { name: "Argentina", code: "ARG", color: "#75AADB", score: 1 },
      kickoff: "16:00",
    },
    {
      id: "fra-ger",
      status: "live",
      minute: 54,
      group: "Group F",
      venue: "SoFi Stadium · Los Angeles",
      home: { name: "France", code: "FRA", color: "#2C5697", score: 1 },
      away: { name: "Germany", code: "GER", color: "#C8CDD2", score: 1 },
      kickoff: "16:30",
    },
    {
      id: "usa-mex",
      status: "upcoming",
      group: "Group A",
      venue: "Estadio Azteca · Mexico City",
      home: { name: "USA", code: "USA", color: "#3B5BA5" },
      away: { name: "Mexico", code: "MEX", color: "#1B7F4B" },
      kickoff: "20:00",
    },
    {
      id: "eng-esp",
      status: "upcoming",
      group: "Group B",
      venue: "AT&T Stadium · Dallas",
      home: { name: "England", code: "ENG", color: "#C8CDD2" },
      away: { name: "Spain", code: "ESP", color: "#C8102E" },
      kickoff: "22:30",
    },
    {
      id: "jpn-sen",
      status: "upcoming",
      group: "Group H",
      venue: "BC Place · Vancouver",
      home: { name: "Japan", code: "JPN", color: "#BC002D" },
      away: { name: "Senegal", code: "SEN", color: "#16A34A" },
      kickoff: "18:00",
    },
    {
      id: "por-mar",
      status: "ft",
      group: "Group D",
      venue: "Hard Rock Stadium · Miami",
      home: { name: "Portugal", code: "POR", color: "#16A34A", score: 3 },
      away: { name: "Morocco", code: "MAR", color: "#C8102E", score: 0 },
      kickoff: "13:00",
    },
    {
      id: "ned-cro",
      status: "ft",
      group: "Group E",
      venue: "Lumen Field · Seattle",
      home: { name: "Netherlands", code: "NED", color: "#F36C21", score: 2 },
      away: { name: "Croatia", code: "CRO", color: "#C8102E", score: 2 },
      kickoff: "10:30",
    },
  ],
  featured: {
    events: [
      { minute: 12, type: "goal", team: "home", text: "Vinícius Jr. lashes it in off the far post — Brazil 1-0" },
      { minute: 28, type: "yellow", team: "away", text: "Booked — De Paul, tactical foul on Paquetá" },
      { minute: 34, type: "goal", team: "away", text: "Julián Álvarez sweeps home the equaliser — 1-1" },
      { minute: 51, type: "goal", team: "home", text: "Rodrygo slots the go-ahead from Raphinha's cutback — 2-1" },
      { minute: 63, type: "sub", team: "away", text: "Argentina change — Nico Paz on for Mac Allister" },
    ],
    stats: [
      { label: "Possession", home: 58, away: 42, unit: "%" },
      { label: "Shots", home: 14, away: 9 },
      { label: "Shots on target", home: 6, away: 4 },
      { label: "Expected goals (xG)", home: 2.31, away: 1.18 },
      { label: "Passes", home: 512, away: 388 },
      { label: "Corners", home: 7, away: 3 },
      { label: "Fouls", home: 8, away: 11 },
    ],
    winProb: { home: 54, draw: 27, away: 19 },
    lineups: {
      home: {
        formation: "4-3-3",
        coach: "Dorival Júnior",
        lines: [
          [{ n: 1, name: "Alisson", pos: "GK" }],
          [
            { n: 2, name: "Danilo", pos: "RB" },
            { n: 3, name: "Marquinhos", pos: "CB" },
            { n: 4, name: "G. Magalhães", pos: "CB" },
            { n: 6, name: "Wendell", pos: "LB" },
          ],
          [
            { n: 5, name: "B. Guimarães", pos: "CM" },
            { n: 8, name: "Paquetá", pos: "CM" },
            { n: 15, name: "João Gomes", pos: "CM" },
          ],
          [
            { n: 7, name: "Rodrygo", pos: "RW" },
            { n: 9, name: "Endrick", pos: "ST" },
            { n: 11, name: "Vinícius Jr.", pos: "LW" },
          ],
        ],
      },
      away: {
        formation: "4-4-2",
        coach: "Lionel Scaloni",
        lines: [
          [{ n: 23, name: "E. Martínez", pos: "GK" }],
          [
            { n: 4, name: "Molina", pos: "RB" },
            { n: 13, name: "Romero", pos: "CB" },
            { n: 19, name: "Otamendi", pos: "CB" },
            { n: 3, name: "Tagliafico", pos: "LB" },
          ],
          [
            { n: 7, name: "De Paul", pos: "RM" },
            { n: 5, name: "E. Fernández", pos: "CM" },
            { n: 20, name: "Mac Allister", pos: "CM" },
            { n: 11, name: "Di María", pos: "LM" },
          ],
          [
            { n: 10, name: "Messi", pos: "ST" },
            { n: 9, name: "J. Álvarez", pos: "ST" },
          ],
        ],
      },
    },
  },
  standings: [
    {
      group: "Group C",
      rows: [
        { name: "Brazil", code: "BRA", color: "#FFCB05", p: 2, w: 1, d: 1, l: 0, gf: 4, ga: 2, pts: 4 },
        { name: "Argentina", code: "ARG", color: "#75AADB", p: 2, w: 1, d: 0, l: 1, gf: 3, ga: 3, pts: 3 },
        { name: "Nigeria", code: "NGA", color: "#16A34A", p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 2, pts: 3 },
        { name: "Norway", code: "NOR", color: "#C8102E", p: 2, w: 0, d: 1, l: 1, gf: 1, ga: 3, pts: 1 },
      ],
    },
    {
      group: "Group F",
      rows: [
        { name: "France", code: "FRA", color: "#2C5697", p: 2, w: 1, d: 1, l: 0, gf: 3, ga: 1, pts: 4 },
        { name: "Germany", code: "GER", color: "#C8CDD2", p: 2, w: 1, d: 1, l: 0, gf: 2, ga: 1, pts: 4 },
        { name: "Uruguay", code: "URU", color: "#5B9BD5", p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 2, pts: 3 },
        { name: "Korea Rep.", code: "KOR", color: "#C8102E", p: 2, w: 0, d: 0, l: 2, gf: 0, ga: 3, pts: 0 },
      ],
    },
    {
      group: "Group A",
      rows: [
        { name: "Mexico", code: "MEX", color: "#1B7F4B", p: 1, w: 1, d: 0, l: 0, gf: 2, ga: 0, pts: 3 },
        { name: "USA", code: "USA", color: "#3B5BA5", p: 1, w: 1, d: 0, l: 0, gf: 1, ga: 0, pts: 3 },
        { name: "Australia", code: "AUS", color: "#F59E0B", p: 1, w: 0, d: 0, l: 1, gf: 0, ga: 1, pts: 0 },
        { name: "Ghana", code: "GHA", color: "#C8102E", p: 1, w: 0, d: 0, l: 1, gf: 0, ga: 2, pts: 0 },
      ],
    },
  ],
  scorers: [
    { name: "Kylian Mbappé", team: "FRA", color: "#2C5697", goals: 5, assists: 1 },
    { name: "Vinícius Jr.", team: "BRA", color: "#FFCB05", goals: 4, assists: 2 },
    { name: "Harry Kane", team: "ENG", color: "#C8CDD2", goals: 4, assists: 0 },
    { name: "Julián Álvarez", team: "ARG", color: "#75AADB", goals: 3, assists: 2 },
    { name: "Cristiano Ronaldo", team: "POR", color: "#16A34A", goals: 3, assists: 1 },
    { name: "Cole Palmer", team: "ENG", color: "#C8CDD2", goals: 2, assists: 3 },
  ],
};

/** The featured "match of the day" (defaults to `bra-arg`). */
export const featuredMatch: Match =
  wcFeed.matches.find((m) => m.id === wcFeed.featuredId) ?? wcFeed.matches[0];

/**
 * Pick a readable foreground for a team-color background — luminance test,
 * matching the design's `readable()` helper.
 */
export function readableOn(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? "#0D0F14" : "#F0F2F5";
}
