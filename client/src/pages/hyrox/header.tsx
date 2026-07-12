/**
 * HYROX Zone — sticky header: nav row (logo/wordmark → / → solid green
 * "HYROX ZONE" breadcrumb chip, zone anchor links, Star button) + the
 * zone's own LIVE ticker feed.
 */
import { Star } from "lucide-react";
import { Link } from "wouter";

import { LiveTicker } from "@/components/live-ticker";
import { hyroxTicker } from "@/data/hyrox-zone";
import { asset, REPO } from "@/pages/home-data";
import { PrimaryLink, Wordmark } from "@/pages/home/shared";

const LOGO = asset("logo-icon.webp");

const NAV_LINKS: [string, string][] = [
  ["The Race", "race"],
  ["Tools", "tools"],
  ["Builder Path", "builder"],
  ["Data Drops", "calendar"],
];

export function ZoneHeader({ onNav }: { onNav: (id: string) => void }) {
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
        <div
          className="sa-container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src={LOGO} alt="Sports AI Hub" style={{ width: 28, height: 28 }} />
              <Wordmark />
            </Link>
            <span className="hidden sm:inline" style={{ color: "var(--fg-4)" }}>
              /
            </span>
            <span
              className="hidden sm:inline-flex"
              style={{
                alignItems: "center",
                gap: 7,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--canvas)",
                background: "var(--signal-green)",
                padding: "3px 9px",
                borderRadius: 4,
                whiteSpace: "nowrap",
              }}
            >
              HYROX ZONE
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 26 }}>
            {NAV_LINKS.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNav(id);
                }}
                className="nav-link hidden md:inline"
                style={{ fontSize: 14, color: "var(--fg-2)", textDecoration: "none", fontWeight: 500 }}
              >
                {label}
              </a>
            ))}
            <PrimaryLink href={REPO} size="sm">
              <Star size={15} /> Star on GitHub
            </PrimaryLink>
          </nav>
        </div>
      </div>

      <LiveTicker items={hyroxTicker} />
    </header>
  );
}
