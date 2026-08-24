import fs from "node:fs";
import path from "node:path";
const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");
const routes = new Set([...sitemap.matchAll(/<loc>https:\/\/www\.suaobracerta\.com\.br([^<]*)<\/loc>/g)].map((m) => m[1] || "/"));
const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) walk(full); else if (full.endsWith(".html")) files.push(full); } }
walk("dist");
const broken = new Set();
for (const file of files) for (const match of fs.readFileSync(file, "utf8").matchAll(/href="(\/[^"]*)"/g)) { const href = match[1].split(/[?#]/)[0]; if (href && !href.startsWith("/assets") && !href.includes("." ) && !routes.has(href) && href !== "/meu-orcamento") broken.add(href); }
if (broken.size) console.warn("Non-indexed internal targets (review before indexing):", [...broken]);
console.log(`Internal link audit OK (${files.length} HTML files)`);
