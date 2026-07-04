/**
 * HYROX Zone — the tool directory: audience filter pills + live search
 * over the scenario-grouped collection. Audience state is lifted to the
 * page so the hero's persona cards can drive it.
 */
import { useState } from "react";
import { ArrowUpRight, LibraryBig, Search } from "lucide-react";

import { SectionHead } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  hyroxAudiences,
  hyroxCategories,
  type HyroxAudience,
  type HyroxAudienceFilter,
  type HyroxTool,
} from "@/data/hyrox-zone";
import { countShownTools, filterHyroxCategories } from "@/lib/hyrox-zone";
import { FilterPill } from "@/pages/hyrox/filter-pill";

/** Builders/Athletes read as "signal" (green); Coaches/Creators as slate. */
const AUD_BADGE: Record<HyroxAudience, "signal" | "slate"> = {
  Builders: "signal",
  Athletes: "signal",
  Coaches: "slate",
  Creators: "slate",
};

function ToolCard({ tool }: { tool: HyroxTool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
      style={{ textDecoration: "none", display: "block" }}
    >
      <Card className="h-full gap-0 p-4 transition-colors duration-200 group-hover:border-[var(--green-a40)]">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 7 }}>
          <span
            className="text-[var(--fg-1)] transition-colors duration-200 group-hover:text-[var(--signal-green)]"
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: 14.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tool.name}
          </span>
          <ArrowUpRight
            size={14}
            className="text-[var(--fg-3)] transition-colors duration-200 group-hover:text-[var(--signal-green)]"
            style={{ flex: "none" }}
          />
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--fg-2)", margin: "0 0 12px" }}>{tool.desc}</p>
        <div>
          <Badge variant={AUD_BADGE[tool.aud]}>{tool.aud}</Badge>
        </div>
      </Card>
    </a>
  );
}

export function ZoneDirectory({
  aud,
  setAud,
}: {
  aud: HyroxAudienceFilter;
  setAud: (aud: HyroxAudienceFilter) => void;
}) {
  const [query, setQuery] = useState("");

  const cats = filterHyroxCategories(hyroxCategories, aud, query);
  const total = countShownTools(cats);

  return (
    <section id="tools" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="The HYROX Collection"
          icon={LibraryBig}
          title="Tools that move your race time"
          sub="Grouped by scenario — race data, pacing analytics, training & movement, content — and filterable by who you are. Every entry links to the source."
        />

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, margin: "28px 0 36px" }}>
          {hyroxAudiences.map((a) => (
            <FilterPill key={a} label={a} active={a === aud} onClick={() => setAud(a)} />
          ))}
          <div style={{ position: "relative", marginLeft: "auto", minWidth: 240 }}>
            <Search
              size={15}
              style={{ position: "absolute", left: 12, top: 11, color: "var(--fg-3)", pointerEvents: "none" }}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search — splits, pose, scraper…"
              className="h-9 bg-[var(--input-bg)] border-[var(--border)]"
              style={{ paddingLeft: 36 }}
            />
          </div>
          <span style={{ alignSelf: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>
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
            <div key={c.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: "1px solid var(--border)",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--fg-1)", margin: 0 }}>
                  {c.name}
                </h3>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--signal-green)" }}>
                  {c.shown.length}
                </span>
                <span
                  className="hidden min-[720px]:inline"
                  style={{ fontSize: 13.5, color: "var(--fg-3)", marginLeft: "auto", textAlign: "right", maxWidth: 420 }}
                >
                  {c.blurb}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {c.shown.map((t) => (
                  <ToolCard key={t.name} tool={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
