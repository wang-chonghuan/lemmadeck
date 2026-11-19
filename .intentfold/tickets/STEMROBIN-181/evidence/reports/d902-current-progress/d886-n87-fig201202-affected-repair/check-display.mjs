import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d886-n87-fig201202-affected-repair')
const C = path.join(D, 'figures/fig-202/targeted-label-recovery')
const require = createRequire(path.join(R, 'app/package.json'))
const { chromium } = require('@playwright/test')
const postcss = require('postcss')
const { assertActualFigureText } = await import(pathToFileURL(path.join(R, '.claude/skills/ld-s10y-lesson/tools/check_product.mjs')))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const info = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const render = JSON.parse(fs.readFileSync(path.join(C, 'fig-202.render.json'), 'utf8'))
assert.equal(render.status, 'pass')
const svg = fs.readFileSync(path.join(C, 'fig-202.svg'), 'utf8')
assert.equal(hash(path.join(C, 'fig-202.svg')), render.output.svg.sha256)
const cssPath = path.join(R, 'app/src/styles/app.css')
const cssAST = postcss.parse(fs.readFileSync(cssPath, 'utf8'), { from: cssPath })
const removedImports = []
cssAST.walkAtRules('import', node => { removedImports.push(node.params); node.remove() })
const css = cssAST.toString()
const output = path.join(D, 'display')
fs.mkdirSync(output, { recursive: false })
const cssProjection = path.join(output, 'product-css.no-import.css')
fs.writeFileSync(cssProjection, css, { flag: 'wx' })
const report = {
  schema: 'd886/scoped-author-display@1',
  scope: 'Affected fig202 standalone native SVG in existing product figure media classes; not full-card, independent, live-route, offline-lesson or publication acceptance.',
  actualUsage: 'Bilingual lesson /prose/9; no actual exercise association. 331px is the requested narrow-container probe.',
  browser: { headed: true, deviceScaleFactor: 1, allNetworkRequestsBlocked: true },
  input: { spec: info(path.join(C, 'spec.json')), svg: info(path.join(C, 'fig-202.svg')), render: info(path.join(C, 'fig-202.render.json')) },
  productCss: info(cssPath), projection: { ...info(cssProjection), removedImports, transformation: 'Only import AST nodes removed; no token or product rule modifications.' },
  screenshots: [], measurements: [], errors: [],
  extraScreenshots: 0, fig201ImagesOrChecks: 0,
}
const browser = await chromium.launch({ headless: false })
try {
  for (const width of [331, 342, 640]) {
    const page = await browser.newPage({
      viewport: width === 640 ? { width: 1440, height: 960 } : { width: 390, height: 844 },
      deviceScaleFactor: 1,
    })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route('**/*', route => route.abort())
    const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>
      <main class="sr-read" style="width:${width}px;margin:20px;padding:0">
      <figure class="sr-read-fig" data-figure-id="fig-202" data-figure-layout="inline">
        <div class="sr-figure-media" style="width:640px;max-width:100%">
          <div class="sr-figure-vector">${svg}</div>
        </div>
      </figure></main></body></html>`
    fs.writeFileSync(path.join(output, `fig-202.${width}.html`), html, { flag: 'wx' })
    await page.setContent(html)
    await page.addStyleTag({ content: css })
    await page.addStyleTag({ content: 'html,body{margin:0;background:white}.sr-read{font-size:16px}' })
    const figure = page.locator('figure[data-figure-id="fig-202"]')
    await assertActualFigureText(figure, 16)
    const measurement = await figure.evaluate(element => {
      const svg = element.querySelector('svg')
      const box = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const rect = node.getBoundingClientRect()
        return {
          text: node.textContent,
          px: Number.parseFloat(getComputedStyle(node).fontSize)
            * Math.min(Math.hypot(matrix.a, matrix.b), Math.hypot(matrix.c, matrix.d)),
          inside: rect.left >= box.left - 0.1 && rect.right <= box.right + 0.1
            && rect.top >= box.top - 0.1 && rect.bottom <= box.bottom + 0.1,
          box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        }
      })
      const overlaps = labels.flatMap((a, i) => labels.slice(i + 1).flatMap(b =>
        a.box.x < b.box.x + b.box.width && a.box.x + a.box.width > b.box.x
        && a.box.y < b.box.y + b.box.height && a.box.y + a.box.height > b.box.y
          ? [[a.text, b.text]] : []))
      return {
        mediaWidth: element.querySelector('.sr-figure-media').getBoundingClientRect().width,
        svgWidth: box.width, svgHeight: box.height,
        overflowPx: Math.max(0, element.scrollWidth - element.clientWidth), labels, overlaps,
      }
    })
    assert.ok(Math.abs(measurement.mediaWidth - width) < 0.1)
    assert.equal(measurement.overflowPx, 0)
    assert.ok(measurement.labels.every(label => label.inside && label.px >= 16))
    assert.deepEqual(measurement.overlaps, [])
    assert.ok(measurement.labels.some(label => label.text === 'Normal incidence'))
    assert.ok(measurement.labels.some(label => label.text === 'All rays share one line.'))
    assert.deepEqual(errors, [])
    // Reuse the one saved screenshot per width for pixel checks; no hidden screenshot helper.
    const screenshot = path.join(output, `fig-202.${width}.png`)
    await figure.screenshot({ path: screenshot, animations: 'disabled' })
    const pixels = await page.evaluate(async base64 => {
      const image = new Image()
      image.src = `data:image/png;base64,${base64}`
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width; canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data
      let marks = 0, white = 0
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] && Math.min(data[i], data[i + 1], data[i + 2]) < 180) marks++
        if (Math.min(data[i], data[i + 1], data[i + 2]) > 240) white++
      }
      return { marks, white, total: image.width * image.height }
    }, fs.readFileSync(screenshot).toString('base64'))
    assert.ok(pixels.marks > 100)
    assert.ok(pixels.white / pixels.total > 0.7)
    report.screenshots.push({ width, ...info(screenshot) })
    report.measurements.push({ width, status: 'pass', ...measurement, pixels })
    await page.close()
  }
  report.status = 'pass'
} catch (error) {
  report.status = 'fail'
  report.errors.push(error.stack || String(error))
  process.exitCode = 2
} finally {
  await browser.close()
  fs.writeFileSync(path.join(output, 'report-FIRST.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
  console.log(`${report.status}: ${report.measurements.length} widths, ${report.screenshots.length} saved screenshots`)
}
