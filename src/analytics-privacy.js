// Keep URLs free of query values, fragments and credentials in both reporting SDKs.
function sanitizeReportUrl(event) {
  try {
    const url = new URL(event.url);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    url.search = "";
    url.hash = "";
    url.username = "";
    url.password = "";
    return { ...event, url: url.href };
  } catch {
    return null;
  }
}

// Never send form values, game identities or custom analytics events.
export function sanitizePageView(event) {
  return event.type === "pageview" ? sanitizeReportUrl(event) : null;
}

export function sanitizePerformanceMetric(event) {
  return event.type === "vital" ? sanitizeReportUrl(event) : null;
}
