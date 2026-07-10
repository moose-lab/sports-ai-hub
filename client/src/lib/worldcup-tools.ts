import { catalog, type CatalogTool } from "@/lib/catalog";
import type { WcToolkitTool } from "@/lib/worldcup";

const AWESOME_REPO = "https://github.com/moose-lab/awesome-sports-ai";

function normalizedName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizedHref(value: string): string {
  return value.trim().replace(/^\.\//, "").replace(/\/+$/, "").toLowerCase();
}

export function worldCupToolUrl(tool: WcToolkitTool): string {
  if (/^https?:\/\//i.test(tool.href)) return tool.href;
  const path = tool.href.replace(/^\.\//, "");
  const view = path.endsWith("/") ? "tree" : "blob";
  return `${AWESOME_REPO}/${view}/main/${path}`;
}

export function catalogToolFor(tool: WcToolkitTool): CatalogTool | undefined {
  const href = normalizedHref(tool.href);
  const name = normalizedName(tool.name);

  return catalog.tools.find(
    candidate =>
      normalizedHref(candidate.url) === href ||
      normalizedName(candidate.title) === name ||
      normalizedName(candidate.id) === name
  );
}
