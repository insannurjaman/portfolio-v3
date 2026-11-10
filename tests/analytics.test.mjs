import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sanitizePageView, sanitizePerformanceMetric } from "../src/analytics-privacy.js";

test("analytics strips query, hash and credentials without changing page path", () => {
  const event = { type: "pageview", url: "https://user:secret@insandesign.vercel.app/about?username=visitor#experience" };
  assert.deepEqual(sanitizePageView(event), { type: "pageview", url: "https://insandesign.vercel.app/about" });
  assert.equal(event.url.includes("secret"), true, "does not mutate the source event");
});

test("analytics rejects custom events and malformed or non-web URLs", () => {
  assert.equal(sanitizePageView({ type: "event", url: "https://insandesign.vercel.app/" }), null);
  for (const url of ["not-a-url", "javascript:alert(1)", "file:///private/example"]) {
    assert.equal(sanitizePageView({ type: "pageview", url }), null);
  }
});

test("performance metrics retain route attribution while redacting URL values", () => {
  const event = { type: "vital", url: "https://user:secret@insanlab.vercel.app/work?email=private#note", route: "/work" };
  assert.deepEqual(sanitizePerformanceMetric(event), { type: "vital", url: "https://insanlab.vercel.app/work", route: "/work" });
  assert.equal(event.url.includes("secret"), true);
  assert.equal(sanitizePerformanceMetric({ type: "event", url: "https://insanlab.vercel.app/" }), null);
  for (const url of ["not-a-url", "javascript:alert(1)", "file:///private/example"]) {
    assert.equal(sanitizePerformanceMetric({ type: "vital", url }), null);
  }
});

test("one production-only analytics root tracks React Router pathname changes", () => {
  const main = readFileSync(new URL("../src/entry.jsx", import.meta.url), "utf8");
  const component = readFileSync(new URL("../src/portfolio-analytics.jsx", import.meta.url), "utf8");
  assert.equal((main.match(/<PortfolioAnalytics\/>/g) || []).length, 1);
  assert.ok(main.includes("<BrowserRouter><App/><PortfolioAnalytics/></BrowserRouter>"));
  assert.ok(component.includes("if (!import.meta.env.PROD) return null"));
  assert.ok(component.includes("route={pathname} path={pathname}"));
  assert.ok(component.includes("beforeSend={beforeAnalytics}"));
  assert.ok(component.includes('import.meta.env.VITE_FUNNEL_ANALYTICS === "enabled"'));
});
