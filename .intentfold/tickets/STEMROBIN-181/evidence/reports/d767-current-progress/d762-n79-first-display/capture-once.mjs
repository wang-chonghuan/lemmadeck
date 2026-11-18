import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
assert.ok(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === 'n82'))
const n82 = process.argv[2] === 'n82'
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.join(tmp, n82 ? 'd763-n82-first-display' : 'd762-n79-first-display')
const card = n82 ? 'phy10-c2-s3-n82' : 'phy10-c2-s2-n79'
const nativePath = path.join(tmp, n82 ? 'd760-n82-bilingual-native/report.json' : 'd761-n79-english-native-continuation/report.json')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: sha(file) })
const native = read(nativePath)
assert.equal(native.status, 'BILINGUAL-NATIVE-FINALIZE-RENDER-PASS-FIRST-DISPLAY-PENDING')
const require = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const { proseFlow } = require('./htmlfrag.js')
fs.mkdirSync(out, { recursive: true })
const report = {
  ticket: 'STEMROBIN-181', card, status: 'FIRST-DISPLAY-RUNNING',
  native: bind(nativePath), checks: [], screenshots: [],
  imagesOpened: 0, browser: { headless: false, channel: 'chrome', isolated: true },
  viewports: [{ width: 1440, height: 960 }, { width: 390, height: 844 }],
  scientificOrFigureReviewsReplayed: false, htmlRegenerated: false,
  representativeVisualScope: 'Eight original viewport screenshots; complete DOM contracts on all eight text/exercise surfaces. Not exhaustive full-page tile inspection.',
  fullCardApproved: false,
}
const file = path.join(out, 'report.json')
if (fs.existsSync(file)) {
  const previous = read(file)
  assert.equal(previous.status, 'FAIL-FIRST-DISPLAY')
  assert.equal(previous.checks.length, 0, 'Do not replay any complete passed surface')
  assert.equal(previous.screenshots.length, 0)
  const firstFailure = path.join(out, 'first-failure.json')
  fs.copyFileSync(file, firstFailure, fs.constants.COPYFILE_EXCL)
  report.technicalRecovery = {
    firstFailure: bind(firstFailure),
    cause: 'The checker compared raw Markdown bold delimiters in printed_title with the already rendered visible heading.',
    change: 'Strip only native renderer-supported bold delimiters in expected title.',
    nativeOrHTMLReplayed: false, passedSurfacesReplayed: 0,
  }
}
const save = () => fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`)
save()
const browser = await chromium.launch({ channel: 'chrome', headless: false })
try {
  const context = await browser.newContext()
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(String(error)))
  for (const packet of native.outputs) {
    for (const item of packet.nativeFiles) assert.equal(sha(path.resolve(repo, item.path)), item.sha256)
    const final = path.join(packet.root, '10p/editions/modern-us-neutral/lessons', card)
    const lesson = read(path.join(final, 'lesson.json'))
    const figures = read(path.join(final, 'figures.json')).figures.map((figure) => figure.id)
    const flow = proseFlow(lesson.prose, lesson.section_breaks)
    const paras = flow.filter((block) => !['fig', 'cap'].includes(block.kind))
    const mathCount = paras.reduce((sum, block) => sum + [...block.text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].length, 0)
    for (const viewport of report.viewports) {
      await page.setViewportSize(viewport)
      for (const surface of ['text', 'exercises']) {
        const html = packet.html.find((item) => path.basename(item.path) === `${surface}.html`)
        assert.ok(html)
        assert.equal(sha(path.resolve(repo, html.path)), html.sha256)
        await page.goto(pathToFileURL(path.resolve(repo, html.path)).href)
        await page.evaluate(async () => {
          await document.fonts.ready
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        })
        const dom = await page.evaluate(() => {
          const clipped = [...document.querySelectorAll('h1,.crumb,.para,.figcap,.jump')].filter((node) =>
            node.scrollWidth > node.clientWidth + 2).map((node) => ({ class: node.className, text: node.textContent.slice(0, 100) }))
          const figures = [...document.querySelectorAll('.fig')].map((node) => {
            const media = node.querySelector('.figure-media')
            const svg = media.querySelector('svg')
            const labels = [...svg.querySelectorAll('text')].filter((text) => text.textContent.trim()).map((text) => {
              const matrix = text.getScreenCTM()
              return parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b)
            })
            const maxScroll = Math.max(0, node.scrollWidth - node.clientWidth)
            node.scrollLeft = maxScroll
            const endReachable = Math.abs(node.scrollLeft - maxScroll) < 2
            node.scrollLeft = 0
            return {
              id: node.id, layout: node.dataset.figureLayout, purpose: node.dataset.figurePurpose,
              mediaWidth: media.getBoundingClientRect().width,
              svgWidth: svg.getBoundingClientRect().width,
              minTextPx: Math.min(...labels), maxScroll, endReachable,
            }
          })
          return {
            h1: document.querySelector('h1').innerText,
            lang: document.documentElement.lang,
            paragraphCount: document.querySelectorAll('.para').length,
            mathCount: document.querySelectorAll('.para .katex').length,
            errors: [...document.querySelectorAll('.err,.katex-error')].map((node) => node.textContent),
            exercises: document.querySelectorAll('li.ex').length,
            figures, clipped,
            pageOverflow: document.documentElement.scrollWidth - innerWidth,
            proseMathFont: [...document.querySelectorAll('.prose-math')].every((node) => getComputedStyle(node).fontFamily.includes('KaTeX_Main')),
            proseFontPx: [...document.querySelectorAll('.para')].map((node) => parseFloat(getComputedStyle(node).fontSize)),
            jump: document.querySelector('.jump').getAttribute('href'),
          }
        })
        assert.equal(errors.length, 0, JSON.stringify(errors))
        assert.equal(dom.errors.length, 0)
        assert.equal(dom.clipped.length, 0, JSON.stringify(dom.clipped))
        assert.ok(dom.pageOverflow <= 1, `Unexpected whole-page overflow ${dom.pageOverflow}`)
        assert.equal(dom.exercises, 0, 'No questions may be invented on a zero-question card')
        assert.equal(dom.proseMathFont, true)
        const heading = (packet.locale === 'en' ? lesson.title : (lesson.printed_title || lesson.title))
          .replace(/\*\*([^*]+)\*\*/g, '$1')
        assert.equal(dom.h1, surface === 'text' ? heading : `${heading} · ${packet.locale === 'en' ? 'Exercises' : '习题'}`)
        if (packet.locale === 'en') assert.equal(dom.lang, 'en')
        assert.equal(dom.paragraphCount, surface === 'text' ? paras.length : 0)
        assert.equal(dom.mathCount, surface === 'text' ? mathCount : 0)
        assert.deepEqual(dom.figures.map((figure) => figure.id), surface === 'text' ? figures : [])
        for (const figure of dom.figures) {
          assert.equal(figure.layout, 'scroll')
          assert.equal(figure.purpose, 'instructional')
          assert.ok(Math.abs(figure.mediaWidth - 640) < 1)
          assert.ok(Math.abs(figure.svgWidth - 640) < 1)
          assert.ok(figure.minTextPx >= 15.99)
          assert.equal(figure.endReachable, true)
        }
        assert.ok(dom.proseFontPx.every((size) => size >= 16))
        report.checks.push({ locale: packet.locale, viewport, surface, html, dom })
        const capture = async (name) => {
          const screenshot = path.join(out, 'screenshots', `${name}.png`)
          fs.mkdirSync(path.dirname(screenshot), { recursive: true })
          await page.screenshot({ path: screenshot })
          report.screenshots.push({ name, locale: packet.locale, viewport, surface, ...bind(screenshot) })
        }
        if (surface === 'text') {
          await capture(`${packet.locale}-text-${viewport.width}-top`)
          if (viewport.width === 390) {
            const last = page.locator(`#${figures.at(-1)}`)
            await last.scrollIntoViewIfNeeded()
            await last.evaluate((node) => { node.scrollLeft = node.scrollWidth - node.clientWidth })
            await capture(`${packet.locale}-text-390-final-figure-scroll-end`)
          }
        } else if ((packet.locale === 'zh' && viewport.width === 1440) || (packet.locale === 'en' && viewport.width === 390)) {
          await capture(`${packet.locale}-exercises-${viewport.width}-zero-questions`)
        }
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
} catch (error) {
  report.status = 'FAIL-FIRST-DISPLAY'
  report.firstFailure = String(error.stack || error)
  save()
  throw error
} finally {
  await browser.close()
}
console.log(JSON.stringify({ status: report.status, report: bind(file), screenshots: report.screenshots.length, imagesOpened: 0 }))
