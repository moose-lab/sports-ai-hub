/**
 * useWorldCup — live FIFA World Cup snapshot from awesome-sports-ai.
 *
 * Polls the feed on an interval (faster while a match is live), pauses while the
 * tab is hidden, and resumes immediately on visibility/reconnect. Byte-level
 * change detection means an unchanged snapshot does NOT re-render consumers
 * (preserves MatchCenter's selection/scroll). After the first successful load,
 * transient refetch failures keep the last-good data instead of flipping to error.
 */
import { useEffect, useRef, useState } from "react";
import { fetchWorldCupSnapshot, hasLiveFixture, type WorldCup } from "@/lib/worldcup";

const BASE_INTERVAL_MS = 60_000;
const LIVE_INTERVAL_MS = 25_000;

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
    let ctrl: AbortController | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(tick, lastLive ? LIVE_INTERVAL_MS : BASE_INTERVAL_MS);
    };

    async function tick() {
      if (inFlight) return;
      if (typeof document !== "undefined" && document.hidden) return; // paused while hidden
      inFlight = true;
      ctrl = new AbortController();
      try {
        const { raw, data } = await fetchWorldCupSnapshot(ctrl.signal);
        if (cancelled) return;
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
        // Keep last-good data on transient refetch failures; only first load errors.
        setState((s) =>
          s.status === "ready"
            ? s
            : {
                status: "error",
                data: null,
                error: e instanceof Error ? e.message : String(e),
                lastUpdatedAt: null,
                isLive: false,
              },
        );
      } finally {
        inFlight = false;
        if (!cancelled) scheduleNext();
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
