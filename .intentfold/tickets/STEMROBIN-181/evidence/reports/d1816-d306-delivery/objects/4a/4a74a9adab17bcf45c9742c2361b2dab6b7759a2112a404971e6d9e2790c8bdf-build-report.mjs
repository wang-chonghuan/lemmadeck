import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.dirname(fileURLToPath(import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(own, name), 'utf8'));
const bind = file => {
  const resolved = path.resolve(own, file);
  const bytes = fs.readFileSync(resolved);
  return { path: resolved, sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length };
};
const verify = entry => {
  const actual = bind(entry.path);
  assert.equal(actual.sha256, entry.sha256, entry.path);
  assert.equal(actual.bytes, entry.bytes, entry.path);
};
const write = (name, payload) => {
  const file = path.resolve(own, name);
  assert(file.startsWith(`${own}/`));
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' });
  return bind(file);
};
const notes = read('review-notes.json');
const evidence = read('bindings-verification.json');
const inventory = read('source-inventory.json');
const ledger = read('image-ledger.json');
assert.equal(evidence.status, 'pass');
assert.equal(ledger.totalLoadedIntoAgentContext, 8);
assert.equal(inventory.derivedBeforeSpecOrSvgComparison, true);
const records = notes.records.map(verdict => {
  const record = evidence.records.find(record => record.id === verdict.id);
  for (const entry of [record.source, record.spec, record.svg, record.render,
    record.previewReport, record.originalSemanticAssertions, ...record.displayChecks]) verify(entry);
  const spec = JSON.parse(fs.readFileSync(record.spec.path, 'utf8'));
  const semantic = JSON.parse(fs.readFileSync(record.originalSemanticAssertions.path, 'utf8'));
  const ids = new Set(spec.objects.map(object => object.id));
  const assertions = new Set(spec.assertions.map(assertion => assertion.id));
  for (const mapping of verdict.sourceVerdict.independentInventoryToSpecMapping) {
    assert(inventory.records.find(r => r.id === verdict.id).groups
      .some(group => group.id === mapping.independentGroup));
    for (const id of mapping.specInventoryGroups) assert(spec.source.inventory.some(g => g.id === id));
    for (const id of mapping.keyObjectIds) assert(ids.has(id));
    for (const id of mapping.keyAssertionIds) assert(assertions.has(id));
    for (const id of mapping.originalSemanticReceiptTests) {
      assert(semantic.tests.some(t => t.id === id && t.status === 'pass'));
    }
  }
  return {
    ...verdict,
    ...record,
    independentSourceInventory: inventory.records.find(r => r.id === verdict.id),
    sourceInventoryReport: bind('source-inventory.json'),
    actualImageLedgerIndices: ledger.loads.filter(r => r.figure === verdict.id).map(r => r.index),
    firstIndependentReview: true,
    promotableCandidateForParentInstall: true,
    promotionApproved: false,
  };
});
const report = {
  schema: 'd294/independent-first-modern-figure-review@1',
  batch: 'D294', ticket: 'STEMROBIN-181', cwd: root,
  status: 'pass', scope: ['fig-28', 'fig-29'],
  candidateOnly: true, formalReviewRecordWritten: false,
  reviewBasis: 'Source-first pixel inventory, full complete N18/N19 ZH/EN authority, unchanged current candidate specs/SVGs and independently viewed existing 640/331 previews.',
  sourceInventory: bind('source-inventory.json'),
  actualImageLedger: { ...bind('image-ledger.json'), ...ledger },
  bindingVerification: bind('bindings-verification.json'),
  reviewNotes: bind('review-notes.json'),
  d293Result: evidence.d293Result,
  d281AuthorFreeze: evidence.d281AuthorFreeze,
  uniqueHashBindingsVerified: evidence.verifiedBindings.length,
  historicalSharedInputDrift: evidence.historicalInputDrift,
  records,
  limitations: notes.limitations,
  operations: {
    actualImagesOpened: 8, sourceImagesOpened: 2, existingSourceCropsOpened: 2,
    full640PreviewsOpened: 2, mobile331PreviewsOpened: 2,
    imageReopens: 0, nativeStageReruns: 0, geometryRerenders: 0,
    newScreenshots: 0, browserStarts: 0, contentRepairs: 0,
    paidCalls: 0, reviewAt1Writes: 0, canonicalOrSharedWrites: 0,
    databaseWrites: 0, publicationActions: 0, gitActions: 0,
    capabilitiesInvoked: 0, peerMessages: 0,
    localBindingAuditDevelopmentRuns: 6,
    localAuditFailures: [
      'Historical N18 English shared-template byte hash drift; classified by full normalized nonfigure comparison as whitespace only.',
      'Canonical source path differs from original scratch copy; both source PNG hashes verified identical.',
      'Two audit attempts used an overbroad all-node paint predicate; hidden construction nodes and semantic context-stroke inheritance then distinguished.',
      'XML text-node-only comparison omitted separate vector-accent paths; original label metadata and explicit accent paths then verified.'
    ],
    boundary: 'Only this owned review directory was written; local audit-script corrections were not content repairs or reruns of passed native stages.'
  }
};
const reportBinding = write('report.json', report);
const selections = records.map(record => write(`${record.id}.selection.json`, {
  schema: 'd294/parent-install-figure-selection@1',
  batch: 'D294', figure: record.id, mode: 'deterministic',
  status: 'pass', candidateOnly: true, promotionApproved: false,
  spec: record.spec, svg: record.svg, render: record.render,
  reviewReport: { ...reportBinding, recordId: record.id },
  source: record.source,
  previewReport: record.previewReport,
  independentSourceInventory: bind('source-inventory.json'),
  imageLedger: bind('image-ledger.json'),
  instructions: 'Parent may install this exact hash-bound candidate. This selection is not a review@1 record. Durable-path promotion, any authority rebinding, formal review recording and final lesson/product acceptance remain parent-owned.',
}));
const result = write('result.json', {
  batch: 'D294', status: 'pass', report: reportBinding, selections,
  records: records.map(r => ({ id: r.id, status: r.status,
    sourceVerdict: r.sourceVerdict.status, mathematicalVerdict: r.mathematicalVerdict.status,
    visualVerdict: r.visualVerdict.status, culturalVerdict: r.culturalVerdict.status,
    spec: r.spec, svg: r.svg, render: r.render, reviewReport: reportBinding })),
  actualImagesOpened: 8, nativeStageReruns: 0, contentRepairs: 0,
  reviewAt1Writes: 0, canonicalOrSharedWrites: 0,
});
console.log(JSON.stringify({ status: 'pass', report: reportBinding, selections, result }));
