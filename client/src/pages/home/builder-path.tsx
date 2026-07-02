/**
 * Sports AI Hub — Builder's Path (Recipes).
 * The real 6 catalog.json recipes, each chaining real tools — no invented
 * "sport" field (the catalog schema doesn't have one for recipes).
 */
import { useState } from "react";
import { ChevronDown, ChevronUp, Route } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHead } from "@/components/brand";
import { catalog, toolById } from "@/lib/catalog";
import { ToolChip } from "@/pages/home/shared";

export function BuilderPath({ onSelectTool }: { onSelectTool: (id: string) => void }) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="builder" className="sa-anchor" style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="The Builder's Path"
          icon={Route}
          title="Not just a list — a map for building"
          sub="Six recipes chaining real catalog tools into a pro-grade capability outcome."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 14, marginTop: 36 }}>
          {catalog.recipes.map((recipe, i) => {
            const isOpen = open.has(recipe.id);
            return (
              <Card key={recipe.id} className="card-signal gap-0 p-[22px]">
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--green-a40)", marginBottom: 14 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--fg-1)", margin: "0 0 8px" }}>
                  {recipe.title}
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--fg-2)", margin: "0 0 16px" }}>{recipe.goal}</p>

                <button
                  type="button"
                  onClick={() => toggle(recipe.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--signal-green)",
                    marginBottom: isOpen ? 12 : 0,
                  }}
                >
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {recipe.toolIds.length} tools chained
                </button>

                {isOpen && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {recipe.toolIds.map((toolId) => {
                      const tool = toolById(toolId);
                      if (!tool) return null;
                      return <ToolChip key={toolId} label={tool.title} onClick={() => onSelectTool(toolId)} />;
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
