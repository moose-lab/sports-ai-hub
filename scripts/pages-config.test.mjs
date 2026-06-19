import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const workflowPath = new URL("../.github/workflows/deploy-pages.yml", import.meta.url);
const pagesConfig = readFileSync(new URL("../vite.config.pages.ts", import.meta.url), "utf8");

test("GitHub Pages deployment uses the canonical project URL and gh-pages branch config", () => {
  assert.equal(packageJson.scripts["build:pages"], "vite build --config vite.config.pages.ts");
  assert.match(pagesConfig, /base:\s*["']\/sports-ai-hub\/["']/);
  assert.equal(existsSync(workflowPath), true);

  const workflow = readFileSync(workflowPath, "utf8");
  assert.match(workflow, /contents:\s*write/);
  assert.match(workflow, /uses:\s*pnpm\/action-setup@v4/);
  assert.doesNotMatch(workflow, /version:\s*10\.4\.1/);
  assert.match(workflow, /pnpm run build:pages/);
  assert.match(workflow, /git push origin gh-pages/);
  assert.doesNotMatch(workflow, /actions\/configure-pages/);
  assert.doesNotMatch(workflow, /actions\/deploy-pages/);
  assert.match(workflow, /url:\s*https:\/\/moose-lab\.github\.io\/sports-ai-hub\//);
});
