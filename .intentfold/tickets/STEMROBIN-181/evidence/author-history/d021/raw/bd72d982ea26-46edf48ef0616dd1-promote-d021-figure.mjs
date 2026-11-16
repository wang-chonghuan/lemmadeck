import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const [book, lessonId, figureId, reportFile] = process.argv.slice(2);
assert.equal(book, '9p');
assert.equal(lessonId, 'phy9-c2-s2-n84');
assert.equal(figureId, 'fig-160');
const hash = data => createHash('sha256').update(data).digest('hex');
const load = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const save = (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const reportBytes = await fs.readFile(reportFile);
const report = JSON.parse(reportBytes);
assert.equal(report.status, 'pass');
const reviewed = report.figures.find(figure => figure.id === figureId);
assert.equal(reviewed.status, 'pass');
assert.equal(reviewed.contextKind, 'exercises');
const bindings = reviewed.bindings;
for (const name of ['source', 'context', 'lesson', 'prose', 'spec', 'render', 'svg']) {
  assert.equal(hash(await fs.readFile(bindings[name].path)), bindings[name].sha256, `Stale ${name}`);
}
const template = `.tmp/ld-s10y-lesson/adapt/${book}/modern-us-neutral/lessons/${lessonId}/exercises.template.json`;
assert.equal(hash(await fs.readFile(template)), bindings.lesson.sha256);
const proseTemplate = template.replace('exercises.template.json', 'lesson.template.json');
assert.equal(hash(await fs.readFile(proseTemplate)), bindings.prose.sha256);
const spec = await load(bindings.spec.path);
assert.equal(spec.id, figureId);
assert.equal(spec.mode, 'deterministic');
assert.equal(spec.source.image.sha256, bindings.source.sha256);
const tasks = await load(template);
const prose = await load(proseTemplate);
const normalize = text => text.replace(/\s+/g, '');
const contexts = spec.source.authoritativeText.filter(entry => entry.lesson === lessonId);
const teachingContexts = contexts.filter(entry => entry.exercise == null);
const exerciseContexts = contexts.filter(entry => entry.exercise != null);
assert.deepEqual(
  teachingContexts.map(entry => normalize(entry.text)),
  prose.prose.filter(block => block.kind === 'p').map(block => normalize(block.text)),
  'Incomplete current teaching context',
);
const referencing = tasks.exercises.filter(task => task.figure_refs.includes(figureId));
assert.deepEqual(
  exerciseContexts.map(entry => String(entry.exercise)).sort(),
  referencing.map(task => task.number).sort(),
  'Incomplete figure-referencing example context',
);
for (const context of exerciseContexts) {
  const task = referencing.find(item => item.number === String(context.exercise));
  assert.ok(task);
  assert.equal(normalize(context.text), normalize(task.text));
}
const durable = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/figures`;
await fs.mkdir(durable, { recursive: true });
const specFile = `${durable}/${figureId}.spec.json`;
const mediaFile = `${durable}/${figureId}.svg`;
const evidenceFile = `${durable}/${figureId}.render.json`;
for (const destination of [specFile, mediaFile, evidenceFile]) {
  assert.equal(await fs.access(destination).then(() => true, () => false), false);
}
const evidence = await load(bindings.render.path);
assert.equal(evidence.status, 'pass');
assert.equal(evidence.spec.sha256, bindings.spec.sha256);
assert.equal(evidence.output.svg.sha256, bindings.svg.sha256);
await fs.copyFile(bindings.spec.path, specFile);
await fs.copyFile(bindings.svg.path, mediaFile);
evidence.spec.path = specFile;
evidence.output.svg.path = mediaFile;
await save(evidenceFile, evidence);
await save(`${durable}/${figureId}.independent-review.json`, {
  ...reviewed,
  originalReport: {
    path: reportFile.replace('/tmp/', '/evidence/reports/'), sha256: hash(reportBytes),
  },
  promotion: {
    sourceSpecBytesUnchanged: true, mediaBytesUnchanged: true,
    evidenceOnlyPathRebound: true,
    durable: { spec: specFile, svg: mediaFile, render: evidenceFile },
  },
});
execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', specFile, '--render', evidenceFile,
  '--output', `${durable}/${figureId}.review.json`, '--status', 'pass',
  '--notes', 'Existing independent source/full-prose/solved-example/pixel review consumed once. Spec/media bytes unchanged; mixed context partitioned by exercise identity.',
], { stdio: 'inherit' });
const manifestFile = template.replace('exercises.template.json', 'figures.template.json');
const manifest = await load(manifestFile);
const entry = manifest.figures.find(figure => figure.id === figureId);
assert.ok(entry);
for (const field of ['png', 'svg', 'artwork', 'render', 'generation', 'review', 'spec']) delete entry[field];
Object.assign(entry, {
  spec: `figures/${figureId}.spec.json`, svg: `figures/${figureId}.svg`,
  render: `figures/${figureId}.render.json`, review: `figures/${figureId}.review.json`,
});
await save(manifestFile, manifest);
console.log(`Promoted independently reviewed ${book}/${lessonId}/${figureId}`);
