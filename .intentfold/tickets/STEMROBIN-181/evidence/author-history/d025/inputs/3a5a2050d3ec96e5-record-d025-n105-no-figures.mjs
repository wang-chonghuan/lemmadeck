import assert from 'node:assert/strict';
import {
  ticket, read, bind, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const output = `${tmp}/9p-n105-figure-review.json`;
assert.ok(!await exists(output));
const card = 'phy9-c2-s4-n105';
const sourcePath = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${card}/lesson.json`;
const templateRoot = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
const source = await read(sourcePath);
const lesson = await read(`${templateRoot}/lesson.template.json`);
const manifest = await read(`${templateRoot}/figures.template.json`);
assert.deepEqual(source.figures, []);
assert.deepEqual(manifest.figures, []);
assert.ok(source.prose.every(row => row.kind !== 'fig'));
assert.ok(lesson.prose.every(row => row.kind !== 'fig'));
assert.ok(!source.prose.some(row => /\u56fe\s*\d+/.test(row.text ?? '')));
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D025', lesson: card, status: 'pass',
  disposition: 'FIGURES_NOT_APPLICABLE_SOURCE_DERIVED',
  figures: [], source: await bind(sourcePath),
  lesson: await bind(`${templateRoot}/lesson.template.json`),
  manifest: await bind(`${templateRoot}/figures.template.json`),
  authorFreeze: await bind(`${tmp}/9p-n105-prose-freeze.json`),
  limits: 'No figures in the original or edition manifests/prose. This is an applicability record, not an independent figure pixel review. No images, rendering, generation, promotion or invented figure.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
