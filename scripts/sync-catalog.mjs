#!/usr/bin/env node
/**
 * Fetches the canonical tool catalog from `moose-lab/awesome-sports-ai`'s
 * `data/catalog.json` and writes it into the client bundle. This is the
 * single source of truth for the landing page's categories, tools, sport
 * tags, AI-capability tags, openness tags, and builder recipes — nothing
 * about the directory should ever be hand-typed in this repo again.
 *
 * Runs as a `pre*` npm lifecycle hook before `dev`/`build*` (see
 * package.json), so the committed `client/src/data/catalog.json` is always
 * refreshed before the app builds. If the fetch fails or returns an
 * unusable payload, this leaves the last committed snapshot in place rather
 * than failing the build — the site should never ship with a blank catalog.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CATALOG_URL =
  "https://raw.githubusercontent.com/moose-lab/awesome-sports-ai/main/data/catalog.json";
const OUT_PATH = fileURLToPath(new URL("../client/src/data/catalog.json", import.meta.url));

const REQUIRED_ARRAY_KEYS = ["categories", "sportTags", "aiCapabilities", "openness", "tools", "recipes"];

/** A payload is usable only if every required field is an array with content. */
export function isUsableCatalog(data) {
  if (!data || typeof data !== "object") return false;
  return REQUIRED_ARRAY_KEYS.every((key) => Array.isArray(data[key]) && data[key].length > 0);
}

export async function syncCatalog({ fetchImpl = fetch, outPath = OUT_PATH, log = console } = {}) {
  let data;
  try {
    const res = await fetchImpl(CATALOG_URL);
    if (!res.ok) throw new Error(`catalog.json responded ${res.status}`);
    data = await res.json();
  } catch (err) {
    log.warn(`[sync-catalog] fetch failed (${err.message}); keeping existing snapshot.`);
    if (!existsSync(outPath)) throw new Error("[sync-catalog] no existing catalog snapshot to fall back to");
    return { updated: false };
  }

  if (!isUsableCatalog(data)) {
    log.warn("[sync-catalog] fetched payload missing expected fields; keeping existing snapshot.");
    if (!existsSync(outPath)) throw new Error("[sync-catalog] no existing catalog snapshot to fall back to");
    return { updated: false };
  }

  writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`);
  log.info(`[sync-catalog] wrote ${data.tools.length} tools, ${data.categories.length} categories.`);
  return { updated: true };
}

// Only run when invoked directly (not when imported by the test file).
if (import.meta.url === `file://${process.argv[1]}`) {
  syncCatalog().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
