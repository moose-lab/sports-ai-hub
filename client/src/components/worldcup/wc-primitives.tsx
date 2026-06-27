/**
 * Sports AI Hub — World Cup shared primitives.
 * Crest, StatusPill, MatchChip and the amber TodayBar (the one World Cup
 * element on the landing). All driven by the live `awesome-sports-ai` feed:
 * scheduled fixtures show their kickoff time, finished fixtures show the score.
 */

import * as React from "react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { flagIso, flagSrc } from "@/lib/flags";
import { scrollAnchorIntoView } from "@/lib/scroll-anchor";
import { readableOn, type WcFixture, type WcTeam } from "@/lib/worldcup";

/* ── Country flag (falls back to the team color block if unmapped) ── */
export function Flag({ team, w = 17, h = 12 }: { team: WcTeam; w?: number; h?: number }) {
  const iso = flagIso(team);
  const [failed, setFailed] = useState(false);
  const base: React.CSSProperties = {
    width: w,
    height: h,
    borderRadius: 3,
    flex: "none",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
    display: "inline-block",
    objectFit: "cover",
  };
  if (!iso || failed) return <span style={{ ...base, background: team.color }} aria-hidden />;
  return (
    <img
      src={flagSrc(iso)}
      alt={`${team.name} flag`}
      width={w}
      height={h}
      loading="lazy"
      onError={() => setFailed(true)}
      style={base}
    />
  );
}

/* ── Team crest — the national flag, with a color+code fallback ── */
export function Crest({ team, size = 44 }: { team: WcTeam; size?: number }) {
  const iso = flagIso(team);
  const [failed, setFailed] = useState(false);
  const h = Math.round(size * 0.72); // flags read ~3:2
  const radius = Math.max(4, Math.round(size * 0.16));
  const ring = "inset 0 0 0 1px rgba(255,255,255,0.16)";

  if (iso && !failed) {
    return (
      <img
        src={flagSrc(iso)}
        alt={`${team.name} flag`}
        width={size}
        height={h}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ width: size, height: h, borderRadius: radius, objectFit: "cover", flex: "none", boxShadow: ring, display: "block" }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: h,
        borderRadius: radius,
        background: team.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: Math.round(size * 0.26),
        color: readableOn(team.color),
        boxShadow: ring,
      }}
    >
      {team.code}
    </div>
  );
}

/* ── Status pill — amber, NO "LIVE" wording (daily-sync framing) ── */
export function StatusPill({ m }: { m: WcFixture }) {
  const inplay = m.status === "live";
  const ft = m.status === "final";
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
        background: inplay ? "var(--amber-a10)" : ft ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.04)",
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
      {inplay ? "IN PLAY" : ft ? "FULL TIME" : `KO ${m.kickoff ?? m.date}`}
    </span>
  );
}

/* ── Compact match chip for the Today bar ───────────────────── */
export function MatchChip({ m }: { m: WcFixture }) {
  const hasScore = (m.status === "final" || m.status === "live") && m.home.score != null;
  const inplay = m.status === "live";
  const code = (text: string) => (
    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12.5, color: "var(--fg-1)" }}>{text}</span>
  );
  const tail = inplay ? "LIVE" : m.status === "final" ? "FT" : m.kickoff ?? m.date;
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
      <Flag team={m.home} />
      {code(m.home.code)}
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13.5, color: "var(--amber-alert)" }}>
        {hasScore ? `${m.home.score}-${m.away.score}` : <span style={{ color: "var(--fg-3)" }}>v</span>}
      </span>
      {code(m.away.code)}
      <Flag team={m.away} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: inplay ? "var(--amber-alert)" : "var(--fg-3)", letterSpacing: "0.04em" }}>
        {tail}
      </span>
    </span>
  );
}

/* ── TodayBar — amber hero strip carouseling today's fixtures ────
   `variant="home"`   → the whole bar links to the Match Center route.
   `variant="center"` → the bar scrolls to the #today fixtures section.
   `matches` comes from the live feed; while loading it shows a sync hint. ── */
const barStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  height: 42,
  textDecoration: "none",
  background: "rgba(245,158,11,0.06)",
  borderBottom: "1px solid var(--amber-a25)",
};

function TodayBarInner({ matches }: { matches: WcFixture[] }) {
  const hasMatches = matches.length > 0;
  // Duplicate for a seamless marquee loop only when there's something to scroll.
  const chips = (k: string) => matches.map((m, i) => <MatchChip key={k + i} m={m} />);
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
        {hasMatches ? (
          <span
            className="ticker-content"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", paddingLeft: 12 }}
          >
            {chips("a")}
            <span style={{ width: 12 }} />
            {chips("b")}
          </span>
        ) : (
          <span style={{ paddingLeft: 14, fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-3)" }}>
            Syncing today’s fixtures…
          </span>
        )}
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

export function TodayBar({ matches = [], variant }: { matches?: WcFixture[]; variant: "home" | "center" }) {
  if (variant === "center") {
    return (
      <a
        href="#today"
        onClick={(e) => {
          e.preventDefault();
          scrollAnchorIntoView("today");
        }}
        style={barStyle}
      >
        <TodayBarInner matches={matches} />
      </a>
    );
  }
  return (
    <Link href="/match-center" style={barStyle}>
      <TodayBarInner matches={matches} />
    </Link>
  );
}
