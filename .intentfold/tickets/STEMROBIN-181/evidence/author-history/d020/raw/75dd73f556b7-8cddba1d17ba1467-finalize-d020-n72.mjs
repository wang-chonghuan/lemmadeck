import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  ticket, book, read, bind, verify, bytes, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const card = 'phy9-c2-s2-n72';
const sciencePath = `${work}/9p-n72-science-review.json`;
const gatePath = `${work}/9p-n72-figure-review.json`;
const tracePath = `${work}/d020-n72-native-finalization.json`;
assert.ok(!await exists(tracePath), 'Native finalization already consumed.');
await verify(gatePath, 'feec57d9e3d79999530b77248f19d06c026620550371be6bedc4ea25c6b38f64');
const science = await read(sciencePath);
const gate = await read(gatePath);
assert.equal(science.status, 'pass');
assert.equal(gate.status, 'pass');
const aliases = {
  figuresTemplate: gate.archivedScienceFiguresTemplate.path,
  lessonSkill: `${work}/skill-policy-before185/lesson.SKILL.md`,
  nativeContinuationRule: `${work}/skill-policy-before185/assemble.before-gap-fix.py`,
};
const consumedBindings = [];
for (const [key, binding] of Object.entries(science.bindings)) {
  if (!binding?.path || !binding.sha256) continue;
  const file = aliases[key] ?? binding.path;
  await verify(file, binding.sha256);
  consumedBindings.push({ originalPath: binding.path, ...await bind(file) });
}
const source = await read(`${book}/lessons/${card}/lesson.json`);
assert.equal((await read(`${book}/lessons/${card}/exercises.json`)).exercises.length, 0);
assert.deepEqual(gate.figures.map(item => item.id).sort(), source.figures.map(item => item.id).sort());
for (const figure of gate.figures) {
  assert.equal(figure.status, 'pass');
  assert.ok(!await exists(`${book}/editions/modern-us-neutral/figures/${figure.id}.spec.json`));
}
for (const figure of gate.figures) {
  execFileSync(process.execPath, [`${work}/promote-d005-figure.mjs`, '9p', card, figure.id, gatePath],
    { stdio: 'inherit' });
}
const indexPath = `${book}/editions/modern-us-neutral/book.json`;
const prior = await bind(indexPath);
const snapshot = `${work}/d020-native-before/n72-book-${prior.sha256.slice(0, 12)}.json`;
await immutableWrite(snapshot, await bytes(indexPath));
const command = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, {
  encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
process.stdout.write(output);
const folder = `${book}/editions/modern-us-neutral/lessons/${card}`;
assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
assert.equal((await read(`${folder}/exercises.json`)).count, 0);
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D020', card, status: 'pass',
  science: await bind(sciencePath), figureGate: await bind(gatePath),
  archivedScienceFiguresTemplate: gate.archivedScienceFiguresTemplate,
  consumedBindings, command, output,
  priorModernIndex: { originalPath: indexPath, ...await bind(snapshot) },
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`))),
  limits: 'Existing unique SCI and four figure approvals consumed, not rerun. One native finalization; zero source tasks retained. Batch display pending. No image opens, DB writes or full-project checks.',
}, null, 2)}\n`);
console.log(JSON.stringify({ trace: await bind(tracePath), displayPending: true }));
