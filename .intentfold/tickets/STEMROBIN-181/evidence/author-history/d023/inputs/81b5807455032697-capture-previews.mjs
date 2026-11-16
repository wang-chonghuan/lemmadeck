import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = process.cwd()
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const requireApp = createRequire(path.join(root, 'app/package.json'))
const { chromium } = requireApp('playwright')
assert.equal(process.env.PWDEBUG, undefined)
assert.equal(process.env.PLAYWRIGHT_HTML_OPEN, 'never')
const selected = JSON.parse(fs.readFileSync(path.join(base, 'outputs/selected-candidate.json'), 'utf8'))
const svg = fs.readFileSync(path.join(base, selected.svg), 'utf8')
const browser = await chromium.launch({ headless: true })
const previews = []
const pageErrors = []
try {
  for (const width of [640, 342, 331]) {
    const page = await browser.newPage({
      viewport: { width, height: 500 }, deviceScaleFactor: 1,
    })
    page.on('pageerror', error => pageErrors.push(error.message))
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
      <style>
        :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58;
          --ld-figure-accent:#15201f; --ld-figure-paper:#fff; }
        html,body { margin:0; padding:0; background:#fff; }
        #media { width:100%; max-width:640px; }
        #media > svg { display:block; width:100%; height:auto; }
      </style></head><body><div id="media">${svg}</div></body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const observation = await page.evaluate(() => {
      const media = document.getElementById('media')
      const svg = media.querySelector('svg')
      const box = svg.getBoundingClientRect()
      const texts = [...svg.querySelectorAll('text')].map(node => {
        const ctm = node.getScreenCTM()
        const rect = node.getBoundingClientRect()
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          fontPx: parseFloat(node.getAttribute('font-size')) * Math.hypot(ctm.a, ctm.b),
          bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          clipped: rect.left < box.left || rect.right > box.right ||
            rect.top < box.top || rect.bottom > box.bottom,
        }
      })
      const overlap = []
      for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i].bounds
          const b = texts[j].bounds
          if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
              Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)) {
            overlap.push([texts[i].id, texts[j].id])
          }
        }
      }
      return {
        mediaWidth: box.width, mediaHeight: box.height,
        measuredMinTextPx: Math.min(...texts.map(item => item.fontPx)),
        texts, overlap, horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        actualSvg: new XMLSerializer().serializeToString(svg),
      }
    })
    assert.equal(observation.mediaWidth, width)
    assert.equal(observation.texts.length, 4)
    assert.ok(observation.measuredMinTextPx >= 16)
    assert.ok(observation.texts.every(item => !item.clipped))
    assert.deepEqual(observation.overlap, [])
    assert.equal(observation.horizontalOverflow, false)
    const filename = path.join(base, `candidate/preview-${width}.png`)
    assert.ok(!fs.existsSync(filename))
    await page.locator('#media').screenshot({ path: filename, animations: 'disabled' })
    const screenshot = fs.readFileSync(filename).toString('base64')
    const pixelCheck = await page.evaluate(async data => {
      const image = new Image()
      image.src = `data:image/png;base64,${data}`
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(image, 0, 0)
      const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let dark = 0
      let white = 0
      let opaque = 0
      const xs = []
      const ys = []
      for (let i = 0; i < rgba.length; i += 4) {
        if (rgba[i + 3] === 255) opaque++
        if (Math.min(rgba[i], rgba[i + 1], rgba[i + 2]) >= 245) white++
        if (Math.max(rgba[i], rgba[i + 1], rgba[i + 2]) < 130) {
          dark++
          const pixel = i / 4
          xs.push(pixel % canvas.width)
          ys.push(Math.floor(pixel / canvas.width))
        }
      }
      const total = canvas.width * canvas.height
      return {
        pngWidth: canvas.width, pngHeight: canvas.height, darkPixels: dark,
        darkFraction: dark / total, paperFraction: white / total,
        opaqueFraction: opaque / total,
        inkBounds: { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) },
      }
    }, screenshot)
    assert.equal(pixelCheck.pngWidth, width)
    assert.ok(pixelCheck.darkPixels > 500)
    assert.ok(pixelCheck.darkFraction > 0.005 && pixelCheck.darkFraction < 0.12)
    assert.ok(pixelCheck.paperFraction > 0.85)
    assert.equal(pixelCheck.opaqueFraction, 1)
    assert.ok(pixelCheck.inkBounds.left > 0 && pixelCheck.inkBounds.right < width - 1)
    assert.ok(pixelCheck.inkBounds.top > 0 && pixelCheck.inkBounds.bottom < pixelCheck.pngHeight - 1)
    delete observation.actualSvg
    previews.push({
      width, ...observation, pixelCheck, screenshot: filename, status: 'pass',
    })
    await page.close()
  }
  assert.deepEqual(pageErrors, [])
} finally {
  await browser.close()
}
const output = path.join(base, 'outputs/preview-measurements.json')
assert.ok(!fs.existsSync(output))
fs.writeFileSync(output, `${JSON.stringify({
  status: 'pass', purpose: 'author-only-isolated-preview',
  browser: 'existing app Playwright Chromium, headless, isolated fresh pages',
  environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never' },
  maxWidthPx: 640, previews, pageErrors,
}, null, 2)}\n`)
console.log(JSON.stringify({
  status: 'pass',
  previews: previews.map(item => ({
    width: item.width, mediaWidth: item.mediaWidth,
    minTextPx: item.measuredMinTextPx, darkPixels: item.pixelCheck.darkPixels,
  })),
}, null, 2))
