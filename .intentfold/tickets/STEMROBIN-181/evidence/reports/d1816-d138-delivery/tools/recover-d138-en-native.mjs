import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d138-t9-native`;
const C = '.tmp/STEMROBIN-181/d1816-d138/root';
const W = '.tmp/STEMROBIN-181/d1816-d138/work';
const D = '.tmp/STEMROBIN-181/d1816-d138/display';
const ID = 'phy9-c1-s3-t9';
const P = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
assert(!fs.existsSync(`${O}/native-finalized.json`));
const failure = `${T}/tmp/d1816-recovery/native/d138-t9-en-first-native-finalize/receipt.json`;
assert.equal(read(failure).exitCode, 2);
const calls = [];
const record = name => {
  const file = `${T}/tmp/d1816-recovery/native/${name}/receipt.json`;
  assert.equal(read(file).exitCode, 0);
  calls.push(bind(file));
};
for (const locale of ['zh', 'en']) {
  for (const figure of ['fig-24', 'fig-30']) {
    record(`d138-t9-${locale}-${figure}-metadata-only-review-record`);
  }
}
record('d138-t9-zh-first-native-finalize');
record('d138-t9-zh-first-offline-render');
const native = (name, args) => {
  execFileSync(process.execPath, [`${T}/tmp/d1816-recovery/run-native.mjs`, name, P, tool, ...args],
    { cwd: repo, stdio: 'inherit' });
  record(name);
};
native('d138-t9-en-recovered-native-finalize', [
  'adapt-finalize', '--book', '9p', '--edition', 'modern-us-neutral-en',
  '--lesson', ID, '--root', C, '--work', W,
]);
native('d138-t9-en-first-offline-render', [
  'render', '--book', '9p', '--edition', 'modern-us-neutral-en',
  '--lesson', ID, '--root', C, '--work', D,
]);
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const dir = `${C}/9p/editions/${edition}/lessons/${ID}`;
  assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${dir}/exercises.json`).count, 6);
  assert.equal(read(`${dir}/lesson.json`).prose.length, 0);
  records.push({ locale, edition, files: fs.readdirSync(dir).map(name => bind(`${dir}/${name}`)),
    html: ['text.html', 'exercises.html'].map(name => bind(`${D}/render/9p/${edition}/${ID}/${name}`)) });
}
fs.writeFileSync(`${O}/native-finalized.json`, JSON.stringify({
  batch: 'D138', status: 'pass', lesson: ID, records, calls,
  operativeRoot: C, operativeWork: W, displayWork: D,
  figureInstall: bind(`${O}/figure-install.json`), firstEnglishFailure: bind(failure),
  recovery: {
    tool: bind('.claude/skills/ld-s10y-lesson/tools/edition.py'),
    focusedTests: bind('.claude/skills/ld-s10y-lesson/tests/test_english_edition_identity.py'),
    englishTemplate: bind(`${W}/adapt/9p/modern-us-neutral-en/lessons/${ID}/exercises.template.json`),
    cause: 'Embedded exercise labels now use the existing exact Figure N alias; EN Q2 sentence order preserves the ordered formula signature.',
    formulaCheckUnchanged: true, englishQ2AffectedReviewPending: true,
    passedStagesReplayed: 0,
  },
  nativeFinalizers: 2, offlineRenders: 2, parentImageOpens: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0, canonicalPromotions: 0,
  originalWrittenQuestions: 6, independentChoicesAnswersAndDisplayPending: true,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ nativeFinalized: bind(`${O}/native-finalized.json`) }));
