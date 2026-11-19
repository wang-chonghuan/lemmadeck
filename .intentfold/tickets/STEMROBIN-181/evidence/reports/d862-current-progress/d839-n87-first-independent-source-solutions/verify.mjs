import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, readFile, realpath, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const output = path.join(
  R,
  '.intentfold/tickets/STEMROBIN-181/tmp/d839-n87-first-independent-source-solutions',
);
const expectedBeforeFreeze = ['source-solutions.json', 'source-solutions.md', 'verify.mjs'];
const checks = [];
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const check = (name, action) => {
  action();
  checks.push({ name, result: 'PASS' });
};

assert.equal(process.cwd(), R);
assert.equal(path.dirname(fileURLToPath(import.meta.url)), output);
assert.equal(await realpath(R), R);
assert.equal(await realpath(output), output);
assert.deepEqual((await readdir(output)).sort(), expectedBeforeFreeze.sort(),
  'Fresh, one-shot freeze only; do not overwrite an existing frozen bundle.');
for (const name of expectedBeforeFreeze) {
  assert.equal((await lstat(path.join(output, name))).isFile(), true);
}
checks.push({ name: 'Explicit sole workdir, nonsymlink confined output, fresh bundle', result: 'PASS' });

const report = JSON.parse(await readFile(path.join(output, 'source-solutions.json'), 'utf8'));
const source = {};
const inputHashes = [];
for (const input of report.source_inputs) {
  assert.equal(input.path.startsWith(`${R}/.intentfold/tickets/STEMROBIN-181/tmp/d836-source233-consume-n87-prepare/`), true);
  assert.equal(await realpath(input.path), input.path);
  const bytes = await readFile(input.path);
  assert.equal(sha256(bytes), input.sha256, `Input changed: ${input.role}`);
  source[input.role] = JSON.parse(bytes.toString('utf8'));
  inputHashes.push({ path: input.path, sha256: input.sha256, unchanged_since_read: true });
}
checks.push({ name: 'Three authorized input SHA-256 values unchanged', result: 'PASS' });

const lesson = source['raw-source-lesson'];
const exercises = source['raw-source-exercises'];
const frozen = source['frozen-preauthor-source-requirements'];
check('Frozen source status and card identity', () => {
  assert.equal(frozen.status, 'SOURCE-CLOSED-PREAUTHOR-FROZEN');
  assert.equal(frozen.card, report.card);
  assert.equal(lesson.id, report.card);
  assert.equal(exercises.lesson, report.card);
});
check('All six original questions exactly covered and in source order', () => {
  assert.equal(lesson.exercise_count, 6);
  assert.equal(exercises.count, 6);
  assert.equal(frozen.sourceQuestions, 6);
  assert.equal(exercises.exercises.length, 6);
  assert.equal(report.solutions.length, 6);
  assert.deepEqual(report.solutions.map((q) => q.source_number), ['1', '2', '3', '4', '5', '6']);
  for (const [i, q] of report.solutions.entries()) {
    const raw = exercises.exercises[i];
    assert.equal(q.source_number, raw.source_number);
    assert.equal(q.original_question, raw.text);
    assert.deepEqual(q.source_refs, raw.pages);
    const blocks = raw.pages.map((ref) => frozen.blocks.find((b) => b.ref === ref));
    assert.equal(blocks.every(Boolean), true);
    assert.equal(blocks.every((b) => b.kind === 'ex' && b.label === raw.source_number), true);
    assert.deepEqual(raw.lines, blocks.flatMap((b) => b.lines));
    assert.equal(q.reasoning.length > 0, true);
    assert.equal(q.minimum_expected_scientific_response.length > 0, true);
    assert.equal(q.conditions_and_ambiguities.length > 0, true);
    assert.equal(q.units.length > 0, true);
  }
});
check('Zero required question diagrams and zero loaded images', () => {
  for (const q of exercises.exercises) {
    assert.deepEqual(q.figure_refs, []);
    assert.deepEqual(q.figures, []);
    assert.equal(/(?:图\s*\d+|fig(?:ure)?\s*\.?\s*\d+)/i.test(q.text), false);
  }
  assert.equal(frozen.blocks.filter((b) => b.kind === 'fig').every((b) => b.owner_exercise === null), true);
  assert.deepEqual(report.image_declaration.required_question_diagrams, []);
  assert.equal(report.image_declaration.images_loaded, 0);
  assert.equal(report.image_declaration.images_created, 0);
  assert.equal(report.solutions.every((q) => q.required_diagrams.length === 0), true);
});
check('Each cited source block exists within the supplied frozen boundary', () => {
  const refs = new Set(frozen.blocks.map((b) => b.ref));
  for (const q of report.solutions) {
    for (const ref of q.source_refs) assert.equal(refs.has(ref), true);
    for (const app of q.applications ?? []) {
      for (const ref of app.source_refs) assert.equal(refs.has(ref), true);
    }
  }
  for (const caution of report.source_science_cautions_not_source_edits) {
    for (const ref of caution.source_refs) assert.equal(refs.has(ref), true);
  }
  assert.deepEqual(frozen.boundary, {
    first: 'p0230#2',
    last: 'p0233#3',
    nextHeading: 'p0233#4',
  });
});
check('Q4 conditional film inference, Q5 frequency/visibility, Q6 actual source uses present', () => {
  assert.equal(report.solutions[3].inference_status.startsWith('Conditional'), true);
  assert.match(report.solutions[3].minimum_expected_scientific_response, /air gaps.*interfere/);
  assert.match(report.solutions[4].minimum_expected_scientific_response, /^No\..*frequency remains unchanged/);
  assert.equal(report.solutions[5].applications.length, 4);
  assert.equal(report.solutions[5].applications.every((app) => app.source_refs.length > 0), true);
});
check('No native grading or choice payload; independent evidence-only scope flags', () => {
  const forbiddenKeys = new Set(['correct_index', 'options', 'accept', 'interaction', 'grading', 'answer_key']);
  const walk = (value) => {
    if (value === null || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      assert.equal(forbiddenKeys.has(key), false, `Native/choice key found: ${key}`);
      walk(child);
    }
  };
  walk(report);
  for (const key of [
    'authored_n87_answers_read', 'authored_n87_choices_read',
    'other_lesson_answer_or_choice_content_read', 'book_answer_key_read',
    'native_or_modern_edition_content_read', 'prior_scientific_review_content_read',
    'intentfold_capability_invoked', 'ticket_backend_contacted',
  ]) assert.equal(report.independence[key], false);
  for (const key of [
    'modern_answer_key_created', 'choice_approval_given',
    'keyboard_or_free_input_grading_created', 'source_or_native_content_changed',
    'canonical_or_index_or_meter_changed', 'git_operations_performed',
    'database_operations_performed', 'publisher_or_deploy_operations_performed',
  ]) assert.equal(report.scope_outcome[key], false);
  assert.equal(report.scope_outcome.original_questions_solved, 6);
});

const reference46Found = [lesson, exercises, frozen.blocks]
  .some((value) => JSON.stringify(value).includes('reference46'));
check('Unlocated reference46 requirement is surfaced without invented content', () => {
  assert.equal(reference46Found, false);
  assert.equal(frozen.requirements.some((r) => r.includes('reference46')), true);
  assert.equal(report.source_science_cautions_not_source_edits.some((c) => c.observation.includes('reference46')), true);
});

const frozenAt = new Date().toISOString();
const usage = {
  ticket: report.ticket,
  assignment: report.assignment,
  card: report.card,
  status: 'FROZEN',
  frozen_at_utc: frozenAt,
  workdir: R,
  write_root: output,
  questions_solved: 6,
  qualitative_question_batches: 1,
  source_content_files_read: 3,
  authored_answer_or_choice_content_files_read: 0,
  images_loaded: 0,
  images_created: 0,
  image_limits: { per_batch: 8, context_total: 24 },
  web_search_tool_calls: 3,
  web_search_queries: 8,
  web_page_open_calls: 0,
  browser_calls: 0,
  paid_generation_calls: 0,
  paid_image_calls: 0,
  paid_model_api_calls: 0,
  publisher_calls: 0,
  database_calls: 0,
  git_calls: 0,
  new_branches: 0,
  new_worktrees: 0,
  other_chat_calls: 0,
  authored_manual_artifact_files: 3,
  mechanically_generated_artifact_files: 3,
  verification: { command: `node ${path.join(output, 'verify.mjs')}`, runs: 1 },
  token_usage: { input: null, output: null, total: null, reason: 'Exact runtime token telemetry is not exposed to this agent.' },
  runtime_cost: { amount: null, currency: null, reason: 'Runtime and search cost telemetry is unavailable; zero paid generation calls does not claim zero platform cost.' },
  elapsed_session_seconds: null,
  elapsed_session_seconds_reason: 'No exact session start timestamp was recorded; do not fabricate elapsed usage.',
  stop_boundary: 'Freeze evidence only. No source, native, canonical, meter, index, Git, DB, publisher, deployment or ticket finalization.',
};
const verification = {
  status: 'PASS',
  scope: 'Mechanical source identity, coverage, integrity, declarations and artifact confinement only; not scientific certification or choice approval.',
  verified_at_utc: frozenAt,
  checks,
  input_hashes: inputHashes,
  independence_and_no_operation_flags: 'Agent declarations, not a filesystem-wide forensic audit; no Git or out-of-scope inspection performed.',
  freeze_semantics: 'One-shot file/hash snapshot; no chmod, immutable filesystem flag or external lock.',
};

// Exclusive creation preserves any concurrent writer and keeps all generated files inside output.
const create = async (name, content) => {
  assert.equal(path.basename(name), name);
  assert.equal(await realpath(output), output);
  await writeFile(path.join(output, name), content, { flag: 'wx' });
};
await create('usage.json', `${JSON.stringify(usage, null, 2)}\n`);
await create('verification.json', `${JSON.stringify(verification, null, 2)}\n`);
const names = [
  'source-solutions.json', 'source-solutions.md', 'usage.json', 'verification.json', 'verify.mjs',
].sort();
const bundle = [];
for (const name of names) {
  const bytes = await readFile(path.join(output, name));
  bundle.push({ path: path.join(output, name), sha256: sha256(bytes), bytes: bytes.length });
}
await create('SHA256SUMS', `${bundle.map((file) => `${file.sha256}  ${path.basename(file.path)}`).join('\n')}\n`);
for (const file of bundle) {
  assert.equal(sha256(await readFile(file.path)), file.sha256);
}
const manifest = await readFile(path.join(output, 'SHA256SUMS'));
console.log(JSON.stringify({
  status: 'PASS-FROZEN-STOP',
  frozen_at_utc: frozenAt,
  checks: checks.length,
  questions: 6,
  images: 0,
  paid_generation_calls: 0,
  exact_tokens: 'unavailable',
  files: [
    ...bundle,
    { path: path.join(output, 'SHA256SUMS'), sha256: sha256(manifest), bytes: manifest.length },
  ],
}, null, 2));
