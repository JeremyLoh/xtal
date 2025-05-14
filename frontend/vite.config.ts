import { dependencies } from "./package.json"
import { defineConfig, type PluginOption } from "vite"
import react from "@vitejs/plugin-react"
import { compression } from "vite-plugin-compression2"
import { visualizer } from "rollup-plugin-visualizer"
import { DEFAULT_CSP_POLICY, generateCspPlugin } from "vite-plugin-node-csp"

const ENABLE_VISUALIZER = false

const vendorPackages = [
  "react",
  "react-dom",
  "react-router",
  "ky",
  "media-chrome",
  "motion",
  "sonner",
]

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

function getCspPlugin() {
  return generateCspPlugin({
    algorithm: "sha512",
    policy: {
      ...DEFAULT_CSP_POLICY,
      "default-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "script-src":
        `'self' https://xtal-backend.onrender.com https://va.vercel-scripts.com`.split(
          /\s+/
        ),
      "media-src": ["'self'", "https:"],
      "font-src": ["'self'"],
      "base-uri": ["'none'"],
      "frame-src": ["'self'"],
      "object-src": ["'none'"],
      "img-src":
        `'self' https: blob: data: https://tile.openstreetmap.org/`.split(
          /\s+/
        ),
      "connect-src":
        `'self' http://localhost:3000 https://xtal-backend.onrender.com https://qgntdhxjgegxcsnajywb.supabase.co https://va.vercel-scripts.com https://de2.api.radio-browser.info https://fi1.api.radio-browser.info`.split(
          /\s+/
        ),
    },
  })
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
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
    plugins: [
      react(),
      compression({ algorithm: "brotliCompress" }),
      getCspPlugin(),
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
    preview: {
      port: 5173,
    },
  }
})
