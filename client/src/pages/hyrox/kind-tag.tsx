/**
 * HYROX Zone — kind chip: what an entry is (tool / api / dataset / model),
 * shown on every tool card and in the explainer's train-with rows. Datasets
 * and models get their own color so they stay visible inside every category.
 */
import type { HyroxKind } from "@/data/hyrox-zone";

const KIND_META: Record<
  HyroxKind,
  { label: string; color: string; border: string }
> = {
  tool: { label: "TOOL", color: "var(--fg-3)", border: "var(--border)" },
  api: {
    label: "API",
    color: "var(--signal-green)",
    border: "var(--green-a40)",
  },
  dataset: {
    label: "DATASET",
    color: "var(--amber-alert)",
    border: "rgba(245,158,11,0.4)",
  },
  model: { label: "MODEL", color: "var(--fg-1)", border: "var(--fg-4)" },
};

export function KindTag({ kind }: { kind: HyroxKind }) {
  const m = KIND_META[kind];
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: m.color,
        border: `1px solid ${m.border}`,
        borderRadius: 3,
        padding: "2px 6px",
        whiteSpace: "nowrap",
      }}
    >
      {m.label}
    </span>
  );
}
