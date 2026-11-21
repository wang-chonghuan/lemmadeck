import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d472';
const O = `${T}/tmp/d1816-d472-n153-subset-display`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const prior = read(`${O}/native-result.json`);
assert.equal(prior.failure.exitCode, 1);
assert(!fs.existsSync(`${O}/native-recovery-result.json`));
const author = read(`${T}/tmp/d1816-d421-review61-native-label-recovery/report.json`);
const copies = [];
for (const row of author.outputs) {
  assert.equal(bind(row.template.path).sha256, row.template.sha256);
  const edition = row.locale === 'zh' ? 'modern-us-neutral' : 'modern-us-neutral-en';
  const target = `${B}/source-work/adapt/10p/${edition}/lessons/phy10-c4-s3/${row.name}.template.json`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(row.template.path, target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o644);
  copies.push({ from: row.template, to: bind(target) });
}
let failure = null;
try {
  execFileSync('node', [
    `${T}/tmp/d1816-recovery/run-native.mjs`, 'd472-n153-zh-template-recovery-adapt-finalize',
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
    '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`,
    '--edition', 'modern-us-neutral', '--lesson', 'phy10-c4-s3',
  ], { cwd: repo, stdio: 'inherit' });
} catch (error) {
  failure = { exitCode: error.status ?? null, message: error.message };
}
fs.writeFileSync(`${O}/native-recovery-result.json`, JSON.stringify({
  stage: 'D472', prior: bind(`${O}/native-result.json`), copies, failure,
  receipt: bind(`${T}/tmp/d1816-recovery/native/d472-n153-zh-template-recovery-adapt-finalize/receipt.json`),
  status: failure ? 'native-failure-whole-course-held' : 'native-mechanical-only-whole-course-held',
  fullTaskCount: 61, sourceOrCandidateContentChanged: false,
  wholeCourseApproval: false, dependentWholeCourseStagesStopped: true,
  completeCoursesAdded: 0, sourcePagesAdded: 0, parentImageOpens: 0, paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ result: bind(`${O}/native-recovery-result.json`), failure }));
