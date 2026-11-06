const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Follow the model's centre, so it starts turning after the object is already visible. */
export function deviceScrollProgress(top: number, height: number, viewportHeight: number): number {
  if (height <= 0 || viewportHeight <= 0) return .5;
  const centre = top + height / 2;
  return clamp((viewportHeight * .86 - centre) / (viewportHeight * .72));
}

/** One continuous turn through a slower frontal reading position, with no stopped plateau. */
export function deviceScrollMotion(progress: number): { arrival: number; departure: number } {
  const position = clamp(progress) * 2 - 1;
  const turn = .22 * position + .78 * position ** 3;
  return { arrival: Math.max(0, -turn), departure: Math.max(0, turn) };
}
