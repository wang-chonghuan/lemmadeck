'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const base = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13');
const owner = path.join(base, 'n41-table-cell-source');
assert.equal(__dirname, owner);
assert.equal(fs.realpathSync(process.cwd()), root);
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const inputs = [];
const read = (absolute, expected, role) => {
  const bytes = fs.readFileSync(absolute);
  const hash = sha(bytes);
  if (expected) assert.equal(hash, expected, `Input changed: ${absolute}`);
  inputs.push({path: absolute, sha256: hash, role});
  return JSON.parse(bytes);
};
const exercisePath = path.join(base, 'n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n41/exercises.template.json');
const exercises = read(exercisePath, 'c9e95c8bbb123b3c06ce5620adc2d96b9794adf538d3a07a9beff8dd998bb3c3', 'Current n41 frozen exercise template; only named eight tasks used');
const freeze = read(path.join(base, 'bradis-cell-review/independent-freeze.json'), 'f7a1dfdfed44fe5bf7d0b6c961fc091d88a76ce40f658d5a22075db2cab54e1d', 'Existing independent source-capture freeze');
const oldLedger = read(path.join(base, 'bradis-cell-review/image-ledger.json'), '4e46d701992f6249619e202b8a6f3247200fb8a2801dfb0ec1f94c277e8d0b4d', 'Reuse existing PNG hashes without opening images');
const rules = read(path.join(base, 'bradis-tables-source-review/source-rules.corrected.json'), '41a84bf4ad20217b9eb056bdaebcf5417d5d72d08820119b63bbf05308611f46', 'Corrected Table IV source rules');
read(path.join(base, 'bradis-method-rules/source-rules.json'), 'a0f08bfe1b78099bd6489bc53fd869c4c215f16bf6ea7cf3787050080df1d05a', 'General rule context; no answer precision selected');
const old = [];
for (let n = 33; n <= 40; n++) {
  const name = `capture-${n}.json`;
  const capture = read(path.join(base, 'bradis-cell-review', name), freeze.capture_sha256[name], 'Existing independent literal source-cell capture');
  assert.equal(capture.stage, 'independent-pixels-only');
  old.push({page: n, name, capture, sha256: freeze.capture_sha256[name]});
}
const tasks = [
  {id: '835.c', exercise: '835', lineIndex: 3, simplified: '2*sqrt(3)', derivation: 'sqrt(27)=3*sqrt(3), sqrt(48)=4*sqrt(3); coefficient 5+(1/3)*3-4=2.', arguments: ['3']},
  {id: '835.d', exercise: '835', lineIndex: 4, simplified: '14*sqrt(5)', derivation: 'sqrt(80)=4*sqrt(5), sqrt(20)=2*sqrt(5), sqrt(45)=3*sqrt(5); coefficient 4+(1/2)*2+3*3=14.', arguments: ['5']},
  {id: '835.e', exercise: '835', lineIndex: 5, simplified: 'sqrt(3)', derivation: 'sqrt(75)=5*sqrt(3), sqrt(300)=10*sqrt(3), sqrt(27)=3*sqrt(3); coefficient 5-(1/10)*10-3=1.', arguments: ['3']},
  {id: '843.a', exercise: '843', lineIndex: 1, simplified: 'sqrt(5)+sqrt(3)', derivation: 'Multiply by sqrt(5)+sqrt(3); conjugate denominator 5-3=2 cancels numerator 2.', arguments: ['5', '3']},
  {id: '843.b', exercise: '843', lineIndex: 2, simplified: 'sqrt(10)-sqrt(7)', derivation: 'Multiply by sqrt(10)-sqrt(7); conjugate denominator 10-7=3 cancels numerator 3.', arguments: ['10', '7']},
  {id: '843.c', exercise: '843', lineIndex: 3, simplified: 'sqrt(5)+2', derivation: 'Multiply by sqrt(5)+2; conjugate denominator 5-4=1.', arguments: ['5']},
  {id: '843.d', exercise: '843', lineIndex: 4, simplified: '6-2*sqrt(7)', derivation: 'Multiply by 3-sqrt(7); denominator 9-7=2; 4*(3-sqrt(7))/2=6-2*sqrt(7).', arguments: ['7']},
  {id: '843.e', exercise: '843', lineIndex: 5, simplified: '9+4*sqrt(5)', derivation: 'Multiply by 9+4*sqrt(5); denominator 81-16*5=1.', arguments: ['5']}
].map((task) => {
  const exercise = exercises.exercises.find((e) => e.number === task.exercise);
  assert.ok(exercise);
  return {...task, originalLineExact: exercise.lines[task.lineIndex], exerciseRefs: exercise.pages, algebraStatus: 'INFERRED_EXACT_ALGEBRA_NOT_PRINTED_TABLE_CELLS'};
});
assert.equal(tasks.length, 8);
const requested = [
  {id: 'IV-root-3', argument: '3', row: '3,0', mainColumn: '0', page: 36},
  {id: 'IV-root-5', argument: '5', row: '5,0', mainColumn: '0', page: 37},
  {id: 'IV-root-7', argument: '7', row: '7,0', mainColumn: '0', page: 37},
  {id: 'IV-root-10', argument: '10', row: '10,', mainColumn: '0', page: 38}
].map((address) => {
  const matches = [];
  for (const file of old) {
    if (file.capture.table !== 'IV') continue;
    file.capture.records_in_request_address_order.forEach((record, i) => {
      if (record.row === address.row && record.main.column === address.mainColumn) {
        matches.push({
          capturePath: path.join(base, 'bradis-cell-review', file.name),
          captureSha256: file.sha256,
          pointer: `#/records_in_request_address_order/${i}/main`,
          oldRequestId: record.id,
          mainCellExact: record.main.printed,
          printedFooter: file.capture.printed_page,
          imagePath: path.join(base, 'bradis-source', `page-${file.page}.png`),
          imageSha256: oldLedger.source_image_sha256[String(file.page)]
        });
      }
    });
  }
  return {
    ...address,
    correctionColumn: null,
    correctionCellExact: null,
    correctionReason: 'Exact main-table argument; no correction requested. No correction column 0 is printed.',
    neededBy: tasks.filter((t) => t.arguments.includes(address.argument)).map((t) => t.id),
    existingIndependentMatches: matches,
    coverage: matches.length ? 'EXISTING_INDEPENDENT_CELL_REUSED_NO_IMAGE' : 'MISSING_REQUIRES_SOURCE_PNG_CAPTURE'
  };
});
assert.equal(requested.filter((r) => r.existingIndependentMatches.length).length, 1);
assert.equal(requested.find((r) => r.argument === '10').existingIndependentMatches[0].mainCellExact, '3,162');
const neededPages = [...new Set(requested.filter((r) => !r.existingIndependentMatches.length).map((r) => r.page))];
assert.deepEqual(neededPages, [36, 37]);
const plan = {
  schema: 'stemrobin182/n41-source-only-address-plan@1',
  createdAtUtc: new Date().toISOString(),
  ticket: 'STEMROBIN-182',
  checkout: root,
  owner,
  mode: 'OFFLINE',
  sourceOnly: true,
  authorKeysOrSolutionsRead: false,
  candidateValuesRead: false,
  inputs,
  tasks,
  addresses: requested,
  coverageCounts: {tasks: 8, rootLookupOccurrences: 10, distinctAddresses: 4, reusedIndependentAddresses: 1, missingAddresses: 3, neededSourcePages: 2, requestedCorrectionCells: 0},
  routeBasis: 'The exercise says simplify first then look up. Use the shared square-free roots in those standard simplified forms; no unique absorbed-coefficient route is asserted. Alternate algebraic routes are not final-answer or table-method adjudications here.',
  selectedSourceRules: rules.tables.find((t) => t.id === 'IV').rules.filter((r) => ['IV-domain-and-precision', 'IV-addition', 'IV-scale', 'IV-over-resolution-and-guard'].includes(r.id)),
  ruleUnitProvenance: {
    below10: {mainArgumentUnit: '0.01', correctionArgumentUnit: '0.001', rootCorrectionUnit: '0.001'},
    from10: {mainArgumentUnit: '0.1', correctionArgumentUnit: '0.01', rootCorrectionUnit: '0.001'},
    note: 'Units are textual-rule and header/layout interpretation, not literal unit captions printed in numeric headers.'
  },
  noComputedRootStrings: true,
  answerArithmeticOrPrecisionApproval: false,
  parentOwnsCandidateAndAffectedReview: true,
  boundaries: 'Only new source-only reports/captures in owner. No n41 author keys/solutions, network, PDF redistribution, DB, paid calls, durable edits, app, finalizer, publish or commit.'
};
const ledger = {
  schema: 'stemrobin182/n41-missing-source-image-ledger@1',
  checkout: root,
  createdAtUtc: new Date().toISOString(),
  budget: {maxImagesThisBatch: 8, plannedImages: 2, oneOpenPerNeededPage: true, maxContextImages: 24},
  carriedImageLoadsInThisChatContext: 3,
  contextImagesAfterPlannedLoads: 5,
  completedImageLoadsThisJob: 0,
  authorKeysOrSolutionsRead: false,
  crops: 0,
  renders: 0,
  withinJobReopens: 0,
  reusedCoveredAddressImagesOpened: 0,
  crossJobRepeatNote: 'Page 36 was viewed in the disjoint n40 source job. The current new-cell read is explicitly needed and counted again; no within-job page is opened twice.',
  images: neededPages.map((page, i) => ({
    sequence: i + 1,
    page,
    path: path.join(base, 'bradis-source', `page-${page}.png`),
    sha256: oldLedger.source_image_sha256[String(page)],
    addresses: requested.filter((a) => a.page === page && !a.existingIndependentMatches.length).map((a) => a.id),
    method: 'functions.view_image detail=original; existing full PNG only',
    status: 'pending',
    loadsThisJob: 0
  }))
};
const writeNew = (name, object, mode = 0o444) => fs.writeFileSync(path.join(owner, name), JSON.stringify(object, null, 2) + '\n', {flag: 'wx', mode});
writeNew('address-plan.json', plan);
writeNew('image-load-ledger.json', ledger, 0o644);
fs.chmodSync(__filename, 0o444);
writeNew('address-plan-freeze.json', {
  schema: 'stemrobin182/n41-source-address-prefreeze@1',
  frozenAtUtc: new Date().toISOString(),
  files: ['address-plan.json', 'prepare-source-addresses.cjs'].map((name) => ({path: path.join(owner, name), sha256: sha(fs.readFileSync(path.join(owner, name))), mode: '0444'})),
  inputs,
  sourceImagesOpenedAtAddressFreeze: 0,
  candidateKeysOrSolutionsRead: false
});
console.log(JSON.stringify({status: 'ADDRESSES_FROZEN_BEFORE_MISSING_CELL_VIEW',coverageCounts: plan.coverageCounts, neededPages, addressPlanPath: path.join(owner, 'address-plan.json'), addressPlanSha256: sha(fs.readFileSync(path.join(owner, 'address-plan.json'))), addressFreezeSha256: sha(fs.readFileSync(path.join(owner, 'address-plan-freeze.json')))}, null, 2));
