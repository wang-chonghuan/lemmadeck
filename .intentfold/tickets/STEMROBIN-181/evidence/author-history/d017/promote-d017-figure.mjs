import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const [book, lessonId, figureId, reportFile] = process.argv.slice(2);
assert.ok(book && lessonId && figureId && reportFile);
const hash = data => createHash('sha256').update(data).digest('hex');
const load = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const save = (file, value) => fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');
const reportBytes = await fs.readFile(reportFile);
const report = JSON.parse(reportBytes);
assert.equal(report.status, 'pass');
const reviewed = report.figures?.find(figure => figure.id === figureId) ?? report;
assert.equal(reviewed.status, 'pass');
const bindings = { ...reviewed.bindings };
for (const name of ['source', 'spec', 'render', 'generation']) {
  bindings[name] ??= reviewed[name];
}
for (const name of ['png', 'svg']) bindings[name] ??= reviewed.outputs?.[name];
for (const name of ['source', 'context', 'spec']) {
  assert.equal(hash(await fs.readFile(bindings[name].path)), bindings[name].sha256, `Stale ${name}`);
}
const spec = await load(bindings.spec.path);
const contextKind = reviewed.contextKind ?? 'lesson';
assert.ok(['lesson', 'exercises'].includes(contextKind));
const template = `.tmp/ld-s10y-lesson/adapt/${book}/modern-us-neutral/lessons/${lessonId}/${contextKind}.template.json`;
assert.equal(hash(await fs.readFile(template)), (bindings.lesson ?? bindings.context).sha256);
assert.equal(spec.id, figureId);
assert.equal(spec.source.image.sha256, bindings.source.sha256);
const lesson = await load(template);
const normalizeSpace = value => value.replace(/\s+/g, '');
const contexts = spec.source.authoritativeText.filter(entry => entry.lesson === lessonId);
assert.ok(contexts.length);
if (contextKind === 'lesson') {
  const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text).filter(Boolean)].join('\n\n');
  const titleText = [lesson.title, ...lesson.prose.map(block => block.text).filter(Boolean)].join('\n\n');
  const proseText = lesson.prose.filter(block => block.kind === 'p').map(block => block.text).filter(Boolean).join('\n\n');
  const joinedContext = contexts.map(entry => entry.text).join('\n\n');
  assert.ok([fullText, titleText, proseText].some(text => normalizeSpace(joinedContext) === normalizeSpace(text)), 'Incomplete current context');
} else {
  for (const context of contexts) {
    const exercise = lesson.exercises.find(entry => entry.number === String(context.exercise));
    assert.ok(exercise, `Missing context exercise ${context.exercise}`);
    assert.equal(normalizeSpace(context.text), normalizeSpace(exercise.text), 'Incomplete current exercise context');
  }
  const referencing = lesson.exercises.filter(entry => entry.figure_refs.includes(figureId));
  const provided = contexts.map(entry => String(entry.exercise));
  assert.equal(new Set(provided).size, provided.length, 'Duplicate exercise context');
  assert.ok(referencing.every(entry => provided.includes(entry.number)),
    'Missing figure-referencing exercise context');
}
const generated = spec.mode === 'generated';
assert.ok(generated || spec.mode === 'deterministic', 'D005 expects generated or deterministic figures');
const mediaKind = generated ? 'png' : 'svg';
const evidenceKind = generated ? 'generation' : 'render';
for (const name of [mediaKind, evidenceKind]) {
  assert.equal(hash(await fs.readFile(bindings[name].path)), bindings[name].sha256, `Stale ${name}`);
}
const durable = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/figures`;
await fs.mkdir(durable, { recursive: true });
const specFile = `${durable}/${figureId}.spec.json`;
const mediaFile = `${durable}/${figureId}.${mediaKind}`;
const evidenceFile = `${durable}/${figureId}.${generated ? 'png.json' : 'render.json'}`;
for (const destination of [specFile, mediaFile, evidenceFile]) {
  assert.equal(await fs.access(destination).then(() => true, () => false), false, `Existing figure must not be overwritten: ${destination}`);
}
await fs.copyFile(bindings.spec.path, specFile);
await fs.copyFile(bindings[mediaKind].path, mediaFile);
const evidence = await load(bindings[evidenceKind].path);
if (generated) {
  assert.equal(evidence.output.sha256, bindings.png.sha256);
  evidence.output.path = mediaFile;
} else {
  assert.equal(evidence.status, 'pass');
  assert.equal(evidence.spec.sha256, bindings.spec.sha256);
  assert.equal(evidence.output.svg.sha256, bindings.svg.sha256);
  evidence.spec.path = specFile;
  evidence.output.svg.path = mediaFile;
}
await save(evidenceFile, evidence);
await save(`${durable}/${figureId}.independent-review.json`, {
  ...reviewed,
  originalReport: { path: reportFile.replace('/tmp/', '/evidence/reports/'), sha256: hash(reportBytes) },
  promotion: {
    sourceSpecBytesUnchanged: true,
    mediaBytesUnchanged: true,
    evidenceOnlyPathRebound: true,
    durable: { spec: specFile, [mediaKind]: mediaFile, [evidenceKind]: evidenceFile },
  },
});
execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', specFile, `--${evidenceKind}`, evidenceFile,
  '--output', `${durable}/${figureId}.review.json`,
  '--status', 'pass',
  '--notes', 'Independent original/current-context/actual-pixel review retained beside this figure. Media/spec bytes unchanged at promotion; evidence output paths alone rebound.',
], { stdio: 'inherit' });
const manifestFile = template.replace(`${contextKind}.template.json`, 'figures.template.json');
const manifest = await load(manifestFile);
const entry = manifest.figures.find(figure => figure.id === figureId);
assert.ok(entry);
for (const field of ['png', 'svg', 'artwork', 'render', 'generation', 'review', 'spec']) delete entry[field];
Object.assign(entry, {
  spec: `figures/${figureId}.spec.json`,
  [mediaKind]: `figures/${figureId}.${mediaKind}`,
  [evidenceKind]: `figures/${figureId}.${generated ? 'png.json' : 'render.json'}`,
  review: `figures/${figureId}.review.json`,
});
await save(manifestFile, manifest);
console.log(`Promoted independently reviewed ${book}/${lessonId}/${figureId}`);
