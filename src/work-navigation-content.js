import { RENAISSANCE_COVERS } from "./renaissance-covers.js";
import { CASE_PREVIEWS } from "./case-illustrations.js";
import { PROJECT_THUMBNAIL_OVERRIDES } from "./project-thumbnail-overrides.js";

export const WORK_NAV_PREVIEW_PATHS = {
  saas: ["/loyica-client-portal", "/ags-pricing-calculator"],
  "design-systems": ["/work/design-systems#antiflex-ui-highlight", "/accelbyte-design-system"],
  mobile: ["/halodish-apps", "/improve-otp-push-notification"],
  ai: ["/gococo-ai", "/divermenu"],
};

export function workNavigationItems(collectionId, data) {
  const paths = Object.hasOwn(WORK_NAV_PREVIEW_PATHS, collectionId) ? WORK_NAV_PREVIEW_PATHS[collectionId] : WORK_NAV_PREVIEW_PATHS.saas;
  return paths.map(path => {
    if (path === "/work/design-systems#antiflex-ui-highlight") {
      return { path, title: "antiflex/ui", image: PROJECT_THUMBNAIL_OVERRIDES[path] || RENAISSANCE_COVERS[path] };
    }
    if (path === "/ai") {
      return { path, title: "AI interface explorations", image: PROJECT_THUMBNAIL_OVERRIDES[path] || RENAISSANCE_COVERS[path] };
    }
    const image = CASE_PREVIEWS[path];
    return { path, title: path === "/accelbyte-design-system" ? "AccelByte Design System" : image.title, image };
  });
}
