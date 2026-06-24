/**
 * useWorldCup — fetch the live FIFA World Cup snapshot from awesome-sports-ai.
 * Returns a small state machine so callers can render loading / error / ready.
 */
import { useEffect, useState } from "react";
import { fetchWorldCup, type WorldCup } from "@/lib/worldcup";

export interface WorldCupState {
  status: "loading" | "ready" | "error";
  data: WorldCup | null;
  error: string | null;
}

export function useWorldCup(): WorldCupState {
  const [state, setState] = useState<WorldCupState>({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    fetchWorldCup(ctrl.signal)
      .then((data) => setState({ status: "ready", data, error: null }))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setState({ status: "error", data: null, error: e instanceof Error ? e.message : String(e) });
      });
    return () => ctrl.abort();
  }, []);

  return state;
}
