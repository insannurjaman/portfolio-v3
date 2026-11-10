export const GOCOCO_PATH = "/gococo-ai";
export const GOCOCO_FILE = "https://www.figma.com/design/A9hwyGsl4CbwQj2dARwt6L/Personal-Project?node-id=35-76039";
const nodes = [
  ["onboarding", "35:76040", 800, "GoCoco onboarding: Snap, Design, Wear and an introduction to personalized products"],
  ["home", "35:78417", 812, "GoCoco home with Photo Gallery and Take a snap input choices"],
  ["capture", "35:76161", 800, "GoCoco camera interface with shutter, camera switching, back, and settings"],
  ["styles", "35:76175", 800, "Original photo with a style selector including Cyberpunk, Fairyland, Future, and Create Own Style"],
  ["generation-ad", "35:76229", 800, "Generation-in-progress design with an advertisement, loading indicator, and unavailable Apply to Product action"],
  ["result", "35:76341", 800, "Generated portrait result with download, share, adjustment, style choices, and Apply to Product"],
  ["applying-product", "35:77905", 812, "Applying Your Image to Real Product loading design with product illustration and progress indicator"],
  ["product-preview", "35:76393", 800, "Artwork preview on a black T-shirt with product and color selection, sample price, and Place Order"],
  ["shipment", "35:76662", 800, "Shipment step with labelled address fields and a disabled Continue action"],
  ["payment", "35:77457", 800, "Payment step showing payment-method choices and card-entry fields"],
  ["confirmation", "35:77839", 800, "Checkout confirmation with shipping and payment Change actions, product preview, itemized costs, and Pay Now"],
  ["receipt", "35:78361", 812, "Payment success receipt design with reference, payment details, Get PDF Receipt, and Back to Home"],
];
export const GOCOCO_SCREENS = Object.fromEntries(nodes.map(([name, nodeId, height, alt]) => [name, {
  src: `/media/gococo/${name}.png`, width: 360, height, alt, nodeId,
  sourceUrl: `https://www.figma.com/design/A9hwyGsl4CbwQj2dARwt6L/Personal-Project?node-id=${nodeId.replace(":", "-")}`,
}]));
export const GOCOCO_COVER = {
  title: "GoCoco AI", ...GOCOCO_SCREENS.result,
  panels: [GOCOCO_SCREENS.styles, GOCOCO_SCREENS.result, GOCOCO_SCREENS["product-preview"]],
};
const h = text => ({ type: "h2", text });
const p = text => ({ type: "p", text });
const pair = (names, caption) => ({ type: "image-group", images: names.map(([name, label]) => ({ ...GOCOCO_SCREENS[name], caption: label })), caption });
const screen = (name, caption) => ({ type: "image", ...GOCOCO_SCREENS[name], caption });
export const gococoPages = {
  [GOCOCO_PATH]: {
    path: GOCOCO_PATH, title: "GoCoco AI", category: "AI product design · Creative commerce",
    intro: "From a photo to AI-styled artwork, then into a product someone can preview and order.",
    description: "A mobile UI/UX concept connecting photo input, AI styling, product customization, and checkout.",
    body: ["From a photo to AI-styled artwork, then into a product someone can preview and order."],
    designCase: true, mobileCase: true, narrative: true,
    metadata: { role: "UI/UX Designer · Insan Nurjaman", practice: "AI creation flows · Product customization · Mobile commerce", label: "Evidence", value: "Original Figma design concept" },
    sourceUrl: GOCOCO_FILE, sourceLabel: "View the GoCoco source designs",
    images: [GOCOCO_SCREENS.result, ...Object.values(GOCOCO_SCREENS).filter(image => image !== GOCOCO_SCREENS.result)],
    coverGallery: [["styles", "Choose a style"], ["result", "Inspect the result"], ["product-preview", "Preview a product"]].map(([name, caption]) => ({ ...GOCOCO_SCREENS[name], caption })),
    coverCaption: "Original GoCoco AI mobile designs. Open a screen to inspect the full-size source export.",
    headings: { h1: ["GoCoco AI"], h2: [], h3: [], h4: [], h5: [], h6: [] },
    story: [
      h("Project in brief"),
      { type: "brief",
        problem: "Turning an AI-generated image into something wearable involves more than getting a striking result. People need a clear route from photo and style choices to a product they can inspect before ordering.",
        audience: "People exploring personalized merchandise made from a photo and AI-styled artwork. This is the design scenario, not a research-validated persona.",
        contribution: "I designed the mobile UI/UX concept across photo input, style selection, generation feedback, result actions, product preview, shipping, payment, confirmation, and receipt states.",
        outcome: "A connected Figma design concept for an AI creation-to-commerce journey, with inspectable choices before checkout.",
        limits: "The original Figma frames establish interface design, not a launched app, working AI model, print pipeline, payment integration, or autonomous agent. Sample people, generated portraits, prices, payment details, dates, and progress indicators are design content. No research sample, production analytics, or impact metrics are supplied.",
      },
      h("Key design decisions"),
      { type: "decision-highlights", items: [
        { title: "Start with an image, then make the style selectable", rationale: "Gallery and camera entry points support an existing image or a new capture. Named style choices provide a more structured starting point than an empty prompt alone.", chapter: "From photo input to an inspectable style choice", link: "Inspect the photo and style flow" },
        { title: "Keep creation separate from the purchase commitment", rationale: "Download, sharing, adjustment, and Apply to Product surround the generated result. Product preview is a separate step before shipping and payment.", chapter: "Make the result a decision point", link: "See result actions and product preview" },
        { title: "Review the configured product before paying", rationale: "The confirmation design groups the item, delivery, fees, address, and payment method with Change actions. It creates a review boundary before Pay Now.", chapter: "Carry the configured product into checkout", link: "Review checkout and receipt evidence" },
      ] },
      h("The challenge: connect creative intent to a purchasable object"),
      p("The GoCoco section is organized as a long mobile journey: onboarding, sign-up, photo input, styles, generation, result, product application, preview, shipment, payment, confirmation, and a return home. The challenge documented by the design is continuity: the artwork someone creates needs to remain connected to what they configure and pay for."),
      p("The file provides interface and state evidence, not a research report. Pain points in this case are design questions raised by that journey, not interview findings or analytics discoveries: what input is needed, what is happening while the image changes, when the result can be edited, and what exactly is being ordered."),
      { type: "flow", label: "The creation-to-commerce journey shown in the GoCoco designs", items: ["Choose a photo source", "Capture or select an image", "Choose a visual style", "Wait for and inspect the result", "Apply artwork to a product", "Configure and preview the item", "Provide shipping and payment", "Review, pay, and receive confirmation"] },
      h("From photo input to an inspectable style choice"),
      p("The introduction presents the product as Snap, Design, Wear. The home state translates that promise into two visible actions: Photo Gallery and Take a snap. This makes the input decision concrete rather than asking the user to begin with an unspecified creative request."),
      pair([["onboarding", "Introduce the creation-to-product promise"], ["home", "Choose an existing image or capture a new one"]], "Original onboarding and home designs. They describe the intended entry, not onboarding-conversion results."),
      p("The capture screen uses familiar camera controls. The next state keeps the image visible while named presets such as Cyberpunk, Fairyland, and Future provide a style choice. Create Own Style is also present, but these frames do not establish how custom prompting or model configuration would work."),
      pair([["capture", "Capture the input"], ["styles", "Choose a style while retaining the original image"]], "Input and style are separate decisions. The supplied reference photos are design imagery, not evidence of model performance or identity consent."),
      h("Design the wait without pretending it is the result"),
      p("The generation state keeps the input and style controls in context, shows Generating your photo, and makes Apply to Product unavailable. An advertisement occupies the middle of that wait. Later frames use a different Applying Your Image to Real Product state to connect the artwork to a product preview."),
      pair([["generation-ad", "Generation with an advertising placement"], ["applying-product", "Applying the image to a product"]], "Two distinct processing states in the source. Progress indicators and ads do not establish actual latency, completion percentage, or a working advertising integration."),
      p("This creates a real trade-off in the concept: an ad-supported flow may support access, but it can compete with the information someone needs while waiting. Before implementation, the experience needs clear separation between advertising and system status, together with cancellation, retry, and failure behavior. Those recovery paths are proposed next work, not completed research or verified functionality."),
      h("Make the result a decision point"),
      p("The generated result exposes download, share, adjustment, style options, and Apply to Product. It is not treated as an automatic order. The next screen places the artwork on a T-shirt and exposes product and color choices with a price and Place Order action."),
      pair([["result", "Inspect the artwork before moving on"], ["product-preview", "See the artwork on a configured product"]], "Original result and product-preview designs. The illustration and sample price are not a print-quality guarantee or current commercial terms."),
      p("This boundary matters because image satisfaction and purchase confidence are different decisions. A convincing preview still needs practical information about crop, print area, color, size, materials, and fulfillment. The visible product choices document the interface direction; physical production and preview accuracy have not been validated in the supplied record."),
      h("Carry the configured product into checkout"),
      p("The purchasing flow uses named steps: Product Preview, Shipment, Payment, and Confirmation. Shipping fields have visible labels, and the payment design presents method choices before card details. The disabled Continue examples represent intended prerequisites, not verified validation logic."),
      pair([["shipment", "Collect delivery information"], ["payment", "Choose a payment method"]], "The source documents the intended form states. It does not establish provider support, payment security, stored-card behavior, or completed transactions."),
      p("Confirmation brings the artwork back into view alongside the item, delivery, tax, administration fee, address, and payment method. Change actions keep address and payment review actionable before Pay Now. The receipt design then offers a reference, payment details, Get PDF Receipt, and Back to Home."),
      pair([["confirmation", "Review the order before commitment"], ["receipt", "Inspect the confirmation and return route"]], "These are separate design examples. The confirmation total is $18.7 and the receipt shows $20.0; this mismatch needs reconciliation before implementation and is not presented as a real transaction."),
      h("Trade-offs"),
      { type: "list", items: [
        "Structured style presets reduce the need to invent a prompt, while custom-style creation needs its own explanation and boundaries.",
        "Advertising during generation competes with progress information and should not obscure cancellation or recovery.",
        "A separate product preview gives the user another decision point, but cannot guarantee print accuracy without production checks.",
        "A staged checkout clarifies the sequence while adding screens; its value depends on preserving the configured item and making corrections easy.",
      ] },
      h("What to validate next"),
      p("The following is a proposed validation plan, not research already conducted:"),
      { type: "list", items: [
        "Test whether people understand the photo requirements, style choices, and difference between creating an image and ordering a product.",
        "Evaluate generation wait, advertising comprehension, cancellation, failure, retry, and what happens when a result is unsuitable.",
        "Compare the preview against a real sample and test how people interpret print placement, color, size, and product options.",
        "Reconcile order totals and preserve product, delivery, and payment details through edits, failed payment, duplicate submission, and receipt generation.",
        "Before release, define consent and image-retention rules, content rights and safety boundaries, payment responsibilities, and task/funnel baselines.",
      ] },
      h("Delivery and reflection"),
      p("The design connects an expressive AI creation moment to a more deliberate purchase journey. Its strongest distinction is the decision boundary between liking an image, applying it to a product, and committing to an order. The next step is to validate that continuity, including the uncomfortable states that the successful path alone cannot explain."),
    ],
  },
};
