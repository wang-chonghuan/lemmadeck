import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { bind, read, verify, ticket, book, exists } from './retain-d016-evidence.mjs';

const [number, figureReport] = process.argv.slice(2);
assert.ok(['64', '65'].includes(number) && figureReport);
const id = `phy9-c2-s2-n${number}`;
const work = `${ticket}/tmp`;
const sciencePath = `${work}/9p-n${number}-science-review.json`;
const science = await read(sciencePath);
assert.equal(science.status, 'pass');
const archivedFiguresTemplate = number === '64'
  ? `${work}/d018-bound-inputs/${id}/template-figures.template.json`
  : `${work}/9p-n65-before/figures.template.json`;
for (const [key, binding] of Object.entries(science.bindings)) {
  if (binding?.path && binding.sha256) {
    await verify(key === 'figuresTemplate' ? archivedFiguresTemplate : binding.path, binding.sha256);
  }
}
const figuresGate = await read(figureReport);
assert.equal(figuresGate.status, 'pass');
const source = await read(`${book}/lessons/${id}/lesson.json`);
const sourceExercises = await read(`${book}/lessons/${id}/exercises.json`);
assert.equal(sourceExercises.exercises.length, 0);
const reviewed = figuresGate.figures;
assert.deepEqual(reviewed.map(figure => figure.id).sort(), source.figures.map(figure => figure.id).sort());
for (const figure of reviewed) {
  assert.equal(figure.status, 'pass');
  const current = await read(`${book}/editions/modern-us-neutral/figures/${figure.id}.independent-review.json`);
  assert.equal(current.status, 'pass');
  assert.equal(current.originalReport.sha256, (await bind(figureReport)).sha256);
}
const tracePath = `${work}/d018-n${number}-native-finalization.json`;
assert.ok(!await exists(tracePath), 'Native finalization already consumed');
const indexPath = `${book}/editions/modern-us-neutral/book.json`;
const beforeDirectory = `${work}/d018-native-before`;
await fs.mkdir(beforeDirectory, { recursive: true });
const beforePath = `${beforeDirectory}/n${number}-book.json`;
await fs.copyFile(indexPath, beforePath, fs.constants.COPYFILE_EXCL);
const before = { ...await bind(beforePath), originalPath: indexPath };
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', id,
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const folder = `${book}/editions/modern-us-neutral/lessons/${id}`;
assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
assert.equal((await read(`${folder}/exercises.json`)).count, 0);
await fs.writeFile(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', card: id, status: 'pass',
  science: await bind(sciencePath), figureGate: await bind(figureReport),
  frozenPrePromotionFiguresTemplate: {
    ...await bind(archivedFiguresTemplate), originalPath: science.bindings.figuresTemplate.path,
    basis: 'Exact original SCI-bound bytes retained; approved promotion updates figure paths, not prose or source.',
  },
  command, output, priorModernIndex: before,
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`))),
  limits: 'One native edition finalization after SCI and unique figure approval. Zero tasks preserved. No SCI/figure gate rerun, browser, database write or full-project check.',
}, null, 2)}\n`, { flag: 'wx' });

