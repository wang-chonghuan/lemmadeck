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
const rendered = path.join(tmp, 'g10-n62/work/render/9-10g/modern-us-neutral', lesson)
const output = path.join(tmp, 'n62-complete-display-01')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const sourceLesson = read(path.join(target, 'lesson.json'))
const sourceExercises = read(path.join(target, 'exercises.json'))
const keys = read(path.join(target, 'answer-keys.json'))
const interactions = read(path.join(target, 'interactions.json'))
const draft = read(path.join(target, 'choice-set/draft.json'))
const review = read(path.join(target, 'choice-set/review.json'))
assert.equal(keys.status, 'ready')
assert.equal(interactions.status, 'ready')
assert.equal(review.outcome, 'pass')
assert.equal(sourceExercises.count, 7)
assert.equal(keys.answers.length, 7)
assert.equal(draft.new_figures.length, 0)
assert.ok(draft.questions.length > 0)
const files = ['lesson.json', 'exercises.json', 'figures.json', 'answer-keys.json',
  'answer-keys.audit.json', 'interactions.json', 'choice-set/seed.json',
  'choice-set/draft.json', 'choice-set/review.json'].map(file => path.join(target, file))
const before = files.map(bind)
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
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    try {
      for (const kind of ['text', 'exercises', 'choices', 'answers']) {
        await page.goto(pathToFileURL(path.join(rendered,
          kind === 'exercises' ? 'exercises.html' : 'text.html')).href)
        if (kind === 'choices' || kind === 'answers') {
          const css = await page.locator('head > style').textContent()
          const body = kind === 'choices'
            ? draft.questions.map(({ view }, index) =>
              `<section class="choice-question"><div class="choice-stem">${choiceHtml(view.stem)}</div>`
              + view.options.map(option =>
                `<label class="choice-option"><input type="${view.mode === 'single' ? 'radio' : 'checkbox'}" name="q${index}">`
                + `<span class="choice-letter">${option.id}</span><span class="choice-content">${choiceHtml(option.text)}</span></label>`
              ).join('') + '</section>').join('')
            : keys.answers.map(answer =>
              `<section class="answer"><h2>${answer.exercise}</h2><div>${choiceHtml(answer.displayAnswer)}</div></section>`
            ).join('')
          await page.setContent(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`
            + `<style>${css}
            .choice-question,.answer{padding:16px 0;border-bottom:1px solid #ddd}
            .choice-stem,.answer{font-size:17px;line-height:1.9}
            .choice-option{display:flex;align-items:flex-start;gap:8px;margin:12px 0;font-size:16px;line-height:1.8;min-width:0}
            .choice-option input,.choice-letter{flex:none}.choice-option input{width:16px;height:16px;margin:8px 0 0}
            .choice-content{min-width:0;flex:1;overflow-x:auto}.choice-content p{margin:0}
            .answer h2{font-size:18px}.answer .katex-display{overflow-x:auto;overflow-y:hidden}
            </style><main class="sheet"><h1>${choiceHtml(sourceLesson.title)}</h1>${body}</main>`)
        }
        await page.evaluate(() => document.fonts.ready)
        assert.equal(await page.locator('.err,.katex-error').count(), 0)
        if (kind === 'exercises')
          assert.equal(await page.locator('li.ex').count(), 7)
        if (kind === 'choices') {
          assert.equal(await page.locator('.choice-question').count(), draft.questions.length)
          assert.equal(await page.locator('input').count(),
            draft.questions.reduce((count, question) => count + question.view.options.length, 0))
          await page.locator('input').first().check()
          assert.ok(await page.locator('input').first().isChecked())
          await page.locator('input').last().scrollIntoViewIfNeeded()
          assert.ok(await page.locator('input').last().isVisible())
        }
        if (kind === 'answers')
          assert.equal(await page.locator('section.answer').count(), 7)
        const layout = await page.evaluate(() => {
          const figures = [...document.querySelectorAll('.figure-media svg')].map(svg => ({
            id: svg.closest('figure')?.id,
            width: svg.getBoundingClientRect().width,
            height: svg.getBoundingClientRect().height,
            textPx: [...svg.querySelectorAll('text')].map(node =>
              parseFloat(getComputedStyle(node).fontSize)
              * svg.getBoundingClientRect().width / svg.viewBox.baseVal.width),
          }))
          const scroll = [...document.querySelectorAll('figure[data-figure-layout="scroll"]')]
            .map(node => {
              node.scrollLeft = node.scrollWidth
              return { id: node.id, left: node.scrollLeft, client: node.clientWidth,
                total: node.scrollWidth }
            })
          return { documentWidth: document.documentElement.scrollWidth,
            viewport: innerWidth, figures, scroll, maths: document.querySelectorAll('.katex').length,
            bodyTextLength: document.body.innerText.length }
        })
        assert.ok(layout.documentWidth <= viewport.width + 1, `${kind}: document overflow`)
        assert.ok(layout.bodyTextLength > 30, `${kind}: empty output`)
        for (const figure of layout.figures) {
          assert.ok(figure.width > 100 && figure.height > 50)
          assert.ok(figure.textPx.length && Math.min(...figure.textPx) >= 16,
            `${figure.id}: small text`)
        }
        for (const scroll of layout.scroll)
          assert.ok(Math.abs(scroll.left + scroll.client - scroll.total) <= 1)
        if (kind === 'text') {
          assert.deepEqual(layout.figures.map(figure => figure.id).sort(),
            ['fig-g10-89', 'fig-g10-90', 'fig-g10-91'])
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        const screenshot = path.join(output, `${kind}-${viewport.width}.png`)
        await page.screenshot({ path: screenshot, fullPage: true })
        assert.deepEqual(errors, [])
        results.push({ kind, viewport, layout, screenshot: bind(screenshot),
          status: 'mechanical-pass-visual-observation-pending' })
      }
    } finally {
      await context.close()
    }
  }
} catch (error) {
  failure = error.stack || String(error)
} finally {
  await browser.close()
  before.forEach(file => assert.equal(hash(file.path), file.sha256, file.path))
  save(path.join(output, 'result.json'), { headless: true, offline: true,
    status: failure ? 'fail' : 'mechanical-pass-visual-observation-pending',
    sourceBindings: before, results, failure, screenshotImages: results.length,
    DBWrites: 0, wholeLessonApproved: false })
}
if (failure) throw new Error(failure)
assert.equal(results.length, 8)
console.log(JSON.stringify({ output, screenshots: results.length, headless: true, offline: true }))
