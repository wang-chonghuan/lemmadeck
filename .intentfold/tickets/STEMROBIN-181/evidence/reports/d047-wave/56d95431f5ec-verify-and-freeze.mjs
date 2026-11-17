import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const A = path.dirname(fileURLToPath(import.meta.url))
const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const require = createRequire(`${W}/app/package.json`)
const { chromium } = require('playwright')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: file, sha256: sha(file) })
const write = (name, value, json = true) => {
  const file = path.resolve(A, name)
  assert(file.startsWith(`${A}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, json ? `${JSON.stringify(value, null, 2)}\n` : value, { flag: 'wx' })
  return bind(file)
}
const checkInputs = () => {
  const bindings = read(`${A}/input-bindings.json`)
  for (const item of bindings.snapshots) {
    assert.equal(sha(item.input.path), item.input.sha256, `Changed shared input: ${item.input.path}`)
    assert.equal(sha(item.snapshot.path), item.snapshot.sha256)
  }
  assert.equal(sha(bindings.n38.path), bindings.n38.sha256)
  assert.equal(sha(bindings.n39.path), bindings.n39.sha256)
  return bindings
}
const target = number => `${A}/fig-${number}/initial`
const exactCss = fs.readFileSync(`${W}/app/src/styles/app.css`, 'utf8')
const cssSelectors = [
  '.sr-figure-media', '.sr-figure-media svg,\n.sr-figure-media img,\n.sr-figure-vector',
  '.sr-read-fig[data-figure-layout="scroll"],\n.sr-ex-fig[data-figure-layout="scroll"]',
  '.sr-read-fig[data-figure-layout="scroll"] .sr-figure-media,\n.sr-ex-fig[data-figure-layout="scroll"] .sr-figure-media',
]
const css = cssSelectors.map(selector => {
  const start = exactCss.indexOf(`${selector} {`)
  assert(start >= 0, `Authoritative CSS block missing: ${selector}`)
  return exactCss.slice(start, exactCss.indexOf('}', start) + 1)
}).join('\n')

function geometryCheck(number) {
  const F = target(number)
  const spec = read(`${F}/fig-${number}.spec.json`)
  const mapping = read(`${F}/source-inventory.json`)
  const points = new Map(spec.objects.filter(item => item.type === 'point').map(item => [item.id, item.at]))
  const objects = new Map(spec.objects.map(item => [item.id, item]))
  const assertions = new Map(spec.assertions.map(item => [item.id, item]))
  const nativeRelationshipFields = {
    displacement: ['from', 'to'], connects: ['from', 'to'],
    distance: ['a', 'b'], equalDistance: ['a', 'b', 'c', 'd'],
  }
  const coverage = spec.source.inventory.filter(item => item.requires?.includes('pointRelationships'))
    .map(group => {
      const members = new Set(group.objects.filter(id => points.has(id)))
      const covered = new Set()
      for (const id of group.assertions) {
        const relation = assertions.get(id)
        const ids = new Set((nativeRelationshipFields[relation.type] ?? [])
          .map(field => relation[field]).filter(id => points.has(id)))
        if (ids.size >= 2 && [...ids].every(id => members.has(id)))
          for (const id of ids) covered.add(id)
      }
      assert([...members].every(id => covered.has(id)), `Incomplete internal source-point coverage ${group.id}`)
      return { group: group.id, members: [...members], internallyCoveredPoints: [...covered] }
    })
  assert.equal(mapping.numberMapping.length, 18)
  for (const item of mapping.numberMapping) {
    const ball = objects.get(item.point), label = objects.get(item.label)
    assert.equal(label.text, String(item.number))
    assert.equal(label.at[0], ball.at[0])
    assert(label.at[1] < ball.at[1])
  }
  const springs = spec.source.inventory.filter(item => /^fig\d+-spring-\d+$/.test(item.id))
  assert.equal(springs.length, 17)
  for (let index = 0; index < springs.length; index += 1) {
    const group = springs[index]
    const edges = group.objects.map(id => objects.get(id)).filter(item => item.type === 'segment')
    assert.equal(edges.length, 15)
    assert.equal(edges[0].from, `fig${number}-a-ball-${index + 1}`)
    assert.equal(edges.at(-1).to, `fig${number}-a-ball-${index + 2}`)
    const position = value => typeof value === 'string' ? points.get(value) : value
    for (let i = 1; i < edges.length; i += 1)
      assert.deepEqual(position(edges[i - 1].to), position(edges[i].from))
    for (const edge of edges) {
      assert(group.assertions.includes(`${edge.id}-connects`))
      assert.equal(assertions.get(`${edge.id}-connects`).arrow, edge.id)
    }
  }
  assert.equal(mapping.threadMapping.length, 36)
  for (let index = 1; index <= 18; index += 1) {
    const threads = mapping.threadMapping.filter(item => item.object.startsWith(`fig${number}-thread-${index}-`))
    assert.equal(threads.length, 2)
    for (const item of threads) {
      const edge = objects.get(item.object)
      assert.equal(edge.to, `fig${number}-a-ball-${index}`)
      assert(points.has(edge.from))
      assert.equal(assertions.get(item.assertion).to, edge.to)
    }
  }
  let longitudinal = null
  if (number === 71) {
    assert.equal(mapping.guideMapping.length, 18)
    assert.deepEqual(spec.objects.filter(item => item.type === 'text').map(item => item.text).sort(),
      [...Array.from({ length: 18 }, (_, i) => String(i + 1)), 'a', 'b', '\u03bb'].sort())
    const px = id => points.get(id)[0]
    for (const item of mapping.guideMapping) {
      const guide = objects.get(item.guide)
      assert.equal(guide.from[0], guide.to[0])
      assert.equal(guide.from[0], px(`fig71-a-ball-${item.number}`))
      assert(!spec.objects.some(object => object.type === 'text' && object.id === `${item.point}-label`))
    }
    const gaps = Array.from({ length: 17 }, (_, i) => px(`fig71-b-ball-${i + 2}`) - px(`fig71-b-ball-${i + 1}`))
    assert(gaps.every(gap => gap > 0))
    const period = px('fig71-b-ball-16') - px('fig71-b-ball-4')
    assert(Math.abs(period - (px('fig71-b-ball-14') - px('fig71-b-ball-2'))) < 0.00001)
    const offsets = Array.from({ length: 18 }, (_, i) => px(`fig71-b-ball-${i + 1}`) - px(`fig71-a-ball-${i + 1}`))
    for (let i = 0; i < 6; i += 1) assert(Math.abs(offsets[i] - offsets[i + 12]) < 0.00001)
    const measured = read(`${A}/png-measurements-v2.json`).figures[71].balls.bBalls
    const errors = measured.map((item, i) => px(`fig71-b-ball-${i + 1}`) - item.center[0])
    assert(Math.max(...errors.map(Math.abs)) < 5)
    assert(Math.max(...gaps) / Math.min(...gaps) > 1.5, 'Density geometry must not become a uniform row.')
    assert.equal(spec.objects.filter(item => item.type === 'arrow').length, 2)
    assert.equal(objects.get('fig71-lambda-extension-4').from, 'fig71-b-ball-4')
    assert.equal(objects.get('fig71-lambda-extension-16').from, 'fig71-b-ball-16')
    for (const side of ['left', 'right']) assert(objects.has(`fig71-${side}-depth-connector`))
    longitudinal = { gaps, offsets, periodInDrawingPixels: period, sourcePixelErrors: errors,
      maximumPixelRegularization: Math.max(...errors.map(Math.abs)),
      noExtraBottomLabels: true, lowerBallCount: 18, referenceMarkCount: 18,
      springCountOnLowerRow: 0, sourceGivenLambdaOnly: true }
  }
  for (const binding of mapping.authorityBindings) {
    assert.equal(spec.source.authoritativeText[binding.index].text,
      fs.readFileSync(binding.prose.path, 'utf8'))
  }
  if (number === 71) {
    for (const language of ['zh', 'en']) {
      const ex = read(`${A}/inputs/current/n39/${language}/exercises.template.json`)
      assert.equal(ex.count, 6)
      for (const task of ex.exercises) assert(spec.source.authoritativeText.some(item =>
        item.exercise === String(task.number) && item.text === task.text))
    }
  }
  return { status: 'PASS', spec: bind(`${F}/fig-${number}.spec.json`),
    sourceMapping: bind(`${F}/source-inventory.json`), internalCoverage: coverage,
    numberMappingCount: 18, threadCount: 36, springCount: 17, longitudinal,
    noSvgPathOrImages: spec.objects.every(item => !['svgPath', 'image'].includes(item.type)),
    currentCompleteTextBound: true, independentApproval: false }
}

async function verify() {
  checkInputs()
  const browser = await chromium.launch({ headless: false,
    env: { ...process.env, TMPDIR: `${A}/browser-tmp/` } })
  try {
    for (const number of [69, 71]) {
      const F = target(number), spec = read(`${F}/fig-${number}.spec.json`)
      const report = read(`${F}/fig-${number}.render.json`)
      assert.equal(report.status, 'pass')
      assert.equal(report.spec.sha256, sha(`${F}/fig-${number}.spec.json`))
      assert.equal(report.output.svg.sha256, sha(`${F}/fig-${number}.svg`))
      write(`fig-${number}/initial/geometry-check.json`, geometryCheck(number))
      const fixture = write(`fig-${number}/initial/native-width-fixture.html`,
        `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;background:white;font-size:16px}
:root{--sr-ink:#1b1b1b;--sr-ink-soft:#6b6b6b;--sr-ink-dim:#6b6b6b;--sr-line:#e3e3e3;--sr-white:white}
figure{margin:0;font-size:16px;width:640px}
${css}
</style></head><body><figure class="sr-read-fig" data-figure-layout="scroll"><div
class="sr-figure-media">${fs.readFileSync(`${F}/fig-${number}.svg`, 'utf8')}</div></figure></body></html>`, false)
      const observations = []
      for (const [surface, viewport, hostWidth] of [
        ['desktop', { width: 1440, height: 960 }, 640],
        ['mobile', { width: 390, height: 844 }, 316],
      ]) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
        try {
          await page.goto(pathToFileURL(fixture.path).href)
          await page.locator('figure').evaluate((node, width) => { node.style.width = `${width}px` }, hostWidth)
          await page.evaluate(() => document.fonts.ready)
          const data = await page.locator('figure').evaluate(async (host, spec) => {
            const media = host.querySelector('.sr-figure-media'), svg = media.querySelector('svg')
            const bounds = svg.getBoundingClientRect()
            const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
              const box = node.getBoundingClientRect(), ctm = node.getScreenCTM()
              return { id: node.getAttribute('data-label-id'), text: node.textContent,
                fontPx: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(ctm.a, ctm.b),
                rectangle: { x: box.x, y: box.y, width: box.width, height: box.height },
                clippedBySvg: box.left < bounds.left || box.right > bounds.right
                  || box.top < bounds.top || box.bottom > bounds.bottom }
            })
            const overlaps = []
            for (let i = 0; i < labels.length; i += 1) for (let j = i + 1; j < labels.length; j += 1) {
              const a = labels[i].rectangle, b = labels[j].rectangle
              if (a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height)
                overlaps.push([labels[i].id, labels[j].id])
            }
            const entities = spec.objects.map(object => {
              if (object.type === 'text') return {
                id: object.id, present: labels.some(item => item.id === `${object.id}-label`) }
              const node = svg.querySelector(`[id="ld-${spec.id}_ld-${object.id}"]`)
              if (!node) return { id: object.id, present: false }
              if (object.type === 'point') {
                const x = node.cx.baseVal.value, y = node.cy.baseVal.value
                return { id: object.id, present: true,
                  centerError: Math.hypot(x - object.at[0], y - (spec.canvas.height - object.at[1])) }
              }
              return { id: object.id, present: true }
            })
            const canvas = document.createElement('canvas')
            canvas.width = Math.round(bounds.width); canvas.height = Math.round(bounds.height)
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height)
            const image = new Image()
            const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }))
            try { image.src = url; await image.decode(); ctx.drawImage(image, 0, 0, canvas.width, canvas.height) }
            finally { URL.revokeObjectURL(url) }
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
            let ink = 0
            for (let i = 0; i < pixels.length; i += 4)
              if (pixels[i] < 160 && pixels[i + 1] < 160 && pixels[i + 2] < 160) ink += 1
            host.scrollLeft = host.scrollWidth
            const scrollEnd = { scrollLeft: host.scrollLeft, max: host.scrollWidth - host.clientWidth,
              lastBallReachable: svg.querySelector(`[id="ld-${spec.id}_ld-fig${spec.id.slice(4)}-a-ball-18"]`)
                .getBoundingClientRect().right <= host.getBoundingClientRect().right }
            host.scrollLeft = 0
            return { mediaWidth: bounds.width, hostWidth: host.clientWidth, scrollWidth: host.scrollWidth,
              labels, overlaps, entities, scrollEnd, pageOverflow: document.documentElement.scrollWidth > innerWidth,
              raster: { inkPixels: ink, pixels: canvas.width * canvas.height,
                nonblankAndNotBlack: ink > 1000 && ink < canvas.width * canvas.height * 0.25 } }
          }, spec)
          assert.equal(data.mediaWidth, 640)
          assert.equal(data.hostWidth, hostWidth)
          assert.equal(data.labels.length, number === 69 ? 18 : 21)
          assert(data.labels.every(label => label.fontPx >= 16 && !label.clippedBySvg))
          assert.equal(data.overlaps.length, 0)
          assert(data.entities.every(item => item.present && (item.centerError ?? 0) < 0.02))
          assert(!data.pageOverflow)
          assert(data.raster.nonblankAndNotBlack)
          assert.equal(data.scrollEnd.scrollLeft, data.scrollEnd.max)
          assert(data.scrollEnd.lastBallReachable)
          if (surface === 'desktop') {
            const preview = `${F}/fig-${number}.w640.png`
            await page.locator('.sr-figure-media').screenshot({ path: preview })
            data.preview = bind(preview)
          } else {
            assert(data.scrollEnd.max > 0)
            const start = `${F}/fig-${number}.mobile-scroll-start.png`
            await page.locator('figure').screenshot({ path: start })
            await page.locator('figure').evaluate(node => { node.scrollLeft = node.scrollWidth })
            const end = `${F}/fig-${number}.mobile-scroll-end.png`
            await page.locator('figure').screenshot({ path: end })
            data.startPreview = bind(start); data.endPreview = bind(end)
          }
          observations.push({ status: 'PASS', surface, viewport, ...data })
        } finally { await page.close() }
      }
      write(`fig-${number}/initial/native-width-check.json`, { status: 'PASS', headed: true,
        scope: 'Isolated author-only native SVG fixture with verbatim authoritative media/scroll CSS. Not running app, whole-card acceptance, or independent approval.',
        cssSource: bind(`${W}/app/src/styles/app.css`), extractedSelectors: cssSelectors,
        fixture, spec: bind(`${F}/fig-${number}.spec.json`),
        render: bind(`${F}/fig-${number}.render.json`), observations,
        minFontPxAt640: Math.min(...observations.flatMap(item => item.labels.map(label => label.fontPx))),
        currentMediaWidthMeasuredPx: 640, independentApproval: false })
      console.log(JSON.stringify({ figure: number, actualMediaWidth: 640, status: 'PASS',
        nativeObjects: spec.objects.length, internalSourceGroups: spec.source.inventory.length,
        preview: `${F}/fig-${number}.w640.png` }))
    }
  } finally { await browser.close() }
  checkInputs()
}

function freeze() {
  const bindings = checkInputs()
  const observed = read(`${A}/author-observations.json`)
  assert.equal(observed.imageOpenCount, 6)
  assert(observed.imageOpenCount <= 8)
  const figures = [69, 71].map(number => {
    const F = target(number), spec = read(`${F}/fig-${number}.spec.json`)
    const report = read(`${F}/fig-${number}.render.json`)
    const widths = read(`${F}/native-width-check.json`)
    assert.equal(report.status, 'pass')
    assert.equal(widths.status, 'PASS')
    assert.equal(observed.figures[number].status, 'AUTHOR-PASS')
    assert.equal(report.spec.sha256, sha(`${F}/fig-${number}.spec.json`))
    assert.equal(report.output.svg.sha256, sha(`${F}/fig-${number}.svg`))
    assert.equal(read(`${F}/draft-validation.json`).exitCode, 0)
    assert.equal(read(`${F}/render-command.json`).exitCode, 0)
    assert.equal(read(`${F}/rendered-validation.json`).exitCode, 0)
    const review = write(`fig-${number}/initial/author-review.json`, {
      schema: 'ld-s10y-image/author-only-review@1', figure: spec.id,
      status: 'AUTHOR-PASS-INDEPENDENT-APPROVAL-PENDING', reviewedAt: new Date().toISOString(),
      source: spec.source.image, spec: bind(`${F}/fig-${number}.spec.json`),
      render: bind(`${F}/fig-${number}.render.json`), output: bind(`${F}/fig-${number}.svg`),
      preview: bind(`${F}/fig-${number}.w640.png`),
      observation: bind(`${A}/author-observations.json`),
      sourceMapping: bind(`${F}/source-inventory.json`), geometry: bind(`${F}/geometry-check.json`),
      actualWidth: bind(`${F}/native-width-check.json`),
      role: 'Author self-check only; not an independent mathematical, cultural, SCI, or ZHEN approval.',
      independentApproval: false, sourceApprovalNew: false, SCI: false, ZHEN: false,
      promotable: false, durablePromotion: false,
    })
    return { figure: spec.id, attempt: 'initial', authorStatus: 'PASS', nativeStatus: 'pass',
      source: spec.source.image, spec: bind(`${F}/fig-${number}.spec.json`),
      svg: bind(`${F}/fig-${number}.svg`), render: bind(`${F}/fig-${number}.render.json`),
      preview: bind(`${F}/fig-${number}.w640.png`), fullPreview: bind(`${F}/fig-${number}.native.png`),
      authorReview: review, display: spec.display,
      sourceInventory: bind(`${F}/source-inventory.json`), geometry: bind(`${F}/geometry-check.json`),
      actualWidthCheck: bind(`${F}/native-width-check.json`),
      receipts: ['draft-validation.json', 'render-command.json', 'rendered-validation.json']
        .map(name => bind(`${F}/${name}`)), targetedRepairsUsed: 0,
      independentApproval: 'pending', durablePromotion: false }
  })
  const artifacts = []
  const collect = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) { if (entry.name !== 'browser-tmp') collect(file) }
      else if (entry.name !== 'author-freeze.json') artifacts.push(bind(file))
    }
  }
  collect(A)
  const result = write('author-freeze.json', {
    schema: 'ld-s10y-image/bounded-figure-author-freeze@1', ticket: 'STEMROBIN-181',
    frozenAt: new Date().toISOString(), ownedOutputRoot: A, figures,
    status: 'BOTH-AUTHOR-CANDIDATES-PASS-INDEPENDENT-APPROVAL-PENDING',
    renderer: 'Unmodified native JSXGraph render_spec.mjs; no new rendering engine.',
    n38Authority: bindings.n38, n39Authority: bindings.n39,
    beforeSnapshotsPreserved: true, currentRepairTextIncludedVerbatim: true,
    n39UnchangedSourceQuestions: 6, currentScienceApproval: 'pending',
    sourceObservations: bind(`${A}/source-observations.json`),
    regularization: bind(`${A}/regularization.json`),
    authorObservations: bind(`${A}/author-observations.json`),
    exactNativeRendererInvocations: 2, targetedRepairsPerFigure: { 'fig-69': 0, 'fig-71': 0 },
    maximumTargetedRepairsPerFigure: 1, initialAttemptsRetained: true,
    imageOpenCount: observed.imageOpenCount, imageOpenLog: observed.imageOpenLog,
    imageBatchLimit: 8, contextImageLimit: 24, textOnlyReturn: true,
    authorOnlyReview: true, nativeApprovalReviewRecorderInvocations: 0,
    independentApproval: false, SCI: false, ZHEN: false,
    canonicalWrites: 0, gitWrites: 0,
    gitReadOnlyStatusCommands: 1,
    gitReadNote: 'An initial read-only git status --short was run while gathering context; no Git state was modified and no further Git commands were used.',
    databaseOperations: 0, ticketBackendOperations: 0, messagesSent: 0,
    appEdits: 0, sharedToolEdits: 0, charterEdits: 0, dependencyChanges: 0,
    setupPerformed: false, productAppStarted: false, durablePromotion: false,
    allWritesConfinedToOwnedRoot: true,
    futureGates: ['Independent source/figure approval', 'Independent current SCI and ZHEN approval',
      'Parent-owned offline/product acceptance and durable promotion'],
    inputBindings: bind(`${A}/input-bindings.json`), artifacts,
  })
  console.log(JSON.stringify({ status: 'BOTH-AUTHOR-PASS-PENDING-INDEPENDENT-APPROVAL', freeze: result,
    minActualTextPx: Math.min(...figures.map(item => read(item.actualWidthCheck.path).minFontPxAt640)),
    imageOpenCount: observed.imageOpenCount }))
}

if (process.argv[2] === 'verify') await verify()
else if (process.argv[2] === 'freeze') freeze()
else throw new Error('Use verify or freeze')
