/** Small clock drift is corrected with speed, never a seek on every frame. */
export function getPreviewCorrectionRate(masterTime: number, followerTime: number): number {
  const difference = followerTime - masterTime;
  if (Math.abs(difference) <= .04) return 1;
  return difference > 0 ? .98 : 1.02;
}
