import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), repo)
const work = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig216-author7')
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const load = name => JSON.parse(fs.readFileSync(path.join(work, name), 'utf8'))
const hashFile = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const hash = name => hashFile(path.join(work, name))
const write = (name, value) => fs.writeFileSync(path.join(work, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const spec = load('fig-216.spec.json')
const report = load('fig-216.render.json')
const contract = load('relationship-contract.json')
const inventory = load('source-inventory.json')
const context = load('authoritative-context.json')
const checks = []
const objects = new Map(spec.objects.map(object => [object.id, object]))
const point = value => Array.isArray(value) ? value : objects.get(value).at
const vector = (a, b) => point(b).map((v, i) => v - point(a)[i])
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0)
const nearZero = value => Math.abs(value) < 0.00001
const check = (id, passed, details = {}) => {
  checks.push({ id, status: passed ? 'pass' : 'fail', ...details })
  assert.ok(passed, id)
}
const parameter = (origin, tip, p) => dot(vector(origin, p), vector(origin, tip)) / dot(vector(origin, tip), vector(origin, tip))
const sameDirection = (a, b, c, d) => nearZero(cross(vector(a, b), vector(c, d))) && dot(vector(a, b), vector(c, d)) > 0
const rayContains = (a, b, c, d) => sameDirection(a, b, c, d)
  && nearZero(cross(vector(a, b), vector(a, c))) && parameter(a, b, c) >= -0.000001

try {
  check('current-native-pass', report.status === 'pass' && report.collisions.length === 0)
  check('current-producer-hashes', report.spec.sha256 === hash('fig-216.spec.json') && report.output.svg.sha256 === hash('fig-216.svg'))
  const finalRoot = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral'
  check('full-repo-relative-producer-paths', report.spec.path === `${finalRoot}/figures/fig-216.spec.json`
    && report.output.svg.path === `${finalRoot}/figures/fig-216.svg`)
  check('source-current-hash', hashFile(path.join(repo, spec.source.image.path)) === spec.source.image.sha256)
  for (const name of ['lesson.template.json', 'exercises.template.json']) {
    const bound = context[name]
    const bytes = fs.readFileSync(path.join(repo, bound.path), 'utf8')
    check(`complete-authoritative-${name}`, JSON.parse(bound.fullJSONText) === bytes && hashFile(path.join(repo, bound.path)) === bound.sha256)
    const specBound = JSON.parse(spec.source.authoritativeText.find(item => {
      try { return JSON.parse(item.text).path === bound.path } catch { return false }
    }).text)
    check(`spec-binds-full-${name}`, specBound.fullJSONText === bound.fullJSONText && specBound.sha256 === bound.sha256)
  }
  check('independent-inventory-current', hash('source-inventory.json') === context.inventory.sha256 && inventory.sourceOpenCount === 1)
  for (const panel of inventory.panels) {
    const mapped = spec.source.inventory.find(group => group.id === `source-${panel.id}`)
    for (const sourcePoint of panel.points) check(`${sourcePoint.id}-inventory-mapped`, mapped.objects.includes(sourcePoint.id) && objects.has(sourcePoint.id))
    for (const ray of panel.rays) check(`${ray.id}-inventory-mapped`, mapped.objects.includes(ray.id) && objects.get(ray.id).type === 'arrow')
    for (const support of panel.additionalSupports ?? []) check(`${support.id}-inventory-mapped`, mapped.objects.includes(support.id) && objects.get(support.id).type === 'segment')
    check(`${panel.id}-relationship-requirement`, mapped.requires.includes('pointRelationships'))
  }
  check('no-invented-metric-assertions', !spec.assertions.some(a => ['distance', 'equalDistance', 'perpendicular', 'centralSymmetry'].includes(a.type)))
  check('all-eight-source-rays', spec.objects.filter(o => o.type === 'arrow').length === 8 && contract.rayChecks.length === 8)
  check('all-three-extended-source-supports', spec.objects.filter(o => o.type === 'segment').length === 3 && contract.supportChecks.length === 3)
  for (const ray of contract.rayChecks) {
    const object = objects.get(ray.id)
    check(`${ray.id}-connected`, JSON.stringify(object.from) === JSON.stringify(ray.from) && JSON.stringify(object.to) === JSON.stringify(ray.through))
    const v = vector(ray.from, ray.through)
    check(`${ray.id}-positive-orientation`, v[0] > 0 && (ray.panel === 'a' ? v[1] > 0 : v[1] < 0))
    const screenVector = [v[0], -v[1]]
    check(`${ray.id}-direction-ratio`, nearZero(cross(screenVector, ray.screenDirection)))
    check(`${ray.id}-reflexive`, sameDirection(ray.from, ray.through, ray.from, ray.through))
  }
  for (const panel of ['a', 'b']) {
    const rays = contract.rayChecks.filter(ray => ray.panel === panel)
    for (let i = 0; i < rays.length; i++) for (let j = i + 1; j < rays.length; j++) {
      const a = rays[i], b = rays[j]
      check(`${panel}-same-direction-${i}-${j}`, sameDirection(a.from, a.through, b.from, b.through))
      check(`${panel}-symmetric-relation-${i}-${j}`, sameDirection(b.from, b.through, a.from, a.through))
      check(`${panel}-distinct-supports-${i}-${j}`, !nearZero(cross(vector(a.from, a.through), vector(a.from, b.from))))
    }
  }
  const raysA = contract.rayChecks.filter(ray => ray.panel === 'a')
  check('a-transitivity', sameDirection(raysA[0].from, raysA[0].through, raysA[1].from, raysA[1].through)
    && sameDirection(raysA[1].from, raysA[1].through, raysA[2].from, raysA[2].through)
    && sameDirection(raysA[0].from, raysA[0].through, raysA[2].from, raysA[2].through))
  for (const support of contract.supportChecks) {
    const object = objects.get(support.id)
    check(`${support.id}-full-connection`, JSON.stringify(object.from) === JSON.stringify(support.from) && JSON.stringify(object.to) === JSON.stringify(support.to))
    check(`${support.id}-all-collinear`, nearZero(cross(vector(support.from, support.to), vector(support.from, support.first)))
      && nearZero(cross(vector(support.from, support.to), vector(support.from, support.second))))
    const first = parameter(support.from, support.to, support.first)
    const second = parameter(support.from, support.to, support.second)
    check(`${support.id}-extension-point-order`, first > 0 && first < second && second < 1, { parameters: [0, first, second, 1] })
    check(`${support.id}-coincident-origin-ray`, rayContains(support.first, support.second, support.first, support.to)
      && rayContains(support.first, support.to, support.first, support.second))
    check(`${support.id}-strictly-nested-rays`, rayContains(support.from, support.to, support.first, support.to)
      && rayContains(support.first, support.to, support.second, support.to)
      && !rayContains(support.second, support.to, support.first, support.to))
  }
  const x = contract.crossing
  check('a-unmarked-crossing-two-supports', nearZero(cross(vector('a-A1', 'a-A3'), vector('a-A1', x)))
    && nearZero(cross(vector('a-A2', 'a-B2'), vector('a-A2', x))))
  check('a-unmarked-crossing-point-order', parameter('a-A1', 'a-A3', x) > 0 && parameter('a-A1', 'a-A3', x) < 1
    && parameter('a-A2', 'a-B2', x) > 0 && parameter('a-A2', 'a-B2', x) < 1)
  check('a-no-invented-crossing-dot', !spec.objects.some(o => o.type === 'point' && Math.hypot(...vector(o.at, x)) < 0.001))
  for (let i = 1; i < contract.originOrderB.length; i++)
    check(`b-source-origin-order-${i}`, point(contract.originOrderB[i - 1])[1] > point(contract.originOrderB[i])[1])
  const startsB = contract.rayChecks.filter(ray => ray.panel === 'b').map(ray => objects.get(ray.from))
  check('b-all-five-origin-markers', startsB.length === 5 && startsB.every(p => p.visible === true))
  check('no-invented-B-markers', ['a-B1', 'a-B2', 'a-B3', 'b-B'].every(id => objects.get(id).visible === false))
  check('only-approved-modern-labels', spec.objects.filter(o => o.label || o.text).map(o => o.label || o.text).sort().join('|')
    === ['A\u2081', 'B\u2081', 'A\u2082', 'B\u2082', 'A\u2083', 'B\u2083', 'A', 'B', 'a)', 'b)'].sort().join('|'))
  write('relationship-check.json', { schema: 'ld-s10y-image/relationship-check@1', status: 'pass',
    spec: { path: 'fig-216.spec.json', sha256: hash('fig-216.spec.json') },
    contract: { path: 'relationship-contract.json', sha256: hash('relationship-contract.json') },
    checks, nativeAssertions: spec.assertions.length })
} catch (error) {
  write('relationship-check.first-failure.json', { status: 'fail', error: error.message, checks })
  throw error
}

const svg = fs.readFileSync(path.join(work, 'fig-216.svg'), 'utf8')
const appCssPath = path.join(repo, 'app/src/styles/app.css')
const appCss = fs.readFileSync(appCssPath, 'utf8').replace(/^@import[^\n]*$/gm, '')
const media = id => `<figure class="sr-compact-figure" data-figure-id="fig-216" data-surface="${id}"
  data-figure-layout="inline" data-figure-purpose="instructional" style="width:${spec.display.maxWidthPx}px;max-width:100%">
  <div class="sr-figure-media" data-figure-mode="deterministic" data-figure-purpose="instructional"
  data-figure-theme="neutral" style="width:${spec.display.maxWidthPx}px;max-width:100%">
  <div class="sr-figure-vector" aria-hidden="true">${svg}</div></div></figure>`
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Figure 216</title>
  <style>${appCss}</style><style>
  html,body{height:auto;overflow:auto;background:var(--sr-white)}
  body{margin:0;color:var(--sr-ink);font-family:var(--sr-font);letter-spacing:0}
  main{box-sizing:border-box;max-width:900px;margin:0 auto;padding:16px}
  h1{font-size:18px;margin:0 0 16px;font-weight:600}
  h2{font-size:14px;margin:0 0 8px;font-weight:600}
  .sr-read{margin:0}
  .narrow{display:none;width:calc(100% - 27px);margin:24px auto 0}
  @media(max-width:860px){.narrow{display:block}}
  </style><main><h1>Figure 216</h1><div class="sr-read">
  <section><h2>Directions</h2>${media('prose')}</section>
  <section class="narrow"><h2>Directions</h2>${media('narrow')}</section>
  </div></main></html>`
fs.writeFileSync(path.join(work, 'display.html'), html, { flag: 'wx' })
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  .find(file => fs.existsSync(file))
assert.ok(executablePath, 'Installed Chromium is required; no install is authorized')
const browser = await chromium.launch({ executablePath, headless: false })
const display = { schema: 'ld-s10y-image/headed-display@1', status: 'running', headed: true,
  fixture: 'Isolated offline FigureMedia markup with current product CSS and explicit approved media widths; no product/DB request.',
  appCss: { path: 'app/src/styles/app.css', sha256: hashFile(appCssPath), importsOmitted: 'All external/dependency imports; no network or install.' },
  spec: { path: 'fig-216.spec.json', sha256: hash('fig-216.spec.json') },
  svg: { path: 'fig-216.svg', sha256: hash('fig-216.svg') },
  html: { path: 'display.html', sha256: hash('display.html') },
  executablePath, networkRequests: [], views: [], screenshotCaptures: 0, browserClosed: false }
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => { display.networkRequests.push(route.request().url()); return route.abort() })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const [width, height, name] of [[1440, 960, 'desktop'], [390, 844, 'mobile']]) {
    await page.setViewportSize({ width, height })
    await page.setContent(html)
    await page.evaluate(() => document.fonts.ready)
    const state = await page.evaluate(async () => {
      const results = []
      for (const figure of document.querySelectorAll('[data-surface]')) {
        if (!figure.getBoundingClientRect().width || !figure.getBoundingClientRect().height) continue
        const media = figure.querySelector('.sr-figure-media')
        const svg = media.querySelector('svg')
        const bounds = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          const rect = node.getBoundingClientRect()
          return { id: node.getAttribute('data-label-id'), text: node.textContent,
            px: Number.parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            inBounds: rect.left >= bounds.left - 0.1 && rect.right <= bounds.right + 0.1
              && rect.top >= bounds.top - 0.1 && rect.bottom <= bounds.bottom + 0.1 }
        })
        const clone = svg.cloneNode(true)
        // Resolve product semantic colors before testing the actual current vector pixels.
        for (const element of clone.querySelectorAll('[stroke],[fill]')) {
          const original = svg.querySelector(`[id="${element.id}"]`)
          if (!original) continue
          for (const attr of ['stroke', 'fill']) if (element.getAttribute(attr)?.includes('var('))
            element.setAttribute(attr, getComputedStyle(original)[attr])
        }
        const image = new Image()
        const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }))
        try {
          image.src = url
          await image.decode()
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(bounds.width)
          canvas.height = Math.round(bounds.height)
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
          let ink = 0
          for (let i = 0; i < data.length; i += 4) if (data[i] < 180 && data[i + 1] < 180 && data[i + 2] < 180) ink++
          results.push({ surface: figure.dataset.surface, mediaWidth: bounds.width, mediaHeight: bounds.height,
            labelCount: labels.length, minimumTextPx: Math.min(...labels.map(label => label.px)),
            labels, inkPixels: ink, blank: ink < 400, blackFraction: ink / (canvas.width * canvas.height),
            clipped: media.getBoundingClientRect().width + 0.1 < bounds.width })
        } finally { URL.revokeObjectURL(url) }
      }
      return { figures: results, horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        documentHeight: document.documentElement.scrollHeight }
    })
    const expected = name === 'desktop' ? [640] : [358, 331]
    assert.deepEqual(state.figures.map(item => item.mediaWidth), expected)
    assert.equal(state.horizontalOverflow, false)
    for (const figure of state.figures) {
      assert.equal(figure.labelCount, 10)
      assert.ok(figure.minimumTextPx >= 16)
      assert.ok(figure.labels.every(label => label.inBounds))
      assert.equal(figure.clipped, false)
      assert.equal(figure.blank, false)
      assert.ok(figure.blackFraction < 0.15)
    }
    assert.deepEqual(errors, [])
    assert.deepEqual(display.networkRequests, [])
    const screenshot = `display-${name}.png`
    await page.screenshot({ path: path.join(work, screenshot), fullPage: true, animations: 'disabled' })
    display.screenshotCaptures++
    display.views.push({ viewport: { width, height }, ...state, screenshot: { path: screenshot, sha256: hash(screenshot) }, status: 'pass' })
  }
  display.status = 'pass'
} catch (error) {
  display.status = 'fail'
  display.error = error.message
  throw error
} finally {
  await browser.close()
  display.browserClosed = true
  write(display.status === 'pass' ? 'display-report.json' : 'display-report.first-failure.json', display)
}
console.log(JSON.stringify({ relationshipAssertions: checks.length, nativeAssertions: spec.assertions.length,
  displayStatus: display.status, screenshots: display.screenshotCaptures, browserClosed: display.browserClosed,
  measuredWidths: display.views.flatMap(view => view.figures.map(figure => figure.mediaWidth)) }))
