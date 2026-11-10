import test from "node:test";
import assert from "node:assert/strict";
import { loadPortfolioContent } from "../src/content-loader.js";

test("content loading preserves the cancellation signal and expected payload", async () => {
  const controller = new AbortController();
  const expected = { pages: { "/about": { title: "About" } } };
  const content = await loadPortfolioContent({ signal: controller.signal, fetchImpl: async (url, options) => {
    assert.equal(url, "/data/content.json");
    assert.equal(options.signal, controller.signal);
    return { ok: true, json: async () => expected };
  } });
  assert.equal(content, expected);
});

test("failed, malformed, and interrupted responses reject instead of rendering corrupt content", async () => {
  await assert.rejects(loadPortfolioContent({ fetchImpl: async () => ({ ok: false }) }), /Content request failed/);
  for (const invalid of [null, {}, { pages: [] }]) {
    await assert.rejects(loadPortfolioContent({ fetchImpl: async () => ({ ok: true, json: async () => invalid }) }), /unavailable/);
  }
  const abort = new DOMException("Cancelled", "AbortError");
  await assert.rejects(loadPortfolioContent({ fetchImpl: async () => { throw abort; } }), { name: "AbortError" });
});
