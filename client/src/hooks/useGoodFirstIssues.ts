/**
 * useGoodFirstIssues — live, read-only list of open `good first issue`s on
 * awesome-sports-ai, for the Contribute section. Public GitHub REST API,
 * unauthenticated (fine at this traffic level; no write access needed).
 */
import { useEffect, useRef, useState } from "react";

const ISSUES_URL =
  "https://api.github.com/repos/moose-lab/awesome-sports-ai/issues?labels=good%20first%20issue&state=open&per_page=6";

export interface GoodFirstIssue {
  id: number;
  title: string;
  url: string;
  labels: string[];
}

export interface GoodFirstIssuesState {
  status: "loading" | "ready" | "error";
  issues: GoodFirstIssue[];
  error: string | null;
}

interface RawIssue {
  id: number;
  title: string;
  html_url: string;
  labels: Array<{ name: string } | string>;
  pull_request?: unknown;
}

const isUsable = (data: unknown): data is RawIssue[] => Array.isArray(data);

export function useGoodFirstIssues(): GoodFirstIssuesState {
  const [state, setState] = useState<GoodFirstIssuesState>({
    status: "loading",
    issues: [],
    error: null,
  });
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    (async () => {
      try {
        const res = await fetch(ISSUES_URL, {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
        const data: unknown = await res.json();
        if (!isUsable(data)) throw new Error("Unexpected response shape");
        if (cancelledRef.current) return;

        const issues: GoodFirstIssue[] = data
          // The issues API also returns pull requests; exclude those.
          .filter((raw) => !raw.pull_request)
          .map((raw) => ({
            id: raw.id,
            title: raw.title,
            url: raw.html_url,
            labels: raw.labels.map((label) => (typeof label === "string" ? label : label.name)),
          }));

        setState({ status: "ready", issues, error: null });
      } catch (err) {
        if (cancelledRef.current) return;
        setState({
          status: "error",
          issues: [],
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, []);

  return state;
}
