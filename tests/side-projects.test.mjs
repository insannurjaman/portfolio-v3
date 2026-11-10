import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("Tools starts with the builder story, then both cards and working source/detail destinations", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { SideProjectsPage, SIDE_PROJECT_PATHS, sideProjectsSearchPage } = await server.ssrLoadModule("/src/side-projects.jsx");
    const data = JSON.parse(read("../public/data/content.json"));
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(SideProjectsPage, { data })));
    assert.deepEqual([...SIDE_PROJECT_PATHS], ["/pixel-round", "/uiqa"]);
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.match(html, /<h1>Tools\.<\/h1>/);
    assert.ok(html.indexOf("I’m a designer who likes building tools") < html.indexOf('class="side-projects-list"'));
    assert.equal((html.match(/class="side-project article-card"/g) || []).length, 2);
    assert.equal(sideProjectsSearchPage.title, "Tools");
    for (const text of ['href="/pixel-round"', 'href="/uiqa"', data.plugin, 'href="https://github.com/insannurjaman/uiqa"']) assert.ok(html.includes(text), text);
    assert.equal((html.match(/<article /g) || []).length, 2);
    assert.equal(sideProjectsSearchPage.path, "/side-projects");
    for (const name of ["Pixel Round", "UIQA"]) assert.ok(sideProjectsSearchPage.body.join(" ").includes(name));
    const { AboutPage } = await server.ssrLoadModule("/src/about.jsx");
    const about = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(AboutPage, { data })));
    assert.doesNotMatch(about, /Pixel Round|UIQA|id="tools"/);
  } finally { await server.close(); }
});

test("navigation, search and old tool entry points lead to the dedicated section", () => {
  const main = read("../src/main.jsx");
  assert.match(main, /<Route path="\/side-projects" element=\{<SideProjectsPage data=\{data\}\/?>\}/);
  assert.ok(read("../src/editorial-shell.jsx").includes('["Tools & side projects", "/side-projects"]'));
  assert.doesNotMatch(main, />Plugin<|\['Plugin'/);
  assert.ok(main.includes("sideProjectsSearchPage"));
  assert.match(main, /location\.hash === "#tools"/);
  const home = main.slice(main.indexOf("function Home("), main.indexOf("function CaseCard("));
  const work = main.slice(main.indexOf("function WorkIndex("), main.indexOf("function PageHero("));
  assert.doesNotMatch(home + work, /Pixel Round|UIQA|plugin-tease|UiqaFeature/);
  for (const file of ["../src/pixel-round.jsx", "../src/uiqa.jsx"]) assert.match(read(file), /to="\/side-projects"/);
  assert.match(read("../src/side-projects.css"), /max-width:900px/);
  assert.match(read("../src/side-projects.css"), /prefers-reduced-motion:reduce/);
});

test("tool cards share blog framing, keep preview content first and have responsive safe actions", () => {
  const source = read("../src/side-projects.jsx");
  for (const id of ["pixel-round", "uiqa"]) {
    const start = source.indexOf(`aria-labelledby="${id}-project-title"`);
    const end = source.indexOf("</article>", start);
    const card = source.slice(start, end);
    assert.ok(card.indexOf('className="side-project-preview side-project-cover"') < card.indexOf("<small>"));
    assert.ok(card.indexOf("<small>") < card.indexOf(`<h2 id="${id}-project-title"`));
    assert.ok(card.indexOf('className="side-project-actions"') > card.indexOf("<ProjectCover"));
  }
  const css = read("../src/side-projects.css");
  assert.match(css, /\.side-projects-list \{ display: grid; grid-template-columns: repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /@media \(max-width:900px\).*\.side-projects-list \{ grid-template-columns: minmax\(0,1fr\)/);
  assert.match(css, /\.side-project-actions \{ margin-top: auto/);
  assert.match(css, /\.side-project a:focus-visible/);
  assert.match(css, /min-height: 44px/);
  assert.match(source, /aria-label="Open Pixel Round in Figma \(opens in a new tab\)"/);
  assert.match(source, /aria-label="View UIQA source on GitHub \(opens in a new tab\)"/);
});
