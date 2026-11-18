import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const local = p => read(path.join(out, p))
const save = (p, data) => fs.writeFileSync(path.join(out, p), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const bindings = local('input-bindings.json')
for (const input of [...bindings.preservedInputs, ...bindings.contractFiles, bindings.toc]) {
  assert.equal(hash(input.path), input.sha256)
}
const original = read(bindings.originalPage.path)
const originalMd = bindings.copies.find(c => c.input.path.endsWith('/page.md')).input
const originalText = fs.readFileSync(originalMd.path, 'utf8')
const beforeHead = '<!-- exhead -->\n练 习 6'
const afterHead = '<!-- h3 -->\n练 习 6'
assert.equal(originalText.split(beforeHead).length, 2)
const expectedMd = originalText.replace(beforeHead, afterHead)
const folder = path.join(out, 'source/10p/pages/0179')
const md = path.join(folder, 'page.md')
assert.equal(fs.readFileSync(md, 'utf8'), expectedMd)
for (const copy of bindings.copies) {
  if (copy.candidateInitialCopy.path !== md) assert.equal(hash(copy.candidateInitialCopy.path), copy.input.sha256)
}
const opens = local('actual-opens.json')
assert.equal(opens.budget.cumulativeContextImages, 24)
assert.equal(opens.budget.newImages, 0)
assert.deepEqual(opens.opens, [])
const nativeDir = path.join(out, 'native/0179')
fs.mkdirSync(nativeDir, { recursive: true })
const snapshot = path.join(nativeDir, 'classified-before-finalize.md')
fs.copyFileSync(md, snapshot, fs.constants.COPYFILE_EXCL)
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const tool = path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
const argv = [
  '-B', tool, 'finalize', '--book', '10p', '--page', '179',
  '--root', path.join(out, 'source'), '--work', path.join(out, 'work'),
]
const temp = path.join(out, 'native-tmp')
fs.mkdirSync(temp, { recursive: true })
const startedUtc = new Date().toISOString()
const proc = spawnSync(python, argv, {
  cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: temp },
})
const stdout = path.join(nativeDir, 'finalize.stdout.txt')
const stderr = path.join(nativeDir, 'finalize.stderr.txt')
fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
save('native/0179/receipt.json', {
  schema: 'bounded-source179-heading-classification-native@1',
  ticket: 'STEMROBIN-181', role: 'Original d260 author classification repair',
  command: [python, ...argv], startedUtc, finishedUtc: new Date().toISOString(),
  exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
  stdout: bound(stdout), stderr: bound(stderr), physicalPages: [179],
  finalizeCalls: 1, prepareCalls: 0, vectorizeCalls: 0,
  assembleCalls: 0, renderCalls: 0, reruns: 0,
  classifiedBeforeFinalize: bound(snapshot), classifiedAfterFinalize: bound(md),
  newImageOpens: 0, independentSOURCE179PASS: false, wholeCardPASS: false,
})
console.log(JSON.stringify({ nativeExitCode: proc.status, stdout: proc.stdout, stderr: proc.stderr }, null, 2))
if (proc.status !== 0) {
  save('affected.json', {
    schema: 'bounded-source179-heading-classification-affected@1',
    status: 'HOLD-NATIVE-FAILURE', repair: bindings.soleChange,
    nativeReceipt: bound(path.join(nativeDir, 'receipt.json')),
    originalFreeze: bindings.originalFreeze, newImageOpens: 0,
    cumulativeImages: 24, retryPermitted: false, wholeCardPASS: false,
  })
} else {
  const current = read(path.join(folder, 'page.json'))
  const expected = structuredClone(original)
  expected.blocks[9].kind = 'h3'
  assert.deepEqual(current, expected)
  assert.equal(fs.readFileSync(md, 'utf8'), expectedMd)
  const audit = read(path.join(folder, 'audit.json'))
  assert.equal(audit.lines_printed, 24)
  assert.equal(audit.lines_md, 24)
  assert.equal(audit.errors.length, 0)
  assert.equal(audit.normalizations.length, 0)
  const originalAudit = bindings.copies.find(c => c.input.path.endsWith('/audit.json')).input
  assert.equal(hash(path.join(folder, 'audit.json')), originalAudit.sha256)
  const unchangedBlocks = original.blocks.flatMap((before, index) => {
    if (index === 9) return []
    const beforeBytes = Buffer.from(JSON.stringify(before))
    const afterBytes = Buffer.from(JSON.stringify(current.blocks[index]))
    assert(beforeBytes.equals(afterBytes))
    return [{
      refBefore: `p0179#${index + 1}`, refAfter: `p0179#${index + 1}`,
      kind: before.kind, byteEqual: true,
      nativeJSONBlockSHA256: crypto.createHash('sha256').update(beforeBytes).digest('hex'),
    }]
  })
  assert.deepEqual(current.meta, original.meta)
  assert.deepEqual(current.blocks[9].lines, original.blocks[9].lines)
  const beforeWithoutKind = { ...original.blocks[9] }
  const afterWithoutKind = { ...current.blocks[9] }
  delete beforeWithoutKind.kind
  delete afterWithoutKind.kind
  assert.deepEqual(afterWithoutKind, beforeWithoutKind)
  const unchangedWork = bindings.copies.filter(c => c.input.path.includes('/work/'))
  for (const copy of unchangedWork) assert.equal(hash(copy.candidateInitialCopy.path), copy.input.sha256)
  for (const input of [...bindings.preservedInputs, ...bindings.contractFiles, bindings.toc]) {
    assert.equal(hash(input.path), input.sha256)
  }
  save('affected.json', {
    schema: 'bounded-source179-heading-classification-affected@1',
    ticket: 'STEMROBIN-181',
    role: 'Original d260 author; first object-classification repair, not SCI or independent source review',
    status: 'AUTHOR-CLASSIFICATION-REPAIRED-NATIVE-PASS-AFFECTED-REVIEW-PENDING',
    originalFreeze: bindings.originalFreeze, inheritedTextTypographyReview: bindings.existingIndependentTextReview,
    failedFirstAssemble: bindings.failedAssemble, failedFirstAssembleRetained: true,
    inputBindings: bound(path.join(out, 'input-bindings.json')),
    basis: {
      toc: bindings.toc, pointer: bindings.tocPointer, item: bindings.tocItem,
      printedPage: 169, previouslyConfirmedHeading: '练 习 6',
      priorAssembleExitCode: 1, priorAssembleHadSevenQuestionsAndDuplicate123: true,
      noNewPixelObservationOrSCICheck: true,
    },
    soleChange: {
      refBefore: 'p0179#10', refAfter: 'p0179#10', pointer: '/blocks/9/kind',
      kindBefore: 'exhead', kindAfter: 'h3',
      mdHeaderBefore: '<!-- exhead -->', mdHeaderAfter: '<!-- h3 -->',
      titleBefore: '练 习 6', titleAfter: '练 习 6',
      originalBlock: original.blocks[9], currentBlock: current.blocks[9],
      headingBodyAndAllOtherTargetFieldsExactlyUnchanged: true,
      wholeMdByteEqualExceptSingleHeaderReplacement: true,
      wholePageJsonEqualExceptSingleKindField: true,
    },
    unaffected: {
      otherBlocks: unchangedBlocks, otherBlockCount: 13,
      byteEqualityConvention: 'UTF-8 bytes of each unchanged native JSON block serialized with JSON.stringify; whole original MD is also byte-compared after exactly one header replacement.',
      all24PrintedBodyLinesByteIdentical: true,
      blockOrderAndAllDerivedRefsStable: true, allMetaNotesAndTypographyRangesByteIdentical: true,
      notesRangeAdjustments: [],
      formula67And15030OriginalSourceUnitsUnchanged: true,
      originalProblemHeadingP0179_5StillExhead: true,
      questionNumbersAndP0179_13OpenUnchanged: true,
      figCountBefore: 0, figCountAfter: 0,
      workCopiesUnchanged: unchangedWork.map(c => bound(c.candidateInitialCopy.path)),
      auditByteIdentical: true, linesPrinted: 24, linesMd: 24,
    },
    candidate: {
      pageMd: bound(md), pageJson: bound(path.join(folder, 'page.json')),
      audit: bound(path.join(folder, 'audit.json')),
    },
    nativeReceipt: bound(path.join(nativeDir, 'receipt.json')),
    native: { finalizeCalls: 1, finalizeExitCode: 0, prepareCalls: 0, vectorizeCalls: 0, assembleCalls: 0, reruns: 0 },
    actualOpens: bound(path.join(out, 'actual-opens.json')),
    imageBudget: { inheritedImages: 24, newImages: 0, cumulativeSameAgentContextImages: 24, reset: false, remaining: 0 },
    preservation: {
      d260FreezeAndAllFrozenArtifactsUnchanged: true, d267AllBytesUnchanged: true,
      d273OriginalFailureReceiptAndScriptUnchanged: true, d271FreezeAndAllArtifactsUnchanged: true,
      originalCanonicalFilesNotEdited: true, oldPASSFAILHOLDAndPaidOutputsPreserved: true,
      onlyNewD274Writes: true, stableSkillIndexMeterDBGitAppWrites: false,
      newAgentsWorkersWorktreesBranchesExternalPaidCalls: false,
    },
    affectedClassificationReview: 'PENDING',
    postRepairAssembleRun: false, postRepairAssemblePASSClaimed: false,
    SOURCE181Generated: false, RAW137Generated: false,
    independentSOURCE179PASS: false, newSCIReview: false, wholeCardPASS: false,
  })
}
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
const affected = local('affected.json')
save('author-freeze.json', {
  schema: 'bounded-source179-heading-classification-repair-freeze@1',
  ticket: 'STEMROBIN-181', role: 'Original d260 author classification repair',
  status: affected.status, frozenUtc: new Date().toISOString(), writeDomain: out,
  immutablePolicy: 'Create once; preserve original and repaired bytes.',
  originalAuthorFreeze: bindings.originalFreeze, inheritedReview: bindings.existingIndependentTextReview,
  completedD271Freeze: bindings.completedD271Freeze, artifacts,
  affected: bound(path.join(out, 'affected.json')),
  nativeReceipt: bound(path.join(nativeDir, 'receipt.json')),
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  candidatePageMd: bound(md), candidatePageJson: bound(path.join(folder, 'page.json')),
  finalizeCalls: 1, finalizeExitCode: proc.status, prepareCalls: 0, vectorizeCalls: 0, assembleCalls: 0,
  printedLines: affected.unaffected?.linesPrinted ?? null, mdLines: affected.unaffected?.linesMd ?? null,
  imageBudget: { inheritedImages: 24, newImages: 0, cumulativeSameAgentContextImages: 24, reset: false, remaining: 0 },
  affectedClassificationReview: 'PENDING', independentSOURCE179PASS: false,
  postRepairAssemblePASS: false, wholeCardPASS: false,
})
for (const artifact of artifacts) {
  assert.equal(hash(artifact.path), artifact.sha256)
  fs.chmodSync(artifact.path, 0o444)
}
fs.chmodSync(path.join(out, 'author-freeze.json'), 0o444)
console.log(JSON.stringify({
  status: affected.status, freeze: bound(path.join(out, 'author-freeze.json')),
  affected: bound(path.join(out, 'affected.json')),
  nativeReceipt: bound(path.join(nativeDir, 'receipt.json')),
  newImages: 0, cumulativeImages: 24,
}, null, 2))
process.exitCode = proc.status === 0 ? 0 : 1
