import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(new URL(import.meta.url).pathname)
const nativeFile = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d801-n67-bilingual-native/report.json')
const card = 'phy10-c2-s2-n67'
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const require = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const { proseFlow } = require('./htmlfrag.js')
const native = read(nativeFile)
assert.equal(native.status, 'BILINGUAL-NATIVE-FINALIZE-RENDER-PASS-FIRST-DISPLAY-PENDING')
const reportFile = path.join(out, 'report.json')
assert.ok(!fs.existsSync(reportFile))
const report = {
  ticket: 'STEMROBIN-181', card, status: 'FIRST-DISPLAY-RUNNING',
  native: bind(nativeFile), checks: [], screenshots: [], imagesOpened: 0,
  browser: { headless: false, channel: 'chrome', isolated: true },
  viewports: [{ width: 1440, height: 960 }, { width: 390, height: 844 }],
  wholeCardApproved: false, scienceSourceAndFigureReviewsReplayed: false,
}
const save = () => fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n')
save()
const browser = await chromium.launch({ channel: 'chrome', headless: false })
try {
  const context = await browser.newContext()
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(String(e)))
  for (const packet of native.outputs) {
    const final = path.join(packet.root, '10p/editions/modern-us-neutral/lessons', card)
    const lesson = read(path.join(final, 'lesson.json'))
    const figures = read(path.join(final, 'figures.json')).figures
    const expectedParagraphs = proseFlow(lesson.prose, lesson.section_breaks).filter(b => !['fig', 'cap'].includes(b.kind))
    const expectedMath = expectedParagraphs.reduce((n, b) => n + [...b.text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].length, 0)
    for (const viewport of report.viewports) {
      await page.setViewportSize(viewport)
      for (const surface of ['text', 'exercises']) {
        const html = packet.html.find(b => path.basename(b.path) === surface + '.html')
        assert.equal(sha(path.resolve(repo, html.path)), html.sha256)
        await page.goto(pathToFileURL(path.resolve(repo, html.path)).href)
        await page.evaluate(async () => {
          await document.fonts.ready
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        })
        const dom = await page.evaluate(() => ({
          h1: document.querySelector('h1').innerText, lang: document.documentElement.lang,
          paragraphs: document.querySelectorAll('.para').length,
          math: document.querySelectorAll('.para .katex').length,
          exercises: document.querySelectorAll('li.ex').length,
          errors: [...document.querySelectorAll('.err,.katex-error')].map(n => n.textContent),
          overflow: document.documentElement.scrollWidth - innerWidth,
          clipped: [...document.querySelectorAll('h1,.para,.crumb,.jump,.figcap')].filter(n => n.scrollWidth > n.clientWidth + 2).map(n => n.textContent.slice(0, 100)),
          fonts: [...document.querySelectorAll('.para')].map(n => parseFloat(getComputedStyle(n).fontSize)),
          figures: [...document.querySelectorAll('.fig')].map(n => {
            const media = n.querySelector('.figure-media')
            const svg = media.querySelector('svg')
            const labels = [...svg.querySelectorAll('text')].filter(t => t.textContent.trim()).map(t => {
              const matrix = t.getScreenCTM()
              return parseFloat(getComputedStyle(t).fontSize) * Math.hypot(matrix.a, matrix.b)
            })
            return {
              id: n.id, layout: n.dataset.figureLayout, purpose: n.dataset.figurePurpose,
              mediaWidth: media.getBoundingClientRect().width, svgWidth: svg.getBoundingClientRect().width,
              minTextPx: Math.min(...labels), geometryNodes: svg.querySelectorAll('path,line,polygon,circle,ellipse').length,
            }
          }),
        }))
        assert.deepEqual(errors, [])
        assert.deepEqual(dom.errors, [])
        assert.deepEqual(dom.clipped, [])
        assert.ok(dom.overflow <= 1)
        assert.equal(dom.exercises, 0)
        assert.equal(dom.paragraphs, surface === 'text' ? expectedParagraphs.length : 0)
        assert.equal(dom.math, surface === 'text' ? expectedMath : 0)
        assert.ok(dom.fonts.every(n => n >= 16))
        const heading = (packet.locale === 'en' ? lesson.title : lesson.printed_title || lesson.title).replace(/\*\*([^*]+)\*\*/g, '$1')
        assert.equal(dom.h1, heading + (surface === 'text' ? '' : ' · ' + (packet.locale === 'en' ? 'Exercises' : '\u4e60\u9898')))
        if (packet.locale === 'en') assert.equal(dom.lang, 'en')
        assert.deepEqual(dom.figures.map(f => f.id), surface === 'text' ? figures.map(f => f.id) : [])
        for (const f of dom.figures) {
          assert.equal(f.purpose, 'instructional')
          assert.equal(f.layout, 'inline')
          assert.ok(f.geometryNodes > 0)
          assert.ok(f.minTextPx >= 15.99)
          assert.ok(f.mediaWidth > 300 && f.svgWidth > 300)
        }
        report.checks.push({ locale: packet.locale, viewport, surface, html, dom })
        async function capture(suffix) {
          const name = packet.locale + '-' + surface + '-' + viewport.width + '-' + suffix
          const f = path.join(out, 'screenshots', name + '.png')
          fs.mkdirSync(path.dirname(f), { recursive: true })
          await page.screenshot({ path: f })
          report.screenshots.push({ name, locale: packet.locale, viewport, surface, ...bind(f) })
        }
        if (surface === 'text') {
          await capture('top')
          if (viewport.width === 390) {
            await page.locator('#fig-134').scrollIntoViewIfNeeded()
            await capture('figure')
          }
        } else if ((packet.locale === 'zh' && viewport.width === 1440) || (packet.locale === 'en' && viewport.width === 390))
          await capture('zero-questions')
        await page.locator('.jump').click()
        assert.equal(path.basename(new URL(page.url()).pathname), surface === 'text' ? 'exercises.html' : 'text.html')
        save()
      }
    }
  }
  assert.equal(report.checks.length, 8)
  assert.equal(report.screenshots.length, 8)
  report.status = 'FIRST-EIGHT-SURFACE-DOM-CAPTURE-PASS-VISUAL-PENDING'
  save()
} catch (e) {
  report.status = 'FAIL-FIRST-DISPLAY'
  report.failure = String(e.stack || e)
  save()
  throw e
} finally {
  await browser.close()
}
console.log(JSON.stringify({ status: report.status, report: bind(reportFile), screenshots: report.screenshots.length }))
