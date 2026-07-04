/**
 * HYROX Zone — Builder's Path: the no-official-API opportunity as three
 * mono-tool chains, plus the "ship it" terminal block.
 */
import { GitFork } from "lucide-react";

import { SectionHead, Terminal } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { hyroxBuilderPaths } from "@/data/hyrox-zone";

export function ZoneBuilderPath() {
  return (
    <section id="builder" style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="The Builder's Path"
          icon={GitFork}
          title="No official API. That's the opportunity."
          sub="HYROX publishes every split of every athlete — but locks it in a results portal. Chain these mono-tools to build what the community keeps asking for."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
            gap: 14,
            marginTop: 36,
          }}
        >
          {hyroxBuilderPaths.map((p, i) => (
            <Card key={p.title} className="card-signal gap-0 p-[22px]">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--green-a40)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Badge variant="signal">{p.aud}</Badge>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--fg-1)", margin: "0 0 16px" }}>
                {p.title}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.steps.map((step, j) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-4)", width: 18, flex: "none" }}>
                      {j + 1}.
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12.5,
                        color: "var(--fg-2)",
                        padding: "3px 9px",
                        background: "var(--canvas-terminal)",
                        border: "1px solid var(--border)",
                        borderRadius: 4,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div style={{ marginTop: 32, maxWidth: 640 }}>
          <Terminal
            lines={[
              { comment: "Ship it as a HYROX mono-tool" },
              { cmd: true, text: "gh issue create --repo moose-lab/awesome-sports-ai \\" },
              { cmd: true, text: '  --title "feat: [hyrox] race-split-analyzer"' },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
