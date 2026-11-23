import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), repo)
const work = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig216-author7')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = name => ({ path: name, sha256: hash(path.join(work, name)) })
const load = name => JSON.parse(fs.readFileSync(path.join(work, name), 'utf8'))
const render = load('fig-216.render.json')
const display = load('display-report.json')
const relationships = load('relationship-check.json')
const context = load('authoritative-context.json')
assert.equal(render.status, 'pass')
assert.equal(display.status, 'pass')
assert.equal(display.browserClosed, true)
assert.equal(relationships.status, 'pass')
assert.equal(display.screenshotCaptures, 2)
const manifest = {
  schema: 'ld-s10y-image/candidate-batch@1',
  status: 'candidate-only',
  batch: ['fig-216'],
  pathBase: 'Manifest directory; current candidates and evidence are physically here, not promoted.',
  finalRoot: 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral',
  figures: [{
    id: 'fig-216',
    current: { 'spec.json': record('fig-216.spec.json'), svg: record('fig-216.svg'), 'render.json': record('fig-216.render.json') },
    canonicalPaths: {
      'spec.json': 'figures/fig-216.spec.json',
      svg: 'figures/fig-216.svg',
      'render.json': 'figures/fig-216.render.json'
    },
    nativeRenderStatus: render.status,
    independentReview: 'Not performed. Independent source/text/visual review remains separate; no review@1 produced.',
    authorVisualObservation: 'The original PNG was opened once before inventory/spec authoring. Both combined headed screenshots were opened once each. Both panels, all eight rays, all three extended origin-joining supports, the unmarked crossing, five panel-b origin markers and all ten modern mathematical/panel labels are visible. No equal-length/equal-angle mark, scale, invented labelled point or cultural print identity was added. No screenshot/crop/reopen was repeated.'
  }],
  authoritativeContext: {
    record: record('authoritative-context.json'),
    templates: ['lesson.template.json', 'exercises.template.json'].map(name => ({
      path: context[name].path, sha256: context[name].sha256,
      completeTextBinding: `authoritative-context.json[${JSON.stringify(name)}].fullJSONText; also embedded in spec.source.authoritativeText; JSON.parse restores exact complete approved file text.`
    })),
    original: context.original,
    independentInventory: record('source-inventory.json'),
    unknownSourceIdentities: ['original glyph', 'original script', 'original printing', 'original dash']
  },
  headedDisplay: {
    status: display.status,
    report: record('display-report.json'),
    scope: display.fixture,
    productCss: display.appCss,
    desktopReusedAfterMobileOnlyRepair: true,
    browserClosed: true,
    views: display.views.map(view => ({
      viewport: view.viewport, status: view.status,
      media: view.figures.map(figure => ({
        widthPx: figure.mediaWidth, heightPx: figure.mediaHeight,
        minimumLabelPx: figure.minimumTextPx, labels: figure.labelCount,
        inkPixels: figure.inkPixels, blank: figure.blank, clipped: figure.clipped
      })),
      screenshot: view.screenshot, fixture: view.fixture
    }))
  },
  evidence: {
    relationships: record('relationship-check.json'),
    executableRelationshipContract: record('relationship-contract.json'),
    executableRelationshipDisplayCheck: record('check-display.mjs'),
    executableAffectedMobileCheck: record('check-mobile-r1.mjs'),
    originalProducerBeforePathPortabilityOnly: record('fig-216.render.pre-portability.json'),
    firstFailuresAndRevisions: [
      'native-render-execution.json', 'fig-216.spec.first-failure.json',
      'native-render-execution.r1.json', 'fig-216.spec.r1-failure.json',
      'fig-216.r1-failure.svg', 'fig-216.render.r1-failure.json',
      'native-render-execution.r2.json', 'display-report.first-failure.json', 'display.first-failure.html'
    ].map(record)
  },
  counters: {
    imagesLoadedBatch: 3, imagesLoadedContext: 3, inheritedImages: 0,
    sourceOpens: 1, screenshotOpens: 2, screenshotCaptures: 2, crops: 0, reopens: 0,
    nativeRenderInvocations: 3, nativeValidatorInvocationsInsideRender: 3,
    nativeSuccessfulRenders: 1, nativeFailedCalls: 2, actualSVGRenderBrowserRuns: 2,
    contentRevisions: 2, displayFixtureRevisions: 1, totalRevisions: 3,
    supplementalRelationshipInvocations: 1, supplementalAssertions: relationships.checks.length,
    nativeAssertions: relationships.nativeAssertions, headedDisplayInvocations: 2,
    desktopScreenshotCaptures: 1, mobileScreenshotCaptures: 1,
    headedBrowserLaunches: 2, browserLaunchesTotal: 4,
    recordReviewInvocations: 0, unchangedPassRerenders: 0,
    paidCalls: 0, networkRequests: 0, canonicalWrites: 0,
    finalizerCalls: 0, dbCalls: 0, installCalls: 0, gitCalls: 0, peerCalls: 0
  }
}
assert.equal(render.spec.sha256, manifest.figures[0].current['spec.json'].sha256)
assert.equal(render.output.svg.sha256, manifest.figures[0].current.svg.sha256)
fs.writeFileSync(path.join(work, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' })
for (const entry of fs.readdirSync(work, { withFileTypes: true }))
  if (entry.isFile()) fs.chmodSync(path.join(work, entry.name), 0o444)
console.log(JSON.stringify({
  root: work, status: manifest.status,
  files: ['fig-216.spec.json', 'fig-216.svg', 'fig-216.render.json', 'manifest.json'].map(record),
  counters: manifest.counters, immutable: true, browserClosed: true
}, null, 2))
