import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { chromium } from '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.agents/skills/node_modules/playwright-core/index.mjs'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d139-n17-fig23-author')
assert.equal(process.cwd(), repo)
const require = createRequire(import.meta.url)
const { Resvg } = require(path.join(repo, '.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js'))
const read = name => JSON.parse(fs.readFileSync(path.join(own, name), 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(own, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const file = p => {
  const bytes = fs.readFileSync(p)
  return { path: p, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const input = read('input-freeze.json')
const spec = read('spec.current.json')
const render = read('fig-23.render.json')
assert.equal(render.status, 'pass')
const currentSvg = fs.readFileSync(path.join(own, 'fig-23.svg'), 'utf8')
const oldSvg = fs.readFileSync(path.join(repo, input.oldSvg.path), 'utf8')
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})
try {
  const page = await browser.newPage()
  await page.route('**/*', route => route.abort())
  const geometrySvg = async svgText => page.evaluate(svgText => {
    const document = new DOMParser().parseFromString(svgText, 'image/svg+xml')
    if (document.querySelector('parsererror')) throw new Error('Invalid SVG')
    document.querySelectorAll('[id$="-label-layer"]').forEach(node => node.remove())
    return new XMLSerializer().serializeToString(document.documentElement)
  }, svgText)
  const oldGeometry = await geometrySvg(oldSvg)
  const currentGeometry = await geometrySvg(currentSvg)
  const compare = width => {
    const options = { fitTo: { mode: 'width', value: width } }
    const previous = new Resvg(oldGeometry, options).render()
    const current = new Resvg(currentGeometry, options).render()
    assert.equal(previous.width, current.width)
    assert.equal(previous.height, current.height)
    const a = previous.pixels
    const b = current.pixels
    let differentPixels = 0
    let maximumChannelDelta = 0
    for (let i = 0; i < a.length; i += 4) {
      let differs = false
      for (let channel = 0; channel < 4; channel += 1) {
        const delta = Math.abs(a[i + channel] - b[i + channel])
        maximumChannelDelta = Math.max(maximumChannelDelta, delta)
        differs ||= delta !== 0
      }
      if (differs) differentPixels += 1
    }
    return { width: current.width, height: current.height, differentPixels, maximumChannelDelta, status: differentPixels === 0 ? 'pass' : 'fail' }
  }
  const geometryPixels = [640, 331].map(compare)
  write('geometry-pixels.json', {
    oldSvg: file(path.join(repo, input.oldSvg.path)),
    currentSvg: file(path.join(own, 'fig-23.svg')),
    method: 'Parse immutable old/current SVG as XML; remove only their label layer in memory; rasterize both using the same existing Resvg runtime at 640 and 331 pixels. Never rewrite generated SVG.',
    comparisons: geometryPixels,
    status: geometryPixels.every(result => result.status === 'pass') ? 'pass' : 'fail',
  })
  const previews = []
  for (const width of [640, 331]) {
    const height = Math.ceil(spec.canvas.height * width / spec.canvas.width)
    await page.setViewportSize({ width, height })
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      html,body { margin:0; padding:0; width:${width}px; background:#fff; }
      body > svg { display:block; width:${width}px; height:auto; }
    </style></head><body>${currentSvg}</body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const measurements = await page.evaluate(() => {
      const svg = document.querySelector('body > svg')
      const box = svg.getBoundingClientRect()
      return {
        media: { width: box.width, height: box.height },
        labels: [...svg.querySelectorAll('[data-label-id]')].map(node => {
          const box = node.getBoundingClientRect()
          const matrix = node.getScreenCTM()
          return {
            id: node.getAttribute('data-label-id'),
            text: node.textContent,
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
            finalFontPx: Number.parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          }
        }),
      }
    })
    assert.equal(measurements.media.width, width)
    assert.equal(measurements.labels.length, 12)
    assert.ok(measurements.labels.every(label => label.finalFontPx >= 16))
    const previewPath = path.join(own, `fig-23.w${width}.png`)
    assert.ok(!fs.existsSync(previewPath))
    await page.locator('body > svg').screenshot({ path: previewPath, animations: 'disabled' })
    previews.push({ ...file(previewPath), width, height, ...measurements, browser: 'existing local Chrome / playwright-core, offline', observedByAuthor: false })
  }
  write('preview-receipt.json', {
    cwd: repo,
    currentSpec: file(path.join(own, 'spec.current.json')),
    currentSvg: file(path.join(own, 'fig-23.svg')),
    render: file(path.join(own, 'fig-23.render.json')),
    fullPreview: file(path.join(own, 'fig-23.full.png')),
    previews,
    geometryPixels,
    network: 'All browser requests aborted; local setContent and locally installed runtime only.',
    independentReview: 'not-performed',
  })
  console.log(JSON.stringify({
    geometryPixels,
    previews: previews.map(preview => ({ path: preview.path, width: preview.width, height: preview.height, minimumFinalFontPx: Math.min(...preview.labels.map(label => label.finalFontPx)) })),
  }, null, 2))
} finally {
  await browser.close()
}
