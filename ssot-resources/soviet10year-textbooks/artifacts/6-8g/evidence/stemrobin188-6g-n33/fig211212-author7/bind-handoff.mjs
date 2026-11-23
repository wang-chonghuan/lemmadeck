import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
if (process.cwd() !== root) throw new Error('Wrong working directory')
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n33-fig211212-author7')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const artifact = (file) => ({ path: file, sha256: hash(file) })
const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const audit = { role: 'author-only', mathematicalDomain: 'display-plane geometry, not an asserted source metric or global geodesic model', figures: [] }
const vector = (a, b) => [b[0] - a[0], b[1] - a[1]]
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const norm = (v) => Math.hypot(...v)
const close = (a, b) => Math.abs(a - b) < 1e-7
const inSegment = (p, a, b) => Math.abs(cross(vector(a, b), vector(a, p))) < 1e-7 &&
  dot(vector(a, p), vector(b, p)) <= 1e-7
const segmentsMeet = (a, b, c, d) => {
  const v = vector(a, b), w = vector(c, d), denominator = cross(v, w)
  if (Math.abs(denominator) < 1e-9) return inSegment(a, c, d) || inSegment(b, c, d) || inSegment(c, a, b) || inSegment(d, a, b)
  const delta = vector(a, c)
  const t = cross(delta, w) / denominator, u = cross(delta, v) / denominator
  return t >= 0 && t <= 1 && u >= 0 && u <= 1
}
const turn = (radians) => (radians % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)
const inArc = (p, arc) => {
  const angle = (point) => Math.atan2(point[1] - arc.center[1], point[0] - arc.center[0])
  const radius = norm(vector(arc.center, arc.start))
  return close(norm(vector(arc.center, p)), radius) &&
    turn(angle(p) - angle(arc.start)) <= turn(angle(arc.end) - angle(arc.start)) + 1e-7
}
const listFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? listFiles(path.join(dir, entry.name)) : [path.join(dir, entry.name)],
)
const candidates = [['fig-211', 2], ['fig-212', 1]].map(([figure, candidate]) => {
  const dir = path.join(owned, figure, `candidate-${candidate}`)
  const specFile = path.join(dir, 'spec.json')
  const svgFile = path.join(dir, `${figure}.svg`)
  const reportFile = path.join(dir, 'render.json')
  const spec = json(specFile), render = json(reportFile)
  const obj = (id) => spec.objects.find((item) => item.id === id)
  const checks = {
    sourceHashCurrent: hash(path.join(root, spec.source.image.path)) === spec.source.image.sha256,
    specBindingCurrent: hash(specFile) === render.spec.sha256,
    svgBindingCurrent: hash(svgFile) === render.output.svg.sha256,
    rendererNoCollision: render.collisions.length === 0,
    declaredWidths: [640, 358].every((width) => spec.display.widths.includes(width)),
    labelMinimum16: render.displayChecks.every((item) => item.measuredMinPx >= 16),
    noGlobalEuclideanParallelAssertion: !spec.assertions.some((item) => item.type === 'parallel'),
    noInfiniteLineObject: !spec.objects.some((item) => item.type === 'line'),
    noHandSvgPath: !spec.objects.some((item) => item.type === 'svgPath'),
  }
  let mathematicalBasis
  if (figure === 'fig-211') {
    const a = obj('src211-a-trace'), b = obj('src211-b-trace'), c = obj('src211-c-trace'), p = obj('src211-P').at
    Object.assign(checks, {
      pWithinBothFiniteTraces: inSegment(p, b.from, b.to) && inSegment(p, c.from, c.to),
      pOffAndAboveA: p[1] > a.from[1] && !inSegment(p, a.from, a.to),
      bAndCNotIdenticalSlope: Math.abs(cross(vector(b.from, b.to), vector(c.from, c.to))) > 1,
      finiteBMissesA: !segmentsMeet(b.from, b.to, a.from, a.to),
      finiteCMissesA: !segmentsMeet(c.from, c.to, a.from, a.to),
      exactVisibleLabelSet: spec.objects.map((item) => item.label || item.text).filter(Boolean).sort().join(',') === 'P,a,b,c',
    })
    mathematicalBasis = 'Finite source-sketch incidences only; nonintersection of abstract geodesics with a is the supplied non-Euclidean hypothesis, not a full Euclidean-line conclusion.'
  } else {
    const base = obj('src212-baseline')
    const left = obj('src212-left-geodesic-trace'), right = obj('src212-right-geodesic-trace'), k = obj('src212-K').at
    const leftRadius = norm(vector(left.center, left.start)), rightRadius = norm(vector(right.center, right.start))
    const leftFoot = [left.center[0] - leftRadius, left.center[1]]
    const rightFoot = [right.center[0] + rightRadius, right.center[1]]
    const tangentPerpendicular = (foot, arc) => {
      const radiusVector = vector(arc.center, foot)
      const tangent = [-radiusVector[1], radiusVector[0]]
      return Math.abs(dot(tangent, vector(base.from, base.to))) < 1e-7
    }
    Object.assign(checks, {
      exactlyTwoCircularArcObjects: spec.objects.filter((item) => item.type === 'arc').length === 2,
      kWithinBothFiniteArcSpans: inArc(k, left) && inArc(k, right),
      feetDistinctOnFiniteBaseline: !close(leftFoot[0], rightFoot[0]) && inSegment(leftFoot, base.from, base.to) && inSegment(rightFoot, base.from, base.to),
      feetWithinBothRenderedArcSpans: inArc(leftFoot, left) && inArc(rightFoot, right),
      actualCircleTangentsPerpendicularAtFeet: tangentPerpendicular(leftFoot, left) && tangentPerpendicular(rightFoot, right),
      upperContinuationsBeyondK: left.start[1] > k[1] && right.end[1] > k[1] && left.start[0] > k[0] && right.end[0] < k[0],
      lowerTailsBelowBaselineRightLonger: left.end[1] < base.from[1] && right.start[1] < left.end[1],
      distinctHiddenCentersAndRadii: !close(leftRadius, rightRadius) && !close(left.center[0], right.center[0]),
      inwardRightAngleCorners: obj('src212-left-rightangle-side').from[0] > leftFoot[0] && obj('src212-right-rightangle-side').from[0] < rightFoot[0],
      noExtraLabelsOrCrossingDot: spec.objects.map((item) => item.label || item.text).filter(Boolean).join(',') === 'K' && obj('src212-K').visible === false,
    })
    mathematicalBasis = 'Circular arcs are illustrative modern regularization only. Horizontal radius vectors at the feet give vertical display tangents; both finite arc spans contain the computed upper crossing K. No particular non-Euclidean model/metric is asserted.'
  }
  audit.figures.push({ figure, candidate, spec: artifact(specFile), checks, mathematicalBasis })
  return {
    figure, candidate, status: 'author-candidate-awaiting-independent-review',
    source: { path: path.join(root, spec.source.image.path), sha256: spec.source.image.sha256 },
    spec: artifact(specFile), svg: artifact(svgFile), render: artifact(reportFile),
    display: artifact(path.join(dir, 'display-640-358.json')),
    screenshots: ['desktop-640.png', 'mobile-358.png'].map((name) => artifact(path.join(dir, name))),
    revisions: figure === 'fig-211' ? 1 : 0, mathematicalBasis,
  }
})
const auditFile = path.join(owned, 'author-geometry-audit.json')
save(auditFile, audit)
if (audit.figures.some((item) => Object.values(item.checks).some((value) => value !== true))) {
  console.log(JSON.stringify(audit, null, 2))
  throw new Error('Author audit identified an unresolved candidate defect; no manifest finalized')
}
const initialRun = json(path.join(owned, 'author-run.json'))
const manifest = {
  schema: 'n33-fig211212-author-manifest@1',
  status: 'author-candidates-awaiting-independent-review', role: 'author; not independent reviewer',
  cwd: root, writeBoundary: owned, figures: candidates,
  input: initialRun.input,
  inputUnchanged: hash(initialRun.input.path) === initialRun.input.sha256,
  sourceInventory: artifact(path.join(owned, 'source-inventory.md')),
  observations: artifact(path.join(owned, 'observations.md')),
  mathematicalAudit: artifact(auditFile),
  actualFailures: { figureRender: 1, failedFigure: 'fig-211', candidate: 1, reason: 'P-label padded footprint hits trace, score 10000', otherToolFaults: 0, failedImageLoads: 0, sourceMathematicalDefectsIdentified: 0 },
  revisionCounts: { 'fig-211': 1, 'fig-212': 0, total: 1 },
  imageBudget: {
    batchLimit: 8, contextLimit: 24, batchLoads: 7, contextLoads: 7,
    originals: 2, screenshotsGenerated: 5, screenshotsLoaded: 5, crops: 0, reopens: 0,
    ledger: [
      candidates[0].source.path, candidates[1].source.path,
      path.join(owned, 'fig-211/candidate-1/desktop-640.png'),
      candidates[1].screenshots[0].path, candidates[1].screenshots[1].path,
      candidates[0].screenshots[0].path, candidates[0].screenshots[1].path,
    ],
  },
  limits: [
    'No independent source/mathematical review, review@1, final PASS, canonical promotion or product-surface verification.',
    'Offline headless SVG display only; requested desktop640/mobile358 inspected. Extra renderer-only352 guard satisfies existing inline validator.',
    'Exact glyph/script and line-dash convention remain UNKNOWN; Latin K and smooth continuous strokes are provisional modern author regularization.',
    'No complete Euclidean parallelism in fig211; no source-given metric/model/circle/radius/equality in fig212.',
    'No answers, old choices, interactions, tests, env, DB, network, Git, dependency changes, subagents, messages, source finalization, assembly or index changes.',
  ],
  retainedFiles: listFiles(owned).sort().map(artifact),
}
if (!manifest.inputUnchanged) throw new Error('Input changed during author work')
const manifestFile = path.join(owned, 'manifest.json')
save(manifestFile, manifest)
console.log(JSON.stringify({
  manifest: artifact(manifestFile),
  candidates: candidates.map(({ figure, candidate, spec, svg, render, display }) => ({ figure, candidate, spec, svg, render, display })),
  geometryChecks: audit.figures.map(({ figure, checks }) => ({ figure, checks })),
}, null, 2))
