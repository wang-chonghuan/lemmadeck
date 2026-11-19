import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const own = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d795-n84-fig198-first-author`
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const binding = p => ({ path: p, sha256: hash(p) })
assert.ok(!fs.existsSync(`${own}/RETURN.json`), 'Do not replay final binding report')
const inputs = read(`${own}/input-bindings.json`)
const stale = Object.entries(inputs.files).filter(([, v]) => hash(v.path) !== v.sha256)
assert.deepEqual(stale, [], 'Current input changed; return affected-context gap, not approval')
const stem = 'fig-198.repair-1'
const specPath = `${own}/${stem}.spec.json`
const svgPath = `${own}/${stem}.svg`
const renderPath = `${own}/${stem}.render.json`
const render = read(renderPath)
const spec = read(specPath)
const display = read(`${own}/display-results.json`)
assert.equal(render.status, 'pass')
assert.equal(display.status, 'pass')
assert.equal(render.spec.sha256, hash(specPath))
assert.equal(render.output.svg.sha256, hash(svgPath))
assert.equal(spec.source.image.path, inputs.sourceImage.path)
assert.equal(spec.source.image.sha256, inputs.sourceImage.sha256)
const context = read(`${own}/context.bilingual.json`)
assert.deepEqual(spec.source.authoritativeText, context.authoritativeText)
const first = read(`${own}/fig-198.first.native-results.json`)
const final = read(`${own}/${stem}.native-results.json`)
const result = {
  schema: 'd795/first-figure-author-return@1',
  ticket: 'STEMROBIN-181/181-3', book: '10p', card: 'phy10-c2-s3-n84', figure: 'fig-198',
  status: 'FIRST-AUTHOR-CANDIDATE-NATIVE-PASS-INDEPENDENT-REVIEW-NOT-PERFORMED',
  allowedWriteRoot: own,
  outputs: {
    spec: binding(specPath), svg: binding(svgPath), nativeRender: binding(renderPath),
    nativeResults: binding(`${own}/${stem}.native-results.json`),
    bilingualContext: binding(`${own}/context.bilingual.json`),
    inputBindings: binding(`${own}/input-bindings.json`),
    sourceObservation: binding(`${own}/source-observation.json`),
    inventoryMapping: binding(`${own}/inventory-mapping.json`),
    displayResults: binding(`${own}/display-results.json`),
    screenshot: binding(`${own}/fig-198.actual-640.png`),
  },
  sourceImage: inputs.sourceImage,
  native: {
    first: { status: first.status, standaloneValidation: first.results[0].exitCode === 0 ? 'pass' : 'fail', render: 'fail', failure: binding(`${own}/FIRST-failure.json`), retainedSpec: binding(`${own}/fig-198.first.spec.json`), retainedSvg: binding(`${own}/fig-198.first.svg`), retainedRender: binding(`${own}/fig-198.first.render.json`) },
    final: { status: final.status, standaloneValidation: 'pass', render: render.status, collisions: render.collisions, widthChecks: render.displayChecks, objects: render.objects, labels: render.labels, assertions: spec.assertions.length },
    contextBuilds: 2, standaloneValidationInvocations: 2, renderInvocations: 2,
    renderInternalValidationInvocations: 2,
    actualDisplay: { status: display.status, desktop: display.observations[0], mobile: display.observations[1], note: display.basis },
  },
  repairs: {
    cumulativeAuthorRepairs: 1, repair: binding(`${own}/repair-1.json`),
    cause: 'Initial native label collision between Inner surface and Water.',
    actualChange: 'Water label moved from [490,78] to [490,62]; paths, inventory and authoritative text unchanged.',
    firstFailuresPreserved: true, technicalExecutionRepairs: 0,
  },
  usage: {
    batchImageLimit: 8, contextImageLimit: 24,
    imagesLoadedIntoBatch: 2, imagesLoadedIntoCurrentContext: 2,
    opens: [
      { path: inputs.sourceImage.path, count: 1, purpose: 'Original reopened before inventory and drawing.' },
      { path: `${own}/fig-198.actual-640.png`, count: 1, purpose: 'Single author-side preview of completed native output; no review approval.' },
    ],
    generatedImages: 0, nativePngSnapshots: 0, screenshotsCreated: 1,
    paidCalls: 0, paidUSD: 0, additionalAgents: 0, chatsCreated: 0, worktreesCreated: 0,
    note: 'Image byte hashes, header reads and context-tool source symlinks do not load image payloads into model context. No image-bearing history is returned.',
  },
  boundaries: {
    reviewed: false, selfApproved: false, independentReview: false, canonicalWrites: false,
    indexWrites: false, meterWrites: false, gitCommands: false, dbConnections: false,
    publisherInvocations: false, deployments: false, spending: false,
    portraitOpened: false, colorPlatesOpened: false,
    ticketReadOnly: 'Existing Plane helper verify/list/get only; no ticket write.',
  },
  nextOwner: 'Separate authorized figure review may consume candidate text/paths/hashes. No review file or approval was created. Whole lesson and unrelated asset dependencies remain outside this first-author scope.',
}
fs.writeFileSync(`${own}/RETURN.json`, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' })
const files = []
const collect = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) collect(p)
    else if (entry.isFile() && entry.name !== 'hashes.sha256') files.push(p)
  }
}
collect(own)
fs.writeFileSync(`${own}/hashes.sha256`, files.sort().map(p => `${hash(p)}  ${p}`).join('\n') + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  return: binding(`${own}/RETURN.json`), hashes: binding(`${own}/hashes.sha256`),
  spec: result.outputs.spec, svg: result.outputs.svg, nativeRender: result.outputs.nativeRender,
  nativeStatus: result.native.final.status, cumulativeAuthorRepairs: 1,
  imagesLoaded: 2, screenshotsCreated: 1, paidCalls: 0, paidUSD: 0, approval: 'none',
}, null, 2))
