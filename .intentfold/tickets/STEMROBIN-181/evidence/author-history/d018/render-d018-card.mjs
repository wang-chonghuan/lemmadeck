import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { bind, read, exists, ticket, book } from './retain-d016-evidence.mjs';

const [number] = process.argv.slice(2);
assert.ok(['64', '65'].includes(number));
const card = `phy9-c2-s2-n${number}`;
const work = `${ticket}/tmp`;
const trace = `${work}/d018-n${number}-offline-render.json`;
assert.ok(!await exists(trace), 'Native offline render already consumed');
const finalized = `${work}/d018-n${number}-native-finalization.json`;
assert.equal((await read(finalized)).status, 'pass');
assert.equal((await read(`${book}/editions/modern-us-neutral/lessons/${card}/adaptation.audit.json`)).status, 'pass');
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card,
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const folder = `.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${card}`;
await fs.writeFile(trace, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', card, status: 'pass',
  nativeFinalization: await bind(finalized), command, output,
  surfaces: await Promise.all(['text', 'exercises'].map(surface => bind(`${folder}/${surface}.html`))),
  limits: 'Native offline render once for this card; display checks and pixel review remain pending. No source/SCI/figure review rerun, browser or production write.',
}, null, 2)}\n`, { flag: 'wx' });
