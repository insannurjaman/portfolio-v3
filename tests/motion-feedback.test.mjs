import test from "node:test";
import assert from "node:assert/strict";

const { animateFeedback } = await import('../src/motion-feedback.js');
test('menu and bookmark feedback reaches its intended state even without animation support', () => {
  const node = { style: {} };
  const control = animateFeedback(node, { opacity: [0, 1], transform: 'translateY(220px)' }, {}, () => { throw new Error('Unsupported native animation'); });
  assert.equal(control, null);
  assert.deepEqual(node.style, { opacity: 1, transform: 'translateY(220px)' });
});

test('hidden tablet chapter lists settle without allocating a native animation', () => {
  const node = { style: {}, getClientRects: () => [] };
  const result = animateFeedback(node, { transform: 'translateY(220px)' }, {}, () => { assert.fail('Hidden elements must not animate'); });
  assert.equal(result, null);
  assert.equal(node.style.transform, 'translateY(220px)');
});

test('route removal or resize cannot throw when native commitStyles loses its target', () => {
  let cancelled = false;
  const control = animateFeedback({ style: {} }, {}, {}, () => ({
    stop() { throw new Error('Target element is not rendered'); },
    cancel() { cancelled = true; },
  }));
  assert.doesNotThrow(() => control.stop());
  assert.equal(cancelled, true);
});
