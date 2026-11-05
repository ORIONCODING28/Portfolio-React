/** Wraps a page in either direction; a single-page carousel stays on page zero. */
export function cyclePage(index: number, count: number): number {
  const size = Math.max(1, count);
  return ((index % size) + size) % size;
}
