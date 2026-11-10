import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { GOCOCO_PATH, GOCOCO_FILE, GOCOCO_SCREENS, GOCOCO_COVER, gococoPages } from "../src/gococo-content.js";
import { GOCOCO_AI_THUMBNAIL } from "../src/project-thumbnail-overrides.js";
import { CASE_ILLUSTRATIONS, CASE_PREVIEWS } from "../src/case-illustrations.js";
import { CASE_STUDY_CHAPTERS, withCaseStudyStructure } from "../src/case-study-structure.js";
import { CASE_IMPACT_RECORDS } from "../src/case-study-reading.js";
import { filteredWork, WORK_PROJECTS } from "../src/work-catalog.js";
import { workNavigationItems } from "../src/work-navigation-content.js";

test("GoCoco preserves 12 actual Figma exports, source-node provenance, and intrinsic geometry", () => {
  assert.equal(Object.keys(GOCOCO_SCREENS).length, 12);
  assert.match(GOCOCO_FILE, /A9hwyGsl4CbwQj2dARwt6L.*35-76039/);
  for (const screen of Object.values(GOCOCO_SCREENS)) {
    const file = new URL(`../public${screen.src}`, import.meta.url);
    const header = readFileSync(file).subarray(0, 24);
    assert.equal(header.subarray(1, 4).toString(), "PNG");
    assert.equal(header.readUInt32BE(16), screen.width);
    assert.equal(header.readUInt32BE(20), screen.height);
    assert.ok(statSync(file).size > 1000);
    assert.match(screen.nodeId, /^35:\d+$/);
    assert.ok(screen.sourceUrl.includes(`node-id=${screen.nodeId.replace(":", "-")}`));
    assert.ok(screen.alt.length > 30);
  }
});

test("GoCoco is discoverable only in AI Product, including its industry filters and navigation previews", () => {
  const item = WORK_PROJECTS.find(project => project.path === GOCOCO_PATH);
  assert.deepEqual(item.collections, ["ai"]);
  assert.deepEqual(item.industries, ["ai", "commerce"]);
  for (const industry of ["all", "ai", "commerce"]) assert.ok(filteredWork("ai", industry).some(project => project.path === GOCOCO_PATH));
  for (const collection of ["saas", "mobile", "design-systems"]) assert.ok(!filteredWork(collection).some(project => project.path === GOCOCO_PATH));
  assert.equal(workNavigationItems("ai")[0].path, GOCOCO_PATH);
  assert.equal(workNavigationItems("ai")[0].image, GOCOCO_AI_THUMBNAIL);
  assert.equal(Object.keys(CASE_ILLUSTRATIONS).length, 19);
  assert.equal(Object.keys(CASE_PREVIEWS).length, 21);
});

test("the eight-part GoCoco story documents design evidence without claiming research, launch, or agent performance", () => {
  const page = withCaseStudyStructure(gococoPages[GOCOCO_PATH]);
  assert.deepEqual(page.story.filter(block => block.type === "h2").map(block => block.text), CASE_STUDY_CHAPTERS);
  const context = page.story.find(block => block.type === "case-facts");
  assert.ok(!context.items.some(([term]) => ["Timeline", "Team"].includes(term)));
  assert.equal(page.sourceUrl, GOCOCO_FILE);
  assert.ok(page.coverGallery.every(screen => screen.width === 360 && screen.height === 800));
  const evidence = page.story.flatMap(block => block.type === "image" ? [block.src] : block.type === "image-group" ? block.images.map(image => image.src) : []);
  assert.deepEqual(evidence.sort(), Object.values(GOCOCO_SCREENS).map(screen => screen.src).sort());
  const copy = JSON.stringify(page.story);
  assert.match(copy, /not a launched app/);
  assert.match(copy, /not research already conducted/);
  assert.match(copy, /\$18\.7.*\$20\.0/);
  assert.doesNotMatch(copy, /OpenCode|Codex|figma\.com\/api\/mcp\/asset|\u2014/);
  assert.equal(CASE_IMPACT_RECORDS[GOCOCO_PATH], undefined);
});

test("GoCoco discovery uses the supplied thumbnail while the original source composition remains available", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { ProjectCover } = await server.ssrLoadModule("/src/project-cover.jsx");
    const html = renderToStaticMarkup(React.createElement(ProjectCover, { path: GOCOCO_PATH }));
    assert.match(html, /owner-designed-cover/);
    assert.equal((html.match(/<img /g) || []).length, 1);
    assert.ok(html.includes(GOCOCO_AI_THUMBNAIL.src));
    assert.match(html, /width="1955" height="1220"/);
    for (const screen of GOCOCO_COVER.panels) assert.ok(gococoPages[GOCOCO_PATH].coverGallery.some(image => image.src === screen.src));
    assert.match(html, /loading="lazy"/);
    const css = readFileSync(new URL("../src/thumbnail-cards.css", import.meta.url), "utf8");
    assert.match(css, /\.project-illustration\.source-screen-cover > img \{ width: auto; height: 100%; max-width: 30%; object-fit: contain; filter: none;/);
  } finally { await server.close(); }
});
