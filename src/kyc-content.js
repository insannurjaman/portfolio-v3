import screens from "./kyc-screens.json" with { type: "json" };

export const KYC_CASE_PATH = "/saphyte-kyc-verification";
export const KYC_ARTICLE_URL = "https://medium.com/@hello.insanz/redesigning-the-kyc-verification-process-for-saphyte-crm-8d2489e6f67b";
export const KYC_SCREENS = screens;
const source = "Published in the original Medium article on 6 May 2025.";
const image = (key,caption = screens[key].caption) => ({type:"image",...screens[key],caption});
const gallery = (id,title,keys) => ({type:"source-gallery",id,title,images:keys.map(key=>image(key))});
const p = text => ({type:"p",text});
const h = text => ({type:"h2",text});
const sub = (text,id) => ({type:"subheading",text,id});
const list = items => ({type:"list",items});
const prototypeBase = "https://www.figma.com/proto/COQDPLUwL5Uloq2VwmNGtL/Saphyte-UI-UX-Challenge";
export const KYC_PROTOTYPES = [
  {label:"Client verification prototype",href:`${prototypeBase}?page-id=300%3A127640&node-id=321-143118&scaling=scale-down&content-scaling=fixed&starting-point-node-id=300%3A127643`},
  {label:"Administrator review prototype",href:`${prototypeBase}?page-id=300%3A127641&node-id=321-156659&scaling=scale-down&content-scaling=fixed&starting-point-node-id=321%3A156659`},
];
const brief = {
  problem:"Clients could not connect their overall KYC status to the document or corrective action that required attention. Administrators lacked enough context to triage and review submissions efficiently.",
  audience:"Clients submitting identity documents and administrators reviewing them in Saphyte CRM.",
  contribution:"I redesigned the client and administrator verification flows, from interface review and synthesis through wireframes, high-fidelity screens, and linked Figma prototypes.",
  outcome:"A documented design response covering document requirements, per-file status and recovery, contextual administrator review, and a separate third-party verification path.",
  limits:"The source is a three-day product design challenge published on 6 May 2025. It documents designs and prototypes, not a verified production rollout, compliance certification, completed usability tests, or measured improvements in KYC completion and review time. The later implementation result below is separately attributed to my resume and subsequent confirmation, without original analytics.",
};
export const KYC_CASE_PROFILE = {
  company:"Saphyte CRM - KYC verification design challenge",timeline:"3 days, as reported in the article",brief,
  reflection:{strength:"Client recovery and administrator decisions use the same document-level context.",limitation:"The published article contains no measured completion-rate, support-volume, or review-speed result.",next:"Test rejection recovery with clients and review tasks with administrators; resolve progress-label inconsistencies before establishing a live baseline."},
};
const chapterIds = {
  Overview:"chapter-0",Problem:"case-problem","My Role":"case-context",Process:"case-exploration","Key Decisions":"case-constraints","Final Solution":"case-solution",Outcomes:"case-impact",Learnings:"case-reflection",
  "Client recovery":"kyc-client-recovery","Administrator review":"kyc-admin-review","Third-party verification":"kyc-provider-boundary",
};
export const kycPages = {
  [KYC_CASE_PATH]:{
    path:KYC_CASE_PATH,title:"Saphyte KYC: from unclear status to actionable review",category:"Saphyte - Verification workflows",
    designCase:true,narrative:true,caseStudyStructure:true,
    thumbnail:"/media/renaissance-covers/saphyte-kyc-1448.webp",
    sourceUrl:KYC_ARTICLE_URL,sourceLabel:"Read the original case study",
    metadata:{role:"UX/UI Designer - Insan Nurjaman",practice:"Client recovery - Admin workflows - Prototyping",label:"Evidence",value:"Published design challenge - May 2025"},
    body:["Redesigning identity verification across client submissions and administrator review, with clear document requirements, actionable rejection feedback, and visible next steps.","A three-day Saphyte CRM design challenge documented in my Medium article, with original analysis, wireframes, interface designs, and two Figma prototypes."],
    images:[image("admin-queue","Original administrator queue: required-document completion and verification methods are visible before review. "+source)],
    chapterIds,
    story:[
      h("Overview"),
      {type:"case-summary",outcomeLabel:"What I delivered",problem:brief.problem,contribution:brief.contribution,outcome:brief.outcome},
      p("Verification is a connected workflow. A client needs to know which document is required and what to fix; a reviewer needs the submission context to make and communicate a decision. My response to this design challenge treats those two perspectives as one system."),
      {type:"links",links:[{label:"Read the original Medium article",href:KYC_ARTICLE_URL}]},
      h("Problem"),
      p("The published review began with interface recordings of the existing client and admin flows. The central issue was a gap between an overall status and the document-level information needed to act on it."),
      list(["Required and optional documents were difficult to distinguish.","A global KYC status did not explain which document needed attention.","Rejected documents lacked a clear reason and recovery path.","Multiple files within one document category were poorly presented.","Administrators needed stronger triage controls and more context during review."]),
      p("The design goals were clearer status, easier submission and re-upload, and more contextual review. Lower support demand and operational effort were intended benefits, not measured results of the published challenge."),
      h("My Role"),
      {type:"case-facts",label:"Project context and personal ownership",items:[
        ["Company / product context",KYC_CASE_PROFILE.company],["Users",brief.audience],["Timeline",KYC_CASE_PROFILE.timeline],["My role & scope",brief.contribution],["Evidence available","My published article, original analysis and interface exports, and two linked Figma prototypes."],
      ]},
      p("I worked across the client portal and admin back office. My scope was UX/UI design and prototyping: organizing document requirements, feedback, file actions, review context, and the distinction between manual and third-party verification."),
      h("Process"),
      p("I used Nielsen's ten usability heuristics to structure the review of the recorded interface. The article then compares Binance and Wise against the same verification concerns: requirements, status transparency, error feedback, re-upload, review visibility, and contextual help."),
      p("Affinity mapping and ideation grouped the observations into clarity, error recovery, navigation, document management, and inline guidance. I translated those themes into client and administrator wireframes, then high-fidelity screens and prototypes. The persona artifact is part of this design synthesis; the article does not describe an interview sample or completed usability study."),
      gallery("kyc-research-artifacts","Inspect the analysis and wireframes",["heuristics","benchmark","affinity","ideation","personas","client-wireframes","admin-wireframes"]),
      h("Key Decisions"),
      {type:"decision-highlights",items:[
        {title:"Make rejection actionable at the file",rationale:"A global Rejected badge is insufficient. Keep the affected document, reason, and replacement action together so the user can identify a corrective step.",chapter:"Client recovery",link:"Inspect rejection recovery"},
        {title:"Bring evidence into the review context",rationale:"The review queue exposes submission state; the detail view combines applicant context, document metadata, file status, and decision controls.",chapter:"Administrator review",link:"Inspect the admin workflow"},
        {title:"Keep provider results distinct from manual decisions",rationale:"Third-party results use a separate, read-only presentation. This separates inspecting provider evidence from editing a manually reviewed submission.",chapter:"Third-party verification",link:"Inspect the provider boundary"},
      ]},
      p("The trade-off is between a compact summary and enough detail to resolve an exception. Required and optional groups, per-category progress, and expandable document sections keep the overview manageable while preserving a route into file-level context."),
      h("Final Solution"),
      sub("Client recovery","kyc-client-recovery"),
      p("The client sees Pending, Rejected, or Approved profile states with a next action. The KYC page separates required and optional documents, explains how required-document review affects the overall status, and makes file status and rejection reasons visible beside View, Replace, and Delete actions."),
      image("required-rejected","The rejected identity file has a specific reason and a Replace action beside it. The approved back document remains separately visible. "+source),
      p("The upload flow exposes document type, required inputs, file feedback, and an optional comment. Instructions and examples are placed near submission so a client can inspect expectations before retrying."),
      {type:"image-group",images:[image("upload-empty","Upload dialog before a file is selected"),image("upload-ready","Upload dialog with a selected file")],caption:"Two source upload states, not a simulated upload service."},
      sub("Administrator review","kyc-admin-review"),
      p("The queue distinguishes client status, required-document completion, and verification method before the reviewer opens a submission. The detail screen keeps the applicant, required-document progress, file metadata, version history, and decision actions in the same context."),
      image("admin-details","Original review-detail design with file-level evidence, history, and separate decision controls. Names, IDs, document data, validation messages, and dates are sample interface content."),
      p("Reject and approve actions have different confirmation contexts. Rejection offers consistent reasons and an optional comment, with an applicant-facing warning. Approval asks the reviewer to confirm the specific document before continuing."),
      {type:"image-group",images:[image("reject-confirmation","Rejection reason and applicant-facing feedback"),image("approve-confirmation","Document-specific approval confirmation")],caption:"Original decision dialogs. The case study documents interaction design, not the execution of a verification decision."},
      sub("Third-party verification","kyc-provider-boundary"),
      p("The design offers a Sumsub verification entry point and a separate provider-result page. Provider-supplied document results are marked read-only, with viewing and download controls. These screens establish the intended distinction between verification methods; they do not verify a working vendor integration or the accuracy of its checks."),
      image("sumsub-approved","Read-only third-party verification result in the original design. Risk and validation labels are illustrative interface content."),
      gallery("kyc-additional-states","Compare the remaining client and admin states",["profile-pending","profile-rejected","profile-approved","required-pending","optional-pending","required-approved","approval-success","admin-rejected"]),
      {type:"links",links:KYC_PROTOTYPES},
      h("Outcomes"),
      p("The documented result is a connected design set for client verification and administrator review, supported by wireframes, explicit exception states, and two linked Figma prototypes. The article was published on 6 May 2025 and describes a three-day challenge."),
      p("The article proposes future usability testing with people recovering from rejection. It does not report completed task testing, successful-KYC conversion, production review speed, or reduced support volume."),
      {type:"case-evidence-note",scope:brief.limits,limitation:KYC_CASE_PROFILE.reflection.limitation},
      p("After publication, this design was implemented in the same KYC workflow. I reported the later Accept-button interaction figures in my resume and confirmed that association when preparing this portfolio. The comparison measures interactions, not completed verification, and does not isolate the redesign from other changes."),
      {type:"case-impact",path:KYC_CASE_PATH},
      h("Learnings"),
      {type:"case-facts",label:"Design reflection and next steps",stacked:true,items:[["What worked in the design",KYC_CASE_PROFILE.reflection.strength],["What I would change next",KYC_CASE_PROFILE.reflection.next]]},
      list(["Keep document counts, status, and numeric progress consistent: the published rejected-state screen shows one of two required documents approved beside a 100% label. That mismatch needs correction before implementation.","Validate the rules for replacing or deleting approved documents with the review team rather than assuming every visible file action is appropriate in every state.","Test whether clients can identify what to fix and whether reviewers can explain a decision from the available context before defining live completion and review-effort measures."]),
      {type:"portal-related",items:[{path:"/loyica-client-portal",title:"Saphyte Client Portal",summary:"Explore the broader account, performance, verification, and payout workflow redesign."}]},
    ],
  },
};
