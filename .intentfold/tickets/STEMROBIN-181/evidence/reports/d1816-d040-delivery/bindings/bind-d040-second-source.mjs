import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const group = `${ticket}/tmp/d1816-source306309-review`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const phase = `${group}/phase1-observation.json`;
assert.equal(hash(phase), '03b23f776b7e368b8501b7a0197eadb7d2b24af9695a9b0af825ce9972e0208e');
const report = read(phase);
assert.equal(report.image_budget.total_this_batch_and_context, 8);
for (const item of report.freeze_evidence) assert.equal(hash(item.path), item.sha256);
for (const item of report.focus_reports) assert.equal(hash(item.path), item.sha256);
const first = read(`${group}/focus-append001.json`);
const convention = read(`${group}/focus-append002-convention.json`);
assert(convention.narrower_resolutions.every(row => row.physical_reading_hold === false));
const decisions = [
  ...read(`${scratch}/d040-source306-author-decisions.json`).pages,
  ...read(`${scratch}/d040-source307-author-decisions.json`).pages,
  ...read(`${scratch}/d040-source308309-author-decisions.json`).pages,
];
const records = [];
for (const decision of decisions) {
  const page = decision.page;
  const observation = read(decision.observation);
  const dir = `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/${String(page).padStart(4, '0')}`;
  const candidate = read(`${dir}/page.json`);
  assert.equal(candidate.meta.render.sha256, observation.source.sha256);
  assert.equal(candidate.meta.printed_page, observation.printed_page);
  assert.equal(candidate.blocks.length, observation.blocks.length);
  for (let index = 0; index < observation.blocks.length; index++) {
    const source = observation.blocks[index];
    const target = candidate.blocks[index];
    assert.equal(target.kind, source.kind);
    for (const flag of ['cont', 'open', 'samerow']) assert.equal(target[flag], !!source.flags?.[flag]);
    const expected = [...source.lines];
    for (const change of decision.blocks?.[source.id]?.substitutions || []) {
      const line = change.line - 1;
      assert.equal(expected[line].split(change.from).length, 2);
      expected[line] = expected[line].replace(change.from, change.to);
    }
    const spans = [...source.heavy_spans_certain];
    if (page === 307) {
      spans.push(...first.results.find(row => row.id === 'focus307-text').heavy_spans_certain
        .filter(span => span.block === source.id));
    }
    for (const span of spans) {
      if (/^h[123]$/.test(source.kind) || source.kind === 'exhead') continue;
      assert.equal(span.occurrence || 1, 1);
      const line = span.line - 1;
      assert(expected[line].includes(span.text));
      expected[line] = expected[line].replace(span.text, `**${span.text}**`);
    }
    assert.deepEqual(target.lines, expected, `Frozen-source mismatch: ${page}/${source.id}`);
    if (source.figure_id) assert.equal(target.label, source.figure_id);
    if (source.kind === 'ex') assert.equal(String(target.label), String(source.number));
  }
  const label = page === 307 ? 'd040-source307-focused-emphasis-finalize' : `d040-source${page}-first-finalize`;
  const native = `${scratch}/native/${label}/receipt.json`;
  assert.equal(read(native).exitCode, 0);
  const expectedRows = observation.line_accounting.unique_printed_text_rows;
  assert.equal(candidate.meta.printed_lines, expectedRows);
  records.push({ page, expectedRows, observation: bind(decision.observation),
    markdown: bind(`${dir}/page.md`), candidate: bind(`${dir}/page.json`), audit: bind(`${dir}/audit.json`),
    native: bind(native), literalAndDeclaredTypographyBinding: 'pass', wholePageApproval: false });
}
const output = `${scratch}/d040-source306309-bindings.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  schema: 'STEMROBIN-181/frozen-source-candidate-binding@1', batch: 'D040',
  phase1: bind(phase), focus: report.focus_reports, records,
  composition: {
    n118: {
      text: 'PASS: complete original prose and five written questions match independent frozen readings, confirmed 音道 emphasis and source-role-bound nu transcription.',
      sourceObjects: ['p0306#7-8', 'p0307#1-8', 'p0308#1-9'],
      raw: 'PENDING independent source-PNG/crop/SVG review of figures245/246. Pixel preservation, not ideal aperture/component interpretation, must be checked.',
      completeCard: false,
    },
    exercise12: {
      literalTextAndNumbers: 'PASS candidate binding; no mathematical value, unit or exponent changed.',
      typography: 'HOLD: original question7 intentional bold endpoints are still unresolved.',
      rightBoundary: 'PENDING actual following chapter observation, not inferred from TOC.',
      completeCard: false,
    },
  },
  preservedHolds: ['source304 quantum-letter', 'source309 question7 typography',
    'source245 exact inner aperture/component identity; no imagined source geometry'],
  sourcePagesAdded: 0, completeCardsAdded: 0, parentNewImageOpens: 0, paidCalls: 0,
  databaseWrites: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: bind(output), literalBinding: 'pass', n118RawPending: true, exercise12HoldPreserved: true, addedCards: 0 }));
