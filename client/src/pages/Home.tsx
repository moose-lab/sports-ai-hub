/**
 * Sports AI Hub — Home (landing page)
 * Design: "Signal & Pitch" — Broadcast Brutalism
 * Dark canvas #0D0F14 · Electric Signal Green #00FF87
 * Fonts: Space Grotesk (display) · Inter (body) · JetBrains Mono (code)
 *
 * The tool directory (categories, tools, sport/capability/openness tags,
 * recipes) is real data from `@/lib/catalog`, synced at build time from
 * awesome-sports-ai's data/catalog.json — see scripts/sync-catalog.mjs.
 * Nothing about it is hand-typed here.
 *
 * Sections, top to bottom: sticky header + LIVE ticker (+ the existing,
 * untouched World Cup "Today's matches" bar), hero, Quick Start, featured
 * bands (World Cup, the HYROX Zone entry), Popular Scenarios, tool
 * directory, Builder's Path, runnable prototypes, contribute, footer — plus
 * a Tool Detail Modal any section can open.
 */

import { useState } from "react";

import { useWorldCup } from "@/hooks/useWorldCup";
import { scrollAnchorIntoView } from "@/lib/scroll-anchor";
import { BuilderPath } from "@/pages/home/builder-path";
import { Contribute } from "@/pages/home/contribute";
import { Directory } from "@/pages/home/directory";
import { Footer } from "@/pages/home/footer";
import { Header } from "@/pages/home/header";
import { Hero } from "@/pages/home/hero";
import { HyroxZoneBand } from "@/pages/home/hyrox-zone-band";
import { Prototypes } from "@/pages/home/prototypes";
import { QuickStart } from "@/pages/home/quick-start";
import { ScenarioBand } from "@/pages/home/scenario-band";
import { scenarioBands } from "@/pages/home/scenario-bands-data";
import { ScenarioSpotlight } from "@/pages/home/scenario-spotlight";
import { ToolDetailModal } from "@/pages/home/tool-detail-modal";

export default function Home() {
  const [query, setQuery] = useState("");
  const [categoryFocus, setCategoryFocus] = useState<string | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const wc = useWorldCup();

  const onNav = scrollAnchorIntoView;

  const jumpToCategory = (categoryId: string) => {
    setCategoryFocus(categoryId);
    onNav("directory");
  };

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh" }}>
      <Header onNav={onNav} onJumpCategory={jumpToCategory} todayMatches={wc.data?.today ?? []} />
      <Hero query={query} setQuery={setQuery} />
      <QuickStart onPick={jumpToCategory} />
      {scenarioBands.map((band) => (
        <ScenarioBand key={band.id} band={band} />
      ))}
      <HyroxZoneBand />
      <ScenarioSpotlight onSelectTool={setSelectedToolId} onNav={onNav} />
      <Directory
        query={query}
        categoryFocus={categoryFocus}
        setCategoryFocus={setCategoryFocus}
        onSelectTool={setSelectedToolId}
      />
      <BuilderPath onSelectTool={setSelectedToolId} />
      <Prototypes onSelectTool={setSelectedToolId} />
      <Contribute />
      <Footer />
      <ToolDetailModal toolId={selectedToolId} onClose={() => setSelectedToolId(null)} />
    </div>
  );
}
