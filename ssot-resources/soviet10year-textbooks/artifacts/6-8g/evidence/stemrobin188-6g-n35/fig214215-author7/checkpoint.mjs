import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), cwd)
const owned = path.dirname(fileURLToPath(import.meta.url))
const hash = filename => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
const write = (filename, data) => {
  assert.ok(path.resolve(filename).startsWith(`${owned}/`))
  fs.writeFileSync(filename, `${JSON.stringify(data, null, 2)}\n`)
}
const manifestPath = path.join(owned, 'manifest.json')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
assert.equal(manifest.status, 'display-pass-awaiting-author-inspection')
const portability = []
for (const figure of manifest.figures) {
  const beforePath = path.join(owned, 'figures', `${figure.id}.render.pre-portability.json`)
  assert.equal(hash(beforePath), figure.render.sha256)
  assert.equal(hash(figure.spec.path), figure.spec.sha256)
  assert.equal(hash(figure.svg.path), figure.svg.sha256)
  const report = JSON.parse(fs.readFileSync(figure.render.path, 'utf8'))
  assert.equal(report.status, 'pass')
  assert.equal(report.spec.sha256, figure.spec.sha256)
  assert.equal(report.output.svg.sha256, figure.svg.sha256)
  report.spec.path = `${manifest.root}/figures/${figure.id}.spec.json`
  report.output.svg.path = `${manifest.root}/figures/${figure.id}.svg`
  assert.ok(!path.isAbsolute(report.spec.path))
  assert.ok(!path.isAbsolute(report.output.svg.path))
  write(figure.render.path, report)
  const correction = {
    figure: figure.id, change: 'metadata-only-repo-relative-final-paths',
    before: { path: beforePath, sha256: hash(beforePath) },
    after: { path: figure.render.path, sha256: hash(figure.render.path) },
    specSha256Unchanged: figure.spec.sha256, svgSha256Unchanged: figure.svg.sha256,
    rerender: false, repeatedDisplayCheck: false,
  }
  portability.push(correction)
  figure.render.sha256 = correction.after.sha256
  figure.status = 'candidate-ready'
  figure.approval = 'pending-independent-approval'
}
const displayPath = path.join(owned, 'display.report.json')
const beforeDisplayPath = path.join(owned, 'display.report.pre-portability.json')
assert.equal(hash(beforeDisplayPath), manifest.display.sha256)
const display = JSON.parse(fs.readFileSync(displayPath, 'utf8'))
assert.equal(display.status, 'pass')
assert.equal(display.browserClosed, true)
display.bindings = manifest.figures.map(({ id, spec, svg, render }) => ({ id, spec, svg, render }))
display.metadataPortability = {
  before: { path: beforeDisplayPath, sha256: hash(beforeDisplayPath) },
  changes: portability,
  geometryAndScreenshotsUnchanged: true,
}
write(displayPath, display)
manifest.display.sha256 = hash(displayPath)
manifest.metadataPortability = portability
manifest.images.screenshotOpens = 2
manifest.images.contextImageLoads = 4
manifest.images.previousBatchImageHistoryReceived = 0
manifest.images.nativeSourcePixelViews = 2
manifest.images.nativeCombinedScreenshotPixelViews = 2
manifest.images.nativeSourceMetadataHeaderReads = 2
manifest.images.nativeSourceRasterLoadsByRenderer = 0
manifest.images.contextLoadEvents = [
  { kind: 'source', id: 'fig-214', path: manifest.figures[0].source.path, opens: 1, crop: false },
  { kind: 'source', id: 'fig-215', path: manifest.figures[1].source.path, opens: 1, crop: false },
  ...display.views.filter(view => view.screenshot).map(view => ({
    kind: 'combined-offline-screenshot', view: view.name, path: view.screenshot.path,
    sha256: view.screenshot.sha256, opens: 1, crop: false,
  })),
]
assert.equal(manifest.images.contextLoadEvents.length, 4)
assert.equal(manifest.images.rendererBrowsers, 4)
assert.equal(manifest.images.headedDisplayBrowsers, 1)
assert.equal(manifest.images.closedBrowsers, 5)
manifest.authorVisualComparison = {
  status: 'author-inspected-candidate', independentApproval: false,
  evidence: display.views.filter(view => view.screenshot).map(view => view.screenshot),
  sourcePixelComparison: 'Both originals opened once before creating source inventory/specs. Both final combined screenshots opened once; no source reopens, crops or pages.',
  observations: [
    'fig214: two vertical a/b panels; all eight A/B/C/D labels and four origin dots present. AC extends beyond both origins in each panel. The separate parallel supports, same-side upper rays and opposite-side lower rays remain faithful. Lower B label stays below its trace; lower C stays lower-right; D stays above its left-going trace.',
    'fig215: upper a row keeps A left of C and B above/D below the common rightward trace. The two b rows retain D,C,A,B and D,A,C,B point orders on individual common lines; thin supporting-line gaps do not imply ray membership. One b label covers the disjoint upper and overlap lower row.',
    'No numerical finite-length data, solution labels, answer keys, extra panels, foreign script or cultural symbols appear. Modern continuation arrowheads follow approved ray semantics, not a claim about ambiguous original printing.',
    'Desktop viewport 640px: actual media 400px; native scrollbar leaves a 625px containing surface. Mobile viewport 390px: actual media 358px. Additional 331px product width checked without producing/opening another screenshot. Minimum observed label size 16.549479166666668px.',
    'All final label bounds remain inside their media, geometry is nonblank, and the neutral SVG semantic roles remain legible. No new visual failure was found; no unchanged PASS was rerendered.',
  ],
}
manifest.status = 'candidate-ready'
manifest.approval = 'pending-independent-approval'
manifest.scripts = ['author.mjs', 'display.mjs', 'checkpoint.mjs'].map(name => {
  const filename = path.join(owned, name)
  return { path: filename, sha256: hash(filename) }
})
manifest.summary = {
  figures: 2, sourceSubfigures: 5, sourceInventoryGroups: 6,
  sourceNamedPoints: 20, originDots: 10, labels: 24,
  nativeAssertions: 41, additionalRelationshipChecks: 28,
  currentGeometryRevisions: { 'fig-214': 3, 'fig-215': 2 },
  nativeRenderInvocations: 4, unchangedPassRerenders: 0,
  validationFailures: 1, renderFailures: 2, displayFailures: 0,
  contextImageLoads: 4, imageCrops: 0, imageReopens: 0,
  screenshotsGeneratedAndOpened: 2, browserCloses: 5,
}
write(manifestPath, manifest)
console.log(JSON.stringify({
  status: manifest.status, approval: manifest.approval,
  manifest: { path: manifestPath, sha256: hash(manifestPath) },
  figures: manifest.figures.map(({ id, spec, svg, render }) => ({ id, spec, svg, render })),
  display: { path: displayPath, sha256: hash(displayPath) },
  summary: manifest.summary,
}, null, 2))
