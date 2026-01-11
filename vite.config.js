// ABOUTME: Vite configuration for Svelte project
// ABOUTME: Configures dev server for Docker compatibility

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    watch: {
      usePolling: true,
    },
  },
});
