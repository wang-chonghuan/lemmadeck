import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root, 'Run only in the explicitly assigned workdir');
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d076-raw281283-and314-affected-review');
const prefix = '.intentfold/tickets/STEMROBIN-181/tmp/';
const read = file => fs.readFileSync(path.resolve(root, file));
const json = file => JSON.parse(read(file).toString('utf8'));
const sha = file => crypto.createHash('sha256').update(read(file)).digest('hex');
const inputs = new Map();

function bind(file, role, expected) {
  const absolutePath = path.resolve(root, file);
  const actual = sha(absolutePath);
  if (expected) assert.equal(actual, expected, `Hash mismatch: ${file}`);
  let record = inputs.get(absolutePath);
  if (!record) {
    record = { path: absolutePath, sha256: actual, bytes: read(file).length, roles: [], expectedSha256: [] };
    inputs.set(absolutePath, record);
  }
  assert.equal(record.sha256, actual, `Input drift: ${file}`);
  if (!record.roles.includes(role)) record.roles.push(role);
  if (expected && !record.expectedSha256.includes(expected)) record.expectedSha256.push(expected);
  return { path: absolutePath, sha256: actual, bytes: record.bytes };
}

const reportPath = path.join(owned, 'report.json');
const report = json(reportPath);
const preparation = report.taskA.preparationFreeze;
const repairBinding = report.affected314.repairFreeze;
bind(preparation.path, 'Task A preparation freeze', preparation.sha256);
bind(repairBinding.path, 'Task B repair freeze', repairBinding.sha256);
const a = json(preparation.path);
const repair = json(repairBinding.path);
bind(a.originalAuthor.path, 'original Task A author/crop provenance', a.originalAuthor.sha256);
const original = json(a.originalAuthor.path);
const ledger = [];
const rawChecks = [];

for (let i = 0; i < a.records.length; i++) {
  const record = a.records[i];
  const observed = report.taskA.records[i];
  assert.equal(record.figure, observed.figure);
  for (const key of ['rawPng', 'rawSvg', 'svgPreview', 'firstPreviewReceipt']) {
    bind(record[key].path, `Task A ${record.figure} ${key}`, record[key].sha256);
  }
  const retained = original.rawPNGs.find(item => item.path === record.rawPng.path);
  assert.ok(retained, `Missing original crop binding for ${record.figure}`);
  bind(retained.originalPath, `retained original ${record.figure} crop`, record.rawPng.sha256);
  const nativeReceipt = json(record.firstPreviewReceipt.path);
  assert.equal(nativeReceipt.cwd, root);
  assert.equal(nativeReceipt.exitCode, 0);
  bind(nativeReceipt.command[2], `retained native ${record.figure} SVG input`, record.rawSvg.sha256);
  for (const name of ['stdout.txt', 'stderr.txt']) {
    bind(path.join(path.dirname(record.firstPreviewReceipt.path), name), `existing ${record.figure} preview receipt text; not rerun`);
  }
  rawChecks.push({ figure: record.figure, retainedOriginalMatch: true, nativeInputSvgMatch: true, RAW: record.rawPng, SVG: record.rawSvg });
  ledger.push({
    event: i * 2 + 1, task: 'A', kind: 'ORIGINAL_RAW_CROP', figure: record.figure,
    ...bind(record.rawPng.path, `actually opened image ${i * 2 + 1}`, record.rawPng.sha256),
    retainedOriginal: bind(retained.originalPath, 'retained original crop, hash comparison only', record.rawPng.sha256),
    observation: observed.RAW, actualOpen: true, reopen: false
  });
  ledger.push({
    event: i * 2 + 2, task: 'A', kind: 'EXISTING_NATIVE_SVG_PREVIEW', figure: record.figure,
    ...bind(record.svgPreview.path, `actually opened image ${i * 2 + 2}`, record.svgPreview.sha256),
    svg: bind(record.rawSvg.path, 'reviewed SVG bytes through existing native preview', record.rawSvg.sha256),
    observation: observed.SVG, actualOpen: true, reopen: false
  });
}

for (const field of ['baseReview', 'baseReviewFreeze', 'pageMd', 'pageJson', 'audit', 'sourceImage', 'nativeFinalize']) {
  bind(repair[field].path, `Task B ${field}`, repair[field].sha256);
}
for (const before of repair.before) bind(before.path, 'Task B immutable before snapshot', before.sha256);
const baseFreeze = json(repair.baseReviewFreeze.path);
for (const artifact of baseFreeze.artifacts) bind(artifact.path, 'retained base review artifact; hash reuse only', artifact.sha256);
const baseInputsBinding = baseFreeze.inputBindings;
bind(baseInputsBinding.path, 'base-approved input manifest', baseInputsBinding.sha256);
const baseInputs = json(baseInputsBinding.path);
let unchangedBaseInputsChecked = 0;
const changedBaseInputs = [];
for (const input of baseInputs.inputs) {
  const current = path.resolve(root, input.path);
  if ([path.resolve(root, repair.pageMd.path), path.resolve(root, repair.pageJson.path)].includes(current)) {
    changedBaseInputs.push({ path: current, baseSha256: input.sha256, currentSha256: sha(current) });
    continue;
  }
  bind(input.path, 'unchanged base review input; not semantically re-reviewed', input.sha256);
  unchangedBaseInputsChecked++;
}
assert.equal(unchangedBaseInputsChecked, 64);
assert.equal(changedBaseInputs.length, 2);

const beforeMd = read(repair.before.find(item => item.path.endsWith('/page.md')).path).toString('utf8');
const currentMd = read(repair.pageMd.path).toString('utf8');
assert.equal(beforeMd.replace(repair.noteFrom, repair.noteTo).replace(repair.from, repair.to), currentMd);
const oldJson = json(repair.before.find(item => item.path.endsWith('/page.json')).path);
const currentJson = json(repair.pageJson.path);
const expected = structuredClone(oldJson);
expected.meta.notes[1] = expected.meta.notes[1].replace(repair.noteFrom, repair.noteTo);
expected.blocks[0].lines[1] = expected.blocks[0].lines[1].replace(repair.from, repair.to);
assert.deepEqual(expected, currentJson);
const mdMatch = currentMd.match(/^---\r?\n([\s\S]*?)\r?\n---/);
assert.ok(mdMatch);
assert.deepEqual(JSON.parse(mdMatch[1]), currentJson.meta);
const beforeRows = beforeMd.split('\n');
const currentRows = currentMd.split('\n');
assert.equal(beforeRows.length, currentRows.length);
const changedMdLines = currentRows.flatMap((row, index) => row === beforeRows[index] ? [] : [index + 1]);
assert.deepEqual(changedMdLines, [24, 64]);
assert.equal(currentRows[63], currentJson.blocks[0].lines[1]);
assert.ok(currentRows[63].includes(repair.to + '\uff0c'));
assert.equal(report.affected314.from, repair.from);
assert.equal(report.affected314.to, repair.to);

const changes = [];
function diff(oldValue, newValue, pointer = '') {
  if (isDeepStrictEqual(oldValue, newValue)) return;
  if (oldValue && newValue && typeof oldValue === 'object' && typeof newValue === 'object') {
    for (const key of new Set([...Object.keys(oldValue), ...Object.keys(newValue)])) diff(oldValue[key], newValue[key], `${pointer}/${key}`);
  } else changes.push({ pointer, before: oldValue, after: newValue });
}
diff(oldJson, currentJson);
assert.deepEqual(changes.map(item => item.pointer), ['/meta/notes/1', '/blocks/0/lines/1']);

ledger.push({
  event: 7, task: 'B', kind: 'FULL_ORIGINAL_SOURCE_PAGE', page: 314,
  ...bind(repair.sourceImage.path, 'actually opened image 7; affected314 only', repair.sourceImage.sha256),
  observation: report.affected314.pixelObservation,
  judgedScope: report.affected314.scope,
  actualOpen: true, reopen: false, grid: false, contactSheet: false
});

const instructions = [
  'AGENTS.md', '.intentfold/readme.md', '.intentfold/project.json',
  '.intentfold/charter/product.md', '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md', '.intentfold/charter/ui.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '/Users/yong/.agents/skills/intentfold/SKILL.md',
  report.authority.receipt181, report.authority.receipt179Comments
];
for (const file of instructions) bind(file, 'read governing instruction or saved authority');
for (const number of ['0306', '0307']) {
  bind(`ssot-resources/soviet10year-textbooks/artifacts/9p/pages/${number}/page.md`, 'faithful Task A textual context only; no SOURCE re-review');
}
const comments = json(report.authority.receipt179Comments);
assert.ok(comments.results.find(comment => comment.id === report.authority.comment179));
const existingFinalize = json(repair.nativeFinalize.path);
assert.equal(existingFinalize.cwd, root);
assert.equal(existingFinalize.exitCode, 0);
for (const name of ['stdout.txt', 'stderr.txt']) bind(path.join(path.dirname(repair.nativeFinalize.path), name), 'existing affected-only finalize receipt text; not rerun');

const boundAt = new Date().toISOString();
const inputReport = {
  schema: 'STEMROBIN-181/review-input-hashes@1', batch: 'D076', boundAt,
  mechanicalOnly: true, semanticVerdictsComeFromActualImageObservations: true,
  allExpectedHashesMatch: true, rawOriginalAndNativeInputBindings: rawChecks,
  preservation: {
    status: 'pass', unchangedBaseInputsChecked, changedBaseInputs,
    changedMdLines, jsonChanges: changes,
    onlyAuthorizedMdChanges: true, onlyAuthorizedJsonChanges: true,
    metaMatchesJson: true, currentMd64MatchesJsonRow: true,
    allOtherProseBlocksBoundaryFlagsCropGeometryAndMetadataExact: true,
    source315RawSvgAndPreviewHashesUnchanged: true,
    baseAuditBytesUnchanged: true, currentMd64: currentRows[63]
  },
  inputs: [...inputs.values()]
};
const imageReport = {
  schema: 'STEMROBIN-181/actual-image-ledger@1', batch: 'D076',
  actualImageOpens: 7, actualContextImageOpens: 7, batchLimit: 8, contextLimit: 24,
  reopens: 0, grids: 0, contactSheets: 0, newlyGeneratedImages: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0, entries: ledger
};
assert.equal(ledger.length, report.actualImageOpens);
assert.deepEqual(ledger.map(item => item.event), [1, 2, 3, 4, 5, 6, 7]);
for (const record of inputs.values()) assert.equal(sha(record.path), record.sha256, `Drift before freeze: ${record.path}`);

function write(name, value) {
  const destination = path.join(owned, name);
  assert.equal(path.dirname(destination), owned);
  fs.writeFileSync(destination, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}
write('input-hashes.json', inputReport);
write('image-ledger.json', imageReport);
const artifacts = ['report.json', 'image-ledger.json', 'grill.md', 'input-hashes.json', 'bind-review.mjs'].map(name => {
  const file = path.join(owned, name);
  return { path: file, sha256: sha(file), bytes: read(file).length };
});
write('review-freeze.json', {
  schema: 'STEMROBIN-181/independent-review-freeze@1', ticket: 'STEMROBIN-181',
  batch: 'D076', status: 'pass', frozenAt: boundAt, reviewerIsAuthor: false,
  workingDirectory: root, ownedDirectory: owned,
  taskA: { status: 'pass', stages: ['RAW281', 'SVG281', 'RAW282', 'SVG282', 'RAW283', 'SVG283'], preparationFreeze: bind(preparation.path, 'freeze Task A', preparation.sha256) },
  affected314: { status: 'pass', resolvedFinding: repair.finding, affectedBlock: 'p0314#1', blockLine: 2, mdLine: 64, noteMdLine: 24, repairFreeze: bind(repairBinding.path, 'freeze Task B', repairBinding.sha256) },
  artifacts,
  inputBindings: artifacts.find(item => item.path.endsWith('/input-hashes.json')),
  allInputs: inputReport.inputs,
  allInputHashesStableAtFreeze: true,
  actualImageOpens: 7, actualContextImageOpens: 7, reopens: 0,
  unchangedBaseInputHashesChecked: 64, unchangedStagesReReviewed: false,
  whole123Approval: false, whole127aApproval: false, whole128Approval: false,
  modernFigureApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
  parentConsumptionPending: true, repairsPerformed: false, nativeProducerReruns: 0,
  formalHandoff: false
});
console.log(JSON.stringify({ status: 'pass', taskA: 'pass', affected314: 'pass', actualImageOpens: 7, unchangedBaseInputsChecked, artifacts: [...artifacts, { path: path.join(owned, 'review-freeze.json'), sha256: sha(path.join(owned, 'review-freeze.json')) }] }, null, 2));
