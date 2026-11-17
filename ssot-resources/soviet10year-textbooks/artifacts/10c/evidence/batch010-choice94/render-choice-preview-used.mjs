import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { createHash } from 'node:crypto'
import { choiceHtml } from '../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs'

const repo = process.cwd()
const [book, lesson, seedFile, draftFile, questionId] = process.argv.slice(2)
assert(book && lesson, 'Expected book and lesson')
const edition = 'modern-us-neutral'
const source = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts', book, 'editions', edition, 'lessons', lesson)
const seed = JSON.parse(fs.readFileSync(seedFile || path.join(source, 'choice-set/seed.json')))
const draft = JSON.parse(fs.readFileSync(draftFile || path.join(source, 'choice-set/draft.json')))
const selectedQuestions = questionId ? draft.questions.filter(({ id }) => id === questionId) : draft.questions
assert(selectedQuestions.length > 0, 'Requested question must exist')
const suffix = questionId ? `-${questionId}` : ''
const lessonDoc = JSON.parse(fs.readFileSync(path.join(source, 'lesson.json')))
const output = path.join(repo, '.tmp/ld-s10y-lesson/render', book, edition, lesson)
const evidence = path.join(repo, '.intentfold/tickets/STEMROBIN-184/tmp/offline', lesson)
const escape = (text) => text.replace(/[&<>"']/g, (value) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[value]))
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const assets = new Map(seed.figures.map((figure) => [figure.id, figure.assets]))
for (const figure of draft.new_figures) assets.set(figure.id, [{ path: figure.path }])
const figureDoc = JSON.parse(fs.readFileSync(path.join(source, 'figures.json')))
const editionRoot = path.dirname(path.dirname(source))
const displays = new Map(figureDoc.figures.map((figure) => {
  const spec = JSON.parse(fs.readFileSync(path.join(editionRoot, figure.spec)))
  return [figure.id, spec.display]
}))
const media = (ids) => ids.map((id) => {
  assert(assets.has(id), `Missing figure ${id}`)
  const display = displays.get(id)
  const scroll = display?.layout === 'scroll'
  const width = display?.maxWidthPx || (scroll ? 640 : null)
  return `<figure class="fig" data-figure-layout="${scroll ? 'scroll' : 'inline'}"><div class="figure-media"${width ? ` style="width:${width}px;${scroll ? 'max-width:none' : 'max-width:100%'}"` : ''}>${assets.get(id).map((asset) => {
    const file = path.join(repo, asset.path)
    if (file.endsWith('.svg')) return fs.readFileSync(file, 'utf8')
    const extension = path.extname(file).slice(1)
    return `<img alt="" src="data:image/${extension};base64,${fs.readFileSync(file).toString('base64')}">`
  }).join('')}</div></figure>`
}).join('')
const { chromium } = createRequire(path.join(repo, 'app/package.json'))('playwright')
delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const browser = await chromium.launch({ headless: true })
const observations = []
try {
  const page = await browser.newPage()
  await page.route(/^https?:/, (route) => route.abort())
  await page.goto(pathToFileURL(path.join(output, 'text.html')).href)
  const css = await page.locator('style').textContent()
  const questions = selectedQuestions.map((question) =>
    `<section class="question" data-question="${escape(question.id)}"><h2>${draft.questions.indexOf(question) + 1}. ${question.view.mode === 'single' ? '单选题' : '多选题'}</h2>`
    + `<div class="stem">${choiceHtml(question.view.stem)}</div>${media(question.view.figure_ids)}`
    + `<div class="options">${question.view.options.map((option, optionIndex) =>
      `<label class="option"><input type="${question.view.mode === 'single' ? 'radio' : 'checkbox'}" name="${escape(question.id)}" value="${escape(option.id)}">`
      + `<span class="letter">${String.fromCharCode(65 + optionIndex)}.</span>`
      + `<div>${choiceHtml(option.text)}${media(option.figure_ids)}</div></label>`).join('')}</div></section>`
  ).join('')
  const html = `<!DOCTYPE html><html lang="zh"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`
    + `<title>${escape(lessonDoc.title)} · 选择题</title><style>${css}
    h1{letter-spacing:0}.question{border-top:1px solid var(--rule);padding:20px 0}
    h2{font-size:16px;margin:0 0 12px}.stem,.option{line-height:1.8;font-size:17px}
    .option{display:grid;grid-template-columns:18px 24px minmax(0,1fr);gap:8px;padding:10px 0}
    .option input{margin:8px 0 0;width:16px;height:16px}.option>div{min-width:0}
    table{border-collapse:collapse;width:100%;font-size:16px}td,th{border:1px solid var(--rule);padding:6px;text-align:left}
    </style><main class="sheet"><h1>${escape(lessonDoc.title)} · 选择题</h1>${questions}</main></html>`
  const file = path.join(output, `choices${suffix}.html`)
  fs.mkdirSync(evidence, { recursive: true })
  fs.writeFileSync(file, html)
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 })
    await page.goto(pathToFileURL(file).href)
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('.question').count(), selectedQuestions.length)
    assert.equal(await page.locator('.option').count(), selectedQuestions.reduce((sum, question) => sum + question.view.options.length, 0))
    assert.equal(await page.locator('.katex-error,.err,script,[data-correct]').count(), 0)
    const geometry = await page.evaluate(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      options: [...document.querySelectorAll('.option')].map((element) => {
        const rect = element.getBoundingClientRect()
        return { left: rect.left, right: rect.right, height: rect.height }
      }),
      labels: [...document.querySelectorAll('.figure-media svg text')].map((text) => {
        const matrix = text.getScreenCTM()
        return Number.parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.c, matrix.d)
      }),
      scroll: [...document.querySelectorAll('figure[data-figure-layout="scroll"]')].map((figure) => {
        figure.scrollLeft = figure.scrollWidth
        return { width: figure.clientWidth, mediaWidth: figure.scrollWidth, end: figure.scrollLeft,
          reachable: Math.abs(figure.scrollLeft - Math.max(0, figure.scrollWidth - figure.clientWidth)) <= 1 }
      }),
    }))
    assert(geometry.documentWidth <= width + 1)
    assert(geometry.options.every((option) => option.left >= 0 && option.right <= width + 1 && option.height > 0))
    assert(geometry.labels.every((pixels) => pixels >= 15.99))
    assert(geometry.scroll.every((figure) => figure.reachable))
    const screenshot = path.join(evidence, `choices${suffix}-${width}.png`)
    await page.screenshot({ path: screenshot, fullPage: true })
    observations.push({ width, geometry, screenshot: path.relative(repo, screenshot), screenshotSha256: hash(screenshot) })
  }
  const report = { status: 'pass', book, lesson, questionIds: selectedQuestions.map(({ id }) => id), browser: 'isolated headless Chromium', htmlSha256: hash(file), limitation: 'View-only offline choice layout; no headed/OS behavior, judging, persistence or product integration.', observations }
  fs.writeFileSync(path.join(evidence, `choices${suffix}-report.json`), JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally {
  await browser.close()
}
