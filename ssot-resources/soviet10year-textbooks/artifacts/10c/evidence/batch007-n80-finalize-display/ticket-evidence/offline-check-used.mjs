import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'

const repo = process.cwd().endsWith('/app') ? path.dirname(process.cwd()) : process.cwd()
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const book = process.argv[2]
const lesson = process.argv[3]
assert(book && lesson, 'Expected book and lesson')
const edition = 'modern-us-neutral'
const root = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts', book, 'editions', edition)
const dir = path.join(root, 'lessons', lesson)
const lessonDoc = JSON.parse(fs.readFileSync(path.join(dir, 'lesson.json')))
const exerciseDoc = JSON.parse(fs.readFileSync(path.join(dir, 'exercises.json')))
const render = path.join(repo, '.tmp/ld-s10y-lesson/render', book, edition, lesson)
const evidence = path.join(repo, '.intentfold/tickets/STEMROBIN-184/tmp/offline', lesson)
fs.mkdirSync(evidence, { recursive: true })
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const { proseFlow } = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/package.json'))('./tools/htmlfrag.js')
const paragraphs = proseFlow(lessonDoc.prose, lessonDoc.section_breaks).filter((block) => block.kind === 'p')
delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport })
    await context.route(/^https?:/, (route) => route.abort())
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const kind of (process.env.OFFLINE_KINDS || 'text,exercises').split(',')) {
      const file = path.join(render, `${kind}.html`)
      await page.goto(pathToFileURL(file).href)
      await page.evaluate(() => document.fonts.ready)
      await page.getByRole('heading', { level: 1 }).waitFor()
      const expected = kind === 'text' ? paragraphs.length : exerciseDoc.count
      const selector = kind === 'text' ? 'p.para' : 'li.ex'
      assert.equal(await page.locator(selector).count(), expected)
      assert.equal(await page.locator('.err,.katex-error,input,textarea').count(), 0)
      const geometry = await page.evaluate((selector) => {
        const items = Array.from(document.querySelectorAll(selector))
        return {
          width: innerWidth,
          docWidth: document.documentElement.scrollWidth,
          rows: items.map((item) => {
            const box = item.getBoundingClientRect()
            const style = getComputedStyle(item)
            return { x: box.x, right: box.right, height: box.height, indent: style.textIndent }
          }),
          sections: document.querySelectorAll('p.para.section').length,
          remote: [...document.querySelectorAll('img,link,script')].map((element) => element.src || element.href || '').filter((url) => /^https?:/.test(url)),
          figures: [...document.querySelectorAll('.figure-media')].map((media) => {
            const box = media.getBoundingClientRect()
            return {
              width: box.width,
              height: box.height,
              labels: [...media.querySelectorAll('svg text')].map((text) => {
                const matrix = text.getScreenCTM()
                const size = Number.parseFloat(getComputedStyle(text).fontSize)
                const rect = text.getBoundingClientRect()
                return {
                  text: text.textContent,
                  pixels: size * Math.hypot(matrix.c, matrix.d),
                  fits: rect.left >= box.left - 1 && rect.right <= box.right + 1
                    && rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1,
                }
              }),
            }
          }),
        }
      }, selector)
      assert(geometry.docWidth <= geometry.width + 1, 'Page horizontally overflows')
      assert(geometry.rows.every((row) => row.x >= 0 && row.right <= geometry.width + 1 && row.height > 0))
      assert.equal(geometry.remote.length, 0)
      assert(geometry.figures.every((figure) => figure.width > 0 && figure.height > 0
        && figure.labels.every((label) => label.pixels >= 15.99 && label.fits)),
      'Instructional figure label is clipped or smaller than 16px at the actual media width')
      if (kind === 'text') {
        assert(geometry.rows.every((row) => row.indent === '0px'))
        assert.equal(geometry.sections, lessonDoc.section_breaks.length)
      }
      const screenshot = path.join(evidence, `${kind}-${viewport.width}.png`)
      await page.screenshot({ path: screenshot, fullPage: true })
      const scrollScreenshots = []
      const scrollFigures = page.locator('.fig[data-figure-layout="scroll"]')
      for (let index = 0; index < await scrollFigures.count(); index++) {
        const figure = scrollFigures.nth(index)
        const scroll = await figure.evaluate((element) => {
          element.scrollLeft = element.scrollWidth - element.clientWidth
          return { clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
            actualScrollLeft: element.scrollLeft, maxScrollLeft: element.scrollWidth - element.clientWidth }
        })
        assert(Math.abs(scroll.actualScrollLeft - scroll.maxScrollLeft) <= 1, 'Figure scroll end is unreachable')
        const endScreenshot = path.join(evidence, `${kind}-${viewport.width}-scroll-${index}-end.png`)
        await figure.screenshot({ path: endScreenshot })
        await figure.evaluate(element => { element.scrollLeft = 0 })
        const startScreenshot = path.join(evidence, `${kind}-${viewport.width}-scroll-${index}-start.png`)
        await figure.screenshot({ path: startScreenshot })
        scrollScreenshots.push({ index, ...scroll,
          start: { path: path.relative(repo, startScreenshot), sha256: hash(startScreenshot) },
          end: { path: path.relative(repo, endScreenshot), sha256: hash(endScreenshot) } })
      }
      results.push({ kind, viewport, count: expected, fileSha256: hash(file), screenshot: path.relative(repo, screenshot), screenshotSha256: hash(screenshot), geometry, scrollScreenshots })
    }
    assert.deepEqual(errors, [])
    await context.close()
  }
} finally {
  await browser.close()
}
const report = { status: 'pass', book, lesson, edition, observedAt: new Date().toISOString(), browser: 'isolated headless Chromium', limitation: 'Offline read-only content rendering only; not headed/OS behavior, product UI, quiz judging, paging or record persistence.', results }
fs.writeFileSync(path.join(evidence, process.env.OFFLINE_REPORT || 'report.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
