import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const [number, figureReport] = process.argv.slice(2);
assert.ok(['67', '68', '69', '70', '71', '73', '74'].includes(number) && figureReport);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const id = `phy9-c2-s2-n${number}`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({ path, sha256: hash(await fs.readFile(path)) });
const sciencePath = `${ticket}/tmp/9p-n${number}-science-review.json`;
const science = await read(sciencePath);
assert.equal(science.status, 'pass');
const figureGate = await read(figureReport);
assert.equal(figureGate.status, 'pass');
for (const [key, binding] of Object.entries(science.bindings)) {
  if (!binding?.path || !binding.sha256) continue;
  const archived = key === 'figuresTemplate' && figureGate.archivedScienceFiguresTemplate;
  const file = archived ? archived.path : binding.path;
  assert.equal((await bind(file)).sha256, binding.sha256, `Stale science ${key}`);
}
const source = await read(`${book}/lessons/${id}/lesson.json`);
assert.equal((await read(`${book}/lessons/${id}/exercises.json`)).exercises.length, 0);
assert.deepEqual(figureGate.figures.map(item => item.id).sort(), source.figures.map(item => item.id).sort());
for (const item of figureGate.figures) {
  assert.equal(item.status, 'pass');
  const independent = await read(`${book}/editions/modern-us-neutral/figures/${item.id}.independent-review.json`);
  assert.equal(independent.status, 'pass');
  assert.equal(independent.originalReport.sha256, (await bind(figureReport)).sha256);
}
const tracePath = `${ticket}/tmp/d019-n${number}-native-finalization.json`;
assert.equal(await fs.access(tracePath).then(() => true, () => false), false, 'Finalization already consumed');
const indexPath = `${book}/editions/modern-us-neutral/book.json`;
const beforeDirectory = `${ticket}/tmp/d019-native-before`;
await fs.mkdir(beforeDirectory, { recursive: true });
const beforePath = `${beforeDirectory}/n${number}-book.json`;
await fs.copyFile(indexPath, beforePath, fs.constants.COPYFILE_EXCL);
const priorIndex = { ...await bind(beforePath), originalPath: indexPath };
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
  ticket: 'STEMROBIN-181', batch: 'D019', card: id, status: 'pass',
  science: await bind(sciencePath), figureGate: await bind(figureReport),
  archivedScienceFiguresTemplate: figureGate.archivedScienceFiguresTemplate ?? null,
  command, output, priorModernIndex: priorIndex,
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`))),
  limits: 'One native edition finalization after SCI and unique figure approval. Zero tasks retained; batch display remains pending. No repeated gates, browser, DB or full-project check.',
}, null, 2)}\n`, { flag: 'wx' });
