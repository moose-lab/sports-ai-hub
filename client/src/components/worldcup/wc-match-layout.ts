export const MATCH_SCOREBOARD_MOBILE_MAX_WIDTH_PX = 640;

export type MatchScoreboardLayout = "mobile" | "desktop";

export function scoreboardLayoutForViewport(widthPx: number): MatchScoreboardLayout {
  return widthPx <= MATCH_SCOREBOARD_MOBILE_MAX_WIDTH_PX ? "mobile" : "desktop";
}

export const SCOREBOARD_CLASS = {
  body: "wc-scoreboard-body",
  bodyBig: "wc-scoreboard-body--big",
  team: "wc-scoreboard-team",
  home: "wc-scoreboard-team--home",
  away: "wc-scoreboard-team--away",
  teamText: "wc-scoreboard-team-text",
  name: "wc-scoreboard-name",
  sideLabel: "wc-scoreboard-side-label",
  score: "wc-scoreboard-score",
} as const;
