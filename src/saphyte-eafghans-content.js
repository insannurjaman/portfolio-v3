// The owner confirms creating/adapting the complete library. Chakra UI remains
// the credited foundation; source inventory is not evidence of measured impact.
export const CORE_SYSTEM_PATH = "/saphyte-eafghans-design-system";
export const CORE_SYSTEM_FILE = "/design-systems/saphyte-eafghans";
export const coreSystemSource = () => CORE_SYSTEM_FILE;
const spec = {
  "action-hierarchy": [1838,478,"4082:6788"], "button-variants": [1838,610,"4082:6662"],
  "input-states": [1280,820,"4162:6062"], "input-usage": [1280,580,"4162:6408"],
  "upload-types": [1710,649,"4148:15931"], "upload-guidance": [1710,611,"4148:16021"],
  "saphyte-default": [133,40,"4019:21735"], "saphyte-hover": [133,40,"4019:21775"],
  "eafghans-default": [133,40,"4273:25356"], "eafghans-hover": [133,40,"4273:25396"],
};
export const CORE_SYSTEM_SCREENS = Object.fromEntries(Object.entries(spec).map(([name,[width,height,nodeId]]) => [name,{src:`/media/saphyte-eafghans/${name}.png`,width,height,nodeId,sourceUrl:coreSystemSource(nodeId)}]));
const h = text => ({type:"h2",text});
const p = text => ({type:"p",text});
const list = items => ({type:"list",items});
const image = (name,alt,caption) => ({type:"image",...CORE_SYSTEM_SCREENS[name],alt,caption});
const variant = (name,label,alt) => ({key:name,label,...CORE_SYSTEM_SCREENS[name],alt});

export const CORE_SYSTEM_CASE = {
  path:CORE_SYSTEM_PATH,title:"Saphyte & E-Afghans",
  summary:"A shared Chakra UI-based library with product-specific tokens, reusable interaction states, and design guidance.",
  cover:CORE_SYSTEM_SCREENS["action-hierarchy"],coverAlt:"Original Saphyte action-hierarchy documentation with primary, supporting, and destructive button examples",
  deck:"One core. Distinct product identities.",role:"Design system creator & adaptation",foundation:"Chakra UI",
  chapters:[["Shared foundations, distinct brands","Semantic roles, typography modes, and original branded components.","foundations"],["Behavior & usage guidance","Form states, upload patterns, and documentation that needs to stay aligned.","documentation"]],
};

export const coreSystemPages = {
  [CORE_SYSTEM_PATH]: {
    path:CORE_SYSTEM_PATH,title:"Saphyte & E-Afghans: one core, distinct identities",
    category:"Design systems · Saphyte",designCase:true,narrative:true,systemCase:true,coreSystemCase:true,
    thumbnail:CORE_SYSTEM_SCREENS["action-hierarchy"].src,
    metadata:{role:"Design system creator & adaptation · Saphyte",practice:"Tokens · Brand themes · Components · Guidance",label:"Foundation",value:"Chakra UI"},
    body:["Creating and adapting a shared Chakra UI-based design library for Saphyte and E-Afghans, connecting reusable foundations with product-specific identity, component states, and usage guidance.","Saphyte and E-Afghans Design System by Insan Nurjaman. Global and semantic color tokens, size and typography collections, light/dark modes, brand palettes, input states, file upload patterns, and component documentation."],
    images:[image("action-hierarchy","Original Saphyte design-system documentation showing primary, supporting, and destructive button groups","Action hierarchy is documented alongside the components.")],
    chapterIds:{"Project in brief":"chapter-0","Key design decisions":"key-design-decisions","A shared foundation with room for identity":"foundations","Behavior belongs in the component model":"components","Make form patterns understandable":"forms","Guidance is part of the deliverable":"documentation","Connect the system to product work":"product-context","Delivery and reflection":"delivery"},
    story:[
      h("Project in brief"),
      {type:"brief",problem:"Saphyte and E-Afghans need reusable interface foundations without losing their own brand expression or the meaning of component states.",audience:"Designers and engineers working on Saphyte and E-Afghans product interfaces, and the people who use their forms and actions.",contribution:"I created and adapted the complete shared library, including brand tokens, typography choices, component families, product-specific examples, and usage documentation, with Chakra UI as the underlying foundation.",outcome:"A Figma library that connects global and semantic colors, size and typography tokens, configurable components, branded examples, and documented usage patterns.",limits:"This case documents my design-system work, not authorship of Chakra UI itself. Source examples, labels, dates, and values are design content. Adoption, shipped-code parity, accessibility conformance, research results, and measured impact have not been established here."},
      h("Key design decisions"),
      {type:"decision-highlights",items:[
        {title:"Keep shared roles separate from brand values",rationale:"Global palettes supply semantic roles, while Saphyte and E-Afghan palettes and typography choices preserve product identity. Reuse does not require every product to look identical.",chapter:"A shared foundation with room for identity",link:"Trace the source relationships"},
        {title:"Model content and behavior together",rationale:"Buttons and inputs expose sizes, visual variants, interaction states, labels, helpers, and optional content. The component model describes more than a resting appearance.",chapter:"Behavior belongs in the component model",link:"Inspect the original examples"},
        {title:"Document choices, not only parts",rationale:"Action hierarchy, field usage, and upload contexts sit alongside the components. Their usefulness depends on staying aligned with the evolving source model.",chapter:"Guidance is part of the deliverable",link:"Explore the usage guidance"},
      ]},
      h("A shared foundation with room for identity"),
      p("I organized the library around Global Color, Semantic Color, Size, and Typography collections. Light and dark semantic modes resolve shared roles to different foundation values. Brand-specific roles then connect those foundations to Saphyte and E-Afghan components."),
      p("The source contains a Saphyte palette and three E-Afghan palette families. The reviewed solid buttons use brand/saphyte/solid and brand/eafghan-1/solid for their fills, with matching contrast roles for their labels. Their shared structure coexists with product-specific color and corner-token choices."),
      {type:"core-foundations"},
      p("Typography is also configurable: the source has Inter, Geist, and Eafghans modes. The Eafghans mode assigns NewsReader to headings and Inter to body text. These are explicit design-variable choices, not a claim that application code automatically changes fonts or synchronizes every token."),
      {type:"system-preview",nativeSize:true,legend:"Inspect the original Saphyte solid button",variants:[variant("saphyte-default","Default","Original medium solid Saphyte button in its default state"),variant("saphyte-hover","Hover","Original medium solid Saphyte button in its hover state")],caption:"Exact source component exports at native size. The control selects a design state; it does not run the source button."},
      {type:"system-preview",nativeSize:true,legend:"Inspect the original E-Afghans solid button",variants:[variant("eafghans-default","Default","Original medium solid E-Afghan button in its default state"),variant("eafghans-hover","Hover","Original medium solid E-Afghan button in its hover state")],caption:"The same medium solid-button structure with the E-Afghan brand role and corner choice."},
      h("Behavior belongs in the component model"),
      p("The Button family supports Solid, Subtle, Surface, Outline, Ghost, and Plain styles, seven sizes, optional leading/trailing icons, and editable labels. Product palettes sit alongside neutral and semantic choices rather than being hard-coded into separate unrelated button designs."),
      image("button-variants","Original documentation showing six button styles arranged by visual emphasis","The source makes the available styles and their intended hierarchy visible."),
      p("The current component model includes Default, Hover, and Disabled state options. However, not every palette/state combination is present in the reviewed set. A state property alone should not be read as proof of a complete combinatorial matrix."),
      p("Inputs combine visual variants and sizes with default, focus, and disabled states, invalid and filled flags, optional labels/helpers, and left or right content. Those options allow the same family to support a simple field, an error explanation, or a context-specific addon."),
      h("Make form patterns understandable"),
      image("input-states","Original Input documentation showing default, focus, disabled, invalid, and filled examples","Original state examples connect field appearance to feedback and entered content."),
      p("The source treats label, helper, error, and addon content as parts of the field pattern. This gives a designer a place to explain what is expected and what needs correction, rather than relying only on an outline color."),
      image("input-usage","Original Input usage documentation with form, search, and contextual addon examples","Usage examples show how the component participates in a larger task."),
      p("FileUpload extends the same idea to a different input task. The library includes Button, Dropzone, Input, Clearable, and Paste forms. Its documentation distinguishes a small secondary upload action from a prominent document-import task and from a file field embedded in a longer form."),
      image("upload-types","Original FileUpload overview with five source interaction types and selection surfaces","Five documented interaction surfaces, with selection context kept explicit."),
      p("The source explicitly separates the selection surface from upload logic. It documents accepted-format hints, selection feedback, validation, and keyboard access as implementation expectations; it does not establish that a production upload service or accessibility audit has been completed."),
      h("Guidance is part of the deliverable"),
      p("I included component documentation for action hierarchy, size choices, semantic versus categorical color use, icon slots, form states, upload contexts, and interaction expectations. The aim is to help someone choose the appropriate pattern, not merely locate a component with the right name."),
      image("upload-guidance","Original FileUpload documentation discussing validation, accepted formats, keyboard access, and drag feedback","Guidance records what an implementation needs to consider; it is not verification of those behaviors."),
      p("The library also shows why maintenance matters. Button documentation describes two static states while the current model includes Disabled. The documentation’s palette inventory differs from the current set, and InputElement guidance lists four types while the component also offers a Forgot password type."),
      p("I would treat those differences as a reconciliation task: review the component model and examples together, update usage guidance, and check interaction requirements against the implementation. Documentation should describe the current library, not preserve an older snapshot as an unquestioned rule."),
      h("Connect the system to product work"),
      p("The same design practice extends into my E-Afghan work: a public service-discovery experience and an account-based citizen workspace. Those case studies make the product questions visible alongside this library’s foundation and component decisions."),
      p("The shared library’s E-Afghan palettes, typography mode, and branded input/button examples provide the system context. The links below show the product work; they do not by themselves prove instance adoption, production-code parity, or measured efficiency."),
      {type:"portal-related",items:[{path:"/e-afghan-landing-page",title:"E-Afghan landing page",summary:"Public service discovery, requirements, and the handoff into an account journey."},{path:"/e-afghan-citizen-portal",title:"E-Afghan Citizen Portal",summary:"Application stages, document preparation, review, and responsive account workflows."}]},
      h("Delivery and reflection"),
      p("The delivered design library combines a credited framework foundation with product-specific identity, component behavior, and documentation. My contribution spans that adaptation, not a claim to have invented the underlying Chakra UI framework."),
      list(["Shared semantic roles can support distinct product identities.","Reusable components need content and state models, not only visual variants.","Usage examples should explain the task and the trade-off behind a choice.","Documentation and component coverage need to evolve together."]),
      {type:"h5",text:"What I would validate next"},
      list(["Token and component behavior across product palettes and light/dark modes.","Gaps in valid state, size, palette, and content combinations.","Keyboard, focus, contrast, and target-sizing behavior in the implementation.","Whether designers can select the right form or upload pattern from the guidance.","Actual library use, detachment, code divergence, and the effort required to evolve a shared pattern."]),
    ],
  },
};
