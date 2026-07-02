import { describe, expect, it } from "vitest";
import {
  activeSportTags,
  capabilityById,
  catalog,
  categoryById,
  emptySportTags,
  OPENNESS_BADGE_VARIANT,
  OPENNESS_HINT,
  OPENNESS_LABEL,
  recipesForTool,
  toolById,
  toolsByCategory,
} from "@/lib/catalog";

describe("catalog", () => {
  it("loads the synced snapshot with content in every facet", () => {
    expect(catalog.categories.length).toBeGreaterThan(0);
    expect(catalog.tools.length).toBeGreaterThan(0);
    expect(catalog.sportTags.length).toBeGreaterThan(0);
    expect(catalog.aiCapabilities.length).toBeGreaterThan(0);
    expect(catalog.openness.length).toBeGreaterThan(0);
    expect(catalog.recipes.length).toBeGreaterThan(0);
  });

  it("resolves tools, categories, and capabilities by id", () => {
    const tool = catalog.tools[0];
    expect(toolById(tool.id)).toEqual(tool);
    expect(toolById("does-not-exist")).toBeUndefined();

    const category = catalog.categories[0];
    expect(categoryById(category.id)?.label).toBe(category.label);

    const capability = catalog.aiCapabilities[0];
    expect(capabilityById(capability.id)?.label).toBe(capability.label);
  });

  it("groups tools by category", () => {
    const category = catalog.categories[0];
    const shown = toolsByCategory(category.id);
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.every((t) => t.categoryId === category.id)).toBe(true);
  });

  it("finds recipes that reference a given tool", () => {
    const recipe = catalog.recipes.find((r) => r.toolIds.length > 0);
    expect(recipe).toBeDefined();
    const toolId = recipe!.toolIds[0];
    const matches = recipesForTool(toolId);
    expect(matches.some((r) => r.id === recipe!.id)).toBe(true);
  });

  it("splits sport tags into active/empty by real tool usage, not a hand-typed list", () => {
    expect(activeSportTags.length + emptySportTags.length).toBe(catalog.sportTags.length);
    for (const tag of activeSportTags) {
      expect(catalog.tools.some((t) => t.sportTags.includes(tag))).toBe(true);
    }
    for (const tag of emptySportTags) {
      expect(catalog.tools.some((t) => t.sportTags.includes(tag))).toBe(false);
    }
  });

  it("has a display label, hint, and badge variant for every openness id", () => {
    for (const id of catalog.openness) {
      expect(OPENNESS_LABEL[id]).toBeTruthy();
      expect(OPENNESS_HINT[id]).toBeTruthy();
      expect(OPENNESS_BADGE_VARIANT[id]).toBeTruthy();
    }
  });
});
