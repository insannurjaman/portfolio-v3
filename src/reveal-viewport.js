// Shared visible reading area: exclude fixed chrome, but never treat a chapter
// bar still below the fold as an occlusion at the top of the screen.
export function revealViewport(root = document, width = innerWidth, height = innerHeight) {
  const header = (root.querySelector('.editorial-header') || root.querySelector('.docs-top'))?.getBoundingClientRect();
  let top = Math.max(0, Math.min(height, header?.bottom || 0));
  if (width <= 900) {
    const chapter = (root.querySelector('.case-chapter-nav') || root.querySelector('.docs-mobile-nav'))?.getBoundingClientRect();
    if (chapter && chapter.top <= top + 2 && chapter.bottom > top) top = Math.min(height, chapter.bottom);
  }
  return { width, height, top, bottom: height - Math.min(24, height * .04), blocked: !!(root.querySelector('dialog[open]') || root.querySelector('.editorial-intro')) };
}

export function revealExposure(box, viewport, kind = 'content') {
  const top = viewport.top ?? 82, bottom = viewport.bottom ?? viewport.height * .92;
  const available = Math.max(0, bottom - top);
  const exposure = Math.max(0, Math.min(box.bottom, bottom) - Math.max(box.top, top));
  const across = Math.max(0, Math.min(box.right, viewport.width) - Math.max(box.left, 0));
  const visible = !viewport.blocked && exposure > 0 && across > 0;
  const minimum = kind === 'category'
    ? Math.min(box.height * .3, 200, available * .35)
    : kind === 'image' ? Math.min(box.height * .8, 350, available * .7)
      : Math.min(box.height, 200, available * .35);
  const horizontal = Math.min(box.width * .5, viewport.width * .5);
  return { visible, ready: visible && exposure >= minimum && across >= horizontal, below: box.top >= bottom, above: box.bottom <= top };
}
