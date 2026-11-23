import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), root)
const own = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const artifact = file => ({ path: path.resolve(file), sha256: hash(file) })
const first = JSON.parse(fs.readFileSync(path.join(own, 'display.json'), 'utf8'))
const firstTable = first.widths.find(item => item.figure === 'tbl-p0160-01' && item.surface === 'mobile')
assert.equal(hash(firstTable.screenshot.path), firstTable.screenshot.sha256)
const nativeFile = path.join(root, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')
const css = fs.readFileSync(nativeFile, 'utf8').match(/const CSS = `([\s\S]*?)`;/)[1].replace('${katexCss()}', '')
const svgFile = path.join(own, 'tbl-p0160-01.svg')
const screenshot = path.join(own, 'tbl-p0160-01.mobile-full.png')
const reportFile = path.join(own, 'display.mobile-table-repair.json')
assert(!fs.existsSync(screenshot) && !fs.existsSync(reportFile))
const browser = await chromium.launch({ headless: true })
const report = {
  scope: 'Affected-only offline author mobile table screenshot repair; no FigureSpec, SVG, mathematical data, or app change',
  failure: {
    type: 'visual-evidence-capture',
    firstDisplayReport: artifact(path.join(own, 'display.json')),
    firstScreenshot: firstTable.screenshot,
    observation: 'Original full-media element screenshot retained the mobile scroll ancestor clip, leaving everything after x358 white; this is not an acceptable full-width figure inspection despite DOM checks passing.',
  },
  configuredViewport: { width: 390, height: 844 },
  nativeStyle: artifact(nativeFile), svg: artifact(svgFile),
  originalMeasurement: firstTable.measurement,
  networkRequests: 0,
}
try {
  const page = await browser.newPage({ viewport: report.configuredViewport, deviceScaleFactor: 1 })
  await page.route('**/*', route => { report.networkRequests++; return route.abort() })
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css}</style>
    <main class="sheet"><div class="fig" data-figure-layout="scroll" data-figure-purpose="instructional">
    <div class="figure-media">${fs.readFileSync(svgFile, 'utf8')}</div></div></main>`)
  await page.evaluate(() => document.fonts.ready)
  report.nativeScrollCheck = await page.evaluate(() => {
    const figure = document.querySelector('.fig')
    const media = document.querySelector('.figure-media')
    figure.scrollLeft = figure.scrollWidth
    const result = {
      mediaWidth: media.getBoundingClientRect().width,
      clientWidth: figure.clientWidth, scrollWidth: figure.scrollWidth,
      reached: figure.scrollLeft,
      rightEdgeReachable: Math.abs(figure.scrollLeft - (figure.scrollWidth - figure.clientWidth)) <= 1,
      bodyHorizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    }
    figure.scrollLeft = 0
    return result
  })
  assert.equal(report.nativeScrollCheck.mediaWidth, 640)
  assert.equal(report.nativeScrollCheck.clientWidth, 358)
  assert.equal(report.nativeScrollCheck.reached, 282)
  assert(report.nativeScrollCheck.rightEdgeReachable)
  assert.equal(report.nativeScrollCheck.bodyHorizontalOverflow, false)
  report.captureTransform = 'Capture-only overflow:visible on the local scroll ancestor exposes the full already-rendered 640px media. Viewport, SVG, font sizes, geometry and media width remain unchanged; restore native scrolling immediately afterward. This is full scroll-content evidence, not a claim that all 640px fit at once in a 390px viewport.'
  await page.locator('.fig').evaluate(element => {
    element.style.overflowX = 'visible'
    element.style.overflowY = 'visible'
  })
  report.captureMeasurement = await page.evaluate(() => ({
    mediaWidth: document.querySelector('.figure-media').getBoundingClientRect().width,
    viewport: { width: innerWidth, height: innerHeight },
    svgViewBox: document.querySelector('svg').getAttribute('viewBox'),
    labelCount: document.querySelectorAll('svg text').length,
  }))
  assert.equal(report.captureMeasurement.mediaWidth, 640)
  assert.equal(report.captureMeasurement.labelCount, 24)
  await page.locator('.figure-media').screenshot({ path: screenshot, animations: 'disabled' })
  await page.locator('.fig').evaluate(element => {
    element.style.removeProperty('overflow-x')
    element.style.removeProperty('overflow-y')
  })
  report.restored = await page.evaluate(() => ({
    mediaWidth: document.querySelector('.figure-media').getBoundingClientRect().width,
    clientWidth: document.querySelector('.fig').clientWidth,
    scrollWidth: document.querySelector('.fig').scrollWidth,
    overflowX: getComputedStyle(document.querySelector('.fig')).overflowX,
    bodyHorizontalOverflow: document.documentElement.scrollWidth > innerWidth,
  }))
  assert.equal(report.restored.mediaWidth, 640)
  assert.equal(report.restored.overflowX, 'auto')
  assert.equal(report.restored.bodyHorizontalOverflow, false)
  assert.equal(hash(svgFile), firstTable.svg.sha256)
  assert.equal(report.networkRequests, 0)
  report.screenshot = artifact(screenshot)
  report.status = 'pass'
} catch (error) {
  report.status = 'fail'
  report.error = { message: error.message, stack: error.stack }
  throw error
} finally {
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n')
  await browser.close()
}
console.log(JSON.stringify({ status: report.status, report: artifact(reportFile), screenshot: report.screenshot }, null, 2))
