import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  ticket, book, read, bind, verify, bytes, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [number, scienceSha, figureSha] = process.argv.slice(2);
assert.ok(['90', '91', '92'].includes(number));
for (const sha of [scienceSha, figureSha]) assert.match(sha ?? '', /^[a-f0-9]{64}$/);
const tmp = `${ticket}/tmp`;
const card = `phy9-c2-s3-n${number}`;
const effective = `${tmp}/9p-n${number}-science-effective-review.json`;
const sciencePath = await exists(effective) ? effective : `${tmp}/9p-n${number}-science-review.json`;
const gatePath = `${tmp}/9p-n${number}-figure-review.json`;
const receipt = `${tmp}/d023-n${number}-native-finalization.json`;
assert.ok(!await exists(receipt));
await verify(sciencePath, scienceSha);
await verify(gatePath, figureSha);
const science = await read(sciencePath);
const gate = await read(gatePath);
assert.equal(science.status, 'pass');
assert.equal(gate.status, 'pass');
const templateRoot = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
assert.equal((await read(`${templateRoot}/exercises.template.json`)).count, 0);
const source = await read(`${book}/lessons/${card}/lesson.json`);
assert.deepEqual(gate.figures.map(row => row.id).sort(), source.figures.map(row => row.id).sort());
const consumedBindings = [];
for (const [name, binding] of Object.entries(science.bindings)) {
  if (!binding?.path || !binding.sha256) continue;
  await verify(binding.path, binding.sha256);
  let file = binding.path;
  if (name === 'figuresTemplate') {
    file = `${tmp}/d023-native-before/n${number}-science-figures.template.json`;
    await immutableWrite(file, await bytes(binding.path));
  }
  consumedBindings.push({ originalPath: binding.path, ...await bind(file) });
}
const promoted = [];
for (const figure of gate.figures) {
  assert.ok(!await exists(`${book}/editions/modern-us-neutral/figures/${figure.id}.spec.json`));
  execFileSync(process.execPath, [`${tmp}/promote-d005-figure.mjs`, '9p', card, figure.id, gatePath],
    { stdio: 'inherit' });
  promoted.push({ id: figure.id, mode: figure.bindings.generation ? 'generated' : 'deterministic' });
}
const indexPath = `${book}/editions/modern-us-neutral/book.json`;
const indexSnapshot = `${tmp}/d023-native-before/n${number}-book-${(await bind(indexPath)).sha256.slice(0, 12)}.json`;
await immutableWrite(indexSnapshot, await bytes(indexPath));
const command = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command,
  { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
process.stdout.write(output);
const folder = `${book}/editions/modern-us-neutral/lessons/${card}`;
assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
await immutableWrite(receipt, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D023', card, status: 'pass',
  science: await bind(sciencePath), figureGate: await bind(gatePath),
  consumedBindings, promoted, command, output,
  priorModernIndex: { originalPath: indexPath, ...await bind(indexSnapshot) },
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`))),
  limits: 'Existing owning gates consumed once and existing promoter reused. One native finalization. Source-defined zero tasks unchanged; no production/full-project operation.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(receipt)));
