import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projectShareLinks } from '../src/domain/projectSharing.ts';

test('every sharing action preserves the complete Pages URL and safely encodes the title', () => {
  const title = 'Verismo & cultura — Giovanni Verga';
  const url = 'https://orioncoding28.github.io/Portfolio-React/projects/progetto-parco-del-verismo';
  const links = projectShareLinks(title, url);
  assert.equal(new URL(links.whatsapp).searchParams.get('text'), `${title} — ${url}`);
  assert.equal(new URL(links.linkedin).searchParams.get('url'), url);
  assert.equal(new URL(links.x).searchParams.get('url'), url);
  assert.equal(new URL(links.x).searchParams.get('text'), title);
  for (const link of Object.values(links)) assert.equal(new URL(link).protocol, 'https:');
});
