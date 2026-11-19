import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), root, 'exact authorized cwd required');
const output = path.join(root,
  '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n39-choice-affected-author');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const write = (name, value, raw = false) => {
  const destination = path.join(output, name);
  assert.equal(path.dirname(destination), output);
  fs.writeFileSync(destination, raw ? value : JSON.stringify(value, null, 2) + '\n',
    { flag: 'wx' });
};
const draftBytes = fs.readFileSync(path.join(output, 'draft.json'));
const viewBytes = fs.readFileSync(path.join(output, 'reviewer-views.json'));
const seedBytes = fs.readFileSync(path.join(output, 'seed.json'));
const draft = JSON.parse(draftBytes);
const views = JSON.parse(viewBytes);
assert.deepEqual(views, draft.questions.map(({ id, view }) => ({ id, view })));
const proof = JSON.parse(fs.readFileSync(path.join(output, 'preservation-proof.json')));
assert.equal(proof.unchanged_questions.length, 19);
assert.equal(proof.counts.affected_content_replacements, 5);
const args = [
  '-B', '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', root,
  '--seed', path.join(output, 'seed.json'),
  '--draft', path.join(output, 'draft.json'),
];
const started = new Date().toISOString();
// The exclusive start receipt prevents a second invocation; -B prevents writes
// to the checker's module directory. No review is read or passed to the checker.
write('structural-validation-start.json', {
  schema: 'n39-affected-validator-once-start@1',
  started_at: started,
  invocation: 1,
  command: ['python3', ...args],
  cwd: root,
  seed_file_sha256: sha(seedBytes),
  draft_file_sha256: sha(draftBytes),
  view_projection_file_sha256: sha(viewBytes),
  review_argument: null,
  python_bytecode_writes_disabled: true,
});
const result = spawnSync('python3', args, {
  cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
});
write('structural-validation.stdout.txt', result.stdout ?? '', true);
write('structural-validation.stderr.txt', result.stderr ?? '', true);
write('structural-validation.json', {
  schema: 'n39-affected-validator-once-result@1',
  started_at: started,
  finished_at: new Date().toISOString(),
  invocations: 1,
  command: ['python3', ...args],
  cwd: root,
  exit_code: result.status,
  signal: result.signal,
  execution_error: result.error?.message ?? null,
  stdout: result.stdout ?? '',
  stderr: result.stderr ?? '',
  structural_checks_succeeded: result.status === 0 && !result.error,
  semantic_review: 'still required; no independent PASS claimed',
  seed_file_sha256: sha(seedBytes),
  draft_file_sha256: sha(draftBytes),
  view_projection_file_sha256: sha(viewBytes),
});
assert.deepEqual(fs.readFileSync(path.join(output, 'draft.json')), draftBytes);
assert.deepEqual(fs.readFileSync(path.join(output, 'reviewer-views.json')), viewBytes);
assert.deepEqual(fs.readFileSync(path.join(output, 'seed.json')), seedBytes);

const first = JSON.parse(fs.readFileSync(path.join(output, 'FIRST-receipt.json')));
const currentInputBindings = first.inputs.map(item => ({
  name: item.name,
  source: item.source,
  first_sha256: item.sha256,
  current_sha256: sha(fs.readFileSync(item.source)),
  unchanged: sha(fs.readFileSync(item.source)) === item.sha256,
}));
const listFiles = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    assert.equal(fs.lstatSync(absolute).isSymbolicLink(), false, 'no symlinks in owned output');
    return entry.isDirectory() ? listFiles(absolute) : [absolute];
  }).sort();
const artifacts = listFiles(output).map(absolute => {
  fs.chmodSync(absolute, 0o444);
  const bytes = fs.readFileSync(absolute);
  return {
    path: path.relative(output, absolute),
    absolute_path: absolute,
    bytes: bytes.length,
    sha256: sha(bytes),
    mode: '0444',
  };
});
write('freeze-receipt.json', {
  schema: 'n39-affected-author-freeze@1',
  frozen_at: new Date().toISOString(),
  cwd: root,
  write_root: output,
  counts: proof.counts,
  structural_validator_invocations: 1,
  structural_validator_exit_code: result.status,
  structural_checks_succeeded: result.status === 0 && !result.error,
  semantic_review: 'pending independent affected review; not an independent PASS',
  current_author_input_bindings: currentInputBindings,
  all_allowed_inputs_unchanged_since_FIRST: currentInputBindings.every(item => item.unchanged),
  snapshot_policy: 'Exact-byte FIRST snapshots remain unmodified. All owned files frozen0444.',
  hash_manifest_policy: 'This receipt lists all prior files; SHA256SUMS also binds this receipt. SHA256SUMS does not hash itself.',
  draft_file_sha256: sha(draftBytes),
  seed_file_sha256: sha(seedBytes),
  reviewer_views_file_sha256: sha(viewBytes),
  files: artifacts,
  new_source_solves: 0, new_image_loads: 0, new_renders: 0,
  independent_review_complete_sets_or_math_read: false,
  durable_answers_read: false,
  durable_writes: 0,
});
fs.chmodSync(path.join(output, 'freeze-receipt.json'), 0o444);
const frozenFiles = listFiles(output);
write('SHA256SUMS', frozenFiles.map(absolute =>
  `${sha(fs.readFileSync(absolute))}  ${path.relative(output, absolute)}`).join('\n') + '\n', true);
fs.chmodSync(path.join(output, 'SHA256SUMS'), 0o444);
for (const absolute of listFiles(output)) {
  assert.equal(fs.statSync(absolute).mode & 0o777, 0o444, `not frozen: ${absolute}`);
}
for (const entry of artifacts) {
  assert.equal(sha(fs.readFileSync(entry.absolute_path)), entry.sha256);
}
console.log(JSON.stringify({
  structural_validator_invocations: 1,
  structural_validator_exit_code: result.status,
  structural_stdout: result.stdout ?? '',
  semantic_review: 'pending; no independent PASS',
  all_inputs_unchanged: currentInputBindings.every(item => item.unchanged),
  all_owned_files_mode: '0444',
  frozen_file_count: listFiles(output).length,
  draft_sha256: sha(draftBytes),
  view_projection_sha256: sha(viewBytes),
  freeze_receipt_sha256: sha(fs.readFileSync(path.join(output, 'freeze-receipt.json'))),
  SHA256SUMS_sha256: sha(fs.readFileSync(path.join(output, 'SHA256SUMS'))),
}, null, 2));
if (result.status !== 0 || result.error || !currentInputBindings.every(item => item.unchanged)) {
  process.exitCode = 1;
}
