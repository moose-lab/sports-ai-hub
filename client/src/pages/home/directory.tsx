/**
 * Sports AI Hub — Directory (faceted browse).
 * Every tool, grouped by the 8 real resource-type categories, filterable by
 * sport (single-select) + AI capability (multi-select) + openness
 * (multi-select) + free-text search.
 */
import * as React from "react";
import { useState } from "react";
import { ArrowUpRight, LibraryBig, SlidersHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHead } from "@/components/brand";
import {
  activeSportTags,
  catalog,
  categoryById,
  type CatalogTool,
  OPENNESS_HINT,
  OPENNESS_LABEL,
  toolsByCategory,
} from "@/lib/catalog";
import { OpennessBadge } from "@/pages/home/shared";

const chipStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: "var(--font-mono)",
  fontSize: 12.5,
  padding: "6px 13px",
  borderRadius: "var(--radius-pill)",
  cursor: "pointer",
  background: active ? "var(--signal-green)" : "transparent",
  color: active ? "var(--canvas)" : "var(--fg-2)",
  border: active ? "1px solid var(--signal-green)" : "1px solid var(--border)",
  fontWeight: active ? 600 : 500,
  transition: "all var(--dur-base) ease",
});

function toggleSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/* ── Tool card ────────────────────────────────────────────────────────────── */
function ToolCard({ tool, roomy, onSelect }: { tool: CatalogTool; roomy: boolean; onSelect: () => void }) {
  return (
    <Card
      onClick={onSelect}
      className="h-full gap-0 cursor-pointer group transition-colors hover:border-[var(--green-a40)]"
      style={{ padding: roomy ? 22 : 16 }}
    >
      <div className="flex items-center justify-between gap-2" style={{ marginBottom: 7 }}>
        <span
          className="truncate transition-colors text-[var(--fg-1)] group-hover:text-[var(--signal-green)]"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 14.5 }}
        >
          {tool.title}
        </span>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${tool.title} in a new tab`}
          className="shrink-0 transition-colors text-[var(--fg-3)] hover:text-[var(--signal-green)]"
        >
          <ArrowUpRight size={14} />
        </a>
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--fg-2)", margin: "0 0 12px" }}>{tool.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <Badge variant={tool.sportTags.includes("Multi-sport") ? "slate" : "signal"}>{tool.sportTags[0]}</Badge>
        <OpennessBadge id={tool.openness} size="sm" />
      </div>
    </Card>
  );
}

/* ── Category block ──────────────────────────────────────────────────────── */
function CategoryBlock({
  categoryId,
  shown,
  onSelectTool,
}: {
  categoryId: string;
  shown: CatalogTool[];
  onSelectTool: (id: string) => void;
}) {
  const category = categoryById(categoryId);
  if (!category) return null;
  const sparse = shown.length <= 3;

  return (
    <div id={`category-${categoryId}`} className="sa-anchor">
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--fg-1)", margin: 0 }}>
          {category.label}
        </h3>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--signal-green)" }}>{shown.length}</span>
        <span className="hidden min-[920px]:block" style={{ fontSize: 13.5, color: "var(--fg-3)", marginLeft: "auto", textAlign: "right", maxWidth: 420 }}>
          {category.description}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: sparse ? "repeat(auto-fill, minmax(360px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {shown.map((tool) => (
          <ToolCard key={tool.id} tool={tool} roomy={sparse} onSelect={() => onSelectTool(tool.id)} />
        ))}
      </div>
    </div>
  );
}

/* ── Directory ────────────────────────────────────────────────────────────── */
const normalize = (value: string) => value.toLowerCase().trim();

export function Directory({
  query,
  categoryFocus,
  setCategoryFocus,
  onSelectTool,
}: {
  query: string;
  categoryFocus: string | null;
  setCategoryFocus: (id: string | null) => void;
  onSelectTool: (id: string) => void;
}) {
  const [tag, setTag] = useState("All");
  const [caps, setCaps] = useState<Set<string>>(new Set());
  const [openn, setOpenn] = useState<Set<string>>(new Set());
  const [refineOpen, setRefineOpen] = useState(false);

  const q = normalize(query);

  const matchTool = (tool: CatalogTool) => {
    const matchesSport = tag === "All" || tool.sportTags.includes(tag) || tool.sportTags.includes("Multi-sport");
    const matchesCaps = caps.size === 0 || tool.aiCapabilities.some((c) => caps.has(c));
    const matchesOpenness = openn.size === 0 || openn.has(tool.openness);
    const matchesQuery = !q || normalize(`${tool.title} ${tool.description}`).includes(q);
    return matchesSport && matchesCaps && matchesOpenness && matchesQuery;
  };

  const cats = catalog.categories
    .filter((c) => !categoryFocus || c.id === categoryFocus)
    .map((c) => ({ id: c.id, shown: toolsByCategory(c.id).filter(matchTool) }))
    .filter((c) => c.shown.length > 0);

  const total = cats.reduce((n, c) => n + c.shown.length, 0);
  const activeSecondary = caps.size + openn.size;
  const focusedCategory = categoryFocus ? categoryById(categoryFocus) : null;

  return (
    <section id="directory" className="sa-anchor" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="The Collection"
          icon={LibraryBig}
          title="Browse the directory"
          sub="Every entry is a real, reachable tool — grouped by resource type and filterable by sport, AI capability, and openness."
        />

        {focusedCategory && (
          <div style={{ marginTop: 20 }}>
            <button
              type="button"
              onClick={() => setCategoryFocus(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                color: "var(--signal-green)",
                background: "var(--green-a05)",
                border: "1px solid var(--green-a20)",
                borderRadius: "var(--radius-pill)",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Jumped from Quick Start: {focusedCategory.label} <X size={13} />
            </button>
          </div>
        )}

        {/* Sport tag filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "24px 0 12px", alignItems: "center" }}>
          {["All", ...activeSportTags].map((s) => (
            <button key={s} onClick={() => setTag(s)} style={chipStyle(s === tag)}>
              {s}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setRefineOpen((v) => !v)}
            style={{ ...chipStyle(refineOpen || activeSecondary > 0), display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <SlidersHorizontal size={13} /> Refine{activeSecondary > 0 ? ` (${activeSecondary})` : ""}
          </button>
          <span style={{ marginLeft: "auto", alignSelf: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>
            {total} {total === 1 ? "tool" : "tools"}
          </span>
        </div>

        {refineOpen && (
          <div
            style={{
              background: "var(--canvas-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "14px 16px",
              marginBottom: 26,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-4)", marginBottom: 8 }}>
                AI capability
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {catalog.aiCapabilities.map((c) => (
                  <button key={c.id} onClick={() => setCaps((s) => toggleSet(s, c.id))} style={chipStyle(caps.has(c.id))}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--fg-4)", marginBottom: 8 }}>
                Openness
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {catalog.openness.map((id) => (
                  <button
                    key={id}
                    title={OPENNESS_HINT[id]}
                    onClick={() => setOpenn((s) => toggleSet(s, id))}
                    style={chipStyle(openn.has(id))}
                  >
                    {OPENNESS_LABEL[id] ?? id}
                  </button>
                ))}
              </div>
            </div>
            {activeSecondary > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCaps(new Set());
                  setOpenn(new Set());
                }}
                style={{ alignSelf: "flex-start", background: "none", border: "none", color: "var(--fg-3)", textDecoration: "underline", fontSize: 12.5, cursor: "pointer", padding: 0 }}
              >
                Clear refine filters
              </button>
            )}
          </div>
        )}

        {cats.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
            No tools match this combination. Try clearing a filter.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          {cats.map((c) => (
            <CategoryBlock key={c.id} categoryId={c.id} shown={c.shown} onSelectTool={onSelectTool} />
          ))}
        </div>
      </div>
    </section>
  );
}
