import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), repo)
const require = createRequire(path.join(repo, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const ref = file => ({ path: file, sha256: hash(file) })
const spec = JSON.parse(fs.readFileSync(path.join(out, 'fig-227.spec.json')))
const svgFile = path.join(out, 'fig-227.svg')
const svg = fs.readFileSync(svgFile, 'utf8')
const cssFile = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssFile, 'utf8')
const start = css.indexOf('.sr-figure-media {')
const end = css.indexOf('.sr-math-answer {', start)
assert.ok(start >= 0 && end > start)
const productFigureCss = css.slice(start, end)
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
assert.ok(executablePath)
const browser = await chromium.launch({ executablePath, headless: true })
const checks = []
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
    const requests = []
    page.on('request', request => requests.push(request.url()))
    await page.setContent(`<!doctype html><style>
      :root {
        --sr-ink: #15201f; --sr-ink-soft: #4c5a58; --sr-ink-dim: #8a9795;
        --sr-line: #e3eae9; --sr-white: #ffffff;
      }
      body { margin: 16px; font-size: 16px; background: white; }
      .sr-read-fig { max-width: 960px; margin: 0; }
      ${productFigureCss}
    </style>
    <figure class="sr-read-fig" data-figure-layout="scroll">
      <div class="sr-figure-media"><div class="sr-figure-vector">${svg}</div></div>
    </figure>`)
    const result = await page.evaluate(expected => {
      const scroller = document.querySelector('.sr-read-fig')
      const svg = document.querySelector('svg')
      const texts = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const bounds = node.getBBox()
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
        }
      })
      const expectedTexts = expected.objects.filter(item => item.type === 'text')
      const contentMatches = texts.length === expectedTexts.length &&
        expectedTexts.every(item => texts.some(text =>
          text.id === `${item.id}-label` && text.text === item.text))
      const labelWithinCanvas = texts.every(({ bounds }) =>
        bounds.x >= 0 && bounds.y >= 0 &&
        bounds.x + bounds.width <= 800 && bounds.y + bounds.height <= 720)
      const rawLayer = svg.querySelector('[id$="-raw-path-layer"]')
      const paths = [...rawLayer.querySelectorAll('path')]
      const curve = expected.objects.find(item => item.id === 'src-227-mass-curve')
      const renderedCurveMatchesSpec = paths.length === 1 &&
        paths[0].getAttribute('d') === curve.d &&
        !paths[0].hasAttribute('stroke-dasharray') &&
        paths[0].getAttribute('stroke').includes('--ld-figure-accent')
      const limit = svg.querySelector('[id$="_ld-src-227-c-limit"]')
      const solidLimit = Boolean(limit) && !limit.hasAttribute('stroke-dasharray')
      const rendered = svg.getBoundingClientRect()
      const initialScrollLeft = scroller.scrollLeft
      scroller.scrollLeft = scroller.scrollWidth
      const finalScrollLeft = scroller.scrollLeft
      const scrollEndReached = Math.abs(scroller.scrollWidth - scroller.clientWidth - finalScrollLeft) < 1
      return {
        mediaWidth: rendered.width, mediaHeight: rendered.height,
        labelCount: texts.length, minimumTextPx: Math.min(...texts.map(item => item.px)),
        contentMatches, labelWithinCanvas, renderedCurveMatchesSpec, solidLimit,
        clientWidth: scroller.clientWidth, scrollWidth: scroller.scrollWidth,
        initialScrollLeft, finalScrollLeft, scrollEndReached,
      }
    }, spec)
    assert.equal(result.mediaWidth, 640)
    assert.equal(result.mediaHeight, 576)
    assert.equal(result.labelCount, 16)
    assert.ok(result.minimumTextPx >= 16)
    for (const key of ['contentMatches', 'labelWithinCanvas', 'renderedCurveMatchesSpec', 'solidLimit', 'scrollEndReached']) {
      assert.equal(result[key], true, key)
    }
    if (viewport.width === 390) assert.ok(result.finalScrollLeft > 0)
    if (viewport.width === 1440) {
      await page.locator('.sr-figure-media').screenshot({
        path: path.join(out, 'fig-227.640.png'), animations: 'disabled',
      })
    }
    assert.deepEqual(requests, [], 'offline verification must make no requests')
    checks.push({ viewport, ...result, requests, status: 'pass' })
    await page.close()
  }
} finally {
  await browser.close()
}
fs.writeFileSync(path.join(out, 'svg-surface-check.json'), `${JSON.stringify({
  schema: 'stemrobin/fig227-author-svg-surface-check@1', status: 'pass',
  spec: ref(path.join(out, 'fig-227.spec.json')), svg: ref(svgFile),
  actualFigureStylesheet: ref(cssFile),
  actualFigureRulesSha256: crypto.createHash('sha256').update(productFigureCss).digest('hex'),
  normalWidthSnapshot: ref(path.join(out, 'fig-227.640.png')),
  browser: { executablePath, headless: true }, checks,
  scope: 'Isolated offline author SVG surface using the current product figure CSS. Not a full lesson render, headed product acceptance, or independent review.',
}, null, 2)}\n`)
console.log(JSON.stringify({ status: 'pass', checks }, null, 2))
