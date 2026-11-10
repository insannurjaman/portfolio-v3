import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { COMMENT_ENDPOINT, COMMENT_LIMIT, COMMENT_EXCLUSIONS, commentPayload, placeComment, sendComment, validateComment } from "../src/portfolio-comments-model.js";
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("comment validation allows optional reply email and bounds real content", () => {
  assert.equal(validateComment("A useful case study."), null);
  assert.equal(validateComment("A note", "visitor@example.com"), null);
  assert.equal(validateComment("  ").field, "message");
  assert.equal(validateComment("a".repeat(COMMENT_LIMIT + 1)).field, "message");
  for (const email of ["wrong", "a@", "one\n@example.com", "a b@example.com", "@example.com"]) assert.equal(validateComment("A note", email).field, "email");
  assert.equal(validateComment("A note", "  "), null);
});

test("submission payload includes only explicit form content and public section context", () => {
  const payload = commentPayload({ message: "  Useful detail. ", email: " visitor@example.com ", page: "/work?token=secret#chamfer", section: "Chamfer\nUI", website: "" });
  assert.deepEqual(payload, { subject: "Portfolio comment: Chamfer UI", message: "Useful detail.", email: "visitor@example.com", page: "/work", section: "Chamfer UI", _gotcha: "" });
  assert.equal(commentPayload({ message: "note", page: "//external.test" }).page, "/");
  assert.equal(commentPayload({ message: "note", page: "https://example.com/path" }).page, "/");
  assert.equal("email" in commentPayload({ message: "note" }), false);
  assert.equal(COMMENT_ENDPOINT, "https://formspree.io/f/xjygqrwb");
});

test("Formspree success requires an affirmative response and omits cookies/referrer", async () => {
  let observed;
  const signal = new AbortController().signal;
  await sendComment({ message: "test" }, { signal, fetcher: async (url, options) => { observed = { url, options }; return { ok: true, status: 200, json: async () => ({ ok: true }) }; } });
  assert.equal(observed.url, COMMENT_ENDPOINT);
  assert.equal(observed.options.method, "POST");
  assert.equal(observed.options.credentials, "omit");
  assert.equal(observed.options.referrerPolicy, "no-referrer");
  assert.equal(observed.options.signal, signal);
  assert.equal(observed.options.headers.Accept, "application/json");
  assert.deepEqual(JSON.parse(observed.options.body), { message: "test" });
  for (const body of [{}, { ok: false }, { next: "/thanks" }]) await assert.rejects(sendComment({}, { fetcher: async () => ({ ok: true, status: 200, json: async () => body }) }), /Could not confirm/);
  await assert.rejects(sendComment({}, { fetcher: async () => ({ ok: true, status: 200, json: async () => { throw Error("not json"); } }) }), /Could not confirm/);
});

test("provider errors, rate limiting, network failure and abort never become fake success", async () => {
  for (const [status, pattern] of [[429,/Wait a minute/],[400,/check your message/],[422,/check your message/],[403,/verify this request/],[500,/Could not confirm/]]) await assert.rejects(sendComment({}, { fetcher: async () => ({ ok: false, status, json: async () => ({ errors: [{ message: "raw provider text" }] }) }) }), pattern);
  await assert.rejects(sendComment({}, { fetcher: async () => { throw new TypeError("Failed to fetch"); } }), /Your draft is still here/);
  const abort = new DOMException("aborted", "AbortError");
  await assert.rejects(sendComment({}, { fetcher: async () => { throw abort; } }), error => error === abort);
});

test("comment placement keeps small and tall panels inside desktop and mobile viewports", () => {
  for (const width of [320,390,640,768,1280,1440]) for (const height of [320,600,720,900]) for (const x of [-100,0,width/2,width,width+100]) for (const y of [-100,0,height/2,height,height+100]) {
    const panel = { width: Math.min(width-24,width<=640?320:300), height: Math.min(280,height-24) };
    const result = placeComment({ x,y }, panel, { width,height });
    assert.ok(result.x >= 12 && result.x + panel.width <= width-12+.001);
    assert.ok(result.y >= 12 && result.y + panel.height <= height-12+.001);
  }
  assert.deepEqual(placeComment({ x: 100,y: 100 }, { width: 300,height: 228 }, { left: 0,top: 200,width: 390,height: 400 }), { x:45,y:360 });
});

test("comment integration preserves private delivery and section selection inside the new shell", () => {
  const main = read("../src/main.jsx"), source = read("../src/portfolio-comments.jsx"), css = read("../src/portfolio-comments.css");
  assert.ok(main.includes("<PortfolioComments enabled={!searchOpen}/>"));
  assert.match(main, /<SystemDocumentation\/\>.*<PortfolioComments\/\>/);
  assert.match(source, /createPortal/);
  assert.match(source, /role="dialog" aria-modal="false"/);
  assert.match(source, /if \(busy.current/);
  assert.match(source, /setTimeout\(\(\) => controller.abort\(\), 20000\)/);
  assert.match(source, /request.current\?\.abort\(\)/);
  assert.match(source, /event.key === "Escape"/);
  assert.match(source, /Your draft is still here/);
  assert.match(source, /if \(status === "sent"\) \{ setStatus\("idle"\); setEmail\(""\); setWebsite\(""\); \}/);
  assert.match(source, /name="_gotcha"/);
  assert.match(source, /aria-invalid/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|console\.|location\.href|location\.search|document\.body\.innerHTML|track\(/);
  for (const excluded of ["header","nav","footer","input","textarea","canvas",".space-game","[data-comment-ui]"]) assert.ok(COMMENT_EXCLUSIONS.includes(excluded));
  assert.match(css, /width: min\(300px,calc\(100vw - 24px\)\)/);
  assert.match(css, /background: var\(--panel\)/);
  assert.match(css, /border-radius: 0/);
  assert.match(css, /font-size: 16px/);
  assert.match(css, /prefers-reduced-motion/);
});
