import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const O = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), W)
const require = createRequire(path.join(W, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const { PNG } = require('pngjs')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const stateFile = path.join(O, 'state.json')
const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
state.counters.displayCalls += 1
fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`)
const output = path.join(O, 'display')
fs.mkdirSync(output, { recursive: true })
const html = path.join(O, 'draft-display/geo68-c2-s4-n30/text.html')
const executablePath = [
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(file => fs.existsSync(file))
assert.ok(executablePath, 'Existing Chrome required; no installation permitted')
const browser = await chromium.launch({ executablePath, headless: true })
const checks = []
const requests = []
const errors = []
const startedAt = new Date().toISOString()
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => {
    const url = route.request().url()
    if (/^https?:/.test(url)) {
      requests.push(url)
      return route.abort('blockedbyclient')
    }
    return route.continue()
  })
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`file://${html}`)
  await page.evaluate(() => document.fonts.ready)
  assert.equal(await page.locator('.fig').count(), 2)
  assert.equal(await page.locator('.err').count(), 0)
  // Match the prose padding and declared media maximum without starting the app.
  await page.addStyleTag({ content: '.sheet{max-width:960px;padding:24px 16px}.figure-media{max-width:100%}h1{letter-spacing:0}' })
  for (const viewport of [
    { width: 363, height: 844, expected: 331, label: 'mobile-narrow' },
    { width: 390, height: 844, expected: 358, label: 'mobile-prose' },
    { width: 672, height: 960, expected: 640, label: 'width-640' },
    { width: 1440, height: 960, expected: 640, label: 'desktop-max' },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    for (const id of ['fig-190', 'fig-191']) {
      const figure = page.locator(`#${id}`)
      await figure.scrollIntoViewIfNeeded()
      const result = await figure.evaluate(element => {
        const svg = element.querySelector('svg')
        const media = element.querySelector('.figure-media')
        const bounds = svg.getBoundingClientRect()
        const texts = [...svg.querySelectorAll('text')].map(node => {
          const m = node.getScreenCTM()
          const font = Number.parseFloat(getComputedStyle(node).fontSize)
          const r = node.getBoundingClientRect()
          return {
            id: node.getAttribute('data-label-id'), text: node.textContent,
            px: font * Math.min(Math.hypot(m.a, m.b), Math.hypot(m.c, m.d)),
            bounds: { x: r.x - bounds.x, y: r.y - bounds.y, width: r.width, height: r.height },
            clipped: r.left < bounds.left - 0.5 || r.right > bounds.right + 0.5 || r.top < bounds.top - 0.5 || r.bottom > bounds.bottom + 0.5,
          }
        })
        const overlaps = []
        for (let i = 0; i < texts.length; i += 1) {
          for (let j = i + 1; j < texts.length; j += 1) {
            const a = texts[i].bounds, b = texts[j].bounds
            if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
                Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)) {
              overlaps.push([texts[i].id, texts[j].id])
            }
          }
        }
        return {
          width: bounds.width, height: bounds.height, mediaWidth: media.getBoundingClientRect().width,
          textCount: texts.length, minTextPx: Math.min(...texts.map(t => t.px)), texts, overlaps,
          scrollWidth: element.scrollWidth, clientWidth: element.clientWidth,
          documentOverflow: document.documentElement.scrollWidth > window.innerWidth,
        }
      })
      checks.push({ figure: id, viewport, ...result })
      assert.ok(Math.abs(result.width - viewport.expected) < 0.01)
      assert.ok(result.minTextPx >= 16)
      assert.ok(result.texts.every(t => !t.clipped))
      assert.equal(result.overlaps.length, 0)
      assert.equal(result.documentOverflow, false)
      assert.ok(result.scrollWidth <= result.clientWidth + 1)
      const spec = JSON.parse(fs.readFileSync(path.join(O, 'figures', `${id}.spec.json`), 'utf8'))
      assert.ok(Math.abs(result.height / result.width - spec.canvas.height / spec.canvas.width) < 0.001)
      if (['mobile-prose', 'desktop-max'].includes(viewport.label)) {
        const screenshot = path.join(output, `${id}-${viewport.label}.png`)
        assert.ok(!fs.existsSync(screenshot))
        await figure.screenshot({ path: screenshot, animations: 'disabled' })
        const image = PNG.sync.read(fs.readFileSync(screenshot))
        let inkPixels = 0
        let nonwhitePixels = 0
        let left = image.width, top = image.height, right = -1, bottom = -1
        for (let y = 0; y < image.height; y += 1) {
          for (let x = 0; x < image.width; x += 1) {
            const i = (y * image.width + x) * 4
            const [r, g, b, a] = image.data.subarray(i, i + 4)
            if (a > 0 && Math.min(r, g, b) < 245) nonwhitePixels += 1
            if (a > 0 && Math.max(r, g, b) < 180) {
              inkPixels += 1
              left = Math.min(left, x); right = Math.max(right, x)
              top = Math.min(top, y); bottom = Math.max(bottom, y)
            }
          }
        }
        const pixels = {
          path: screenshot, sha256: hash(screenshot), width: image.width, height: image.height,
          inkPixels, nonwhitePixels, darkFraction: inkPixels / (image.width * image.height),
          occupiedBounds: { left, top, right, bottom },
          screenshotGenerated: true, imageContextLoadedByThisScript: false,
        }
        write(path.join(output, `${id}-${viewport.label}.pixels.json`), pixels)
        assert.ok(inkPixels > 500, 'Blank raster')
        assert.ok(pixels.darkFraction < 0.2, 'Black/broken raster')
        checks[checks.length - 1].screenshot = pixels
      }
    }
  }
  assert.deepEqual(requests, [])
  assert.deepEqual(errors, [])
  write(path.join(output, 'checks.json'), {
    schema: 'same188-6/offline-draft-display-checks@1',
    status: 'TECHNICAL_CHECKS_PASS_AUTHOR_REVIEW_PENDING',
    startedAt, finishedAt: new Date().toISOString(),
    headless: true, headedProductVerificationPerformed: false,
    surface: 'Existing offline lesson renderer, first-construction-only draft projection. A scoped CSS width adapter establishes likely product prose widths; this is not live-app acceptance.',
    mobileViewport: 390, mobileMediaWidth: 358, narrowMediaWidth: 331,
    declared640: 640, desktopViewport: 1440, desktopMaximumMediaWidth: 640,
    minTextPx: 16, requests, errors, checks,
    html: { path: html, sha256: hash(html) },
  })
} catch (error) {
  state.counters.technicalStageFailures += 1
  write(path.join(output, 'FIRST-display-failure.json'), {
    status: 'FAIL', startedAt, error: error.message, stack: error.stack, checks, requests, errors,
  })
  fs.chmodSync(path.join(output, 'FIRST-display-failure.json'), 0o444)
  throw error
} finally {
  fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`)
  await browser.close()
}
console.log(JSON.stringify({ status: 'TECHNICAL_CHECKS_PASS_AUTHOR_REVIEW_PENDING', checks: checks.length, screenshots: 4 }))
