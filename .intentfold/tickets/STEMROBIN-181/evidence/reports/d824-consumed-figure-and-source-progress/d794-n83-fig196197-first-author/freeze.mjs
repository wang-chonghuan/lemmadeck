import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d794-n83-fig196197-first-author`
assert.equal(process.cwd(), R)
assert.ok(!fs.existsSync(`${O}/close-ready-freeze.json`), 'Freeze once')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const write = (name, value) => fs.writeFileSync(`${O}/${name}`, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const evidence = p => ({ path: p, sha256: hash(p) })
const bindings = read(`${O}/input-binding.json`).bindings
for (const binding of Object.values(bindings)) assert.equal(hash(`${R}/${binding.path}`), binding.sha256)
const nativeReceipts = []
const contexts = []
const candidates = []
const labelSets = {
  'fig-196': ['Round hole', 'White light', 'Prism', 'Wall', 'Violet', 'Indigo', 'Blue', 'Green', 'Yellow', 'Orange-yellow', 'Red'],
  'fig-197': ['Slit', 'Lens', 'Screen', 'Prism', 'White image', 'Red', 'Violet'],
}
for (const [id, revision, repairCount] of [['fig-196', 'repair-2', 2], ['fig-197', 'repair-3', 3]]) {
  const dir = `${O}/${id}/${revision}`
  const spec = read(`${dir}/spec.json`)
  const render = read(`${dir}/render.json`)
  const display = read(`${dir}/display-640.json`)
  assert.equal(spec.mode, 'deterministic')
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(`${dir}/spec.json`))
  assert.equal(render.output.svg.sha256, hash(`${dir}/${id}.svg`))
  assert.equal(display.status, 'pass')
  assert.equal(display.specSha256, hash(`${dir}/spec.json`))
  assert.equal(display.svgSha256, hash(`${dir}/${id}.svg`))
  assert.equal(display.screenshot.sha256, hash(`${dir}/${id}.actual-640.png`))
  assert.deepEqual(spec.source.image, bindings[id])
  assert.ok(!path.isAbsolute(spec.source.image.path))
  assert.deepEqual(spec.objects.filter(o => o.type === 'text').map(o => o.text), labelSets[id])
  const text = ['en', 'zh'].flatMap(locale => read(`${R}/${bindings[locale].path}`).prose
    .filter(p => p.text?.trim()).map(p => ({ lesson: `phy10-c2-s3-n83:${locale}`, text: p.text })))
  assert.deepEqual(spec.source.authoritativeText, text)
  assert.equal(text.length, 20)
  for (const stage of ['draft', 'render', 'rendered']) assert.equal(read(`${dir}/${stage}.command.json`).exitCode, 0)
  for (const rev of ['initial', ...Array.from({ length: repairCount }, (_, i) => `repair-${i + 1}`)]) {
    for (const stage of ['draft', 'render', 'rendered']) {
      const p = `${O}/${id}/${rev}/${stage}.command.json`
      if (fs.existsSync(p)) nativeReceipts.push({ ...read(p), receipt: evidence(p) })
    }
  }
  for (const locale of ['en', 'zh']) {
    const p = `${O}/contexts/${id}.${locale}.complete.json`
    const context = read(p)
    assert.deepEqual(context.sourceImage.path, bindings[id].path)
    assert.equal(context.sourceImage.sha256, bindings[id].sha256)
    assert.ok(!path.isAbsolute(context.sourceImage.path))
    assert.deepEqual(context.lessons[0].completeEditionProse, read(`${R}/${bindings[locale].path}`).prose)
    contexts.push({ figure: id, locale, ...evidence(p), completeProseBlocks: context.lessons[0].completeEditionProse.length })
  }
  candidates.push({
    figure: id, revision, mode: spec.mode,
    source: { ...bindings[id], ...Object.fromEntries(['width', 'height'].map(k => [k, read(`${O}/contexts/${id}.en.complete.json`).sourceImage[k]])) },
    spec: evidence(`${dir}/spec.json`), svg: evidence(`${dir}/${id}.svg`),
    render: evidence(`${dir}/render.json`), actual640: evidence(`${dir}/${id}.actual-640.png`),
    display: evidence(`${dir}/display-640.json`),
    draftReceipt: evidence(`${dir}/draft.command.json`),
    renderedReceipt: evidence(`${dir}/rendered.command.json`),
    firstFailure: evidence(`${O}/${id}/FIRST-native-failure.json`),
    repairHistory: Array.from({ length: repairCount }, (_, i) => evidence(`${O}/${id}/repair-${i + 1}/repair.json`)),
    cumulativeRepairs: repairCount, objects: spec.objects.length, nativeAssertions: spec.assertions.length,
    onImageLabels: labelSets[id],
    minimumFinalTextPx: Math.min(...display.observations.map(o => o.minTextPx)),
    displayWidthPx: 640, mobileScrollEndReachable: display.observations[1].scrollEnd === display.observations[1].expectedScrollEnd,
    sourceInventoryGroups: spec.source.inventory,
    promotionApproved: false, independentReview: 'pending',
  })
}
const failures = nativeReceipts.filter(receipt => receipt.exitCode !== 0)
assert.equal(failures.length, 4)
assert.equal(nativeReceipts.filter(r => r.stage === 'draft' || r.stage === 'rendered').length, 10)
assert.equal(nativeReceipts.filter(r => r.stage === 'render').length, 6)
write('native-attempts.json', {
  receipts: nativeReceipts,
  standaloneValidateCalls: 10, renderCalls: 6, rendererInternalDraftValidationCalls: 6,
  contextBuildCalls: 4, actualMediaCaptureCalls: 3,
  nativeFailures: 4,
  duplicatePassedSameInputStageReplays: 0,
})
write('image-usage.json', {
  batch: 5, context: 5, sourceOpens: 2, candidateOpens: 3,
  reopens: 0, crops: 0, screenshotsProduced: 3,
  batchLimit: 8, contextLimit: 24, noFurtherImageOpensInThisBatch: true,
  opens: [
    { ordinal: 1, kind: 'source', ...evidence(`${R}/${bindings['fig-196'].path}`), purpose: 'Inventory original before drawing' },
    { ordinal: 2, kind: 'source', ...evidence(`${R}/${bindings['fig-197'].path}`), purpose: 'Inventory original before drawing' },
    { ordinal: 3, kind: 'candidate', ...evidence(`${O}/fig-196/repair-1/fig-196.actual-640.png`), purpose: 'Author preview; Orange-yellow crossing thin wall edge recorded and repaired' },
    { ordinal: 4, kind: 'candidate', ...evidence(`${O}/fig-197/repair-3/fig-197.actual-640.png`), purpose: 'Final author preview; no approval or independent review' },
    { ordinal: 5, kind: 'candidate', ...evidence(`${O}/fig-196/repair-2/fig-196.actual-640.png`), purpose: 'Affected label preview; no approval or independent review' },
  ],
  excluded: { colorPlateOpens: 0, pageOpens: 0, paidImageCalls: 0 },
})
write('author-preview-observations.json', {
  kind: 'Author observations, not a quality-gate review or source-fidelity certification',
  'fig-196': {
    retainedInitialDefect: 'Repair-1 native render passed, but its actual-640 preview showed Orange-yellow on the thin wall outline; repair-2 moved only that label right.',
    finalObserved: 'One round aperture, narrow incident beam, one downward-oriented prism, seven representative overlapping circles with English colour labels, receiving wall and support are visible in repair-2 actual-640 pixels.',
    sourceCaution: 'Original pigments and individual patch borders are not measurable in the monochrome scan. Seven named samples are a declared modern prose-based addition. Room furnishing and board texture are deliberately simplified, not inventoried as a grid.',
  },
  'fig-197': {
    finalObserved: 'Slit, one lens, one apex-up prism and one screen are visible in repair-3 actual-640 pixels. Dashed upper/lower no-prism references meet the white image, and solid directed red/violet paths terminate at their own screen positions.',
    sourceCaution: 'Source contains red and violet labels only, not a seven-colour numbered diagram. No plate content, second prism or recombination experiment is drawn.',
  },
  noIndependentReview: true, noReviewFileCreated: true,
})
write('report.json', {
  schema: 'd794/first-figure-author-handoff@1',
  status: 'AUTHOR-CANDIDATES-FROZEN-NATIVE-PASS-INDEPENDENT-REVIEW-PENDING',
  ticket: 'STEMROBIN-181/181-3', card: 'phy10-c2-s3-n83',
  checkout: R, exclusiveWriteRoot: O, candidates,
  inventory: evidence(`${O}/source-inventory.json`),
  initialInventoryMapping: evidence(`${O}/inventory-mapping.json`),
  authoritativeText: evidence(`${O}/authoritative-text.json`),
  completeBilingualContexts: contexts, completeAuthoritativeTextBlocksPerSpec: 20,
  inputBinding: evidence(`${O}/input-binding.json`),
  sourceMath: {
    'fig-196': 'No printed numerical data, equation, point letter, angle, scale, table or grid. Preserve round-hole to prism to overlapping wall images.',
    'fig-197': 'No printed numerical data, equation, point letter, angle, scale, table or grid. Preserve slit/lens/prism/screen order, shared contacts, solid/dashed routes and red above violet.',
    exactSourceProseMathRetained: 'Complete bilingual text retains all source-related math, including the external-plate 180-degree prose and satellite 1. These do not become invented numeric labels or objects in either numbered figure.',
  },
  execution: evidence(`${O}/native-attempts.json`),
  nativeOutcomes: {
    'fig-196': ['initial draft pass', 'initial render fail: Prism and six colour-label collisions', 'repair-1 draft/render/rendered pass', 'repair-1 actual preview thin-edge overlap: affected repair-2', 'repair-2 draft/render/rendered and actual media pass'],
    'fig-197': ['initial draft fail: four strict-inside boundary claims', 'repair-1 draft pass; render execution fail: unsupported short incident-arrow marker', 'repair-2 draft pass; render fail: White image collision', 'repair-3 draft/render/rendered and actual media pass'],
    finalRenderer: 'Native unmodified JSXGraph 1.13.1',
    actualDisplay: 'Offline unmodified product app.css and FigureMedia DOM, existing headless Chromium, desktop 1440x960/mobile 390x844, media fixed 640px, min text 18px, mobile scroll end reachable.',
    liveFullLessonAcceptance: false, determinismReplayPerformed: false,
  },
  failureEvidence: failures.map(r => ({
    figure: r.figure, revision: r.revision, stage: r.stage, exitCode: r.exitCode,
    receipt: r.receipt,
    stdout: r.stdout, stderr: r.stderr,
    preservedSpec: evidence(`${O}/${r.figure}/${r.revision}/spec.json`),
  })),
  repairs: { 'fig-196': 2, 'fig-197': 3, total: 5, reset: false },
  cumulativeImageUsage: evidence(`${O}/image-usage.json`),
  paidUsage: { calls: 0, images: 0, tokens: 0, cost: 0, currency: 'USD' },
  scopeBoundary: {
    otherFilesEdited: false, canonicalEdits: false, indexEdits: false, meterEdits: false,
    gitCommands: 0, databaseActions: 0, publisherActions: 0, deployActions: 0,
    paidCalls: 0, worktreesCreated: 0, furtherAgentsSpawned: 0,
    otherChatMessagesSent: 0, reviewApprovalActions: 0,
    externalColorPlateOpens: 0, externalColorPlateObjectsAuthored: 0,
    lessonTemplatesOrRawFilesModified: false,
  },
  notSelfCertified: true, independentParentReviewRequired: true,
  reviewFilesCreated: false, wholeCardApproved: false, promotable: false,
  closeReadyMeans: 'Only this short-lived author batch is frozen and close-ready. The ticket/card, parent review, approvals, canonical retention and publication remain outside this task.',
})
const enumerate = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const p = `${dir}/${entry.name}`
  if (entry.isSymbolicLink()) return []
  return entry.isDirectory() ? enumerate(p) : [p]
})
const fileEntries = enumerate(O).sort().map(evidence)
for (const binding of Object.values(bindings)) {
  const p = `${R}/${binding.path}`
  if (!fileEntries.some(entry => entry.path === p)) fileEntries.push(evidence(p))
}
write('hash-manifest.json', { schema: 'd794/hash-manifest@1', files: fileEntries })
const manifest = evidence(`${O}/hash-manifest.json`)
const report = evidence(`${O}/report.json`)
write('close-ready-freeze.json', {
  schema: 'd794/close-ready-freeze@1',
  status: 'CLOSE-READY-AUTHOR-BATCH-ONLY',
  report, hashManifest: manifest,
  candidates: candidates.map(candidate => ({
    figure: candidate.figure, revision: candidate.revision,
    spec: candidate.spec, svg: candidate.svg, render: candidate.render,
    actual640: candidate.actual640, cumulativeRepairs: candidate.cumulativeRepairs,
  })),
  inventory: evidence(`${O}/source-inventory.json`),
  completeBilingualContexts: contexts,
  usage: { imageOpens: 5, contextImages: 5, screenshotsProduced: 3, paidCalls: 0, cost: 0, cumulativeRepairs: 5 },
  independentReview: 'pending', approval: 'none', canonicalChanged: false,
  noFurtherImageOpens: true, noFurtherAuthoring: true,
})
console.log(JSON.stringify({
  freeze: evidence(`${O}/close-ready-freeze.json`),
  report, hashManifest: manifest,
  candidates: candidates.map(c => ({ figure: c.figure, spec: c.spec, svg: c.svg, render: c.render })),
  usage: { imageOpens: 5, paidCalls: 0, cumulativeRepairs: 5 },
  independentReview: 'pending',
}, null, 2))
