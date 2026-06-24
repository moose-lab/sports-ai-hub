# Design: World Cup 26 exposure + Match Center route

**Date:** 2026-06-24
**Source:** `FIFA World Cup live zone design.zip` (`design_handoff_world_cup_match_center/`)

## Goal

Two outcomes, following the design handoff exactly:

1. **Increase World Cup 26 exposure** on the landing page via a compact, persistent
   amber treatment (not a full marketing band).
2. **Add a dedicated Match Center** at a secondary route (`/match-center`) — the World
   Cup match-detail hub.

The landing stays **directory-first**. Per the handoff, the only World-Cup-specific
elements on the landing are: an amber "Today's matches" bar in the sticky header, an
amber "World Cup 26" nav link, and a small amber hero pill — all linking to the Match
Center. The existing full-width `WorldCup()` marketing section is **removed**.

## Data model (important)

The World Cup feed is a **once-a-day sync snapshot**, not a live stream. Therefore:
**no "LIVE" badge anywhere in the World Cup UI**, and no second-by-second ticking — an
in-progress match shows its snapshot minute (e.g. `IN PLAY · 67'`). The permanent green
LIVE ticker (general SportsAIHub news) stays World-Cup-free.

## Routing & navigation

- Add client-side route `/match-center` in `App.tsx` (wouter).
- Set wouter `<Router base>` from `import.meta.env.BASE_URL` so links resolve on both
  Cloudflare Pages (root `/`) and the GitHub Pages build (base `/sports-ai-hub/`).
- Add `client/public/_redirects` with `/* /index.html 200` (Cloudflare Pages SPA
  fallback so a deep-link / hard refresh to `/match-center` does not 404). Vite copies
  `public/` to the build root.
- Cross-page links use wouter `<Link>`; in-page scroll (`#today`, `#directory`, …) keeps
  the existing smooth-scroll handler (≈110–150px sticky-header offset).

## File structure

```
client/src/
  pages/
    wc-data.ts            NEW  WC_FEED ported to typed TS + types
    MatchCenter.tsx       NEW  the /match-center page
    Home.tsx              EDIT header → TodayBar + amber nav link; hero → amber pill; remove WorldCup()
  components/worldcup/
    wc-primitives.tsx     NEW  Crest, StatusPill, MatchChip, TodayBar (shared / landing)
    wc-match.tsx          NEW  Scoreboard, MatchCard, WinProbBar, StatBars, Timeline, LineupPitch, Standings, TopScorers
  App.tsx                 EDIT Router base + /match-center route
client/index.html         EDIT add JetBrains Mono 700 weight to the font URL
client/public/_redirects  NEW  SPA fallback
```

The design's single `wc-live.jsx` splits into two files: lightweight primitives the
landing needs, and the heavier Match-Center-only components. All converted to TS +
`lucide-react` (replacing the `data-lucide` CDN runtime), consuming the existing
`index.css` tokens — no new hardcoded color tokens.

## Components (recreate from `wc-live.jsx`, pixel-faithful)

- **Crest({team,size})** — team-color square, auto-contrasting code text (luminance
  test → `#0D0F14` / `#F0F2F5`), inset white-14% ring, radius 9.
- **StatusPill({m})** — amber, NO "LIVE" word: in-play → `IN PLAY · {minute}'` (pulsing
  amber dot), ft → `FULL TIME`, upcoming → `KO {kickoff}`.
- **MatchChip({m})** — compact amber chip for the Today bar.
- **TodayBar({to | scrollTo})** — amber header strip: WORLD CUP label chip + marquee of
  MatchChips (duplicated for seamless `ticker-content` loop, right-edge fade) + CTA.
  On the landing the CTA navigates to `/match-center`; on the Match Center it scrolls to
  `#today`.
- **Scoreboard({m,events,big})**, **MatchCard({m,onClick,active})**,
  **WinProbBar({m,prob})**, **StatBars({stats})**, **Timeline({m,events})**,
  **LineupPitch({m,lineups})**, **Standings({group})**, **TopScorers({scorers})** — as
  specified in the handoff (amber accent, daily-snapshot framing).

## Match Center page behavior (full interactivity)

Local UI state only (no store, no sockets):
- `selId` — selected match id (default featured `bra-arg`).
- `filter` — All / In play / Upcoming / Finished (fixtures grid).
- `tab` — Lineups / Key Stats / Timeline.

Behavior: clicking a `MatchCard` sets the featured scoreboard + side panel and
smooth-scrolls to top; filter pills filter the grid; featured match shows
Win-projection + full Lineups/Stats/Timeline; non-featured matches show a Match-info
key/value list + the "full breakdown is for the match of the day" prompt. Amber accent
throughout; two-column hero/standings grids collapse ≤900px.

## Landing changes

- **Header:** insert `TodayBar` (amber strip) directly below the green LIVE ticker.
  Add an amber "World Cup 26" nav link (trophy icon, `--amber-alert`) → `/match-center`.
- **Hero:** the existing `PhaseBadge "FIFA World Cup 2026"` becomes an amber pill link
  `🏆 World Cup 2026 → Match Center` → `/match-center`.
- **Remove** the full `WorldCup()` section and its `#worldcup` nav target.

## Verification

- Dev server via preview tools: landing shows amber TodayBar carousel + nav link + hero
  pill; `/match-center` loads; match selection / filters / tabs all work; no console
  errors; screenshots of both pages.
- `pnpm run check` (CI type-check gate) passes.

## Out of scope

- Real data fetching (feed stays static/embedded per handoff).
- Any change to the green LIVE ticker content, directory, builder path, prototypes,
  contribute, or footer beyond removing the WorldCup section + nav target.
