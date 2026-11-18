import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const owner = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d743-n82-fig195-first-author`
const oldOwner = `${repo}/tmp/d743-n82-fig195-first-author`
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const evidence = name => ({ path: `${owner}/${name}`, sha256: hash(`${owner}/${name}`) })
const read = name => JSON.parse(fs.readFileSync(`${owner}/${name}`, 'utf8'))
const write = (name, data) => fs.writeFileSync(`${owner}/${name}`, `${JSON.stringify(data, null, 2)}\n`)
assert.ok(!fs.existsSync(`${owner}/report.json`), 'Do not repeat completed report finalization')
const spec = read('fig-195.spec.json')
const render = read('fig-195.render.json')
const priorSpec = read('d732.fig-195.spec.json')
const inputs = read('inputs.current.json')
const display = read('display-640.json')
const bindings = read('bindings.json')
const attempts = read('native-attempts.json')
const withoutText = value => {
  const result = structuredClone(value)
  delete result.source.authoritativeText
  return result
}
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(`${owner}/fig-195.spec.json`))
assert.equal(render.output.svg.sha256, hash(`${owner}/fig-195.svg`))
assert.ok(fs.readFileSync(`${owner}/fig-195.svg`).equals(fs.readFileSync(`${owner}/d732.fig-195.svg`)))
assert.deepEqual(withoutText(spec), withoutText(priorSpec))
assert.deepEqual(spec.source.authoritativeText, ['en', 'zh'].flatMap(locale => {
  assert.equal(hash(inputs[locale].path), inputs[locale].sha256)
  const lesson = JSON.parse(fs.readFileSync(inputs[locale].path, 'utf8'))
  return lesson.prose.filter(item => typeof item.text === 'string' && item.text.trim())
    .map(item => ({ lesson: `phy10-c2-s3-n82:${locale}`, text: item.text }))
}))
assert.equal(bindings.status, 'pass')
assert.equal(bindings.specSha256, hash(`${owner}/d732.fig-195.spec.json`))
assert.equal(display.status, 'pass')
assert.equal(display.specSha256, hash(`${owner}/d732.fig-195.spec.json`))
assert.equal(display.svgSha256, hash(`${owner}/fig-195.svg`))
assert.equal(display.screenshot.sha256, hash(`${owner}/fig-195.actual-640.png`))
assert.equal(attempts.filter(item => item.stage === 'validate').length, 1)
assert.equal(attempts.filter(item => item.stage === 'render').length, 3)
assert.equal(attempts.filter(item => item.status === 'fail').length, 1)
write('metadata-render-equivalence.json', {
  schema: 'd743/metadata-render-equivalence@1',
  status: 'pass',
  checks: {
    fullCurrentD745EnAndUnchangedZhBound: true,
    onlyAuthoritativeTextChanged: true,
    currentNativeRenderPassAndHashesBound: true,
    svgByteIdentical: true,
    inheritedGeometryBindingEvidenceStillApplies: true,
    inheritedActual640ScreenshotStillApplies: true,
  },
  currentSpec: evidence('fig-195.spec.json'),
  previousSpec: evidence('d732.fig-195.spec.json'),
  svg: evidence('fig-195.svg'),
  previousSvg: evidence('d732.fig-195.svg'),
  sourceReopens: 0,
  screenshotOrSelfVisualReplays: 0,
  additionalNativeRenderCallsForDelta: 1,
  approval: 'none',
})
write('report.json', {
  schema: 'd743/first-modern-figure-author-handoff@1',
  ticket: 'STEMROBIN-181',
  card: 'phy10-c2-s3-n82',
  figure: 'fig-195',
  status: 'AUTHOR_CANDIDATE_READY_FOR_INDEPENDENT_REVIEW',
  checkout: repo,
  outputOwner: owner,
  mode: 'deterministic',
  nativeRenderer: render.renderer,
  currentModernInputs: inputs,
  completeAuthoritativeModernBlocks: spec.source.authoritativeText.length,
  rawSourceProseUsedAsAuthoritativeText: false,
  candidate: {
    spec: evidence('fig-195.spec.json'),
    svg: evidence('fig-195.svg'),
    render: evidence('fig-195.render.json'),
    actual640Image: evidence('fig-195.actual-640.png'),
  },
  independentInventoryAndMapping: {
    pixelObservation: evidence('retained-source-observation.json'),
    mapping: evidence('inventory-mapping.json'),
    sourcePointCount: 10,
    labels: ['M', 'N', 'A', 'B', 'C', 'D', 'A1', 'A2', 'B1', 'B2', 'alpha', 'beta'],
    sourceWavelets: 3,
    sourceArrowheads: 4,
    nativeAssertions: spec.assertions.length,
    objectBindingChecks: bindings.checks.length,
    historicalMappingStatusInExactObservationCopy: 'Superseded by inventory-mapping.json; the original pixel observations were retained unchanged.',
  },
  execution: {
    standaloneNativeValidateCalls: 1,
    standaloneNativeValidateFirstResult: 'pass on original author spec',
    nativeRenderCalls: 3,
    nativeRenderResults: ['fail: five label collisions', 'pass: one surgical label repair', 'pass: authorized d745 authoritative-text-only delta'],
    rendererInternalValidateCalls: 3,
    finalSpecNativeValidation: 'pass via unchanged native renderer internal validation on current spec',
    geometryLayoutRepairs: 1,
    metadataOnlyContextDeltas: 1,
    sameInputPassedNativeStageReplays: 0,
    additionalRenderForChangedSpec: 1,
    svgByteIdenticalAcrossContextDelta: true,
    bindingCheckCalls: 1,
    mediaCaptureCalls: 1,
    completedGeometryOrVisualStagesReplayedForTextDelta: false,
  },
  retainedFailures: {
    originalPathFailure: { path: `${oldOwner}/first-fail.json`, sha256: hash(`${oldOwner}/first-fail.json`), correction: 'Inputs exist under ticket/tmp, not repo/tmp. Incorrect-path FAIL preserved without treating it as missing source.' },
    firstNativeFailure: evidence('first-native-fail.json'),
    firstNativeFailedSpec: evidence('first-native-fail.spec.json'),
    firstNativeFailedSvg: evidence('first-native-fail.fig-195.svg'),
    firstNativeFailedRender: evidence('first-native-fail.fig-195.render.json'),
    allNativeReceipts: evidence('native-attempts.json'),
    repair: evidence('repair-1.json'),
  },
  originalD732ProvenanceAndDelta: {
    originalInputs: evidence('inputs.json'),
    originalSpec: evidence('d732.fig-195.spec.json'),
    originalSvg: evidence('d732.fig-195.svg'),
    originalRender: evidence('d732.fig-195.render.json'),
    delta: evidence('context-d745-delta.json'),
    equivalence: evidence('metadata-render-equivalence.json'),
    d742TextReviewFail: 'Reported by the human; preserved in context-d745-delta.json as the reason for the English repair.',
  },
  actualDisplay: {
    basis: display.basis,
    mediaWidthPx: 640,
    mediaHeightPx: 600,
    minimumMeasuredTextPx: Math.min(...display.observations.map(item => item.minTextPx)),
    viewports: display.observations.map(item => item.viewport),
    mobileScrollEndReachable: true,
    evidence: evidence('display-640.json'),
    authoredObservation: evidence('author-observation.json'),
    liveFullProductOrLessonAcceptanceRun: false,
  },
  cumulativeImageUsage: {
    batch: 2, context: 2, sourceOpens: 1, candidateOpens: 1,
    sourceReopens: 0, candidateReopens: 0, crops: 0,
    screenshotsProduced: 1, batchLimit: 8, contextLimit: 24,
  },
  paidUsage: { calls: 0, tokens: 0, images: 0, cost: 0 },
  reviews: { independentAffectedText: 'pending', independentFigure: 'pending', selfApproval: false, reviewFileCreated: false, wholeCardApproved: false },
  prohibitedActionsPerformed: [],
  canonicalAssetsChanged: false,
  gitBackendDbOrOtherChatActions: false,
  otherPeoplesChangesModified: false,
  handoffNote: 'Candidate author handoff only. Native/binding/display evidence is not independent FIG or text review and is not permission to promote.',
  hashManifest: `${owner}/hashes.sha256`,
})
const names = fs.readdirSync(owner).filter(name => name !== 'hashes.sha256' && fs.statSync(`${owner}/${name}`).isFile()).sort()
const entries = names.map(name => ({ path: `${owner}/${name}`, sha256: hash(`${owner}/${name}`) }))
for (const file of [spec.source.image.path, `${oldOwner}/first-fail.json`, `${oldOwner}/source-inventory.json`, inputs.en.path, inputs.zh.path, inputs.requirements.path]) {
  entries.push({ path: file, sha256: hash(file) })
}
fs.writeFileSync(`${owner}/hashes.sha256`, `${entries.map(item => `${item.sha256}  ${item.path}`).join('\n')}\n`)
console.log(`HANDOFF: ${owner}/report.json`)
console.log(`SVG byte-identical: ${hash(`${owner}/fig-195.svg`)}`)
console.log(`Current spec: ${hash(`${owner}/fig-195.spec.json`)}`)
console.log('Images cumulative: 2; paid usage: 0; independent text/FIG reviews pending')
