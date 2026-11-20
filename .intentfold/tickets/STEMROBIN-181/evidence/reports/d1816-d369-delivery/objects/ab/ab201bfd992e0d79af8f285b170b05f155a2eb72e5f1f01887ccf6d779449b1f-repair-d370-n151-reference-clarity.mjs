import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d370-n151-reference-clarity-repair`;
const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const reportFile = `${T}/tmp/d1816-d358-n151-first-text-review/report.json`;
const report = read(reportFile);
assert.equal(report.status, 'FAIL');
assert.equal(report.SCI.status, 'PASS');
assert.deepEqual(report.ZHEN.findings.map(row => row.id), ['ZHEN-151-01', 'ZHEN-151-02']);
assert(!fs.existsSync(O));
const rebound = read(`${T}/tmp/d1816-d357-n151-source-rebinding/input-freeze.json`);
const outputs = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const baseline = `${T}/tmp/d1816-d357-n151-source-rebinding/${locale}.rebound.template.json`;
  const working = `.tmp/STEMROBIN-181/d1816-d357/source-work/adapt/10p/${edition}/lessons/phy10-c4-s1/lesson.template.json`;
  assert.equal(bind(baseline).sha256, bind(working).sha256);
  const declaration = rebound.templates.find(row => row.working.path === path.resolve(working));
  assert(declaration, working);
  assert.equal(bind(working).sha256, declaration.working.sha256);
  const before = read(baseline);
  const after = structuredClone(before);
  const replacements = locale === 'zh' ? [
    ['自由中子发生这种衰变时', '自由中子衰变时'],
  ] : [
    ['In this decay, a free neutron becomes', 'When a free neutron decays, it becomes'],
    ['In modern physics, this is a nuclear-force model valid within a particular low-energy range, not a description of a single elementary quantum of a universal nuclear field.',
      'In modern physics, pion exchange is useful as a nuclear-force model within a particular low-energy range, but pions are not fundamental carriers of the strong interaction.'],
  ];
  for (const [from, to] of replacements) {
    assert.equal(after.prose[15].text.split(from).length, 2, from);
    after.prose[15].text = after.prose[15].text.replace(from, to);
  }
  const restored = structuredClone(after);
  restored.prose[15].text = before.prose[15].text;
  assert.deepEqual(restored, before);
  const beforeFlow = proseFlow(before.prose, before.section_breaks);
  const afterFlow = proseFlow(after.prose, after.section_breaks);
  assert.equal(afterFlow.filter(row => row.kind === 'p').length, 45);
  assert.deepEqual(afterFlow.map(row => [row.kind, !!row.sectionBreak]),
    beforeFlow.map(row => [row.kind, !!row.sectionBreak]));
  save(`${O}/${locale}.before.template.json`, before);
  const candidate = `${O}/${locale}.repaired.template.json`;
  save(candidate, after);
  save(`${O}/${locale}.final-flow.json`, { before: beforeFlow, after: afterFlow });
  fs.copyFileSync(candidate, working);
  outputs.push({ locale, baseline: bind(baseline), candidate: bind(candidate),
    working: bind(working), affectedEntry: 15, replacements,
    finalFlow: bind(`${O}/${locale}.final-flow.json`), finalParagraphs: 45 });
}
save(`${O}/author-freeze.json`, {
  stage: 'D370', status: 'AUTHOR_FROZEN_AFFECTED_REVIEW_PENDING', firstFailure: bind(reportFile),
  outputs, originalSCIPassReused: true, sourceSnapshotsChanged: false,
  metadataMathDigitsAnchorsChanged: false, contentRepairRoundsAdded: 1,
  priorAuthorRefinementAndTechnicalRecoveryPreserved: true,
  imagesOpened: 0, paidToolCalls: 0, databaseWrites: false, completeCoursesAdded: 0,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
const authorFile = `${T}/tmp/d1816-d360-source395-397-first-author/report.json`;
const author = read(authorFile);
meter.currentResume1816.D358 = { ...meter.currentResume1816.D358,
  status: 'FIRST_SCI_PASS_ZHEN_TWO_FINDINGS_FAIL_RETAINED', report: bind(reportFile),
  SCI: 'PASS', ZHEN: 'FAIL', imagesOpened: 0 };
meter.currentResume1816.D360 = { ...meter.currentResume1816.D360,
  status: 'FIRST_SOURCE395397_AUTHOR_FROZEN_CLOSED_WITH_SCOPED_HOLDS',
  report: bind(authorFile), authorFreeze: bind(`${T}/tmp/d1816-d360-source395-397-first-author/author-freeze.json`),
  usage: author.usage, actualImagesOpened: 8, authorClosed: true };
meter.currentResume1816.D370 = { status: 'N151_TWO_REFERENCE_CLARITY_FINDINGS_REPAIRED_FROZEN',
  authorFreeze: bind(`${O}/author-freeze.json`), contentRepairRoundsAdded: 1,
  imagesOpened: 0, sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ freeze: bind(`${O}/author-freeze.json`), changedEntries: [15],
  newContentRepairRounds: 1, imagesOpened: 0 }));
