import { useState, type ComponentType } from "react";
import {
  ArrowUpRight,
  Brackets,
  ChartNoAxesCombined,
  Database,
  FileSearch,
  Languages,
  ScanSearch,
  UserSearch,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { capabilityById, categoryById, type CatalogTool } from "@/lib/catalog";
import type { WcToolkitLane, WcToolkitTool } from "@/lib/worldcup";
import { catalogToolFor, worldCupToolUrl } from "@/lib/worldcup-tools";
import { OpennessBadge } from "@/pages/home/shared";

const ICONS: Record<string, ComponentType<{ size?: number }>> = {
  "knockout-data": Database,
  "bracket-and-scenarios": Brackets,
  "match-intelligence": FileSearch,
  "xg-and-shot-quality": ChartNoAxesCombined,
  "video-and-vision": ScanSearch,
  "scouting-and-reports": UserSearch,
  "media-and-localization": Languages,
};

function ToolCard({
  tool,
  catalogTool,
  onSelectTool,
}: {
  tool: WcToolkitTool;
  catalogTool: CatalogTool | undefined;
  onSelectTool: (toolId: string) => void;
}) {
  const category = catalogTool
    ? categoryById(catalogTool.categoryId)
    : undefined;

  return (
    <Card
      style={{
        padding: 18,
        gap: 14,
        background: "var(--canvas-card)",
        borderColor: "var(--border)",
        boxShadow: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          {category && (
            <div
              style={{
                color: "var(--fg-4)",
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.08em",
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              {category.label}
            </div>
          )}
          <h3
            style={{
              color: "var(--fg-1)",
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 750,
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            {tool.name}
          </h3>
        </div>
        {catalogTool && <OpennessBadge id={catalogTool.openness} size="sm" />}
      </div>

      <p
        style={{
          color: "var(--fg-2)",
          fontSize: 13.5,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {tool.role}
      </p>

      {catalogTool && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {catalogTool.aiCapabilities.map(capability => (
            <Badge key={capability} variant="amber">
              {capabilityById(capability)?.label ?? capability}
            </Badge>
          ))}
        </div>
      )}

      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}
      >
        {catalogTool && (
          <Button
            type="button"
            size="sm"
            variant="default"
            className="hover:bg-[var(--signal-green-dim)]"
            onClick={() => onSelectTool(catalogTool.id)}
          >
            View details
          </Button>
        )}
        <Button
          asChild
          size="sm"
          variant={catalogTool ? "ghost" : "outline"}
          className="text-[var(--fg-2)] hover:text-[var(--signal-green)]"
        >
          <a
            href={worldCupToolUrl(tool)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {catalogTool ? "Open source" : "Open tool"}{" "}
            <ArrowUpRight size={13} />
          </a>
        </Button>
      </div>
    </Card>
  );
}

export function WorldCupToolkit({
  lanes,
  onSelectTool,
}: {
  lanes: WcToolkitLane[];
  onSelectTool: (toolId: string) => void;
}) {
  const preferredLane = lanes.some(lane => lane.slug === "video-and-vision")
    ? "video-and-vision"
    : (lanes[0]?.slug ?? "");
  const [activeSlug, setActiveSlug] = useState(preferredLane);
  const activeLane = lanes.find(lane => lane.slug === activeSlug) ?? lanes[0];

  if (!activeLane) return null;

  return (
    <section
      id="football-tools"
      className="sa-anchor"
      style={{
        background: "var(--canvas-raised)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="sa-container"
        style={{ paddingTop: 56, paddingBottom: 64 }}
      >
        <div
          style={{
            alignItems: "flex-end",
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <div
              style={{
                color: "var(--amber-alert)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.16em",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              Football tool categories
            </div>
            <h2
              style={{
                color: "var(--fg-1)",
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              World Cup 26 AI Toolkit
            </h2>
            <p
              style={{
                color: "var(--fg-2)",
                fontSize: 14.5,
                lineHeight: 1.6,
                margin: "10px 0 0",
              }}
            >
              Browse open football tools by the job they support on
              matchday—from data and brackets to vision review and localized
              media.
            </p>
          </div>
          <Badge variant="amber">{lanes.length} matchday lanes</Badge>
        </div>

        <div
          className="grid grid-cols-1 min-[900px]:grid-cols-[280px_1fr]"
          style={{ gap: 20, alignItems: "start" }}
        >
          <nav
            aria-label="Football tool categories"
            className="grid grid-cols-1 min-[560px]:grid-cols-2 min-[900px]:grid-cols-1"
            style={{ gap: 8 }}
          >
            {lanes.map((lane, index) => {
              const Icon = ICONS[lane.slug] ?? Database;
              const active = lane.slug === activeLane.slug;
              return (
                <button
                  key={lane.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveSlug(lane.slug)}
                  style={{
                    alignItems: "center",
                    background: active
                      ? "var(--amber-a10)"
                      : "var(--canvas-card)",
                    border: active
                      ? "1px solid var(--amber-a25)"
                      : "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    color: active ? "var(--fg-1)" : "var(--fg-2)",
                    cursor: "pointer",
                    display: "grid",
                    fontFamily: "var(--font-display)",
                    fontSize: 13.5,
                    fontWeight: active ? 700 : 600,
                    gap: 10,
                    gridTemplateColumns: "24px 1fr auto",
                    padding: "12px 13px",
                    textAlign: "left",
                  }}
                >
                  <Icon size={17} />
                  <span>{lane.title}</span>
                  <span
                    style={{
                      color: active ? "var(--amber-alert)" : "var(--fg-4)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            aria-live="polite"
            style={{
              background: "var(--canvas)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              padding: 20,
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  color: "var(--amber-alert)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  marginBottom: 7,
                  textTransform: "uppercase",
                }}
              >
                Active category · {activeLane.tools.length} tools
              </div>
              <h3
                style={{
                  color: "var(--fg-1)",
                  fontFamily: "var(--font-display)",
                  fontSize: 23,
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                {activeLane.title}
              </h3>
              <p
                style={{
                  color: "var(--fg-2)",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  margin: "8px 0 0",
                }}
              >
                {activeLane.matchdayUse}
              </p>
            </div>

            <div
              className="grid grid-cols-1 min-[700px]:grid-cols-2"
              style={{ gap: 12 }}
            >
              {activeLane.tools.map(tool => (
                <ToolCard
                  key={`${activeLane.slug}-${tool.name}`}
                  tool={tool}
                  catalogTool={catalogToolFor(tool)}
                  onSelectTool={onSelectTool}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
