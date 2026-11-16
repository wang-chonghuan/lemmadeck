import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const out = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const repo = path.resolve(out, '../../../../..')
const local = (...parts) => path.join(out, ...parts)
const requireApp = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = requireApp('playwright')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, sha256: sha(file) })
const write = (file, data) => {
  assert.ok(file.startsWith(`${out}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  assert.ok(!fs.existsSync(file), `refusing to overwrite ${file}`)
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}
assert.equal(process.env.PWDEBUG, undefined)
assert.equal(process.env.PLAYWRIGHT_HTML_OPEN, 'never')
const spec = JSON.parse(fs.readFileSync(local('spec/repair.json'), 'utf8'))
const render = JSON.parse(fs.readFileSync(local('render/repair.json'), 'utf8'))
const svg = fs.readFileSync(local('svg/repair.svg'), 'utf8')
assert.equal(render.status, 'pass')
assert.equal(render.output.svg.sha256, sha(local('svg/repair.svg')))
assert.equal(render.spec.sha256, sha(local('spec/repair.json')))
assert.equal(spec.display.maxWidthPx, 640)
assert.deepEqual(spec.display.widths, [640, 331, 342])
const fixture = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Figure 172 author preview</title>
<style>
:root {
  --ld-figure-ink: #15201f;
  --ld-figure-muted: #4c5a58;
  --ld-figure-accent: #15201f;
  --ld-figure-accent-soft: #8a9795;
  --ld-figure-grid: #e3eae9;
  --ld-figure-paper: #ffffff;
}
html, body { margin: 0; padding: 0; background: var(--ld-figure-paper); }
figure { margin: 0; width: 100%; max-width: 640px; }
figure > svg { display: block; width: 100%; height: auto; }
</style></head>
<body><figure aria-label="Mercury resistivity versus temperature, original report">${svg}</figure></body>
</html>`
fs.mkdirSync(local('previews'), { recursive: true })
assert.ok(!fs.existsSync(local('previews/fixture.html')))
fs.writeFileSync(local('previews/fixture.html'), fixture)
const executable = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
assert.ok(executable)
const started = new Date().toISOString()
const browser = await chromium.launch({ headless: true, executablePath: executable })
const results = []
try {
  for (const width of [640, 331, 342]) {
    const context = await browser.newContext({
      viewport: { width, height: Math.ceil(width * 480 / 640) },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    })
    try {
      await context.route('**/*', route => route.abort())
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.setContent(fixture)
      await page.evaluate(() => document.fonts.ready)
      const metrics = await page.evaluate(() => {
        const svg = document.querySelector('figure > svg')
        const frame = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const rect = node.getBoundingClientRect()
          const matrix = node.getScreenCTM()
          return {
            id: node.getAttribute('data-label-id'), text: node.textContent,
            px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          }
        })
        const outside = labels.filter(({ rect }) =>
          rect.x < frame.x - 0.1 || rect.y < frame.y - 0.1 ||
          rect.x + rect.width > frame.right + 0.1 ||
          rect.y + rect.height > frame.bottom + 0.1)
        const overlaps = []
        for (let i = 0; i < labels.length; i++) {
          for (let j = i + 1; j < labels.length; j++) {
            const a = labels[i].rect
            const b = labels[j].rect
            if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
                Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)) {
              overlaps.push([labels[i].id, labels[j].id])
            }
          }
        }
        return {
          mediaWidth: frame.width, mediaHeight: frame.height, labels,
          minTextPx: Math.min(...labels.map(item => item.px)),
          outside, overlaps,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        }
      })
      assert.equal(metrics.mediaWidth, width)
      assert.equal(metrics.labels.length, 9)
      assert.ok(metrics.minTextPx >= 16)
      assert.deepEqual(metrics.outside, [])
      assert.deepEqual(metrics.overlaps, [])
      assert.equal(metrics.horizontalOverflow, false)
      assert.deepEqual(errors, [])
      const previewPath = local('previews', `${width}.png`)
      assert.ok(!fs.existsSync(previewPath))
      const screenshot = await page.screenshot({ path: previewPath, animations: 'disabled' })
      const pixels = await page.evaluate(async data => {
        const image = new Image()
        image.src = `data:image/png;base64,${data}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)
        const { data: bytes } = ctx.getImageData(0, 0, canvas.width, canvas.height)
        let ink = 0
        let opaque = 0
        for (let i = 0; i < bytes.length; i += 4) {
          if (bytes[i + 3] === 255) opaque++
          if (bytes[i] < 180 && bytes[i + 1] < 180 && bytes[i + 2] < 180) ink++
        }
        return {
          width: canvas.width, height: canvas.height,
          foregroundPixels: ink,
          foregroundFraction: ink / (canvas.width * canvas.height),
          opaqueFraction: opaque / (canvas.width * canvas.height),
        }
      }, screenshot.toString('base64'))
      assert.ok(pixels.foregroundFraction > 0.008 && pixels.foregroundFraction < 0.25)
      assert.equal(pixels.opaqueFraction, 1)
      results.push({ width, status: 'pass', screenshot: binding(previewPath), metrics, pixels, errors })
    } finally {
      await context.close()
    }
  }
} finally {
  await browser.close()
}
write(local('previews/metrics.json'), {
  status: 'pass',
  evidenceType: 'isolated-author-figure-preview',
  notProductOrPublicationAcceptance: true,
  browser: { library: requireApp.resolve('playwright'), executable, headless: true, isolatedContexts: 3, closed: true },
  environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never' },
  started, ended: new Date().toISOString(),
  bindings: { spec: binding(local('spec/repair.json')), svg: binding(local('svg/repair.svg')), fixture: binding(local('previews/fixture.html')) },
  results,
})
write(local('commands/preview-execution.json'), {
  executable: process.execPath, script: binding(fileURLToPath(import.meta.url)),
  environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never' },
  cwd: repo, started, ended: new Date().toISOString(), status: 'pass',
  metrics: binding(local('previews/metrics.json')),
  captures: 3, nativeRenderInvocations: 0, outputSvgEdits: 0,
})
console.log(JSON.stringify(results.map(result => ({
  width: result.width, minTextPx: result.metrics.minTextPx,
  screenshot: result.screenshot, pixels: result.pixels, status: result.status,
})), null, 2))
