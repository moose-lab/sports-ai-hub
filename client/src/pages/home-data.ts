/**
 * Sports AI Hub — landing page content.
 * Ported from the design handoff's data.js, mirrored from the
 * moose-lab/awesome-sports-ai README. All content is static.
 */

/** Resolve a file in client/public/assets/ against Vite's base path
 *  (the GitHub Pages build serves the site under /sports-ai-hub/). */
export const asset = (file: string): string =>
  `${import.meta.env.BASE_URL}assets/${file}`;

export const REPO = "https://github.com/moose-lab/awesome-sports-ai";

export type TickerKind = "score" | "tool" | "news" | "event";

export interface Tool {
  name: string;
  desc: string;
  sport: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  blurb: string;
  tools: Tool[];
}

export interface BuilderPath {
  title: string;
  sport: string;
  steps: string[];
}

export interface Prototype {
  id: string;
  title: string;
  sport: string;
  tag: string;
  cmd: string;
  image: string;
  desc: string;
  highlight: string;
}

export interface TickerItem {
  kind: TickerKind;
  text: string;
}

export interface Stat {
  value: string;
  label: string;
}

// 17 V1 sport tags from the README (V1 subset surfaced here)
export const sportTags: string[] = [
  "All",
  "Soccer",
  "Basketball",
  "American Football",
  "Tennis/Racquet",
  "Running/Track",
  "Motorsport",
  "Esports",
  "Volleyball",
  "Multi-sport",
];

// The curated awesome-list categories — the heart of the directory
export const categories: Category[] = [
  {
    id: "data",
    name: "Data, APIs & Feeds",
    blurb: "Schedules, scores, fixtures, rosters, play-by-play, and live feeds.",
    tools: [
      { name: "balldontlie", desc: "API access to basketball teams, players, games, and box-score data.", sport: "Basketball", url: "https://www.balldontlie.io/" },
      { name: "statsbombpy", desc: "Streams StatsBomb soccer data into Python for analysis and modeling.", sport: "Soccer", url: "https://github.com/statsbomb/statsbombpy" },
      { name: "Kloppy", desc: "Standardizes soccer tracking and event data into vendor-independent objects.", sport: "Soccer", url: "https://github.com/PySport/kloppy" },
      { name: "nba_api", desc: "Python client for NBA.com stats endpoints and basketball data workflows.", sport: "Basketball", url: "https://github.com/swar/nba_api" },
      { name: "FastF1", desc: "Loads Formula 1 timing, telemetry, session, schedule, and weather data.", sport: "Motorsport", url: "https://github.com/theOehrly/Fast-F1" },
      { name: "football.json", desc: "Public-domain football match data in JSON: schedules, leagues, results.", sport: "Soccer", url: "https://github.com/openfootball/football.json" },
      { name: "CollegeFootballData", desc: "College football API: games, drives, plays, rankings, and recruiting.", sport: "American Football", url: "https://collegefootballdata.com/" },
    ],
  },
  {
    id: "analytics",
    name: "Analytics & Visualization",
    blurb: "Scouting, performance analysis, dashboards, modeling, and sports intelligence.",
    tools: [
      { name: "mplsoccer", desc: "Draws soccer pitches and common football analytics plots with Matplotlib.", sport: "Soccer", url: "https://github.com/andrewRowlinson/mplsoccer" },
      { name: "socceraction", desc: "Converts event streams to SPADL and values actions with VAEP or xT.", sport: "Soccer", url: "https://github.com/ML-KULeuven/socceraction" },
      { name: "soccer_xg", desc: "Trains and analyzes expected-goals (xG) models for soccer.", sport: "Soccer", url: "https://github.com/ML-KULeuven/soccer_xg" },
      { name: "Roboflow Sports", desc: "Computer-vision models and workflows for sports detection and tracking.", sport: "Multi-sport", url: "https://github.com/roboflow/sports" },
      { name: "sportypy", desc: "Draws regulation playing surfaces for several sports in Python.", sport: "Multi-sport", url: "https://github.com/sportsdataverse/sportypy" },
      { name: "soccerplots", desc: "Creates radar and pizza charts for football player analysis.", sport: "Soccer", url: "https://github.com/slothfulwave/soccerplots" },
      { name: "football-match-intelligence", desc: "Pitch control, sprint efficiency, and tactical sequencing dashboards.", sport: "Soccer", url: "https://github.com/DataKnight1/football-match-intelligence" },
      { name: "TacticAI", desc: "Football tactics assistant for corner-kick recommendations.", sport: "Soccer", url: "https://www.nature.com/articles/s41467-024-45965-x" },
      { name: "Second Spectrum", desc: "Optical tracking and augmented broadcast tools for pro leagues.", sport: "Basketball", url: "https://www.geniussports.com/" },
    ],
  },
  {
    id: "training",
    name: "Training & Performance",
    blurb: "Coaching, athlete development, recovery, biomechanics, and wearable data.",
    tools: [
      { name: "MMPose", desc: "Open-source pose estimation toolbox for biomechanics and movement.", sport: "Multi-sport", url: "https://github.com/open-mmlab/mmpose" },
      { name: "OpenPose", desc: "Real-time multi-person body, hand, face, and foot keypoint detection.", sport: "Multi-sport", url: "https://github.com/CMU-Perceptual-Computing-Lab/openpose" },
      { name: "Coroebus", desc: "Tracks training load, fitness, fatigue, and readiness for athletes.", sport: "Multi-sport", url: "https://github.com/prakashsellathurai/Coroebus" },
      { name: "AthleteLoadMonitor", desc: "Monitors and predicts athlete load for team-sport coaches.", sport: "Multi-sport", url: "https://github.com/SaxionAMI/AthleteLoadMonitor" },
      { name: "Acute_Chronic_Workload_Ratio", desc: "Calculates acute-to-chronic workload ratios in Python.", sport: "Multi-sport", url: "https://github.com/ale-uy/Acute_Chronic_Workload_Ratio" },
      { name: "databallpy", desc: "Reads and synchronizes soccer event and tracking data.", sport: "Soccer", url: "https://github.com/Alek050/databallpy" },
    ],
  },
  {
    id: "operations",
    name: "Team & League Operations",
    blurb: "Scheduling, registration, tournaments, ticketing, and club administration.",
    tools: [
      { name: "bracket", desc: "Self-hosted tournament system for creating and managing brackets.", sport: "Multi-sport", url: "https://github.com/evroon/bracket" },
      { name: "Competition Factory", desc: "Manipulates tournament and league documents, draws, and structures.", sport: "Tennis/Racquet", url: "https://github.com/CourtHive/competition-factory" },
      { name: "Toornament API", desc: "APIs for tournament, match, calendar, ranking, and registration flows.", sport: "Esports", url: "https://developer.toornament.com/" },
      { name: "Challonge API", desc: "Create tournaments, update brackets, and report scores programmatically.", sport: "Multi-sport", url: "https://api.challonge.com/" },
    ],
  },
  {
    id: "media",
    name: "Media, Highlights & Content",
    blurb: "Video, clips, highlights, live production, graphics, and editorial workflows.",
    tools: [
      { name: "OpenAI Whisper", desc: "Transcribes commentary, interviews, and review audio for sports media.", sport: "Multi-sport", url: "https://github.com/openai/whisper" },
      { name: "soccer-video-analytics", desc: "Automatic soccer ball possession analysis from video.", sport: "Soccer", url: "https://github.com/tryolabs/soccer-video-analytics" },
      { name: "Video Tagging Events", desc: "Tags specific segments of a video for sports review and analysis.", sport: "Multi-sport", url: "https://github.com/napo/videotaggingevents" },
    ],
  },
  {
    id: "devtools",
    name: "Developer Tools",
    blurb: "Libraries, SDKs, frameworks, and infrastructure for sports technology.",
    tools: [
      { name: "OpenCV", desc: "Computer-vision infrastructure for tracking, detection, and video.", sport: "Multi-sport", url: "https://github.com/opencv/opencv" },
      { name: "ffmpeg-python", desc: "Python bindings for FFmpeg video processing and filtering.", sport: "Multi-sport", url: "https://github.com/kkroening/ffmpeg-python" },
      { name: "floodlight", desc: "Data structures and parsers for team-sport event and tracking data.", sport: "Multi-sport", url: "https://github.com/floodlight-sports/floodlight" },
      { name: "sportsdataverse-py", desc: "Loads and tidies data from several SportsDataverse ecosystems.", sport: "Multi-sport", url: "https://github.com/sportsdataverse/sportsdataverse-py" },
      { name: "sports-betting", desc: "Collects sports betting AI tools and prediction experiments.", sport: "Multi-sport", url: "https://github.com/georgedouzas/sports-betting" },
    ],
  },
  {
    id: "datasets",
    name: "Datasets & Research",
    blurb: "Open datasets, benchmarks, papers, and public reference material.",
    tools: [
      { name: "StatsBomb Open Data", desc: "Free soccer event data for public analysis and modeling.", sport: "Soccer", url: "https://github.com/statsbomb/open-data" },
      { name: "SoccerNet", desc: "Datasets and benchmarks for soccer video understanding and tracking.", sport: "Soccer", url: "https://www.soccer-net.org/data" },
      { name: "Google Research Football", desc: "Reinforcement-learning football environment for AI research.", sport: "Soccer", url: "https://github.com/google-research/football" },
      { name: "SportsMOT", desc: "Multi-object tracking dataset across basketball, football, volleyball.", sport: "Volleyball", url: "https://deeperaction.github.io/datasets/sportsmot.html" },
      { name: "Metrica Sports Sample Data", desc: "Sample soccer tracking and event data for analytics tutorials.", sport: "Soccer", url: "https://github.com/metrica-sports/sample-data" },
    ],
  },
];

// The Builder's Path — "the smaller pieces behind the tools pros use"
export const builderPaths: BuilderPath[] = [
  { title: "Build your own xG model", sport: "Soccer", steps: ["public-data-loader", "match-event-schema", "shot-map-renderer", "xg-baseline", "model-card-md"] },
  { title: "Build a coaching video tagger", sport: "Multi-sport", steps: ["clip-cutter", "event-tagger", "possession-timeline", "coach-notes-exporter", "highlight-captioner"] },
  { title: "Build a player scouting board", sport: "Soccer", steps: ["player-profile-schema", "public-data-loader", "player-similarity-radar", "searchable-clip-index", "scouting-report-template"] },
  { title: "Build an athlete load dashboard", sport: "Multi-sport", steps: ["wearable-csv-parser", "team-id-resolver", "acute-chronic-workload", "load-risk-flags", "training-load-dashboard"] },
  { title: "Build a match intelligence report", sport: "Soccer", steps: ["fixture-normalizer", "match-event-schema", "win-probability-lite", "stat-card-generator", "match-report-md"] },
];

// The 3 runnable prototypes
export const prototypes: Prototype[] = [
  { id: "llm-match-commentator", title: "LLM Match Commentator", sport: "Soccer", tag: "NLP · RAG", cmd: "python3 commentator.py", image: asset("commentator-card.webp"), desc: "RAG system ingesting live match event streams to generate localized, multi-language commentary.", highlight: "18' — GOAL! Balogun rises to meet the corner — USA leads 1-0!" },
  { id: "wnba-gravity-mapper", title: "WNBA Gravity Mapper", sport: "Basketball", tag: "Analytics · CV", cmd: "python3 gravity_mapper.py", image: asset("wnba-card.webp"), desc: "Calculates player “gravity” from public WNBA play-by-play and tracking data; outputs a heatmap.", highlight: "Caitlin Clark: 3.40 gravity score — highest on court" },
  { id: "pickleball-court-mapper", title: "Pickleball Court Mapper", sport: "Tennis/Racquet", tag: "Computer Vision", cmd: "python3 court_mapper.py", image: asset("pickleball-card.webp"), desc: "Maps pickleball court lines and tracks ball bounces for amateur match analysis.", highlight: "12 line segments detected — Kitchen zones identified" },
];

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

export const stats: Stat[] = [
  { value: "48", label: "Tools Curated" },
  { value: "8", label: "Categories" },
  { value: "5", label: "Builder Paths" },
  { value: "3", label: "Runnable Prototypes" },
];
