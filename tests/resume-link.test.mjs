import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

const expected = "https://drive.google.com/file/d/1HkjKyZpRm60VEEsZf932QFnPh0jIdxAH/view?usp=sharing";
test("current resume URL is shared by content and editorial footer", async () => {
  const data = JSON.parse(readFileSync(new URL("../public/data/content.json", import.meta.url), "utf8"));
  assert.equal(data.resume, expected);
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
  const original = globalThis.window;
  try {
    globalThis.window = { matchMedia: () => ({ matches: true }) };
    const { EditorialFooter, RESUME_URL } = await server.ssrLoadModule("/src/editorial-shell.jsx");
    assert.equal(RESUME_URL, expected);
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(EditorialFooter, { resume: data.resume })));
    assert.ok(html.includes(`href="${expected.replaceAll("&", "&amp;")}"`));
    assert.ok(html.includes("View resume"));
  } finally {
    globalThis.window = original;
    await server.close();
  }
});
