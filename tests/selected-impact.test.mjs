import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { SELECTED_IMPACT, IMPACT_ATTRIBUTION } from '../src/selected-impact-content.js';
import { CASE_IMPACT_RECORDS } from '../src/case-study-reading.js';

test('four owner-reported metrics preserve their measures and only link substantiating case studies', () => {
  assert.deepEqual(SELECTED_IMPACT.map(item => item.metric), ['+347%','+25%','+19%','6,000']);
  const [kyc, activation, paid, otp] = SELECTED_IMPACT;
  assert.equal(Math.round((kyc.comparison.after / kyc.comparison.before - 1) * 100), 347);
  assert.match(kyc.description, /507 in May to 2,265 in June 2026, coinciding/);
  assert.match(kyc.qualification, /not a verified increase in successful KYC completion/);
  assert.equal(kyc.caseStudy.path, '/saphyte-kyc-verification');
  assert.equal(paid.caseStudy, null);
  assert.match(paid.description, /paying studios associated with self-service billing/);
  assert.equal(activation.caseStudy.path, '/ags-onboarding');
  assert.equal(otp.caseStudy.path, '/improve-otp-push-notification');
  assert.match(otp.secondary, /Estimated monthly savings: Rp2.1 million/);
  for (const item of [kyc, activation, otp]) assert.ok(CASE_IMPACT_RECORDS[item.caseStudy.path]);
  assert.match(IMPACT_ATTRIBUTION, /not independently verified/);
  assert.match(IMPACT_ATTRIBUTION, /do not establish design as the sole cause/);
});

test('impact renders readable without JavaScript or a number animation, with accessible project links', async () => {
  const server = await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
  try {
    const { SelectedImpact } = await server.ssrLoadModule('/src/selected-impact.jsx');
    const html = renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(SelectedImpact)));
    assert.doesNotMatch(html, /data-scroll-generation-skip|data-scroll-generation="idle"|opacity:\s*0/);
    assert.equal((html.match(/data-scroll-generation-contents/g)||[]).length, 2);
    assert.equal((html.match(/<article /g)||[]).length, 4);
    assert.equal((html.match(/<h2 /g)||[]).length, 1);
    assert.equal((html.match(/<h3 /g)||[]).length, 4);
    for (const metric of SELECTED_IMPACT) { assert.ok(html.includes(metric.metric)); assert.ok(html.includes(`id="impact-${metric.id}"`)); }
    assert.equal((html.match(/<a /g)||[]).length, 3);
    assert.doesNotMatch(html, /href="\/(loyica-client-portal|ags-pricing-calculator|accelbyte-design-system|ags-billing-usage)"/);
    assert.doesNotMatch(html, /<button|aria-hidden="true">[+0-9]/);
  } finally { await server.close(); }
});
