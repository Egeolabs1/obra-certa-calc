import fs from "node:fs";
const files = fs.readdirSync("dist/assets").filter((file) => file.endsWith(".js"));
for (const file of files.sort()) {
  const bytes = fs.statSync(`dist/assets/${file}`).size;
  console.log(`${file}: ${Math.round(bytes / 1024)} KB`);
}
