import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { AGS_CASES, AGS_SCREENS, agsPages } from "../src/ags-content.js";
import { AGS_PRICING_SCREENS, agsPricingPages } from "../src/ags-pricing-content.js";
import { caseChapterTitles, caseChapterId, withCaseNarrative } from "../src/case-narrative.js";
import { HOME_FEATURED_PROJECTS } from "../src/home-featured-content.js";

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const pages = { ...agsPages, ...agsPricingPages };
const screens = new Set([...Object.values(AGS_SCREENS), ...Object.values(AGS_PRICING_SCREENS)].map(image => image.src));
for (const item of AGS_CASES) {
  test(`${item.path}: complete, distinct, evidence-linked case study`, () => {
    const page = pages[item.path];
    assert.equal(page.path, item.path);
    assert.equal(withCaseNarrative(page), page);
    assert.equal(page.narrative, true);
    assert.equal(page.designCase, true);
    assert.match(page.metadata.role, /Insan Nurjaman/);
    assert.equal(page.metadata.value, "Original Figma designs");
    assert.match(page.sourceUrl, /figma\.com\/design\/(C7I1ez5sQelYrnFLl9Bn4M|cpSGHTJaslysQufnXSS4dG).*node-id=/);
    const headings = caseChapterTitles(page.story);
    assert.ok(headings.length >= 9);
    const ids = headings.map((text, i) => caseChapterId(page, text, i));
    assert.equal(new Set(ids).size, ids.length);
    const brief = page.story.find(block => block.type === "brief");
    for (const field of ["problem", "audience", "contribution", "outcome", "limits"]) assert.ok(brief[field]);
    assert.match(brief.limits, /not project results or current commercial terms/);
    const decisions = page.story.find(block => block.type === "decision-highlights");
    assert.equal(decisions.items.length, 3);
    for (const decision of decisions.items) assert.ok(headings.includes(decision.chapter));
    const related = page.story.find(block => block.type === "related-cases");
    assert.equal(related.items.length, 4);
    for (const other of related.items) { assert.notEqual(other.path, item.path); assert.ok(pages[other.path]); }
    assert.ok(page.story.some(block => block.type === "p" && block.text.includes("proposed validation plan, not research already conducted")));
    const text = JSON.stringify(page);
    assert.doesNotMatch(text, /we interviewed|I interviewed|conversion increased|reduced .*by \d+%|shipped in|sole designer/i);
    const images = page.story.flatMap(block => block.type === "image" ? [block] : block.type === "image-group" ? block.images : []);
    assert.ok(images.length >= 4);
    for (const image of images) { assert.ok(image.alt); assert.ok(image.caption); assert.ok(screens.has(image.src)); }
  });
}
test("all 16 AGS exports reserve exact source-image proportions", () => {
  assert.equal(Object.keys(AGS_SCREENS).length, 16);
  for (const image of Object.values(AGS_SCREENS)) {
    const png = fs.readFileSync(new URL(`../public${image.src}`, import.meta.url));
    assert.equal(image.width, png.readUInt32BE(16));
    assert.equal(image.height, png.readUInt32BE(20));
  }
});
test("AGS is discoverable on Home, Work, Developer Tools, and related stories", () => {
  const featured = HOME_FEATURED_PROJECTS.filter(item => item.path.startsWith("/ags-"));
  assert.equal(featured.length, 1);
  assert.equal(featured[0].path, "/ags-pricing-calculator");
  assert.equal(featured[0].wide, undefined);
  const main = read("src/main.jsx");
  assert.match(main, /\.\.\.AGS_CASES\.map\(item => item\.path\)/);
  assert.match(main, /\.\.\.agsPages/);
  assert.match(main, /block\.type === "related-cases"/);
  assert.match(read("src/industry-gallery.jsx"), /path === "\/developer-tools" && <AGSCaseLinks\/>/);
  const links = read("src/ags-case-links.jsx");
  assert.match(links, /<Link to=\{item\.path\}/);
  assert.match(links, /aria-label="Explore AccelByte design stories"/);
  assert.doesNotMatch(links, /target="_blank"|<button/);
});

test("all 14 pricing exports reserve exact proportions and exclude attributed pages", () => {
  assert.equal(Object.keys(AGS_PRICING_SCREENS).length, 14);
  const retainedPages = new Set(["1:4", "3029:25281", "2553:24899", "2677:45059", "1778:38407"]);
  const excludedPages = new Set(["3067:25869", "1385:8840"]);
  for (const image of Object.values(AGS_PRICING_SCREENS)) {
    assert.ok(retainedPages.has(image.pageId));
    assert.ok(!excludedPages.has(image.pageId));
    const png = fs.readFileSync(new URL(`../public${image.src}`, import.meta.url));
    assert.equal(image.width, png.readUInt32BE(16));
    assert.equal(image.height, png.readUInt32BE(20));
  }
  assert.doesNotMatch(JSON.stringify(agsPricingPages), /Fariz|Azure|3067[:\-]25869|1385[:\-]8840/i);
});

test("new stories distinguish forecasts, acquisition, and post-adoption billing", () => {
  assert.equal(AGS_CASES.length, 5);
  assert.equal(new Set(AGS_CASES.map(item => item.path)).size, 5);
  const calculator = agsPricingPages["/ags-pricing-calculator"];
  const pricing = agsPricingPages["/ags-pricing-experience"];
  assert.match(JSON.stringify(calculator), /estimate is a scenario, not an amount already owed/);
  assert.match(JSON.stringify(calculator), /not a validated cost calculation/);
  assert.match(JSON.stringify(pricing), /No conversion increase/);
  assert.ok(calculator.story.some(block => block.type === "decision-evidence" && block.images.some(image => image.src.includes("mobile-sheet"))));
  assert.ok(pricing.story.some(block => block.type === "image" && block.src.includes("pricing-faq")));
  assert.doesNotMatch(read("src/ags-case-links.jsx"), /Three connected stories/);
  assert.match(read("src/main.jsx"), /\.\.\.agsPricingPages/);
});
