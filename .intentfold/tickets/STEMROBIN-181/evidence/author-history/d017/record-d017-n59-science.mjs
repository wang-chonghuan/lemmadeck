import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const freezePath = `${work}/9p-n59-prose-freeze.json`;
const freeze = await read(freezePath);
assert.equal(freeze.author_structural_status, 'PASS');
assert.deepEqual(freeze.native_author_checks.errors, []);
for (const binding of Object.values(freeze.bindings)) assert.deepEqual(await bind(binding.path), binding);
const template = await read(freeze.bindings.lesson_template.path);
const source = await read(freeze.bindings.source_lesson.path);
assert.equal(template.prose.length, 16);
assert.equal(source.prose.length, 16);
assert.equal(template.exercise_count, 0);
assert.equal((await read(freeze.bindings.exercises_template.path)).count, 0);
assert.deepEqual(template.source.data, source);
for (const [index, block] of template.prose.entries()) {
  assert.equal(block.source_text, source.prose[index].text);
  assert.deepEqual(block.source_refs, source.prose[index].source_refs);
}
assert.equal(freeze.blockers.length, 1);
assert.equal(freeze.blockers[0].id, 'exact-elementary-charge-reference-addition');
await fs.writeFile(`${work}/9p-n59-science-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: template.id, status: 'pass',
  reviewKind: 'unique-independent-initial-science-gate',
  reviewer: 'Main, independent of Zeno prose author',
  inputOrder: 'Read complete canonical source and all16 current modern blocks plus every source-preservation mapping. Originalfig103 was actually opened before authoring its modern figure; no answer/choice input or prior SCI gate for59.',
  bindings: {
    template: freeze.bindings.lesson_template, source: freeze.bindings.source_lesson,
    exercisesTemplate: freeze.bindings.exercises_template, exercisesSource: freeze.bindings.source_exercises,
    authorFreeze: await bind(freezePath),
    references: await bind(`${work}/d017-n59-science-reference-notes.json`),
    retainedEarlierReferences: freeze.bindings.existing_reference_notes,
  },
  evidence: [
    'Charge is a particle property, not a detachable fluid. Charged particles can have zero net force in a given field; neutral photons still belong to electromagnetism.',
    'Atom mass concentration and quantum motion are distinguished from the old circular schematic. No measured orbit, nuclear constituent count or element identity inferred fromfig103.',
    'Fundamental particles need not have nonzero rest mass; protons/neutrons are composite. Newtonian inverse-square gravity is explicitly weak-field/low-speed/pointlike, not a universal law for every particle.',
    'Inverse-square electrostatics and same-sign/opposite-sign attraction are restricted to static point charges in vacuum; magnetic effects and extended-body redistribution are not reduced to that rule.',
    'The retained10^39 comparison is a same-separation electron-proton order of magnitude. Independent CODATA calculation2.2686614314855565e39 supports it, not an exact equality or universal particle ratio.',
    'Sign convention does not equate proton and electron mass/structure. Simultaneous sign relabeling is distinguished from physically replacing a particle.',
    'Electron/proton exclusivity and universal microsecond lifetime claims are removed. The positron example is qualified against self-decay and environmental interactions.',
    'Neutral neutron/proton mass ordering and composite structure retained; many but not all nuclei contain neutrons.',
    'Source Millikan/Ioffe names retained and declared without invented experimental attribution. Integer net charge is limited to an isolated ordinary atomic body.',
    'Positive elementary charge is the electron charge magnitude, not every particle minimum. Modern quark/antiquark fractional charges and confinement qualify the faithful source1/3 token; no arbitrary electron-charge splitting asserted.',
  ],
  resolvedAuthorBlocker: {
    original: freeze.blockers[0],
    decision: 'Exact SI elementary-charge numerical addition was a main-agent suggestion, not a live-ticket requirement or missing source response target. It is withdrawn. The existing positive-e definition is scientifically complete for this lesson; no template/source/tool change or invented additive numeric declaration.',
    originalBlockedFreezePreserved: true, templateBytesUnchanged: true,
  },
  findings: [], unresolved: [],
  limits: 'SCI only; current modern figure approval/native finalization and offline surfaces remain pending. No earlier source/SCI gate, full-project check, app/dependency/Charter change or production write repeated.',
}, null, 2) + '\n', { flag: 'wx' });
