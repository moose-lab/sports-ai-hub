/**
 * Sports AI Hub — sport-scene zone page (/sports/:slug).
 * Fully data-driven from the catalog's `scenes` collection (the structured
 * mirror of awesome-sports-ai's docs/sports/<slug>.md guides). HYROX is the
 * first seeded scene; adding another sport zone is a pure upstream data
 * change — no code here.
 */
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  FlaskConical,
  Github,
  Hammer,
  MapPin,
  Star,
} from "lucide-react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Terminal } from "@/components/brand";
import {
  type CatalogScene,
  type CatalogSceneSection,
  sceneBySlug,
  toolById,
} from "@/lib/catalog";
import { asset, REPO } from "@/pages/home-data";
import { Footer } from "@/pages/home/footer";
import { OpennessBadge, PrimaryLink, ToolChip, Wordmark } from "@/pages/home/shared";
import { ToolDetailModal } from "@/pages/home/tool-detail-modal";
import NotFound from "@/pages/NotFound";

const LOGO = asset("logo-icon.webp");

const eyebrowStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--signal-green)",
};

const monoLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--fg-4)",
};

// ── Header (simplified sub-page header, green scene identity) ────────────────
function Header({ scene }: { scene: CatalogScene }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div
        style={{
          background: "rgba(13,15,20,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="sa-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src={LOGO} alt="Sports AI Hub" style={{ width: 26, height: 26 }} />
            <Wordmark />
            <span
              className="hidden sm:inline-block"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--signal-green)",
                border: "1px solid var(--green-a30)",
                background: "var(--green-a12)",
                padding: "2px 8px",
                borderRadius: 4,
                marginLeft: 4,
                whiteSpace: "nowrap",
              }}
            >
              {scene.title} Zone
            </span>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Link
              href="/"
              className="nav-link"
              style={{ fontSize: 14, color: "var(--fg-2)", textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <ArrowLeft size={14} /> Home
            </Link>
            <PrimaryLink href={REPO} size="sm">
              <Star size={15} /> Star
            </PrimaryLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ scene }: { scene: CatalogScene }) {
  const toolCount = new Set(
    scene.sections.flatMap((s) => [...s.toolIds, ...(s.crossDomainToolIds ?? [])]).concat(scene.firstToolId),
  ).size;
  const stats: [string, string][] = [
    [String(scene.sections.length), "Scenario tracks"],
    [String(toolCount), "Catalog tools"],
    [String(scene.gaps.length), "Open gaps to claim"],
  ];

  return (
    <section style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 56, paddingBottom: 48 }}>
        <div style={{ ...eyebrowStyle, marginBottom: 14 }}>
          <FlaskConical size={15} /> Sport Scene · {scene.sport}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 44,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            margin: "0 0 16px",
            color: "var(--fg-1)",
          }}
        >
          {scene.title} Zone
        </h1>
        <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "var(--fg-2)", maxWidth: 640, margin: "0 0 22px" }}>{scene.tagline}</p>
        <a
          href={`${REPO}/blob/main/${scene.guidePath}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            color: "var(--signal-green)",
            textDecoration: "none",
            padding: "3px 10px",
            border: "1px solid var(--green-a20)",
            background: "var(--green-a05)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          <BookOpen size={12} /> {scene.guidePath} <ArrowUpRight size={11} />
        </a>

        <div style={{ display: "flex", gap: 32, marginTop: 32, flexWrap: "wrap" }}>
          {stats.map(([value, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30, color: "var(--signal-green)", lineHeight: 1 }}>{value}</div>
              <div style={{ ...monoLabel, marginTop: 6, fontWeight: 500, fontSize: 11.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── First tool spotlight ─────────────────────────────────────────────────────
function FirstTool({ scene, onSelectTool }: { scene: CatalogScene; onSelectTool: (id: string) => void }) {
  const tool = toolById(scene.firstToolId);
  if (!tool) return null;
  return (
    <section style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 48, paddingBottom: 56 }}>
        <div style={{ ...monoLabel, marginBottom: 14 }}>First tool template — start here</div>
        <Card className="gap-0 p-[26px]">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--radius-md)",
                background: "var(--green-a10)",
                border: "1px solid var(--green-a20)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              <MapPin size={20} style={{ color: "var(--signal-green)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21, color: "var(--fg-1)" }}>{tool.title}</span>
                <OpennessBadge id={tool.openness} size="sm" />
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--fg-2)", margin: "0 0 18px", maxWidth: 640 }}>{tool.description}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {scene.liveAppUrl && (
                  <PrimaryLink href={scene.liveAppUrl}>
                    <ExternalLink size={15} /> Open live app
                  </PrimaryLink>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="border-[var(--border)] bg-transparent text-[var(--fg-2)] hover:bg-transparent hover:text-[var(--signal-green)] hover:border-[var(--green-a40)] dark:bg-transparent dark:border-[var(--border)] dark:hover:bg-transparent"
                >
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    <Github size={14} /> View source
                  </a>
                </Button>
                <Button variant="ghost" className="text-[var(--fg-2)] hover:text-[var(--signal-green)]" onClick={() => onSelectTool(tool.id)}>
                  View catalog entry
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ── Scenario sections ────────────────────────────────────────────────────────
function ScenarioSection({
  section,
  index,
  onSelectTool,
}: {
  section: CatalogSceneSection;
  index: number;
  onSelectTool: (id: string) => void;
}) {
  return (
    <div style={{ borderTop: index > 0 ? "1px solid var(--border)" : "none", paddingTop: index > 0 ? 44 : 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--green-a40)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--fg-1)", margin: 0 }}>{section.title}</h3>
        {section.titleZh && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13.5, color: "var(--fg-3)" }}>{section.titleZh}</span>
        )}
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--fg-2)", maxWidth: 700, margin: "0 0 18px" }}>{section.problem}</p>

      <div style={{ ...monoLabel, marginBottom: 8 }}>Catalog tools</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 20 }}>
        {section.toolIds.map((id) => {
          const tool = toolById(id);
          if (!tool) return null;
          return <ToolChip key={id} label={tool.title} onClick={() => onSelectTool(id)} />;
        })}
        {(section.crossDomainToolIds ?? []).map((id) => {
          const tool = toolById(id);
          if (!tool) return null;
          return (
            <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ToolChip label={tool.title} onClick={() => onSelectTool(id)} />
              <Badge variant="amber">Cross-domain</Badge>
            </span>
          );
        })}
      </div>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-[1fr_1fr]" style={{ gap: 20, alignItems: "start" }}>
        <Terminal
          lines={[
            { comment: "Starter build" },
            { text: `Input:  ${section.starterBuild.input}` },
            { text: `Output: ${section.starterBuild.output}` },
          ]}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            background: "var(--canvas-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <FlaskConical size={16} style={{ color: "var(--signal-green)", flex: "none" }} />
          <div style={{ fontSize: 13.5, color: "var(--fg-2)", lineHeight: 1.5 }}>
            Prototype direction:{" "}
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--signal-green)" }}>{section.starterBuild.prototypeDirection}</span> in{" "}
            <a href={`${REPO}/tree/main/prototypes`} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: "var(--fg-3)" }}>
              /prototypes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Gaps: tools yet to be built ──────────────────────────────────────────────
const issueUrl = (title: string) => `${REPO}/issues/new?title=${encodeURIComponent(title)}`;

function Gaps({ scene }: { scene: CatalogScene }) {
  if (scene.gaps.length === 0) return null;
  return (
    <section style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div style={{ ...eyebrowStyle, marginBottom: 12 }}>
          <Hammer size={15} /> Gaps · Tools yet to be built
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", margin: "0 0 8px", color: "var(--fg-1)" }}>
          Claim a {scene.title} gap
        </h2>
        <p style={{ fontSize: 15, color: "var(--fg-2)", lineHeight: 1.6, maxWidth: 640, margin: "0 0 24px" }}>
          These are the {scene.sport} tools the catalog still needs — each one is a concrete, scoped prototype. Claim one and it becomes your first
          contribution.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
          {scene.gaps.map((gap) => (
            <a key={gap.id} href={issueUrl(`feat: [${scene.sport}] ${gap.title}`)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <Card
                className="h-full gap-0 p-[18px] transition-colors hover:border-[var(--green-a40)]"
                style={{ border: "1px dashed var(--border-strong)", background: "transparent" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15.5, color: "var(--fg-1)" }}>{gap.title}</span>
                  <ArrowUpRight size={14} style={{ color: "var(--fg-3)", flex: "none" }} />
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.6, color: "var(--fg-3)", margin: "0 0 12px" }}>{gap.description}</p>
                <span style={{ ...monoLabel, color: "var(--signal-green)" }}>Claim it →</span>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SportScene({ params }: { params: { slug: string } }) {
  const scene = sceneBySlug(params.slug);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  if (!scene) return <NotFound />;

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh" }}>
      <Header scene={scene} />
      <Hero scene={scene} />
      <FirstTool scene={scene} onSelectTool={setSelectedToolId} />

      <section style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="sa-container" style={{ paddingTop: 56, paddingBottom: 64 }}>
          <div style={{ ...eyebrowStyle, marginBottom: 12 }}>
            <ArrowRight size={15} /> Scenario tracks
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", margin: "0 0 36px", color: "var(--fg-1)" }}>
            From {scene.sport} workflows to runnable tools
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
            {scene.sections.map((section, i) => (
              <ScenarioSection key={section.id} section={section} index={i} onSelectTool={setSelectedToolId} />
            ))}
          </div>
        </div>
      </section>

      <Gaps scene={scene} />
      <Footer />
      <ToolDetailModal toolId={selectedToolId} onClose={() => setSelectedToolId(null)} />
    </div>
  );
}
