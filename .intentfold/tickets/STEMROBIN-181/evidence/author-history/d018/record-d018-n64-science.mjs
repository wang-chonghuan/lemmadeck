import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { bind, read, verify } from './retain-d016-evidence.mjs';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const freezePath = `${work}/9p-n64-prose-freeze.json`;
const freeze = await read(freezePath);
const bindings = {};
for (const key of ['source', 'sourceMarkdown', 'sourceExercises', 'template', 'exercisesTemplate', 'figuresTemplate']) {
  const binding = freeze.bindings[key];
  await verify(binding.path, binding.sha256);
  bindings[key] = binding;
}
bindings.authorFreeze = await bind(freezePath);
bindings.references = await bind(`${work}/d018-n64-science-reference-notes.json`);
bindings.rawSolutions = await bind(`${work}/d018-n64-independent-raw-solutions.json`);
const source = await read(bindings.source.path);
const template = await read(bindings.template.path);
assert.deepEqual(template.source.data, source);
assert.equal(template.source.sha256, bindings.source.sha256);
assert.equal(source.prose.length, 42);
assert.equal(template.prose.length, 42);
const atoms = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map(match => match[1] ?? match[2]);
const comparisons = template.prose.map((block, index) => {
  const original = source.prose[index];
  assert.equal(block.source_text, original.text);
  for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs']) assert.deepEqual(block[key], original[key]);
  assert.deepEqual(atoms(block.text), atoms(original.text));
  return { index, source_refs: original.source_refs, source_text_exact: true, math_atoms_exact: true, atoms: atoms(original.text) };
});
assert.deepEqual(template.errata, []);
assert.equal((await read(bindings.sourceExercises.path)).exercises.length, 0);
assert.equal((await read(bindings.exercisesTemplate.path)).exercises.length, 0);
const groups = [
  { blocks: [0, 1], assessment: 'Liquid measurement context retained; ideal uniform linear isotropic static point-charge model explicitly excludes boundaries/cavities/leakage. Solid elastic constraints are distinguished from electric force, not called unmeasurable. Force ratio is not asserted for arbitrary real material or measured total solid force.' },
  { blocks: [2, 3, 4, 5, 6, 7, 8, 9], assessment: 'Original force-ratio, SI/CGSE formulas and8-9 preserved. Epsilon is dimensionless relative permittivity; constant response is conditional on material state and range, not universal across temperature/field/frequency/direction. Vacuum epsilon1 retained; appendix data not invented.' },
  { blocks: [10, 11, 12], assessment: 'Worked-example heading and source example1 remain prose. Neutral water has ten electrons per molecule;0.03/3e-23 gives1e21 molecules and1e22 total electrons, not net excess charge. Original rounded molecular mass retained.' },
  { blocks: [13, 14, 15, 16], assessment: 'Static same-sign vacuum point charges each1C at1km give9000N using source rounded k. No practical charge-retention claim or operating exercise introduced.' },
  { blocks: [17, 18, 19, 20, 21, 22, 23], assessment: 'Example3 conditions supply symmetric horizontal separation, ideal lightweight strings and ignored air/other effects. Tension direction, horizontal and vertical equilibrium are correct. Exact sine geometry r/(2l), not a small-angle replacement, gives0.003515625N and source3.5e-3N. Missing mass is not invented: horizontal balance suffices for tension. Figure slots/caption kept, not visually approved here.' },
  { blocks: [24, 25, 26, 27, 28, 29, 30], assessment: 'Example4 preserves all signed charges, distances and epsilon2.1. Fixed static point-charge/linear-isotropic model is distinguished from constraints holding bodies in place. Pair-force subscripts denote magnitudes; unlike charges attract and like charges repel; nonadjacent separation is the adjacent-distance sum.' },
  { blocks: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41], assessment: 'Independent raw-source vector calculation confirms right/left/left directions and rounded14.5/14.0/0.5microN. First and second magnitudes add; third opposing magnitudes subtract with larger attraction left. Pair action/reaction belongs to different bodies; zero total internal-force vector sum does not mean each body has zero electric resultant. Figure slots/caption not visually approved here.' }
].map(group => ({ ...group, status: 'pass', source_refs: group.blocks.flatMap(index => source.prose[index].source_refs) }));
assert.deepEqual(groups.flatMap(group => group.blocks).sort((a, b) => a - b), Array.from({ length: 42 }, (_, i) => i));
await fs.writeFile(`${work}/9p-n64-science-review.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', lesson: 'phy9-c2-s2-n64',
  reviewer: 'session-D, independent of Zeno prose author', status: 'pass',
  reviewKind: 'unique-independent-initial-science-gate', bindings,
  inspected_scope: 'One SCI inspection: entire source read and raw example solutions recorded earlier in this inspection; complete frozen42-block modern template and metadata now read. No repeated source/native-author/figure gate.',
  raw_comparison: {
    source_snapshot_deep_equal: true, source_blocks: 42, modern_blocks: 42,
    per_block: comparisons, original_and_modern_tasks: 0,
    worked_examples_remain_prose: 4, figures: ['fig-108', 'fig-109'],
    errata: [], normalized_paragraphs: 45, native_section_boundaries: 4,
    native_author_check_reused: freeze.nativeAuthorCheck,
  },
  block_assessments: groups, findings: [],
  limits: 'No figure pixel approval, author check rerun, source/modern edits, task invention, answer/choice gate, native finalization, browser, production write or full-project check.',
  in_flight_processes: []
}, null, 2)}\n`, { flag: 'wx' });
console.log(`${work}/9p-n64-science-review.json`);
