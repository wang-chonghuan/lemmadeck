const assert = require('node:assert/strict');
const test = require('node:test');
const { proseFlow } = require('../tools/htmlfrag.js');

test('shared prose figure follows all paragraphs without moving section anchors', () => {
  const blocks = [
    { kind: 'p', text: 'First.\n\nSecond.', figures: [{ id: 'fig-03', label: 'Figure 3' }] },
    { kind: 'p', text: 'Third.' },
  ];
  const flow = proseFlow(blocks, [{ before: 'Second.', after: 'Third.' }]);
  assert.deepEqual(flow.map(item => item.kind), ['p', 'p', 'fig', 'p']);
  assert.deepEqual(flow.filter(item => item.kind === 'p').map(item => item.text),
    ['First.', 'Second.', 'Third.']);
  assert.equal(flow[2].id, 'fig-03');
  assert.equal(flow[3].sectionBreak, true);
  assert.equal(flow[1].sectionBreak, undefined);
});

test('unaffected prose and owned figures preserve their flow', () => {
  const blocks = [{ kind: 'p', text: 'Text.' }, { kind: 'fig', id: 'fig-01' }];
  assert.deepEqual(proseFlow(blocks), blocks);
});
