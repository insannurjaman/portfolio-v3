import { ANTIFLEX_UI } from "./antiflex-project.js";

export const AI_INTRO = [
  "Some ideas deserve more than a polished mockup. I want to understand how they behave when the buttons work, the content changes, and someone actually tries to use them. Building gives me a way to explore those questions beyond the design file.",
  "I use Codex to help turn my design direction into working products. My part is deciding what is worth building, shaping the experience, and questioning the result. The projects below show that relationship in practice: a design system, a review tool, and a small plugin that takes repetitive cleanup out of a designer’s day.",
];

export const AI_PROJECTS = [
  {
    id: "antiflex", coverPath: "/work/design-systems#antiflex-ui-highlight", title: "antiflex/ui", artifact: "image",
    description: "Independent design system connecting shared tokens, components, documentation and a connected workspace demo.",
    role: "Created the system and design direction.",
    assistance: "Codex helped translate my design direction into the working implementation.",
    story: [
      { title: "More than a component gallery", body: "A design system becomes useful when people can build with it. I created antiflex/ui to connect the foundations with their application: shared tokens, reusable components, documentation, and a connected workspace that brings the pieces together. The goal is to make the relationship between design decisions and working interfaces easier to see." },
      { title: "Design decisions stay connected", body: "My role goes beyond deciding how a button looks. I define the visual language and how the system should hold together across components and screens. The documentation and workspace offer two ways to inspect that thinking: one explains the parts, while the other shows them working as a whole." },
      { title: "Using Codex to make it tangible", body: "Codex assists with implementation, while I direct the product and design. That distinction matters to me. Generating code is not the end of the work; the result still needs to be considered as an interface. You can explore the public documentation and workspace below rather than relying only on a presentation of the system." },
    ],
    image: "/media/antiflex-ui/home.jpg", imageAlt: "antiflex/ui homepage showing the less flex. More function. headline and geometric identity",
    caption: "antiflex/ui homepage.",
    actions: [
      { label: "Public docs", href: ANTIFLEX_UI.documentation, external: true },
      { label: "Workspace demo", href: ANTIFLEX_UI.workspace, external: true },
    ],
  },
  {
    id: "uiqa", coverPath: "/uiqa", title: "UIQA", artifact: "command",
    description: "Open-source CLI and GitHub Action for repeatable UX risks in frontend code. Deterministic static checks, not an AI-powered evaluator or a replacement for human review.",
    role: "Defined the UX checks and how findings are reviewed.",
    assistance: "Codex helped implement the CLI and GitHub Action around my UX-check direction.",
    story: [
      { title: "A useful check before the review", body: "Design quality is not only what appears in a screenshot. Small implementation details can create friction that is easy to miss when a team is moving quickly. UIQA focuses on a narrower, repeatable part of that problem: identifying UX risks in frontend code so there is something concrete to investigate before a change is merged." },
      { title: "A tool with an honest boundary", body: "I define the checks and how the findings should support a review. UIQA uses deterministic static analysis. It does not ask an AI model to judge an interface, render a browser, or replace a designer’s judgment. Keeping that boundary clear makes it easier to understand what a finding means and what still needs human attention." },
      { title: "From a design concern to a working tool", body: "I use Codex to help implement the CLI and GitHub Action, turning the review idea into something that can fit an existing development workflow. The interesting part for me is that connection between design and delivery: not another abstract quality score, but a tool whose checks and source can be inspected." },
    ],
    caption: "Installation example. Static checks, with no AI or browser rendering.",
    actions: [
      { label: "Inspect tool", href: "/uiqa" },
      { label: "View source", href: "https://github.com/insannurjaman/uiqa", external: true },
    ],
  },
  {
    id: "pixel", coverPath: "/pixel-round", title: "Pixel Round", artifact: "rounding",
    description: "Figma plugin that rounds decimal values across layers, frames, text and components.",
    role: "Defined the product and interaction direction.",
    assistance: "Codex helped implement the Figma plugin from my product and interaction direction.",
    story: [
      { title: "Small friction is still friction", body: "A decimal in a layer’s position or size is a small detail. Repeated across a design file, that kind of cleanup becomes a task of its own. Pixel Round addresses that specific problem: rounding decimal values across layers, frames, text, and components without turning a simple job into a larger workflow." },
      { title: "Keep the tool as focused as the problem", body: "I wanted the product to be understandable through the task it performs. The design challenge is not adding more features; it is keeping the interaction clear and making the change easy to understand. The before-and-after example shows the principle with illustrative values, while the case study explains the plugin in more detail." },
      { title: "Making a small idea usable", body: "Codex assists with the plugin implementation, while I shape the product and interaction direction. For me, this is a practical use of AI-assisted building: making a focused idea tangible, so its value can be judged by what it helps someone do rather than by how elaborate the concept sounds." },
    ],
    caption: "Illustrative layer values, before and after rounding.",
    actions: [{ label: "Inspect case study", href: "/pixel-round" }],
  },
];

export const ROUNDING_EXAMPLE = [
  { label: "X", before: "24.38", after: "24" },
  { label: "Y", before: "16.72", after: "17" },
  { label: "Width", before: "320.46", after: "320" },
  { label: "Height", before: "48.21", after: "48" },
];

export const AI_RESPONSIBILITIES = [
  { title: "Frame the problem", body: "Start with the friction, not the generated interface. I decide who the product is for, what it should help them do, and what can stay outside the scope. A clearer problem gives the build a more useful direction." },
  { title: "Shape the experience", body: "I make the product and design decisions: the flow, the visual hierarchy, the interaction, and the relationship between components. Codex helps with implementation, but it does not decide what a good experience means for the product." },
  { title: "Review the result", body: "Working code is a starting point for evaluation, not a reason to stop asking questions. I look at the result as an interface: what feels unclear, what happens beyond the happy path, and where the implementation needs to move closer to the design intent." },
];

export const aiPracticeSearchPage = {
  path: "/ai-practice", title: "AI Practice",
  body: ["Design-led. AI-assisted. Explore antiflex/ui, UIQA and Pixel Round: products and tools I designed and built with implementation assistance from Codex. Read about the problems, my design decisions, and the working results."],
  images: [],
};

// Native automatic-activation tabs, with wraparound in both orientations.
export function projectForKey(currentId, key) {
  const index = AI_PROJECTS.findIndex(project => project.id === currentId);
  if (index < 0) return null;
  if (key === "Home") return AI_PROJECTS[0].id;
  if (key === "End") return AI_PROJECTS.at(-1).id;
  const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[key];
  if (!direction) return null;
  return AI_PROJECTS[(index + direction + AI_PROJECTS.length) % AI_PROJECTS.length].id;
}
