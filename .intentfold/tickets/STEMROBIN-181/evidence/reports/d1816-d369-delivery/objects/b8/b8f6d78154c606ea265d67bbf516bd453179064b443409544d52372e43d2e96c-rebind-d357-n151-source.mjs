import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d357-n151-source-rebinding`;
const B = '.tmp/STEMROBIN-181/d1816-d357';
const root = `${B}/root`;
const work = `${B}/source-work`;
const id = 'phy10-c4-s1';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true, force: false, errorOnExist: true });
};
const native = (name, action, extra = []) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name,
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
  '--book', '10p', '--root', root, '--work', work, ...extra,
], { cwd: repo, stdio: 'inherit' });
const authorDir = `${T}/tmp/d1816-d351-n151-bilingual-author`;
const authorFreezeFile = `${authorDir}/author-freeze.json`;
const authorReportFile = `${authorDir}/report.json`;
assert(fs.existsSync(authorFreezeFile) && fs.existsSync(authorReportFile),
  'Author must finish and freeze before source propagation');
const authorReport = read(authorReportFile);
assert.equal(authorReport.finiteAssignmentComplete, true);
for (const output of authorReport.outputs)
  assert.equal(bind(output.path).sha256, output.sha256, output.path);
const affectedReviewFile = `${T}/tmp/d1816-d356-source388390-affected-review/report.json`;
assert.equal(read(affectedReviewFile).status.toLowerCase(), 'pass');
assert(!fs.existsSync(O));
assert(!fs.existsSync(B));
const oldRoot = '.tmp/STEMROBIN-181/d1816-d350/root';
const oldWork = '.tmp/STEMROBIN-181/d1816-d350/source-work';
const beforeRaw = read(`${oldRoot}/10p/lessons/${id}/lesson.json`);
const beforeExercises = bind(`${oldRoot}/10p/lessons/${id}/exercises.json`);
fs.mkdirSync(O, { recursive: true });
copy(`${oldRoot}/10p/pages`, `${root}/10p/pages`);
for (const page of ['0388', '0390']) {
  const from = `.tmp/STEMROBIN-181/d1816-d354/root/10p/pages/${page}`;
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const target = `${root}/10p/pages/${page}/${name}`;
    copy(target, `${O}/before/pages/${page}/${name}`);
    fs.copyFileSync(`${from}/${name}`, target);
  }
}
native('d357-n151-punctuation-propagation-assembly', 'assemble',
  ['--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json']);
const afterRawFile = `${root}/10p/lessons/${id}/lesson.json`;
const afterRaw = read(afterRawFile);
assert.equal(afterRaw.prose.length, 26);
assert.deepEqual(afterRaw.figures, []);
assert.equal(afterRaw.exercise_count, 0);
assert.equal(bind(`${root}/10p/lessons/${id}/exercises.json`).sha256, beforeExercises.sha256);
const rawExpected = structuredClone(beforeRaw);
rawExpected.prose[3].text = rawExpected.prose[3].text.replace('绝对的固态：', '绝对的固态.');
rawExpected.prose[12].text = rawExpected.prose[12].text.replace('要复杂；', '要复杂：');
assert.deepEqual(afterRaw, rawExpected);
const templates = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  native(`d357-n151-${locale}-repaired-source-snapshot-prepare`, 'adapt-prepare',
    ['--edition', edition, '--lesson', id]);
  const dir = `${work}/adapt/10p/${edition}/lessons/${id}`;
  const from = `${oldWork}/adapt/10p/${edition}/lessons/${id}/lesson.template.json`;
  const authored = read(from);
  copy(from, `${O}/${locale}.author-frozen.template.json`);
  const file = `${dir}/lesson.template.json`;
  const fresh = read(file);
  copy(file, `${O}/${locale}.prepared.template.json`);
  assert.deepEqual(authored.source.data, beforeRaw);
  assert.deepEqual(authored.prose.map(row => row.source_refs), fresh.prose.map(row => row.source_refs));
  const rebound = structuredClone(authored);
  rebound.source = fresh.source;
  const changed = [];
  for (const [index, row] of rebound.prose.entries()) {
    if (row.source_text !== fresh.prose[index].source_text) changed.push(index);
    row.source_text = fresh.prose[index].source_text;
  }
  assert.deepEqual(changed, [3, 12]);
  assert.deepEqual(rebound.prose.map(row => row.text), authored.prose.map(row => row.text));
  assert.deepEqual(rebound.section_breaks, authored.section_breaks);
  fs.writeFileSync(file, JSON.stringify(rebound, null, 2) + '\n');
  for (const name of ['exercises.template.json', 'figures.template.json']) {
    const source = `${oldWork}/adapt/10p/${edition}/lessons/${id}/${name}`;
    assert.deepEqual(read(`${dir}/${name}`).source, read(source).source);
    fs.copyFileSync(source, `${dir}/${name}`);
  }
  copy(file, `${O}/${locale}.rebound.template.json`);
  templates.push({ locale, edition, changedSourceTextEntries: changed,
    author: bind(`${O}/${locale}.author-frozen.template.json`),
    prepared: bind(`${O}/${locale}.prepared.template.json`),
    rebound: bind(`${O}/${locale}.rebound.template.json`),
    working: bind(file) });
}
fs.writeFileSync(`${O}/input-freeze.json`, JSON.stringify({
  stage: 'D357', id, root, work,
  originalAuthorFreeze: bind(authorFreezeFile), originalAuthorReport: bind(authorReportFile),
  affectedSourceReview: bind(affectedReviewFile),
  sourceRepair: bind(`${T}/tmp/d1816-d354-source388390-punctuation-repair/author-freeze.json`),
  originalSource: bind(`${oldRoot}/10p/lessons/${id}/lesson.json`),
  repairedSource: bind(afterRawFile), exercises: bind(`${root}/10p/lessons/${id}/exercises.json`),
  templates, modernTextAnchorsEntitiesMathAndNumbersUnchanged: true,
  sourceMarksChanged: 2, firstScienceAndZHENReviewPending: true,
  imagesOpened: 0, paidCalls: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
}, null, 2) + '\n');
console.log(JSON.stringify({ freeze: bind(`${O}/input-freeze.json`) }));
