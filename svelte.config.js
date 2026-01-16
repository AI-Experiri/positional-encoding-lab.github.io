// ABOUTME: SvelteKit configuration with static adapter for GitHub Pages
// ABOUTME: Outputs static build to 'build' directory for deployment

import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    paths: {
      base: "",
    },
  },
};

export default config;
