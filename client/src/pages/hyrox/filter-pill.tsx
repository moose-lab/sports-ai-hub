/**
 * HYROX Zone — single-select filter pill (audience filter, region filter).
 * Active = solid signal green on canvas text; inactive = hairline outline.
 */
export function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
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
        background: active ? "var(--signal-green)" : "transparent",
        color: active ? "var(--canvas)" : "var(--fg-2)",
        border: active ? "1px solid var(--signal-green)" : "1px solid var(--border)",
        fontWeight: active ? 600 : 500,
        transition: "all var(--dur-base) ease",
      }}
    >
      {label}
    </button>
  );
}
