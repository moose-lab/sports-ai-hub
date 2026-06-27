/**
 * Cloudflare Pages Function — GET /api/worldcup
 *
 * Serves the live World Cup snapshot with ESPN's ~6-second-fresh scores overlaid
 * onto the GitHub skeleton, bypassing BOTH sources of staleness the browser hit
 * before: the upstream 5-min cron and raw.githubusercontent's 5-min CDN TTL.
 *
 *   raw source-data.json (full schedule + metadata, slow data — 5-min cache OK)
 *        +  ESPN scoreboard (today ±2 days, authoritative live status/score)
 *        →  syncSourceData() — the IDENTICAL merge the upstream cron runs
 *        →  edge-cached ~15s so we hit ESPN/GitHub at most once per window.
 *
 * Fault tolerance: any ESPN hiccup falls back to the unmodified skeleton, so
 * this is never worse than the previous raw-direct behavior.
 */
import { buildDateWindow, isWithinTournamentWindow, syncSourceData } from "../../client/src/lib/espn";

const RAW_URL =
  "https://raw.githubusercontent.com/moose-lab/awesome-sports-ai/main/visualizations/source-data.json";
const ESPN_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

export async function onRequestGet(context: any): Promise<Response> {
  const cache = (caches as any).default;
  // Single normalized cache entry (query/hash stripped).
  const cacheKey = new Request(new URL("/api/worldcup", context.request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  // 1. Skeleton — full schedule + metadata. The 5-min raw cache is fine for slow data.
  const baseRes = await fetch(RAW_URL, { cf: { cacheTtl: 60, cacheEverything: true } } as any);
  if (!baseRes.ok) {
    return new Response(JSON.stringify({ error: "skeleton unavailable" }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
  const sourceData = await baseRes.json();

  // 2. Live overlay from ESPN — only during the tournament window.
  let data = sourceData;
  try {
    const now = new Date();
    if (isWithinTournamentWindow(now)) {
      const scoreboards = await Promise.all(
        buildDateWindow(now).map((d) =>
          fetch(`${ESPN_URL}?dates=${d}`).then((r) => (r.ok ? r.json() : { events: [] })),
        ),
      );
      data = syncSourceData(sourceData, scoreboards, { now }).data;
    }
  } catch {
    data = sourceData; // ESPN failed → serve the skeleton unchanged.
  }

  const resp = new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=10, s-maxage=15",
      "access-control-allow-origin": "*",
    },
  });
  context.waitUntil(cache.put(cacheKey, resp.clone()));
  return resp;
}
