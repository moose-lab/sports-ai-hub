/**
 * Sports AI Hub — "Signal & Pitch" brand primitives.
 * Small components for the design-system pieces that have no shadcn
 * equivalent (PhaseBadge, PulseDot, Terminal, Tag, StatCard) plus the
 * SectionHead helper. They lean on the utility classes in index.css.
 */

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ── PulseDot ───────────────────────────────────────────────── */
export function PulseDot({ className }: { className?: string }) {
  return <span className={cn("pulse-dot", className)} aria-hidden />;
}

/* ── PhaseBadge ─────────────────────────────────────────────── */
type PhaseStatus = "active" | "upcoming" | "planned";

export function PhaseBadge({
  status,
  live = false,
  children,
}: {
  status: PhaseStatus;
  live?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("phase-badge", `phase-badge-${status}`)}>
      {live && <PulseDot />}
      {children}
    </span>
  );
}

/* ── Tag ────────────────────────────────────────────────────── */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--fg-2)",
        background: "var(--canvas-terminal)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        padding: "4px 10px",
      }}
    >
      {children}
    </span>
  );
}

/* ── Terminal ───────────────────────────────────────────────── */
export type TerminalLine =
  | { comment: string }
  | { cmd: true; text: string }
  | { text: string };

export function Terminal({
  lines,
  className,
  style,
}: {
  lines: TerminalLine[];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("terminal", className)} style={style}>
      <div className="terminal-content">
        {lines.map((line, i) => {
          if ("comment" in line) {
            return (
              <div key={i} className="comment">
                # {line.comment}
              </div>
            );
          }
          if ("cmd" in line) {
            return (
              <div key={i} className="cmd">
                $ {line.text}
              </div>
            );
          }
          return <div key={i}>{line.text}</div>;
        })}
      </div>
    </div>
  );
}

/* ── StatCard (count-up on view) ────────────────────────────── */
function parseStat(value: string) {
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!match) return { prefix: "", num: NaN, suffix: "", decimals: 0 };
  const [, prefix, rawNum, suffix] = match;
  const decimals = rawNum.includes(".") ? rawNum.split(".")[1].length : 0;
  return { prefix, num: Number(rawNum.replace(/,/g, "")), suffix, decimals };
}

export function StatCard({ value, label }: { value: string; label: string }) {
  const { prefix, num, suffix, decimals } = parseStat(value);
  const ref = React.useRef<HTMLDivElement>(null);
  const [display, setDisplay] = React.useState(() =>
    Number.isNaN(num) ? value : `${prefix}0${suffix}`
  );

  React.useEffect(() => {
    if (Number.isNaN(num)) return;
    const node = ref.current;
    if (!node) return;

    const settle = () =>
      setDisplay(`${prefix}${num.toFixed(decimals)}${suffix}`);

    if (prefersReducedMotion()) {
      settle();
      return;
    }

    let raf = 0;
    let start = 0;
    const duration = 1200;

    const run = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = num * eased;
      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(run);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          raf = requestAnimationFrame(run);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [num, prefix, suffix, decimals]);

  return (
    <div
      ref={ref}
      style={{
        background: "var(--canvas-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 34,
          lineHeight: 1,
          color: "var(--fg-1)",
        }}
      >
        {display}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--fg-3)",
          marginTop: 10,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── SectionHead ────────────────────────────────────────────── */
export function SectionHead({
  eyebrow,
  icon: Icon,
  title,
  sub,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  sub: string;
}) {
  return (
    <div style={{ maxWidth: 640 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--signal-green)",
        }}
      >
        <Icon size={15} /> {eyebrow}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 38,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          margin: "0 0 14px",
          color: "var(--fg-1)",
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 16.5, lineHeight: 1.6, color: "var(--fg-2)", margin: 0 }}>
        {sub}
      </p>
    </div>
  );
}
