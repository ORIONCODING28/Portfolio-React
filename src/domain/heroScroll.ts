const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** A centred galaxy, not an oversized opening sphere. */
export function heroOpeningScale(width: number, height: number, viewportWidth: number, availableHeight: number) {
  if (width <= 0 || height <= 0) return 1;
  return Math.max(.65, Math.min(1.3, (viewportWidth - 32) / width, (availableHeight - 100) / height));
}

/** Formation finishes before the assembled galaxy travels into the resting layout. */
export function heroScrollFrame(scroll: number, start: number, distance: number) {
  const progress = distance > 0 ? clamp((scroll - start) / distance) : 1;
  return {
    progress,
    formation: smooth((progress - .05) / .4),
    remaining: 1 - smooth((progress - .45) / .55),
    copy: smooth((progress - .62) / .35),
  };
}
