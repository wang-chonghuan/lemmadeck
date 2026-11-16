import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { bind, read, verify } from './retain-d016-evidence.mjs';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const freezePath = `${work}/9p-n65-prose-freeze.json`;
const freeze = await read(freezePath);
const bindings = {};
for (const key of ['source', 'sourceMarkdown', 'sourceExercises', 'template', 'exercisesTemplate', 'figuresTemplate']) {
  const binding = freeze.bindings[key];
  await verify(binding.path, binding.sha256);
  bindings[key] = binding;
}
bindings.authorFreeze = await bind(freezePath);
bindings.references = await bind(`${work}/d018-n65-science-reference-notes.json`);
const source = await read(bindings.source.path);
const template = await read(bindings.template.path);
assert.deepEqual(template.source.data, source);
assert.equal(template.source.sha256, bindings.source.sha256);
assert.equal(source.prose.length, 14);
assert.equal(template.prose.length, 14);
const atoms = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map(match => match[1] ?? match[2]);
const comparisons = template.prose.map((block, index) => {
  const original = source.prose[index];
  assert.equal(block.source_text, original.text);
  for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs']) assert.deepEqual(block[key], original[key]);
  assert.deepEqual(atoms(block.text), atoms(original.text));
  return { index, source_refs: original.source_refs, source_text_exact: true, math_atoms_exact: true };
});
assert.deepEqual(template.errata, []);
assert.equal((await read(bindings.sourceExercises.path)).exercises.length, 0);
assert.equal((await read(bindings.exercisesTemplate.path)).exercises.length, 0);
assert.deepEqual(template.figures, source.figures);
const groups = [
  { blocks: [0, 1, 2], assessment: 'Quantitative static force law is distinguished from propagation mechanism. Mechanical linkage, pneumatic and electromagnetic door examples retain different physical processes and finite response times; no perfectly rigid instantaneous transmission or unseen medium asserted without evidence.' },
  { blocks: [3, 4], assessment: 'Conversation source figure retained as a slot only. Air sound is described as local pressure and vibration propagation, not bulk transport from mouth to ear. Mechanical-medium requirement is explicitly limited to sound, not generalized to electromagnetic interactions.' },
  { blocks: [5, 6], assessment: 'Source historical near-action hypothesis is attributed to the old book, not adopted as a universal mechanical-medium law. Fields are position/time-dependent measurable physical quantities; vacuum electromagnetic propagation does not require intervening material charges or currents. Maxwell remains an attributed source-history reference without fabricated quote, date or exclusive priority.' },
  { blocks: [7], assessment: 'Newtonian same-time-position force description is framed as an approximation with weak-gravity, low-speed and relevant-time-scale qualifications. Success of this quantitative model does not prove instantaneous long-distance causation; no new numerical gravity law or historical priority claim is added.' },
  { blocks: [8, 9, 10], assessment: 'Instantaneous action-at-distance belongs to historical viewpoint. Static comb/magnet attraction is not a delay measurement. Paper/wood magnet wrapping is qualified by weak magnetic response and approximately unchanged geometry. Contact and thread support involve microscopic electromagnetic interactions and quantum structure; source interatomic gaps are schematic, not proof of no physical influence or unique instantaneous mechanism. Figure110 is not approved by this SCI gate.' },
  { blocks: [11, 12, 13], assessment: 'Coulomb/Ampere identities and quantitative-law history retained without endorsing instantaneous propagation. Predictive evidence replaces prescriptive historical progress rhetoric. Static source formulas are distinguished from moving-charge interactions, which generally need source velocity, acceleration and propagation delay; omission of explicit time dependence is not a causal information law.' },
].map(group => ({ ...group, status: 'pass', source_refs: group.blocks.flatMap(index => source.prose[index].source_refs) }));
assert.deepEqual(groups.flatMap(group => group.blocks).sort((a, b) => a - b), Array.from({ length: 14 }, (_, i) => i));
await fs.writeFile(`${work}/9p-n65-science-review.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', lesson: 'phy9-c2-s2-n65',
  reviewer: 'session-D, independent of Einstein prose author', status: 'pass',
  reviewKind: 'unique-independent-initial-science-gate', bindings,
  inspected_scope: 'Complete source Markdown read earlier in this same SCI inspection; entire frozen14-block modern template, embedded source snapshot and metadata now read. Existing primary reference read reused, not refetched.',
  raw_comparison: {
    source_snapshot_deep_equal: true, source_blocks: 14, modern_blocks: 14,
    per_block: comparisons, original_and_modern_tasks: 0, equations: 0,
    figures: ['tbl-p0163-01', 'fig-110'], errata: [],
    normalized_paragraphs: 19, native_section_boundaries: 4,
    native_author_check_reused: freeze.bindings.nativeAuthorCheckRecord,
  },
  block_assessments: groups, findings: [],
  limits: 'No source/figure pixel gate, native-author check rerun, source/modern edits, task invention, answer/choice gate, native finalization, browser, production write or full-project check.',
  in_flight_processes: [],
}, null, 2)}\n`, { flag: 'wx' });
console.log(`${work}/9p-n65-science-review.json`);
