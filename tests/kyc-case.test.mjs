import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { KYC_CASE_PATH, KYC_ARTICLE_URL, KYC_SCREENS, KYC_PROTOTYPES, kycPages } from '../src/kyc-content.js';
import { CASE_IMPACT_RECORDS, BUSINESS_METRIC_EVIDENCE } from '../src/case-study-reading.js';
import { CASE_STUDY_CHAPTERS } from '../src/case-study-structure.js';
import { CURATED_CASE_PATHS, WORK_PROJECTS } from '../src/work-catalog.js';

const page = kycPages[KYC_CASE_PATH];
test('KYC preserves every published analysis and UI artifact without recompression', () => {
  assert.equal(Object.keys(KYC_SCREENS).length, 23);
  for (const screen of Object.values(KYC_SCREENS)) {
    const bytes = readFileSync(new URL(`../public${screen.src}`, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), screen.sha256);
    assert.equal(screen.width, 1400);
    assert.ok(screen.height > 300);
    assert.match(screen.sourceUrl, /^https:\/\/miro\.medium\.com\//);
    assert.ok(screen.alt.length > 20);
  }
  const evidence = page.story.flatMap(block => block.type === 'image' ? [block.src] : ['image-group', 'source-gallery'].includes(block.type) ? block.images.map(image => image.src) : []);
  assert.deepEqual([...page.images.map(image => image.src), ...evidence].sort(), Object.values(KYC_SCREENS).map(image => image.src).sort());
});

test('KYC distinguishes the May 2025 design challenge from unverified production results', () => {
  assert.deepEqual(page.story.filter(block => block.type === 'h2').map(block => block.text), CASE_STUDY_CHAPTERS);
  assert.equal(page.sourceUrl, KYC_ARTICLE_URL);
  const copy = JSON.stringify(page, (key, value) => ['sha256', 'sourceUrl'].includes(key) ? undefined : value);
  assert.match(copy, /three-day/);
  assert.match(copy, /6 May 2025/);
  assert.match(copy, /does not report completed task testing/);
  assert.match(copy, /one of two required documents approved beside a 100% label/);
  assert.ok(page.story.some(block => block.type === 'case-impact' && block.path === KYC_CASE_PATH));
  assert.match(JSON.stringify(CASE_IMPACT_RECORDS[KYC_CASE_PATH]), /507.*May 2026.*2,265.*June 2026/);
  assert.match(JSON.stringify(CASE_IMPACT_RECORDS[KYC_CASE_PATH]), /not unique users, completed verifications/);
  assert.match(BUSINESS_METRIC_EVIDENCE[KYC_CASE_PATH].evidence, /not this later metric/);
  assert.equal(page.images[0].src, KYC_SCREENS['admin-queue'].src);
  assert.equal(CURATED_CASE_PATHS.length, 6);
  assert.ok(!CURATED_CASE_PATHS.includes(KYC_CASE_PATH));
  assert.ok(WORK_PROJECTS.some(project => project.path === KYC_CASE_PATH));
  assert.equal(KYC_PROTOTYPES.length, 2);
  for (const link of KYC_PROTOTYPES) {
    const url = new URL(link.href);
    assert.equal(url.hostname, 'www.figma.com');
    assert.match(url.pathname, /^\/proto\//);
    assert.equal(url.searchParams.has('t'), false);
  }
});

test('source galleries use native keyboard disclosure and full-size local evidence links', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  try {
    const { SourceEvidenceGallery } = await server.ssrLoadModule('/src/source-evidence-gallery.jsx');
    const galleries = page.story.filter(block => block.type === 'source-gallery');
    assert.equal(galleries.length, 2);
    for (const block of galleries) {
      const html = renderToStaticMarkup(React.createElement(SourceEvidenceGallery, { block }));
      assert.match(html, /<details class="source-evidence-gallery"><summary/);
      assert.doesNotMatch(html, /<details[^>]* open/);
      assert.equal((html.match(/loading="lazy"/g) || []).length, block.images.length);
      assert.equal((html.match(/class="evidence-image-frame"/g) || []).length, block.images.length);
      assert.equal((html.match(/<img /g) || []).length, block.images.length);
      for (const image of block.images) {
        assert.ok(html.includes(`href="${image.src}"`));
        assert.ok(html.includes(`width="${image.width}" height="${image.height}"`));
      }
    }
  } finally { await server.close(); }
});
