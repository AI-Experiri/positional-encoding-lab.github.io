// ABOUTME: Vite configuration for SvelteKit with Tailwind CSS v4
// ABOUTME: Configures dev server and plugin order for proper CSS processing

import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    watch: {
      usePolling: true,
    },
  },
});
