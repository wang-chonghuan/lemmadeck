import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const work = '.tmp/STEMROBIN-181/d1816/author-work/adapt/10p';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const dir = `${work}/${edition}/lessons/phy10-c3-s1`;
  const before = `${scratch}/d040-intro-title-first-candidate/${edition}`;
  fs.mkdirSync(before, { recursive: true });
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    fs.copyFileSync(`${dir}/${name}`, `${before}/${name}`, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(`${before}/${name}`, 0o444);
  }
  const file = `${dir}/lesson.template.json`;
  const lesson = JSON.parse(fs.readFileSync(file));
  const originalProse = JSON.stringify(lesson.prose);
  lesson.title = locale === 'zh' ? lesson.source.data.title : 'Introduction';
  lesson.locale = locale;
  assert.equal(JSON.stringify(lesson.prose), originalProse);
  fs.writeFileSync(file, JSON.stringify(lesson, null, 2) + '\n');
  const exerciseFile = `${dir}/exercises.template.json`;
  const exercises = JSON.parse(fs.readFileSync(exerciseFile));
  exercises.locale = locale;
  fs.writeFileSync(exerciseFile, JSON.stringify(exercises, null, 2) + '\n');
  records.push({
    locale, edition,
    before: { path: `${before}/lesson.template.json`, sha256: hash(`${before}/lesson.template.json`) },
    repaired: { path: file, sha256: hash(file) },
    failure: { path: `${scratch}/native/d040-${locale}-intro-first-finalize/receipt.json`,
      sha256: hash(`${scratch}/native/d040-${locale}-intro-first-finalize/receipt.json`) },
    proseUnchanged: true,
  });
}
const output = `${scratch}/d040-intro-title-recovery.json`;
fs.writeFileSync(output, JSON.stringify({
  batch: 'D040', id: 'phy10-c3-s1', records,
  diagnosis: 'Missing explicit locale made English title subject to source-identity equality; Chinese expanded title also violated identity.',
  correction: 'Chinese source title retained; English localized title with explicit locale. Existing validator unchanged.',
  sourceApprovalReplayed: false, addedCards: 0, parentNewImageOpens: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output, records }));
