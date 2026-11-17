import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import {
  absolute, read, bytes, bind, verify, exists, immutableWrite, scratch,
} from './retain-d016-evidence.mjs';

const [card, id, reportPath] = process.argv.slice(2);
assert.equal(card, 'phy9-c2-s4-n113');
assert.ok(['fig-229', 'fig-230', 'fig-231', 'fig-232'].includes(id));
const report = await read(reportPath);
assert.equal(report.status, 'pass');
const reviewed = report.figures.find(row => row.id === id);
assert.equal(reviewed.status, 'pass');
const binding = reviewed.bindings;
for (const key of ['source', 'context', 'lesson', 'english', 'spec', 'render', 'svg'])
  await verify(binding[key].path, binding[key].sha256);
for (const row of Object.values(binding))
  if (row.path && row.sha256) await verify(row.path, row.sha256);
const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}/lesson.template.json`;
await verify(template, binding.lesson.sha256);
const chinese = await read(template);
const english = await read(binding.english.path);
const spec = await read(binding.spec.path);
assert.equal(spec.id, id);
assert.ok(['deterministic', 'hybrid'].includes(spec.mode));
assert.equal(spec.source.image.sha256, binding.source.sha256);
const normalize = text => text.replace(/\s+/g, '');
const allText = lesson => lesson.prose.map(row => row.text).filter(Boolean).join('\n\n');
const variants = lesson => [
  allText(lesson),
  [lesson.printed_title, allText(lesson)].filter(Boolean).join('\n\n'),
  [lesson.title, allText(lesson)].filter(Boolean).join('\n\n'),
  lesson.prose.filter(row => row.kind === 'p').map(row => row.text).filter(Boolean).join('\n\n'),
];
const contexts = spec.source.authoritativeText.filter(row => row.lesson === card);
const lessonContexts = contexts.filter(row => row.exercise == null);
const joined = normalize(lessonContexts.map(row => row.text).join('\n\n'));
const completeContexts = [
  ...variants(chinese),
  ...variants(chinese).flatMap(zh => variants(english).map(en => `${zh}\n\n${en}`)),
];
assert.ok(completeContexts.some(text => normalize(text) === joined), 'Incomplete bilingual lesson context.');
if (id === 'fig-232') {
  assert.ok(binding.exercises && binding.englishExercises);
  const exercisesPath = template.replace('lesson.template.json', 'exercises.template.json');
  await verify(exercisesPath, binding.exercises.sha256);
  const chineseExercises = await read(exercisesPath);
  const englishExercises = await read(binding.englishExercises.path);
  const referencing = chineseExercises.exercises.filter(row =>
    row.figure_refs?.includes(id) || row.figures?.some(figure => figure.id === id));
  assert.ok(referencing.length);
  const exerciseContexts = contexts.filter(row => row.exercise != null);
  assert.deepEqual([...new Set(exerciseContexts.map(row => String(row.exercise)))].sort(),
    referencing.map(row => String(row.number)).sort());
  for (const exercise of referencing) {
    const aligned = englishExercises.exercises.find(row => String(row.number) === String(exercise.number));
    assert.ok(aligned);
    const text = exerciseContexts.filter(row => String(row.exercise) === String(exercise.number))
      .map(row => row.text).join('\n\n');
    assert.equal(normalize(text), normalize(`${exercise.text}\n\n${aligned.text}`),
      'The complete worked question and solution must remain bound in both languages.');
  }
}
const render = await read(binding.render.path);
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, binding.spec.sha256);
assert.equal(render.output.svg.sha256, binding.svg.sha256);
const hybrid = spec.mode === 'hybrid';
if (hybrid) {
  assert.ok(binding.artwork);
  await verify(binding.artwork.path, binding.artwork.sha256);
  assert.equal(render.output.artwork.sha256, binding.artwork.sha256);
  for (const asset of render.assets) {
    assert.ok(!scratch(asset.path) && !scratch(asset.metadata.path), 'Unretained hybrid asset.');
    await verify(asset.path, asset.sha256);
    await verify(asset.metadata.path, asset.metadata.sha256);
  }
  for (const asset of spec.assets)
    assert.ok(!scratch(asset.path) && !scratch(asset.metadata), 'Scratch dependency in final spec.');
}
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures';
const destinations = {
  spec: `${durable}/${id}.spec.json`, svg: `${durable}/${id}.svg`,
  ...(hybrid ? { artwork: `${durable}/${id}.artwork.png` } : {}),
  render: `${durable}/${id}.render.json`,
  independent: `${durable}/${id}.independent-review.json`,
  review: `${durable}/${id}.review.json`,
};
for (const destination of Object.values(destinations)) assert.ok(!await exists(destination));
for (const key of ['spec', 'svg', ...(hybrid ? ['artwork'] : [])])
  await immutableWrite(destinations[key], await bytes(binding[key].path));
const currentRender = structuredClone(render);
currentRender.spec.path = destinations.spec;
currentRender.output.svg.path = destinations.svg;
if (hybrid) currentRender.output.artwork.path = destinations.artwork;
await immutableWrite(destinations.render, `${JSON.stringify(currentRender, null, 2)}\n`);
const retainedReportPath = reportPath.replace('/tmp/', '/evidence/reports/');
await verify(retainedReportPath, (await bind(reportPath)).sha256);
await immutableWrite(destinations.independent, `${JSON.stringify({
  ...reviewed, originalReport: await bind(retainedReportPath),
  promotion: {
    sourceSpecBytesUnchanged: true, mediaBytesUnchanged: true,
    evidenceOnlyPathRebound: true, completeBilingualContextBound: true,
    layeredHybridNoFlattenedPublication: hybrid, durable: destinations,
  },
}, null, 2)}\n`);
execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', destinations.spec, '--render', destinations.render,
  '--output', destinations.review, '--status', 'pass',
  '--notes', 'Existing independent source/full-bilingual-text/actual-width pixel gate consumed. Approved spec and media unchanged; render output paths alone rebound.',
], { stdio: 'inherit' });
const manifestPath = template.replace('lesson.template.json', 'figures.template.json');
const manifest = await read(manifestPath);
const entry = manifest.figures.find(row => row.id === id);
assert.ok(entry);
for (const key of ['png', 'svg', 'artwork', 'render', 'generation', 'review', 'spec']) delete entry[key];
Object.assign(entry, {
  spec: `figures/${id}.spec.json`, svg: `figures/${id}.svg`,
  ...(hybrid ? { artwork: `figures/${id}.artwork.png` } : {}),
  render: `figures/${id}.render.json`, review: `figures/${id}.review.json`,
});
await fs.writeFile(absolute(manifestPath), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ id, outputs: await Promise.all(Object.values(destinations).map(bind)) }));
