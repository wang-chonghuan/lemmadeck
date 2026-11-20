import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d147-n9-affected-text`;
const Q = `${T}/tmp/d1816-d148-n9-affected-review`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const prepared = read(`${O}/prepared.json`);
const replacements = {
  'modern-us-neutral': ['对于晶体，', '对于原书这里讨论的周期晶体，'],
  'modern-us-neutral-en': ['In a crystal,', 'In the periodic crystals discussed here,'],
};
const frozen = [];
const changes = [];
for (const row of prepared.copies) {
  assert.equal(bind(row.before.path).sha256, row.before.sha256, row.before.path);
  const current = row.operativeBeforeRepair.path;
  const edition = current.includes('/modern-us-neutral-en/') ? 'modern-us-neutral-en' : 'modern-us-neutral';
  const beforeBytes = fs.readFileSync(row.before.path, 'utf8');
  const afterBytes = fs.readFileSync(current, 'utf8');
  if (path.basename(current) === 'lesson.template.json') {
    const [from, to] = replacements[edition];
    assert.equal(beforeBytes.split(from).length, 2);
    assert.equal(afterBytes, beforeBytes.replace(from, to));
    const before = JSON.parse(beforeBytes);
    const after = JSON.parse(afterBytes);
    assert.equal(before.prose.length, 35);
    assert.deepEqual(before.prose[23].source_refs, ['p0028#8', 'p0029#1']);
    assert.equal(after.prose[23].text, before.prose[23].text.replace(from, to));
    const restored = structuredClone(after);
    restored.prose[23].text = before.prose[23].text;
    assert.deepEqual(restored, before);
    changes.push({ edition, pointer: '/prose/23/text', before: before.prose[23].text,
      after: after.prose[23].text, beforeFile: row.before, repairedFile: bind(current),
      sourceRefs: after.prose[23].source_refs, exactSingleReplacement: true,
      unaffectedBlocks: 34, allOtherBytesUnchanged: true });
  } else {
    assert.equal(afterBytes, beforeBytes);
  }
  const to = `${O}/frozen/${edition}/${path.basename(current)}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(current, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o444);
  assert.equal(bind(current).sha256, bind(to).sha256);
  frozen.push(bind(to));
}
assert.equal(changes.length, 2);
const repairFile = `${O}/repair.json`;
save(repairFile, {
  batch: 'D147', status: 'EXACT_BILINGUAL_SENTENCE_SCOPE_REPAIR_FROZEN_REVIEW_PENDING',
  lesson: 'phy9-c1-s1-n9', finding: 'D145-SCI-01', changes, frozen,
  originalReview: prepared.originalReview,
  frozenD142Untouched: true, sourceSnapshotsAndRefsUnchanged: true,
  quantitiesFormulasMaterialsFigureRefsUnchanged: true,
  exercisesAndFiguresTemplatesUnchanged: true, sourceBlocksPerLocale: 35,
  originalTasks: 0, actualImageOpens: 0, paidCalls: 0,
  focusedCheckerReplayed: false, nativeStagesRun: 0, wholeCourseApproved: false,
  nonblockingAttributedSourceLimitsRemain: ['D145-LIMIT-01', 'D145-LIMIT-02', 'D145-LIMIT-03'],
});
const inputFile = `${Q}/input-freeze.json`;
save(inputFile, {
  batch: 'D148', ticket: 'STEMROBIN-181', lesson: 'phy9-c1-s1-n9',
  role: 'AFFECTED_ONLY_INDEPENDENT_SCI_ZH_EN_REVIEW',
  finding: 'D145-SCI-01', pointer: '/prose/23/text', sourceBlockPosition: 24,
  sourceRefs: ['p0028#8', 'p0029#1'],
  inputs: [bind(repairFile), bind(`${O}/prepared.json`),
    prepared.originalReview,
    bind(`${T}/tmp/d1816-d145-n9-text-review/report.json`),
    bind(`${T}/tmp/d1816-d145-n9-text-review/review-freeze.json`),
    ...prepared.copies.map(row => row.before), ...frozen],
  unaffectedBlocksPerLocale: 34, reuseUnaffectedObservationsWithoutReviewReplay: true,
  imagesAuthorized: 0, figuresPending: prepared.figuresPending,
  figureApproval: false, portraitGenerationAuthorized: false,
  originalTasks: 0, nonblockingAttributedSourceLimitsRemain: ['D145-LIMIT-01', 'D145-LIMIT-02', 'D145-LIMIT-03'],
  noNativeOrAuthorCheckerReplay: true, completeCoursesAdded: 0,
  paidCalls: 0, productAcceptance: false, formalHandoff: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D147, {
  status: 'EXACT_N9_BILINGUAL_SCOPE_REPAIR_FROZEN_REVIEW_PENDING', repair: bind(repairFile),
});
meter.currentResume1816.D148 = {
  status: 'AFFECTED_N9_SCI_ZH_EN_REVIEW_QUEUED_BEHIND_D146',
  inputFreeze: bind(inputFile), imagesAuthorized: 0, completeCoursesAdded: 0,
  independentApproval: false, wholeCourseApproved: false,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ repair: bind(repairFile), inputFreeze: bind(inputFile),
  changedBlocksPerLocale: 1, frozenTemplates: frozen.length, imagesOpened: 0 }));
