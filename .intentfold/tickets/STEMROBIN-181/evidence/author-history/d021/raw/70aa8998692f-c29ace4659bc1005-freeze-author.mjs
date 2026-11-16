import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(own, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const authority = read(path.join(own, 'authority-bindings.json'))
const observations = read(path.join(own, 'author-observations.json'))
assert.equal(observations.status, 'author-observed-awaiting-independent-review')
assert.deepEqual(observations.targetedRepairCount, { 'fig-153': 0, 'fig-154': 0 })
assert.equal(observations.imageLedger.contextTotal, 8)
for (const binding of [...Object.values(authority.authority), ...authority.readContracts]) {
  assert.equal(hash(path.join(repo, binding.path)), binding.sha256, `Changed authority/contract: ${binding.path}`)
}
const inventory = read(path.join(own, 'source-inventory.json'))
assert.equal(inventory.imageLedger.sourceLoads, 2)
const figures = []
const allToolCalls = []
for (const figure of ['fig-153', 'fig-154']) {
  const folder = path.join(own, figure)
  const out = path.join(folder, 'initial')
  const context = read(path.join(folder, 'context.json'))
  const specFile = path.join(out, 'spec.json')
  const renderFile = path.join(out, 'render.json')
  const svgFile = path.join(out, `${figure}.svg`)
  const spec = read(specFile)
  const render = read(renderFile)
  const nativeCalls = read(path.join(out, 'native-calls.json'))
  const preview = read(path.join(out, 'width-previews.json'))
  const circuit = read(path.join(out, 'circuit-checks.json'))
  const contextCall = read(path.join(folder, 'native-context-call.json'))
  for (const binding of Object.values(context.frozenBindings)) assert.equal(hash(path.join(repo, binding.path)), binding.sha256)
  assert.deepEqual(spec.source.authoritativeText, context.lessons[0].authoritativeText)
  assert.equal(spec.source.authoritativeText.length, 14)
  assert.deepEqual(spec.source.image, context.frozenBindings.source)
  assert.equal(hash(path.join(repo, spec.source.image.path)), spec.source.image.sha256)
  assert.equal(read(path.join(out, 'draft-validation.json')).status, 'pass')
  assert.equal(read(path.join(out, 'rendered-validation.json')).status, 'pass')
  assert.equal(nativeCalls.status, 'pass')
  assert.equal(nativeCalls.calls.filter(call => call.name === 'render').length, 1)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(render.output.svg.sha256, hash(svgFile))
  assert.equal(preview.status, 'pass')
  assert.equal(circuit.status, 'pass')
  assert.equal(circuit.spec.sha256, hash(specFile))
  assert.equal(circuit.sourceInventory.sha256, hash(path.join(own, 'source-inventory.json')))
  assert.equal(contextCall.status, 'pass')
  assert.equal(contextCall.invocationOrdinal, 1)
  assert.ok(nativeCalls.calls.every(call => call.PWDEBUG === 'unset'))
  assert.equal(preview.PWDEBUG, 'unset')
  assert.deepEqual(preview.checks.map(check => check.widthPx), [640, 331, 342])
  const currentPreviews = preview.checks.map(check => {
    assert.equal(check.status, 'pass')
    assert.equal(hash(path.join(repo, check.preview.path)), check.preview.sha256)
    const observation = observations.previewLoads.find(item => item.figure === figure && item.widthPx === check.widthPx)
    assert.ok(observation)
    assert.equal(observation.sha256, check.preview.sha256)
    assert.equal(observation.loads, 1)
    assert.equal(observation.status, 'observed-no-author-issue')
    return {
      widthPx: check.widthPx, ...check.preview, dimensionsPx: check.dimensionsPx,
      measuredMinTextPx: Math.min(...check.metrics.labels.map(label => label.fontPx)),
      authorObservation: observation.observation,
      contextOpenOrdinal: observation.ordinal,
      actualInspectionLoads: 1,
      independentInspectionStatus: 'pending',
    }
  })
  const files = [
    ['sourceInventory', path.join(own, 'source-inventory.json')],
    ['nativeContext', path.join(folder, 'context.native.json')],
    ['fullCurrentContext', path.join(folder, 'context.json')],
    ['contextCall', path.join(folder, 'native-context-call.json')],
    ['spec', specFile],
    ['geometry', path.join(out, 'geometry.json')],
    ['draftValidation', path.join(out, 'draft-validation.json')],
    ['draftValidationCall', path.join(out, 'draft-validation-call.json')],
    ['renderedValidation', path.join(out, 'rendered-validation.json')],
    ['renderedValidationCall', path.join(out, 'rendered-validation-call.json')],
    ['render', renderFile],
    ['renderCall', path.join(out, 'render-call.json')],
    ['svg', svgFile],
    ['nativeCalls', path.join(out, 'native-calls.json')],
    ['previewEvidence', path.join(out, 'width-previews.json')],
    ['circuitChecks', path.join(out, 'circuit-checks.json')],
  ]
  figures.push({
    figure, status: 'author-frozen-awaiting-independent-review',
    scope: 'Native and author evidence only; no independent PASS.',
    bindings: { source: spec.source.image, ...Object.fromEntries(files.map(([name, file]) => [name, bind(file)])) },
    currentPreviews,
    mechanicalStatuses: { draftValidation: 'pass', nativeRender: 'pass', renderedValidation: 'pass', circuitAssertions: 'pass', actualWidthPreviewChecks: 'pass' },
    authorObservationStatus: 'observed-no-author-issue',
    independentReviewStatus: 'pending',
    initialAttempt: 'one-native-render',
    targetedRepairCount: 0, repairLimit: 1, replacementPreviews: [],
    sourcePreservation: { beforeSha256: spec.source.image.sha256, currentSha256: hash(path.join(repo, spec.source.image.path)), unchanged: true },
    sourceInventoryMaps: spec.source.inventory,
    semanticAssertions: circuit.checks,
    conductors: circuit.conductors,
    interpretation: circuit.initialNeutralInterpretation,
    modernRegularization: read(path.join(out, 'geometry.json')).modernRegularization,
    objectCount: spec.objects.length, nativeAssertionCount: spec.assertions.length,
    currentFullModernTextBlocks: spec.source.authoritativeText.length,
  })
  allToolCalls.push({
    figure, nativeContext: contextCall, nativeValidationAndRender: nativeCalls.calls,
    rendererInternalDraftValidatorCalls: 1,
    previewInvocation: { command: 'env', argv: ['-u', 'PWDEBUG', 'node', path.relative(repo, path.join(own, 'width-previews.mjs')), 'both', 'initial'], cwd: repo, exitCode: 0, output: bind(path.join(out, 'width-previews.json')) },
  })
}
const require = createRequire(path.join(repo, 'app/package.json'))
const dependencies = {
  playwright: require.resolve('playwright/package.json'),
  jsxgraph: path.join(repo, '.agents/skills/node_modules/jsxgraph/package.json'),
}
const dependencyBindings = Object.fromEntries(Object.entries(dependencies).map(([name, file]) => [name, { ...bind(file), version: read(file).version }]))
const previewOutput = {
  status: 'mechanical-preview-pass-not-independent-review',
  figures: figures.map(figure => ({ figure: figure.figure, attempt: 'initial', status: 'pass', previews: figure.currentPreviews.map(preview => ({
    widthPx: preview.widthPx, path: preview.path, sha256: preview.sha256, minTextPx: preview.measuredMinTextPx,
  })) })),
}
write('preview-output.json', previewOutput)
write('author-checks.json', {
  schema: 'ld-s10y-image/author-final-bindings@1',
  status: 'mechanical-binding-pass-not-independent-review',
  authoritativeInputsAndSharedContractsUnchanged: true,
  sourceImagesUnchanged: true,
  completeCurrentModernText: true,
  initialNativeRenderInvocations: { 'fig-153': 1, 'fig-154': 1 },
  targetedRepairs: { 'fig-153': 0, 'fig-154': 0 },
  exactThreePreviewBindingsPerFigure: figures.map(figure => ({ figure: figure.figure, previews: figure.currentPreviews.map(preview => ({ widthPx: preview.widthPx, path: preview.path, sha256: preview.sha256 })) })),
  browserTermination: 'Native renderers and isolated preview script close all browsers/contexts in finally; synchronous commands exited zero with no ongoing exec session.',
  noIndependentReviewClaim: true,
})
const scripts = ['author.mjs', 'native-author-run.mjs', 'width-previews.mjs', 'freeze-author.mjs'].map(name => bind(path.join(own, name)))
const filesBelowOwn = []
function inventoryFiles(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name)
    if (entry.isDirectory()) inventoryFiles(file)
    else if (entry.isSymbolicLink()) filesBelowOwn.push({ path: path.relative(repo, file), symlinkTarget: path.relative(repo, fs.realpathSync(file)), sha256: hash(file) })
    else if (entry.name !== 'author-freeze.json') filesBelowOwn.push(bind(file))
  }
}
inventoryFiles(own)
const freeze = {
  schema: 'ld-s10y-image/author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D021', lesson: 'phy9-c2-s2-n82',
  figures: ['fig-153', 'fig-154'],
  stage: 'figure-author', status: 'author-frozen-awaiting-independent-review',
  role: 'Fresh-context source pixel inventory and deterministic circuit figure author only',
  ownedRoot: own,
  scope: 'Only own scratch scripts, source inventory, full current context, specs, unmodified native SVG renders, exact three-width previews, observations and byte freeze. No durable/template/source writes, promotion, adapt-finalize, SCI, DB, Git, full tests or handoff.',
  bindings: {
    ...authority.authority,
    authorityBindings: bind(path.join(own, 'authority-bindings.json')),
    authorObservations: bind(path.join(own, 'author-observations.json')),
    authorChecks: bind(path.join(own, 'author-checks.json')),
    previewOutput: bind(path.join(own, 'preview-output.json')),
    preflightInitializationFailure: bind(path.join(own, 'preflight-call.json')),
  },
  figureEvidence: figures,
  toolBindings: { nativeSharedScriptsAndContracts: authority.readContracts, scratchScripts: scripts, dependencies: dependencyBindings },
  executedToolCalls: allToolCalls,
  imageLedger: {
    ...observations.imageLedger,
    originalOpenEvidence: inventory.imageLedger.opens,
    currentPreviewOpenEvidence: observations.previewLoads,
  },
  nativeCalls: {
    contextBuilderInvocations: 2,
    explicitDraftValidatorInvocations: 2,
    nativeRendererInvocations: 2,
    rendererInternalDraftValidatorInvocations: 2,
    renderedValidatorInvocations: 2,
    previewCaptureInvocations: 1,
    recordReviewInvocations: 0,
  },
  repairs: { 'fig-153': 0, 'fig-154': 0 },
  preflightIssueDisposition: observations.preflightIssue,
  completeOwnedFileBindings: filesBelowOwn,
  currentSharedContractsUnchanged: true,
  authoritativeTemplateAndSourceUnchanged: true,
  remainingAuthorIssues: [],
  independentModernGateRequired: true,
  independentModernGateStatus: 'pending-not-performed-by-author',
  independentScienceStatus: 'not-performed-by-author',
  noIndependentPassRecord: true,
  noPromotionOrDurableOutputs: true,
  nextStage: 'Independent reviewer may inspect the exact bound artifacts in a fresh context. Main receives text only and must not treat native/author checks as an independent modern PASS.',
}
write('author-freeze.json', freeze)
console.log(JSON.stringify({
  status: freeze.status, freeze: bind(path.join(own, 'author-freeze.json')),
  figures: figures.map(figure => ({
    figure: figure.figure, mechanicalStatuses: figure.mechanicalStatuses,
    spec: figure.bindings.spec, svg: figure.bindings.svg,
    previewHashes: figure.currentPreviews.map(preview => ({ widthPx: preview.widthPx, sha256: preview.sha256 })),
    targetedRepairCount: figure.targetedRepairCount,
  })),
  contextOpens: observations.imageLedger.contextTotal,
  sourceReopens: 0, previewReopens: 0, crops: 0,
}, null, 2))
