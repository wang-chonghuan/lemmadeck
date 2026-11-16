import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const freezePath = `${work}/9p-n61-prose-freeze.json`;
const freeze = await read(freezePath);
for (const binding of Object.values(freeze.bindings)) {
  assert.equal((await bind(binding.path)).sha256, binding.sha256, binding.path);
}
const lesson = await read(freeze.bindings.template.path);
const source = await read(freeze.bindings.source.path);
assert.equal(lesson.prose.length, 6);
assert.equal((await read(freeze.bindings.exercisesTemplate.path)).exercises.length, 0);
assert.equal((await read(freeze.bindings.figuresTemplate.path)).figures.length, 0);
for (const [index, block] of lesson.prose.entries()) {
  assert.equal(block.source_text, source.prose[index].text);
  assert.deepEqual(block.source_refs, source.prose[index].source_refs);
  assert.deepEqual(block.numeric_changes, []);
}
const gatePath = `${work}/9p-n61-science-review.json`;
await fs.writeFile(gatePath, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: freeze.lesson, status: 'pass',
  reviewer: 'Main, independent of Carson prose author',
  reviewKind: 'unique-independent-initial-science-gate',
  bindings: {
    template: freeze.bindings.template, source: freeze.bindings.source,
    exercisesTemplate: freeze.bindings.exercisesTemplate, exercisesSource: freeze.bindings.sourceExercises,
    authorFreeze: await bind(freezePath),
  },
  sourceBlocksRead: 6, modernBlocksRead: 6, originalMathAtomsRetained: 1,
  substantiveChecks: [
    'Frictional charging transfers charge between the selected bodies. Total charge remains its initial value; zero is only a special initially neutral case. Electron charge is negative, not an all-particle positive-e claim.',
    'The explicitly charge-isolated boundary is sufficient for conservation; internal transfers and neutral-particle/energy exchange are not conflated with total charge change. Algebraic signed sum is distinguished from adding magnitudes.',
    'The original8-1 sum is preserved exactly as a math atom. Its contextual explanation supplies sign and initial-total meaning, without changing its numerical contract.',
    'Particle species and population can change while total charge remains. Equal/opposite pair creation or annihilation is an example, not a universal requirement or claim that every final particle is neutral. The actually read Fermilab ordinary muon decay provides a counterexample to the source universal restriction.',
    'Original explanatory footnote remains curriculum-history context. The source unknown-cause sentence is explicitly attributed to the old book, not asserted as present-day theory; no invented modern theorem, measurement or numeric task added.',
    'Zero source tasks and figures remain zero. All6 source refs, characters and source snapshot bytes preserved; approved modern wording is confined to this edition.',
  ],
  references: [await bind(`${work}/d017-n61-science-reference-notes.json`)],
  findings: [],
  limits: 'One independent new61 SCI gate; existing native author contract checks reused. No source pixel gate, figure, question, previous SCI, app, dependency, full-project check or production write.',
}, null, 2) + '\n', { flag: 'wx' });
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize', '--book', '9p',
  '--edition', 'modern-us-neutral', '--lesson', freeze.lesson,
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const folder = `ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${freeze.lesson}`;
assert.equal((await read(`${folder}/adaptation.audit.json`)).status, 'pass');
await fs.writeFile(`${work}/d017-n61-nativefinalization.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', lesson: freeze.lesson, science: await bind(gatePath),
  nativeFinalization: { command, output },
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${folder}/${name}`))),
  completeBatchClaim: false,
  limits: 'Native adaptation once after first independent SCI. Zero questions, zero figures. Offline batch surface remains pending.',
}, null, 2) + '\n', { flag: 'wx' });
