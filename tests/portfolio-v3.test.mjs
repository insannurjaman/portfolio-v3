import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

const create = React.createElement;
const render = (...elements) => renderToStaticMarkup(create(MemoryRouter, { initialEntries: ["/"] }, ...elements));

test("homepage renders the portfolio sections in order, correct case links and all original recommendations", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { PortfolioHome } = await server.ssrLoadModule("/src/portfolio-home.jsx");
    const html = render(create(PortfolioHome));
    assert.deepEqual([...html.matchAll(/<section\b[^>]*aria-labelledby="([^"]+)"/g)].map(match => match[1]),
      ["home-title", "home-github-title", "home-companies-title", "selected-work-title", "shipped-projects-title", "home-experience-title", "home-testimonials-title"]);
    assert.deepEqual([...html.matchAll(/<a[^>]*data-funnel="selected_case" href="([^"]+)"/g)].map(match => match[1]),
      ["/halodish-apps", "/improve-otp-push-notification", "/ags-onboarding", "/saphyte-kyc-verification"]);
    assert.match(html, /Trusted design partner for companies worldwide/);
    assert.match(html, /src="\/media\/saphyte-kyc\/admin-queue.webp"/);
    assert.match(html, /href="mailto:hello.insanz@gmail.com"/);
    assert.match(html, /href="\/pixel-round"/);
    assert.match(html, /href="\/uiqa"/);
    assert.match(html, /href="https:\/\/antiflex-ui.vercel.app\//);
    assert.match(html, /aria-controls="recommendations-list"/);
    assert.equal((html.match(/class="recommendation-entry"/g) || []).length, 8);
    assert.doesNotMatch(html, /Sergio Torreguitart|figma.com\/api\/mcp\/asset/);
    for (const [, source] of html.matchAll(/<img[^>]*src="(\/[^"]+)"/g)) {
      assert.ok(existsSync(new URL(`../public${source}`, import.meta.url)), source);
    }
  } finally {
    await server.close();
  }
});

test("the static homepage keeps navigation, contact and full quotes without JS controls", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  try {
    const { PortfolioHome } = await server.ssrLoadModule("/src/portfolio-home.jsx");
    const { PortfolioHeader, PortfolioFooter } = await server.ssrLoadModule("/src/portfolio-shell.jsx");
    const html = render(create(PortfolioHeader, { interactive: false }), create(PortfolioHome, { interactive: false }), create(PortfolioFooter));
    for (const path of ["/", "/#contact", "/design-systems", "/articles", "/industries"]) {
      assert.ok(html.includes(`href="${path}"`), path);
    }
    assert.match(html, /id="recommendations-list"/);
    assert.equal((html.match(/class="recommendation-full"/g) || []).length, 8);
    assert.match(html, /id="contact"/);
    assert.match(html, /id="experience"/);
    assert.doesNotMatch(html, /href="\/about"/);
    const primaryNav = html.match(/<nav[^>]*aria-label="Primary navigation"[^>]*>[\s\S]*?<\/nav>/)[0];
    assert.doesNotMatch(primaryNav, /href="\/(?:work|side-projects)"/);
    assert.match(primaryNav, /href="https:\/\/drive\.google\.com\/file\/d\/[^"]+" target="_blank" rel="noopener noreferrer">Resume/);
    assert.doesNotMatch(html, /role="switch"|aria-label="Next recommendation"|data-scroll-generation|data-thumbnail-generation/);
  } finally {
    await server.close();
  }
});

test("theme bootstrap honors a saved light preference and survives blocked storage", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const bootstrap = html.match(/<script id="portfolio-theme">([\s\S]*?)<\/script>/)[1];
  assert.match(html, /<html lang="en" data-theme="dark"/);
  for (const [getItem, expected] of [
    [() => "light", "light"], [() => null, "dark"], [() => { throw new Error("blocked"); }, "dark"],
  ]) {
    const meta = { content: "#171717" };
    const documentElement = { dataset: { theme: "dark" } };
    runInNewContext(bootstrap, { localStorage: { getItem }, document: { documentElement, querySelector: () => meta } });
    assert.equal(documentElement.dataset.theme, expected);
    assert.equal(meta.content, expected === "light" ? "#fafafa" : "#171717");
  }
});
