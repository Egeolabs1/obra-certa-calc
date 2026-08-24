import fs from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import { renderDocument } from "./html-template.mjs";

const root = process.cwd();
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
try {
  const { INDEXABLE_PATHS } = await server.ssrLoadModule("/src/config/indexableRoutes.ts");
  const { renderRoute } = await server.ssrLoadModule("/src/entry-server.tsx");
  const template = await fs.readFile(path.join(root, "dist/index.html"), "utf8");
  for (const route of INDEXABLE_PATHS) {
    const result = renderRoute(route);
    const target = path.join(root, "dist", route === "/" ? "" : route.slice(1), "index.html");
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, renderDocument(template, result.html, result.helmet));
  }
  console.log(`Prerendered ${INDEXABLE_PATHS.length} indexable routes`);
} finally { await server.close(); }
