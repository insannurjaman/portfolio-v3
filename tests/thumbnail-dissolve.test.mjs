import test from 'node:test';
import assert from 'node:assert/strict';
import { animateThumbnail, thumbnailGeometry, halftoneGrowth } from '../src/thumbnail-dissolve.js';

function scene(t, { unavailable = false, paintFailure = false, fit = 'cover' } = {}) {
  const previous = Object.fromEntries(['document', 'window', 'getComputedStyle'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  let removed = 0, appended = 0, finished = 0, scheduled = 0;
  const frames = new Map(), imageDraws = [], arcs = [];
  const ctx = {
    fillRect() {}, beginPath() {}, save() {}, restore() {}, clip() {}, moveTo() {}, arc(...args) { arcs.push(args); },
    drawImage(...args) { if (paintFailure) throw new Error('Image decode failed'); imageDraws.push(args); },
  };
  globalThis.document = { createElement: () => ({ setAttribute() {}, getContext: () => unavailable ? null : ctx, remove() { removed++; } }) };
  globalThis.window = { devicePixelRatio: 3 };
  globalThis.getComputedStyle = () => ({ objectPosition: '50% 50%', objectFit: fit });
  t.after(() => { for (const [key, descriptor] of Object.entries(previous)) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } });
  const frame = { dataset: {}, getBoundingClientRect: () => ({ width: 400, height: 250 }), append() { appended++; } };
  const image = { naturalWidth: 1200, naturalHeight: 900 };
  const options = { duration: 1000, requestFrame(callback) { frames.set(++scheduled, callback); return scheduled; }, cancelFrame(id) { frames.delete(id); }, onFinish() { finished++; } };
  return { frame, image, options, frames, imageDraws, arcs, stats: () => ({ removed, appended, finished }), step(now) { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(now)); } };
}

test('thumbnail raster budget stays bounded on retina and large displays', () => {
  assert.deepEqual(thumbnailGeometry(400, 250, 3), { width: 600, height: 375 });
  assert.deepEqual(thumbnailGeometry(2000, 1500, 3), { width: 1024, height: 768 });
});

test('reduced motion finishes immediately without allocating a canvas', t => {
  const s = scene(t);
  animateThumbnail(s.frame, s.image, { ...s.options, reduced: true });
  assert.deepEqual(s.stats(), { removed: 0, appended: 0, finished: 1 });
  assert.equal(s.frames.size, 0);
});

for (const failure of [{ unavailable: true }, { paintFailure: true }]) {
  test(`canvas ${failure.paintFailure ? 'image painting' : 'context'} failure reveals the native image`, t => {
    const s = scene(t, failure);
    const run = animateThumbnail(s.frame, s.image, s.options);
    s.step(100); s.step(800);
    run.cancel();
    assert.equal(s.stats().finished, 1);
    assert.equal(s.frames.size, 0);
  });
}

test('cancellation releases canvas and prevents any late paint or completion', t => {
  const s = scene(t);
  const run = animateThumbnail(s.frame, s.image, s.options);
  const late = [...s.frames.values()][0];
  run.cancel(); run.cancel(); late(2000);
  assert.deepEqual(s.stats(), { removed: 1, appended: 1, finished: 1 });
  assert.equal(s.frames.size, 0);
});

test('natural completion removes overlay and uses the same cover crop as the image', t => {
  const s = scene(t);
  animateThumbnail(s.frame, s.image, s.options);
  s.step(100); s.step(700); s.step(1100);
  assert.deepEqual(s.stats(), { removed: 1, appended: 1, finished: 1 });
  assert.equal(s.frames.size, 0);
  // 1200×900 source covers a 600×375 raster: excess height is centered.
  assert.deepEqual(s.imageDraws.at(-1).slice(1), [0, -37.5, 600, 450]);
});


test('halftone starts blank, progresses monotonically through an organic contour, and ends fully open', () => {
  for (let x = 0; x <= 1; x += .05) for (let y = 0; y <= 1; y += .05) {
    assert.equal(halftoneGrowth(0, x, y), 0);
    assert.equal(halftoneGrowth(1, x, y), 1);
    let previous = 0;
    for (let p = 0; p <= 1; p += .02) { const growth = halftoneGrowth(p, x, y); assert.ok(growth >= previous); previous = growth; }
  }
  assert.ok(halftoneGrowth(.1, 0, 0) > .1, 'The first dots appear promptly, without a long blank lead-in');
  assert.notEqual(halftoneGrowth(.5, .2, .5), halftoneGrowth(.5, .8, .5));
});

test('halftone dots stay on a fixed grid while their radii grow', t => {
  const s = scene(t);
  const run = animateThumbnail(s.frame, s.image, s.options);
  s.step(100); s.step(600);
  const initial = new Map(s.arcs.map(([x,y,r]) => [`${x},${y}`, r]));
  assert.ok(initial.size > 0);
  s.arcs.length = 0; s.step(900);
  for (const [x,y,r] of s.arcs) if (initial.has(`${x},${y}`)) assert.ok(r >= initial.get(`${x},${y}`));
  assert.ok(s.arcs.length < 7201);
  run.cancel();
});

test('case-study evidence retains its contain fit without cropping the source UI', t => {
  const s = scene(t, { fit: 'contain' });
  animateThumbnail(s.frame, s.image, s.options);
  s.step(100); s.step(1100);
  assert.deepEqual(s.imageDraws.at(-1).slice(1), [50, 0, 500, 375]);
});
