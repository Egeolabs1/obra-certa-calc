const base = process.argv[2] ?? "http://localhost:4173";
const known = ["/", "/calculadora-tinta", "/blog", "/sobre"];
for (const route of known) {
  const response = await fetch(`${base}${route}`);
  if (response.status !== 200) throw new Error(`${route} returned ${response.status}`);
}
const missing = await fetch(`${base}/esta-url-nao-existe-auditoria`);
if (missing.status !== 404) throw new Error(`soft 404: returned ${missing.status}`);
console.log(`Production status audit OK (${base})`);
