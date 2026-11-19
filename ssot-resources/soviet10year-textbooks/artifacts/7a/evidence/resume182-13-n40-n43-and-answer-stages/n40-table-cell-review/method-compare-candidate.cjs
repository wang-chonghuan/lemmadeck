'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const rel = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/';
const base = path.join(root, rel);
const owner = path.join(base, 'n40-table-cell-review');
assert.equal(__dirname, owner);
assert.equal(fs.realpathSync(process.cwd()), root);
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const loadBound = (file, expected) => {
  const bytes = fs.readFileSync(path.join(root, file));
  const hash = sha(bytes);
  assert.equal(hash, expected, `Hash mismatch: ${file}`);
  return {path: path.join(root, file), sha256: hash, data: JSON.parse(bytes)};
};
const independentFreeze = loadBound(rel + 'n40-table-cell-review/method-independent-freeze.json', 'e1f44460ae81254f5b6417004dbcbebd6fd0abe874d5bb2555053c86c8b6f7b4');
for (const input of [...independentFreeze.data.files, ...independentFreeze.data.inputs]) {
  assert.equal(sha(fs.readFileSync(input.path)), input.sha256);
}
const solve = loadBound(rel + 'n40-table-cell-review/method-independent-solve.json', '89c31571f229eef9132f9f6e61a94e441f83f0200a03ad24b2d822576beaf462');
const sourceCompletion = loadBound(rel + 'n40-table-cell-review/completion-receipt.json', 'a6b08652794c55f6358bc4fba1c31283d24825aacd1b71ee09ea16356366277b');
const prior = loadBound(rel + 'n40-answer-review/stage2-review.json', 'aa17fce80e49b9c4422441eae2a4a8c2a43e1b8bcafeb37d9dc160f916d78ae2');
const binding = loadBound(rel + 'n40-answer-author/table-candidate-binding.json', 'e9a64ed5b5106f856447308a17833dbfa2c9e56efd66b63ee5ea7de9e86df6ab');
assert.equal(binding.data.frozen.path, rel + 'n40-answer-author/answer-keys.table-frozen.json');
const candidate = loadBound(binding.data.frozen.path, binding.data.frozen.sha256);
const overrides = loadBound(binding.data.overrides.path, binding.data.overrides.sha256);
assert.equal(candidate.sha256, '6d37ba2c5bf235afd560a80c44e359f44bbd268bf56703c30cd3d20a2a288451');
assert.equal(overrides.sha256, 'e3119f20062b085c38e9aba7cef7abe7ce905ec41e767e1d7afc02cc59df7174');
assert.equal(binding.data.independentArithmeticPass.path, rel + 'n40-answer-review/stage2-review.json');
assert.equal(binding.data.independentArithmeticPass.sha256, prior.sha256);
assert.equal(binding.data.cells.sha256, sourceCompletion.data.authorizedAuthorCapturesSha256);
for (const name of ['generalRules', 'tableRules']) {
  const item = binding.data[name];
  const independentInput = solve.data.inputs.find((i) => i.path === path.join(root, item.path));
  assert.ok(independentInput);
  assert.equal(item.sha256, independentInput.sha256);
}
assert.equal(binding.data.candidate.sha256, candidate.sha256);
assert.deepEqual(binding.data.changedExercises, ['829', '830', '831']);
assert.equal(binding.data.unaffectedExercisesUnchanged, 11);
assert.equal(candidate.data.lesson, 'alg7-c4-s2-n40');
assert.equal(candidate.data.edition, 'modern-us-neutral');
assert.equal(candidate.data.answers.length, 14);
assert.ok(candidate.data.answers.every((a) => a.source === 'derived' && a.grading === 'ungraded' && Array.isArray(a.parts) && a.parts.length === 0));
const firstNewAuthorReadAtUtc = '2026-11-19T04:14:05.353Z';
assert.ok(Date.parse(independentFreeze.data.frozenAtUtc) < Date.parse(firstNewAuthorReadAtUtc));

// Hash unchanged entries against their original frozen snapshot; do not repeat their mathematical review.
const original = loadBound(binding.data.originalFrozen.path, binding.data.originalFrozen.sha256);
assert.equal(original.sha256, prior.data.inputs.find((i) => i.role.startsWith('Disclosed binding frozen')).sha256);
const changedIds = new Set(['829', '830', '831']);
const preservedEntries = original.data.answers.filter((a) => !changedIds.has(a.exercise)).map((entry) => {
  const other = candidate.data.answers.find((a) => a.exercise === entry.exercise);
  assert.ok(other);
  const originalProjectionSha256 = sha(Buffer.from(JSON.stringify(entry)));
  const candidateProjectionSha256 = sha(Buffer.from(JSON.stringify(other)));
  return {exercise: entry.exercise, originalProjectionSha256, candidateProjectionSha256, unchanged: originalProjectionSha256 === candidateProjectionSha256, mathematicalReviewRepeated: false};
});
assert.equal(preservedEntries.length, 11);
assert.ok(preservedEntries.every((e) => e.unchanged));
const entries = Object.fromEntries(candidate.data.answers.filter((e) => changedIds.has(e.exercise)).map((e) => [e.exercise, e]));
for (const override of overrides.data.answers) {
  assert.equal(entries[override.exercise].displayAnswer, override.displayAnswer);
  assert.equal(entries[override.exercise].notes, override.notes);
}
assert.equal(overrides.data.historicalEditionEquivalenceClaimed, false);
const text = Object.fromEntries(Object.entries(entries).map(([id, e]) => [id, e.displayAnswer]));
const notes = Object.fromEntries(Object.entries(entries).map(([id, e]) => [id, e.notes]));
const requireTokens = (value, tokens) => Object.fromEntries(tokens.map((token) => [token, value.includes(token)]));
const requirements = {
  '829-1': [
    '0.3333=33.33\\times10^{-2}',
    '33 行、主列 3',
    '修正列 3 给出 3 个千分位单位',
    '5.771+0.003=5.774',
    '\\sqrt{0.3333}\\approx0.5774',
    '6\\times0.5774=3.4644',
    '最终保留四位有效数字，约为 3.464',
    '不是 $6\\sqrt{0.3333}$ 的准确值'
  ],
  '829-2': [
    '6\\sqrt{\\frac{1}{3}}=\\sqrt{12}',
    '12 行、主列 0 直接给出 3.464',
    '不需要修正和外乘'
  ],
  '830-a': ['4\\sqrt{5}=\\sqrt{80}\\approx8.944', '80 行、主列 0 的读数为 8.944'],
  '830-b': ['15\\sqrt{2}=\\sqrt{450}=10\\sqrt{4.5}\\approx10\\times2.121=21.21', '4.5 行、主列 0 的读数为 2.121'],
  '830-c': ['14\\sqrt{\\frac{1}{7}}=\\sqrt{28}\\approx5.292', '28 行、主列 0 的读数为 5.292'],
  '830-d': ['12\\sqrt{\\frac{5}{6}}=\\sqrt{120}=10\\sqrt{1.2}\\approx10\\times1.095=10.95', '1.2 行、主列 0 的读数为 1.095'],
  '831-a': [
    '\\frac{12.5}{3.14}=\\frac{625}{157}\\approx3.981',
    '3.9 行、主列 8',
    '\\sqrt{3.98}\\approx1.995',
    '修正列 1 是 0',
    '\\sqrt{3.981}\\approx1.995',
    '最终三位有效数字为 $r\\approx2.00\\mathrm{cm}$'
  ],
  '831-b': [
    '\\frac{8.24}{3.14}=\\frac{412}{157}\\approx2.624',
    '2.6 行、主列 2',
    '\\sqrt{2.62}\\approx1.619',
    '修正列 4 是 1 个千分位单位',
    '\\sqrt{2.624}\\approx1.620',
    '最终三位有效数字为 $r\\approx1.62\\mathrm{cm}$'
  ]
};
const sharedChecks = {
  approximationNotEqualityToOneThird: text['829'].includes('不先用 0.3333 近似 $\\frac{1}{3}$') && text['829'].includes('不是 $6\\sqrt{0.3333}$ 的准确值'),
  exactRewritesSeparatedFromApproximateCells: text['830'].includes('合并根式是准确变形，表格小数则是近似值'),
  exactPowerTenScalingKeepsFourFigures: text['830'].includes('乘以 10 只移动小数点，不改变四位表值的有效数字数'),
  fourFigureGuardFromThreeFigureData: text['831'].includes('三位有效数字近似数据') && text['831'].includes('中间商保留一位额外数字，即四位有效数字'),
  finalThreeSignificantFigures: text['831'].includes('最终半径保留三位有效数字'),
  halfUpExplicit: text['831'].includes('恰在半单位时向上舍入'),
  halfUpLabeledAsConventionNotSourcePolicy: text['831'].includes('这是本答案的计算与展示约定') && notes['831'].includes('no source tie-policy'),
  noPhysicalErrorGuarantee: text['831'].includes('不把未给出的测量误差界当作已知条件') && notes['831'].includes('no source tie-policy or guaranteed physical error interval claimed'),
  guardArgumentsNotOriginalProblemData: text['831'].includes('被开方数是计算所得的近似商，并非题目直接给定的表格数据'),
  trailingZerosPreserveThreeFigures: text['831'].includes('2.00 的末尾零表示三位有效数字'),
  historicalEquivalenceNotClaimed: overrides.data.historicalEditionEquivalenceClaimed === false && text['829'].includes('不声称它与原教材使用的旧版逐格相同')
};
const preservationChecksForFourExistingTasks = {
  '829-comparison': text['829'].includes('第二种方法更方便') && text['829'].includes('不需要修正和外乘'),
  '831-inverse': text['831'].includes('r=\\sqrt{\\frac{S}{\\pi}}') && text['831'].includes('圆的半径取非负值'),
  '831-scale-4': text['831'].includes('面积增加到 4 倍') && text['831'].includes('\\sqrt{4}=2'),
  '831-scale-1/25': text['831'].includes('面积减小到原来的 $\\frac{1}{25}$') && text['831'].includes('\\sqrt{\\frac{1}{25}}=\\frac{1}{5}')
};
assert.ok(Object.values(sharedChecks).every(Boolean));
assert.ok(Object.values(preservationChecksForFourExistingTasks).every(Boolean));
const routes = solve.data.routes.map((r) => {
  const checks = requireTokens(text[r.exercise], requirements[r.id]);
  const matched = Object.values(checks).every(Boolean);
  return {
    id: r.id,
    exercise: r.exercise,
    task: r.task,
    status: matched ? 'PASS' : 'FAIL',
    independentSolvePointer: `method-independent-solve.json#/routes/${solve.data.routes.indexOf(r)}`,
    authorCandidatePointer: `answer-keys.table-frozen.json#/answers/${candidate.data.answers.findIndex((e) => e.exercise === r.exercise)}/displayAnswer`,
    sourceAuthorityRefs: r.sourceRefs,
    independentExactRewrite: r.exactRewrite,
    normalization: r.normalization,
    approvedSourceCellAddress: {image: r.table.image, footer: r.table.printedFooter, row: r.table.rowExact, mainColumn: r.table.mainColumnExact, correctionColumn: r.table.correctionColumnExact},
    correctionArgumentUnit: r.table.correctionArgumentUnit,
    rootCorrectionUnit: r.table.rootCorrectionUnit,
    guardArgument: r.guardArgument ?? null,
    tableIntermediate: r.table.correctedTableValue,
    finalSignificantFigures: r.final.significantFigures,
    finalExactTie: r.final.isExactTie,
    independentFinal: r.finalDisplay,
    authorFinalMatched: matched,
    convention: r.final.convention,
    proseEvidenceChecks: checks,
    finalVerdict: matched ? 'Approved exact rewrite, normalization, table correction arithmetic, guard staging where applicable, and final display under the explicitly stated scoped conventions.' : 'Not approved; repair failed evidence fields.',
    discrepancies: Object.entries(checks).filter(([, pass]) => !pass).map(([token]) => ({missingOrConflictingCandidateEvidence: token}))
  };
});
assert.ok(routes.every((r) => r.status === 'PASS'));
const reviewedAtUtc = new Date().toISOString();
const report = {
  schema: 'stemrobin182/n40-affected-table-method-answer-review@1',
  ticket: 'STEMROBIN-182',
  checkout: root,
  owner,
  mode: 'OFFLINE',
  status: 'PASS_8_OF_8_AFFECTED_TABLE_METHOD_ANSWER_ROUTES',
  reviewedAtUtc,
  independence: {
    independentFrozenAtUtc: independentFreeze.data.frozenAtUtc,
    firstNewAuthorReadAtUtc,
    independentSolveBeforeNewCandidateRead: true,
    independentSolveSha256: solve.sha256,
    independentFreezeSha256: independentFreeze.sha256,
    noDirectSquareRootFunctionUsed: true,
    exactRationalTableArithmetic: true,
    newImages: 0
  },
  authorBindings: {
    candidate: {path: candidate.path, sha256: candidate.sha256},
    binding: {path: binding.path, sha256: binding.sha256},
    overrides: {path: overrides.path, sha256: overrides.sha256},
    originalFrozen: {path: original.path, sha256: original.sha256, use: 'Unchanged-entry hash comparison only; no repeated arithmetic.'},
    mutableCandidateNotOpened: true,
    candidateAndFrozenHashDeclaredEqual: true,
    sourceCellsBindingMatchesExistingApprovedAuthorCaptureSha256: true,
    ruleBindingsMatchIndependentInputHashes: true,
    authorTableDerivations: 'Path/hash are disclosed in the binding but the file was not read or used; table stages were independently calculated from own frozen cells.'
  },
  sourceAuthority: solve.data.inputs.find((i) => i.role.startsWith('Actual finalized')),
  previousEvidence: {
    sourceCellApproval: {path: sourceCompletion.path, sha256: sourceCompletion.sha256, status: 'SOURCE_CELLS_APPROVED', preserved: true},
    priorStage2: {path: prior.path, sha256: prior.sha256, nonTablePassTasksReused: 59},
    priorStage2Markdown: solve.data.inputs.find((i) => i.role === 'Reuse textual prior review'),
    originalIndependentSolve: solve.data.inputs.find((i) => i.role.startsWith('Original independent solve')),
    unchangedEntries: preservedEntries,
    existingFourNonTableTasks: {
      statementPreservationChecks: preservationChecksForFourExistingTasks,
      newMathematicalReview: false,
      priorPASSResultsReused: true
    }
  },
  sharedMethodAndBoundaryChecks: sharedChecks,
  routes,
  precisionAndLimits: solve.data.conventionAssessment,
  findings: [],
  summary: {
    affectedRoutesReviewed: 8,
    affectedRoutesPASS: 8,
    affectedRoutesFAIL: 0,
    actionableDiscrepancies: 0,
    previousNonTableTasksPASSReused: 59,
    previousNonTableTaskArithmeticRepeated: 0,
    unchangedWholeExercisesHashMatched: 11,
    previouslyPassedStatementsPreservedWithinAffectedExercises: 4,
    combinedAnswerTaskCoverage: 67,
    exactFinalTieCases: 1,
    newImageLoads: 0,
    imageReopens: 0,
    crops: 0,
    renders: 0,
    sourceCellApprovalEdits: 0,
    oldReviewEdits: 0,
    authorEdits: 0,
    finalizerCalls: 0,
    dbActions: 0,
    appActions: 0,
    publishActions: 0,
    networkActions: 0,
    commits: 0
  },
  exactApproval: 'Approve only 829-1, 829-2, 830-a through 830-d, and 831-a/b in the candidate bound by the verified SHA-256. Their missing table method/answer stages are now PASS. Reuse the existing 59 non-table PASS tasks without re-review. The earlier source-cell approval remains unchanged.',
  boundaries: 'No physical true-radius or last-digit guarantee; no historical equivalence claim or new human gate. This is an affected method/answer report, not a finalizer, render, app/prose review, publication or any unperformed product criterion.',
  stop: 'Affected-only review complete. Preserve all independent/frozen/source and other workers files. Stop.'
};
const markdown = [
  '# n40 Affected Table METHOD/ANSWER Review',
  '',
  '**PASS: all eight affected routes. Zero actionable discrepancies.**',
  '',
  report.exactApproval,
  '',
  '## Binding And Independence',
  '',
  `Exact checkout: \`${root}\`. OFFLINE; all new files are under \`${owner}\`.`,
  '',
  `Independent stages were frozen at \`${independentFreeze.data.frozenAtUtc}\`, before the new candidate/binding/override disclosure at \`${firstNewAuthorReadAtUtc}\`. Calculations use exact rational arithmetic on the reviewer’s own frozen cells; no direct square-root function, new images, crops, reopens or renders.`,
  '',
  `- Actual exercise authority: \`${report.sourceAuthority.path}\`; SHA-256 \`${report.sourceAuthority.sha256}\`.`,
  `- Candidate: \`${candidate.path}\`; SHA-256 \`${candidate.sha256}\`.`,
  `- Binding: \`${binding.path}\`; SHA-256 \`${binding.sha256}\`.`,
  `- FIRST overrides: \`${overrides.path}\`; SHA-256 \`${overrides.sha256}\`.`,
  `- Independent solve: \`method-independent-solve.json\`; SHA-256 \`${solve.sha256}\`.`,
  `- Independent freeze: \`method-independent-freeze.json\`; SHA-256 \`${independentFreeze.sha256}\`.`,
  '',
  '## Eight Route Verdicts',
  '',
  '| Route | Independent Table Stage | Final Display | Figures | Verdict |',
  '| --- | --- | --- | --- | --- |',
  '| 829-1 | 0.3333=33.33×10^-2; T(33.33)=5.771+0.003=5.774; root 0.5774; ×6 gives 3.4644 | 3.464 | 4 | PASS |',
  '| 829-2 | Exact rewrite 6√(1/3)=√12; T(12)=3.464 | 3.464 | 4 | PASS |',
  '| 830-a | Exact rewrite 4√5=√80; T(80)=8.944 | 8.944 | 4 | PASS |',
  '| 830-b | Exact rewrite 15√2=√450=10√4.5; T(4.5)=2.121 | 21.21 | 4 | PASS |',
  '| 830-c | Exact rewrite 14√(1/7)=√28; T(28)=5.292 | 5.292 | 4 | PASS |',
  '| 830-d | Exact rewrite 12√(5/6)=√120=10√1.2; T(1.2)=1.095 | 10.95 | 4 | PASS |',
  '| 831-a | Approximate-input quotient model 625/157; guard 3.981; T=1.995+0×0.001=1.995 | 2.00 cm | 3 | PASS |',
  '| 831-b | Approximate-input quotient model 412/157; guard 2.624; T=1.619+1×0.001=1.620 | 1.62 cm | 3 | PASS |',
  '',
  '`T` is this selected Table IV lower-main-plus-ready-correction procedure. The equalities between table decimals describe exact arithmetic on approximate table values, never equality to exact roots.',
  '',
  '## Methods And Precision',
  '',
  '- 829 never identifies 0.3333 with 1/3: their difference is 1/30000. Normalization of the terminating decimal 0.3333 is exact; using it in place of 1/3 is approximate. The candidate expressly separates the table product 3.4644 from the exact expression.',
  '- The exact absorbed-positive-factor rewrites precede lookup. For 450 and 120, even-power normalization is respectively 4.5×10^2 and 1.2×10^2; root scaling is exactly ×10, with no loss of the table’s four significant figures.',
  '- At row 33, the main argument step is 0.1 and the correction-argument unit is 0.01: correction column 3 represents argument increment 0.03. Below 10, correction-argument units are 0.001. In both regimes, correction integers change the root in units 0.001. The candidate has the correct root correction 0.003, not 0.03.',
  '- 831 uses the prescribed approximate S/pi models: 12.5/3.14=625/157 and 8.24/3.14=412/157 within that computational model, not exact physical data. The quotients round to the directly authorized four-significant guard arguments 3.981 and 2.624. Each given approximate datum has three significant figures; retain the fourth reserve digit through lookup and round the final radius to three.',
  '- Half-up is an explicit final calculation/display convention, not a Bradis or textbook tie policy. Exact rational rounding confirms the real table-intermediate tie 1.995 goes to 2.00; its trailing zeros are necessary for three significant figures. The other seven final rounding cases are not ties. The candidate labels this convention explicitly in 831 and does not assert a sourced tie rule.',
  '- The source supports four-significant Table IV values and even-power scaling. Four-significant final 829/830 output is the explicitly selected scoped convention; the allowed general rules do not create a universal post-product or four-significant argument rule. General G3-G7 precision/reserve context remains labeled secondary-only; G8/G9 are conditional context.',
  '- No physical true-value, measurement-error interval, last-digit guarantee, or historical-edition equivalence is claimed. Guard digits do not create additional accuracy in the given approximate measurements; corrected roots do not inherit the direct-main-entry half-unit guarantee.',
  '',
  '## Reuse And Preservation',
  '',
  `The original \`n40-answer-review/stage2-review.json\` remains hash-bound at \`${prior.sha256}\`, and its .md remains at \`${report.previousEvidence.priorStage2Markdown.sha256}\`.`,
  '',
  '55 tasks in 11 unaffected whole exercises are preserved by unchanged-entry hashes against the bound original snapshot, not re-solved. The existing four PASS statements within 829/831 retain their already-reviewed preference, nonnegative inverse and two area-scale conclusions. Thus 59 non-table PASS tasks are reused; together with these eight newly approved table routes, answer-task coverage is 67/67.',
  '',
  'The new source facts support the existing method-2 preference: both methods require one root lookup, but method 2 reads a single main entry without correction, prior decimal approximation to 1/3 or post-lookup multiplication. This is not a second review of the passed comparison task.',
  '',
  `The existing SOURCE_CELLS_APPROVED receipt remains unchanged, SHA-256 \`${sourceCompletion.sha256}\`. All files bound by that receipt and the original solve freeze remain byte-identical. The prior reports are historical immutable evidence, not rewritten to erase their former missing-stage state.`,
  '',
  '## Findings And Stop',
  '',
  'No repair is prescribed. Precise candidate approval is limited to the eight routes and declared conventions above. All unaffected PASS results and the source-cell approval remain usable.',
  '',
  report.boundaries,
  '',
  'No author edits, finalizer, database, app, publish, network or commit actions. No author table-derivation arithmetic is used. Detailed per-route comparison is in `method-review.json`; exact new-file hashes and input bindings are in `method-review-receipt.json`. Stop.'
].join('\n') + '\n';
const writeNew = (name, bytes) => fs.writeFileSync(path.join(owner, name), bytes, {flag: 'wx', mode: 0o444});
writeNew('method-review.json', JSON.stringify(report, null, 2) + '\n');
writeNew('method-review.md', markdown);
fs.chmodSync(__filename, 0o444);
const names = ['method-scope.json', 'method-independent-calculate.cjs', 'method-independent-solve.json', 'method-independent-freeze.json', 'method-compare-candidate.cjs', 'method-review.json', 'method-review.md'];
const files = names.map((name) => {
  const absolute = path.join(owner, name);
  assert.equal(fs.statSync(absolute).mode & 0o222, 0);
  return {name, path: absolute, sha256: sha(fs.readFileSync(absolute)), mode: '0444'};
});
const receipt = {
  schema: 'stemrobin182/n40-affected-method-review-receipt@1',
  completedAtUtc: new Date().toISOString(),
  ticket: 'STEMROBIN-182',
  checkout: root,
  owner,
  status: report.status,
  files,
  authorizedInputs: [binding, candidate, overrides, original].map(({path: inputPath, sha256}) => ({path: inputPath, sha256})),
  preservedInputBindings: independentFreeze.data.inputs,
  sourceApprovalReceiptSha256: sourceCompletion.sha256,
  firstNewAuthorReadAtUtc,
  independentFrozenAtUtc: independentFreeze.data.frozenAtUtc,
  summary: report.summary,
  approval: report.exactApproval,
  boundaries: report.boundaries,
  stop: true
};
writeNew('method-review-receipt.json', JSON.stringify(receipt, null, 2) + '\n');
for (const input of [...independentFreeze.data.inputs, ...receipt.authorizedInputs]) assert.equal(sha(fs.readFileSync(input.path)), input.sha256);
for (const file of sourceCompletion.data.files) assert.equal(sha(fs.readFileSync(file.path)), file.sha256);
for (const file of files) assert.equal(sha(fs.readFileSync(file.path)), file.sha256);
const receiptPath = path.join(owner, 'method-review-receipt.json');
assert.equal(fs.statSync(receiptPath).mode & 0o222, 0);
console.log(JSON.stringify({status: report.status, summary: report.summary, files, receiptPath, receiptSha256: sha(fs.readFileSync(receiptPath)), stop: true}, null, 2));
