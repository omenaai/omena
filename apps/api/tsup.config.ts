import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  splitting: false,
  // Bundle all npm dependencies into the output so the runner image
  // doesn't need node_modules at all. Node built-ins stay external automatically.
  noExternal: [/.+/],
});
