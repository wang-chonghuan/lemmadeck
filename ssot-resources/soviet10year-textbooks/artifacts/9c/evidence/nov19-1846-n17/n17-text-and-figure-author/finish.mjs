import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck'
const out = path.join(root, '.tmp/stemrobin-184-six/n17-text-and-figure-author')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bound = (file) => ({ path: file, sha256: hash(file) })
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`)
const review = read(path.join(out, 'text-review.json'))
const observations = read(path.join(out, 'context-observations.json'))
const rendererPath = path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
const require = createRequire(rendererPath)
const { chromium } = require('playwright-core')
const browserPath = [
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((file) => fs.existsSync(file))
if (!browserPath) throw new Error('Existing local Chromium unavailable; no installation is authorized.')
const inputHashChecks = [
  ...review.templates,
  ...review.sources,
  ...review.authoritativePageText,
  review.reviewMarkdown,
].map((item) => ({
  ...item,
  currentSha256: hash(item.path),
  current: hash(item.path) === item.sha256,
}))
if (inputHashChecks.some((item) => !item.current)) {
  write('completion.json', { status: 'hold-input-changed', inputHashChecks })
  throw new Error('A reviewed input changed; do not reuse this review.')
}

const machine = []
const validations = []
const candidates = []
const browser = await chromium.launch({ executablePath: browserPath, headless: true })
try {
  const page = await browser.newPage()
  await page.route('**/*', (route) => route.abort())
  for (const id of ['fig-07', 'fig-08']) {
    const specPath = path.join(out, `${id}.spec.json`)
    const svgPath = path.join(out, `${id}.svg`)
    const renderPath = path.join(out, `${id}.render.json`)
    const spec = read(specPath)
    const render = read(renderPath)
    const validation = spawnSync('python3', [
      path.join(root, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
      specPath, '--stage', 'rendered', '--json',
    ], { encoding: 'utf8', cwd: root })
    validations.push({ figure: id, exitCode: validation.status, result: JSON.parse(validation.stdout) })
    if (validation.status !== 0) throw new Error(`${id}: rendered-stage validation failed`)
    if (render.status !== 'pass' || render.spec.sha256 !== hash(specPath)
      || render.output.svg.sha256 !== hash(svgPath)) {
      throw new Error(`${id}: render evidence failed or stale`)
    }
    const svg = fs.readFileSync(svgPath, 'utf8')
    for (const width of spec.display.widths) {
      await page.setViewportSize({ width: Math.max(width + 32, 390), height: 400 })
      await page.setContent(`<!doctype html><html><head><style>
        body{margin:0}.container{width:${width}px}
        .figure-media{width:${spec.display.maxWidthPx}px;max-width:100%;font-size:16px;
          --ld-figure-ink:#111;--ld-figure-paper:#fff}
        svg{display:block;width:100%;max-width:100%;height:auto}
      </style></head><body><div class="container"><div class="figure-media">${svg}</div></div></body></html>`)
      const check = await page.evaluate(({ id, width }) => {
        const svg = document.querySelector('svg')
        const rect = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('[data-label-id]')].map((node) => {
          const ctm = node.getScreenCTM()
          const box = node.getBoundingClientRect()
          return {
            id: node.getAttribute('data-label-id'),
            text: node.textContent,
            actualFontPx: Number(node.getAttribute('font-size')) * Math.hypot(ctm.a, ctm.b),
            insideMedia: box.left >= rect.left && box.right <= rect.right
              && box.top >= rect.top && box.bottom <= rect.bottom,
          }
        })
        const endpoints = ['left', 'right'].map((side) => {
          const node = svg.querySelector(`[id="ld-${id}_ld-${id}-${side}"]`)
          return {
            side,
            type: node?.tagName,
            visible: node ? getComputedStyle(node).display !== 'none' : false,
            fill: node?.getAttribute('fill'),
            stroke: node?.getAttribute('stroke'),
            expectedOpen: id === 'fig-08',
            stateMatches: node?.getAttribute('fill')?.includes(
              id === 'fig-08' ? '--ld-figure-paper' : '--ld-figure-ink',
            ),
          }
        })
        return {
          figure: id, declaredWidth: width, actualMediaWidth: rect.width, actualMediaHeight: rect.height,
          labels, endpoints,
          materializedRightArrowhead: !!svg.querySelector('[data-arrowhead-for]'),
          sourceGlyphResolutionClaim: false,
        }
      }, { id, width })
      check.pass = Math.abs(check.actualMediaWidth - width) < 0.1
        && check.labels.length === 3
        && check.labels.every((label) => label.actualFontPx >= 16 && label.insideMedia)
        && check.endpoints.every((point) => point.visible && point.stateMatches)
        && check.materializedRightArrowhead
      machine.push(check)
    }
    candidates.push({
      figure: id,
      status: 'draft-rendered-not-independently-reviewed',
      mode: 'deterministic',
      spec: bound(specPath),
      svg: bound(svgPath),
      render: bound(renderPath),
      source: spec.source.image,
      sourceHashCurrent: hash(spec.source.image.path) === spec.source.image.sha256,
      renderedStageValidation: 'pass',
      renderStatus: render.status,
      renderLabels: render.labels,
      renderCollisions: render.collisions,
      display: spec.display,
      renderDisplayChecks: render.displayChecks,
      contentRepairCount: 1,
      firstFailedAttempt: ['spec.json', 'svg', 'render.json'].map((extension) =>
        bound(path.join(out, 'attempt-1', `${id}.${extension}`))),
      firstAttemptStatus: read(path.join(out, 'attempt-1', `${id}.render.json`)).status,
      repair: 'Increase the explicit below-axis label gap to 80 canvas px; no coordinates, values, endpoint states or source facts changed; no SVG edited by hand.',
      visualReview: 'not-performed',
      independentReviewPass: false,
      promoted: false,
      holds: id === 'fig-07'
        ? ['Source caption p0067#11 UNKNOWN/HOLD remains.', 'Actual candidate visual and headed product inspection pending independent reviewer.']
        : ['Central source glyph UNKNOWN/HOLD remains; -5 is only an explicit edition-authorized modern addition.', 'Lossless central source-character fidelity is HOLD.', 'Actual candidate visual and headed product inspection pending independent reviewer.'],
    })
  }
} finally {
  await browser.close()
}
write('machine-check.json', {
  scope: 'No-image DOM and existing validator checks only; no screenshot, crop, source reopen, or image payload',
  status: machine.every((item) => item.pass) ? 'pass' : 'fail',
  renderer: bound(rendererPath),
  renderedStageValidations: validations,
  widthAndEndpointChecks: machine,
  candidateVisualObservations: 0,
  doesNotProve: ['source pixel fidelity', 'actual visual legibility', 'cultural/independent figure review', 'full offline lesson or headed product layout'],
})
write('completion.json', {
  scope: '184-6 / section 17 / current replacement text reviewer and candidate figure author',
  workspace: root,
  outputDirectory: out,
  status: 'offline-assignment-completed-with-holds',
  textReview: bound(path.join(out, 'text-review.json')),
  textReviewMarkdown: bound(path.join(out, 'text-review.md')),
  textConclusion: review.status,
  sourceBlocks: 29,
  exercises: { count: 14, range: [134, 147] },
  formulaChecks: { count: review.checks.formulaCount, errors: review.checks.formulaErrors },
  inputHashChecks,
  candidates,
  machineChecks: bound(path.join(out, 'machine-check.json')),
  imageHistory: observations.phaseHistory,
  currentContextImageObservations: observations.currentContext,
  noAdditionalImageOpens: true,
  observationRecord: bound(path.join(out, 'context-observations.json')),
  remainingHolds: [
    ...review.holds,
    'Source-retained shared instruction paragraphs remain at the prose tail; final layout acceptance/ownership remains with parent.',
    'Candidate visual review must be performed by a different-duty independent reviewer; no image review@1 PASS exists here.',
  ],
  prohibitedActionsPerformed: [],
  templateEdits: false,
  durableAssetEdits: false,
  databaseOrBackendCalls: false,
  paidServiceCalls: 0,
  image429: false,
  approvals: { source: false, figureIndependent: false, lessonPromotion: false },
})
const paths = []
function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) collect(file)
    else if (entry.name !== 'artifact-manifest.json') paths.push(file)
  }
}
collect(out)
write('artifact-manifest.json', {
  scope: 'Every author artifact under the authorized scratch directory; no image payloads',
  artifacts: paths.sort().map((file) => ({ ...bound(file), bytes: fs.statSync(file).size })),
  selfHashNote: 'Manifest SHA-256 is printed separately, not recursively embedded.',
})
console.log(JSON.stringify({
  completion: bound(path.join(out, 'completion.json')),
  manifest: bound(path.join(out, 'artifact-manifest.json')),
  artifacts: paths.length + 1,
  textContentChecks: review.checks.allMachineChecks,
  renderCandidates: candidates.map((c) => ({ figure: c.figure, status: c.status, render: c.renderStatus })),
  noImageMachineChecks: machine.every((item) => item.pass),
  historicalImageObservations: observations.phaseHistory,
}, null, 2))
if (machine.some((item) => !item.pass)) process.exitCode = 1
