import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const group = `${ticket}/tmp/d1816-source302305-review`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const reportPath = `${group}/phase1-observation.json`;
assert.equal(hash(reportPath), '3004956265e0a54f32f738a46c0338847f2e6403b64c7387f7fc0cd29a3a553b');
const report = read(reportPath);
assert.equal(report.imageopens.actual_total, 8);
for (const item of report.page_readings) {
  assert.equal(hash(`${group}/${item.freeze_file}`), item.freeze_sha256);
}
const substitutions = {
  302: {
    b01: [{ from: 'D', to: '$D$', line: 1 }],
    b08: [{ from: 'F⃗', to: '$\\vec{F}$', line: 1 }],
    b09: [{ from: '4×10⁻⁸', to: '$4\\times 10^{-8}$', line: 4 }],
  },
  303: {},
  305: {
    b04: [{ from: 'AgBr', to: '$\\mathrm{AgBr}$', line: 1 }],
    b06: [{ from: '[a-SHAPED_LABEL]', to: 'а', line: 5, encodingConventionNotApproval: true }],
  },
};
const records = [];
for (const page of [302, 303, 305]) {
  const n = String(page).padStart(4, '0');
  const observationPath = `${group}/source${n}.freeze.json`;
  const observation = read(observationPath);
  const dir = `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/${n}`;
  const candidate = read(`${dir}/page.json`);
  assert.equal(candidate.meta.source.pdf_page, page);
  assert.equal(candidate.meta.render.sha256, observation.source.sha256);
  assert.equal(candidate.meta.printed_page, observation.printed_page);
  assert.equal(candidate.blocks.length, observation.blocks.length);
  const blockBindings = [];
  for (let index = 0; index < observation.blocks.length; index++) {
    const source = observation.blocks[index];
    const target = candidate.blocks[index];
    assert.equal(target.kind, source.kind);
    for (const flag of ['cont', 'open', 'samerow']) assert.equal(target[flag], !!source.flags?.[flag]);
    const expected = [...source.lines];
    for (const replacement of substitutions[page][source.id] || []) {
      const line = replacement.line - 1;
      assert.equal(expected[line].split(replacement.from).length, 2);
      expected[line] = expected[line].replace(replacement.from, replacement.to);
    }
    for (const span of source.heavy_spans_certain || []) {
      if (/^h[123]$/.test(source.kind)) continue;
      const line = span.line - 1;
      let at = -1;
      for (let occurrence = 0; occurrence < (span.occurrence || 1); occurrence++) {
        at = expected[line].indexOf(span.text, at + 1);
        assert(at >= 0, `Missing bound emphasis occurrence: ${page}/${source.id}`);
      }
      expected[line] = expected[line].slice(0, at) + `**${span.text}**`
        + expected[line].slice(at + span.text.length);
    }
    assert.deepEqual(target.lines, expected, `Candidate differs from frozen reading: p${n}#${index + 1}`);
    if (source.figure_id) assert.equal(target.label, source.figure_id);
    blockBindings.push({ ref: `p${n}#${index + 1}`, kind: target.kind, printedLines: expected.length,
      literalBinding: 'pass', encodingConvention: page === 305 && source.id === 'b06' ? 'pending-independent-resolution' : null });
  }
  const native = `${ticket}/tmp/d1814-recovery/native/d040-source${page}-first-finalize/receipt.json`;
  assert.equal(read(native).exitCode, 0);
  records.push({ page, observation: bind(observationPath), candidate: bind(`${dir}/page.json`),
    markdown: bind(`${dir}/page.md`), audit: bind(`${dir}/audit.json`), native: bind(native),
    blockBindings, candidateLiteralBinding: 'pass', wholePageSourceApproval: false });
}
const output = `${ticket}/tmp/d1814-recovery/d040-source302305-bindings.json`;
assert(!fs.existsSync(output), 'Preserve first source-binding receipt');
fs.writeFileSync(output, JSON.stringify({
  schema: 'STEMROBIN-181/frozen-source-candidate-binding@1', batch: 'D040',
  phase1: bind(reportPath), records,
  missingCanonical304: 'No canonical placeholder or guessed nu/v inserted; source formula HOLD remains.',
  holds: report.concrete_blockers.filter(row => ['HOLD', 'UNRESOLVED', 'OPEN'].includes(row.status)),
  figures: 'Native crop/vectorization success is not independent crop or SOURCE approval.',
  sourcePagesAdded: 0, completeCardsAdded: 0, parentNewImageOpens: 0,
  paidCalls: 0, databaseWrites: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: bind(output), sourcePagesAdded: 0, completeCardsAdded: 0, literalBinding: 'pass', sourceApproval: false }));
