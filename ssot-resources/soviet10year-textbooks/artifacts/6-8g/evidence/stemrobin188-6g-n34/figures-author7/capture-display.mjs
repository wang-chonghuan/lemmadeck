import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), root)
const own = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const artifact = file => ({ path: path.resolve(file), sha256: hash(file) })
const nativeFile = path.join(root, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')
const nativeSource = fs.readFileSync(nativeFile, 'utf8')
const css = nativeSource.match(/const CSS = `([\s\S]*?)`;/)[1].replace('${katexCss()}', '')
const reportFile = path.join(own, 'display.json')
assert(!fs.existsSync(reportFile), 'Do not overwrite prior display evidence')
const browser = await chromium.launch({ headless: true })
const report = {
  scope: 'Offline author display checks using existing native lesson figure CSS; not a native lesson finalize, live product acceptance, or independent image review',
  cwd: root,
  nativeStyle: artifact(nativeFile),
  nativeCss: 'Unchanged figure/layout CSS extracted from native render_lesson.js; local KaTeX CSS excluded because there are no formula-renderer elements in these figures',
  network: { permittedRequests: 0, observedRequests: 0 },
  widths: [],
}
try {
  for (const [surface, viewport] of [
    ['desktop', { width: 1440, height: 960 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    for (const id of ['tbl-p0160-01', 'fig-213']) {
      const specFile = path.join(own, `${id}.spec.json`)
      const svgFile = path.join(own, `${id}.svg`)
      const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'))
      const svg = fs.readFileSync(svgFile, 'utf8')
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
      await page.route('**/*', route => {
        report.network.observedRequests++
        return route.abort()
      })
      const maxStyle = spec.display.maxWidthPx
        ? ` style="width:${spec.display.maxWidthPx}px;max-width:100%"`
        : ''
      await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css}</style>
        <main class="sheet"><div class="fig" data-figure-layout="${spec.display.layout}"
          data-figure-purpose="instructional"><div class="figure-media"${maxStyle}>${svg}</div></div></main>`)
      await page.evaluate(() => document.fonts.ready)
      const measurement = await page.evaluate(({ spec }) => {
        const figure = document.querySelector('.fig')
        const media = document.querySelector('.figure-media')
        const svg = media.querySelector('svg')
        const matrix = svg.getScreenCTM()
        const view = svg.viewBox.baseVal
        const mediaRect = media.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const box = node.getBBox()
          const matrix = node.getScreenCTM()
          const fontSize = Number.parseFloat(node.getAttribute('font-size'))
          return {
            id: node.getAttribute('data-label-id'), text: node.textContent,
            font: node.getAttribute('font-family'),
            fontPx: fontSize * Math.hypot(matrix.a, matrix.b),
            box: { x: box.x, y: box.y, width: box.width, height: box.height },
          }
        })
        const geometry = [...svg.querySelectorAll('line,path,polygon,polyline,circle,ellipse,rect')]
          .filter(node => !node.closest('defs') && node.getAttribute('display') !== 'none' &&
            Number.parseFloat(node.getAttribute('stroke-width') || '0') > 0 &&
            Number.parseFloat(node.getAttribute('stroke-opacity') || '1') > 0 &&
            Number.parseFloat(node.getAttribute('opacity') || '1') > 0)
          .map(node => {
            const box = node.getBBox()
            return { id: node.id, box: { x: box.x, y: box.y, width: box.width, height: box.height } }
          })
        const outside = box => box.x < view.x - 0.1 || box.y < view.y - 0.1 ||
          box.x + box.width > view.x + view.width + 0.1 ||
          box.y + box.height > view.y + view.height + 0.1
        const labelOverlap = []
        for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i].box, b = labels[j].box
          if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
              Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)) {
            labelOverlap.push([labels[i].id, labels[j].id])
          }
        }
        const cells = labels.filter(label => label.id.startsWith('src-sign-')).map(label => {
          const match = label.id.match(/^src-sign-(reflexive|symmetric|transitive)-c([1-5])-label$/)
          const row = ['reflexive', 'symmetric', 'transitive'].indexOf(match[1])
          const col = Number(match[2]) - 1
          const bounds = { left: 204 + col * 84, right: 204 + (col + 1) * 84, top: 112 + row * 88, bottom: 200 + row * 88 }
          const b = label.box
          return {
            id: label.id, text: label.text, bounds,
            wholeGlyphInsideCell: b.x > bounds.left && b.x + b.width < bounds.right &&
              b.y > bounds.top && b.y + b.height < bounds.bottom,
          }
        })
        const originalScroll = figure.scrollLeft
        figure.scrollLeft = figure.scrollWidth
        const scrollEnd = {
          clientWidth: figure.clientWidth, scrollWidth: figure.scrollWidth,
          maxScroll: figure.scrollWidth - figure.clientWidth, reached: figure.scrollLeft,
          rightmostEdgeReachable: Math.abs(figure.scrollLeft - (figure.scrollWidth - figure.clientWidth)) <= 1,
        }
        figure.scrollLeft = originalScroll
        return {
          layout: spec.display.layout, mediaWidth: mediaRect.width, mediaHeight: mediaRect.height,
          actualTransformScale: Math.hypot(matrix.a, matrix.b),
          viewport: { width: innerWidth, height: innerHeight },
          labels, geometry, labelOverlap, cells, scrollEnd,
          textClipping: labels.filter(label => outside(label.box)).map(label => label.id),
          geometryClipping: geometry.filter(item => outside(item.box)).map(item => item.id),
          bodyHorizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        }
      }, { spec })
      assert.equal(measurement.bodyHorizontalOverflow, false)
      assert.equal(measurement.textClipping.length, 0)
      assert.equal(measurement.geometryClipping.length, 0)
      assert.equal(measurement.labelOverlap.length, 0)
      assert(measurement.labels.every(label => label.fontPx >= 16))
      assert(measurement.cells.every(cell => cell.wholeGlyphInsideCell))
      if (id === 'tbl-p0160-01') {
        assert.equal(measurement.mediaWidth, 640)
        assert.equal(measurement.labels.length, 24)
        assert.equal(measurement.cells.length, 15)
        assert(measurement.scrollEnd.rightmostEdgeReachable)
        if (surface === 'mobile') assert(measurement.scrollEnd.maxScroll > 0)
      } else {
        assert.equal(measurement.mediaWidth, surface === 'mobile' ? 358 : 640)
        assert.equal(measurement.labels.length, 0, 'No source point or line labels')
        assert.equal(spec.objects.filter(object => object.type === 'segment').length, 8)
      }
      const screenshot = path.join(own, `${id}.${surface}.png`)
      assert(!fs.existsSync(screenshot))
      // Capture the full media, including the fixed-width scroll content, not a clipped viewport fragment.
      await page.locator('.figure-media').screenshot({ path: screenshot, animations: 'disabled' })
      const afterScreenshot = await page.evaluate(() => ({
        viewport: { width: innerWidth, height: innerHeight },
        mediaWidth: document.querySelector('.figure-media').getBoundingClientRect().width,
      }))
      const checks = {
        noClipping: true, noLabelOverlap: true, allVisibleTextAtLeast16Px: true,
        allSignsInsideOwnCells: true, rightmostAndBottomGeometryPresent: true,
        scrollEndReachable: measurement.scrollEnd.rightmostEdgeReachable,
      }
      report.widths.push({
        figure: id, surface, configuredViewport: viewport,
        spec: artifact(specFile), svg: artifact(svgFile), screenshot: artifact(screenshot),
        screenshotScope: spec.display.layout === 'scroll'
          ? 'Full 640px native fixed-scroll media rendered with this viewport; horizontal end mechanically exercised before capture'
          : 'Full native inline media rendered with this viewport',
        measurement, afterScreenshot, checks,
      })
      await page.close()
    }
  }
  assert.equal(report.network.observedRequests, 0)
  report.status = 'pass'
} catch (error) {
  report.status = 'fail'
  report.failure = { message: error.message, stack: error.stack }
  throw error
} finally {
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n')
  await browser.close()
}
console.log(JSON.stringify({
  status: report.status,
  report: artifact(reportFile),
  figures: report.widths.map(item => ({
    figure: item.figure, surface: item.surface, mediaWidth: item.measurement.mediaWidth,
    minimumTextPx: item.measurement.labels.length ? Math.min(...item.measurement.labels.map(label => label.fontPx)) : null,
    screenshot: item.screenshot, scrollEnd: item.measurement.scrollEnd,
  })),
}, null, 2))
