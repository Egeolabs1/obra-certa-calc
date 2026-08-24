import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'ads.txt', 'sitemap.xml'],
      manifest: {
        name: 'SuaObraCerta - Calculadoras de Construção',
        short_name: 'SuaObraCerta',
        description: 'Ferramentas precisas para calcular materiais de construção. Tijolos, concreto, tinta, pisos e mais.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    noExternal: ["react-helmet-async", "react-router-dom", "sonner"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) return "vendor";
            if (id.includes("@radix-ui") || id.includes("lucide-react") || id.includes("class-variance-authority")) return "ui";
            return "dependencies";
          }
          if (id.includes("/src/pages/Blog") || id.includes("/src/data/blogPosts")) return "content-blog";
          if (id.includes("/src/pages/Calculadora")) return "calculators";
          if (id.includes("/src/pages/Checklist") || id.includes("/src/pages/MeuOrcamento")) return "tools-secondary";
          if (id.includes("/src/pages/") && !id.includes("/src/pages/Index")) return "institutional";
        },
      },
    },
  },
}));
