import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = process.cwd()
const require = createRequire(path.join(root, 'app/package.json'))
const { chromium } = require('playwright')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const cssPath = path.join(root, 'app/src/styles/app.css')
const css = fs.readFileSync(cssPath, 'utf8')
const items = ['fig-60', 'fig-61'].map((id) => {
  const directory = path.join(root, '.tmp/s10y-image/9-10g', id)
  const svgPath = path.join(directory, `${id}.svg`)
  const specPath = path.join(directory, 'spec.json')
  const renderPath = path.join(directory, `${id}.render.json`)
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
  const render = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
  assert.equal(spec.mode, 'deterministic')
  assert.equal(spec.display.purpose, 'instructional')
  assert.equal(spec.display.layout, 'scroll')
  assert.ok(spec.display.widths.includes(640))
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specPath))
  assert.equal(render.output.svg.sha256, hash(svgPath))
  const connectedEdges = new Set(
    spec.assertions.filter((item) => item.type === 'connects').map((item) => item.arrow),
  )
  for (const object of spec.objects.filter((item) => item.type === 'segment')) {
    assert.ok(connectedEdges.has(object.id), `Missing edge assertion: ${id}/${object.id}`)
  }
  return { id, svgPath, svg: fs.readFileSync(svgPath, 'utf8'), specPath, renderPath }
})

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: false,
})
const observations = []
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport })
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>')
    await page.addStyleTag({ content: css })
    await page.addStyleTag({
      content: 'body { margin: 0; padding: 20px; box-sizing: border-box; } main { width: 100%; max-width: 760px; }',
    })
    await page.evaluate((figures) => {
      const main = document.createElement('main')
      for (const figure of figures) {
        const section = document.createElement('section')
        section.className = figure.id === 'fig-60' ? 'sr-read' : 'sr-ex-body'
        const frame = document.createElement('figure')
        frame.className = figure.id === 'fig-60' ? 'sr-read-fig' : 'sr-ex-fig'
        frame.dataset.figureId = figure.id
        frame.dataset.figureLayout = 'scroll'
        frame.dataset.figurePurpose = 'instructional'
        const media = document.createElement('div')
        media.className = 'sr-figure-media'
        media.dataset.figureTheme = 'neutral'
        const vector = document.createElement('div')
        vector.className = 'sr-figure-vector'
        vector.innerHTML = figure.svg
        media.appendChild(vector)
        frame.appendChild(media)
        section.appendChild(frame)
        main.appendChild(section)
      }
      document.body.appendChild(main)
    }, items.map(({ id, svg }) => ({ id, svg })))
    const measured = await page.evaluate(() => [...document.querySelectorAll('figure')].map((frame) => {
      const media = frame.querySelector('.sr-figure-media')
      const svg = frame.querySelector('svg')
      const expectedEnd = Math.max(0, frame.scrollWidth - frame.clientWidth)
      frame.scrollLeft = frame.scrollWidth
      const text = [...svg.querySelectorAll('text')].map((node) => {
        const ctm = node.getScreenCTM()
        return {
          text: node.textContent,
          px: Number(node.getAttribute('font-size')) * Math.hypot(ctm.a, ctm.b),
        }
      })
      return {
        id: frame.dataset.figureId,
        mediaWidth: media.getBoundingClientRect().width,
        svgWidth: svg.getBoundingClientRect().width,
        containerWidth: frame.clientWidth,
        inheritedFontPx: Number.parseFloat(getComputedStyle(media).fontSize),
        minTextPx: Math.min(...text.map((item) => item.px)),
        labels: text,
        scrollEnd: frame.scrollLeft,
        expectedEnd,
        overflowX: getComputedStyle(frame).overflowX,
      }
    }))
    for (const observation of measured) {
      const expectedWidth = observation.id === 'fig-60' ? 660 : 640
      assert.ok(Math.abs(observation.mediaWidth - expectedWidth) < 0.5)
      assert.ok(Math.abs(observation.svgWidth - observation.mediaWidth) < 0.5)
      assert.ok(observation.minTextPx >= 16)
      assert.equal(observation.overflowX, 'auto')
      assert.ok(Math.abs(observation.scrollEnd - observation.expectedEnd) <= 1)
      if (viewport.width === 390) assert.ok(observation.expectedEnd > 0)
    }
    observations.push({ viewport, figures: measured })
    await page.close()
  }
} finally {
  await browser.close()
}

const result = {
  status: 'pass',
  scope: 'Headed offline figure-only fragment using current product CSS and FigureMedia/Prose/exercise classes; no application, authentication, database, or full lesson assembly.',
  screenshots: [],
  css: { path: cssPath, sha256: hash(cssPath) },
  checker: { path: path.join(root, '.tmp/s10y-image/9-10g/fig-60/check-display.mjs'), sha256: hash(path.join(root, '.tmp/s10y-image/9-10g/fig-60/check-display.mjs')) },
  inputs: items.map(({ id, svgPath, specPath, renderPath }) => ({
    id,
    svg: { path: svgPath, sha256: hash(svgPath) },
    spec: { path: specPath, sha256: hash(specPath) },
    render: { path: renderPath, sha256: hash(renderPath) },
  })),
  observations,
}
const output = path.join(root, '.tmp/s10y-image/9-10g/fig-60/display-check.json')
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`)
console.log(JSON.stringify(result, null, 2))
