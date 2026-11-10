import { KYC_CASE_PATH } from "../src/kyc-content.js";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import vm from "node:vm";
import { RENAISSANCE_COVERS } from "../src/renaissance-covers.js";
import { PROJECT_THUMBNAIL_OVERRIDES } from "../src/project-thumbnail-overrides.js";
import { FEATURED_WORK } from "../src/hiring-content.js";
import { CASE_ILLUSTRATIONS, CASE_PREVIEWS } from "../src/case-illustrations.js";
import { GOCOCO_PATH } from "../src/gococo-content.js";
import { CLIENT_PORTAL_PATH } from "../src/client-portal-content.js";
import { DESIGN_SYSTEM_CASES } from "../src/design-systems-content.js";
import { AGS_CASES } from "../src/ags-projects.js";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the 19 original numbered illustrations remain intact and every public case has a preview", () => {
  const literal = read("src/main.jsx").match(/const CASE_PATHS = (\[[\s\S]*?\n\]);/)[1];
  const paths = vm.runInNewContext(literal, { CLIENT_PORTAL_PATH, DESIGN_SYSTEM_CASES, AGS_CASES, GOCOCO_PATH, KYC_CASE_PATH });
  assert.equal(paths.length, 21);
  assert.deepEqual(Object.keys(CASE_PREVIEWS).sort(), Array.from(paths).sort());
  assert.deepEqual(Object.keys(CASE_ILLUSTRATIONS).sort(), Array.from(paths).filter(path => path !== GOCOCO_PATH && path !== KYC_CASE_PATH).sort());
  assert.deepEqual(Object.values(CASE_ILLUSTRATIONS).map(x => x.number), Array.from({ length: 19 }, (_, i) => i+1));
  for (const [index, path] of paths.filter(path => path !== GOCOCO_PATH && path !== KYC_CASE_PATH).entries()) assert.equal(CASE_ILLUSTRATIONS[path].number, index+1);
});

test("every case and AI project has distinct responsive Renaissance artwork, while original covers remain available", () => {
  assert.equal(Object.keys(RENAISSANCE_COVERS).length, 25);
  assert.equal(new Set(Object.values(RENAISSANCE_COVERS).map(image => image.src)).size, 25);
  for (const image of Object.values(RENAISSANCE_COVERS)) {
    assert.equal(image.width, 1448);
    assert.equal(image.height, 1086);
    assert.match(image.alt, /Renaissance illustration:/);
    for (const candidate of image.srcSet.split(", ")) {
      const [src] = candidate.split(" ");
      const file = new URL(`../public${src}`, import.meta.url);
      const bytes = readFileSync(file);
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
      assert.ok(statSync(file).size < 900000, src);
    }
  }
  for (const image of Object.values(CASE_ILLUSTRATIONS)) assert.ok(existsSync(new URL(`../public${image.src}`, import.meta.url)));
  for (const [path, image] of Object.entries(CASE_PREVIEWS)) assert.equal(image, PROJECT_THUMBNAIL_OVERRIDES[path] || RENAISSANCE_COVERS[path]);
  for (const image of Object.values(PROJECT_THUMBNAIL_OVERRIDES)) {
    const supplied = readFileSync(new URL(`../public${image.src}`, import.meta.url));
    assert.equal(supplied.subarray(1, 4).toString(), "PNG");
    assert.equal(supplied.readUInt32BE(16), image.width);
    assert.equal(supplied.readUInt32BE(20), image.height);
  }
});

test("Home uses the approved project covers while collections and case-study evidence remain intact", () => {
  const main = read("src/main.jsx");
  assert.match(main, /Boolean\(CASE_PREVIEWS\[item.path\]\)/);
  assert.match(main, /illustrated \? <ProjectCover path=\{item.path\}/);
  assert.match(main, /page\.coverGallery/);
  assert.match(main, /src=\{page.images\[0\].src\}/);
  const home = read("src/editorial-home.jsx");
  for (const project of FEATURED_WORK.filter(item => PROJECT_THUMBNAIL_OVERRIDES[item.path])) {
    assert.equal(project.image, CASE_PREVIEWS[project.path].src);
  }
  assert.ok(existsSync(new URL("../public/media/ags-pricing/calculator.png", import.meta.url)));
  assert.ok(existsSync(new URL("../public/media/client-portal/accounts.png", import.meta.url)));
  assert.match(home, /View all 6 case studies/);
  assert.ok(!home.includes("<ProjectCover"));
  assert.match(read("src/design-systems.jsx"), /<ProjectCover path=\{item.path\}/);
  assert.match(read("src/project-cover.jsx"), /srcSet=\{image.srcSet\}/);
  assert.match(read("src/project-cover.jsx"), /onError=/);
  assert.ok(read("src/editorial-content.css").includes("aspect-ratio:1672/941"));
  assert.match(read("src/editorial-content.css"), /project-illustration>img\{[^}]*object-fit:contain/);
});
