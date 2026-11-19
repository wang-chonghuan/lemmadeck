import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const card = 'phy10-c2-s4-n92'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const require = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const { proseFlow, inline } = require('./htmlfrag.js')
const sharp = createRequire(path.join(repo, '.agents/skills/package.json'))('sharp')
const nativeFile = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1036-n92-section-marker-native-recovery/report.json')
const native = read(nativeFile)
assert.equal(native.status, 'FIRST-BILINGUAL-NATIVE-PASS-WITH-SECTION-MARKER-RECOVERY')
const report = {
  ticket: 'STEMROBIN-181', batch: 'D035', card,
  status: 'FIRST-DISPLAY-RUNNING', native: bind(nativeFile),
  browser: { headless: true, isolated: true, userProfiles: false, userWindows: false },
  limitation: 'Authorized isolated headless offline display evidence, not formal headed product acceptance.',
  checks: [], screenshots: [], targets: [], reviewBatches: [],
  parentNewImageOpens: 0, nativePassReplays: 0, semanticReviewsReplayed: 0,
  completeCard: false, databaseWrites: false,
}
const save = (name, data) => {
  const file = path.join(own, name)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
}
save('started.json', report)
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext()
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(String(error)))
  for (const locale of ['zh', 'en']) {
    const packet = native.outputs[locale]
    for (const binding of [...packet.nativeFiles, ...packet.html])
      assert.equal(sha(binding.path), binding.sha256)
    const lesson = read(path.join(packet.target, 'lesson.json'))
    const expected = proseFlow(lesson.prose, lesson.section_breaks)
      .filter(block => !['fig', 'cap'].includes(block.kind))
    assert.equal(read(path.join(packet.target, 'exercises.json')).count, 0)
    assert.deepEqual(read(path.join(packet.target, 'figures.json')).figures, [])
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport)
      for (const surface of ['text', 'exercises']) {
        const html = packet.html.find(item => path.basename(item.path) === surface + '.html')
        await page.goto(pathToFileURL(html.path).href)
        await page.evaluate(async () => {
          await document.fonts.ready
          await document.fonts.load('16px KaTeX_Main', 'Ax0123')
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        })
        const dom = await page.evaluate(({ expectedHtml }) => {
          const plain = markup => {
            const element = document.createElement('div')
            element.innerHTML = markup
            element.querySelectorAll('.katex-mathml').forEach(node => node.remove())
            return element.textContent.replace(/\s+/g, ' ').trim()
          }
          const paragraphs = [...document.querySelectorAll('.para')]
          const rect = node => {
            const r = node.getBoundingClientRect()
            return { x: r.x, y: r.y, width: r.width, height: r.height }
          }
          return {
            lang: document.documentElement.lang,
            h1: document.querySelector('h1').textContent,
            paragraphs: paragraphs.length,
            textMatches: paragraphs.every((node, index) => plain(node.innerHTML) === plain(expectedHtml[index])),
            sections: paragraphs.map((node, index) => node.classList.contains('section') ? index : null).filter(index => index !== null),
            math: document.querySelectorAll('.para .katex').length,
            questions: document.querySelectorAll('li.ex').length,
            figures: document.querySelectorAll('.fig').length,
            inputs: document.querySelectorAll('input,textarea,math-field').length,
            fonts: paragraphs.map(node => parseFloat(getComputedStyle(node).fontSize)),
            katexFontLoaded: document.fonts.check('16px KaTeX_Main', 'Ax0123'),
            errors: [...document.querySelectorAll('.err,.katex-error')].map(node => node.textContent),
            overflow: document.documentElement.scrollWidth - innerWidth,
            clipped: [...document.querySelectorAll('h1,.para,.crumb,.jump')].filter(node => node.scrollWidth > node.clientWidth + 2).map(node => node.textContent),
            formulaVerticalOverflows: [...document.querySelectorAll('.nb')].filter(node => node.scrollHeight > node.clientHeight + 1).map(node => node.textContent),
            height: document.documentElement.scrollHeight,
            heading: rect(document.querySelector('h1')),
            jump: rect(document.querySelector('.jump')),
            lastParagraph: paragraphs.length ? rect(paragraphs.at(-1)) : null,
          }
        }, { expectedHtml: surface === 'text' ? expected.map(block => inline(block.text)) : [] })
        assert.deepEqual(errors, [])
        assert.deepEqual(dom.errors, [])
        assert.deepEqual(dom.clipped, [])
        assert.deepEqual(dom.formulaVerticalOverflows, [])
        assert.ok(dom.overflow <= 1)
        assert.equal(dom.lang, locale === 'en' ? 'en' : 'zh-CN')
        assert.equal(dom.paragraphs, surface === 'text' ? expected.length : 0)
        assert.equal(dom.textMatches, true)
        assert.equal(dom.math, surface === 'text'
          ? expected.reduce((n, block) => n + [...block.text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].length, 0) : 0)
        assert.equal(dom.questions, 0)
        assert.equal(dom.figures, 0)
        assert.equal(dom.inputs, 0)
        assert.ok(dom.fonts.every(size => size >= 16))
        assert.equal(dom.katexFontLoaded, true)
        const heading = (locale === 'en' ? lesson.title : lesson.printed_title || lesson.title).replace(/\*\*([^*]+)\*\*/g, '$1')
        assert.equal(dom.h1, heading + (surface === 'text' ? '' : ' \u00b7 ' + (locale === 'en' ? 'Exercises' : '\u4e60\u9898')))
        const name = `${locale}-${surface}-${viewport.width}`
        const screenshot = path.join(own, 'screenshots', name + '.png')
        fs.mkdirSync(path.dirname(screenshot), { recursive: true })
        await page.screenshot({ path: screenshot, fullPage: true })
        const metadata = await sharp(screenshot).metadata()
        assert.equal(metadata.width, viewport.width)
        assert.ok(metadata.height >= viewport.height)
        report.checks.push({ locale, viewport, surface, html, dom })
        report.screenshots.push({ locale, viewport, surface, ...bind(screenshot), width: metadata.width, height: metadata.height })
        const tileHeight = 1100
        const relevantHeight = surface === 'exercises'
          ? Math.min(metadata.height, Math.ceil(dom.jump.y + dom.jump.height + 40)) : metadata.height
        for (let top = 0, index = 0; top < relevantHeight; top += tileHeight, index++) {
          const tile = path.join(own, 'tiles', `${name}-${index}.png`)
          fs.mkdirSync(path.dirname(tile), { recursive: true })
          const height = Math.min(tileHeight, relevantHeight - top)
          await sharp(screenshot).extract({ left: 0, top, width: metadata.width, height }).png().toFile(tile)
          report.targets.push({ locale, viewport, surface, index, top, width: metadata.width, height,
            image: bind(tile), original: bind(screenshot) })
        }
        await page.locator('.jump').click()
        assert.equal(path.basename(new URL(page.url()).pathname), surface === 'text' ? 'exercises.html' : 'text.html')
      }
    }
  }
  assert.equal(report.checks.length, 8)
  for (let index = 0; index < report.targets.length; index += 8)
    report.reviewBatches.push({ id: `batch-${report.reviewBatches.length + 1}`, targets: report.targets.slice(index, index + 8) })
  report.status = 'FIRST-EIGHT-SURFACE-DOM-CAPTURE-PASS-VISUAL-PENDING'
  save('report.json', report)
} catch (error) {
  report.status = 'FIRST-DISPLAY-FAIL'
  report.failure = String(error.stack || error)
  save('FIRST-failure.json', report)
  throw error
} finally {
  await browser.close()
}
console.log(JSON.stringify({ status: report.status, surfaces: report.checks.length, targets: report.targets.length, batches: report.reviewBatches.length }))
