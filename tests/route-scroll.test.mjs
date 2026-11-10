import test from "node:test";
import assert from "node:assert/strict";
import { resetRouteScroll } from "../src/route-scroll.js";

test("a scrolled route resets before reveal registration without waiting for fonts or a frame", () => {
  let y = 2160, frames = 0;
  const cancel = resetRouteScroll("", {
    root: { fonts: { ready: new Promise(() => {}) } },
    view: { scrollTo: options => { y = options.top; } },
    requestFrame: () => { frames++; }, cancelFrame: () => {},
  });
  // This is the geometry that the next sibling layout effect will observe.
  assert.equal(y, 0);
  assert.equal(frames, 0);
  cancel();
});

test("hash positioning is immediate and refines alignment after fonts settle", async () => {
  let aligned = 0, refine;
  const calls = [];
  const cancel = resetRouteScroll("#experience", {
    root: { getElementById: id => { assert.equal(id, "experience"); return { scrollIntoView: options => { aligned++; calls.push(options); } }; }, fonts: { ready: Promise.resolve() } },
    view: { scrollTo: () => assert.fail("existing anchors should align directly") },
    requestFrame: fn => { refine = fn; return 7; }, cancelFrame: () => {},
  });
  assert.equal(aligned, 1);
  await Promise.resolve();
  refine();
  assert.equal(aligned, 2);
  assert.deepEqual(calls[0], { block: "start", behavior: "instant" });
  cancel();
});

test("leaving a hash route before its fonts load prevents a stale jump on the next page", async () => {
  let ready, aligned = 0, frames = 0;
  const cancel = resetRouteScroll("#selected-work", {
    root: { getElementById: () => ({ scrollIntoView: () => { aligned++; } }), fonts: { ready: new Promise(resolve => { ready = resolve; }) } },
    view: {}, requestFrame: () => { frames++; }, cancelFrame: () => {},
  });
  cancel(); ready(); await Promise.resolve();
  assert.equal(aligned, 1);
  assert.equal(frames, 0);
});

test("leaving a route cancels its queued anchor refinement", async () => {
  let cancelledFrame;
  const cancel = resetRouteScroll("#missing", {
    root: { getElementById: () => null, fonts: { ready: Promise.resolve() } },
    view: { scrollTo: () => {} }, requestFrame: () => 12, cancelFrame: id => { cancelledFrame = id; },
  });
  await Promise.resolve(); cancel();
  assert.equal(cancelledFrame, 12);
});
