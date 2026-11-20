import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const output = `${ticket}/tmp/d1816-d061-n22-amplitude-repair`;
const freezeFile = `${ticket}/tmp/d1816-d057-n22-author/author-freeze.json`;
const work = '.tmp/STEMROBIN-181/d1816-d057/n22-work/adapt/10p';
const figures = '.tmp/STEMROBIN-181/d1816-d057/n22-figure-author';
const id = 'phy10-c1-s3-n22';
const editions = ['modern-us-neutral', 'modern-us-neutral-en'];
const localize = text => text.replace(
  /(?<![A-Za-z\\])([UI])_м(?![A-Za-z\u0400-\u04ff])/g, '$1_{\\mathrm{m}}');
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const verify = row => assert.equal(hash(row.path), row.sha256, row.path);
const save = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
};
const replace = (file, data) => {
  fs.chmodSync(file, 0o644);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
};
const snapshot = (file, name) => {
  const target = `${output}/before/${name}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o444);
  return { original: bind(file), snapshot: bind(target) };
};
assert(!fs.existsSync(`${output}/author-freeze.json`));
const freeze = read(freezeFile);
for (const row of freeze.lessonTemplates) {
  for (const key of ['lesson', 'exercises', 'figures']) verify(row[key]);
}
for (const row of freeze.figureCandidates) {
  for (const key of ['spec', 'svg', 'render']) verify(row[key]);
}
const rawFiles = [
  `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/${id}/lesson.json`,
  `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/${id}/exercises.json`,
  'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0060/page.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0061/page.json',
];
const raw = rawFiles.map(bind);
const records = [];
const lessons = [];
const before = [];
for (const edition of editions) {
  const file = `${work}/${edition}/lessons/${id}/lesson.template.json`;
  before.push(snapshot(file, `${edition}/lesson.template.json`));
  const lesson = read(file);
  const prior = structuredClone(lesson);
  const changed = [];
  for (const [index, block] of lesson.prose.entries()) {
    const old = block.text;
    block.text = localize(old);
    if (block.text !== old) {
      assert([4, 5, 9].includes(index));
      block.changes = [...new Set([...block.changes, 'context'])];
      changed.push(index);
    }
  }
  assert.deepEqual(changed, [4, 5, 9]);
  lesson.section_breaks = lesson.section_breaks.map(row => ({
    before: localize(row.before), after: localize(row.after),
  }));
  assert.deepEqual(lesson.source, prior.source);
  assert.equal(lesson.section_breaks.length, prior.section_breaks.length);
  assert.deepEqual(lesson.prose.map(row => row.source_text), prior.prose.map(row => row.source_text));
  replace(file, lesson);
  lessons.push(lesson);
  records.push({ edition, lesson: bind(file), changedBlocks: changed,
    changedFields: ['prose[4,5,9].text', 'prose[4,5,9].changes', 'section_breaks text aliases'],
    rawSourceChanged: false, coefficientOrFunctionChanged: false });
}
const authority = lessons.map((lesson, index) => ({
  lesson: id,
  text: `[${index === 0 ? 'ZH' : 'EN'}] ${lesson.title}\n` +
    lesson.prose.filter(row => row.text).map(row => row.text).join('\n\n'),
}));
const figureRecords = [];
for (const edition of editions) {
  for (const figure of ['fig-34', 'fig-35']) {
    const base = `${figures}/${edition}/lessons/${id}/figures/${figure}`;
    const specFile = `${base}.spec.json`, renderFile = `${base}.render.json`;
    const specBefore = snapshot(specFile, `${edition}/${figure}.spec.json`);
    const renderBefore = snapshot(renderFile, `${edition}/${figure}.render.json`);
    before.push(specBefore, renderBefore);
    const svgBefore = bind(`${base}.svg`);
    const spec = read(specFile), prior = structuredClone(spec);
    spec.source.authoritativeText = authority;
    const stripped = structuredClone(spec), strippedPrior = structuredClone(prior);
    delete stripped.source.authoritativeText;
    delete strippedPrior.source.authoritativeText;
    assert.deepEqual(stripped, strippedPrior);
    replace(specFile, spec);
    const render = read(renderFile);
    assert.equal(render.status, 'pass');
    assert.equal(render.spec.sha256, specBefore.original.sha256);
    render.spec.sha256 = hash(specFile);
    render.reuse = {
      kind: 'authoritative-text-only-rebind-no-render',
      priorSpec: specBefore.snapshot,
      priorRender: renderBefore.snapshot,
      unchangedSvgSha256: svgBefore.sha256,
      geometryLabelsAssertionsDisplayUnchanged: true,
    };
    replace(renderFile, render);
    verify(svgBefore);
    figureRecords.push({ edition, figure, spec: bind(specFile), svg: svgBefore,
      render: bind(renderFile), geometryRerendered: false,
      sourceInventoryChanged: false, independentReview: 'pending' });
  }
}
raw.forEach(verify);
save(`${output}/author-freeze.json`, {
  schema: 'STEMROBIN-181/affected-author-repair-freeze@1',
  batch: 'D061', status: 'author-repaired-independent-review-pending',
  originalAuthorFreeze: bind(freezeFile), records, figureRecords, before, raw,
  tool: bind('.claude/skills/ld-s10y-lesson/tools/edition.py'),
  toolBefore: {
    commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    path: '.claude/skills/ld-s10y-lesson/tools/edition.py',
  },
  scientificInterpretationChanged: false, originalEquationsUnchanged: true,
  imageOpens: 0, geometryRenders: 0, paidCalls: 0, databaseWrites: false,
  formalHandoff: false, createdAt: new Date().toISOString(),
});
console.log(JSON.stringify({ status: 'author-repaired', lesson: id,
  editions: 2, localizedBlocksPerEdition: 3, figureTextRebinds: 4,
  rawUnchanged: true, geometryRenders: 0 }));
