/**
 * Sports AI Hub — Prototype Factory.
 * All 4 runnable prototypes (HYROX Gym Finder lives in its own repo, has no
 * preview image, and skips the `cd prototypes/<id>` step since there's no
 * such subfolder in its repo).
 */
import { useState } from "react";
import { ArrowRight, FlaskConical, Github, MapPin, Target, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SectionHead, Terminal, type TerminalLine } from "@/components/brand";
import { prototypes, type Prototype } from "@/pages/home/prototypes-data";
import { PrimaryLink } from "@/pages/home/shared";

const AWESOME = "https://github.com/moose-lab/awesome-sports-ai";

function cloneLines(p: Prototype): TerminalLine[] {
  const cloneUrl = p.externalRepo ? p.sourceUrl.replace("https://github.com/", "github.com/") : "github.com/moose-lab/awesome-sports-ai";
  const lines: TerminalLine[] = [{ comment: "Clone and run" }, { cmd: true, text: `git clone ${cloneUrl}` }];
  if (!p.externalRepo) lines.push({ cmd: true, text: `cd prototypes/${p.id}` });
  lines.push({ cmd: true, text: p.cmd });
  return lines;
}

export function Prototypes({ onSelectTool }: { onSelectTool: (id: string) => void }) {
  const [sport, setSport] = useState("All");
  const [sportOpen, setSportOpen] = useState(false);
  const [active, setActive] = useState(0);

  const sports = ["All", ...Array.from(new Set(prototypes.map((p) => p.sport)))];
  const visible = prototypes.filter((p) => sport === "All" || p.sport === sport);
  const activeId = prototypes[active]?.id;
  const shownActive = Math.max(0, visible.findIndex((p) => p.id === activeId));
  const p = visible[shownActive] ?? prototypes[0];

  const pickSport = (s: string) => {
    setSport(s);
    const firstMatch = prototypes.findIndex((pp) => s === "All" || pp.sport === s);
    if (firstMatch >= 0) setActive(firstMatch);
  };

  return (
    <section id="prototypes" className="sa-anchor" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="Phase 6 · Runnable"
          icon={FlaskConical}
          title={`${prototypes.length} prototypes you can run today`}
          sub="Each decomposes an enterprise-grade capability into one script, one input, one output — runnable in under 5 minutes."
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "28px 0 12px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setSportOpen((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              padding: "7px 14px",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              background: sportOpen || sport !== "All" ? "var(--signal-green)" : "transparent",
              color: sportOpen || sport !== "All" ? "var(--canvas)" : "var(--fg-2)",
              border: sportOpen || sport !== "All" ? "1px solid var(--signal-green)" : "1px solid var(--border)",
              fontWeight: 600,
            }}
          >
            <Trophy size={13} /> Browse by sport{sport !== "All" ? `: ${sport}` : ""}
          </button>
          {sport !== "All" && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-4)" }}>
              {visible.length} of {prototypes.length}
            </span>
          )}
        </div>

        {sportOpen && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {sports.map((s) => (
              <button
                key={s}
                onClick={() => pickSport(s)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "5px 12px",
                  borderRadius: "var(--radius-pill)",
                  cursor: "pointer",
                  background: s === sport ? "var(--signal-green)" : "transparent",
                  color: s === sport ? "var(--canvas)" : "var(--fg-2)",
                  border: s === sport ? "1px solid var(--signal-green)" : "1px solid var(--border)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 0 28px" }}>
          {visible.map((pp) => {
            const globalIndex = prototypes.findIndex((x) => x.id === pp.id);
            const isActive = globalIndex === active;
            return (
              <button
                key={pp.id}
                onClick={() => setActive(globalIndex)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  padding: "8px 16px",
                  borderRadius: "var(--radius-pill)",
                  cursor: "pointer",
                  transition: "all var(--dur-base) ease",
                  background: isActive ? "var(--signal-green)" : "var(--canvas-card)",
                  color: isActive ? "var(--canvas)" : "var(--fg-2)",
                  border: isActive ? "1px solid var(--signal-green)" : "1px solid var(--border)",
                }}
              >
                {pp.title}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 min-[920px]:grid-cols-2 gap-7 items-start">
          <div style={{ position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border)", aspectRatio: "16 / 9" }}>
            {p.image ? (
              <>
                <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,15,20,0.9), transparent 55%)" }} />
                <div style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--signal-green)", background: "rgba(10,12,16,0.8)", border: "1px solid var(--green-a20)", borderRadius: 6, padding: "8px 12px" }}>
                    <span style={{ color: "var(--fg-4)" }}># </span>
                    {p.highlight}
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "var(--canvas-terminal)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <MapPin size={28} style={{ color: "var(--fg-4)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg-3)" }}>
                  hosted in its own repo — no preview image yet
                </span>
              </div>
            )}
          </div>

          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <Badge variant="signal">{p.tag}</Badge>
              <Badge variant="slate">{p.sport}</Badge>
              {p.externalRepo && <Badge variant="amber">External repo</Badge>}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--fg-1)", margin: "0 0 12px" }}>
              {p.title}
            </h3>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--fg-2)", margin: "0 0 16px" }}>{p.desc}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, fontFamily: "var(--font-mono)", fontSize: 13.5 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--fg-2)" }}>
                <Target size={14} style={{ color: "var(--amber-alert)", flex: "none" }} /> Replaces: {p.capability}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--fg-2)" }}>
                <ArrowRight size={14} style={{ color: "var(--signal-green)", flex: "none" }} /> {p.io}
              </span>
            </div>

            <Terminal style={{ marginBottom: 20 }} lines={cloneLines(p)} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <PrimaryLink href={p.sourceUrl}>
                <Github size={16} /> View source
              </PrimaryLink>
              <button
                type="button"
                onClick={() => onSelectTool(p.id)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: "var(--fg-2)",
                  background: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "0 14px",
                  height: 36,
                  cursor: "pointer",
                }}
              >
                View catalog entry
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-4)" }}>
          Prototypes live in <a href={`${AWESOME}/tree/main/prototypes`} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: "var(--fg-3)" }}>awesome-sports-ai/prototypes</a>.
        </div>
      </div>
    </section>
  );
}
