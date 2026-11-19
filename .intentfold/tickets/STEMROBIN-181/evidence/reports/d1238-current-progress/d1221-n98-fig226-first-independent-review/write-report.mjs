import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = process.cwd()
assert.equal(repo, '/Users/yong/.codex/worktrees/00b1/lemmadeck')
const own = path.dirname(fileURLToPath(import.meta.url))
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1210-n98-fig226-first-author')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const evidence = (file) => ({ path: path.relative(repo, file), sha256: hash(file), bytes: fs.statSync(file).size })
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const browser = load(path.join(own, 'browser-evidence.json'))
const native = load(path.join(own, 'fig-226.review.json'))
const inventory = load(path.join(own, 'source.inventory.json'))
assert.equal(browser.measurementStatus, 'pass')
assert.equal(browser.inputsUnchanged, true)
assert.equal(native.status, 'fail')
assert.equal(inventory.frozenBeforeReadingAuthorSpecOrReport, true)
for (const input of browser.inputsBefore) assert.equal(hash(path.join(repo, input.path)), input.sha256)
const specFile = path.join(author, 'fig-226.spec.json')
const svgFile = path.join(author, 'fig-226.svg')
const renderFile = path.join(author, 'fig-226.render.json')
assert.equal(native.spec.sha256, hash(specFile))
assert.equal(native.render.sha256, hash(renderFile))
assert.equal(native.outputs.svg.sha256, hash(svgFile))
const report = {
  schema: 'modern-figure-first-independent-review/v1',
  ticket: 'STEMROBIN-181',
  batch: 'D037',
  delegation: 'D1221',
  card: 'phy10-c2-s4-n98',
  figure: 'fig-226',
  stage: 'FIRST independent review of current candidate after author sole O1 label-layout repair',
  role: 'Independent reviewer; no authoring or repair',
  status: 'fail',
  outcome: 'FIRST-INDEPENDENT-VISUAL-FAIL',
  gates: {
    sourceInventory: 'PASS: independently frozen from canonical PNG and complete zh/en edition text before author report/spec',
    nativeSpecValidation: 'PASS',
    nativeRender: 'PASS: unchanged current ld-s10y-image/render@2 metadata and output hashes verified',
    mathematical: 'PASS: frame geometry, origins, directions, coincident X/X1 and parallel Y/Y1 and Z/Z1, velocity identities and units',
    visual: 'FAIL: source vector accents render as missing-glyph squares in actual headed Chromium screenshots',
    cultural: 'PASS: only mathematical Latin letters/subscripts and velocity notation; no source-language cultural text, flags, symbols or historical texture',
    completeLessonAcceptance: 'NOT RUN: restricted offline SVG/media review only',
    promotable: false,
  },
  independentOrder: [
    'Read ld-s10y-image SKILL, quality-gate, figure-spec and production-resume plus project routed rules.',
    'Open canonical source PNG once before candidate or author artifacts.',
    'Read both complete authoritative n98 lesson templates and independently derive frame/direction/unit requirements.',
    'Write and freeze own source.inventory.json.',
    'Then read author report, FIRST/current spec, SVG and native render metadata; independently confirm only O1 label offset differs.',
    'Run native rendered-stage validator without rerendering.',
    'Load unchanged current SVG in headed Chromium from the installed app Playwright package using current product CSS; all external browser requests blocked.',
    'Capture actual browser pixels at measured 640px in own scope and inspect four browser screenshots.',
    'Record native FAIL on unchanged spec/render/output after direct visual observation.',
  ],
  provenance: {
    canonicalSource: evidence(path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-226.png')),
    sourceReferencedByUnchangedSpec: evidence(path.join(author, 'root/10p/figures/fig-226.png')),
    canonicalEqualsSpecSource: true,
    frozenIndependentInventory: evidence(path.join(own, 'source.inventory.json')),
    authoritativeText: ['zh', 'en'].map((locale) => evidence(path.join(repo,
      `.intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author/${locale}/lesson.template.json`))),
    textReviewReuse: 'User states independent TEXT PASS; no text reauthoring or replacement. Figure review still reads the full texts independently.',
    current: {
      authorReport: evidence(path.join(author, 'report.json')),
      spec: evidence(specFile),
      render: evidence(renderFile),
      outputSvg: evidence(svgFile),
    },
    FIRST: {
      spec: evidence(path.join(author, 'FIRST/fig-226.spec.json')),
      render: evidence(path.join(author, 'FIRST/fig-226.render.json')),
      outputSvg: evidence(path.join(author, 'FIRST/fig-226.svg')),
      historicalVerdict: 'Author FIRST native render failed O1 label collision. Its retained render has historical paths, not a current-output binding.',
      openedHistoricalImages: false,
    },
    authorRepair: {
      evidence: evidence(path.join(author, 'repair.json')),
      independentlyVerifiedOnlyDiff: 'origin-O1.labelPlacement.offset added as [0, -10]',
      unchanged: ['geometry', 'assertions', 'source', 'authoritativeText', 'all other objects/labels'],
      reviewerRepairs: 0,
    },
    currentInputsStillMatchBrowserSnapshot: true,
  },
  sourceToCandidateComparison: [
    {
      id: 'source-frame-K',
      status: 'pass',
      objects: ['origin-O', 'axis-X', 'axis-Y', 'axis-Z', 'frame-K', 'axis-X-label', 'axis-Y-label', 'axis-Z-label'],
      assertions: ['connect-axis-X', 'connect-axis-Y', 'connect-axis-Z', 'positive-X', 'upward-Y', 'left-down-Z'],
      observed: 'O junction visible at SVG-screen (135,245). X right, Y up, Z down-left; all corresponding labels present.',
    },
    {
      id: 'source-frame-K1',
      status: 'pass',
      objects: ['origin-O1', 'axis-X1', 'axis-Y1', 'axis-Z1', 'frame-K1', 'axis-X1-label', 'axis-Y1-label', 'axis-Z1-label'],
      assertions: ['connect-axis-X1', 'connect-axis-Y1', 'connect-axis-Z1', 'positive-X1', 'upward-Y1', 'left-down-Z1'],
      observed: 'O1 junction visible at SVG-screen (270,245), right of O. Subscript identities remain correct; raised O1 label is readable and clear.',
    },
    {
      id: 'source-shared-frame',
      status: 'pass',
      objects: ['origin-O', 'origin-O1', 'axis-X', 'axis-X1', 'axis-Y', 'axis-Y1', 'axis-Z', 'axis-Z1'],
      assertions: ['origins-left-to-right', 'origin-O1-on-X', 'X-tips-collinear', 'intermediate-X-tip-before-X1', 'Y-Y1-parallel', 'Z-Z1-parallel'],
      observed: 'One combined diagram. All horizontal supports at screen y=245; two separate rightward X heads remain. Y shafts have identical direction (0,-182); Z shafts have identical down-left direction approximately (-87.272,87.272).',
    },
    {
      id: 'source-frame-velocity',
      status: 'geometry-pass-notation-visual-fail',
      objects: ['velocity-v', 'velocity-v-label', 'axis-Y1'],
      assertions: ['connect-velocity-v', 'v-tail-on-Y1', 'v-tail-above-O1', 'v-rightward', 'v-parallel-X'],
      observed: 'Rightward shaft begins at screen (270,110) on Y1; v identity is correct. Source vector accent above v is not actually drawn as an accent; it appears as a square.',
    },
    {
      id: 'source-object-velocity',
      status: 'geometry-pass-notation-visual-fail',
      objects: ['velocity-v1', 'velocity-v1-label'],
      assertions: ['connect-velocity-v1', 'v1-detached-right-and-above', 'v1-rightward', 'v1-parallel-X', 'velocity-level-order'],
      observed: 'Distinct rightward arrow begins at screen (392,182), above the common X line and right of O1. v1 identity/subscript is correct but vector accent is a missing-glyph square.',
      sourceTailAppearance: 'The source has a blackened rounded arrow-tail endpoint. The candidate uses a flat line terminus at its mapped detached endpoint, not a separate circular marker. This stylistic difference is recorded explicitly; neither edition gives it a separate labelled point/coordinate or particle-symbol meaning. No endpoint, relation, value or unit is lost. It is not used to excuse the independently failing vector-accent rendering.',
    },
    {
      id: 'source-counts-labels-units',
      status: 'counts-and-units-pass-vector-glyphs-fail',
      objects: ['origin-O', 'origin-O1', 'frame-K', 'frame-K1', 'velocity-v-label', 'velocity-v1-label'],
      assertions: ['connect-axis-X', 'connect-axis-X1', 'connect-axis-Y', 'connect-axis-Y1', 'connect-axis-Z', 'connect-axis-Z1', 'connect-velocity-v', 'connect-velocity-v1'],
      observed: 'Six axis shafts and two velocity shafts, eight visible heads, two visible origin junctions, twelve label nodes. No ticks, grids, numeric speeds, dimensions, units, v2/resultant arrow or answer formula added. Mathematical units agree with independent text reasoning.',
    },
  ],
  actualProductSvgEvidence: {
    authority: browser.authority,
    browser: browser.renderer,
    productCss: evidence(path.join(repo, 'app/src/styles/app.css')),
    browserEvidence: evidence(path.join(own, 'browser-evidence.json')),
    verificationScript: evidence(path.join(own, 'browser-check.mjs')),
    nativeValidation: evidence(path.join(own, 'native-validation.json')),
    viewports: [{ width: 1440, height: 960 }, { width: 390, height: 844 }],
    cases: browser.observations.map((item) => ({
      name: item.case, surface: item.surface, theme: item.theme, printMedia: item.printMedia,
      mediaWidthPx: item.mediaWidthPx, minimumTextPx: item.minimumTextPx,
      visibleNonzeroShafts: item.lines.length, arrowheads: item.heads.length,
      labels: item.labels.length, visibleOriginPoints: item.visiblePoints.length,
      labelBoundingBoxCollisions: item.labelCollisions,
      clippedLabels: item.clippedLabels,
      scrollEndReachable: item.scrollEndReachable,
      paintedShaftSamplesPass: item.actualScreenshotPixelChecks
        ? item.actualScreenshotPixelChecks.shafts.every((shaft) => shaft.paintedSampleCounts.every((count) => count > 0))
        : null,
    })),
    screenshots: browser.screenshots,
    directVisualObservations: [
      'All eight shaft strokes are visibly painted, not merely present in the DOM. Nine samples along each actual screenshot shaft are non-background in neutral, accent and print.',
      'Both vector velocity accents appear as hollow missing-glyph boxes following v rather than over-letter arrows. This is plainly visible in all four opened browser captures.',
      'O and O1 labels and frame/axis labels are readable. No collision or clipped label at the 640px media width.',
      'At mobile scroll end, the right-hand X1 head and label are reachable. Left-hand features are offscreen because this is intentionally scroll layout, not missing SVG geometry.',
    ],
    networkAllowed: false,
    blockedRequestCount: browser.network.blockedRequests.length,
    pageErrors: browser.pageErrors,
  },
  rendererRasterDiscrepancy: {
    retainedResvgPreview: evidence(path.join(author, 'fig-226.actual-svg-preview.png')),
    openedByThisReviewer: false,
    evidenceSource: 'Author report records that resvg preview loses all coordinate/velocity shafts. This reviewer neither reopens that raster nor treats it as authoritative.',
    independentlyEstablished: 'Actual headed Chromium screenshots of the same current SVG paint all eight shafts under product semantic CSS variables. Therefore that reported raster shaft-loss failure is distinct from the actual browser representation.',
    diagnosisLimit: 'No resvg rerun or root-cause proof. CSS-variable handling is a plausible renderer discrepancy, not asserted as a verified sole cause.',
    actualBrowserDefect: 'Missing vector-accent glyphs remains a separate visual failure despite correct shaft painting.',
  },
  findings: [
    {
      id: 'V1',
      severity: 'blocking',
      gate: 'visual',
      status: 'fail',
      title: 'Both velocity-vector accents render as missing-glyph squares',
      locations: ['velocity-v-label', 'velocity-v1-label'],
      encodedNotation: ['v followed by U+20D7 COMBINING RIGHT ARROW ABOVE', 'v followed by U+20D7 and subscript one'],
      expectedFromIndependentSource: 'Visible vector-arrow accents above v and v1, matching the source mathematical notation.',
      actual: 'Headed Chromium with unmodified product CSS and unchanged candidate SVG shows v plus a hollow square, and v plus a hollow square plus subscript one.',
      evidence: browser.screenshots,
      effect: 'Broken mathematical typography on the actual offline product media surface. Native label-node/count/style passes cannot approve a visibly missing glyph.',
      scopeResponse: 'FAIL retained. No new render_spec calls, spec/SVG/font/theme/app edits, workaround rendering, promotion or publication.',
    },
  ],
  nativeReview: {
    file: evidence(path.join(own, 'fig-226.review.json')),
    status: 'fail',
    commandExitCode: 0,
    command: 'env PYTHONDONTWRITEBYTECODE=1 python3 .agents/skills/ld-s10y-image/scripts/record_review.py --spec <unchanged current spec> --render <unchanged current render> --output tmp/d1221-n98-fig226-first-independent-review/fig-226.review.json --status fail --notes <independent browser verdict>',
    noPassReviewIssued: true,
  },
  usage: {
    imageOpens: 5,
    imageOpenBreakdown: { canonicalSource: 1, neutralBrowser: 1, accentBrowser: 1, printBrowser: 1, mobileScrollEndBrowser: 1 },
    imageCrops: 0,
    imageReopens: 0,
    wholeBatchLimit: 8,
    imagePayloadsReturnedToParent: 0,
    paidCalls: 0,
    newRenderSpecCalls: 0,
    reviewerRepairs: 0,
  },
  scope: {
    soleCwd: repo,
    exclusiveWriteRoot: own,
    referencedInputsUnchanged: true,
    otherEditsReverted: false,
    appOrProductCodeChanged: false,
    svgOrSpecEdited: false,
    dependenciesInstalled: false,
    databaseActions: false,
    publicationOrPromotion: false,
    gitWrites: false,
    chatsOrDelegations: false,
    externalWebAccess: false,
    browserClosed: true,
  },
  handoff: 'Text-only return. Overall independent figure FAIL. Mathematical geometry/units and cultural PASS; visual FAIL for actual-browser vector-accent tofu. Resvg shaft omission is not an actual product SVG defect on this measured browser surface. Retained native fail review and own screenshots/hashes are evidence only; unchanged author candidate is not promoted.',
}
fs.writeFileSync(path.join(own, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({
  status: report.status,
  mathematical: 'pass',
  visual: 'fail',
  cultural: 'pass',
  finding: 'V1: vector-accent missing glyphs in actual browser',
  report: evidence(path.join(own, 'report.json')),
  nativeReview: evidence(path.join(own, 'fig-226.review.json')),
  imageOpens: report.usage.imageOpens,
  referencedInputsUnchanged: true,
}, null, 2))
