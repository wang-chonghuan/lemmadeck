import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const numbers = process.argv.slice(2);
assert.ok(numbers.length >= 3 && numbers.length <= 5);
assert.equal(new Set(numbers).size, numbers.length);
const cards = numbers.map(number => `phy9-c2-s2-n${number}`);
const tracePath = `${ticket}/tmp/d020-native-offline-render.json`;
assert.ok(!await exists(tracePath), 'Batch render already consumed');
const nativeTraces = [];
for (const number of numbers) {
  const file = `${ticket}/tmp/d020-n${number}-native-finalization.json`;
  const trace = await read(file);
  assert.equal(trace.status, 'pass');
  for (const binding of trace.outputs) await verify(binding.path, binding.sha256);
  nativeTraces.push(await bind(file));
}
const command = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
  '--book', '9p', '--edition', 'modern-us-neutral',
  ...cards.flatMap(card => ['--lesson', card])];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, {
  encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
process.stdout.write(output);
const html = await Promise.all(cards.flatMap(card => ['text', 'exercises'].map(surface =>
  bind(`.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${card}/${surface}.html`))));
for (const card of cards) {
  assert.equal((await read(`${book}/editions/modern-us-neutral/lessons/${card}/exercises.json`)).count, 0);
}
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D020', status: 'pass-native-render-batch-display-pending',
  cards, command, output, nativeTraces, html,
  limits: 'One native offline render for explicit complete cards. Existing substantive gates consumed, not rerun. Desktop/mobile and bounded pixel review remain required. No production write.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(tracePath)));
