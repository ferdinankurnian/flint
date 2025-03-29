import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    build: {
      outDir: "dist-electron/main",
      rollupOptions: {
        external: ["electron"],
      },
    },
  },
  preload: {
    build: {
      outDir: "dist-electron/preload",
      rollupOptions: {
        external: ["electron"],
      },
    },
  },
  renderer: {
    plugins: [react()],
    build: {
      outDir: "dist",
    },
  },
});
