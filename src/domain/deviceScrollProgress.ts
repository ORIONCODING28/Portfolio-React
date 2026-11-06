/** Progress through a model's passage across the viewport, independent of time. */
export function deviceScrollProgress(top: number, height: number, viewportHeight: number): number {
  if (height <= 0 || viewportHeight <= 0) return .5;
  const start = viewportHeight * .86;
  return Math.max(0, Math.min(1, (start - top) / (start + height * .65)));
}
