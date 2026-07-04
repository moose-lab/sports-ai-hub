/**
 * Sports AI Hub — Hero. Stats are computed live from the real catalog
 * (never hardcoded) so they can't drift the way the old "48 Tools" copy did.
 */
import { ArrowRight, CircleCheckBig, Dumbbell, GitFork, Github, Search, Tag as TagIcon, Trophy } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "wouter";

import { Input } from "@/components/ui/input";
import { PhaseBadge, StatCard } from "@/components/brand";
import { catalog } from "@/lib/catalog";
import { REPO } from "@/pages/home-data";
import { prototypes } from "@/pages/home/prototypes-data";
import { PrimaryLink } from "@/pages/home/shared";

const pillStyle: CSSProperties = {
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
  cursor: "pointer",
};

const stats = [
  { value: String(catalog.tools.length), label: "Tools Curated" },
  { value: String(catalog.categories.length), label: "Categories" },
  { value: String(catalog.recipes.length), label: "Builder Recipes" },
  { value: String(prototypes.length), label: "Runnable Prototypes" },
];

export function Hero({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <section id="top" className="sa-anchor" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container home-hero-container">
        <div style={{ maxWidth: 760 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
            <span className="home-phase-badge">
              <PhaseBadge status="active" live>
                {`Phase 6 — ${prototypes.length} prototypes shipped`}
              </PhaseBadge>
            </span>
            <Link href="/match-center" style={pillStyle}>
              <Trophy size={13} /> World Cup 2026 <ArrowRight size={13} /> Match Center
            </Link>
            <Link href="/hyrox" style={pillStyle}>
              <Dumbbell size={13} /> HYROX <ArrowRight size={13} /> HYROX Zone
            </Link>
          </div>

          <h1
            className="home-hero-title"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1.04, margin: "0 0 20px", color: "var(--fg-1)" }}
          >
            The open directory of
            <br />
            sports tools builders
            <br />
            <span style={{ color: "var(--signal-green)" }}>actually use.</span>
          </h1>

          <p className="home-hero-copy" style={{ lineHeight: 1.6, color: "var(--fg-2)", margin: "0 0 32px" }}>
            A curated, CC0-licensed collection of sports APIs, datasets, analytics, and
            computer-vision tools — decomposed into mono-tools any developer can run. Built in
            the open for the 2026 season.
          </p>

          <div style={{ display: "flex", gap: 12, alignItems: "center", maxWidth: 560, marginBottom: 28, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
              <Search size={16} style={{ position: "absolute", left: 13, top: 12, color: "var(--fg-3)", pointerEvents: "none" }} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${catalog.tools.length} tools — xG, tracking, pose, video…`}
                className="h-10 bg-[var(--input-bg)] border-[var(--border)]"
                style={{ paddingLeft: 38 }}
              />
            </div>
            <PrimaryLink href={REPO}>
              <Github size={16} /> Browse the repo
            </PrimaryLink>
          </div>

          <div className="home-proof-row" style={{ display: "flex", gap: 28, flexWrap: "wrap", fontSize: 13, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <GitFork size={14} style={{ color: "var(--signal-green)" }} /> Fork &amp; contribute
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <CircleCheckBig size={14} style={{ color: "var(--signal-green)" }} /> Every entry reachable
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <TagIcon size={14} style={{ color: "var(--signal-green)" }} /> Filter by sport, capability &amp; openness
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 min-[720px]:grid-cols-4 gap-3.5" style={{ marginTop: 48 }}>
          {stats.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
