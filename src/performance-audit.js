import { onCLS, onINP, onLCP } from "web-vitals";

// Local audit only. No network transmission or visitor identifier.
const output = document.createElement("output");
output.id = "performance-audit";
output.hidden = true;
output.dataset.cls = "0";
document.body.append(output);
const record = metric => { output.dataset[metric.name.toLowerCase()] = String(Math.round(metric.value * 1000) / 1000); };
onCLS(record, { reportAllChanges: true });
onLCP(record, { reportAllChanges: true });
onINP(record, { reportAllChanges: true });

const button = document.createElement("button");
button.type = "button";
button.textContent = "Run accessibility audit";
button.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:10000;padding:12px;background:#fbfaf6;color:#2b2b29;border:1px solid #315f59;min-height:44px";
button.addEventListener("click", async () => {
  button.disabled = true;
  button.textContent = "Auditing…";
  try {
    const { default: axe } = await import("axe-core");
    const result = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
    output.dataset.accessibility = JSON.stringify(result.violations.map(item => ({ id: item.id, impact: item.impact, description: item.description, nodes: item.nodes.slice(0, 5).map(node => ({ target: node.target, summary: node.failureSummary })) })));
    button.textContent = `${result.violations.length} accessibility violations · Run again`;
  } finally { button.disabled = false; }
});
document.body.append(button);
