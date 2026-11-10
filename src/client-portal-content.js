import { KYC_CASE_PATH } from "./kyc-content.js";

// Owner-confirmed redesign of both the portal and its design system.
// Source amounts, trading figures, rules, identities and dates are sample content.
export const CLIENT_PORTAL_PATH = "/loyica-client-portal";
export const CLIENT_SYSTEM_PATH = "/loyica-client-portal-design-system";
export const CLIENT_PORTAL_DEMO = "https://dense-cycle-95519651.figma.site";
export const CLIENT_PORTAL_FILE = "https://www.figma.com/design/RQCZToCKY5IWVAVG47KBYS/Client-Portal";
export const CLIENT_SYSTEM_FILE = "/design-systems/client-portal";
export const clientPortalSource = (id, system = false) => system ? CLIENT_SYSTEM_FILE : `${CLIENT_PORTAL_FILE}?node-id=${id.replace(":", "-")}`;
const h = text => ({ type: "h2", text });
const p = text => ({ type: "p", text });
const list = items => ({ type: "list", items });
const pair = (images, caption) => ({ type: "image-group", images, caption });
const productSpec = {
  dashboard: [1280,1699,"336:4088"], "dashboard-empty": [1280,1221,"357:12118"], "dashboard-cancelled": [1280,1129,"358:13449"],
  accounts: [1280,1028,"375:13005"], "accounts-empty": [1280,1028,"376:15241"], analysis: [1280,1938,"656:4569"],
  "challenge-comparison": [1280,951,"649:4453"], "challenge-payment": [1280,951,"649:4119"],
  "payout-overview": [1280,1016,"695:144800"], "payout-details": [1280,1016,"695:145254"], "payout-eligibility": [1280,1618,"696:40841"],
  "kyc-start": [1147,2400,"267:50013"], "kyc-review": [1147,2254,"267:49363"],
};
const systemSpec = { "volt-dark": [855,1349,"62:10184"], "volt-light": [855,1349,"62:10249"], "instant-dark": [855,1349,"62:10314"], "instant-light": [855,1349,"62:10323"], inputs: [2240,257,"156:2401"], "stat-cards": [457,174,"79:475"] };
const manifest = (spec, dir, system) => Object.fromEntries(Object.entries(spec).map(([name,[width,height,nodeId]]) => [name,{src:`/media/${dir}/${name}.png`,width,height,nodeId,sourceUrl:clientPortalSource(nodeId,system)}]));
export const CLIENT_PORTAL_SCREENS = manifest(productSpec,"client-portal",false);
export const CLIENT_SYSTEM_SCREENS = manifest(systemSpec,"client-portal-system",true);
const screen = (name,alt,caption,system=false) => ({type:"image",...(system?CLIENT_SYSTEM_SCREENS:CLIENT_PORTAL_SCREENS)[name],alt,caption});
const variant = (name,label,alt,system=false) => ({key:name,label,...(system?CLIENT_SYSTEM_SCREENS:CLIENT_PORTAL_SCREENS)[name],alt});
const related = system => ({type:"portal-related",items:[{path:system?CLIENT_PORTAL_PATH:CLIENT_SYSTEM_PATH,title:system?"Client Portal | Saphyte":"Client Portal Design System | Saphyte",summary:system?"Account context, performance, verification, and payout workflows.":"The reusable foundations and multi-brand component model behind the experience."},...(!system?[{path:KYC_CASE_PATH,title:"KYC Verification | Saphyte",summary:"A separate published design challenge covering client document recovery and administrator review."}]:[])]});

export const CLIENT_SYSTEM_CASE = {
  path:CLIENT_SYSTEM_PATH,title:"Client Portal | Saphyte",summary:"A redesigned system with primitive and semantic variables, branded themes, and reusable portal patterns.",
  cover:CLIENT_SYSTEM_SCREENS["stat-cards"],coverAlt:"Original Client Portal statistical-card components with configurable content and detail regions",
  deck:"A shared system for branded client portals.",role:"Design system redesign",foundation:"Primitive + semantic variables",
  chapters:[["Brand & theme architecture","One component family across InstantFunding and VoltFunded.","themes"],["Components in context","Inputs, navigation, state cards, and product reuse.","components"]],
};

const limits = "The evidence consists of original Figma designs, library instances, and an interactive Figma Sites demo. Balances, fees, thresholds, identities, and processing-time or security copy are sample design content, not current financial terms. The record does not establish a production launch, live trading connectivity, integrated payment or verification providers, measured impact, or a tested iteration timeline.";
export const clientPortalPages = {
  [CLIENT_PORTAL_PATH]: {
    path:CLIENT_PORTAL_PATH,title:"Client Portal: clarity across trading workflows",category:"Saphyte · Financial UX",
    designCase:true,narrative:true,portalCase:true,
    thumbnail:CLIENT_PORTAL_SCREENS.accounts.src,
    sourceUrl:clientPortalSource("141:1587"),sourceLabel:"Explore the source designs",
    appLinks:[{label:"Explore interactive demo",href:CLIENT_PORTAL_DEMO}],
    metadata:{role:"Product Designer · Saphyte",practice:"Workflow redesign · Financial UX · Design systems",label:"Evidence",value:"Figma designs + interactive demo"},
    body:["Redesigning the Client Portal to connect trading-account context, performance, challenge selection, verification, and payout readiness in one coherent experience.","Saphyte Client Portal. My redesign covers the product experience and its supporting design system, including accounts, dashboard, Analysis Hub, challenges, payouts, KYC, and reusable branded patterns."],
    images:[screen("accounts","Original Client Portal account overview showing funded, challenge, completed, and breached account states","Account context is the starting point for the experience.")],
    chapterIds:{"Project in brief":"chapter-0","Key design decisions":"key-design-decisions","Keep account context visible":"account-context","Separate a quick check from deeper analysis":"performance","Design the account states":"account-states","Explain a challenge before checkout":"challenges","Make verification progress actionable":"verification","Make payout readiness inspectable":"payouts","Connect the experience through a shared system":"shared-system","Delivery and reflection":"delivery"},
    story:[
      h("Project in brief"),
      {type:"brief",problem:"Users need to understand which account they are viewing, how it is performing, what its restrictions mean, and what is required before taking the next action.",audience:"People managing funded and challenge trading accounts through a branded client portal.",contribution:"I redesigned the Client Portal experience and its supporting design system at Saphyte, including account, performance, challenge, verification, and payout workflows.",outcome:"A connected set of original interface designs, a reusable multi-brand design-system library, and a publicly accessible interactive Figma Sites demo.",limits},
      h("Key design decisions"),
      {type:"decision-highlights",items:[
        {title:"Keep the selected account in view",rationale:"A persistent account selector and local account identity connect balances, performance, and actions to their scope. The account overview provides a separate place to compare account states.",chapter:"Keep account context visible",link:"Inspect the account hierarchy"},
        {title:"Explain readiness before the action",rationale:"Verification and payout designs pair status with required steps, submitted evidence, eligibility context, and a next action. A balance alone is not presented as permission to withdraw.",chapter:"Make payout readiness inspectable",link:"Explore payout context"},
        {title:"Treat empty and cancelled states as product states",rationale:"A dashboard without trading data and a cancelled account need distinct explanations. Reusing the surrounding structure helps preserve orientation when the normal populated experience is unavailable.",chapter:"Design the account states",link:"Compare the source states"},
      ]},
      h("Keep account context visible"),
      p("I organized the portal around Overview, Management, Finance, Compliance, and Resources. The selected trading account stays in the top navigation, while the account overview shows funded, challenge-phase, completed, and breached examples together."),
      p("The distinction is between looking across accounts and working within one. Account cards expose identity, platform, state, balance, equity, and profit context. The persistent selector then carries the selected account into performance and action-oriented destinations."),
      pair([screen("accounts","Client Portal account overview with status filters and account cards","Comparing accounts and their states"),screen("accounts-empty","Client Portal account overview before any funded or challenge accounts exist","A starting point when no accounts exist")],"Account overview and empty-state designs."),
      h("Separate a quick check from deeper analysis"),
      p("The Dashboard gives the user an overview: balance and daily results, performance charts, risk limits, open positions, and recent trades. Analysis Hub provides a separate reading depth for instrument breakdowns, drawdown, consistency, calendar patterns, and trade statistics."),
      p("This separation distinguishes the frequent question ‘what is my current position?’ from investigation into a pattern. The design intent is to make both reading speeds available without turning every dashboard visit into an analytics task."),
      screen("analysis","Original Analysis Hub with performance, instrument, weekly-result, drawdown, profile, and calendar views","A deeper analytical destination alongside the overview."),
      h("Design the account states"),
      p("I designed the dashboard beyond the populated example. An empty state explains where future performance and trades will appear. A cancelled state names the account condition and changes the surrounding guidance, rather than silently removing information."),
      {type:"system-preview",legend:"Compare the original dashboard states",variants:[variant("dashboard","Populated","Original populated Client Portal dashboard"),variant("dashboard-empty","No trading data","Original dashboard before trading data exists"),variant("dashboard-cancelled","Cancelled account","Original dashboard explaining a cancelled trading account")],caption:"Original Figma state designs. The surrounding account context remains visible as the content changes."},
      p("The demo lets a reviewer move between the account states and inspect how the surrounding context and available actions change."),
      h("Explain a challenge before checkout"),
      p("Challenge selection connects the evaluation model, account size, platform, and its visible conditions before a payment step. The comparison design puts alternative models in the same view, giving the user a place to inspect differences before choosing."),
      pair([screen("challenge-comparison","Original comparison of trading challenge models before checkout","Model comparison"),screen("challenge-payment","Original challenge checkout with payment choices and agreement context","The subsequent payment step")],"Challenge selection and checkout, with illustrative prices and conditions."),
      p("The design trade-off is density: the conditions needed to understand a challenge are numerous. Grouping them into a comparable structure preserves the detail while making the choice a visible step, rather than burying it inside checkout."),
      h("Make verification progress actionable"),
      p("The verification designs distinguish required identity material from additional document groups. Requirements, accepted formats, uploaded files, and review status sit within the document sections, while the overall progression remains visible above them."),
      pair([screen("kyc-start","Original KYC starting state with identity upload, optional document groups, and verification alternatives","Before document submission"),screen("kyc-review","Original KYC review state showing submitted files and remaining document groups","Submission and review context")],"KYC document preparation and review states."),
      p("I included an automated verification route alongside manual upload so that the interface could accommodate both entry paths."),
      p("The source iterations group requirements differently. Before implementation, profile notices, navigation counts, document sections, and payout eligibility need one agreed requirement model."),
      h("Make payout readiness inspectable"),
      p("The Payouts overview separates historical status from the request itself. Summary values and a transaction table make approved, pending, processing, and rejected examples inspectable, while local tabs expose withdrawal and saved-method destinations."),
      screen("payout-overview","Original payout overview with summary figures, transaction statuses, filters, and withdrawal destinations","Payout history and request actions share a navigation family."),
      p("The withdrawal direction separates account selection, withdrawal details, and review. Available amount, minimum and maximum context, and method-dependent information remain beside the form in an account summary."),
      pair([screen("payout-details","Original withdrawal-details step with amount, method choices, and account summary","Amount and payout-method context"),screen("payout-eligibility","Original payout exploration with an explicit eligibility checklist and account summary","An eligibility-focused design direction")],"Two payout directions expose eligibility and account context before commitment. Thresholds are illustrative."),
      p("The useful design question is not only whether a withdrawal control is enabled. It is whether a user can explain what is available, which account it belongs to, and what still needs to happen. Eligibility information and a staged request address those questions at different depths."),
      h("Connect the experience through a shared system"),
      p("I redesigned the supporting library as well as the product screens. Primitive and semantic variables carry branded themes, while reusable navigation, inputs, buttons, state cards, and progress patterns provide a shared vocabulary across the portal."),
      p("The dashboard uses remote library instances for navigation and supporting elements. The companion system case study explains how those foundations connect to complete portal workflows."),
      related(false),
      h("Delivery and reflection"),
      p("The documented delivery is a connected product redesign, a shared library, and an interactive demo. The source covers populated and exception states across account management, performance, selection, verification, and finance."),
      list(["Account scope should remain understandable across destinations.","Readiness states need an explanation and a next action.","Overview and investigation benefit from different information depths.","A multi-brand system needs semantic roles as well as reusable visual parts."]),
      {type:"h5",text:"What I would validate next"},
      list(["Whether participants can identify the active account before explaining a balance or action.","Comprehension of challenge differences before checkout.","Understanding of required documents, submitted evidence, and review status.","Whether users can explain payout readiness, restrictions, and the review step.","Accessibility, responsive behavior, and consistency between source designs and implementation."]),
    ],
  },
};

export const clientPortalSystemPages = {
  [CLIENT_SYSTEM_PATH]: {
    path:CLIENT_SYSTEM_PATH,title:"A shared design system for branded client portals",category:"Design systems · Saphyte",
    designCase:true,narrative:true,systemCase:true,portalCase:true,
    thumbnail:CLIENT_SYSTEM_SCREENS["stat-cards"].src,
    metadata:{role:"Product & system redesign · Saphyte",practice:"Semantic tokens · Themes · Component patterns",label:"Structure",value:"Primitive + semantic variables"},
    body:["Redesigning a shared foundation for branded Client Portal experiences, with semantic themes, reusable interaction states, and product patterns.","Client Portal Design System | Saphyte. Redesigned by Insan Nurjaman. InstantFunding and VoltFunded light/dark modes, primitive and semantic variables, buttons, inputs, navigation, state cards, and steppers."],
    images:[screen("stat-cards","Original Client Portal state-card components with configurable content, indicators, and detail regions","Configurable state cards from the source library.",true)],
    chapterIds:{"Project in brief":"chapter-0","Key design decisions":"key-design-decisions","Separate brand values from semantic roles":"themes","Component behavior is part of the model":"components","Patterns connect the system to the portal":"patterns","Delivery and system maintenance":"delivery"},
    story:[
      h("Project in brief"),
      {type:"brief",problem:"The portal needs a consistent interaction model while supporting different brand identities, color themes, content, and account states.",audience:"Saphyte designers and engineers working on branded client portals and their reusable UI patterns.",contribution:"I redesigned the Client Portal design-system library alongside the product experience, including foundations, branded themes, components, and portal patterns.",outcome:"A Figma library with primitive and semantic collections, brand/theme modes, reusable components, and shared navigation and state-card patterns.",limits:"This case documents the design-system redesign. The palette includes Tailwind-derived color foundations. Library inventory and source examples do not establish adoption, production-code parity, or measured handoff savings."},
      h("Key design decisions"),
      {type:"decision-highlights",items:[
        {title:"Express brand through semantic modes",rationale:"Shared roles resolve to different primitive values across brand and color-theme combinations, allowing the component family to retain its purpose as its appearance changes.",chapter:"Separate brand values from semantic roles",link:"Compare the original themes"},
        {title:"Expose states and optional content",rationale:"Component properties cover sizes, interaction states, icons, labels, helpers, and detail regions. Reuse therefore includes behavior and content configuration.",chapter:"Component behavior is part of the model",link:"Inspect the component model"},
        {title:"Build patterns for complete tasks",rationale:"Navigation, top-level state cards, and steppers connect smaller components to account context and multi-step workflows.",chapter:"Patterns connect the system to the portal",link:"See the product connection"},
      ]},
      h("Separate brand values from semantic roles"),
      p("I organized the foundation into Primitive and Semantic collections. The semantic collection includes InstantFunding and VoltFunded in both dark and light modes, alongside an additional product mode. Components can refer to a role instead of carrying an individual brand value directly."),
      p("The primary Button binds its fill to background/bg-brand-soft and its label to text/text-brand-primary. Each role resolves to the relevant brand primitive, allowing the same component to adapt across modes."),
      {type:"portal-token-map"},
      {type:"system-preview",legend:"Compare original brand and theme examples",variants:[variant("volt-dark","VoltFunded · Dark","Original VoltFunded dark button-size and interaction-state examples",true),variant("volt-light","VoltFunded · Light","Original VoltFunded light button-size and interaction-state examples",true),variant("instant-dark","InstantFunding · Dark","Original InstantFunding dark button-size and interaction-state examples",true),variant("instant-light","InstantFunding · Light","Original InstantFunding light button-size and interaction-state examples",true)],caption:"Unmodified source exports of the same button family across four brand/theme modes."},
      p("I used Tailwind palette foundations and Inter typography styles as the basis for the redesigned library."),
      h("Component behavior is part of the model"),
      p("The Button model combines Primary, Secondary, and Text variants with Default, Hover, Disabled, and OnClicked states and Small, Medium, and Large sizes. Text, icon presence, and icon choice are configurable properties."),
      p("The Input family carries labels, helper text, left/right icons, character-count content, and optional lower sections alongside its size and state. The documented input states include Default, Hover, Active, Filled, and Disable."),
      screen("inputs","Original Client Portal Input component family with size and interaction-state variants","The source input family exposes content options and interaction states.",true),
      p("A reusable pattern still needs guidance about when to use it. The current library has several empty component descriptions; usage guidance and accessibility behavior are continuing documentation work, rather than something inferred from the existence of variants."),
      h("Patterns connect the system to the portal"),
      p("The Sidebar Nav composes the portal’s grouped destinations and supports logo swapping. Its navigation items expose default, hover, and selected states together with labels, icons, and optional counters."),
      p("State cards provide configurable titles, values, indicators, increment labels, and detail regions. The horizontal stepper composes steps with Default, Current, and Finished states, connecting its small parts to the staged tasks found in the product designs."),
      p("The Client Portal dashboard contains remote library instances, including Sidebar Nav and its supporting elements. This source evidence connects the system to product composition; the product case study shows the surrounding account, performance, verification, and payout workflows."),
      related(true),
      h("Delivery and system maintenance"),
      p("The system redesign establishes shared foundations and patterns for branded portal work. The most consequential relationship is between semantic roles, configurable components, and the contexts in which they are used."),
      list(["Brand and color theme are explicit modes, rather than separate component inventories.","Reusable components expose the states and content options needed by the portal.","Larger patterns connect component choices to account context and workflow progression.","Library maintenance should include an explicit review of implementation parity and adoption."]),
      {type:"h5",text:"What I would validate next"},
      list(["Contrast and focus behavior across every supported theme.","Component naming, descriptions, and valid property combinations.","Keyboard and assistive-technology behavior in the implementation.","Instance use, detachment, and divergence across portal designs.","The effort required to add a brand or evolve a shared pattern."]),
    ],
  },
};
