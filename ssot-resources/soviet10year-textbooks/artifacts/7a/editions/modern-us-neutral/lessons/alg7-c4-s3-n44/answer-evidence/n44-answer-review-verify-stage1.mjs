import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const scratch = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n44-answer-review";
assert.equal(process.cwd(), root);
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, scratch, name), "utf8"));
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const hashes = read("input-hashes.json");
const solutions = read("source-solutions.json");
const coverage = read("coverage.json");
const methods = read("method-obligations.json");

// Read only explicitly authorized source text files and this review's own outputs.
const sourceFiles = new Map();
for (const entry of hashes.inputs) {
  const bytes = fs.readFileSync(path.join(root, entry.path));
  assert.equal(sha(bytes), entry.sha256, `source changed: ${entry.path}`);
  sourceFiles.set(path.basename(entry.path), JSON.parse(bytes));
}
assert.equal(sourceFiles.size, 3);
const supplemental = new Map();
for (const entry of hashes.supplemental_source_inputs) {
  const file = path.join(root, entry.path);
  const bytes = fs.readFileSync(file);
  assert.equal(sha(bytes), entry.sha256, `supplemental source changed: ${entry.path}`);
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  supplemental.set(path.basename(entry.path), bytes);
}
assert.equal(supplemental.size, 3);
const capture = JSON.parse(supplemental.get("capture.json"));
const captureFreeze = JSON.parse(supplemental.get("freeze.json"));
for (const entry of hashes.supplemental_source_inputs.filter((e) => !e.path.endsWith("/freeze.json"))) {
  const frozen = captureFreeze.files.find((f) => f.path === path.join(root, entry.path));
  assert.ok(frozen);
  assert.equal(frozen.sha256, entry.sha256);
  assert.equal(frozen.mode, "0444");
}
assert.equal(capture.physical_page, 346);
assert.equal(capture.printed_footer_literal, "340");
assert.equal(capture.heading_literal, methods.capture_binding.heading_literal);
assert.equal(capture.precision_and_method_notes.rounding_rule_visible, false);
assert.equal(capture.precision_and_method_notes.tie_rule_visible, false);
assert.equal(capture.comparison_boundary.root_answers_derived, false);
assert.equal(captureFreeze.frozenBeforeAuthorTableComparison, true);
const sources = sourceFiles.get("exercises.json");
const lesson = sourceFiles.get("lesson.json");
const figures = sourceFiles.get("figures.json");
assert.equal(lesson.prose.length, 78);
assert.equal(figures.figures.length, 0);
assert.equal(lesson.figures.length, 0);
assert.equal(sources.count, 15);
assert.equal(lesson.exercise_count, 15);
assert.equal(solutions.exercises.length, 15);
assert.equal(coverage.exercises.length, 15);

let subparts = 0;
let exerciseTasks = 0;
const allTaskIds = [];
const pending = [];
for (let index = 0; index < sources.exercises.length; index++) {
  const source = sources.exercises[index];
  const result = solutions.exercises[index];
  const row = coverage.exercises[index];
  assert.equal(source.number, String(858 + index));
  assert.equal(result.number, source.number);
  assert.equal(row.number, source.number);
  assert.equal(row.source_text_sha256, sha(source.text));
  assert.deepEqual(result.source_refs, source.pages);
  assert.deepEqual(row.source_refs, source.pages);
  assert.equal(source.figure_refs.length, 0);
  assert.equal(source.figures.length, 0);
  const labels = [...source.text.matchAll(/^([a-z])\) /gm)].map((m) => m[1]);
  if (labels.length === 0) labels.push("whole");
  assert.deepEqual(result.parts.map((p) => p.label), labels);
  assert.deepEqual(row.labels, labels);
  const ids = result.parts.flatMap((p) => p.task_ids);
  const unfinished = result.parts.flatMap((p) => p.pending_task_ids ?? []);
  assert.equal(row.task_count, ids.length);
  assert.equal(row.completed_task_count, ids.length - unfinished.length);
  assert.deepEqual(row.pending_task_ids, unfinished);
  for (const p of result.parts) {
    assert.ok(p.task_ids.length > 0);
    for (const id of p.task_ids) assert.ok(id.startsWith(`${source.number}.${p.label}.`));
    for (const id of p.pending_task_ids ?? []) assert.ok(p.task_ids.includes(id));
  }
  subparts += labels.length;
  exerciseTasks += ids.length;
  allTaskIds.push(...ids);
  pending.push(...unfinished);
}
const lessonIds = solutions.lesson_tasks.flatMap((t) => t.task_ids);
allTaskIds.push(...lessonIds);
assert.equal(new Set(allTaskIds).size, allTaskIds.length);
assert.deepEqual(coverage.lesson_tasks.task_ids, lessonIds);
assert.equal(subparts, coverage.summary.source_subparts_observed);
assert.equal(subparts, 64);
assert.equal(exerciseTasks, coverage.summary.exercise_atomic_tasks);
assert.equal(solutions.lesson_tasks.length, coverage.summary.lesson_task_groups);
assert.equal(lessonIds.length, coverage.summary.lesson_atomic_tasks);
assert.equal(allTaskIds.length, coverage.summary.total_atomic_tasks);
assert.equal(allTaskIds.length - pending.length, coverage.summary.total_atomic_tasks_complete);
assert.deepEqual(pending, coverage.summary.pending_task_ids);
assert.equal(pending.length, 0);
assert.deepEqual(methods.pending_obligations, pending);
for (const obligation of methods.obligations) {
  assert.equal(obligation.status, "complete");
  assert.equal(obligation.lookup_completed, true);
  assert.equal(obligation.actual_historical_address.address_bound, true);
}

const close = (actual, expected, context, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected)),
    `${context}: ${actual} != ${expected}`);
};
const number = (literal) => {
  if (/^-?\d+(?:\.\d+)?$/.test(literal)) return Number(literal);
  const rational = /^(-?\d+)\/(\d+)$/.exec(literal);
  assert.ok(rational, `unsupported reference literal: ${literal}`);
  assert.notEqual(Number(rational[2]), 0);
  return Number(rational[1]) / Number(rational[2]);
};
const get = (n, label) => solutions.exercises.find((e) => e.number === String(n)).parts.find((p) => p.label === label);
let quadraticChecks = 0;

const verifyQuadratic = (p, residual, multiplier, roots = p.real_roots ?? p.supplementary_real_roots) => {
  const [a, b, c] = p.coefficients;
  assert.notEqual(a, 0);
  const d = b * b - 4 * a * c;
  close(d, p.discriminant ?? 4 * p.quarter_discriminant, "discriminant");
  // Both sides are degree <= 2, so three exact input points identify the transformation.
  for (const x of [-2, 0, 3]) close((a * x + b) * x + c, multiplier * residual(x), "equivalent standard form");
  const values = roots.map((r) => typeof r === "number" ? r : number(r));
  const expectedCount = d < 0 ? 0 : d === 0 ? 1 : 2;
  assert.equal(values.length, expectedCount);
  for (const x of values) close(residual(x), 0, "source equation residual", 1e-8);
  if (values.length === 1) close(values[0], -b / (2 * a), "repeated root");
  if (values.length === 2) {
    close(values[0] + values[1], -b / a, "Vieta sum");
    close(values[0] * values[1], c / a, "Vieta product");
  }
  if (p.real_root_count !== undefined) assert.equal(p.real_root_count, expectedCount);
  quadraticChecks++;
};

// Direct source equations, before any rearrangement or scaling used in the solutions.
const originals = {
  858: [
    (x) => 2*x*x+3*x+1, (x) => 3*x*x+7*x+2, (x) => 2*x*x+x+1,
    (x) => 4*x*x+4*x+1, (x) => x*x+5*x-6, (x) => x*x+2*x+2,
    (x) => 9*x*x-6*x+1, (x) => 4*x*x-7*x-2
  ],
  859: [
    (x) => 3*x*x-7*x+4, (x) => 5*x*x-8*x+3, (x) => 3*x*x-13*x+14,
    (y) => 2*y*y-9*y+9, (y) => 5*y*y-6*y+1, (x) => 4*x*x-x-33,
    (z) => 3*z*z+32*z+80, (x) => x*x+7*x-60, (y) => y*y-10*y-24,
    (p) => p*p+p-90
  ],
  860: [
    (x) => 5*x*x-(9*x+2), (x) => -x*x-(5*x-14), (x) => -x*x-(6*x+9),
    (z) => (z-5)-(z*z-25), (y) => y*y-(52*y-576),
    (y) => (15*y*y-30)-(22*y+7), (p) => 25*p*p-(10*p-1),
    (x) => (2*x*x-480)-(6-9*x)
  ],
  861: [
    (x) => (x+4)**2-(3*x+40), (x) => (2*x-3)**2-(11*x-19),
    (x) => (x+1)**2-(7918-2*x), (x) => (x+2)**2-(3131-2*x)
  ],
  862: [
    (x) => 5*x*x-x-1, (x) => 2*x*x+7*x+4,
    (y) => 3*(y*y-2)-y, (y) => y*y+8*(y-1)-3
  ],
  863: [
    (x) => 0.7*x*x-(1.3*x+2), (y) => 7-(0.4*y+0.2*y*y),
    (x) => x*x-1.6*x-0.36, (z) => z*z-2*z+2.91,
    (y) => 0.2*y*y-10*y+125, (x) => x*x/3+2*x-9
  ],
  864: [
    (a) => 3*a+0.6-(9*a*a+0.36), (a) => 0.4*a+1.2-(0.16*a*a+1.44)
  ],
  865: [(x) => 12*x*x+7*x, (x) => x*x-25]
};
const multipliers = {
  858: [1,1,1,1,1,1,1,1], 859: [1,1,1,1,1,1,1,1,1,1],
  860: [1,-1,-1,-1,1,1,1,1], 861: [1,1,1,1], 862: [1,1,1,1],
  863: [10,-5,25,1,5,3], 864: [-25/3,-25/2], 865: [1,1]
};
for (const [n, functions] of Object.entries(originals)) {
  for (let i = 0; i < functions.length; i++) {
    const p = get(n, String.fromCharCode(97 + i));
    verifyQuadratic(p, functions[i], multipliers[n][i], Number(n) === 862 ? p.numeric_reference_roots : undefined);
  }
}
const lessonEquations = new Map([
  ["L44.example-1", (x) => 12*x*x+7*x+1],
  ["L44.example-2", (x) => x*x-12*x+36],
  ["L44.example-3", (x) => 7*x*x-25*x+23],
  ["L44.incomplete-3x", (x) => 3*x*x+17*x],
  ["L44.incomplete-1.21", (x) => x*x-1.21],
  ["L44.incomplete-7x2", (x) => 7*x*x],
  ["L44.half-formula-example", (x) => 9*x*x-14*x+5]
]);
for (const t of solutions.lesson_tasks) {
  if (lessonEquations.has(t.id)) verifyQuadratic(t, lessonEquations.get(t.id), 1);
  else assert.ok(t.solution.length >= 4);
  for (const index of t.prose_indices) assert.ok(lesson.prose[index]?.text);
}
assert.equal(quadraticChecks, 51);

const tableRoutes = [[21,1,10], [17,-7,4], [73,1,6], [27,-4,1]];
for (let i = 0; i < tableRoutes.length; i++) {
  const [radicand, center, denominator] = tableRoutes[i];
  const p = get(862, String.fromCharCode(97+i));
  const obligation = methods.obligations[i];
  assert.equal(obligation.semantic_table_address.argument_exact, String(radicand));
  const sourceCell = capture.entries.find((e) => e.requested_n === String(radicand));
  assert.ok(sourceCell);
  assert.equal(sourceCell.entry_literal, obligation.entry_literal);
  assert.equal(p.table_cell.literal, sourceCell.entry_literal);
  assert.equal(obligation.actual_historical_address.tens_row, sourceCell.row_header_literal);
  assert.equal(obligation.actual_historical_address.units_column, sourceCell.column_header_literal);
  assert.equal(obligation.actual_historical_address.data_row_ordinal, sourceCell.data_row_ordinal);
  assert.equal(obligation.actual_historical_address.data_column_ordinal, sourceCell.data_column_ordinal);
  assert.equal(p.table_cell.tens_row, sourceCell.row_header_literal);
  assert.equal(p.table_cell.units_column, sourceCell.column_header_literal);
  assert.equal(10*Number(sourceCell.row_header_literal)+Number(sourceCell.column_header_literal), radicand);
  const q = BigInt(sourceCell.entry_literal.replace(".", ""));
  const lower = 2n*q-1n;
  const upper = 2n*q+1n;
  const scaledRadicand = 4000000n*BigInt(radicand);
  const certificate = obligation.independent_squared_bracket;
  assert.equal(certificate.lower_numerator, lower.toString());
  assert.equal(certificate.upper_numerator, upper.toString());
  assert.equal(certificate.lower_square_numerator, (lower*lower).toString());
  assert.equal(certificate.upper_square_numerator, (upper*upper).toString());
  assert.equal(certificate.radicand_scaled, scaledRadicand.toString());
  assert.ok(lower>0n && lower*lower<scaledRadicand && scaledRadicand<upper*upper);
  const tableSqrt = Number(sourceCell.entry_literal);
  const tableRoots = [(center-tableSqrt)/denominator, (center+tableSqrt)/denominator];
  const exact = [(center-Math.sqrt(radicand))/denominator, (center+Math.sqrt(radicand))/denominator];
  exact.forEach((x, j) => {
    close(x, p.numeric_reference_roots[j], "862 independent reference");
    assert.equal(x.toFixed(2), p.rounded_reference_roots[j]);
    close(tableRoots[j], number(p.table_root_values_exact[j]), "862 literal-table arithmetic");
    close(tableRoots[j], number(obligation.table_root_values_exact[j]), "862 literal-table obligation");
    assert.equal(tableRoots[j].toFixed(2), p.table_final_roots[j]);
    assert.equal(tableRoots[j].toFixed(2), obligation.final_roots_0_01[j]);
    assert.equal(p.table_final_roots[j], p.rounded_reference_roots[j]);
    const [lo, hi] = obligation.rounding_bins[j].map(Number);
    const rootError = 0.0005/denominator;
    assert.ok(tableRoots[j]-rootError>lo && tableRoots[j]+rootError<hi);
  });
}

const rootCount = (a,b,c) => {
  if (a === 0) return b === 0 ? (c === 0 ? Infinity : 0) : 1;
  const d = b*b-4*a*c;
  if (Math.abs(d) < 1e-9) return 1;
  return d > 0 ? 2 : 0;
};
const parameterCases = [
  [866,"a",(t)=>[3,-2,t],(t)=>t>1/3,0,"(1/3,+infinity)"],
  [866,"b",(t)=>[5,18,t],(t)=>t>81/5,0,"(81/5,+infinity)"],
  [866,"c",(t)=>[4,t,1],(t)=>t>-4&&t<4,0,"(-4,4)"],
  [866,"d",(t)=>[48,t,-5],()=>false,0,"empty"],
  [867,"a",(v)=>[10,40,v],(v)=>v<40,2,"(-infinity,40)"],
  [867,"b",(v)=>[2,v,18],(v)=>v<-12||v>12,2,"(-infinity,-12) union (12,+infinity)"],
  [867,"c",(v)=>[v,-6,1],(v)=>v!==0&&v<9,2,"(-infinity,0) union (0,9)"],
  [867,"d",(v)=>[7,v,-25],()=>true,2,"R"]
];
const samples = [-1000,-135,-50,-40,-24,-12.01,-12,-11.99,-4.01,-4,-3.99,-1,-0.01,0,0.01,1/3-0.01,1/3,1/3+0.01,3.99,4,4.01,8.99,9,9.01,11.99,12,12.01,81/5-0.01,81/5,81/5+0.01,24,39.99,40,40.01,50,135,1000];
let parameterSampleChecks = 0;
for (const [n,label,coefficients,condition,target,set] of parameterCases) {
  assert.equal(get(n,label).parameter_set,set);
  for (const parameter of samples) {
    assert.equal(rootCount(...coefficients(parameter)) === target, condition(parameter));
    parameterSampleChecks++;
  }
}
assert.deepEqual(get(868,"a").parameter_values,["-24","24"]);
assert.deepEqual(get(868,"b").parameter_values,["135"]);
assert.deepEqual(get(868,"c").parameter_values_as_written,["-50","0","50"]);
assert.deepEqual(get(868,"d").parameter_values,["-10sqrt(2)","10sqrt(2)"]);
const radicalNumbers = new Map([["-10sqrt(2)",-10*Math.sqrt(2)],["10sqrt(2)",10*Math.sqrt(2)],["sqrt(2)/5",Math.sqrt(2)/5],["-sqrt(2)/5",-Math.sqrt(2)/5]]);
const parameterNumber = (s) => radicalNumbers.has(s) ? radicalNumbers.get(s) : number(s);
const oneRootCases = [
  ["a",(k)=>[16,k,9],(k)=>k===-24||k===24],
  ["b",(k)=>[15,-90,k],(k)=>k===135],
  ["c",(k)=>[k,-100,k],(k)=>k===-50||k===0||k===50],
  ["d",(k)=>[25,k,2],(k)=>Math.abs(Math.abs(k)-10*Math.sqrt(2))<1e-12]
];
for (const [label,coefficients,condition] of oneRootCases) {
  for (const k of [...samples,-10*Math.sqrt(2),10*Math.sqrt(2)]) {
    assert.equal(rootCount(...coefficients(k))===1,condition(k));
    parameterSampleChecks++;
  }
  for (const entry of get(868,label).root_by_parameter) {
    const k = parameterNumber(entry.k);
    const x = parameterNumber(entry.root);
    const [a,b,c] = coefficients(k);
    close((a*x+b)*x+c,0,"868 root with actual parameter");
  }
}
assert.equal(rootCount(0,-6,1),1);
assert.equal(rootCount(0,-100,0),1);

const mapping = solutions.exercises.find((e)=>e.number==="870");
const point = (s) => {
  const match = /^([A-Z])('?)\((-?\d+(?:\.\d+)?)\)$/.exec(s);
  assert.ok(match,`point spelling: ${s}`);
  return {name:match[1],prime:match[2]==="'",x:Number(match[3])};
};
const rules = [(x)=>x-3,(x)=>2*x,(x)=>x*x];
let pointChecks = 0;
for (let i=0;i<mapping.parts.length;i++) {
  const p = mapping.parts[i];
  assert.ok(p.proof.length>=4);
  assert.deepEqual(p.task_ids,coverage.exercises[12].mapping_tasks[p.label]);
  for (const task of p.point_tasks) {
    assert.ok(p.task_ids.includes(task.task_id));
    if (task.direction==="forward") {
      const input=point(task.input),output=point(task.output);
      assert.equal(input.prime,false);
      assert.equal(output.prime,true);
      assert.equal(input.name,output.name);
      close(rules[i](input.x),output.x,"870 forward point");
    } else if (task.direction==="inverse") {
      const input=point(task.preimage),output=point(task.given_image);
      assert.equal(input.prime,false);
      assert.equal(output.prime,true);
      assert.equal(input.name,output.name);
      close(rules[i](input.x),output.x,"870 inverse point");
    } else {
      assert.equal(task.direction,"inverse-existence");
      assert.equal(point(task.given_image).x,-1);
      assert.equal(point(task.given_image).prime,true);
      assert.deepEqual(task.preimages,[]);
    }
    pointChecks++;
  }
}
assert.equal(pointChecks,11);
assert.deepEqual(mapping.parts.map((p)=>p.image_set),["R","R","[0,+infinity)"]);
assert.deepEqual(mapping.parts[1].fixed_points,["0"]);

const e865=solutions.exercises.find((e)=>e.number==="865");
for(const p of e865.parts) {
  assert.ok(p.formula_method.length>=3);
  assert.ok(p.factorization_method.length>=3);
}
const e869=solutions.exercises.find((e)=>e.number==="869");
assert.equal(e869.parts[0].identity,"a^2+12a+40=(a+6)^2+4");
assert.equal(e869.parts[1].identity,"a^2-6a+13=(a-3)^2+4");
assert.equal(get(871,"a").result,"sqrt(3)+sqrt(2)");
assert.equal(get(871,"b").result,"2+3sqrt(5)");
close((Math.sqrt(21)+Math.sqrt(14)-2*Math.sqrt(35))*Math.sqrt(7)/7+Math.sqrt(20),Math.sqrt(3)+Math.sqrt(2),"871a arithmetic check");
close((Math.sqrt(5)+Math.sqrt(3)-Math.sqrt(15))*(Math.sqrt(5)-Math.sqrt(3))+Math.sqrt(75),2+3*Math.sqrt(5),"871b arithmetic check");
assert.equal(get(872,"whole").identity,"(a+1/a)^2-a^2=2+1/a^2");
assert.ok(get(872,"whole").proof.length>=4);

console.log(JSON.stringify({
  schema:"source-first-verification-receipt@1",
  result_id:"results0444",
  checked_at_utc:new Date().toISOString(),
  source_hashes_unchanged:true,
  source_originals:15,
  source_subparts:subparts,
  lesson_prose_blocks_read:lesson.prose.length,
  exercise_atomic_tasks:exerciseTasks,
  lesson_atomic_tasks:lessonIds.length,
  completed_atomic_tasks:allTaskIds.length-pending.length,
  pending_atomic_tasks:pending,
  quadratic_equation_certificates:quadraticChecks,
  parameter_boundary_and_zero_sample_checks:parameterSampleChecks,
  mapping_point_direction_checks:pointChecks,
  proof_basis:"Independent symbolic reasoning is written in source-solutions.json. Arithmetic/samples and structural checks supplement but do not replace those proofs.",
  supplemental_source_capture_freeze_verified:true,
  actual_exact_address_bound_table_cells:4,
  exact_integer_square_bracket_certificates:4,
  table_derived_roots_checked:8,
  table_lookup_claimed:true,
  printed_rounding_or_tie_rules_invented:false,
  runtime_gate2_or_finalizer_run:false,
  forbidden_data_accessed:false,
  status:"PASS_source_mathematics_structure_and_all_requested_methods"
},null,2));
