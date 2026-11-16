import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ticket = '.intentfold/tickets/STEMROBIN-181';
const work = '.tmp/STEMROBIN-181/9p-d019-n67-figures';
const destination = `${work}/final-authority-binding`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({ path, sha256: hash(await fs.readFile(path)) });
const verify = async binding => assert.equal((await bind(binding.path)).sha256, binding.sha256, binding.path);
const saveNew = async (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
assert.equal(await fs.access(destination).then(() => true, () => false), false);
const bindingPath = `${ticket}/tmp/d019-n67-figures-context-binding.json`;
const binding = await read(bindingPath);
const authorPath = binding.bindings.originalAuthorFreeze.path;
await verify(binding.bindings.originalAuthorFreeze);
const author = await read(authorPath);
for (const key of ['finalProseFreeze', 'effectiveContext', 'capturedLessonSnapshot', 'finalLessonTemplate']) {
  await verify(binding.bindings[key]);
}
const lesson = await read(binding.bindings.finalLessonTemplate.path);
const beforeLesson = await read(binding.bindings.capturedLessonSnapshot.path);
const context = await read(binding.bindings.effectiveContext.path);
const authority = value => [value.printed_title, ...value.prose.map(block => block.text).filter(Boolean)]
  .map(text => ({ lesson: value.id, text }));
assert.deepEqual(context.authoritativeText, authority(lesson));
const sciencePath = `${ticket}/tmp/9p-n67-science-review.json`;
const science = await read(sciencePath);
assert.equal(science.status, 'pass');
await verify(science.bindings.lessonTemplate);
for (const retained of binding.preservedEvidence) await verify(retained);
await fs.mkdir(destination);
const manifest = science.bindings.figuresTemplate;
await verify(manifest);
await fs.copyFile(manifest.path, `${destination}/figures.template.science-snapshot.json`, fs.constants.COPYFILE_EXCL);
const observations = {
  'fig-113': [
    'Unique initial independent inspection already completed in preceding continuation: original crop113 and actual640/331/342 PNGs individually opened. This step does not repeat those opens.',
    'Positive source signs and eight outward radial directions; negative source signs and eight inward radial directions retained. Arrow endpoints remain radially ordered with the correct direction.',
    'No added probe, trajectory, calibrated scale or answer labels. Complete overhead vector marks visible; labels readable and inside each panel at all three actual widths.',
  ],
  'fig-114': [
    'Unique initial independent inspection already completed in preceding continuation: original crop114 and actual640/331/342 PNGs individually opened. This step does not repeat those opens.',
    'Two signed indexed sources, single shared observation/vector origin, two directed components and their horizontal resultant retained. Independently checked the two component displacement vectors sum to the resultant displacement.',
    'Parallelogram endpoints join correctly. Solid geometry and dashed baseline remain distinct; no trajectory or invented calibrated distance. Indices and vector marks visible with no clipped label at each actual width.',
    'The resultant overhead vector mark is explicitly a justified modern addition in the inventory trace, not a claim about original E pixels.',
  ],
};
const figures = [];
for (const item of author.figures) {
  const b = item.bindings;
  for (const key of ['source', 'spec', 'render', 'svg', 'previews']) await verify(b[key]);
  const oldSpec = await read(b.spec.path);
  assert.deepEqual(oldSpec.source.authoritativeText, authority(beforeLesson));
  const spec = structuredClone(oldSpec);
  spec.source.authoritativeText = authority(lesson);
  const reversed = structuredClone(spec);
  reversed.source.authoritativeText = oldSpec.source.authoritativeText;
  assert.deepEqual(reversed, oldSpec, 'Only full authoritative text changes; geometry/display/assertions/inventory identical.');
  const specPath = `${destination}/${item.id}.spec.json`;
  await saveNew(specPath, spec);
  const currentSpec = await bind(specPath);
  const previews = (await read(b.previews.path)).previews;
  assert.ok(Array.isArray(previews));
  for (const preview of previews) await verify(preview);
  const evidencePath = `${destination}/${item.id}.text-only-rebind.json`;
  await saveNew(evidencePath, {
    oldSpec: b.spec, currentSpec, currentLesson: binding.bindings.finalLessonTemplate,
    contextBinding: await bind(bindingPath), effectiveContext: binding.bindings.effectiveContext,
    changedOnly: '/source/authoritativeText', restoredDeepEquality: true,
    retainedNativeRender: b.render, retainedSvg: b.svg, retainedPreviews: previews,
    noRerenderOrGeometryRepair: true, priorEvidenceImmutable: true,
  });
  const render = await read(b.render.path);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, b.spec.sha256);
  assert.equal(render.output.svg.sha256, b.svg.sha256);
  render.spec = currentSpec;
  render.contextOnlyRebind = {
    originalNativeReport: b.render, previousSpec: b.spec, currentSpec,
    evidence: await bind(evidencePath), changedOnly: '/source/authoritativeText',
    geometryAndDisplayDeepEqual: true, svgAndPreviewBytesUnchanged: true,
    rerendered: false, newRepair: false,
  };
  const renderPath = `${destination}/${item.id}.rebound.render.json`;
  await saveNew(renderPath, render);
  execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py', specPath, '--stage', 'draft',
  ], { stdio: 'inherit' });
  figures.push({
    id: item.id, status: 'pass', reviewer: 'Main, independent of Mencius figure author',
    bindings: {
      source: b.source, context: binding.bindings.effectiveContext,
      lesson: binding.bindings.finalLessonTemplate, spec: currentSpec, svg: b.svg,
      render: await bind(renderPath),
    },
    inspectedPixels: previews.map(preview => ({
      path: preview.path, sha256: preview.sha256, width: preview.width,
      actualOpenedByMain: true, inspection: 'Preceding continuation; no repeat open.',
    })), independentSourceAndPixelObservations: observations[item.id],
    textOnlyRebind: await bind(evidencePath), targetedGeometryRepairs: 0,
    initialIndependentGateConsumedOnce: true, findings: [],
  });
}
const reportPath = `${ticket}/tmp/9p-n67-figure-review.json`;
await saveNew(reportPath, {
  ticket: 'STEMROBIN-181', batch: 'D019', lesson: lesson.id, status: 'pass',
  authorFreeze: await bind(authorPath), contextBinding: await bind(bindingPath),
  science: await bind(sciencePath), figures,
  inspectionBasis: 'Initial unique main visual gate completed before compaction; only affected full-text/spec binding finished now.',
  archivedScienceFiguresTemplate: await bind(`${destination}/figures.template.science-snapshot.json`),
  noRepeatedPixelInspectionOrRender: true,
});
for (const item of figures) execFileSync(process.execPath, [
  `${ticket}/tmp/promote-d005-figure.mjs`, '9p', lesson.id, item.id, reportPath,
], { stdio: 'inherit' });
