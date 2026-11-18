import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const require = createRequire(path.join(repo, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const [round, figure] = process.argv.slice(2)
if (!['initial', 'sole-repair'].includes(round) ||
    !['fig-147', 'fig-148'].includes(figure)) {
  throw new Error('Only selected authorized SVGs may be previewed')
}
const directory = path.join(root, round)
const svgFile = path.join(directory, `${figure}.svg`)
const reportFile = path.join(directory, `${figure}.media.json`)
if (fs.existsSync(reportFile)) throw new Error('Actual media preview already exists')
const svgBytes = fs.readFileSync(svgFile)
const svg = svgBytes.toString('utf8')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const executable = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean).find(file => fs.existsSync(file))
if (!executable) throw new Error('No existing headless Chromium executable')
const browser = await chromium.launch({ executablePath: executable, headless: true })
const widths = []
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  const page = await context.newPage()
  for (const width of [342, 640]) {
    await page.setViewportSize({ width, height: 900 })
    await page.setContent(`<!doctype html>
      <style>
        html, body { margin: 0; background: white; }
        #media { display: block; width: ${width}px; height: auto; }
        #measure { position: absolute; left: -10000px; top: 0; width: ${width}px; }
        #measure svg { display: block; width: ${width}px; height: auto; }
      </style>
      <img id="media" alt="" src="data:image/svg+xml;base64,${svgBytes.toString('base64')}">
      <div id="measure">${svg}</div>`)
    await page.locator('#media').evaluate(async img => { await img.decode() })
    await page.evaluate(() => document.fonts.ready)
    const measurements = await page.evaluate(() => {
      const image = document.getElementById('media')
      const rect = image.getBoundingClientRect()
      const texts = [...document.querySelectorAll('#measure svg text')].map(node => {
        const matrix = node.getScreenCTM()
        const px = Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b)
        return { id: node.getAttribute('data-label-id'), text: node.textContent, px }
      })
      return {
        media: { width: rect.width, height: rect.height,
          naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight },
        textMeasurements: texts,
        measuredMinTextPx: Math.min(...texts.map(item => item.px))
      }
    })
    const check = {
      cssMediaWidth: width, ...measurements,
      status: Math.abs(measurements.media.width - width) < 0.01 &&
        measurements.measuredMinTextPx >= 16 ? 'PASS' : 'FAIL'
    }
    if (width === 342) {
      const png = path.join(directory, `${figure}.342.png`)
      await page.locator('#media').screenshot({ path: png, animations: 'disabled' })
      check.screenshot = { path: png, sha256: hash(fs.readFileSync(png)) }
    }
    widths.push(check)
  }
  await context.close()
} finally {
  await browser.close()
}
const report = {
  schema: 'STEMROBIN-181/actual-svg-media-preview@1',
  figure,
  svg: { path: svgFile, sha256: hash(svgBytes) },
  svgUnchangedAfterPreview: hash(svgBytes) === hash(fs.readFileSync(svgFile)),
  method: 'Unchanged native SVG as img at actual CSS media widths; font CTM measured on same-byte offscreen inline SVG.',
  headless: true,
  deviceScaleFactor: 1,
  pngResized: false,
  originalCroppedOrRerendered: false,
  sourceImageOpenedByScript: false,
  newContextImageOpens: 0,
  headedProductMeasurementRepeated: false,
  widths,
  status: widths.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL',
  independentDISPLAY: 'pending'
}
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
process.exitCode = report.status === 'PASS' ? 0 : 2
