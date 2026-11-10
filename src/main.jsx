import { EditorialHeader, EditorialFooter } from "./editorial-shell.jsx";
import { KYC_CASE_PATH, kycPages } from "./kyc-content.js";
import { SourceEvidenceGallery } from "./source-evidence-gallery.jsx";
import { EditorialHome } from "./editorial-home.jsx";
import { PortfolioHome } from "./portfolio-home.jsx";
import { PortfolioFooter, PortfolioHeader } from "./portfolio-shell.jsx";
import { TextEntrance } from "./text-entrance.jsx";
import { resetRouteScroll } from "./route-scroll.js";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, Navigate } from "react-router-dom";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Command, Menu, Play, Search, Sparkles, X } from "lucide-react";
import { eAfghanPages } from "./e-afghan-content";
import { diverMenuPages } from "./divermenu-content";
import { haloDishPages } from "./halodish-content";
import { agsPages, AGS_CASES } from "./ags-content";
import { agsPricingPages } from "./ags-pricing-content";
import { DesignSystemsPage, SystemEvidencePreview, SystemTokenTable } from "./design-systems.jsx";
import { designSystemPages, designSystemsSearchPage, DESIGN_SYSTEM_CASES } from "./design-systems-content.js";
import { SystemDocumentation } from "./system-docs.jsx";
import { SYSTEM_STORY_DOCS } from "./system-docs-data.js";
import { clientPortalPages, CLIENT_PORTAL_PATH } from "./client-portal-content.js";
import { PortalCaseLinks, PortalTokenMap } from "./client-portal.jsx";
import { CoreFoundationEvidence } from "./saphyte-eafghans.jsx";
import { AGSCaseLinks } from "./ags-case-links";
import { UiqaPage, uiqaSearchPage } from "./uiqa";
import { ProjectCover, PROJECT_COVER_LABELS } from "./project-cover";
import { CASE_PREVIEWS } from "./case-illustrations.js";
import { gococoPages, GOCOCO_PATH } from "./gococo-content.js";
import { experienceSearchPage } from "./experience";
import { AboutPage, aboutSearchPage } from "./about";
import { SideProjectsPage, sideProjectsSearchPage, SIDE_PROJECT_PATHS } from "./side-projects";
import { AiPracticePage } from "./ai-practice.jsx";
import { aiPracticeSearchPage } from "./ai-practice-content.js";
import { PortfolioComments } from "./portfolio-comments.jsx";
import { caseChapterTitles, caseChapterId } from "./case-narrative";
import { CaseChapterNavigation } from "./case-chapter-navigation.jsx";
import { RouteMetadata } from "./route-metadata.jsx";
import { withCaseStudyStructure, CASE_STUDY_PROFILES } from "./case-study-structure.js";
import { CaseStudyReadingBlock, CASE_READING_BLOCK_TYPES } from "./case-study-reading.js";
import { caseScreenDimensions } from "./case-screen-dimensions";
import "./case-narrative.css";
import "./evidence-images.css";
import { IndustryGallery } from "./industry-gallery";
import "./industry-gallery.css";
import { CaseDecisionEvidence } from "./case-decision-evidence";
import { PluginPage } from "./pixel-round";
import { loadPortfolioContent } from "./content-loader.js";
import { WorkHub, WorkLandingPage } from "./work-collections.jsx";
import { WORK_COLLECTIONS, workCollectionSearchPages, CURATED_CASE_PATHS, CURATED_CASE_LABELS, portfolioSearchResults } from "./work-catalog.js";
import "./editorial.css";
import "./editorial-content.css";
import "./hiring-home.css";
import "./portfolio-theme.css";

// Temporarily hidden by the owner; keep the original links for later restoration.
const SHOW_CASE_HERO_ACTIONS = false;

export const CASE_PATHS = [
  CLIENT_PORTAL_PATH,
  ...DESIGN_SYSTEM_CASES.map(item => item.path),
  ...AGS_CASES.map(item => item.path),
  "/halodish-apps",
  "/divermenu",
  "/e-afghan-landing-page", "/e-afghan-citizen-portal",
  "/fincy-apps", "/game-store-admin-portal", "/improve-otp-push-notification",
  "/optimizing-the-use-of-allowances", "/relling-apps", "/shared-calendar-apps",
  GOCOCO_PATH,
  KYC_CASE_PATH,
];

const INDUSTRIES = [
  ["AI", "/ai"], ["Business", "/business"], ["Collaboration", "/collaboration"],
  ["Communication", "/communication"], ["CRM", "/crm"], ["Crypto & Web3", "/crypto-web3"],
  ["Developer Tools", "/developer-tools"], ["E-Commerce", "/e-commerce"], ["Education", "/education"],
  ["Entertainment", "/entertainment"], ["Finance", "/finance"], ["Health & Fitness", "/health-fitness"],
  ["Jobs & Recruitment", "/jobs-recruitment"], ["Lifestyle", "/lifestyle"], ["Logistic", "/logistic"],
  ["Photo & Video", "/photousic-video"], ["Productivity", "/productivity"], ["Real Estate", "/real-estate"],
  ["Technology", "/technology"], ["Travel & Transportation", "/travel-transportation"],
];

const CASE_STUDY_NAV_LABELS = new Set([
  "Fincy Apps", "Game Store & Admin Portal", "Improve OTP Push Notification",
  "Optimizing the Use of Allowances", "Relling Apps", "Shared Calendar Apps",
  ...INDUSTRIES.map(([name]) => name),
]);

export function enrichPortfolioContent(content) {
  return { ...content, pages: { ...content.pages, ...eAfghanPages, ...diverMenuPages, ...haloDishPages, ...agsPages, ...agsPricingPages, ...clientPortalPages, ...designSystemPages, ...gococoPages, ...kycPages, ...workCollectionSearchPages, "/design-systems": designSystemsSearchPage, "/uiqa": uiqaSearchPage, "/side-projects": sideProjectsSearchPage, "/ai-practice": aiPracticeSearchPage, [experienceSearchPage.path]: experienceSearchPage, "/about": aboutSearchPage } };
}

function useContent() {
  const [data, setData] = useState(null),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
  useEffect(() => {
    const controller=new AbortController();let active=true;setError(false);
    const timeout=setTimeout(()=>controller.abort(),12000);
    loadPortfolioContent({signal:controller.signal}).then(content=>{if(active)setData(enrichPortfolioContent(content));}).catch(()=>{if(active)setError(true);}).finally(()=>clearTimeout(timeout));
    return ()=>{active=false;clearTimeout(timeout);controller.abort();};
  }, [attempt]);
  return {data,error,retry:()=>setAttempt(n=>n+1)};
}

function ScrollReset({ ready }) {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = previous; };
  }, []);
  useLayoutEffect(() => {
    if (!ready) return;
    if (location.state?.preserveWorkScroll && location.pathname.startsWith("/work/")) return;
    if (location.pathname === "/about" && location.hash === "#tools") {
      navigate("/side-projects", { replace: true });
      return;
    }
    return resetRouteScroll(location.hash);
  }, [location.pathname, location.hash, location.key, location.state, navigate, ready]);
  return null;
}

export function SearchPalette({ data, open, onClose, returnFocus }) {
  const [query, setQuery] = useState("");
  const panel = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const down = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", down); return () => window.removeEventListener("keydown", down);
  }, [open, onClose]);
  useEffect(() => { if (!open) setQuery(""); }, [open]);
  useEffect(() => {
    document.body.classList.toggle("search-open", open);
    return () => document.body.classList.remove("search-open");
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const trap = event => {
      if (event.key !== "Tab") return;
      const controls = [...panel.current.querySelectorAll('input,button,a[href]')].filter(node => !node.disabled && node.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", trap);
    return () => {
      window.removeEventListener("keydown", trap);
      returnFocus?.current?.focus();
    };
  }, [open, returnFocus]);
  const results = useMemo(() => {
    if (!data) return [];
    return portfolioSearchResults(data.pages, query);
  }, [data, query]);
  if (!open) return null;
  return <div className="search-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div ref={panel} className="search-panel" role="dialog" aria-modal="true" aria-label="Search portfolio">
      <div className="search-field"><Search/><input aria-label="Search portfolio pages" autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects, tools, articles…"/><kbd>ESC</kbd><button className="search-close" type="button" onClick={onClose} aria-label="Close search"><X size={20}/></button></div>
      <div className="search-results">
        <span className="eyebrow">{query ? `${results.length} results` : "Selected work and essentials"}</span>
        {results.length === 0 && <p className="search-empty">No matching pages. Try a project name or “design systems”.</p>}{results.map((p, i) => <button key={p.path} onClick={() => { navigate(p.path); onClose(); }}><span>{String(i+1).padStart(2,"0")}</span><strong>{p.title}</strong><ArrowUpRight/></button>)}
      </div>
    </div>
  </div>;
}

function CaseCard({ item, index, headingFirst = false }) {
  const image = item.thumbnail || item.images[0]?.src;
  const illustrated = Boolean(CASE_PREVIEWS[item.path]);
  const brief = withCaseStudyStructure(item)?.story?.find(block => block.type === "case-summary");
  const company = CASE_STUDY_PROFILES[item.path]?.company?.split(" · ")[0];
  const summary = item.intro || item.body?.[0] || item.description || "Explore the project context and interface designs.";
  return <Link className={`case-card case-${index} article-card`} to={item.path}>
    {headingFirst && <header className="curated-case-heading"><p>{company}</p><h3>{CURATED_CASE_LABELS[item.path] || item.title}</h3></header>}
    <div className={`case-visual ${illustrated ? "illustration-visual" : ""}`}>
      {illustrated ? <ProjectCover path={item.path} sizes="(max-width: 620px) calc(100vw - 56px), (max-width: 1024px) 45vw, 30vw"/> : image ? <img src={image} alt={`${item.title} project cover`} loading="lazy" decoding="async"/> : <span className="case-visual-fallback">{item.title}</span>}
    </div>
    {!headingFirst && <><small>{PROJECT_COVER_LABELS[item.path] || item.category || (item.path === "/game-store-admin-portal" ? "UX strategy · E-commerce" : item.path === "/improve-otp-push-notification" ? "Growth · E-commerce" : "Product design · Mobile")}</small>
    <h3>{item.title}</h3></>}
    {brief ? <>{!headingFirst && <p className="case-card-company">{company}</p>}<dl className="case-card-details"><div><dt>Problem</dt><dd>{brief.problem}</dd></div><div><dt>My contribution</dt><dd>{brief.contribution}</dd></div><div><dt>Outcome</dt><dd>{brief.outcome}</dd></div></dl></> : <p>{summary}</p>}
    <span className="read-link">View case study <ArrowRight aria-hidden="true"/></span>
  </Link>;
}

function WorkIndex({ data }) {
  return <WorkHub data={data} CaseCard={CaseCard}/>;
}

function PageHero({ eyebrow, title, copy, stat, compact=false }) {
  return <section className={`page-hero ${compact ? "is-compact" : ""}`}><h1>{title}</h1><div className="page-hero-bottom"><p>{copy}</p><span>{stat}</span></div></section>;
}

function IndustriesIndex({ data }) {
  return <main id="main-content" className="inner-page"><PageHero eyebrow="Industry archive" title="Range is a design advantage." copy="A visual archive of interface explorations across 20 product categories and business models." stat="20 / INDUSTRIES"/>
    <section className="industry-index section-pad">{INDUSTRIES.map(([name,path],i) => { const p=data.pages[path]; return <Link to={path} key={path} className="industry-tile"><div>{p.images[0] && <img src={p.images[0].src} alt="" loading="lazy"/>}</div><span>{String(i+1).padStart(2,"0")}</span><h2>{name}</h2><small>{p.images.length} explorations</small><ArrowUpRight/></Link>; })}</section>
  </main>;
}

function GalleryPage({ data }) {
  const path = "/" + useParams()["*"];
  const page = data.pages[path];
  if (!page || !INDUSTRIES.some(([, route]) => route === path)) return <NotFound/>;
  return <IndustryGallery key={path} page={page} path={path} industries={INDUSTRIES}/>;
}

function CaseStudy({ data }) {
  const path = useLocation().pathname;
  const page = withCaseStudyStructure(data.pages[path]);
  useEffect(() => { document.title = `${page?.title || "Project"} | Insan Nurjaman`; }, [page?.title]);
  if (!page) return <NotFound/>;
  const headings = page.story ? caseChapterTitles(page.story)
    : [...page.headings.h4, ...page.headings.h5].filter(Boolean);
  return <main id="main-content" className={`case-page ${page.designCase ? "design-case" : ""} ${page.mobileCase ? "mobile-design-case" : ""} ${page.narrative ? "narrative-case" : ""} ${page.systemCase ? "system-case" : ""} ${page.portalCase ? "portal-case" : ""}`}>
    <section className="case-hero">
      <Link to={page.systemCase ? "/design-systems" : "/work"} className="back-link"><ArrowLeft/> {page.systemCase ? "All design systems" : "All work"}</Link>
      <h1>{page.title}</h1><p>{page.body[0]}</p>
      {SYSTEM_STORY_DOCS[path] && <Link className="text-link case-docs-link" to={SYSTEM_STORY_DOCS[path]}>Explore public documentation <ArrowRight size={18}/></Link>}
      <div className="case-meta"><span>Role<br/><b>{page.metadata?.role || "Product Designer"}</b></span><span>Practice<br/><b>{page.metadata?.practice || "Research · UX · UI"}</b></span><span>{page.metadata?.label || "Archive"}<br/><b>{page.metadata?.value || "Full source preserved"}</b></span></div>
      {page.appLinks && <div className="case-app-links">{page.appLinks.map(link => <a className="pill-link" key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={16}/></a>)}</div>}
      {SHOW_CASE_HERO_ACTIONS && (page.narrative ? <div className="case-reading-actions"><a className="text-link" href="#chapter-0">Read project summary <ArrowDownRight size={18}/></a>{page.sourceUrl && <a className="text-link case-source-link" href={page.sourceUrl} target="_blank" rel="noreferrer">{page.sourceLabel || "Explore the Figma design"} <ArrowUpRight size={16}/></a>}</div> : page.sourceUrl && <a className="text-link case-source-link" href={page.sourceUrl} target="_blank" rel="noreferrer">{page.sourceLabel || "Explore the Figma design"} <ArrowUpRight size={16}/></a>)}
    </section>
    {page.coverGallery ? <figure className="case-cover mobile-case-cover"><div className="mobile-cover-grid">{page.coverGallery.map(img => <a key={img.src} href={img.src} target="_blank" rel="noreferrer" aria-label={`Open ${img.caption} full size`}><div className="evidence-image-frame"><img src={img.src} alt={img.alt} width={caseScreenDimensions(img.src).width || img.width} height={caseScreenDimensions(img.src).height || img.height}/></div><span>{img.caption}<ArrowUpRight size={16}/></span></a>)}</div><figcaption>{page.coverCaption || "Actual HaloDish design screens. Open a screen to inspect it at full size."}</figcaption></figure> : page.images[0] && <div className="case-cover"><div className="case-cover-image evidence-image-frame"><img src={page.images[0].src} alt={page.images[0].alt || `${page.title} cover`} width={caseScreenDimensions(page.images[0].src).width || page.images[0].width} height={caseScreenDimensions(page.images[0].src).height || page.images[0].height}/></div></div>}
    <section className="case-story section-pad">
      <CaseChapterNavigation key={path} chapters={(page.designCase ? headings : headings.slice(0,10)).map((title, index) => ({ title, id: caseChapterId(page, title, index) }))}/>
      <article>{renderCaseContent(page, headings)}{page.related && <div className="case-companion"><p>Explore the other side of the E-Afghan experience.</p><Link className="text-link" to={page.related}>{data.pages[page.related].title}<ArrowRight size={18}/></Link></div>}</article>
    </section>
    <NextProject current={path} data={data}/>
  </main>;
}

function renderCaseContent(page, chapterTitles) {
  if (page.story?.length) {
    const story = page.story.filter((block, i) => {
      if (i === 0 && block.type === "p" && block.text === page.body[0]) return false;
      if (i <= 1 && block.type === "image" && block.src === page.images[0]?.src) return false;
      return true;
    });
    while (story.length) {
      const last = story[story.length - 1];
      const label = last.type === "p" ? last.text?.trim() : "";
      if (!CASE_STUDY_NAV_LABELS.has(label)) break;
      story.pop();
    }
    let chapter = 0;
    return story.map((block, i) => {
      if (CASE_READING_BLOCK_TYPES.has(block.type)) return <CaseStudyReadingBlock key={i} block={block}/>;
      if (block.type === "decision-evidence") return <CaseDecisionEvidence key={i} block={block}/>;
      if (block.type === "system-preview") return <SystemEvidencePreview key={i} block={block}/>;
      if (block.type === "system-tokens") return <SystemTokenTable key={i}/>;
      if (block.type === "portal-token-map") return <PortalTokenMap key={i}/>;
      if (block.type === "core-foundations") return <CoreFoundationEvidence key={i}/>;
      if (block.type === "portal-related") return <PortalCaseLinks key={i} items={block.items}/>;
      if (block.type === "related-cases") return <AGSCaseLinks key={i} title={block.title} items={block.items} compact/>;
      if (block.type === "brief") return <div className="case-brief-section" key={i}>
        <dl className="case-brief"><div><dt>The problem</dt><dd>{block.problem}</dd></div><div><dt>Who it’s for</dt><dd>{block.audience}</dd></div><div><dt>My contribution</dt><dd>{block.contribution}</dd></div><div><dt>Delivery & evidence</dt><dd>{block.outcome}</dd></div></dl>
        <p className="case-brief-note">{block.limits}</p>
      </div>;
      if (block.type === "decision-highlights") return <ul className="case-key-decisions" aria-label="Three key design decisions" key={i}>{block.items.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.rationale}</p><a href={`#${caseChapterId(page,item.chapter,chapterTitles.indexOf(item.chapter))}`}>{item.link}<ArrowDownRight size={17} aria-hidden="true"/></a></li>)}</ul>;
      if (block.type === "links") return <div className="case-app-links story-app-links" key={i}>{block.links.map(link => <a className="pill-link" key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={16}/></a>)}</div>;
      if (block.type === "list") return <ul className="story-list" key={i}>{block.items.map(text => <li key={text}>{text}</li>)}</ul>;
      if (block.type === "flow") return <ol className="story-flow" aria-label={block.label} key={i}>{block.items.map(text => <li key={text}>{text}</li>)}</ol>;
      if (block.type === "decisions") return <div className="story-decisions" role="region" aria-label="Design decisions, rationale, and screen evidence" key={i}><table><caption>Decisions grounded in the documented screens</caption><thead><tr><th scope="col">Decision</th><th scope="col">Intent</th><th scope="col">Design evidence</th></tr></thead><tbody>{block.rows.map(row => <tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td></tr>)}</tbody></table><dl className="story-decision-mobile">{block.rows.map(row => <div key={row[0]}><dt>{row[0]}</dt><dd><b>Intent</b>{row[1]}</dd><dd><b>Design evidence</b>{row[2]}</dd></div>)}</dl></div>;
      if (block.type === "source-gallery") return <SourceEvidenceGallery key={i} block={block}/>;
      if (block.type === "image-group") return <figure className="story-visual story-image-group" key={i}><div>{block.images.map(img => <a key={img.src} href={img.src} target="_blank" rel="noreferrer" aria-label={`Open ${img.caption || img.alt} full size`}><div className="screen-preview"><img src={img.src} alt={img.alt} width={caseScreenDimensions(img.src).width || img.width} height={caseScreenDimensions(img.src).height || img.height} loading="lazy"/></div><span>{img.caption}<ArrowUpRight size={16}/></span></a>)}</div>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
      if (block.type === "image") return <figure className="story-visual" key={block.src+i}><a className="evidence-image-frame" href={block.src} target="_blank" rel="noreferrer" aria-label={`Open ${block.alt || page.title} full size`}><img src={block.src} alt={block.alt || `${page.title} project visual`} width={caseScreenDimensions(block.src).width || block.width} height={caseScreenDimensions(block.src).height || block.height} loading="lazy"/></a>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
      if (block.type.startsWith("h")) {
        const level = Number(block.type.slice(1));
        if (level <= 4) {
          chapter += 1;
          return <h2 className={`source-heading level-${level}`} id={caseChapterId(page,block.text,chapter-1)} key={i}><span>{String(chapter).padStart(2,"0")}</span>{block.text}</h2>;
        }
        return <h3 className="source-subheading" key={i}>{block.text}</h3>;
      }
      return <p key={i}>{block.text}</p>;
    });
  }
  const paras = page.body.slice(1);
  const sourceHeadings = [...page.headings.h4, ...page.headings.h5, ...page.headings.h6].filter(Boolean);
  const headings = sourceHeadings.length ? sourceHeadings : ["Selected interface explorations"];
  const images = page.images.slice(1);
  const groups = Math.max(1, Math.ceil(paras.length / Math.max(headings.length, 1)));
  let pi=0, ii=0;
  return headings.map((heading, hi) => {
    const block = paras.slice(pi, pi + groups); pi += groups;
    const imageCount = Math.ceil(images.length / headings.length);
    const blockImages = images.slice(ii, ii + imageCount); ii += imageCount;
    return <section className="story-chapter" id={`chapter-${hi}`} key={heading+hi}><span className="chapter-number">{String(hi+1).padStart(2,"0")}</span><h2>{heading}</h2>{block.map((p,i) => <p key={i}>{p}</p>)}{blockImages.map((img,i) => <figure key={img.src}><img src={img.src} alt={`${heading} visual ${i+1}`} loading="lazy"/></figure>)}</section>;
  }).concat(paras.slice(pi).length ? [<section className="story-chapter" key="remaining">{paras.slice(pi).map((p,i)=><p key={i}>{p}</p>)}</section>] : []);
}

function NextProject({ current, data }) { const i=CURATED_CASE_PATHS.indexOf(current); const next=CURATED_CASE_PATHS[(i+1)%CURATED_CASE_PATHS.length]; return <Link className="next-project" to={next}><h2>{data.pages[next].title}</h2><span className="next-label">Next selected case study</span><ArrowUpRight/></Link>; }

function Articles({ data }) {
  const items=Object.values(data.pages).filter(p=>p.path.startsWith("/articles/")).sort((a,b)=>new Date(b.date)-new Date(a.date));
  return <main id="main-content" className="inner-page"><PageHero eyebrow="Journal / field notes" title="Thinking in public." copy="22 essays on product design, research, systems, collaboration, and growing through the work." stat="22 / ARTICLES"/><section className="articles-grid section-pad">{items.map((item,i)=><ArticleCard item={item} data={data} index={i} key={item.path}/>)}</section></main>;
}

function ArticleCard({ item, data, index }) { const cover=data.articleCovers[item.path] || item.images[0]?.src; return <Link className="article-card" to={item.path}><div className="article-cover">{cover && <img src={cover} alt="" loading="lazy"/>}<span>{String(index+1).padStart(2,"0")}</span></div><small>{item.date || "Field note"} · {Math.max(3,Math.round(item.body.join(" ").split(" ").length/220))} min</small><h3>{item.title}</h3><p>{item.body[0]}</p><span className="read-link">Read article <ArrowRight/></span></Link>; }

function ArticleDetail({ data }) { const path=useLocation().pathname; const page=data.pages[path]; if(!page)return <NotFound/>; const cover=data.articleCovers[path] || page.images[0]?.src; return <main id="main-content" className="article-page"><article><Link to="/articles" className="back-link"><ArrowLeft/> All articles</Link><span className="eyebrow">{page.date} · FIELD NOTE</span><h1>{page.title}</h1><p className="article-deck">{page.body[0]}</p>{cover&&<img className="article-hero-image" src={cover} alt=""/>}<div className="prose">{page.body.slice(1).map((p,i)=>{ const short=p.length<90; return short&&i>0?<h2 key={i}>{p}</h2>:<p key={i}>{p}</p>; })}</div></article></main>; }

function NotFound(){return <main id="main-content" className="not-found"><span>404</span><h1>A little off the page.</h1><p>This page isn’t here. There’s more to explore in the work.</p><Link className="pill-link" to="/work">Explore the work <ArrowRight size={18}/></Link></main>}

function PortfolioApp(){
  const { pathname, search } = useLocation();
  const workFirst = import.meta.env.DEV && pathname === "/" && new URLSearchParams(search).get("layout") === "work-first";
  useLayoutEffect(() => {
    if (!workFirst) return;
    document.documentElement.dataset.portfolioLayout = "work-first";
    return () => { delete document.documentElement.dataset.portfolioLayout; };
  }, [workFirst]);
  const {data,error,retry}=useContent();
  const [searchOpen,setSearchOpen]=useState(false);
  const returnFocus = useRef(null);
  const openSearch = useCallback(event => {
    returnFocus.current = event?.currentTarget || document.activeElement;
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useEffect(() => {
    const down = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (searchOpen) closeSearch();
        else openSearch();
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [searchOpen, closeSearch, openSearch]);
  useEffect(() => { closeSearch(); }, [pathname, closeSearch]);
  return <>
    <ScrollReset ready={!!data}/>
    {workFirst ? <EditorialHeader resume={data?.resume} onSearch={openSearch}/> : <PortfolioHeader/>}
    {data ? <>
      <SearchPalette data={data} open={searchOpen} onClose={closeSearch} returnFocus={returnFocus}/>
      <Routes>
        <Route path="/" element={workFirst ? <EditorialHome data={data}/> : <PortfolioHome data={data}/>}/>
        <Route path="/design-systems" element={<DesignSystemsPage/>}/>
        <Route path="/side-projects" element={<SideProjectsPage data={data}/>}/>
        <Route path="/ai-practice" element={<AiPracticePage/>}/>
        <Route path="/about" element={<AboutPage data={data}/>}/>
        <Route path="/uiqa" element={<UiqaPage/>}/>
        <Route path="/work" element={<WorkIndex data={data}/>}/>
        {WORK_COLLECTIONS.map(collection => <Route key={collection.id} path={collection.path} element={<WorkLandingPage collectionId={collection.id} data={data} CaseCard={CaseCard}/>}/>)}
        <Route path="/industries" element={<IndustriesIndex data={data}/>}/>
        <Route path="/articles" element={<Articles data={data}/>}/>
        <Route path="/articles/*" element={<ArticleDetail data={data}/>}/>
        <Route path="/pixel-round" element={<PluginPage data={data}/>}/>
        <Route path="/quick-agent-system-hutzper" element={<Navigate to="/work" replace/>}/>
        <Route path="/media/hutzper/*" element={<Navigate to="/work" replace/>}/>
        {CASE_PATHS.map(path=><Route key={path} path={path} element={<CaseStudy data={data}/>}/>) }
        <Route path="/*" element={<GalleryPage data={data}/>}/>
      </Routes>
      {workFirst ? <EditorialFooter resume={data.resume}/> : <PortfolioFooter resume={data.resume} linkedin={data.linkedin} onSearch={openSearch}/>}
      <PortfolioComments enabled={!searchOpen}/>
    </> : <main className="content-status" aria-busy={!error}>
      {error ? <><h1>The work couldn’t load.</h1><p>Please check your connection and try again.</p><button className="pill-link" onClick={retry}>Try again</button></> : <><h1>One moment.</h1><p role="status">Preparing the portfolio…</p><div className="content-skeleton" aria-hidden="true"/></>}
    </main>}
    <RouteMetadata pages={data?.pages}/>
  </>;
}
function App() {
  const { pathname } = useLocation();
  const page = pathname.startsWith("/design-systems/") ? <>
    <Routes><Route path="/design-systems/:system/*" element={<SystemDocumentation/>}/></Routes>
    <PortfolioComments/>
    <RouteMetadata/>
  </> : <PortfolioApp/>;
  return <>{page}<TextEntrance/></>;
}
export { App, CaseStudy, CaseCard, INDUSTRIES };
