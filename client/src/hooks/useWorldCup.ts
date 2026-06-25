/**
 * useWorldCup — live FIFA World Cup snapshot from awesome-sports-ai.
 *
 * Polls the feed on an interval (faster while a match is live), pauses while the
 * tab is hidden, and resumes immediately on visibility/reconnect. Byte-level
 * change detection means an unchanged snapshot does NOT re-render consumers
 * (preserves MatchCenter's selection/scroll). After the first successful load,
 * transient refetch failures keep the last-good data instead of flipping to error.
 *
 * Fault tolerance: a failed fetch/parse — or a 200 with an empty/unexpected
 * payload (zero fixtures, see isUsableWorldCup) — never gives up. It retries
 * with exponential backoff (1s → 2s → … → 30s cap) until it succeeds, then resumes
 * the normal cadence. The first load stays in `loading` through the first few
 * fast retries and only surfaces `error` after FAILS_BEFORE_ERROR consecutive
 * failures — and even then it keeps retrying in the background and self-heals.
 * `online`/visibility regain triggers an immediate retry.
 */
import { useEffect, useRef, useState } from "react";
import { fetchWorldCupSnapshot, hasLiveFixture, type WorldCup } from "@/lib/worldcup";

// raw.githubusercontent.com sits behind a CDN with a ~5min edge TTL that
// `cache: "no-store"` cannot bypass, so the true data-freshness floor is ~5min
// (matching the upstream cron). These intervals bound how fast we *detect* a
// newly edge-cached snapshot, not how fresh the underlying data is.
const BASE_INTERVAL_MS = 60_000;
const LIVE_INTERVAL_MS = 25_000;
const RETRY_BASE_MS = 1_000; // first retry delay; doubles each consecutive failure
const RETRY_MAX_MS = 30_000; // backoff cap
const FAILS_BEFORE_ERROR = 3; // keep first load in `loading` through this many fast retries

/** Exponential backoff for the Nth consecutive failure (1→1s, 2→2s, …, capped). */
export function backoffDelay(failures: number, baseMs = RETRY_BASE_MS, maxMs = RETRY_MAX_MS): number {
  if (failures <= 0) return 0;
  return Math.min(baseMs * 2 ** (failures - 1), maxMs);
}

export interface WorldCupState {
  status: "loading" | "ready" | "error";
  data: WorldCup | null;
  error: string | null;
  /** Epoch ms when the data last *changed* (null until first successful load). */
  lastUpdatedAt: number | null;
  /** Any fixture is currently in play. */
  isLive: boolean;
}

export function useWorldCup(): WorldCupState {
  const [state, setState] = useState<WorldCupState>({
    status: "loading",
    data: null,
    error: null,
    lastUpdatedAt: null,
    isLive: false,
  });

  // Raw text of the last snapshot we applied (change detection across ticks).
  const rawRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let lastLive = false;
    let failures = 0; // consecutive failures; drives backoff and first-load error gating
    let ctrl: AbortController | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = (delayMs: number) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(tick, delayMs);
    };

    async function tick() {
      if (inFlight) return;
      if (typeof document !== "undefined" && document.hidden) return; // paused while hidden
      inFlight = true;
      ctrl = new AbortController();
      try {
        const { raw, data } = await fetchWorldCupSnapshot(ctrl.signal);
        if (cancelled) return;
        failures = 0;
        lastLive = hasLiveFixture(data);
        if (raw === rawRef.current) {
          setState((s) => (s.isLive === lastLive ? s : { ...s, isLive: lastLive }));
        } else {
          rawRef.current = raw;
          setState({ status: "ready", data, error: null, lastUpdatedAt: Date.now(), isLive: lastLive });
        }
      } catch (e) {
        if (cancelled) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        failures += 1;
        setState((s) => {
          if (s.status === "ready") return s; // keep last-good data; retry silently
          // First load still pending: stay in `loading` through the fast retries,
          // only surface `error` after FAILS_BEFORE_ERROR consecutive failures.
          if (failures < FAILS_BEFORE_ERROR) return s.status === "loading" ? s : { ...s, status: "loading" };
          return {
            status: "error",
            data: null,
            error: e instanceof Error ? e.message : String(e),
            lastUpdatedAt: null,
            isLive: false,
          };
        });
      } finally {
        inFlight = false;
        if (!cancelled) {
          const delay =
            failures === 0 ? (lastLive ? LIVE_INTERVAL_MS : BASE_INTERVAL_MS) : backoffDelay(failures);
          scheduleNext(delay);
        }
      }
    }

    const onResume = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      tick();
    };

    tick();
    document.addEventListener("visibilitychange", onResume);
    window.addEventListener("online", onResume);

    return () => {
      cancelled = true;
      ctrl?.abort();
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onResume);
      window.removeEventListener("online", onResume);
    };
  }, []);

  return state;
}
