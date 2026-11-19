import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmodSync, existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const owner = join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-answer-author");
assert.equal(dirname(fileURLToPath(import.meta.url)), owner);
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const read = path => JSON.parse(readFileSync(path, "utf8"));
const bound = (path, expected) => {
  const bytes = readFileSync(path);
  assert.equal(hash(bytes), expected, `Changed bound input: ${path}`);
  return JSON.parse(bytes);
};
const bindingPath = join(owner, "source-and-task-binding.json");
const binding = read(bindingPath);
const source = bound(binding.source.exercisePath, binding.source.exerciseSha256);
bound(binding.source.lessonPath, binding.source.lessonSha256);
bound(binding.figureManifest.path, binding.figureManifest.sha256);
const candidatePath = join(owner, "alg7-c4-s2-n41.answer-keys.json");
const candidateBytes = readFileSync(candidatePath);
const candidate = JSON.parse(candidateBytes);
const numbers = Array.from({ length: 17 }, (_, index) => String(834 + index));
assert.equal(source.count, 17);
assert.equal(source.lesson, "alg7-c4-s2-n41");
assert.equal(source.edition, "modern-us-neutral");
assert.deepEqual(source.exercises.map(item => item.number), numbers);
assert.deepEqual(source.exercises.map(item => item.source_number), numbers);
assert.deepEqual(candidate.answers.map(item => item.exercise), numbers);
assert.equal(candidate.schema, "ld-s10y-answer/lesson-answers@1");
assert.equal(candidate.book, "7a");
assert.equal(candidate.lesson, source.lesson);
assert.equal(candidate.edition, source.edition);
assert.equal(candidate.status, "draft");
assert.deepEqual(binding.tasks.map(item => item.exercise), numbers);
assert.equal(binding.tasks.reduce((sum, item) => sum + item.count, 0), 80);
for (const item of candidate.answers) {
  assert.equal(item.grading, "ungraded");
  assert.equal(item.source, "derived");
  assert.deepEqual(item.parts, []);
  assert.ok(item.displayAnswer.length > 100);
  assert.ok(!Object.hasOwn(item, "bookRaw"));
  assert.ok(!Object.hasOwn(item, "expected"));
}
for (const item of source.exercises) {
  assert.deepEqual(item.figure_refs, item.number === "848" ? ["fig-56"] : item.number === "849" ? ["fig-57"] : []);
}
assert.equal(binding.imageLoads.length, 4);
assert.equal(binding.imageLoads.reduce((sum, item) => sum + item.opens, 0), 4);
for (const image of binding.imageLoads) {
  assert.equal(image.opens, 1);
  assert.equal(hash(readFileSync(image.path)), image.sha256);
}
const specs = new Map(binding.figureSpecs.map(item => [item.figure, bound(item.path, item.sha256)]));
for (const [figure, exercise] of [["fig-56", "848"], ["fig-57", "849"]]) {
  const spec = specs.get(figure);
  assert.equal(spec.id, figure);
  assert.equal(spec.source.authoritativeText[0].exercise, exercise);
  assert.equal(spec.source.authoritativeText[0].text, source.exercises.find(item => item.number === exercise).text);
}

const checks = [];
const ids = new Set();
const close = (actual, expected, tolerance = 1e-10) =>
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);
const task = (exercise, label, evidence, pendingLookup = false) => {
  const id = `${exercise}.${label}`;
  assert.ok(!ids.has(id));
  ids.add(id);
  checks.push({ id, authorMathematicalCheck: "checked", evidence, lookupStatus: pendingLookup ? "HOLD_missing_reviewed_cell" : "not-required-or-completed" });
};
const rt = Math.sqrt;
const numericPairs = {
  "834": [
    [rt(75) + rt(48) - rt(300), -rt(3), "-sqrt(3)"],
    [3 * rt(8) + 2 * rt(18) - rt(50), 7 * rt(2), "7sqrt(2)"],
    [rt(242) - rt(200) + rt(8), 3 * rt(2), "3sqrt(2)"],
    [rt(54) + rt(96) - rt(150), 2 * rt(6), "2sqrt(6)"],
    [6 * rt(1 / 3) - rt(12) + rt(3), rt(3), "sqrt(3)"],
    [40 * rt(2 / 5) - rt(1000) + 2 * rt(10), 0, "0"]
  ],
  "835": [
    [3 * rt(2) + rt(32) - rt(200), -3 * rt(2), "-3sqrt(2)"],
    [2 * rt(72) - rt(50) - 2 * rt(8), 3 * rt(2), "3sqrt(2)"],
    [5 * rt(3) + rt(27) / 3 - rt(48), 2 * rt(3), "2sqrt(3)"],
    [rt(80) + rt(20) / 2 + 3 * rt(45), 14 * rt(5), "14sqrt(5)"],
    [rt(75) - rt(300) / 10 - rt(27), rt(3), "sqrt(3)"],
    [rt(98) - rt(72) + rt(8) / 2, 2 * rt(2), "2sqrt(2)"]
  ],
  "836": [
    [(3 * rt(5) - 2 * rt(3)) * rt(5) + rt(60), 15, "15"],
    [(rt(28) - 2 * rt(3) + rt(7)) * rt(7) + rt(84), 21, "21"],
    [(rt(12) + 2 * rt(18)) * rt(2) / 2 - rt(96), 6 - 3 * rt(6), "6-3sqrt(6)"],
    [(4 * rt(3) - 2 * rt(6) - 1) * 2 * rt(3), 24 - 12 * rt(2) - 2 * rt(3), "24-12sqrt(2)-2sqrt(3)"],
    [(rt(6) + rt(5)) ** 2 - rt(120), 11, "11"],
    [(rt(14) - 3 * rt(2)) ** 2 + 6 * rt(28), 32, "32"]
  ],
  "841": [
    [(rt(3) - 1) * (rt(3) + 1), 2, "3-1=2"],
    [(rt(11) - 3) * (rt(11) + 3), 2, "11-9=2"],
    [(rt(10) + 7) * (7 - rt(10)), 39, "49-10=39"],
    [(2 * rt(5) + rt(19)) * (2 * rt(5) - rt(19)), 1, "20-19=1"],
    [(5 * rt(7) - 13) * (5 * rt(7) + 13), 6, "175-169=6"],
    [(rt(14) / 2 + rt(3)) * (rt(3) - rt(14) / 2), -0.5, "3-14/4=-1/2"]
  ],
  "843": [
    [2 / (rt(5) - rt(3)), rt(5) + rt(3), "sqrt(5)+sqrt(3)"],
    [3 / (rt(10) + rt(7)), rt(10) - rt(7), "sqrt(10)-sqrt(7)"],
    [1 / (rt(5) - 2), rt(5) + 2, "sqrt(5)+2"],
    [4 / (3 + rt(7)), 6 - 2 * rt(7), "6-2sqrt(7)"],
    [1 / (9 - 4 * rt(5)), 9 + 4 * rt(5), "9+4sqrt(5)"],
    [1 / (5 * rt(2) - 7), 5 * rt(2) + 7, "5sqrt(2)+7"]
  ]
};
const pending = new Set(binding.tableEvidence.pendingLookupTasks);
for (const [exercise, pairs] of Object.entries(numericPairs)) {
  pairs.forEach(([original, simplified, result], index) => {
    const label = "abcdef"[index];
    close(original, simplified);
    task(exercise, label, { result, symbolicSteps: "Written in candidate displayAnswer", numericalIdentityResidual: original - simplified, numericalEvaluationIsNotTableEvidence: true }, pending.has(`${exercise}.${label}`));
  });
}

const factorPairs = [
  [() => rt(14) - rt(7), () => rt(7) * (rt(2) - 1), "sqrt(7)(sqrt(2)-1)"],
  [() => rt(33) + rt(22), () => rt(11) * (rt(3) + rt(2)), "sqrt(11)(sqrt(3)+sqrt(2))"],
  [() => rt(15) - rt(6), () => rt(3) * (rt(5) - rt(2)), "sqrt(3)(sqrt(5)-sqrt(2))"],
  [() => 3 + rt(3), () => rt(3) * (rt(3) + 1), "sqrt(3)(sqrt(3)+1)"],
  [() => 10 - 2 * rt(10), () => rt(10) * (rt(10) - 2), "sqrt(10)(sqrt(10)-2)"],
  [a => a - 5 * rt(a), a => rt(a) * (rt(a) - 5), "sqrt(a)(sqrt(a)-5)"],
  [b => b - 3 * rt(b), b => rt(b) * (rt(b) - 3), "sqrt(b)(sqrt(b)-3)"],
  [b => b - rt(3 * b), b => rt(b) * (rt(b) - rt(3)), "sqrt(b)(sqrt(b)-sqrt(3))"]
];
factorPairs.forEach(([original, factorized, result], index) => {
  for (const value of [0, 0.25, 1, 4, 9, 16, 25, 100]) close(original(value), factorized(value));
  task("837", "abcdefgh"[index], { result, check: "Expansion and nonnegative-variable substitutions, including zero." });
});

const constantCancelPairs = [
  ["a", (rt(2) + 2) / rt(2), 1 + rt(2), "1+sqrt(2)"],
  ["b", (5 + rt(10)) / rt(10), 1 + rt(10) / 2, "1+sqrt(10)/2"],
  ["c", (2 * rt(3) - 3) / (5 * rt(3)), (2 - rt(3)) / 5, "(2-sqrt(3))/5"],
  ["g", (2 + rt(2)) / (1 + rt(2)), rt(2), "sqrt(2)"],
  ["h", (rt(15) - rt(5)) / (1 - rt(3)), -rt(5), "-sqrt(5)"],
  ["i", (2 * rt(3) - rt(6)) / (rt(8) - 2), rt(6) / 2, "sqrt(6)/2"]
];
for (const [label, original, simplified, result] of constantCancelPairs) {
  close(original, simplified);
  task("838", label, { result, check: "Explicit common factor in candidate; original nonzero constant denominator." });
}
for (const a of [0.25, 1, 4, 9]) for (const b of [0.25, 1, 4, 16]) {
  close((a * rt(b) + b * rt(a)) / rt(a * b), rt(a) + rt(b));
}
task("838", "d", { result: "sqrt(a)+sqrt(b)", domain: "a>0,b>0", check: "Common factor sqrt(a)sqrt(b) and positive-variable substitution." });
for (const a of [0.25, 1, 4, 9]) for (const x of [0.25, 1, 4, 16]) {
  close((x - rt(a * x)) / (a * rt(x)), (rt(x) - rt(a)) / a);
}
task("838", "e", { result: "(sqrt(x)-sqrt(a))/a", domain: "a>0,x>0", check: "Original radicands and denominator force both inequalities." });
for (const y of [0.25, 1, 4, 9]) for (const b of [-5, -1, 0.25, 1, 4]) {
  close((y + b * rt(y)) / (b * rt(y)), 1 + rt(y) / b);
}
task("838", "f", { result: "1+sqrt(y)/b", domain: "y>0,b!=0", check: "Includes negative nonzero b; no unsupported b>0 assumption." });

for (const x of [0, 0.25, 1, 4, 9]) for (const y of [0, 0.25, 1, 4, 9]) {
  if (x + y !== 0) close((x + rt(x * y)) / (rt(x) + rt(y)), rt(x));
}
task("839", "a", { result: "sqrt(x)", domain: "x>=0,y>=0,x+y>0" });
for (const x of [0, 0.25, 4, 9]) close((x - rt(x)) / (rt(x) - 1), rt(x));
task("839", "b", { result: "sqrt(x)", domain: "x>=0,x!=1" });
for (const a of [0, 0.25, 1, 4, 6, 9]) close((a + rt(6 * a)) / (6 + rt(6 * a)), rt(6 * a) / 6);
task("839", "c", { result: "sqrt(6a)/6", domain: "a>=0, denominator always positive" });
for (const p of [0, 0.25, 1, 9, 16]) close((p - 2 * rt(p)) / (2 * rt(p) - 4), rt(p) / 2);
task("839", "d", { result: "sqrt(p)/2", domain: "p>=0,p!=4" });
for (const a of [0, 0.25, 1, 9, 16]) close((a - 4) / (rt(a) - 2), rt(a) + 2);
task("839", "e", { result: "sqrt(a)+2", domain: "a>=0,a!=4" });
for (const b of [0, 0.25, 1, 4, 9, 16]) close((b - 9) / (rt(b) + 3), rt(b) - 3);
task("839", "f", { result: "sqrt(b)-3", domain: "b>=0, denominator always positive" });

assert.ok(rt(2.5) > (rt(2) + rt(3)) / 2);
assert.ok(25 > 24);
task("840", "a", { relation: ">", proof: "Both sides nonnegative; squared difference (5-2sqrt(6))/4>0 because 25>24." });
assert.ok(rt(11) - 1 < rt(5) + rt(7));
assert.ok(12 + 2 * rt(35) > 11);
task("840", "b", { relation: "<", proof: "sqrt(5)+sqrt(7)>sqrt(11)>sqrt(11)-1." });
assert.ok(rt(2) + rt(7) > 2 * rt(2) + 1);
assert.ok(4 - 2 * rt(2) > 0);
task("840", "c", { relation: ">", proof: "After subtracting sqrt(2), compare nonnegative sides and squared difference 4-2sqrt(2)>0." });
assert.ok(rt(5) + rt(7) > 3 + rt(3));
assert.ok(35 > 27);
task("840", "d", { relation: ">", proof: "Compare 12+2sqrt(35) and 12+6sqrt(3); 35>27." });
close(1 / (3 * rt(2) - 4) - 1 / (3 * rt(2) + 4), 4);
assert.equal(18 - 16, 2);
task("842", "a", { value: 4, proof: "Common denominator 18-16=2 and numerator 8, nonzero original denominators." });
close(1 / (5 + 2 * rt(6)) + 1 / (5 - 2 * rt(6)), 10);
assert.equal(25 - 24, 1);
task("842", "b", { value: 10, proof: "Common denominator 25-24=1 and numerator 10, nonzero original denominators." });

for (const a of [0, 0.25, 1, 4, 9, 100]) for (const b of [0, 0.25, 1, 4, 9, 100]) {
  close((a + b) / 2 - ((rt(a) + rt(b)) / 2) ** 2, (rt(a) - rt(b)) ** 2 / 4);
  assert.ok(rt((a + b) / 2) + 1e-12 >= (rt(a) + rt(b)) / 2);
  close((a + b) / 2 - rt(a * b), (rt(a) - rt(b)) ** 2 / 2);
  assert.ok((a + b) / 2 + 1e-12 >= rt(a * b));
}
task("844", "proof", { proof: "Exact square-difference identity (sqrt(a)-sqrt(b))^2/4; both original sides nonnegative.", equality: "a=b including 0", parameterSubstitutionCheck: "36 nonnegative pairs" });
task("845", "comparison", { relation: ">=", proof: "Exact difference (sqrt(a)-sqrt(b))^2/2.", equality: "a=b including 0", parameterSubstitutionCheck: "36 nonnegative pairs" });

const branchChecks = [];
for (const a of [-2, 0, 3]) for (const m of [-2, 0, 2]) for (const s of [-2, 0, 2]) {
  if (s + m !== 0 && a * m !== 0) {
    const b = a * (s - m) / (s + m);
    assert.notEqual(a - b, 0);
    close(m * (a + b) / (a - b), s);
    branchChecks.push({ a, m, s, branch: "unique-valid" });
  } else if (s + m === 0 && a * m === 0) {
    for (const b of [-5, 0, 1, 5].filter(value => value !== a)) close(m * (a + b) / (a - b), s);
    branchChecks.push({ a, m, s, branch: "arbitrary-b-except-a" });
  } else {
    assert.ok((s + m !== 0 && a * m === 0) || (s + m === 0 && a * m !== 0));
    branchChecks.push({ a, m, s, branch: "no-valid-solution" });
  }
}
task("846", "a", { formula: "b=a(s-m)/(s+m)", originalDomain: "a!=b", branchChecks, proof: "Equivalent cross-multiplication (s+m)b=a(s-m); unique branch requires am!=0." });
const radiusCases = [];
for (const d of [-3, -1, 0, 1, 3]) for (const h of [-2, -1, 0, 1, 2]) {
  if (h !== 0 && d * d !== h * h) {
    const R = (d * d - h * h) / (2 * h);
    assert.notEqual(R, 0);
    close(2 * R * h * (1 + h / (2 * R)), d * d);
    radiusCases.push({ d, h, branch: "unique-valid" });
  } else if (h === 0 && d === 0) {
    for (const R of [-3, -1, 1, 3]) close(2 * R * h * (1 + h / (2 * R)), d * d);
    radiusCases.push({ d, h, branch: "arbitrary-nonzero-R" });
  } else radiusCases.push({ d, h, branch: "no-valid-solution" });
}
task("846", "b", { formula: "R=(d^2-h^2)/(2h)", originalDomain: "R!=0", branchChecks: radiusCases, proof: "Expand to d^2=2Rh+h^2 before division; retain h=0 and R=0 exclusions." });

const equations = [
  { label: "a", coefficients: [1, -27, 0], roots: [0, 27], exact: ["0", "27"] },
  { label: "b", coefficients: [3, -7, 0], roots: [0, 7 / 3], exact: ["0", "7/3"] },
  { label: "c", coefficients: [16, 0, -1], roots: [-0.25, 0.25], exact: ["-1/4", "1/4"] },
  { label: "d", coefficients: [4, 0, 1], roots: [], exact: [], nonzeroBound: "4x^2+1>=1" },
  { label: "e", coefficients: [1, 0, -5], roots: [-rt(5), rt(5)], exact: ["-sqrt(5)", "sqrt(5)"] },
  { label: "f", coefficients: [3, 0, -0.9], roots: [-rt(30) / 10, rt(30) / 10], exact: ["-sqrt(30)/10", "sqrt(30)/10"] }
];
for (const item of equations) {
  const [a, b, c] = item.coefficients;
  for (const root of item.roots) close(a * root * root + b * root + c, 0);
  assert.equal(item.roots.length, b * b - 4 * a * c > 0 ? 2 : 0);
  task("847", item.label, { exactRoots: item.exact, rootCount: item.roots.length, check: "Original-equation substitution and complete real-root count.", nonzeroBound: item.nonzeroBound || null });
}
for (const item of binding.observedFigureFacts) {
  const spec = specs.get(item.exercise === "848" ? "fig-56" : "fig-57");
  for (const [index, point] of item.points.entries()) {
    assert.deepEqual(spec.objects.find(object => object.id === `construction-${item.label}-read-${index}`).at, point);
    close(item.slope * point[0] + item.intercept, point[1]);
  }
  const [first, second] = item.points;
  close((second[1] - first[1]) / (second[0] - first[0]), item.slope);
  const label = item.exercise === "848" ? ({ a: "first equation", b: "second equation", c: "third equation" })[item.label] : `line ${item.label}`;
  task(item.exercise, label, { figure: spec.id, traceLabel: item.label, observedGridPoints: item.points, slope: item.slope, intercept: item.intercept, check: "Raw/modern visual observation recorded once per image, cross-bound to current FigureSpec; no independent figure approval." });
}

const extrema = [
  ["a.1", x => x * x + 1, 1, 0, "min", "real x"],
  ["a.2", x => x * x - 5, -5, 0, "min", "real x"],
  ["a.3", x => rt(x), 0, 0, "min", "x>=0"],
  ["b.1", x => -((x + 4) ** 2), 0, -4, "max", "real x"],
  ["b.2", x => 10 / (rt(x) + 2), 5, 0, "max", "x>=0"],
  ["b.3", x => 1 / (x * x + 7), 1 / 7, 0, "max", "real x"]
];
for (const [label, evaluate, value, at, kind, domain] of extrema) {
  close(evaluate(at), value);
  for (let x = domain === "x>=0" ? 0 : -10; x <= 10; x += 0.25) {
    assert.ok(kind === "min" ? evaluate(x) >= value : evaluate(x) <= value);
  }
  task("850", label, { kind, value: label === "b.3" ? "1/7" : value, attainedAt: at, domain, proof: "Nonnegative square/radical or positive-denominator bound stated in candidate; attained value checked." });
}

const lookupValues = [];
for (const cell of binding.tableEvidence.cells) {
  const capture = bound(cell.path, cell.sha256);
  const record = capture.records_in_request_address_order.find(item => item.id === cell.recordId);
  assert.ok(record);
  assert.equal(capture.table, cell.table);
  assert.equal(capture.pdf_image, cell.pdfImage);
  assert.equal(record.row, cell.row);
  assert.equal(record.main.column, cell.column);
  assert.equal(record.main.printed, cell.printed);
  assert.equal(record.status, "READ");
  assert.equal(cell.printed.replace(",", "."), cell.decimal);
  lookupValues.push({ radicand: cell.radicand, printed: cell.printed, decimal: cell.decimal, source: cell.path, recordId: cell.recordId });
}
const additional = binding.tableEvidence.additionalCaptureCheckedForRequestedCells;
bound(additional.path, additional.sha256);
assert.deepEqual(lookupValues.map(item => item.radicand), [2, 10]);
const root2 = Number(lookupValues.find(item => item.radicand === 2).decimal);
const lookupChecks = [
  { id: "835.a", arithmetic: "-3*1.414", result: -3 * root2, display: "-4.242" },
  { id: "835.b", arithmetic: "3*1.414", result: 3 * root2, display: "4.242" },
  { id: "835.f", arithmetic: "2*1.414", result: 2 * root2, display: "2.828" },
  { id: "843.f", arithmetic: "5*1.414+7", result: 5 * root2 + 7, display: "14.070" }
];
for (const item of lookupChecks) {
  close(item.result, Number(item.display));
  assert.ok(candidate.answers.find(answer => answer.exercise === item.id.split(".")[0]).displayAnswer.includes(item.display));
}
assert.equal(pending.size, 8);
assert.equal(checks.filter(item => item.lookupStatus === "HOLD_missing_reviewed_cell").length, 8);
assert.equal(checks.length, 80);
for (const group of binding.tasks) {
  assert.equal(checks.filter(item => item.id.startsWith(`${group.exercise}.`)).length, group.count);
  for (const label of group.labels) assert.ok(ids.has(`${group.exercise}.${label}`));
}
assert.ok(candidate.answers.find(item => item.exercise === "835").notes.includes("HOLD"));
assert.ok(candidate.answers.find(item => item.exercise === "843").notes.includes("HOLD"));
assert.equal(binding.independence.selfIndependentPASSClaimed, false);

const outputNames = [
  "alg7-c4-s2-n41.answer-keys.frozen.json",
  "author-checks.json", "author-binding.json", "freeze-manifest.json"
];
for (const name of outputNames) assert.ok(!existsSync(join(owner, name)), `Refusing to replace evidence: ${name}`);
assert.equal(hash(readFileSync(candidatePath)), hash(candidateBytes));
bound(binding.source.exercisePath, binding.source.exerciseSha256);
bound(binding.source.lessonPath, binding.source.lessonSha256);
bound(binding.figureManifest.path, binding.figureManifest.sha256);
const frozenAt = new Date().toISOString();
const frozenPath = join(owner, outputNames[0]);
writeFileSync(frozenPath, candidateBytes, { flag: "wx" });
const report = {
  schema: "ld-s10y-answer/author-checks@1",
  ticket: "STEMROBIN-182", lesson: candidate.lesson, frozenAt,
  status: "HOLD_missing_reviewed_table_cells",
  mathematicalAuthorChecks: "80 tasks checked by this author; this is not independent review or finalization.",
  source: binding.source,
  totals: binding.totals,
  perExerciseTaskCounts: binding.tasks,
  checks: checks.sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true })),
  lookupEvidence: lookupValues,
  completedLookupChecks: lookupChecks,
  missingReviewedRadicands: binding.tableEvidence.missingReviewedRadicands,
  pendingLookupTasks: [...pending],
  missingFigureFacts: [],
  imageLoads: binding.imageLoads,
  sourceFigureDependencies: binding.figureSpecs,
  independentApproval: false,
  independentFigureApproval: false,
  overallGate2Completed: false,
  finalized: false,
  published: false,
  mathematicalNumericChecksAreNotTableLookups: true,
  stop: "Parent must supply or authorize reviewed sqrt(3),sqrt(5),sqrt(7) cells for the eight held lookup obligations and arrange independent answer/figure review. Do not integrate as a complete accepted answer key."
};
const reportPath = join(owner, "author-checks.json");
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });
const authorBinding = {
  status: report.status, lesson: candidate.lesson, frozenAt,
  source: { path: binding.source.exercisePath, sha256: binding.source.exerciseSha256 },
  prose: { path: binding.source.lessonPath, sha256: binding.source.lessonSha256 },
  candidate: { path: candidatePath, sha256: hash(candidateBytes) },
  frozen: { path: frozenPath, sha256: hash(candidateBytes) },
  authorChecks: { path: reportPath, sha256: hash(readFileSync(reportPath)) },
  exerciseCount: 17, mathematicalTasks: 80, pendingLookupObligations: 8,
  imageLoads: 4, independentApproval: false, independentFigureApproval: false,
  overallGate2Completed: false, finalizerRun: false,
  sourceAuthority: "Frozen current modern templates; no fabricated finalized gate.",
  noOtherAnswersOrAnswerReviewsRead: true
};
const authorBindingPath = join(owner, "author-binding.json");
writeFileSync(authorBindingPath, `${JSON.stringify(authorBinding, null, 2)}\n`, { flag: "wx" });
const freezePaths = [candidatePath, frozenPath, bindingPath, reportPath, authorBindingPath, fileURLToPath(import.meta.url)];
const outputs = freezePaths.map(path => {
  assert.ok(path.startsWith(`${owner}/`));
  const bytes = readFileSync(path);
  return { path, sha256: hash(bytes), bytes: bytes.length, mode: "0444" };
});
const freeze = {
  schema: "ld-s10y-answer/author-freeze@1",
  ticket: "STEMROBIN-182", lesson: candidate.lesson, status: report.status, frozenAt,
  hashAlgorithm: "SHA-256", source: binding.source, outputs,
  totals: binding.totals, pendingLookupTasks: [...pending], independentApproval: false,
  scope: "Offline author scratch only; no DB, app, network, paid calls, dependency changes, finalization, publish or durable product writes."
};
const freezePath = join(owner, "freeze-manifest.json");
writeFileSync(freezePath, `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
for (const path of [...freezePaths, freezePath]) {
  chmodSync(path, 0o444);
  assert.equal(statSync(path).mode & 0o777, 0o444);
}
for (const output of outputs) assert.equal(hash(readFileSync(output.path)), output.sha256);
console.log(JSON.stringify({
  status: report.status, totals: binding.totals, pendingLookupTasks: [...pending],
  sourceExerciseSha256: binding.source.exerciseSha256,
  frozenCandidate: { path: frozenPath, sha256: hash(candidateBytes), mode: "0444" },
  authorChecks: { path: reportPath, sha256: hash(readFileSync(reportPath)), mode: "0444" },
  manifest: { path: freezePath, sha256: hash(readFileSync(freezePath)), mode: "0444" },
  independentApproval: false
}, null, 2));
