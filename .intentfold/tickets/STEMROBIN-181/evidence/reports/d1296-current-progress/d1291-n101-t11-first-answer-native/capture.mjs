import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'
import { choiceHtml } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/tools/choice_html.mjs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const own = config.output
const tmp = path.dirname(path.dirname(new URL(import.meta.url).pathname))
const card = config.card
assert.ok(config.surfaces.every(surface => ['answers', 'choices'].includes(surface)))
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const require = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const { inline } = require('./htmlfrag.js')
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const nativeFile = config.nativeFile
const native = read(nativeFile)
assert.equal(native.status, 'FIRST-BILINGUAL-NATIVE-TEXT-FIGURES-PASS')
const report = {
  ticket: 'STEMROBIN-181', batch: 'D037', card,
  status: 'FIRST-ANSWER-CHOICE-DISPLAY-RUNNING', native: bind(nativeFile),
  checks: [], html: [], screenshots: [], panels: [], targets: [], reviewBatches: [],
  inputs: [], parentImageOpens: 0, nativePassReplays: 0, paidCalls: 0,
  completeCard: false, databaseWrites: false,
  limitation: 'Isolated headless offline display; not formal product or interaction acceptance.',
}
for (const locale of config.surfaces.includes('choices') ? ['zh', 'en'] : []) {
  const review = config.choices[locale].review
  const draft = config.choices[locale].draft
  assert.equal(read(review).outcome, 'pass')
  report.inputs.push({ locale, kind: 'review', ...bind(review) }, { locale, kind: 'draft', ...bind(draft) })
}
save(path.join(own, 'started.json'), report)
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(String(error)))
  for (const locale of ['zh', 'en']) {
    const packet = native.outputs[locale]
    const exercises = read(path.join(packet.target, 'exercises.json')).exercises
    const answerFile = path.join(packet.target, 'answer-keys.json')
    const answers = read(answerFile).answers
    const questions = config.surfaces.includes('choices')
      ? read(config.choices[locale].draft).questions : []
    const count = exercises.length
    const optionCount = questions.reduce((sum, question) => sum + question.view.options.length, 0)
    assert.equal(count, config.sourceQuestions)
    assert.equal(answers.length, count)
    if (config.surfaces.includes('choices')) assert.ok(questions.length > 0)
    assert.ok(exercises.every(item => item.figure_refs.length === 0))
    assert.ok(questions.every(item => item.view.figure_ids.length === 0 &&
      item.view.options.every(option => option.figure_ids.length === 0)))
    report.inputs.push({ locale, kind: 'answers', ...bind(answerFile) })
    const base = packet.html.find(item => path.basename(item.path) === 'exercises.html')
    assert.equal(sha(base.path), base.sha256)
    for (const surface of config.surfaces) {
      await page.goto(pathToFileURL(base.path).href)
      const content = surface === 'answers' ? answers.map((answer, index) => {
        assert.equal(answer.grading, 'ungraded')
        assert.deepEqual(answer.parts, [])
        const exercise = exercises.find(item => item.number === answer.exercise)
        assert.ok(exercise)
        return `<li class="ex"><div class="no">${index + 1}.</div><div class="body"><div class="prompt">${inline(exercise.text)}</div><div class="answer">${inline(answer.displayAnswer)}</div></div></li>`
      }).join('') : questions.map((question, index) =>
        `<li class="ex" data-choice-mode="${question.view.mode}"><div class="no">${index + 1}.</div><div class="body"><div class="prompt">${choiceHtml(question.view.stem)}</div><ol class="options">${question.view.options.map((option, i) => `<li><span class="option-label">${String.fromCharCode(65 + i)}.</span><div>${choiceHtml(option.text)}</div></li>`).join('')}</ol></div></li>`).join('')
      await page.evaluate(({ content, locale, surface }) => {
        const heading = document.querySelector('h1')
        heading.textContent += ' | ' + (surface === 'answers'
          ? locale === 'en' ? 'Answer Standards' : '标准答案'
          : locale === 'en' ? 'Choice Questions' : '选择题')
        document.title = heading.textContent
        document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
        const sheet = document.querySelector('.sheet')
        for (const node of [...sheet.children]) if (node !== heading) node.remove()
        const list = document.createElement('ol')
        list.className = 'ex'
        list.innerHTML = content
        sheet.append(list)
        const style = document.createElement('style')
        style.textContent = '.answer{border-top:1px solid var(--rule);margin-top:.8em;padding-top:.8em}.options{list-style:none;margin:.7em 0 0;padding:0}.options>li{display:grid;grid-template-columns:1.8em minmax(0,1fr);gap:.4em;margin:.5em 0}.options>li>div{min-width:0;overflow-x:auto}.body .katex{font-size:1.1em}.prompt,.answer{min-width:0}.option-label{font-family:KaTeX_Main,serif}h1{letter-spacing:0}'
        document.head.append(style)
      }, { content, locale, surface })
      const markup = await page.content()
      if (surface === 'choices')
        assert.ok(!/seed_sha256|source_solution|correct_index|data-correct|"rationales"|"key":|displayAnswer/.test(markup))
      const file = path.join(own, locale, surface + '.html')
      save(file, markup)
      report.html.push({ locale, surface, ...bind(file) })
      const expected = surface === 'answers' ? answers.map(item => inline(item.displayAnswer))
        : questions.flatMap(question => [choiceHtml(question.view.stem),
          ...question.view.options.map(option => choiceHtml(option.text))])
      for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(viewport)
        await page.goto(pathToFileURL(file).href)
        await page.evaluate(async () => {
          await document.fonts.ready
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        })
        const dom = await page.evaluate(({ surface, expected }) => {
          const plain = markup => {
            const node = document.createElement('div')
            node.innerHTML = markup
            node.querySelectorAll('.katex-mathml').forEach(item => item.remove())
            return node.textContent.replace(/\s+/g, ' ').trim()
          }
          const nodes = surface === 'answers' ? [...document.querySelectorAll('.answer')]
            : [...document.querySelectorAll('li.ex')].flatMap(node =>
              [node.querySelector('.prompt'), ...node.querySelectorAll('.options>li>div')])
          return {
            questions: document.querySelectorAll('li.ex').length,
            options: document.querySelectorAll('.options>li').length,
            answers: document.querySelectorAll('.answer').length,
            single: document.querySelectorAll('[data-choice-mode="single"]').length,
            multiple: document.querySelectorAll('[data-choice-mode="multiple"]').length,
            inputs: document.querySelectorAll('input,textarea,math-field').length,
            errors: [...document.querySelectorAll('.err,.katex-error')].map(node => node.textContent),
            textMatches: nodes.length === expected.length &&
              nodes.every((node, index) => plain(node.innerHTML) === plain(expected[index])),
            overflow: document.documentElement.scrollWidth - innerWidth,
            clipped: [...document.querySelectorAll('h1,li.ex,.prompt,.answer,.options>li')]
              .filter(node => node.scrollWidth > node.clientWidth + 2).map(node => node.textContent),
            formulaVerticalOverflows: [...document.querySelectorAll('.nb')]
              .filter(node => node.scrollHeight > node.clientHeight + 1).map(node => node.textContent),
          }
        }, { surface, expected })
        assert.deepEqual(errors, [])
        assert.deepEqual(dom.errors, [])
        assert.deepEqual(dom.clipped, [])
        assert.deepEqual(dom.formulaVerticalOverflows, [])
        assert.equal(dom.textMatches, true)
        assert.equal(dom.questions, surface === 'choices' ? questions.length : count)
        assert.equal(dom.options, surface === 'choices' ? optionCount : 0)
        assert.equal(dom.answers, surface === 'answers' ? count : 0)
        assert.equal(dom.single, surface === 'choices'
          ? questions.filter(question => question.view.mode === 'single').length : 0)
        assert.equal(dom.multiple, surface === 'choices'
          ? questions.filter(question => question.view.mode === 'multiple').length : 0)
        assert.equal(dom.inputs, 0)
        assert.ok(dom.overflow <= 1)
        const full = path.join(own, 'screenshots', `${locale}-${surface}-${viewport.width}.png`)
        fs.mkdirSync(path.dirname(full), { recursive: true })
        await page.screenshot({ path: full, fullPage: true })
        report.screenshots.push({ locale, surface, viewport, ...bind(full) })
        for (let index = 0; index < (surface === 'choices' ? questions.length : count); index++) {
          const file = path.join(own, 'panels', `${surface}-${index + 1}-${locale}-${viewport.width}.png`)
          fs.mkdirSync(path.dirname(file), { recursive: true })
          await page.locator('li.ex').nth(index).screenshot({ path: file })
          report.panels.push({ locale, surface, viewport, question: index + 1, ...bind(file) })
        }
        report.checks.push({ locale, surface, viewport, dom })
      }
    }
  }
  for (const surface of config.surfaces)
    for (let number = 1; number <= Math.max(...report.panels.filter(item =>
      item.surface === surface).map(item => item.question)); number++) {
      const panels = [['zh', 1440], ['zh', 390], ['en', 1440], ['en', 390]].map(([locale, width]) =>
        report.panels.find(item => item.surface === surface && item.question === number &&
          item.locale === locale && item.viewport.width === width))
      const file = path.join(own, 'comparisons', `${surface}-${number}.png`)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-B', '-c',
        'import sys; from PIL import Image; p=[Image.open(f).convert("RGB") for f in sys.argv[2:]]; w=max(p[0].width,p[2].width); r=max(p[1].width,p[3].width); h=max(p[0].height,p[1].height); b=max(p[2].height,p[3].height); out=Image.new("RGB",(w+r,h+b),"white"); positions=[(0,0),(w,0),(0,h),(w,h)]; [out.paste(im,pos) for im,pos in zip(p,positions)]; assert all(sum(1 for px in im.getdata() if min(px)<200)>50 for im in p); out.save(sys.argv[1])',
        file, ...panels.map(item => item.path)], { cwd: repo, encoding: 'utf8', timeout: 120000 })
      assert.equal(result.status, 0, result.stderr)
      report.targets.push({ surface, question: number, image: bind(file), panels })
    }
  assert.equal(report.checks.length, config.surfaces.length * 4)
  for (const surface of config.surfaces) {
    const targets = report.targets.filter(item => item.surface === surface)
    for (let offset = 0; offset < targets.length; offset += 8)
      report.reviewBatches.push({ id: surface + '-' + (offset / 8 + 1),
        targets: targets.slice(offset, offset + 8) })
  }
  report.status = 'FIRST-EIGHT-ANSWER-CHOICE-SURFACE-DOM-PASS-VISUAL-PENDING'
  save(path.join(own, 'report.json'), report)
} catch (error) {
  report.status = 'FIRST-ANSWER-CHOICE-DISPLAY-FAIL'
  report.failure = String(error.stack || error)
  save(path.join(own, 'FIRST-failure.json'), report)
  throw error
} finally {
  await browser.close()
}
console.log(JSON.stringify({ surfaces: report.checks.length, reviewImages: report.targets.length }))
