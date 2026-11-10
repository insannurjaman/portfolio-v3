import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import React from "react";

test("Pixel Round story is complete, evidence-labeled and connected", async () => {
  const server = await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:"custom"});
  try {
    const { PluginPage, PIXEL_ROUND_CHAPTERS } = await server.ssrLoadModule("/src/pixel-round.jsx");
    const data = JSON.parse(readFileSync(new URL("../public/data/content.json",import.meta.url),"utf8"));
    const html = renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(PluginPage,{data})));
    assert.equal((html.match(/<h1>/g)||[]).length,1);
    for(const [id] of PIXEL_ROUND_CHAPTERS){assert.ok(html.includes(`id="pixel-round-${id}"`));assert.ok(html.includes(`href="#pixel-round-${id}"`));}
    for(const text of [data.plugin,data.pages["/pixel-round"].images[0].src,"historical, self-reported", "Illustrative rounding example",'width="4281" height="2554"'])assert.ok(html.includes(text));
    assert.ok(!html.includes("signal-lab"));
    assert.ok(!html.includes("Travel &amp; Transportation"));
    assert.ok(!html.includes('class="eyebrow"'));
  } finally { await server.close(); }
});
