/**
 * Sports AI Hub — Contribute.
 * Turns CONTRIBUTING.md's already-low bar into an in-product flow: the
 * Simple Path checklist, the 8 zero-content sport tags as a claimable task
 * list, and a live (read-only) feed of open good-first-issues.
 */
import { ArrowUpRight, CircleCheckBig, CircleDot, ExternalLink, GitPullRequestArrow, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHead, Terminal } from "@/components/brand";
import { useGoodFirstIssues } from "@/hooks/useGoodFirstIssues";
import { emptySportTags } from "@/lib/catalog";
import { REPO } from "@/pages/home-data";
import { SIMPLE_PATH } from "@/pages/home/contribute-data";
import { OutlineLink, PrimaryLink } from "@/pages/home/shared";

const AWESOME = REPO;

const issueUrl = (title: string) => `${AWESOME}/issues/new?title=${encodeURIComponent(title)}`;

function GoodFirstIssuesList() {
  const { status, issues, error } = useGoodFirstIssues();

  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
        <RefreshCw size={14} className="animate-spin" /> Loading open issues…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ color: "var(--fg-3)", fontSize: 13.5, lineHeight: 1.6 }}>
        Couldn’t load issues right now{error ? ` (${error})` : ""}.{" "}
        <a href={`${AWESOME}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: "var(--signal-green)" }}>
          Browse them on GitHub
        </a>
        .
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div style={{ color: "var(--fg-3)", fontSize: 13.5 }}>
        No open good-first-issues right now — check back soon, or{" "}
        <a href={`${AWESOME}/issues`} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: "var(--signal-green)" }}>
          browse everything open
        </a>
        .
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {issues.map((issue) => (
        <a key={issue.id} href={issue.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <Card className="gap-0 p-[14px] flex-row items-center transition-colors hover:border-[var(--green-a40)]" style={{ gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--fg-1)" }}>
                {issue.title}
              </div>
              {issue.labels.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>
                  {issue.labels.slice(0, 3).map((label) => (
                    <Badge key={label} variant="slate">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <ArrowUpRight size={14} style={{ color: "var(--fg-3)", flex: "none" }} />
          </Card>
        </a>
      ))}
    </div>
  );
}

export function Contribute() {
  return (
    <section id="contribute" className="sa-anchor" style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <div className="grid grid-cols-1 min-[920px]:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHead
              eyebrow="Open Source · CC0"
              icon={GitPullRequestArrow}
              title="Add a tool. Claim an issue."
              sub="Pick a sport, find a capability the pros gatekeep, and ship the open-source version. The community will use it."
            />
            <div style={{ marginTop: 28 }}>
              <Terminal
                lines={[
                  { comment: "How to contribute" },
                  { cmd: true, text: "gh issue list --repo moose-lab/awesome-sports-ai" },
                  { cmd: true, text: 'gh issue create --title "feat: [sport] [tool-name]"' },
                  { cmd: true, text: "gh pr create --fill" },
                ]}
              />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <PrimaryLink href={`${AWESOME}/issues`}>
                <CircleDot size={15} /> Browse open issues
              </PrimaryLink>
              <OutlineLink href={`${AWESOME}/blob/main/CONTRIBUTING.md`}>Read the guide</OutlineLink>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-4)", marginBottom: 12 }}>
              The Simple Path — that's the whole PR
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SIMPLE_PATH.map((item) => (
                <Card key={item.title} className="gap-0 p-[16px] flex-row items-start" style={{ gap: 14 }}>
                  <CircleCheckBig size={18} style={{ color: "var(--signal-green)", flex: "none", marginTop: 2 }} />
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--fg-1)", marginBottom: 2 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 13.5, color: "var(--fg-2)", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[920px]:grid-cols-2 gap-12 items-start" style={{ marginTop: 56 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-4)", marginBottom: 12 }}>
              Claim a blank sport — 0 tools tagged today
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {emptySportTags.map((s) => (
                <a
                  key={s}
                  href={issueUrl(`feat: [${s}] anchor tool`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12.5,
                    color: "var(--fg-3)",
                    border: "1px dashed var(--border-strong)",
                    borderRadius: "var(--radius-pill)",
                    padding: "6px 13px",
                    textDecoration: "none",
                  }}
                >
                  {s} · claim it <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-4)", marginBottom: 12 }}>
              Good first issues
            </div>
            <GoodFirstIssuesList />
          </div>
        </div>
      </div>
    </section>
  );
}
