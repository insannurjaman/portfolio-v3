import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { haloDishPages } from "../src/halodish-content.js";
import { diverMenuPages } from "../src/divermenu-content.js";
import { eAfghanPages } from "../src/e-afghan-content.js";
import { CASE_NARRATIVES, caseChapterTitles, caseChapterId, withCaseNarrative } from "../src/case-narrative.js";
import { CASE_SCREEN_DIMENSIONS, caseScreenDimensions } from "../src/case-screen-dimensions.js";

const pages = { ...haloDishPages, ...diverMenuPages, ...eAfghanPages };
const images = story => story.flatMap(block => block.type === "image" ? [block.src] : block.type === "image-group" ? block.images.map(image => image.src) : []);

for (const [path, config] of Object.entries(CASE_NARRATIVES)) {
  test(`${path}: clear brief, three valid evidence links, preserved screens and validation`, () => {
    const original = pages[path];
    const enhanced = withCaseNarrative(original);
    const headings = caseChapterTitles(enhanced.story);
    assert.equal(enhanced.story[0].text, "Project in brief");
    assert.equal(enhanced.story[1].type, "brief");
    for (const field of ["problem", "audience", "contribution", "outcome", "limits"]) assert.ok(enhanced.story[1][field]);
    const highlights = enhanced.story.find(block => block.type === "decision-highlights");
    assert.equal(highlights.items.length, 3);
    for (const item of highlights.items) {
      const index = headings.indexOf(item.chapter);
      assert.ok(index >= 0, `Missing evidence chapter: ${item.chapter}`);
      const originalIndex = caseChapterTitles(original.story).indexOf(item.chapter);
      assert.equal(caseChapterId(enhanced,item.chapter,index), `chapter-${originalIndex}`, "Existing evidence anchors must remain stable");
    }
    assert.equal(caseChapterId(enhanced,"Project in brief",0), "chapter-0");
    assert.equal(caseChapterId(enhanced,"Key design decisions",1), "key-design-decisions");
    const ids = headings.map((title,index) => caseChapterId(enhanced,title,index));
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(new Set(headings).size, headings.length);
    assert.equal(headings.at(-1), "Delivery and design takeaways");
    assert.deepEqual(images(enhanced.story), images(original.story));
    for (const src of images(enhanced.story)) assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), `Missing source image ${src}`);
    assert.deepEqual(enhanced.images, original.images);
    assert.deepEqual(enhanced.coverGallery, original.coverGallery);
    assert.deepEqual(enhanced.metadata, original.metadata);
    assert.deepEqual(enhanced.appLinks, original.appLinks);
    assert.equal(enhanced.sourceUrl, original.sourceUrl);
    assert.equal(enhanced.related, original.related);
    assert.equal(enhanced.story.filter(block => block.type === "decisions").length, 0);
    assert.equal(enhanced.story.at(-1).type, "list");
    const expectedValidation = config.validation || original.story.filter(block => block.type === "list").at(-1).items;
    assert.deepEqual(enhanced.story.at(-1).items, expectedValidation);
    assert.notStrictEqual(enhanced.story, original.story);
  });
}

test("unrelated case studies and missing data remain unchanged", () => {
  const legacy = { path: "/fincy-apps", story: [{ type: "p", text: "Existing content" }] };
  assert.strictEqual(withCaseNarrative(legacy), legacy);
  assert.equal(withCaseNarrative(undefined), undefined);
});

test("all 49 public source screens reserve their true intrinsic proportions", () => {
  assert.equal(Object.keys(CASE_SCREEN_DIMENSIONS).length, 49);
  for (const [src, dimensions] of Object.entries(CASE_SCREEN_DIMENSIONS)) {
    const path = new URL(`../public${src}`, import.meta.url);
    assert.ok(existsSync(path));
    assert.ok(dimensions.width > 0 && dimensions.height > 0);
    if (src.endsWith(".png")) {
      const header = readFileSync(path);
      assert.equal(dimensions.width, header.readUInt32BE(16));
      assert.equal(dimensions.height, header.readUInt32BE(20));
    }
  }
  for (const page of Object.values(pages)) {
    const sources = [...images(page.story), ...page.images.map(image => image.src), ...(page.coverGallery || []).map(image => image.src)];
    for (const src of sources) assert.ok(caseScreenDimensions(src).width, `Unreserved source image ${src}`);
  }
  assert.deepEqual(caseScreenDimensions("/unrelated.png"), {});
});
