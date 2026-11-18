import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(root, '../../../../..')
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const cssPath = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssPath, 'utf8')
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const save = (name, data) => {
  const p = path.join(root, name)
  assert(!fs.existsSync(p), `Refusing to overwrite ${p}`)
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const browser = await chromium.launch({
  headless: true, env: { ...process.env, PWDEBUG: '0' },
})
const receipts = []
const errors = []
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  const blockedNetwork = []
  await context.route('**/*', route => {
    blockedNetwork.push(route.request().url())
    return route.abort()
  })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  for (const number of [177, 178]) {
    const figure = `fig-${number}`
    const dir = path.join(root, figure)
    const svgPath = path.join(dir, `${figure}.svg`)
    const svg = fs.readFileSync(svgPath, 'utf8')
    const spec = JSON.parse(fs.readFileSync(path.join(dir, 'spec.json'), 'utf8'))
    const checks = []
    for (const width of spec.display.widths) {
      await page.setViewportSize({ width, height: 400 })
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
        <style>${css}</style>
        <style>
          html, body { margin: 0; padding: 0; width: 100%; background: var(--sr-white); overflow: hidden; }
          .sr-figure-media { margin: 0; width: ${width}px; max-width: ${spec.display.maxWidthPx}px; }
        </style></head><body>
        <div class="sr-figure-media" data-testid="candidate">${svg}</div>
        </body></html>`)
      await page.evaluate(() => document.fonts.ready)
      const check = await page.evaluate(({ spec, width }) => {
        const media = document.querySelector('[data-testid="candidate"]')
        const svg = media.querySelector('svg')
        const rect = svg.getBoundingClientRect()
        const roles = ['ink', 'muted', 'accent', 'accent-soft', 'grid', 'paper']
          .map(role => ({
            role, value: getComputedStyle(media).getPropertyValue(`--ld-figure-${role}`).trim(),
          }))
        const labelRects = [...svg.querySelectorAll('text')].map(node => {
          const r = node.getBoundingClientRect()
          const m = node.getScreenCTM()
          return { id: node.dataset.labelId, text: node.textContent,
            effectiveFontPx: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(m.a, m.b),
            fill: getComputedStyle(node).fill,
            rect: { x: r.x, y: r.y, width: r.width, height: r.height },
            contained: r.left >= rect.left && r.right <= rect.right &&
              r.top >= rect.top && r.bottom <= rect.bottom }
        })
        const overlaps = []
        for (let a = 0; a < labelRects.length; a++) {
          for (let b = a + 1; b < labelRects.length; b++) {
            const x = labelRects[a].rect
            const y = labelRects[b].rect
            if (Math.min(x.x + x.width, y.x + y.width) > Math.max(x.x, y.x) &&
                Math.min(x.y + x.height, y.y + y.height) > Math.max(x.y, y.y)) {
              overlaps.push([labelRects[a].id, labelRects[b].id])
            }
          }
        }
        const geometry = spec.objects.filter(o => ['segment', 'point'].includes(o.type)).map(o => {
          const node = document.getElementById(`ld-${spec.id}_ld-${o.id}`)
          if (!node) return { id: o.id, present: false }
          const computed = getComputedStyle(node)
          const box = node.getBoundingClientRect()
          const matrix = node.getScreenCTM()
          return { id: o.id, type: o.type, present: true, tag: node.tagName,
            strokeAttribute: node.getAttribute('stroke'),
            fillAttribute: node.getAttribute('fill'),
            stroke: computed.stroke, fill: computed.fill,
            dash: computed.strokeDasharray,
            effectiveStrokePx: parseFloat(computed.strokeWidth) * Math.hypot(matrix.a, matrix.b),
            display: computed.display, visibility: computed.visibility,
            contained: box.left >= rect.left && box.right <= rect.right &&
              box.top >= rect.top && box.bottom <= rect.bottom,
            rect: { x: box.x, y: box.y, width: box.width, height: box.height } }
        })
        return { width, actualSvgWidth: rect.width, actualSvgHeight: rect.height,
          deviceScaleFactor: devicePixelRatio, roles, labels: labelRects, labelOverlaps: overlaps,
          measuredMinTextPx: Math.min(...labelRects.map(l => l.effectiveFontPx)),
          geometry, svgBackground: getComputedStyle(svg).backgroundColor }
      }, { spec, width })
      assert.equal(check.actualSvgWidth, width)
      assert.equal(check.deviceScaleFactor, 1)
      assert(check.roles.every(r => r.value && !r.value.includes('var(')))
      assert(check.measuredMinTextPx >= 16)
      if (width === 342) assert(check.measuredMinTextPx >= 17)
      assert.deepEqual(check.labels.map(l => l.text), ['F', 'F', 'O'])
      assert(check.labels.every(l => l.contained && l.fill === 'rgb(21, 32, 31)'))
      assert.equal(check.labelOverlaps.length, 0)
      assert(check.geometry.every(g => g.present && g.contained &&
        g.display !== 'none' && g.visibility === 'visible' && g.stroke === 'rgb(21, 32, 31)'))
      assert(check.geometry.filter(g => g.type === 'segment')
        .every(g => g.dash === 'none' && g.effectiveStrokePx > 2))
      assert(check.geometry.filter(g => g.id.endsWith('-focus'))
        .every(g => g.fill === 'rgb(255, 255, 255)' && g.strokeAttribute.includes('var(--ld-figure-ink')))
      check.authorMechanicalObservation = 'PASS-NOT-INDEPENDENT-DISPLAY-APPROVAL'
      if (width === 342) {
        const screenshot = path.join(dir, `${figure}.actual-342.native.png`)
        assert(!fs.existsSync(screenshot))
        await page.getByTestId('candidate').screenshot({ path: screenshot, animations: 'disabled' })
        check.screenshot = { path: screenshot, sha256: sha(screenshot) }
      }
      checks.push(check)
    }
    // Sample the actual Chromium screenshot, not an alternate SVG rasterizer.
    const pixelChecks = []
    for (const [kind, filename, width] of [
      ['full-native', `${figure}.full.native.png`, 640],
      ['actual-342-native', `${figure}.actual-342.native.png`, 342],
    ]) {
      const p = path.join(dir, filename)
      const result = await page.evaluate(async ({ png, width, spec }) => {
        const image = new Image()
        image.src = png
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(image, 0, 0)
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const scale = width / spec.canvas.width
        const screen = ([x, y]) => [(320 + x * 80) * scale, (176 - y * 80) * scale]
        const light = (x, y) => {
          const index = (Math.round(y) * canvas.width + Math.round(x)) * 4
          return data[index] + data[index + 1] + data[index + 2]
        }
        const darkNear = (at, radius = 2) => {
          const [x, y] = screen(at)
          let count = 0
          for (let dx = -radius; dx <= radius; dx++)
            for (let dy = -radius; dy <= radius; dy++)
              if (light(x + dx, y + dy) < 450) count++
          return count
        }
        let darkPixels = 0
        for (let i = 0; i < data.length; i += 4)
          if (data[i] + data[i + 1] + data[i + 2] < 450) darkPixels++
        const points = new Map(spec.objects.filter(o => o.type === 'point').map(o => [o.id, o.at]))
        const strokeSamples = spec.objects.filter(o => o.type === 'segment').map(o => {
          const a = points.get(o.from), b = points.get(o.to)
          const midpoint = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
          return { id: o.id, darkPixelsNearMidpoint: darkNear(midpoint) }
        })
        const focusHoles = spec.objects.filter(o => o.id.endsWith('-focus')).map(o => {
          const [x, y] = screen(o.at)
          return { id: o.id, centerRGBSum: light(x, y) }
        })
        return { imageWidth: canvas.width, imageHeight: canvas.height, darkPixels,
          axisLeftSample: darkNear([-3.3, 0]), lensUpperSample: darkNear([0, 0.8]),
          strokeSamples, focusHoles }
      }, { png: `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`, width, spec })
      assert.equal(result.imageWidth, width)
      assert(result.darkPixels > 500)
      assert(result.axisLeftSample > 0 && result.lensUpperSample > 0)
      assert(result.strokeSamples.every(s => s.darkPixelsNearMidpoint > 0))
      assert(result.focusHoles.every(f => f.centerRGBSum > 690))
      pixelChecks.push({ kind, path: p, sha256: sha(p), ...result })
    }
    const receipt = { figure, source: spec.source.image,
      spec: { path: path.join(dir, 'spec.json'), sha256: sha(path.join(dir, 'spec.json')) },
      svg: { path: svgPath, sha256: sha(svgPath) }, checks, pixelChecks }
    save(`${figure}/display-native-receipt.json`, receipt)
    receipts.push(receipt)
  }
  assert.equal(errors.length, 0)
  save('display-receipts.json', {
    scope: 'Isolated headless Chromium author-only inline SVG observation; not full-card/product/independent DISPLAY acceptance',
    browser: { version: browser.version(), headless: true, isolated: true, deviceScaleFactor: 1 },
    stylesheet: { path: cssPath, sha256: sha(cssPath), applied: 'Actual local app stylesheet, with requested inline maxWidthPx sizing' },
    rerenderedSpecs: false, svgArtifactsEdited: false, resvgUsed: false,
    pageErrors: errors, blockedNetwork, figures: receipts,
    independentFIG: 'PENDING', independentDISPLAY: 'PENDING',
  })
  console.log(JSON.stringify({ status: 'AUTHOR-NATIVE-DISPLAY-OBSERVATIONS-COMPLETE', figures: [177, 178], screenshotsAdded: 2 }))
} catch (error) {
  save('display-first-failure.json', { status: 'AUTHOR-DISPLAY-HOLD', message: error.message, stack: error.stack })
  throw error
} finally {
  await browser.close()
}
