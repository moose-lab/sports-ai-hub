/**
 * Sports AI Hub — World Cup match-detail components for the Match Center.
 * Scoreboard, MatchCard, WinProbBar, StatBars, Timeline, LineupPitch,
 * Standings, TopScorers. Amber accent throughout; daily-sync snapshot
 * (no "LIVE" badge). Ported from the design handoff's `wc-live.jsx`.
 */

import * as React from "react";
import { useState } from "react";
import { CircleDot, Repeat, Square } from "lucide-react";
import {
  readableOn,
  type Lineup,
  type Match,
  type MatchEvent,
  type Scorer,
  type StandingGroup,
  type StatLine,
  type WinProb,
} from "@/pages/wc-data";
import { Crest, StatusPill } from "@/components/worldcup/wc-primitives";

/* ── Event-type glyph (goal / yellow / sub) ─────────────────── */
function EventIcon({ type, size = 13, color }: { type: MatchEvent["type"]; size?: number; color?: string }) {
  const common = { size, style: { color } };
  if (type === "goal") return <CircleDot {...common} />;
  if (type === "yellow") return <Square {...common} />;
  return <Repeat {...common} />;
}

/* ── Scoreboard (Match Center hero) ─────────────────────────── */
export function Scoreboard({
  m,
  events,
  big = false,
}: {
  m: Match;
  events?: MatchEvent[] | null;
  big?: boolean;
}) {
  const hasScore = m.status === "live" || m.status === "ft";
  const last = events && events.length ? events[events.length - 1] : null;
  const scoreSize = big ? 60 : 46;
  const lead = (m.home.score || 0) - (m.away.score || 0);
  return (
    <div
      style={{
        background: "var(--canvas-terminal)",
        border: "1px solid var(--amber-a25)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "11px 16px",
          borderBottom: "1px solid var(--border)",
          flexWrap: "wrap",
        }}
      >
        <StatusPill m={m} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-3)", letterSpacing: "0.04em" }}>
          {m.group} · {m.venue}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: big ? 18 : 12,
          padding: big ? "26px 22px" : "18px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <Crest team={m.home} size={big ? 52 : 42} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: big ? 22 : 17,
                color: "var(--fg-1)",
                lineHeight: 1.1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {m.home.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>HOME</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: big ? 14 : 10,
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: scoreSize,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {hasScore ? (
            <>
              <span style={{ color: lead >= 0 ? "var(--fg-1)" : "var(--fg-2)" }}>{m.home.score}</span>
              <span style={{ color: "var(--fg-4)", fontSize: scoreSize * 0.5 }}>:</span>
              <span style={{ color: lead <= 0 ? "var(--fg-1)" : "var(--fg-2)" }}>{m.away.score}</span>
            </>
          ) : (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: big ? 28 : 24, color: "var(--amber-alert)" }}>
              {m.kickoff}
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
            justifyContent: "flex-end",
            textAlign: "right",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: big ? 22 : 17,
                color: "var(--fg-1)",
                lineHeight: 1.1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {m.away.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>AWAY</div>
          </div>
          <Crest team={m.away} size={big ? 52 : 42} />
        </div>
      </div>
      {last && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderTop: "1px solid var(--border)",
            background: "rgba(245,158,11,0.05)",
          }}
        >
          <span
            style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, color: "var(--amber-alert)", flex: "none" }}
          >
            {last.minute}'
          </span>
          <EventIcon type={last.type} color={last.type === "goal" ? "var(--amber-alert)" : "var(--fg-3)"} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              color: "var(--fg-2)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {last.text}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Compact match card (grid) ──────────────────────────────── */
export function MatchCard({
  m,
  onClick,
  active = false,
}: {
  m: Match;
  onClick?: () => void;
  active?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const hasScore = m.status === "live" || m.status === "ft";
  const hLead = (m.home.score || 0) > (m.away.score || 0);
  const aLead = (m.away.score || 0) > (m.home.score || 0);
  const row = (t: Match["home"], lead: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Crest team={t} size={26} />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 15,
          color: "var(--fg-1)",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {t.name}
      </span>
      {hasScore && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 20,
            color: lead ? "var(--amber-alert)" : "var(--fg-2)",
            lineHeight: 1,
          }}
        >
          {t.score}
        </span>
      )}
    </div>
  );
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active ? "rgba(245,158,11,0.05)" : "var(--canvas-card)",
        border: "1px solid " + (active || hover ? "var(--amber-a25)" : "var(--border)"),
        borderRadius: "var(--radius-xl)",
        padding: 15,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color var(--dur-base) ease, transform var(--dur-fast) ease",
        transform: hover && onClick ? "translateY(-2px)" : "none",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <StatusPill m={m} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-4)", letterSpacing: "0.04em" }}>
          {m.group}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {row(m.home, hLead)}
        {row(m.away, aLead)}
      </div>
    </div>
  );
}

/* ── Win-probability (model projection, daily) ──────────────── */
export function WinProbBar({ m, prob }: { m: Match; prob: WinProb }) {
  const seg = (w: number, color: string, dark: boolean) => (
    <div style={{ width: w + "%", background: color, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {w >= 12 && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, color: dark ? "var(--canvas)" : "var(--fg-1)" }}>
          {w}%
        </span>
      )}
    </div>
  );
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          color: "var(--fg-3)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <span>{m.home.code} win</span>
        <span>Draw</span>
        <span>{m.away.code} win</span>
      </div>
      <div style={{ display: "flex", height: 26, borderRadius: "var(--radius-pill)", overflow: "hidden", border: "1px solid var(--border)" }}>
        {seg(prob.home, "var(--amber-alert)", true)}
        {seg(prob.draw, "var(--canvas-inset)", false)}
        {seg(prob.away, "var(--fg-4)", true)}
      </div>
      <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-4)" }}>
        Model projection · from the latest daily data sync
      </div>
    </div>
  );
}

/* ── Key-stats dual bars ────────────────────────────────────── */
export function StatBars({ stats }: { stats: StatLine[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {stats.map((s) => {
        const total = s.home + s.away || 1;
        const hw = (s.home / total) * 100;
        const fmt = (v: number) => (Number.isInteger(v) ? v : v.toFixed(2)) + (s.unit || "");
        const hWin = s.home >= s.away;
        return (
          <div key={s.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: hWin ? "var(--amber-alert)" : "var(--fg-2)", width: 60 }}>
                {fmt(s.home)}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {s.label}
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: !hWin ? "var(--amber-alert)" : "var(--fg-2)", width: 60, textAlign: "right" }}>
                {fmt(s.away)}
              </span>
            </div>
            <div style={{ display: "flex", gap: 3, height: 6 }}>
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", background: "var(--canvas-inset)", borderRadius: "3px 0 0 3px", overflow: "hidden" }}>
                <div style={{ width: hw + "%", background: hWin ? "var(--amber-alert)" : "var(--fg-4)" }} />
              </div>
              <div style={{ flex: 1, display: "flex", background: "var(--canvas-inset)", borderRadius: "0 3px 3px 0", overflow: "hidden" }}>
                <div style={{ width: 100 - hw + "%", background: !hWin ? "var(--amber-alert)" : "var(--fg-4)" }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Event timeline (reverse-chronological) ─────────────────── */
export function Timeline({ m, events }: { m: Match; events: MatchEvent[] }) {
  const ordered = [...events].sort((a, b) => b.minute - a.minute);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {ordered.map((e, i) => {
        const home = e.team === "home";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: i < ordered.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 13,
                color: e.type === "goal" ? "var(--amber-alert)" : "var(--fg-3)",
                width: 34,
                flex: "none",
              }}
            >
              {e.minute}'
            </span>
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--canvas-card)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              <EventIcon type={e.type} size={12} color={e.type === "sub" ? "var(--fg-3)" : "var(--amber-alert)"} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: "var(--fg-4)",
                width: 38,
                flex: "none",
                letterSpacing: "0.06em",
              }}
            >
              {home ? m.home.code : m.away.code}
            </span>
            <span
              style={{
                fontSize: 14,
                color: e.type === "goal" ? "var(--fg-1)" : "var(--fg-2)",
                fontWeight: e.type === "goal" ? 600 : 400,
                lineHeight: 1.4,
              }}
            >
              {e.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Lineup pitch (both formations on one 16:9 pitch) ───────── */
export function LineupPitch({ m, lineups }: { m: Match; lineups: { home: Lineup; away: Lineup } }) {
  const colsHome = [6, 17, 29, 41];
  const colsAway = [94, 83, 71, 59];
  const player = (p: { n: number; name: string }, x: number, y: number, color: string) => (
    <div
      key={x + "-" + y + "-" + p.n}
      style={{
        position: "absolute",
        left: x + "%",
        top: y + "%",
        transform: "translate(-50%,-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        width: 64,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: color,
          color: readableOn(color),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.18)",
        }}
      >
        {p.n}
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--fg-1)",
          background: "rgba(10,12,16,0.78)",
          padding: "1px 5px",
          borderRadius: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 70,
        }}
      >
        {p.name}
      </span>
    </div>
  );
  const place = (team: Lineup, cols: number[], color: string) =>
    team.lines.flatMap((line, li) => line.map((p, pi) => player(p, cols[li], ((pi + 1) / (line.length + 1)) * 100, color)));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>
        <span>
          <span style={{ color: "var(--fg-1)", fontWeight: 700 }}>{m.home.code}</span> · {lineups.home.formation} · {lineups.home.coach}
        </span>
        <span>
          {lineups.away.coach} · {lineups.away.formation} · <span style={{ color: "var(--fg-1)", fontWeight: 700 }}>{m.away.code}</span>
        </span>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          minHeight: 300,
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          background: "linear-gradient(180deg, #0c1a12, #0a1410)",
          border: "1px solid var(--amber-a25)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(245,158,11,0.18)" }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 88, height: 88, transform: "translate(-50%,-50%)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", left: 0, top: "26%", bottom: "26%", width: "13%", border: "1px solid rgba(245,158,11,0.18)", borderLeft: "none" }} />
          <div style={{ position: "absolute", right: 0, top: "26%", bottom: "26%", width: "13%", border: "1px solid rgba(245,158,11,0.18)", borderRight: "none" }} />
        </div>
        {place(lineups.home, colsHome, m.home.color)}
        {place(lineups.away, colsAway, m.away.color)}
      </div>
    </div>
  );
}

/* ── Standings table ────────────────────────────────────────── */
export function Standings({ group }: { group: StandingGroup }) {
  const cols = "20px 1fr repeat(5, 26px) 34px";
  return (
    <div style={{ background: "var(--canvas-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: "1px solid var(--border)", background: "var(--canvas-terminal)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--fg-1)" }}>{group.group}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Top 2 advance
        </span>
      </div>
      <div style={{ padding: "4px 8px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 4, padding: "6px 8px", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          <span />
          <span>Team</span>
          {["P", "W", "D", "L", "GD", "Pts"].map((h) => (
            <span key={h} style={{ textAlign: "center" }}>
              {h}
            </span>
          ))}
        </div>
        {group.rows.map((r, i) => {
          const qual = i < 2;
          const gd = r.gf - r.ga;
          return (
            <div
              key={r.code}
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                gap: 4,
                alignItems: "center",
                padding: "8px",
                borderRadius: "var(--radius-sm)",
                background: qual ? "rgba(245,158,11,0.05)" : "transparent",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: qual ? "var(--amber-alert)" : "var(--fg-3)", fontWeight: 700 }}>
                {i + 1}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                <span style={{ width: 16, height: 16, borderRadius: 4, background: r.color, flex: "none", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }} />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--fg-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.name}
                </span>
              </span>
              {[r.p, r.w, r.d, r.l].map((v, j) => (
                <span key={j} style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg-2)" }}>
                  {v}
                </span>
              ))}
              <span style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg-3)" }}>
                {gd > 0 ? "+" + gd : gd}
              </span>
              <span style={{ textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: qual ? "var(--amber-alert)" : "var(--fg-1)" }}>
                {r.pts}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Top scorers (Golden Boot) ──────────────────────────────── */
export function TopScorers({ scorers }: { scorers: Scorer[] }) {
  const max = Math.max(...scorers.map((s) => s.goals));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {scorers.map((s, i) => (
        <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: i === 0 ? "var(--amber-alert)" : "var(--fg-4)", width: 16, flex: "none", textAlign: "right" }}>
            {i + 1}
          </span>
          <span style={{ width: 18, height: 18, borderRadius: 4, background: s.color, flex: "none", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14.5, color: "var(--fg-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.name}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)", flex: "none" }}>
                {s.team} · {s.assists}A
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
              <div style={{ flex: 1, height: 6, background: "var(--canvas-inset)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: (s.goals / max) * 100 + "%", height: "100%", background: i === 0 ? "var(--amber-alert)" : "var(--amber-a25)", borderRadius: 3 }} />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--amber-alert)", width: 18, textAlign: "right", flex: "none" }}>
                {s.goals}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
