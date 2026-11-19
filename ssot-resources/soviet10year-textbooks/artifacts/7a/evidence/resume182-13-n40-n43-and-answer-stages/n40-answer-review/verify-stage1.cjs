const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), root, 'Use the exact designated cwd');
const out = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n40-answer-review');
const read = (name) => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'));
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const inputs = read('stage1-inputs.json');
const solved = read('stage1-solutions.json');
const holds = read('table-holds.json');

for (const input of inputs.source_inputs) assert.equal(sha(input.path), input.sha256, input.path);
for (const input of inputs.workflow_inputs) assert.equal(sha(input.path), input.sha256, input.path);
const exerciseFile = JSON.parse(fs.readFileSync(inputs.source_inputs[0].path, 'utf8'));
const lessonFile = JSON.parse(fs.readFileSync(inputs.source_inputs[1].path, 'utf8'));
const numbers = Array.from({ length: 14 }, (_, i) => String(820 + i));
assert.equal(exerciseFile.count, 14);
assert.equal(lessonFile.exercise_count, 14);
assert.deepEqual(exerciseFile.exercises.map((e) => e.number), numbers);
assert.deepEqual(solved.answers.map((a) => a.exercise), numbers);
assert.deepEqual(lessonFile.figures, []);
for (const e of exerciseFile.exercises) {
  assert.deepEqual(e.figure_refs, []);
  assert.deepEqual(e.figures, []);
}
const counts = [8, 6, 6, 8, 10, 2, 6, 2, 4, 3, 4, 5, 2, 1];
assert.deepEqual(solved.answers.map((a) => a.tasks.length), counts);
assert.equal(counts.reduce((a, b) => a + b, 0), 67);
assert.equal(solved.original_labeled_subpart_count + solved.whole_exercise_task_count
  + solved.unlabeled_task_count, 67);
assert.equal(solved.original_prompt_unit_count, 63);
assert.equal(solved.comparison_performed, false);
for (const a of solved.answers) {
  assert.equal(a.grading, 'ungraded');
  assert.equal(a.source, 'derived');
  assert.deepEqual(a.parts, []);
  assert.ok(a.displayAnswer.length > 0);
  assert.equal(Object.hasOwn(a, 'bookRaw'), false);
  assert.equal(new Set(a.tasks.map((t) => t.label)).size, a.tasks.length);
  for (const t of a.tasks) {
    assert.ok(t.reason.length > 0);
    assert.ok(t.answer.length > 0);
    assert.equal(Object.hasOwn(t, 'expected'), false);
  }
}
const answer = (number) => solved.answers.find((a) => a.exercise === String(number));
const task = (number, label) => answer(number).tasks.find((t) => t.label === label);
assert.deepEqual(holds.routes.map((r) => r.id),
  ['829-1', '829-2', '830-a', '830-b', '830-c', '830-d', '831-a', '831-b']);
assert.equal(holds.routes.length, 8);
assert.equal(holds.table_source, null);
for (const route of holds.routes) {
  assert.equal(route.status, 'HOLD');
  assert.ok(route.preprocessing_hold && route.precision_hold);
  assert.equal(task(route.exercise, route.task).table_route_id, route.id);
  assert.equal(task(route.exercise, route.task).table_status, 'HOLD');
}

const close = (a, b, tolerance = 1e-11) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`);
const decimalReference = (number, label, value, field = 'mathematical_reference') =>
  close(Number(task(number, label)[field]), value);
const labels = (n) => Array.from({ length: n }, (_, i) => String.fromCharCode(97 + i));

// Check each numeric extraction by its original radicand and extracted square.
const radicands820 = [12, 18, 50, 48, 125, 108, 363, 845];
const coefficients820 = [2, 3, 5, 4, 5, 6, 11, 13];
const remainder820 = [3, 2, 2, 3, 5, 3, 3, 5];
labels(8).forEach((label, i) => {
  assert.equal(coefficients820[i] ** 2 * remainder820[i], radicands820[i]);
  assert.equal(task(820, label).answer, `${coefficients820[i]}\\sqrt{${remainder820[i]}}`);
});
const coefficients821 = [1 / 2, 2 / 3, -1 / 7, -1 / 5, 0.1, -0.05];
const radicands821 = [24, 45, 147, 275, 20000, 28800];
const results821 = [Math.sqrt(6), 2 * Math.sqrt(5), -Math.sqrt(3),
  -Math.sqrt(11), 10 * Math.sqrt(2), -6 * Math.sqrt(2)];
labels(6).forEach((_, i) => close(coefficients821[i] * Math.sqrt(radicands821[i]), results821[i]));
assert.deepEqual(answer(821).tasks.map((t) => t.answer),
  ['\\sqrt{6}', '2\\sqrt{5}', '-\\sqrt{3}', '-\\sqrt{11}', '10\\sqrt{2}', '-6\\sqrt{2}']);
const coefficients822 = [7, 5, 5, 10, 6, 2];
const radicands822 = [10, 3, 6, 5, 2 / 3, 3 / 2];
const combined822 = [490, 75, 150, 500, 24, 6];
labels(6).forEach((label, i) => {
  close(coefficients822[i] ** 2 * radicands822[i], combined822[i]);
  assert.equal(task(822, label).answer, `\\sqrt{${combined822[i]}}`);
});
assert.deepEqual(answer(823).tasks.map((t) => t.answer), [
  '\\sqrt{45}', '-\\sqrt{50}', '\\sqrt{28}', '-\\sqrt{108}',
  '\\sqrt{5a}', '-\\sqrt{72c}', '\\sqrt{\\frac{3x}{2}}', '-\\sqrt{\\frac{4y}{3}}'
]);
for (const v of [0, 0.125, 1, 7, 100]) {
  close(5 * Math.sqrt(v / 5), Math.sqrt(5 * v));
  close(-12 * Math.sqrt(v / 2), -Math.sqrt(72 * v));
  close(0.5 * Math.sqrt(6 * v), Math.sqrt(3 * v / 2));
  close((-2 / 3) * Math.sqrt(3 * v), -Math.sqrt(4 * v / 3));
}
const squarePairs824 = [[27, 12], [20, 45], [12, 18], [100, 80], [6, 6],
  [1080, 1080], [72, 81 / 2], [24, 24], [3 / 2, 18], [32, 98 / 3]];
squarePairs824.forEach(([a, b], i) => {
  const expected = a > b ? '>' : a < b ? '<' : '=';
  assert.equal(task(824, labels(10)[i]).relation, expected);
});
[[27, 24, 29, 32], [72, 58, 63, 56]].forEach((squares, i) => {
  const indices = squares.map((v, index) => ({ v, index: index + 1 }))
    .sort((a, b) => a.v - b.v).map((pair) => pair.index);
  assert.deepEqual(task(825, labels(2)[i]).ordered_original_indices, indices);
});

assert.deepEqual(answer(826).tasks.map((t) => t.answer), [
  'a\\sqrt7', '-y\\sqrt{10}', '4x\\sqrt{x}',
  '0.1b^2\\sqrt{b}', '5a^3\\sqrt{2a}', '-3c^3\\sqrt3'
]);
for (const v of [0.25, 1, 2, 4]) {
  close(Math.sqrt(7 * v ** 2), v * Math.sqrt(7));
  close(Math.sqrt(10 * (-v) ** 2), v * Math.sqrt(10));
  close(Math.sqrt(16 * v ** 3), 4 * v * Math.sqrt(v));
  close(Math.sqrt(0.01 * v ** 5), 0.1 * v ** 2 * Math.sqrt(v));
  close(Math.sqrt(50 * v ** 7), 5 * v ** 3 * Math.sqrt(2 * v));
  close(Math.sqrt(27 * (-v) ** 6), -3 * (-v) ** 3 * Math.sqrt(3));
}
const setA = [2, 3, -5, -10].filter((x) => x >= 0);
const setB = [-3, 1, 4, 10, -10].filter((c) => c <= 0);
assert.deepEqual(task(827, 'a').eligible_members_in_source_order, setA);
assert.deepEqual(task(827, 'b').eligible_members_in_source_order, setB);
assert.deepEqual(task(827, 'b').eligible_members_in_increasing_order, [-10, -3]);
assert.deepEqual(answer(828).tasks.map((t) => t.answer),
  ['\\sqrt{3a^2}', '-\\sqrt{3a^2}', '\\sqrt{2x}', '-\\sqrt{-2x}']);
assert.equal(task(828, 'c').domain, 'x\\in(0,\\infty)');
assert.equal(task(828, 'd').domain, 'x\\in(-\\infty,0)');
for (const v of [0.1, 1, 10]) {
  close(v * Math.sqrt(2 / v), Math.sqrt(2 * v));
  close((-v) * Math.sqrt(-2 / (-v)), -Math.sqrt(-2 * (-v)));
}
assert.equal(Number.isFinite(2 / 0), false);

decimalReference(829, '1', 6 * Math.sqrt(3333 / 10000));
decimalReference(829, '2', Math.sqrt(12));
close(36 * (3333 / 10000), 11.9988);
close(1 / 3 - 3333 / 10000, 1 / 30000);
close(Math.sqrt(12) - 6 * Math.sqrt(3333 / 10000),
  0.0012 / (Math.sqrt(12) + Math.sqrt(11.9988)));
assert.ok(6 * Math.sqrt(3333 / 10000) < Math.sqrt(12));
const radicands830 = [80, 450, 28, 120];
const original830 = [4 * Math.sqrt(5), 15 * Math.sqrt(2),
  14 * Math.sqrt(1 / 7), 12 * Math.sqrt(5 / 6)];
labels(4).forEach((label, i) => {
  decimalReference(830, label, Math.sqrt(radicands830[i]));
  close(original830[i], Math.sqrt(radicands830[i]));
});
close(Math.sqrt(450), 10 * Math.sqrt(4.5));
close(Math.sqrt(120), 10 * Math.sqrt(1.2));
close(12.5 / 3.14, 625 / 157);
close(8.24 / 3.14, 412 / 157);
decimalReference(831, 'a', Math.sqrt(625 / 157), 'mathematical_reference_cm');
decimalReference(831, 'b', Math.sqrt(412 / 157), 'mathematical_reference_cm');
assert.equal(task(831, 'inverse').answer, 'r=\\sqrt{S/\\pi}');
assert.equal(task(831, 'scale-4').answer, 'r_{new}=2r_{old}');
assert.equal(task(831, 'scale-1/25').answer, 'r_{new}=r_{old}/5');
close(Math.sqrt(4 * 12.5 / 3.14) / Math.sqrt(12.5 / 3.14), 2);
close(Math.sqrt(12.5 / (25 * 3.14)) / Math.sqrt(12.5 / 3.14), 1 / 5);

assert.equal(task(832, 'a').answer, '[3,\\infty)');
assert.equal(task(832, 'b').answer, '(-\\infty,1)\\cup[2,\\infty)');
const inDomainB = (x) => x < 1 || x >= 2;
for (const x of [-100, 0, 0.99, 1, 1.01, 1.5, 1.99, 2, 2.01, 100]) {
  const actual = x !== 1 && (x - 2) / (x - 1) >= 0;
  assert.equal(inDomainB(x), actual);
}
const integerValues833 = Array.from({ length: Math.floor(100 / 3) + 1 }, (_, i) => i);
assert.equal(integerValues833.length, Number(task(833, 'count').answer));
for (const k of integerValues833) {
  const x = Math.sqrt(3 * k);
  assert.ok(x >= 0 && x <= 10);
  close(x ** 2 / 3, k);
}
assert.ok(Math.sqrt(102) > 10);

// Freeze verification reads only this package and the explicitly whitelisted inputs.
const freezePath = path.join(out, 'freeze.json');
let freezeVerified = false;
if (fs.existsSync(freezePath)) {
  const frozen = read('freeze.json');
  for (const artifact of frozen.artifacts) {
    assert.equal(path.dirname(path.join(out, artifact.file)), out);
    assert.equal(sha(path.join(out, artifact.file)), artifact.sha256, artifact.file);
  }
  assert.equal(frozen.independence.stage2_comparison_performed, false);
  assert.equal(frozen.stage1_solutions_sha256, sha(path.join(out, 'stage1-solutions.json')));
  freezeVerified = true;
}
console.log(JSON.stringify({
  status: 'PASS-local-stage1-verification-NOT-gate2-or-table-release',
  cwd: root,
  exercises: 14,
  labeled_subparts: 62,
  whole_exercise_tasks: 1,
  additional_unlabeled_tasks: 4,
  complete_review_tasks: 67,
  figures: 0,
  required_table_lookup_routes: 8,
  table_provenance_status: 'HOLD',
  comparison_performed: false,
  source_input_hashes_match: true,
  freeze_verified: freezeVerified,
  stage1_solutions_sha256: sha(path.join(out, 'stage1-solutions.json'))
}, null, 2));
