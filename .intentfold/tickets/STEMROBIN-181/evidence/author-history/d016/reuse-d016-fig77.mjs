import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const candidate = '.tmp/STEMROBIN-181/9p-d016-fig77';
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures';
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const previousReportPath = `${work}/9p-n48-figure-review.json`;
const previousReport = await read(previousReportPath);
const previous = previousReport.figures.find(f => f.id === 'fig-77');
assert.equal(previous.status, 'pass');
for (const name of ['source', 'spec', 'png', 'generation', 'context']) {
  assert.deepEqual(await bind(previous.bindings[name].path), previous.bindings[name]);
}
const template = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c1-s6-t8/exercises.template.json';
const exercises = await read(template);
const exercise = exercises.exercises.find(e => e.number === '4');
assert.deepEqual(exercise.figure_refs, ['fig-77']);
assert.match(exercise.text, /外部外观/);
const spec = await read(previous.bindings.spec.path);
spec.source.authoritativeText.push({ lesson: 'phy9-c1-s6-t8', exercise: '4', text: exercise.text });
for (const asset of spec.assets) {
  asset.path = `${durable}/fig-77.png`;
  asset.metadata = `${durable}/fig-77.png.json`;
}
await fs.mkdir(candidate, { recursive: false });
const specPath = `${candidate}/fig-77.spec.json`;
const contextPath = `${candidate}/fig-77.context.json`;
await fs.writeFile(specPath, JSON.stringify(spec, null, 2) + '\n', { flag: 'wx' });
await fs.writeFile(contextPath, JSON.stringify({
  schema: 'ld-s10y-image/context@1', book: '9p', edition: 'modern-us-neutral', figure: 'fig-77',
  sourceImage: previous.bindings.source,
  lessons: [{ lesson: 'phy9-c1-s6-t8', title: '练习 7', exercises: [exercise] }],
  authoritativeRule: 'Current complete t8task4 plus preserved n48 text. One external salt crystal is not an ion-position grid or distance scale.',
  inputs: { previousIndependentPixelGate: await bind(previousReportPath),
    previousSpec: previous.bindings.spec, currentExercises: await bind(template) },
  reusedPixelGate: true, regenerationOrNewPixelGate: false,
}, null, 2) + '\n', { flag: 'wx' });
const validation = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py', specPath, '--stage', 'draft',
], { encoding: 'utf8' });
process.stdout.write(validation);
const manifestPath = template.replace('exercises.template.json', 'figures.template.json');
const manifest = await read(manifestPath);
assert.deepEqual(manifest.figures, []);
const oldManifest = await read('.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c1-s6-n48/figures.template.json');
manifest.figures.push(oldManifest.figures.find(f => f.id === 'fig-77'));
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
await fs.writeFile(`${work}/9p-t8-fig77-context-author-freeze.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'author-frozen-pending-independent-context-only-gate',
  figure: 'fig-77', contextKind: 'exercises',
  previousIndependentReport: await bind(previousReportPath),
  previousIndependentFigure: previous,
  bindings: {
    source: previous.bindings.source, context: await bind(contextPath), spec: await bind(specPath),
    lesson: await bind(template), png: previous.bindings.png, generation: previous.bindings.generation,
  },
  changes: 'Only additional complete t8task4 authoritative context and asset paths pointing to planned durable copies. All source inventory, canvas/display, generated pixels and original generation metadata unchanged. Existing n48 authoritative text retained.',
  validation, sourceInventoryAndPixelApprovalInherited: true,
  noRerenderRegenerationSourcePixelReopenOrRepeatedPixelGate: true,
  pending: 'Independent current-context-only review; approved single77 may promote even though n48 remains blocked79.',
}, null, 2) + '\n', { flag: 'wx' });
