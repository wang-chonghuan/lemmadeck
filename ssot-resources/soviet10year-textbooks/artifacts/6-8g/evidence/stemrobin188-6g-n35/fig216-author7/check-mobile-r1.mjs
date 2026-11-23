import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), repo)
const work = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig216-author7')
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const hash = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(work, name))).digest('hex')
const first = JSON.parse(fs.readFileSync(path.join(work, 'display-report.first-failure.json'), 'utf8'))
const currentRender = JSON.parse(fs.readFileSync(path.join(work, 'fig-216.render.json'), 'utf8'))
const desktop = first.views[0]
assert.equal(desktop.status, 'pass')
assert.equal(desktop.screenshot.sha256, hash(desktop.screenshot.path))
assert.equal(first.svg.sha256, hash('fig-216.svg'))
assert.equal(first.spec.sha256, hash('fig-216.spec.json'))
assert.equal(currentRender.output.svg.sha256, first.svg.sha256)
desktop.fixture = { path: 'display.first-failure.html', sha256: hash('display.first-failure.html') }
const report = { ...first, status: 'running', error: undefined, html: { path: 'display.html', sha256: hash('display.html') },
  previousFailure: { path: 'display-report.first-failure.json', sha256: hash('display-report.first-failure.json') },
  desktopReused: true, affectedRepair: 'Offline fixture scrollbar gutter only; SVG/spec hashes unchanged, desktop screenshot reused.',
  views: [desktop], screenshotCaptures: 1, headedDisplayCallsTotal: 2, fixtureRevisions: 1,
  browserClosed: false, networkRequests: [] }
const browser = await chromium.launch({ executablePath: first.executablePath, headless: false })
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => { report.networkRequests.push(route.request().url()); return route.abort() })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setContent(fs.readFileSync(path.join(work, 'display.html'), 'utf8'))
  await page.evaluate(() => document.fonts.ready)
  const state = await page.evaluate(async () => {
    const figures = []
    for (const figure of document.querySelectorAll('[data-surface]')) {
      const media = figure.querySelector('.sr-figure-media')
      const svg = media.querySelector('svg')
      const bounds = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const rect = node.getBoundingClientRect()
        return { id: node.getAttribute('data-label-id'), text: node.textContent,
          px: Number.parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          inBounds: rect.left >= bounds.left - 0.1 && rect.right <= bounds.right + 0.1
            && rect.top >= bounds.top - 0.1 && rect.bottom <= bounds.bottom + 0.1 }
      })
      const clone = svg.cloneNode(true)
      for (const element of clone.querySelectorAll('[stroke],[fill]')) {
        const original = svg.querySelector(`[id="${element.id}"]`)
        if (!original) continue
        for (const attr of ['stroke', 'fill']) if (element.getAttribute(attr)?.includes('var('))
          element.setAttribute(attr, getComputedStyle(original)[attr])
      }
      const image = new Image()
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }))
      try {
        image.src = url
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(bounds.width)
        canvas.height = Math.round(bounds.height)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        let ink = 0
        for (let i = 0; i < data.length; i += 4) if (data[i] < 180 && data[i + 1] < 180 && data[i + 2] < 180) ink++
        figures.push({ surface: figure.dataset.surface, mediaWidth: bounds.width, mediaHeight: bounds.height,
          labelCount: labels.length, minimumTextPx: Math.min(...labels.map(label => label.px)),
          labels, inkPixels: ink, blank: ink < 400, blackFraction: ink / (canvas.width * canvas.height),
          clipped: media.getBoundingClientRect().width + 0.1 < bounds.width })
      } finally { URL.revokeObjectURL(url) }
    }
    return { figures, horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      documentHeight: document.documentElement.scrollHeight }
  })
  assert.deepEqual(state.figures.map(figure => figure.mediaWidth), [358, 331])
  assert.equal(state.horizontalOverflow, false)
  for (const figure of state.figures) {
    assert.equal(figure.labelCount, 10)
    assert.ok(figure.minimumTextPx >= 16)
    assert.ok(figure.labels.every(label => label.inBounds))
    assert.equal(figure.blank, false)
    assert.equal(figure.clipped, false)
    assert.ok(figure.blackFraction < 0.15)
  }
  assert.deepEqual(errors, [])
  assert.deepEqual(report.networkRequests, [])
  await page.screenshot({ path: path.join(work, 'display-mobile.png'), fullPage: true, animations: 'disabled' })
  report.screenshotCaptures++
  report.views.push({ viewport: { width: 390, height: 844 }, ...state,
    fixture: report.html, screenshot: { path: 'display-mobile.png', sha256: hash('display-mobile.png') }, status: 'pass' })
  report.status = 'pass'
} catch (error) {
  report.status = 'fail'
  report.error = error.message
  throw error
} finally {
  await browser.close()
  report.browserClosed = true
  const output = report.status === 'pass' ? 'display-report.json' : 'display-report.mobile-r1-failure.json'
  fs.writeFileSync(path.join(work, output), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
}
console.log(JSON.stringify({ status: report.status, desktopReused: true, browserClosed: report.browserClosed,
  screenshotCapturesTotal: report.screenshotCaptures, widths: report.views.flatMap(view => view.figures.map(f => f.mediaWidth)) }))
