import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'

const root = process.cwd()
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d577-n75-fig164165-first-modern-author')
const script = fileURLToPath(import.meta.url)
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const entry = (p) => ({ path: p, sha256: hash(p) })
const save = (p, value) => fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })

if (!process.argv.includes('--child')) {
  const commandPath = path.join(owned, 'screenshots.commands.json')
  if (fs.existsSync(commandPath)) throw Error('No repeat screenshot run')
  const args = [script, '--child']
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', timeout: 180000 })
  const stdout = path.join(owned, 'screenshots.stdout.txt')
  const stderr = path.join(owned, 'screenshots.stderr.txt')
  fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' })
  save(commandPath, {
    schema: 'd577-browser-command@1', command: [process.execPath, ...args], cwd: root,
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    stdout: entry(stdout), stderr: entry(stderr), nativeRerender: false,
  })
  console.log(result.stdout || '')
  if (result.status !== 0) {
    console.error(result.stderr || result.error?.message)
    process.exitCode = result.status || 1
  }
} else {
  const require = createRequire(path.join(root, 'app/package.json'))
  const { chromium } = require('playwright')
  const cssPath = path.join(root, 'app/src/styles/app.css')
  const css = fs.readFileSync(cssPath, 'utf8')
  const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
    .find((p) => fs.existsSync(p))
  if (!executablePath) throw Error('Existing Chromium unavailable')
  const browser = await chromium.launch({ headless: true, executablePath })
  const observations = []
  const browserErrors = []
  try {
    const context = await browser.newContext({ deviceScaleFactor: 1, viewport: { width: 640, height: 700 } })
    await context.route('**/*', (route) => route.abort())
    const page = await context.newPage()
    page.on('pageerror', (error) => browserErrors.push(error.message))
    for (const [figure, attempt] of [['fig-164', 'repair'], ['fig-165', 'first']]) {
      const directory = path.join(owned, figure, attempt)
      const svgPath = path.join(directory, `${figure}.svg`)
      const svgHash = hash(svgPath)
      const svg = fs.readFileSync(svgPath, 'utf8')
      const spec = JSON.parse(fs.readFileSync(path.join(directory, 'spec.json'), 'utf8'))
      const widths = []
      for (const width of [331, 342, 640]) {
        await page.setViewportSize({ width, height: Math.ceil(spec.canvas.height * width / 640) + 10 })
        await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style><style>
          html, body { margin: 0; padding: 0; width: ${width}px; height: auto; overflow: hidden; background: var(--sr-white); }
          #media { display: block; margin: 0; width: ${width}px; max-width: none; border: 0; }
          #media > svg { display: block; width: 100%; height: auto; max-width: none; }
        </style></head><body><div id="media" class="sr-figure-media">${svg}</div></body></html>`)
        await page.evaluate(() => document.fonts.ready)
        const metrics = await page.locator('#media > svg').evaluate((svgElement) => {
          const rect = svgElement.getBoundingClientRect()
          const text = [...svgElement.querySelectorAll('text')].map((node) => {
            const matrix = node.getScreenCTM()
            const bounds = node.getBoundingClientRect()
            const style = getComputedStyle(node)
            return {
              id: node.getAttribute('data-label-id'), text: node.textContent,
              px: parseFloat(style.fontSize) * Math.hypot(matrix.a, matrix.b),
              fill: style.fill,
              bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
              inside: bounds.left >= rect.left - 0.01 && bounds.right <= rect.right + 0.01
                && bounds.top >= rect.top - 0.01 && bounds.bottom <= rect.bottom + 0.01,
            }
          })
          const geometry = [...svgElement.querySelectorAll('path,line,polygon,polyline,circle,ellipse')]
            .filter((node) => !node.closest('defs') && getComputedStyle(node).display !== 'none')
          const resolved = geometry.every((node) => !/var\(/.test(getComputedStyle(node).stroke + getComputedStyle(node).fill))
          return {
            width: rect.width, height: rect.height, labels: text,
            minTextPx: Math.min(...text.map((t) => t.px)),
            geometryNodes: geometry.length, colorsResolved: resolved,
            neutralPalette: {
              ink: getComputedStyle(svgElement).getPropertyValue('--ld-figure-ink').trim(),
              muted: getComputedStyle(svgElement).getPropertyValue('--ld-figure-muted').trim(),
              paper: getComputedStyle(svgElement).getPropertyValue('--ld-figure-paper').trim(),
            },
          }
        })
        assert.equal(metrics.width, width)
        assert.ok(metrics.minTextPx >= 16)
        assert.ok(metrics.colorsResolved && metrics.geometryNodes > 0)
        assert.ok(metrics.labels.every((t) => t.inside))
        if (width === 342) {
          assert.ok(Math.abs(metrics.minTextPx - 17.1) < 0.01)
          const screenshot = path.join(owned, figure, 'isolated-342.png')
          await page.locator('#media > svg').screenshot({ path: screenshot, animations: 'disabled' })
          metrics.screenshot = entry(screenshot)
        }
        widths.push(metrics)
      }
      assert.equal(hash(svgPath), svgHash)
      observations.push({
        figure, finalAttempt: attempt, svg: entry(svgPath), spec: entry(path.join(directory, 'spec.json')),
        widthChecks: widths, svgBytesUnmodified: true, css: entry(cssPath),
        headless: true, isolated: true, deviceScaleFactor: 1,
        nativeRerender: false, independentFIG: false, independentDISPLAY: false,
        note: 'Technical CSS / width observations only. Native fig-164 second FAIL remains terminal; no independent acceptance or promotion.',
      })
    }
    await context.close()
  } finally {
    await browser.close()
  }
  assert.equal(browserErrors.length, 0)
  save(path.join(owned, 'screenshots.json'), {
    schema: 'd577-isolated-browser-observations@1', observations, browserErrors,
    browserClosed: true, sourceSpecOrSvgEdits: false, screenshotImageOpens: 'Counted separately when actually viewed',
  })
  console.log(JSON.stringify({ figures: observations.map((o) => o.figure), widths: [331, 342, 640], browserClosed: true, unmodifiedSvg: true }))
}
