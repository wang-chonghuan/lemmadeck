import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d362-n151-native`;
const root = '.tmp/STEMROBIN-181/d1816-d357/root';
const work = '.tmp/STEMROBIN-181/d1816-d357/source-work';
const display = '.tmp/STEMROBIN-181/d1816-d362/display';
const id = 'phy10-c4-s1';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = record => assert.equal(bind(record.path).sha256, record.sha256, record.path);
const reviewFile = `${T}/tmp/d1816-d358-n151-first-text-review/report.json`;
assert.equal(read(reviewFile).SCI.status.toLowerCase(), 'pass');
const affectedReviewFile = `${T}/tmp/d1816-d371-n151-affected-text-review/report.json`;
assert.equal(read(affectedReviewFile).status.toLowerCase(), 'pass');
const rebound = read(`${T}/tmp/d1816-d357-n151-source-rebinding/input-freeze.json`);
verify(rebound.repairedSource);
verify(rebound.exercises);
const repaired = read(`${T}/tmp/d1816-d370-n151-reference-clarity-repair/author-freeze.json`);
for (const record of repaired.outputs) {
  verify(record.baseline);
  verify(record.candidate);
  verify(record.working);
}
assert(!fs.existsSync(`${O}/result.json`));
fs.mkdirSync(O, { recursive: true });
const stages = [];
let failure = null;
try {
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
    for (const action of ['adapt-finalize', 'render']) {
      const name = `d362-n151-${locale}-first-${action}`;
      execFileSync('node', [
        `${T}/tmp/d1816-recovery/run-native.mjs`, name,
        '.claude/skills/ld-s10y-lesson/.venv/bin/python',
        '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
        '--book', '10p', '--root', root, '--work', action === 'render' ? display : work,
        '--edition', edition, '--lesson', id,
      ], { cwd: repo, stdio: 'inherit' });
      stages.push({ name, status: 'pass',
        receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) });
    }
  }
} catch (error) {
  failure = { message: error.message, exitCode: error.status ?? null };
}
const outputs = failure ? [] : ['modern-us-neutral', 'modern-us-neutral-en'].map(edition => {
  const directory = `${root}/10p/editions/${edition}/lessons/${id}`;
  return { edition, lesson: bind(`${directory}/lesson.json`),
    exercises: bind(`${directory}/exercises.json`), figures: bind(`${directory}/figures.json`),
    audit: bind(`${directory}/adaptation.audit.json`),
    html: bind(`${display}/render/10p/${edition}/${id}/text.html`) };
});
fs.writeFileSync(`${O}/result.json`, JSON.stringify({
  stage: 'D362', id, book: '10p', root, work, display, stages, failure, outputs,
  status: failure ? 'native-failure' : 'native-pass-display-pending',
  independentTextReview: bind(reviewFile),
  firstZHENFailurePreserved: true,
  affectedTextReview: bind(affectedReviewFile),
  clarityRepair: bind(`${T}/tmp/d1816-d370-n151-reference-clarity-repair/author-freeze.json`),
  EnglishHeadingRecovery: bind(`${T}/tmp/d1816-recovery/native/d361-english-heading-focused-regression/receipt.json`),
  sourceRebinding: bind(`${T}/tmp/d1816-d357-n151-source-rebinding/input-freeze.json`),
  originalTasks: 0, figures: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
  imagesOpened: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ result: bind(`${O}/result.json`), failure }));
if (failure) process.exitCode = 1;
