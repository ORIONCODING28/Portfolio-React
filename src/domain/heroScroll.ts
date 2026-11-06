const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** A centred galaxy, not an oversized opening sphere. */
export function heroOpeningScale(width: number, height: number, viewportWidth: number, availableHeight: number) {
  if (width <= 0 || height <= 0) return 1;
  return Math.max(.65, Math.min(1.3, (viewportWidth - 32) / width, (availableHeight - 100) / height));
}

/** Short gestures finish the intro; no extra hold after the galaxy is formed. */
export function heroScrollDistance(width: number, viewportHeight: number) {
  return Math.max(120, Math.min(width < 640 ? 180 : width < 1024 ? 230 : 320, viewportHeight * (width < 640 ? .22 : .38)));
}

/** Formation finishes before the assembled galaxy travels into the resting layout. */
export function heroScrollFrame(scroll: number, start: number, distance: number) {
  const progress = distance > 0 ? clamp((scroll - start) / distance) : 1;
  return {
    progress,
    formation: smooth((progress - .02) / .6),
    remaining: 1 - smooth((progress - .62) / .38),
    copy: smooth((progress - .7) / .28),
  };
}
