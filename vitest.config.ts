import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.spec.ts"],
    exclude: ["product-source/**", "node_modules/**"],
  },
});
