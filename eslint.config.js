// ABOUTME: ESLint configuration for Svelte 5 project
// ABOUTME: Uses flat config format with Svelte plugin

import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

export default [
  js.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "svelte/require-each-key": "warn",
    },
  },
  {
    ignores: ["dist/", "node_modules/", ".svelte-kit/", "build/"],
  },
];
