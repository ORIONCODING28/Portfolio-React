import { test } from 'node:test';
import assert from 'node:assert/strict';
import { terminalResponse } from '../src/domain/terminal.ts';
const context = { language: 'it' as const, biography: 'Percorso concluso.', projects: [{ title: 'Parco', slug: 'parco' }], email: 'example@example.com' };
test('clear removes history and aliases are case insensitive', () => {
  assert.equal(terminalResponse(' CLS ', context), null);
  assert.match(terminalResponse('HELP', context)!, /projects/);
});
test('project and contact responses use the provided content', () => {
  assert.match(terminalResponse('projects', context)!, /\/projects\/parco/);
  assert.match(terminalResponse('contact', context)!, /example@example.com/);
});
test('unknown input stays text and has recovery instructions', () => {
  const value = '<script>alert(1)</script>';
  assert.match(terminalResponse(value, context)!, /Digita help/);
  assert.ok(terminalResponse(value, context)?.includes(value));
});

test('slash commands and Italian aliases retain the same responses', () => {
  for (const [alias, original] of [[' /HELP ', 'help'], ['/progetti', 'projects'], ['tecnologie', 'stack'], ['/contatti', 'contact'], ['/cls', 'clear']]) {
    assert.equal(terminalResponse(alias, context), terminalResponse(original, context));
  }
  assert.match(terminalResponse('/help', { ...context, language: 'en' })!, /Current visitor/);
});
