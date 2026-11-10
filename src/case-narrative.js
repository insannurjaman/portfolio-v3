const h = text => ({ type: "h2", text });
const p = text => ({ type: "p", text });

// Summaries interpret the existing source screens. They are not new research,
// launch claims, performance measurements, or declarations of sole authorship.
export const CASE_NARRATIVES = {
  "/halodish-apps": {
    problem: "Finding a place, inspecting a product, and checking an ingredient photo are different tasks. The challenge is connecting them without making dietary information look more certain than its evidence.",
    audience: "People living in or visiting Japan who are exploring halal, vegan, or vegetarian options, nearby prayer spaces, and stores.",
    contribution: "Product Designer. The documented work covers mobile discovery, filters and details, photo-check guidance, result states, points and purchase flows, and account destinations.",
    outcome: "Published on iOS and Android by eftax Co., Ltd. I also report a 1,296% increase in user-acquisition conversion from HaloDish landing-page design and implementation.",
    limits: "Publication is verified; archived screens may differ from the current app. The landing-page outcome is reported by Insan without baseline rates, measurement periods, or underlying analytics included here. Example classifications, balances, prices, and ratings are design content, not accuracy tests or impact metrics. No app-usability-study results are claimed.",
    decisions: [
      { title: "Let the task choose the discovery mode", rationale: "Lists help compare options; maps support geographic exploration. A shared search and category structure connects the two without changing the user's task.", chapter: "Discovery through lists, maps, and filters", link: "View the list, map, and filter designs" },
      { title: "Explain the input before asking for a photo", rationale: "Ingredient-versus-barcode examples, visible points costs, and a retake/confirm step make the required input and commitment inspectable before analysis.", chapter: "Guide the ingredient-photo task", link: "View the photo-input and confirmation screens" },
      { title: "Show uncertainty instead of a forced verdict", rationale: "A distinct Doubtful result and ingredient-level annotations give ambiguous evidence its own state. This documents the interface response, not classification accuracy.", chapter: "Treat uncertainty as a real result", link: "View the result and uncertainty states" },
    ],
    closing: "Delivery, reflection, and ongoing validation",
    reflection: "The confirmed outcome is a publicly available iOS and Android app. The design record shows connected discovery and checking journeys, while the store history documents continued product iteration. Publication does not establish that every archived screen is in the current release or attribute every update to this work.",
    takeaways: [
      "Discovery and inspection need different information depths: a useful shortlist still needs a route to detailed notes and provenance.",
      "Uncertainty belongs in the product model, not just in a disclaimer after a confident-looking result.",
      "Input guidance, visible cost, and confirmation are part of the task itself, not finishing touches around it.",
    ],
  },
  "/divermenu": {
    problem: "A vague food request needs to become a shortlist someone can inspect. The interface must support preferences without making chat the only way to discover or revisit a dish.",
    audience: "People exploring dishes through a stated request or visual browsing. This is the scenario shown by the concept, not a research-validated persona.",
    contribution: "Product Designer. The Figma work covers conversation states, Explore, dish details, saved collections, preference editing, account settings, and desktop/mobile adaptations.",
    outcome: "A documented desktop and mobile design concept. The screens establish connected flows; they do not establish a launched service or a working recommendation engine.",
    limits: "Design evidence only. Restaurant information, ratings, prices, and dietary labels in the screens are illustrative. No interviews, usability results, recommendation accuracy, or business impact are claimed.",
    decisions: [
      { title: "Offer a browsing route alongside conversation", rationale: "Cuisine categories and quick filters give people a starting point without requiring a perfect prompt. Both discovery modes converge on comparable dish information.", chapter: "Browsing when the user wants to explore", link: "View the Explore and save-feedback design" },
      { title: "Make personalization inspectable", rationale: "A food profile separates preference groups and provides editing routes, suggested values, custom entry, and an explicit save action instead of hiding all context in the conversation.", chapter: "Preferences the user can inspect and change", link: "View the food-profile and preference editors" },
      { title: "Turn a recommendation into a reusable shortlist", rationale: "A dedicated Saved destination retains the dish information needed to revisit a choice. Detailed pages provide a separate place to inspect ingredients and source information.", chapter: "A saved collection closes the loop", link: "View the saved-dishes collection" },
    ],
    closing: "What the design establishes and what comes next",
    reflection: "The deliverable is a connected interface direction across desktop and mobile: conversation, browsing, preferences, detailed information, and saved dishes. It is a design concept, not evidence of launch, recommendation accuracy, dietary suitability, or measured usability improvement.",
    takeaways: [
      "Conversation is more useful when it connects to structured comparison and inspectable detail rather than becoming the whole product.",
      "Personal taste and safety constraints need different evidence and language; preference matching cannot establish dietary suitability.",
      "Visible preference editing and a saved collection make personalization and return visits user-controlled parts of the journey.",
    ],
  },
  "/e-afghan-landing-page": {
    problem: "Visitors need to identify a consular service, understand the next step, and know when to move into an account-based portal. The public website and portal need distinct jobs.",
    audience: "People exploring Afghan consular services, service requirements, and visit preparation before beginning an application.",
    contribution: "Product Designer. The documented scope covers service-first information architecture, portal handoff, shared information patterns, and responsive desktop, tablet, and mobile layouts.",
    outcome: "Responsive Figma designs for the public website and related service information. A production release and changes in service completion or satisfaction are not established.",
    limits: "The source file and exported screens are the evidence. No project dates, research methods, tested outcomes, or performance metrics were supplied.",
    decisions: [
      { title: "Start with the service, not the organization", rationale: "Explore services and Plan a visit lead the entry experience. A service index then groups categories and gives passport services a focused information panel.", chapter: "Service discovery before account creation", link: "View the service-discovery design" },
      { title: "Make the website-to-portal handoff explicit", rationale: "Create an account, access services, and track updates explain the account journey before the visitor enters it. Public guidance and the working portal stay distinct.", chapter: "Explain the relationship between website and portal", link: "View the account-journey explanation" },
      { title: "Preserve the service-first story on mobile", rationale: "Responsive layouts stack service information and portal guidance in reading order while retaining the primary service and visit routes.", chapter: "One hierarchy, across screen sizes", link: "Compare the desktop and mobile designs" },
    ],
    reflection: "The deliverable is a responsive public-facing design with a service index, account-journey guidance, and a consistent foundation for service and support pages. The companion Citizen Portal documents the next stage of the journey; neither case study claims a verified production release.",
    takeaways: [
      "A public service website earns its place by helping someone identify the next step, not by duplicating the account workspace.",
      "A portal handoff is clearer when its stages and purpose are explained before account creation.",
      "Responsive design needs to preserve the order of decisions, not simply shrink the desktop composition.",
    ],
    validation: [
      "Test whether visitors can find the relevant service and understand its requirements without prior knowledge of the organization.",
      "Check whether people distinguish service information, visit planning, and the account-based application route.",
      "Evaluate comprehension, keyboard access, and primary-route discoverability across screen sizes and supported languages.",
    ],
  },
  "/e-afghan-citizen-portal": {
    problem: "An application involves preparation, multiple form stages, corrections, and a final commitment. People need to know where they are, what is required, and how to review before submission.",
    audience: "People managing consular requests, identity information, documents, and application progress in an account-based workspace.",
    contribution: "Product Designer. The Figma work covers the account overview, profile and photo preparation, staged passport application, review and declaration, and mobile adaptations.",
    outcome: "Documented responsive portal and application-flow designs. Example applications, people, progress, and statuses are interface content, not real service records or measured outcomes.",
    limits: "Design evidence only. No production release, application-success improvement, security validation, or usability-study results are asserted.",
    decisions: [
      { title: "Separate starting work from tracking work", rationale: "Quick actions offer visible entry points, while existing applications and profile readiness remain separately scannable on the overview.", chapter: "An overview that surfaces useful actions", link: "View the portal overview" },
      { title: "Make a long application navigable and pausable", rationale: "A visible stage list distinguishes completed, current, and not-started sections. Save and Exit supplies a designed pause point instead of treating the form as one uninterrupted task.", chapter: "Break the passport application into stages", link: "View the application stages and document step" },
      { title: "Give review and declaration a deliberate boundary", rationale: "Grouped summaries expose section-level edits before submission. Declaration and signature are separated from ordinary form entry to make the final confirmation distinct.", chapter: "Make review a deliberate step", link: "View the review and declaration design" },
    ],
    reflection: "The design record connects overview, preparation, staged input, and final review in a responsive workspace. It demonstrates intended progress, correction, and pause affordances; it does not establish working persistence, document processing, payment, or application submission.",
    takeaways: [
      "A useful overview distinguishes the next action from the status of work already in progress.",
      "Visible stages and a pause route make a complex application legible, but saved-state behavior still needs implementation and testing.",
      "Review is a correction task before it is a confirmation task; section-level edit routes should remain close to the supplied information.",
    ],
    validation: [
      "Test whether people understand the current stage, required documents, photo guidance, and route back after saving.",
      "Evaluate correction from review and comprehension of declaration/signature before submission.",
      "Validate persistence, upload failure, session expiry, permissions, and recovery with the implementation team, then test mobile and assistive-technology workflows.",
    ],
  },
};

export function caseChapterTitles(story) {
  return story.filter(block => ["h2", "h3", "h4"].includes(block.type)).map(block => block.text);
}

export function caseChapterId(page, title, index) {
  return page.chapterIds?.[title] || `chapter-${index}`;
}

export function withCaseNarrative(page) {
  const narrative = CASE_NARRATIVES[page?.path];
  if (!narrative) return page;
  const original = page.story || [];
  const secondChapter = original.findIndex((block, index) => index > 0 && block.type === "h2");
  let remaining = original.slice(secondChapter < 0 ? original.length : secondChapter);
  const closingIndex = narrative.closing ? remaining.findIndex(block => block.type === "h2" && block.text === narrative.closing) : -1;
  const originalClosing = closingIndex < 0 ? [] : remaining.slice(closingIndex + 1);
  if (closingIndex >= 0) remaining = remaining.slice(0, closingIndex);
  remaining = remaining.filter(block => block.type !== "decisions").map(block => block.type === "h2" && block.text === "Design decisions and trade-offs" ? h("Trade-offs") : block);
  const validation = narrative.validation || originalClosing.find(block => block.type === "list")?.items || [];
  const originalTitles = caseChapterTitles(original);
  const chapterIds = Object.fromEntries(originalTitles.map((title, index) => [title, `chapter-${index}`]));
  chapterIds["Project in brief"] = "chapter-0";
  chapterIds["Key design decisions"] = "key-design-decisions";
  chapterIds["Trade-offs"] = chapterIds["Design decisions and trade-offs"];
  chapterIds["Delivery and design takeaways"] = chapterIds[narrative.closing] || "delivery-and-takeaways";
  return {
    ...page,
    narrative: true,
    chapterIds,
    story: [
      h("Project in brief"), { type: "brief", ...narrative },
      h("Key design decisions"), { type: "decision-highlights", items: narrative.decisions },
      ...remaining,
      h("Delivery and design takeaways"), p(narrative.reflection),
      { type: "list", items: narrative.takeaways },
      { type: "h5", text: "What needs validation" },
      p("The following is a proposed validation plan, not research already conducted:"),
      { type: "list", items: validation },
    ],
  };
}
