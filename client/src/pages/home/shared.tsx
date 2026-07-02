/**
 * Small shared pieces used across the landing page's sections.
 */
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OPENNESS_BADGE_VARIANT, OPENNESS_LABEL } from "@/lib/catalog";

export function PrimaryLink({
  href,
  size = "default",
  children,
  onClick,
}: {
  href: string;
  size?: "sm" | "default";
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button asChild variant="default" size={size} className="hover:bg-[var(--signal-green-dim)]">
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    </Button>
  );
}

export function OutlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button
      asChild
      variant="outline"
      className="border-[var(--border)] bg-transparent text-[var(--fg-2)] hover:bg-transparent hover:text-[var(--signal-green)] hover:border-[var(--green-a40)] dark:bg-transparent dark:border-[var(--border)] dark:hover:bg-transparent"
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}

export const Wordmark = ({ size = 17 }: { size?: number }) => (
  <span
    style={{
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: size,
      color: "var(--fg-1)",
      letterSpacing: "-0.01em",
    }}
  >
    Sports<span style={{ color: "var(--signal-green)" }}>AI</span>Hub
  </span>
);

/** Badge showing a tool's openness — the "can I actually use this for free?" signal. */
export function OpennessBadge({ id, size = "default" }: { id: string; size?: "default" | "sm" }) {
  const variant = OPENNESS_BADGE_VARIANT[id] ?? "slate";
  const label = OPENNESS_LABEL[id] ?? id;
  return (
    <Badge variant={variant} className={size === "sm" ? "text-[10.5px] px-1.5 py-0.5" : undefined}>
      {label}
    </Badge>
  );
}

/** Mono chip used throughout Directory/Recipes/Scenario picks for a tool reference. */
export function ToolChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--fg-2)",
        background: "var(--canvas-terminal)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        padding: "4px 10px",
        cursor: "pointer",
        transition: "border-color var(--dur-base) ease, color var(--dur-base) ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--green-a40)";
        e.currentTarget.style.color = "var(--signal-green)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--fg-2)";
      }}
    >
      {label}
    </button>
  );
}
