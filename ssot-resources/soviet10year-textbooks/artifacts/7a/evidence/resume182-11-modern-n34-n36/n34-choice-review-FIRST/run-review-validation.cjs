const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
if (process.cwd() !== root) throw new Error('Wrong cwd');
const own = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-review-FIRST';
const author = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-author';
const output = `${own}/first-validation.json`;
if (fs.existsSync(output)) throw new Error('FIRST validation already recorded; no rerun');
const args = [
  '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', '.',
  '--seed', `${author}/seed.json`,
  '--draft', `${author}/draft.json`,
  '--review', `${own}/review.json`,
];
const started = new Date().toISOString();
const result = spawnSync('python3', args, { cwd: root, encoding: 'utf8' });
const receipt = {
  stage: 'FIRST AND ONLY NAMED REVIEW VALIDATION',
  started_at: started,
  finished_at: new Date().toISOString(),
  cwd: root,
  command: ['python3', ...args],
  exit_code: result.status,
  signal: result.signal,
  stdout: result.stdout,
  stderr: result.stderr,
  execution_error: result.error ? result.error.message : null,
  semantic_first_outcome: JSON.parse(fs.readFileSync(`${own}/review.json`, 'utf8')).outcome,
  validation_run_count: 1,
  review_not_modified_after_validation: true,
};
fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
fs.chmodSync(output, 0o444);
console.log(JSON.stringify(receipt, null, 2));
process.exitCode = result.status === null ? 1 : result.status;
