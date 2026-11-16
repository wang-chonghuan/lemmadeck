import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const [number, scienceSha, gateSha] = process.argv.slice(2);
assert.match(number ?? '', /^\d+$/);
assert.ok(['86', '87', '88', '89'].includes(number));
for (const sha of [scienceSha, gateSha]) assert.match(sha ?? '', /^[a-f0-9]{64}$/);
const work = `${ticket}/tmp`;
const card = `phy9-c2-s3-n${number}`;
const effectiveSciencePath = `${work}/9p-n${number}-science-effective-review.json`;
const sciencePath = await exists(effectiveSciencePath)
  ? effectiveSciencePath : `${work}/9p-n${number}-science-review.json`;
const gatePath = `${work}/9p-n${number}-figure-review.json`;
const tracePath = `${work}/d022-n${number}-native-finalization.json`;
assert.ok(!await exists(tracePath));
await verify(sciencePath, scienceSha);
await verify(gatePath, gateSha);
const science = await read(sciencePath);
const gate = await read(gatePath);
assert.equal(science.status, 'pass');
assert.equal(gate.status, 'pass');
const source = await read(`${book}/lessons/${card}/lesson.json`);
const templateRoot = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
const template = await read(`${templateRoot}/lesson.template.json`);
const exerciseTemplate = await read(`${templateRoot}/exercises.template.json`);
assert.equal(exerciseTemplate.count, number === '84' ? 2 : 0);
const expected = new Set(source.figures.map(figure => figure.id));
for (const block of template.prose) for (const figure of block.figures ?? []) expected.add(figure.id);
assert.deepEqual(gate.figures.map(figure => figure.id).sort(), [...expected].sort());
const consumedBindings = [];
for (const [key, binding] of Object.entries(science.bindings)) {
  if (!binding?.path || !binding.sha256) continue;
  let file = binding.path;
  if (key === 'figuresTemplate') {
    const archive = `${work}/d022-native-before/n${number}-science-figures.template.json`;
    if (number === '80' && await exists(`${work}/d022-n80-shared158-preparation.json`)) {
      const metadata = await read(`${work}/d022-n80-shared158-preparation.json`);
      assert.deepEqual(binding, metadata.beforeFigures);
      file = metadata.archivedFigures.path;
    }
    await verify(file, binding.sha256);
    await immutableWrite(archive, await bytes(file));
    file = archive;
  } else if (key === 'lessonTemplate' && number === '80') {
    const metadataPath = `${work}/d022-n80-shared158-preparation.json`;
    if (await exists(metadataPath)) {
      const metadata = await read(metadataPath);
      assert.deepEqual(binding, metadata.beforeLesson);
      file = metadata.archivedLesson.path;
    }
  }
  await verify(file, binding.sha256);
  consumedBindings.push({ originalPath: binding.path, ...await bind(file) });
}
const promoted = [];
for (const figure of gate.figures) {
  assert.equal(figure.status, 'pass');
  const specPath = `${book}/editions/modern-us-neutral/figures/${figure.id}.spec.json`;
  if (await exists(specPath)) {
    assert.equal(figure.id, 'fig-158', 'Only explicit shared158 may reuse an existing output.');
    await verify(specPath, figure.bindings.spec.sha256);
    const base = `${book}/editions/modern-us-neutral/figures/${figure.id}`;
    await verify(`${base}.svg`, figure.bindings.svg.sha256);
    assert.equal((await read(`${base}.review.json`)).status, 'pass');
    const manifestPath = `${templateRoot}/figures.template.json`;
    const manifest = await read(manifestPath);
    const entry = manifest.figures.find(item => item.id === figure.id);
    assert.ok(entry);
    for (const field of ['png', 'svg', 'artwork', 'render', 'generation', 'review', 'spec']) delete entry[field];
    Object.assign(entry, {
      spec: `figures/${figure.id}.spec.json`, svg: `figures/${figure.id}.svg`,
      render: `figures/${figure.id}.render.json`, review: `figures/${figure.id}.review.json`,
    });
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    promoted.push({ id: figure.id, reusedExactSharedOutput: true });
  } else {
    const promoter = number === '84' ? 'promote-d022-figure.mjs' : 'promote-d005-figure.mjs';
    execFileSync(process.execPath, [`${work}/${promoter}`, '9p', card, figure.id, gatePath],
      { stdio: 'inherit' });
    promoted.push({ id: figure.id, reusedExactSharedOutput: false });
  }
}
const indexPath = `${book}/editions/modern-us-neutral/book.json`;
const snapshot = `${work}/d022-native-before/n${number}-book-${(await bind(indexPath)).sha256.slice(0, 12)}.json`;
await immutableWrite(snapshot, await bytes(indexPath));
const command = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, {
  encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
process.stdout.write(output);
const folder = `${book}/editions/modern-us-neutral/lessons/${card}`;
assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D022', card, status: 'pass',
  science: await bind(sciencePath), figureGate: await bind(gatePath),
  consumedBindings, promoted, command, output,
  promoter: await bind(`${work}/${number === '84' ? 'promote-d022-figure.mjs' : 'promote-d005-figure.mjs'}`),
  priorModernIndex: { originalPath: indexPath, ...await bind(snapshot) },
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`))),
  limits: 'Unique existing science/figure gates consumed once. Shared158 exact output reused without redrawing or pixel re-review. One native finalization; original zero-task sets or two worked examples retained. No DB or full-project checks.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(tracePath)));
