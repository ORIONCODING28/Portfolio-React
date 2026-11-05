import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPreviewCorrectionRate } from '../src/domain/previewPlayback.ts';

test('paired previews tolerate a frame difference without jittering playback speed', () => {
  assert.equal(getPreviewCorrectionRate(5, 5 + 1 / 60), 1);
  assert.equal(getPreviewCorrectionRate(5, 5 - 1 / 30), 1);
});
test('a drifting follower gently converges on the master instead of seeking continually', () => {
  assert.ok(getPreviewCorrectionRate(5, 5.1) < 1);
  assert.ok(getPreviewCorrectionRate(5, 4.9) > 1);
});
