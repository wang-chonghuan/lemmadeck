import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), repo)
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const svgFile = path.join(out, 'candidate/fig-228a.svg')
const cssFile = path.join(repo, 'app/src/styles/app.css')
const screenshot = path.join(out, 'candidate/fig-228a.product-full-640.png')
const receipt = path.join(out, 'snapshot-recovery.json')
assert(!fs.existsSync(screenshot))
assert(!fs.existsSync(receipt))
const originalHash = hash(svgFile)
const require = createRequire(path.join(repo, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: false, args: ['--disable-background-networking', '--disable-sync', '--no-first-run'],
})
let blockedRequests = 0
let measurement
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  await context.route('**/*', (route) => { blockedRequests += 1; return route.abort() })
  const page = await context.newPage()
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${fs.readFileSync(cssFile, 'utf8')}</style>
    <main style="width:640px;font-size:16px"><figure class="sr-read-fig" data-figure-layout="scroll">
    <div class="sr-figure-media">${fs.readFileSync(svgFile, 'utf8')}</div></figure></main>`)
  measurement = await page.evaluate(() => {
    const media = document.querySelector('.sr-figure-media')
    const vector = media.querySelector('svg')
    const rect = vector.getBoundingClientRect()
    const labels = [...vector.querySelectorAll('text')].map((node) => {
      const matrix = node.getScreenCTM()
      return { text: node.textContent, px: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b) }
    })
    return { mediaWidthPx: media.getBoundingClientRect().width, svgWidthPx: rect.width, labels, minimumTextPx: Math.min(...labels.map((item) => item.px)) }
  })
  assert.equal(measurement.mediaWidthPx, 640)
  assert.equal(measurement.svgWidthPx, 640)
  assert.equal(measurement.labels.length, 4)
  assert(measurement.minimumTextPx >= 16)
  await page.locator('.sr-figure-media').screenshot({ path: screenshot, animations: 'disabled' })
  await context.close()
} finally {
  await browser.close()
}
assert.equal(hash(svgFile), originalHash)
fs.writeFileSync(receipt, `${JSON.stringify({
  schema: 'stemrobin/figure-snapshot-technical-recovery@1',
  reason: 'The narrow mobile scroll host clipped the first element screenshot. Preserve it and capture only the unchanged candidate at the same measured 640px media width in an unclipped 640px offline host.',
  failed_snapshot: { path: path.join(out, 'candidate/fig-228a.product-640.png'), sha256: hash(path.join(out, 'candidate/fig-228a.product-640.png')), observation: 'Opened once; cropped/oversized partial ring, incomplete labels. Not evidence of the full figure.' },
  recovered_snapshot: { path: screenshot, sha256: hash(screenshot) },
  svg: { path: svgFile, sha256: originalHash }, css: { path: cssFile, sha256: hash(cssFile) },
  measurement, network: { allowed: false, blockedRequests },
  passed_narrow_width_and_scroll_measurement_replayed: false,
  native_render_replayed: false, additional_figure_repairs: 0,
  independent_visual_approval: false,
}, null, 2)}\n`)
console.log(JSON.stringify({ screenshot, measurement, svg_unchanged: true }))
