const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** Frame the sphere, allowing its peripheral rings to extend beyond a narrow screen. */
export function heroOpeningScale(width: number, height: number, viewportWidth: number, availableHeight: number) {
  if (width <= 0 || height <= 0) return 1;
  // Camera fitting is limited by the rings on narrow canvases, by sphere height on wide ones.
  const diameter = Math.min(width * .5, height * .88);
  return Math.max(1, Math.min(2.8, (viewportWidth - 24) / diameter, (availableHeight - 128) / diameter));
}

/** A position, never a timer: reversing the scroll restores the exact same frame. */
export function heroScrollFrame(scroll: number, start: number, distance: number) {
  const progress = distance > 0 ? clamp((scroll - start) / distance) : 1;
  const arrival = smooth(progress);
  return { progress, remaining: 1 - arrival, copy: smooth((progress - .28) / .55) };
}
