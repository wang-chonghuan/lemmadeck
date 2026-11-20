import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181', N = `${T}/tmp/d1816-recovery/native`;
const B = '.tmp/STEMROBIN-181/d1816-d099', O = `${T}/tmp/d1816-d099-n131-t11-source-assembly`;
const read = p => JSON.parse(fs.readFileSync(p));
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
const save = (p, j, exclusive = true) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
assert(!fs.existsSync(`${O}/prepared.json`));
for (const row of read(`${O}/input-freeze.json`).copies) {
  for (const r of [row.source, row.snapshot]) assert.equal(bind(r.path).sha256, r.sha256, r.path);
}
assert.equal(read(`${N}/d099-n131-t11-first-isolated-source-assembly/receipt.json`).exitCode, 1);
for (const name of ['d100-exhead-identity-focused-check', 'd100-exhead-only-source-assembly-recovery']) {
  assert.equal(read(`${N}/${name}/receipt.json`).exitCode, 0);
}
const targets = ['phy9-c2-s6-n131', 'phy9-c2-s6-t11'], outputs = [];
for (const [id, count] of [[targets[0], 2], [targets[1], 13]]) {
  const d = `${B}/root/9p/lessons/${id}`, lesson = read(`${d}/lesson.json`), exercises = read(`${d}/exercises.json`);
  assert.equal(lesson.id, id);
  assert.equal(exercises.count, count);
  outputs.push({
    id, proseEntries: lesson.prose.length, writtenQuestions: count, figures: lesson.figures,
    files: ['lesson.json', 'lesson.md', 'exercises.json'].map(p => bind(`${d}/${p}`)),
  });
}
const sideEffects = [];
for (const name of fs.readdirSync(`${B}/root/9p/lessons`)) {
  if (targets.includes(name)) continue;
  const from = `${B}/root/9p/lessons/${name}`, to = `${B}/assembly-side-effects/lessons/${name}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
  sideEffects.push({ from, to, status: 'boundary-only-draft-not-new-production-or-approval' });
}
execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`, 'd100-n131-t11-source-carrier-reindex',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'reindex', '--book', '9p', '--root', `${B}/root`,
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json'], { cwd: repo, stdio: 'inherit' });
assert.deepEqual(read(`${B}/root/9p/book.json`).lessons.map(r => r.id), targets);
save(`${O}/prepared.json`, {
  batch: 'D100', status: 'affected-native-source-assembly-recovery-pass-no-new-content-approval',
  inputFreeze: bind(`${O}/input-freeze.json`), outputs, sideEffects,
  originalFailure: bind(`${N}/d099-n131-t11-first-isolated-source-assembly/receipt.json`),
  firstFailedBook: bind(`${O}/first-failure-book.json`),
  currentAssembler: bind('.claude/skills/ld-s10y-lesson/tools/assemble.py'),
  focusedCheck: bind(`${N}/d100-exhead-identity-focused-check/receipt.json`),
  focusedCheckScript: bind(`${T}/tmp/d1816-recovery/check-d100-exhead-identity.py`),
  recoveryReceipt: bind(`${N}/d100-exhead-only-source-assembly-recovery/receipt.json`),
  sourceCarrierIndex: bind(`${B}/root/9p/book.json`),
  sourceBytesUnchanged: true, originalTextMathNumberingAndPrintedTitleUnchanged: true,
  headingsComparedWithoutWhitespaceForIdentityOnly: true,
  referenceWarnings: '279/280/282/284 are outside this six-page source stream. Their retained native PNG/SVG are present in the isolated library. No new review or reference approval is claimed.',
  sourcePagesAdded: 0, completeCoursesAdded: 0, canonicalResourceWrites: 0,
  newImageOpens: 0, newReviews: 0, formalHandoff: false, databaseWrites: false,
});
const meterFile = `${T}/production-meter.json`, meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 134);
Object.assign(meter.currentResume1816.D099, {
  status: 'first-source-assembly-FAIL-preserved-recovered-D100-not-modern-course-approval',
  recovery: bind(`${O}/prepared.json`),
});
meter.currentResume1816.D100 = {
  status: 'native-exhead-whitespace-identity-recovery-PASS-first-source-n131-2-t11-13',
  prepared: bind(`${O}/prepared.json`), actualImages: 0, completeCoursesAdded: 0,
  originalFailurePreserved: true, skillChange: 'Exact exhead identity comparison ignores whitespace as existing h2 identity does.',
};
meter.currentResume1816.currentContinuation = '134 complete courses pushed at7cb24b928;561 SOURCE retained. D099 native source assembly failed on rubric whitespace; D100 affected native comparator recovery PASS, exact source bytes unchanged, n1312 examples and t11/13 originals separately assembled in isolated carrier. Modern candidates and figure/answer/choice stages not yet approved. N129 registration/fig294 and296 glyph-case HOLD retained. Parent24images no new opens. No formal handoff/DB/E/deploy.';
meter.updatedAt = new Date().toISOString();
save(meterFile, meter, false);
console.log(JSON.stringify({ status: 'native-recovery-recorded', outputs: outputs.map(r => ({ id: r.id, prose: r.proseEntries, writtenQuestions: r.writtenQuestions })) }));
