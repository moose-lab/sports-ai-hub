/**
 * Sports AI Hub — Tool Detail Modal.
 * Lightweight detail view for one catalog tool: full metadata and which
 * recipes chain it. No dedicated route — opened via `selectedToolId` lifted
 * to Home, so Directory, Recipes, and Scenario Spotlight can all trigger it.
 */
import { ExternalLink, Route, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capabilityById, categoryById, recipesForTool, toolById } from "@/lib/catalog";
import { OpennessBadge } from "@/pages/home/shared";

export function ToolDetailModal({
  toolId,
  onClose,
}: {
  toolId: string | null;
  onClose: () => void;
}) {
  const tool = toolId ? toolById(toolId) : undefined;
  if (!toolId || !tool) return null;

  const category = categoryById(tool.categoryId);
  const recipes = recipesForTool(tool.id);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(10,12,16,0.75)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "84vh",
          overflowY: "auto",
          background: "var(--canvas-card)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--glow-signal-soft)",
          padding: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
          <div>
            {category && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)", marginBottom: 6 }}>
                {category.label}
              </div>
            )}
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--fg-1)" }}>
              {tool.title}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              flex: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              background: "transparent",
              color: "var(--fg-2)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--fg-2)", margin: "0 0 20px" }}>{tool.description}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
          <OpennessBadge id={tool.openness} />
          {tool.sportTags.map((s) => (
            <Badge key={s} variant="slate">
              {s}
            </Badge>
          ))}
          {tool.aiCapabilities.map((c) => (
            <Badge key={c} variant="amber">
              {capabilityById(c)?.label ?? c}
            </Badge>
          ))}
        </div>

        {recipes.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-4)", marginBottom: 8 }}>
              Used in recipe
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recipes.map((r) => (
                <a
                  key={r.id}
                  href="#builder"
                  onClick={onClose}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--signal-green)", fontSize: 13.5, textDecoration: "none" }}
                >
                  <Route size={14} /> {r.title}
                </a>
              ))}
            </div>
          </div>
        )}

        <Button asChild variant="default" className="hover:bg-[var(--signal-green-dim)]">
          <a href={tool.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} /> Open {tool.url.startsWith("https://github.com") ? "repo" : "link"}
          </a>
        </Button>
      </div>
    </div>
  );
}
