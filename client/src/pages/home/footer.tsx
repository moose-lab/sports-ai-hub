import { Link } from "wouter";
import { asset, REPO } from "@/pages/home-data";
import { Wordmark } from "@/pages/home/shared";

const LOGO = asset("logo-icon.webp");
const AWESOME = REPO;

const links: [string, string][] = [
  ["GitHub", REPO],
  ["Contributing", `${AWESOME}/blob/main/CONTRIBUTING.md`],
  ["License · CC0", `${AWESOME}/blob/main/LICENSE`],
];

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div
        className="sa-container"
        style={{ paddingTop: 40, paddingBottom: 48, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src={LOGO} alt="" style={{ width: 24, height: 24 }} />
          <Wordmark size={16} />
          <span style={{ color: "var(--fg-4)" }}>·</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-3)" }}>awesome-sports-ai</span>
        </Link>
        <div style={{ display: "flex", gap: 24, fontSize: 14, flexWrap: "wrap" }}>
          {links.map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: "var(--fg-3)", textDecoration: "none" }}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-4)" }}>Curated in the open · 2026</div>
      </div>
    </footer>
  );
}
