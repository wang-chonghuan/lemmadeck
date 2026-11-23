import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), cwd)
const owned = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(cwd, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const candidates = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
const executablePath = candidates.find((file) => fs.existsSync(file))
assert.ok(executablePath, 'existing Chromium required; no installation')
const browser = await chromium.launch({ executablePath, headless: true })
const results = []
try {
  for (const id of ['fig-234', 'fig-235']) {
    const specFile = path.join(owned, `${id}.spec.json`)
    const svgFile = path.join(owned, `${id}.svg`)
    const spec = JSON.parse(fs.readFileSync(specFile))
    const svg = fs.readFileSync(svgFile, 'utf8')
    const render = JSON.parse(fs.readFileSync(path.join(owned, `${id}.render.json`)))
    assert.equal(render.status, 'pass')
    assert.equal(hash(specFile), render.spec.sha256)
    assert.equal(hash(svgFile), render.output.svg.sha256)
    const page = await browser.newPage()
    const figure = { id, specSha256: hash(specFile), svgSha256: hash(svgFile), checks: [] }
    for (const width of spec.display.widths) {
      const height = Math.ceil(spec.canvas.height * width / spec.canvas.width)
      await page.setViewportSize({ width, height })
      await page.setContent(`<!doctype html><style>
        html,body{margin:0;background:white;overflow:hidden}
        #surface{width:${width}px;height:${height}px}
        #surface>svg{display:block;width:100%;height:auto}
      </style><div id="surface">${svg}</div>`)
      const metrics = await page.evaluate(({ spec, width, id }) => {
        const svg = document.querySelector('#surface>svg')
        const svgRect = svg.getBoundingClientRect()
        const expected = spec.objects.filter((item) => item.label).map((item) => item.label)
        const labels = [...svg.querySelectorAll('text')].map((node) => {
          const matrix = node.getScreenCTM()
          const box = node.getBBox()
          const rect = node.getBoundingClientRect()
          return {
            id: node.getAttribute('data-label-id'), text: node.textContent,
            px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            nativeBox: { x: box.x, y: box.y, width: box.width, height: box.height },
          }
        })
        const minTextPx = Math.min(...labels.map((item) => item.px))
        const noClipping = labels.every((item) =>
          item.bounds.x >= -0.01 && item.bounds.y >= -0.01 &&
          item.bounds.x + item.bounds.width <= svgRect.width + 0.01 &&
          item.bounds.y + item.bounds.height <= svgRect.height + 0.01,
        )
        let labelFootprintInside = null
        if (id === 'fig-235') {
          const objects = new Map(spec.objects.map((item) => [item.id, item]))
          const polygon = objects.get('s235-boundary').points.map((ref) => objects.get(ref).at)
          const rect = labels[0].nativeBox
          const corners = [[rect.x, rect.y], [rect.x + rect.width, rect.y],
            [rect.x, rect.y + rect.height], [rect.x + rect.width, rect.y + rect.height]]
          const [xmin, ymax, xmax, ymin] = spec.canvas.boundingBox
          const toUser = ([x, y]) => [
            xmin + x * (xmax - xmin) / spec.canvas.width,
            ymax - y * (ymax - ymin) / spec.canvas.height,
          ]
          const margin = 4 / (spec.canvas.width / (xmax - xmin))
          labelFootprintInside = corners.map(toUser).every((corner) =>
            polygon.every((a, i) => {
              const b = polygon[(i + 1) % polygon.length]
              const signed = ((b[0] - a[0]) * (corner[1] - a[1]) -
                (b[1] - a[1]) * (corner[0] - a[0])) / Math.hypot(b[0] - a[0], b[1] - a[1])
              return signed < -margin
            }),
          )
        }
        return {
          width: svgRect.width, height: svgRect.height, expected, labels,
          minTextPx, noClipping, labelFootprintInside,
          mediaWidthMatches: Math.abs(svgRect.width - width) < 0.01,
        }
      }, { spec, width, id })
      assert.ok(metrics.mediaWidthMatches)
      assert.deepEqual(metrics.labels.map((item) => item.text), metrics.expected)
      assert.ok(metrics.minTextPx >= 16 - 0.01)
      assert.ok(metrics.noClipping)
      if (id === 'fig-235') assert.equal(metrics.labelFootprintInside, true)
      const pixels = await page.evaluate(async () => {
        const svg = document.querySelector('#surface>svg')
        const image = new Image()
        image.src = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(svg))}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = svg.clientWidth
        canvas.height = Math.ceil(svg.getBoundingClientRect().height)
        const context = canvas.getContext('2d', { willReadFrequently: true })
        context.fillStyle = '#fff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data
        let ink = 0
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] < 180 && data[i + 1] < 180 && data[i + 2] < 180) ink += 1
        }
        return { width: canvas.width, height: canvas.height, inkPixels: ink, inkRatio: ink / (canvas.width * canvas.height) }
      })
      assert.ok(pixels.inkRatio > 0.003 && pixels.inkRatio < 0.15)
      const previewFile = path.join(owned, `${id}.w${width}.png`)
      await page.screenshot({ path: previewFile, animations: 'disabled', type: 'png' })
      figure.checks.push({ status: 'pass', requestedWidth: width, metrics, pixels,
        preview: { path: previewFile, sha256: hash(previewFile) } })
    }
    await page.close()
    results.push(figure)
  }
  fs.writeFileSync(path.join(owned, 'display-check.json'), `${JSON.stringify({
    schema: 'author-display-check@1', status: 'pass',
    surface: 'offline complete SVG at exact media widths, headless existing Chromium, no app/DB/network',
    actualImageLoadsByThisScript: 0, note: 'Generated PNG files are not loaded into agent context by this script.',
    results,
  }, null, 2)}\n`)
  console.log('PASS: complete previews rebuilt and measured at 294,310,346,358,640; all labels >=16px, no clipping, nonblank pixels, O label footprint interior.')
} finally {
  await browser.close()
}
