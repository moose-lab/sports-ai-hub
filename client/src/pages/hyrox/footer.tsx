/**
 * HYROX Zone — footer: back-to-hub, repo, official HYROX, and the
 * not-affiliated disclaimer.
 */
import { Link } from "wouter";

import { HYROX_OFFICIAL } from "@/data/hyrox-zone";
import { asset, REPO } from "@/pages/home-data";
import { Wordmark } from "@/pages/home/shared";

const LOGO = asset("logo-icon.webp");

export function ZoneFooter() {
  return (
    <footer>
      <div
        className="sa-container"
        style={{
          paddingTop: 40,
          paddingBottom: 48,
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={LOGO} alt="" style={{ width: 24, height: 24 }} />
          <Wordmark size={16} />
          <span style={{ color: "var(--fg-4)" }}>·</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-3)" }}>HYROX Zone</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 14, flexWrap: "wrap" }}>
          <Link href="/" className="nav-link" style={{ color: "var(--fg-3)", textDecoration: "none" }}>
            Back to the Hub
          </Link>
          {(
            [
              ["GitHub", REPO],
              ["Official HYROX", HYROX_OFFICIAL],
            ] as [string, string][]
          ).map(([label, url]) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ color: "var(--fg-3)", textDecoration: "none" }}
            >
              {label}
            </a>
          ))}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-4)" }}>
          Not affiliated with HYROX · Curated in the open · 2026
        </div>
      </div>
    </footer>
  );
}
