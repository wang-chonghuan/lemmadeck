import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(owned, '../../../../..')
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d603-n76-fig177178-first-modern-author')
const contextRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d593-n76-first-figure-contexts')
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const record = p => ({ path: p, sha256: sha(p), bytes: fs.statSync(p).size, mode: (fs.statSync(p).mode & 0o777).toString(8).padStart(4, '0') })
const save = (name, data) => fs.writeFileSync(path.join(owned, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const freezePath = path.join(author, 'author-freeze.json')
assert.equal(sha(freezePath), '8296d6e9c97c18555e9cd51656457c3493444e01113716fa330a524f4ac506bb')
assert.equal(sha(path.join(author, 'report.json')), '9ba171c632c55b5b48f57e4d116940b8ad84779b31541000fe13f24eb93f55d1')
const freeze = load(freezePath)
const pins = [...freeze.files, ...freeze.externalInputPins, ...freeze.nativeToolPins, freeze.displayStylesheetPin]
for (const pin of pins) {
  assert.equal(sha(pin.path), pin.sha256, `Stale pinned file ${pin.path}`)
  if (pin.bytes !== undefined) assert.equal(fs.statSync(pin.path).size, pin.bytes)
  if (pin.mode !== undefined) assert.equal(record(pin.path).mode, pin.mode)
}
assert.equal(record(freezePath).mode, '0444')
assert.equal(sha(path.join(contextRoot, 'manifest.json')), '21fcaf1f3ce9382d9490953471e5b12ea88baad39aa18011c0da43d9a4c10f4a')
assert.equal(sha(path.join(owned, 'independent-inventory.json')), '1274b366d9ccc3317314e793ee544dd81decfeb27c08a88dda6935298c0a391c')
const inputVerification = {
  status: 'PASS',
  authorFreeze: record(freezePath),
  checkedPins: pins.map(pin => record(pin.path)),
  independentInventorySealedBeforeAuthorRead: record(path.join(owned, 'independent-inventory.json')),
  originalCopies: [177, 178].map(n => record(path.join(contextRoot, `context-root/10p/figures/fig-${n}.png`))),
  nativeRerenders: 0,
  standaloneNativeValidationReruns: 0,
}
save('input-verification.json', inputVerification)

const cssPath = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssPath, 'utf8')
const textRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d597-n76-r08-first-text-repair/candidate')
const stringLeaves = value => typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(stringLeaves) : []
const mathematical = []
for (const n of [177, 178]) {
  const figure = `fig-${n}`
  const dir = path.join(author, figure)
  const spec = load(path.join(dir, 'spec.json'))
  const render = load(path.join(dir, 'render.first.json'))
  assert.equal(spec.schema, 'ld-s10y-image/figure-spec@2')
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, sha(path.join(dir, 'spec.json')))
  assert.equal(render.output.svg.sha256, sha(path.join(dir, `${figure}.svg`)))
  assert.equal(spec.source.image.sha256, sha(spec.source.image.path))
  assert.equal(spec.source.image.sha256, sha(path.join(contextRoot, `context-root/10p/figures/${figure}.png`)))
  for (const locale of ['zh', 'en']) {
    const current = stringLeaves(load(path.join(textRoot, locale, 'lesson.template.json')))
    const declared = spec.source.authoritativeText.filter(t => t.lesson.endsWith(`/${locale}`)).map(t => t.text)
    assert(declared.length > 0)
    assert(declared.every(t => current.includes(t)), `${figure}: edition text provenance drift`)
  }
  const objects = new Map(spec.objects.map(o => [o.id, o]))
  const assertions = new Map(spec.assertions.map(a => [a.id, a]))
  assert.equal(objects.size, spec.objects.length)
  assert.equal(assertions.size, spec.assertions.length)
  const point = id => Array.isArray(id) ? id : objects.get(id).at
  const vector = (a, b) => point(b).map((v, i) => v - point(a)[i])
  const distance = (a, b) => Math.hypot(...vector(a, b))
  const close = value => Math.abs(value) < 1e-9
  const results = spec.assertions.map(a => {
    let pass
    if (a.type === 'connects') {
      const edge = objects.get(a.arrow)
      pass = edge.from === a.from && edge.to === a.to
    } else if (a.type === 'pointOnLine') {
      const u = vector(a.a, a.b), v = vector(a.a, a.point)
      pass = close(u[0] * v[1] - u[1] * v[0])
    } else if (a.type === 'perpendicular') {
      const u = vector(a.a, a.b), v = vector(a.c, a.d)
      pass = close(u[0] * v[0] + u[1] * v[1])
    } else if (a.type === 'displacement') {
      const v = vector(a.from, a.to)
      pass = close(v[0] - a.dx) && close(v[1] - a.dy)
    } else if (a.type === 'equalDistance') {
      pass = close(distance(a.a, a.b) - distance(a.c, a.d))
    } else {
      throw new Error(`Unexpected assertion type ${a.type}`)
    }
    assert(pass, `${figure}: independent assertion failure ${a.id}`)
    return { id: a.id, type: a.type, status: 'PASS' }
  })
  const p = `f${n}-`
  const up = point(`${p}upper-arrow-apex`), down = point(`${p}lower-arrow-apex`)
  assert.equal(up[0], down[0])
  assert(up[1] > 0 && down[1] < 0)
  for (const side of ['left', 'right']) {
    const topArm = point(`${p}upper-arm-${side}-end`)
    const bottomArm = point(`${p}lower-arm-${side}-end`)
    assert(n === 177 ? topArm[1] < up[1] && bottomArm[1] > down[1] : topArm[1] > up[1] && bottomArm[1] < down[1])
  }
  assert(spec.objects.filter(o => o.type === 'segment').every(o => o.dash === 0))
  assert.deepEqual(spec.objects.filter(o => o.label).map(o => o.label), ['F', 'F'])
  assert.deepEqual(spec.objects.filter(o => o.type === 'text').map(o => o.text), ['O'])
  const coverage = spec.source.inventory.map(group => {
    assert(group.objects.every(id => objects.has(id)))
    assert(group.assertions.every(id => assertions.has(id)))
    const pointIds = group.objects.filter(id => objects.get(id).type === 'point')
    const relationKeys = ['a', 'b', 'c', 'd', 'point', 'from', 'to']
    const mappedRelations = group.assertions.map(id => assertions.get(id)).map(a => ({
      id: a.id, refs: relationKeys.map(key => a[key]).filter(ref => typeof ref === 'string' && objects.get(ref)?.type === 'point'),
    })).filter(a => new Set(a.refs).size >= 2 && a.refs.every(ref => group.objects.includes(ref)))
    assert(pointIds.every(id => mappedRelations.some(a => a.refs.includes(id))))
    return { sourceSpecGroup: group.id, mappedObjects: group.objects, mappedAssertions: group.assertions, allMappedPointsCoveredWithinGroup: true }
  })
  mathematical.push({
    figure, spec: record(path.join(dir, 'spec.json')), render: record(path.join(dir, 'render.first.json')),
    svg: record(path.join(dir, `${figure}.svg`)), source: record(spec.source.image.path),
    currentEditionTextBinding: 'PASS-PROVENANCE-ONLY-NO-SCI-ZHEN-REREVIEW',
    assertions: results, inventoryCoverage: coverage,
    independentPixelGroups: {
      sharedFrame: { objects: ['principal-axis', 'lens-symbol', 'optical-center', 'left-focus', 'right-focus'].map(x => p + x), assertions: ['principal-axis-connected', 'lens-symbol-connected', 'axis-through-center', 'lens-through-center', 'axis-lens-perpendicular', 'left-focus-on-axis', 'right-focus-on-axis', 'left-focus-side', 'right-focus-side'].map(x => p + x) },
      lensEndpoints: { objects: spec.objects.filter(o => o.id.includes('arrow') || o.id.includes('arm-')).map(o => o.id), assertions: spec.assertions.filter(a => a.id.includes('arrow') || a.id.includes('apex') || a.id.includes('direction')).map(a => a.id) },
      sourceLabelsAndMarks: { objects: ['left-focus', 'right-focus', 'optical-center-text'].map(x => p + x), assertions: ['left-focus-on-axis', 'right-focus-on-axis', 'axis-through-center'].map(x => p + x), labelLayoutCheck: 'independent Chromium DOM and visual inspection' },
    },
    dashLayout: 'No dashed source marks; every current segment dash=0.',
    modernRegularization: 'Exact perpendicular alignment/equal focal distances, larger sans-serif letters, modern canvas and semantic colors; no numerical source givens changed.',
    constructionPointObservation: 'Nine tiny plus anchors are author geometry helpers, not source dots; visibility/source impact assessed from actual SVG screenshots.',
  })
}
save('independent-assertion-mapping.json', { status: 'PASS', nativeValidatorInvoked: false, figures: mathematical })

const blockedNetwork = []
const pageErrors = []
const browser = await chromium.launch({ headless: true, env: { ...process.env, PWDEBUG: '0' } })
const receipts = []
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  await context.route('**/*', route => { blockedNetwork.push(route.request().url()); return route.abort() })
  const page = await context.newPage()
  page.on('pageerror', e => pageErrors.push(e.message))
  for (const n of [177, 178]) {
    const figure = `fig-${n}`
    const spec = load(path.join(author, figure, 'spec.json'))
    const svgPath = path.join(author, figure, `${figure}.svg`)
    const svg = fs.readFileSync(svgPath, 'utf8')
    for (const width of [640, 342, 331]) {
      await page.setViewportSize({ width, height: 400 })
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style><style>html,body{margin:0;padding:0;background:white}.sr-figure-media{margin:0;width:${width}px;max-width:640px}</style></head><body><div class="sr-figure-media" data-testid="review-media">${svg}</div></body></html>`)
      await page.evaluate(() => document.fonts.ready)
      const check = await page.evaluate(({ spec, width }) => {
        const svg = document.querySelector('[data-testid="review-media"] svg')
        const frame = svg.getBoundingClientRect()
        const rect = node => {
          const r = node.getBoundingClientRect()
          return { x: r.x, y: r.y, width: r.width, height: r.height }
        }
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          return { id: node.dataset.labelId, text: node.textContent, ...rect(node),
            effectiveFontPx: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b),
            fill: getComputedStyle(node).fill }
        })
        const geometry = spec.objects.filter(o => o.type !== 'text').map(o => {
          const node = document.getElementById(`ld-${spec.id}_ld-${o.id}`)
          if (!node) return { id: o.id, present: false }
          const style = getComputedStyle(node)
          const scale = Math.hypot(node.getScreenCTM().a, node.getScreenCTM().b)
          const bounds = rect(node)
          const halfStroke = parseFloat(style.strokeWidth) * scale / 2
          return { id: o.id, present: true, type: o.type, tag: node.tagName, bounds,
            stroke: style.stroke, fill: style.fill, dash: style.strokeDasharray,
            effectiveStrokePx: halfStroke * 2,
            visible: style.display !== 'none' && style.visibility === 'visible',
            strokeFootprintContained: bounds.x - halfStroke >= frame.x && bounds.y - halfStroke >= frame.y &&
              bounds.x + bounds.width + halfStroke <= frame.right && bounds.y + bounds.height + halfStroke <= frame.bottom,
            sourceScreenEndpoints: o.type === 'segment' ? ['x1', 'y1', 'x2', 'y2'].map(key => Number(node.getAttribute(key))) : null,
          }
        })
        const overlaps = []
        const intersect = (a, b) => Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
          Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)
        for (let i = 0; i < labels.length; i++) {
          for (let j = i + 1; j < labels.length; j++) if (intersect(labels[i], labels[j])) overlaps.push([labels[i].id, labels[j].id])
          for (const g of geometry) {
            const b = g.bounds, padding = g.effectiveStrokePx / 2
            if (intersect(labels[i], { x: b.x - padding, y: b.y - padding, width: b.width + 2 * padding, height: b.height + 2 * padding })) overlaps.push([labels[i].id, g.id])
          }
        }
        return { requestedWidth: width, actualWidth: frame.width, actualHeight: frame.height, labels, geometry, overlaps,
          labelsContained: labels.every(l => l.x >= frame.x && l.y >= frame.y && l.x + l.width <= frame.right && l.y + l.height <= frame.bottom),
          minTextPx: Math.min(...labels.map(l => l.effectiveFontPx)),
          background: getComputedStyle(svg).backgroundColor }
      }, { spec, width })
      assert.equal(check.actualWidth, width)
      assert(check.minTextPx >= 16)
      assert(check.labelsContained)
      assert.deepEqual(check.labels.map(l => l.text), ['F', 'F', 'O'])
      assert.equal(check.overlaps.length, 0)
      assert(check.geometry.every(g => g.present && g.visible && g.strokeFootprintContained && g.stroke === 'rgb(21, 32, 31)'))
      assert(check.geometry.filter(g => g.type === 'segment').every(g => g.dash === 'none' && g.effectiveStrokePx > 2))
      const screenshot = path.join(owned, `${figure}.${width}.chromium.png`)
      assert(!fs.existsSync(screenshot))
      await page.getByTestId('review-media').screenshot({ path: screenshot, animations: 'disabled' })
      check.screenshot = record(screenshot)
      check.figure = figure
      check.svg = record(svgPath)
      receipts.push(check)
    }
  }
  assert.equal(pageErrors.length, 0)
  save('display-receipts.json', {
    status: 'PASS-MECHANICAL-AWAITING-OWN-IMAGE-OPENS',
    scope: 'Unchanged frozen SVGs in isolated headless Chromium with current app stylesheet; standalone FIG display only, not full-card certification.',
    browser: { version: browser.version(), headless: true, isolated: true, deviceScaleFactor: 1 },
    css: record(cssPath), pageErrors, blockedNetwork, receipts,
    renderSpecInvocations: 0, standaloneValidateSpecInvocations: 0, resvgUsed: false,
  })
} finally {
  await browser.close()
}
for (const pin of pins) assert.equal(sha(pin.path), pin.sha256)
console.log(JSON.stringify({
  status: 'PINS-AND-INDEPENDENT-ASSERTIONS-PASS-SIX-SVG-SCREENSHOTS-READY',
  pinnedFilesVerified: pins.length, figures: 2, executableAssertionsIndependentlyEvaluated: 40,
  screenshots: receipts.map(r => r.screenshot), browserClosed: true,
}, null, 2))
