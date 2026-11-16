import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const rel = path.relative(process.cwd(), root);
const archive = path.join(root, 'rejected-midpoint-before-repair');
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const bytes = filename => createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n');
const old = read(path.join(archive, 'draft.json'));
const current = read(path.join(root, 'draft.json'));
const plan = read(path.join(root, 'midpoint-repair-plan.json'));
const resultFile = path.join(root, 'validation-result-repaired.json');
assert(!fs.existsSync(resultFile), 'Changed snapshot structural execution already recorded; do not rerun');
assert(!fs.existsSync(path.join(root, 'midpoint-repair-delta.json')), 'Repair delta already finalized');

function differences(before, after, pointer = '') {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap(key => differences(before[key], after[key], `${pointer}/${key}`));
  }
  return [{ path: pointer, before, after }];
}

const allowedPaths = new Set();
const mappings = [];
for (const change of plan.changed_candidates) {
  const qi = old.questions.findIndex(q => q.id === change.question_id);
  assert(qi >= 0);
  assert.equal(current.questions[qi].id, change.question_id);
  const oi = old.questions[qi].view.options.findIndex(o => o.id === change.option_id);
  const ri = old.questions[qi].key.rationales.findIndex(r => r.option_id === change.option_id);
  assert(oi >= 0 && ri >= 0);
  assert.equal(old.questions[qi].key.rationales[ri].truth, 'incorrect');
  assert(!old.questions[qi].key.correct.includes(change.option_id));
  for (const suffix of [`view/options/${oi}/text`, `key/rationales/${ri}/derivation`, `key/rationales/${ri}/misconception`]) {
    allowedPaths.add(`/questions/${qi}/${suffix}`);
  }
  mappings.push({ question_index: qi, question_id: change.question_id, option_id: change.option_id, option_index: oi, rationale_index: ri });
}
const draftDelta = differences(old, current);
assert.equal(draftDelta.length, 24);
assert.deepEqual(new Set(draftDelta.map(d => d.path)), allowedPaths);
assert.deepEqual(old.coverage, current.coverage);
assert.deepEqual(old.new_figures, current.new_figures);
assert.equal(old.seed_sha256, current.seed_sha256);
const changedIds = new Set(plan.changed_candidates.map(c => c.question_id));
const unchangedIds = [];
for (let i = 0; i < old.questions.length; i += 1) {
  const a = old.questions[i], b = current.questions[i];
  assert.equal(a.id, b.id);
  assert.deepEqual(a.key.correct, b.key.correct);
  assert.deepEqual(a.intent, b.intent);
  assert.deepEqual(a.source_numbers, b.source_numbers);
  assert.equal(a.view.mode, b.view.mode);
  assert.equal(a.view.stem, b.view.stem);
  assert.deepEqual(a.view.figure_ids, b.view.figure_ids);
  assert.deepEqual(a.view.options.map(o => o.id), b.view.options.map(o => o.id));
  assert.deepEqual(a.key.rationales.map(r => [r.option_id, r.truth]), b.key.rationales.map(r => [r.option_id, r.truth]));
  if (!changedIds.has(a.id)) {
    assert.deepEqual(a, b);
    unchangedIds.push(a.id);
  }
}
assert.equal(unchangedIds.length, 14);
const preserved = [];
for (const name of fs.readdirSync(archive)) {
  const original = path.join(archive, name);
  assert(fs.statSync(original).isFile(), 'Unexpected archived directory');
  const entry = { path: `${rel}/${name}`, archived_path: `${rel}/rejected-midpoint-before-repair/${name}`, bytes: fs.statSync(original).size, archived_byte_sha256: bytes(original) };
  if (!['draft.json', 'view.json'].includes(name)) {
    assert(fs.readFileSync(original).equals(fs.readFileSync(path.join(root, name))), `Unexpected non-draft change: ${name}`);
    entry.current_byte_identical = true;
  }
  preserved.push(entry);
}

const view = { questions: current.questions.map(({ id, source_numbers, view }) => ({ id, source_numbers, view })) };
const viewDelta = differences(read(path.join(archive, 'view.json')), view);
assert.equal(viewDelta.length, 8);
assert(viewDelta.every(d => /^\/questions\/\d+\/view\/options\/\d+\/text$/.test(d.path)));
write('view.json', view);

const digest = filename => {
  const result = spawnSync('python3', ['.agents/skills/ld-s10y-choice/scripts/prepare.py', 'digest', filename], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
const hashes = {};
for (const name of ['seed.json', 'draft.json', 'view.json', 'source-solutions.json']) {
  hashes[name] = {
    path: `${rel}/${name}`,
    before: { canonical_sha256: digest(path.join(archive, name)), byte_sha256: bytes(path.join(archive, name)) },
    after: { canonical_sha256: digest(path.join(root, name)), byte_sha256: bytes(path.join(root, name)) }
  };
}
write('midpoint-repair-delta.json', {
  role: 'repair_author_not_independent_reviewer',
  finding_id: plan.finding_id,
  finding_scope_read: plan.finding_scope_read,
  archive: `${rel}/rejected-midpoint-before-repair`,
  archived_file_count: preserved.length,
  preserved_files: preserved,
  affected_question_count: 8,
  changed_false_candidate_count: 8,
  changed_draft_leaf_count: draftDelta.length,
  changed_view_leaf_count: viewDelta.length,
  question_count: current.questions.length,
  option_count: current.questions.reduce((n, q) => n + q.view.options.length, 0),
  unchanged_whole_question_count: unchangedIds.length,
  unchanged_question_ids: unchangedIds,
  candidate_mapping: mappings,
  draft_deltas: draftDelta,
  view_deltas: viewDelta,
  hashes,
  scope_checks: {
    keys_truths_and_order_unchanged: true,
    correct_options_and_correct_rationales_unchanged: true,
    stems_modes_sources_domains_intent_coverage_unchanged: true,
    all_other_candidate_records_unchanged: true,
    seed_source_and_prior_actual_asset_evidence_byte_identical: true,
    old_ready_and_structural_records_byte_identical: true,
    reviewer_record_not_modified: true,
    pure_view_exact_projection: true
  },
  construction_evidence_path: `${rel}/midpoint-repair-plan.json`,
  semantic_gate: 'Pending independent pure-view comparison; no canonical or author self-review.',
  model: null,
  usage: null
});

const args = ['.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.', '--seed', `${rel}/seed.json`, '--draft', `${rel}/draft.json`];
const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' };
delete env.PWDEBUG;
const result = spawnSync('python3', args, { encoding: 'utf8', env });
write('validation-result-repaired.json', {
  command: ['python3', ...args],
  execution_count_for_changed_snapshot: 1,
  prior_frozen_snapshot_execution_count: 1,
  exit_code: result.status,
  stdout: result.stdout,
  stderr: result.stderr,
  signal: result.signal,
  structural_only: true,
  canonical_review_run: false,
  seed_sha256: hashes['seed.json'].after.canonical_sha256,
  draft_sha256: hashes['draft.json'].after.canonical_sha256,
  timestamp: new Date().toISOString()
});
const previousReady = read(path.join(archive, 'ready.json'));
const ready = {
  lesson: previousReady.lesson,
  stage: result.status === 0 ? 'repaired-frozen-awaiting-independent-pure-view-review' : 'repaired-frozen-structural-error',
  approved: false,
  source_count: previousReady.source_count,
  question_count: current.questions.length,
  option_count: current.questions.reduce((n, q) => n + q.view.options.length, 0),
  source_stage_complete_before_options: true,
  source_blockers: previousReady.source_blockers,
  notices: previousReady.notices,
  actual_assets_opened: previousReady.actual_assets_opened,
  actual_assets_reopened: false,
  prior_structural_result_preserved: `${rel}/validation-result.json`,
  changed_snapshot_structural_execution_count: 1,
  structural_exit: result.status,
  canonical_review_count: 0,
  repair_delta: `${rel}/midpoint-repair-delta.json`,
  repair_construction_evidence: `${rel}/midpoint-repair-plan.json`,
  rejected_snapshot: `${rel}/rejected-midpoint-before-repair`,
  pure_view_shape: '{questions:[{id,source_numbers,view}]}',
  files: Object.fromEntries(Object.entries(hashes).map(([name, value]) => [name, { path: value.path, ...value.after }])),
  validation_result: `${rel}/validation-result-repaired.json`,
  model: null,
  usage: null,
  browser_in_flight: false,
  user_ui_used: false
};
write('ready-repaired.json', ready);
console.log(JSON.stringify(ready, null, 2));
if (result.status !== 0) process.exitCode = 1;
