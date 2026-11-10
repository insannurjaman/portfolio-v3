import test from 'node:test';
import assert from 'node:assert/strict';
import { revealViewport, revealExposure } from '../src/reveal-viewport.js';

const box = (top, height = 400, left = 0, width = 400) => ({ top, bottom: top + height, height, left, right: left + width, width });
const desktop = { width: 1280, height: 900, top: 82, bottom: 876 };

test('an edge sliver cannot consume a content or image reveal', () => {
  for (const kind of ['content', 'image', 'category']) {
    assert.equal(revealExposure(box(870), desktop, kind).visible, true);
    assert.equal(revealExposure(box(870), desktop, kind).ready, false);
    assert.equal(revealExposure(box(540), desktop, kind).ready, true);
  }
  assert.equal(revealExposure(box(840, 60), desktop).ready, false);
  assert.equal(revealExposure(box(810, 60), desktop).ready, true);
});

test('mobile header and sticky chapter bar exclude covered pixels from exposure', () => {
  const root = (chapterTop, blocked = false) => ({ querySelector(selector) {
    if (selector === '.editorial-header') return { getBoundingClientRect: () => ({ bottom: 62 }) };
    if (selector === '.case-chapter-nav') return { getBoundingClientRect: () => ({ top: chapterTop, bottom: chapterTop + 70 }) };
    if (selector === 'dialog[open]') return blocked ? {} : null;
  } });
  const viewport = revealViewport(root(62), 390, 844);
  assert.equal(viewport.top, 132);
  assert.equal(revealExposure(box(65, 50), viewport).visible, false);
  assert.equal(revealExposure(box(140, 50), viewport).ready, true);
  assert.equal(revealViewport(root(600), 390, 844).top, 62);
  assert.equal(revealExposure(box(200), revealViewport(root(62, true), 390, 844)).ready, false);
});

test('tall evidence and short screens can reach the trigger, while horizontally clipped images wait', () => {
  const phone = { width: 390, height: 600, top: 132, bottom: 576 };
  assert.equal(revealExposure(box(200, 2000, 0, 350), phone, 'image').ready, true);
  assert.equal(revealExposure(box(100, 400, 370, 350), phone, 'image').ready, false);
  assert.equal(revealExposure(box(-1000), phone).above, true);
  assert.equal(revealExposure(box(900), desktop).below, true);
});

test('public component documentation uses its own sticky header and mobile bar', () => {
  const root = { querySelector(selector) {
    if (selector === '.docs-top') return { getBoundingClientRect: () => ({ bottom: 64 }) };
    if (selector === '.docs-mobile-nav') return { getBoundingClientRect: () => ({ top: 64, bottom: 116 }) };
    return null;
  } };
  assert.equal(revealViewport(root, 375, 844).top, 116);
  assert.equal(revealViewport(root, 1280, 900).top, 64);
});

test('the loading intro blocks entrances until it leaves the visible page', () => {
  let intro = true;
  const root = { querySelector(selector) { return selector === '.editorial-intro' && intro ? {} : null; } };
  assert.equal(revealViewport(root, 1280, 900).blocked, true);
  intro = false;
  assert.equal(revealViewport(root, 1280, 900).blocked, false);
});
