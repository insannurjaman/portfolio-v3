// Fixed event schema: no email address, query string, form value, or visitor ID.
const stages = new Set(["selected_work_view", "selected_case", "case_view", "resume_click", "contact_click"]);
const paths = new Set(["/", "/work", "/about", "/ags-pricing-calculator", "/loyica-client-portal", "/accelbyte-design-system", "/halodish-apps"]);
export function funnelEvent(stage, source, destination = "") {
  if (!stages.has(stage) || typeof source !== "string" || typeof destination !== "string") return null;
  const cleanSource = paths.has(source) ? source : source.startsWith("/work/") ? "/work" : "other";
  const cleanDestination = paths.has(destination) ? destination : ["resume", "email", "linkedin"].includes(destination) ? destination : "other";
  return { name: "portfolio_funnel", properties: { stage, source: cleanSource, destination: cleanDestination } };
}
// The SDK beforeSend contract exposes only event type and URL, not its payload.
// Payload safety is enforced before track() through funnelEvent above.
export function sanitizeFunnelEvent(event) {
  if (event.type !== "event") return null;
  try {
    const url = new URL(event.url);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    url.username = ""; url.password = ""; url.search = ""; url.hash = "";
    return { ...event, url: url.href };
  } catch { return null; }
}
