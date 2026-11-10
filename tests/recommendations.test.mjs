import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const normalizeApprovedPunctuation = text => text.replace(/\s*\u2014\s*/g, ", ");
test("eight recommendations preserve supplied wording with owner-approved punctuation and exclude the requested author", () => {
  const content = JSON.parse(read("../src/recommendations-content.json"));
  const source = JSON.parse(read("./fixtures/recommendations-source.json"));
  assert.equal(content.recommendations.length, 8);
  assert.equal(new Set(content.recommendations.map(r => r.id)).size, 8);
  for (const name of source.excluded ?? []) assert.ok(!content.recommendations.some(item => item.name === name));
  assert.equal(content.sourceUrl, "https://www.linkedin.com/in/insannurjaman/");
  for (const item of content.recommendations) {
    const original = source.recommendations.find(r => r.name === item.name);
    assert.ok(original);
    assert.deepEqual(item.paragraphs, original.paragraphs.map(normalizeApprovedPunctuation));
    assert.equal(item.date, original.date);
    assert.equal(item.role, original.role);
    assert.ok(normalizeApprovedPunctuation(original.paragraphs.join("\n\n")).includes(item.excerpt));
  }
});
test("horizontal rail exposes all eight native quote disclosures and navigation", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { Recommendations } = await server.ssrLoadModule("/src/recommendations.jsx");
    const html = renderToStaticMarkup(React.createElement(Recommendations));
    assert.equal((html.match(/class="recommendation-entry"/g) || []).length, 8);
    assert.equal((html.match(/<details /g) || []).length, 8);
    assert.equal((html.match(/<summary>/g) || []).length, 8);
    assert.ok(html.includes('aria-label="Previous recommendation"'));
    assert.ok(html.includes('aria-label="Next recommendation"'));
    assert.ok(html.includes('tabindex="0"'));
    assert.ok(html.includes('aria-controls="recommendations-list"'));
    assert.ok(html.includes('role="status"'));
    assert.ok(html.includes("from Adi Ritonga"));
    for (const name of JSON.parse(read("./fixtures/recommendations-source.json")).excluded ?? []) assert.ok(!html.includes(name));
    assert.equal((html.match(/<img /g) || []).length, 8);
    assert.equal((html.match(/alt=""/g) || []).length, 8);
    assert.equal((html.match(/loading="lazy"/g) || []).length, 8);
    assert.ok(!html.includes("View all 8 recommendations"));
  } finally { await server.close(); }
});
test("all eight verified portraits are local JPEGs with an initials error fallback", () => {
  const content = JSON.parse(read("../src/recommendations-content.json"));
  for (const item of content.recommendations) {
    assert.equal(item.photo, `/assets/recommendations/${item.id}.jpg`);
    const bytes = readFileSync(new URL(`../public${item.photo}`, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 3)], [0xff, 0xd8, 0xff]);
    assert.ok(bytes.length < 30000);
  }
  const component = read("../src/recommendations.jsx");
  assert.match(component, /item.photo && !photoFailed/);
  assert.match(component, /onError=\{\(\) => setPhotoFailed\(true\)\}/);
  assert.match(component, /\{item.initials\}/);
  const css = read("../src/recommendations.css");
  assert.match(css, /object-fit: cover/);
});
test("editorial homepage retains all recommendations and accessible manual browsing", () => {
  const home = read("../src/editorial-home.jsx");
  assert.ok(home.includes("<Recommendations/>"));
  const css = read("../src/recommendations.css");
  for (const token of ["max-width:620px", "prefers-reduced-motion:reduce", ":focus-visible", "scroll-snap-type:x mandatory", "grid-auto-flow:column"]) assert.ok(css.includes(token));
  assert.ok(!css.includes("infinite"));
});
