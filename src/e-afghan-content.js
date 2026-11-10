const figmaFile = "https://www.figma.com/design/INmeNClebdKEMOIkNa07GS/E-Afghans_v4";
const visual = (file, alt, caption) => ({ type: "image", src: `/media/e-afghan/${file}`, alt, caption });
const paragraph = text => ({ type: "p", text });
const heading = text => ({ type: "h2", text });

function project({ path, title, intro, cover, sourceNode, practice, story, related }) {
  return {
    path, title, body: [intro], story, related,
    category: "GovTech · Public services",
    thumbnail: cover.src,
    images: [cover],
    metadata: { role: "Product Designer", practice, label: "Deliverable", value: "Responsive Figma design" },
    sourceUrl: `${figmaFile}?node-id=${sourceNode.replace(":", "-")}`,
    designCase: true,
  };
}

export const eAfghanPages = {
  "/e-afghan-landing-page": project({
    path: "/e-afghan-landing-page",
    title: "E-Afghan Landing Page Redesign",
    intro: "A clearer front door to Afghan consular services, connecting service discovery, practical guidance, and the Citizen Portal in one responsive experience.",
    cover: visual("landing-hero.png", "E-Afghan landing page hero with service links and an Afghan mountain landscape"),
    sourceNode: "708:56469",
    practice: "Information architecture · UX · UI",
    related: "/e-afghan-citizen-portal",
    story: [
      heading("A front door built around the next step"),
      paragraph("The public website and the account-based portal serve different moments in the same journey. This redesign gives the public-facing experience a distinct job: help people understand the available services, find the relevant requirements, and identify where to go next."),
      paragraph("My role was Product Designer. This case study presents the interface structure and responsive design documented in the Figma file; it does not claim measured changes in conversion, service completion, or citizen satisfaction."),
      heading("Service discovery before account creation"),
      paragraph("The homepage leads with two routes: explore services or plan a visit. Below the introduction, a service index brings passport services together with other citizen-service categories. The hierarchy makes the service itself the starting point, rather than asking visitors to understand the organization first."),
      visual("landing-services.png", "E-Afghan service index with an expanded passport service panel", "Service categories paired with a focused passport-services panel."),
      heading("Explain the relationship between website and portal"),
      paragraph("The design introduces the account journey in three stages: create an account, access services, and track updates. This explanation connects the information website to the Citizen Portal without treating them as interchangeable surfaces."),
      visual("landing-journey.png", "Three-step account journey showing account creation, services, and application updates", "An explicit handoff from discovery to the account-based experience."),
      heading("One hierarchy, across screen sizes"),
      paragraph("Desktop, tablet, and mobile layouts are included in the design. The mobile version stacks service information and portal guidance into a continuous reading order while retaining the primary service and visit routes."),
      { type: "image-group", images: [visual("landing-desktop.png", "Full desktop E-Afghan homepage design", "Desktop homepage"), visual("landing-mobile.png", "Full mobile E-Afghan homepage design", "Mobile homepage")], caption: "The same service-first story, adapted to desktop and mobile. Open either screen to inspect the full design." },
      heading("Beyond the homepage"),
      paragraph("The landing-page design system extends into About, Citizen Services, passport guidance, birth-certificate information, e-Visa, and support content. Shared navigation, service patterns, and help sections establish continuity between the entry page and the detailed information visitors need."),
      paragraph("The companion Citizen Portal case study follows the next part of the journey: managing a profile, preparing documents, and working through a passport application."),
      {type:"portal-related",items:[{path:"/saphyte-eafghans-design-system",title:"Saphyte & E-Afghans Design System",summary:"Explore the shared foundations, branded component models, and usage guidance."}]},
    ],
  }),
  "/e-afghan-citizen-portal": project({
    path: "/e-afghan-citizen-portal",
    title: "E-Afghan Citizen Portal",
    intro: "An account-based workspace for consular services, bringing applications, profile details, document preparation, and photo guidance into a connected experience.",
    cover: visual("portal-overview.png", "E-Afghan Citizen Portal overview with quick actions, applications, and profile completion"),
    sourceNode: "708:56470",
    practice: "Product flows · Interaction · UI",
    related: "/e-afghan-landing-page",
    story: [
      heading("From finding a service to managing a request"),
      paragraph("The Citizen Portal is the working surface behind the public website. Its design brings service access, active applications, profile information, and preparation tools into a persistent workspace. My role was Product Designer."),
      paragraph("The screens shown here are design artifacts from the supplied Figma file. Application names, personal details, progress values, and status examples inside them are interface content, not evidence of real users or measured project outcomes."),
      heading("An overview that surfaces useful actions"),
      paragraph("The overview separates quick actions from application status and profile completion. Passport applications, payments, and photo checks have visible entry points, while existing requests remain available below. A persistent navigation groups accounts, workspace, citizen services, and tools."),
      visual("portal-overview.png", "Citizen Portal overview with service shortcuts and application status rows", "Quick actions, existing applications, and profile readiness share one overview."),
      heading("Prepare identity information and photos"),
      paragraph("The profile and photo-check screens give preparation tasks their own space. Photo guidance breaks requirements into specific checks, including file format, size, resolution, portrait shape, lighting, and face visibility. The interface distinguishes these requirements from the upload action itself."),
      visual("portal-profile.png", "Citizen Portal profile screen", "A dedicated profile surface for identity and account information."),
      visual("portal-photo-check.png", "Citizen Portal photo upload and photo requirement guidance", "Photo preparation pairs an upload area with concrete requirements and visual examples."),
      heading("Break the passport application into stages"),
      paragraph("The passport flow uses a visible step list to separate application setup, documents and photo, identity details, contact and employment, passport history, and review. Completed, current, and not-started stages communicate position within the flow, while Save and Exit gives the design a clear pause point."),
      visual("portal-documents.png", "Passport application document and photo step with progress navigation and required uploads", "Document uploads and photo requirements sit beside the application steps."),
      heading("Make review a deliberate step"),
      paragraph("Before submission, a summary groups the supplied information by section and exposes edit actions. The declaration and signature area is separate from that summary, making the final confirmation a distinct part of the journey rather than another ordinary form field."),
      visual("portal-review.png", "Passport application review screen with editable summaries and declaration", "Section-level review, correction, and declaration before submission."),
      heading("Carry the workflow onto mobile"),
      paragraph("The mobile designs preserve the overview and application structure while stacking the denser desktop layouts. The examples below show the account overview and the start-application screen as separate, focused mobile surfaces."),
      { type: "image-group", images: [visual("portal-overview-mobile.png", "Citizen Portal mobile overview", "Mobile overview"), visual("portal-start-mobile.png", "Mobile start-application form", "Mobile application setup")], caption: "Responsive designs from the same Citizen Portal file. Open a screen for a closer look." },
      {type:"portal-related",items:[{path:"/saphyte-eafghans-design-system",title:"Saphyte & E-Afghans Design System",summary:"Explore the system context alongside the Citizen Portal workflow design."}]},
    ],
  }),
};
