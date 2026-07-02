import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { isUsableCatalog, syncCatalog } from "./sync-catalog.mjs";

const SAMPLE = {
  categories: [{ id: "apps-products", label: "Apps & Products", description: "..." }],
  sportTags: ["Soccer", "Multi-sport"],
  aiCapabilities: [{ id: "data-ingestion", label: "Data ingestion" }],
  openness: ["open-source"],
  tools: [{ id: "sports-ai-hub", title: "Sports AI Hub", categoryId: "apps-products", sportTags: ["Multi-sport"], aiCapabilities: ["data-ingestion"], openness: "open-source" }],
  recipes: [{ id: "build-xg-model", title: "Build Your Own xG Model", toolIds: ["sports-ai-hub"] }],
};

const withTempOut = async (fn) => {
  const dir = mkdtempSync(join(tmpdir(), "sync-catalog-test-"));
  const outPath = join(dir, "catalog.json");
  try {
    return await fn(outPath);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

const silentLog = { warn: () => {}, info: () => {} };

test("isUsableCatalog requires every field to be a non-empty array", () => {
  assert.equal(isUsableCatalog(SAMPLE), true);
  assert.equal(isUsableCatalog({ ...SAMPLE, tools: [] }), false);
  assert.equal(isUsableCatalog({ ...SAMPLE, recipes: undefined }), false);
  assert.equal(isUsableCatalog(null), false);
  assert.equal(isUsableCatalog("not an object"), false);
});

test("syncCatalog writes a fetched payload to disk", async () => {
  await withTempOut(async (outPath) => {
    const fetchImpl = async () => ({ ok: true, json: async () => SAMPLE });
    const result = await syncCatalog({ fetchImpl, outPath, log: silentLog });
    assert.equal(result.updated, true);
    assert.deepEqual(JSON.parse(readFileSync(outPath, "utf8")), SAMPLE);
  });
});

test("syncCatalog keeps the existing snapshot when the fetch fails", async () => {
  await withTempOut(async (outPath) => {
    writeFileSync(outPath, JSON.stringify(SAMPLE));
    const fetchImpl = async () => {
      throw new Error("network down");
    };
    const result = await syncCatalog({ fetchImpl, outPath, log: silentLog });
    assert.equal(result.updated, false);
    assert.deepEqual(JSON.parse(readFileSync(outPath, "utf8")), SAMPLE);
  });
});

test("syncCatalog keeps the existing snapshot when the payload is unusable", async () => {
  await withTempOut(async (outPath) => {
    writeFileSync(outPath, JSON.stringify(SAMPLE));
    const fetchImpl = async () => ({ ok: true, json: async () => ({ categories: [] }) });
    const result = await syncCatalog({ fetchImpl, outPath, log: silentLog });
    assert.equal(result.updated, false);
    assert.deepEqual(JSON.parse(readFileSync(outPath, "utf8")), SAMPLE);
  });
});

test("syncCatalog throws when the fetch fails and there is no fallback snapshot", async () => {
  await withTempOut(async (outPath) => {
    const fetchImpl = async () => {
      throw new Error("network down");
    };
    await assert.rejects(() => syncCatalog({ fetchImpl, outPath, log: silentLog }));
  });
});

test("syncCatalog responds to a non-ok HTTP status as a failure", async () => {
  await withTempOut(async (outPath) => {
    writeFileSync(outPath, JSON.stringify(SAMPLE));
    const fetchImpl = async () => ({ ok: false, status: 404 });
    const result = await syncCatalog({ fetchImpl, outPath, log: silentLog });
    assert.equal(result.updated, false);
  });
});
