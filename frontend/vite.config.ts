import { dependencies } from "./package.json"
import { defineConfig, type PluginOption } from "vite"
import react from "@vitejs/plugin-react"
import { compression } from "vite-plugin-compression2"
import { visualizer } from "rollup-plugin-visualizer"

const ENABLE_VISUALIZER = false

const vendorPackages = ["react", "react-dom", "react-router", "ky"]

function renderChunks(deps: Record<string, string>) {
  const chunks: { [key: string]: string[] } = {}
  Object.keys(deps).forEach((key) => {
    if (vendorPackages.includes(key)) {
      return
    }
    chunks[key] = [key]
  })
  return chunks
}

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
      output: {
        manualChunks: {
          vendor: vendorPackages,
          ...renderChunks(dependencies),
        },
      },
    },
  },
  plugins: [react(), compression({ algorithm: "brotliCompress" })].concat(
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
