// Original halftone matte: fixed dot centers expand along an organic wavefront.
// The source image is revealed through the dots; no stock footage is embedded.
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function thumbnailGeometry(width, height, dpr = 1) {
  const scale = Math.min(1.5, dpr, 1024 / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

const halftoneField = (x, y) => clamp((x * .58 + y * .18 + Math.sin(x * 6.2 + y * 3.7) * .14 + Math.cos(y * 7.8 - x * 2.4) * .1 - .08) / .79);
const growthAt = (progress, field) => smooth((clamp(progress) * 1.35 - field) / .35);
export function halftoneGrowth(progress, x, y) { return growthAt(progress, halftoneField(x, y)); }

export function animateThumbnail(frame, image, { duration = 1200, reduced = false, onFinish = () => {}, requestFrame = requestAnimationFrame, cancelFrame = cancelAnimationFrame } = {}) {
  let canvas, raf = 0, ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    cancelFrame(raf);
    canvas?.remove();
    onFinish();
  };
  if (reduced || !image.naturalWidth || !image.naturalHeight) { finish(); return { cancel: finish }; }
  try {
    const box = frame.getBoundingClientRect();
    if (!box.width || !box.height) { finish(); return { cancel: finish }; }
    canvas = document.createElement('canvas');
    canvas.className = 'thumbnail-halftone';
    canvas.setAttribute('aria-hidden', 'true');
    const size = thumbnailGeometry(box.width, box.height, window.devicePixelRatio || 1);
    canvas.width = size.width; canvas.height = size.height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas unavailable');
    const { width: w, height: h } = size;
    const style = getComputedStyle(image), position = style.objectPosition.split(' ');
    const factor = (style.objectFit === 'contain' ? Math.min : Math.max)(w / image.naturalWidth, h / image.naturalHeight);
    const iw = image.naturalWidth * factor, ih = image.naturalHeight * factor;
    const fraction = (value, fallback) => value?.endsWith('%') ? parseFloat(value) / 100 : fallback;
    const ix = (w - iw) * fraction(position[0], .5), iy = (h - ih) * fraction(position[1], .5);
    const background = frame.dataset.thumbnailGeneration === 'dark' ? '#173e39' : style.backgroundColor && !['transparent', 'rgba(0, 0, 0, 0)'].includes(style.backgroundColor) ? style.backgroundColor : '#fbfaf6';
    const pitch = Math.max(w / 72, h / 100, w / Math.max(22, Math.round(box.width / 10)));
    const columns = Math.max(1, Math.round(w / pitch));
    const rows = Math.max(1, Math.round(h / pitch));
    const cw = w / columns, ch = h / rows;
    const maxRadius = Math.hypot(cw, ch) * .52;
    const dots = Array.from({ length: columns * rows }, (_, i) => ({
      x: (i % columns + .5) * cw, y: (Math.floor(i / columns) + .5) * ch,
      field: halftoneField((i % columns + .5) / columns, (Math.floor(i / columns) + .5) / rows),
    }));
    frame.append(canvas);
    let start, last = -Infinity;
    function draw(now) {
      if (ended) return;
      start ??= now;
      const progress = clamp((now - start) / duration);
      try {
        if (now - last >= 30 || progress === 1) {
          last = now;
          canvas.setAttribute("data-halftone-stage", progress < .3 ? "start" : progress < .75 ? "wipe" : "finish");
          ctx.fillStyle = background; ctx.fillRect(0, 0, w, h);
          ctx.save(); ctx.beginPath();
          let visible = false;
          for (const dot of dots) {
            const radius = maxRadius * growthAt(progress, dot.field);
            if (radius < .05) continue;
            visible = true;
            ctx.moveTo(dot.x + radius, dot.y);
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
          }
          ctx.clip();
          if (visible) ctx.drawImage(image, ix, iy, iw, ih);
          ctx.restore();
        }
      } catch { finish(); return; }
      if (progress === 1) finish();
      else raf = requestFrame(draw);
    }
    draw(0);
    start = undefined;
    return { cancel: finish };
  } catch {
    finish();
    return { cancel: finish };
  }
}
