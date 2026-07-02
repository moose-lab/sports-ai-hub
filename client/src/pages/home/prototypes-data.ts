/**
 * The Prototype Factory — runnable demos from awesome-sports-ai's
 * `/prototypes` (plus HYROX Gym Finder, which lives in its own repo).
 * `capability`/`io` are copied verbatim from the README's "Prototype
 * Factory" table (Capability Replaced / Input -> Output columns) so this
 * never drifts into invented marketing copy.
 */
import { asset } from "@/pages/home-data";

export interface Prototype {
  /** Matches a catalog.json tool id, so the same entry resolves via toolById/recipesForTool. */
  id: string;
  title: string;
  sport: string;
  tag: string;
  capability: string;
  io: string;
  cmd: string;
  /** null = no preview asset yet (rendered as a placeholder). */
  image: string | null;
  desc: string;
  highlight: string;
  sourceUrl: string;
  externalRepo?: true;
}

export const prototypes: Prototype[] = [
  {
    id: "llm-match-commentator",
    title: "LLM Match Commentator",
    sport: "Soccer",
    tag: "NLP · RAG",
    capability: "Automated recap/commentary systems (e.g., Stats Perform)",
    io: "Event stream -> Bilingual markdown commentary",
    cmd: "python3 commentator.py",
    image: asset("commentator-card.webp"),
    desc: "RAG system ingesting live match event streams to generate localized, multi-language commentary.",
    highlight: "18' — GOAL! Balogun rises to meet the corner — USA leads 1-0!",
    sourceUrl: "https://github.com/moose-lab/awesome-sports-ai/tree/main/prototypes/llm-match-commentator",
  },
  {
    id: "wnba-gravity-mapper",
    title: "WNBA Gravity Mapper",
    sport: "Basketball",
    tag: "Analytics · CV",
    capability: "Proprietary spacing and gravity metrics",
    io: "Player positions -> Tactical attention heatmap",
    cmd: "python3 gravity_mapper.py",
    image: asset("wnba-card.webp"),
    desc: "Calculates player “gravity” from public WNBA play-by-play and tracking data; outputs a heatmap.",
    highlight: "Caitlin Clark: 3.40 gravity score — highest on court",
    sourceUrl: "https://github.com/moose-lab/awesome-sports-ai/tree/main/prototypes/wnba-gravity-mapper",
  },
  {
    id: "pickleball-court-mapper",
    title: "Pickleball Court Mapper",
    sport: "Tennis/Racquet",
    tag: "Computer Vision",
    capability: "Proprietary court-calibration systems",
    io: "Court image -> Mapped court geometry diagram",
    cmd: "python3 court_mapper.py",
    image: asset("pickleball-card.webp"),
    desc: "Maps pickleball court lines and tracks ball bounces for amateur match analysis.",
    highlight: "12 line segments detected — Kitchen zones identified",
    sourceUrl: "https://github.com/moose-lab/awesome-sports-ai/tree/main/prototypes/pickleball-court-mapper",
  },
  {
    id: "hyrox-gym-finder",
    title: "HYROX Gym Finder",
    sport: "Running/Track",
    tag: "Data · Ops",
    capability: "Official venue discovery and local gym filtering",
    io: "Location or JSON export -> Ranked certified gym list and map",
    cmd: "npm start",
    image: null,
    desc: "Finds nearby HYROX-certified gyms from coordinates, region keywords, browser location, or an imported JSON export.",
    highlight: "14 certified gyms found within 25km — ranked by distance",
    sourceUrl: "https://github.com/moose-lab/hyrox-gym-finder",
    externalRepo: true,
  },
];
