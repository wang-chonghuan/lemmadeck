import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const [number, scienceSha, gateSha] = process.argv.slice(2);
assert.match(number, /^\d+$/);
assert.match(scienceSha, /^[a-f0-9]{64}$/);
assert.match(gateSha, /^[a-f0-9]{64}$/);
const work = `${ticket}/tmp`;
const card = `phy9-c2-s2-n${number}`;
const sciencePath = `${work}/9p-n${number}-science-review.json`;
const gatePath = `${work}/9p-n${number}-figure-review.json`;
const tracePath = `${work}/d020-n${number}-native-finalization.json`;
assert.ok(!await exists(tracePath));
await verify(sciencePath, scienceSha);
await verify(gatePath, gateSha);
const science = await read(sciencePath);
const gate = await read(gatePath);
assert.equal(science.status, 'pass');
assert.equal(gate.status, 'pass');
const manifest = science.bindings.figuresTemplate;
await verify(manifest.path, manifest.sha256);
const archive = `${work}/d020-native-before/n${number}-science-figures.template.json`;
await immutableWrite(archive, await bytes(manifest.path));
const consumedBindings = [];
for (const [key, binding] of Object.entries(science.bindings)) {
  if (!binding?.path || !binding.sha256) continue;
  const file = key === 'figuresTemplate' ? archive : binding.path;
  await verify(file, binding.sha256);
  consumedBindings.push({ originalPath: binding.path, ...await bind(file) });
}
const source = await read(`${book}/lessons/${card}/lesson.json`);
assert.equal(source.exercise_count, 0);
assert.ok(source.figures.length);
assert.deepEqual(gate.figures.map(figure => figure.id).sort(), source.figures.map(figure => figure.id).sort());
for (const figure of gate.figures) {
  assert.equal(figure.status, 'pass');
  assert.ok(!await exists(`${book}/editions/modern-us-neutral/figures/${figure.id}.spec.json`));
}
for (const figure of gate.figures) {
  execFileSync(process.execPath, [`${work}/promote-d005-figure.mjs`, '9p', card, figure.id, gatePath],
    { stdio: 'inherit' });
}
const indexPath = `${book}/editions/modern-us-neutral/book.json`;
const snapshot = `${work}/d020-native-before/n${number}-book-${(await bind(indexPath)).sha256.slice(0, 12)}.json`;
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
  ticket: 'STEMROBIN-181', batch: 'D020', card, status: 'pass',
  science: await bind(sciencePath), figureGate: await bind(gatePath),
  archivedScienceFiguresTemplate: await bind(archive), consumedBindings, command, output,
  priorModernIndex: { originalPath: indexPath, ...await bind(snapshot) },
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`))),
  limits: 'Existing independent science and figure gates consumed once, not repeated. One native finalization. Source zero tasks preserved. Batch display pending; no image, DB or full-project checks.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(tracePath)));
