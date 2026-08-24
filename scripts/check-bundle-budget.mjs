import fs from "node:fs";
import { gzipSync } from "node:zlib";
const files = fs.readdirSync("dist/assets").filter((file) => file.endsWith(".js"));
const initial = files.filter((file) => /^index-|^vendor-|^ui-/.test(file));
const bytes = initial.reduce((total, file) => total + gzipSync(fs.readFileSync(`dist/assets/${file}`)).length, 0);
const kb = Math.round(bytes / 1024);
console.log(`Initial JavaScript gzip: ${kb} KB`);
if (kb > 250) { console.error("Bundle budget exceeded; route-level code splitting is still required."); process.exit(1); }
