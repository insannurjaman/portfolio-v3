import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {SYSTEM_DOCS,DOC_TOPICS,docsPath,docsTopics,SYSTEM_STORY_DOCS} from "../src/system-docs-data.js";
test("all three public documentation families have foundations and source-specific components",()=>{
  assert.deepEqual(Object.keys(SYSTEM_DOCS),["accelbyte","client-portal","saphyte-eafghans"]);
  for(const [key,data]of Object.entries(SYSTEM_DOCS)){
    const topics=docsTopics(key);assert.equal(topics.length,DOC_TOPICS.length+data.components.length);
    assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);
    assert.ok(topics.some(t=>t.id==="components/button"));assert.ok(data.tokens.length);
    assert.equal(SYSTEM_STORY_DOCS[data.story],docsPath(key));
  }
});
test("documentation exposes only local evidence, never private editable-library URLs",()=>{
  assert.ok(!JSON.stringify(SYSTEM_DOCS).includes("figma.com"));
  for(const data of Object.values(SYSTEM_DOCS))for(const img of [...(data.colorImages||[]),...(data.guideImage?[data.guideImage]:[]),...data.components.flatMap(c=>c.images||[])]){
    assert.ok(img.src.startsWith("/media/"));assert.ok(fs.existsSync(new URL(`../public${img.src}`,import.meta.url)));assert.ok(img.width>0&&img.height>0);assert.ok(img.alt);
  }
});
test("source scope remains distinct from native documentation theme and demos",()=>{
  assert.equal(SYSTEM_DOCS.accelbyte.colors[0].value,"#0B6CFF");
  assert.equal(SYSTEM_DOCS["saphyte-eafghans"].typography[2][1],"NewsReader");
  assert.match(SYSTEM_DOCS["client-portal"].components[0].model,/illustrative/);
  assert.ok(SYSTEM_DOCS["saphyte-eafghans"].components.find(c=>c.id==="file-upload").model.includes("never uploads"));
});
test("documentation uses the shared portfolio theme while keeping product specimens in their source theme",()=>{
  const component=fs.readFileSync(new URL("../src/system-docs.jsx",import.meta.url),"utf8");
  const styles=fs.readFileSync(new URL("../src/system-docs.css",import.meta.url),"utf8");
  assert.ok(component.includes("<ThemeSwitch/>"));
  assert.match(component, /<ComponentDocumentation[\s\S]*?theme="light"/);
  assert.match(styles, /--doc-bg:var\(--bg\)/);
  assert.doesNotMatch(component, /docsTheme|localStorage/);
  assert.ok(component.includes('aria-expanded={menuOpen}'));
  assert.ok(component.includes('role="status"'));
});
