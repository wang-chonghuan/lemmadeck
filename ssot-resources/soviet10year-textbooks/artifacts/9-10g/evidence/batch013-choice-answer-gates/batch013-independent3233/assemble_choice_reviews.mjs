import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const owner = join(repo, '.tmp/s10y-choice/batch013-independent3233');
if (realpathSync(process.cwd()) !== realpathSync(repo)) throw new Error('Wrong workdir');
const load = (path) => JSON.parse(readFileSync(path, 'utf8'));
const sort = (value) => Array.isArray(value) ? value.map(sort)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sort(value[key])]))
    : value;
const digest = (value) => createHash('sha256').update(
  JSON.stringify(sort(value)).replace(/[^\x00-\x7f]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
).digest('hex');
const save = (path, value) => {
  const target = resolve(path);
  if (!target.startsWith(`${owner}/`)) throw new Error('Outside ownership');
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};
const comparison = load(join(owner, 'post_key_comparison.json'));
const receipts = [];
for (const lesson of ['geo910-c1-s3-n32', 'geo910-c1-s3-n33']) {
  const sourceRoot = join(repo, '.tmp/s10y-choice/batch013-author3233', lesson);
  const outputRoot = join(owner, lesson);
  const source = load(join(outputRoot, 'source_solution.json'));
  const blind = load(join(outputRoot, 'blind_view_review.json'));
  const seedPath = join(sourceRoot, 'seed.json');
  const draftPath = join(sourceRoot, 'draft.json');
  const seed = load(seedPath);
  const draft = load(draftPath);
  if (digest(seed) !== source.seed_sha256 || digest(draft) !== blind.draft_sha256) {
    throw new Error(`Snapshot changed: ${lesson}`);
  }
  if (draft.new_figures.length) throw new Error('Unexpected new figure needs actual inspection');
  for (const question of draft.questions) {
    const check = blind.question_reviews.find((row) => row.question_id === question.id);
    if (!check) throw new Error('Missing blind question check');
    if (JSON.stringify([...check.mathematics.correct].sort()) !==
        JSON.stringify([...question.key.correct].sort())) throw new Error('Key disagreement');
    for (const option of check.mathematics.option_checks) {
      if (question.key.rationales.find((row) => row.option_id === option.option_id)?.truth !==
          option.truth) throw new Error('Option truth disagreement');
    }
    check.mathematics.independent_solution +=
      ` Post-disclosure comparison: ${comparison.lessons[lesson].comparisons[question.id]}`;
  }
  const review = {
    schema: 's10y-choice-review-v1',
    seed_sha256: source.seed_sha256,
    draft_sha256: blind.draft_sha256,
    reviewer: { kind: 'independent_agent', identity: 'Same184-3 independent substantive gate; not the author' },
    source_reviews: source.source_reviews.map((row) => ({
      ...row,
      coverage: { verdict: 'pass', evidence: comparison.lessons[lesson].coverage[row.source_number] }
    })),
    figure_checks: source.figure_checks.map(({ preview_path, ...row }) => row),
    new_figure_reviews: [],
    question_reviews: blind.question_reviews,
    outcome: 'pass'
  };
  const reviewPath = join(outputRoot, 'review.json');
  save(reviewPath, review);
  const args = [
    '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', repo,
    '--seed', seedPath, '--draft', draftPath, '--review', reviewPath
  ];
  const result = spawnSync('python3', args, { cwd: repo, encoding: 'utf8' });
  const receipt = {
    lesson, workdir: repo, command: ['python3', ...args],
    exit_code: result.status, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
    seed_sha256: digest(seed), draft_sha256: digest(draft),
    review_canonical_sha256: digest(review),
    review_file_sha256: createHash('sha256').update(readFileSync(reviewPath)).digest('hex'),
    source_count: seed.exercises.length, question_count: review.question_reviews.length,
    option_count: review.question_reviews.reduce((sum, row) => sum + row.mathematics.option_checks.length, 0),
    semantic_outcome: review.outcome
  };
  save(join(outputRoot, 'validation.json'), receipt);
  receipts.push(receipt);
}
save(join(owner, 'choice_gate_summary.json'), receipts);
console.log(JSON.stringify(receipts, null, 2));
