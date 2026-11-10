export function caseReadingPosition({ offsets, scrollY, readingLine, bottom, viewportHeight }) {
  const cursor = scrollY + readingLine;
  let active = 0;
  for (let index = 0; index < offsets.length; index++) {
    if (offsets[index] <= cursor + 2) active = index;
    else break;
  }
  const start = offsets[0] - readingLine;
  const end = Math.max(start + 1, bottom - viewportHeight + 32);
  const progress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)));
  return { active, progress };
}
