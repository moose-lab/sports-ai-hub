/**
 * Sports AI Hub — World Cup shared primitives.
 * The lightweight pieces the landing page needs (Crest, StatusPill, MatchChip)
 * plus the amber TodayBar — the ONE World Cup element on the landing hero.
 *
 * Daily-sync framing: amber accent, NO "LIVE" wording, no second-by-second
 * ticking. An in-progress match shows its snapshot minute (e.g. IN PLAY · 67').
 */

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { readableOn, wcFeed, type Match } from "@/pages/wc-data";

/* ── Team crest ─────────────────────────────────────────────── */
export function Crest({ team, size = 44 }: { team: Match["home"]; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9,
        background: team.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: Math.round(size * 0.3),
        color: readableOn(team.color),
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
      }}
    >
      {team.code}
    </div>
  );
}

/* ── Status pill — World Cup amber, NO "LIVE" wording ───────── */
export function StatusPill({ m }: { m: Match }) {
  const inplay = m.status === "live";
  const ft = m.status === "ft";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 9px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: inplay
          ? "var(--amber-a10)"
          : ft
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.04)",
        color: inplay ? "var(--amber-alert)" : ft ? "var(--fg-3)" : "var(--fg-2)",
        border: "1px solid " + (inplay ? "var(--amber-a25)" : "var(--border)"),
      }}
    >
      {inplay && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--amber-alert)",
            animation: "pulse-signal 1.8s ease-in-out infinite",
          }}
        />
      )}
      {inplay ? `IN PLAY · ${m.minute}'` : ft ? "FULL TIME" : `KO ${m.kickoff}`}
    </span>
  );
}

/* ── Compact match chip for the Today bar ───────────────────── */
export function MatchChip({ m }: { m: Match }) {
  const hasScore = m.status === "live" || m.status === "ft";
  const inplay = m.status === "live";
  const dot = (color: string) => (
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: 3,
        background: color,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
      }}
    />
  );
  const code = (text: string) => (
    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12.5, color: "var(--fg-1)" }}>
      {text}
    </span>
  );
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 11px",
        flex: "none",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--amber-a25)",
        background: "var(--amber-a10)",
      }}
    >
      {dot(m.home.color)}
      {code(m.home.code)}
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13.5, color: "var(--amber-alert)" }}>
        {hasScore ? `${m.home.score}-${m.away.score}` : <span style={{ color: "var(--fg-3)" }}>v</span>}
      </span>
      {code(m.away.code)}
      {dot(m.away.color)}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: inplay ? "var(--amber-alert)" : "var(--fg-3)",
          letterSpacing: "0.04em",
        }}
      >
        {inplay ? `${m.minute}'` : m.status === "ft" ? "FT" : m.kickoff}
      </span>
    </span>
  );
}

/* ── TodayBar — the amber hero strip ────────────────────────────
   `variant="home"`   → the whole bar links to the Match Center route.
   `variant="center"` → the bar scrolls to the #today fixtures section.
   Marquee content is duplicated for a seamless `ticker-content` loop. ── */
const barStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  height: 42,
  textDecoration: "none",
  background: "rgba(245,158,11,0.06)",
  borderBottom: "1px solid var(--amber-a25)",
};

function TodayBarInner() {
  const chips = (k: string) => wcFeed.matches.map((m, i) => <MatchChip key={k + i} m={m} />);
  return (
    <>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 13px",
          flex: "none",
          whiteSpace: "nowrap",
          background: "var(--amber-alert)",
          color: "#1a1206",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: "0.08em",
        }}
      >
        WORLD CUP
      </span>
      <span style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", position: "relative" }}>
        <span
          className="ticker-content"
          style={{ display: "inline-flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", paddingLeft: 12 }}
        >
          {chips("a")}
          <span style={{ width: 12 }} />
          {chips("b")}
        </span>
        <span
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 70,
            background: "linear-gradient(90deg, transparent, var(--canvas))",
            pointerEvents: "none",
          }}
        />
      </span>
      <span
        className="hidden sm:flex"
        style={{
          alignItems: "center",
          gap: 6,
          padding: "0 16px",
          flex: "none",
          borderLeft: "1px solid var(--amber-a25)",
          color: "var(--amber-alert)",
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          fontSize: 12,
        }}
      >
        Match Center <ArrowRight size={13} />
      </span>
    </>
  );
}

export function TodayBar({ variant }: { variant: "home" | "center" }) {
  if (variant === "center") {
    return (
      <a
        href="#today"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById("today");
          if (el) {
            window.scrollTo({
              top: el.getBoundingClientRect().top + window.scrollY - 110,
              behavior: "smooth",
            });
          }
        }}
        style={barStyle}
      >
        <TodayBarInner />
      </a>
    );
  }
  return (
    <Link href="/match-center" style={barStyle}>
      <TodayBarInner />
    </Link>
  );
}
