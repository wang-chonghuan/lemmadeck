import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== cwd) throw new Error('Exact authorized cwd required');
const own = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-choice-author';
const absolute = p => path.resolve(cwd, p);
const read = p => JSON.parse(fs.readFileSync(absolute(p), 'utf8'));
const bind = p => {
  const bytes = fs.readFileSync(absolute(p));
  return {
    path: absolute(p), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex')
  };
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const verifyBinding = entry => {
  const actual = bind(entry.path);
  assert(actual.sha256 === entry.sha256, `Changed hash: ${entry.path}`);
  if (entry.bytes !== undefined) assert(actual.bytes === entry.bytes, `Changed size: ${entry.path}`);
};
const verifyNested = value => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[0-9a-f]{64}$/.test(value.sha256 ?? ''))
    verifyBinding(value);
  for (const child of Object.values(value)) verifyNested(child);
};
const choices = read(`${own}/author-freeze.json`);
const answers = read(`${own}/answers-author-freeze.json`);
verifyNested(choices);
verifyNested(answers);
const seed = read('.tmp/STEMROBIN-181/d1816-d138/choice-repo/.tmp/d138/seed.json');
const solutions = read(`${own}/source-solutions-complete.json`);
assert(solutions.tasks.length === 6, 'Source solution count mismatch');
const ledger = read(`${own}/image-ledger.json`);
verifyNested(ledger);
assert(ledger.opens.length === 4 && ledger.actual_opens === 4, 'Image ledger mismatch');
assert(ledger.opens.slice(0, 2).every(row => row.kind === 'original_png'), 'Original images were not first');
const drafts = ['zh', 'en'].map(language => read(`${own}/draft.${language}.json`));
assert(drafts[0].seed_sha256 === drafts[1].seed_sha256, 'Bilingual seed digest mismatch');
assert(JSON.stringify(drafts[0].coverage.map(row => row.source_number)) ===
  JSON.stringify(seed.exercises.map(row => row.number)), 'Source coverage mismatch');
for (let index = 0; index < drafts[0].questions.length; index++) {
  const left = drafts[0].questions[index];
  const right = drafts[1].questions[index];
  assert(left.id === right.id && left.view.mode === right.view.mode, 'Bilingual task/mode mismatch');
  assert(JSON.stringify(left.key.correct) === JSON.stringify(right.key.correct), 'Bilingual key mismatch');
  assert(JSON.stringify(left.source_numbers) === JSON.stringify(right.source_numbers), 'Bilingual coverage mismatch');
}
const sourceResults = [];
const receiptResults = [];
for (const language of ['zh', 'en']) {
  const edition = language === 'zh' ? 'modern-us-neutral' : 'modern-us-neutral-en';
  const root = `.tmp/STEMROBIN-181/d1816-d138/root/9p/editions/${edition}/lessons/phy9-c1-s3-t9`;
  const originals = read(`${root}/exercises.json`).exercises;
  const answerFile = read(`${root}/answer-keys.json`);
  assert(originals.length === 6 && answerFile.answers.length === 6, 'Native exercise count mismatch');
  for (let index = 0; index < 6; index++) {
    const original = originals[index];
    const seedExercise = seed.exercises[index];
    assert(original.number === seedExercise.number, 'Original exercise identity mismatch');
    assert((language === 'zh' ? original.text : original.source_text) === seedExercise.text,
      'Original written task changed');
    assert(solutions.tasks[index].source_text === seedExercise.text, 'Frozen source text mismatch');
    const answer = answerFile.answers[index];
    assert(answer.exercise === original.number && answer.grading === 'ungraded' &&
      answer.parts.length === 0 && answer.displayAnswer.trim(), 'Ungraded answer boundary mismatch');
  }
  const template = read(`.tmp/STEMROBIN-181/d1816-d138/answer-work/9p/${edition}/lessons/phy9-c1-s3-t9/answer-keys.template.json`);
  for (let index = 0; index < 6; index++)
    assert(answerFile.answers[index].bookRaw === template.answers[index].bookRaw,
      'BookRaw changed from native prepared evidence');
  const nativeAudit = read(`${root}/answer-keys.audit.json`);
  assert(answerFile.status === 'ready' && nativeAudit.status === 'pass' &&
    nativeAudit.auto === 0 && nativeAudit.ungraded === 6, 'Native readiness mismatch');
  for (const p of [`${own}/draft.${language}.json`, `${root}/answer-keys.json`, `${root}/answer-keys.audit.json`])
    assert((fs.statSync(absolute(p)).mode & 0o222) === 0, `Authored final output not read-only: ${p}`);
  for (const receiptPath of [
    `${own}/choice-check.${language}.receipt.json`,
    `${own}/answer-prepare.${language}.receipt.json`,
    `${own}/answer-finalize.${language}.receipt.json`
  ]) {
    const receipt = read(receiptPath);
    assert(receipt.exit_code === 0 && receipt.cwd === cwd, 'Native receipt failure or wrong cwd');
    verifyNested(receipt);
    receiptResults.push(bind(receiptPath));
  }
  sourceResults.push({
    language, original_exercises: bind(`${root}/exercises.json`),
    draft: bind(`${own}/draft.${language}.json`),
    answer_keys: bind(`${root}/answer-keys.json`),
    answer_audit: bind(`${root}/answer-keys.audit.json`),
    source_tasks_preserved: originals.length, choice_questions: drafts[0].questions.length,
    answer_count: answerFile.answers.length, automatic_grading: 0,
    status: 'NATIVE_READY_AUTHOR_ONLY'
  });
}
const integrity = {
  schema: 'd138-t9-author-output-integrity-receipt-v1',
  cwd, status: 'pass',
  kind: 'HASH_IDENTITY_READONLY_RECEIPT_CHECK_ONLY_NOT_SEMANTIC_REVIEW',
  frozen_choices: bind(`${own}/author-freeze.json`),
  frozen_answers: bind(`${own}/answers-author-freeze.json`),
  image_ledger: bind(`${own}/image-ledger.json`),
  source_solutions: bind(`${own}/source-solutions-complete.json`),
  outputs: sourceResults, command_receipts: receiptResults,
  structural_checker_reruns: 0, native_finalize_reruns: 0,
  original_task_changes: 0, independent_approval: false,
  verification_tool: bind(`${own}/check-outputs.mjs`)
};
fs.writeFileSync(absolute(`${own}/output-integrity.receipt.json`),
  `${JSON.stringify(integrity, null, 2)}\n`, { flag: 'wx' });
const report = {
  schema: 'd138-t9-choice-and-answer-author-report-v1',
  role: 'AUTHOR_ONLY_NO_INDEPENDENT_REVIEW',
  status: 'AUTHOR_FROZEN_STRUCTURAL_AND_NATIVE_PASS_PARENT_REVIEW_PENDING',
  cwd, lesson: 'phy9-c1-s3-t9', date: '2026-11-20',
  seed: bind('.tmp/STEMROBIN-181/d1816-d138/choice-repo/.tmp/d138/seed.json'),
  seed_canonical_sha256: drafts[0].seed_sha256,
  source_solution_freeze: bind(`${own}/source-solutions-complete.json`),
  first_graph_derivation: bind(`${own}/graph-source-derivation.json`),
  choice_author_freeze: bind(`${own}/author-freeze.json`),
  answers_author_freeze: bind(`${own}/answers-author-freeze.json`),
  image_ledger: bind(`${own}/image-ledger.json`),
  integrity_receipt: bind(`${own}/output-integrity.receipt.json`),
  outputs: sourceResults,
  receipts: receiptResults,
  source_task_coverage: ['1', '2', '3', '4', '5', '6'],
  first_actual_graph_solution: {
    'fig-24': { "1->1'": 'increases', "1'->2": 'unchanged' },
    'fig-30': { '1->2': 'increases', '2->3': 'unchanged', '3->1': 'decreases' },
    numerical_ratios_from_pixels: false,
    isothermal_basis: 'Actual Figure24 plus original n17 definition, frozen before options/book answers.',
    model: 'Fixed gas amount and composition, classical equilibrium internal energy depending on absolute T; monatomic gas not imposed.'
  },
  capacities: {
    image_opens: 4, batch_limit: 8, context_limit: 24, original_png_opens: 2,
    complete_existing_preview_opens: 2, new_figures: 0, native_render_replays: 0,
    parent_image_opens: 0, source_tasks: 6, questions_per_language: 6,
    written_answer_count: 12, automatic_keys: 0, interactions: 0
  },
  preserved_limits: [
    'Choice recognition does not measure independent written derivation; coverage records this loss for every source task.',
    'No graph segment deferred; all five conclusions are present in both choice tables and both written standard answers.',
    'Q1 common-temperature/statistic conditions, Q3 gas/liquid models, Q4 classical mean-squared-speed definition, and Q5 expected-count interpretation are explicit.',
    'Q6 work actor/sign and gross-versus-net transfer remain ambiguous in the source. Only the disclosed net-work-on-gas model gives the selected positive rise; alternatives remain explicit.',
    'Canonical Q4 bookRaw approximately0.5% is unchanged, while the defined mean squared speed yields approximately0.97%; notes record the discrepancy without claiming historical-cause proof or approved erratum.'
  ],
  book_answer_access_order: 'Only after author-freeze.json existed; only canonical this-lesson bookRaw exposed; book file copied unchanged.',
  semantic_review: 'Not performed; parent owns sole independent review.',
  production_meter: 'Parent-owned and untouched; no completed-source/course production increment claimed.',
  forbidden_actions_performed: {
    model_override: false, network_or_paid_calls: false, env_access: false,
    database_or_publish_or_deploy: false, git: false, peer_messages: false,
    whole_project_checks: false, shared_edits_reverted: false
  }
};
fs.writeFileSync(absolute(`${own}/author-report.json`),
  `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
for (const name of ['output-integrity.receipt.json', 'author-report.json', 'check-outputs.mjs'])
  fs.chmodSync(absolute(`${own}/${name}`), 0o444);
console.log(JSON.stringify({ report: bind(`${own}/author-report.json`), ...integrity }, null, 2));
