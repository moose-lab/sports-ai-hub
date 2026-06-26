import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const robots = readFileSync(new URL("../client/public/robots.txt", import.meta.url), "utf8");

const parseGroups = (content) => {
  const groups = [];
  let current;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (!line) continue;

    const [field, ...valueParts] = line.split(":");
    const key = field.trim().toLowerCase();
    const value = valueParts.join(":").trim();

    if (key === "user-agent") {
      current = { agents: [value], rules: [] };
      groups.push(current);
      continue;
    }

    if (!current) continue;
    if (key === "allow" || key === "disallow") {
      current.rules.push({ key, value });
    }
  }

  return groups;
};

const groups = parseGroups(robots);
const ruleFor = (agent) => groups.find((group) => group.agents.includes(agent))?.rules;
const hasRule = (agent, key, value) => ruleFor(agent)?.some((rule) => rule.key === key && rule.value === value);

test("robots policy allows declared search and retrieval crawlers", () => {
  [
    "Googlebot",
    "bingbot",
    "DuckDuckBot",
    "Applebot",
    "OAI-SearchBot",
    "Claude-SearchBot",
    "PerplexityBot",
  ].forEach((agent) => {
    assert.equal(hasRule(agent, "allow", "/"), true, `${agent} should be allowed`);
  });
});

test("robots policy allows user-triggered crawlers", () => {
  ["ChatGPT-User", "Claude-User", "Perplexity-User"].forEach((agent) => {
    assert.equal(hasRule(agent, "allow", "/"), true, `${agent} should be allowed`);
  });
});

test("robots policy blocks training, opt-out, and undeclared crawlers", () => {
  ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended", "Applebot-Extended", "Bytespider", "*"].forEach((agent) => {
    assert.equal(hasRule(agent, "disallow", "/"), true, `${agent} should be blocked`);
  });
});
