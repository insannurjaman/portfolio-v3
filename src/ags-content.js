// AGS case studies extend the incumbent screen-led reading system.
// Owner-confirmed design authorship; source screens establish design evidence,
// not release status, current pricing, research findings, or measured impact.
import { AGS_CASES } from "./ags-projects.js";
export { AGS_CASES } from "./ags-projects.js";
export const AGS_FIGMA_FILE = "https://www.figma.com/design/C7I1ez5sQelYrnFLl9Bn4M/AGS-Web_-Shared-Cloud";
const source = id => `${AGS_FIGMA_FILE}?node-id=${id.replace(":", "-")}`;
const h = text => ({ type: "h2", text });
const p = text => ({ type: "p", text });
const list = items => ({ type: "list", items });
const flow = (label, items) => ({ type: "flow", label, items });
const dimensions = {
  billing: [1280, 1602], usage: [1450, 1290], "billing-unlocked": [1280, 1681],
  "trial-offering": [1440, 900], "unlock-error": [1440, 911], payment: [1280, 900],
  home: [1440, 2271], onboarding: [1440, 1871], welcome: [1440, 900],
  "home-ready": [1440, 900], cancellation: [1440, 1363], reactivation: [1440, 1402],
  "cancel-loading": [1440, 900], "cancel-confirmation": [1440, 911],
  "cancel-error": [1440, 911], "grace-period": [1440, 900],
};
export const AGS_SCREENS = Object.fromEntries(Object.entries(dimensions).map(([name, [width, height]]) => [name, { src: `/media/ags/${name}.png`, width, height }]));
const screen = (name, alt, caption) => ({ type: "image", ...AGS_SCREENS[name], alt, caption });
const pair = (images, caption) => ({ type: "image-group", images, caption });
const limits = "This case study documents my interface design from the supplied Figma file. Screen amounts, dates, customer names, and trial allowances are example design content, not project results or current commercial terms. Release status and measured outcomes are not claimed.";
const brief = (problem, audience, contribution, outcome, evidenceLimits = limits) => ({ type: "brief", problem, audience, contribution, outcome, limits: evidenceLimits });
const decisions = items => ({ type: "decision-highlights", items });
const related = current => ({ type: "related-cases", title: "Explore more AccelByte design stories", items: AGS_CASES.filter(item => item.path !== current) });
function page(path, title, category, intro, cover, nodeId, practice, story) {
  return {
    path, title, category, designCase: true, narrative: true, agsCase: true,
    thumbnail: AGS_SCREENS[cover].src,
    sourceUrl: source(nodeId), sourceLabel: "Explore the source designs",
    metadata: { role: "Product Designer · Insan Nurjaman", practice, label: "Evidence", value: "Original Figma designs" },
    body: [intro, "AccelByte Gaming Services (AGS), Multiplayer Servers (AMS), and Extend. UI/UX case study."],
    images: [screen(cover, title + ", original AccelByte interface design", "Original Figma design")],
    story,
  };
}

const billingPath = "/ags-billing-usage";
const onboardingPath = "/ags-onboarding";
const lifecyclePath = "/ags-subscription-lifecycle";

export const agsPages = {
  [billingPath]: page(billingPath, "Making cloud billing understandable", "Developer tools · Billing & usage",
    "Turning service subscriptions, technical consumption, and payment information into a connected self-service experience for game teams.",
    "usage", "5079:706227", "B2B SaaS · Financial UX · Interface systems", [
      h("Project in brief"),
      brief("A team needs to understand what is active, what it is consuming, and what it will pay, across services that use different meters and lifecycle states.",
        "Game teams using AccelByte's cloud console, including the people configuring services and reviewing their costs.",
        "I designed the Billing and Usage interfaces, trial and unlock paths, and their supporting payment and feedback states.",
        "A connected set of original designs covering trial, active-service, billing-history, consumption, and failure scenarios."),
      h("Key design decisions"),
      decisions([
        { title: "Separate the bill from its explanation", rationale: "Billing answers what is active and payable. Usage explains the consumption behind a balance. Keeping them adjacent preserves a route between financial and technical context.", chapter: "From balance to cost drivers", link: "See the usage hierarchy" },
        { title: "Make service state actionable", rationale: "AGS, AMS, and Extend do not share one account-wide state. Each service carries its own status and next action instead of relying on a single upgrade banner.", chapter: "A service portfolio, not one subscription", link: "Inspect the service states" },
        { title: "Design beyond the successful payment", rationale: "Empty history, mixed service states, payment restrictions, and unlock failure are part of financial trust, not details to leave outside the story.", chapter: "Payment context and recovery", link: "Explore the exception states" },
      ]),
      h("The challenge: technical usage has financial consequences"),
      p("Cloud consumption is not a single familiar unit. AGS surfaces player concurrency, AMS has instance hours and data transfer, and Extend introduces logs, egress, and VM hours. A list of these numbers alone does not explain the relationship between consumption, service access, and a bill."),
      p("My design scope connects those questions across Billing, Usage, and Payment. The aim is to let a team inspect its situation before taking a commercial action, while keeping the technical detail available. This narrative explains the design visible in the file; it does not imply that a particular interview or usability study took place."),
      flow("The questions connected by the billing experience", ["Which services are active?", "What is being consumed?", "What contributes to the balance?", "What happens if I unlock?", "What will be invoiced?"]),
      h("A service portfolio, not one subscription"),
      p("The Billing page groups AGS and its Extend add-on together, while giving AMS its own service area. Trial badges and local actions explain the state of each offering. The interface can therefore show one service in trial while another is active, rather than making the whole account appear uniformly paid or unpaid."),
      screen("billing", "Billing page showing separate AGS, Extend, and AMS trial states, invoice email, and empty payment history", "The trial state separates service access from payment history. Each service exposes its own next action."),
      p("There is a useful tension here: a consistent structure makes services comparable, but their meters and eligibility rules remain different. The visual system repeats the status/action pattern without pretending that every product is the same plan."),
      h("From balance to cost drivers"),
      p("Usage starts with the selected period and a current balance. Service-level sections then break that summary into meaningful measures: player concurrency for AGS, infrastructure consumption for AMS, and resource consumption for Extend. The tax notice sits next to the balance, where it changes how that figure should be interpreted."),
      screen("usage", "Usage page with a billing period, tax-excluded balance, AGS concurrency, Extend resources, and AMS consumption", "A top-level balance leads into service-specific meters. All displayed figures are sample screen content, not outcome metrics."),
      p("This hierarchy serves two reading speeds. Someone checking the overall position can stop at the summary. Someone investigating a charge can continue into the relevant product and its units. AMS measures include visible drill-down affordances, so an aggregate is a starting point rather than the only explanation."),
      h("Trial activation is a commitment to explain"),
      p("The offering screen places product capabilities beside a sequence explaining the trial, setup, and full-version path. That pairing matters: the user should understand both what becomes available and what happens later. Activation is not presented as an isolated button detached from its consequences."),
      screen("trial-offering", "AGS trial offering with product capabilities and an explanation of trial, setup, and full-version progression", "The action is accompanied by an explanation of the service journey. Historical allowance and pricing copy is preserved as design evidence, not a current offer."),
      p("The source contains evolving commercial terminology and allowances. I have retained the original screens rather than reconciling these into a new pricing claim. A production review should check that offering copy, status badges, usage meters, and invoice rules all describe the same approved model."),
      h("Billing after activation"),
      p("The populated Billing design adds an upcoming payment, a route back to Usage, and transaction-level history. A mixed-state example keeps AGS and AMS in trial while Extend is active. This demonstrates why lifecycle state belongs to the service rather than the account as a whole."),
      screen("billing-unlocked", "Billing design with active Extend, trial AGS and AMS, upcoming payment, and populated transaction history", "A populated payment history and active add-on coexist with other services still in trial."),
      p("Upcoming payment and current usage are related but not interchangeable. The page labels the former as a previous-cycle amount including taxes, while Usage explicitly identifies a balance excluding taxes. Maintaining that distinction is more important than simply making the largest number prominent."),
      h("Payment context and recovery"),
      p("Payment information remains in the same Billing & Usage navigation family. In the supplied restricted state, an explanation of an ongoing cancellation/deactivation request appears above a disabled update action. The design pairs an unavailable control with context rather than leaving the user to guess why it cannot be used."),
      pair([
        screen("payment", "Payment details with cancellation-related notice and disabled update payment action", "Restricted payment update"),
        screen("unlock-error", "Unlock failure with contact support and return to billing actions", "Unlock failure and recovery"),
      ], "Supporting states keep the user oriented when a financial action is unavailable or fails."),
      p("The unlock-failure design names the failed operation and offers both support and a return to Billing. It does not imply that payment or activation succeeded. This is designed recovery guidance; the portfolio does not claim that a backend payment integration has been independently tested."),
      h("Trade-offs and design takeaways"),
      list([
        "Use one repeated service-state pattern, while retaining product-specific meters and consequences.",
        "Keep totals scannable without hiding the units needed to investigate a charge.",
        "Distinguish current consumption, upcoming invoices, and historical payments instead of collapsing them into one balance.",
        "Make an upgrade understandable before making it easy to trigger.",
      ]),
      p("The design result is a connected financial experience across multiple cloud products, not a claimed conversion lift. My main takeaway is that financial clarity depends on consistent relationships between screens as much as on the clarity of any single screen."),
      h("What to validate next"),
      p("The following is a proposed validation plan, not research already conducted:"),
      list([
        "Ask game-team participants to explain which services are active and what each next action changes.",
        "Test whether they can identify a cost driver from the top-level balance without confusing consumption with an invoice.",
        "Check understanding of taxes, billing periods, trial limits, and mixed service states.",
        "Review empty, pending, failed, and restricted states with billing, support, and engineering stakeholders.",
        "Establish a baseline before measuring task success, time to explanation, or billing-related support volume.",
      ]),
      related(billingPath),
    ]),
  [onboardingPath]: page(onboardingPath, "From first login to game setup", "Developer tools · Onboarding",
    "Helping game teams understand where they are, what to configure next, and how to find support inside a multi-service cloud console.",
    "home", "3532:274237", "Developer experience · Onboarding · Information architecture", [
      h("Project in brief"),
      brief("A new user enters a console with studio and game contexts, multiple products, technical navigation, and several possible next steps.",
        "Game teams evaluating and configuring AGS and AMS, with different levels of product familiarity.",
        "I designed the onboarding guidance and homepage experiences, including namespace orientation, setup entry points, trial information, and resource discovery.",
        "Original onboarding and homepage designs, with a reported average 21.17% increase in registered users and 25% increase in registered-to-active studio conversion.",
        "Screen amounts, dates, customer names, and trial allowances are example design content, not project results or current commercial terms. The registration and activation outcomes are reported by Insan; baseline figures, measurement periods, and underlying analytics are not included here."),
      h("Key design decisions"),
      decisions([
        { title: "Orient around the current context", rationale: "A studio and a game are different working scopes. The namespace selector and contextual guidance explain that distinction before deeper navigation.", chapter: "Know where you are before configuring anything", link: "See namespace orientation" },
        { title: "Make setup a concrete next step", rationale: "The homepage provides a direct setup route and a sample-game path, rather than requiring every newcomer to begin by exploring the entire feature catalogue.", chapter: "A homepage that points toward action", link: "Explore the setup homepage" },
        { title: "Explain the trial in the product's units", rationale: "AGS and AMS have different technical constraints. Product-specific trial summaries connect those allowances to the activities that may become restricted.", chapter: "Guidance changes with the service", link: "Compare trial explanations" },
      ]),
      h("The challenge: a console is not a single journey"),
      p("A developer console needs to support both first-time orientation and repeated operational work. The same home area can contain setup, usage, analytics, product discovery, and documentation. Without a clear context and a concrete next step, those options can compete for attention."),
      p("I treated the entry experience as a relationship between orientation and action. A tour can identify important regions, but it cannot replace a meaningful setup path. The designs combine namespace guidance, direct configuration actions, and reference material that remains reachable after onboarding."),
      flow("The intended orientation-to-action journey", ["Understand the current namespace", "Review service access", "Choose sample or own-game setup", "Configure the game", "Inspect usage and find resources"]),
      h("Know where you are before configuring anything"),
      p("The guided onboarding anchors its first explanation to the studio namespace selector. The selected scope remains visible in the sidebar and page title. This supplies a reference point for navigation instead of teaching menu labels in isolation."),
      screen("onboarding", "AGS guided onboarding anchored to the studio namespace selector above a setup and resources homepage", "The first tour step explains the current studio context. The tour marker belongs to the original design, not a portfolio progress claim."),
      p("The file includes separate AGS and AMS tour sequences. Their shared structure creates familiarity, while service-specific content acknowledges that a server-management task is not identical to a game-backend task. The key design principle is contextual orientation, not the number of tour steps."),
      h("A homepage that points toward action"),
      p("The game homepage puts Game Setup near the top, followed by analytics, related services, and resources. It gives an early-stage user a concrete configuration entry point while preserving destinations that support a team already working with the console."),
      screen("home", "Game homepage with prominent setup entry, analytics summary, AMS discovery, Extend add-on, feature highlights, and resources", "The complete source screen shows the hierarchy from setup to operational context and supporting resources. Example analytics are not project results."),
      p("The Byte Wars sample-game route in the studio experience offers a different kind of entry: learning through an example rather than immediately integrating an existing game. This makes the choice between exploring the product and configuring a real project visible."),
      p("There is a trade-off in combining setup, analytics, cross-product discovery, and learning material on one page. It supports several stages of readiness, but creates a longer page with competing actions. The setup hierarchy is the design response; whether that priority is understood remains a question for validation."),
      h("Guidance changes with the service"),
      p("The welcome/trial screens explain access before the user starts relying on it. AGS describes its own limit and period; the AMS example explains instance usage, network egress, image capacity, and fleet constraints. Both connect limits to the activities that can be restricted and point toward Usage for monitoring."),
      pair([
        screen("welcome", "AGS welcome modal explaining the trial allowance, period, restriction consequences, and next step", "AGS trial explanation"),
        screen("home-ready", "AMS trial information modal with infrastructure allowances, technical constraints, and a usage monitoring route", "AMS trial explanation"),
      ], "The explanation changes with the service instead of presenting one generic trial limit. Values are historical design examples."),
      p("The challenge is to disclose enough technical detail to support an informed start without turning the welcome into a specification document. The product-specific grouping gives the details a purpose: understanding what the team can do now and when it needs to review usage or unlock access."),
      h("Discovery without losing the working context"),
      p("AMS and Extend appear as related service opportunities within the home experience. Documentation, community, product updates, and roadmap access sit further down the page. This keeps product discovery and help attached to the current workspace instead of sending every question to an unrelated destination."),
      p("Feature-highlight cards are discovery surfaces. Their presence does not establish that I designed the complete underlying Player Tracing, Matchmaking X-ray, or Configuration Migration tools in this case study. The scope here is how the home experience presents and routes to capabilities."),
      h("Trade-offs and design takeaways"),
      list([
        "Teach the current working scope before teaching every navigation item.",
        "Pair orientation with a task the user can actually begin.",
        "Use consistent guidance structures without hiding service-specific constraints.",
        "Keep learning resources available after the welcome or tour has closed.",
      ]),
      p("The design result is a coordinated entry experience across namespace context, trial explanations, setup, and resource discovery. My takeaway is that onboarding continues in the page hierarchy and available next actions, not only inside a welcome modal."),
      { type: "h5", text: "Reported registration and activation outcomes" },
      p("I report an average 21.17% increase in registered users and a 25% increase in conversion from registered studios to active studios. My contribution included clear guided tours, homepage previews, and free-trial design."),
      p("These are project outcomes I report for this work. Baseline figures, measurement periods, and underlying analytics are not included in this case study; no claim of an isolated experiment or sole causation is made."),
      h("What to validate next"),
      p("The following is a proposed validation plan, not research already conducted:"),
      list([
        "Ask a newcomer to explain the difference between studio and game context and find the correct setup route.",
        "Compare the sample-game path with own-game configuration using realistic team tasks.",
        "Test whether a multi-step tour is helpful or whether some guidance should be shown at the moment of use.",
        "Check whether returning users can bypass orientation and reach usage or configuration efficiently.",
        "Define a successful first configuration before measuring completion and time-to-setup.",
      ]),
      related(onboardingPath),
    ]),
  [lifecyclePath]: page(lifecyclePath, "A trustworthy subscription lifecycle", "Developer tools · Lifecycle & recovery",
    "Making service cancellation, remaining access, payment restrictions, and reactivation understandable across a connected cloud product suite.",
    "reactivation", "1999:198770", "Service-state design · Recovery · Financial UX", [
      h("Project in brief"),
      brief("Cancelling one cloud service has consequences for access and billing, but does not always mean that every other service stops working.",
        "Game teams changing their service subscriptions and reviewing what remains available or payable.",
        "I designed the cancellation/deactivation journeys and recovery states, including confirmations, failures, payment restrictions, grace messaging, and reactivation entry points.",
        "A documented lifecycle across AGS, AMS, and Extend with explicit service-specific consequences and next actions."),
      h("Key design decisions"),
      decisions([
        { title: "Explain consequences before confirmation", rationale: "Access changes, completion timing, and outstanding billing expectations belong before a consequential action, not only in the message after it.", chapter: "A clear exit starts before the button", link: "Inspect the cancellation design" },
        { title: "Keep each service's state independent", rationale: "An AGS cancellation should not make an active AMS subscription appear cancelled. Confirmation and usage views communicate remaining access explicitly.", chapter: "Cancelled does not mean everything is unavailable", link: "See service continuity" },
        { title: "Make recovery contextual", rationale: "A reactivation action appears next to the affected service and its retained usage context. Restrictions are explained where they block an action.", chapter: "Recovery where the problem is visible", link: "Explore reactivation and restrictions" },
      ]),
      h("The challenge: an exit is still a product experience"),
      p("A cancellation flow has to answer several questions at once: which service is being changed, when the change completes, what happens to access, and what charges remain. Those questions become harder when a team uses multiple related services with independent states."),
      p("My scope covers both the request and what follows it. I designed the confirmation, in-progress, success, and failure surfaces alongside reactivation and restriction messaging. The story is about preserving understanding through a state change, not about claiming improved retention."),
      flow("The lifecycle represented by the source designs", ["Review consequences", "Confirm the service change", "Receive progress or failure feedback", "Understand remaining access", "Review usage or reactivate"]),
      h("A clear exit starts before the button"),
      p("The cancellation screen names the exact AGS offering and explains completion timing, invoice expectations, and the change in access. Keep Subscription and Cancel Subscription remain visibly different actions. The information is attached to the decision instead of deferred to a help page."),
      screen("cancellation", "AGS Shared Cloud cancellation page showing consequences and separate keep and cancel actions", "The left-hand decision area explains the exit. Product marketing testimonials on the right are original screen content, not endorsements of my work."),
      p("The design also exposes a tension worth acknowledging: the adjacent marketing content competes with a sensitive exit task. A respectful experience should make the customer's intended action clear even when retention messaging is present. That balance deserves explicit evaluation rather than treating a testimonial column as proof of successful retention."),
      h("Feedback through the transition"),
      p("Submitting the request creates an in-progress state; failure has a distinct destination with support and a route back to Billing. The interface does not silently replace an unresolved operation with a success message. Clear feedback matters because uncertainty here can prompt repeated requests or a mistaken belief that access has already changed."),
      pair([
        screen("cancel-loading", "Cancellation screen with a blocking in-progress feedback overlay", "Request in progress"),
        screen("cancel-error", "Cancellation failure with support and return-to-billing actions", "Failure with recovery routes"),
      ], "In-progress and failed operations remain distinct. These are designed states, not a claim that server-side cancellation was tested."),
      h("Cancelled does not mean everything is unavailable"),
      p("The confirmation identifies AGS as the cancelled service and explicitly says that an active AMS subscription remains usable. It offers Review Usage Detail and Go to Home as next steps. This makes the success message useful beyond announcing completion."),
      screen("cancel-confirmation", "AGS cancellation confirmation explaining continued AMS access and routes to review usage or home", "The confirmation carries the service dependency logic into the next step."),
      p("This distinction continues in the Usage view. Historical consumption remains visible, while the affected AGS area receives an unsubscribed notice and a Reactivate AGS action. AMS remains represented separately. A single account-level disabled screen would hide this nuance."),
      h("Recovery where the problem is visible"),
      screen("reactivation", "Usage page retaining balances and service details while offering reactivation for unsubscribed AGS", "Reactivation sits beside the affected service, while other services and retained usage remain readable."),
      p("The recovery action is placed where the user can see why it is needed. Retained usage supplies context for a decision to return, without implying that a cancelled service is currently active. The source includes reactivation entry points from Billing and Home as well as Usage, so the user does not need to remember one hidden recovery location."),
      h("Restrictions need an explanation"),
      p("Two supporting designs communicate different constraints: Payment explains a cancellation/deactivation-related hold and disables its update action; the homepage announces a grace period during which service activation is unavailable. These should remain distinct messages because they affect different tasks."),
      pair([
        screen("payment", "Payment information with cancellation-related hold notice and disabled update control", "Payment-related restriction"),
        screen("grace-period", "Studio homepage with a grace-period banner explaining temporarily unavailable service activation", "Activation-related restriction"),
      ], "Availability is communicated in context. A shared warning treatment should not blur the difference between the two restrictions."),
      p("The design makes the limitation visible, but a production review should still confirm timing, eligible actions, and what changes when the restriction ends. Backend completion rules and recovery guarantees are outside what a static design export can prove."),
      h("Trade-offs and design takeaways"),
      list([
        "Name the affected service instead of using ambiguous account-level success or failure copy.",
        "Explain access and financial consequences before a user commits.",
        "Keep retained usage readable without misrepresenting current service availability.",
        "Make unavailable actions understandable and recovery routes discoverable.",
      ]),
      p("The design result is an explicit lifecycle across cancellation, continuity, restrictions, and recovery. My takeaway is that trust is earned at the uncomfortable moments: when an operation fails, when a service stops, and when the user needs to understand what is still true."),
      h("What to validate next"),
      p("The following is a proposed validation plan, not research already conducted:"),
      list([
        "Test whether customers can explain which service is cancelled and which remains usable.",
        "Check understanding of completion timing, retained usage, and remaining billing consequences.",
        "Evaluate whether retention content interferes with a clear, voluntary exit.",
        "Exercise failure, repeated-request, pending, and reactivation paths with engineering and support.",
        "Measure comprehension and recovery task success only after establishing an agreed baseline.",
      ]),
      related(lifecyclePath),
    ]),
};
