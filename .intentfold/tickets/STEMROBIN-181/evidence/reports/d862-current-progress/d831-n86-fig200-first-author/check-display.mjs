import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d831-n86-fig200-first-author')
assert.equal(process.cwd(), R)
process.env.TMPDIR = path.join(D, 'runtime-tmp')
process.env.PYTHONDONTWRITEBYTECODE = '1'
const require = createRequire(path.join(R, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: p, sha256: hash(p) })
const write = (p, value) => {
  assert.ok(p.startsWith(`${D}/`))
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
}
const specPath = path.join(D, 'frozen/fig-200.spec.json')
const svgPath = path.join(D, 'frozen/fig-200.svg')
const reportPath = path.join(D, 'frozen/fig-200.render.json')
const spec = JSON.parse(fs.readFileSync(specPath))
const report = JSON.parse(fs.readFileSync(reportPath))
assert.equal(report.status, 'pass')
assert.equal(report.spec.sha256, hash(specPath))
assert.equal(report.output.svg.sha256, hash(svgPath))
const svg = fs.readFileSync(svgPath, 'utf8')
const browser = await chromium.launch({ headless: true })
const outputs = []
let offlineRequestsAborted = 0
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  await context.route('**/*', async route => {
    offlineRequestsAborted++
    await route.abort()
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  for (const width of [331, 342, 640]) {
    await page.setViewportSize({ width, height: Math.ceil(width * 560 / 640) + 2 })
    await page.setContent(`<!doctype html><style>
      :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58; --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795; --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff; }
      html,body { margin:0; padding:0; background:#fff; }
      svg { width:${width}px; height:auto; display:block; }
    </style>${svg}`)
    await page.evaluate(() => document.fonts.ready)
    const measured = await page.evaluate(() => {
      const svg = document.querySelector('svg')
      const bounds = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const scale = Math.hypot(matrix.a, matrix.b)
        const r = node.getBoundingClientRect()
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          px: Number.parseFloat(node.getAttribute('font-size')) * scale,
          bounds: { x: r.x, y: r.y, width: r.width, height: r.height },
          insideMedia: r.x >= bounds.x && r.y >= bounds.y &&
            r.right <= bounds.right && r.bottom <= bounds.bottom,
        }
      })
      const overlaps = []
      for (let i = 0; i < labels.length; i++) {
        for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i].bounds
          const b = labels[j].bounds
          const x = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
          const y = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
          if (x > 0.1 && y > 0.1) overlaps.push([labels[i].id, labels[j].id])
        }
      }
      return {
        mediaWidth: bounds.width, mediaHeight: bounds.height,
        labels, minMeasuredTextPx: Math.min(...labels.map(l => l.px)), overlaps,
        unexpectedEmbeddedMedia: svg.querySelectorAll('image,script,foreignObject').length,
      }
    })
    assert.equal(measured.mediaWidth, width)
    assert.equal(measured.labels.length, 8)
    assert.deepEqual(measured.labels.map(l => l.text), ['R', 'R', 'r', 'k', 'h', 'k', 'Lens', 'Glass plate'])
    assert.ok(measured.labels.every(l => l.px >= 16 && l.insideMedia))
    assert.deepEqual(measured.overlaps, [])
    assert.equal(measured.unexpectedEmbeddedMedia, 0)
    const screenshot = path.join(D, `previews/fig-200-${width}.png`)
    await page.locator('svg').screenshot({ path: screenshot, animations: 'disabled' })
    outputs.push({ width, status: 'pass', measured, screenshot: bind(screenshot) })
  }
  assert.deepEqual(errors, [])
  assert.equal(offlineRequestsAborted, 0)
  await context.close()
} finally {
  await browser.close()
}
const python = path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const rasterScript = path.join(D, 'check-raster.py')
const args = [rasterScript, ...outputs.map(o => o.screenshot.path)]
const raster = spawnSync(python, args, {
  cwd: R, encoding: 'utf8', env: process.env,
})
write(path.join(D, 'calls/check-raster.json'), {
  schema: 'd831/local-verification-call@1', cwd: R, command: python, args,
  script: bind(rasterScript), exitCode: raster.status,
  stdout: raster.stdout, stderr: raster.stderr, paidCalls: 0,
})
if (raster.status !== 0) {
  write(path.join(D, 'FIRST-raster-check-failure.json'), { exitCode: raster.status, stdout: raster.stdout, stderr: raster.stderr })
  throw new Error('Raster verification failed; no additional render repair is automatically authorized.')
}
write(path.join(D, 'display-verification.json'), {
  schema: 'd831/offline-display-check@1', status: 'pass',
  evidenceClass: 'AUTHOR-OFFLINE-NOT-INDEPENDENT-REVIEW-NOT-WHOLE-LESSON-ACCEPTANCE',
  spec: bind(specPath), svg: bind(svgPath), render: bind(reportPath),
  requestedWidths: [342, 640], additionalNativeContractWidth: 331,
  outputs, rasterChecks: JSON.parse(raster.stdout),
  offlineRequestsAborted, pageErrors: [], browserClosed: true,
  noProductOrLessonServerStarted: true,
})
console.log(JSON.stringify({
  status: 'AUTHOR-OFFLINE-DISPLAY-PASS',
  outputs: outputs.map(o => ({ width: o.width, minTextPx: o.measured.minMeasuredTextPx, screenshot: o.screenshot })),
  rasterStatus: JSON.parse(raster.stdout).status,
}))
