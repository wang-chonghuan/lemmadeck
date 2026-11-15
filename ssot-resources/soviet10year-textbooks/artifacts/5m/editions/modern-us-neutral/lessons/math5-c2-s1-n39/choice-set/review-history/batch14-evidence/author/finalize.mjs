import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const scratch = dirname(fileURLToPath(import.meta.url));
const seedPath = join(scratch, 'seed.json');
const draftPath = join(scratch, 'draft.json');
const viewPath = join(scratch, 'view.json');
const resultPath = join(scratch, 'structural-result.json');
if (existsSync(viewPath) || existsSync(resultPath)) {
  throw new Error('Final artifacts already exist; do not repeat structural validation.');
}
const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
const draft = JSON.parse(readFileSync(draftPath, 'utf8'));
const view = {
  questions: draft.questions.map(({ id, source_numbers, view }) => ({
    id, source_numbers, view,
  })),
};
writeFileSync(viewPath, `${JSON.stringify(view, null, 2)}\n`, { flag: 'wx' });
const args = [
  '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', '.',
  '--seed', relative(root, seedPath),
  '--draft', relative(root, draftPath),
];
const validation = spawnSync('python3', args, {
  cwd: root,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  encoding: 'utf8',
});
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const result = {
  command: ['env', 'PYTHONDONTWRITEBYTECODE=1', 'python3', ...args],
  structural_runs: 1,
  canonical_runs: 0,
  exit_code: validation.status,
  stdout: validation.stdout,
  stderr: validation.stderr,
  error: validation.error?.message ?? null,
  semantic_review: 'pending independent parent source-to-view review; no author approval',
  counts: {
    sources: seed.exercises.length,
    questions: draft.questions.length,
    coverage: draft.coverage.length,
    single: draft.questions.filter((question) => question.view.mode === 'single').length,
    multiple: draft.questions.filter((question) => question.view.mode === 'multiple').length,
    options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
    source_figures: seed.figures.length,
    new_figures: draft.new_figures.length,
    concepts: seed.concepts.length,
  },
  artifacts: Object.fromEntries([
    ['seed', seedPath], ['draft', draftPath], ['view', viewPath],
  ].map(([name, path]) => [name, {
    path: relative(root, path),
    file_sha256: hash(path),
  }])),
  source_issues_reported_without_source_edits: [
    'Definition candidates mix general prose and solved numerical examples; no pure relevant definition paragraph was selected.',
    '711: original fractions require nonzero denominators; the view makes the inherited domain and universal identity judgment explicit.',
    'Printed exercise-number prefixes remain unchanged in the seed and are omitted from learner-facing stems.',
  ],
  source_rawbook_or_asset_writes: false,
  canonical_promotion_or_database_calls: false,
};
writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  seed: seedPath,
  view: viewPath,
  counts: result.counts,
  structural_runs: result.structural_runs,
  canonical_runs: result.canonical_runs,
  exit_code: result.exit_code,
  stdout: result.stdout.trim(),
  stderr: result.stderr.trim(),
}));
process.exitCode = validation.status ?? 2;
