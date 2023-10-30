import tsconfigPaths from "vite-tsconfig-paths";
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    plugins: [tsconfigPaths()],
    test: {
      name: "server",
      root: "./server",
      include: ["./tests/**/*.test.ts"],
      setupFiles: ["./tests/setup.ts"],
      globalSetup: ["./server/tests/globalSetup.ts"],
      threads: true,
    },
  },
  {
    plugins: [tsconfigPaths()],
    test: {
      name: "ui",
      root: "./ui",
      include: ["./**/*.test.ts"],
      setupFiles: ["./tests/setup.ts"],
    },
  },
  {
    test: {
      name: "shared",
      root: "./shared",
      include: ["**/*.test.ts"],
    },
  },
]);
