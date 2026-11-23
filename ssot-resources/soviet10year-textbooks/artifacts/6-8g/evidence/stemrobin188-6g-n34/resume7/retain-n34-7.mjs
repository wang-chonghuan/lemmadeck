import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const E = `${B}/editions/modern-us-neutral`;
const L = 'geo68-c3-s2-n34';
const N = `${B}/evidence/stemrobin188-6g-n34`;
const R = `${N}/resume7`;
const T = `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/${L}`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const copy = (from, to, immutable = false) => {
  if (fs.existsSync(to)) {
    assert.ok(fs.readFileSync(from).equals(fs.readFileSync(to)), `Different retained bytes: ${to}`);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  if (immutable) fs.chmodSync(to, 0o444);
};
const retain = (source, target) => {
  assert.ok(!fs.existsSync(target), `Existing retained review: ${target}`);
  fs.cpSync(source, target, { recursive: true, errorOnExist: true });
};
if (process.argv[2] === 'display') {
  const from = '.intentfold/tickets/STEMROBIN-188/tmp/n34-display-independent7';
  assert.equal(read(`${from}/review.json`).status, 'pass');
  const to = `${N}/display7/independent-first7`;
  retain(from, to);
  const file = `${N}/display7/surfaces.json`;
  copy(file, `${N}/display7/surfaces.before-visual-review7.json`, true);
  const current = read(file);
  current.status = 'pass';
  current.completePageReview = `${to}/review.json`;
  current.figureFullScrollReview = `${N}/figures-independent7/review.json`;
  fs.writeFileSync(file, `${JSON.stringify(current, null, 2)}\n`);
  console.log(JSON.stringify({ display: 'pass', reviewedWholeScreenshots: 4, repeatedReviews: 0 }));
} else if (process.argv[2] === 'choices') {
  const from = '.intentfold/tickets/STEMROBIN-188/tmp/n34-choices7';
  const independent = '.intentfold/tickets/STEMROBIN-188/tmp/n34-choice-independent7';
  assert.equal(read(`${independent}/review.json`).outcome, 'pass');
  copy(`${independent}/review.json`, `${from}/review.json`, true);
  const command = 'python3';
  const argv = ['.claude/skills/ld-s10y-lesson/tools/retain_choices.py',
    '--repo', '.', '--book', '6-8g', '--lesson', L, '--source', from];
  const result = spawnSync(command, argv, { cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  for (const stream of ['stdout', 'stderr'])
    fs.writeFileSync(`${R}/choice-retain-first7.${stream}`, result[stream] || '', { flag: 'wx' });
  fs.writeFileSync(`${R}/choice-retain-first7.json`, `${JSON.stringify({
    cwd: W, command, argv, exitCode: result.status,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log(result.stdout);
  console.error(result.stderr);
  assert.equal(result.status, 0, 'Native choice retention failed');
  retain(from, `${N}/choices-author7`);
  retain(independent, `${N}/choices-independent7`);
} else if (process.argv[2] === 'final') {
  const from = '.intentfold/tickets/STEMROBIN-188/tmp/n34-choice-display-independent7';
  assert.equal(read(`${from}/review.json`).status, 'pass');
  const to = `${N}/display7/independent-choices7`;
  retain(from, to);
  const file = `${N}/display7/choices.json`;
  copy(file, `${N}/display7/choices.before-visual-review7.json`, true);
  const current = read(file);
  current.status = 'pass';
  current.independentReview = `${to}/review.json`;
  fs.writeFileSync(file, `${JSON.stringify(current, null, 2)}\n`);
  for (const name of ['resume-n34-7.mjs', 'n34-binding-recovery7.mjs',
    'display-n34-7.mjs', 'retain-n34-7.mjs', 'stage-n34-7.mjs'])
    copy(`.intentfold/tickets/STEMROBIN-188/tmp/${name}`, `${R}/${name}`);
  for (const name of ['lesson', 'exercises', 'figures'])
    copy(`${T}/${name}.template.json`, `${R}/${name}.final-template.json`, true);
  const binding = read(`${R}/content-binding.json`);
  binding.figuresPending = false;
  binding.finalized = true;
  binding.answerFinalized = { auto: 0, ungraded: 4 };
  binding.offlineRendered = true;
  binding.nativeFigureTextBinding = `${R}/native-context-binding7.json`;
  binding.completePageDisplay = `${N}/display7/surfaces.json`;
  binding.choiceDisplay = file;
  binding.published = false;
  fs.writeFileSync(`${R}/content-binding.json`, `${JSON.stringify(binding, null, 2)}\n`);
  console.log(JSON.stringify({ finalTemplates: 3, scripts: 5, sourceReplays: 0,
    imageLoads: 0, published: false }));
} else {
  throw new Error('Select display, choices or final');
}
