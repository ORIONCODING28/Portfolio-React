/** Progress through a model's passage across the viewport, independent of time. */
export function deviceScrollProgress(top: number, height: number, viewportHeight: number): number {
  if (height <= 0 || viewportHeight <= 0) return .5;
  const start = viewportHeight * .86;
  return Math.max(0, Math.min(1, (start - top) / (start + height * .65)));
}

/** Settle into a broad reading zone, with zero velocity at both phase boundaries. */
export function deviceScrollMotion(progress: number, staticReading = false): { arrival: number; departure: number } {
  if (staticReading) return { arrival: 0, departure: 0 };
  const smooth = (value: number) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  };
  return { arrival: 1 - smooth(progress / .36), departure: smooth((progress - .8) / .2) };
}
