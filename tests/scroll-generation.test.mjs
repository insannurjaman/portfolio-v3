import test from "node:test";
import assert from "node:assert/strict";
import { generate } from "../src/vendor/transitions-generation/ui-generation.js";

function environment(t, reduced) {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const oldMatch = globalThis.matchMedia, oldCancel = globalThis.cancelAnimationFrame;
  globalThis.matchMedia = () => ({ matches: reduced });
  globalThis.cancelAnimationFrame = () => {};
  t.after(() => {
    if (oldMatch) globalThis.matchMedia = oldMatch; else delete globalThis.matchMedia;
    if (oldCancel) globalThis.cancelAnimationFrame = oldCancel; else delete globalThis.cancelAnimationFrame;
  });
  return { style: { opacity: ".9", clipPath: "", filter: "", transition: "color .25s" } };
}

test("reduced motion reveals content without constructing a DOM overlay", async t => {
  const el = environment(t, true), original = { ...el.style };
  const run = generate(el);
  t.mock.timers.tick(0);
  assert.equal(el.style.opacity, original.opacity);
  t.mock.timers.tick(220);
  await run.finished;
  assert.deepEqual(el.style, original);
  assert.equal(el.__tGen, null);
});

test("cancelling before the first frame restores content and prevents late work", async t => {
  const el = environment(t, false), original = { ...el.style };
  const run = generate(el, { delay: 200 });
  assert.equal(el.style.opacity, 0);
  run.cancel();
  t.mock.timers.tick(5000);
  await run.finished;
  assert.deepEqual(el.style, original);
  assert.equal(el.__tGen, null);
});

test("restarting a reveal does not retain an earlier run's hidden style", async t => {
  const el = environment(t, false), original = { ...el.style };
  const first = generate(el, { delay: 200 });
  const second = generate(el, { delay: 200 });
  await first.finished;
  second.cancel();
  await second.finished;
  t.mock.timers.tick(5000);
  assert.deepEqual(el.style, original);
});

const { generationViewportState, collectGenerationTargets } = await import('../src/scroll-generation-targets.js');

test('category reveal waits for useful exposure rather than a sliver at the screen edge', () => {
  const viewport = { width: 1440, height: 900 };
  const card = top => ({ top, bottom: top + 600, height: 600, left: 60, right: 660, width: 600 });
  assert.deepEqual(generationViewportState(card(820), viewport, true), { visible: true, ready: false, below: false, above: false });
  assert.equal(generationViewportState(card(640), viewport, true).ready, true);
  assert.equal(generationViewportState(card(900), viewport, true).below, true);
  assert.equal(generationViewportState(card(-610), viewport, true).visible, false);
  assert.equal(generationViewportState(card(-610), viewport, true).above, true);
  // Small phones and very tall cards must still be able to reach the trigger.
  assert.equal(generationViewportState({ ...card(200), bottom: 1400, height: 1200 }, {width: 390, height: 600}, true).ready, true);
});

test('all four categories remain individual targets when the entire grid fits a tall viewport', t => {
  const previousHeight = Object.getOwnPropertyDescriptor(globalThis, 'innerHeight');
  const previousStyle = Object.getOwnPropertyDescriptor(globalThis, 'getComputedStyle');
  globalThis.innerHeight = 1200;
  globalThis.getComputedStyle = () => ({ display: 'block', visibility: 'visible', position: 'static' });
  t.after(() => {
    if (previousHeight) Object.defineProperty(globalThis, 'innerHeight', previousHeight); else delete globalThis.innerHeight;
    if (previousStyle) Object.defineProperty(globalThis, 'getComputedStyle', previousStyle); else delete globalThis.getComputedStyle;
  });
  function element(category = false, children = []) {
    return {
      children, tagName: category ? 'A' : 'DIV',
      matches: selector => category && selector.includes('.category-tile'),
      querySelector: selector => selector === '.category-tile' ? children.find(c => c.category || c.querySelector(selector)) : null,
      getBoundingClientRect: () => ({ width: 1000, height: category ? 300 : 650 }),
      category
    };
  }
  const cards = Array.from({ length: 4 }, () => element(true));
  const section = element(false, [element(false, cards)]);
  const root = { querySelectorAll: () => [{ children: [section] }] };
  assert.deepEqual(collectGenerationTargets(root), cards);
});

test('content navigation can opt its cards into reveal while ordinary navigation stays visible', t => {
  const previousHeight = Object.getOwnPropertyDescriptor(globalThis, 'innerHeight');
  const previousStyle = Object.getOwnPropertyDescriptor(globalThis, 'getComputedStyle');
  globalThis.innerHeight = 900;
  globalThis.getComputedStyle = () => ({ display: 'block', visibility: 'visible', position: 'static' });
  t.after(() => {
    if (previousHeight) Object.defineProperty(globalThis, 'innerHeight', previousHeight); else delete globalThis.innerHeight;
    if (previousStyle) Object.defineProperty(globalThis, 'getComputedStyle', previousStyle); else delete globalThis.getComputedStyle;
  });
  const node = (type, children = [], optedIn = false) => ({
    children, tagName: type === 'nav' ? 'NAV' : type === 'card' ? 'A' : 'DIV',
    matches(selector) {
      if (selector === '[data-scroll-generation-contents]') return optedIn;
      if (selector.includes('nav:not(')) return type === 'nav' && !optedIn;
      if (selector.includes('.category-tile')) return type === 'card';
      return false;
    },
    querySelector(selector) {
      if (selector !== '.category-tile') return null;
      return children.find(el => el.tagName === 'A' || el.querySelector(selector)) || null;
    },
    getBoundingClientRect: () => ({ width: 600, height: type === 'card' ? 600 : 1250 }),
  });
  const cards = Array.from({ length: 4 }, () => node('card'));
  const directory = node('nav', [node('grid', cards)], true);
  const ordinaryNavigation = node('nav', [node('card')]);
  const root = { querySelectorAll: () => [{ children: [ordinaryNavigation, directory] }] };
  assert.deepEqual(collectGenerationTargets(root), cards);
});

test('custom thumbnail stages and their parent cards never receive a second generation overlay', t => {
  const previousHeight = Object.getOwnPropertyDescriptor(globalThis, 'innerHeight');
  const previousStyle = Object.getOwnPropertyDescriptor(globalThis, 'getComputedStyle');
  globalThis.innerHeight = 900;
  globalThis.getComputedStyle = () => ({ display: 'block', visibility: 'visible', position: 'static' });
  t.after(() => {
    if (previousHeight) Object.defineProperty(globalThis, 'innerHeight', previousHeight); else delete globalThis.innerHeight;
    if (previousStyle) Object.defineProperty(globalThis, 'getComputedStyle', previousStyle); else delete globalThis.getComputedStyle;
  });
  const thumbnail = { matches: selector => selector === '[data-thumbnail-generation]' };
  const copy = {
    children: [], tagName: 'H3', matches: () => false, querySelector: () => null,
    getBoundingClientRect: () => ({ width: 300, height: 50 }),
  };
  const card = {
    children: [thumbnail, copy], tagName: 'A',
    matches: selector => selector.includes('.case-card'),
    querySelector: selector => selector === '[data-thumbnail-generation]' ? thumbnail : null,
    getBoundingClientRect: () => ({ width: 300, height: 500 }),
  };
  const root = { querySelectorAll: () => [{ children: [card] }] };
  assert.deepEqual(collectGenerationTargets(root), [copy]);
});

const { readFileSync } = await import('node:fs');
test('the owner-approved content drawing remains the active engine alongside Motion feedback', () => {
  const controller = readFileSync(new URL('../src/scroll-generation.jsx', import.meta.url), 'utf8');
  assert.match(controller, /import\("\.\/vendor\/transitions-generation\/ui-generation\.js"\)/);
  assert.match(controller, /mode: "skeleton"/);
  assert.match(controller, /import "\.\/vendor\/transitions-generation\/ui-generation\.css"/);
  assert.doesNotMatch(controller, /motion-reveal/);
  const navigation = readFileSync(new URL('../src/case-chapter-navigation.jsx', import.meta.url), 'utf8');
  assert.match(navigation, /motion-feedback\.js/);
});

test('hero discovery reveals the headline and introduction independently, keeping video and actions available', t => {
  const previousHeight = Object.getOwnPropertyDescriptor(globalThis, 'innerHeight');
  const previousStyle = Object.getOwnPropertyDescriptor(globalThis, 'getComputedStyle');
  globalThis.innerHeight = 900;
  globalThis.getComputedStyle = () => ({ display: 'block', visibility: 'visible', position: 'static' });
  t.after(() => {
    if (previousHeight) Object.defineProperty(globalThis, 'innerHeight', previousHeight); else delete globalThis.innerHeight;
    if (previousStyle) Object.defineProperty(globalThis, 'getComputedStyle', previousStyle); else delete globalThis.getComputedStyle;
  });
  const text = tag => ({ tagName: tag, children: [], matches: () => false, closest: () => null, querySelector: () => null, getBoundingClientRect: () => ({ width: 600, height: 140 }) });
  const headline = text('H1'), description = text('P');
  const copy = { querySelectorAll: selector => selector === '[data-hero-text-reveal]' ? [headline, description] : [] };
  const hero = { hidden: false, matches: selector => selector === '.editorial-hero', getBoundingClientRect: () => ({ width: 1280, height: 900 }), querySelector: selector => selector === '.editorial-hero-copy' ? copy : null };
  assert.deepEqual(collectGenerationTargets({ querySelectorAll: () => [{ children: [hero] }] }), [headline, description]);
});
