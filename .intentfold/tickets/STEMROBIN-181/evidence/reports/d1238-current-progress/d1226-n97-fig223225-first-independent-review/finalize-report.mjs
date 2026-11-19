import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), root)
const scratch = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.join(scratch, 'd1226-n97-fig223225-first-independent-review')
const author = path.join(scratch, 'd1214-n97-fig223225-first-author')
const textRoot = path.join(scratch, 'd1218-n97-rigid-rod-affected-repair')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = b => crypto.createHash('sha256').update(b).digest('hex')
const bind = p => ({ path: p, sha256: hash(fs.readFileSync(p)), bytes: fs.statSync(p).size })
const authorReport = bind(path.join(author, 'report.json'))
assert.equal(authorReport.sha256, 'fcc1d3855fb3c5da5248131074df2b9812e011861b77237a4f3369dd7ed3f24c')
const inventoryPath = path.join(out, 'source-inventory-freeze.json')
const inventory = read(inventoryPath)
const browserPath = path.join(out, 'browser-evidence.json')
const browser = read(browserPath)
assert.equal(inventory.candidateOpenedBeforeFreeze, false)
for (const b of browser.inputBindings) assert.equal(bind(b.path).sha256, b.sha256)

const texts = ['zh', 'en'].map(locale => {
  const file = path.join(textRoot, locale, 'lesson.template.json')
  const j = read(file)
  return { locale, binding: bind(file), paragraphs: j.prose.filter(p => p.kind === 'p').map(p => ({ lesson: j.id, text: p.text })) }
})
const currentText = texts.flatMap(t => t.paragraphs)
const maps = {
  'fig-223': [
    ['223-frames', ['k-origin','k-x-tip','k-y-tip','k-z-tip','k-x-axis','k-y-axis','k-z-axis','k-frame-name','k1-origin','k1-x-tip','k1-y-tip','k1-z-tip','k1-x-axis','k1-y-axis','k1-z-axis','k1-frame-name'],
      ['k-x-axis-connects','k-y-axis-connects','k-z-axis-connects','k1-x-axis-connects','k1-y-axis-connects','k1-z-axis-connects','origins-shared-horizontal','frame-y-parallel','frame-z-parallel']],
    ['223-velocity', ['velocity-tail','velocity-tip','frame-velocity','velocity-label'],
      ['frame-velocity-connects','velocity-tail-on-k1-y','velocity-right','velocity-parallel-x']],
    ['223-rod', ['rod-a','rod-b','longitudinal-rod','rod-ab'],
      ['rod-ab-connects','rod-a-right-of-k1','rod-end-order','rod-longitudinal-to-motion']],
  ],
  'fig-224': [
    ['224-frame', ['k1-origin','k1-x-tip','k1-y-tip','k1-z-tip','k1-x-axis','k1-y-axis','k1-z-axis','k1-frame-name'],
      ['k1-x-axis-connects','k1-y-axis-connects','k1-z-axis-connects','k1-y-vertical','k1-z-down-left','k1-x-right']],
    ['224-rod', ['rod-a','rod-b','rest-rod','rest-rod-ab'], ['rest-rod-ab-connects','rest-a-right-of-origin','rest-rod-end-order']],
    ['224-light', ['outbound-left','outbound-right','return-left','return-right','light-outbound','light-return'],
      ['light-outbound-connects','light-return-connects','outbound-rightward','return-leftward','outbound-a-projection','outbound-b-projection','return-a-projection','return-b-projection','outbound-covers-rest-length','return-covers-rest-length']],
    ['224-length', ['length-left','length-right','proper-length-right','proper-length-left','proper-length-text','a-apparatus-support','b-mirror-support'],
      ['proper-length-right-connects','proper-length-left-connects','dimension-a-projection','dimension-b-projection','proper-length-matches-rod','a-apparatus-support-connects','b-mirror-support-connects']],
  ],
  'fig-225': [
    ['225-frames', ['k-origin','k1-origin','k-x-axis','k1-x-axis','k-y-axis','k1-y-axis','k-z-axis','k1-z-axis','k-frame-name','k1-frame-name','frame-velocity','velocity-label'],
      ['origins-shared-horizontal','frame-y-parallel','frame-z-parallel','frame-velocity-connects','velocity-right','velocity-parallel-x']],
    ['225-rod-states', ['rod-a','rod-b','rod-a1','rod-b1','rod-a2','rod-b2','rod-a-b-body','rod-a1-b1-body','rod-a2-b2-body','rod-a-b','rod-a1-b1','rod-a2-b2'],
      ['rod-a-b-connects','rod-a1-b1-connects','rod-a2-b2-connects','same-rod-emission-reflection','same-rod-reflection-reception','a-outbound-motion','a-return-motion','b-outbound-motion','b-return-motion']],
    ['225-outward-travel', ['outbound-start','outbound-reflection','outbound-distance-right','outbound-distance-left','outbound-distance-text','a-emission-guide','b1-shared-reflection-guide'],
      ['outbound-emission-projection','outbound-reflection-projection','outbound-l-plus-shift1','outbound-distance-right-connects','outbound-distance-left-connects','b1-on-common-reflection-guide']],
    ['225-outward-shift', ['shift1-left','shift1-right','outbound-motion-right','outbound-motion-left','outbound-motion-text','a1-shift-guide'],
      ['shift1-a-projection','shift1-a1-projection','shift1-v-tau1','outbound-motion-right-connects','outbound-motion-left-connects']],
    ['225-return-shift', ['shift2-left','shift2-right','return-motion-right','return-motion-left','return-motion-text','a2-reception-guide'],
      ['shift2-a1-projection','shift2-a2-projection','shift2-v-tau2','return-motion-right-connects','return-motion-left-connects']],
    ['225-return-travel', ['return-reception','return-reflection','return-distance-right','return-distance-left','return-distance-text','b1-shared-reflection-guide'],
      ['return-reflection-projection','return-reception-projection','return-l-minus-shift2','return-distance-right-connects','return-distance-left-connects','b1-on-common-reflection-guide']],
  ],
}
const imageOpens = inventory.inventory.map((i, n) => ({
  ordinal: n + 1, kind: 'canonical-original', path: path.join(root, i.source), sha256: i.sha256,
  detail: 'original', openedOnce: true, beforeCandidateComparison: true,
}))
for (const [n, b] of browser.records.entries()) imageOpens.push({
  ordinal: n + 4, kind: 'unchanged-actual-SVG-headed-browser-screenshot', ...b.screenshot,
  detail: 'original', openedOnce: true,
})
for (const i of imageOpens) assert.equal(bind(i.path).sha256, i.sha256)
const findings = [
  {
    id: 'F01', severity: 'blocking', figures: ['fig-223','fig-224','fig-225'],
    gate: 'native-render', status: 'FAIL-UNCHANGED',
    finding: 'All three hash-bound repair1 native render receipts remain fail after the one allowed label-only repair. No native pass, promotion, further repair or renderer change is authorized or performed.',
    collisionCounts: { 'fig-223': 2, 'fig-224': 2, 'fig-225': 3 },
    disposition: 'STOP dependent promotion. Bounded diagnostic conclusions do not replace native clearance.',
  },
  {
    id: 'F02', severity: 'blocking', figures: ['fig-225'],
    gate: 'actual-svg-visual-readability', status: 'FAIL',
    objects: ['rod-a','rod-b','k-x-axis','k1-x-axis'],
    finding: 'Both A and B are visibly struck through by the shared horizontal axis shafts at y=220 SVG px. This is a real visible label/line overlap, independently of padded A/O1 adjacency in the native report.',
    evidence: {
      svgWidth: 640, axisY: 220, axisStrokeWidthPx: 2,
      aLabelBBox: { x: 233.5546875, y: 207.1875, width: 14.4453125, height: 22 },
      bLabelBBox: { x: 472, y: 207.1875, width: 14.4453125, height: 22 },
      axisShaftXRanges: [[95,563],[195,598]],
      sampledReadOnlyDOMHitsForA: ['ld-fig-225_ld-k-x-axis','ld-fig-225_ld-k1-x-axis'],
      screenshot: browser.records.find(r => r.id === 'fig-225').screenshot,
      nativeHasNoBLabelFlag: true,
      rendererInspection: 'geometryNodes checks only strokes >2.5 px and therefore omits these 2 px shafts from that stroke gate.',
    },
    disposition: 'Record and stop; repair quota already exhausted. No extra label repair.',
  },
  {
    id: 'F03', severity: 'binding-only', figures: ['fig-223','fig-224','fig-225'],
    gate: 'current-authoritative-text-snapshot', status: 'STALE-DESCRIPTOR-ONLY',
    finding: 'Every spec binds the older complete bilingual paragraph set, missing only the restored hard/rigid-rod descriptor in each opening paragraph. The current approved d1218 templates are the review authority; no optical equation, event convention or clock addition is affected.',
    currentTextBindings: texts.map(t => t.binding),
    disposition: 'Do not claim these spec text snapshots are byte-current. Reuse unaffected approved physics; no spec editing or text re-review.',
  },
  {
    id: 'D01', severity: 'diagnostic', figures: ['fig-223','fig-224','fig-225'],
    gate: 'raster-representation', status: 'BROWSER-REPRESENTATION-CONFIRMED',
    finding: 'Unlike the reported resvg previews, unchanged SVGs in headed Chromium resolve product CSS-variable shafts and gray/white rod fills. Fig223 clock circles and hands are visible. No resvg preview was reopened and no SVG was repaired.',
    scope: 'Neutral product role CSS at 640 px; not a new raster gate pass and not full application/lesson acceptance.',
  },
]
const figures = browser.records.map(b => {
  const id = b.id
  const base = path.join(author, 'figures', id, `${id}.repair1`)
  const spec = read(`${base}.spec.json`)
  const receipt = read(`${base}.render.json`)
  const source = inventory.inventory.find(i => i.id === id)
  assert.equal(bind(`${base}.spec.json`).sha256, receipt.spec.sha256)
  assert.equal(bind(`${base}.svg`).sha256, receipt.output.svg.sha256)
  assert.equal(bind(spec.source.image.path).sha256, source.sha256)
  const sourceMappings = maps[id].map(([requirement, objects, assertions]) => {
    assert(source.requirements.some(r => r.id === requirement))
    for (const object of objects) assert(spec.objects.some(o => o.id === object), `missing object ${object}`)
    for (const assertion of assertions) assert(spec.assertions.some(a => a.id === assertion), `missing assertion ${assertion}`)
    return { requirement, objects, assertions, mappingResolves: true, independentSourceFidelity: 'PASS' }
  })
  assert.equal(spec.source.authoritativeText.length, currentText.length)
  const mismatches = currentText.flatMap((paragraph, index) =>
    JSON.stringify(paragraph) === JSON.stringify(spec.source.authoritativeText[index]) ? [] :
      [{ index, specText: spec.source.authoritativeText[index].text, currentText: paragraph.text }])
  assert.deepEqual(mismatches.map(m => m.index), [0, texts[0].paragraphs.length])
  assert.equal(mismatches[0].currentText, mismatches[0].specText.replace('棒在惯性参考系', '硬质棒在惯性参考系'))
  assert.equal(mismatches[1].currentText, mismatches[1].specText.replace('The rod is at rest', 'The rigid rod is at rest'))
  const collisions = b.desktop.collisions.map(c => {
    const isX = c.id.includes('x-tip')
    return {
      id: c.id, text: c.text, nativeScore: c.score, exportedSvgDOMPaddedScore: c.reconstructedNativeScore,
      exactScoreReconstructed: c.score === c.reconstructedNativeScore,
      pointContributions: c.pointContributions, priorLabelContributions: c.priorLabelContributions,
      actualUnpaddedLabelOverlap: c.priorLabelContributions.reduce((sum, l) => sum + l.unpaddedArea, 0),
      visibleStrokeHits: c.visibleStrokeHits.map(n => n.id),
      outsidePaddedArea: c.outsidePaddedArea,
      classification: isX ? 'BOUNDED-PADDED-FOOTPRINT-FLAG-NO-VISIBLE-OVERLAP' :
        id === 'fig-224' ? 'PADDED-PRIOR-LABEL-CLEARANCE-FAIL-NO-GLYPH-OVERLAP' :
          'REAL-VISIBLE-AXIS-OVERLAP-PLUS-PADDED-PRIOR-LABEL-CLEARANCE-FAIL',
      diagnosis: isX ?
        'Visible size-1 point has a 4x4 px SVG ellipse bbox, but renderer avoids a 12x12 px square (radius size+5=6), combined with 4 px label padding. Its own padded label intrudes 0.8125 px into that avoid square across 12 px: 9.75 px^2. Actual ellipse/label bbox overlap is zero, with at least 6.6875 px separation after a 0.5 px point stroke. Not caused by a hidden construction point.' :
        id === 'fig-224' ?
          'A and O1 unpadded bboxes are separated horizontally by 4.875 px. Padding each by 4 px creates 3.125x30=93.75 px^2 overlap on the exported SVG (native 94.21875). Visible glyphs and shafts do not overlap; the pair is visibly crowded, and fails the stronger padded clearance contract.' :
          'A and O1 unpadded font bboxes meet at y=229.1875 without positive overlap. Their padded bboxes intersect by 145 px^2 on exported SVG (native 145.125). Independently, two visible 2 px axis shafts at y=220 cross A, and the same shafts visibly cross B although B is not flagged.',
      limitation: c.score === c.reconstructedNativeScore ? null :
        'The preserved native value differs by subpixel bbox area after SVG serialization/reload. No exact native-layout recreation or replay is claimed; the measured positive contributor and visible-overlap diagnosis are bounded to this exported specimen.',
      nativeGateNotOverridden: true,
    }
  })
  const validationPath = path.join(author, 'native', `${id}.validate.repair1.json`)
  const validation = read(validationPath)
  assert.equal(validation.exitCode, 0)
  assert.equal(JSON.parse(validation.stdout).status, 'pass')
  return {
    id, source: bind(path.join(root, source.source)),
    candidate: { spec: bind(`${base}.spec.json`), svg: bind(`${base}.svg`), render: bind(`${base}.render.json`) },
    sourceMappings,
    gates: {
      independentSourceFidelity: 'PASS',
      sourceRelationshipSemantics: 'PASS',
      nativeSpecValidation: 'INHERITED-PASS-HASH-BOUND-NOT-REPLAYED',
      nativeRender: 'FAIL-UNCHANGED',
      actualSvgReadability: id === 'fig-225' ? 'FAIL-A/B-AXIS-OVERLAP' : 'PASS',
      actualSvgCrowdingCaveat: id === 'fig-224' ? 'O1/A are readable but only 4.875 px apart; padded clearance still fails.' : null,
      actualSvgTextSize: 'PASS-20px-AT-640px',
      actualSvgMobileScrollReach: 'PASS-READ-ONLY-DOM',
      mathematicalOpticalTiming: 'PASS-SEMANTICS-ONLY',
      modernClockAndEventAdditions: 'PASS-SEMANTICS-ONLY',
      culturalAndVisibleLabelLanguage: 'PASS-English-and-mathematical-symbols',
      currentAuthoritativeTextBinding: 'STALE-DESCRIPTOR-ONLY',
      wholeQualityGate: 'FAIL',
      fullAppOrOfflineLessonAcceptance: 'NOT-PERFORMED',
      accentAndPrintThemeAcceptance: 'NOT-PERFORMED',
      promotionEligible: false,
    },
    inheritedValidation: bind(validationPath),
    nativeCollisionDiagnosis: collisions,
    textSnapshotMismatches: mismatches,
    modernAdditions: bind(path.join(author, 'figures', id, 'author-additions.json')),
    browserEvidence: { path: browserPath, recordId: id, screenshot: b.screenshot,
      actualDesktopMediaWidthPx: b.desktop.mediaWidth, actualMobileMediaWidthPx: b.mobile.mediaWidth,
      minTextPx: b.desktop.minTransformedTextPx, mobileScroll: b.mobile.scroll },
    observations: id === 'fig-223' ? [
      'One rod, not a fabricated transverse rod panel. All shared-frame identities and rightward v preserved.',
      'Source hatching regularized to gray vector fill; this does not encode a mathematical difference.',
      'Two identical detached K clocks aligned with endpoint x positions show equal t and K: same t. They are not depicted as clocks mounted on the moving rod.',
    ] : id === 'fig-224' ? [
      'Upper pulse goes A to B rightward, lower goes B to A leftward; both span the proper-length rod.',
      'l0 dimension and both supports preserved; no dial or numeric reading invented.',
    ] : [
      'All three equal rod states, source endpoint identities, four dimension labels and common B1 reflection guide preserved.',
      'Initial gray rod and later white-outline rods preserve the source filled/outline distinction.',
      'Vertical row offsets are successive-time layout, not actual transverse motion.',
      'All timing and optical paths are readable except the real A/B axis strikes.',
    ],
  }
})
const usage = {
  schema: 'bounded-independent-figure-review-usage@1', ticket: 'STEMROBIN-181',
  imagesOpened: 6, imageLimit: 8, parentReportedImages: '24/24', imagesReturnedToParent: 0,
  originalImages: 3, actualSvgBrowserImages: 3, reopens: 0, crops: 0, resvgImagesOpened: 0,
  actualOpens: imageOpens,
  headedBrowserLaunches: 1, nativeRenderExecutions: 0, nativeRenderReplays: 0, nativeValidationReplays: 0,
  browserSvgPresentations: 6, browserScreenshotsCreated: 3, paidCalls: 0,
  newAuthoring: 0, additionalRepairs: 0, priorRepairsUsedByAuthor: { 'fig-223': 1, 'fig-224': 1, 'fig-225': 1 },
  databaseOperations: 0, publishingOperations: 0, applicationStarts: 0, chatOperations: 0,
  gitReadOperations: ['status --short (initial context only)', 'rev-parse HEAD'],
  gitWriteOperations: 0, reverts: 0, sourceSpecSvgLabelRendererAppSkillEdits: 0,
  writesOutsideOwnershipRoot: 0, browserClosed: true,
}
fs.writeFileSync(path.join(out, 'usage.json'), JSON.stringify(usage, null, 2) + '\n')
const report = {
  schema: 'stemrobin/FIRST-independent-figure-review-bounded-diagnosis@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s4-n97', role: 'FIRST substantive independent fig223/224/225 review',
  cwd: root, ownershipRoot: out, completedAt: new Date().toISOString(),
  status: 'FAIL-NATIVE-ALL-THREE-AND-VISIBLE-FIG225',
  wholeCardPass: false, nativePassGranted: false, promotionPerformed: false,
  independence: {
    sourceInventoryFrozenBeforeCandidate: true, freeze: bind(inventoryPath),
    sourceOriginalsOpenedFirst: [1,2,3], candidatesOpenedOnlyAfterFreeze: true,
    firstSubstantiveIndependentFigureReview: true, noPreviousIndependentFigureVerdictReplayed: true,
  },
  authorReport, authorReportExpectedShaMatchedBeforeAndAfter: true,
  currentApprovedText: texts.map(t => ({ locale: t.locale, ...t.binding })),
  affectedTextReview: bind(path.join(scratch, 'd1219-n97-rigid-rod-affected-review/report.json')),
  unaffectedApprovedTextReused: true, fullSCIorTEXTReplay: false,
  findings, figures,
  opticalTimingConventions: {
    gate: 'PASS-SEMANTICS-ONLY',
    authority: 'Current d1218 zh/en prose[9,12,13,14], with unaffected d1219-approved text retained.',
    restFrame: 'K1: stationary A emits, stationary B reflects, stationary A receives. tau0 is the round trip on the rod clock; c tau0 = 2 l0. Fig224 contains no tau1/tau2 or false proper-time dial.',
    movingFrame: 'K: tau1 outbound A at emission to B1 at reflection; tau2 return B1 at reflection to A2 at reception. tau1 and tau2 are consecutive K-coordinate intervals, not independent proper times.',
    events: ['AB: t=0','A1B1: t=tau1','A2B2: t=tau1+tau2'],
    outbound: 'A_x=270, B1_x=510: path 240 = l(180) + shift1(60), labelled l+v tau1. v tau1=60; c/v=240/60=4.',
    return: 'B1_x=510, A2_x=366: path 144 = l(180) - shift2(36), labelled l-v tau2. v tau2=36; c/v=144/36=4.',
    equality: 'tau1=l/(c-v), tau2=l/(c+v); construction ratio tau1/tau2=60/36=5/3 equals (c+v)/(c-v) for construction v/c=1/4. These are unprinted layout units, not new givens.',
    total: 'tau=tau1+tau2; tau0=tau/gamma belongs to the rod-rest clock, not to the separated equal-t K clocks in fig223.',
    directedCues: 'Added upper c cue points right and lower c cue left; original double-ended dimension arrows remain dimensions.',
    sourceErratum: 'Current corrected l-v tau2 is used; this review does not re-open source pages or re-adjudicate the registered p0261 source erratum.',
  },
  clockAdditionsSeparateGate: {
    gate: 'PASS-SEMANTICS-ONLY',
    sourceHasClocks: false,
    fig223: 'Two matched detached dials at x=290 and x=455 have the same hand directions and t labels; K: same t identifies the K synchronization convention. Their 125-unit vertical offset avoids showing them mounted on the moving rod.',
    fig224: 'No clock dial added. Optical apparatus and l0 remain the source structure; tau0 explained by approved text.',
    fig225: 'Only coordinate-event time labels added; 0, tau1, tau1+tau2 correspond to emission/reflection/reception. No different proper-clock reading invented.',
    noProperCoordinateTimeConflationFound: true,
  },
  diagnosticBoundary: 'All native FAIL receipts are preserved. A bounded false-positive for visible-overlap interpretation is not a failure of the stronger clearance contract and is never approval. Fig225 has a real visual defect in addition. Stop here after exhausted repair; no renderer/spec/label change proposed as performed.',
  verificationScope: 'Unchanged SVG bytes inline in an offline headed Chromium surface using exact product role CSS and fixed 640px scroll media, at desktop1440x960 and mobile390x844. Product app not started, DB untouched, network blocked. Neutral screenshot per figure inspected once; mobile reach/text measured read-only without additional image opens. Not a full app or lesson render.',
  browserEvidence: bind(browserPath),
  contracts: ['.agents/skills/ld-s10y-image/SKILL.md','.agents/skills/ld-s10y-image/references/quality-gate.md','.agents/skills/ld-s10y-image/references/figure-spec.md','.claude/skills/ld-s10y-lesson/references/production-resume.md','.agents/skills/ld-s10y-image/scripts/render_spec.mjs','app/src/styles/app.css'].map(p => bind(path.join(root, p))),
  usage: bind(path.join(out, 'usage.json')),
  writtenEvidence: fs.readdirSync(out).map(file => bind(path.join(out, file))),
}
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ report: bind(path.join(out, 'report.json')), usage: bind(path.join(out, 'usage.json')),
  status: report.status, gates: figures.map(f => ({ id: f.id, ...f.gates })), images: usage.imagesOpened,
}, null, 2))
