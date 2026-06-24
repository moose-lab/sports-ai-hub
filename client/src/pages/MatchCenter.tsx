/**
 * Sports AI Hub — Match Center.
 * The dedicated 2026 FIFA World Cup hub (amber accent vs the landing's green).
 * Daily-synced snapshot: featured scoreboard + Lineups / Key Stats / Timeline,
 * today's fixtures grid, group standings, and the Golden Boot race.
 *
 * Local UI state only — no store, no sockets:
 *   selId  selected match (default featured `bra-arg`)
 *   filter All / In play / Upcoming / Finished
 *   tab    Lineups / Key Stats / Timeline
 */

import * as React from "react";
import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Github,
  List,
  Play,
  RefreshCw,
  Star,
  Table2,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { asset, REPO } from "@/pages/home-data";
import { featuredMatch, wcFeed, type Match, type MatchStatus } from "@/pages/wc-data";
import { TodayBar } from "@/components/worldcup/wc-primitives";
import {
  LineupPitch,
  MatchCard,
  Scoreboard,
  StatBars,
  Standings,
  Timeline,
  TopScorers,
  WinProbBar,
} from "@/components/worldcup/wc-match";

const LOGO = asset("logo-icon.webp");
const HERO_BG = asset("hero-bg.webp");
const COMMENTATOR = `${REPO}/tree/main/prototypes/llm-match-commentator`;

// ── Header — amber World Cup identity, no LIVE tag ───────────────────────────
function Header() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div
        style={{
          background: "rgba(13,15,20,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="sa-container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src={LOGO} alt="Sports AI Hub" style={{ width: 28, height: 28 }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--fg-1)", letterSpacing: "-0.01em" }}>
              Sports<span style={{ color: "var(--signal-green)" }}>AI</span>Hub
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--amber-alert)",
                border: "1px solid var(--amber-a25)",
                background: "var(--amber-a10)",
                padding: "2px 8px",
                borderRadius: 4,
                marginLeft: 4,
              }}
            >
              World Cup 26
            </span>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Link
              href="/"
              className="nav-link"
              style={{ fontSize: 14, color: "var(--fg-2)", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}
            >
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
      <TodayBar variant="center" />
    </header>
  );
}

// ── Detail tabs (Lineups / Key Stats / Timeline) ─────────────────────────────
function DetailTabs({ m, isFeatured }: { m: Match; isFeatured: boolean }) {
  const [tab, setTab] = useState<"lineups" | "stats" | "timeline">("lineups");
  const tabs: [typeof tab, string, React.ComponentType<{ size?: number }>][] = [
    ["lineups", "Lineups", Users],
    ["stats", "Key Stats", BarChart3],
    ["timeline", "Timeline", List],
  ];

  if (!isFeatured) {
    return (
      <Card style={{ padding: 30, textAlign: "center" }}>
        <Trophy size={20} style={{ color: "var(--amber-alert)", margin: "0 auto" }} />
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--fg-1)", margin: "12px 0 6px" }}>
          Full breakdown is for the match of the day
        </div>
        <p style={{ fontSize: 14.5, color: "var(--fg-2)", margin: "0 auto", maxWidth: 440, lineHeight: 1.6 }}>
          Lineups, key stats and the timeline are published for{" "}
          <strong style={{ color: "var(--amber-alert)" }}>
            {featuredMatch.home.code} v {featuredMatch.away.code}
          </strong>
          . Select it above to dive in.
        </p>
      </Card>
    );
  }

  const F = wcFeed.featured;
  return (
    <Card style={{ padding: 0, overflow: "hidden", gap: 0 }}>
      <div style={{ display: "flex", gap: 4, padding: 8, borderBottom: "1px solid var(--border)", background: "var(--canvas-terminal)" }}>
        {tabs.map(([id, label, Icon]) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                background: active ? "var(--amber-alert)" : "transparent",
                color: active ? "#1a1206" : "var(--fg-2)",
                border: "1px solid " + (active ? "var(--amber-alert)" : "transparent"),
                transition: "all var(--dur-base) ease",
              }}
            >
              <Icon size={15} /> {label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: 22 }}>
        {tab === "lineups" && <LineupPitch m={m} lineups={F.lineups} />}
        {tab === "stats" && <StatBars stats={F.stats} />}
        {tab === "timeline" && <Timeline m={m} events={F.events} />}
      </div>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const FILTERS: [string, MatchStatus | null][] = [
  ["All", null],
  ["In play", "live"],
  ["Upcoming", "upcoming"],
  ["Finished", "ft"],
];

export default function MatchCenter() {
  const [selId, setSelId] = useState(featuredMatch.id);
  const [filter, setFilter] = useState("All");

  const matches = wcFeed.matches;
  const selected = matches.find((m) => m.id === selId) ?? featuredMatch;
  const isFeatured = selected.id === featuredMatch.id;

  const activeStatus = FILTERS.find((f) => f[0] === filter)?.[1] ?? null;
  const shown = matches.filter((m) => !activeStatus || m.status === activeStatus);

  const selectMatch = (id: string) => {
    setSelId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh" }}>
      <Header />

      {/* Hero detail */}
      <section style={{ position: "relative", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src={HERO_BG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, var(--canvas) 0%, rgba(13,15,20,0.8) 45%, var(--canvas) 100%)" }} />
        </div>
        <div className="sa-container" style={{ position: "relative", zIndex: 1, paddingTop: 36, paddingBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--amber-alert)",
            }}
          >
            <Trophy size={15} /> {wcFeed.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38, letterSpacing: "-0.02em", margin: 0, color: "var(--fg-1)" }}>
              Match Center
            </h1>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg-3)" }}>
              {wcFeed.matchday} · {wcFeed.phase} · {wcFeed.dateLabel}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--fg-4)",
                padding: "3px 9px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-pill)",
              }}
            >
              <RefreshCw size={12} style={{ color: "var(--amber-alert)" }} /> Synced daily from awesome-sports-ai · {wcFeed.syncedAt}
            </span>
          </div>

          <div className="grid grid-cols-1 min-[900px]:grid-cols-[1.35fr_1fr]" style={{ gap: 22, alignItems: "stretch" }}>
            <Scoreboard m={selected} events={isFeatured ? wcFeed.featured.events : null} big />
            <Card style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--amber-alert)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Activity size={14} /> {isFeatured ? "Win projection" : "Match info"}
              </div>
              {isFeatured ? (
                <WinProbBar m={selected} prob={wcFeed.featured.winProb} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(
                    [
                      ["Group", selected.group],
                      ["Venue", selected.venue],
                      ["Kickoff", selected.kickoff],
                      [
                        "Status",
                        selected.status === "ft"
                          ? "Full time"
                          : selected.status === "live"
                            ? "In play · " + selected.minute + "'"
                            : "Upcoming",
                      ],
                    ] as [string, string][]
                  ).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {k}
                      </span>
                      <span style={{ fontSize: 13.5, color: "var(--fg-1)", textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button asChild variant="outline" size="sm" className="border-[var(--border)] bg-transparent text-[var(--fg-2)] hover:text-[var(--signal-green)] hover:border-[var(--green-a40)] dark:bg-transparent dark:border-[var(--border)]">
                  <a href={COMMENTATOR} target="_blank" rel="noopener noreferrer">
                    <Play size={14} /> Commentator
                  </a>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-[var(--fg-2)] hover:text-[var(--signal-green)]">
                  <a href={REPO} target="_blank" rel="noopener noreferrer">
                    <Github size={14} /> Open data
                  </a>
                </Button>
              </div>
            </Card>
          </div>

          <div style={{ marginTop: 22 }}>
            <DetailTabs m={selected} isFeatured={isFeatured} />
          </div>
        </div>
      </section>

      {/* Today's matches */}
      <section id="today" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="sa-container" style={{ paddingTop: 48, paddingBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--amber-alert)",
                }}
              >
                <CalendarDays size={15} /> {wcFeed.dateLabel}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, letterSpacing: "-0.02em", margin: 0, color: "var(--fg-1)" }}>
                Today's matches
              </h2>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILTERS.map(([label, st]) => {
                const active = filter === label;
                const n = st ? matches.filter((m) => m.status === st).length : matches.length;
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

      {/* Standings + Golden Boot */}
      <section style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
        <div className="sa-container" style={{ paddingTop: 56, paddingBottom: 64 }}>
          <div className="grid grid-cols-1 min-[900px]:grid-cols-[1.55fr_1fr]" style={{ gap: 28, alignItems: "start" }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--amber-alert)",
                }}
              >
                <Table2 size={15} /> Group Stage
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", margin: "0 0 22px", color: "var(--fg-1)" }}>
                Standings
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
                {wcFeed.standings.map((g) => (
                  <Standings key={g.group} group={g} />
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--amber-alert)",
                }}
              >
                <Trophy size={15} /> Golden Boot
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", margin: "0 0 22px", color: "var(--fg-1)" }}>
                Top scorers
              </h2>
              <Card style={{ padding: 20 }}>
                <TopScorers scorers={wcFeed.scorers} />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="sa-container"
          style={{ paddingTop: 36, paddingBottom: 44, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src={LOGO} alt="" style={{ width: 24, height: 24 }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--fg-1)" }}>
              Sports<span style={{ color: "var(--signal-green)" }}>AI</span>Hub
            </span>
          </Link>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-4)" }}>
            World Cup data synced daily from awesome-sports-ai · CC0
          </span>
        </div>
      </footer>
    </div>
  );
}
