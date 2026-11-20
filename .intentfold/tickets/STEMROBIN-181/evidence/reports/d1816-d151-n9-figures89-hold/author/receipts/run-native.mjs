import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const evidence = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d151-n9-figures89-author')
const output = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d151/figures')
const frozenSha = 'f2c6bd04fbbb13da4b33e153c66e4268e49b86d3982cfeaee9e307f1a80617f4'
assert.equal(process.cwd(), cwd, 'Every invocation must use the authorized exact cwd.')

const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
function binding(file) {
  const absolute = path.resolve(cwd, file)
  const bytes = fs.readFileSync(absolute)
  return { path: absolute, bytes: bytes.length, sha256: sha(bytes) }
}
function save(relative, value) {
  const file = path.join(evidence, relative)
  assert(!fs.existsSync(file), `Refusing to overwrite retained evidence: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
  return binding(file)
}
function read(relative) {
  return JSON.parse(fs.readFileSync(path.join(evidence, relative)))
}
function verifyInputs() {
  const file = path.join(evidence, 'input-freeze.json')
  assert.equal(binding(file).sha256, frozenSha)
  const frozen = read('input-freeze.json')
  const references = [
    ...frozen.contexts,
    frozen.immutableSharedCarrier,
    frozen.textReview,
    ...frozen.fullTextBindings,
  ]
  const contexts = frozen.contexts.map((ref) => JSON.parse(fs.readFileSync(ref.path)))
  const textChecks = []
  for (const context of contexts) {
    assert(['fig-08', 'fig-09'].includes(context.figure))
    references.push(context.originalLesson, context.sourceImage, context.durableSourceImage,
      ...Object.values(context.nativeContexts))
    for (const [language, payload] of Object.entries(context.languages)) {
      references.push(payload.binding)
      const template = JSON.parse(fs.readFileSync(payload.binding.path))
      assert.deepEqual(payload.blocks, template.prose)
      assert.equal(typeof payload.fullText, 'string')
      assert(payload.fullText.length > 0)
      textChecks.push({
        figure: context.figure,
        language,
        fullTextUtf8Bytes: Buffer.byteLength(payload.fullText),
        fullTextSha256: sha(Buffer.from(payload.fullText)),
        fullBlocksEqualFrozenTemplateProse: true,
        authoritativePayloadReadByAuthor: true,
      })
    }
  }
  assert.deepEqual(contexts[0].languages, contexts[1].languages)
  const unique = new Map(references.map((ref) => [ref.path, ref]))
  const inputs = [...unique.values()].map((ref) => {
    const current = binding(ref.path)
    assert.equal(current.bytes, ref.bytes, `Input byte length changed: ${ref.path}`)
    assert.equal(current.sha256, ref.sha256, `Input hash changed: ${ref.path}`)
    return { ...current, matchesFreeze: true }
  })
  return {
    inputFreeze: binding(file),
    inputs,
    textChecks,
    languagePayloadsIdenticalAcrossFigures: true,
    sourceImagesOpenedByWrapper: 0,
  }
}
function native(stage, figure, candidate) {
  assert(['fig-08', 'fig-09'].includes(figure))
  assert(/^[a-z0-9-]+$/.test(candidate))
  const directory = path.join(output, figure, 'candidates', candidate)
  const spec = path.join(directory, 'spec.json')
  const args = stage === 'validate'
    ? ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage', 'draft', '--json']
    : ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', spec,
      '--svg', path.join(directory, `${figure}.svg`),
      '--report', path.join(directory, `${figure}.render.json`),
      '--png', path.join(directory, `${figure}.preview.png`)]
  const checks = verifyInputs()
  const result = spawnSync(stage === 'validate' ? 'python3' : process.execPath, args,
    { cwd, encoding: 'utf8' })
  const receipt = save(`receipts/${figure}-${candidate}-${stage}-first.json`, {
    batch: 'D151',
    stage,
    cwd,
    command: [stage === 'validate' ? 'python3' : process.execPath, ...args],
    inputs: checks.inputFreeze,
    spec: binding(spec),
    exitCode: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    error: result.error ? String(result.error) : null,
  })
  console.log(JSON.stringify(receipt))
  process.exitCode = result.status ?? 1
}
function packageHold() {
  const checks = verifyInputs()
  const images = read('receipts/image-opens.json')
  assert.equal(images.actualImageOpens, 4)
  assert.equal(images.attempts.reduce((total, item) => total + item.actualImagesLoaded, 0), 4)
  assert(images.actualImageOpens <= 8)
  for (const figure of ['fig-08', 'fig-09']) {
    assert.equal(read(`inventories/${figure}.source-first.json`).decision.authorReady, false)
    assert(!fs.existsSync(path.join(output, figure)), 'HOLD packaging cannot ignore existing candidates.')
  }
  const artifacts = [
    'inventories/fig-08.source-first.json',
    'inventories/fig-09.source-first.json',
    'inventories/fig-08.source-pixels-3x.png',
    'inventories/fig-09.source-pixels-3x.png',
    'inventories/inventory-pixels.py',
    'receipts/image-opens.json',
    'receipts/run-native.mjs',
    'receipts/preflight-first.json',
  ].map((relative) => binding(path.join(evidence, relative)))
  const figures = ['fig-08', 'fig-09'].map((figure) => ({
    figure,
    status: 'HOLD_SOURCE_COUNT',
    authorReady: false,
    source: checks.inputs.find((ref) => ref.path.endsWith(`/root/9p/figures/${figure}.png`)),
    inventory: artifacts.find((ref) => ref.path.endsWith(`/${figure}.source-first.json`)),
    selected: null,
    candidates: [],
    contentRepairs: 0,
    contentFailureReceipts: [],
    holdReason: 'Individual particle counts are unresolved in open, joined and boundary-clipped source outlines. No guessed population or opaque contour-tracing substitute is authorized.',
    nativeValidation: { calls: 0, status: 'NOT_RUN_NO_JUSTIFIED_CANDIDATE' },
    nativeRender: { calls: 0, status: 'NOT_RUN_NO_JUSTIFIED_CANDIDATE' },
    outputPreviewImageOpens: 0,
  }))
  const report = save('report.json', {
    schema: 'd151/figure-author-report@1',
    batch: 'D151',
    ticket: 'STEMROBIN-181',
    book: '9p',
    lesson: 'phy9-c1-s1-n9',
    status: 'HOLD_SOURCE_FIDELITY',
    authorReady: false,
    finish: 'review',
    grill: 'self',
    sameAuthorizedInvocation: true,
    startedAt: read('receipts/preflight-first.json').startedAt,
    completedAt: new Date().toISOString(),
    inputVerification: checks,
    figures,
    selectedPathsAndHashes: [],
    artifactBindings: artifacts,
    actualImageOpens: images.actualImageOpens,
    imageOpenAttempts: images.attempts.length,
    actualSourceImageOpens: 2,
    actualSupplementalSourceInventoryImageOpens: 2,
    actualOutputPreviewImageOpens: 0,
    maximumBatchImageOpens: 8,
    maximumContextImageOpens: 24,
    parentImageOpens: 0,
    contentRepairs: 0,
    failures: images.attempts.filter((item) => item.status === 'technical-failure'),
    nativeValidationCalls: 0,
    nativeRenderCalls: 0,
    nativeReviewCalls: 0,
    technicalPreviewRecoveries: 0,
    selfGrillDecision: 'Scientific qualifications can be expressed deterministically, but exact source-count preservation is not yet justified. Do not guess counts or reinterpret compound pixel regions as individual molecules.',
    rendererIncapabilityDemonstrated: false,
    browserSessionsStarted: 0,
    browserSessionsLeftOpenByAuthor: 0,
    sharedRootWrites: 0,
    sharedWorkWrites: 0,
    frozenInputWrites: 0,
    templateWrites: 0,
    carrierWrites: 0,
    otherFiguresOrPortraitsInspected: 0,
    textCheckerOrSourcePageReviewReplays: 0,
    independentApproval: false,
    independentReviewPerformed: false,
    promotionAuthorized: false,
    canonicalPromotions: 0,
    originalTasks: 0,
    paidCalls: 0,
    dbCalls: 0,
    publisherCalls: 0,
    commitPushDeployMergeClosureOrMessageCalls: 0,
    portraitGenerationAuthorized: false,
    nextBoundary: 'Parent must resolve the glyph-count fidelity ambiguity before deterministic authorship can claim preservation. Any count regularization needs an explicit source-to-modern mapping authorization; no independent approval or promotion is recorded here.',
  })
  const freeze = save('author-freeze.json', {
    schema: 'd151/figure-author-freeze@1',
    batch: 'D151',
    ticket: 'STEMROBIN-181',
    status: 'HOLD_SOURCE_FIDELITY',
    authorReady: false,
    inputFreeze: checks.inputFreeze,
    verifiedInputs: checks.inputs,
    authoritativeTextBindings: checks.textChecks,
    report,
    outputs: artifacts,
    figures: figures.map((figure) => ({
      figure: figure.figure,
      status: figure.status,
      source: figure.source,
      inventory: figure.inventory,
      selected: null,
      contentRepairs: 0,
    })),
    selectedPathsAndHashes: [],
    actualImageOpens: 4,
    parentImageOpens: 0,
    failures: images.attempts.filter((item) => item.status === 'technical-failure'),
    independentApproval: false,
    nativeReviewCalls: 0,
    promotions: 0,
    paidCalls: 0,
  })
  console.log(JSON.stringify({ report, authorFreeze: freeze, status: 'HOLD_SOURCE_FIDELITY' }, null, 2))
}

const [action, figure, candidate] = process.argv.slice(2)
if (action === 'preflight') {
  console.log(JSON.stringify(save('receipts/preflight-first.json', {
    batch: 'D151',
    stage: 'binding-preflight',
    cwd,
    startedAt: new Date().toISOString(),
    ...verifyInputs(),
  }), null, 2))
} else if (action === 'validate' || action === 'render') {
  native(action, figure, candidate)
} else if (action === 'package-hold') {
  packageHold()
} else {
  throw new Error('Allowed actions: preflight, validate, render, package-hold. No review or promotion action exists.')
}
