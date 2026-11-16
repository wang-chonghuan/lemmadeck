import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
for (const [n, index, assessment] of [
  ['n50', 10, 'The affected modern block now uses the registered typical aluminum modulus 7 times10^10 Pa, equivalent to70GPa. Source-bound formula, page hash and math-correction tag agree; the pending-error disclaimer is removed. Every original source body/block/crop and all unaffected modern blocks remain unchanged.'],
  ['n52', 6, 'The affected block explicitly identifies the original numbers/graphs as quantitatively unreconciled and unverified for material parameters, and forbids combining them with the prior modulus example for numerical inference. Source numbers are retained solely as attributed qualitative-comparison evidence; no replacement specimen, value or erratum is invented.'],
]) {
  const freezePath = `${work}/9p-${n}-correction-freeze.json`;
  const freeze = await read(freezePath);
  for (const binding of Object.values(freeze.bindings)) assert.deepEqual(await bind(binding.path), binding);
  const lesson = await read(freeze.bindings.template.path);
  const before = await read(freeze.bindings.before.path);
  for (const [i, block] of lesson.prose.entries()) if (i !== index) assert.deepEqual(block, before.prose[i]);
  assert.deepEqual(lesson.source, before.source);
  assert.deepEqual(lesson.section_breaks, before.section_breaks);
  const native = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', '-c', String.raw`import json,sys
from pathlib import Path
sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")
import edition
p=json.load(sys.stdin)
d=p["lesson"];i=p["index"];root=Path("ssot-resources/soviet10year-textbooks/artifacts/9p")
raw=d["source"]["data"];ex=json.loads((root/"lessons"/d["id"]/"exercises.json").read_text())
corrections,errors=edition.validate_errata(root,raw,ex,d,ex)
profile=json.load(open(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"))
b=d["prose"][i];label=f"lesson.prose[{i}]"
errors+=edition.validate_text(b["source_text"],b["text"],b["changes"],b["numeric_changes"],label,profile["forbidden_terms"]+profile["forbidden_person_names"],b["historical_entities"],corrections.get(label))
flow,anchor_errors=edition.prose_flow_contract(d["prose"],d["section_breaks"])
errors+=anchor_errors
print(json.dumps({"errors":errors,"corrections":corrections,"boundaries":len(flow["boundaries"])}))`,
  ], { input: JSON.stringify({ lesson, index }), encoding: 'utf8' }));
  assert.deepEqual(native.errors, []);
  await fs.writeFile(`${work}/9p-${n}-science-correction.json`, JSON.stringify({
    ticket: 'STEMROBIN-181', lesson: lesson.id, status: 'pass',
    review: 'Main independent F1-only recheck of Carson-authored correction; unchanged initial SCI inherited.',
    initialReview: await bind(`${work}/9p-${n}-science-review.json`),
    correctionFreeze: await bind(freezePath),
    bindings: { template: freeze.bindings.template, source: freeze.bindings.source },
    findings: [{ id: 'F1', status: 'resolved', target: `lesson.prose[${index}]`, assessment }],
    native, allOtherBlocksAndAnchorsUnchanged: true,
    limits: 'No repeated full SCI, source-pixel gate, geometry rendering, browser or whole-project checks.',
  }, null, 2) + '\n', { flag: 'wx' });
}
const freezePath = `${work}/9p-t6-science-correction-freeze.json`;
const freeze = await read(freezePath);
for (const binding of Object.values(freeze.current_templates)) assert.deepEqual(await bind(binding.path), binding);
const exercises = await read(freeze.current_templates['exercises.template.json'].path);
const before = await read(freeze.before_templates['exercises.template.json'].path);
for (const [i, task] of exercises.exercises.entries()) {
  if (!['2', '9'].includes(task.number)) assert.deepEqual(task, before.exercises[i]);
  else {
    const omit = ({ text, lines, ...rest }) => rest;
    assert.deepEqual(omit(task), omit(before.exercises[i]));
  }
}
await fs.writeFile(`${work}/9p-t6-science-correction.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: 'phy9-c1-s5-t6', status: 'pass',
  review: 'Main independent F1-only recheck of Huygens-authored task2/task9 correction.',
  initialReview: await bind(`${work}/9p-t6-science-review.json`),
  correctionFreeze: await bind(freezePath),
  bindings: {
    template: freeze.current_templates['lesson.template.json'],
    exercisesTemplate: freeze.current_templates['exercises.template.json'],
    source: freeze.source.lesson, exercisesSource: freeze.source.exercises,
  },
  findings: [{
    id: 'F1', status: 'resolved',
    assessment: 'Main actually read both corrected stems. Task2 restores supervised experimental comparison, common-temperature/composition/method controls and genuine measurement records. Task9 restores supervised experimental verification of the ideal bubble prediction, while separating theory from actual observations and real-film limitations. No absent records are substituted; no result is fabricated or auto-graded.',
  }],
  allOtherTasksAndIdentityDataUnchanged: true,
  native: freeze.mechanical_validation,
  limits: 'Stem-only approval. Standard answers, choices and completed-card delivery remain pending; task10/11 need honest condition-dependent standard answers.',
}, null, 2) + '\n', { flag: 'wx' });
const n53FreezePath = `${work}/9p-n53-prose-freeze.json`;
const n53Freeze = await read(n53FreezePath);
assert.deepEqual(await bind(n53Freeze.template.path), n53Freeze.template);
assert.deepEqual(await bind(n53Freeze.source.path), n53Freeze.source);
await fs.writeFile(`${work}/9p-n53-science-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: 'phy9-c1-s6-n53', status: 'pass',
  review: 'Unique initial independent SCI by Main on Carson-authored frozen n53 prose.',
  authorFreeze: await bind(n53FreezePath),
  bindings: { template: n53Freeze.template, source: n53Freeze.source },
  coverage: [
    'All five complete prose blocks actually read after source132 closure, seven total source blocks, zero tasks and fig91 placeholder retained.',
    'Small elastic atomic displacement/recovery excludes irreversible damage. Accumulated plastic slip can exceed original spacing while much of the crystal remains ordered, without asserting unchanged neighbours or a defect-free lattice.',
    'Tensile loading can drive resolved shear on appropriate crystal planes. The diagram represents the result of slip, not simultaneous rigid motion of an entire real atomic plane; local dislocation motion is correctly distinguished.',
    'Local defects may nucleate or inhibit slip; a generic weak atom cluster is not made a universal mechanism.',
    'Polycrystal compatibility and grain-boundary obstruction are conditional. Neither arbitrary polycrystals nor smaller grains are universally stronger than every single-crystal orientation.',
  ],
  findings: [],
  nativeAuthorCheck: n53Freeze.nativeAuthorCheck,
  limits: 'No original-pixel/geometry approval, source rereview, finalization, browser or whole-project checks. Fig91 independently reviewed later.',
}, null, 2) + '\n', { flag: 'wx' });
console.log('Affected SCI n50/n52/t6 passed; initial n53 SCI passed.');
