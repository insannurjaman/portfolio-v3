import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";
import { AI_PROJECTS, ROUNDING_EXAMPLE, AI_RESPONSIBILITIES, aiPracticeSearchPage, projectForKey } from "../src/ai-practice-content.js";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("AI Practice includes exactly the three public owner-confirmed builds and real destinations", () => {
  assert.deepEqual(AI_PROJECTS.map(project => project.title), ["antiflex/ui", "UIQA", "Pixel Round"]);
  assert.equal(new Set(AI_PROJECTS.map(project => project.id)).size, 3);
  for (const project of AI_PROJECTS) {
    assert.ok(project.role);
    assert.match(project.assistance, /Codex/);
    assert.equal(project.story.length, 3);
    assert.ok(project.story.map(chapter => chapter.body).join(" ").split(/\s+/).length > 130);
    for (const action of project.actions) {
      assert.match(action.href, /^(https:\/\/|\/(?!\/))/);
      assert.equal(Boolean(action.external), action.href.startsWith("https://"));
      assert.doesNotMatch(action.href, /figma\.com\/design/);
    }
    if (project.image) assert.ok(existsSync(new URL("../public" + project.image, import.meta.url)));
  }
  assert.match(AI_PROJECTS.find(project => project.id === "uiqa").description, /Deterministic static checks, not an AI-powered evaluator/);
  assert.ok(!AI_PROJECTS.some(project => project.id === "portfolio"));
  assert.doesNotMatch(JSON.stringify([AI_PROJECTS, aiPracticeSearchPage]), /OpenCode|portfolio|social artwork/i);
  assert.equal(aiPracticeSearchPage.path, "/ai-practice");
  assert.equal(aiPracticeSearchPage.title, "AI Practice");
  assert.equal(AI_RESPONSIBILITIES.length, 3);
  for (const project of AI_PROJECTS) assert.ok(aiPracticeSearchPage.body.join(" ").includes(project.title));
  assert.doesNotMatch(JSON.stringify([AI_PROJECTS, AI_RESPONSIBILITIES, aiPracticeSearchPage]), /\u2014|[0-9]+%|times faster/);
});

test("project keyboard destinations wrap, support Home/End, and ignore unrelated keys", () => {
  for (let index = 0; index < AI_PROJECTS.length; index++) {
    const id = AI_PROJECTS[index].id;
    for (const key of ["ArrowRight", "ArrowDown"]) assert.equal(projectForKey(id, key), AI_PROJECTS[(index + 1) % AI_PROJECTS.length].id);
    for (const key of ["ArrowLeft", "ArrowUp"]) assert.equal(projectForKey(id, key), AI_PROJECTS[(index + AI_PROJECTS.length - 1) % AI_PROJECTS.length].id);
    assert.equal(projectForKey(id, "Home"), "antiflex");
    assert.equal(projectForKey(id, "End"), "pixel");
    for (const key of ["Tab", "Escape", "Enter", " "]) assert.equal(projectForKey(id, key), null);
  }
  assert.equal(projectForKey("missing", "Home"), null);
});

test("production component renders the approved compact workbench with accessible tab relationships", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { AiPracticePage } = await server.ssrLoadModule("/src/ai-practice.jsx");
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(AiPracticePage)));
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.match(html, /<h1>Design-led\. AI-assisted\.<\/h1>/);
    assert.match(html, /href="#ai-workbench"/);
    assert.match(html, /role="tablist" aria-label="Projects"/);
    assert.equal((html.match(/role="tab"/g) || []).length, 3);
    assert.equal((html.match(/aria-selected="true"/g) || []).length, 1);
    assert.match(html, /id="ai-tab-antiflex" aria-selected="true" aria-controls="ai-project-panel" tabindex="0"/);
    assert.equal((html.match(/aria-controls="ai-project-panel" tabindex="-1"/g) || []).length, 2);
    assert.match(html, /role="tabpanel" id="ai-project-panel" aria-labelledby="ai-tab-antiflex" tabindex="0"/);
    for (const text of ["My role", "AI contribution", "Frame the problem", "Shape the experience", "Review the result", "Built with AI assistance, not presented as AI-powered products."]) assert.ok(html.includes(text));
    assert.ok(html.indexOf('class="ai-workbench"') < html.indexOf('class="ai-practice-responsibility"'));
    assert.equal((html.match(/class="ai-project-story"/g) || []).length, 1);
    for (const chapter of AI_PROJECTS[0].story) assert.ok(html.includes(chapter.title));
    assert.doesNotMatch(html, /OpenCode|Portfolio social|ai-tab-portfolio|portfolio-og-v4/i);
    for (const href of ["https://antiflex-ui.vercel.app/docs", "https://antiflex-ui.vercel.app/demo", "/work", "/side-projects"]) assert.ok(html.includes(`href="${href}"`));
    assert.equal((html.match(/opens in a new tab/g) || []).length, 2);
    assert.doesNotMatch(html, /\u2014/);
  } finally { await server.close(); }
});

test("every public artifact renders without fabricated scan results or performance claims", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { ProjectArtifact } = await server.ssrLoadModule("/src/ai-practice.jsx");
    for (const project of AI_PROJECTS) {
      const html = renderToStaticMarkup(React.createElement(ProjectArtifact, { project }));
      assert.ok(html.includes(project.caption));
      if (project.image) assert.ok(html.includes(`src="${project.image}"`));
      if (project.id === "uiqa") {
        assert.match(html, /npm install -D @insannurjaman\/uiqa/);
        assert.match(html, /npx uiqa scan --path .\/src --format markdown/);
        assert.match(html, /Installation example/);
        assert.doesNotMatch(html, /No issues found|0 errors|Score:|passed/);
      }
      if (project.id === "pixel") {
        assert.match(html, /Illustrative layer values/);
        for (const value of ROUNDING_EXAMPLE) {
          assert.equal(Math.round(Number(value.before)), Number(value.after));
          assert.ok(html.includes(value.before) && html.includes(value.after));
        }
      }
    }
  } finally { await server.close(); }
});

test("AI practice remains routable and discoverable inside the editorial portfolio", () => {
  const main = read("../src/main.jsx"), shell = read("../src/editorial-shell.jsx"), home = read("../src/editorial-home.jsx");
  assert.ok(main.includes('path="/ai-practice"'));
  assert.ok(main.includes('"/ai-practice": aiPracticeSearchPage'));
  assert.ok(shell.includes('["AI practice", "/ai-practice"]'));
  assert.ok(!home.includes('to="/ai-practice"')); // Available through secondary navigation.
  assert.ok(main.includes('<EditorialFooter resume={data.resume}/>'));
});

test("workbench keeps source media intact, responsive reflow, square token surfaces and reduced-motion fallback", () => {
  const css = read("../src/ai-practice.css");
  assert.match(css, /background: var\(--panel\)/);
  assert.match(css, /border: 1px solid var\(--line\)/);
  assert.match(css, /border-radius: 0/);
  assert.match(css, /\.ai-artifact img \{[^}]*width: 100%; height: auto/);
  assert.match(css, /@media\(min-width:1024px\)/);
  assert.match(css, /@media\(max-width:620px\)/);
  assert.match(css, /overflow-x: auto/);
  assert.match(css, /overflow-wrap: anywhere/);
  assert.match(css, /\.ai-project-tabs button:focus-visible/);
  assert.match(css, /\.ai-project-panel:focus-visible/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /@media\(prefers-reduced-motion:no-preference\)/);
  assert.doesNotMatch(css, /filter: grayscale|object-fit: cover|border-radius: [1-9]|transition: all/);
});
