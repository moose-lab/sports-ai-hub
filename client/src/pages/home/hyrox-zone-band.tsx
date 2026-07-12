/**
 * Sports AI Hub — featured HYROX Zone band ("The HYROX Zone is open.").
 * Sits after the World Cup band, entry point to /hyrox. Unlike the
 * data-driven ScenarioBand it has its own two-column layout: copy + tag
 * picks on the left, a 2×2 stat-card grid on the right. Stats derive from
 * the zone's content module (except the "0 official APIs" punchline).
 */
import { Radio, Zap } from "lucide-react";
import { Link } from "wouter";

import { Tag } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hyroxBuilderPaths, hyroxCategories, hyroxZonePicks } from "@/data/hyrox-zone";

const totalTools = hyroxCategories.flatMap((c) => c.tools).length;

const stats: [string, string][] = [
  [String(totalTools), "Tools curated"],
  [String(hyroxCategories.length), "Categories"],
  [String(hyroxBuilderPaths.length), "Builder paths"],
  ["0", "Official APIs"],
];

export function HyroxZoneBand() {
  return (
    <section id="hyrox" style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div
          className="grid grid-cols-1 min-[980px]:grid-cols-[1fr_auto]"
          style={{ gap: 48, alignItems: "center" }}
        >
          <div style={{ maxWidth: 620 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 18,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--signal-green)",
              }}
            >
              <Radio size={15} /> New · Sport Zone 01
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(34px, 4.5vw, 44px)",
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                margin: "0 0 16px",
                color: "var(--fg-1)",
              }}
            >
              The HYROX Zone
              <br />
              is open.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--fg-2)", margin: "0 0 22px", maxWidth: 540 }}>
              The directory, converged on one race: {totalTools} curated tools, datasets, and models for getting HYROX
              results data, finding your weak station, fixing the movement, and telling the story — for builders,
              athletes, coaches, and creators.
            </p>
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--fg-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 10,
                }}
              >
                In the zone
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {hyroxZonePicks.map((pick) => (
                  <Tag key={pick}>{pick}</Tag>
                ))}
              </div>
            </div>
            <Button asChild variant="default" className="hover:bg-[var(--signal-green-dim)]">
              <Link href="/hyrox">
                <Zap size={15} /> Enter the HYROX Zone
              </Link>
            </Button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 150px)", gap: 12 }}>
            {stats.map(([value, label]) => (
              <Card key={label} className="gap-0 p-[18px] text-center">
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--signal-green)", lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>
                  {label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
