/**
 * HYROX Zone — single-select filter pill.
 * "audience" (also regions): active = solid signal green; inactive = hairline.
 * "kind" (type pills): active = solid --fg-1; inactive = dashed hairline —
 * a deliberately different weight so the two filter axes read apart.
 */
type PillVariant = "audience" | "kind";

const VARIANT_ACTIVE: Record<PillVariant, { background: string; border: string }> = {
  audience: { background: "var(--signal-green)", border: "1px solid var(--signal-green)" },
  kind: { background: "var(--fg-1)", border: "1px solid var(--fg-1)" },
};

const VARIANT_IDLE_BORDER: Record<PillVariant, string> = {
  audience: "1px solid var(--border)",
  kind: "1px dashed var(--border)",
};

export function FilterPill({
  label,
  active,
  onClick,
  variant = "audience",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: PillVariant;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12.5,
        padding: "6px 13px",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        background: active ? VARIANT_ACTIVE[variant].background : "transparent",
        color: active ? "var(--canvas)" : "var(--fg-2)",
        border: active ? VARIANT_ACTIVE[variant].border : VARIANT_IDLE_BORDER[variant],
        fontWeight: active ? 600 : 500,
        transition: "all var(--dur-base) ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
