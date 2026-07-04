/**
 * Full-bleed "featured season" bands — sitting between Quick Start and the
 * Popular Scenarios spotlight. World Cup's copy (48 teams / 104 matches /
 * 3 host nations) is copied from the design handoff verbatim. HYROX's
 * featured band graduated into its own component when the zone page
 * shipped — see `hyrox-zone-band.tsx`, rendered right after these.
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
  /** Optional in-app secondary CTA (e.g. the scene's /sports/<slug> zone). */
  secondaryCtaLabel?: string;
  secondaryCtaRoute?: string;
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
];
