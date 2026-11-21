import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d537';
const O = `${T}/tmp/d1816-d538-n97-native-finalization`;
const ID = 'phy10-c2-s4-n97';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n',
  { flag: 'wx' });
assert(!fs.existsSync(`${O}/result.json`));
assert.equal(read(`${T}/tmp/d1816-recovery/native/d538-n97-en-first-adapt-finalize/receipt.json`).exitCode, 2);
for (const stage of ['adapt-finalize', 'render'])
  assert.equal(read(`${T}/tmp/d1816-recovery/native/d538-n97-zh-first-${stage}/receipt.json`).exitCode, 0);
const file = `${B}/source-work/adapt/10p/modern-us-neutral-en/lessons/${ID}/lesson.template.json`;
const before = read(file);
assert.equal(before.title, 'Relativity of Distance');
assert.equal(before.printed_title, '97. \u8ddd\u79bb\u7684\u76f8\u5bf9\u6027');
fs.copyFileSync(file, `${O}/before-en-heading.template.json`, fs.constants.COPYFILE_EXCL);
const after = structuredClone(before);
after.printed_title = `${after.number}. ${after.title}`;
const comparison = structuredClone(after);
comparison.printed_title = before.printed_title;
assert.deepEqual(comparison, before);
fs.writeFileSync(file, JSON.stringify(after, null, 2) + '\n');
save(`${O}/en-heading-recovery.json`, {
  before: bind(`${O}/before-en-heading.template.json`), after: bind(file),
  onlyChangedField: 'printed_title', approvedEnglishTitleReused: true,
  proseExercisesFiguresAndSourceSnapshotsUnchanged: true,
  originalFailure: bind(`${T}/tmp/d1816-recovery/native/d538-n97-en-first-adapt-finalize/receipt.json`),
});
for (const action of ['adapt-finalize', 'render'])
  execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`,
    `d538-n97-en-heading-recovery-${action}`, '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', action, '--book', '10p',
    '--root', `${B}/root`, '--work', `${B}/source-work`,
    '--edition', 'modern-us-neutral-en', '--lesson', ID],
  { cwd: repo, stdio: 'inherit' });
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const directory = `${B}/root/10p/editions/${edition}/lessons/${ID}`;
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
  records.push({ locale, edition, products: ['lesson.json', 'exercises.json',
    'figures.json', 'adaptation.audit.json'].map(name => bind(`${directory}/${name}`)),
  html: bind(`${B}/source-work/render/10p/${edition}/${ID}/text.html`),
  exercisesHtml: bind(`${B}/source-work/render/10p/${edition}/${ID}/exercises.html`) });
}
save(`${O}/result.json`, {
  course: ID, status: 'NATIVE_PASS_DISPLAY_PENDING', records,
  affectedReview: bind(`${T}/evidence/reports/d1816-d536-n97-affected-review/report.json`),
  recovery: bind(`${O}/en-heading-recovery.json`), passedChineseStagesReplayed: false,
  sourcePagesAdded: 0, coursesAdded: 0, sourceAndTextReviewReplayed: false,
  geometryRerenderedAtRelocation: false, paidCalls: 0, databaseWrites: false,
  fullCourseApproval: false,
});
console.log(JSON.stringify({ course: ID, native: 'PASS', locales: 2,
  recovery: 'approved-English-title metadata only', display: 'PENDING' }));
