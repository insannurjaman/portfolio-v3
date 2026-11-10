import { CLIENT_SYSTEM_CASE, clientPortalSystemPages } from "./client-portal-content.js";
import { CORE_SYSTEM_CASE, coreSystemPages } from "./saphyte-eafghans-content.js";

// Owner-confirmed authorship. Ant Design is credited as the underlying system.
// Source artifacts establish the delivered design work; impact is not quantified.
export const DESIGN_SYSTEM_FILE = "/design-systems/accelbyte";
export const designSystemSource = () => DESIGN_SYSTEM_FILE;
export const DESIGN_SYSTEM_PATH = "/accelbyte-design-system";
const h = text => ({ type: "h2", text });
const p = text => ({ type: "p", text });
const list = items => ({ type: "list", items });
export const SYSTEM_SCREENS = {
  "header-dark": { width: 1056, height: 698, nodeId: "26046:107803" },
  "header-light": { width: 1056, height: 698, nodeId: "26046:107802" },
  "sidebar-foundations": { width: 304, height: 1000, nodeId: "26180:113632" },
  "sidebar-shared": { width: 304, height: 1000, nodeId: "26181:121194" },
  "sidebar-private": { width: 304, height: 1000, nodeId: "26181:125619" },
  "table-default": { width: 896, height: 538, nodeId: "26108:245802" },
  "table-empty": { width: 896, height: 538, nodeId: "26108:245803" },
  "table-no-results": { width: 896, height: 538, nodeId: "26108:245804" },
  "date-picker": { width: 500, height: 436, nodeId: "26147:22896" },
  "design-checklist": { width: 1152, height: 1793, nodeId: "26187:13220" },
};
for (const [name, screen] of Object.entries(SYSTEM_SCREENS)) screen.src = `/media/accelbyte-design-system/${name}.png`;
const image = (name, alt, caption) => ({ type: "image", ...SYSTEM_SCREENS[name], alt, caption });

export const DESIGN_SYSTEM_CASES = [{
  path: DESIGN_SYSTEM_PATH,
  title: "AccelByte Design System",
  summary: "Tokenized foundations, adaptable admin patterns, and reusable documentation built on Ant Design.",
  cover: SYSTEM_SCREENS["header-dark"],
  coverAlt: "AccelByte’s original dark page-header components at three responsive widths",
  deck: "A system for complex admin workflows.",
  role: "Design system creator", foundation: "Ant Design",
  chapters: [["Foundations & themes", "Variable collections, aliases, and density modes.", "foundations"], ["Product patterns", "Cloud navigation, responsive pages, and data states.", "navigation"], ["Documentation & handoff", "Checklists, design status, and reusable delivery templates.", "documentation"]],
}, CLIENT_SYSTEM_CASE, CORE_SYSTEM_CASE];

export const designSystemsSearchPage = {
  path: "/design-systems", title: "Design Systems | Insan Nurjaman",
  body: ["Design systems created and redesigned by Insan Nurjaman. antiflex/ui is an original independent design system with shared tokens, 50 documented components, public documentation, and a connected SaaS workspace demonstration. AccelByte foundations, tokens, variables, components, responsive patterns, and design documentation. Saphyte Client Portal multi-brand themes, semantic tokens, components, and workflow patterns. Saphyte and E-Afghans shared Chakra UI-based foundations, brand tokens, typography, component states, and usage guidance."],
  images: [],
};

export const designSystemPages = {
  ...clientPortalSystemPages,
  ...coreSystemPages,
  [DESIGN_SYSTEM_PATH]: {
    path: DESIGN_SYSTEM_PATH,
    title: "Building AccelByte’s design system for complex admin workflows",
    category: "Design systems · Developer tools",
    designCase: true, narrative: true, systemCase: true,
    thumbnail: SYSTEM_SCREENS["header-dark"].src,
    metadata: { role: "Design system creator · Insan Nurjaman", practice: "Foundations · Components · Documentation", label: "Foundation", value: "Ant Design" },
    body: ["Creating a shared design language for AccelByte’s admin workflows, from tokenized foundations to cloud-specific navigation, reusable page structures, and design documentation.", "AccelByte Design System. Light and dark themes, Default and Compact density, responsive page headers, cloud sidebars, data tables, search, date pickers, and design checklists."],
    images: [image("header-dark", "AccelByte page-header designs at desktop, tablet, and mobile widths in the dark theme", "Original responsive page-header designs from the library.")],
    chapterIds: {
      "Project in brief": "chapter-0", "Key design decisions": "key-design-decisions",
      "Foundations that carry through the system": "foundations",
      "Navigation that understands product context": "navigation",
      "A page structure that adapts": "page-structure",
      "Data patterns beyond the populated table": "data-patterns",
      "Documentation is part of the system": "documentation",
      "Delivery and reflection": "delivery",
    },
    story: [
      h("Project in brief"),
      { type: "brief",
        problem: "The admin console needs to accommodate different cloud tiers, service combinations, namespaces, and data states while remaining a coherent product.",
        audience: "Designers and engineers working on AccelByte’s console, and the game teams who navigate and manage its services.",
        contribution: "I created the AccelByte library’s foundations, custom components, responsive patterns, and documentation utilities, using Ant Design as the underlying framework.",
        outcome: "A tokenized Figma library with theme and density modes, product-specific component families, reusable page structures, and design-delivery templates.",
        limits: "The case study documents my design deliverables. Adoption numbers, shipped implementation, and measured efficiency gains have not been established here. Ant Design and the Ant Design System for Figma are credited as the foundation.",
      },
      h("Key design decisions"),
      { type: "decision-highlights", items: [
        { title: "Connect the foundation to the component", rationale: "Primitive colors feed semantic roles and component tokens through aliases. A theme change can therefore reach the controls that use those values.", chapter: "Foundations that carry through the system", link: "Trace a token relationship" },
        { title: "Model product context explicitly", rationale: "Cloud tier, namespace, service combination, and collapsed state are component properties. The navigation family makes those differences inspectable.", chapter: "Navigation that understands product context", link: "Compare the navigation patterns" },
        { title: "Make exceptions reusable", rationale: "Populated, empty, and no-results table states share one family. Documentation checklists also bring responsive, feedback, and error scenarios into the design process.", chapter: "Data patterns beyond the populated table", link: "Explore the table states" },
      ] },
      h("Foundations that carry through the system"),
      p("I organized the foundation into color, dimension, typography, and component collections. The structure carries Ant Design’s token model into the AccelByte library, with brand values and product-specific compositions layered on top."),
      p("Light and Dark are color modes. Default and Compact are separate dimension and typography modes. Keeping these decisions separate allows color theme and density to be considered independently, instead of creating a duplicate library for every combination."),
      { type: "system-tokens" },
      p("AccelBlue/6 supplies the primary brand role, which supplies the Button component’s primary color. This alias chain connects the foundation to the component through an explicit semantic role."),
      { type: "flow", label: "Primary color alias chain in the original Figma library", items: ["Colors/Base/AccelBlue/6", "Colors/Brand/Primary/colorPrimary", "Components/Button/Global/colorPrimary"] },
      p("Default and Compact also require a deliberate typography decision. The source currently uses Roboto in Default and SF Pro Text in Compact. A handoff should preserve that choice explicitly or reconcile it with the intended platform stack; density is more than reducing every number."),
      h("Navigation that understands product context"),
      p("The sidebar family models Foundation, Shared Cloud, and Private Cloud separately. Within those families, properties cover the studio or publisher context, game namespaces, AGS/AMS availability, submenus, and expanded or collapsed presentation."),
      { type: "image-group", images: [
        image("sidebar-foundations", "Foundation-tier sidebar with namespace context and service navigation", "Foundation"),
        image("sidebar-shared", "Shared Cloud sidebar for a studio with AGS and AMS", "Shared Cloud"),
        image("sidebar-private", "Private Cloud publisher sidebar with its service groups", "Private Cloud"),
      ], caption: "Original sidebar variants. Their differences are expressed through the component model." },
      p("The reusable pieces include menu items, namespace selectors, status tags, tooltips, and submenu groups. Default, hover, and selected states are defined at that smaller level, then composed into the tier-specific sidebars. This gives the library a vocabulary for context, rather than a collection of unrelated navigation screens."),
      list(["Namespace selection distinguishes where an action takes place.", "Service combinations determine which destinations appear.", "Collapsed variants preserve an alternate navigation presentation.", "Tags distinguish New, Beta, Early Access, and Coming Soon states."]),
      h("A page structure that adapts"),
      p("The Page Header brings breadcrumbs, title, status, identifiers, account context, metadata, overview controls, and tabs into one reusable composition. Boolean properties expose optional content, while Desktop, Tablet, and Mobile variants handle the available width."),
      { type: "system-preview", legend: "Compare the source themes", variants: [
        { key: "dark", label: "Dark", ...SYSTEM_SCREENS["header-dark"], alt: "Original dark AccelByte page headers at desktop, tablet, and mobile widths" },
        { key: "light", label: "Light", ...SYSTEM_SCREENS["header-light"], alt: "Original light AccelByte page headers at desktop, tablet, and mobile widths" },
      ], caption: "Switch between the original Figma exports. Each image contains the three responsive variants." },
      p("On narrower layouts, context moves into additional rows and breadcrumbs contract. The library therefore specifies a change in information arrangement, not simply a smaller desktop header. A related Sections family supports Details or Data Table content, with optional tabs and alerts."),
      h("Data patterns beyond the populated table"),
      p("The custom Data Table combines search, filters, column controls, bulk actions, the table itself, and pagination. Its state model includes Default, Empty, and No Search Results, so teams can inspect how the same surface responds to different data conditions."),
      { type: "system-preview", legend: "Explore the source table states", variants: [
        { key: "default", label: "Populated", ...SYSTEM_SCREENS["table-default"], alt: "Original dark data table with filters, column controls, selectable rows, and pagination" },
        { key: "empty", label: "No data", ...SYSTEM_SCREENS["table-empty"], alt: "Original dark data table in the Empty state" },
        { key: "no-results", label: "No search results", ...SYSTEM_SCREENS["table-no-results"], alt: "Original dark data table with No Search Results" },
      ], caption: "Populated, empty, and no-results variants from the same table family." },
      p("Custom Search adds search and date modes with default and active states. The custom Date Picker composes preset ranges and a calendar, with default, hover, and selected preset cells. These patterns belong to the same task family: narrowing a large body of information into a usable view."),
      image("date-picker", "Original AccelByte custom date picker with preset ranges and a calendar", "The custom date-picker composition includes reusable range presets."),
      p("Empty-state illustrations cover situations including no access, network problems, pending transactions, server errors, and search without results. The illustrations provide a shared visual vocabulary; the surrounding copy and recovery action still need to explain the specific situation."),
      h("Documentation is part of the system"),
      p("I created documentation utilities alongside the product components: page and section titles, design links, ticket notes, status variants, item explanations, and a design checklist. These artifacts give design work a repeatable structure for review and handoff."),
      image("design-checklist", "Original AccelByte design checklist covering positive and negative cases, feedback, error handling, mobile views, content, tours, and optimized assets", "The source checklist makes expected design coverage visible before handoff."),
      p("The checklist asks for positive and negative cases, popups, success and error feedback, empty states, permission and network failures, mobile views, reviewed copy, and optimized assets. Those are expectations encoded in the design process, not evidence that every project completed each check."),
      p("The ticket-note template provides a place for change descriptions and merge status. Design-link templates distinguish master work, dependencies, and archived designs. Together, they make it easier to explain what a viewer is looking at and where the current work lives."),
      h("Delivery and reflection"),
      p("The delivered design work connects foundations, product-specific component families, responsive compositions, and documentation within one library. My central design decision was to make context and state reusable alongside appearance."),
      list(["A useful admin-system component needs a model for context, optional content, and exceptions.", "Color theme and interface density should be explicit, independently inspectable choices.", "A library needs documentation and handoff material alongside its visual parts.", "A component’s value becomes clearer when its use is connected to a complete product workflow."]),
      p("Maintaining this system means keeping component descriptions useful, checking property combinations, and reviewing how the library behaves in real product files. The visual library is a foundation for that continuing work."),
      { type: "h5", text: "What I would measure next" },
      list(["Use and detachment of the custom components across active product files.", "Design and engineering effort required to add a new page or state.", "Consistency of tokens and component behavior between Figma and implementation.", "Accessibility and task completion across desktop, mobile, and dense data views."]),
      { type: "related-cases", title: "Explore my AccelByte product-design work" },
    ],
  },
};
