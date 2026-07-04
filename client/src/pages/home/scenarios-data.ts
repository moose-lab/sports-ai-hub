import type { LucideIcon } from "lucide-react";
import { Dumbbell, Trophy } from "lucide-react";

export interface ScenarioPick {
  categoryId: string;
  toolIds: string[];
}

export interface Scenario {
  id: string;
  title: string;
  sport: string;
  icon: LucideIcon;
  blurb: string;
  picks: ScenarioPick[];
  ctaLabel: string;
  /** In-app route (wouter Link) — mutually exclusive with ctaAnchor/ctaHref. */
  ctaRoute?: string;
  /** In-page anchor to scroll to — mutually exclusive with ctaRoute/ctaHref. */
  ctaAnchor?: string;
  /** External URL — mutually exclusive with ctaRoute/ctaAnchor. */
  ctaHref?: string;
  /** Slug of a catalog scene — when set, nav surfaces link to the /sports/<slug> zone. */
  sceneSlug?: string;
}

export const scenarios: Scenario[] = [
  {
    id: "soccer-world-cup",
    title: "FIFA World Cup 2026",
    sport: "Soccer",
    icon: Trophy,
    blurb:
      "Everything for building around the 2026 tournament: real event data, plotting libraries, and the tools that power this site's own Match Center.",
    picks: [
      { categoryId: "datasets-apis-feeds", toolIds: ["statsbomb-open-data", "football-json"] },
      { categoryId: "developer-libraries-sdks", toolIds: ["statsbombpy", "mplsoccer", "socceraction"] },
      { categoryId: "event-toolkits", toolIds: ["world-cup-2026-toolkit", "world-cup-2026-zone"] },
    ],
    ctaLabel: "Open Match Center",
    ctaRoute: "/match-center",
  },
  {
    id: "hyrox",
    title: "HYROX",
    sport: "Running/Track",
    icon: Dumbbell,
    blurb:
      "Fitness-race tooling: find a certified gym near you, then track training load the way the acute:chronic workload models do.",
    picks: [
      { categoryId: "open-source-projects", toolIds: ["hyrox-gym-finder", "athlete-load-monitor"] },
      { categoryId: "ai-models-components", toolIds: ["acute-chronic-workload-ratio"] },
    ],
    ctaLabel: "Open the HYROX Zone",
    ctaRoute: "/hyrox",
    sceneSlug: "hyrox",
  },
];
