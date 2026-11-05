import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPublishedProjects, getAdjacentProjectIndex } from '../src/domain/projects.ts';
import { projectsIT, projectsEN } from '../src/data/portfolioData.ts';

test('only delivered Parco is public in both languages', () => {
  for (const projects of [projectsIT, projectsEN]) {
    assert.deepEqual(getPublishedProjects(projects).map(project => project.slug), ['progetto-parco-del-verismo']);
  }
});
test('new published entries are sorted without changing the source or exposing drafts', () => {
  const source = [{ slug:'later',order:3,status:'published' as const },{ slug:'private',order:1,status:'draft' as const },{ slug:'first',order:2,status:'published' as const }];
  assert.deepEqual(getPublishedProjects(source).map(project => project.slug), ['first','later']);
  assert.deepEqual(source.map(project => project.slug), ['later','private','first']);
  assert.deepEqual(getPublishedProjects([]), []);
});

test('carousel wraps in either direction and handles a single or empty catalog', () => {
  assert.equal(getAdjacentProjectIndex(0, -1, 4), 3);
  assert.equal(getAdjacentProjectIndex(3, 1, 4), 0);
  assert.equal(getAdjacentProjectIndex(1, 1, 4), 2);
  assert.equal(getAdjacentProjectIndex(0, 1, 1), 0);
  assert.equal(getAdjacentProjectIndex(0, -1, 0), 0);
});
test('both languages reference the same two videos and matching posters', () => {
  const it = getPublishedProjects(projectsIT)[0];
  const en = getPublishedProjects(projectsEN)[0];
  assert.deepEqual(it.media, en.media);
  assert.ok(it.media?.desktopVideo?.endsWith('.mp4'));
  assert.ok(it.media?.mobileVideo?.endsWith('.mp4'));
  assert.ok(it.media?.desktopPoster && it.media?.mobilePoster);
});
