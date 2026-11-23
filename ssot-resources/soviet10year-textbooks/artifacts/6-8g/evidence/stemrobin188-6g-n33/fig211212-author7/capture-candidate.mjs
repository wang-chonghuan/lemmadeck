import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
if (process.cwd() !== root) throw new Error('Wrong working directory')
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n33-fig211212-author7')
const [figure, revision, ...widthArgs] = process.argv.slice(2)
if (!['fig-211', 'fig-212'].includes(figure) || !['1', '2'].includes(revision)) throw new Error('Out of scope')
const widths = widthArgs.map(Number)
if (!widths.length || widths.some((width) => ![640, 358].includes(width))) throw new Error('Unexpected screenshot width')
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const dir = path.join(owned, figure, `candidate-${revision}`)
const svgFile = path.join(dir, `${figure}.svg`)
const specFile = path.join(dir, 'spec.json')
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'))
const svg = fs.readFileSync(svgFile, 'utf8')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const artifact = (file) => ({ path: file, sha256: hash(file) })
const reportFile = path.join(dir, `display-${widths.join('-')}.json`)
if (fs.existsSync(reportFile)) throw new Error('Refusing to overwrite retained evidence')
const report = {
  scope: 'offline author display evidence, not product acceptance or independent review',
  cwd: root, browser: 'headless Chromium; no GUI/product surface verified',
  network: 'all browser requests blocked; local inline SVG only',
  spec: artifact(specFile), svg: artifact(svgFile), widths: [],
}
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  await context.route('**/*', (route) => route.abort())
  const page = await context.newPage()
  for (const width of widths) {
    const height = Math.ceil(width * spec.canvas.height / spec.canvas.width)
    const screenshot = path.join(dir, `${width === 640 ? 'desktop' : 'mobile'}-${width}.png`)
    if (fs.existsSync(screenshot)) throw new Error('Refusing to overwrite screenshot')
    await page.setViewportSize({ width, height })
    await page.setContent(`<html><head><style>
      html,body{margin:0;background:white;overflow:hidden}
      svg{display:block;width:${width}px;height:auto}
    </style></head><body>${svg}</body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const measurement = await page.evaluate(({ width, height }) => {
      const svg = document.querySelector('svg')
      const labels = [...svg.querySelectorAll('text')].map((node) => {
        const box = node.getBoundingClientRect()
        const matrix = node.getScreenCTM()
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          box: { x: box.x, y: box.y, width: box.width, height: box.height },
          inside: box.x >= 0 && box.y >= 0 && box.right <= width && box.bottom <= height,
        }
      })
      const strokes = [...svg.querySelectorAll('path,line,polyline,circle')].filter((node) =>
        typeof node.getTotalLength === 'function' && node.getAttribute('display') !== 'none',
      ).map((node) => {
        const length = node.getTotalLength()
        const matrix = node.getScreenCTM()
        const samples = []
        for (let index = 0; index <= 100; index += 1) {
          const point = node.getPointAtLength(length * index / 100)
          const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix)
          samples.push([screen.x, screen.y])
        }
        return {
          id: node.id, length,
          inside: samples.every(([x, y]) => x >= -0.1 && y >= -0.1 && x <= width + 0.1 && y <= height + 0.1),
          sampleBounds: [
            Math.min(...samples.map(([x]) => x)), Math.min(...samples.map(([, y]) => y)),
            Math.max(...samples.map(([x]) => x)), Math.max(...samples.map(([, y]) => y)),
          ],
        }
      })
      return {
        labels, strokes, nonblankGeometry: strokes.some((item) => item.length > 20),
        media: { width: svg.getBoundingClientRect().width, height: svg.getBoundingClientRect().height },
      }
    }, { width, height })
    await page.screenshot({ path: screenshot, fullPage: false })
    report.widths.push({
      width, height, screenshot: artifact(screenshot), ...measurement,
      checks: {
        labelMinimum16: measurement.labels.every((item) => item.px >= 16),
        labelsInside: measurement.labels.every((item) => item.inside),
        sampledGeometryInside: measurement.strokes.every((item) => item.inside),
        nonblank: measurement.nonblankGeometry,
      },
    })
  }
} finally {
  await browser.close()
}
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ figure, candidate: Number(revision), displayEvidence: artifact(reportFile), widths: report.widths.map(({ width, checks }) => ({ width, checks })) }, null, 2))
