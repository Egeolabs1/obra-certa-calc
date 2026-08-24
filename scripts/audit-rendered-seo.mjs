import fs from "node:fs";
import path from "node:path";

const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/www\.suaobracerta\.com\.br([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
for (const route of routes) {
  const file = route === "/" ? path.join("dist", "index.html") : path.join("dist", route.slice(1), "index.html");
  if (!fs.existsSync(file)) throw new Error(`Missing prerendered file: ${route}`);
  const html = fs.readFileSync(file, "utf8");
  if ((html.match(/<title[\s>]/gi) ?? []).length !== 1) throw new Error(`Expected one title: ${route}`);
  if (!html.match(/<meta[^>]+name="description"/i)) throw new Error(`Missing description: ${route}`);
  if (!html.includes(`rel="canonical" href="https://www.suaobracerta.com.br${route === "/" ? "/" : route}"`)) throw new Error(`Canonical mismatch: ${route}`);
  if (!/<h1[\s>]/i.test(html)) throw new Error(`Missing H1: ${route}`);
}
console.log(`Rendered SEO audit OK (${routes.length} routes)`);
