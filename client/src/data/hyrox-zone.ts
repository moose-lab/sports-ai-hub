/**
 * Sports AI Hub — HYROX Zone content (the /hyrox page).
 *
 * A typed port of the design handoff's `data-hyrox.js`: the curated HYROX
 * tool directory (grouped by scenario, tagged by audience), the mono-tool
 * builder paths, the Season 9 "data drops" calendar, and the zone's LIVE
 * ticker. This is authored zone content, deliberately separate from the
 * upstream-synced `catalog.json` (which owns the site-wide directory) —
 * curating a tool here does not require an upstream release.
 *
 * The calendar is content, not fixture data: dates are the publicly
 * announced Season 9 (26/27) events as of Jul 2026, with hyrox.com /
 * results.hyrox.com linked as the living sources.
 */
import type { TickerItem } from "@/components/live-ticker";

export const HYROX_OFFICIAL = "https://hyrox.com";
export const HYROX_RESULTS = "https://results.hyrox.com/";

export type HyroxAudience = "Builders" | "Athletes" | "Coaches" | "Creators";
export type HyroxAudienceFilter = "All" | HyroxAudience;

/** Filter-pill order — "All" first, then the four personas. */
export const hyroxAudiences: HyroxAudienceFilter[] = ["All", "Builders", "Athletes", "Coaches", "Creators"];

export interface HyroxTool {
  name: string;
  desc: string;
  aud: HyroxAudience;
  url: string;
}

export interface HyroxCategory {
  id: string;
  name: string;
  blurb: string;
  tools: HyroxTool[];
}

/** Persona entry cards — who you are → what you need → filtered directory. */
export interface HyroxPersona {
  aud: HyroxAudience;
  title: string;
  need: string;
}

export const hyroxPersonas: HyroxPersona[] = [
  {
    aud: "Builders",
    title: "I build tools",
    need: "There's no official HYROX API. Scrapers, clients, and datasets to build on — and gaps worth shipping.",
  },
  {
    aud: "Athletes",
    title: "I race",
    need: "Find your weak station. Split analytics, percentile benchmarks, and pacing tools fed by your own results.",
  },
  {
    aud: "Coaches",
    title: "I coach",
    need: "Program the 12-week block and check the movement — load ratios, readiness, and pose-based form review.",
  },
  {
    aud: "Creators",
    title: "I make content",
    need: "Turn race footage and recaps into clips, transcripts, and tagged segments — programmatically.",
  },
];

/** The HYROX Collection — every entry is a real, reachable tool. */
export const hyroxCategories: HyroxCategory[] = [
  {
    id: "hyrox-data",
    name: "Race Data & Results",
    blurb: "There is no official API — these get race splits out of the results portal and into your code.",
    tools: [
      {
        name: "results.hyrox.com",
        desc: "The official results portal, powered by Mika Timing — source of truth for every split.",
        aud: "Athletes",
        url: "https://results.hyrox.com/",
      },
      {
        name: "pyrox-client",
        desc: "Unofficial Python client loading public HYROX race results into DataFrames.",
        aud: "Builders",
        url: "https://github.com/vmatei2/pyrox-client",
      },
      {
        name: "HyroxWebScraper",
        desc: "Scrapes the official results pages into structured athlete data.",
        aud: "Builders",
        url: "https://github.com/eduardo-jimenez/HyroxWebScraper",
      },
      {
        name: "hyrox_analysis",
        desc: "Extracts results and compares podium finishers to the field, station by station.",
        aud: "Builders",
        url: "https://github.com/imterence/hyrox_analysis",
      },
      {
        name: "HYROX Results Dataset",
        desc: "Kaggle notebook + dataset scraping full race results for offline analysis.",
        aud: "Builders",
        url: "https://www.kaggle.com/code/jgug05/hyrox-data-scraping",
      },
    ],
  },
  {
    id: "hyrox-pacing",
    name: "Performance & Pacing Analytics",
    blurb: "Splits, percentiles, strengths and weaknesses — where races are actually won.",
    tools: [
      {
        name: "hyrox-race-insights",
        desc: "Terminal analytics visualizing your race data, weaknesses, and heart-rate spikes.",
        aud: "Athletes",
        url: "https://github.com/JamesIves/hyrox-race-insights",
      },
      {
        name: "HYRESULT",
        desc: "Athlete profiles, results history, and race analytics on the web.",
        aud: "Athletes",
        url: "https://www.hyresult.com/",
      },
      {
        name: "Coroebus",
        desc: "Tracks training load, fitness, fatigue, and readiness across a race block.",
        aud: "Coaches",
        url: "https://github.com/prakashsellathurai/Coroebus",
      },
      {
        name: "Acute_Chronic_Workload_Ratio",
        desc: "Calculates acute-to-chronic workload ratios — guardrails for 12-week builds.",
        aud: "Coaches",
        url: "https://github.com/ale-uy/Acute_Chronic_Workload_Ratio",
      },
    ],
  },
  {
    id: "hyrox-movement",
    name: "Training & Movement Analysis",
    blurb: "Pose estimation and load tracking — form checks for wall balls, burpees, and lunges.",
    tools: [
      {
        name: "MMPose",
        desc: "Pose-estimation toolbox — measure squat depth on wall balls from a phone video.",
        aud: "Coaches",
        url: "https://github.com/open-mmlab/mmpose",
      },
      {
        name: "OpenPose",
        desc: "Real-time multi-person keypoint detection for station technique review.",
        aud: "Coaches",
        url: "https://github.com/CMU-Perceptual-Computing-Lab/openpose",
      },
      {
        name: "AthleteLoadMonitor",
        desc: "Monitors and predicts athlete load for hybrid strength + running plans.",
        aud: "Athletes",
        url: "https://github.com/SaxionAMI/AthleteLoadMonitor",
      },
      {
        name: "HYROX Training Plan Skill",
        desc: "Generates science-based training plans for coding agents with periodization references and validation scripts.",
        aud: "Coaches",
        url: "https://github.com/moose-lab/hyrox-training-plan-skill",
      },
      {
        name: "Roboflow Sports",
        desc: "CV detection and tracking workflows — adaptable to rep counting and station zones.",
        aud: "Builders",
        url: "https://github.com/roboflow/sports",
      },
    ],
  },
  {
    id: "hyrox-media",
    name: "Content & Media",
    blurb: "For the coaches, recap channels, and blogs feeding the fastest-growing race community.",
    tools: [
      {
        name: "OpenAI Whisper",
        desc: "Transcribes race recaps, coaching calls, and podcast audio to text.",
        aud: "Creators",
        url: "https://github.com/openai/whisper",
      },
      {
        name: "Video Tagging Events",
        desc: "Tags station segments inside race and training footage for review.",
        aud: "Creators",
        url: "https://github.com/napo/videotaggingevents",
      },
      {
        name: "ffmpeg-python",
        desc: "Cuts station clips and builds highlight reels programmatically.",
        aud: "Creators",
        url: "https://github.com/kkroening/ffmpeg-python",
      },
    ],
  },
];

/** Mono-tool chains — the HYROX builder's path. */
export interface HyroxBuilderPath {
  title: string;
  aud: HyroxAudience;
  steps: string[];
}

export const hyroxBuilderPaths: HyroxBuilderPath[] = [
  {
    title: "Build a race-split analyzer",
    aud: "Builders",
    steps: ["results-scraper", "split-normalizer", "station-percentiles", "weakness-radar", "race-report-md"],
  },
  {
    title: "Build a pacing planner",
    aud: "Athletes",
    steps: ["target-time-input", "split-budgeter", "run-pace-curve", "roxzone-buffer", "wristband-card"],
  },
  {
    title: "Build a wall-ball rep counter",
    aud: "Coaches",
    steps: ["video-loader", "pose-keypoints", "squat-depth-gate", "rep-counter", "form-report"],
  },
];

/** Season 9 (26/27) calendar — every race is a dataset. */
export type HyroxRaceStatus = "on-sale" | "coming-soon" | "sold-out";

export interface HyroxCalendarRow {
  city: string;
  country: string;
  date: string;
  region: string;
  status: HyroxRaceStatus;
  note?: string;
}

export const hyroxCalendar: HyroxCalendarRow[] = [
  { city: "New Delhi", country: "India", date: "Jul 24–26", region: "Asia", status: "on-sale", note: "Season 9 opener" },
  { city: "Chengdu", country: "China", date: "Aug 1–2", region: "Asia", status: "on-sale", note: "Debut city" },
  { city: "Chiba", country: "Japan", date: "Aug 7–9", region: "Asia", status: "on-sale", note: "Debut city" },
  { city: "Perth", country: "Australia", date: "Aug 21–23", region: "Oceania", status: "on-sale" },
  { city: "Washington, D.C.", country: "USA", date: "Sep 3–7", region: "N. America", status: "coming-soon", note: "First 5-day event in D.C." },
  { city: "Mumbai", country: "India", date: "Sep 18–20", region: "Asia", status: "sold-out" },
  { city: "Salt Lake City", country: "USA", date: "Sep 18–20", region: "N. America", status: "coming-soon", note: "Debut city" },
  { city: "Boston", country: "USA", date: "Oct 8–11", region: "N. America", status: "coming-soon" },
  { city: "Gdańsk", country: "Poland", date: "Oct 10–11", region: "Europe", status: "coming-soon", note: "European season opener" },
  { city: "Valencia", country: "Spain", date: "Oct 16–18", region: "Europe", status: "coming-soon" },
  { city: "Birmingham", country: "UK", date: "Oct 27–Nov 1", region: "Europe", status: "coming-soon", note: "Debut · 6-day weekend at the NEC" },
  { city: "Denver", country: "USA", date: "Nov 12–15", region: "N. America", status: "coming-soon", note: "Debut city" },
  { city: "Nashville", country: "USA", date: "Dec 10–13", region: "N. America", status: "coming-soon", note: "Debut city" },
  { city: "Vancouver", country: "Canada", date: "Dec 18–20", region: "N. America", status: "coming-soon" },
];

export const hyroxSeasonCaption = "Season 9 · 51 events · 174 race days · full calendar on hyrox.com";

/** The zone's LIVE ticker — same broadcast lower-third as Home, HYROX feed. */
export const hyroxTicker: TickerItem[] = [
  { kind: "score", text: "17 HYROX TOOLS CURATED · 4 SCENARIOS · 0 OFFICIAL APIS" },
  { kind: "tool", text: "TRENDING TOOL · pyrox-client — HYROX results into DataFrames" },
  { kind: "tool", text: "NEW · hyrox-race-insights — terminal race analytics + HR spikes" },
  { kind: "news", text: "DATA DROP · New Delhi results land Jul 26 · results.hyrox.com" },
  { kind: "tool", text: "NEW · HYROX Training Plan Skill — coding-agent programming guardrails" },
  { kind: "tool", text: "FOR COACHES · MMPose — wall-ball depth from a phone video" },
  { kind: "event", text: "WANTED · race-split-analyzer — claim it as a mono-tool" },
  { kind: "tool", text: "FOR CREATORS · Whisper + ffmpeg-python — recap-to-clips pipeline" },
];

/** Home featured band — "In the zone" tag picks. */
export const hyroxZonePicks = ["pyrox-client", "hyrox-race-insights", "Training Plan Skill", "HYRESULT", "MMPose"];
