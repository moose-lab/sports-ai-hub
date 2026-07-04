/**
 * LIVE broadcast ticker — the "lower third" strip under the sticky nav.
 * Shared by the landing page (general product feed) and the sport-zone
 * pages (zone-specific feed): green LIVE block with pulsing dot, marquee
 * mono text with ◆ separators (row duplicated for a seamless loop), right
 * fade, optional right-side meta slot.
 */
import * as React from "react";

export type TickerKind = "score" | "tool" | "news" | "event";

export interface TickerItem {
  kind: TickerKind;
  text: string;
}

const TICKER_COLOR: Record<TickerKind, string> = {
  score: "var(--signal-green)",
  tool: "var(--signal-green)",
  news: "var(--amber-alert)",
  event: "var(--fg-1)",
};

function TickerRow({ items, keyPrefix }: { items: TickerItem[]; keyPrefix: string }) {
  return (
    <>
      {items.map((it, i) => (
        <span key={keyPrefix + i} style={{ display: "inline-flex", alignItems: "center" }}>
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

export function LiveTicker({ items, meta }: { items: TickerItem[]; meta?: React.ReactNode }) {
  return (
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
        <span className="pulse-dot" style={{ width: 7, height: 7, background: "var(--canvas)" }} />
        LIVE
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", position: "relative" }}>
        <div
          className="ticker-content"
          style={{ fontFamily: "var(--font-mono)", fontSize: 12, whiteSpace: "nowrap", letterSpacing: "0.02em" }}
        >
          <TickerRow items={items} keyPrefix="a" />
          <TickerRow items={items} keyPrefix="b" />
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 60,
            background: "linear-gradient(90deg, transparent, var(--canvas-terminal))",
            pointerEvents: "none",
          }}
        />
      </div>
      {meta && (
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
          {meta}
        </div>
      )}
    </div>
  );
}
