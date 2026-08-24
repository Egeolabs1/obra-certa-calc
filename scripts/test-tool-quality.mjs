import fs from "node:fs";
const source = fs.readFileSync("src/content/toolQuality.ts", "utf8");
if (!source.includes('indexable: true')) throw new Error("No indexable tool quality record found");
if (!source.includes("sources:") || !source.includes("limitations:")) throw new Error("Quality model is incomplete");
console.log("Tool quality model OK");
