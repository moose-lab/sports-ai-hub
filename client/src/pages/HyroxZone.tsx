/**
 * Sports AI Hub — HYROX Zone (/hyrox).
 * A tools-first sport-scenario page, not a race-introduction page: the
 * official race film opens the page (video-first hero), the animated race
 * explainer shows the 8 × (run → station) course, persona entries jump
 * straight into the audience-filtered directory, and the Season 9 calendar
 * is framed as data drops. Recreated from the HYROX Zone v2 design handoff;
 * content lives in @/data/hyrox-zone.
 *
 * The audience filter is page-level state so the hero's persona cards can
 * set it and scroll to #tools in one click.
 */
import { useState } from "react";

import type { HyroxAudienceFilter } from "@/data/hyrox-zone";
import { scrollAnchorIntoView } from "@/lib/scroll-anchor";
import { ZoneBuilderPath } from "@/pages/hyrox/builder-path";
import { ZoneCalendar } from "@/pages/hyrox/calendar";
import { ZoneDirectory } from "@/pages/hyrox/directory";
import { ZoneFooter } from "@/pages/hyrox/footer";
import { ZoneHeader } from "@/pages/hyrox/header";
import { ZoneHero } from "@/pages/hyrox/hero";
import { ZoneRaceExplainer } from "@/pages/hyrox/race-explainer";

/** Zone sticky header = 60px nav + 42px ticker (no Today bar) + breathing room. */
const ZONE_ANCHOR_OFFSET_PX = 60 + 42 + 8;

export default function HyroxZone() {
  const [aud, setAud] = useState<HyroxAudienceFilter>("All");

  const onNav = (id: string) => scrollAnchorIntoView(id, ZONE_ANCHOR_OFFSET_PX);

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh" }}>
      <ZoneHeader onNav={onNav} />
      <ZoneHero
        onPersona={(a) => {
          setAud(a);
          onNav("tools");
        }}
      />
      <ZoneRaceExplainer />
      <ZoneDirectory aud={aud} setAud={setAud} />
      <ZoneBuilderPath />
      <ZoneCalendar />
      <ZoneFooter />
    </div>
  );
}
