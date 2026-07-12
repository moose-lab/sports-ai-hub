/**
 * HYROX Zone — race explainer: "Run. Work. Repeat — ×8."
 * An interactive course strip — 8 × (1 km run → workout station) — that
 * auto-plays through the 16 segments (1600ms each, looping). Clicking any
 * segment selects it and pauses; the detail card below explains the segment
 * and links the directory tools that train it ("train it with", resolved by
 * name). Station facts follow the official race format at the standardized
 * Open-men loads.
 *
 * Auto-advance starts paused for prefers-reduced-motion visitors.
 */
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowBigLeft,
  ArrowBigRight,
  ChevronsRight,
  Flag,
  Footprints,
  Grip,
  Pause,
  Play,
  Target,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";

import { SectionHead } from "@/components/brand";
import { Card } from "@/components/ui/card";
import {
  hyroxCategories,
  hyroxIntro,
  hyroxRun,
  hyroxStations,
  type HyroxStationIcon,
} from "@/data/hyrox-zone";
import { buildRaceSequence, hyroxToolsByName } from "@/lib/hyrox-zone";
import { KindTag } from "@/pages/hyrox/kind-tag";

const STATION_ICON: Record<HyroxStationIcon, LucideIcon> = {
  wind: Wind,
  "arrow-big-right": ArrowBigRight,
  "arrow-big-left": ArrowBigLeft,
  activity: Activity,
  waves: Waves,
  grip: Grip,
  footprints: Footprints,
  target: Target,
};

const SEQ = buildRaceSequence(hyroxStations);
const TOOL_BY_NAME = hyroxToolsByName(hyroxCategories);
const ADVANCE_MS = 1600;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** 2×2 "what is HYROX" fact tiles, right of the section head. */
function FactTiles() {
  return (
    <div className="grid grid-cols-2" style={{ gap: 10 }}>
      {hyroxIntro.facts.map(f => (
        <div
          key={f.k}
          style={{
            padding: "12px 14px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            background: "var(--canvas)",
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              color: "var(--signal-green)",
              lineHeight: 1,
            }}
          >
            {f.k}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--fg-3)",
              marginTop: 6,
              lineHeight: 1.4,
            }}
          >
            {f.v}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The tools/datasets/models that train the active segment, linked. */
function TrainWith({ names }: { names: string[] }) {
  return (
    <div style={{ flex: "0 1 280px", minWidth: 220 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "var(--fg-3)",
          marginBottom: 10,
        }}
      >
        TRAIN IT WITH
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {names.map(name => {
          const tool = TOOL_BY_NAME.get(name);
          return (
            <a
              key={name}
              href={tool?.url ?? "#tools"}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                color: "var(--fg-1)",
                padding: "7px 10px",
                background: "var(--canvas-terminal)",
                border: "1px solid var(--border)",
                borderRadius: 4,
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </span>
              {tool && (
                <span style={{ marginLeft: "auto", display: "inline-flex" }}>
                  <KindTag kind={tool.kind} />
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function ZoneRaceExplainer() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(
      () => setIdx(i => (i + 1) % SEQ.length),
      ADVANCE_MS
    );
    return () => window.clearInterval(t);
  }, [paused]);

  const select = (i: number) => {
    setIdx(i);
    setPaused(true);
  };

  const seg = SEQ[idx];
  const detail =
    seg.type === "run"
      ? {
          icon: STATION_ICON[hyroxRun.icon],
          title: `Run ${seg.runNumber} of 8`,
          spec: hyroxRun.spec,
          what: hyroxRun.what,
          train: hyroxRun.train,
        }
      : {
          icon: STATION_ICON[seg.station.icon],
          title: `Station ${seg.station.n} — ${seg.station.name}`,
          spec: seg.station.spec,
          what: seg.station.what,
          train: seg.station.train,
        };
  const DetailIcon = detail.icon;

  return (
    <section
      id="race"
      style={{
        background: "var(--canvas-raised)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="sa-container"
        style={{ paddingTop: 64, paddingBottom: 72 }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            alignItems: "end",
            justifyContent: "space-between",
          }}
        >
          <SectionHead
            eyebrow="What is HYROX"
            icon={Flag}
            title="Run. Work. Repeat — ×8."
            sub={hyroxIntro.body}
          />
          <FactTiles />
        </div>

        <div style={{ marginTop: 44 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.14em",
                color: "var(--fg-3)",
              }}
            >
              THE COURSE · {hyroxIntro.tagline} · CLICK ANY SEGMENT
            </span>
            <button
              type="button"
              onClick={() => setPaused(p => !p)}
              aria-label={
                paused
                  ? "Play the course animation"
                  : "Pause the course animation"
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-pill)",
                color: "var(--fg-2)",
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                padding: "5px 12px",
                cursor: "pointer",
              }}
            >
              {paused ? <Play size={12} /> : <Pause size={12} />}{" "}
              {paused ? "PLAY" : "PAUSE"}
            </button>
          </div>

          {/* The course strip — 17 cells: 8 × (run → station) + the finish flag. */}
          <div style={{ display: "flex", gap: 4, alignItems: "stretch" }}>
            {SEQ.map((sg, i) => {
              const active = i === idx;
              if (sg.type === "run") {
                const passed = i < idx;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => select(i)}
                    title="Run 1,000 m"
                    style={{
                      flex: "1 1 0",
                      minWidth: 0,
                      cursor: "pointer",
                      border: "none",
                      borderRadius: 4,
                      padding: 0,
                      height: 64,
                      background: active
                        ? "var(--signal-green)"
                        : passed
                          ? "var(--green-a20)"
                          : "var(--canvas-terminal)",
                      outline: active ? "none" : "1px solid var(--border)",
                      outlineOffset: -1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background var(--dur-base) ease",
                    }}
                  >
                    <ChevronsRight
                      size={14}
                      style={{
                        color: active ? "var(--canvas)" : "var(--fg-4)",
                      }}
                    />
                  </button>
                );
              }
              const StationIcon = STATION_ICON[sg.station.icon];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(i)}
                  title={`${sg.station.name} · ${sg.station.spec}`}
                  style={{
                    flex: "2.2 1 0",
                    minWidth: 0,
                    cursor: "pointer",
                    borderRadius: 4,
                    height: 64,
                    padding: "0 4px",
                    background: "var(--canvas)",
                    border: active
                      ? "1px solid var(--signal-green)"
                      : "1px solid var(--border)",
                    boxShadow: active
                      ? "0 0 0 1px var(--signal-green)"
                      : "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    transition:
                      "border-color var(--dur-base) ease, box-shadow var(--dur-base) ease",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        fontWeight: 700,
                        color: active ? "var(--signal-green)" : "var(--fg-4)",
                      }}
                    >
                      {String(sg.station.n).padStart(2, "0")}
                    </span>
                    <StationIcon
                      size={14}
                      style={{
                        color: active ? "var(--signal-green)" : "var(--fg-2)",
                        flex: "none",
                      }}
                    />
                  </span>
                  <span
                    className="hidden min-[900px]:block"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.02em",
                      color: active ? "var(--fg-1)" : "var(--fg-3)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    {sg.station.name}
                  </span>
                </button>
              );
            })}
            <div
              style={{
                flex: "0.8 1 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                background: "var(--canvas-terminal)",
                outline: "1px solid var(--green-a20)",
                outlineOffset: -1,
              }}
            >
              <Flag size={15} style={{ color: "var(--signal-green)" }} />
            </div>
          </div>

          {/* Detail card for the active segment. */}
          <Card
            className="gap-0"
            style={{
              marginTop: 16,
              padding: 24,
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "flex-start",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                flex: "none",
                borderRadius: "var(--radius-md)",
                background: "var(--canvas-terminal)",
                border: "1px solid var(--green-a20)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DetailIcon size={24} style={{ color: "var(--signal-green)" }} />
            </div>
            <div style={{ flex: "1 1 340px", minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "var(--fg-1)",
                    margin: 0,
                  }}
                >
                  {detail.title}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--signal-green)",
                    fontWeight: 600,
                  }}
                >
                  {detail.spec}
                </span>
              </div>
              <p
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: "var(--fg-2)",
                  margin: "10px 0 0",
                  maxWidth: 560,
                }}
              >
                {detail.what}
              </p>
            </div>
            <TrainWith names={detail.train} />
          </Card>
        </div>
      </div>
    </section>
  );
}
