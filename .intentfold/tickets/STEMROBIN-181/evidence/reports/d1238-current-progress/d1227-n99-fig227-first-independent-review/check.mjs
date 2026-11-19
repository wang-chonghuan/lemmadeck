import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const scope = path.dirname(fileURLToPath(import.meta.url))
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1216-n99-fig227-first-author')
const corrected = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1212-n99-two-errata-repair')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const ref = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const authorReport = path.join(author, 'report.json')
assert.equal(hash(authorReport), 'a9992dab71c4168a6128b85ca00a39f85707e645804801a950fffb24efbaf0ec')
const report = read(authorReport)
const specPath = report.outputContract.spec.path
const svgPath = report.outputContract.svg.path
const renderPath = report.outputContract.render.path
const bindings = [ref(authorReport), ref(specPath), ref(svgPath), ref(renderPath),
  ref(path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-227.png')),
  ...['zh', 'en'].map(locale => ref(path.join(corrected, locale, 'lesson.template.json')))]
for (const record of Object.values(report.outputContract)) {
  if (record?.path) assert.equal(hash(record.path), record.sha256)
}
for (const binding of report.binding.templates.filter(item => item.version === 'corrected-current')) {
  assert.equal(hash(binding.path), binding.sha256)
}
const spec = read(specPath)
const render = read(renderPath)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specPath))
assert.equal(render.output.svg.sha256, hash(svgPath))
for (const locale of ['zh', 'en']) {
  const lesson = read(path.join(corrected, locale, 'lesson.template.json'))
  const relevant = lesson.prose.filter(block => block.text)
  for (const block of relevant) {
    assert.ok(spec.source.authoritativeText.some(item => item.text === block.text),
      `Current ${locale} prose absent from spec: ${block.source_refs}`)
  }
}
const svg = fs.readFileSync(svgPath, 'utf8')
const cssPath = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssPath, 'utf8')
const tokenStart = css.indexOf(':root {', css.indexOf('LemmaDeck design tokens'))
const tokenEnd = css.indexOf('\n}', tokenStart) + 2
const figureStart = css.indexOf('.sr-figure-media {')
const figureEnd = css.indexOf('.sr-math-answer {', figureStart)
const printStart = css.indexOf('  .sr-print-lesson .sr-figure-media {')
const printEnd = css.indexOf('\n  }', printStart) + 4
assert.ok(tokenStart > 0 && tokenEnd > tokenStart && figureEnd > figureStart && printStart > 0)
const tokens = css.slice(tokenStart, tokenEnd)
const figureCss = css.slice(figureStart, figureEnd)
const printColors = css.slice(printStart, printEnd)
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright-core')
const executablePath = chromium.executablePath()
assert.ok(fs.existsSync(executablePath))
const browser = await chromium.launch({ executablePath, headless: false })
const checks = []
const screenshots = []
let geometry
try {
  for (const mode of ['desktop-neutral', 'desktop-accent', 'desktop-print', 'mobile-neutral']) {
    const mobile = mode.startsWith('mobile')
    const viewport = mobile ? { width: 390, height: 844 } : { width: 1440, height: 960 }
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
    const requests = []
    const errors = []
    page.on('request', request => requests.push(request.url()))
    page.on('pageerror', error => errors.push(error.message))
    await page.route('**/*', route => route.abort())
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      ${tokens}
      body { margin:16px; font-size:16px; background:var(--sr-white); }
      .sr-read-fig { margin:0; max-width:960px; }
      ${figureCss}
      ${mode.endsWith('print') ? printColors : ''}
    </style></head><body class="${mode.endsWith('print') ? 'sr-print-lesson' : ''}">
    <figure class="sr-read-fig" data-testid="independent-figure" data-figure-layout="scroll">
      <div class="sr-figure-media"${mode.endsWith('accent') ? ' data-figure-theme="accent"' : ''}>
        <div class="sr-figure-vector">${svg}</div>
      </div>
    </figure></body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const measured = await page.evaluate(expected => {
      const svg = document.querySelector('svg')
      const bounds = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const box = node.getBoundingClientRect()
        const matrix = node.getScreenCTM()
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          fontPx: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          inside: box.left >= bounds.left && box.top >= bounds.top &&
            box.right <= bounds.right && box.bottom <= bounds.bottom,
          box: { left: box.left, top: box.top, right: box.right, bottom: box.bottom },
          color: getComputedStyle(node).fill,
        }
      })
      const collisions = []
      for (let a = 0; a < labels.length; a++) for (let b = a + 1; b < labels.length; b++) {
        const x = labels[a].box, y = labels[b].box
        if (x.left < y.right && y.left < x.right && x.top < y.bottom && y.top < x.bottom) {
          collisions.push([labels[a].id, labels[b].id])
        }
      }
      const curve = svg.querySelector('[id$="-raw-path-layer"] path')
      const line = id => svg.querySelector(`[id$="_ld-${id}"]`)
      const xy = node => ({
        x1: Number(node.getAttribute('x1')), y1: Number(node.getAttribute('y1')),
        x2: Number(node.getAttribute('x2')), y2: Number(node.getAttribute('y2')),
      })
      const mAxis = xy(line('src-227-m-axis'))
      const vAxis = xy(line('src-227-v-axis'))
      const massTicks = Array.from({ length: 8 }, (_, i) => xy(line(`src-227-m-tick-${i + 1}`)))
      const speedTicks = Array.from({ length: 9 }, (_, i) => xy(line(`src-227-v-tick-${i + 1}`)))
      const limit = xy(line('src-227-c-limit'))
      const raw = curve.getAttribute('d')
      const expectedCurve = expected.objects.find(item => item.id === 'src-227-mass-curve')
      const scroller = document.querySelector('[data-testid="independent-figure"]')
      return {
        width: bounds.width, height: bounds.height, labels, collisions, mAxis, vAxis,
        massTicks, speedTicks, limit, curvePath: raw,
        curveMatchesSpec: raw === expectedCurve.d,
        curveSolid: !curve.hasAttribute('stroke-dasharray'),
        limitSolid: !line('src-227-c-limit').hasAttribute('stroke-dasharray'),
        curveColor: getComputedStyle(curve).stroke,
        limitColor: getComputedStyle(line('src-227-c-limit')).stroke,
        arrowheads: [...svg.querySelectorAll('[data-arrowhead-for]')].map(node => ({
          axis: node.getAttribute('data-arrowhead-for'),
          transform: node.getAttribute('transform'),
          visible: getComputedStyle(node).display !== 'none' && node.getBBox().width > 0,
        })),
        closedEndpointMarkers: [...svg.querySelectorAll('circle,ellipse')].filter(node => {
          const style = getComputedStyle(node)
          return style.display !== 'none' && style.visibility !== 'hidden' &&
            Number(style.opacity) > 0
        }).length,
        scroller: { clientWidth: scroller.clientWidth, scrollWidth: scroller.scrollWidth },
      }
    }, spec)
    assert.equal(measured.width, 640)
    assert.equal(measured.height, 576)
    assert.equal(measured.labels.length, 16)
    assert.ok(measured.labels.every(label => label.fontPx >= 16 && label.inside))
    assert.deepEqual(measured.collisions, [])
    assert.ok(measured.curveMatchesSpec && measured.curveSolid && measured.limitSolid)
    assert.equal(measured.arrowheads.length, 2)
    assert.ok(measured.arrowheads.every(item => item.visible))
    assert.equal(measured.closedEndpointMarkers, 0)
    assert.ok(measured.curveColor !== 'rgba(0, 0, 0, 0)')
    for (const object of spec.objects.filter(item => item.type === 'text')) {
      assert.ok(measured.labels.some(label => label.id === `${object.id}-label` && label.text === object.text))
    }
    if (!geometry) {
      const origin = [measured.mAxis.x1, measured.vAxis.y1]
      const unit = origin[1] - measured.massTicks[0].y1
      const c = measured.limit.x1
      const speedUnit = c - origin[0]
      assert.deepEqual(origin, [132, 570])
      assert.equal(unit, 53)
      assert.equal(speedUnit, 518)
      assert.equal(measured.mAxis.x1, measured.mAxis.x2)
      assert.equal(measured.vAxis.y1, measured.vAxis.y2)
      assert.ok(measured.mAxis.y2 < measured.mAxis.y1 && measured.vAxis.x2 > measured.vAxis.x1)
      for (let i = 0; i < 8; i++) {
        assert.equal(measured.massTicks[i].y1, origin[1] - unit * (i + 1))
        assert.equal(measured.massTicks[i].x2, origin[0])
      }
      for (let i = 0; i < 9; i++) {
        assert.ok(Math.abs(measured.speedTicks[i].x1 - (origin[0] + speedUnit * (i + 1) / 10)) < 1e-8)
      }
      assert.equal(measured.limit.x1, measured.limit.x2)
      const commands = measured.curvePath.trim().split(/\s+(?=[ML])/)
      const vertices = commands.map((command, i) => {
        const pieces = command.trim().split(/\s+/)
        assert.equal(pieces[0], i === 0 ? 'M' : 'L')
        assert.equal(pieces.length, 3)
        const x = Number(pieces[1]), y = Number(pieces[2])
        assert.ok(Number.isFinite(x) && Number.isFinite(y))
        return { x, y, beta: (x - origin[0]) / speedUnit, gamma: (origin[1] - y) / unit }
      })
      assert.deepEqual([vertices[0].x, vertices[0].y], [origin[0], measured.massTicks[0].y1])
      let maxFormulaError = 0, maxInverseError = 0, maxPolylineYErrorPx = 0
      for (let i = 0; i < vertices.length; i++) {
        const p = vertices[i]
        assert.ok(p.beta >= 0 && p.beta < 1 && p.gamma >= 1)
        maxFormulaError = Math.max(maxFormulaError, Math.abs(p.gamma - 1 / Math.sqrt(1 - p.beta ** 2)))
        maxInverseError = Math.max(maxInverseError, Math.abs(p.beta - Math.sqrt(1 - 1 / p.gamma ** 2)))
        if (i) {
          const a = vertices[i - 1]
          assert.ok(p.beta > a.beta && p.gamma > a.gamma)
          for (const t of [0.25, 0.5, 0.75]) {
            const beta = a.beta + t * (p.beta - a.beta)
            const gamma = a.gamma + t * (p.gamma - a.gamma)
            maxPolylineYErrorPx = Math.max(maxPolylineYErrorPx,
              Math.abs(gamma - 1 / Math.sqrt(1 - beta ** 2)) * unit)
          }
        }
      }
      assert.ok(maxFormulaError < 1e-7 && maxInverseError < 1e-6 && maxPolylineYErrorPx < 0.02)
      const samples = [0, 0.5, 0.8, 0.9, Math.sqrt(3) / 2, Math.sqrt(63) / 8].map(beta => {
        const right = vertices.findIndex(p => p.beta >= beta)
        assert.ok(right >= 0)
        const b = vertices[right], a = vertices[Math.max(0, right - 1)]
        const fraction = a.beta === b.beta ? 0 : (beta - a.beta) / (b.beta - a.beta)
        const actual = a.gamma + fraction * (b.gamma - a.gamma)
        const expected = 1 / Math.sqrt(1 - beta ** 2)
        assert.ok(Math.abs(actual - expected) < 0.001)
        return { beta, expectedGamma: expected, actualPolylineGamma: actual }
      })
      const last = vertices.at(-1)
      assert.ok(last.beta < 1 && last.gamma > 8 && last.gamma < 9)
      geometry = { status: 'pass', origin, massUnitPx: unit, speedUnitPx: speedUnit,
        massTickCount: 8, interiorSpeedTickCount: 9, vertexCount: vertices.length,
        first: vertices[0], last, maxFormulaError, maxInverseError, maxPolylineYErrorPx, samples,
        curveHasNoValueAtOrBeyondC: true, finiteDrawingCutoffIsNotPhysicalEndpoint: true,
        arrowheads: measured.arrowheads }
    }
    const shot = path.join(scope, `${mode}.png`)
    await page.locator('.sr-figure-media').screenshot({ path: shot, animations: 'disabled' })
    screenshots.push({ role: mode, ...ref(shot) })
    if (mode === 'desktop-neutral') {
      await page.locator('.sr-figure-media').evaluate(node => { node.style.width = '800px' })
      const full = path.join(scope, 'full-resolution-neutral.png')
      await page.locator('.sr-figure-media').screenshot({ path: full, animations: 'disabled' })
      screenshots.push({ role: 'full-resolution-neutral', ...ref(full) })
    }
    if (mobile) {
      const scroll = await page.getByTestId('independent-figure').evaluate(node => {
        node.scrollLeft = node.scrollWidth
        return { left: node.scrollLeft, maximum: node.scrollWidth - node.clientWidth }
      })
      assert.ok(scroll.left > 0 && Math.abs(scroll.left - scroll.maximum) < 1)
      measured.scrollEnd = scroll
      const end = path.join(scope, 'mobile-visible-scroll-end.png')
      await page.getByTestId('independent-figure').screenshot({ path: end, animations: 'disabled' })
      screenshots.push({ role: 'mobile-visible-scroll-end', ...ref(end) })
    }
    assert.deepEqual(requests, [])
    assert.deepEqual(errors, [])
    delete measured.curvePath
    checks.push({ mode, viewport, status: 'pass', ...measured, requests, errors })
    await page.close()
  }
} finally {
  await browser.close()
}
for (const binding of bindings) assert.equal(hash(binding.path), binding.sha256, 'Candidate changed during review')
const output = {
  schema: 'stemrobin/fig227-first-independent-readonly-check@1',
  status: 'pass', checkedAt: new Date().toISOString(), bindings,
  browser: { executablePath, headless: false, closed: true },
  css: ref(cssPath), figureRulesSha256: crypto.createHash('sha256').update(figureCss).digest('hex'),
  geometry, checks, screenshots,
  scope: 'Isolated unchanged SVG, exact current product figure CSS at 640px, current token registry and print color rules. No full card or offline lesson render approval. Screenshots await independent visual inspection.',
}
fs.writeFileSync(path.join(scope, 'check.json'), `${JSON.stringify(output, null, 2)}\n`)
console.log(JSON.stringify({ status: 'pass', geometry, checks: checks.map(item => ({
  mode: item.mode, width: item.width, minimumTextPx: Math.min(...item.labels.map(label => label.fontPx)),
  scrollEnd: item.scrollEnd,
})), screenshots }, null, 2))
