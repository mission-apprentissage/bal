import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2020",
  platform: "node",
  format: ["esm"],
  splitting: false,
  shims: false,
  minify: false,
  sourcemap: true,
  noExternal: ["shared"],
  // Do not include bson which is using top-level await
  // This could be supported in future when using nodejs16 module in tsconfig
  external: ["bson", "mongodb"],
  clean: true,
});
