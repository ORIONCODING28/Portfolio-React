/** Progress through a model's passage across the viewport, independent of time. */
export function deviceScrollProgress(top: number, height: number, viewportHeight: number): number {
  if (height <= 0 || viewportHeight <= 0) return .5;
  const start = viewportHeight * .86;
  return Math.max(0, Math.min(1, (start - top) / (start + height * .65)));
}

/** Settle into a broad reading zone, with zero velocity at both phase boundaries. */
export function deviceScrollMotion(progress: number, quick = false): { arrival: number; departure: number } {
  const smooth = (value: number) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  };
  const entryEnd = quick ? .28 : .4;
  const exitStart = quick ? .9 : .8;
  return { arrival: 1 - smooth(progress / entryEnd), departure: smooth((progress - exitStart) / (1 - exitStart)) };
}
