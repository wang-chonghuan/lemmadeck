import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180'
if (process.cwd() !== root) throw new Error('Wrong author workdir')
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s1-n7/figure-author-30-31'
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const executable = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  .find(file => fs.existsSync(file))
if (!executable) throw new Error('Existing Chromium unavailable; no installation authorized')
const browser = await chromium.launch({ executablePath: executable, headless: false })
const suffix = process.argv[2] === 'repair1' ? '.repair1' : ''
try {
  for (const id of ['fig-30', 'fig-31']) {
    const stem = `${id}${suffix}`
    const specPath = `${durable}/${stem}.spec.json`
    const svgPath = `${durable}/${stem}.svg`
    const screenshot = `${durable}/${stem}.widths.png`
    const evidence = `${durable}/${stem}.pixels.json`
    if (fs.existsSync(screenshot) || fs.existsSync(evidence)) throw new Error('Do not replace first pixel evidence')
    const spec = JSON.parse(fs.readFileSync(specPath))
    const svg = fs.readFileSync(svgPath, 'utf8')
    const render = JSON.parse(fs.readFileSync(`${durable}/${stem}.render.json`))
    assert.equal(render.status, 'pass')
    assert.equal(render.spec.sha256, hash(specPath))
    assert.equal(render.output.svg.sha256, hash(svgPath))
    const expected = id === 'fig-30'
      ? ['I', 'II', 'v', 't', '0']
      : ['v', 'v\u2081', 's = vt', 's\u2081 = |v\u2081|t', 'v', 't', '0']
    const page = await browser.newPage({ viewport: { width: 862, height: 650 }, deviceScaleFactor: 1 })
    try {
      await page.setContent(`<!doctype html><meta charset="utf-8">
        <style>
          body { margin: 0; padding: 8px; width: 846px; background: white; font: 14px Arial; }
          main { display: grid; grid-template-columns: 480px 358px; gap: 8px; align-items: start; }
          figure { margin: 0 0 8px; }
          figcaption { height: 22px; color: #333; }
          svg { display: block; width: 100%; height: auto; }
        </style>
        <main><figure data-width="480" style="width:480px"><figcaption>480 px</figcaption>${svg}</figure>
          <div><figure data-width="358" style="width:358px"><figcaption>358 px</figcaption>${svg}</figure>
          <figure data-width="318" style="width:318px"><figcaption>318 px</figcaption>${svg}</figure></div></main>`)
      const geometry = await page.evaluate(async ({ spec, expected }) => {
        const figureChecks = []
        for (const host of document.querySelectorAll('figure')) {
          const svg = host.querySelector('svg')
          const width = Number(host.dataset.width)
          const viewport = svg.getBoundingClientRect()
          const labels = [...svg.querySelectorAll('text')].map(text => {
            const matrix = text.getScreenCTM()
            const bounds = text.getBoundingClientRect()
            return { id: text.dataset.labelId, text: text.textContent,
              px: Number(text.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
              clipped: bounds.left < viewport.left || bounds.right > viewport.right ||
                bounds.top < viewport.top || bounds.bottom > viewport.bottom }
          })
          if (JSON.stringify(labels.map(label => label.text)) !== JSON.stringify(expected)) throw new Error('Source label/subscript/sign inventory changed')
          if (labels.some(label => label.clipped || label.px < 16)) throw new Error('Clipped or undersized actual inline labels')
          figureChecks.push({ width, labels, status: 'pass' })
        }
        const svg = document.querySelector('figure[data-width="480"] svg')
        const image = new Image()
        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = spec.canvas.width
        canvas.height = spec.canvas.height
        const context = canvas.getContext('2d', { willReadFrequently: true })
        context.fillStyle = 'white'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data
        const [xmin, ymax, xmax, ymin] = spec.canvas.boundingBox
        const screen = ([x, y]) => [(x - xmin) * canvas.width / (xmax - xmin),
          (ymax - y) * canvas.height / (ymax - ymin)]
        const dark = (x, y) => {
          x = Math.max(0, Math.min(canvas.width - 1, Math.round(x)))
          y = Math.max(0, Math.min(canvas.height - 1, Math.round(y)))
          const p = (y * canvas.width + x) * 4
          return data[p + 3] > 128 && (data[p] + data[p + 1] + data[p + 2]) / 3 < 180
        }
        const points = Object.fromEntries(spec.objects.filter(o => o.type === 'point').map(o => [o.id, o.at]))
        const coordinate = value => Array.isArray(value) ? value : points[value]
        const edgeChecks = []
        const edgeIds = spec.id === 'fig-30' ? ['I-line', 'II-line', 'time-axis', 'velocity-axis']
          : ['upper-top', 'upper-side', 'upper-base', 'upper-axis-side',
            'lower-bottom', 'lower-side', 'lower-base', 'lower-axis-side', 'time-axis', 'velocity-axis']
        for (const id of edgeIds) {
          const object = spec.objects.find(o => o.id === id)
          const a = screen(coordinate(object.from)), b = screen(coordinate(object.to))
          let hits = 0
          for (let i = 1; i <= 80; i++) {
            const t = i / 81
            const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t
            if (dark(x, y) || dark(x + 1, y) || dark(x, y + 1) || dark(x - 1, y) || dark(x, y - 1)) hits++
          }
          if (hits / 80 < 0.95) throw new Error(`Missing rendered boundary: ${id}`)
          edgeChecks.push({ id, samples: 80, darkHits: hits, status: 'pass' })
        }
        const hatchChecks = []
        const regionChecks = []
        if (spec.id === 'fig-31') {
          for (const object of spec.objects.filter(o => o.type === 'segment' && o.id.includes('-hatch-'))) {
            const a = coordinate(object.from), b = coordinate(object.to)
            const rising = object.id.startsWith('upper')
            if ((b[1] - a[1] > 0) !== rising) throw new Error('Wrong hatch slope')
            const [x, y] = screen([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])
            const drawn = dark(x, y) || dark(x + 1, y) || dark(x, y + 1) || dark(x - 1, y) || dark(x, y - 1)
            if (!drawn) throw new Error(`Blank rendered hatch ${object.id}`)
            hatchChecks.push({ id: object.id, direction: rising ? 'rising' : 'falling', status: 'pass' })
          }
          for (const [id, width, low, high] of [['upper', 8.6, 0, 3], ['lower', 7.1, -3.3, 0]]) {
            const [left, top] = screen([0, high]), [right, bottom] = screen([width, low])
            let count = 0, total = 0
            for (let y = Math.ceil(top) + 5; y < bottom - 5; y++) {
              for (let x = Math.ceil(left) + 5; x < right - 5; x++) {
                total++
                if (dark(x, y)) count++
              }
            }
            const fraction = count / total
            if (fraction < 0.03 || fraction > 0.30) throw new Error(`${id} is blank or filled, not sparse hatching`)
            regionChecks.push({ id, darkFraction: fraction, pixels: total, status: 'pass' })
          }
          const polygons = spec.objects.filter(o => o.type === 'polygon')
          if (polygons.length !== 2 || polygons.some(o => o.fillOpacity !== 0)) throw new Error('Filled rectangle substitute')
        }
        return { figureChecks, edgeChecks, hatchChecks, regionChecks, status: 'pass' }
      }, { spec, expected })
      await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' })
      fs.writeFileSync(evidence, `${JSON.stringify({
        schema: 'ld-s10y-image/author-pixels@1', figure: id, status: 'pass',
        independentApproval: false, surface: 'Local saved SVG, headed Chromium; no DB or app calls.',
        workdir: root,
        spec: { path: specPath, sha256: hash(specPath) },
        svg: { path: svgPath, sha256: hash(svgPath) },
        render: { path: `${durable}/${stem}.render.json`, sha256: hash(`${durable}/${stem}.render.json`) },
        screenshot: { path: screenshot, sha256: hash(screenshot) },
        ...geometry,
      }, null, 2)}\n`)
      console.log(`PIXELS PASS: ${id}, widths 318/358/480, ${geometry.edgeChecks.length} boundaries, ${geometry.hatchChecks.length} hatch segments`)
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
