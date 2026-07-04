/**
 * HYROX Zone — Data Drops: the Season 9 calendar framed as datasets
 * (results land on results.hyrox.com within hours of each race), with a
 * region filter. Below ~920px the note and region columns drop out.
 */
import { useState } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import { SectionHead } from "@/components/brand";
import {
  HYROX_RESULTS,
  hyroxCalendar,
  hyroxSeasonCaption,
  type HyroxRaceStatus,
} from "@/data/hyrox-zone";
import { filterHyroxCalendar, hyroxCalendarRegions } from "@/lib/hyrox-zone";
import { OutlineLink } from "@/pages/home/shared";
import { FilterPill } from "@/pages/hyrox/filter-pill";

const STATUS: Record<HyroxRaceStatus, { label: string; color: string; border: string }> = {
  "on-sale": { label: "ON SALE", color: "var(--signal-green)", border: "var(--green-a40)" },
  "coming-soon": { label: "COMING SOON", color: "var(--amber-alert)", border: "rgba(245, 158, 11, 0.4)" },
  "sold-out": { label: "SOLD OUT", color: "var(--fg-4)", border: "var(--border)" },
};

export function ZoneCalendar() {
  const [region, setRegion] = useState("All");
  const regions = hyroxCalendarRegions(hyroxCalendar);
  const rows = filterHyroxCalendar(hyroxCalendar, region);

  return (
    <section id="calendar" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="Data Drops · Season 9"
          icon={CalendarDays}
          title="Every race is a dataset"
          sub="Full splits for every athlete land on results.hyrox.com within hours of each event. Point your scrapers, notebooks, and race analysis here — or pick the race your 12-week block targets."
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "28px 0 24px" }}>
          {regions.map((r) => (
            <FilterPill key={r} label={r} active={r === region} onClick={() => setRegion(r)} />
          ))}
        </div>

        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          {rows.map((r, i) => (
            <div
              key={r.city + r.date}
              className="grid grid-cols-[92px_1fr_auto] min-[920px]:grid-cols-[110px_1fr_auto_auto]"
              style={{
                gap: 16,
                alignItems: "center",
                padding: "14px 18px",
                background: i % 2 ? "var(--canvas-raised)" : "var(--canvas)",
                borderTop: i === 0 ? "none" : "1px solid var(--border)",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--signal-green)", fontWeight: 600 }}>
                {r.date}
              </span>
              <span style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 0, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--fg-1)" }}>
                  {r.city}
                </span>
                <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{r.country}</span>
                {r.note && (
                  <span
                    className="hidden min-[920px]:inline"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-4)" }}
                  >
                    — {r.note}
                  </span>
                )}
              </span>
              <span
                className="hidden min-[920px]:inline"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-3)" }}
              >
                {r.region}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: STATUS[r.status].color,
                  border: `1px solid ${STATUS[r.status].border}`,
                  borderRadius: "var(--radius-pill)",
                  padding: "3px 10px",
                  justifySelf: "end",
                  whiteSpace: "nowrap",
                }}
              >
                {STATUS[r.status].label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
          <OutlineLink href={HYROX_RESULTS}>
            Results portal <ArrowUpRight size={14} />
          </OutlineLink>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-4)" }}>{hyroxSeasonCaption}</span>
        </div>
      </div>
    </section>
  );
}
