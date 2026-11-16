import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const verify = async value => {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) assert.equal((await bind(value.path)).sha256, value.sha256, value.path);
  for (const child of Object.values(value)) await verify(child);
};
const freezePath = `${work}/d017-n59-figure-author-freeze.json`;
const freeze = await read(freezePath);
await verify(freeze);
assert.equal(freeze.status, 'author-frozen-independent-review-pending');
const { bindings } = freeze;
const spec = await read(bindings.spec.path);
const render = await read(bindings.render.path);
const context = await read(bindings.context.path);
const lesson = await read(bindings.lesson.path);
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, bindings.spec.sha256);
assert.equal(render.output.svg.sha256, bindings.svg.sha256);
assert.deepEqual(context.lessons[0].fullProse, lesson.prose);
const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n');
assert.equal(context.lessons[0].authoritativeText, fullText);
assert.equal(spec.source.authoritativeText[0].text, fullText);
assert.deepEqual(spec.source.image, bindings.source);
const points = spec.objects.filter(item => item.type === 'point');
assert.equal(points.length, 8);
assert.equal(points.find(item => item.id === 'nucleus').label, '+');
assert.equal(points.find(item => item.id === 'nucleus').fill, 'ink');
assert.ok(points.filter(item => item.id !== 'nucleus').every(item => item.label === '\u2212' && item.fill === 'paper'));
assert.equal(spec.objects.filter(item => item.type === 'circle').length, 2);
assert.equal(spec.assertions.filter(item => item.type === 'pointOnCircle').length, 7);
const metrics = await read(freeze.previewMetrics.path);
assert.ok(metrics.outputs.every(item => !item.metrics.horizontalOverflow &&
  item.metrics.labels.length === 8 && item.metrics.labels.every(label => label.withinMedia && label.px >= 16)));
const reportPath = `${work}/9p-n59-figure-review.json`;
await fs.writeFile(reportPath, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: freeze.lesson, status: 'pass',
  reviewKind: 'unique-independent-source-spec-actual-preview-gate',
  authorFreeze: await bind(freezePath),
  figures: [{
    id: 'fig-103', status: 'pass', reviewer: 'Main, independent of Carson author',
    contextKind: 'lesson', bindings,
    inspectedPixels: freeze.previews.map(preview => ({ ...preview, actuallyOpenedByReviewer: true })),
    independentSourceAndPixelObservations: [
      'Original103 opened before authoring in the main session. Current640/331/342px previews now opened separately at original resolution: one solid positive nucleus, two shared-center outlines, two inner and five outer hollow negative markers.',
      'The two inner markers remain upper-left/lower-right; outer five remain upper-left/top-right/right/lower-right/lower-left. Every visible sign belongs to its native semantic marker; no missing or detached sign, clipping, collision or extra construction point.',
      'Complete approved prose explicitly identifies an uncalibrated old-style schematic, not actual electron trajectories, an element, atomic number or nucleon count. No such inference or answer-bearing annotation is added.',
      'All eight labels are legible at actual mobile widths; recorded minimum18.61875px, neutral ink/paper structure, no cultural text or symbols.',
    ],
    nativeMathematicalAssertions: freeze.authorAssertions,
    initialRepairsUsed: 0, remainingRepairs: 1, findings: [],
  }],
  actualPreviewImageCalls: 3,
  limits: 'One new independent gate; existing source opening and SCI reused. Native render reports consumed without rerender. No source/SCI repetition, new image generation, production write or whole-project check.',
}, null, 2) + '\n', { flag: 'wx' });
const promotion = execFileSync(process.execPath, [
  `${work}/promote-d017-figure.mjs`, '9p', freeze.lesson, 'fig-103', reportPath,
], { encoding: 'utf8' });
process.stdout.write(promotion);
const args = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', freeze.lesson,
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args, { encoding: 'utf8' });
process.stdout.write(output);
const folder = `ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${freeze.lesson}`;
assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
await fs.writeFile(`${work}/d017-n59-nativefinalization.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', lesson: freeze.lesson,
  science: await bind(freeze.science.path), figureGate: await bind(reportPath),
  promotion, finalization: { command: args, output },
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`))),
  completeBatchClaim: false, limits: 'One native adaptation after first independent figure gate. Offline batch surface still pending.',
}, null, 2) + '\n', { flag: 'wx' });
