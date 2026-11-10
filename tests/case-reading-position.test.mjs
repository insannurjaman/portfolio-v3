import test from "node:test";
import assert from "node:assert/strict";
import { caseReadingPosition } from "../src/case-reading-position.js";
const base = { offsets: [1000, 2000, 4000, 8000], readingLine: 146, bottom: 10000, viewportHeight: 900 };
test('chapter tracking follows the reading line in both scroll directions and large jumps', () => {
  const read = scrollY => caseReadingPosition({ ...base, scrollY });
  assert.equal(read(0).active, 0);
  assert.equal(read(1850).active, 0);
  assert.equal(read(1854).active, 1);
  assert.equal(read(7900).active, 3);
  assert.equal(read(3900).active, 2);
  assert.equal(read(1000).active, 0);
});
test('reading progress is bounded before and beyond the article', () => {
  assert.equal(caseReadingPosition({ ...base, scrollY: 0 }).progress, 0);
  const middle = caseReadingPosition({ ...base, scrollY: 5000 }).progress;
  assert.ok(middle > 0 && middle < 1);
  assert.equal(caseReadingPosition({ ...base, scrollY: 11000 }).progress, 1);
});
test('responsive reading lines and remeasured content retain the correct chapter', () => {
  assert.equal(caseReadingPosition({ ...base, scrollY: 1830, readingLine: 170 }).active, 1);
  assert.equal(caseReadingPosition({ ...base, offsets: [1000, 3000, 5000, 9000], scrollY: 2100 }).active, 0);
});
