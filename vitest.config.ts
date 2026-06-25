/**
 * Vitest config for client unit tests. Deliberately minimal and isolated from
 * the app's vite.config.ts (which loads the React/Tailwind plugins and dev
 * server settings) — these tests exercise pure data-layer logic in a node env.
 */
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  test: {
    environment: "node",
    include: ["client/src/**/*.test.{ts,tsx}"],
  },
});
