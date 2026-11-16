import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify, exists } from './retain-d016-evidence.mjs';

const numbers = process.argv.slice(2);
assert.deepEqual(numbers, ['67', '73', '74']);
const cards = numbers.map(number => `phy9-c2-s2-n${number}`);
const tracePath = `${ticket}/tmp/d019-native-offline-render.json`;
assert.ok(!await exists(tracePath), 'Batch render already consumed');
const nativeTraces = [];
for (const number of numbers) {
  const file = `${ticket}/tmp/d019-n${number}-native-finalization.json`;
  const trace = await read(file);
  assert.equal(trace.status, 'pass');
  for (const binding of trace.outputs) await verify(binding.path, binding.sha256);
  nativeTraces.push(await bind(file));
}
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
  '--book', '9p', '--edition', 'modern-us-neutral',
  ...cards.flatMap(card => ['--lesson', card]),
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const html = await Promise.all(cards.flatMap(card => ['text', 'exercises'].map(surface =>
  bind(`.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${card}/${surface}.html`))));
for (const card of cards) assert.equal((await read(`${book}/editions/modern-us-neutral/lessons/${card}/exercises.json`)).count, 0);
await fs.writeFile(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D019', status: 'pass-native-render-batch-display-pending',
  cards, command, output, nativeTraces, html,
  limits: 'One native self-contained render for the three complete candidate cards. Desktop/mobile check and actual pixel inspection still required. No production or repeated substantive gate.',
}, null, 2)}\n`, { flag: 'wx' });
