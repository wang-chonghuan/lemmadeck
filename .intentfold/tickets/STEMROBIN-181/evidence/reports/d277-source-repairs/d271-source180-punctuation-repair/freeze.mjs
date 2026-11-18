import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const local = p => read(path.join(out, p))
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const bindings = local('input-bindings.json')
const receipt = local('native/0180/receipt.json')
const finding = bindings.originalFinding
for (const input of [...bindings.contractFiles, ...bindings.preservedOriginalFiles]) assert.equal(hash(input.path), input.sha256)
assert.equal(hash(bindings.originalFreeze.path), bindings.originalFreeze.sha256)
assert.equal(hash(bindings.independentReview.path), bindings.independentReview.sha256)
const folder = path.join(out, 'source/10p/pages/0180')
const current = read(path.join(folder, 'page.json'))
const original = read(bindings.originalPage.path)
const originalMd = bindings.copies.find(c => c.input.path.endsWith('/page.md')).input
const expectedMd = fs.readFileSync(originalMd.path, 'utf8').replace(finding.actual, finding.profileExpected)
assert.equal(fs.readFileSync(path.join(folder, 'page.md'), 'utf8'), expectedMd)
const expectedJson = structuredClone(original)
expectedJson.blocks[0].lines[2] = original.blocks[0].lines[2].replace(finding.actual, finding.profileExpected)
assert.deepEqual(current, expectedJson)
const audit = read(path.join(folder, 'audit.json'))
const originalAudit = bindings.copies.find(c => c.input.path.endsWith('/audit.json')).input
assert.equal(hash(path.join(folder, 'audit.json')), originalAudit.sha256)
assert.equal(audit.lines_printed, 27)
assert.equal(audit.lines_md, 27)
assert.equal(audit.errors.length, 0)
assert.equal(audit.normalizations.length, 0)
assert.deepEqual(current.meta.figures, [])
assert.deepEqual(current.meta.notes, original.meta.notes)
assert.equal(receipt.exitCode, 0)
assert.equal(receipt.finalizeCalls, 1)
assert.equal(receipt.vectorizeCalls, 0)
assert.equal(receipt.prepareCalls, 0)
assert.equal(receipt.reruns, 0)
for (const artifact of [receipt.stdout, receipt.stderr, receipt.repairedBeforeFinalize, receipt.repairedAfterFinalize]) {
  assert.equal(hash(artifact.path), artifact.sha256)
}
const unchangedCopyRecords = bindings.copies.filter(c => !c.input.path.includes('/source/'))
for (const copy of unchangedCopyRecords) assert.equal(hash(copy.candidateInitialCopy.path), copy.input.sha256)
const typographyRanges = []
for (const note of current.meta.notes) {
  if (!['bold', 'italic', 'math-typography'].includes(note.type)) continue
  const ranges = note.ranges || [{
    block: note.block, line: note.line_range[0], text: note.text,
    character_range_1based_inclusive: note.character_range_1based_inclusive,
  }]
  for (const range of ranges) {
    assert(!(range.block === 'p0180#1' && range.line === 3))
    const block = current.blocks[Number(range.block.split('#')[1]) - 1]
    const [start, end] = range.character_range_1based_inclusive
    assert.equal(block.lines[range.line - 1].slice(start - 1, end), range.text)
    typographyRanges.push({ ...range, matched: true, adjustment: 'NONE-UNCHANGED' })
  }
}
const boundaryFlags = current.blocks.map((b, i) => ({
  ref: `p0180#${i + 1}`, kind: b.kind, label: b.label,
  cont: b.cont, open: b.open, samerow: b.samerow, box: b.box,
  owner_exercise: b.owner_exercise,
}))
assert.deepEqual(boundaryFlags, original.blocks.map((b, i) => ({
  ref: `p0180#${i + 1}`, kind: b.kind, label: b.label,
  cont: b.cont, open: b.open, samerow: b.samerow, box: b.box,
  owner_exercise: b.owner_exercise,
})))
const opens = local('actual-opens.json')
assert.equal(opens.budget.cumulativeContextImages, 24)
assert.equal(opens.budget.newImages, 0)
assert.deepEqual(opens.opens, [])
const oldLine = original.blocks[0].lines[2]
const newLine = current.blocks[0].lines[2]
const changeStart = [...finding.actual].indexOf('，') + 1
assert.equal(changeStart, finding.character1Based)
const status = 'AUTHOR-REPAIRED-NATIVE-PASS-AFFECTED-INDEPENDENT-REVIEW-PENDING'
save('affected.json', {
  schema: 'bounded-source180-punctuation-repair-affected@1', ticket: 'STEMROBIN-181',
  role: 'Original d268 author, not independent reviewer', status,
  originalFreeze: bindings.originalFreeze, originalIndependentReview: bindings.independentReview,
  inputBindings: bound(path.join(out, 'input-bindings.json')),
  originalFAIL: {
    findingId: finding.id, originalReviewSOURCE180: 'FAIL',
    findingUnmodified: finding, historicalFAILRetained: true,
  },
  soleChange: {
    id: finding.id, page: 180, ref: 'p0180#1', blockLine: 3, printedRow: 3,
    pointer: '/blocks/0/lines/2', original: finding.actual, current: finding.profileExpected,
    originalFullLine: oldLine, currentFullLine: newLine,
    originalCharacterRange1BasedInclusive: [changeStart, changeStart],
    currentCharacterRange1BasedInclusive: [changeStart, changeStart + 1],
    originalCharacters: '，', currentCharacters: '. ',
    lineCodepointLengthDelta: [...newLine].length - [...oldLine].length,
    lineUTF8ByteLengthDelta: Buffer.byteLength(newLine) - Buffer.byteLength(oldLine),
    basis: 'Only d270 S180-F001 profileExpected; no new visual observation or semantic re-review.',
    authorRepairApplied: true, independentResolutionClaimed: false,
  },
  mechanicalInvariants: {
    pageMdEqualsOriginalWithOnlyTheSpecifiedReplacement: true,
    pageJsonEqualsOriginalWithOnlyTheSpecifiedPointerChange: true,
    allOther26PrintedLinesUnchanged: true,
    affectedLineSuffixAndAllOtherCharactersUnchanged: true,
    metaAndAllNotesExactlyUnchanged: true,
    notesRangeAdjustments: [],
    notesRangeAdjustmentReason: 'The +1 character change is only p0180#1 line3; no typography range targets that line. All block-local ranges in other lines stay identical.',
    typographyRangeCount: typographyRanges.length, typographyRanges,
    figCountBefore: 0, figCountAfter: 0,
    boundariesCopy: bound(path.join(out, 'boundaries.json')), boundaryFlagsExactlyUnchanged: true,
    boundaryFlags, originalAuditByteIdentical: true,
    linesPrintedBefore: 27, linesPrintedAfter: 27, linesMdBefore: 27, linesMdAfter: 27,
    nativeNormalizations: [], workInputCopiesByteIdentical: true,
    workInputs: unchangedCopyRecords.map(c => bound(c.candidateInitialCopy.path)),
    checksAreMechanicalNotIndependentSOURCEPASS: true,
  },
  candidate: {
    pageMd: bound(path.join(folder, 'page.md')), pageJson: bound(path.join(folder, 'page.json')),
    audit: bound(path.join(folder, 'audit.json')),
  },
  nativeReceipt: bound(path.join(out, 'native/0180/receipt.json')),
  native: {
    finalizeCalls: 1, finalizeExitCode: 0, physicalPages: [180],
    prepareCalls: 0, vectorizeCalls: 0, assembleCalls: 0,
    renderCalls: 0, reruns: 0, printedLines: 27, mdLines: 27,
  },
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  imageBudget: {
    inheritedImages: 24, newImages: 0, cumulativeSameAgentContextImages: 24,
    maximum: 24, reset: false, remainingImages: 0, check: '24 + 0 = 24 / 24',
  },
  pending: {
    affectedIndependentSOURCE180Review: 'PENDING-S180-F001-ONLY',
    originalIndependentChecksOutsideFinding: 'INHERITED-UNCHANGED-NOT-REVIEWED-AGAIN',
    SOURCE181: 'HOLD-NOT-OBSERVED-NOT-GENERATED',
    RAW137: 'HOLD-REFERENCED-NOT-OBSERVED-NOT-GENERATED',
    n69Complete: 'HOLD-OPEN-RIGHT-BOUNDARY',
    wholeCardPASS: false,
  },
  preservation: {
    originalD268AllFrozenArtifactsAndFreezeHashesUnchanged: true,
    originalD270AllFileHashesUnchanged: true,
    preservedOriginalFilesChecked: bindings.preservedOriginalFiles.length,
    historicalFAILHOLDSAndPaidBytesPreserved: true, writesOnlyNewD271: true,
    canonicalIndexMeterStableSkillsDBGitAppTouched: false,
    newAgentsWorkersWorktreesBranchesExternalPaidCalls: false,
    noExistingProductOverwritten: true,
  },
  independentSOURCE180PASS: false, RAW137PASS: false, wholeCardPASS: false,
})
const artifacts = []
function walk(folderPath) {
  for (const entry of fs.readdirSync(folderPath, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(folderPath, entry.name)
    assert(!entry.isSymbolicLink())
    if (entry.isDirectory()) walk(p)
    else artifacts.push(bound(p))
  }
}
walk(out)
save('author-freeze.json', {
  schema: 'bounded-source180-punctuation-repair-freeze@1',
  ticket: 'STEMROBIN-181', role: 'Original d268 author repair, not independent review',
  status, frozenUtc: new Date().toISOString(), writeDomain: out,
  immutablePolicy: 'Create once and preserve all bytes; no repairs to any old frozen files.',
  parentAuthorFreeze: bindings.originalFreeze, findingSource: bindings.independentReview,
  findingId: finding.id, artifacts,
  affected: bound(path.join(out, 'affected.json')),
  nativeReceipt: bound(path.join(out, 'native/0180/receipt.json')),
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  candidate: {
    pageMd: bound(path.join(folder, 'page.md')),
    pageJson: bound(path.join(folder, 'page.json')),
    audit: bound(path.join(folder, 'audit.json')),
  },
  finalizeCalls: 1, finalizeExitCode: 0, vectorizeCalls: 0, prepareCalls: 0,
  linesPrinted: 27, linesMd: 27, actualFigures: 0,
  imageBudget: { inheritedImages: 24, newImages: 0, cumulativeSameAgentContextImages: 24, reset: false, remaining: 0 },
  affectedIndependentReview: 'PENDING', oldFAILRetained: true,
  SOURCE181Generated: false, RAW137Generated: false,
  independentSOURCE180PASS: false, RAW137PASS: false, wholeCardPASS: false,
})
for (const artifact of artifacts) {
  assert.equal(hash(artifact.path), artifact.sha256)
  fs.chmodSync(artifact.path, 0o444)
}
fs.chmodSync(path.join(out, 'author-freeze.json'), 0o444)
console.log(JSON.stringify({
  status, freeze: bound(path.join(out, 'author-freeze.json')),
  affected: bound(path.join(out, 'affected.json')),
  nativeReceipt: bound(path.join(out, 'native/0180/receipt.json')),
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  newImages: 0, cumulativeImages: 24,
  onlyBodyChange: { original: finding.actual, current: finding.profileExpected },
  lines: '27/27', unaffectedNotesRangeCount: typographyRanges.length,
}, null, 2))
