import fs from "node:fs";

import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const files = fs.readdirSync("./src/db/migrations");

  const entry: Record<string, string> = {
    index: options.watch ? "src/dev.ts" : "src/index.ts",
  };

  for (const file of files) {
    entry[`db/migrations/${file}`] = `src/db/migrations/${file}`;
  }

  return {
    entry,
    watch: options.watch ? ["./src", "../shared/src"] : false,
    onSuccess: options.watch ? "yarn cli start --withProcessor" : "",
    // In watch mode doesn't exit cleanly as it causes EADDRINUSE error
    killSignal: "SIGKILL",
    target: "es2020",
    platform: "node",
    format: ["esm"],
    splitting: true,
    shims: false,
    minify: false,
    sourcemap: true,
    noExternal: ["shared"],
    // Do not include bson which is using top-level await
    // This could be supported in future when using nodejs16 module in tsconfig
    external: ["bson", "mongodb", "dotenv"],
    clean: true,
  };
});
