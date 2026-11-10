import test from "node:test";
import assert from "node:assert/strict";
import { beginEditorialIntro } from "../src/editorial-intro.js";

const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
function observe(t, ready, reduced = false) {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const events = [];
  const cancel = beginEditorialIntro({ ready, reduced, onReveal: () => events.push("reveal"), onComplete: () => events.push("complete") });
  return { events, cancel };
}

test("cached assets still leave time for the authored opening on every mount", async t => {
  for (let mount = 0; mount < 2; mount++) {
    const { events } = observe(t, Promise.resolve());
    await flush();
    t.mock.timers.tick(949);
    assert.deepEqual(events, []);
    t.mock.timers.tick(1);
    assert.deepEqual(events, ["reveal"]);
    t.mock.timers.tick(350);
    assert.deepEqual(events, ["reveal", "complete"]);
    t.mock.timers.reset();
  }
});

test("a stalled critical asset cannot cover the page beyond 1.5 seconds", async t => {
  let resolve;
  const { events } = observe(t, new Promise(done => { resolve = done; }));
  t.mock.timers.tick(1150);
  assert.deepEqual(events, ["reveal"]);
  t.mock.timers.tick(350);
  assert.deepEqual(events, ["reveal", "complete"]);
  resolve();
  await flush();
  t.mock.timers.tick(5000);
  assert.deepEqual(events, ["reveal", "complete"]);
});

test("failed artwork releases the opening normally", async t => {
  const { events } = observe(t, Promise.reject(new Error("image unavailable")));
  await flush();
  t.mock.timers.tick(950);
  t.mock.timers.tick(350);
  assert.deepEqual(events, ["reveal", "complete"]);
});

test("unmount cancels timers and late media callbacks", async t => {
  let resolve;
  const { events, cancel } = observe(t, new Promise(done => { resolve = done; }));
  cancel();
  resolve();
  await flush();
  t.mock.timers.tick(5000);
  assert.deepEqual(events, []);
});

test("reduced motion opens immediately without waiting on media", t => {
  const { events } = observe(t, new Promise(() => {}), true);
  assert.deepEqual(events, ["reveal", "complete"]);
  t.mock.timers.tick(5000);
  assert.deepEqual(events, ["reveal", "complete"]);
});
