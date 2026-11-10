const calendarUrl = "https://github.com/users/insannurjaman/contributions";
const dayMs = 86_400_000;
const daysInCalendar = 365;

function attribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

export function parseGitHubContributions(html) {
  // GitHub puts counts in tooltips and date/intensity on the associated cells.
  const counts = new Map();
  for (const [, tag, label] of html.matchAll(/(<tool-tip\b[^>]*>)\s*([\d,]+|No) contributions?\s+on\b/gi)) {
    const id = attribute(tag, "for");
    if (id) counts.set(id, /^no$/i.test(label) ? 0 : Number(label.replaceAll(",", "")));
  }

  const days = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*\sdata-date="[^"]*"[^>]*>/gi)) {
    const date = attribute(tag, "data-date");
    const level = attribute(tag, "data-level");
    const count = counts.get(attribute(tag, "id"));
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && /^[0-4]$/.test(level) && Number.isSafeInteger(count)) {
      days.push([date, count, Number(level)]);
    }
  }

  days.sort(([first], [second]) => first.localeCompare(second));
  const year = days.slice(-daysInCalendar);
  const start = Date.parse(year[0]?.[0]);
  if (year.length !== daysInCalendar || !year.every(([date], index) => Date.parse(date) === start + index * dayMs)) {
    throw new Error("GitHub returned an incomplete contribution calendar.");
  }
  return year;
}

export async function readGitHubContributions() {
  const response = await fetch(calendarUrl, {
    headers: { Accept: "text/html", "Accept-Language": "en-US", "User-Agent": "insan-portfolio-contributions" },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);
  return { days: parseGitHubContributions(await response.text()) };
}
