import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const L = 'geo68-c3-s1-n33';
const E = `${B}/editions/modern-us-neutral`;
const N = `${B}/evidence/stemrobin188-6g-n33`;
const R = `${N}/resume7`;
const T = `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/${L}`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const copy = (from, to, immutable = false) => {
  if (fs.existsSync(to)) {
    assert.ok(fs.readFileSync(from).equals(fs.readFileSync(to)), `Different retained bytes: ${to}`);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  if (immutable) fs.chmodSync(to, 0o444);
};
for (const name of ['resume-n33-7.mjs', 'bind-n33-7.mjs', 'normalize-n33-errata-layout7.py',
  'display-n33-7.mjs', 'stage-n33-7.mjs', 'retain-n33-7.mjs', 'recover-n33-number7.mjs'])
  copy(`.intentfold/tickets/STEMROBIN-188/tmp/${name}`, `${R}/${name}`);
for (const [source, target] of [
  ['n33-display-independent7', 'independent-first7'],
  ['n33-number-display-recovery7', 'independent-number-recovery7'],
  ['n33-choice-display-independent7', 'independent-choices7'],
]) {
  const from = `.intentfold/tickets/STEMROBIN-188/tmp/${source}`;
  const to = `${N}/display7/${target}`;
  assert.ok(!fs.existsSync(to), `Existing retained review: ${to}`);
  fs.cpSync(from, to, { recursive: true, errorOnExist: true });
}
const displayPath = `${N}/display7/surfaces.json`;
copy(displayPath, `${N}/display7/surfaces.before-number-recovery7.json`, true);
const display = read(displayPath);
const recovery = read(`${N}/display7/independent-number-recovery7/review.json`);
assert.equal(recovery.status, 'pass');
display.status = 'pass';
display.completePageReview = `${N}/display7/independent-first7/review.json`;
display.initialReviewVerdict = 'fail-number-presentation-only';
display.affectedRecovery = `${N}/display7/independent-number-recovery7/review.json`;
display.affectedCapture = `${N}/display7/exercise-441-recovery.json`;
fs.writeFileSync(displayPath, `${JSON.stringify(display, null, 2)}\n`);
const choicesPath = `${N}/display7/choices.json`;
copy(choicesPath, `${N}/display7/choices.before-visual-review7.json`, true);
const choices = read(choicesPath);
assert.equal(read(`${N}/display7/independent-choices7/review.json`).status, 'pass');
choices.status = 'pass';
choices.independentReview = `${N}/display7/independent-choices7/review.json`;
fs.writeFileSync(choicesPath, `${JSON.stringify(choices, null, 2)}\n`);
for (const name of ['lesson', 'exercises', 'figures'])
  copy(`${T}/${name}.template.json`, `${R}/${name}.final-template.json`, true);
const lesson = read(`${E}/lessons/${L}/lesson.json`);
const binding = read(`${R}/content-binding.json`);
binding.preNativeCandidate = {
  ...binding.candidate,
  path: `${R}/lesson.before-errata-layout-recovery7.json`,
};
delete binding.candidate;
binding.nativeFinalTemplate = {
  path: `${R}/lesson.final-template.json`, sha256: hash(`${R}/lesson.final-template.json`),
};
binding.figureTextBindings = [209, 210, 211, 212].map((number, i) => {
  const index = [0, 5, 7, 13][i];
  const spec = read(`${E}/figures/fig-${number}.spec.json`);
  const approvedText = spec.source.authoritativeText[0].text;
  assert.equal(approvedText.replace(/\s/g, ''), lesson.prose[index].text.replace(/\s/g, ''));
  return { figure: `fig-${number}`, sourceIndex: index,
    approvedWordsAndMathUnchanged: true, nativeWhitespaceOnly: approvedText !== lesson.prose[index].text };
});
binding.figuresPending = false;
binding.finalized = true;
binding.answerFinalized = { auto: 0, ungraded: 5 };
binding.offlineRendered = true;
fs.writeFileSync(`${R}/content-binding.json`, `${JSON.stringify(binding, null, 2)}\n`);
console.log(JSON.stringify({ retainedFinalTemplates: 3, scripts: 7,
  unchangedFigureSourceWordBindings: 4, sourceReplays: 0, imageLoads: 0, published: false }));
