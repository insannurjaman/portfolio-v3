import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import snapshot from "./github-contributions.snapshot.json";
import "./github-contributions.css";

const profile = "https://github.com/insannurjaman";
const formatCount = new Intl.NumberFormat("en-US");
const formatMonth = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const formatDate = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
const cellSize = 10;
const chartLeft = 25;
const chartTop = 18;

function ContributionCalendar({ days }) {
  const firstWeekday = new Date(days[0][0]).getUTCDay();
  const width = chartLeft + Math.ceil((days.length + firstWeekday) / 7) * cellSize;
  return <div className="github-calendar-scroll" tabIndex={0} role="region" aria-label="GitHub contribution calendar">
    <svg viewBox={`0 0 ${width} 88`} role="img" aria-label="Daily contribution activity, from oldest on the left to most recent on the right">
      {[[1, "Mon"], [3, "Wed"], [5, "Fri"]].map(([weekday, label]) =>
        <text key={label} x="0" y={chartTop + weekday * cellSize + 7}>{label}</text>,
      )}
      {days.map(([date, count, level], index) => {
        const position = index + firstWeekday;
        const x = chartLeft + Math.floor(position / 7) * cellSize;
        const y = chartTop + position % 7 * cellSize;
        return <g key={date}>
          {date.endsWith("-01") && x < width - 19 && <text x={x} y="11">{formatMonth.format(new Date(date))}</text>}
          <rect className={`github-level-${level}`} x={x} y={y} width="8" height="8" rx="1.75">
            <title>{`${formatDate.format(new Date(date))}: ${formatCount.format(count)} ${count === 1 ? "contribution" : "contributions"}`}</title>
          </rect>
        </g>;
      })}
    </svg>
  </div>;
}

export function GitHubContributions({ interactive = true }) {
  const [days, setDays] = useState(snapshot.days);
  useEffect(() => {
    if (!interactive) return;
    const controller = new AbortController();
    fetch("/api/github-contributions", { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (Array.isArray(data?.days) && data.days.length === snapshot.days.length &&
            data.days.at(-1)?.[0] >= snapshot.days.at(-1)[0]) setDays(data.days);
      })
      .catch(() => { /* Keep the embedded public calendar. */ });
    return () => controller.abort();
  }, [interactive]);

  const total = days.reduce((sum, [, count]) => sum + count, 0);
  const first = days[0][0];
  const last = days.at(-1)[0];
  return <section className="home-github" id="github-contributions" aria-labelledby="home-github-title">
    <header>
      <div>
        <h2 id="home-github-title">GitHub Contributions</h2>
        <p><strong>{formatCount.format(total)}</strong> contributions in 365 days</p>
      </div>
      <a href={profile} target="_blank" rel="noopener noreferrer">@insannurjaman <ArrowUpRight size={14} aria-hidden="true"/></a>
    </header>
    <figure className="github-calendar">
      <ContributionCalendar days={days}/>
      <p className="github-calendar-hint">Scroll for earlier months.</p>
      <figcaption>
        <span><time dateTime={first}>{formatDate.format(new Date(first))}</time> – <time dateTime={last}>{formatDate.format(new Date(last))}</time></span>
        <span className="github-legend">
          <span>Less</span>
          <span className="github-legend-swatches" aria-hidden="true">{[0, 1, 2, 3, 4].map(level => <i key={level} className={`github-level-${level}`}/>)}</span>
          <span>More</span>
        </span>
      </figcaption>
    </figure>
    <a className="github-portfolio-source" href={`${profile}/portfolio-v3`} target="_blank" rel="noopener noreferrer">View portfolio source <ArrowUpRight size={14} aria-hidden="true"/></a>
  </section>;
}
