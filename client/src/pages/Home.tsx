/**
 * Sports AI Hub — Home (landing page)
 * Design: "Signal & Pitch" — Broadcast Brutalism
 * Dark canvas #0D0F14 · Electric Signal Green #00FF87
 * Fonts: Space Grotesk (display) · Inter (body) · JetBrains Mono (code)
 *
 * Eight sections, top to bottom: sticky header + LIVE ticker, hero,
 * FIFA World Cup 2026 feature, tool directory, Builder's Path,
 * runnable prototypes, contribute, footer.
 */

import * as React from "react";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CircleCheckBig,
  CircleDot,
  FlaskConical,
  Github,
  GitFork,
  GitPullRequestArrow,
  LibraryBig,
  Radio,
  Route,
  Search,
  Star,
  Tag as TagIcon,
  Trophy,
} from "lucide-react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  PhaseBadge,
  SectionHead,
  StatCard,
  Terminal,
} from "@/components/brand";
import { TodayBar } from "@/components/worldcup/wc-primitives";
import { useWorldCup } from "@/hooks/useWorldCup";
import type { WcFixture } from "@/lib/worldcup";
import {
  asset,
  builderPaths,
  categories,
  prototypes,
  REPO,
  sportTags,
  stats,
  ticker,
  type Category,
  type TickerKind,
  type Tool,
} from "@/pages/home-data";

const LOGO = asset("logo-icon.webp");
const AWESOME = "https://github.com/moose-lab/awesome-sports-ai";

// ── Shared link-buttons (anchor styled as a shadcn Button) ───────────────────
function PrimaryLink({
  href,
  size = "default",
  children,
}: {
  href: string;
  size?: "sm" | "default";
  children: React.ReactNode;
}) {
  return (
    <Button
      asChild
      variant="default"
      size={size}
      className="hover:bg-[var(--signal-green-dim)]"
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}

function OutlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="border-[var(--border)] bg-transparent text-[var(--fg-2)] hover:bg-transparent hover:text-[var(--signal-green)] hover:border-[var(--green-a40)] dark:bg-transparent dark:border-[var(--border)] dark:hover:bg-transparent"
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}

const Wordmark = ({ size = 17 }: { size?: number }) => (
  <span
    style={{
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: size,
      color: "var(--fg-1)",
      letterSpacing: "-0.01em",
    }}
  >
    Sports<span style={{ color: "var(--signal-green)" }}>AI</span>Hub
  </span>
);

// ── Header: nav bar + LIVE broadcast ticker ──────────────────────────────────
const TICKER_COLOR: Record<TickerKind, string> = {
  score: "var(--signal-green)",
  tool: "var(--signal-green)",
  news: "var(--amber-alert)",
  event: "var(--fg-1)",
};

function TickerRow({ keyPrefix }: { keyPrefix: string }) {
  return (
    <>
      {ticker.map((it, i) => (
        <span
          key={keyPrefix + i}
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <span style={{ color: "var(--fg-4)", margin: "0 18px" }}>◆</span>
          <span
            style={{
              color: TICKER_COLOR[it.kind],
              fontWeight: it.kind === "news" || it.kind === "score" ? 600 : 500,
            }}
          >
            {it.text}
          </span>
        </span>
      ))}
    </>
  );
}

function Header({ onNav, todayMatches }: { onNav: (id: string) => void; todayMatches: WcFixture[] }) {
  const navLinks: [string, string][] = [
    ["Directory", "directory"],
    ["Builder Path", "builder"],
    ["Prototypes", "prototypes"],
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>
      {/* Nav row */}
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onNav("top");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <img src={LOGO} alt="Sports AI Hub" style={{ width: 28, height: 28 }} />
            <Wordmark />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--fg-3)",
                border: "1px solid var(--border)",
                padding: "2px 6px",
                borderRadius: 4,
                marginLeft: 4,
              }}
              className="hidden sm:inline-block"
            >
              CC0 · awesome-list
            </span>
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: 26 }}>
            {navLinks.map(([label, id]) => (
              <a
                key={id}
                href={"#" + id}
                onClick={(e) => {
                  e.preventDefault();
                  onNav(id);
                }}
                className="nav-link hidden md:inline-block"
                style={{
                  fontSize: 14,
                  color: "var(--fg-2)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {label}
              </a>
            ))}
            <Link
              href="/match-center"
              className="hidden md:inline-flex"
              style={{
                fontSize: 14,
                color: "var(--amber-alert)",
                textDecoration: "none",
                fontWeight: 600,
                alignItems: "center",
                gap: 6,
              }}
            >
              <Trophy size={14} /> World Cup 26
            </Link>
            <PrimaryLink href={REPO} size="sm">
              <Star size={15} /> Star on GitHub
            </PrimaryLink>
          </nav>
        </div>
      </div>

      {/* LIVE ticker — broadcast lower-third */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: 42,
          background: "var(--canvas-terminal)",
          borderBottom: "1px solid var(--green-a20)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 16px",
            background: "var(--signal-green)",
            color: "var(--canvas)",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.12em",
            flex: "none",
          }}
        >
          <span
            className="pulse-dot"
            style={{ width: 7, height: 7, background: "var(--canvas)" }}
          />
          LIVE
        </div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            className="ticker-content"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}
          >
            <TickerRow keyPrefix="a" />
            <TickerRow keyPrefix="b" />
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 60,
              background:
                "linear-gradient(90deg, transparent, var(--canvas-terminal))",
              pointerEvents: "none",
            }}
          />
        </div>
        <div
          className="hidden min-[1100px]:flex"
          style={{
            alignItems: "center",
            gap: 6,
            padding: "0 14px",
            flex: "none",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-3)",
          }}
        >
          <Radio size={13} style={{ color: "var(--signal-green)" }} /> updated daily
        </div>
      </div>

      {/* Amber "Today's matches" bar — the one World Cup element on the landing */}
      <TodayBar variant="home" matches={todayMatches} />
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <section id="top" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 72, paddingBottom: 56 }}>
        <div style={{ maxWidth: 760 }}>
          <div
            style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}
          >
            <PhaseBadge status="active" live>
              Phase 6 — Prototypes shipped
            </PhaseBadge>
            <Link
              href="/match-center"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "var(--amber-a10)",
                border: "1px solid var(--amber-a25)",
                color: "var(--amber-alert)",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                fontSize: 12.5,
                padding: "5px 12px",
                borderRadius: "var(--radius-pill)",
                textDecoration: "none",
              }}
            >
              <Trophy size={13} /> World Cup 2026 <ArrowRight size={13} /> Match Center
            </Link>
          </div>

          <h1
            className="text-[40px] sm:text-[60px]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              margin: "0 0 20px",
              color: "var(--fg-1)",
            }}
          >
            The open directory of
            <br />
            sports tools builders
            <br />
            <span style={{ color: "var(--signal-green)" }}>actually use.</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              maxWidth: 580,
              margin: "0 0 32px",
            }}
          >
            A curated, CC0-licensed collection of sports APIs, datasets, analytics,
            and computer-vision tools — decomposed into mono-tools any developer can
            run. Built in the open for the 2026 season.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              maxWidth: 560,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 13,
                  top: 12,
                  color: "var(--fg-3)",
                  pointerEvents: "none",
                }}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 48 tools — xG, tracking, pose, video…"
                className="h-10 bg-[var(--input-bg)] border-[var(--border)]"
                style={{ paddingLeft: 38 }}
              />
            </div>
            <PrimaryLink href={REPO}>
              <Github size={16} /> Browse the repo
            </PrimaryLink>
          </div>

          <div
            style={{
              display: "flex",
              gap: 28,
              flexWrap: "wrap",
              fontSize: 13,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <GitFork size={14} style={{ color: "var(--signal-green)" }} /> Fork &amp;
              contribute
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <CircleCheckBig size={14} style={{ color: "var(--signal-green)" }} />{" "}
              Every entry reachable
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <TagIcon size={14} style={{ color: "var(--signal-green)" }} /> Tagged by
              sport
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="grid grid-cols-2 min-[720px]:grid-cols-4 gap-3.5"
          style={{ marginTop: 48 }}
        >
          {stats.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Directory ────────────────────────────────────────────────────────────────
function ToolCard({ t }: { t: Tool }) {
  return (
    <a
      href={t.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <Card className="h-full gap-0 p-4 border-[var(--border)] transition-colors group-hover:border-[var(--green-a40)]">
        <div
          className="flex items-center justify-between gap-2"
          style={{ marginBottom: 7 }}
        >
          <span
            className="truncate transition-colors text-[var(--fg-1)] group-hover:text-[var(--signal-green)]"
            style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 14.5 }}
          >
            {t.name}
          </span>
          <ArrowUpRight
            size={14}
            className="shrink-0 transition-colors text-[var(--fg-3)] group-hover:text-[var(--signal-green)]"
          />
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--fg-2)", margin: "0 0 12px" }}>
          {t.desc}
        </p>
        <Badge variant={t.sport === "Multi-sport" ? "slate" : "signal"}>
          {t.sport}
        </Badge>
      </Card>
    </a>
  );
}

function CategoryBlock({ cat }: { cat: Category & { shown: Tool[] } }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--fg-1)",
            margin: 0,
          }}
        >
          {cat.name}
        </h3>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--signal-green)",
          }}
        >
          {cat.shown.length}
        </span>
        <span
          className="hidden min-[920px]:block"
          style={{
            fontSize: 13.5,
            color: "var(--fg-3)",
            marginLeft: "auto",
            textAlign: "right",
            maxWidth: 420,
          }}
        >
          {cat.blurb}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {cat.shown.map((t) => (
          <ToolCard key={t.name} t={t} />
        ))}
      </div>
    </div>
  );
}

function Directory({ query }: { query: string }) {
  const [tag, setTag] = useState("All");

  const matchTool = (t: Tool) =>
    (tag === "All" || t.sport === tag || t.sport === "Multi-sport") &&
    (!query || (t.name + " " + t.desc).toLowerCase().includes(query.toLowerCase()));

  const cats = categories
    .map((c) => ({ ...c, shown: c.tools.filter(matchTool) }))
    .filter((c) => c.shown.length > 0);

  const total = cats.reduce((n, c) => n + c.shown.length, 0);

  return (
    <section id="directory" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="The Collection"
          icon={LibraryBig}
          title="Browse the directory"
          sub="Every entry is a real, reachable tool — grouped by use case and tagged by sport, just like the repo."
        />

        {/* Sport tag filter */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            margin: "28px 0 36px",
          }}
        >
          {sportTags.map((s) => {
            const active = s === tag;
            return (
              <button
                key={s}
                onClick={() => setTag(s)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12.5,
                  padding: "6px 13px",
                  borderRadius: "var(--radius-pill)",
                  cursor: "pointer",
                  background: active ? "var(--signal-green)" : "transparent",
                  color: active ? "var(--canvas)" : "var(--fg-2)",
                  border: active
                    ? "1px solid var(--signal-green)"
                    : "1px solid var(--border)",
                  fontWeight: active ? 600 : 500,
                  transition: "all var(--dur-base) ease",
                }}
              >
                {s}
              </button>
            );
          })}
          <span
            style={{
              marginLeft: "auto",
              alignSelf: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--fg-3)",
            }}
          >
            {total} {total === 1 ? "tool" : "tools"}
          </span>
        </div>

        {cats.length === 0 && (
          <div
            style={{
              padding: "48px 0",
              textAlign: "center",
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
            }}
          >
            No tools match “{query}”. Try a broader term.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          {cats.map((c) => (
            <CategoryBlock key={c.id} cat={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Builder's Path ───────────────────────────────────────────────────────────
function BuilderPath() {
  return (
    <section
      id="builder"
      style={{
        background: "var(--canvas-raised)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="The Builder's Path"
          icon={Route}
          title="Not just a list — a map for building"
          sub="The magic is in the framing: chain these mono-tools to build the smaller pieces behind the systems pro teams pay millions for."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
            gap: 14,
            marginTop: 36,
          }}
        >
          {builderPaths.map((p, i) => (
            <Card key={p.title} className="card-signal gap-0 p-[22px]">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 26,
                    color: "var(--green-a40)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Badge variant={p.sport === "Multi-sport" ? "slate" : "signal"}>
                  {p.sport}
                </Badge>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--fg-1)",
                  margin: "0 0 16px",
                }}
              >
                {p.title}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.steps.map((s, j) => (
                  <div
                    key={s}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--fg-4)",
                        width: 18,
                        flex: "none",
                      }}
                    >
                      {j + 1}.
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12.5,
                        color: "var(--fg-2)",
                        padding: "3px 9px",
                        background: "var(--canvas-terminal)",
                        border: "1px solid var(--border)",
                        borderRadius: 4,
                      }}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Prototypes ───────────────────────────────────────────────────────────────
function Prototypes() {
  const [active, setActive] = useState(0);
  const p = prototypes[active];

  return (
    <section id="prototypes" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="Phase 6 · Runnable"
          icon={FlaskConical}
          title="Three prototypes you can run today"
          sub="Each decomposes an enterprise-grade capability into one script, one input, one output — runnable in under 5 minutes."
        />

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            margin: "28px 0 28px",
          }}
        >
          {prototypes.map((pp, i) => (
            <button
              key={pp.id}
              onClick={() => setActive(i)}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                padding: "8px 16px",
                borderRadius: "var(--radius-pill)",
                cursor: "pointer",
                transition: "all var(--dur-base) ease",
                background: i === active ? "var(--signal-green)" : "var(--canvas-card)",
                color: i === active ? "var(--canvas)" : "var(--fg-2)",
                border:
                  i === active
                    ? "1px solid var(--signal-green)"
                    : "1px solid var(--border)",
              }}
            >
              {pp.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 min-[920px]:grid-cols-2 gap-7 items-start">
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              border: "1px solid var(--border)",
              aspectRatio: "16 / 9",
            }}
          >
            <img
              src={p.image}
              alt={p.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(13,15,20,0.9), transparent 55%)",
              }}
            />
            <div style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12.5,
                  color: "var(--signal-green)",
                  background: "rgba(10,12,16,0.8)",
                  border: "1px solid var(--green-a20)",
                  borderRadius: 6,
                  padding: "8px 12px",
                }}
              >
                <span style={{ color: "var(--fg-4)" }}># </span>
                {p.highlight}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <Badge variant="signal">{p.tag}</Badge>
              <Badge variant="slate">{p.sport}</Badge>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 28,
                color: "var(--fg-1)",
                margin: "0 0 12px",
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                fontSize: 15.5,
                lineHeight: 1.6,
                color: "var(--fg-2)",
                margin: "0 0 20px",
              }}
            >
              {p.desc}
            </p>
            <Terminal
              style={{ marginBottom: 20 }}
              lines={[
                { comment: "Clone and run" },
                { cmd: true, text: "git clone github.com/moose-lab/awesome-sports-ai" },
                { cmd: true, text: "cd prototypes/" + p.id },
                { cmd: true, text: p.cmd },
              ]}
            />
            <PrimaryLink href={`${AWESOME}/tree/main/prototypes/${p.id}`}>
              <Github size={16} /> View source <ArrowUpRight size={14} />
            </PrimaryLink>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contribute ───────────────────────────────────────────────────────────────
function Contribute() {
  const steps: [string, string][] = [
    ["Pick a sport", "Soccer, WNBA, Pickleball, Athletics, Esports — choose what you know."],
    ["Spot the gatekept tool", "What does a $50K/yr platform do that developers can't access?"],
    ["Build the mono-tool", "One script, one input, one output. Runnable in under 5 minutes."],
    ["Open a PR", "Add it to prototypes/ with a README and sample data."],
  ];

  return (
    <section
      id="contribute"
      style={{
        background: "var(--canvas-raised)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <div className="grid grid-cols-1 min-[920px]:grid-cols-2 gap-12 items-start min-[920px]:items-center">
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
            <div
              style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}
            >
              <PrimaryLink href={`${AWESOME}/issues`}>
                <CircleDot size={15} /> Browse open issues
              </PrimaryLink>
              <OutlineLink href={`${AWESOME}/blob/main/CONTRIBUTING.md`}>
                Read the guide
              </OutlineLink>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {steps.map(([t, d], i) => (
              <Card
                key={t}
                className="gap-0 p-[18px] flex-row items-start"
                style={{ gap: 16 }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 22,
                    color: "var(--green-a40)",
                    flex: "none",
                    width: 30,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "var(--fg-1)",
                      marginBottom: 3,
                    }}
                  >
                    {t}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--fg-2)", lineHeight: 1.5 }}>
                    {d}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const links: [string, string][] = [
    ["GitHub", REPO],
    ["Contributing", `${AWESOME}/blob/main/CONTRIBUTING.md`],
    ["License · CC0", `${AWESOME}/blob/main/LICENSE`],
  ];

  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div
        className="sa-container"
        style={{
          paddingTop: 40,
          paddingBottom: 48,
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={LOGO} alt="" style={{ width: 24, height: 24 }} />
          <Wordmark size={16} />
          <span style={{ color: "var(--fg-4)" }}>·</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--fg-3)",
            }}
          >
            awesome-sports-ai
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 14, flexWrap: "wrap" }}>
          {links.map(([l, u]) => (
            <a
              key={l}
              href={u}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ color: "var(--fg-3)", textDecoration: "none" }}
            >
              {l}
            </a>
          ))}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--fg-4)",
          }}
        >
          Curated in the open · 2026
        </div>
      </div>
    </footer>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [query, setQuery] = useState("");
  const wc = useWorldCup();

  const onNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 110,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh" }}>
      <Header onNav={onNav} todayMatches={wc.data?.today ?? []} />
      <Hero query={query} setQuery={setQuery} />
      <Directory query={query} />
      <BuilderPath />
      <Prototypes />
      <Contribute />
      <Footer />
    </div>
  );
}
