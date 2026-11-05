import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContact } from '../src/domain/contact.ts';
import type { ContactInput } from '../src/domain/contact.ts';
import { sendContact } from '../src/services/contact.ts';
const valid = { name: ' Giuseppe ', email: ' example@example.com ', subject: ' Opportunità ', message: ' Un messaggio abbastanza lungo. ' };
test('rejects whitespace-only fields and invalid email before delivery', async () => {
  let calls = 0;
  await assert.rejects(sendContact({ ...valid, name: '  ', email: 'invalid' }, async () => { calls++; }));
  assert.equal(calls, 0);
});
test('normalizes input and only resolves after real delivery succeeds', async () => {
  let payload: ContactInput | undefined;
  await sendContact(valid, async value => { payload = value; });
  assert.deepEqual(payload, { name: 'Giuseppe', email: 'example@example.com', subject: 'Opportunità', message: 'Un messaggio abbastanza lungo.' });
});
test('propagates delivery failures instead of simulating success', async () => {
  const failure = new Error('delivery failed');
  await assert.rejects(sendContact(valid, async () => { throw failure; }), error => error === failure);
});
test('enforces message size bounds', () => {
  assert.equal(validateContact({ ...valid, message: 'x'.repeat(5001) }).message, 'length');
  assert.equal(validateContact({ ...valid, message: 'short' }).message, 'message');
});


test('forwards the CAPTCHA token to delivery without adding it to message fields', async () => {
  let actualToken: string | undefined;
  let payload: ContactInput | undefined;
  await sendContact(valid, async (input, token) => { payload = input; actualToken = token; }, 'test-token');
  assert.equal(actualToken, 'test-token');
  assert.deepEqual(Object.keys(payload!).sort(), ['email', 'message', 'name', 'subject']);
});
