import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import test from "node:test";
const source = readFileSync(new URL("../src/components/layout/SiteLayout.jsx",import.meta.url),"utf8");
const guard = source.match(/\{(![^\n]+) && \(/)[1];
for(const [pathname,visible] of [
  ["/pt/insights",false],["/en/insights",false],
  ["/pt/insights/",false],["/en/insights/",false],
  ["/pt/work",true],["/en/gestao",true],
]) test("mobile CTA "+pathname,()=>assert.equal(runInNewContext(guard,{location:{pathname}}),visible));
