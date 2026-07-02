/**
 * Sports AI Hub — Quick Start ("what do you want to build?").
 * The six routes are the real README's "Quick Start for Builders" bullets,
 * each mapped to the catalog category it points to — not invented copy.
 */
import { ArrowUpRight, Compass } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHead } from "@/components/brand";
import { categoryById } from "@/lib/catalog";
import { categoryIcon } from "@/pages/home/category-icons";

const QUICK_START: { label: string; categoryId: string }[] = [
  { label: "Need runnable code?", categoryId: "open-source-projects" },
  { label: "Need a tool you can use today?", categoryId: "apps-products" },
  { label: "Need raw material?", categoryId: "datasets-apis-feeds" },
  { label: "Need implementation building blocks?", categoryId: "developer-libraries-sdks" },
  { label: "Need evaluation references?", categoryId: "research-benchmarks" },
  { label: "Need event or demo context?", categoryId: "event-toolkits" },
];

export function QuickStart({ onPick }: { onPick: (categoryId: string) => void }) {
  return (
    <section id="quickstart" className="sa-anchor" style={{ background: "var(--canvas-raised)", borderBottom: "1px solid var(--border)" }}>
      <div className="sa-container" style={{ paddingTop: 64, paddingBottom: 72 }}>
        <SectionHead
          eyebrow="Quick Start"
          icon={Compass}
          title="What do you want to build?"
          sub="Six ways in — pick the one that matches what you have, and we'll jump you to the right shelf of the directory."
        />
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginTop: 32 }}
        >
          {QUICK_START.map((q) => {
            const category = categoryById(q.categoryId);
            if (!category) return null;
            const Icon = categoryIcon(q.categoryId);
            return (
              <Card
                key={q.categoryId}
                className="card-signal gap-0 p-[18px] cursor-pointer"
                onClick={() => onPick(q.categoryId)}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--radius-md)",
                    background: "var(--green-a10)",
                    border: "1px solid var(--green-a20)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <Icon size={18} style={{ color: "var(--signal-green)" }} />
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15.5, color: "var(--fg-1)", marginBottom: 6 }}>
                  {q.label}
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)" }}>
                  {category.label} <ArrowUpRight size={13} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
