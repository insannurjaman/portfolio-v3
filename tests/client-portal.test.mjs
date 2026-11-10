import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { clientPortalPages, clientPortalSystemPages, CLIENT_PORTAL_PATH, CLIENT_SYSTEM_PATH, CLIENT_PORTAL_SCREENS, CLIENT_SYSTEM_SCREENS, CLIENT_PORTAL_DEMO, CLIENT_PORTAL_FILE, CLIENT_SYSTEM_FILE } from "../src/client-portal-content.js";
import { DESIGN_SYSTEM_CASES, designSystemPages } from "../src/design-systems-content.js";

for (const [route, page] of Object.entries({...clientPortalPages,...clientPortalSystemPages})) {
  test(`${route}: confirmed ownership, source evidence and connected chapters`, () => {
    assert.equal(page.path,route);
    assert.ok(page.designCase && page.narrative && page.portalCase);
    const headings=page.story.filter(block=>block.type==="h2").map(block=>block.text);
    assert.equal(new Set(headings.map(heading=>page.chapterIds[heading])).size,headings.length);
    for (const heading of headings) assert.ok(page.chapterIds[heading]);
    const brief=page.story.find(block=>block.type==="brief");
    assert.match(brief.contribution,/I redesigned/);
    assert.match(brief.limits,/not|do not/);
    const decisions=page.story.find(block=>block.type==="decision-highlights").items;
    assert.equal(decisions.length,3);
    for (const item of decisions) assert.ok(headings.includes(item.chapter));
    const related=page.story.find(block=>block.type==="portal-related");
    assert.equal(related.items[0].path,route===CLIENT_PORTAL_PATH?CLIENT_SYSTEM_PATH:CLIENT_PORTAL_PATH);
  });
}

test("all 19 Client Portal exports preserve exact PNG dimensions and Figma provenance", () => {
  const screens=[...Object.values(CLIENT_PORTAL_SCREENS),...Object.values(CLIENT_SYSTEM_SCREENS)];
  assert.equal(screens.length,19);
  for (const screen of screens) {
    const data=fs.readFileSync(new URL(`../public${screen.src}`,import.meta.url));
    assert.equal(data.subarray(1,4).toString(),"PNG");
    assert.equal(data.readUInt32BE(16),screen.width,screen.src);
    assert.equal(data.readUInt32BE(20),screen.height,screen.src);
    assert.ok(screen.src.includes("client-portal-system") ? screen.sourceUrl === CLIENT_SYSTEM_FILE : /node-id=\d+-\d+/.test(screen.sourceUrl));
  }
});

test("source comparisons use their own portal/library provenance and all source exports", () => {
  const used=new Set();
  for (const page of [...Object.values(clientPortalPages),...Object.values(clientPortalSystemPages)]) {
    for (const block of page.story) {
      for (const image of block.type==="image"?[block]:block.images||block.variants||[]) {
        used.add(image.src);
        assert.ok(image.sourceUrl.startsWith(page.systemCase?CLIENT_SYSTEM_FILE:CLIENT_PORTAL_FILE));
      }
    }
  }
  // The system's state-card composition leads its cover; the other 18 appear in chapters.
  for (const page of Object.values(clientPortalSystemPages)) page.images.forEach(image=>used.add(image.src));
  assert.equal(used.size,19);
  const component=fs.readFileSync(new URL("../src/design-systems.jsx",import.meta.url),"utf8");
  assert.ok(component.includes('return to Design Systems'));
  assert.ok(!component.includes('View the source in Figma'));
});

test("portal and system have distinct discovery and truthful demo links", () => {
  assert.equal(designSystemPages[CLIENT_SYSTEM_PATH],clientPortalSystemPages[CLIENT_SYSTEM_PATH]);
  assert.ok(DESIGN_SYSTEM_CASES.some(item=>item.path===CLIENT_SYSTEM_PATH));
  assert.equal(clientPortalPages[CLIENT_PORTAL_PATH].appLinks[0].href,CLIENT_PORTAL_DEMO);
  const main=fs.readFileSync(new URL("../src/main.jsx",import.meta.url),"utf8");
  assert.match(main,/const CASE_PATHS = \[\s+CLIENT_PORTAL_PATH/);
  assert.match(main,/\.\.\.clientPortalPages/);
  const experience=fs.readFileSync(new URL("../src/experience.jsx",import.meta.url),"utf8");
  assert.ok(experience.includes(CLIENT_PORTAL_PATH) && experience.includes(CLIENT_SYSTEM_PATH));
});
