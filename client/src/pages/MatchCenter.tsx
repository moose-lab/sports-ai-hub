/**
 * Sports AI Hub — Match Center (the 2026 FIFA World Cup hub).
 * Calls the live awesome-sports-ai feed (via useWorldCup) and renders only
 * what the feed actually provides: the selected fixture's scoreboard + info,
 * the full fixtures grid with status filters, group standings computed from
 * results, tournament stats and milestones. Amber accent throughout.
 */

import * as React from "react";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Flag,
  Github,
  RefreshCw,
  Star,
  Table2,
  Trophy,
} from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { asset, REPO } from "@/pages/home-data";
import { useWorldCup } from "@/hooks/useWorldCup";
import type { WcFixture, WcStatus, WorldCup } from "@/lib/worldcup";
import { TodayBar } from "@/components/worldcup/wc-primitives";
import { MatchCard, Milestones, Scoreboard, Standings } from "@/components/worldcup/wc-match";

const LOGO = asset("logo-icon.webp");
const HERO_BG = asset("hero-bg.webp");

const eyebrow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--amber-alert)",
};

// ── Header ───────────────────────────────────────────────────────────────────
function Header({ todayMatches }: { todayMatches: WcFixture[] }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ background: "rgba(13,15,20,0.92)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid var(--border)" }}>
        <div className="sa-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src={LOGO} alt="Sports AI Hub" style={{ width: 28, height: 28 }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--fg-1)", letterSpacing: "-0.01em" }}>
              Sports<span style={{ color: "var(--signal-green)" }}>AI</span>Hub
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--amber-alert)", border: "1px solid var(--amber-a25)", background: "var(--amber-a10)", padding: "2px 8px", borderRadius: 4, marginLeft: 4 }}>
              World Cup 26
            </span>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Link href="/" className="nav-link" style={{ fontSize: 14, color: "var(--fg-2)", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={14} /> Home
            </Link>
            <Button asChild variant="default" size="sm" className="hover:bg-[var(--signal-green-dim)]">
              <a href={REPO} target="_blank" rel="noopener noreferrer">
                <Star size={15} /> Star
              </a>
            </Button>
          </nav>
        </div>
      </div>
      <TodayBar variant="center" matches={todayMatches} />
    </header>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────--
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 36, paddingBottom: 44, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src={LOGO} alt="" style={{ width: 24, height: 24 }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--fg-1)" }}>
            Sports<span style={{ color: "var(--signal-green)" }}>AI</span>Hub
          </span>
        </Link>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-4)" }}>
          World Cup data synced from awesome-sports-ai · CC0
        </span>
      </div>
    </footer>
  );
}

// ── States ─────────────────────────────────────────────────────────────────--
function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="sa-container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 460 }}>{children}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <Centered>
      <RefreshCw size={22} className="animate-spin" style={{ color: "var(--amber-alert)", margin: "0 auto" }} />
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-3)", marginTop: 14, letterSpacing: "0.06em" }}>
        Syncing World Cup data from awesome-sports-ai…
      </div>
    </Centered>
  );
}

function ErrorState({ message }: { message: string | null }) {
  return (
    <Centered>
      <Flag size={22} style={{ color: "var(--amber-alert)", margin: "0 auto" }} />
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--fg-1)", margin: "12px 0 6px" }}>
        Couldn’t load the World Cup feed
      </div>
      <p style={{ fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>
        The daily snapshot from awesome-sports-ai didn’t respond. {message ? `(${message})` : ""} Try reloading in a moment.
      </p>
      <div style={{ marginTop: 16 }}>
        <Button variant="default" size="sm" className="hover:bg-[var(--signal-green-dim)]" onClick={() => window.location.reload()}>
          <RefreshCw size={14} /> Reload
        </Button>
      </div>
    </Centered>
  );
}

// ── Status filters ─────────────────────────────────────────────────────────--
const FILTER_DEFS: { label: string; status: WcStatus | null }[] = [
  { label: "All", status: null },
  { label: "Scheduled", status: "scheduled" },
  { label: "Final", status: "final" },
  { label: "Live", status: "live" },
];

// ── Ready content ────────────────────────────────────────────────────────────
function Content({ data }: { data: WorldCup }) {
  const fixtures = data.fixtures;
  const defaultFixture = data.today[0] ?? fixtures[0];
  const [selId, setSelId] = useState(defaultFixture?.id);
  const [filter, setFilter] = useState("All");

  const selected = fixtures.find((m) => m.id === selId) ?? defaultFixture;

  const filters = useMemo(
    () => FILTER_DEFS.filter((f) => f.status !== "live" || fixtures.some((m) => m.status === "live")),
    [fixtures],
  );
  const activeStatus = filters.find((f) => f.label === filter)?.status ?? null;
  const shown = fixtures.filter((m) => !activeStatus || m.status === activeStatus);

  const selectMatch = (id: string) => {
    setSelId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusLabel =
    selected.status === "final" ? "Full time" : selected.status === "live" ? "In play" : "Scheduled";

  return (
    <>
      {/* Hero detail */}
      <section style={{ position: "relative", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src={HERO_BG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, var(--canvas) 0%, rgba(13,15,20,0.8) 45%, var(--canvas) 100%)" }} />
        </div>
        <div className="sa-container" style={{ position: "relative", zIndex: 1, paddingTop: 36, paddingBottom: 40 }}>
          <div style={{ ...eyebrow, marginBottom: 14 }}>
            <Trophy size={15} /> {data.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38, letterSpacing: "-0.02em", margin: 0, color: "var(--fg-1)" }}>
              Match Center
            </h1>
            {data.subtitle && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg-3)" }}>{data.subtitle}</span>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-4)", padding: "3px 9px", border: "1px solid var(--border)", borderRadius: "var(--radius-pill)" }}>
              <RefreshCw size={12} style={{ color: "var(--amber-alert)" }} /> {data.updated || "Synced from awesome-sports-ai"}
            </span>
          </div>

          <div className="grid grid-cols-1 min-[900px]:grid-cols-[1.35fr_1fr]" style={{ gap: 22, alignItems: "stretch" }}>
            <Scoreboard m={selected} big />
            <Card style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ ...eyebrow, fontSize: 12 }}>
                <Activity size={14} /> Match info
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(
                  [
                    ["Group", selected.group],
                    ["Venue", selected.venue],
                    ["Date", selected.date],
                    [selected.status === "scheduled" ? "Kickoff" : "Status", selected.status === "scheduled" ? selected.kickoff ?? "TBD" : statusLabel],
                    ["Note", selected.insight || selected.tag || "—"],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.06em", flex: "none" }}>{k}</span>
                    <span style={{ fontSize: 13.5, color: "var(--fg-1)", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
                {data.links.slice(0, 1).map((l) => (
                  <Button key={l.url} asChild variant="outline" size="sm" className="border-[var(--border)] bg-transparent text-[var(--fg-2)] hover:text-[var(--signal-green)] hover:border-[var(--green-a40)] dark:bg-transparent dark:border-[var(--border)]">
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={14} /> {l.label}
                    </a>
                  </Button>
                ))}
                <Button asChild variant="ghost" size="sm" className="text-[var(--fg-2)] hover:text-[var(--signal-green)]">
                  <a href={`${REPO}/blob/main/visualizations/source-data.json`} target="_blank" rel="noopener noreferrer">
                    <Github size={14} /> Open data
                  </a>
                </Button>
              </div>
            </Card>
          </div>

          {/* Tournament stats from the feed */}
          <div className="grid grid-cols-2 min-[720px]:grid-cols-4 gap-3" style={{ marginTop: 22 }}>
            {data.stats.map((s) => (
              <div key={s.label} style={{ background: "var(--canvas-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "16px 18px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, lineHeight: 1, color: "var(--fg-1)" }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fixtures */}
      <section id="today" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="sa-container" style={{ paddingTop: 48, paddingBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <div>
              <div style={{ ...eyebrow, marginBottom: 12 }}>
                <CalendarDays size={15} /> {data.summary.window || data.todayLabel}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, letterSpacing: "-0.02em", margin: 0, color: "var(--fg-1)" }}>Fixtures</h2>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {filters.map(({ label, status }) => {
                const active = filter === label;
                const n = status ? fixtures.filter((m) => m.status === status).length : fixtures.length;
                return (
                  <button
                    key={label}
                    onClick={() => setFilter(label)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12.5,
                      padding: "7px 14px",
                      borderRadius: "var(--radius-pill)",
                      cursor: "pointer",
                      background: active ? "var(--amber-alert)" : "transparent",
                      color: active ? "#1a1206" : "var(--fg-2)",
                      border: active ? "1px solid var(--amber-alert)" : "1px solid var(--border)",
                      fontWeight: active ? 600 : 500,
                      transition: "all var(--dur-base) ease",
                    }}
                  >
                    {label} <span style={{ opacity: 0.7 }}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {shown.map((m) => (
              <MatchCard key={m.id} m={m} active={m.id === selId} onClick={() => selectMatch(m.id)} />
            ))}
          </div>
          {shown.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
              No {filter.toLowerCase()} matches right now.
            </div>
          )}
        </div>
      </section>

      {/* Standings + Milestones */}
      <section style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
        <div className="sa-container" style={{ paddingTop: 56, paddingBottom: 64 }}>
          <div className="grid grid-cols-1 min-[900px]:grid-cols-[1.55fr_1fr]" style={{ gap: 28, alignItems: "start" }}>
            <div>
              <div style={{ ...eyebrow, marginBottom: 14 }}>
                <Table2 size={15} /> Group Stage · computed from results
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", margin: "0 0 22px", color: "var(--fg-1)" }}>Standings</h2>
              {data.standings.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
                  {data.standings.map((g) => (
                    <Standings key={g.group} group={g} />
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-3)" }}>No completed matches yet.</div>
              )}
            </div>
            <div>
              <div style={{ ...eyebrow, marginBottom: 14 }}>
                <Flag size={15} /> Tournament
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", margin: "0 0 22px", color: "var(--fg-1)" }}>Milestones</h2>
              <Milestones items={data.milestones} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MatchCenter() {
  const wc = useWorldCup();
  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh" }}>
      <Header todayMatches={wc.data?.today ?? []} />
      {wc.status === "loading" && <LoadingState />}
      {wc.status === "error" && <ErrorState message={wc.error} />}
      {wc.status === "ready" && wc.data && <Content data={wc.data} />}
      <Footer />
    </div>
  );
}
