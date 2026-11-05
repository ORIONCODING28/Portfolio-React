export type SwipePoint = { x: number; y: number };
/** Horizontal gestures only; diagonal/vertical scrolling must keep its native behaviour. */
export function swipeDirection(start: SwipePoint, end: SwipePoint): -1 | 0 | 1 {
  const dx = end.x - start.x, dy = end.y - start.y;
  return Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.3 ? (dx < 0 ? 1 : -1) : 0;
}
