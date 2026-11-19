import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp')
const D = path.join(T, 'd844-n86-fig200-first-independent-review')
const A = path.join(T, 'd831-n86-fig200-first-author')
assert.equal(process.cwd(), R)
assert.equal(fs.existsSync(path.join(D, 'report.json')), false)
process.env.TMPDIR = path.join(D, 'runtime')
process.env.PYTHONDONTWRITEBYTECODE = '1'
fs.mkdirSync(process.env.TMPDIR, { recursive: true })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const write = (name, value) => {
  const target = path.join(D, name)
  assert.ok(target.startsWith(`${D}/`))
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
}
const author = read(path.join(A, 'report.json'))
const decision = read(path.join(D, 'review-decision.json'))
const specPath = path.join(A, 'frozen/fig-200.spec.json')
const svgPath = path.join(A, 'frozen/fig-200.svg')
const renderPath = path.join(A, 'frozen/fig-200.render.json')
const spec = read(specPath)
const render = read(renderPath)
const svg = fs.readFileSync(svgPath, 'utf8')
const inputBindings = new Map()
function checkBindings(value) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const p = path.resolve(R, value.path)
    assert.ok(p.startsWith(`${R}/`), p)
    assert.equal(hash(p), value.sha256, `Changed input: ${p}`)
    inputBindings.set(p, bind(p))
  }
  for (const entry of Object.values(value)) checkBindings(entry)
}
checkBindings(author)
checkBindings(render)
const textClearancePath = path.join(T, 'd818-n86-center-contact-title-affected-review/report.json')
const textClearance = read(textClearancePath)
assert.equal(textClearance.status, 'PASS')
for (const locale of ['zh', 'en']) {
  const frozen = path.join(T, `d815-n86-center-contact-title-repair/frozen/${locale}/lesson.template.json`)
  const text = read(frozen)
  assert.equal(hash(frozen), textClearance.bindings[`${locale}Candidate`].sha256)
  assert.equal(hash(frozen), author.contextSourceHashes.templates[locale].lesson.sha256)
  const expected = text.prose.filter(p => typeof p.text === 'string' && p.text.trim()).map(p => p.text)
  const start = locale === 'zh' ? 0 : expected.length
  assert.deepEqual(spec.source.authoritativeText.slice(start, start + expected.length).map(p => p.text), expected)
}
const sourceInventoryPath = path.join(D, 'source-first-inventory.json')
const sourceInventory = read(sourceInventoryPath)
assert.equal(hash(sourceInventory.original.path), sourceInventory.original.expectedSha256)
assert.equal(sourceInventory.sequence.authorSpecReadBeforeThisInventory, false)
assert.equal(sourceInventory.sequence.authorInventoryFileReadBeforeThisInventory, false)
assert.equal(sourceInventory.sequence.modernOutputOpenedBeforeThisInventory, false)
assert.equal(spec.mode, 'deterministic')
assert.equal(spec.display.purpose, 'instructional')
assert.deepEqual(spec.display.widths, [331, 342, 640])
assert.equal(render.status, 'pass')
assert.deepEqual(render.collisions, [])
assert.equal(render.spec.sha256, hash(specPath))
assert.equal(render.output.svg.sha256, hash(svgPath))

const objectMap = new Map(spec.objects.map(o => [o.id, o]))
const assertionMap = new Map(spec.assertions.map(a => [a.id, a]))
for (const comparison of decision.comparison) {
  for (const id of comparison.mappedObjects) assert.ok(objectMap.has(id), id)
  for (const id of comparison.assertions) assert.ok(assertionMap.has(id), id)
}
const point = id => objectMap.get(id).at
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const C = point('raw200-curvature-center')
const P = point('raw200-ring-surface-point')
const Q = point('raw200-axis-at-gap-height')
const O = point('raw200-center-contact')
const F = point('raw200-gap-foot')
const radius = distance(C, O)
const ringRadius = distance(P, Q)
const gap = distance(P, F)
const upperLeg = distance(C, Q)
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`)
near(distance(C, P), radius)
near(upperLeg, radius - gap)
near(distance(Q, O), gap)
near(Q[0], C[0])
near(Q[1], P[1])
near(O[1], F[1])
near(P[0], F[0])
assert.ok(C[1] > Q[1] && Q[1] > O[1])
assert.ok(P[0] < O[0] && gap > 0)
const pythagoreanResidual = radius ** 2 - ringRadius ** 2 - upperLeg ** 2
const expandedResidual = 2 * radius * gap - ringRadius ** 2 - gap ** 2
near(pythagoreanResidual, 0)
near(expandedResidual, 0)
const curve = objectMap.get('raw200-curved-lens-surface')
assert.equal(curve.type, 'arc')
assert.equal(curve.center, 'raw200-curvature-center')
const guide = objectMap.get('modern-gap-guide')
assert.equal(guide.from, 'raw200-ring-surface-point')
near(guide.to[1], P[1])
const dimension = objectMap.get('modern-gap-dimension')
near(dimension.from[0], dimension.to[0])
near(dimension.from[1], F[1])
near(dimension.to[1], P[1])
const initialSpec = read(path.join(A, 'attempts/revision-0/fig-200.spec.json'))
const failedSpec = read(path.join(A, 'attempts/revision-1-first-render/fig-200.spec.json'))
const withWidth = structuredClone(initialSpec)
withWidth.display.widths = [331, 342, 640]
assert.deepEqual(withWidth, failedSpec)
const withLabels = structuredClone(failedSpec)
withLabels.objects.find(o => o.id === 'raw200-oblique-R').at = [-2.6, 5.3]
withLabels.objects.find(o => o.id === 'raw200-gap-k-subscript').at = [-6.14, 0.54]
assert.deepEqual(withLabels, spec)
assert.equal(read(path.join(A, 'attempts/revision-1-first-render/fig-200.render.json')).status, 'fail')

const python = path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const validatorPath = path.join(R, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
const args = ['-B', validatorPath, specPath, '--stage', 'rendered', '--json']
const validation = spawnSync(python, args, {
  cwd: R,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  encoding: 'utf8',
  timeout: 30000,
})
write('spec-validation-receipt.json', {
  command: python, args, cwd: R, exitCode: validation.status,
  signal: validation.signal, stdout: validation.stdout, stderr: validation.stderr,
  error: validation.error?.message ?? null, script: bind(validatorPath),
})
assert.equal(validation.status, 0, validation.stderr || validation.stdout)
const validationResult = JSON.parse(validation.stdout)
assert.equal(validationResult.status, 'pass')

const require = createRequire(path.join(R, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const browser = await chromium.launch({ headless: true })
const display = []
let networkRequests = 0
const errors = []
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  await context.route('**/*', async route => { networkRequests++; await route.abort() })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  for (const width of [331, 342, 640]) {
    await page.setViewportSize({ width, height: Math.ceil(width * 560 / 640) + 2 })
    await page.setContent(`<!doctype html><style>
      :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58; --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795; --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff; }
      html,body { margin:0; padding:0; background:#fff; }
      svg { width:${width}px; height:auto; display:block; }
    </style>${svg}`)
    await page.evaluate(() => document.fonts.ready)
    const measured = await page.evaluate(() => {
      const svg = document.querySelector('svg')
      const bounds = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const r = node.getBoundingClientRect()
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          effectiveTextPx: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          bounds: { x: r.x, y: r.y, width: r.width, height: r.height },
          inside: r.x >= bounds.x && r.y >= bounds.y && r.right <= bounds.right && r.bottom <= bounds.bottom,
          color: getComputedStyle(node).fill,
        }
      })
      const collisions = []
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i].bounds
        const b = labels[j].bounds
        if (Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 0.1 &&
            Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 0.1) {
          collisions.push([labels[i].id, labels[j].id])
        }
      }
      const arc = svg.querySelector('[id$="ld-raw200-curved-lens-surface"]')
      const length = arc.getTotalLength()
      const sample = fraction => {
        const p = arc.getPointAtLength(length * fraction)
        return [p.x, p.y]
      }
      return {
        width: bounds.width, height: bounds.height, labels, collisions,
        minimumTextPx: Math.min(...labels.map(l => l.effectiveTextPx)),
        unexpectedMedia: svg.querySelectorAll('image,script,foreignObject').length,
        scaleDisclosurePresent: /schematic|not to scale|magnif|exagger|enlarged/i.test(svg.textContent),
        arc: { start: sample(0), midpoint: sample(0.5), end: sample(1), length },
        viewBox: svg.getAttribute('viewBox'),
      }
    })
    assert.equal(measured.width, width)
    assert.equal(measured.minimumTextPx, 32 * width / 640)
    assert.deepEqual(measured.labels.map(l => l.text), ['R', 'R', 'r', 'k', 'h', 'k', 'Lens', 'Glass plate'])
    assert.ok(measured.labels.every(l => l.effectiveTextPx >= 16 && l.inside))
    assert.deepEqual(measured.collisions, [])
    assert.equal(measured.unexpectedMedia, 0)
    const [xMin, yMax, xMax, yMin] = spec.canvas.boundingBox
    const project = p => [(p[0] - xMin) * 640 / (xMax - xMin), (yMax - p[1]) * 560 / (yMax - yMin)]
    assert.ok(distance(measured.arc.start, project(point(curve.start))) < 0.001)
    assert.ok(distance(measured.arc.end, project(point(curve.end))) < 0.001)
    assert.ok(distance(measured.arc.midpoint, project(O)) < 0.001)
    display.push(measured)
  }
  assert.deepEqual(errors, [])
  assert.equal(networkRequests, 0)
  await context.close()
} finally {
  await browser.close()
}
assert.ok(display.every(d => d.scaleDisclosurePresent === false))
const plateObservation = path.join(T, 'd832-colorplate419-first-preparation/source-first.md')
const plateOriginal = path.join(T, 'd832-colorplate419-first-preparation/work/10p/pages/0419/page.png')
assert.ok(fs.readFileSync(plateObservation, 'utf8').includes('RomanV identity'))
const verification = {
  schema: 'd844/independent-input-geometry-svg-verification@1',
  status: 'PASS-TECHNICAL-CHECKS-DISCLOSURE-FAIL-REMAINS',
  inputBindings: [...inputBindings.values()],
  nativeSpecValidation: validationResult,
  sourceLabelGroups: sourceInventory.visibleMathematicalLabels,
  sourceNumericValues: [],
  approvedBilingualTextBoundExactly: true,
  authoritativeD818ClearanceReused: bind(textClearancePath),
  completeTextRereviewPerformed: false,
  geometry: { radius, ringRadius, gap, upperLeg, gapToRadiusRatio: gap / ringRadius, pythagoreanResidual, expandedResidual, actualSvgArcTouchesCenter: true },
  authorHistory: {
    verifiedHashBoundPreservedHistory: author.preservation,
    exactWidthOnlyRevision1: true,
    exactTwoLabelOnlyRenderRepair: true,
    firstFailedRenderStatusRetained: 'fail',
    newRepairs: 0,
    newRenderCalls: 0,
  },
  actualSvgDisplay: display,
  browser: { launches: 1, closed: true, networkRequests, pageErrors: errors, screenshots: 0 },
  savedPlateVObservation: bind(plateObservation),
  originalPlateVProvenanceOnlyNotOpened: bind(plateOriginal),
  sourceFirstInventory: bind(sourceInventoryPath),
}
write('verification.json', verification)
for (const item of inputBindings.values()) assert.equal(hash(item.path), item.sha256, `Input changed during review: ${item.path}`)
const report = {
  ...decision,
  root: R,
  authorizedWriteRoot: D,
  bindings: {
    originalSourcePng: bind(spec.source.image.path),
    spec: bind(specPath), svg: bind(svgPath), render: bind(renderPath),
    authorReport: bind(path.join(A, 'report.json')),
    independentSourceInventory: bind(sourceInventoryPath),
    verification: bind(path.join(D, 'verification.json')),
    nativeSpecValidationReceipt: bind(path.join(D, 'spec-validation-receipt.json')),
    firstHelperFailure: bind(path.join(D, 'FIRST-verification-helper-failure.json')),
    authorInventory: bind(path.join(A, 'source-inventory.json')),
    authorDisplayEvidence: bind(path.join(A, 'display-verification.json')),
    previews: author.finalOutputs.displayRasters,
    approvedBilingualText: author.contextSourceHashes.templates,
    textClearance: bind(textClearancePath),
    plateVSourceObservation: bind(plateObservation),
  },
  verificationSummary: {
    checkedAuthorAndRenderHashBindings: inputBindings.size,
    allInputsUnchangedAfterReview: true,
    nativeSpecStatus: validationResult.status,
    executableAssertions: spec.assertions.length,
    visibleSvgLabels: display[0].labels.length,
    geometryResiduals: verification.geometry,
    measuredMinimumTextPx: display.map(d => ({ width: d.width, px: d.minimumTextPx })),
    actualSvgTextCollisions: [],
    actualSvgScaleDisclosure: 'ABSENT-FAIL',
    sourceFirstComparisonGroups: decision.comparison.length,
    browserClosed: true,
  },
  preservedAuthorUsageNotRecounted: {
    ...author.actualUsage,
    note: 'Historical d831 counts preserved separately; none are new d844 review usage.',
  },
  freeze: { fileMode: '0444', directoryMode: '0555', manifest: path.join(D, 'hashes.sha256'), reportOnlyNotParentRecordReview: true },
}
write('report.json', report)
const summary = [
  '# FIRST Independent Fig200 Review',
  '',
  'STEMROBIN-181/181-3; phy10-c2-s3-n86; 2026-11-19.',
  '',
  'FIG: FAIL. One blocker: the visibly enlarged thin air layer has no learner-visible schematic / not-to-scale disclosure. The hidden illustrative-coordinate description does not satisfy that requirement.',
  '',
  'PASS: source R/R/r_k/h_k, complete shared right triangle, R-h_k upper leg versus full R, exact circular curvature, true central plate contact, nonzero off-center gap, no new numeric answer.',
  'Native spec: PASS, 23 assertions. Actual SVG: 8 readable labels; no label overlap or clipping. Minimum text at 331/342/640 px: 16.55/17.1/32 px.',
  '',
  'Approved d815 bilingual text and d818 affected PASS are hash-bound and reused, not rereviewed.',
  'Plate V: source observed in saved d832 physical419 evidence; Roman ownership / instructional spectral-color pipeline remain separately HOLD. No whole-n86 verdict or approval is issued.',
  '',
  'Original PNG reopened first; source-first inventory saved before author inventory/spec or modern previews. Report lookup incidentally exposed author summary claims, transparently disclosed in inventory.',
  'Author FIRST native/render failures, revision-1 snapshot and one render-layout repair are retained and hash-verified. No author repair or rerender was performed.',
  '',
  'Usage: 4 image loads in 1 batch (limit 8/batch, 24/context), 1 independent native spec validation, 1 offline SVG browser measurement, 0 new screenshots, 0 render calls, 0 paid calls, 0 repairs.',
  'All writes are inside this review directory. No core/source/figure/canonical/index/meter/Git/DB/publish/deploy/branch/worktree/other-chat operations.',
  '',
  'Report: report.json. Detailed measurement/input evidence: verification.json. Parent record_review was not run.',
]
fs.writeFileSync(path.join(D, 'summary.md'), `${summary.join('\n')}\n`, { flag: 'wx', mode: 0o600 })
const files = []
function collect(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, item.name)
    assert.equal(item.isSymbolicLink(), false, target)
    if (item.isDirectory()) collect(target)
    else files.push(target)
  }
}
collect(D)
fs.writeFileSync(path.join(D, 'hashes.sha256'), `${files.sort().map(p => `${hash(p)}  ${path.relative(D, p)}`).join('\n')}\n`, { flag: 'wx', mode: 0o600 })
function freeze(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, item.name)
    assert.equal(item.isSymbolicLink(), false, target)
    if (item.isDirectory()) freeze(target)
    else fs.chmodSync(target, 0o444)
  }
  fs.chmodSync(dir, 0o555)
}
freeze(D)
console.log(JSON.stringify({
  status: report.status, FIG: report.statuses.FIG,
  report: bind(path.join(D, 'report.json')),
  summary: bind(path.join(D, 'summary.md')),
  manifest: bind(path.join(D, 'hashes.sha256')),
  technicalVerification: bind(path.join(D, 'verification.json')),
  usage: report.actualUsage,
  frozen: true,
}, null, 2))
