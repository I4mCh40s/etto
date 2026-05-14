import { access, readFile } from "node:fs/promises";

const requiredFiles = ["index.html", "styles.css", "app.js"];

for (const file of requiredFiles) {
  await access(file);
}

const html = await readFile("index.html", "utf8");
for (const file of ["styles.css", "app.js"]) {
  if (!html.includes(file)) {
    throw new Error(`index.html does not reference ${file}`);
  }
}

console.log("Etto static build verified.");
