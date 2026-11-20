import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const owner = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d174-n12-figures17-19-author')
const figures = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d174/figures')
assert.equal(process.cwd(), cwd)
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const specPath = (id) => path.join(figures, id, 'candidate-1', `${id}.spec.json`)
const s17 = load(specPath('fig-17'))
const s19 = load(specPath('fig-19'))
const constructionPath = path.join(figures, 'fig-19/candidate-1/ideal-construction.json')
const construction = load(constructionPath)
const m17 = new Map(s17.objects.map((object) => [object.id, object]))
assert.deepEqual(s17.objects.filter((object) => object.type === 'text').map((object) => object.text), ['h'])
assert.equal(s17.objects.filter((object) => object.type === 'point').length, 0)
assert.equal(s17.objects.filter((object) => object.type === 'arrow').length, 2)
assert.equal(s17.objects.filter((object) => object.type === 'svgPath').length, 4)
// Canonical paths bind the single continuous lumen and fill, not hidden fittings.
assert.equal(m17.get('src17-fluid').d, 'M148 490 L172 490 L172 565 Q172 625 255 625 Q338 625 338 565 L338 210 L362 210 L362 565 Q362 647 255 647 Q148 647 148 565 Z')
assert.equal(m17.get('src17-outer-wall').d, 'M145 400 L145 565 Q145 650 255 650 Q365 650 365 565 L365 50')
assert.equal(m17.get('src17-inner-wall-and-cap').d, 'M145 400 Q160 386 175 400 L175 565 Q175 620 255 620 Q335 620 335 565 L335 50')
assert.equal(m17.get('src17-open-rim').d, 'M335 50 C335 42 365 42 365 50 C365 58 335 58 335 50')
for (const [surface, guide, arrow, y] of [
  ['src17-low-surface', 'src17-low-guide', 'src17-height-lower', 230],
  ['src17-high-surface', 'src17-high-guide', 'src17-height-upper', 510],
]) {
  assert.equal(m17.get(surface).from[1], y)
  assert.equal(m17.get(surface).to[1], y)
  assert.equal(m17.get(guide).from[1], y)
  assert.equal(m17.get(guide).to[1], y)
  assert.equal(m17.get(arrow).to[1], y)
  assert.equal(m17.get(arrow).to[0], 470)
}
assert.equal(s17.display.purpose, 'instructional')
assert.equal(s19.display.purpose, 'instructional')
assert.deepEqual(s17.display.widths, [640])
assert.deepEqual(s19.display.widths, [640])
assert.deepEqual(s19.objects.filter((object) => object.type === 'text').map((object) => object.text), ['p', 'V', '0', 't1', 't2', 't2 > t1'])
assert.equal(s19.objects.filter((object) => object.type === 'point').length, 0)
assert.equal(s19.objects.filter((object) => object.type === 'segment').length, 1)
assert.equal(s19.objects.filter((object) => object.type === 'arrow').length, 2)
const curveChecks = []
for (const curve of construction.curves) {
  const object = s19.objects.find((object) => object.id === curve.id)
  assert.equal(object.type, 'svgPath')
  assert.equal(object.dash || 0, 0)
  const tokens = object.d.split(' ')
  assert.equal(tokens.length, curve.nodes * 2)
  const points = []
  let maximumPVResidual = 0
  for (let i = 0; i < tokens.length; i += 2) {
    assert.match(tokens[i], i ? /^L/ : /^M/)
    const x = Number(tokens[i].slice(1))
    const y = Number(tokens[i + 1])
    const V = x - 90
    const p = 515 - y
    assert(V > 0 && p > 0)
    assert(x >= 0 && x <= 640 && y >= 0 && y <= 600)
    const residual = Math.abs(p * V - curve.K)
    maximumPVResidual = Math.max(maximumPVResidual, residual)
    assert(residual < 0.00001, 'Path nodes must satisfy the ideal inverse law')
    if (points.length) {
      assert(V > points.at(-1).V)
      assert(p < points.at(-1).p)
    }
    points.push({ V, p })
  }
  assert(Math.abs(points[0].V - curve.minV) < 1e-7)
  assert(Math.abs(points.at(-1).V - curve.maxV) < 1e-7)
  assert(curve.maximumInterpolationErrorPx < 0.003)
  curveChecks.push({
    id: curve.id,
    samples: points.length,
    maximumPVResidualInUncalibratedLayoutCoordinates: maximumPVResidual,
    interpolationErrorBoundPx: curve.maximumInterpolationErrorPx,
    strictDecrease: true,
    positiveVolumeAndAbsolutePressure: true,
    convexityBasis: 'p_second_derivative=2*K/V^3 > 0 for K,V>0',
    status: 'pass',
  })
}
const [low, high] = construction.curves
assert(high.K > low.K && high.minV >= low.minV && high.maxV === low.maxV)
for (let V = high.minV; V <= high.maxV; V += 0.25) {
  assert(high.K / V > low.K / V)
}
const nativeResults = {}
for (const [id, validationId, renderId] of [
  ['fig-17', 'd174-002-fig17-first-validation', 'd174-004-fig17-first-render'],
  ['fig-19', 'd174-003-fig19-first-validation', 'd174-005-fig19-first-render'],
]) {
  const validationReceipt = path.join(owner, 'native', validationId, 'receipt.json')
  const renderReceipt = path.join(owner, 'native', renderId, 'receipt.json')
  assert.equal(load(validationReceipt).exitCode, 0)
  assert.equal(load(renderReceipt).exitCode, 0)
  const report = load(path.join(figures, id, 'candidate-1', `${id}.render.json`))
  assert.equal(report.status, 'pass')
  assert.equal(report.spec.sha256, bind(specPath(id)).sha256)
  assert.equal(report.output.svg.sha256, bind(path.join(figures, id, 'candidate-1', `${id}.svg`)).sha256)
  assert.equal(report.collisions.length, 0)
  assert(report.displayChecks.every((check) => check.status === 'pass'))
  nativeResults[id] = { validationReceipt: bind(validationReceipt), renderReceipt: bind(renderReceipt), renderStatus: report.status }
}
const result = {
  schema: 'STEMROBIN-181/D174-focused-author-geometry-evidence@1',
  cwd,
  checkedAt: new Date().toISOString(),
  status: 'pass',
  role: 'author_mechanical_check_not_independent_review',
  specs: ['fig-17', 'fig-19'].map((id) => bind(specPath(id))),
  idealConstruction: bind(constructionPath),
  fig17: {
    oneContinuousBentTube: true,
    shortCappedArmTallRim: true,
    oneContinuousFilledMercuryRegion: true,
    twoUnequalSurfaces: true,
    guidesAndHeightArrowEndpointsAligned: true,
    soleLabel: 'h',
    numericalCalibration: false,
    pressureDoublingOrVolumeHalvingInferredFromPixels: false,
    childOperationInstructionsAdded: false,
    note: 'Smooth canonical paths preserve the inventoried visible topology; they do not certify unknown cross-sections, measured heights or hidden joints.',
  },
  fig19: {
    curveChecks,
    sameVolumeOrdering: { status: 'pass', basis: '(K2-K1)/V > 0 over the shared positive V domain; no comparison of arbitrary different-volume states.' },
    sameTemperatureStateProcessDistinction: 'Each K is fixed on its own isotherm. Invisible rasterization samples are not added source states. No directional process or physical-phase change is drawn.',
    fixedGasAmount: 'Bound approved text; same amount on both isotherms.',
    absolutePressure: 'Bound approved text and common zero-origin p axis.',
    realGasLimits: 'Bound full approved bilingual text retained; construction claims ideal-gas law only.',
    numericalCalibration: false,
    numericRatiosClaimed: false,
    newPointsGuidesOrProcessArrows: false,
    exactLawAndRasterization: 'Analytical law is exact. The SVG polyline samples lie on p=K/V to rounding tolerance; interpolation error is bounded below 0.003 output pixels, not an exact polynomial representation of a hyperbola.',
    nativeAssertionLimitation: 'Native FigureSpec has no inverse-law assertion. Native validation still checks inventory/counts/frame/directions; this supplementary failing checker binds curve samples to the disclosed text-justified law.',
  },
  nativeResults,
  repairs: { 'fig-17': { inherited: 0, actual: 0, total: 0, cap: 1 }, 'fig-19': { inherited: 0, actual: 0, total: 0, cap: 1 } },
  independentFigureApproval: false,
  promotion: false,
}
write(path.join(owner, 'author-geometry-evidence.json'), result)
console.log(JSON.stringify({ status: 'pass', curveChecks, independentFigureApproval: false }))
