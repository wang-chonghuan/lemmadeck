import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d489';
const O = `${T}/tmp/d1816-d489-laboratory-first-assembly`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const ID = 'phy10-c4-s4';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
assert(!fs.existsSync(`${O}/result.json`));
const earlierFile = `${T}/tmp/d1816-d403-source402403-affected-review/report.json`;
const earlier = read(earlierFile);
assert.equal(earlier.status, 'PASS');
const bindings = new Map(earlier.inputBindings.exactFiles.map(row => [row.path, row]));
const progressFile = `${T}/evidence/reports/d1816-d482-current-approved-progress/retained-progress.json`;
const progress = read(progressFile);
assert.equal(progress.sourcePagesAdded, 6);
const copies = [];
const copy = (from, to, expected) => {
  const source = bind(from);
  if (expected) assert.equal(source.sha256, expected.sha256, from);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
  copies.push({ from: source, to: bind(to) });
};
copy(`${R}/book.json`, `${B}/root/10p/book.json`);
for (const page of [402, 403, 404, 405, 406, 407, 408, 409]) {
  const suffix = `pages/${String(page).padStart(4, '0')}`;
  const source = page < 404 ? '.tmp/STEMROBIN-181/d1816-d383/root/10p' : R;
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = `${source}/${suffix}/${name}`;
    const expected = page < 404 ? bindings.get(path.resolve(file))
      : progress.products.find(row => row.path === path.resolve(file));
    assert(expected, `Missing approved binding: ${file}`);
    copy(file, `${B}/root/10p/${suffix}/${name}`, expected);
  }
}
for (const extension of ['png', 'svg']) {
  const file = `${R}/figures/fig-278.${extension}`;
  const expected = progress.products.find(row => row.path === path.resolve(file));
  assert(expected);
  copy(file, `${B}/root/10p/figures/fig-278.${extension}`, expected);
  copy(file, `${B}/root/10p/pages/0404/figures/fig-278.${extension}`, expected);
}
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/input-freeze.json`, JSON.stringify({
  stage: 'D489', course: ID, sourcePages: [402, 403, 404, 405, 406, 407, 408, 409],
  copies, earlierApprovedRepairs: bind(earlierFile), retainedSixPages: bind(progressFile),
  source410Preparation: bind(`${T}/tmp/d1816-recovery/native/d489-source410-right-boundary-first-prepare/receipt.json`),
  rightBoundary: 'FIRST_SOURCE410_OBSERVATION_PENDING',
  oldNativeAndSourceReviewsReplayed: false, sourceContentChanged: false,
  originalRangeHoldsPreserved: true, wholeCourseApproval: false,
  sourcePagesAdded: 0, completeCoursesAdded: 0, parentImageOpens: 0,
  paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
const stages = [];
let failure = null;
const native = (name, action, args) => {
  execFileSync('node', [
    `${T}/tmp/d1816-recovery/run-native.mjs`, name,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
    '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`, ...args,
  ], { cwd: repo, stdio: 'inherit' });
  stages.push({ name, receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) });
};
try {
  native('d489-laboratory-first-assemble', 'assemble', [
    '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  ]);
  const lesson = read(`${B}/root/10p/lessons/${ID}/lesson.json`);
  assert.equal(lesson.id, ID);
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']])
    native(`d489-laboratory-${locale}-first-adapt-prepare`, 'adapt-prepare', [
      '--edition', edition, '--lesson', ID,
    ]);
} catch (error) {
  failure = { exitCode: error.status ?? null, message: error.message };
}
const directory = `${B}/root/10p/lessons/${ID}`;
const outputs = ['lesson.json', 'lesson.md', 'exercises.json']
  .filter(name => fs.existsSync(`${directory}/${name}`)).map(name => bind(`${directory}/${name}`));
fs.writeFileSync(`${O}/result.json`, JSON.stringify({
  stage: 'D489', course: ID, root: `${B}/root`, work: `${B}/source-work`,
  stages, failure, outputs,
  status: failure ? 'first-assembly-or-preparation-failure' : 'first-assembly-native-pass-modern-author-and-boundary-pending',
  sourceReviewsReplayed: false, wholeCourseApproval: false,
  sourcePagesAdded: 0, completeCoursesAdded: 0, parentImageOpens: 0,
  paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ result: bind(`${O}/result.json`), failure, outputs }));
if (failure) process.exitCode = 1;
