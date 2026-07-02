/**
 * Sports AI Hub — Popular Scenarios (sport-first spotlight).
 * A second way into the same catalog: by sport/scenario rather than by
 * resource type. Currently FIFA World Cup 2026 (Soccer) and HYROX.
 */
import { Github, Trophy } from "lucide-react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHead } from "@/components/brand";
import { categoryById, toolById } from "@/lib/catalog";
import { scenarios, type Scenario } from "@/pages/home/scenarios-data";
import { ToolChip } from "@/pages/home/shared";

function ScenarioCta({ scenario, onNav }: { scenario: Scenario; onNav: (id: string) => void }) {
  if (scenario.ctaRoute) {
    return (
      <Link href={scenario.ctaRoute} style={{ textDecoration: "none" }}>
        <Button
          variant="outline"
          className="border-[var(--border)] bg-transparent text-[var(--fg-2)] hover:bg-transparent hover:text-[var(--signal-green)] hover:border-[var(--green-a40)] dark:bg-transparent dark:border-[var(--border)] dark:hover:bg-transparent"
        >
          {scenario.ctaLabel}
        </Button>
      </Link>
    );
  }
  if (scenario.ctaAnchor) {
    return (
      <Button
        variant="outline"
        onClick={() => onNav(scenario.ctaAnchor!)}
        className="border-[var(--border)] bg-transparent text-[var(--fg-2)] hover:bg-transparent hover:text-[var(--signal-green)] hover:border-[var(--green-a40)] dark:bg-transparent dark:border-[var(--border)] dark:hover:bg-transparent"
      >
        {scenario.ctaLabel}
      </Button>
    );
  }
  return (
    <a href={scenario.ctaHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <Button
        variant="outline"
        className="border-[var(--border)] bg-transparent text-[var(--fg-2)] hover:bg-transparent hover:text-[var(--signal-green)] hover:border-[var(--green-a40)] dark:bg-transparent dark:border-[var(--border)] dark:hover:bg-transparent"
      >
        <Github size={14} /> {scenario.ctaLabel}
      </Button>
    </a>
  );
}

function ScenarioCard({
  scenario,
  onSelectTool,
  onNav,
}: {
  scenario: Scenario;
  onSelectTool: (id: string) => void;
  onNav: (id: string) => void;
}) {
  const Icon = scenario.icon;
  return (
    <Card className="gap-0 p-[26px]">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-md)",
            background: "var(--amber-a10)",
            border: "1px solid var(--amber-a25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
          }}
        >
          <Icon size={19} style={{ color: "var(--amber-alert)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21, color: "var(--fg-1)" }}>
            {scenario.title}
          </span>
          <Badge variant={scenario.sport === "Multi-sport" ? "slate" : "signal"}>{scenario.sport}</Badge>
        </div>
      </div>

      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--fg-2)", margin: "0 0 20px" }}>{scenario.blurb}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
        {scenario.picks.map((pick) => {
          const category = categoryById(pick.categoryId);
          if (!category) return null;
          return (
            <div key={pick.categoryId}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--fg-4)",
                  marginBottom: 8,
                }}
              >
                {category.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {pick.toolIds.map((toolId) => {
                  const tool = toolById(toolId);
                  if (!tool) return null;
                  return <ToolChip key={toolId} label={tool.title} onClick={() => onSelectTool(toolId)} />;
                })}
              </div>
            </div>
          );
        })}
      </div>

      <ScenarioCta scenario={scenario} onNav={onNav} />
    </Card>
  );
}

export function ScenarioSpotlight({
  onSelectTool,
  onNav,
}: {
  onSelectTool: (id: string) => void;
  onNav: (id: string) => void;
}) {
  return (
    <section id="scenarios" className="sa-anchor" style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="Popular Scenarios"
          icon={Trophy}
          title="Two scenarios builders keep asking for"
          sub="The same catalog, entered by sport instead of by resource type."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16, marginTop: 32 }}>
          {scenarios.map((s) => (
            <ScenarioCard key={s.id} scenario={s} onSelectTool={onSelectTool} onNav={onNav} />
          ))}
        </div>
      </div>
    </section>
  );
}
