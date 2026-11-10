import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { createServer } from "vite";

// Route-specific heads for link unfurlers plus readable, real no-JS content.
// Interactive React routes still use the existing client root.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
const el = React.createElement;
const escape = text => String(text).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
try {
  const { CaseStudy, CaseCard, CASE_PATHS, INDUSTRIES, enrichPortfolioContent } = await server.ssrLoadModule("/src/main.jsx");
  const { pageMetadata, SITE_ORIGIN } = await server.ssrLoadModule("/src/seo.js");
  const { WORK_COLLECTIONS } = await server.ssrLoadModule("/src/work-catalog.js");
  const { SYSTEM_DOCS, docsTopics, docsPath } = await server.ssrLoadModule("/src/system-docs-data.js");
  const data = enrichPortfolioContent(JSON.parse(await fs.readFile("public/data/content.json", "utf8")));
  const { PortfolioHome } = await server.ssrLoadModule("/src/portfolio-home.jsx");
  const { PortfolioHeader, PortfolioFooter } = await server.ssrLoadModule("/src/portfolio-shell.jsx");
  const { AboutPage } = await server.ssrLoadModule("/src/about.jsx");
  const { UiqaPage } = await server.ssrLoadModule("/src/uiqa.jsx");
  const { SystemDocumentation } = await server.ssrLoadModule("/src/system-docs.jsx");
  const { WorkHub, WorkLandingPage } = await server.ssrLoadModule("/src/work-collections.jsx");
  const { DesignSystemsPage } = await server.ssrLoadModule("/src/design-systems.jsx");
  const { SideProjectsPage } = await server.ssrLoadModule("/src/side-projects.jsx");
  const { AiPracticePage } = await server.ssrLoadModule("/src/ai-practice.jsx");
  const routes = new Set(["/", "/work", "/about", "/articles", "/industries", "/design-systems", "/side-projects", "/ai-practice", "/uiqa", "/pixel-round", ...CASE_PATHS, ...WORK_COLLECTIONS.map(item => item.path), ...INDUSTRIES.map(([, route]) => route), ...Object.keys(data.pages).filter(route => route.startsWith("/articles/"))]);
  for (const system of Object.keys(SYSTEM_DOCS)) {
    routes.add(`/design-systems/${system}`);
    for (const topic of docsTopics(system)) routes.add(docsPath(system, topic.id));
  }
  const template = await fs.readFile("dist/index.html", "utf8");
  const knownCases = new Set(CASE_PATHS);
  function fallback(route) {
    let element;
    if (route === "/") element = el(PortfolioHome, { data, interactive: false });
    else if (route === "/about") element = el(AboutPage, { data });
    else if (route === "/uiqa") element = el(UiqaPage);
    else if (route === "/work") element = el(WorkHub, { data, CaseCard });
    else if (route === "/design-systems") element = el(DesignSystemsPage);
    else if (route === "/side-projects") element = el(SideProjectsPage, { data });
    else if (route === "/ai-practice") element = el(AiPracticePage);
    else if (WORK_COLLECTIONS.some(item => item.path === route)) element = el(WorkLandingPage, { collectionId: WORK_COLLECTIONS.find(item => item.path === route).id, data, CaseCard });
    else if (knownCases.has(route)) element = el(CaseStudy, { data });
    else if (route.startsWith("/design-systems/")) {
      const docsRoute = route.split("/").length === 3 ? `${route}/foundations` : route;
      const docs = el(Routes, null, el(Route, { path: "/design-systems/:system/*", element: el(SystemDocumentation, { interactive: false }) }));
      return renderToStaticMarkup(el(MemoryRouter, { initialEntries: [docsRoute] }, docs));
    }
    else {
      const page = data.pages[route];
      const collection = WORK_COLLECTIONS.find(item => item.path === route);
      const title = page?.title || collection?.title || pageMetadata(route, data.pages).title;
      element = el("main", { id: "main-content" }, el("h1", null, title), ...(page?.body || [collection?.description || "Explore original product design work and public documentation."]).map((text, i) => el("p", { key: i }, text)), el("nav", { "aria-label": "Portfolio links" }, el("a", { href: "/work" }, "All work"), " · ", el("a", { href: "/about" }, "About Insan"), " · ", el("a", { href: "/uiqa" }, "UIQA")));
    }
    return renderToStaticMarkup(el(MemoryRouter, { initialEntries: [route] },
      el(PortfolioHeader, { interactive: false }), element, el(PortfolioFooter, { resume: data.resume, linkedin: data.linkedin })));
  }
  for (const route of [...routes].sort()) {
    const meta = pageMetadata(route, data.pages);
    const tags = `<meta name="description" content="${escape(meta.description)}" />\n<link rel="canonical" href="${meta.canonical}" />\n` +
      Object.entries({ title: meta.title, description: meta.description, url: meta.canonical, image: meta.image, "image:width": meta.imageWidth, "image:height": meta.imageHeight, "image:type": meta.imageType, "image:alt": meta.imageAlt, type: meta.type, site_name: "Insan Nurjaman" }).map(([key, value]) => `<meta property="og:${key}" content="${escape(value)}" />`).join("\n") +
      `\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${escape(meta.title)}" />\n<meta name="twitter:description" content="${escape(meta.description)}" />\n<meta name="twitter:image" content="${meta.image}" />\n<meta name="twitter:image:alt" content="${escape(meta.imageAlt)}" />`;
    const html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(/\s*<meta\s+(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, "")
      .replace("</head>", `${tags}\n${route.startsWith("/design-systems/") ? "" : '<link rel="preload" href="/data/content.json" as="fetch" crossorigin="anonymous" />'}\n</head>`)
      .replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript><div class="static-portfolio">${fallback(route)}</div></noscript>`);
    const file = route === "/" ? "dist/index.html" : path.join("dist", route.slice(1), "index.html");
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, html);
  }
  const urls = [...routes].filter(route => !/^\/design-systems\/[^/]+$/.test(route)).sort();
  await fs.writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(route => `<url><loc>${SITE_ORIGIN}${escape(route)}</loc></url>`).join("")}</urlset>\n`);
  await fs.writeFile("dist/robots.txt", `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`);
  await fs.writeFile("dist/route-manifest.json", JSON.stringify([...routes].sort()));
  const errorStyles = [...template.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)].map(match => match[0]).join("");
  const themeBootstrap = template.match(/<script id="portfolio-theme">[\s\S]*?<\/script>/)?.[0] || "";
  await fs.writeFile("dist/404.html", `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#171717">${themeBootstrap}<meta name="robots" content="noindex"><title>Page not found | Insan Nurjaman</title><link rel="icon" href="/brand/insan-editorial.svg">${errorStyles}</head><body><main id="main-content" class="content-status"><h1>That page isn’t available.</h1><p>Explore the current portfolio or return to the selected work.</p><nav class="hero-actions" aria-label="Page recovery"><a class="pill-link" href="/#selected-work">Selected work</a><a class="pill-link" href="/work">All work</a><a class="pill-link" href="/about">About Insan</a></nav></main></body></html>`);
  console.log(`Generated ${routes.size} public route documents, canonical metadata, no-JS content, sitemap, and robots.txt.`);
} finally { await server.close(); }
