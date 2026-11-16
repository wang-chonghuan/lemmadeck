import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const reportPath = `${ticket}/tmp/source-review-9p-0192-0195-correction.json`;
const tracePath = `${ticket}/tmp/d020-source192-finalization.json`;
await verify(reportPath, '54a2759f8f69bae9480c71258f5528280effadba6b8cb0d9fe14dac56e31c2ae');
assert.ok(!await exists(tracePath));
const report = await read(reportPath);
assert.equal(report.affected_correction_status, 'pass');
assert.equal(report.overall_status, 'blocked');
const approved = report.pages.find(page => page.page === 192);
assert.equal(approved.status, 'pass');
const draft = approved.bindings.correctedDraft;
for (const binding of Object.values(approved.bindings)) await verify(binding.path, binding.sha256);
const initial = report.bindings.initialIndependentReview;
await verify(initial.path, initial.sha256);
const figureGate = await read(initial.path);
const folder = `${book}/pages/0192`;
assert.ok(!await exists(folder));
await immutableWrite(`${folder}/page.md`, await bytes(draft.path));
const run = args => {
  const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python',
    ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args], { encoding: 'utf8' });
  process.stdout.write(output);
  return { command: args, output };
};
const finalization = run(['finalize', '--book', '9p', '--page', '192']);
await immutableWrite(`${ticket}/tmp/d020-source192-native-finalize.json`,
  `${JSON.stringify({ finalization }, null, 2)}\n`);
const audit = await read(`${folder}/audit.json`);
assert.deepEqual(audit.errors, []);
assert.equal(audit.lines_md, 17);
assert.equal(audit.lines_printed, 17);
for (const id of ['fig-145', 'fig-146']) {
  const figure = figureGate.figures.find(figure => figure.id === id);
  assert.equal(figure.status, 'pass');
  await verify(`.tmp/ld-s10y-lesson/9p/pages/0192/figures/${id}.png`, figure.candidate.sha256);
}
const vectorization = run(['vectorize', '--book', '9p', '--page', '192']);
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D020', status: 'pass-page-only-awaiting-next-assembly',
  sourceReview: await bind(reportPath), initialReview: initial, pdfPages: [192],
  finalization, vectorization, audit: await bind(`${folder}/audit.json`),
  pageJson: await bind(`${folder}/page.json`),
  approvedButUnfinalized: { page: 194, reason: 'Exercise3 remains open into blocked195 and references source figure148; defer whole-page integration until its boundary can assemble without fabricating missing facts.' },
  excluded: [193, 195],
  limits: 'One new approved-page native finalize/vectorize; no assembly, repeated review, images, browser, DB or full-project tests.',
}, null, 2)}\n`);
