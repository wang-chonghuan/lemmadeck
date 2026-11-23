import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184'
assert.equal(process.cwd(), root)
const work = '.tmp/stemrobin-184-six/n10-nov23-source4345/figure-author'
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/figure-author'
const figure = 'tbl-p0044-01'
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const spec = read(`${durable}/${figure}.raw-bound.spec.json`)
const inventory = read(`${durable}/source-inventory.json`)
const report = read(`${durable}/${figure}.render.json`)
const objects = new Map(spec.objects.map((object) => [object.id, object]))
const facts = inventory.sourceFacts
assert.equal(hash(inventory.source.path), inventory.source.sha256)
assert.equal(report.spec.sha256, hash(`${durable}/${figure}.raw-bound.spec.json`))
assert.equal(report.output.svg.sha256, hash(`${durable}/${figure}.svg`))
assert.equal(report.status, 'pass')
assert.deepEqual(spec.source.inventory, inventory.mapping)
assert.deepEqual(spec.display, { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] })
assert.deepEqual(facts.rows.map((row) => row.sum), [2, 3, 4, 5, 6, 7])
const grids = spec.objects.filter((object) => object.type === 'grid')
assert.equal(grids.length, 4)
grids.forEach((grid, index) => {
  const dimension = spec.assertions.find((item) => item.type === 'gridDimensions' && item.grid === grid.id)
  assert.deepEqual([dimension.columns, dimension.rows], [1, 7])
  assert.equal((grid.bounds[2] - grid.bounds[0]) / grid.xStep, 1)
  assert.equal((grid.bounds[1] - grid.bounds[3]) / grid.yStep, 7)
  assert.equal(grid.bounds[1], grids[0].bounds[1])
  assert.equal(grid.bounds[3], grids[0].bounds[3])
  if (index) assert.equal(grids[index - 1].bounds[2], grid.bounds[0])
})
const cells = spec.objects.filter((object) => /^T44-r\d+c\d+-cell$/.test(object.id))
assert.equal(cells.length, 28)
assert.equal(spec.objects.filter((object) => object.type === 'text').length, 31)
facts.columnOrder.forEach((text, index) => assert.equal(objects.get(`T44-r1c${index + 1}`).text, text))
facts.rows.forEach((fact, index) => {
  const row = index + 2
  assert.equal(objects.get(`T44-r${row}c1`).text, String(fact.sum))
  assert.equal(objects.get(`T44-r${row}c3`).text, String(fact.count))
  assert.equal(objects.get(`T44-r${row}c4`).text, fact.probability)
  const outcomeObjects = inventory.mapping.find((item) => item.id === `T44-r${row}c2`).objects
  const pairText = outcomeObjects.map((id) => objects.get(id).text).join(', ')
  const actualPairs = [...pairText.matchAll(/\((\d), (\d)\)/g)].map((match) => [Number(match[1]), Number(match[2])])
  assert.deepEqual(actualPairs, fact.orderedPairs)
  assert.equal(pairText, fact.orderedPairs.map(([a, b]) => `(${a}, ${b})`).join(', '))
  assert.equal(fact.count, fact.orderedPairs.length)
  actualPairs.forEach(([a, b]) => {
    assert.ok(a >= 1 && a <= 6 && b >= 1 && b <= 6)
    assert.equal(a + b, fact.sum)
  })
  const [numerator, denominator] = fact.probability.split('/').map(Number)
  assert.equal(numerator * 36, fact.count * denominator)
})
const labelCells = spec.assertions.filter((item) => item.type === 'inside').map((item) => ({
  labelId: `${item.point}-label`,
  cellId: item.container,
  points: objects.get(item.container).points,
  expectedText: objects.get(item.point).text,
}))
assert.equal(labelCells.length, 31)
const svg = fs.readFileSync(`${durable}/${figure}.svg`, 'utf8')
assert.match(svg, /--ld-figure-ink/)
assert.doesNotMatch(svg, /foreignObject|<script/)
const executablePath = [
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((file) => fs.existsSync(file))
assert.ok(executablePath)
const browser = await chromium.launch({ executablePath, headless: true })
const result = {
  schema: 'n10-figure-author/candidate-check@1',
  status: 'author-checks-only',
  sourceSha256: inventory.source.sha256,
  specSha256: hash(`${durable}/${figure}.raw-bound.spec.json`),
  svgSha256: hash(`${durable}/${figure}.svg`),
  grid: { columns: 4, rows: 7, headerRows: 1, dataRows: 6, cells: 28, mergedCells: 0 },
  labels: 31, orderedPairs: 21, surfaces: [],
}
try {
  for (const [name, width, height] of [['desktop', 1440, 960], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.route('**/*', (route) => route.abort())
    await page.setContent(`<!doctype html><html><head><style>
      * { box-sizing: border-box; } html, body { margin: 0; }
      body { padding: 12px; background: white; color: black; }
      .scroll { width: 100%; overflow-x: auto; }
      .media { width: 640px; min-width: 640px; }
      .media svg { display: block; width: 640px; height: auto; }
    </style></head><body><div class="scroll"><div class="media">${svg}</div></div></body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const measured = await page.evaluate(({ labelCells, canvas }) => {
      const svgNode = document.querySelector('svg')
      const media = document.querySelector('.media')
      const scroll = document.querySelector('.scroll')
      const svgRect = svgNode.getBoundingClientRect()
      const rects = labelCells.map(({ labelId, cellId, points, expectedText }) => {
        const label = [...svgNode.querySelectorAll('text')].find((node) => node.dataset.labelId === labelId)
        if (!label) return { labelId, cellId, missing: true }
        const rect = label.getBoundingClientRect()
        const matrix = label.getScreenCTM()
        const px = Number(label.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b)
        const left = svgRect.left + Math.min(...points.map(([x]) => x)) * svgRect.width / canvas.width
        const right = svgRect.left + Math.max(...points.map(([x]) => x)) * svgRect.width / canvas.width
        const top = svgRect.top + (canvas.height - Math.max(...points.map(([, y]) => y))) * svgRect.height / canvas.height
        const bottom = svgRect.top + (canvas.height - Math.min(...points.map(([, y]) => y))) * svgRect.height / canvas.height
        return {
          labelId, cellId, text: label.textContent, expectedText, px,
          clearance: Math.min(rect.left - left, right - rect.right, rect.top - top, bottom - rect.bottom),
        }
      })
      scroll.scrollLeft = scroll.scrollWidth
      return {
        mediaWidth: media.getBoundingClientRect().width,
        scrollClientWidth: scroll.clientWidth, scrollWidth: scroll.scrollWidth,
        scrollEnd: scroll.scrollLeft, expectedScrollEnd: scroll.scrollWidth - scroll.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        rects,
      }
    }, { labelCells, canvas: spec.canvas })
    assert.equal(measured.mediaWidth, 640)
    assert.equal(measured.scrollEnd, measured.expectedScrollEnd)
    assert.equal(measured.documentWidth, measured.viewportWidth)
    measured.rects.forEach((item) => {
      assert.equal(item.missing, undefined)
      assert.equal(item.text, item.expectedText)
      assert.ok(item.px >= 16, `${item.labelId} text ${item.px}px`)
      assert.ok(item.clearance >= 8, `${item.labelId} cell clearance ${item.clearance}px`)
    })
    await page.locator('.scroll').evaluate((element) => { element.scrollLeft = 0 })
    const screenshot = `${durable}/${figure}.${name}${name === 'desktop' ? '-media640' : '-scroll-start'}.png`
    if (name === 'desktop') await page.locator('.media').screenshot({ path: screenshot })
    else await page.screenshot({ path: screenshot })
    const surface = { name, viewport: [width, height], ...measured, screenshot, screenshotSha256: hash(screenshot) }
    if (name === 'mobile') {
      await page.locator('.scroll').evaluate((element) => { element.scrollLeft = element.scrollWidth })
      surface.scrollEndScreenshot = `${durable}/${figure}.mobile-scroll-end.png`
      await page.screenshot({ path: surface.scrollEndScreenshot })
      surface.scrollEndScreenshotSha256 = hash(surface.scrollEndScreenshot)
    }
    result.surfaces.push(surface)
    await page.close()
  }
  fs.writeFileSync(`${durable}/candidate-check.json`, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' })
  console.log('AUTHOR CHECKS: 4 columns, 7 rows, 28 cells, 31 label footprints, 21 source-ordered pairs; 640px media at desktop/mobile; no independent approval.')
} catch (error) {
  const failure = `${durable}/first-cell-footprint-failure.json`
  if (!fs.existsSync(failure)) {
    fs.writeFileSync(failure, `${JSON.stringify({
      argv: ['node', `${work}/check-candidate.mjs`], cwd: root,
      error: error.message, stack: error.stack, result,
    }, null, 2)}\n`, { flag: 'wx' })
  }
  throw error
} finally {
  await browser.close()
}
