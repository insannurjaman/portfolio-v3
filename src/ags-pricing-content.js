// Approved content extension: original pricing-file designs only.
// Explicitly attributed collaborator pages are excluded from every export.
// Preserve the incumbent screen-led reader; no new commercial/research claims.
import { AGS_CASES } from "./ags-projects.js";
export const AGS_PRICING_FILE = "https://www.figma.com/design/cpSGHTJaslysQufnXSS4dG/AGS-Web_-AGS-Pricing-Page";
const source = node => `${AGS_PRICING_FILE}?node-id=${node.replace(":", "-")}`;
const h = text => ({ type: "h2", text });
const p = text => ({ type: "p", text });
const list = items => ({ type: "list", items });
const flow = (label, items) => ({ type: "flow", label, items });
const screenSources = {
  calculator: ["3029:25281", "3410:60399", 1440, 3282],
  "ams-workload": ["2677:45059", "2677:51361", 754, 2162],
  infrastructure: ["2677:45059", "2677:55715", 754, 2482],
  "extend-workload": ["2677:45059", "2678:76263", 754, 1796],
  "mobile-estimate": ["2553:24899", "2569:34835", 375, 812],
  "mobile-sheet": ["2553:24899", "2657:35949", 435, 838],
  summary: ["1:4", "2251:87910", 1440, 1580],
  "estimate-document": ["1778:38407", "1920:31090", 612, 2257],
  "pricing-page": ["1:4", "2334:20174", 1440, 4805],
  "environment-selection": ["1:4", "2334:21766", 1440, 687],
  "scale-pricing": ["1:4", "2334:21873", 1439, 420],
  "package-examples": ["1:4", "2334:21911", 1146, 1002],
  "package-detail": ["1:4", "2250:60150", 1440, 5764],
  "pricing-faq": ["1:4", "2334:22046", 1440, 980],
};
export const AGS_PRICING_SCREENS = Object.fromEntries(Object.entries(screenSources).map(([name, [pageId, nodeId, width, height]]) => [name, { src: `/media/ags-pricing/${name}.png`, pageId, nodeId, width, height }]));
const screen = (name, alt, caption) => ({ type: "image", ...AGS_PRICING_SCREENS[name], alt, caption });
const pair = (images, caption) => ({ type: "image-group", images, caption });
const limits = "The screens document my interface design, not project results or current commercial terms. Prices, totals, workloads, and game examples are historical/sample design content. The file contains variants; no approved release, calculation accuracy, research results, or measured impact is claimed.";
const brief = (problem, audience, contribution, outcome) => ({ type: "brief", problem, audience, contribution, outcome, limits });
const related = current => ({ type: "related-cases", title: "Explore more AccelByte design stories", items: AGS_CASES.filter(item => item.path !== current) });
const calculatorPath = "/ags-pricing-calculator";
const pricingPath = "/ags-pricing-experience";
function page(path, title, category, intro, cover, node, practice, story) {
  return {
    path, title, category, designCase: true, narrative: true, agsCase: true,
    thumbnail: AGS_PRICING_SCREENS[cover].src,
    sourceUrl: source(node), sourceLabel: "Explore the source designs",
    metadata: { role: "Product Designer · Insan Nurjaman", practice, label: "Evidence", value: "Original Figma designs" },
    body: [intro, "AccelByte AGS pricing, AMS workload estimation, and cloud-service selection. UI/UX case study."],
    images: [screen(cover, title + ", original AccelByte interface design", "Original Figma design")], story,
  };
}

export const agsPricingPages = {
  [calculatorPath]: page(calculatorPath, "From game requirements to a cost estimate", "Developer tools · Pricing calculator",
    "A configurable planning experience that connects game workloads, cloud services, support choices, and an estimate a team can review and share.",
    "calculator", "3410:60399", "Technical UX · Interaction design · Cost planning", [
      h("Project in brief"),
      brief("A game team's projected cost depends on more than a subscription tier: service selection, hosting, player demand, workload shape, resources, and support all contribute.",
        "Game developers and technical decision-makers planning a cloud configuration, with commercial stakeholders reviewing its estimate.",
        "I designed the calculator interfaces shown here: service configuration, workload inputs, cost summaries, mobile estimate access, and the estimate-download handoff.",
        "Original desktop and mobile designs connecting configurable inputs to a reviewable estimate and a shareable record of its assumptions."),
      h("Key design decisions"),
      { type: "decision-highlights", items: [
        { title: "Reveal complexity through the selected service", rationale: "AGS, AMS, and Extend need different inputs. A shared expandable structure supplies consistency without presenting every technical field at once.", chapter: "A configurable stack, not a fixed plan", link: "See service selection" },
        { title: "Keep the assumptions beside the estimate", rationale: "A forecast becomes more useful when a team can inspect the player, workload, region, and machine inputs behind it, not only a total.", chapter: "Translate game demand into workload inputs", link: "Inspect the technical model" },
        { title: "Adapt the estimate's location, not just its size", rationale: "Desktop can place configuration and estimate side by side. Mobile uses a persistent estimate entry and an expanded sheet, preserving access without squeezing the sidebar.", chapter: "An estimate that stays reachable on mobile", link: "Compare mobile states" },
      ] },
      h("The challenge: forecast a system before using it"),
      p("This calculator belongs before adoption. The user is planning a possible configuration, rather than reviewing the actual consumption and invoices shown in the Billing & Usage case. Keeping that distinction explicit is essential: an estimate is a scenario, not an amount already owed."),
      p("The task crosses commercial and technical questions. A hosting choice changes the environment; multiplayer demand introduces sessions and regional traffic; an extension brings CPU, memory, operation, and logging assumptions. The interface needs to expose enough of that model to support a decision without forcing every user through every field."),
      flow("The planning journey represented by the designs", ["Choose services", "Set hosting and demand", "Configure workload assumptions", "Review component costs", "Save or discuss the estimate"]),
      h("A configurable stack, not a fixed plan"),
      p("The updated service-selection design gives AGS and AMS independent selection controls. Hosting and daily player-demand inputs sit inside the relevant service. Support and other services follow in their own sections. A separate estimate area provides a second reading level while the main column remains focused on configuration."),
      screen("calculator", "Pricing calculator with AGS and AMS selection, hosting choices, player-demand input, support packages, add-ons, and an estimate area", "The design separates configuration from the forecast summary. Displayed prices and totals are example design values, not a validated cost calculation."),
      p("The common pattern is service → configuration → cost breakdown. What varies is the meaning of the inputs. That balance allows the page to grow with a product stack without making a server workload look interchangeable with player concurrency or support."),
      p("The source also includes support prerequisites and unavailable service states. These are dependency rules to make understandable at the point of selection, not simply controls to disable. Their final production behavior requires agreement with the commercial and engineering model."),
      h("Translate game demand into workload inputs"),
      p("AMS configuration starts with the game mode and workload: players per session, buffer percentage, egress per player, and sessions per VM. Regional PCCU makes the geographical distribution explicit. Machine specifications then show the chosen instance alongside CPU and RAM details."),
      screen("ams-workload", "AMS calculator with game-mode workload, regional player estimates, VM specifications, and a service cost breakdown", "Workload, traffic distribution, and machine choice remain named assumptions rather than disappearing behind a monthly total."),
      p("The sliders support exploring a range, while numeric values and unit labels make the selected assumption inspectable. The More Game Mode action extends the model to another workload rather than requiring a single averaged input to represent every mode."),
      p("The annotations make CPU/memory compatibility and unavailable instances explicit. I designed those constraints alongside the inputs so that valid choices could remain discoverable."),
      h("Different resources need different explanations"),
      pair([
        screen("infrastructure", "AMS Bare Metal configuration including workload split, VM and Bare Metal instances, traffic, and cost components", "VM and Bare Metal scenario"),
        screen("extend-workload", "Extend application configuration with population assumptions, CPU, memory, operations, egress, logs, and cost components", "Extend application scenario"),
      ], "A repeated configuration grammar accommodates different resource models without flattening their meaning. Open each complete design at full size."),
      p("Bare Metal introduces a workload-share assumption and separate machine choices. Extend instead exposes application type, CPU and memory needs, operation volume, egress, and log ingestion. More Application supports another extension workload. These details are the systems-thinking core of the calculator, not additional standalone portfolio projects."),
      p("The source includes unfinished placeholders and differing example totals. Before implementation, the calculation model and interface values need a shared review with engineering and commercial stakeholders."),
      h("An estimate that stays reachable on mobile"),
      { type: "decision-evidence", title: "Keep the estimate within reach.",
        description: "The mobile design moves the estimate into a persistent entry and an expanded sheet, instead of squeezing the desktop sidebar.",
        tradeoff: "Less simultaneous comparison; more room to configure. Focus order, dismissal and control overlap remain validation tasks.",
        caption: "Original interface designs. Example amounts are historical design content, not validated costs. Open either screen to inspect the complete original.",
        recommendationId: "adi-ritonga",
        images: [
        screen("mobile-estimate", "Mobile service configuration with a persistent bottom estimation entry", "Configure with the estimate in reach"),
        screen("mobile-sheet", "Expanded mobile estimate sheet listing services, total, tax context, download, and contact actions", "Review the estimate in a sheet"),
      ] },
      h("From a browser scenario to a shareable estimate"),
      p("The download step retains the estimate beside a contact form. Name, company, and email fields support the handoff; the updates checkbox is explicitly optional. Submit & Download is shown as unavailable before completion, making the form state part of the intended flow."),
      screen("summary", "Cost-estimate download form beside the retained service summary, with optional updates consent and disabled submit action", "The planned configuration remains visible during the handoff. The optional marketing choice is distinct from the contact fields."),
      p("There is a real product trade-off here. Contact details support a commercial conversation, but gating an estimate can add friction to a planning task. That tension deserves measurement rather than an unsupported claim that the form improved lead quality."),
      screen("estimate-document", "Downloadable estimate layout retaining hosting, support, workload, region, machine, and service-cost assumptions", "The export keeps assumptions with the forecast, so a teammate can inspect what the number represents. This is an export design, not a tested download."),
      p("The file also contains spreadsheet-format exploration. Document and spreadsheet formats serve the same handoff: preserving a scenario outside the interface. Neither export format is presented as a working integration in this case study."),
      h("Trade-offs and design takeaways"),
      list([
        "Use a shared configuration pattern, but retain each service's units and dependency rules.",
        "Make assumptions inspectable before asking someone to trust a forecast.",
        "Pair exploration controls with readable numeric values and explicit units.",
        "Adapt the relationship between configuration and summary across devices.",
        "Carry the scenario's inputs into its export, not only the headline cost.",
      ]),
      p("The design result is a connected planning experience across service choice, workload specification, forecast review, and handoff. No improvement in estimate accuracy, completion, conversion, or support volume is claimed. My takeaway is that a trustworthy estimate is an explanation of assumptions, not just a number displayed with confidence."),
      h("What to validate next"),
      p("The following is a proposed validation plan, not research already conducted:"),
      list([
        "Ask representative game teams to create and explain a realistic configuration, including units and workload assumptions.",
        "Test whether they can identify a cost driver and compare two scenarios without confusing a forecast with an invoice.",
        "Check invalid combinations, machine eligibility, support prerequisites, and contact-sales thresholds with engineering and commercial stakeholders.",
        "Validate mobile sheet focus, dismissal, numeric-input behavior, and persistent estimate access.",
        "Evaluate whether a shared export contains enough context for a teammate to review independently.",
        "Verify the calculation model, tax rules, rounding, and export consistency separately from interface usability.",
      ]),
      related(calculatorPath),
    ]),
  [pricingPath]: page(pricingPath, "Choosing the right game-cloud offering", "Developer tools · Pricing experience",
    "A public pricing experience that helps game teams connect hosting choices, player scale, example workloads, and the right next step.",
    "environment-selection", "2334:20174", "Information architecture · Product communication · Commercial UX", [
      h("Project in brief"),
      brief("A prospective team needs to understand the offer before configuring it: which environment fits, how player demand affects cost, and when to explore, estimate, or contact the provider.",
        "Game teams evaluating a backend platform, from initial exploration to more specialized hosting and support needs.",
        "I designed the pricing-page interfaces shown here: environment selection, pricing explanation, example-package discovery, detailed scenario reading, and routes into estimation or enterprise contact.",
        "An original public-facing design direction connecting product comparison, commercial explanations, example scenarios, and next actions."),
      h("Key design decisions"),
      { type: "decision-highlights", items: [
        { title: "Start with a meaningful environment choice", rationale: "Shared and Private Cloud differ in hosting context, not only price. The comparison makes those differences visible before continuing into a configuration.", chapter: "Compare environments before configuring them", link: "Inspect the comparison" },
        { title: "Connect price to player demand", rationale: "Player-scale pricing needs a named meter and an explanation. Separate base environment and player demand so a starting price is not mistaken for the whole future bill.", chapter: "Explain what changes as a game grows", link: "See the pricing model presentation" },
        { title: "Use examples as starting points, not promises", rationale: "Game-type packages provide a recognizable entry, while detailed assumptions and a calculator route reveal why one example cannot represent every game.", chapter: "Examples that open into their assumptions", link: "Explore package details" },
      ] },
      h("The challenge: make the offer understandable before the tool"),
      p("The pricing page serves a different question from the calculator. A visitor may not yet know which product, environment, or level of support fits their team. Presenting every technical input immediately would skip the work of explaining the offer."),
      p("My design scope connects product framing, environment choice, player-scale pricing, examples, and the next action. The page has to serve different levels of readiness without treating every visitor as either a sales lead or an expert ready to configure a full stack."),
      flow("The decisions supported by the pricing experience", ["Understand the platform", "Compare environments", "Understand the pricing meter", "Inspect an example", "Estimate or start a conversation"]),
      h("Compare environments before configuring them"),
      screen("environment-selection", "Shared and Private Cloud selection with included platform services, hosting explanations, and a gated next step", "The environment comparison describes the hosting context alongside its commercial entry point. Historical prices are preserved as source copy."),
      p("The screen groups included platform services before comparing the environments. Shared Cloud describes an operated cloud context; Private Cloud describes a dedicated, isolated environment. The selection requirement and disabled Next action make the first decision explicit rather than allowing an ambiguous configuration to continue."),
      p("The important distinction is the relationship between hosting, control, and commercial terms. A price-only comparison would hide why a team might choose one environment over another. The design gives those differences a place before workload-specific detail."),
      h("Explain what changes as a game grows"),
      screen("scale-pricing", "Pay-as-you-scale band showing daily player-concurrency pricing tiers and a meter explanation", "The player-scale meter is explained separately from the environment choice. This is historical pricing presentation, not a current rate card."),
      p("A separate player-scale section explains that demand affects the price beyond the base environment. Its tiered presentation gives a visitor a high-level model before they enter a custom scenario. The meter definition is part of the explanation, not an optional technical footnote."),
      p("This creates a responsibility across the experience: pricing-page terminology, example assumptions, and calculator inputs must describe the same approved commercial model. The file contains variants, so this case does not combine them into a new definitive price list."),
      h("Examples that open into their assumptions"),
      screen("package-examples", "Game-type pricing packages with player assumptions, service combinations, support, and detail actions", "Recognizable game categories give visitors a starting point for exploration, not a quote for their own game."),
      p("The package gallery uses familiar game categories and exposes a concise service/scale summary. See Details leads beyond the headline amount. The intent is to make a complex offer approachable without pretending that genre alone determines a deployment's requirements."),
      screen("package-detail", "Example-package detail showing the game scenario and separate service-input and cost tables", "The complete detail design reveals inputs behind the example. Sample labels, stories, and totals are illustrative, not real customer results."),
      p("The detail view gives the scenario narrative and service assumptions a readable hierarchy. AGS, AMS, Extend, and the analytics-service example have different input tables. This makes the example inspectable and supports a transition into custom estimation when its assumptions do not match the visitor's game."),
      p("Several example figures in the source are draft values. They are not presented as calculation benchmarks or validated quotes. A final content review should align each summary, detailed table, and calculator starting state before publication as commercial material."),
      h("Multiple next steps, one coherent page"),
      screen("pricing-page", "Complete public pricing page connecting environment selection, scale pricing, calculator entry, examples, enterprise contact, and FAQs", "The full source design shows how comparison, explanation, examples, and contact routes belong to one discovery experience."),
      p("A visitor ready to explore can move toward a free start; someone planning a configuration can estimate; a team with specialized requirements can contact the provider. The enterprise section is a different path, not a substitute for understandable self-service information."),
      p("The page's length is a trade-off. It brings several decision stages together, but creates more to scan. Jump links and distinct sections support different entry points. Whether visitors recognize the correct path should be validated through tasks, not assumed from the presence of a CTA."),
      h("Answer unresolved questions in context"),
      screen("pricing-faq", "Pricing FAQ explaining player-concurrency measurement, environment migration, and free-start meaning", "The FAQ addresses questions that change how a visitor interprets the offer, rather than adding unrelated marketing content."),
      p("Meter definitions, movement between environments, and the meaning of a free start are purchase-relevant questions. Keeping them with the pricing experience reduces the need to infer terms from a short plan card. The original explanations remain historical design content and should be checked against approved product policy before reuse."),
      h("Trade-offs and design takeaways"),
      list([
        "Explain the environment distinction before asking for a detailed workload configuration.",
        "Separate a commercial starting point from the variable cost of player demand.",
        "Use recognizable examples, while making their assumptions available for inspection.",
        "Offer different next steps without making every visitor enter a sales flow.",
        "Keep pricing terminology and examples coherent across the page and calculator.",
      ]),
      p("The design result is a public-facing information structure for evaluating a game-cloud offer. No conversion increase, qualified-lead improvement, or A/B-test result is claimed. My takeaway is that pricing UX should help a visitor form a correct mental model before it asks for commitment."),
      h("What to validate next"),
      p("The following is a proposed validation plan, not research already conducted:"),
      list([
        "Ask prospective teams to compare environments and explain the differences without relying only on the entry price.",
        "Check whether visitors distinguish base hosting, player-scale pricing, support, and add-on costs.",
        "Test whether package examples help orientation or encourage misleading assumptions about a real game.",
        "Evaluate discoverability of calculator, free-start, and enterprise-contact paths for different levels of readiness.",
        "Review the full page, example tables, FAQs, and calculator against one approved commercial model.",
        "Establish a baseline before measuring comprehension, task success, or conversion.",
      ]),
      related(pricingPath),
    ]),
};
