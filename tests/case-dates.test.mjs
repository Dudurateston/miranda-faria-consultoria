import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
const page = name => readFileSync(new URL("../src/pages/" + name + ".jsx", import.meta.url), "utf8");
test("case does not render creation year", () => assert.equal(/\{item\.year\}/.test(page("WorkCase")),false));
test("work index does not render creation year", () => assert.equal(/\{c\.year\}/.test(page("Work")),false));
test("case facts use three desktop columns", () => assert.equal(/\.mf-case__facts\{grid-template-columns:repeat\(3,/.test(page("WorkCase")),true));
