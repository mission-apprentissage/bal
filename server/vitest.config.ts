import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["./tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    // We cannot use threads for testing databases.
    // We need to use child_process to isolate mongodb.
    threads: false,
  },
});
