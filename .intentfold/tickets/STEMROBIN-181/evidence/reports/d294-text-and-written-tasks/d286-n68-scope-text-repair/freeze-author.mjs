import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { sectionBreakIndices } = require(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const local = p => read(path.join(out, p))
const artifact = p => bound(path.join(out, p))
const save = (name, value) => {
  const target = path.join(out, name)
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bound(target)
}
for (const name of ['exact-diff.json', 'change-register.json', 'report.json', 'author-freeze.json']) {
  assert(!fs.existsSync(path.join(out, name)), `Never overwrite ${name}`)
}
const binding = local('source-binding.json')
const proposals = local('boundary-proposals.json').proposals
const nativeCheck = local('local-text-check-initial/stdout.json')
const checkReceipt = local('local-text-check-initial/receipt.json')
assert.equal(nativeCheck.mechanicalStatus, 'MATCH')
assert.equal(nativeCheck.targets.length, 4)
assert.deepEqual(nativeCheck.errors, [])
assert.equal(checkReceipt.exitCode, 0)
const inputs = [
  binding.authorFreeze, binding.authorSourceBinding, binding.authorSCIPending,
  binding.review, binding.inheritedOpens, ...binding.contracts,
  ...binding.templates.map(item => item.original),
]
const recheckInputs = () => {
  for (const input of inputs) assert.equal(hash(input.path), input.sha256, input.path)
  for (const input of binding.templates.map(item => item.original)) {
    assert.equal(fs.statSync(input.path).mode & 0o777, 0o444)
  }
}
recheckInputs()
const changes = []
const languages = []
const diffReceipts = []
for (const language of ['zh', 'en']) {
  const originalInput = binding.templates.find(item => item.language === language && item.name === 'lesson').original
  const candidatePath = path.join(out, 'frozen/n68', language, 'lesson.template.json')
  const before = read(originalInput.path)
  const after = read(candidatePath)
  const expected = structuredClone(before)
  for (const target of binding.targets) {
    const proposal = proposals.find(item => item.language === language && item.finding === target.id)
    assert(proposal)
    assert.equal(hash(proposal.nativeStdout.path), proposal.nativeStdout.sha256)
    assert.equal(hash(proposal.receipt.path), proposal.receipt.sha256)
    assert.equal(read(proposal.receipt.path).exitCode, 0)
    assert.equal(proposal.nativeBoundary.before, proposal.originalBoundary.before)
    const boundaryIndex = before.section_breaks.findIndex(item =>
      item.before === proposal.originalBoundary.before && item.after === proposal.originalBoundary.after)
    assert(boundaryIndex >= 0)
    expected.prose[target.index].text = after.prose[target.index].text
    expected.section_breaks[boundaryIndex] = proposal.nativeBoundary
    assert.equal(after.prose[target.index].text, proposal.nativeBoundary.after)
    changes.push({
      finding: target.id, language, pointer: target.pointer,
      source_refs: before.prose[target.index].source_refs,
      source_text: before.prose[target.index].source_text,
      before: before.prose[target.index].text, after: after.prose[target.index].text,
      changeKind: 'HUMAN-AUTHORIZED-MODERN-PROSE-CONDITION-CLARIFICATION',
      intent: target.index === 1
        ? 'Finite-area ratio is the area-average illuminance; with uniform illumination it equals each local value.'
        : 'Sphere derivation uses a uniform point source having the same existing luminous intensity I in every direction.',
      formulasAndOriginalNumbersUnchanged: true, numeric_changes: [], errataRegistered: [],
      oldReviewStatus: 'HOLD-PRESERVED-IN-D284',
      currentDisposition: 'AUTHOR-REPAIR-CANDIDATE-AFFECTED-INDEPENDENT-REVIEW-PENDING',
      mechanicalBoundary: {
        pointer: `/section_breaks/${boundaryIndex}/after`,
        before: proposal.originalBoundary, after: proposal.nativeBoundary,
        nativeStdout: proposal.nativeStdout, receipt: proposal.receipt,
      },
    })
  }
  assert.deepEqual(after, expected, 'Only two prose texts and two native anchor after-strings may change')
  assert.deepEqual(after.prose[25], before.prose[25])
  assert.equal(after.prose[25].author_review.status, 'HOLD-UNIT-SCI')
  assert.deepEqual(after.source, before.source)
  assert.deepEqual(after.errata, before.errata)
  const resolved = sectionBreakIndices(after.prose, after.section_breaks)
  assert.equal(resolved.length, before.section_breaks.length)
  const previousLines = fs.readFileSync(originalInput.path, 'utf8').split('\n')
  const currentLines = fs.readFileSync(candidatePath, 'utf8').split('\n')
  assert.equal(previousLines.length, currentLines.length)
  const allowed = changes.filter(item => item.language === language)
    .flatMap(item => [
      { key: 'text', before: item.before, after: item.after },
      { key: 'after', before: item.mechanicalBoundary.before.after, after: item.mechanicalBoundary.after.after },
    ])
  const lineDiffs = []
  previousLines.forEach((line, index) => {
    if (line === currentLines[index]) return
    const parseLine = value => {
      const match = value.match(/^(\s*"(text|after)":\s*)(.*?)(,?)$/)
      assert(match, 'Any other changed byte is out of scope')
      return { prefix: match[1], key: match[2], value: JSON.parse(match[3]), suffix: match[4] }
    }
    const oldLine = parseLine(line)
    const newLine = parseLine(currentLines[index])
    assert.equal(oldLine.prefix, newLine.prefix)
    assert.equal(oldLine.suffix, newLine.suffix)
    assert(allowed.some(item => item.key === oldLine.key &&
      item.before === oldLine.value && item.after === newLine.value))
    lineDiffs.push({ line: index + 1, before: line, after: currentLines[index] })
  })
  assert.equal(lineDiffs.length, 4)
  const folder = path.join(out, 'diff', language)
  fs.mkdirSync(folder, { recursive: true })
  const command = ['diff', '-u', originalInput.path, candidatePath]
  const proc = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
  const stdout = path.join(folder, 'stdout.patch.txt')
  const stderr = path.join(folder, 'stderr.txt')
  fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
  const receipt = save(`diff/${language}/receipt.json`, {
    command, exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
    stdout: bound(stdout), stderr: bound(stderr),
    meaning: 'diff exit 1 reports expected file differences; it is not a failed content validator.',
    source: originalInput, candidate: bound(candidatePath), attempt: 1, newImages: 0,
  })
  assert.equal(proc.status, 1, 'Retain any unexpected native failure; no automatic retry')
  diffReceipts.push(receipt)
  for (const name of ['exercises', 'figures']) {
    const original = binding.templates.find(item => item.language === language && item.name === name).original
    assert.equal(hash(path.join(out, 'frozen/n68', language, `${name}.template.json`)), original.sha256)
  }
  languages.push({
    language, original: originalInput, candidate: bound(candidatePath),
    changedProsePointers: ['/prose/1/text', '/prose/5/text'],
    mechanicalAnchorUpdates: allowed.filter(item => item.key === 'after').length,
    changedLines: lineDiffs, allOtherRawLinesByteEqual: true,
    unchangedRawLines: previousLines.length - lineDiffs.length,
    otherProseBlocksSourceSnapshotErrataAndAuthorMetadataUnchanged: true,
    prose25UnitHOLDUnchanged: true, exercisesAndFiguresByteIdentical: true,
    nativeSectionBreakIndices: resolved,
  })
}
assert.equal(changes.length, 4)
const exactDiff = save('exact-diff.json', {
  schema: 'bounded-n68-two-prose-scope-repair-exact-diff@1',
  substantiveLanguageUnits: 4, mechanicalAnchorUpdates: 4, languages,
  sourceAndAllOtherRawBytesUnchanged: true, diffReceipts,
})
const register = save('change-register.json', {
  schema: 'bounded-n68-two-prose-scope-repair-change-register@1',
  ticket: 'STEMROBIN-181', role: 'Local repair author only',
  sourceBinding: artifact('source-binding.json'), review: binding.review,
  changes, exactDiff, oldHOLDRecordsEditedOrCleared: false,
  untouchedUnitHolds: binding.unrepairedReviewHolds,
  formulaOrNumberChanges: [], sourceErrataChanges: [], t5Changed: false,
  substantiveLanguageUnits: 4, independentPASS: false, wholeCardPASS: false,
})
const candidates = binding.templates.map(({ language, name, original }) => ({
  language, name, original, candidate: artifact(`frozen/n68/${language}/${name}.template.json`),
  changed: name === 'lesson',
}))
const report = save('report.json', {
  schema: 'bounded-n68-two-prose-scope-local-author-repair-report@1',
  ticket: 'STEMROBIN-181', batch: 'D033',
  status: 'AUTHOR-REPAIR-FROZEN-AFFECTED-INDEPENDENT-REVIEW-PENDING',
  role: 'Same d283 author, not an independent SCI/ZHEN reviewer',
  sourceBinding: artifact('source-binding.json'), review: binding.review,
  originalAuthorFreeze: binding.authorFreeze,
  scope: { card: 'phy10-c2-s2-n68', findings: binding.targets, languages: ['zh', 'en'], substantiveLanguageUnits: 4, mechanicalBoundaryUpdates: 4 },
  candidates, changeRegister: register, exactDiff,
  checks: {
    status: 'LOCAL-MECHANICAL-MATCH-NOT-SCI-OR-ZHEN-PASS',
    textUnitsChecked: 4, report: artifact('local-text-check-initial/stdout.json'),
    receipt: artifact('local-text-check-initial/receipt.json'), nativeHelperExitCode: 0,
    sourceSnapshotsRefsPagesErrataAndAllNonTargetBytesUnchanged: true,
    originalInputsSHA256Rechecked: inputs.length,
    proseFlow: ['zh', 'en'].map(language => ({
      language, receipt: artifact(`prose-flow/${language}/receipt.json`), exitCode: 0,
      stdout: artifact(`prose-flow/${language}/stdout.txt`), commandRuns: 1,
    })),
    finalAnchorsResolvedByExistingSectionBreakIndicesHelper: true,
    fullPassedTextSemanticReviewRepeated: false,
    nativeFailuresThisBatch: [], priorD283FailureEvidenceUnchanged: true,
    failureRetentionPolicy: 'Every initial output uses exclusive-create receipts; any real failure remains recorded and is not silently retried.',
  },
  holdDisposition: {
    oldD284FindingsRemainImmutableHOLD: true,
    repairedF01F02: 'CONDITIONS-EXPLICIT-IN-AUTHOR-CANDIDATE-AFFECTED-SCI-ZHEN-PENDING',
    untouched: binding.unrepairedReviewHolds,
    n68Prose25AndT5: 'NOT-EDITED-UNIT-HOLDS-NOT-RESOLVED',
    unitReplacementOrErrataRegistration: false,
  },
  pendingStages: ['affected-independent-SCI-ZHEN', 'modern-fig135-fig136-workflow', 'complete-DISPLAY', 'formal-answers-and-review', 'formal-choices-and-review'],
  actualOpens: artifact('actual-opens.json'),
  activity: {
    inheritedImages: 24, newImageOpens: 0, cumulativeImages: 24, maximum: 24, reset: false,
    sourcePrepareAssembleAdaptPrepareFinalizeVectorizeRender: 0, adaptFinalize: 0,
    screenshots: 0, paidCalls: 0, originalFrozenByteChanges: 0,
    canonicalIndexMeterStableSkillsAppDBGitDeploymentChanged: false,
    agentsWorkersWorktreesOrBranchesCreated: false,
  },
  independentPASS: false, wholeCardPASS: false, publicationReady: false,
})
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const p = path.join(directory, entry.name)
    assert(!entry.isSymbolicLink())
    return entry.isDirectory() ? files(p) : [p]
  }).sort()
}
recheckInputs()
const artifacts = files(out).map(bound)
const freeze = save('author-freeze.json', {
  schema: 'bounded-n68-two-prose-scope-local-author-repair-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D033', frozenAt: new Date().toISOString(),
  status: 'AUTHOR-REPAIR-FROZEN-AFFECTED-INDEPENDENT-REVIEW-PENDING',
  role: 'Original d283 author, not independent reviewer',
  originalAuthorFreeze: binding.authorFreeze, review: binding.review,
  report, sourceBinding: artifact('source-binding.json'), changeRegister: register, exactDiff,
  actualOpens: artifact('actual-opens.json'), candidates, artifacts,
  images: { inherited: 24, new: 0, cumulative: 24, maximum: 24, reset: false },
  oldFAILAndHOLDUnchanged: true, independentPASS: false, wholeCardPASS: false, publicationReady: false,
  immutable: 'All listed owned files and this freeze are chmod 0444; future changes require a new directory. Self-hash is returned externally.',
})
for (const item of [...artifacts, freeze]) {
  assert.equal(hash(item.path), item.sha256)
  fs.chmodSync(item.path, 0o444)
}
recheckInputs()
console.log(JSON.stringify({
  status: 'AUTHOR-REPAIR-FROZEN', freeze, report, changeRegister: register, exactDiff,
  substantiveLanguageUnits: 4, mechanicalAnchorUpdates: 4,
  nativeTextCheckExitCode: 0, proseFlowExitCodes: [0, 0],
  frozenFiles: artifacts.length + 1, newImages: 0, cumulativeImages: 24,
  affectedIndependentReview: 'PENDING', oldHOLDUnchanged: true, wholeCardPASS: false,
}, null, 2))
