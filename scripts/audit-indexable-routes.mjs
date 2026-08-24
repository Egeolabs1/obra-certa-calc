import fs from "node:fs";
const source = fs.readFileSync("src/config/indexableRoutes.ts", "utf8");
const expected = [...new Set([...source.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1]))].sort();
const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");
const actual = [...sitemap.matchAll(/<loc>https:\/\/www\.suaobracerta\.com\.br([^<]*)<\/loc>/g)].map((m) => m[1] || "/").sort();
if (JSON.stringify(expected) !== JSON.stringify(actual)) {
  console.error({ expected, actual }); process.exit(1);
}
if (actual.includes("/meu-orcamento")) throw new Error("blocked route in sitemap");
console.log(`Route audit OK (${actual.length} routes)`);
