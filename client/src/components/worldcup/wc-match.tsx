/**
 * Sports AI Hub — World Cup match-detail components for the Match Center.
 * Everything here is backed by the live awesome-sports-ai feed:
 * Scoreboard + MatchCard render real fixtures, Standings are computed from
 * final results, Milestones come straight from the snapshot. (Lineups / xG /
 * timeline / scorers are intentionally absent — the daily feed ships none.)
 */

import * as React from "react";
import { useState } from "react";
import { Flame } from "lucide-react";
import { isHot, type WcFixture, type WcMilestone, type WcStandingGroup, type WcTeam } from "@/lib/worldcup";
import { Crest, Flag, StatusPill } from "@/components/worldcup/wc-primitives";
import { SCOREBOARD_CLASS } from "@/components/worldcup/wc-match-layout";

const stageLabel = (m: WcFixture) => m.round || m.group || "World Cup";

/* ── "HOT" label for standout fixtures (live or marquee ties) ── */
function HotBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#1a1206",
        background: "var(--amber-alert)",
      }}
    >
      <Flame size={11} /> Hot
    </span>
  );
}

/* ── Scoreboard (Match Center hero) ─────────────────────────── */
export function Scoreboard({ m, big = false }: { m: WcFixture; big?: boolean }) {
  const hasScore = (m.status === "final" || m.status === "live") && m.home.score != null;
  const scoreSize = big ? 60 : 46;
  const lead = (m.home.score || 0) - (m.away.score || 0);
  return (
    <div style={{ background: "var(--canvas-terminal)", border: "1px solid var(--amber-a25)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
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
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <StatusPill m={m} />
          {isHot(m) && <HotBadge />}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-3)", letterSpacing: "0.04em" }}>
          {stageLabel(m)} · {m.venue}
        </span>
      </div>
      <div className={`${SCOREBOARD_CLASS.body}${big ? ` ${SCOREBOARD_CLASS.bodyBig}` : ""}`}>
        <div className={`${SCOREBOARD_CLASS.team} ${SCOREBOARD_CLASS.home}`}>
          <Crest team={m.home} size={big ? 52 : 42} />
          <div className={SCOREBOARD_CLASS.teamText}>
            <div className={SCOREBOARD_CLASS.name}>
              {m.home.name}
            </div>
            <div className={SCOREBOARD_CLASS.sideLabel}>HOME</div>
          </div>
        </div>
        <div className={SCOREBOARD_CLASS.score}>
          {hasScore ? (
            <>
              <span style={{ color: lead >= 0 ? "var(--fg-1)" : "var(--fg-2)" }}>{m.home.score}</span>
              <span style={{ color: "var(--fg-4)", fontSize: scoreSize * 0.5 }}>:</span>
              <span style={{ color: lead <= 0 ? "var(--fg-1)" : "var(--fg-2)" }}>{m.away.score}</span>
            </>
          ) : (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: big ? 24 : 20, color: "var(--amber-alert)", whiteSpace: "nowrap" }}>
              {m.kickoff ?? m.date}
            </span>
          )}
        </div>
        <div className={`${SCOREBOARD_CLASS.team} ${SCOREBOARD_CLASS.away}`}>
          <div className={SCOREBOARD_CLASS.teamText}>
            <div className={SCOREBOARD_CLASS.name}>
              {m.away.name}
            </div>
            <div className={SCOREBOARD_CLASS.sideLabel}>AWAY</div>
          </div>
          <Crest team={m.away} size={big ? 52 : 42} />
        </div>
      </div>
      {(m.insight || m.tag) && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderTop: "1px solid var(--border)", background: "rgba(245,158,11,0.05)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11, color: "var(--amber-alert)", flex: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {m.date}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {m.insight || m.tag}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Compact match card (grid) ──────────────────────────────── */
export function MatchCard({ m, onClick, active = false }: { m: WcFixture; onClick?: () => void; active?: boolean }) {
  const [hover, setHover] = useState(false);
  const hasScore = (m.status === "final" || m.status === "live") && m.home.score != null;
  const hLead = (m.home.score || 0) > (m.away.score || 0);
  const aLead = (m.away.score || 0) > (m.home.score || 0);
  const row = (t: WcTeam, lead: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Crest team={t} size={26} />
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, color: "var(--fg-1)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {t.name}
      </span>
      {hasScore && (
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: lead ? "var(--amber-alert)" : "var(--fg-2)", lineHeight: 1 }}>{t.score}</span>
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
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <StatusPill m={m} />
          {isHot(m) && <HotBadge />}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-4)", letterSpacing: "0.04em" }}>{stageLabel(m)}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {row(m.home, hLead)}
        {row(m.away, aLead)}
      </div>
    </div>
  );
}

/* ── Standings table (computed from final results) ──────────── */
export function Standings({ group }: { group: WcStandingGroup }) {
  const cols = "20px 1fr repeat(5, 26px) 34px";
  return (
    <div style={{ background: "var(--canvas-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: "1px solid var(--border)", background: "var(--canvas-terminal)" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--fg-1)" }}>{group.group}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Top 2 advance</span>
      </div>
      <div style={{ padding: "4px 8px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 4, padding: "6px 8px", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          <span />
          <span>Team</span>
          {["P", "W", "D", "L", "GD", "Pts"].map((h) => (
            <span key={h} style={{ textAlign: "center" }}>{h}</span>
          ))}
        </div>
        {group.rows.map((r, i) => {
          const qual = i < 2;
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
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: qual ? "var(--amber-alert)" : "var(--fg-3)", fontWeight: 700 }}>{i + 1}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                <Flag team={r} w={20} h={14} />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5, color: "var(--fg-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
              </span>
              {[r.p, r.w, r.d, r.l].map((v, j) => (
                <span key={j} style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg-2)" }}>{v}</span>
              ))}
              <span style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg-3)" }}>{r.gd > 0 ? "+" + r.gd : r.gd}</span>
              <span style={{ textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: qual ? "var(--amber-alert)" : "var(--fg-1)" }}>{r.pts}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tournament milestones (from the snapshot) ──────────────── */
export function Milestones({ items }: { items: WcMilestone[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((mi, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "12px 14px",
            background: "var(--canvas-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11, color: "var(--amber-alert)", flex: "none", width: 46, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {mi.date}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--fg-1)" }}>{mi.label}</div>
            <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5, marginTop: 2 }}>{mi.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
