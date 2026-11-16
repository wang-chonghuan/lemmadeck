import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const root = process.cwd()
const id = process.argv[2]
const attempt = process.argv[3]
if (!/^fig-(1[2-9]|20)$/.test(id) || !['initial', 'repair'].includes(attempt)) throw new Error('Outside assignment')
if (process.env.PWDEBUG) throw new Error('PWDEBUG must be unset')
const directory = path.join(root, '.tmp/s10y-image/batch007/10c', id)
const outputDirectory = path.join(directory, attempt)
const evidencePath = path.join(outputDirectory, 'author-display-evidence.json')
if (fs.existsSync(evidencePath)) throw new Error('Preserve completed capture; no duplicate')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = p => ({ path: path.relative(root, p), sha256: hash(fs.readFileSync(p)), bytes: fs.statSync(p).size })
const specPath = path.join(outputDirectory, 'spec.json')
const svgPath = path.join(outputDirectory, `${id}.svg`)
const renderPath = path.join(outputDirectory, `${id}.render.json`)
const contextPath = path.join(directory, 'context.json')
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'))
const report = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
const expected = context.lessons.flatMap(l => [
  { lesson: l.lesson, text: l.title },
  ...l.prose.flatMap(p => p.nearbyText.map(text => ({ lesson: l.lesson, text }))),
  ...l.exercises.map(e => ({ lesson: l.lesson, exercise: e.exercise, text: e.text })),
])
assert.deepEqual(spec.source.authoritativeText, expected)
assert.equal(report.spec.sha256, bind(specPath).sha256)
assert.equal(report.output.svg.sha256, bind(svgPath).sha256)
const require = createRequire(path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'))
const { chromium } = require('playwright-core')
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => fs.existsSync(p))
if (!executablePath) throw new Error('No installed isolated Chromium')
const browser = await chromium.launch({ executablePath, headless: true })
const captures = []
try {
  const browserContext = await browser.newContext({ offline: true, deviceScaleFactor: 1 })
  try {
    await browserContext.route('**/*', route => route.abort())
    const page = await browserContext.newPage()
    for (const [width, theme] of [[640, 'neutral'], [358, 'neutral'], [240, 'neutral'], [346, 'print']]) {
      const mediaWidth = 640
      const mediaHeight = spec.canvas.height
      await page.setViewportSize({ width, height: mediaHeight })
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
        :root { --ld-figure-ink:#151c22; --ld-figure-muted:${theme === 'print' ? '#151c22' : '#53606b'};
        --ld-figure-accent:${theme === 'print' ? '#151c22' : '#236984'};
        --ld-figure-accent-soft:#abbac2; --ld-figure-grid:#d6dce1; --ld-figure-paper:#ffffff; }
        html,body {margin:0;padding:0;background:#ffffff;}
        #scroller {width:${width}px;overflow-x:auto;} #media {width:${mediaWidth}px;}
        #media>svg {display:block;width:100%;height:auto;}
      </style></head><body><div id="scroller"><div id="media">${fs.readFileSync(svgPath, 'utf8')}</div></div></body></html>`)
      await page.evaluate(() => document.fonts.ready)
      const metrics = await page.evaluate(min => {
        const svg = document.querySelector('#media>svg')
        const r = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(t => {
          const m = t.getScreenCTM()
          const b = t.getBoundingClientRect()
          return { id: t.getAttribute('data-label-id'), text: t.textContent,
            px: Number(t.getAttribute('font-size')) * Math.hypot(m.a, m.b),
            insideMedia: b.left >= r.left - 0.01 && b.top >= r.top - 0.01 && b.right <= r.right + 0.01 && b.bottom <= r.bottom + 0.01 }
        })
        const s = document.querySelector('#scroller')
        s.scrollLeft = s.scrollWidth
        const scroll = { clientWidth: s.clientWidth, scrollWidth: s.scrollWidth, max: s.scrollWidth - s.clientWidth, actual: s.scrollLeft }
        s.scrollLeft = 0
        const failures = labels.filter(l => l.px < min - 0.01 || !l.insideMedia)
        return { actualViewport: innerWidth, mediaWidth: r.width, mediaHeight: r.height,
          minTextPx: Math.min(...labels.map(l => l.px)), labels, scroll, failures,
          status: failures.length || Math.abs(scroll.max - scroll.actual) > 1 ? 'fail' : 'pass' }
      }, spec.display.minTextPx)
      const start = path.join(outputDirectory, `${id}.${theme}-${width}.viewport-start.png`)
      await page.screenshot({ path: start, animations: 'disabled' })
      let end = null
      if (width < mediaWidth) {
        await page.evaluate(() => { const s = document.querySelector('#scroller'); s.scrollLeft = s.scrollWidth })
        end = path.join(outputDirectory, `${id}.${theme}-${width}.viewport-end.png`)
        await page.screenshot({ path: end, animations: 'disabled' })
      }
      // Whole media evidence is separate from the honest narrow scroll viewport.
      await page.evaluate(() => { const s = document.querySelector('#scroller'); s.scrollLeft = 0; s.style.overflow = 'visible' })
      await page.setViewportSize({ width: 640, height: mediaHeight })
      const whole = path.join(outputDirectory, `${id}.${theme}-${width}.whole.png`)
      await page.screenshot({ path: whole, clip: { x: 0, y: 0, width: 640, height: mediaHeight }, animations: 'disabled' })
      captures.push({ width, theme, metrics, viewportStart: bind(start), viewportEnd: end ? bind(end) : null, wholeMedia: bind(whole),
        wholeCaptureNote: 'Whole640 media captured with ancestor overflow visible and screenshot viewport640 after narrow measurements; NOT a shrunken358/240/346 media or headed product capture.' })
    }
  } finally { await browserContext.close() }
} finally { await browser.close() }
const evidence = {
  schema: 'STEMROBIN-184/author-display-evidence@1', id, attempt, role: 'author capture; not independent review',
  browser: { headless: true, isolated: true, offline: true, requests: 'all aborted', cdp: false,
    persistentProfile: false, osInput: false, foreground: false, closed: true, pwdebug: 'unset' },
  bindings: { spec: bind(specPath), context: bind(contextPath), source: bind(path.join(root, spec.source.image.path)),
    frozenInventory: bind(path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n81-figure-author-source-inventory.md')),
    svg: bind(svgPath), render: bind(renderPath), native: bind(path.join(outputDirectory, `${id}.native.png`)) },
  completeContextExact: true, captures, mechanicalStatus: captures.every(c => c.metrics.status === 'pass') ? 'pass' : 'fail',
  limitation: 'Static isolated SVG harness, no headed app/product/offline acceptance, semantic approval or promotion. Fixed640 scroll is real declared media; narrow viewport is not inline.',
}
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ id, attempt, mechanicalStatus: evidence.mechanicalStatus, captures: captures.map(c => ({
  width: c.width, theme: c.theme, mediaWidth: c.metrics.mediaWidth, minTextPx: c.metrics.minTextPx, scroll: c.metrics.scroll,
})), evidence: bind(evidencePath) }, null, 2))
