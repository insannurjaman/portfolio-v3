import { KYC_CASE_PATH, KYC_CASE_PROFILE } from "./kyc-content.js";
import { CASE_PREVIEWS } from "./case-illustrations.js";
import { caseChapterTitles, caseChapterId, withCaseNarrative } from "./case-narrative.js";

// These are reading chapters, not claims that every project used the same process.
export const CASE_STUDY_CHAPTERS = Object.freeze([
  "Overview", "Problem", "My Role", "Process", "Key Decisions",
  "Final Solution", "Outcomes", "Learnings",
]);
const sectionIds = ["chapter-0", "case-problem", "case-context", "case-exploration", "case-constraints", "case-solution", "case-impact", "case-reflection"];
// Preserve the source grouping and deep links while changing the reading order.
const readingOrder = [0, 2, 1, 4, 3, 5, 6, 7];
const p = text => ({ type: "p", text });
const list = items => ({ type: "list", items });
const noAnalytics = "No production analytics or baseline comparison is included. The evidence establishes the design deliverable, not a measured improvement.";
const reflection = (strength, limitation, next) => ({ strength, limitation, next });

// Editorial interpretation is kept separate from original artifacts and reported measurements.
export const CASE_STUDY_PROFILES = {
  "/loyica-client-portal": {
    company: "Saphyte · Client Portal redesign",
    businessContext: "A branded trading portal connects account management, challenge purchase, verification, and payouts. I focused on making the dependencies between these tasks understandable within a coherent self-service journey.",
    ownership: "I owned the portal UX and UI redesign and its reusable multi-brand design library at Saphyte. My scope covered account hierarchy, overview and analysis, challenge comparison and checkout, verification states, payout readiness, and handoff-ready component patterns.",
    evidence: "The original screens and interactive demo expose the dependencies between account switching, performance, challenge purchase, verification, and payout. I used these connected workflows to frame the redesign.",
    constraint: "Account status, performance, eligibility, and payout readiness need distinct explanations. I kept the overview compact for quick checks and placed deeper analysis and action-specific requirements in dedicated views.",
    exploration: "I explored populated, empty, and cancelled accounts alongside the stages of verification and payout. Comparing these states helped define which context should remain stable as the available actions changed.",
    solution: "The final design set connects account context to performance, challenge selection, verification progress, and payout eligibility. The following original screens and demo expose the surrounding states and interaction intent.",
    impact: "I delivered a connected portal redesign, a supporting multi-brand design system, and an interactive Figma Sites demo.",
    reflection: reflection("Account context stays connected to the action and its requirements.", "My ownership covers UX, UI, and the design library. Payment infrastructure, compliance policy, production engineering, and validation of user comprehension sit outside this design record.", "Test account switching, eligibility explanations, and recovery with representative users before comparing task success against an implemented baseline."),
  },
  "/accelbyte-design-system": {
    company: "AccelByte · Admin-console design system",
    evidence: "The library spans product tiers, namespaces, theme and density choices, data states, responsive compositions, and handoff templates. These contexts shaped the system requirements.",
    constraint: "I built on Ant Design rather than presenting its underlying primitives as my invention. Product-specific navigation and data behavior needed additional patterns. Theme and density are separate decisions so a denser interface does not require a different product language.",
    exploration: "I explored theme and density modes, responsive headers, navigation contexts, and populated versus empty data patterns to establish a consistent component model.",
    solution: "Foundations connect to configurable product components, complete page structures, exception states, and documentation utilities. Original library exports below show both the reusable model and its intended product context.",
    impact: "I delivered an authored Figma library and supporting templates for documentation, design status, and handoff.",
    reflection: reflection("Context, states, and documentation are reusable parts of the system, not just visual styling.", "A comprehensive library does not by itself prove that teams use it consistently or that code matches it.", "Audit live instances and detachments, compare Figma to implementation, and measure the effort required to add a real page or state."),
  },
  "/loyica-client-portal-design-system": {
    company: "Saphyte · Client Portal design-system redesign",
    evidence: "The source library connects primitive and semantic collections to four brand/theme examples, configurable components, and instances within the portal.",
    constraint: "Brand expression must change without duplicating the interaction model. Semantic roles sit between Tailwind-derived color foundations and components. Configurable properties support reuse, but require naming rules and guidance to avoid invalid combinations.",
    exploration: "I compared the same Button family across InstantFunding and VoltFunded in light and dark modes, then extended the model through configurable inputs and complete portal compositions.",
    solution: "The library combines semantic themes, size and state variants, configurable inputs, navigation, state cards, and steppers. The original exports and product connections below show the model in use in design files.",
    impact: "I delivered the shared library and connected it to the redesigned portal through reusable component instances.",
    reflection: reflection("Semantic roles let branded examples share a consistent component model.", "Several source component descriptions are empty, so variants alone do not provide complete usage or accessibility guidance.", "Complete component descriptions, test valid property combinations, and verify contrast, keyboard behavior, and code parity in each theme."),
  },
  "/saphyte-eafghans-design-system": {
    company: "Saphyte · Saphyte & E-Afghans shared design system",
    evidence: "The source library includes global and semantic tokens, typography and size choices, component states, branded examples, and usage guidance. It documents the system I created and adapted, not authorship of Chakra UI.",
    constraint: "A shared foundation needs room for two identities without changing the meaning of controls. Chakra UI supplies the underlying foundation; the authored work connects brand tokens, components, product examples, and guidance. Accessibility remains an implementation responsibility as well as a design consideration.",
    exploration: "Brand examples and component configurations make alternative appearances and states inspectable. The archive does not include a chronological test log or a measured comparison of separate libraries against the shared approach.",
    solution: "The final library connects tokens to configurable actions, forms, branded compositions, and usage documentation. Product links show where the system meets actual design tasks.",
    impact: "The deliverable is the complete adapted design library and its guidance. No adoption total, accessibility certification, production-code parity, or efficiency uplift is claimed.",
    reflection: reflection("Brand identity and component behavior are described at different levels of the system.", "Design coverage is not evidence of consistent product implementation or verified accessibility.", "Review components in real Saphyte and E-Afghans workflows, document exceptions, and test the implemented themes with keyboard and assistive technology."),
  },
  "/ags-pricing-calculator": {
    company: "AccelByte · AGS pricing calculator",
    evidence: "Desktop and mobile frames show the dependencies between service choices, workload inputs, resources, and estimates. A design recommendation accompanies the mobile estimate comparison.",
    constraint: "A simple price field would hide the assumptions behind cloud cost. The design exposes configuration while grouping explanations by resource. On mobile, estimate access competes with input space; a reachable summary must not conceal the assumptions it summarizes. Prices are historical design examples.",
    exploration: "The record includes configuration variants, workload inputs, mobile estimate-access alternatives, and the download handoff. The paired mobile frames preserve the actual review context rather than presenting an invented A/B-test winner.",
    solution: "The desktop and mobile designs connect service configuration to a cost breakdown and a shareable estimate. Input explanations, summary access, and the download flow are shown in their original context below.",
    impact: "The design deliverable makes assumptions reviewable alongside an estimate. Calculation accuracy, current prices, launch approval, and a conversion outcome are not established by these frames.",
    reflection: reflection("The estimate stays connected to the technical assumptions that create it.", "Reviewing a design cannot establish whether users enter realistic workloads or whether the calculation is correct.", "Validate input comprehension and mobile summary access, then compare estimated versus actual costs using an implemented calculator and a documented baseline."),
  },
  "/ags-pricing-experience": {
    company: "AccelByte · AGS public pricing experience",
    evidence: "The source frames show environment comparison, pricing explanations, example scenarios, FAQs, and routes into estimation or contact. They reveal the information architecture being designed, not observed purchasing behavior.",
    constraint: "The page must orient an unfamiliar team without becoming the calculator itself. Examples offer a starting point, but require visible assumptions to avoid looking like universal quotes. Self-service estimation and enterprise contact need distinct, coherent routes.",
    exploration: "Environment choices, scenario details, and multiple next-action patterns are preserved as design explorations. The archive does not establish which variant shipped or whether one outperformed another.",
    solution: "The final design direction connects offer comparison to worked examples, estimation, and support for unresolved questions. Historical scenario values remain illustrative rather than current commercial terms.",
    impact: "The outcome is the original public-facing pricing design and its connected decision paths. No pricing-page conversion uplift or approved production variant is claimed.",
    reflection: reflection("Comparison and example assumptions prepare the visitor for a more detailed estimate.", "A complete explanation can still fail if people choose the wrong environment or mistake examples for quotes.", "Test environment choice and price comprehension with game teams, then instrument the path from comparison to estimate or qualified contact."),
  },
  "/ags-billing-usage": {
    company: "AccelByte · AGS billing and usage",
    evidence: "Trial, active, unlocked, payment, and failure designs show that service access, consumption, and invoices are different states. The original interfaces support that distinction; billing-support logs and research findings are not published here.",
    constraint: "Different services use different meters and lifecycle rules. A shared layout supports familiarity, while service-specific units and consequences must remain visible. A single balance cannot explain both current consumption and historical payment.",
    exploration: "The record covers service-state variations, trial activation, consumption detail, billing history, and recovery. These are documented interface scenarios, not proof of usability-test iterations.",
    solution: "Billing and Usage link the top-level financial view to cost drivers, trial commitments, activated services, and payment recovery. Original screens retain their sample units, periods, and amounts.",
    impact: "The delivered design set covers the financial lifecycle across multiple cloud services. No reduction in support contacts, billing errors, or time to understand a charge has been measured in the public record.",
    reflection: reflection("Repeated structures connect service access, consumption, and payment without treating them as one value.", "The designs cannot establish whether users distinguish an estimate, consumption total, and invoice.", "Test explanation tasks with game teams and billing stakeholders, then baseline billing-related support and task completion before measuring improvement."),
  },
  "/ags-onboarding": {
    company: "AccelByte · AGS and AMS onboarding",
    evidence: "The design record includes namespace orientation, guided tours, setup entry points, sample-game routes, and service-specific trial explanations. Reported registration and activation outcomes are separated below from the interface evidence and proposed research.",
    constraint: "The console serves both newcomers and returning teams. Teaching every feature at once would compete with setup; a tour alone would not give users a useful task. Service-specific allowances also need explanation without turning the welcome into a technical specification.",
    exploration: "AGS and AMS tour sequences and home states show how one guidance pattern changes with product context. The source demonstrates alternatives and states, but does not include an experiment log isolating each change.",
    solution: "Namespace context, a concrete setup route, trial guidance, and persistent resources form the entry experience. The original screens below show how orientation and action are connected.",
    impact: "I report an average 21.17% increase in registered users and a 25% increase in registered-to-active studio conversion for this work. My contribution included guided tours, homepage previews, and free-trial design. These are reported project outcomes, not evidence of an isolated experiment or sole causation.",
    reflection: reflection("Onboarding continues in page hierarchy and available next actions after the tour closes.", "The reported metrics do not isolate the effect of each design change, and baseline figures and measurement windows are not published.", "Retain a funnel definition and dated baseline, segment first-time and returning teams, and test whether newcomers understand scope and can start setup without assistance."),
  },
  "/ags-subscription-lifecycle": {
    company: "AccelByte · AGS, AMS, and Extend subscription lifecycle",
    evidence: "Cancellation, loading, failure, cancelled-service, restriction, grace-period, and reactivation screens document the lifecycle. They establish designed consequences and recovery paths; cancellation analytics and support findings are not supplied.",
    constraint: "Cancelling one service does not necessarily end all access. A reusable transition pattern must retain service-specific consequences, billing responsibilities, and recovery. Clarity and control take priority over making the exit hard to find.",
    exploration: "The archive explores the states around a transition, not just its confirmation dialog. It includes failure and recovery alongside the intended path, without claiming a tested or shipped state machine.",
    solution: "The design connects an informed exit to transition feedback, remaining access, payment context, restrictions, and reactivation. Original states below show the consequences close to the relevant action.",
    impact: "The outcome is a documented service-specific lifecycle and recovery design. No retention lift, cancellation reduction, or support-volume change is claimed.",
    reflection: reflection("The post-cancellation experience is treated as part of the product rather than an ending screen.", "Designed feedback cannot establish correct backend state, billing behavior, or users' understanding of what remains accessible.", "Review the state model with engineering and billing, test consequence comprehension, and exercise interrupted transitions and reactivation before measuring outcomes."),
  },
  "/halodish-apps": {
    company: "eftax Co., Ltd. · HaloDish",
    evidence: "Original mobile screens cover discovery, ingredient-photo guidance, uncertainty, points, purchases, and return paths. Official store destinations document publication. The separately reported landing-page acquisition result is not an app-usability or food-classification result.",
    constraint: "Dietary information can be incomplete or ambiguous. The interface needs to show uncertainty rather than imply a guarantee. Lists and maps serve different discovery tasks; photo input also requires visible guidance and cost before commitment.",
    exploration: "The design record connects list and map discovery, information detail, photo capture and confirmation, and multiple result states. It does not publish a chronological iteration study or classifier evaluation.",
    solution: "The mobile design connects finding a place or product to inspecting evidence and, where relevant, checking an ingredient photo. Original screens preserve uncertain results, purchase context, and empty states alongside the main path.",
    impact: "HaloDish is documented as published on iOS and Android by eftax. I also report a 1,296% increase in user-acquisition conversion from the HaloDish landing page I designed and implemented. That outcome belongs to landing-page acquisition, not to the app's usability or classification accuracy.",
    reflection: reflection("Discovery, input guidance, cost, and uncertainty form one connected task rather than separate finishing details.", "Publication and acquisition growth do not establish dietary accuracy, app task success, or attribution for later releases.", "Keep acquisition and app-task measures separate. Test photo-input comprehension, uncertainty interpretation, and the route from a shortlist to inspectable detail."),
  },
  "/divermenu": {
    company: "DiverMenu · Personal design concept",
    evidence: "The Figma concept shows conversation, Explore, dish details, Saved, editable food preferences, and desktop/mobile layouts. These are scenario and interaction artifacts, not validated personas, user interviews, or a working recommendation engine.",
    constraint: "Chat should not be the only discovery route. Structured browsing and editable preferences provide control when a prompt is vague. Preference matching must not be presented as evidence of dietary suitability or safety.",
    exploration: "The connected journey and desktop/mobile adaptations show how conversation, browsing, and saving can support the same choice. The archive does not contain a tested comparison of recommendation approaches.",
    solution: "Conversation leads to inspectable details, Explore offers an alternative entry, and Saved supports a return visit. Preference and account controls expose context that would otherwise remain hidden in a chat.",
    impact: "The result is a connected desktop and mobile interface concept. Launch, recommendation quality, user satisfaction, and business impact are not established.",
    reflection: reflection("Conversation is connected to structured comparison, editable preferences, and a reusable shortlist.", "The screens do not establish the quality or trustworthiness of generated recommendations.", "Prototype ambiguous requests, preference corrections, no-result cases, and source inspection before evaluating recommendation quality with real users."),
  },
  "/e-afghan-landing-page": {
    company: "Saphyte · E-Afghan public website redesign",
    evidence: "Responsive source designs show service discovery, visit preparation, portal explanation, and supporting information pages. The problem framing comes from the designed journey; a research protocol and service analytics are not supplied.",
    constraint: "The public website and account portal serve different jobs. Service information should help people prepare before the handoff, while responsive layouts must preserve the decision order rather than simply shrink desktop content.",
    exploration: "Desktop, tablet, and mobile layouts provide an inspectable comparison of hierarchy and handoff. No original-versus-redesign usability study is documented.",
    solution: "A service-first public site connects the service index, visit planning, account-journey explanation, and supporting pages. The original responsive screens show the hierarchy at different widths.",
    impact: "The deliverable is the responsive public-facing Figma design and its connection to the Citizen Portal. A production release and changes in service completion or satisfaction are not established.",
    reflection: reflection("Service selection and portal entry have distinct roles in the journey.", "The intended hierarchy has not been validated with service applicants in the available record.", "Test service identification, requirement comprehension, language needs, and the website-to-portal handoff before measuring completion against a baseline."),
  },
  "/e-afghan-citizen-portal": {
    company: "Saphyte · E-Afghan Citizen Portal",
    evidence: "Overview, identity preparation, staged passport application, review, declaration, and mobile screens document the intended journey. Example identities and statuses are sample design content, not real consular records.",
    constraint: "Applications need preparation, correction, and pause points as well as submission. Visible progress and Save and Exit describe intended behavior, but persistence, uploads, permissions, and session recovery require implementation validation.",
    exploration: "The archive connects an overview to staged input and section-level review. Desktop and mobile layouts show workflow adaptation; a tested before-and-after comparison is not included.",
    solution: "Quick actions, readiness information, visible application stages, review edits, and a separate declaration boundary make the long task inspectable. Original designs show these details without claiming working submission.",
    impact: "The outcome is the documented responsive portal and application-flow design. Application-success improvement, production release, security validation, and usability-study results are not established.",
    reflection: reflection("Review is treated as a correction task before final confirmation.", "A visible pause action does not establish reliable saved state or recovery in a real application.", "Test interrupted applications, document failures, review corrections, and mobile or assistive-technology use with the implemented workflow."),
  },
  "/fincy-apps": {
    company: "Fincy / Finsy · Financial-learning design exploration",
    brief: { problem: "Financial learning can feel text-heavy, difficult to discuss, and disconnected from affordable guidance.", audience: "Millennials preparing for financial responsibilities, described in the archive as potential members of the sandwich generation.", contribution: "I documented competitor research, qualitative interviews, synthesis, information architecture, wireframes, and a mobile interface concept.", outcome: "A mobile concept connecting financial articles, video, audio, consultation, and discussion groups.", limits: "The archive uses both Fincy and Finsy naming. It does not establish a commissioned employer engagement, production release, or measured financial outcome." },
    evidence: "The source slides document a comparison of Finansialku and Money Lover, unstructured interviews with several millennials, persona synthesis, and an affinity diagram. Findings include limited discussion support, text-heavy information, and consultation cost. The participant total, recruitment details, and raw transcripts are not recorded here.",
    constraint: "The concept responds to different learning preferences through articles, audio, and video, and adds discussion and consultation. This broad scope creates a content and moderation burden. Those operational requirements are a design implication, not a documented implementation decision.",
    exploration: "The archive progresses from a learning scenario and information architecture to connected low-fidelity mobile wireframes. It shows how content, consultation, discussion, and profile destinations fit together; no tested iteration winner is documented.",
    solution: "The high-fidelity concept includes onboarding, multimodal financial content, consultant discovery and chat, and discussion rooms. The original panels below retain the visual and flow evidence.",
    impact: "The outcome is the research-informed design concept. No release, learning-retention result, consultation uptake, or reduction in financial burden is established by the archive.",
    reflection: reflection("The proposed information architecture offers more than one way to learn and seek support.", "Interview synthesis does not prove that a broad learning, advice, and community product changes financial behavior.", "Narrow the first release to one learning task, test content comprehension and return use, and define the boundaries between education, peer discussion, and professional advice."),
    archiveGroups: { 2:[1], 3:[3,4,5,6,7], 5:[2,8,9,10], 6:[11,12], 8:[13] },
  },
  "/game-store-admin-portal": {
    company: "XYZ Entertainment · Supplied design-brief scenario",
    timeline: "3 days, as recorded in the original project brief. Calendar dates are not supplied.",
    brief: { problem: "Players need to find and buy games while publishers need a clear route to publish and manage them.", audience: "Game buyers and publishers represented by two design personas.", contribution: "I designed the storefront and admin concept through comparison research, flows, sketches, wireframes, prototypes, and testing.", outcome: "A storefront and publishing-portal prototype. The archive reports a storefront SUS score of 73 from 8 respondents.", limits: "XYZ Entertainment is the brief's scenario, not a verified employer or production client. SUS was conducted for the storefront only, not the admin portal." },
    evidence: "The archive documents comparison with Steam, Epic Games, and Ubisoft; two design personas; concept testing with 2 people and 3 scenarios; and a later storefront SUS questionnaire with 8 respondents. Personas are design models, not proof of a representative research sample.",
    constraint: "The brief allowed 3 days for both storefront and admin work. Limited time and participant availability meant the SUS evaluation covered the storefront only. Early low-fidelity testing separated flow decisions from visual preference; the admin workflow still needs its own evaluation.",
    exploration: "Sitemaps, purchase and publishing flows, sketches, wireframes, concept-test feedback, and high-fidelity iterations remain in the record. Feedback addresses dense filters, game grouping, wishlist/cart labels, review context, and publishing complexity.",
    solution: "The final concept covers game discovery, details, cart, sign-in, checkout, library, and the admin publishing journey. These are prototype interfaces, not evidence of a working payment or distribution service.",
    impact: "The archive reports an average storefront SUS score of 73 from 8 respondents. This is a single evaluation of the prototype, not a 73% success rate or an improvement over a measured baseline. The admin portal was not included in that SUS evaluation.",
    reflection: reflection("Low-fidelity concept testing exposed specific flow and label changes before visual refinement.", "The short brief and small samples limit generalization; the admin portal lacks the same evaluation coverage as the storefront.", "Prioritize publishing-flow testing, retain task-level observations alongside SUS responses, and compare a revised prototype against a clearly defined baseline."),
  },
  "/improve-otp-push-notification": {
    company: "Tokopedia · OTP notification onboarding",
    brief: { problem: "People expected a device notification and missed the OTP inside the Tokopedia app.", audience: "People signing in on a second device using notification OTP.", contribution: "As UI Designer, I researched the confusion and designed the instructions, illustration, motion, and flow prototype.", outcome: "I report about 4% higher success, 6,000 fewer wasted requests each month, and Rp2.1 million in monthly savings.", limits: "Results are reported by Insan. Baseline rates, measurement window, and underlying analytics are not included; 4% is not reinterpreted as percentage points." },
    evidence: "The archived guerrilla test used two devices, with only one signed into Tokopedia. Participants were unsure which app to open and whether to act before or after sending the code; prominent imagery drew attention away from the instructions. The participant count and test dates are not supplied.",
    constraint: "The recorded technical limitation prevented the OTP from appearing directly in the device notification center. The design therefore needed to direct people into the Tokopedia app, rather than promising a device-level behavior the product could not provide.",
    exploration: "Google's two-step verification was a flow reference, and a Jon Anto motion shot was visual inspiration. The archive documents Figma illustration and low-fidelity motion, then Illustrator and After Effects production and a GIF integrated into the flow prototype.",
    solution: "The proposed interface combines explicit app-opening guidance with motion that demonstrates the required action. The original animation and flow evidence remain below. The archive describes implementation at the time; it is not a claim about Tokopedia's current interface.",
    impact: "I report a success-rate improvement of about 4%, translating to 6,000 fewer wasted OTP requests each month and Rp2.1 million in monthly savings. The available record does not include the original rate, comparison period, request-cost model, or experiment design.",
    reflection: reflection("The solution responds to the actual delivery constraint instead of decorating an impossible notification behavior.", "Visual appeal alone cannot establish comprehension, and the public metric record does not isolate the contribution of motion versus wording.", "Test comprehension of the next action separately from visual preference, and preserve the baseline, event definitions, and cost assumptions behind any future result."),
  },
  "/optimizing-the-use-of-allowances": {
    company: "Mekari Flex / GoPay · Integration design exploration",
    brief: { problem: "A limited set of benefit merchants left some people unable to use their allowance for relevant everyday needs.", audience: "Mekari Flex users exploring how to spend their available benefits.", contribution: "I researched allowance needs and designed the proposed GoPay connection, flow, architecture, wireframes, and mobile UI.", outcome: "An integration concept covering benefit explanation, account connection, OTP, confirmation, and balance access.", limits: "This is a documented design proposal, not a claim of employment at Mekari, a commercial GoPay partnership, or a launched financial integration." },
    evidence: "The slides describe a qualitative survey shared through Fomo to recruit Mekari users. The synthesis records requests for more relevant merchants, transport and shopping options, and GoPay transfers. The participant count and raw responses are not published in the available record.",
    constraint: "Adding merchants individually and connecting to a broader payment destination are different approaches. The proposal explores the latter, but allowance policy, partner permissions, account ownership, financial compliance, and backend feasibility would need agreement before implementation.",
    exploration: "How-might-we questions lead into account-connection flows, information architecture, and low-fidelity screens. These artifacts show the proposed sequence from benefit explanation through phone confirmation and OTP to a connected account.",
    solution: "The high-fidelity proposal includes a connection entry, benefit explanation, phone number and OTP steps, a success state, and GoPay balance and payment destinations. Example balances are interface content, not evidence of real transfers.",
    impact: "The outcome is a researched integration proposal and connected mobile design. Allowance utilization, connection completion, production release, and commercial feasibility have not been established.",
    reflection: reflection("The proposal connects the integration to concrete spending needs rather than treating partnership visibility as the goal.", "Survey demand does not establish that allowance rules or a payment partner permit the proposed behavior.", "Validate policy and technical feasibility first, then test account ownership, failed verification, allowance allocation, and connection comprehension before measuring utilization."),
    archiveGroups: { 2:[1], 3:[2,4,5,6], 5:[3,7,8,9,10], 6:[11,12,13,14], 8:[15] },
  },
  "/relling-apps": {
    company: "Relling · Rental-marketplace design exploration",
    brief: { problem: "Renters struggle to find reliable product information, while owners worry about verification, damage, and loss.", audience: "People renting products and people listing products for rent.", contribution: "I documented rental research, problem synthesis, a storyboard, the rental flow, and a mobile interface concept.", outcome: "A concept connecting discovery and product detail to rental duration, agreement, payment, and tracking.", limits: "The archive's Privy integration and safety language describes the proposal. It is not evidence of an implemented identity integration or a security guarantee." },
    evidence: "Archived survey charts and open responses cover renting and listing behavior. The synthesis highlights missing product detail, difficulty finding items, mismatch, verification and collateral effort, and fear of loss. These are research findings in the design archive, not marketplace performance data.",
    constraint: "Removing every verification step could reduce friction while undermining trust. The concept uses product detail, an agreement, and a digital-signature step, but the balance between assurance, privacy, and effort requires validation. A signature screen cannot itself guarantee the safety of goods.",
    exploration: "A rental storyboard and user flow connect discovery to checkout, duration, delivery information, an agreement, payment, and tracking. The record illustrates the intended sequence; it does not publish a comparative usability study.",
    solution: "The final mobile concept covers onboarding, browse and search, product details, chat, rental configuration, agreement and signature, payment, and delivery tracking. Original screens preserve the surrounding interaction context.",
    impact: "The deliverable is the rental concept and its research/flow artifacts. Launch, successful rentals, fraud reduction, loss prevention, and conversion improvement are not established.",
    reflection: reflection("Trust concerns appear in the rental journey rather than only in marketing language.", "The design cannot establish that verification prevents loss or that the agreement is usable and enforceable.", "Test both renter and owner tasks, evaluate comprehension and abandonment around verification, and review privacy and operational responsibilities with appropriate specialists."),
    archiveGroups: { 2:[1], 3:[3,4,5], 4:[6], 5:[2,7,8], 6:[9], 8:[10] },
  },
  "/shared-calendar-apps": {
    company: "TimeTree · Independent onboarding redesign exploration",
    brief: { problem: "My first-use evaluation found little product explanation before registration and weak guidance toward sharing a calendar or creating a first event.", audience: "New users beginning a shared-calendar journey.", contribution: "I evaluated the existing first-use flow, benchmarked onboarding, and designed revised flows, wireframes, mobile UI, and a prototype.", outcome: "A redesign proposal linking product explanation, sign-up, calendar purpose, sharing, and the first event.", limits: "This is an independent design exploration, not a commissioned TimeTree project. Personal evaluation is not presented as user research or a measured funnel result." },
    evidence: "The archive explicitly starts from my experience trying TimeTree. It identifies a missing early explanation, premature profile setup, and limited sharing or event-creation prompts. Existing and proposed flow diagrams provide the before-and-after evidence; no participant study is documented.",
    constraint: "Explaining the product can improve orientation but adds steps before the calendar. The proposal moves feature explanation earlier and defers nonessential setup, while contextual guidance introduces sharing and event creation when they become useful. The optimal amount of guidance still needs testing.",
    exploration: "Benchmark screens, the original and revised flows, and wireframes document the reasoning before high fidelity. The flow comparison shows a proposed change in sequence, not a measured reduction in drop-off.",
    solution: "The proposal introduces sharing, communication, and multi-calendar features before sign-up, then guides calendar purpose, invitations, and first-event creation. The original UI states, component sheet, and animated prototype remain available below.",
    impact: "The outcome is the onboarding redesign proposal. No implementation, activation-rate change, time-to-first-event improvement, or user-study result is established.",
    reflection: reflection("The proposed sequence ties onboarding to sharing and creating, rather than account setup alone.", "A personal critique can miss needs and behaviors that differ from the designer's own.", "Test an existing-flow baseline and the revised prototype with new users, including people who want a private calendar or are not ready to invite others."),
    archiveGroups: { 3:[1,2,4,5], 5:[3,6,7,8], 6:[9,10,11,12,13,14,15], 8:[16] },
  },
  "/gococo-ai": {
    company: "GoCoco AI · Personal mobile product-design concept",
    evidence: "The supplied Figma section shows a connected mobile flow from photo input and style choices to generation, result actions, product preview, and checkout. It contains interface states and prototype organization, not a research protocol, participant findings, or production analytics.",
    constraint: "The experience combines an uncertain creative result with a concrete purchase commitment. Style selection and result review need room for correction before ordering. Ads compete with generation status, while preview accuracy, image consent, print requirements, and payment behavior need validation beyond interface mockups.",
    exploration: "The source organizes screens into input, styling, generation, product application, and purchase stages. It includes alternative product-application loading states and several shipping/payment form states. Those are inspectable design variations, not a chronological experiment log or evidence that one option outperformed another.",
    solution: "The selected original screens below show how the result becomes a configured product, then an order the user can review. They preserve the design's appearance and sample content; the portfolio does not simulate a working generator, merchant, or payment service.",
    impact: "The outcome is the original mobile Figma design concept. No launch, conversion uplift, generation-quality score, print fulfillment result, or autonomous agent capability is established. A visible source inconsistency, $18.7 at confirmation versus $20.0 on the receipt, is recorded as a validation issue rather than treated as a real transaction.",
    reflection: reflection("The design separates choosing an AI result, previewing a physical product, and committing to payment.", "The happy-path frames do not establish generation recovery, print accuracy, pricing consistency, secure payment, or real-user comprehension.", "Resolve the order-total mismatch, design generation/payment failure and retry states, validate consent and image retention, and test the full creation-to-order task before measuring a live funnel."),
  },
  [KYC_CASE_PATH]: KYC_CASE_PROFILE,
};

// Original chapter titles are retained as subheadings and deep-link targets.
const assignments = {
  "Project in brief": 1, "Key design decisions": 4,
  "The design challenge": 3, "A connected discovery journey": 5,
  "Trade-offs": 4, "Trade-offs and design takeaways": 4,
  "What to validate next": 7, "A shipped product that continues to evolve": 7,
  "Delivery and design takeaways": 8, "Delivery and reflection": 8, "Delivery and system maintenance": 8,
  "Brief": 3, "User Research": 3, "Competitor Research/Comparative Research": 3,
  "Ideation": 5, "Site Maps": 5, "User Flow": 5, "Development Phase": 5,
  "Wireframing": 5, "Prototyping": 5, "Concept Testing": 5,
  "Iterating Feedback and Visual Design/High-Fidelity Phase": 5,
  "Usability Testing with SUS": 7, "Link to the related work:": 7,
  "Improve OTP Push Notification Onboarding": 2, "Background": 3, "Objective": 3,
  "Work Process": 5, "Outcomes": 7, "Learnings": 8,
};
const explorationChapters = {
  "/loyica-client-portal": ["Design the account states"],
  "/accelbyte-design-system": ["Foundations that carry through the system"],
  "/loyica-client-portal-design-system": ["Separate brand values from semantic roles"],
  "/saphyte-eafghans-design-system": ["A shared foundation with room for identity"],
  "/ags-pricing-calculator": ["An estimate that stays reachable on mobile"],
  "/ags-pricing-experience": ["Examples that open into their assumptions"],
  "/ags-billing-usage": ["Trial activation is a commitment to explain"],
  "/ags-onboarding": ["Know where you are before configuring anything"],
  "/ags-subscription-lifecycle": ["Feedback through the transition"],
  "/halodish-apps": ["A clear entry into a broad product"],
  "/e-afghan-landing-page": ["One hierarchy, across screen sizes"],
  "/e-afghan-citizen-portal": ["Break the passport application into stages"],
  "/gococo-ai": ["From photo input to an inspectable style choice", "Design the wait without pretending it is the result"],
};
const navLabels = new Set(["Fincy Apps", "Game Store & Admin Portal", "Improve OTP Push Notification", "Optimizing the Use of Allowances", "Relling Apps", "Shared Calendar Apps", "AI", "Artificial Intelligence"]);
const archiveDescriptions = {
  "/fincy-apps": ["Cover", "Product purpose and financial-learning audience", "Research-to-design approach", "Competitive research approach", "Finansialku and Money Lover comparison", "Unstructured qualitative interview approach", "Persona synthesis", "Affinity diagram, problem definition, and design mandate", "Learning scenario and initial concept sketch", "Content, consultation, discussion, and profile information architecture", "Connected low-fidelity mobile wireframes", "High-fidelity mobile design details", "Final mobile interface overview", "Original project closing"],
  "/optimizing-the-use-of-allowances": ["Cover", "Mekari Flex integration opportunity", "Integration exploration objective", "Discover, define, ideate, and design process", "Qualitative survey approach and questions", "Allowance findings and synthesized opportunities", "Problem and user-needs statements", "How-might-we questions for GoPay connection", "Proposed account-connection user flow", "Connection and balance information architecture", "Low-fidelity connection wireframes", "High-fidelity account-connection journey", "Additional interface design detail", "Additional interface design detail", "Mekari Flex and GoPay concept overview", "Original project closing"],
  "/relling-apps": ["Cover", "Rental-marketplace concept overview", "Research-to-design approach", "Rental-behavior survey charts and responses", "Owner listing, collateral, and safety survey responses", "Rental problem synthesis", "Product-information, assurance, and rental design goals", "Rental storyboard", "Discovery-to-payment rental user flow", "High-fidelity rental interface overview", "Original project closing"],
  "/shared-calendar-apps": ["Cover", "Personal evaluation of the existing TimeTree entry screen", "First-use sharing and event-creation objective", "Evaluation-to-design process", "Existing onboarding issues from personal evaluation", "How-might-we questions for understanding, sharing, and creation", "Onboarding benchmark references", "Existing and proposed onboarding flows", "Low-fidelity onboarding wireframes", "Product-explanation and welcome interface sequence", "Detailed mobile onboarding design", "Detailed mobile onboarding design", "Detailed mobile onboarding design", "Detailed mobile onboarding design", "Reusable component and state sheet", "Animated onboarding prototype", "Original project closing"],
};

function editArchivedParagraph(block, path) {
  if (block.type !== "p") return block;
  let text = block.text;
  if (path === "/game-store-admin-portal") {
    if (text.includes("more than 80% influence")) text = "Concept-test feedback asked for reviews from trusted sources and visible playtime context to support a purchase decision. The small concept test does not establish a percentage effect on buying behavior.";
    if (text.includes("carousel event is one of the most important")) text = "The prototype combines global and secondary navigation with search and a promotional carousel. Engagement and retention are design intentions, not measured outcomes of this prototype.";
    if (text.startsWith("To summarize, the System Usability Scale")) text = "The score is a single prototype evaluation. It should not be interpreted as a task-success percentage, a business result, or a change from a previous version.";
    if (text.startsWith("This statement suggests that the product")) text = "The archive interprets the storefront score positively. The sample, task context, and the unevaluated admin portal still limit that conclusion.";
    if (text.startsWith("For this project, I was provided")) text = "The supplied brief used XYZ Entertainment, a game development and publishing studio, as the project scenario. This case documents my design response, not a verified employment or production-client relationship.";
  }
  if (path === "/improve-otp-push-notification" && text.includes("Tokopedia's live products until now")) text = "I moved from the Figma illustration and low-fidelity motion into Illustrator and Adobe After Effects, exported a GIF, and applied it to the verification-flow prototype. The original archive describes implementation at that time; the current live interface has not been reverified for this case study.";
  return { ...block, text: text.replaceAll(String.fromCharCode(0x2014), ". ") };
}

function distributeOriginal(page, profile, sections, chapterIds) {
  if (profile.archiveGroups) {
    for (const [section, indices] of Object.entries(profile.archiveGroups)) {
      for (const index of indices) {
        const image = page.images[index];
        const description = archiveDescriptions[page.path]?.[index] || `Original archive panel ${index + 1}`;
        if (image) sections[Number(section) - 1].push({ ...image, type: "image", alt: image.alt || `${page.title}: ${description}`, caption: `${description}. Original archive, panel ${index + 1}; open at full size to inspect.` });
      }
    }
    return;
  }
  let current = page.narrative ? 6 : 2;
  let originalChapter = 0;
  const seenParagraphs = new Set();
  const source = [...(page.story || [])];
  while (source.at(-1)?.type === "p" && navLabels.has(source.at(-1).text?.trim())) source.pop();
  for (let i = 0; i < source.length; i += 1) {
    const block = source[i];
    if (i === 0 && block.type === "p" && block.text === page.body[0]) continue;
    if (i <= 1 && block.type === "image" && block.src === page.images[0]?.src) continue;
    if (block.type === "brief") continue;
    if (/^h[1-6]$/.test(block.type)) {
      if (block.text === "Thank you.") continue;
      const level = Number(block.type.slice(1));
      const sourceId = level <= 4 ? caseChapterId(page, block.text, originalChapter++) : undefined;
      // Existing #chapter-0 now opens the summary. Do not duplicate it on a source subheading.
      const id = sourceId === "chapter-0" ? undefined : sourceId;
      if (level <= 4) {
        current = explorationChapters[page.path]?.includes(block.text) ? 5 : assignments[block.text] || (block.text.startsWith("The challenge:") ? 3 : 6);
        if (block.text === "Project in brief") continue;
      } else if (page.path === "/improve-otp-push-notification" && block.text === "3. Define") {
        current = 4;
      } else if (page.path === "/improve-otp-push-notification" && ["4. Ideation", "5. Visualization"].includes(block.text)) {
        current = 5;
      } else if (page.path === "/improve-otp-push-notification" && block.text === "Animation on Prototype Result") {
        current = 6;
      } else if (/What (I would (measure|validate)|needs validation)|Reported registration/.test(block.text)) {
        current = 7;
      }
      sections[current - 1].push({ type: "subheading", text: block.text, id });
      if (id) chapterIds[block.text] = id;
      continue;
    }
    if (block.type === "flow") { sections[4].push(block); continue; }
    if (block.type === "p") {
      if (seenParagraphs.has(block.text)) continue;
      seenParagraphs.add(block.text);
    }
    // Closing validation lists stay in validation; companion links follow reflection.
    const destination = ["related-cases", "portal-related"].includes(block.type) ? 8 : current;
    sections[destination - 1].push(editArchivedParagraph(block, page.path));
  }
}

export function withCaseStudyStructure(original) {
  const profile = CASE_STUDY_PROFILES[original?.path];
  if (!profile || original.caseStudyStructure) return original;
  const page = withCaseNarrative(original);
  const brief = page.story?.find(block => block.type === "brief") || profile.brief;
  const chapterIds = { ...page.chapterIds };
  // Allocate source anchors before adding the new eight chapter names.
  caseChapterTitles(page.story || []).forEach((title, index) => { chapterIds[title] = caseChapterId(page, title, index); });
  const sections = Array.from({ length: 8 }, () => []);
  const optionalContext = [["Timeline", profile.timeline], ["Team", profile.team]]
    .filter(([, value]) => typeof value === "string" && value.trim().length > 0);
  sections[0].push({ type: "case-summary", problem: brief.problem, contribution: brief.contribution, outcome: brief.outcome });
  sections[1].push({ type: "case-facts", label: "Project context and personal ownership", items: [
    ["Company / product context", profile.company], ["Users", brief.audience],
    ...optionalContext,
    ["My role & scope", brief.contribution], ["Evidence available", page.systemCase ? "Original library exports and public documentation. The source Figma library remains private." : "Original project narrative and design artifacts retained in this case study."],
  ] });
  if (profile.businessContext) sections[0].push(p(profile.businessContext));
  if (profile.ownership) sections[1].push(p(profile.ownership));
  sections[2].push(p(profile.evidence));
  sections[3].push(p(profile.constraint));
  sections[4].push(p(profile.exploration));
  sections[5].push(p(profile.solution));
  sections[6].push(p(profile.impact), { type: "case-impact", path: page.path }, { type: "case-evidence-note", scope: brief.limits || noAnalytics, limitation: profile.reflection.limitation });
  sections[7].push({ type: "case-facts", label: "Design reflection and next steps", items: [
    ["What worked in the design", profile.reflection.strength],
    ["What I would change next", profile.reflection.next],
  ], stacked: true });
  distributeOriginal(page, profile, sections, chapterIds);
  CASE_STUDY_CHAPTERS.forEach((title, index) => { chapterIds[title] = sectionIds[index]; });
  return {
    ...page, narrative: true, designCase: true, caseStudyStructure: true, chapterIds,
    metadata: page.metadata || { role: page.path === "/improve-otp-push-notification" ? "UI Designer · Insan Nurjaman" : "Product Designer · Insan Nurjaman", practice: page.path === "/improve-otp-push-notification" ? "Research · UI · Motion · Prototyping" : "UX · UI · Interaction design", label: "Evidence", value: "Original project archive" },
    story: readingOrder.flatMap((sourceIndex, index) => [{ type: "h2", text: CASE_STUDY_CHAPTERS[index] }, ...sections[sourceIndex]]),
  };
}

export const STRUCTURED_CASE_PATHS = Object.freeze(Object.keys(CASE_PREVIEWS));
