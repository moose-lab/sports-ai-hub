import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const clientIndex = readFileSync(new URL("../client/index.html", import.meta.url), "utf8");
const viteConfig = readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8");
const workflowPath = new URL("../.github/workflows/deploy-cloudflare-pages.yml", import.meta.url);
const cloudflareConfig = readFileSync(
  new URL("../vite.config.cloudflare.ts", import.meta.url),
  "utf8",
);

test("Cloudflare Pages deployment uses the canonical project URL and root asset config", () => {
  assert.match(packageJson.scripts["build:cloudflare"], /node scripts\/sync-catalog\.mjs/);
  assert.match(packageJson.scripts["build:cloudflare"], /vite build --config vite\.config\.cloudflare\.ts$/);
  assert.match(cloudflareConfig, /base:\s*["']\/["']/);
  assert.equal(existsSync(workflowPath), true);

  const workflow = readFileSync(workflowPath, "utf8");
  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /deployments:\s*write/);
  assert.match(workflow, /uses:\s*pnpm\/action-setup@v6/);
  assert.doesNotMatch(workflow, /version:\s*10\.4\.1/);
  assert.match(workflow, /pnpm run build:cloudflare/);
  assert.match(workflow, /CLOUDFLARE_ACCOUNT_ID/);
  assert.match(workflow, /CLOUDFLARE_API_TOKEN/);
  assert.match(workflow, /uses:\s*cloudflare\/wrangler-action@v4/);
  assert.match(workflow, /pages deploy dist\/public --project-name sports-ai-hub/);
  assert.doesNotMatch(workflow, /git push origin gh-pages/);
  assert.doesNotMatch(workflow, /moose-lab\.github\.io/);
  assert.doesNotMatch(workflow, /actions\/configure-pages/);
  assert.doesNotMatch(workflow, /actions\/deploy-pages/);
  assert.match(workflow, /url:\s*https:\/\/sports-ai-hub\.pages\.dev\//);
});

test("local browser preview does not request unresolved analytics or debug collector assets", () => {
  assert.doesNotMatch(clientIndex, /src="%VITE_ANALYTICS_ENDPOINT%\/umami"/);
  assert.doesNotMatch(clientIndex, /%VITE_ANALYTICS_/);
  assert.match(clientIndex, /import\.meta\.env\.VITE_ANALYTICS_ENDPOINT/);
  assert.match(clientIndex, /import\.meta\.env\.VITE_ANALYTICS_WEBSITE_ID/);
  assert.match(clientIndex, /rel="icon"/);
  assert.match(clientIndex, /\/assets\/logo-icon\.webp/);

  assert.match(viteConfig, /\/__manus__\/debug-collector\.js/);
  assert.match(viteConfig, /Content-Type": "application\/javascript"/);
});
