import { defineConfig, type PluginOption } from "vite"
import react from "@vitejs/plugin-react"
import { compression } from "vite-plugin-compression2"
import { visualizer } from "rollup-plugin-visualizer"
// @ts-expect-error no @types available for rollup-plugin-hypothetical
import hypothetical from "rollup-plugin-hypothetical"
// @ts-expect-error no @types available for @stadtlandnetz/rollup-plugin-postprocess
import postprocess from "@stadtlandnetz/rollup-plugin-postprocess"

const ENABLE_VISUALIZER = false

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: "es2022",
    minify: "esbuild",
    cssMinify: "esbuild",
    cssCodeSplit: true,
    emptyOutDir: true,
    rollupOptions: {
      treeshake: { moduleSideEffects: false, preset: "smallest" },
      external: [/supertokens-website/, /supertokens-web-js/], // remove packages from bundle, need to replace the external imports in index.js bundle
    },
  },
  plugins: [
    react(),
    hypothetical({
      allowFallthrough: true,
      files: {
        "supertokens-website/": "",
        "supertokens-web-js/": "",
      },
    }),
    postprocess([
      [/import[^;]*supertokens-web-js[^;]*;/, ""],
      [/import[^;]*supertokens-website[^;]*;/, ""],
    ]), // remove import strings from bundle for "external" packages
    compression({ algorithm: "brotliCompress" }),
  ].concat(
    ENABLE_VISUALIZER ? [visualizer({ open: true }) as PluginOption] : []
  ),
  esbuild: {
    legalComments: "external",
    minifySyntax: true,
    minifyIdentifiers: true,
    minifyWhitespace: true,
    treeShaking: true,
  },
})
