import React, { useEffect } from "react";
import { track } from "@vercel/analytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useLocation } from "react-router-dom";
import { sanitizePageView, sanitizePerformanceMetric } from "./analytics-privacy.js";
import { funnelEvent, sanitizeFunnelEvent } from "./funnel-events.js";
import { CASE_PREVIEWS } from "./case-illustrations.js";

// Custom events require Vercel Pro/Enterprise; keep off on the current Hobby plan.
const funnelEnabled = import.meta.env.VITE_FUNNEL_ANALYTICS === "enabled";
function FunnelEvents() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!import.meta.env.PROD || !funnelEnabled) return;
    const send = (stage, destination) => { const event = funnelEvent(stage, pathname, destination); if (event) track(event.name, event.properties); };
    const clicked = event => {
      const link = event.target.closest?.("a[href]");
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (link.dataset.funnel === "selected_case") send("selected_case", url.pathname);
      else if (url.hostname === "drive.google.com") send("resume_click", "resume");
      else if (url.protocol === "mailto:") send("contact_click", "email");
      else if (url.hostname.endsWith("linkedin.com")) send("contact_click", "linkedin");
    };
    document.addEventListener("click", clicked);
    let observer, caseSent = false;
    const bindContent = () => {
      if (CASE_PREVIEWS[pathname] && document.querySelector(".case-page") && !caseSent) { send("case_view", pathname); caseSent = true; }
      const selected = document.querySelector("#selected-work");
      if (selected && !observer) {
        observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { send("selected_work_view", "/"); observer.disconnect(); } }, { threshold: .15 });
        observer.observe(selected);
      }
      if (caseSent || selected) pending.disconnect();
    };
    const pending = new MutationObserver(bindContent);
    if (pathname === "/" || CASE_PREVIEWS[pathname]) {
      pending.observe(document.getElementById("root"), { childList: true, subtree: true });
      bindContent();
    }
    return () => { document.removeEventListener("click", clicked); observer?.disconnect(); pending.disconnect(); };
  }, [pathname]);
  return null;
}

function beforeAnalytics(event) {
  if (event.type === "pageview") return sanitizePageView(event);
  return funnelEnabled ? sanitizeFunnelEvent(event) : null;
}

export function PortfolioAnalytics() {
  const { pathname } = useLocation();
  // Keep local development/test visits out of visitor and performance reports.
  if (!import.meta.env.PROD) return null;
  return <>
    <Analytics mode="production" route={pathname} path={pathname} beforeSend={beforeAnalytics}/>
    <FunnelEvents/>
    <SpeedInsights route={pathname} beforeSend={sanitizePerformanceMetric} debug={false}/>
  </>;
}
