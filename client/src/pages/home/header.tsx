/**
 * Sports AI Hub — landing page header.
 * Nav bar (logo + "Explore" mega-menu + the untouched amber World Cup 26
 * link + Star button) + the permanent green LIVE ticker + the existing
 * World Cup "Today's matches" bar. The World Cup pieces here are exactly
 * what shipped before this rebuild — deliberately left alone.
 */
import * as React from "react";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Radio, Star, Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";

import { TodayBar } from "@/components/worldcup/wc-primitives";
import { catalog, sceneBySlug, toolsByCategory } from "@/lib/catalog";
import type { WcFixture } from "@/lib/worldcup";
import { asset, REPO, ticker, type TickerKind } from "@/pages/home-data";
import { categoryIcon } from "@/pages/home/category-icons";
import { scenarios } from "@/pages/home/scenarios-data";
import { PrimaryLink, Wordmark } from "@/pages/home/shared";

const LOGO = asset("logo-icon.webp");

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

/* ── Explore mega-menu row ───────────────────────────────────────────────── */
function MenuRow({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        width: "100%",
        padding: "6px 8px",
        borderRadius: "var(--radius-md)",
        background: hover ? "var(--green-a05)" : "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        transition: "background var(--dur-base) ease",
      }}
    >
      {children}
    </button>
  );
}

function MenuColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--fg-4)",
        marginBottom: 8,
        padding: "0 8px",
      }}
    >
      {children}
    </div>
  );
}

function ExploreMenu({ onNav, onJumpCategory }: { onNav: (id: string) => void; onJumpCategory: (categoryId: string) => void }) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  const go = (id: string) => {
    setOpen(false);
    onNav(id);
  };

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          color: open ? "var(--signal-green)" : "var(--fg-2)",
          transition: "color var(--dur-base) ease",
        }}
      >
        Explore {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 4,
            width: 620,
            background: "var(--canvas-card)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--glow-signal-soft)",
            padding: 22,
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr 0.9fr",
            gap: 22,
            zIndex: 60,
          }}
        >
          <div>
            <MenuColumnLabel>By category</MenuColumnLabel>
            {catalog.categories.map((c) => {
              const Icon = categoryIcon(c.id);
              return (
                <MenuRow key={c.id} onClick={() => { setOpen(false); onJumpCategory(c.id); }}>
                  <Icon size={15} style={{ color: "var(--signal-green)", flex: "none" }} />
                  <span style={{ fontSize: 13.5, color: "var(--fg-1)", flex: 1 }}>{c.label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-4)" }}>
                    {toolsByCategory(c.id).length}
                  </span>
                </MenuRow>
              );
            })}
          </div>

          <div>
            <MenuColumnLabel>By sport scenario</MenuColumnLabel>
            {scenarios.map((s) => {
              const Icon = s.icon;
              // Scenarios with a live catalog scene route to their zone page;
              // the rest scroll to the on-page spotlight.
              const zone = s.sceneSlug ? sceneBySlug(s.sceneSlug) : undefined;
              return (
                <MenuRow
                  key={s.id}
                  onClick={() => {
                    setOpen(false);
                    if (zone) navigate(zone.route);
                    else onNav("scenarios");
                  }}
                >
                  <Icon size={15} style={{ color: "var(--amber-alert)", flex: "none" }} />
                  <span style={{ fontSize: 13.5, color: "var(--fg-1)", flex: 1 }}>{s.title}</span>
                  {zone && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--signal-green)" }}>ZONE</span>}
                </MenuRow>
              );
            })}
            <MenuRow onClick={() => go("directory")}>
              <span style={{ fontSize: 13.5, color: "var(--fg-2)" }}>All sports in Directory</span>
            </MenuRow>
          </div>

          <div>
            <MenuColumnLabel>Jump to</MenuColumnLabel>
            {[
              ["Quick Start", "quickstart"],
              ["Directory", "directory"],
              ["Recipes", "builder"],
              ["Prototypes", "prototypes"],
              ["Contribute", "contribute"],
            ].map(([label, id]) => (
              <MenuRow key={id} onClick={() => go(id)}>
                <span style={{ fontSize: 13.5, color: "var(--fg-2)" }}>{label}</span>
              </MenuRow>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header({
  onNav,
  onJumpCategory,
  todayMatches,
}: {
  onNav: (id: string) => void;
  onJumpCategory: (categoryId: string) => void;
  todayMatches: WcFixture[];
}) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>
      {/* Nav row — explicit stacking context so the Explore mega-menu (nested
          inside, z-index 60) paints above the LIVE ticker below it. Without
          this, the ticker (a later sibling) would paint over the dropdown
          because `backdrop-filter` here already creates its own stacking
          context that isn't ordered by z-index unless this div is positioned. */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(13,15,20,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="sa-container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onNav("top");
            }}
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
          >
            <img src={LOGO} alt="Sports AI Hub" style={{ width: 26, height: 26 }} />
            <Wordmark />
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <span className="hidden md:inline-flex">
              <ExploreMenu onNav={onNav} onJumpCategory={onJumpCategory} />
            </span>
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

      {/* LIVE ticker — broadcast lower-third (permanent product feed, unrelated to World Cup) */}
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
              background: "linear-gradient(90deg, transparent, var(--canvas-terminal))",
              pointerEvents: "none",
            }}
          />
        </div>
        <div
          className="hidden min-[1100px]:flex"
          style={{ alignItems: "center", gap: 6, padding: "0 14px", flex: "none", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}
        >
          <Radio size={13} style={{ color: "var(--signal-green)" }} /> auto-updating
        </div>
      </div>

      {/* Amber "Today's matches" bar — the one World Cup element on the landing, unchanged */}
      <TodayBar variant="home" matches={todayMatches} />
    </header>
  );
}
