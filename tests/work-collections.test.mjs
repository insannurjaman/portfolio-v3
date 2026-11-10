import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { CASE_PREVIEWS } from '../src/case-illustrations.js';
import { WORK_COLLECTIONS, WORK_PROJECTS, WORK_INDUSTRIES, projectsForCollection, industryOptions, selectedIndustry, filteredWork, workCollectionSearchPages, CURATED_CASE_PATHS, portfolioSearchResults } from '../src/work-catalog.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('six selected cases are curated without deleting any original case route',()=>{
  assert.deepEqual(WORK_COLLECTIONS.map(c=>c.path),['/work/saas','/work/design-systems','/work/mobile','/work/ai']);
  assert.deepEqual(WORK_COLLECTIONS.map(c=>c.title),['SaaS & Enterprise','Design Systems & UX Engineering','Mobile Product Design','Experiments']);
  assert.deepEqual(WORK_PROJECTS.filter(p=>p.kind==='case').map(p=>p.path).sort(),Object.keys(CASE_PREVIEWS).sort());
  assert.equal(new Set(WORK_PROJECTS.map(p=>p.path)).size,WORK_PROJECTS.length);
  for(const p of WORK_PROJECTS){assert.ok(p.collections.length);assert.ok(p.industries.length);for(const i of p.industries)assert.ok(WORK_INDUSTRIES[i]);for(const c of p.collections)assert.ok(WORK_COLLECTIONS.some(x=>x.id===c));}
  assert.doesNotMatch(JSON.stringify(WORK_PROJECTS),/hutzper|quick-agent-system/i);
});
test('AI selection uses actual conversational-design evidence and public archive, never AI-assisted tools',()=>{
  assert.deepEqual(projectsForCollection('ai').map(p=>p.path),['/gococo-ai','/divermenu','/ai']);
  assert.ok(!projectsForCollection('mobile').some(p=>p.path==='/divermenu'));
  assert.equal(projectsForCollection('mobile').length,2);
  assert.equal(industryOptions('mobile').some(option=>option.value==='ai'),false);
  assert.ok(projectsForCollection('design-systems').some(p=>p.path==='/uiqa'));
  assert.ok(!projectsForCollection('design-systems').some(p=>p.path==='/pixel-round'));
  assert.doesNotMatch(JSON.stringify(projectsForCollection('ai')),/\/uiqa|\/pixel-round|Codex|OpenCode|\/ai-practice/);
});
test('industry options are collection-specific and every advertised count matches exact filtered results',()=>{
  for(const c of WORK_COLLECTIONS){
    assert.ok(projectsForCollection(c.id).length>0);
    for(const option of industryOptions(c.id)){
      const result=filteredWork(c.id,option.value);assert.equal(result.length,option.count);assert.ok(result.every(p=>p.industries.includes(option.value)&&p.collections.includes(c.id)));
    }
    for(const invalid of ['','missing','<script>','finance&industry=ai']){assert.equal(selectedIndustry(c.id,invalid),'all');assert.deepEqual(filteredWork(c.id,invalid),projectsForCollection(c.id));}
  }
  assert.equal(industryOptions('ai').some(i=>i.value==='government'),false);
});
test('hub, routes and disclosure are rendered with source artwork and safe native navigation',async()=>{
  const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
  try {
    const {WorkHub,WorkLandingPage}=await server.ssrLoadModule('/src/work-collections.jsx');
    const StubCase=({item})=>React.createElement('a',{href:item.path,'data-test-case':item.path},item.title);
    const pages=JSON.parse(read('public/data/content.json')).pages;
    for(const p of WORK_PROJECTS.filter(p=>p.kind==='case'))pages[p.path]??={path:p.path,title:CASE_PREVIEWS[p.path].title,images:[]};
    const render=(node,route='/work')=>renderToStaticMarkup(React.createElement(MemoryRouter,{initialEntries:[route]},node));
    const hub=render(React.createElement(WorkHub,{data:{pages},CaseCard:StubCase}));
    assert.ok(!hub.includes('class="category-tile"'));
    assert.match(hub, /<h1 data-text-reveal="headline">Selected work\.<\/h1>/);
    assert.match(hub, /<p data-text-reveal="description">Six case studies/);
    assert.match(hub, /class="page-hero" data-scroll-generation-contents/);
    assert.match(hub, /class="page-hero-bottom" data-scroll-generation-contents/);
    assert.ok(hub.includes('id="antiflex-ui-highlight"'));
    assert.ok(hub.includes('id="chamfer-ui-highlight"'));
    assert.deepEqual([...hub.matchAll(/data-test-case="([^"]+)"/g)].map(match=>match[1]), [...CURATED_CASE_PATHS]);
    for(const project of WORK_PROJECTS.filter(p=>p.kind==='case'&&!CURATED_CASE_PATHS.includes(p.path)))assert.ok(!hub.includes(`href="${project.path}"`));
    for(const c of WORK_COLLECTIONS){
      const html=render(React.createElement(WorkLandingPage,{collectionId:c.id,data:{pages},CaseCard:StubCase}),c.path);
      assert.ok(html.includes('Explore work by industry'));assert.ok(html.includes('aria-pressed="true"'));assert.ok(html.includes('aria-live="polite"'));
      for(const p of projectsForCollection(c.id).filter(p=>p.kind==='case'))assert.ok(html.includes(`href="${p.path}"`));
      for(const option of industryOptions(c.id)){
        const filtered=render(React.createElement(WorkLandingPage,{collectionId:c.id,data:{pages},CaseCard:StubCase}),`${c.path}?industry=${option.value}`);
        const expected=filteredWork(c.id,option.value);
        for(const p of projectsForCollection(c.id).filter(p=>p.kind==='case'))assert.equal(filtered.includes(`data-test-case="${p.path}"`),expected.some(x=>x.path===p.path));
        assert.equal(filtered.includes('id="antiflex-ui-highlight"'),expected.some(p=>p.kind==='spotlight'));
      }
    }
  } finally {await server.close();}
});
test('editorial navigation exposes every public collection without legacy hover disclosure',()=>{
  const shell=read('src/editorial-shell.jsx'),home=read('src/editorial-home.jsx');
  assert.ok(shell.includes('aria-haspopup="dialog"'));
  assert.ok(shell.includes('aria-label="Mobile navigation"'));
  assert.ok(!home.includes('to={collection.path}'));
  assert.ok(shell.includes('["Experiments", "/work/ai"]'));
  const primary = shell.slice(shell.indexOf('<nav className="editorial-nav"'),shell.indexOf('</nav>',shell.indexOf('<nav className="editorial-nav"')));
  assert.ok(!primary.includes('/articles'));
});
test('filters remain shareable and preserve the visitor’s reading position',()=>{
  const component=read('src/work-collections.jsx'),main=read('src/main.jsx');
  for(const value of ['new URLSearchParams(params)','next.set("industry", value)','next.delete("industry")','preserveWorkScroll: true','aria-controls="work-collection-results"'])assert.ok(component.includes(value));
  assert.ok(main.includes('location.state?.preserveWorkScroll'));
  assert.ok(main.includes('...workCollectionSearchPages'));
});

test('search starts with the hiring selection while older cases remain findable by title', () => {
  const pages = Object.fromEntries(WORK_PROJECTS.filter(item => item.kind === 'case').map(item => [item.path,{path:item.path,title:CASE_PREVIEWS[item.path].title,body:['enterprise workflows']} ]));
  assert.equal(CURATED_CASE_PATHS.length,6);
  assert.deepEqual(portfolioSearchResults(pages).map(page=>page.path),[...CURATED_CASE_PATHS]);
  assert.ok(!portfolioSearchResults(pages,'enterprise workflows').some(page=>!CURATED_CASE_PATHS.includes(page.path)));
  const archived=pages['/shared-calendar-apps'];
  assert.ok(portfolioSearchResults(pages,archived.title).some(page=>page.path===archived.path));
});
