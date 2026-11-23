import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), root)
const own = path.dirname(fileURLToPath(import.meta.url))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const artifact = file => ({ path: path.resolve(file), sha256: hash(file), mode: '0444' })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const inventory = read(path.join(own, 'source.inventory.json'))
const display = read(path.join(own, 'display.json'))
const repair = read(path.join(own, 'display.mobile-table-repair.json'))
assert.equal(repair.status, 'pass')
const edition = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures')
const manifestFile = path.join(own, 'manifest.json')
assert(!fs.existsSync(manifestFile), 'Preserve existing manifest')
const bindings = [
  { role: 'full-approved-lesson', ...inventory.authoritativeLesson },
  { role: 'full-exercises-and-source-givens', ...inventory.authoritativeExercises },
  ...inventory.figures.map(figure => ({ role: `${figure.id}-original`, ...figure.source })),
].map(binding => {
  assert.equal(hash(binding.path), binding.sha256)
  return { ...binding, path: path.resolve(binding.path), sharedInput: true, duplicated: false }
})
const figures = inventory.figures.map(figure => {
  const specFile = path.join(own, `${figure.id}.spec.json`)
  const spec = read(specFile)
  const svgFile = path.join(own, `${figure.id}.svg`)
  const nativeFile = path.join(own, `${figure.id}.native-render.json`)
  const renderFile = path.join(own, `${figure.id}.render.json`)
  const native = read(nativeFile), render = read(renderFile)
  assert.equal(native.status, 'pass')
  assert.equal(hash(svgFile), native.output.svg.sha256)
  assert.equal(hash(specFile), native.spec.sha256)
  assert.equal(render.spec.sha256, native.spec.sha256)
  assert.deepEqual(render.collisions, [])
  assert.deepEqual(render.displayChecks, native.displayChecks)
  assert.equal(render.output.svg.sha256, native.output.svg.sha256)
  assert.equal(render.spec.path, path.relative(root, path.join(edition, `${figure.id}.spec.json`)))
  assert.equal(render.output.svg.path, path.relative(root, path.join(edition, `${figure.id}.svg`)))
  const desktop = display.widths.find(item => item.figure === figure.id && item.surface === 'desktop')
  const mobile = display.widths.find(item => item.figure === figure.id && item.surface === 'mobile')
  const finalMobile = figure.id === 'tbl-p0160-01' ? repair.screenshot : mobile.screenshot
  return {
    id: figure.id, mode: 'deterministic',
    status: 'authored-awaiting-independent-mathematical-and-cultural-review',
    original: bindings.find(binding => binding.role === `${figure.id}-original`),
    inventory: artifact(path.join(own, 'source.inventory.json')),
    spec: artifact(specFile), svg: artifact(svgFile),
    nativeRenderReport: artifact(nativeFile), renderReport: artifact(renderFile),
    eventualDurableEditionPaths: {
      spec: path.join(edition, `${figure.id}.spec.json`),
      svg: path.join(edition, `${figure.id}.svg`),
      render: path.join(edition, `${figure.id}.render.json`),
    },
    eventualPathsAreDeclarationsOnly: true,
    display: spec.display,
    nativeRenderer: native.renderer,
    assertions: spec.assertions.length,
    nativeStatus: native.status,
    renderLabelCount: native.labels,
    authorVisualInspection: {
      desktop: artifact(desktop.screenshot.path),
      mobile: artifact(finalMobile.path),
      actualDesktopMediaWidthPx: desktop.measurement.mediaWidth,
      actualMobileMediaWidthPx: mobile.measurement.mediaWidth,
      minimumVisibleTextPx: figure.id === 'tbl-p0160-01' ? 22 : null,
      noTextReason: figure.id === 'fig-213' ? 'The source has no visible labels or numerical givens; none were invented.' : null,
      fullRightmostAndBottomInspected: true,
      displayReport: artifact(path.join(own, 'display.json')),
      ...(figure.id === 'tbl-p0160-01' ? {
        affectedCaptureRepair: artifact(path.join(own, 'display.mobile-table-repair.json')),
        scrollContract: 'Fixed640 media, mobile viewport358, scrollEnd282 reached. Full mobile PNG exposes complete scroll content for inspection; capture-only ancestor unclipping does not alter the native media size or product fit.',
      } : {}),
    },
    independentReview: { mathematical: 'not-performed', cultural: 'not-performed', reviewFileCreated: false },
  }
})
const imageLoads = [
  { ordinal: 1, kind: 'original', path: bindings.find(binding => binding.role === 'tbl-p0160-01-original').path },
  { ordinal: 2, kind: 'original', path: bindings.find(binding => binding.role === 'fig-213-original').path },
  { ordinal: 3, kind: 'desktop-final', path: path.join(own, 'tbl-p0160-01.desktop.png') },
  { ordinal: 4, kind: 'desktop-final', path: path.join(own, 'fig-213.desktop.png') },
  { ordinal: 5, kind: 'mobile-first-capture-failed', path: path.join(own, 'tbl-p0160-01.mobile.png') },
  { ordinal: 6, kind: 'mobile-final', path: path.join(own, 'fig-213.mobile.png') },
  { ordinal: 7, kind: 'mobile-repaired-final', path: path.join(own, 'tbl-p0160-01.mobile-full.png') },
].map(item => ({ ...item, sha256: hash(item.path) }))
const manifest = {
  scope: 'N34 bounded modern-figure author evidence only',
  cwd: root, ownershipRoot: own,
  status: 'author-evidence-sealed-independent-review-required',
  lessonComplete: false, canonicalPromotion: false, nativeFinalization: false,
  bindings, figures,
  authorHandoff: artifact(path.join(own, 'author-handoff.md')),
  accounting: {
    batches: 1, batchId: 'n34-figures-author7-single-batch',
    imageLoads: 7, imageTarget: 6, imageLimit: 8,
    contextImageLoads: 7, contextLimit: 24, reopens: 0, resets: 0, newBatches: 0,
    imageLoadOrder: imageLoads,
    originalLoads: 2, initialDesktopLoads: 2, initialMobileLoads: 2, affectedRepairLoads: 1,
    screenshotsGenerated: 5, finalScreenshots: 4, failedScreenshotsRetainedOnce: 1,
    figureCandidates: 2, figureContentRevisions: 0,
    captureOnlyRevisions: 1,
    inventoryMappingCorrections: 1,
    inventoryMappingCorrection: 'Before drawing, property-grid mapping corrected from three body rows to four rows including the observed blank header; observed source facts and source text unchanged.',
    standaloneDraftValidations: 2, rendererInternalDraftValidations: 2, nativeRenders: 2,
    displayCaptureCommands: 2, specValidationFailures: 0, nativeRenderFailures: 0,
    sourceContentFailures: 0, imageCaptureFailures: 1, readOnlyDiscoveryFailures: 1,
    paidCalls: 0, networkRequests: 0, dbOperations: 0, gitOperations: 0,
    peerMessages: 0, appEdits: 0, canonicalPromotions: 0, nativeFinalizes: 0,
  },
  firstFailuresRetained: [
    inventory.actualFailuresSoFar[0],
    {
      stage: 'mobile-table-full-media-capture',
      classification: 'author-visual-evidence-capture-failure',
      commandExitCode: 0,
      observation: repair.failure.observation,
      originalScreenshot: artifact(path.join(own, 'tbl-p0160-01.mobile.png')),
      originalDisplayReport: artifact(path.join(own, 'display.json')),
      correction: repair.captureTransform,
      affectedRepairReport: artifact(path.join(own, 'display.mobile-table-repair.json')),
      specOrSvgChanged: false,
      failureRecordCopies: 1,
    },
  ],
  nativeExecutionRecord: artifact(path.join(own, 'execution.json')),
  metadataRebinding: {
    originalNativeReportsRetained: true,
    fieldsChanged: ['spec.path', 'output.svg.path'],
    generatedSvgEdited: false,
    statusAndHashesPreserved: true,
    durableFilesWritten: false,
  },
  sourceAssumptions: inventory.unresolvedHistoricalFacts,
  nextOwner: 'Parent handles durable retention, source/native installation, independent mathematical/source-fidelity and cultural image reviews, and any later promotion.',
  seal: { fileMode: '0444', directoryMode: 'unchanged', allOwnedFilesOnly: true },
}
manifest.files = fs.readdirSync(own).sort().map(name => artifact(path.join(own, name)))
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n')
for (const name of fs.readdirSync(own)) {
  const file = path.join(own, name)
  assert(fs.statSync(file).isFile(), 'Only owned files may be sealed')
  fs.chmodSync(file, 0o444)
  assert.equal(fs.statSync(file).mode & 0o777, 0o444)
}
console.log(JSON.stringify({
  manifest: artifact(manifestFile),
  sealedFiles: fs.readdirSync(own).length,
  figures: figures.map(figure => ({
    id: figure.id, spec: figure.spec, svg: figure.svg, render: figure.renderReport,
    screenshots: { desktop: figure.authorVisualInspection.desktop, mobile: figure.authorVisualInspection.mobile },
  })),
  imageLoads: 7,
  failures: { discovery: 1, capture: 1, validation: 0, render: 0 },
  independentReview: 'required-not-performed',
}, null, 2))
