import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = [];
for (const number of process.argv.slice(2)) {
  assert.match(number, /^\d+$/);
  const id = `phy9-c2-s2-n${number}`;
  const directory = `${work}/d018-bound-inputs/${id}`;
  await fs.mkdir(directory, { recursive: true });
  for (const [area, folder, names] of [
    ['source', `${book}/lessons/${id}`, ['lesson.json', 'lesson.md', 'exercises.json']],
    ['template', `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${id}`,
      ['lesson.template.json', 'exercises.template.json', 'figures.template.json']],
  ]) {
    for (const name of names) {
      const originalPath = `${folder}/${name}`;
      const bytes = await fs.readFile(originalPath);
      const destination = `${directory}/${area}-${name}`;
      if (await fs.access(destination).then(() => true, () => false)) {
        assert.equal(hash(await fs.readFile(destination)), hash(bytes), destination);
      } else {
        await fs.writeFile(destination, bytes, { flag: 'wx' });
      }
      manifest.push({ path: destination, originalPath, sha256: hash(bytes) });
    }
  }
}
const output = `${work}/d018-bound-inputs/snapshot-${process.argv.slice(2).join('-')}.json`;
await fs.writeFile(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', role: 'Exact current frozen author inputs before promotion/finalization',
  files: manifest, gatesRerun: false,
}, null, 2)}\n`, { flag: 'wx' });
console.log(path.resolve(output));
