import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { repo, tmp, core, read, bind, hash, save } from './retain-scoped-evidence-02.mjs'
import { choiceHtml } from '../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs'

assert.equal(process.cwd(), repo)
const lesson = 'geo910-c2-s3-n62'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const draftPath = path.join(target, 'choice-set/draft.json')
const question = read(draftPath).questions.find(item => item.id === 'n62-axis-intersections')
assert.ok(question)
const output = path.join(tmp, 'n62-choice-scroll-tail-01')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const displayPath = path.join(tmp, 'n62-complete-display-01/result.json')
const before = [draftPath, displayPath].map(bind)
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const browser = await chromium.launch({ headless: true })
const results = []
let failure
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport })
    await context.route(/^https?:/, route => route.abort())
    const page = await context.newPage()
    try {
      const rendered = path.join(tmp, 'g10-n62/work/render/9-10g/modern-us-neutral', lesson, 'text.html')
      await page.goto(pathToFileURL(rendered).href)
      const css = await page.locator('head > style').textContent()
      const body = question.view.options.map(option =>
        `<label class="choice-option"><input type="radio" name="q">`
        + `<span class="choice-letter">${option.id}</span>`
        + `<span class="choice-content">${choiceHtml(option.text)}</span></label>`
      ).join('')
      await page.setContent(`<!doctype html><meta charset="utf-8">`
        + `<meta name="viewport" content="width=device-width,initial-scale=1">`
        + `<style>${css}
        .choice-option{display:flex;align-items:flex-start;gap:8px;margin:12px 0;font-size:16px;line-height:1.8;min-width:0}
        .choice-option input,.choice-letter{flex:none}.choice-option input{width:16px;height:16px;margin:8px 0 0}
        .choice-content{min-width:0;flex:1;overflow-x:auto}.choice-content p{margin:0}
        </style><main class="sheet">${body}</main>`)
      await page.evaluate(() => document.fonts.ready)
      assert.equal(await page.locator('.katex-error').count(), 0)
      const rows = await page.locator('.choice-option').evaluateAll(options => options.map(option => {
        const content = option.querySelector('.choice-content')
        const maths = content.querySelector('.katex-html')
        const walker = document.createTreeWalker(maths, NodeFilter.SHOW_TEXT)
        let tail
        while (walker.nextNode())
          if (walker.currentNode.textContent.trim()) tail = walker.currentNode
        if (!tail) throw new Error('Missing rendered math tail')
        const range = document.createRange()
        range.setStart(tail, tail.textContent.length - 1)
        range.setEnd(tail, tail.textContent.length)
        content.scrollLeft = content.scrollWidth
        const clip = content.getBoundingClientRect()
        const end = range.getBoundingClientRect()
        return {
          id: option.querySelector('.choice-letter').textContent,
          clientWidth: content.clientWidth,
          scrollWidth: content.scrollWidth,
          scrollLeft: content.scrollLeft,
          overflowX: getComputedStyle(content).overflowX,
          tail: tail.textContent.trim(),
          tailLeft: end.left,
          tailRight: end.right,
          tailTop: end.top,
          tailBottom: end.bottom,
          clipLeft: clip.left,
          clipRight: clip.right,
          clipTop: clip.top,
          clipBottom: clip.bottom,
        }
      }))
      for (const row of rows) {
        assert.ok(row.tail.endsWith('}'), `${row.id}: missing closing brace`)
        assert.equal(row.overflowX, 'auto')
        assert.ok(Math.abs(row.scrollLeft + row.clientWidth - row.scrollWidth) <= 1)
        assert.ok(row.tailLeft >= row.clipLeft - 1 && row.tailRight <= row.clipRight + 1,
          `${row.id}: unreachable final glyph`)
        assert.ok(row.tailTop >= row.clipTop - 1 && row.tailBottom <= row.clipBottom + 1,
          `${row.id}: vertically clipped final glyph`)
      }
      results.push({ viewport, question: question.id, rows, status: 'pass' })
    } finally {
      await context.close()
    }
  }
} catch (error) {
  failure = error.stack || String(error)
} finally {
  await browser.close()
  before.forEach(item => assert.equal(hash(item.path), item.sha256))
  save(path.join(output, 'result.json'), {
    status: failure ? 'fail' : 'pass',
    scope: 'Only the long coordinate-set option tails seen in the first screenshots',
    headless: true, offline: true, inputs: before, results, failure,
    newImages: 0, contentChanged: false, repeatedContentReviews: 0, DBWrites: 0,
  })
}
if (failure) throw new Error(failure)
console.log(JSON.stringify({ output, status: 'pass', rowsChecked: 8, newImages: 0 }))
