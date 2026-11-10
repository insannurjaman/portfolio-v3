import { kycPages } from "../src/kyc-content.js";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { CASE_PREVIEWS } from "../src/case-illustrations.js";
import { gococoPages } from "../src/gococo-content.js";
import { eAfghanPages } from "../src/e-afghan-content.js";
import { diverMenuPages } from "../src/divermenu-content.js";
import { haloDishPages } from "../src/halodish-content.js";
import { agsPages } from "../src/ags-content.js";
import { agsPricingPages } from "../src/ags-pricing-content.js";
import { designSystemPages } from "../src/design-systems-content.js";
import { clientPortalPages } from "../src/client-portal-content.js";
import { caseChapterTitles, caseChapterId, withCaseNarrative } from "../src/case-narrative.js";
import { CASE_STUDY_CHAPTERS, CASE_STUDY_PROFILES, STRUCTURED_CASE_PATHS, withCaseStudyStructure } from "../src/case-study-structure.js";
import { CASE_IMPACT_RECORDS, CaseStudyReadingBlock } from "../src/case-study-reading.js";

const pages = { ...JSON.parse(readFileSync(new URL("../public/data/content.json", import.meta.url))).pages, ...eAfghanPages, ...diverMenuPages, ...haloDishPages, ...agsPages, ...agsPricingPages, ...designSystemPages, ...clientPortalPages, ...gococoPages, ...kycPages };
const imageSources = story => story.flatMap(block => block.type === "image" ? [block.src] : ["image-group", "system-preview"].includes(block.type) ? (block.images || block.variants).map(image => image.src) : []);
const expected = ["Overview", "Problem", "My Role", "Process", "Key Decisions", "Final Solution", "Outcomes", "Learnings"];

test("all 21 public cases, and only those cases, have an authored eight-part reading model", () => {
  assert.deepEqual(CASE_STUDY_CHAPTERS, expected);
  assert.deepEqual(STRUCTURED_CASE_PATHS, Object.keys(CASE_PREVIEWS));
  assert.deepEqual(Object.keys(CASE_STUDY_PROFILES), STRUCTURED_CASE_PATHS);
  assert.equal(STRUCTURED_CASE_PATHS.length, 21);
  assert.ok(!STRUCTURED_CASE_PATHS.some(path => path.includes("hutzper")));
});

for (const path of STRUCTURED_CASE_PATHS) {
  test(`${path}: eight complete chapters, stable evidence targets, unmodified source record`, () => {
    const original = pages[path];
    const before = JSON.stringify(original);
    const previous = withCaseNarrative(original);
    const page = withCaseStudyStructure(original);
    assert.equal(JSON.stringify(original), before);
    assert.deepEqual(caseChapterTitles(page.story), expected);
    const ids = page.story.flatMap(block => block.type === "h2" ? [caseChapterId(page, block.text, 0)] : block.id ? [block.id] : []);
    assert.equal(new Set(ids).size, ids.length, "No duplicate section or evidence IDs");
    assert.equal(page.chapterIds["Overview"], "chapter-0");
    for (const [index, title] of caseChapterTitles(previous.story || []).entries()) {
      assert.ok(ids.includes(caseChapterId(previous, title, index)), `Lost old target: ${title}`);
    }
    for (const block of page.story.filter(block => block.type === "decision-highlights")) {
      for (const item of block.items) assert.ok(ids.includes(page.chapterIds[item.chapter]), `Broken decision link: ${item.chapter}`);
    }
    const context = page.story.find(block => block.type === "case-facts");
    const profile = CASE_STUDY_PROFILES[path];
    const optionalLabels = [["Timeline", profile.timeline], ["Team", profile.team]]
      .filter(([, value]) => typeof value === "string" && value.trim().length > 0).map(([label]) => label);
    assert.deepEqual(context.items.map(([label]) => label), ["Company / product context", "Users", ...optionalLabels, "My role & scope", "Evidence available"]);
    assert.ok(context.items.every(([, value]) => value?.length));
    assert.ok(page.story.find(block => block.type === "case-facts" && block.stacked)?.items.length === 2);
    const evidenceNotes = page.story.filter(block => block.type === "case-evidence-note");
    assert.equal(evidenceNotes.length, 1);
    assert.ok(evidenceNotes[0].scope && evidenceNotes[0].limitation);
    for (const field of ["images", "coverGallery", "sourceUrl", "sourceLabel", "appLinks", "related"]) assert.deepEqual(page[field], original[field]);
    const sources = imageSources(page.story);
    const originalSources = CASE_STUDY_PROFILES[path].archiveGroups ? original.images.slice(1).map(image => image.src) : imageSources(previous.story.filter((block, index) => !(index <= 1 && block.type === "image" && block.src === previous.images[0]?.src)));
    assert.deepEqual([...sources].sort(), [...originalSources].sort(), "All original evidence images are preserved");
    assert.equal(page.story.filter(block => block.type === "decision-evidence").length, previous.story?.filter(block => block.type === "decision-evidence").length || 0);
    assert.ok(!JSON.stringify(page.story).includes("—"));
    assert.strictEqual(withCaseStudyStructure(page), page, "The adapter is idempotent");
  });
}

test("metrics distinguish reported outcomes from an absent baseline and unrelated claims", () => {
  assert.deepEqual(Object.keys(CASE_IMPACT_RECORDS), ["/saphyte-kyc-verification", "/improve-otp-push-notification", "/ags-onboarding", "/halodish-apps", "/game-store-admin-portal"]);
  for (const rows of Object.values(CASE_IMPACT_RECORDS)) for (const row of rows) assert.equal(row.length, 4);
  assert.match(JSON.stringify(CASE_IMPACT_RECORDS["/improve-otp-push-notification"]), /about 4%/);
  assert.ok(!JSON.stringify(CASE_IMPACT_RECORDS["/improve-otp-push-notification"]).includes("percentage points"));
  assert.match(JSON.stringify(CASE_IMPACT_RECORDS["/halodish-apps"]), /Landing-page/);
  assert.match(JSON.stringify(CASE_IMPACT_RECORDS["/game-store-admin-portal"]), /73 from 8 respondents/);
  assert.match(JSON.stringify(CASE_IMPACT_RECORDS["/game-store-admin-portal"]), /admin portal was excluded/);
});

test("new reading components render semantic lists, real content, and no empty metric regions", () => {
  const page = withCaseStudyStructure(pages["/ags-onboarding"]);
  const summary = renderToStaticMarkup(React.createElement(CaseStudyReadingBlock, { block: page.story[1] }));
  assert.equal((summary.match(/<dt>/g) || []).length, 3);
  assert.match(summary, /The problem/);
  const facts = renderToStaticMarkup(React.createElement(CaseStudyReadingBlock, { block: page.story.find(block => block.type === "case-facts") }));
  assert.equal((facts.match(/<dt>/g) || []).length, 4);
  assert.doesNotMatch(facts, /<dt>(Timeline|Team)<\/dt>|Not recorded/);
  const game = withCaseStudyStructure(pages["/game-store-admin-portal"]);
  const recordedFacts = renderToStaticMarkup(React.createElement(CaseStudyReadingBlock, { block: game.story.find(block => block.type === "case-facts") }));
  assert.match(recordedFacts, /<dt>Timeline<\/dt>/);
  assert.match(recordedFacts, /3 days/);
  assert.doesNotMatch(recordedFacts, /<dt>Team<\/dt>|Not recorded/);
  const impact = renderToStaticMarkup(React.createElement(CaseStudyReadingBlock, { block: { type: "case-impact", path: page.path } }));
  assert.match(impact, /Baseline &amp; comparison/);
  assert.match(impact, /Source &amp; scope/);
  assert.equal(renderToStaticMarkup(React.createElement(CaseStudyReadingBlock, { block: { type: "case-impact", path: "/divermenu" } })), "");
});

test("unsupported quantification and stale live-product wording are not carried into the new narrative", () => {
  const game = withCaseStudyStructure(pages["/game-store-admin-portal"]);
  assert.ok(!JSON.stringify(game.story).includes("more than 80% influence"));
  assert.match(CASE_STUDY_PROFILES[game.path].impact, /not a 73% success rate/);
  const otp = withCaseStudyStructure(pages["/improve-otp-push-notification"]);
  assert.ok(!JSON.stringify(otp.story).includes("live products until now"));
  const finalStart = otp.story.findIndex(block => block.type === "h2" && block.text === "Final Solution");
  const impactStart = otp.story.findIndex(block => block.type === "h2" && block.text === "Outcomes");
  assert.ok(otp.story.slice(finalStart, impactStart).some(block => block.type === "image" && block.src.includes(".gif")));
});

test("unrelated pages and missing records pass through without acquiring case-study claims", () => {
  assert.equal(withCaseStudyStructure(undefined), undefined);
  const unrelated = { path: "/articles/test", body: ["Article"] };
  assert.strictEqual(withCaseStudyStructure(unrelated), unrelated);
  const source = readFileSync(new URL("../src/main.jsx", import.meta.url), "utf8");
  assert.match(source, /const page = withCaseStudyStructure\(data\.pages\[path\]\)/);
  assert.match(source, /CASE_READING_BLOCK_TYPES\.has\(block\.type\)/);
});

test("the production case renderer exposes eight numbered chapters and valid in-page links on all 21 routes", async () => {
  // Remove only browser bootstrapping for server-side rendering, not the production component.
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom", plugins: [{
    name: "case-reading-ssr-test", enforce: "pre",
    transform(code, id) { if (id.endsWith("/src/main.jsx")) return code.replace(/^createRoot\(document.*$/m, "export { CaseStudy };"); },
  }] });
  try {
    const { CaseStudy } = await server.ssrLoadModule("/src/main.jsx");
    for (const path of STRUCTURED_CASE_PATHS) {
      const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(CaseStudy, { data: { pages } })));
      const chapters = [...html.matchAll(/<h2 class="source-heading[^"]*" id="([^"]+)"><span>(\d{2})<\/span>([^<]+)<\/h2>/g)];
      assert.deepEqual(chapters.map(match => match[2]), ["01", "02", "03", "04", "05", "06", "07", "08"], path);
      assert.deepEqual(chapters.map(match => match[3].replaceAll("&amp;", "&")), expected, path);
      const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
      assert.equal(new Set(ids).size, ids.length, `Duplicate rendered ID on ${path}`);
      for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `Broken rendered target ${target} on ${path}`);
      assert.doesNotMatch(html, /Read project summary/, `Summary action is temporarily hidden on ${path}`);
      assert.doesNotMatch(html, /class="text-link case-source-link"/, `Source action is temporarily hidden on ${path}`);
      assert.match(html, /aria-label="Case study chapters"/);
      assert.match(html, /evidence-image-frame/, `Source images retain their frame on ${path}`);
      assert.match(html, /<img[^>]+src="/, `The native evidence image remains available on ${path}`);
      assert.doesNotMatch(html, /data-thumbnail-phase=/, `No-JS evidence remains visible on ${path}`);
      assert.equal([...html.matchAll(/aria-current="location"/g)].length, 1, `One active reading chapter on ${path}`);
      assert.ok(!html.includes("undefined"), path);
    }
  } finally { await server.close(); }
});
