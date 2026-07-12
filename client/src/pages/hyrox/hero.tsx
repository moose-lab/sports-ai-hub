/**
 * HYROX Zone — hero, film first: the official race-format film full-width
 * under the ticker, then "The HYROX toolbox." copy and the persona entry
 * cards below it. Each persona card is a button: click sets the directory's
 * audience filter and scrolls to #tools. All counts are derived from the data.
 */
import { Clapperboard, ClipboardList, Code, Timer, type LucideIcon } from "lucide-react";

import { PhaseBadge } from "@/components/brand";
import { Card } from "@/components/ui/card";
import { hyroxCategories, hyroxPersonas, type HyroxAudience, type HyroxPersona } from "@/data/hyrox-zone";
import { toolCountForAudience } from "@/lib/hyrox-zone";
import { ZoneHeroFilm } from "@/pages/hyrox/hero-film";

const PERSONA_ICON: Record<HyroxAudience, LucideIcon> = {
  Builders: Code,
  Athletes: Timer,
  Coaches: ClipboardList,
  Creators: Clapperboard,
};

const totalTools = hyroxCategories.flatMap((c) => c.tools).length;

function PersonaCard({ persona, onClick }: { persona: HyroxPersona; onClick: () => void }) {
  const Icon = PERSONA_ICON[persona.aud];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group"
      style={{ textAlign: "left", cursor: "pointer", background: "none", border: "none", padding: 0 }}
    >
      <Card className="h-full gap-0 p-5 transition-colors duration-200 group-hover:border-[var(--green-a40)]">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <Icon size={20} style={{ color: "var(--signal-green)" }} />
          <span
            className="text-[var(--fg-4)] transition-colors duration-200 group-hover:text-[var(--signal-green)]"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11.5 }}
          >
            {toolCountForAudience(hyroxCategories, persona.aud)} tools →
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--fg-1)", marginBottom: 8 }}>
          {persona.title}
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--fg-2)", margin: 0 }}>{persona.need}</p>
      </Card>
    </button>
  );
}

export function ZoneHero({ onPersona }: { onPersona: (aud: HyroxAudience) => void }) {
  return (
    <section id="top" style={{ borderBottom: "1px solid var(--border)" }}>
      {/* The film — first thing on screen, nothing on or around it. */}
      <ZoneHeroFilm />

      {/* Copy below the film. */}
      <div className="sa-container" style={{ paddingTop: 48, paddingBottom: 56 }}>
        <div style={{ maxWidth: 780 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
            <PhaseBadge status="active" live>
              Sport Zone · 01
            </PhaseBadge>
            <PhaseBadge status="upcoming">
              {totalTools} tools · {hyroxCategories.length} categories
            </PhaseBadge>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(36px, 5.5vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: "0 0 18px",
              color: "var(--fg-1)",
            }}
          >
            The HYROX <span style={{ color: "var(--signal-green)" }}>toolbox.</span>
          </h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, color: "var(--fg-2)", maxWidth: 620, margin: 0 }}>
            That's the race — 1 km run, one workout station, ×8, identical in every city. Everything below is a
            real, reachable tool, dataset, or model for improving HYROX performance. Pick who you are and start
            filtering.
          </p>
        </div>

        <div
          className="grid grid-cols-1 min-[560px]:grid-cols-2 min-[1080px]:grid-cols-4"
          style={{ gap: 14, marginTop: 40 }}
        >
          {hyroxPersonas.map((p) => (
            <PersonaCard key={p.aud} persona={p} onClick={() => onPersona(p.aud)} />
          ))}
        </div>
      </div>
    </section>
  );
}
