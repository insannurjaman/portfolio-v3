export const COMMENT_ENDPOINT = "https://formspree.io/f/xjygqrwb";
export const COMMENT_LIMIT = 2000;
export const COMMENT_EXCLUSIONS = 'header,nav,footer,button,input,textarea,select,summary,[contenteditable],[role="dialog"],iframe,canvas,.space-game,.docs-specimen,.docs-demo-stage,.docs-demo-controls,[data-comment-ui],[data-no-comment]';

export function validateComment(message, email = "") {
  if (!message.trim()) return { field: "message", message: "Write a note before sending." };
  if (message.length > COMMENT_LIMIT) return { field: "message", message: `Keep your note within ${COMMENT_LIMIT} characters.` };
  if (email.trim() && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) return { field: "email", message: "Check your email address, or leave it empty." };
  return null;
}

const singleLine = (value, max) => String(value || "").replace(/[\r\n\t]/g, " ").trim().slice(0, max);
export function commentPayload({ message, email = "", page = "/", section = "Page", website = "" }) {
  const pathname = String(page).split(/[?#]/, 1)[0];
  return {
    subject: `Portfolio comment: ${singleLine(section, 100)}`,
    message: message.trim(),
    ...(email.trim() ? { email: email.trim() } : {}),
    page: pathname.startsWith("/") && !pathname.startsWith("//") ? pathname.slice(0, 240) : "/",
    section: singleLine(section, 160),
    _gotcha: website,
  };
}

export async function sendComment(payload, { signal, fetcher = fetch } = {}) {
  let response;
  try { response = await fetcher(COMMENT_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "omit",
    referrerPolicy: "no-referrer",
    signal,
  }); } catch (failure) {
    if (failure.name === "AbortError") throw failure;
    throw new Error("Could not confirm that your note was sent. Your draft is still here. Please check your connection before trying again.");
  }
  let result;
  try { result = await response.json(); } catch { result = null; }
  if (response.ok && result?.ok === true) return;
  if (response.status === 429) throw new Error("Too many notes at once. Wait a minute, then try again. Your draft is still here.");
  if (response.status === 400 || response.status === 422) throw new Error("Please check your message and email, then try again. Your draft is still here.");
  if (response.status === 403) throw new Error("The form could not verify this request. Try again, or contact me on LinkedIn. Your draft is still here.");
  throw new Error("Could not confirm that your note was sent. Your draft is still here. Please check your connection before trying again.");
}

export function placeComment(point, panel, viewport) {
  const margin = 12;
  const left = viewport.left || 0, top = viewport.top || 0;
  const width = Math.min(panel.width, Math.max(0, viewport.width - margin * 2));
  const height = Math.min(panel.height, Math.max(0, viewport.height - margin * 2));
  const clamp = (value, low, high) => Math.max(low, Math.min(value, Math.max(low, high)));
  const x = viewport.width <= 640 ? left + (viewport.width - width) / 2 : clamp(point.x + 24 + width <= left + viewport.width - margin ? point.x + 24 : point.x - width - 24, left + margin, left + viewport.width - width - margin);
  const y = viewport.width <= 640 ? top + viewport.height - height - margin : clamp(point.y + height + margin <= top + viewport.height ? point.y + 8 : point.y - height + 8, top + margin, top + viewport.height - height - margin);
  return { x, y };
}

export function collectCommentSections(root) {
  if (!root) return [];
  const seen = new Set();
  return [...root.querySelectorAll("h1,h2,h3")].flatMap(heading => {
    if (!heading.getClientRects().length || heading.closest('[aria-hidden="true"],[inert],[data-comment-ui],.space-game,.docs-specimen')) return [];
    const element = heading.closest("article,[data-comment-anchor],.case-card,.article-card") || heading.closest("section") || heading.parentElement;
    const label = singleLine(heading.innerText || heading.textContent, 160);
    if (!label || seen.has(element)) return [];
    seen.add(element);
    return [{ id: `section-${seen.size}`, label, element }];
  });
}
