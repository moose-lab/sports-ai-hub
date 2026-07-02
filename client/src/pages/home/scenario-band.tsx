/**
 * Sports AI Hub — full-bleed "featured season" band.
 * One per Popular Scenario (World Cup, HYROX), per the design's World Cup
 * feature-band screenshot. Data-driven so both scenarios share one layout.
 */
import { Trophy } from "lucide-react";
import { Tag } from "@/components/brand";
import { toolById } from "@/lib/catalog";
import type { ScenarioBand as ScenarioBandData } from "@/pages/home/scenario-bands-data";
import { PrimaryLink } from "@/pages/home/shared";

export function ScenarioBand({ band }: { band: ScenarioBandData }) {
  return (
    <section
      id={band.id}
      className="sa-anchor"
      style={{ position: "relative", borderBottom: "1px solid var(--border)", overflow: "hidden" }}
    >
      {band.backgroundImage && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src={band.backgroundImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, var(--canvas) 28%, rgba(13,15,20,0.7) 70%, rgba(13,15,20,0.45))",
            }}
          />
        </div>
      )}
      <div className="sa-container" style={{ position: "relative", zIndex: 1, paddingTop: 64, paddingBottom: 72 }}>
        <div style={{ maxWidth: 620 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--signal-green)",
            }}
          >
            <Trophy size={15} /> {band.eyebrow}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 44,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
              color: "var(--fg-1)",
            }}
          >
            {band.titleLines[0]}
            <br />
            {band.titleLines[1]}
          </h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "var(--fg-2)", margin: "0 0 28px" }}>{band.description}</p>

          <div style={{ display: "flex", gap: 32, marginBottom: 28, flexWrap: "wrap" }}>
            {band.stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "var(--signal-green)", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--fg-3)", marginTop: 6 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-4)", marginBottom: 10 }}
          >
            {band.toolkitLabel}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {band.toolIds.map((toolId) => {
              const tool = toolById(toolId);
              if (!tool) return null;
              return <Tag key={toolId}>{tool.title}</Tag>;
            })}
          </div>

          <PrimaryLink href={band.ctaHref}>{band.ctaLabel}</PrimaryLink>
        </div>
      </div>
    </section>
  );
}
