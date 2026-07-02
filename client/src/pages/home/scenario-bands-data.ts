/**
 * Full-bleed "featured season" bands — one per Popular Scenario, sitting
 * between Quick Start and the Popular Scenarios spotlight. World Cup's copy
 * (48 teams / 104 matches / 3 host nations) is copied from the design
 * handoff verbatim; HYROX's facts (8 stations, 8km running, one global
 * format) are the real, publicly documented HYROX race parameters, sourced
 * the same way — not invented to match the pattern.
 */
import { asset } from "@/pages/home-data";

export interface ScenarioBand {
  id: string;
  eyebrow: string;
  titleLines: [string, string];
  description: string;
  stats: { value: string; label: string }[];
  toolkitLabel: string;
  toolIds: string[];
  ctaLabel: string;
  ctaHref: string;
  backgroundImage?: string;
}

export const scenarioBands: ScenarioBand[] = [
  {
    id: "world-cup-band",
    eyebrow: "Featured · Summer 2026",
    titleLines: ["Build for the", "FIFA World Cup 2026."],
    description:
      "48 teams. 104 matches. Three host nations. The richest open soccer-data moment in history — and the tools to model it are all here. Start with event data, xG, and tactical analysis.",
    stats: [
      { value: "48", label: "Teams" },
      { value: "104", label: "Matches" },
      { value: "3", label: "Host Nations" },
    ],
    toolkitLabel: "Soccer toolkit to start with",
    toolIds: ["statsbombpy", "mplsoccer", "socceraction", "soccer-xg", "soccernet"],
    ctaLabel: "Run the live commentator",
    ctaHref: "https://github.com/moose-lab/awesome-sports-ai/tree/main/prototypes/llm-match-commentator",
    backgroundImage: asset("hero-bg.webp"),
  },
  {
    id: "hyrox-band",
    eyebrow: "Featured · Functional Fitness",
    titleLines: ["Build for", "HYROX race day."],
    description:
      "8 stations. 8 kilometers of running. One global format — the same course from your local club to the World Championship. Start with gym discovery, training load, and movement analysis.",
    stats: [
      { value: "8", label: "Stations" },
      { value: "8km", label: "Running" },
      { value: "1", label: "Global Format" },
    ],
    toolkitLabel: "HYROX toolkit to start with",
    toolIds: ["hyrox-gym-finder", "athlete-load-monitor", "acute-chronic-workload-ratio", "coroebus", "openpose"],
    ctaLabel: "Try HYROX Gym Finder",
    ctaHref: "https://moose-lab.github.io/hyrox-gym-finder/",
  },
];
