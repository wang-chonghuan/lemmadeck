import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const owner = join(repo, '.tmp/s10y-choice/batch013-independent3233');
if (realpathSync(process.cwd()) !== realpathSync(repo)) throw new Error('Wrong workdir');
const bytes = (path) => readFileSync(path);
const hash = (path) => createHash('sha256').update(bytes(path)).digest('hex');
const load = (path) => JSON.parse(bytes(path));
const answerGatePath = join(owner, 'answerGate.json');
const answerGate = load(answerGatePath);
const choice = load(join(owner, 'choice_gate_summary.json'));
const paths = [
  answerGatePath, join(owner, 'choice_gate_summary.json'), join(owner, 'post_key_comparison.json'),
  join(owner, 'assets/fig-121.svg.png')
];
for (const lesson of answerGate.lessons) {
  const answerPath = join(repo, lesson.answer_path);
  const exercisePath = join(repo, lesson.modern_exercises_path);
  if (hash(answerPath) !== lesson.answer_file_sha256 ||
      hash(exercisePath) !== lesson.modern_exercises_file_sha256) {
    throw new Error(`Reviewed answer/source changed: ${lesson.lesson}`);
  }
  const answers = load(answerPath).answers;
  const sourcePath = join(owner, lesson.lesson, 'source_solution.json');
  const sourceNumbers = load(sourcePath).source_reviews.map((row) => row.source_number).sort();
  const actualNumbers = answers.map((row) => row.exercise).sort();
  if (JSON.stringify(sourceNumbers) !== JSON.stringify(actualNumbers) ||
      new Set(actualNumbers).size !== actualNumbers.length) throw new Error('Answer coverage changed');
  for (const name of ['source_solution.json', 'blind_view_review.json', 'review.json', 'validation.json']) {
    paths.push(join(owner, lesson.lesson, name));
  }
  paths.push(answerPath, exercisePath);
  const receipt = choice.find((row) => row.lesson === lesson.lesson);
  const reviewPath = join(owner, lesson.lesson, 'review.json');
  if (hash(reviewPath) !== receipt.review_file_sha256) throw new Error('First review changed');
  paths.push(
    join(repo, '.tmp/s10y-choice/batch013-author3233', lesson.lesson, 'seed.json'),
    join(repo, '.tmp/s10y-choice/batch013-author3233', lesson.lesson, 'draft.json')
  );
}
paths.push(join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-121.svg'));
const manifest = {
  schema: 'same184-independent-gate-manifest-v1',
  reviewer: 'Same184-3',
  workdir: repo,
  ownership_root: owner,
  result: {
    choice_semantic: 'pass', choice_validation_exit_codes: choice.map((row) => row.exit_code),
    source_exercises: 11, choice_questions: 13, options_checked: 53,
    answer_semantic: answerGate.semantic_outcome, answers_checked: 11,
    auto_answers: 1, ungraded_answers: 10, numeric_parts: 2,
    findings: 0, images_opened: 1, image_budget: 4,
    full_answer_gate: answerGate.full_gate_status
  },
  canonical_choice_hashes: choice.map((row) => ({
    lesson: row.lesson, seed_sha256: row.seed_sha256, draft_sha256: row.draft_sha256,
    review_sha256: row.review_canonical_sha256
  })),
  files: [...new Set(paths)].map((path) => ({ path: resolve(path), file_sha256: hash(path) })),
  limitations: answerGate.limitations
};
const out = join(owner, 'manifest.json');
writeFileSync(out, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  manifest_path: out, manifest_file_sha256: hash(out), result: manifest.result,
  answerGate_path: answerGatePath, answerGate_file_sha256: hash(answerGatePath),
  review_files: manifest.files.filter((row) => row.path.endsWith('/review.json')),
  answer_files: manifest.files.filter((row) => row.path.endsWith('/answer-keys.json'))
}, null, 2));
