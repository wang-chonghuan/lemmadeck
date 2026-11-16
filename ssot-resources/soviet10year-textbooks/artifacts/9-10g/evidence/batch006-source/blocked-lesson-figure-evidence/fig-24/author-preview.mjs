import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { chromium } from '../../../../app/node_modules/playwright-core/index.mjs'

assert.equal(process.env.PWDEBUG, undefined, 'PWDEBUG must be cleared')
const directory = path.resolve(process.argv[2])
const figureRoot = path.dirname(directory)
const figure = path.basename(figureRoot)
assert(['fig-24', 'fig-25', 'fig-26'].includes(figure))
assert(figureRoot.startsWith(path.resolve('.tmp/s10y-image/9-10g/')))
assert(['initial', 'repair'].includes(path.basename(directory)))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const specPath = path.join(directory, `${figure}.spec.json`)
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const contextPath = path.join(figureRoot, 'context.json')
const official = JSON.parse(fs.readFileSync(contextPath, 'utf8'))
assert.equal(spec.id, figure)
assert.equal(spec.mode, 'deterministic')
assert.equal(spec.source.image.path, official.sourceImage.path)
assert.equal(spec.source.image.sha256, hash(official.sourceImage.path))
assert.equal(spec.source.image.sha256, official.sourceImage.sha256)
const expectedText = official.lessons.flatMap(lesson => [
  { lesson: lesson.lesson, text: lesson.title },
  ...lesson.prose.map(text => ({ lesson: lesson.lesson, text })),
  ...lesson.exercises.map(exercise => ({
    lesson: lesson.lesson, exercise: exercise.exercise, text: exercise.text,
  })),
])
assert.deepEqual(spec.source.authoritativeText, expectedText)
assert(fs.existsSync(path.join(figureRoot, 'source-inventory.md')))
const svgPath = path.join(directory, `${figure}.svg`)
const renderPath = path.join(directory, `${figure}.render.json`)
assert(!fs.existsSync(renderPath), 'Never overwrite an existing attempt')
const argv = [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', specPath, '--svg', svgPath,
  '--png', path.join(directory, `${figure}.whole.png`),
  '--report', renderPath,
]
const startedAt = new Date().toISOString()
const run = spawnSync(process.execPath, argv, { encoding: 'utf8', env: process.env })
fs.writeFileSync(path.join(directory, 'execution.json'), `${JSON.stringify({
  startedAt, finishedAt: new Date().toISOString(), argv: [process.execPath, ...argv],
  exitCode: run.status, signal: run.signal, error: run.error?.message ?? null,
  stdout: run.stdout, stderr: run.stderr,
  context: { path: contextPath, sha256: hash(contextPath), exactTextBinding: true },
  pwdebug: 'unset', independentReview: 'pending',
}, null, 2)}\n`)
process.stdout.write(run.stdout ?? '')
process.stderr.write(run.stderr ?? '')
if (run.status !== 0) process.exit(run.status ?? 1)

const browser = await chromium.launch({ headless: true, executablePath: chromium.executablePath() })
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  await context.route(/^https?:/, route => route.abort())
  const page = await context.newPage()
  const pageErrors = []
  const blockedRequests = []
  page.on('pageerror', error => pageErrors.push(error.message))
  page.on('request', request => {
    if (/^https?:/.test(request.url())) blockedRequests.push(request.url())
  })
  const svg = fs.readFileSync(svgPath, 'utf8')
  assert.deepEqual(spec.display.widths, [240, 346, 640])
  const records = []
  for (const [width, theme] of [[640, 'neutral'], [240, 'neutral'], [346, 'print']]) {
    const height = width * spec.canvas.height / spec.canvas.width
    await page.setViewportSize({ width, height: Math.ceil(height) })
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      :root {
        --ld-figure-ink:${theme === 'print' ? '#000000' : '#15201f'};
        --ld-figure-muted:${theme === 'print' ? '#333333' : '#4c5a58'};
        --ld-figure-accent:${theme === 'print' ? '#000000' : '#15201f'};
        --ld-figure-accent-soft:#8a9795;--ld-figure-grid:#e3eae9;--ld-figure-paper:#ffffff;
      }
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
    assert.equal(measurements.length, spec.objects.filter(object => object.type === 'text').length)
    assert(measurements.every(item => item.inside && item.finalTextPx >= 16))
    const output = path.join(directory, `preview-whole-${width}-${theme}.png`)
    await page.locator('#figure').screenshot({ path: output, animations: 'disabled' })
    records.push({ width, height, theme, measurements, output: { path: output, sha256: hash(output) } })
  }
  assert.deepEqual(pageErrors, [])
  assert.deepEqual(blockedRequests, [])
  fs.writeFileSync(path.join(directory, 'preview.json'), `${JSON.stringify({
    figure, browser: 'isolated headless Chromium', pwdebug: 'unset', httpRequests: 'blocked',
    osInput: false, cdp: false, userProfile: false, productMeasurement: false,
    context: { path: contextPath, sha256: hash(contextPath) },
    source: spec.source.image, spec: { path: specPath, sha256: hash(specPath) },
    svg: { path: svgPath, sha256: hash(svgPath) },
    independentReview: 'pending', pageErrors, blockedRequests, records,
  }, null, 2)}\n`)
  console.log(`${figure}: actual640/240neutral and346print whole previews saved; parent review pending`)
} finally {
  await browser.close()
}
