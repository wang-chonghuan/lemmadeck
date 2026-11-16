import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '../../../../app/node_modules/playwright-core/index.mjs'

assert.equal(process.env.PWDEBUG, undefined)
const directory = path.resolve('.tmp/s10y-image/9-10g/fig-26/repair')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const svgPath = path.join(directory, 'fig-26.svg')
const specPath = path.join(directory, 'fig-26.spec.json')
const reportPath = path.join(directory, 'fig-26.render.json')
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
assert.equal(report.status, 'fail')
assert.equal(hash(svgPath), report.output.svg.sha256)
const svg = fs.readFileSync(svgPath, 'utf8')
const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() })
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  await context.route(/^https?:/, route => route.abort())
  const page = await context.newPage()
  const pageErrors = []
  const remoteRequests = []
  page.on('pageerror', error => pageErrors.push(error.message))
  page.on('request', request => {
    if (/^https?:/.test(request.url())) remoteRequests.push(request.url())
  })
  const records = []
  for (const [width, theme] of [[640, 'neutral'], [240, 'neutral'], [346, 'print']]) {
    const height = width * spec.canvas.height / spec.canvas.width
    await page.setViewportSize({ width, height: Math.ceil(height) })
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      :root{--ld-figure-ink:${theme === 'print' ? '#000000' : '#15201f'};--ld-figure-paper:#ffffff}
      html,body{margin:0;background:white}
      #figure{width:${width}px;height:${height}px}
      svg{display:block;width:100%;height:100%}
    </style><div id="figure">${svg}</div>`)
    const measurements = await page.locator('#figure').evaluate(host => {
      const bounds = host.getBoundingClientRect()
      return [...host.querySelectorAll('text')].map(node => {
        const rect = node.getBoundingClientRect()
        const matrix = node.getScreenCTM()
        return {
          text: node.textContent,
          finalTextPx: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          inside: rect.left >= bounds.left && rect.top >= bounds.top &&
            rect.right <= bounds.right && rect.bottom <= bounds.bottom,
        }
      })
    })
    assert(measurements.length === 8 && measurements.every(item => item.inside && item.finalTextPx >= 16))
    const output = path.join(directory, `preview-whole-${width}-${theme}.png`)
    assert(!fs.existsSync(output), 'Do not overwrite evidence')
    await page.locator('#figure').screenshot({ path: output, animations: 'disabled' })
    records.push({ width, height, theme, measurements, output: { path: output, sha256: hash(output) } })
  }
  assert.deepEqual(pageErrors, [])
  assert.deepEqual(remoteRequests, [])
  assert.equal(hash(svgPath), report.output.svg.sha256)
  fs.writeFileSync(path.join(directory, 'preview.json'), `${JSON.stringify({
    figure: 'fig-26', status: 'fail', reason: 'Second renderer result remains FAIL: B-label-label stroke collision.',
    rendering: 'Only screenshot existing failed SVG; no renderer invocation, spec change or third repair.',
    browser: 'isolated headless Chromium', pwdebug: 'unset', httpRequests: 'blocked',
    osInput: false, cdp: false, userProfile: false, productMeasurement: false,
    independentReview: 'pending; not promotable',
    spec: { path: specPath, sha256: hash(specPath) },
    svg: { path: svgPath, sha256: hash(svgPath) },
    render: { path: reportPath, sha256: hash(reportPath) },
    pageErrors, remoteRequests, records,
  }, null, 2)}\n`)
} finally {
  await browser.close()
}
