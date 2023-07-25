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
      // We cannot use threads for testing databases.
      // We need to use child_process to isolate mongodb.
      threads: false,
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
