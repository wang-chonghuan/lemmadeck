import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const root = path.join(base, 'n45-offline');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const evidencePath = path.join(root, 'evidence.json');
const evidence = read(evidencePath);
const receiptPath = path.join(base, 'stages/n45-first-offline-check-nov21.receipt.json');
const receipt = read(receiptPath);
assert.equal(receipt.exitCode, 1);
assert.equal(evidence.assertionVerdict, 'FAIL');
assert.deepEqual(evidence.failures.map(({ name }) => name), [
  'desktop-written: written prose preserved',
  'mobile-written: written prose preserved',
]);
const inputs = Object.fromEntries(Object.entries(evidence.inputs).map(([name, row]) => {
  const current = bind(row.path);
  assert.equal(current.sha256, row.sha256, name);
  assert.equal(current.bytes, row.bytes, name);
  return [name, current];
}));
const norm = value => value.replace(/\*\*([^*]+)\*\*/gu, '$1')
  .replace(/\s+/gu, ' ').trim();
const exercises = read(evidence.inputs.exercises.path).exercises;
const exercise = exercises.find(({ number }) => number === '374');
assert(exercise);
assert(exercise.text.startsWith('374. '));
const checks = ['desktop-written', 'mobile-written'].map(id => {
  const view = evidence.views.find(view => view.id === id);
  const row = view.dom.written.find(({ id }) => id === 'ex-374');
  assert.equal(row.number, '374.');
  assert.equal(row.visible, true);
  const observed = norm(`${row.number} ${row.text}`);
  const expected = norm(exercise.text);
  assert.equal(observed, expected, id);
  // An omitted label or changed body must still fail this corrected comparison.
  assert.notEqual(norm(row.text), expected);
  assert.notEqual(norm(`${row.number} ${row.text} changed`), expected);
  return { id, exercise: '374', numberLabel: row.number, renderedBody: row.text,
    observed, expected, verdict: 'PASS',
    negativeControls: ['Missing number label rejected', 'Changed body rejected'] };
});
const output = {
  status: 'AFFECTED_WRITTEN_NUMBER_COMPARISONS_PASS_ORIGINAL_BROWSER_FAILURE_RETAINED',
  at: new Date().toISOString(),
  originalStage: receipt.stage,
  originalStageExit: receipt.exitCode,
  originalFailures: evidence.failures,
  correctedAssertionVerdict: 'PASS',
  unresolvedFailures: [],
  affectedChecks: checks,
  bindings: { evidence: bind(evidencePath), diagnosis: bind(path.join(root, 'diagnosis.json')),
    firstReceipt: bind(receiptPath), script: bind(import.meta.filename),
    firstStdout: bind(path.join(base, 'stages/n45-first-offline-check-nov21.stdout')),
    firstStderr: bind(path.join(base, 'stages/n45-first-offline-check-nov21.stderr')), inputs },
  fullParentTextIntake: ['597b19', 'f6eedf'],
  browserRuns: 0, targetNavigations: 0, screenshotsCaptured: 0,
  screenshotReadsOrDecodes: 0, parentImagesOrDecodes: 0,
  passedAssertionReplays: 0, sourceOrProductChanges: 0,
  visualVerdict: 'PENDING_SAME_CHILD_FIRST_SIX_SCREENSHOT_VIEWS',
};
const outputPath = path.join(root, 'written-number-recovery.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n',
  { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify({ ...bind(outputPath), status: output.status,
  checks: checks.length, originalStageExit: 1, correctedAssertionVerdict: 'PASS',
  newBrowserRuns: 0, passedAssertionReplays: 0 }));
