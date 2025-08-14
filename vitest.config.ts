import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "server",
          root: "./server",
          include: ["./tests/**/*.test.ts", "./src/**/*.test.ts"],
          setupFiles: ["./tests/setup.ts"],
          globalSetup: ["./server/tests/globalSetup.ts"],
          clearMocks: true,
        },
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./server/src"),
            "@tests": path.resolve(__dirname, "./server/tests"),
          },
        },
      },
      {
        test: {
          name: "ui",
          root: "./ui",
          include: ["./**/*.test.ts"],
          setupFiles: ["./tests/setup.ts"],
          clearMocks: true,
        },
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./ui"),
          },
        },
      },
      {
        test: {
          name: "shared",
          root: "./shared",
          include: ["**/*.test.ts"],
          clearMocks: true,
        },
      },
    ],
  },
});
