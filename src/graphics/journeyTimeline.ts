export const JOURNEY_STAGE_SECONDS = 3.8;

/** Equal reading time for every milestone, including the final one. */
export function journeyProgress(elapsed: number, phases: readonly number[]): number {
  if (!phases.length) return 0;
  const rawStep = Math.max(0, elapsed) / JOURNEY_STAGE_SECONDS;
  const nearest = Math.round(rawStep);
  const step = (Math.abs(rawStep - nearest) < 1e-9 ? nearest : rawStep) % phases.length;
  const index = Math.floor(step);
  const next = phases[index + 1] ?? phases[index] + .18;
  return phases[index] + (next - phases[index]) * (step - index);
}

/** The closest milestone owns both its illumination and its caption. */
export function journeyActiveStage(progress: number, phases: readonly number[]): number {
  let active = 0, nearest = Infinity;
  phases.forEach((phase, index) => {
    const distance = Math.abs(phase - progress);
    if (distance <= nearest) { active = index; nearest = distance; }
  });
  return active;
}
