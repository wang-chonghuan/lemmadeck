import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

process.env.PWDEBUG = ''
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const out = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(out, '../../../../..')
const require = createRequire(path.join(root, 'app/package.json'))
const { chromium } = require('playwright')
const { PNG } = require(path.join(root, 'app/node_modules/playwright-core/lib/utilsBundle.js'))
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const initialDir = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes')
const preserved = [
  ['report.md', 'aa1df86402201cea61034198ccb39c71bea6e83d82c50e6ed7956d59b618656d'],
  ['check.mjs', 'd8c548a249c5968bc4397945ca93e0a72912002e431d943a62d631d713f6f2fe'],
  ['measurements.json', 'faa5729bf90d05cd7437fed9874d2240eee5d9d98d1895bd74518e2c1b6b5553'],
  ['run-once.json', 'bdbed4ddb75c02929e09443077241586aa8d1b9a88baed32de9f25425b38dfe7'],
  ['fig-60-accent-640.png', '3c8292ecce43588d158f3d10577eb6f07f69823d09876d1cae6d8b0873a68a38'],
  ['fig-60-print-640.png', '3c8292ecce43588d158f3d10577eb6f07f69823d09876d1cae6d8b0873a68a38'],
].map(([name, sha256]) => ({ path: path.join(initialDir, name), sha256 }))
const input = {
  path: path.join(root, '.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/exercises.html'),
  sha256: 'd0c5e597f9ceba9f1da0e797368b0155243188107fc0cddd1011bec77512d914',
  inlineSvgSha256: 'c95440ec1a1df2cf2eda584269454fa7d13f1fe755b958b03a5051c24edcae38',
}
const reportPath = path.join(out, 'measurements.json')
assert(!fs.existsSync(reportPath), 'Never overwrite another measurement run')
fs.writeFileSync(path.join(out, 'run-once.json'), JSON.stringify({ startedAt: new Date().toISOString() }) + '\n', { flag: 'wx' })
const evidence = {
  schema: 'ticket-scratch/n15-fig61-scroll-harness-repair@1',
  ticket: 'STEMROBIN-184',
  scope: 'Authorized affected-only harness repair: fig61 accent/actual print, no figure or other acceptance rerun',
  input, preserved,
  helper: { path: fileURLToPath(import.meta.url), sha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))) },
  startedAt: new Date().toISOString(),
  launch: {
    headless: true, deviceScaleFactor: 1, viewport: { width: 1440, height: 960 },
    persistentProfile: false, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never',
    browserPackage: require.resolve('playwright'), serviceWorkers: 'block',
    network: 'Abort non-file/data before navigation; no remote page, server, renderer, or model',
  },
  palettePolicy: {
    accent: 'Existing media --ld-figure-accent:var(--accent), --ld-figure-accent-soft:var(--sub)',
    print: 'Remove accent overrides; actual print media; no synthetic print stylesheet',
  },
  tolerancePolicy: {
    canvasPx: .1, scrollEndpointPx: 1, rasterDimensionPx: 1,
    explanation: 'One CSS pixel for integer scrollWidth/clientWidth and fractional clip raster rounding; SVG canvas bounds retain 0.1px tolerance',
  },
  cases: [], abortedRemoteRequests: [], pageErrors: [],
  initialFilesUnchanged: false, inputUnchanged: false, svgDomUnchanged: false,
  browserClosed: false, status: 'running',
}

const verifyPreserved = () => {
  for (const file of preserved) assert.equal(sha(fs.readFileSync(file.path)), file.sha256, `Preserve ${file.path}`)
  assert.equal(sha(fs.readFileSync(input.path)), input.sha256, 'Preserve existing exercises HTML')
}

const measure = node => {
  const media = node.querySelector('.figure-media')
  const svg = media.querySelector('svg')
  const rect = svg.getBoundingClientRect()
  const mediaRect = media.getBoundingClientRect()
  const native = svg.viewBox.baseVal
  const box = r => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height })
  const matrix = m => ({ a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f })
  const figureStyle = getComputedStyle(node)
  const clippingAncestors = []
  let viewport = { left: 0, top: 0, right: innerWidth, bottom: innerHeight }
  for (let ancestor = media; ancestor; ancestor = ancestor.parentElement) {
    const style = getComputedStyle(ancestor)
    const r = ancestor.getBoundingClientRect()
    const client = {
      left: r.left + parseFloat(style.borderLeftWidth),
      right: r.right - parseFloat(style.borderRightWidth),
      top: r.top + parseFloat(style.borderTopWidth),
      bottom: r.bottom - parseFloat(style.borderBottomWidth),
    }
    const clipsX = ['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowX)
    const clipsY = ['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowY)
    if (clipsX || clipsY) {
      clippingAncestors.push({ tag: ancestor.tagName, id: ancestor.id, overflowX: style.overflowX, overflowY: style.overflowY, client })
      if (clipsX) {
        viewport.left = Math.max(viewport.left, client.left)
        viewport.right = Math.min(viewport.right, client.right)
      }
      if (clipsY) {
        viewport.top = Math.max(viewport.top, client.top)
        viewport.bottom = Math.min(viewport.bottom, client.bottom)
      }
    }
  }
  viewport.width = viewport.right - viewport.left
  viewport.height = viewport.bottom - viewport.top
  const surface = {
    left: Math.max(viewport.left, rect.left), right: Math.min(viewport.right, rect.right),
    top: Math.max(viewport.top, rect.top), bottom: Math.min(viewport.bottom, rect.bottom),
  }
  surface.width = surface.right - surface.left
  surface.height = surface.bottom - surface.top
  const visibleRange = { left: surface.left - rect.left, right: surface.right - rect.left }
  const visible = element => {
    if (element.closest('defs')) return false
    for (let e = element; e && e !== svg.parentElement; e = e.parentElement) {
      const style = getComputedStyle(e)
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false
    }
    return true
  }
  const bounds = element => {
    const b = element.getBBox(), m = element.getScreenCTM()
    const points = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
      .map(([x, y]) => new DOMPoint(x, y).matrixTransform(m))
    return {
      left: Math.min(...points.map(p => p.x)) - rect.left,
      right: Math.max(...points.map(p => p.x)) - rect.left,
      top: Math.min(...points.map(p => p.y)) - rect.top,
      bottom: Math.max(...points.map(p => p.y)) - rect.top,
    }
  }
  const finite = b => Object.values(b).every(Number.isFinite)
  const outside = b => !finite(b) || b.left < -.1 || b.top < -.1 || b.right > rect.width + .1 || b.bottom > rect.height + .1
  const labels = [...svg.querySelectorAll('text')].filter(visible).map(element => {
    const m = element.getScreenCTM(), style = getComputedStyle(element), b = bounds(element)
    const sum = m.a ** 2 + m.b ** 2 + m.c ** 2 + m.d ** 2
    const determinant = m.a * m.d - m.b * m.c
    const minScale = Math.sqrt(Math.max(0, (sum - Math.sqrt(Math.max(0, sum ** 2 - 4 * determinant ** 2))) / 2))
    return {
      id: element.getAttribute('data-label-id'), text: element.textContent,
      cssFontSize: style.fontSize, ctm: matrix(m),
      actualMinTextPx: parseFloat(style.fontSize) * minScale,
      bounds: b, clippedInCanvas: outside(b), fill: style.fill,
      fullyVisibleInSurface: finite(b) &&
        b.left >= visibleRange.left - .1 && b.right <= visibleRange.right + .1 &&
        b.top >= surface.top - rect.top - .1 && b.bottom <= surface.bottom - rect.top + .1,
    }
  })
  const painted = [...svg.querySelectorAll('path,line,polygon,polyline,rect,circle,ellipse,text')].filter(visible)
    .map(element => {
      const style = getComputedStyle(element)
      const fill = style.fill !== 'none' && Number(style.fillOpacity) > 0
      const stroke = style.stroke !== 'none' && Number(style.strokeOpacity) > 0 && parseFloat(style.strokeWidth) > 0
      return { element, style, fill, stroke }
    }).filter(p => p.fill || p.stroke)
  const palette = Object.fromEntries(['ink', 'muted', 'accent', 'accent-soft', 'grid', 'paper'].map(role => {
    const property = `--ld-figure-${role}`
    const probe = document.createElement('span')
    probe.style.color = `var(${property})`
    media.append(probe)
    const color = getComputedStyle(probe).color
    probe.remove()
    return [role, { property, declaration: getComputedStyle(media).getPropertyValue(property).trim(), color }]
  }))
  const luminance = color => {
    const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => {
      const s = v / 255
      return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4
    })
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722
  }
  const contrast = color => {
    const a = luminance(color), b = luminance(palette.paper.color)
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
  }
  const colors = [...new Set(painted.flatMap(p => [p.fill ? p.style.fill : null, p.stroke ? p.style.stroke : null]).filter(Boolean))]
  const geometry = painted.filter(p => p.element.tagName !== 'text').map(p => ({
    id: p.element.id || p.element.tagName, bounds: bounds(p.element),
  }))
  return {
    declaredLayout: node.dataset.figureLayout,
    overflowX: figureStyle.overflowX, overflowY: figureStyle.overflowY, direction: figureStyle.direction,
    figure: box(node.getBoundingClientRect()),
    clientWidth: node.clientWidth, clientHeight: node.clientHeight,
    scrollWidth: node.scrollWidth, scrollHeight: node.scrollHeight,
    scrollLeft: node.scrollLeft, maxScrollLeft: node.scrollWidth - node.clientWidth,
    clippingAncestors, viewport, surface, visibleRange,
    clip: { x: surface.left + scrollX, y: surface.top + scrollY, width: surface.width, height: surface.height },
    mediaWidth: mediaRect.width, mediaHeight: mediaRect.height,
    svg: box(rect), nativeWidth: native.width, nativeHeight: native.height,
    viewBox: svg.getAttribute('viewBox'), nativeAspect: native.width / native.height,
    svgScreenCTM: matrix(svg.getScreenCTM()),
    actualMedia: matchMedia('print').matches ? 'print' : 'screen',
    palette, paintedColors: colors.map(color => ({ color, contrastAgainstPaper: contrast(color) })),
    labels, declaredLabelCount: svg.querySelectorAll('text').length,
    minTextPx: Math.min(...labels.map(label => label.actualMinTextPx)),
    minTextContrast: Math.min(...labels.map(label => contrast(label.fill))),
    geometry, paintedGeometryCount: geometry.length,
    clippedGeometryIds: geometry.filter(p => outside(p.bounds)).map(p => p.id),
    usedRoles: [...new Set(painted.flatMap(p => ['fill', 'stroke'].flatMap(attribute => {
      const value = p.element.getAttribute(attribute) || ''
      return [...value.matchAll(/var\(--ld-figure-([a-z-]+)/g)].map(match => match[1])
    })))],
  }
}

const assertSurface = (metrics, theme) => {
  assert.equal(metrics.declaredLayout, 'scroll', 'Declared scroll layout, not an implicit clipping fallback')
  assert.equal(metrics.overflowX, 'auto', 'Real scroll CSS remains active')
  assert.equal(metrics.direction, 'ltr', 'Nonnegative LTR scroll contract')
  for (const value of [metrics.clientWidth, metrics.clientHeight, metrics.viewport.width, metrics.viewport.height, metrics.surface.width, metrics.surface.height]) {
    assert(Number.isFinite(value) && value > 0, 'Finite positive real viewport')
  }
  assert(Number.isFinite(metrics.maxScrollLeft) && metrics.maxScrollLeft >= 0, 'Finite scroll range')
  assert(Math.abs(metrics.mediaWidth - 640) < .1 && Math.abs(metrics.svg.width - 640) < .1, 'Existing native-width 640 media')
  assert(metrics.nativeWidth > 0 && metrics.nativeHeight > 0 && Number.isFinite(metrics.nativeAspect), 'Finite native canvas')
  assert(Math.abs(metrics.svg.height - 640 / metrics.nativeAspect) < .1, 'Native SVG aspect retained')
  assert(Math.abs(metrics.mediaHeight - metrics.svg.height) < .1, 'Full media height')
  assert(Math.abs(metrics.surface.height - metrics.svg.height) < .1, 'Full SVG height actually visible, including ancestor clipping')
  assert(metrics.labels.length > 0 && metrics.labels.every(label => label.id && !label.clippedInCanvas), 'All native labels finite and within SVG canvas')
  assert.equal(metrics.labels.length, metrics.declaredLabelCount, 'Every declared SVG label remains visible')
  assert(new Set(metrics.labels.map(label => label.id)).size === metrics.labels.length, 'Unique label coverage IDs')
  assert(metrics.clippedGeometryIds.length === 0 && metrics.paintedGeometryCount > 0, 'Finite native geometry within canvas')
  assert(Number.isFinite(metrics.minTextPx) && metrics.minTextPx >= 16, 'Actual CTM text >=16px')
  assert(metrics.minTextContrast >= 4.5, 'Text contrast >=4.5:1')
  assert(metrics.paintedColors.every(p => p.contrastAgainstPaper >= 3 || p.color === metrics.palette.paper.color), 'Painted contrast >=3:1')
  assert.equal(metrics.actualMedia, theme === 'print' ? 'print' : 'screen')
  if (theme === 'accent') assert.notEqual(metrics.palette.accent.color, metrics.palette.ink.color, 'Existing accent actually resolves')
}

const captureSurface = async (page, current, side, metrics) => {
  const screenshotPath = path.join(out, `fig-61-${current.theme}-${side}-visible.png`)
  assert(!fs.existsSync(screenshotPath), 'Never overwrite a screenshot')
  const bytes = await page.screenshot({ path: screenshotPath, clip: metrics.clip, animations: 'disabled', scale: 'css' })
  const png = PNG.sync.read(bytes)
  let nonPaperPixels = 0, darkPixels = 0
  for (let i = 0; i < png.data.length; i += 4) {
    const [r, g, b, a] = png.data.subarray(i, i + 4)
    if (a && Math.min(r, g, b) < 245) nonPaperPixels++
    if (a && Math.max(r, g, b) < 100) darkPixels++
  }
  current[side].screenshot = {
    path: screenshotPath, sha256: sha(bytes), width: png.width, height: png.height,
    nonPaperPixels, darkPixels, totalPixels: png.width * png.height,
    capturePolicy: 'Page clip of actual visible SVG intersection with every clipping ancestor and browser viewport; no full-media screenshot',
  }
  assert(Math.abs(png.width - metrics.surface.width) <= 1 && Math.abs(png.height - metrics.surface.height) <= 1, 'Faithful visible clip within raster rounding')
  assert(nonPaperPixels > 100 && darkPixels > 100 && nonPaperPixels / (png.width * png.height) < .85, 'Actual visible surface nonblank and not black')
  current[side].status = 'pass'
}

let browser
try {
  verifyPreserved()
  browser = await chromium.launch({ headless: true })
  evidence.launch.browserVersion = browser.version()
  const context = await browser.newContext({
    viewport: evidence.launch.viewport, deviceScaleFactor: 1, serviceWorkers: 'block',
  })
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (['file:', 'data:'].includes(url.protocol)) return route.continue()
    evidence.abortedRemoteRequests.push({ origin: url.origin, resourceType: route.request().resourceType() })
    return route.abort('blockedbyclient')
  })
  const page = await context.newPage()
  page.on('pageerror', error => evidence.pageErrors.push(error.message))
  await page.goto(pathToFileURL(input.path).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  assert.deepEqual(await page.locator('figure.fig').evaluateAll(nodes => nodes.map(node => node.id)), ['fig-61'])
  const figure = page.locator('#fig-61')
  const svgBefore = await figure.locator('svg').evaluate(node => node.outerHTML)
  assert.equal(sha(svgBefore), input.inlineSvgSha256, 'The same existing fig61 SVG as the initial attempt')
  const stylesheetBefore = await page.evaluate(() => [...document.styleSheets].flatMap(sheet => [...sheet.cssRules].map(rule => rule.cssText)))
  evidence.existingScrollCss = await page.evaluate(() => [...document.styleSheets]
    .flatMap(sheet => [...sheet.cssRules])
    .filter(rule => rule.selectorText?.includes('data-figure-layout="scroll"'))
    .map(rule => rule.cssText))
  assert(evidence.existingScrollCss.length > 0, 'Actual declared scroll stylesheet exists')
  for (const theme of ['accent', 'print']) {
    const current = { figure: 'fig-61', theme, status: 'running' }
    evidence.cases.push(current)
    await page.emulateMedia({ media: theme === 'print' ? 'print' : 'screen' })
    await figure.locator('.figure-media').evaluate((node, active) => {
      if (active === 'accent') {
        node.style.setProperty('--ld-figure-accent', 'var(--accent)')
        node.style.setProperty('--ld-figure-accent-soft', 'var(--sub)')
      } else {
        node.style.removeProperty('--ld-figure-accent')
        node.style.removeProperty('--ld-figure-accent-soft')
      }
    }, theme)
    await figure.scrollIntoViewIfNeeded()
    await figure.evaluate(node => { node.scrollLeft = 0 })
    await page.waitForFunction(() => Math.abs(document.getElementById('fig-61').scrollLeft) < .1)
    const left = await figure.evaluate(measure)
    current.left = { metrics: left }
    assertSurface(left, theme)
    assert(Math.abs(left.scrollLeft) < .1, 'Left endpoint starts at scrollLeft 0')
    assert(left.svg.left >= left.viewport.left - .1 && left.svg.left < left.viewport.right, 'Actual SVG left endpoint reachable')
    assert(left.visibleRange.left <= .1, 'Left surface includes native SVG x=0')
    current.displayDisposition = left.surface.width < left.svg.width - .1 ? 'scroll-two-visible-surfaces' : 'full-width-visible'
    await captureSurface(page, current, 'left', left)

    await figure.evaluate(node => { node.scrollLeft = node.scrollWidth - node.clientWidth })
    await page.waitForFunction(() => {
      const node = document.getElementById('fig-61')
      return Math.abs(node.scrollLeft - (node.scrollWidth - node.clientWidth)) <= 1
    })
    const right = await figure.evaluate(measure)
    current.right = { metrics: right }
    assertSurface(right, theme)
    assert(Math.abs(right.scrollLeft - right.maxScrollLeft) <= 1, 'Actual scroll end reached')
    assert.equal(right.scrollWidth, left.scrollWidth, 'Scroll content width stable')
    assert.equal(right.clientWidth, left.clientWidth, 'Scroll viewport stable')
    assert(right.svg.right <= right.viewport.right + 1 && right.svg.right > right.viewport.left, 'Actual SVG right endpoint reachable')
    assert(right.visibleRange.right >= right.svg.width - 1, 'Right surface reaches native SVG right endpoint within integer scroll rounding')
    assert(Math.abs(right.svg.left - (left.svg.left - right.scrollLeft)) <= 1, 'Scroll moves the real SVG, not a substituted view')
    assert(left.visibleRange.right >= right.visibleRange.left - .1, 'Left/right surfaces cover the entire native canvas without a gap')
    assert.deepEqual(right.labels.map(label => label.id), left.labels.map(label => label.id), 'No labels disappear after scrolling')
    current.labelCoverage = left.labels.map((label, index) => ({
      id: label.id, text: label.text,
      leftFullyVisible: label.fullyVisibleInSurface,
      rightFullyVisible: right.labels[index].fullyVisibleInSurface,
    }))
    assert(current.labelCoverage.every(label => label.leftFullyVisible || label.rightFullyVisible), 'Every label fully readable in at least one real endpoint surface')
    await captureSurface(page, current, 'right', right)
    current.status = 'pass'
  }
  assert.equal(evidence.cases.length, 2, 'Only fig61 accent/print were checked')
  assert.equal(await figure.locator('svg').evaluate(node => node.outerHTML), svgBefore, 'No SVG DOM changes')
  evidence.svgDomUnchanged = true
  assert.deepEqual(await page.evaluate(() => [...document.styleSheets].flatMap(sheet => [...sheet.cssRules].map(rule => rule.cssText))), stylesheetBefore, 'No stylesheet alterations')
  evidence.stylesheetsUnchanged = true
  assert.deepEqual(evidence.pageErrors, [])
  evidence.status = 'mechanical-pass-pending-exact-four-new-visual-inspections'
} catch (error) {
  evidence.status = 'fail-stop-no-repeat-no-figure-repair'
  evidence.failure = error.stack
  process.exitCode = 1
} finally {
  if (browser) {
    await browser.close()
    evidence.browserClosed = !browser.isConnected()
  }
  try {
    verifyPreserved()
    evidence.initialFilesUnchanged = true
    evidence.inputUnchanged = true
  } catch (error) {
    evidence.status = 'fail-stop-preservation-mismatch'
    evidence.preservationFailure = error.stack
    process.exitCode = 1
  }
  evidence.finishedAt = new Date().toISOString()
  fs.writeFileSync(reportPath, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' })
}
console.log(JSON.stringify({
  status: evidence.status, themes: evidence.cases.length,
  screenshots: evidence.cases.reduce((count, item) => count + ['left', 'right'].filter(side => item[side]?.screenshot).length, 0),
  browserClosed: evidence.browserClosed, initialFilesUnchanged: evidence.initialFilesUnchanged,
  reportPath, sha256: sha(fs.readFileSync(reportPath)),
}))
