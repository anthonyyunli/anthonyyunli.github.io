import test from 'node:test';
import assert from 'node:assert/strict';
import { furCharacter } from '../src/lib/fur-shading.js';

function sample(brightness, flowX, flowY) {
  const result = [];
  for (let y = 0; y < 24; y++) for (let x = 0; x < 32; x++) result.push(furCharacter(brightness, 1, flowX, flowY, x, y));
  return result;
}

test('transparent background stays empty even at shadow brightness', () => {
  for (const brightness of [0, .4, 1]) assert.equal(furCharacter(brightness, 0, 1, 1, 4, 8), ' ');
});

test('mid-tone strokes follow the two diagonal flow directions', () => {
  const down = sample(.5, 1, 1);
  const up = sample(.5, 1, -1);
  assert.ok(down.filter(c => c === '\\').length > down.filter(c => c === '/').length * 3);
  assert.ok(up.filter(c => c === '/').length > up.filter(c => c === '\\').length * 3);
});

test('vertical fur favors thin vertical strands', () => {
  const chars = sample(.5, .1, 1);
  assert.ok(chars.filter(c => '|lI!1'.includes(c)).length > chars.length / 2);
});

test('highlights have gaps and fine tips; shadows use dense undercoat', () => {
  const light = sample(.94, 1, 1);
  const dark = sample(.05, 1, 1);
  assert.ok(light.filter(c => c === ' ').length > light.length / 2);
  assert.ok(dark.filter(c => '%&@'.includes(c)).length > dark.length * .8);
  assert.equal(light.filter(c => '%&@'.includes(c)).length, 0);
});

test('neighbor jitter varies the texture while remaining stable between frames', () => {
  const a = sample(.5, 1, 1);
  assert.ok(new Set(a).size >= 4);
  assert.deepEqual(a, sample(.5, 1, 1));
});
