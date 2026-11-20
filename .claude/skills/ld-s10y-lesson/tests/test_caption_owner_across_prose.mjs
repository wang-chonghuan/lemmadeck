import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { proseFlow } = require('../tools/htmlfrag.js');
const label = number => `Figure ${number}`;
const figure = number => ({ kind: 'fig', id: `fig-${number}`, label: label(number) });
const caption = number => ({ kind: 'cap', label: label(number), text: label(number) });

test('a uniquely labelled earlier figure owns its caption across prose', () => {
  const first = figure(27);
  const paragraph = { kind: 'p', text: 'The switch charges the capacitor.' };
  const firstCaption = caption(27);
  const second = figure(28);
  const secondCaption = caption(28);
  const flow = proseFlow([first, paragraph, firstCaption, second, secondCaption]);
  assert.deepEqual(flow.map(item => item.kind), ['fig', 'cap', 'p', 'fig', 'cap']);
  assert.equal(flow[1], firstCaption);
  assert.equal(flow[2].text, paragraph.text);
  assert.equal(flow[4], secondCaption);
});

test('adjacent owners still resolve identical unnumbered table labels locally', () => {
  const one = { kind: 'fig', id: 'table-one', label: 'Table' };
  const two = { kind: 'fig', id: 'table-two', label: 'Table' };
  const capOne = { kind: 'cap', label: 'Table', text: 'First table' };
  const capTwo = { kind: 'cap', label: 'Table', text: 'Second table' };
  const flow = proseFlow([one, capOne, { kind: 'p', text: 'Next topic.' }, two, capTwo]);
  assert.equal(flow[1], capOne);
  assert.equal(flow[4], capTwo);
});

test('ambiguous nonlocal caption ownership fails', () => {
  const blocks = [figure(27), { kind: 'p', text: 'First topic.' }, figure(27),
    { kind: 'p', text: 'Second topic.' }, caption(27), figure(28), caption(28)];
  assert.throws(() => proseFlow(blocks), /must match exactly one/);
});

test('a missing caption owner is not silently assigned to its neighbour', () => {
  assert.throws(() => proseFlow([caption(27), figure(28), caption(28)]),
    /must match exactly one/);
});
