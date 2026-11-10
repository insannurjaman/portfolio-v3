import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {designSystemPages} from "../src/design-systems-content.js";
import {CLIENT_SYSTEM_SCREENS,clientPortalPages} from "../src/client-portal-content.js";
import {CORE_SYSTEM_SCREENS} from "../src/saphyte-eafghans-content.js";

test("design-system pages and source comparisons expose no private Figma destinations",()=>{
  for(const page of Object.values(designSystemPages)){
    assert.equal(page.sourceUrl,undefined);
    const serialized=JSON.stringify(page);
    assert.ok(!serialized.includes('https://www.figma.com/'));
  }
  for(const screen of [...Object.values(CLIENT_SYSTEM_SCREENS),...Object.values(CORE_SYSTEM_SCREENS)]){
    assert.ok(screen.sourceUrl.startsWith('/design-systems/'));
    assert.ok(!screen.sourceUrl.includes('figma.com'));
  }
});
test("privacy change preserves separately authorized product sources and local image inspection",()=>{
  assert.match(clientPortalPages['/loyica-client-portal'].sourceUrl,/https:\/\/www.figma.com/);
  const preview=fs.readFileSync(new URL('../src/design-systems.jsx',import.meta.url),'utf8');
  assert.ok(preview.includes('href={variant.src}'));
  assert.ok(preview.includes('to="/design-systems"'));
  assert.ok(!preview.includes('View the source in Figma'));
});
