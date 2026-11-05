/** Drafts stay in the data, but never appear in the public catalog, routes or terminal. */
export function getPublishedProjects<T extends { status?: 'published' | 'draft'; order: number }>(projects: readonly T[]): T[] {
  return projects.filter(project => project.status !== 'draft').sort((left, right) => left.order - right.order);
}

/** Manual cyclic navigation; an empty catalog has no selectable index. */
export function getAdjacentProjectIndex(index: number, direction: -1 | 1, count: number): number {
  return count > 1 ? ((index + direction) % count + count) % count : 0;
}
