'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const base = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13');
const owner = path.join(base, 'n40-table-cell-review');
assert.equal(__dirname, owner);
assert.equal(fs.realpathSync(process.cwd()), root);
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const inputs = [];
const load = (relative, expected, role, json = true) => {
  const absolute = path.join(root, relative);
  const bytes = fs.readFileSync(absolute);
  const hash = sha(bytes);
  if (expected) assert.equal(hash, expected, `Input changed: ${relative}`);
  inputs.push({path: absolute, sha256: hash, role});
  return json ? JSON.parse(bytes) : bytes.toString('utf8');
};
const rel = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/';
const scope = load(rel + 'n40-table-cell-review/method-scope.json', null, 'Current affected-only scope and explicit conventions');
const sourceCompletion = load(rel + 'n40-table-cell-review/completion-receipt.json', 'a6b08652794c55f6358bc4fba1c31283d24825aacd1b71ee09ea16356366277b', 'Existing source-cell approval');
assert.equal(sourceCompletion.status, 'SOURCE_CELLS_APPROVED');
for (const f of sourceCompletion.files) assert.equal(sha(fs.readFileSync(f.path)), f.sha256);
const captures = load(rel + 'n40-table-cell-review/captures.json', 'aa31b153eef42b3b0abbe5f6407201f28c63ca0a7be68de57f0ff7f096dd048d', 'Own frozen exact source cells and scales');
const prior = load(rel + 'n40-answer-review/stage2-review.json', 'aa17fce80e49b9c4422441eae2a4a8c2a43e1b8bcafeb37d9dc160f916d78ae2', 'Reuse 59 non-table PASS tasks; no repeated review');
load(rel + 'n40-answer-review/stage2-review.md', 'ae182e54ef0db8577b6a0c7bc1b0ee52c9bd322b86377a8873cc30464c14f1c0', 'Reuse textual prior review', false);
const original = load(rel + 'n40-answer-review/stage1-solutions.json', 'ac8692e9d5ed67608628effcb8a9fb475c0a0af9be528e11bea4c247a3c2697d', 'Original independent solve: reuse exact algebra and reasons');
const originalFreeze = load(rel + 'n40-answer-review/freeze.json', '08ac08911ca7e3176bd0a70eb58926727758c312f00f1cb30a3ed5851ebfa424', 'Verify original solve remains frozen, without running its arithmetic');
for (const f of originalFreeze.artifacts) assert.equal(sha(fs.readFileSync(path.join(base, 'n40-answer-review', f.file))), f.sha256);
const authority = load('ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n40/exercises.json', '7dff757538b97cf3af354046d545838bdf150113a13ec2b32e2c4f7cf38ffd8d', 'Actual finalized exercise authority; only 829-831 used');
const general = load(rel + 'bradis-method-rules/source-rules.json', 'a0f08bfe1b78099bd6489bc53fd869c4c215f16bf6ea7cf3787050080df1d05a', 'Allowed textual general precision and limitations');
const tables = load(rel + 'bradis-tables-source-review/source-rules.corrected.json', '41a84bf4ad20217b9eb056bdaebcf5417d5d72d08820119b63bbf05308611f46', 'Allowed corrected Table IV normalization and correction rules');
assert.equal(prior.summary.fully_pass_non_table_task_count, 59);
assert.equal(prior.summary.held_table_lookup_task_count, 8);
assert.deepEqual(prior.table_route_comparisons.map((r) => r.id), scope.routes);
const affectedExercises = authority.exercises.filter((e) => ['829', '830', '831'].includes(e.number));
assert.equal(affectedExercises.length, 3);
assert.ok(affectedExercises.find((e) => e.number === '829').text.includes('0.3333'));
assert.ok(affectedExercises.find((e) => e.number === '831').text.includes('3.14'));

const gcd = (a, b) => {
  while (b !== 0n) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
};
const rational = (n, d = 1n) => {
  n = BigInt(n); d = BigInt(d);
  assert.ok(d > 0n);
  const g = gcd(n, d);
  return {n: n / g, d: d / g};
};
const decimal = (s) => {
  const m = /^(\d+)(?:[.,](\d*))?$/.exec(s);
  assert.ok(m, `Not an exact nonnegative decimal: ${s}`);
  const fraction = m[2] || '';
  return rational(BigInt(m[1] + fraction), 10n ** BigInt(fraction.length));
};
const mul = (a, b) => rational(a.n * b.n, a.d * b.d);
const div = (a, b) => rational(a.n * b.d, a.d * b.n);
const add = (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
const eq = (a, b) => a.n * b.d === b.n * a.d;
const asFraction = (a) => `${a.n}/${a.d}`;
const fixedHalfUp = (value, places) => {
  assert.ok(value.n >= 0n && places >= 0);
  const scale = 10n ** BigInt(places);
  const numerator = value.n * scale;
  const quotient = numerator / value.d;
  const remainder = numerator % value.d;
  const isExactTie = 2n * remainder === value.d;
  const rounded = quotient + (2n * remainder >= value.d ? 1n : 0n);
  const digits = rounded.toString().padStart(places + 1, '0');
  const text = places ? digits.slice(0, -places) + '.' + digits.slice(-places) : digits;
  return {text, places, isExactTie, convention: 'explicit nonnegative half-up, not sourced'};
};
const significantHalfUp = (value, figures) => {
  assert.ok(value.n > 0n);
  let order = value.n.toString().length - value.d.toString().length;
  const lessThanPower = (exponent) => exponent >= 0
    ? value.n < value.d * 10n ** BigInt(exponent)
    : value.n * 10n ** BigInt(-exponent) < value.d;
  if (lessThanPower(order)) order--;
  const places = figures - 1 - order;
  assert.ok(places >= 0, 'All scoped outputs use nonnegative decimal-place counts.');
  return {...fixedHalfUp(value, places), significantFigures: figures};
};
assert.equal(significantHalfUp(decimal('1.995'), 3).text, '2.00');
assert.equal(significantHalfUp(decimal('1.995'), 3).isExactTie, true);
assert.equal(significantHalfUp(decimal('1.620'), 3).text, '1.62');
assert.equal(significantHalfUp(decimal('3.4644'), 4).text, '3.464');

const lookup = (argument) => {
  const cell = captures.captures.find((c) => c.targetArgumentAddress === argument);
  const units = captures.scales.targetAddressCompatibility.find((c) => c.argument === argument);
  assert.ok(cell && units);
  const main = decimal(cell.mainCellExact);
  const correction = cell.correction
    ? mul(decimal(cell.correction.cellExact), decimal(units.rootCorrectionUnit))
    : rational(0n);
  const value = add(main, correction);
  return {
    argument,
    image: cell.sourceImage,
    printedFooter: cell.printedFooter,
    table: 'IV',
    rowExact: cell.rowExact,
    mainColumnExact: cell.mainColumnExact,
    mainCellExact: cell.mainCellExact,
    correctionColumnExact: cell.correction?.columnExact ?? null,
    correctionCellExact: cell.correction?.cellExact ?? null,
    argumentCorrectionIncrement: units.correctionArgumentIncrement ?? null,
    correctionArgumentUnit: units.correctionColumnArgumentUnit,
    rootCorrectionUnit: units.rootCorrectionUnit,
    mainValueRational: asFraction(main),
    rootCorrectionRational: asFraction(correction),
    correctedTableValueRational: asFraction(value),
    correctedTableValue: fixedHalfUp(value, 3).text,
    exactRationalValue: value
  };
};
const route = (id, argument, factor, exactRewrite, normalization, extra = {}) => {
  const table = lookup(argument);
  const value = mul(table.exactRationalValue, factor);
  const figures = id.startsWith('831') ? 3 : 4;
  const final = significantHalfUp(value, figures);
  const [exercise, label] = id.split('-');
  const baselineTask = original.answers.find((a) => a.exercise === exercise).tasks.find((t) => t.label === label);
  assert.ok(baselineTask);
  const {exactRationalValue, ...tableData} = table;
  return {
    id,
    exercise,
    task: label,
    sourceRefs: affectedExercises.find((e) => e.number === exercise).pages,
    reusedOriginalIndependentAnswer: baselineTask.answer,
    exactRewrite,
    normalization,
    table: tableData,
    rootScaleAndOutsideFactor: asFraction(factor),
    tableProcessValueRational: asFraction(value),
    tableProcessValue: fixedHalfUp(value, 4).text,
    final,
    finalDisplay: final.text + (figures === 3 ? ' cm' : ''),
    equalsExactTrueRootClaimed: false,
    ...extra
  };
};
const routes = [];
assert.ok(eq(decimal('0.3333'), rational(3333n, 10000n)));
assert.equal(eq(decimal('0.3333'), rational(1n, 3n)), false);
assert.ok(eq(mul(decimal('33.33'), rational(1n, 100n)), decimal('0.3333')));
routes.push(route(
  '829-1', '33.33', rational(3n, 5n),
  '6*sqrt(0.3333) = 6*sqrt(33.33*10^-2) = (3/5)*sqrt(33.33). This is NOT the exact expression 6*sqrt(1/3).',
  '0.3333 = 33.33*10^-2 exactly as terminating decimals; root scale is 10^-1.',
  {tableRootForOriginalArgument: '0.5774', retainedStages: ['T(33.33)=5.771+3*0.001=5.774', 'T(0.3333)=0.1*5.774=0.5774', '6*0.5774=3.4644', 'final four-significant half-up: 3.464'], radicandTruncationDifference: '1/3 - 0.3333 = 1/30000; equality to 1/3 is forbidden.'}
));
const rewrites = [
  ['829-2', '12', rational(1n), rational(6n), rational(1n, 3n), '6*sqrt(1/3)=sqrt(36/3)=sqrt(12) exactly.', 'Already in [1,100); no scaling.'],
  ['830-a', '80', rational(1n), rational(4n), rational(5n), '4*sqrt(5)=sqrt(16*5)=sqrt(80) exactly.', 'Already in [1,100); no scaling.'],
  ['830-b', '4.5', rational(10n), rational(15n), rational(2n), '15*sqrt(2)=sqrt(225*2)=sqrt(450)=10*sqrt(4.5) exactly.', '450=4.5*10^2; root scale 10.'],
  ['830-c', '28', rational(1n), rational(14n), rational(1n, 7n), '14*sqrt(1/7)=sqrt(196/7)=sqrt(28) exactly; no truncation of 1/7.', 'Already in [1,100); no scaling.'],
  ['830-d', '1.2', rational(10n), rational(12n), rational(5n, 6n), '12*sqrt(5/6)=sqrt(144*5/6)=sqrt(120)=10*sqrt(1.2) exactly.', '120=1.2*10^2; root scale 10.']
];
for (const [id, arg, factor, outside, radicand, text, normalized] of rewrites) {
  assert.ok(outside.n >= 0n);
  const rewritten = mul(mul(outside, outside), radicand);
  const normalizedRadicand = mul(mul(factor, factor), decimal(arg));
  assert.ok(eq(rewritten, normalizedRadicand));
  routes.push(route(id, arg, factor, text, normalized));
}
const approximateModels = [
  ['831-a', decimal('12.5'), '625/157'],
  ['831-b', decimal('8.24'), '412/157']
];
for (const [id, area, modelFraction] of approximateModels) {
  const quotient = div(area, decimal('3.14'));
  assert.equal(asFraction(quotient), modelFraction);
  const guard = significantHalfUp(quotient, 4);
  assert.equal(guard.isExactTie, false);
  const stages = {
    approximateInputModel: `r approximately sqrt(${modelFraction}) cm, r nonnegative; this rational is exact only within the selected approximate-input computational model.`,
    originalAreaDecimal: id === '831-a' ? '12.5' : '8.24',
    originalPiDecimal: '3.14',
    originalApproximateDataSignificantFigures: 3,
    guardArgument: guard.text,
    guardSignificantFigures: 4,
    guardRounding: guard,
    guardIsDirectUserScopedConvention: true,
    fourthRootDigitRetainedUntilFinalRounding: true,
    physicalTrueRadiusGuarantee: false
  };
  routes.push(route(
    id, guard.text, rational(1n),
    `In the prescribed approximate-input model S/3.14=${modelFraction}; use the nonnegative root.`,
    `Four-significant guard argument ${guard.text}, already in [1,100); correction-argument unit 0.001.`,
    stages
  ));
}
assert.deepEqual(routes.map((r) => r.id), scope.routes);
assert.equal(routes.length, 8);
assert.equal(routes.find((r) => r.id === '831-a').final.text, '2.00');
assert.equal(routes.find((r) => r.id === '831-a').final.isExactTie, true);
assert.equal(routes.find((r) => r.id === '831-b').final.text, '1.62');
const iv = tables.tables.find((t) => t.id === 'IV');
const ruleIds = ['IV-domain-and-precision', 'IV-addition', 'IV-scale', 'IV-over-resolution-and-guard'];
for (const id of ruleIds) assert.ok(iv.rules.find((r) => r.id === id));
const generalIds = ['G8-relative-preprocessing', 'G9-k-plus-one', 'G-warning-last-digit', 'G3-G7-earlier-page-context', 'A-exact-five-tie', 'A-universal-four-figure-cutoff'];
for (const id of generalIds) assert.ok(general.rules.find((r) => r.id === id));
const solve = {
  schema: 'stemrobin182/n40-affected-independent-table-method-solve@1',
  ticket: 'STEMROBIN-182',
  status: 'INDEPENDENT_TABLE_STAGES_FROZEN_BEFORE_NEW_AUTHOR_READ',
  calculatedAtUtc: new Date().toISOString(),
  checkout: root,
  owner,
  inputs,
  affectedAuthority: affectedExercises.map((e) => ({number: e.number, pages: e.pages, text: e.text})),
  routes,
  outputConventions: scope.conventions,
  conventionAssessment: {
    fourSignificantTableOutputs: 'Source establishes four-significant Table IV values. Applying four-significant final output to 829/830 is explicitly selected for this scoped table calculation, not falsely attributed to a universal post-product rule.',
    approximateInputPrecision: 'Each approximate S and the supplied approximate pi has three significant figures. Use three final significant figures with one reserve figure in the table argument/result; user explicitly selects four-significant quotient guard arguments.',
    generalContextTier: 'G3-G7 precision/reserve summary is explicitly secondary-only in the allowed textual rules; G8/G9 are conditional context, not a universal root argument cutoff.',
    halfUp: 'Explicit final convention, not claimed as a Bradis/textbook tie policy. The sole scoped final tie is 1.995 -> 2.00 at three significant figures.',
    sourceLimit: 'General rules warn against a last-digit guarantee; approximate input models are not exact physical measurements. Corrections do not inherit a main-entry half-unit true-root guarantee.',
    historicalEquivalence: 'No equivalence claim or additional approval prerequisite is made.'
  },
  sourceRuleReferences: {
    correctedTableIV: iv.rules.filter((r) => ruleIds.includes(r.id)),
    general: general.rules.filter((r) => generalIds.includes(r.id))
  },
  reuse: {
    nonTablePassTasks: 59,
    nonTableTasksRepeated: 0,
    originalSolveHashVerified: true,
    originalSolveAndFreezeUnchanged: true,
    sourceCellApprovalUnchanged: true,
    directRootReferenceValuesRecomputed: 0,
    methodPreference: 'Reuse prior exact preference reasoning. The newly available source stages confirm both methods require one root-table lookup; method 2 additionally avoids normalization correction and post-lookup multiplication. This is not a new review of the already passed comparison task.'
  },
  counts: {newRoutes: 8, newImages: 0, imageReopens: 0, crops: 0, renders: 0, newAuthorCandidateReadsBeforeFreeze: 0, unaffectedArithmeticRepeats: 0},
  boundaries: 'Report-only affected method/answer stages. No author edits, finalizer, DB, app, publish, network or commit.'
};
const writeNew = (name, object) => fs.writeFileSync(path.join(owner, name), JSON.stringify(object, null, 2) + '\n', {flag: 'wx', mode: 0o444});
writeNew('method-independent-solve.json', solve);
fs.chmodSync(path.join(owner, 'method-scope.json'), 0o444);
fs.chmodSync(__filename, 0o444);
const files = ['method-scope.json', 'method-independent-calculate.cjs', 'method-independent-solve.json'].map((name) => {
  const absolute = path.join(owner, name);
  return {path: absolute, name, sha256: sha(fs.readFileSync(absolute)), mode: '0444'};
});
const receipt = {
  schema: 'stemrobin182/n40-affected-method-independent-freeze@1',
  ticket: 'STEMROBIN-182',
  frozenAtUtc: new Date().toISOString(),
  checkout: root,
  status: 'FROZEN_BEFORE_NEW_AUTHOR_CANDIDATE_BINDING_OR_OVERRIDE_READ',
  files,
  inputs,
  preservedSourceApprovalReceiptSha256: 'a6b08652794c55f6358bc4fba1c31283d24825aacd1b71ee09ea16356366277b',
  priorNonTablePassTasks: 59,
  newIndependentRoutes: 8,
  newImages: 0,
  sourceApprovalPreserved: true,
  scope: scope.routes,
  noNewAuthorReadsBeforeFreeze: true
};
writeNew('method-independent-freeze.json', receipt);
for (const input of inputs) assert.equal(sha(fs.readFileSync(input.path)), input.sha256);
for (const file of sourceCompletion.files) assert.equal(sha(fs.readFileSync(file.path)), file.sha256);
console.log(JSON.stringify({
  status: receipt.status,
  frozenAtUtc: receipt.frozenAtUtc,
  routes: routes.map((r) => ({id: r.id, guardArgument: r.guardArgument ?? null, correctedTableValue: r.table.correctedTableValue, final: r.final, finalDisplay: r.finalDisplay})),
  independentSolveSha256: files.find((f) => f.name === 'method-independent-solve.json').sha256,
  freezeReceiptPath: path.join(owner, 'method-independent-freeze.json'),
  freezeReceiptSha256: sha(fs.readFileSync(path.join(owner, 'method-independent-freeze.json'))),
  counts: solve.counts
}, null, 2));
