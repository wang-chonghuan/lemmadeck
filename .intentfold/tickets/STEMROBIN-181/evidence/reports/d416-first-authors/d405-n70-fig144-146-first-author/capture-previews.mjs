import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = process.cwd()
const owner = path.dirname(fileURLToPath(import.meta.url))
const requireApp = createRequire(path.join(root, 'app/package.json'))
const { chromium } = requireApp('playwright')
assert.equal(process.env.PWDEBUG, undefined)
assert.equal(process.env.PLAYWRIGHT_HTML_OPEN, 'never')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: path.relative(root, p), sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (p, v) => {
  assert.ok(p.startsWith(owner + path.sep))
  assert.ok(!fs.existsSync(p))
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n')
}
const began = new Date().toISOString()
const browser = await chromium.launch({ headless: true })
const errors = []
const captures = []
try {
  for (const id of ['fig-144', 'fig-146']) {
    const dir = path.join(owner, id, 'repair-1')
    const render = read(path.join(dir, 'render.json'))
    if (render.status !== 'pass') continue
    const specPath = path.join(dir, 'spec.json')
    const spec = read(specPath)
    const svgPath = path.join(dir, id + '.svg')
    assert.equal(hash(svgPath), render.output.svg.sha256)
    assert.equal(hash(specPath), render.spec.sha256)
    const svg = fs.readFileSync(svgPath, 'utf8')
    const previews = []
    let failure = null
    for (const width of spec.display.widths) {
      const page = await browser.newPage({ viewport: { width, height: spec.canvas.height }, deviceScaleFactor: 1 })
      page.on('pageerror', e => errors.push(e.message))
      try {
        await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
          :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58;
            --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795;
            --ld-figure-grid:#e3eae9; --ld-figure-paper:#fff; }
          html,body { margin:0; padding:0; background:#fff; }
          #media { width:100%; max-width:640px; }
          #media > svg { display:block; width:100%; height:auto; }
        </style></head><body><div id="media">${svg}</div></body></html>`)
        await page.evaluate(() => document.fonts.ready)
        const measurement = await page.evaluate(() => {
          const media = document.querySelector('#media > svg')
          const box = media.getBoundingClientRect()
          const labels = [...media.querySelectorAll('text')].map(n => {
            const c = n.getScreenCTM(), r = n.getBoundingClientRect()
            return {
              id: n.getAttribute('data-label-id'), text: n.textContent,
              fontPx: parseFloat(n.getAttribute('font-size')) * Math.hypot(c.a, c.b),
              bounds: { x: r.x, y: r.y, width: r.width, height: r.height },
              clipped: r.left < box.left || r.right > box.right || r.top < box.top || r.bottom > box.bottom
            }
          })
          const overlaps = []
          for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
            const a = labels[i].bounds, b = labels[j].bounds
            if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
              Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)) overlaps.push([labels[i].id, labels[j].id])
          }
          return {
            mediaWidth: box.width, mediaHeight: box.height, labels,
            measuredMinTextPx: Math.min(...labels.map(l => l.fontPx)), overlaps,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth
          }
        })
        const png = path.join(dir, `preview-${width}.png`)
        assert.ok(!fs.existsSync(png))
        await page.locator('#media').screenshot({ path: png, animations: 'disabled' })
        const pixelCheck = await page.evaluate(async data => {
          const img = new Image()
          img.src = `data:image/png;base64,${data}`
          await img.decode()
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d', { willReadFrequently: true })
          ctx.drawImage(img, 0, 0)
          const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data
          let dark = 0, white = 0, opaque = 0
          let left = canvas.width, right = -1, top = canvas.height, bottom = -1
          for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] === 255) opaque++
            if (Math.min(d[i], d[i + 1], d[i + 2]) >= 245) white++
            if (Math.max(d[i], d[i + 1], d[i + 2]) < 130) {
              dark++
              const x = (i / 4) % canvas.width, y = Math.floor((i / 4) / canvas.width)
              left = Math.min(left, x); right = Math.max(right, x)
              top = Math.min(top, y); bottom = Math.max(bottom, y)
            }
          }
          const total = canvas.width * canvas.height
          return {
            pngWidth: canvas.width, pngHeight: canvas.height, darkPixels: dark,
            darkFraction: dark / total, paperFraction: white / total, opaqueFraction: opaque / total,
            inkBounds: { left, right, top, bottom }
          }
        }, fs.readFileSync(png).toString('base64'))
        const checks = {
          actualDeclaredWidth: measurement.mediaWidth === width,
          allLabelsPresent: measurement.labels.length === render.labels,
          floor16: measurement.measuredMinTextPx >= spec.display.minTextPx,
          noTextClipping: measurement.labels.every(l => !l.clipped),
          noTextOverlap: measurement.overlaps.length === 0,
          noHorizontalOverflow: !measurement.horizontalOverflow,
          pngActualWidth: pixelCheck.pngWidth === width,
          nonblank: pixelCheck.darkPixels > 500 && pixelCheck.darkFraction > 0.005 && pixelCheck.darkFraction < 0.12,
          paper: pixelCheck.paperFraction > 0.85 && pixelCheck.opaqueFraction === 1,
          inkUnclipped: pixelCheck.inkBounds.left > 0 && pixelCheck.inkBounds.right < width - 1 &&
            pixelCheck.inkBounds.top > 0 && pixelCheck.inkBounds.bottom < pixelCheck.pngHeight - 1
        }
        const passed = Object.values(checks).every(Boolean)
        previews.push({ width, screenshot: bind(png), ...measurement, pixelCheck, checks, status: passed ? 'pass' : 'fail' })
        if (!passed) failure = 'Actual-width preview check failed; no additional repair permitted.'
      } finally {
        await page.close()
      }
    }
    const evidence = path.join(dir, 'preview-evidence.json')
    save(evidence, {
      figure: id, status: failure || errors.length ? 'fail' : 'pass',
      purpose: 'AUTHOR_ONLY actual-width SVG preview; not DISPLAY independent or native card acceptance',
      pattern: '.intentfold/tickets/STEMROBIN-181/tmp/d023-n91-fig171-author/commands/capture-previews.mjs',
      spec: bind(specPath), render: bind(path.join(dir, 'render.json')), svg: bind(svgPath),
      headless: true, isolated: true, PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never',
      previews, failure, errors
    })
    captures.push({ figure: id, evidence: bind(evidence), status: failure || errors.length ? 'fail' : 'pass' })
  }
} finally {
  await browser.close()
}
save(path.join(owner, 'preview-native.receipt.json'), {
  command: 'env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node ' + path.relative(root, fileURLToPath(import.meta.url)),
  began, ended: new Date().toISOString(), captures, errors, headless: true, isolated: true,
  owningLauncherInspected: true, browserClosed: true, noUserBrowserOrDesktop: true,
  noImagePayloadReturned: true
})
console.log(JSON.stringify(captures, null, 2))
