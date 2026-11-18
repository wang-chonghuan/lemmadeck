import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const owned = '.intentfold/tickets/STEMROBIN-181/tmp/d578-n75-fig166167-first-modern-author'
const absoluteOwned = path.join(root, owned)
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const fileHash = file => hash(fs.readFileSync(path.join(root, file)))
const json = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const write = (relative, data) => {
  const target = path.join(absoluteOwned, relative)
  assert(target.startsWith(`${absoluteOwned}/`))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const receipt = (id, argv) => {
  const started = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), { cwd: root, encoding: 'utf8' })
  const stdout = result.stdout || ''
  const stderr = result.stderr || ''
  write(`commands/${id}.stdout.txt`, stdout)
  write(`commands/${id}.stderr.txt`, stderr)
  const record = {
    argv, cwd: root, started, finished: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    stdout: { path: `${owned}/commands/${id}.stdout.txt`, sha256: hash(stdout) },
    stderr: { path: `${owned}/commands/${id}.stderr.txt`, sha256: hash(stderr) },
  }
  write(`commands/${id}.receipt.json`, record)
  assert.equal(result.status, 0, `Input evidence command failed: ${id}`)
  return record
}

assert.equal(fs.existsSync(path.join(absoluteOwned, 'report.json')), false, 'Never replace an earlier report')
assert.equal(fileHash(`${owned}/source-inventory.json`), 'e18cf49eb625dcd0f1e99044837f7f0f5051e8a396cdd6baa36f55cef05e9ff0')
assert.equal(fs.statSync(path.join(absoluteOwned, 'source-inventory.json')).mode & 0o777, 0o444)

const manifestPath = '.intentfold/tickets/STEMROBIN-181/tmp/d572-n75-first-figure-contexts/manifest.json'
const reviewPath = '.intentfold/tickets/STEMROBIN-181/tmp/d568-n75-first-independent-text-review/report.json'
const manifest = json(manifestPath)
const bindings = [
  { name: 'context-manifest', path: manifestPath, sha256: '1181e47dc32d727dd8c83ddead74ca7c01f76d07e33b331b2de46ca491855936' },
  { name: 'inherited-text-review', path: reviewPath, sha256: '1f6feb01e70e2483b130643f338ac76a38e5430339bfc94563d4f92fa7e1f5ca' },
  { name: 'fullEN', ...manifest.fullEN },
  { name: 'fullZH', ...manifest.fullZH },
  ...manifest.contexts.filter(item => ['fig-166', 'fig-167'].includes(item.figure)).flatMap(item => [
    { name: `${item.figure}-context`, ...item.context },
    { name: `${item.figure}-source`, ...item.originalImage },
  ]),
]
assert.equal(bindings.length, 8)
for (const binding of bindings) assert.equal(fileHash(binding.path), binding.sha256, binding.name)
const inputBefore = bindings.map(binding => ({ ...binding, verifiedSHA256: fileHash(binding.path) }))
write('inputs-before.json', inputBefore)
receipt('bound-input-sha256', ['shasum', '-a', '256', ...bindings.map(item => item.path)])
receipt('source-pixel-dimensions', ['sips', '-g', 'pixelWidth', '-g', 'pixelHeight',
  ...bindings.filter(item => item.name.endsWith('-source')).map(item => item.path)])
receipt('routing-spec-qualitygate', ['cat',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md'])

for (const binding of bindings.filter(item => !item.name.endsWith('-source'))) {
  const extension = '.json'
  const copy = `inputs/${binding.name}${extension}`
  fs.mkdirSync(path.join(absoluteOwned, 'inputs'), { recursive: true })
  fs.copyFileSync(path.join(root, binding.path), path.join(absoluteOwned, copy), fs.constants.COPYFILE_EXCL)
  assert.equal(fileHash(`${owned}/${copy}`), binding.sha256)
  binding.frozenCopy = { path: `${owned}/${copy}`, sha256: binding.sha256 }
}
for (const [lang, binding] of [
  ['en', bindings.find(item => item.name === 'fullEN')],
  ['zh', bindings.find(item => item.name === 'fullZH')],
]) {
  const lesson = json(binding.path)
  assert.equal(lesson.prose.length, 45)
  const complete = lesson.prose.map((block, index) => ({
    index, kind: block.kind, id: block.id, text: block.text,
  }))
  write(`inputs/${lang}-complete-prose.json`, {
    language: lang, lesson: lesson.id, fullFile: binding,
    completeProse: complete, blockCount: complete.length,
    proseSHA256: hash(JSON.stringify(complete)),
    scope: 'Authoritative context consumption only; inherited SCI/ZHEN are not reviewed again.',
  })
}
write('input-bindings.json', bindings)
const inputAfter = inputBefore.map(binding => ({
  ...binding, afterSHA256: fileHash(binding.path),
  unchanged: fileHash(binding.path) === binding.verifiedSHA256,
}))
assert(inputAfter.every(item => item.unchanged))
write('inputs-after.json', inputAfter)
const decision = json(`${owned}/routing-decision.json`)
const ledger = json(`${owned}/observation-ledger.json`)
assert.equal(decision.imageOpens.batch, 2)
assert.equal(ledger.events.filter(event => event.imageOpen).length, 2)
assert(decision.figures.every(item => item.nativeStatus === 'HOLD' && item.spec === null && item.repairUsed === 0))

const report = {
  schema: 'd578/first-modern-author-report@1',
  batch: 'd578-n75-fig166167-first-modern-author',
  ticket: 'STEMROBIN-181',
  card: 'phy10-c2-s2-n75',
  status: 'HOLD-BEFORE-GENERATION',
  ownership: { root: owned, sharedOriginalBranch: true, writesOutsideOwnedDirectory: 0 },
  shortLivedBatch: true,
  inventory: decision.independentInventory,
  routingDecision: {
    path: `${owned}/routing-decision.json`,
    sha256: fileHash(`${owned}/routing-decision.json`),
  },
  observationLedger: {
    path: `${owned}/observation-ledger.json`,
    sha256: fileHash(`${owned}/observation-ledger.json`),
  },
  inputs: bindings,
  completeAuthoritativeTextConsumed: { EN: true, ZH: true, blocksEach: 45, fullFilesHashBound: true },
  SCI: 'PASS-INHERITED-NOT-REPEATED',
  ZHEN: 'PASS-INHERITED-NOT-REPEATED',
  figures: decision.figures.map(figure => ({
    ...figure,
    source: bindings.find(item => item.name === `${figure.figure}-source`),
    context: bindings.find(item => item.name === `${figure.figure}-context`),
    hashes: { spec: null, svg: null, render: null, nativeFullResolution: null, actual342: null },
    commandEvidence: {
      nativeValidator: 'NOT-RUN-HOLD-BEFORE-SPEC',
      nativeRender: 'NOT-RUN-HOLD-BEFORE-GENERATION',
      firstFAIL: null, beforeRepair: null, afterRepair: null,
    },
    outputComplete: false,
    assertionCoverage: 'UNRESOLVED-MARK-GROUP-NOT-FALSELY-MAPPED',
  })),
  requestedDisplayContractIfUnblocked: decision.requestedDisplayContractIfUnblocked,
  executedNativeValidatorCount: 0,
  executedNativeRenderCount: 0,
  noIdenticalDeterminismRerender: true,
  firstNativeFAIL: null,
  repairsUsed: 0,
  imageOpens: decision.imageOpens,
  finalNativeFullResolutionInspections: 0,
  actual342Inspections: 0,
  browser: ledger.browser,
  FIG: 'PENDING-NOT-SELF-SIGNED',
  DISPLAY: 'PENDING-NOT-SELF-SIGNED',
  fullCard: 'PENDING-NOT-SELF-SIGNED',
  reviewAt1RecordsCreated: 0,
  promotedAssets: 0,
  historicalFAILHOLDPreserved: true,
  historicalReviewReplayed: false,
  authoritativeInputsUnchanged: true,
  inputPreservationEvidence: {
    before: { path: `${owned}/inputs-before.json`, sha256: fileHash(`${owned}/inputs-before.json`) },
    after: { path: `${owned}/inputs-after.json`, sha256: fileHash(`${owned}/inputs-after.json`) },
  },
  prohibitedActions: {
    gitCommands: 0, DBConnections: 0, deploys: 0, paidCalls: 0,
    canonicalEdits: 0, generatedSVGHandEdits: 0, newWorkers: 0,
    newWorktrees: 0, newBranches: 0, parentImagePayloads: 0,
  },
  endState: 'Bounded author batch ended at HOLD; no permanent or replacement worker.',
}
write('report.json', report)
receipt('end-input-sha256', ['shasum', '-a', '256', ...bindings.map(item => item.path)])
const collect = directory => fs.readdirSync(directory, { withFileTypes: true })
  .sort((a, b) => a.name.localeCompare(b.name))
  .flatMap(entry => {
    const file = path.join(directory, entry.name)
    assert(!entry.isSymbolicLink())
    return entry.isDirectory() ? collect(file) : [file]
  })
const payloadFiles = collect(absoluteOwned)
for (const file of payloadFiles) fs.chmodSync(file, 0o444)
const freeze = {
  schema: 'd578/author-freeze@1',
  status: 'AUTHOR-FREEZE-HOLD-BEFORE-GENERATION',
  ownedRoot: owned,
  allPayloadFilesMode: '0444',
  files: payloadFiles.map(file => ({
    path: path.relative(root, file),
    sha256: hash(fs.readFileSync(file)),
    bytes: fs.statSync(file).size,
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
  })),
  selfHashRule: 'This manifest is excluded from its own file list. Its complete SHA-256 is returned separately.',
  sourceInventoryFrozenBeforePriorContext: true,
  nativeStatus: { 'fig-166': 'HOLD', 'fig-167': 'HOLD' },
  imageOpens: 2,
  noMoreBatchWork: true,
}
write('author-freeze.json', freeze)
fs.chmodSync(path.join(absoluteOwned, 'author-freeze.json'), 0o444)
for (const item of freeze.files) {
  assert.equal(fileHash(item.path), item.sha256)
  assert.equal(fs.statSync(path.join(root, item.path)).mode & 0o777, 0o444)
}
assert.equal(fs.statSync(path.join(absoluteOwned, 'author-freeze.json')).mode & 0o777, 0o444)
console.log(JSON.stringify({
  status: report.status,
  nativeStatus: freeze.nativeStatus,
  report: { path: `${root}/${owned}/report.json`, sha256: fileHash(`${owned}/report.json`) },
  freeze: { path: `${root}/${owned}/author-freeze.json`, sha256: fileHash(`${owned}/author-freeze.json`) },
  frozenPayloadFiles: freeze.files.length,
  allOwnedFiles0444: true,
  actualImageOpens: 2,
  browserLaunched: false,
}, null, 2))
