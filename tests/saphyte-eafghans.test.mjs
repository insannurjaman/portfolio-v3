import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CORE_SYSTEM_PATH,CORE_SYSTEM_FILE,CORE_SYSTEM_CASE,CORE_SYSTEM_SCREENS,coreSystemPages } from "../src/saphyte-eafghans-content.js";
import { DESIGN_SYSTEM_CASES,designSystemPages,designSystemsSearchPage } from "../src/design-systems-content.js";
import { eAfghanPages } from "../src/e-afghan-content.js";

test("shared core story credits owner and Chakra UI without invented impact",()=>{
  const page=coreSystemPages[CORE_SYSTEM_PATH];
  assert.equal(page.path,CORE_SYSTEM_PATH);
  assert.ok(page.designCase&&page.narrative&&page.systemCase);
  const brief=page.story.find(b=>b.type==="brief");
  assert.match(brief.contribution,/I created and adapted the complete shared library/);
  assert.match(brief.contribution,/Chakra UI/);
  assert.match(brief.limits,/not authorship of Chakra UI/);
  assert.match(brief.limits,/measured impact have not been established/);
});
test("all chapter links and decisions resolve within the shared-core story",()=>{
  const page=coreSystemPages[CORE_SYSTEM_PATH];
  const headings=page.story.filter(b=>b.type==="h2").map(b=>b.text);
  const ids=headings.map(h=>page.chapterIds[h]);
  assert.ok(ids.every(Boolean));
  assert.equal(new Set(ids).size,headings.length);
  const decisions=page.story.find(b=>b.type==="decision-highlights").items;
  assert.equal(decisions.length,3);
  for(const item of decisions)assert.ok(headings.includes(item.chapter));
});
test("all ten source exports have exact proportions and source provenance",()=>{
  assert.equal(Object.keys(CORE_SYSTEM_SCREENS).length,10);
  const page=coreSystemPages[CORE_SYSTEM_PATH];
  const used=new Set(page.images.map(i=>i.src));
  for(const b of page.story){for(const img of b.type==="image"?[b]:b.variants||[])used.add(img.src);}
  assert.equal(used.size,10);
  for(const image of Object.values(CORE_SYSTEM_SCREENS)){
    const bytes=fs.readFileSync(new URL(`../public${image.src}`,import.meta.url));
    assert.equal(bytes.subarray(1,4).toString(),"PNG");
    assert.equal(bytes.readUInt32BE(16),image.width,image.src);
    assert.equal(bytes.readUInt32BE(20),image.height,image.src);
    assert.ok(image.sourceUrl.startsWith(CORE_SYSTEM_FILE));
    assert.equal(image.sourceUrl,CORE_SYSTEM_FILE);
  }
});
test("small source state comparisons opt into native-size rendering",()=>{
  const previews=coreSystemPages[CORE_SYSTEM_PATH].story.filter(b=>b.type==="system-preview");
  assert.equal(previews.length,2);
  for(const block of previews){assert.equal(block.nativeSize,true);assert.deepEqual(block.variants.map(v=>v.label),["Default","Hover"]);for(const image of block.variants)assert.equal(image.width,133);}
  const jsx=fs.readFileSync(new URL("../src/design-systems.jsx",import.meta.url),"utf8");
  assert.match(jsx,/maxWidth:variant.width/);
  assert.ok(jsx.includes('return to Design Systems'));
  assert.ok(!jsx.includes('View the source in Figma'));
});
test("third system and E-Afghan cases have reciprocal discovery",()=>{
  assert.equal(DESIGN_SYSTEM_CASES.length,3);
  assert.equal(DESIGN_SYSTEM_CASES[2],CORE_SYSTEM_CASE);
  assert.equal(designSystemPages[CORE_SYSTEM_PATH],coreSystemPages[CORE_SYSTEM_PATH]);
  assert.match(designSystemsSearchPage.body.join(" "),/Saphyte and E-Afghans/);
  for(const path of ["/e-afghan-landing-page","/e-afghan-citizen-portal"]){assert.ok(eAfghanPages[path].story.some(b=>b.type==="portal-related"&&b.items.some(i=>i.path===CORE_SYSTEM_PATH)));}
  const related=coreSystemPages[CORE_SYSTEM_PATH].story.find(b=>b.type==="portal-related");
  assert.deepEqual(related.items.map(i=>i.path),["/e-afghan-landing-page","/e-afghan-citizen-portal"]);
});
