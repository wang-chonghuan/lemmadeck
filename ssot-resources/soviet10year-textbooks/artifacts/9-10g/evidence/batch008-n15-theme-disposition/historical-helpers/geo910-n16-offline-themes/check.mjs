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
const htmlPath = path.join(root, '.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n16/text.html')
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const htmlHash = sha(fs.readFileSync(htmlPath))
const reportPath = path.join(out, 'measurements.json')
assert(!fs.existsSync(reportPath), 'Never overwrite another run')
const evidence = {
  schema: 'ticket-scratch/n16-missing-offline-themes@1',
  ticket: 'STEMROBIN-184',
  scope: 'Missing accent/print only; not source, mathematics, neutral, mobile, or formal acceptance',
  input: { path: htmlPath, sha256: htmlHash },
  helper: { path: fileURLToPath(import.meta.url), sha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))) },
  startedAt: new Date().toISOString(),
  launch: {
    headless: true, deviceScaleFactor: 1, viewport: { width: 1440, height: 960 },
    persistentProfile: false, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never',
    browserPackage: require.resolve('playwright'),
    network: 'Abort every non-file/data request; no server or renderer',
  },
  palettePolicy: {
    accent: 'Set existing media accent to var(--accent), accent-soft to var(--sub); leave other declared roles unchanged',
    print: 'Remove accent overrides, emulate actual print media; no synthetic print stylesheet',
  },
  cases: [], abortedRemoteRequests: [], pageErrors: [], browserClosed: false, status: 'running',
}
let browser
try {
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
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const ids = await page.locator('figure.fig').evaluateAll(nodes => nodes.map(node => node.id))
  assert.deepEqual(ids, ['fig-62', 'fig-63', 'fig-64', 'fig-65'])
  const svgBefore = await page.locator('figure.fig svg').evaluateAll(nodes => nodes.map(node => node.outerHTML))
  evidence.inlineSvgSha256 = Object.fromEntries(ids.map((id, i) => [id, sha(svgBefore[i])]))
  for (const theme of ['accent', 'print']) {
    await page.emulateMedia({ media: theme === 'print' ? 'print' : 'screen' })
    await page.locator('figure.fig .figure-media').evaluateAll((nodes, current) => {
      for (const node of nodes) {
        if (current === 'accent') {
          node.style.setProperty('--ld-figure-accent', 'var(--accent)')
          node.style.setProperty('--ld-figure-accent-soft', 'var(--sub)')
        } else {
          node.style.removeProperty('--ld-figure-accent')
          node.style.removeProperty('--ld-figure-accent-soft')
        }
      }
    }, theme)
    for (const id of ids) {
      const media = page.locator(`#${id} .figure-media`)
      await media.scrollIntoViewIfNeeded()
      const metrics = await media.evaluate(node => {
        const svg = node.querySelector('svg')
        const rect = svg.getBoundingClientRect()
        const mediaRect = node.getBoundingClientRect()
        const figureRect = node.closest('figure').getBoundingClientRect()
        const matrix = m => ({ a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f })
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
        const outside = b => b.left < -0.1 || b.top < -0.1 || b.right > rect.width + 0.1 || b.bottom > rect.height + 0.1
        const labels = [...svg.querySelectorAll('text')].filter(visible).map(element => {
          const m = element.getScreenCTM(), style = getComputedStyle(element), b = bounds(element)
          const sum = m.a ** 2 + m.b ** 2 + m.c ** 2 + m.d ** 2
          const determinant = m.a * m.d - m.b * m.c
          const minScale = Math.sqrt(Math.max(0, (sum - Math.sqrt(Math.max(0, sum ** 2 - 4 * determinant ** 2))) / 2))
          return {
            id: element.getAttribute('data-label-id'), text: element.textContent,
            cssFontSize: style.fontSize, ctm: matrix(m),
            actualMinTextPx: parseFloat(style.fontSize) * minScale,
            bounds: b, clipped: outside(b), fill: style.fill,
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
          node.append(probe)
          const color = getComputedStyle(probe).color
          probe.remove()
          return [role, { property, declaration: getComputedStyle(node).getPropertyValue(property).trim(), color }]
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
        const geometry = painted.filter(p => p.element.tagName !== 'text')
        return {
          mediaWidth: mediaRect.width, svgWidth: rect.width, svgHeight: rect.height,
          viewBox: svg.getAttribute('viewBox'), svgScreenCTM: matrix(svg.getScreenCTM()),
          mediaFitsFigure: mediaRect.left >= figureRect.left - .1 && mediaRect.right <= figureRect.right + .1,
          actualMedia: matchMedia('print').matches ? 'print' : 'screen',
          palette, paintedColors: colors.map(color => ({ color, contrastAgainstPaper: contrast(color) })),
          labels, minTextPx: Math.min(...labels.map(label => label.actualMinTextPx)),
          minTextContrast: Math.min(...labels.map(label => contrast(label.fill))),
          paintedGeometryCount: geometry.length,
          clippedGeometryIds: geometry.filter(p => outside(bounds(p.element))).map(p => p.element.id || p.element.tagName),
          usedRoles: [...new Set(painted.flatMap(p => ['fill', 'stroke'].flatMap(attribute => {
            const value = p.element.getAttribute(attribute) || ''
            return [...value.matchAll(/var\(--ld-figure-([a-z-]+)/g)].map(match => match[1])
          })))],
        }
      })
      const current = { figure: id, theme, metrics }
      evidence.cases.push(current)
      assert(Math.abs(metrics.mediaWidth - 640) < .1 && Math.abs(metrics.svgWidth - 640) < .1, 'Full 640 media')
      assert(metrics.mediaFitsFigure && !metrics.labels.some(label => label.clipped), 'Fit and label bounds')
      assert(metrics.clippedGeometryIds.length === 0 && metrics.paintedGeometryCount > 0, 'Geometry fits and exists')
      assert(metrics.labels.length > 0 && metrics.minTextPx >= 16, 'Actual CTM text >=16px')
      assert(metrics.minTextContrast >= 4.5, 'Text contrast >=4.5:1')
      assert(metrics.paintedColors.every(p => p.contrastAgainstPaper >= 3 || p.color === metrics.palette.paper.color), 'Visible geometry contrast >=3:1')
      assert.equal(metrics.actualMedia, theme === 'print' ? 'print' : 'screen')
      const screenshotPath = path.join(out, `${id}-${theme}-640.png`)
      assert(!fs.existsSync(screenshotPath), 'Never overwrite a screenshot')
      const bytes = await media.screenshot({ path: screenshotPath, animations: 'disabled', scale: 'css' })
      const png = PNG.sync.read(bytes)
      let nonPaperPixels = 0, darkPixels = 0
      for (let i = 0; i < png.data.length; i += 4) {
        const [r, g, b, a] = png.data.subarray(i, i + 4)
        if (a && Math.min(r, g, b) < 245) nonPaperPixels++
        if (a && Math.max(r, g, b) < 100) darkPixels++
      }
      current.screenshot = {
        path: screenshotPath, sha256: sha(bytes), width: png.width, height: png.height,
        nonPaperPixels, darkPixels, totalPixels: png.width * png.height,
      }
      assert.equal(png.width, 640)
      assert(nonPaperPixels > 100 && darkPixels > 100 && nonPaperPixels / (png.width * png.height) < .85, 'Nonblank and not black')
      current.status = 'pass'
    }
  }
  assert.equal(evidence.cases.length, 8)
  assert.deepEqual(await page.locator('figure.fig svg').evaluateAll(nodes => nodes.map(node => node.outerHTML)), svgBefore, 'No SVG DOM changes')
  assert.equal(sha(fs.readFileSync(htmlPath)), htmlHash, 'No offline input changes')
  assert.deepEqual(evidence.pageErrors, [])
  evidence.status = 'mechanical-pass-pending-exact-eight-visual-inspections'
} catch (error) {
  evidence.status = 'fail-stop-no-repair'
  evidence.failure = error.stack
  process.exitCode = 1
} finally {
  if (browser) {
    await browser.close()
    evidence.browserClosed = !browser.isConnected()
  }
  evidence.finishedAt = new Date().toISOString()
  fs.writeFileSync(reportPath, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' })
}
console.log(JSON.stringify({ status: evidence.status, cases: evidence.cases.length, browserClosed: evidence.browserClosed, reportPath, sha256: sha(fs.readFileSync(reportPath)) }))
