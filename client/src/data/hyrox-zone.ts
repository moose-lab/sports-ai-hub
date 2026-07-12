/**
 * Sports AI Hub — HYROX Zone content (the /hyrox page).
 *
 * A typed port of the design handoff's `data-hyrox.js` (v2): the curated
 * HYROX collection categorized exactly like the moose-lab/awesome-sports-ai
 * README (6 categories), with every entry carrying a kind — tool | api |
 * dataset | model — so datasets and models have a visible place inside every
 * category. Also holds the race-explainer content (8 stations + the run),
 * the hero film reference, the mono-tool builder paths, the Season 9 "data
 * drops" calendar, and the zone's LIVE ticker. This is authored zone
 * content, deliberately separate from the upstream-synced `catalog.json`
 * (which owns the site-wide directory) — curating a tool here does not
 * require an upstream release.
 *
 * The calendar is content, not fixture data: dates are the publicly
 * announced Season 9 (26/27) events as of Jul 2026, with hyrox.com /
 * results.hyrox.com linked as the living sources.
 */
import type { TickerItem } from "@/components/live-ticker";

export const HYROX_OFFICIAL = "https://hyrox.com";
export const HYROX_RESULTS = "https://results.hyrox.com/";

/**
 * The hero film — "What is HYROX? | The Race Format" from the official
 * HYROX channel (@HYROX_OFFICIAL), verified embeddable via YouTube oEmbed.
 * Embed src is built by the HeroFilm component; watchUrl is the fallback
 * when YouTube is unreachable from the visitor's network.
 */
export const HYROX_FILM = {
  id: "YN-n8t8d2bA",
  title: "What is HYROX? — The Race Format (official)",
  watchUrl: "https://www.youtube.com/watch?v=YN-n8t8d2bA",
};

export type HyroxAudience = "Builders" | "Athletes" | "Coaches" | "Creators";
export type HyroxAudienceFilter = "All" | HyroxAudience;

/** Filter-pill order — "All" first, then the four personas. */
export const hyroxAudiences: HyroxAudienceFilter[] = ["All", "Builders", "Athletes", "Coaches", "Creators"];

/** What an entry is — datasets and models live inside every category. */
export type HyroxKind = "tool" | "api" | "dataset" | "model";

/** Type-pill order; the "Tools" pill also covers kind "api". */
export type HyroxKindFilter = "All types" | "Tools" | "Datasets" | "Models";
export const hyroxKinds: HyroxKindFilter[] = ["All types", "Tools", "Datasets", "Models"];

export interface HyroxTool {
  name: string;
  kind: HyroxKind;
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

/* ── The race, as raced — identical in every city ─────────────────────── */

/** Race-explainer header content: what HYROX is, in facts. */
export const hyroxIntro = {
  tagline: "8 × (1 km run + 1 workout station)",
  body: "HYROX is a fitness race, not a workout: you run 1 km, complete a functional workout station, and repeat — eight times, in the same fixed order, at the same weights, in every city in the world. Because the format never changes, every result is comparable, and every split is data.",
  facts: [
    { k: "8 km", v: "total running — over half your race time" },
    { k: "8", v: "stations, fixed order, standardized loads" },
    { k: "±90 min", v: "typical Open finish — one long threshold effort" },
    { k: "1 format", v: "identical worldwide → globally comparable splits" },
  ],
};

/** Lucide icon names used by the course strip — mapped to components in the UI. */
export type HyroxStationIcon =
  | "wind"
  | "arrow-big-right"
  | "arrow-big-left"
  | "activity"
  | "waves"
  | "grip"
  | "footprints"
  | "target";

export interface HyroxStation {
  n: number;
  name: string;
  /** Official load/distance — Open men reference. */
  spec: string;
  icon: HyroxStationIcon;
  what: string;
  /** Directory tool names that train this segment — resolved by name. */
  train: string[];
}

/** The 8 stations, in race order, at the standardized loads. */
export const hyroxStations: HyroxStation[] = [
  {
    n: 1,
    name: "SkiErg",
    spec: "1,000 m",
    icon: "wind",
    what: "Full-body pull on the ski ergometer — lats, triceps, and legs. The first upper-body endurance test, straight off run 1.",
    train: ["Concept2 Logbook API", "MMPose"],
  },
  {
    n: 2,
    name: "Sled Push",
    spec: "50 m · 152 kg",
    icon: "arrow-big-right",
    what: "The heaviest leg-drive moment of the race: 4 × 12.5 m lengths pushing a loaded sled. Wrecks the legs for the next run if mispaced.",
    train: ["Coroebus", "Acute_Chronic_Workload_Ratio"],
  },
  {
    n: 3,
    name: "Sled Pull",
    spec: "50 m · 103 kg",
    icon: "arrow-big-left",
    what: "Hand-over-hand rope pull, walking backwards inside a box. Grip, posterior chain, and patience.",
    train: ["Acute_Chronic_Workload_Ratio", "AthleteLoadMonitor"],
  },
  {
    n: 4,
    name: "Burpee Broad Jump",
    spec: "80 m",
    icon: "activity",
    what: "Chest-to-ground burpee, then a two-footed jump forward — for 80 m. Rep integrity is judged; rhythm beats bursts.",
    train: ["RepNet", "MMPose"],
  },
  {
    n: 5,
    name: "Rowing",
    spec: "1,000 m",
    icon: "waves",
    what: "1,000 m on the Concept2 rower at the halfway mark. A pacing-discipline test — going 3 s/500m too hard costs minutes later.",
    train: ["Concept2 Logbook API", "Runalyze"],
  },
  {
    n: 6,
    name: "Farmers Carry",
    spec: "200 m · 2×24 kg",
    icon: "grip",
    what: "Two kettlebells, 200 m, no sockets to rest on. Pure grip endurance and upright posture under fatigue.",
    train: ["AthleteLoadMonitor"],
  },
  {
    n: 7,
    name: "Sandbag Lunges",
    spec: "100 m · 20 kg",
    icon: "footprints",
    what: "Walking lunges with a sandbag shouldered, back knee kissing the floor every rep — judged, for 100 m.",
    train: ["OpenPose", "RepCount Dataset"],
  },
  {
    n: 8,
    name: "Wall Balls",
    spec: "100 reps · 6 kg",
    icon: "target",
    what: "The finisher: 100 squat-and-throws to a target, full depth judged, on legs that have already done everything above.",
    train: ["MMPose", "RepNet"],
  },
];

/** The run between stations — 8 of them stitch the course together. */
export const hyroxRun = {
  name: "RUN",
  spec: "1,000 m",
  icon: "footprints" as HyroxStationIcon,
  what: "Eight 1 km runs stitch the stations together — 8 km total, more than half your race time. Races are won on run pacing, not station heroics.",
  train: ["Runalyze", "hyrox-race-insights"],
};

/* ── The HYROX collection ──────────────────────────────────────────────
   Category ids + names mirror the awesome-sports-ai README. */
export const hyroxCategories: HyroxCategory[] = [
  {
    id: "data",
    name: "Data, APIs & Feeds",
    blurb: "There is no official API — these get race splits out of the results portal and into your code.",
    tools: [
      {
        name: "results.hyrox.com",
        kind: "api",
        desc: "The official results portal, powered by Mika Timing — source of truth for every split.",
        aud: "Athletes",
        url: "https://results.hyrox.com/",
      },
      {
        name: "pyrox-client",
        kind: "tool",
        desc: "Unofficial Python client loading public HYROX race results into DataFrames.",
        aud: "Builders",
        url: "https://github.com/vmatei2/pyrox-client",
      },
      {
        name: "HyroxWebScraper",
        kind: "tool",
        desc: "Scrapes the official results pages into structured athlete data.",
        aud: "Builders",
        url: "https://github.com/eduardo-jimenez/HyroxWebScraper",
      },
      {
        name: "hyrox_analysis",
        kind: "tool",
        desc: "Extracts results and compares podium finishers to the field, station by station.",
        aud: "Builders",
        url: "https://github.com/imterence/hyrox_analysis",
      },
      {
        name: "Concept2 Logbook API",
        kind: "api",
        desc: "Official API for SkiErg and rower workouts — the two erg stations, logged and queryable.",
        aud: "Builders",
        url: "https://log.concept2.com/developers/documentation/",
      },
    ],
  },
  {
    id: "analytics",
    name: "Analytics & Visualization",
    blurb: "Splits, percentiles, strengths and weaknesses — where races are actually won.",
    tools: [
      {
        name: "hyrox-race-insights",
        kind: "tool",
        desc: "Terminal analytics visualizing your race data, weaknesses, and heart-rate spikes.",
        aud: "Athletes",
        url: "https://github.com/JamesIves/hyrox-race-insights",
      },
      {
        name: "HYRESULT",
        kind: "tool",
        desc: "Athlete profiles, results history, and race analytics on the web.",
        aud: "Athletes",
        url: "https://www.hyresult.com/",
      },
      {
        name: "Runalyze",
        kind: "tool",
        desc: "Free running analytics — marathon shape, TRIMP, and pace curves for the 8 km that decide your race.",
        aud: "Athletes",
        url: "https://runalyze.com/",
      },
      {
        name: "hyrox_analysis notebooks",
        kind: "tool",
        desc: "Notebook workflows comparing podium finishers to the field, station by station.",
        aud: "Builders",
        url: "https://github.com/imterence/hyrox_analysis",
      },
    ],
  },
  {
    id: "training",
    name: "Training & Performance",
    blurb: "Load management for the 12-week block, plus pose models that judge depth and reps like a marshal would.",
    tools: [
      {
        name: "Coroebus",
        kind: "tool",
        desc: "Tracks training load, fitness, fatigue, and readiness across a race block.",
        aud: "Coaches",
        url: "https://github.com/prakashsellathurai/Coroebus",
      },
      {
        name: "Acute_Chronic_Workload_Ratio",
        kind: "tool",
        desc: "Calculates acute-to-chronic workload ratios — guardrails for 12-week builds.",
        aud: "Coaches",
        url: "https://github.com/ale-uy/Acute_Chronic_Workload_Ratio",
      },
      {
        name: "AthleteLoadMonitor",
        kind: "tool",
        desc: "Monitors and predicts athlete load for hybrid strength + running plans.",
        aud: "Athletes",
        url: "https://github.com/SaxionAMI/AthleteLoadMonitor",
      },
      {
        name: "HYROX Training Plan Skill",
        kind: "tool",
        desc: "Generates science-based training plans for coding agents with periodization references and validation scripts.",
        aud: "Coaches",
        url: "https://github.com/moose-lab/hyrox-training-plan-skill",
      },
      {
        name: "MMPose",
        kind: "model",
        desc: "Pose-estimation toolbox — measure wall-ball squat depth from a phone video.",
        aud: "Coaches",
        url: "https://github.com/open-mmlab/mmpose",
      },
      {
        name: "OpenPose",
        kind: "model",
        desc: "Real-time multi-person keypoint detection for station technique review.",
        aud: "Coaches",
        url: "https://github.com/CMU-Perceptual-Computing-Lab/openpose",
      },
      {
        name: "RepNet",
        kind: "model",
        desc: "Class-agnostic repetition counting from video — burpees, lunges, wall balls.",
        aud: "Builders",
        url: "https://sites.google.com/view/repnet",
      },
    ],
  },
  {
    id: "media",
    name: "Media, Highlights & Content",
    blurb: "For the coaches, recap channels, and blogs feeding the fastest-growing race community.",
    tools: [
      {
        name: "OpenAI Whisper",
        kind: "model",
        desc: "Transcribes race recaps, coaching calls, and podcast audio to text.",
        aud: "Creators",
        url: "https://github.com/openai/whisper",
      },
      {
        name: "Video Tagging Events",
        kind: "tool",
        desc: "Tags station segments inside race and training footage for review.",
        aud: "Creators",
        url: "https://github.com/napo/videotaggingevents",
      },
      {
        name: "ffmpeg-python",
        kind: "tool",
        desc: "Cuts station clips and builds highlight reels programmatically.",
        aud: "Creators",
        url: "https://github.com/kkroening/ffmpeg-python",
      },
    ],
  },
  {
    id: "devtools",
    name: "Developer Tools",
    blurb: "The CV and video infrastructure under every rep counter and station tracker.",
    tools: [
      {
        name: "Roboflow Sports",
        kind: "tool",
        desc: "CV detection and tracking workflows — adaptable to rep counting and station zones.",
        aud: "Builders",
        url: "https://github.com/roboflow/sports",
      },
      {
        name: "Ultralytics YOLO",
        kind: "model",
        desc: "Detection + pose models fast enough for live station tracking on a laptop.",
        aud: "Builders",
        url: "https://github.com/ultralytics/ultralytics",
      },
      {
        name: "OpenCV",
        kind: "tool",
        desc: "Computer-vision infrastructure for tracking, detection, and video.",
        aud: "Builders",
        url: "https://github.com/opencv/opencv",
      },
    ],
  },
  {
    id: "datasets",
    name: "Datasets & Research",
    blurb: "Open race results and workout-video benchmarks — the raw material for HYROX models.",
    tools: [
      {
        name: "HYROX Results Dataset",
        kind: "dataset",
        desc: "Kaggle notebook + dataset scraping full race results for offline analysis.",
        aud: "Builders",
        url: "https://www.kaggle.com/code/jgug05/hyrox-data-scraping",
      },
      {
        name: "RepCount Dataset",
        kind: "dataset",
        desc: "Repetition-counting video benchmark (TransRAC, CVPR'22) — train your own rep counter.",
        aud: "Builders",
        url: "https://svip-lab.github.io/dataset/RepCount_dataset.html",
      },
      {
        name: "MM-Fit Dataset",
        kind: "dataset",
        desc: "Multimodal workout data — synced wearables + depth video across full-body exercises.",
        aud: "Builders",
        url: "https://mmfit.github.io/",
      },
    ],
  },
];

const allHyroxTools = hyroxCategories.flatMap((c) => c.tools);

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
  {
    kind: "score",
    text: `${allHyroxTools.length} HYROX TOOLS · ${hyroxCategories.length} CATEGORIES · TOOLS + DATASETS + MODELS`,
  },
  { kind: "tool", text: "TRENDING TOOL · pyrox-client — HYROX results into DataFrames" },
  { kind: "tool", text: "NEW MODEL · RepNet — count burpees & wall balls from video" },
  { kind: "news", text: "DATA DROP · New Delhi results land Jul 26 · results.hyrox.com" },
  { kind: "tool", text: "NEW DATASET · RepCount — train your own rep counter" },
  { kind: "tool", text: "NEW · HYROX Training Plan Skill — coding-agent programming guardrails" },
  { kind: "event", text: "WANTED · race-split-analyzer — claim it as a mono-tool" },
  { kind: "tool", text: "FOR CREATORS · Whisper + ffmpeg-python — recap-to-clips pipeline" },
];

/** Home featured band — "In the zone" tag picks. */
export const hyroxZonePicks = ["pyrox-client", "hyrox-race-insights", "Training Plan Skill", "HYRESULT", "MMPose"];
