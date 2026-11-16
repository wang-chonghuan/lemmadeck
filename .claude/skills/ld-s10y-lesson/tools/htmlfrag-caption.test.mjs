import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const { proseFlow } = createRequire(import.meta.url)('./htmlfrag.js');
const figure = number => ({ kind: 'fig', id: `fig-${number}`, label: `Figure ${number}` });
const caption = number => ({ kind: 'cap', label: `Figure ${number}`, text: `Figure ${number}` });

test('consecutive figures receive their own captions without changing source objects', () => {
  const input = [figure(156), figure(157), caption(156), caption(157)];
  const before = structuredClone(input);
  const result = proseFlow(input);
  assert.deepEqual(result, [input[0], input[2], input[1], input[3]]);
  assert.deepEqual(input, before);
});

test('already adjacent figure captions and uncaptained media stay unchanged', () => {
  const input = [figure(153), caption(153), figure(154), caption(154), figure(155)];
  assert.deepEqual(proseFlow(input), input);
});

test('caption association stays within media groups and preserves paragraph boundaries', () => {
  const first = { kind: 'p', text: 'First.\n\nSecond.' };
  const next = { kind: 'p', text: 'Third.' };
  const media = [figure(156), figure(157), caption(156), caption(157)];
  const result = proseFlow([first, ...media, next], [{ before: 'Second.', after: 'Third.' }]);
  assert.deepEqual(result.filter(block => block.kind === 'p').map(block => ({
    text: block.text, sectionBreak: block.sectionBreak ?? false,
  })), [
    { text: 'First.', sectionBreak: false },
    { text: 'Second.', sectionBreak: false },
    { text: 'Third.', sectionBreak: true },
  ]);
  assert.deepEqual(result.slice(2, 6), [media[0], media[2], media[1], media[3]]);
});

test('unknown and ambiguous caption ownership fails explicitly', () => {
  assert.throws(() => proseFlow([figure(156), caption(157)]), /exactly one adjacent figure/);
  assert.throws(() => proseFlow([figure(156), figure(156), caption(156)]), /exactly one adjacent figure/);
});

test('standalone captions and shared prose media retain existing behavior', () => {
  const cap = caption(160);
  assert.deepEqual(proseFlow([cap]), [cap]);
  const shared = { kind: 'p', text: 'Text.', figures: [{ id: 'fig-158', label: 'Figure 158' }] };
  const result = proseFlow([shared]);
  assert.equal(result[0].text, 'Text.');
  assert.deepEqual(result[1], { ...shared.figures[0], kind: 'fig' });
});
