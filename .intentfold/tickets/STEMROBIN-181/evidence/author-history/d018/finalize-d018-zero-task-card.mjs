import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { bind, read, verify, ticket, book } from './retain-d016-evidence.mjs';

const [number] = process.argv.slice(2);
assert.match(number, /^\d+$/);
const id = `phy9-c2-s2-n${number}`;
const work = `${ticket}/tmp`;
const report = `${work}/9p-n${number}-science-review.json`;
const science = await read(report);
assert.equal(science.status, 'pass');
for (const binding of Object.values(science.bindings)) {
  if (binding?.path && binding.sha256) await verify(binding.path, binding.sha256);
}
const sourceExercises = await read(`${book}/lessons/${id}/exercises.json`);
assert.equal(sourceExercises.exercises.length, 0);
const tracePath = `${work}/d018-n${number}-native-finalization.json`;
assert.equal(await fs.access(tracePath).then(() => true, () => false), false);
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
  science: await bind(report), command, output, priorModernIndex: before,
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`))),
  limits: 'One native edition finalization after SCI and figure approvals. Zero-task source preserved. Offline gate and delivery remain pending; no production write or full-project check.',
}, null, 2)}\n`, { flag: 'wx' });
