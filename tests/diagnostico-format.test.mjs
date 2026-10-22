import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";

const source = readFileSync(new URL("../src/pages/Insights.jsx", import.meta.url), "utf8");
const nf = source.match(/const nf = [\s\S]*?;\n/)[0];
const jr = source.match(/const jr = [^\n]*;/)[0];
// Execute the actual pure formatter declarations without React or DOM.
const range = runInNewContext(nf + "\n" + jr + "\n({jr})").jr;

for (const [lang, lo, hi, expected] of [
  ["pt", 6000, 6000, "6.000"],
  ["en", 6000, 6000, "6,000"],
  ["pt", 0, 0, "0"],
  ["en", 4.33, 4.33, "4.33"],
  ["pt", 4.33, 12.99, "4,33 a 12,99"],
  ["en", 4.33, 12.99, "4.33 to 12.99"],
  ["pt", 8, null, "8+"],
  ["en", 8, null, "8+"],
]) {
  test(`range ${lang} ${lo}/${hi}`, () => assert.equal(range(lang, lo, hi), expected));
}
