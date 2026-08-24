import fs from "node:fs";
const source = fs.readFileSync("src/config/indexableRoutes.ts", "utf8");
const paths = [...source.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(paths)];
const base = "https://www.suaobracerta.com.br";
const body = unique.map((route) => `  <url><loc>${base}${route === "/" ? "/" : route}</loc></url>`).join("\n");
fs.writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
console.log(`Generated sitemap with ${unique.length} routes`);
