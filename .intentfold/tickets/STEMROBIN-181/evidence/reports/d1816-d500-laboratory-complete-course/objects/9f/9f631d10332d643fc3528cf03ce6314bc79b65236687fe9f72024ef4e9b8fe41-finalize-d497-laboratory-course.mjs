import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d492';
const O = `${T}/tmp/d1816-d497-laboratory-native-finalization`;
const ID = 'phy10-c4-s4';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const reviewerFile = `${T}/tmp/d1816-d496a-laboratory-affected-review/report.json`;
const review = read(reviewerFile);
assert.equal(review.status, 'PASS');
assert.deepEqual(review.findings, []);
assert(!fs.existsSync(`${O}/result.json`));
const sourceFiles = [];
for (const page of [402, 403, 404, 405, 406, 407, 408, 409])
  for (const name of ['page.md', 'page.json', 'audit.json'])
    sourceFiles.push(bind(`${B}/root/10p/pages/${String(page).padStart(4, '0')}/${name}`));
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  sourceFiles.push(bind(`${B}/root/10p/lessons/${ID}/${name}`));
const stages = [], records = [];
let failure = null;
fs.mkdirSync(O, { recursive: true });
const save = () => fs.writeFileSync(`${O}/result.json`, JSON.stringify({
  stage: 'D497', course: ID, root: `${B}/root`, work: `${B}/source-work`,
  status: failure ? 'FAIL' : records.length === 2 ? 'NATIVE_PASS_DISPLAY_PENDING' : 'IN_PROGRESS',
  reviewer: bind(reviewerFile), sourceFiles, stages, records, failure,
  sourceContentChanged: false, sourceReviewsReplayed: false, parentImageOpens: 0,
  paidCalls: 0, databaseWrites: false, wholeCourseApproval: false,
}, null, 2) + '\n');
try {
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
    const figureReview = `${B}/root/10p/editions/${edition}/figures/fig-278.review.json`;
    assert.equal(read(figureReview).status, 'pass');
    for (const action of ['adapt-finalize', 'render']) {
      const name = `d497-laboratory-${locale}-first-${action}`;
      execFileSync('node', [
        `${T}/tmp/d1816-recovery/run-native.mjs`, name,
        '.claude/skills/ld-s10y-lesson/.venv/bin/python',
        '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
        '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`,
        '--edition', edition, '--lesson', ID,
      ], { cwd: repo, stdio: 'inherit' });
      stages.push(bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`));
    }
    const dir = `${B}/root/10p/editions/${edition}/lessons/${ID}`;
    assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
    records.push({
      locale, edition,
      products: ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
        .map(name => bind(`${dir}/${name}`)),
      figureReview: bind(figureReview),
      html: bind(`${B}/source-work/render/10p/${edition}/${ID}/text.html`),
      emptyExercises: bind(`${B}/source-work/render/10p/${edition}/${ID}/exercises.html`),
    });
    save();
  }
  for (const file of sourceFiles) assert.equal(bind(file.path).sha256, file.sha256);
} catch (error) {
  failure = { message: error.message, exitCode: error.status ?? null };
}
save();
if (failure) process.exitCode = 1;
