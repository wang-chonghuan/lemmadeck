import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { bind, read } from './retain-d016-evidence.mjs';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const tracePath = `${work}/d018-n63-native-finalization.json`;
const trace = await read(tracePath);
const original = trace.priorModernIndex;
const bytes = execFileSync('git', ['show', `6dc097a1f7030f18c0793250c96a9c0017ec23d9:${original.path}`]);
const sha256 = createHash('sha256').update(bytes).digest('hex');
assert.equal(sha256, original.sha256);
const directory = `${work}/d018-native-before`;
await fs.mkdir(directory, { recursive: true });
const output = `${directory}/n63-book.json`;
await fs.writeFile(output, bytes, { flag: 'wx' });
await fs.writeFile(`${work}/d018-n63-prior-index-archival-recovery.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'exact-historical-bytes-recovered',
  trace: await bind(tracePath), recovered: { ...await bind(output), originalPath: original.path },
  basis: 'Exact bytes from pushed D017 Git revision match the original finalization trace SHA.',
  limits: 'Later archival recovery only; original trace unchanged, no gate or finalization rerun.',
}, null, 2)}\n`, { flag: 'wx' });
console.log(output);
