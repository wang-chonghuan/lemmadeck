import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmodSync, existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const owner = join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n42-n43-answer-review");
assert.equal(dirname(fileURLToPath(import.meta.url)), owner);
const prefix = join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13");
const configs = [
  {
    lesson: "alg7-c4-s3-n42",
    inputDirectory: "n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s3-n42",
    exercises: ["851", "852", "853", "854"],
    tasks: [7, 3, 6, 1]
  },
  {
    lesson: "alg7-c4-s3-n43",
    inputDirectory: "n43-adapt-work-affected/adapt/7a/modern-us-neutral/lessons/alg7-c4-s3-n43",
    exercises: ["855", "856", "857"],
    tasks: [6, 2, 1]
  }
];
const digest = bytes => createHash("sha256").update(bytes).digest("hex");
const checks = [];
const record = (name, evidence) => checks.push({ name, status: "passed", evidence });
const near = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}
function rational(n, d = 1n) {
  n = BigInt(n);
  d = BigInt(d);
  assert.notEqual(d, 0n);
  if (d < 0n) [n, d] = [-n, -d];
  const factor = gcd(n, d);
  return { n: n / factor, d: d / factor };
}
const q = value => {
  const [n, d = "1"] = String(value).split("/");
  return rational(n, d);
};
const add = (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
const neg = a => rational(-a.n, a.d);
const sub = (a, b) => add(a, neg(b));
const mul = (a, b) => rational(a.n * b.n, a.d * b.d);
const div = (a, b) => rational(a.n * b.d, a.d * b.n);
const square = a => mul(a, a);
const format = a => `${a.n}/${a.d}`;
const exact = (a, expected) => assert.equal(format(a),
  typeof expected === "object" ? format(expected) : format(q(expected)));
const poly = (coefficients, x) => coefficients[0] * x * x + coefficients[1] * x + coefficients[2];
const rationalPoly = (coefficients, x) => add(add(mul(q(coefficients[0]), square(x)), mul(q(coefficients[1]), x)), q(coefficients[2]));
const documents = [];
const sourceReceipts = [];
const exerciseTextReceipts = [];

for (const config of configs) {
  const solutionPath = join(owner, config.lesson, "stage1-solutions.json");
  const document = JSON.parse(readFileSync(solutionPath, "utf8"));
  assert.equal(document.lesson, config.lesson);
  assert.equal(document.stage, 1);
  assert.equal(document.status, "stage1-frozen");
  assert.equal(document.independent, true);
  assert.equal(document.authorComparison, "not-disclosed-not-performed");
  assert.equal(document.book, "7a");
  assert.equal(document.edition, "modern-us-neutral");
  assert.deepEqual(document.answers.map(answer => answer.exercise), config.exercises);
  assert.deepEqual(document.answers.map(answer => answer.tasks.length), config.tasks);
  assert.equal(document.scope.exerciseCount, config.exercises.length);
  assert.equal(document.scope.taskCount, config.tasks.reduce((a, b) => a + b, 0));
  assert.equal(document.scope.exerciseFigureCount, 0);
  assert.equal(document.scope.allWrittenTasksUngraded, true);
  assert.equal(document.scope.domain, "real numbers");

  for (const [binding, basename] of [["sourceInput", "exercises.template.json"], ["proseInput", "lesson.template.json"]]) {
    const expectedPath = join(prefix, config.inputDirectory, basename);
    assert.equal(document[binding].path, expectedPath);
    const bytes = readFileSync(expectedPath);
    assert.equal(digest(bytes), document[binding].sha256, `Input changed: ${expectedPath}`);
    sourceReceipts.push({ lesson: config.lesson, role: binding, path: expectedPath, sha256: digest(bytes) });
    const input = JSON.parse(bytes);
    if (binding === "sourceInput") {
      assert.equal(input.lesson, config.lesson);
      assert.equal(input.edition, "modern-us-neutral");
      assert.equal(input.count, config.exercises.length);
      assert.deepEqual(input.exercises.map(exercise => exercise.number), config.exercises);
      assert.deepEqual(input.exercises.map(exercise => exercise.source_number), config.exercises);
      for (const exercise of input.exercises) {
        assert.deepEqual(exercise.figures, []);
        assert.deepEqual(exercise.figure_refs, []);
        assert.equal(typeof exercise.text, "string");
        exerciseTextReceipts.push({
          lesson: config.lesson,
          exercise: exercise.number,
          textSha256: digest(Buffer.from(exercise.text, "utf8"))
        });
      }
    } else {
      for (const reference of document.proseInput.relevantMethodRefs) {
        assert.ok(input.prose.some(block => (block.source_refs || []).includes(reference)));
      }
    }
  }
  for (const answer of document.answers) {
    assert.equal(answer.grading, "ungraded");
    assert.equal(answer.source, "derived");
    assert.deepEqual(answer.parts, []);
    assert.equal(typeof answer.displayAnswer, "string");
    assert.ok(answer.displayAnswer.length > 100);
    for (const forbidden of ["bookRaw", "correct_index", "expected", "accept"]) {
      assert.ok(!Object.hasOwn(answer, forbidden));
    }
  }
  documents.push(document);
  record(`${config.lesson}: source identity, empty figure evidence, completeness and ungraded policy`, {
    exercises: config.exercises,
    taskCounts: config.tasks,
    taskTotal: document.scope.taskCount
  });
}

const answer = number => documents.flatMap(document => document.answers).find(item => item.exercise === number);
const triples = [[2, 17, 3], [5, -9, 4], [1, -12, -6], [-1, 1, -2], [8, -7, 0], [1, 0, -81]];
assert.deepEqual(answer("851").tasks.slice(0, 6).map(task => task.coefficients), triples);
assert.deepEqual(answer("851").tasks[6].selectedLabels,
  triples.flatMap((coefficients, index) => coefficients[0] === 1 ? [`${"abcdef"[index]})`] : []));
record("851: signed coefficients, missing terms and original-equation monic selection", {
  triples, monic: ["c)", "f)"], excludedNegativeLeadingCoefficient: "d)"
});

const graphTasks = [answer("852").tasks[0], ...answer("853").tasks];
const expectedGraphCoefficients = [[1, -1, -2], [1, 3, -4], [1, -2, -5], [1, 2, 5], [2, -1, -3], [3, 2, -5], [5, 12, -10]];
assert.deepEqual(graphTasks.map(task => task.coefficients), expectedGraphCoefficients);
assert.equal(documents[0].graphEvidence.rendered, false);
assert.equal(documents[0].graphEvidence.newFigureCreated, false);
assert.ok(documents[0].graphEvidence.instructions.includes("Project intersections"));
assert.ok(documents[0].graphEvidence.observationLimit.includes("not a claim"));
for (const [x, y] of documents[0].graphEvidence.sharedParabolaPoints) near(y, x * x);
const graphAudit = [];
for (const [index, task] of graphTasks.entries()) {
  const [a, b, c] = task.coefficients;
  near(task.line.slope, -b / a);
  near(task.line.intercept, -c / a);
  assert.equal(task.line.points.length, 2);
  assert.notEqual(task.line.points[0][0], task.line.points[1][0]);
  for (const [x, y] of task.line.points) near(y, task.line.slope * x + task.line.intercept);
  const discriminant = b * b - 4 * a * c;
  const roots = discriminant < 0 ? [] : [
    (-b - Math.sqrt(discriminant)) / (2 * a),
    (-b + Math.sqrt(discriminant)) / (2 * a)
  ];
  assert.equal(task.validationRoots.length, roots.length);
  assert.equal(task.graphReadRoots.length, roots.length);
  assert.equal(task.graphReadIntersections.length, roots.length);
  const coordinates = [];
  for (const [rootIndex, root] of roots.entries()) {
    near(task.validationRoots[rootIndex], root);
    near(poly(task.coefficients, root), 0);
    near(root * root, task.line.slope * root + task.line.intercept);
    near(task.graphReadRoots[rootIndex], root, 0.0051);
    near(task.graphReadIntersections[rootIndex][0], task.graphReadRoots[rootIndex]);
    near(task.graphReadIntersections[rootIndex][1], root * root, 0.0051);
    coordinates.push({ exactRootNumericalCheck: root, y: root * root, graphRead: task.graphReadIntersections[rootIndex] });
  }
  const brackets = [];
  if (task.brackets) {
    assert.equal(task.brackets.length, task.bracketGaps.length);
    for (const [bracketIndex, [left, right]] of task.brackets.entries()) {
      assert.ok(left < right);
      near(right - left, 0.01);
      const gaps = [left, right].map(x => x * x - (task.line.slope * x + task.line.intercept));
      gaps.forEach((gap, gapIndex) => near(gap, task.bracketGaps[bracketIndex][gapIndex]));
      assert.ok(gaps[0] * gaps[1] < 0);
      assert.ok(roots.some(root => left < root && root < right));
      brackets.push({ x: [left, right], verticalGaps: gaps });
    }
  }
  if (roots.length === 0) {
    assert.equal(discriminant, -16);
    assert.equal(task.globalGap.center, -1);
    assert.equal(task.globalGap.minimum, 4);
    near(-2 * task.globalGap.center, b / a);
    near(task.globalGap.center ** 2 + task.globalGap.minimum, c / a);
  }
  graphAudit.push({
    exercise: index === 0 ? "852" : "853",
    label: task.label,
    linePoints: task.line.points,
    coordinates,
    brackets,
    globalNonintersection: roots.length === 0 ? task.globalGap : null
  });
}
record("852/853: normalized plotting lines, parabola points, intersections and graph-read approximations", graphAudit);

assert.equal(answer("852").tasks[1].relation, "<");
assert.equal(answer("852").tasks[2].relation, ">");
assert.deepEqual(answer("852").tasks[1].intervals, [
  { lower: -1, upper: 2, lowerInclusive: false, upperInclusive: false }
]);
assert.deepEqual(answer("852").tasks[2].intervals, [
  { lower: null, upper: -1, lowerInclusive: false, upperInclusive: false },
  { lower: 2, upper: null, lowerInclusive: false, upperInclusive: false }
]);
assert.equal(poly([1, -1, -2], -2), 4);
assert.equal(poly([1, -1, -2], 0), -2);
assert.equal(poly([1, -1, -2], 3), 4);
assert.equal(poly([1, -1, -2], -1), 0);
assert.equal(poly([1, -1, -2], 2), 0);
record("852: graph height ordering and excluded strict-inequality endpoints", {
  lowerParabola: "(-1,2)", higherParabola: "(-infinity,-1) union (2,infinity)",
  excludedEndpoints: [-1, 2], signedSampleGaps: [[-2, 4], [0, -2], [3, 4]]
});

const expression = answer("854").tasks[0];
exact(q(expression.x), "42/5");
exact(q(expression.y), "-3/5");
const x = q(expression.x), y = q(expression.y);
const sum = add(x, y), difference = sub(y, x), squareDifference = sub(square(y), square(x));
exact(sum, expression.originalDenominators["x+y"]);
exact(difference, expression.originalDenominators["y-x"]);
exact(squareDifference, expression.originalDenominators["y^2-x^2"]);
for (const denominator of [sum, difference, squareDifference]) assert.notEqual(denominator.n, 0n);
const terms = [div(mul(q(2), mul(x, y)), squareDifference), div(x, sum), neg(div(y, difference))];
terms.forEach((term, index) => exact(term, expression.signedBracketTerms[index]));
const bracket = terms.reduce(add, q(0));
assert.notEqual(bracket.n, 0n);
exact(bracket, expression.bracket);
exact(bracket, neg(div(difference, sum)));
const outer = div(square(difference), sum);
exact(outer, expression.outerFraction);
exact(div(outer, bracket), expression.result);
exact(div(outer, bracket), "9/1");
exact(div(outer, bracket), sub(x, y));
const numerator = sub(add(mul(q(2), mul(x, y)), mul(x, difference)), mul(y, sum));
exact(numerator, neg(square(difference)));
record("854: exact rational direct substitution, domain and independently simplified quotient", {
  denominators: expression.originalDenominators,
  signedBracketTerms: terms.map(format), bracket: format(bracket), outer: format(outer),
  quotient: format(div(outer, bracket)), identityResult: format(sub(x, y))
});

const squareTasks = [...answer("855").tasks, ...answer("856").tasks];
const expectedSquareCoefficients = [[1, -2, -35], [1, 8, -20], [1, 16, 64], [1, 14, 50], [1, -7, -8], [1, 1, -2], [2, -9, 10], [5, 3, -8]];
assert.deepEqual(squareTasks.map(task => task.coefficients), expectedSquareCoefficients);
const squareAudit = [];
for (const [index, task] of squareTasks.entries()) {
  const [a, b, c] = task.coefficients.map(q);
  const shift = q(task.squareShift), rhs = q(task.squareRhs);
  exact(shift, format(div(b, mul(q(2), a))));
  exact(rhs, format(sub(square(shift), div(c, a))));
  if (index >= 6) assert.equal(task.normalizationDivisor, task.coefficients[0]);
  for (const root of task.roots) {
    exact(rationalPoly(task.coefficients, q(root)), "0/1");
    exact(square(add(q(root), shift)), task.squareRhs);
  }
  const expectedRootCount = rhs.n < 0n ? 0 : rhs.n === 0n ? 1 : 2;
  assert.equal(task.roots.length, expectedRootCount);
  if (rhs.n > 0n) {
    assert.notEqual(task.roots[0], task.roots[1]);
    exact(add(q(task.roots[0]), q(task.roots[1])), format(neg(div(b, a))));
    exact(mul(q(task.roots[0]), q(task.roots[1])), format(div(c, a)));
  }
  if (rhs.n === 0n) {
    assert.equal(task.rootMultiplicity, 2);
    exact(q(task.roots[0]), format(neg(shift)));
  }
  if (rhs.n < 0n) {
    assert.ok(task.noRealRootReason.includes("nonnegative"));
    exact(neg(rhs), "1/1");
  }
  squareAudit.push({
    exercise: index < 6 ? "855" : "856", label: task.label, variable: task.variable,
    squareShift: format(shift), squareRhs: format(rhs), roots: task.roots,
    exactOriginalResiduals: task.roots.map(root => format(rationalPoly(task.coefficients, q(root)))),
    realRootCount: expectedRootCount
  });
}
assert.deepEqual(squareTasks.map(task => task.variable), ["x", "x", "y", "x", "y", "x", "x", "x"]);
record("855/856: exact completing-square identities, all roots and original-equation substitutions", squareAudit);

const proof = answer("857").tasks[0];
assert.deepEqual(proof.expandedSumSquared, { u2: 1, uv: 2, v2: 1 });
assert.deepEqual(proof.expandedDifferenceSquared, { u2: 1, uv: -2, v2: 1 });
const differenceCoefficients = Object.fromEntries(Object.keys(proof.expandedSumSquared).map(key => [
  key, proof.expandedSumSquared[key] - proof.expandedDifferenceSquared[key]
]));
assert.deepEqual(differenceCoefficients, { u2: 0, uv: 4, v2: 0 });
assert.equal(proof.sumSquared, 10);
assert.equal(proof.differenceSquared, 6);
exact(div(q(proof.sumSquared - proof.differenceSquared), q(4)), proof.result);
exact(q(proof.result), "1/1");
const u = (Math.sqrt(10) + Math.sqrt(6)) / 2;
const v = (Math.sqrt(10) - Math.sqrt(6)) / 2;
near(u + v, Math.sqrt(10));
near(u - v, Math.sqrt(6));
near(u * v, 1);
assert.ok(answer("857").displayAnswer.includes("4uv="));
assert.ok(answer("857").displayAnswer.includes("10-6=4"));
record("857: symbolic square-difference proof and explicit-number substitution", {
  expansionDifference: differenceCoefficients, sumSquared: 10, differenceSquared: 6,
  exactProduct: proof.result, explicitNumericalCheck: { u, v, sum: u + v, difference: u - v, product: u * v },
  orderIndependent: true
});

const finalPaths = [
  ...configs.map(config => join(owner, config.lesson, "stage1-solutions.json")),
  join(owner, "stage1-audit.json"),
  join(owner, "freeze-manifest.json")
];
for (const path of finalPaths.slice(-2)) assert.ok(!existsSync(path), `Refusing to replace frozen evidence: ${path}`);
for (const receipt of sourceReceipts) assert.equal(digest(readFileSync(receipt.path)), receipt.sha256);
const frozenAt = new Date().toISOString();
const audit = {
  schema: "ld-s10y-answer/independent-stage1-audit@1",
  ticket: "STEMROBIN-182",
  stage: 1,
  status: "passed-and-frozen-before-disclosure",
  frozenAt,
  checkout: repo,
  gitRevisionAtEntry: "e16207d939526da0ebb2cfc528f084f0c3791afb",
  ownedDirectory: owner,
  sourceReceipts,
  exerciseTextReceipts,
  totals: {
    lessons: 2, exercises: 7, tasks: 26, perLessonExercises: [4, 3], perLessonTasks: [17, 9],
    coefficientTriples: 6, monicSelections: 1, graphicalEquations: 7, graphicalInequalities: 2,
    expressionValues: 1, completingSquareEquations: 8, proofs: 1,
    exerciseFigures: 0, ungradedExercises: 7, gradingParts: 0
  },
  independence: {
    exerciseAuthority: "Only the two specifically authorized current exercises.template.json files.",
    methodAuthority: "Relevant definitions and worked-method prose in their matching lesson.template.json files.",
    authorKeysRead: false, previousReviewSolutionsRead: false, choiceOrHistoryRead: false, bookAnswersRead: false,
    authorComparisonPerformed: false, sourceInputHashesCheckedBeforeFreeze: true
  },
  limits: {
    offline: true, networkUsed: false, appUsed: false, databaseUsed: false, commitCreated: false,
    finalizerRun: false, graphRendered: false, imageViewed: false, newFigureCreated: false,
    durableProductArtifactsWritten: false,
    gate2CompletionClaimed: false,
    nextAction: "STOP. Await explicit Stage2 author-key disclosure. Do not modify these frozen Stage1 files."
  },
  checks
};
const auditPath = join(owner, "stage1-audit.json");
writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`, { flag: "wx" });
const freezePaths = [
  ...finalPaths.slice(0, -1),
  fileURLToPath(import.meta.url),
  join(owner, "first-audit-failure.json")
];
const outputs = freezePaths.map(path => {
  assert.ok(resolve(path).startsWith(`${owner}/`));
  const bytes = readFileSync(path);
  return { path, sha256: digest(bytes), bytes: bytes.length, mode: "0444" };
});
const manifest = {
  schema: "ld-s10y-answer/independent-stage1-freeze@1",
  ticket: "STEMROBIN-182",
  stage: 1,
  status: "frozen-awaiting-stage2-disclosure",
  frozenAt,
  hashAlgorithm: "SHA-256",
  sourceReceipts,
  outputs,
  stop: "No author-key comparison, finalization, render, figure, durable write, application, network, DB or commit is authorized."
};
const manifestPath = join(owner, "freeze-manifest.json");
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
for (const path of [...freezePaths, manifestPath]) {
  chmodSync(path, 0o444);
  assert.equal(statSync(path).mode & 0o777, 0o444);
}
for (const output of outputs) assert.equal(digest(readFileSync(output.path)), output.sha256);
console.log(JSON.stringify({
  status: manifest.status, checks: checks.length, totals: audit.totals, outputs,
  manifest: { path: manifestPath, sha256: digest(readFileSync(manifestPath)), mode: "0444" }
}, null, 2));
