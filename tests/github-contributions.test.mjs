import assert from "node:assert/strict";
import test from "node:test";
import { parseGitHubContributions } from "../scripts/read-github-contributions.mjs";

const start = Date.UTC(2025, 0, 1);
const cells = Array.from({ length: 366 }, (_, index) => {
  const date = new Date(start + index * 86_400_000).toISOString().slice(0, 10);
  const id = `day-${index}`;
  const level = index % 5;
  const label = ["No contributions", "1 contribution", "5 contributions", "10 contributions", "1,234 contributions"][level];
  return {
    cell: `<td data-level="${level}" id="${id}" data-date="${date}"></td>`,
    tooltip: `<tool-tip class="sr-only" for="${id}"> ${label} on January 1st.</tool-tip>`,
  };
});
const markup = (entries) => entries.map(entry => entry.cell).reverse().join("") + entries.map(entry => entry.tooltip).join("");

test("GitHub's public calendar gives the most recent 365 dates and their visible counts", () => {
  const days = parseGitHubContributions(markup(cells));
  assert.equal(days.length, 365);
  assert.deepEqual(days.slice(0, 5), [
    ["2025-01-02", 1, 1], ["2025-01-03", 5, 2], ["2025-01-04", 10, 3],
    ["2025-01-05", 1234, 4], ["2025-01-06", 0, 0],
  ]);
  assert.deepEqual(days.at(-1), ["2026-01-01", 0, 0]);
});

test("missing days fail rather than publishing a graph with misleading gaps", () => {
  const incomplete = [...cells];
  incomplete[170] = { cell: cells[170].cell, tooltip: "" };
  assert.throws(() => parseGitHubContributions(markup(incomplete)), /incomplete contribution calendar/);
  assert.throws(() => parseGitHubContributions("<html>Temporarily unavailable</html>"), /incomplete contribution calendar/);
});
