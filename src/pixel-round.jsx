import React from "react";
import { ArrowDownRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PixelRoundIcon } from "./pixel-round-icon";
import "./pixel-round.css";

export const PIXEL_ROUND_CHAPTERS = [
  ["problem", "The problem"], ["decisions", "Design decisions"],
  ["interface", "The interface"], ["iteration", "Testing & iteration"],
  ["outcomes", "Reported outcomes"], ["learnings", "What I learned"],
];

export function PluginPage({ data }) {
  const image = data.pages["/pixel-round"]?.images?.[0];
  return <main id="main-content" className="pixel-round-case">
    <header className="pr-intro">
      <div className="pr-intro-copy">
        <Link className="side-project-back" to="/side-projects"><ArrowLeft size={16}/> All tools</Link>
        <h1>Pixel Round</h1>
        <p className="pr-deck">Less cleanup. Cleaner handoff.</p>
        <p className="pr-summary">A Figma plugin I designed and built to clean up fractional values across layers, frames, text, and components, turning a repetitive file-cleanup task into one clear action.</p>
        <div className="pr-actions"><a className="pr-primary" href={data.plugin} target="_blank" rel="noopener noreferrer">Open in Figma Community <ArrowUpRight size={18}/></a><a className="pr-text-link" href="#pixel-round-problem">Read the case study <ArrowDownRight size={18}/></a></div>
      </div>
      <div className="pr-product-mark" aria-hidden="true"><div className="pr-icon"><PixelRoundIcon/></div><div className="pr-sample"><span>Fractional → whole pixels</span><p>24.6 <span>→</span> 25</p><small>Illustrative rounding example</small></div></div>
      <dl className="pr-project-meta"><div><dt>My role</dt><dd>Designer & builder</dd></div><div><dt>Deliverable</dt><dd>Figma plugin</dd></div><div><dt>Focus</dt><dd>File hygiene & developer handoff</dd></div></dl>
    </header>

    {image && <figure className="pr-project-image"><a href={image.src} target="_blank" rel="noopener noreferrer" aria-label="Open the original Pixel Round project visual full size"><img src={image.src} width="4281" height="2554" alt="Original Pixel Round project visual showing the Figma plugin design"/></a><figcaption>Original Pixel Round project visual. <a href={image.src} target="_blank" rel="noopener noreferrer">Inspect full size <ArrowUpRight size={15}/></a></figcaption></figure>}

    <div className="pr-story-layout">
      <aside className="pr-contents"><nav aria-label="Pixel Round case study chapters"><p>In this case study</p>{PIXEL_ROUND_CHAPTERS.map(([id,title]) => <a key={id} href={`#pixel-round-${id}`}>{title}</a>)}</nav></aside>
      <details className="pr-mobile-contents"><summary>In this case study</summary><nav aria-label="Pixel Round case study chapters">{PIXEL_ROUND_CHAPTERS.map(([id,title]) => <a key={id} href={`#pixel-round-${id}`}>{title}</a>)}</nav></details>
      <article className="pr-story">
        <section id="pixel-round-problem"><h2>A small task that kept interrupting the work.</h2><p>When preparing Figma files for engineering handoff, I repeatedly found fractional values in layers, frames, and text. Checking and correcting them by hand took attention away from the design itself.</p><p>The goal was not another complex workflow. It was a focused utility that could find decimal inconsistencies, fix them across node types, and make the result understandable.</p><h3>What informed the direction</h3><p>My original project notes describe survey and interview feedback from other designers. The recurring concerns were manual cleanup, inconsistent files, and friction when collaborating with engineers.</p><p className="pr-evidence-note">Research is summarized from the original write-up. Its interview totals differ between sections, so no single interview count is presented as verified here.</p></section>

        <section id="pixel-round-decisions"><h2>Three decisions that kept the tool focused.</h2><ol className="pr-decisions" role="list"><li><h3>Put the core action first.</h3><p>I prioritized an auto-fix action so the most common task did not require a sequence of manual edits. The original interface used a single pane and a “Fix Now” call to action.</p></li><li><h3>Make the result visible.</h3><p>Node-level previews and clear status messages were part of the feature priorities. Feedback such as a count of fixed layers helped explain what the action had changed.</p></li><li><h3>Leave room for control.</h3><p>Manual tweaks were considered alongside automation. The documented interface also included an option to auto-run on document open, added in response to a user request.</p></li></ol></section>

        <section id="pixel-round-interface"><h2>One pane. One clear next step.</h2><p>I designed the UX and UI, defined the plugin architecture, and worked with developer friends on QA and feedback. The interface stayed minimal: the correction action, the result, and the options needed to support the workflow.</p><ul><li>A single-pane interface with the primary action easy to find.</li><li>Status messages that explain the result of a correction.</li><li>Support for text, shapes, frames, and components in the documented solution.</li></ul><p>The project visual above preserves the original design evidence. The live Community listing is the place to inspect the currently available plugin.</p><a className="pr-text-link" href={data.plugin} target="_blank" rel="noopener noreferrer">View the plugin on Figma <ArrowUpRight size={18}/></a></section>

        <section id="pixel-round-iteration"><h2>Use feedback to refine the edges.</h2><p>The original write-up records a v1 beta with five designers. I collected feedback on usability friction, then improved the error state, added support for hidden layers, and redesigned the status messages.</p><p>That iteration kept the same core task while making the less straightforward parts of the workflow easier to understand.</p></section>

        <section id="pixel-round-outcomes"><h2>Reported results, with their context.</h2><p>The original project write-up reports the following launch and beta-feedback results:</p><ul className="pr-outcomes"><li><strong>200+ installs</strong> in the first month.</li><li><strong>4.9 average rating</strong> as reported in the original write-up.</li><li><strong>About 20 minutes saved per file</strong>, based on beta-tester interviews.</li><li>Developer feedback describing cleaner exports from Figma.</li></ul><p className="pr-evidence-note">These are historical, self-reported project results, not current store statistics or independently verified measurements. Time savings are an interview estimate, not a benchmark.</p></section>

        <section id="pixel-round-learnings"><h2>Precision is also about making things understandable.</h2><p>Building Pixel Round gave me a closer view of both the designer’s workflow and the implementation work behind a small tool. A focused action still needs clear feedback and thoughtful error handling.</p><p>The lesson I carried forward: a useful product does not have to be broad. Solving one recurring problem well can be a meaningful contribution to someone’s daily practice.</p><div className="pr-closing-actions"><a className="pr-primary" href={data.plugin} target="_blank" rel="noopener noreferrer">Try Pixel Round <ArrowUpRight size={18}/></a></div></section>
      </article>
    </div>
  </main>;
}
