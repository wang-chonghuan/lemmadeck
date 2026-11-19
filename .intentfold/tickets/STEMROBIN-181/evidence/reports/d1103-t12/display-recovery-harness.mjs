import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { spawnSync } from 'node:child_process'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'
import { choiceHtml } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/tools/choice_html.mjs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const { values } = parseArgs({ options: {
  answers: { type: 'string' }, choices: { type: 'string' }, attestation: { type: 'string' },
} })
for (const name of ['answers', 'choices', 'attestation']) assert.ok(values[name], name)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const card = 'phy10-c2-s3-t12'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const require = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const { inline } = require('./htmlfrag.js')
const nativeFile = path.join(tmp, 'd1064-t12-first-bilingual-native/report.json')
const native = read(nativeFile)
assert.equal(native.status, 'FIRST-BILINGUAL-NATIVE-TEXT-FIGURES-PASS')
const answerReport = read(values.answers)
const choices = read(values.choices)
const attestation = read(values.attestation)
assert.equal(answerReport.status, 'READONLY-BILINGUAL-ANSWERS-NATIVE-PASS')
assert.equal(choices.status, 'NATIVE-CHOICE-PROVENANCE-REBINDING-MECHANICAL-PASS')
assert.equal(attestation.status, 'PASS')
const priorFile = path.join(tmp, 'd1076-t12-first-display/FIRST-failure.json')
const prior = read(priorFile)
assert.equal(prior.status, 'FIRST-DISPLAY-FAIL')
const reusable = item => item.locale === 'zh' && ['text', 'exercises'].includes(item.surface)
const reusedChecks = prior.checks.filter(reusable)
assert.equal(reusedChecks.length, 4)
for (const binding of [...prior.html.filter(reusable), ...prior.screenshots.filter(reusable)])
  assert.equal(sha(binding.path), binding.sha256)
const report = {
  ticket: 'STEMROBIN-181', batch: 'D036', card, status: 'AFFECTED-DISPLAY-RECOVERY-RUNNING',
  native: bind(nativeFile), answers: bind(values.answers), choiceBinding: bind(values.choices),
  attestation: bind(values.attestation),
  browser: { headless: true, isolated: true, userProfiles: false, userWindows: false },
  limitation: 'Authorized headless offline display only, not formal product acceptance.',
  checks: reusedChecks, html: prior.html.filter(reusable),
  screenshots: prior.screenshots.filter(reusable), targets: prior.targets.filter(reusable),
  reviewBatches: [], firstFailure: bind(priorFile), reusedPassedSurfaces: 4,
  repairScope: 'Readonly answer display formula containers only; answer bytes unchanged.',
  parentNewImageOpens: 0, nativePassReplays: 0, semanticReviewsReplayed: 0,
  completeCard: false, databaseWrites: false,
}
const save = (name, data) => {
  const file = path.join(own, name)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
}
save('started.json', report)
const browser = await chromium.launch({ headless: true })
const recordImage = async (page, name, metadata, element = null) => {
  const screenshot = path.join(own, 'screenshots', name + '.png')
  fs.mkdirSync(path.dirname(screenshot), { recursive: true })
  if (element) await element.screenshot({ path: screenshot })
  else await page.screenshot({ path: screenshot, fullPage: true })
  const bytes = fs.readFileSync(screenshot)
  const width = bytes.readUInt32BE(16)
  const height = bytes.readUInt32BE(20)
  report.screenshots.push({ ...metadata, ...bind(screenshot), width, height })
  for (let top = 0, index = 0; top < height; top += 1100, index++) {
    const tile = path.join(own, 'tiles', `${name}-${index}.png`)
    fs.mkdirSync(path.dirname(tile), { recursive: true })
    const tileHeight = Math.min(1100, height - top)
    const crop = spawnSync(path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
      ['-c', 'import sys; from PIL import Image; im=Image.open(sys.argv[1]); im.crop((0,int(sys.argv[3]),im.width,int(sys.argv[3])+int(sys.argv[4]))).save(sys.argv[2])',
        screenshot, tile, String(top), String(tileHeight)], { cwd: repo, encoding: 'utf8' })
    assert.equal(crop.status, 0, crop.stderr)
    report.targets.push({ ...metadata, index, top, width, height: tileHeight,
      image: bind(tile), original: bind(screenshot) })
  }
}
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(String(error)))
  for (const locale of ['zh', 'en']) {
    const packet = native.outputs[locale]
    for (const binding of [...packet.nativeFiles, ...packet.html]) assert.equal(sha(binding.path), binding.sha256)
    const lesson = read(path.join(packet.target, 'lesson.json'))
    const exercises = read(path.join(packet.target, 'exercises.json')).exercises
    const answers = read(path.join(packet.target, 'answer-keys.json')).answers
    const choicePacket = choices.outputs[locale]
    for (const key of ['seed', 'draft', 'review']) assert.equal(sha(choicePacket[key].path), choicePacket[key].sha256)
    const draft = read(choicePacket.draft.path)
    assert.equal(read(choicePacket.review.path).outcome, 'pass')
    const questions = draft.questions
    assert.equal(exercises.length, 4)
    assert.equal(answers.length, 4)
    assert.equal(questions.length, 4)
    assert.deepEqual(lesson.prose, [])
    const title = locale === 'en' ? lesson.title : lesson.printed_title || lesson.title
    const surfaces = Object.fromEntries(packet.html.map(binding => [path.basename(binding.path, '.html'), binding.path]))
    await page.goto(pathToFileURL(surfaces.exercises).href)
    await page.evaluate(() => document.fonts.ready)
    const figureMarkup = await page.evaluate(() => Object.fromEntries(
      [...document.querySelectorAll('figure.fig')].map(node => [node.id, node.outerHTML])))
    const figuresFor = ids => ids.map(id => {
      assert.ok(figureMarkup[id], id)
      return figureMarkup[id]
    }).join('')
    for (const surface of ['answers', 'choices']) {
      await page.goto(pathToFileURL(surfaces.exercises).href)
      const content = surface === 'answers'
        ? answers.map((answer, index) => {
          assert.equal(answer.grading, 'ungraded')
          assert.deepEqual(answer.parts, [])
          const exercise = exercises.find(item => item.number === answer.exercise)
          assert.ok(exercise)
          return `<li class="ex"><div class="no">${index + 1}.</div><div class="body"><div class="prompt">${inline(exercise.text)}</div>${figuresFor(exercise.figure_refs)}<div class="answer">${inline(answer.displayAnswer)}</div></div></li>`
        }).join('')
        : questions.map((question, index) => `<li class="ex" data-choice-mode="${question.view.mode}"><div class="no">${index + 1}.</div><div class="body"><div class="prompt">${choiceHtml(question.view.stem)}</div>${figuresFor(question.view.figure_ids)}<ol class="options">${question.view.options.map((option, optionIndex) => `<li><span class="option-label">${String.fromCharCode(65 + optionIndex)}.</span><div>${choiceHtml(option.text)}${figuresFor(option.figure_ids)}</div></li>`).join('')}</ol></div></li>`).join('')
      const surfaceTitle = title + ' | ' + (surface === 'answers'
        ? locale === 'en' ? 'Answer Standards' : '\u6807\u51c6\u7b54\u6848'
        : locale === 'en' ? 'Choice Questions' : '\u9009\u62e9\u9898')
      await page.evaluate(({ content, surfaceTitle, locale }) => {
        document.documentElement.lang = locale
        document.title = surfaceTitle
        const sheet = document.querySelector('.sheet')
        const heading = sheet.querySelector('h1')
        heading.textContent = surfaceTitle
        for (const node of [...sheet.children]) if (node !== heading) node.remove()
        const list = document.createElement('ol')
        list.className = 'ex'
        list.innerHTML = content
        sheet.append(list)
        const style = document.createElement('style')
        style.textContent = '.answer{border-top:1px solid var(--rule);margin-top:.8em;padding-top:.8em}.answer .sr-nb:has(.katex-display){display:block;max-width:100%;overflow-x:auto;padding-block:.3em}.answer .katex-display{width:max-content;min-width:100%;text-align:left}.answer .katex-display>.katex{text-align:left}.options{list-style:none;margin:.7em 0 0;padding:0}.options>li{display:grid;grid-template-columns:1.8em minmax(0,1fr);gap:.4em;margin:.5em 0}.options>li>div{min-width:0;overflow-x:auto}.body .katex{font-size:1.1em}.prompt,.answer{min-width:0}.option-label{font-family:KaTeX_Main,serif}h1{letter-spacing:0}'
        document.head.append(style)
      }, { content, surfaceTitle, locale })
      const html = await page.content()
      if (surface === 'choices') {
        assert.ok(!/seed_sha256|source_solution|correct_index|data-correct|"rationales"|"key":/.test(html))
        assert.ok(!html.includes('displayAnswer'))
      }
      save(`${locale}/${surface}.html`, html)
      surfaces[surface] = path.join(own, locale, surface + '.html')
    }
    for (const [surface, file] of Object.entries(surfaces)) {
      if (locale === 'zh' && ['text', 'exercises'].includes(surface)) continue
      report.html.push({ locale, surface, ...bind(file) })
      const expectedContent = surface === 'text' ? []
        : surface === 'exercises' ? exercises.map(exercise => inline(exercise.text))
          : surface === 'answers' ? answers.map(answer => inline(answer.displayAnswer))
            : questions.flatMap(question => [choiceHtml(question.view.stem), ...question.view.options.map(option => choiceHtml(option.text))])
      for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(viewport)
        await page.goto(pathToFileURL(file).href)
        await page.evaluate(async () => {
          await document.fonts.ready
          await document.fonts.load('16px KaTeX_Main', 'Ax0123')
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        })
        const dom = await page.evaluate(({ surface, expectedContent }) => {
          const plain = markup => {
            const node = document.createElement('div')
            node.innerHTML = markup
            node.querySelectorAll('.katex-mathml,.fig').forEach(child => child.remove())
            return node.textContent.replace(/\s+/g, ' ').trim()
          }
          const nodes = surface === 'text' ? [...document.querySelectorAll('.para')]
            : surface === 'answers' ? [...document.querySelectorAll('.answer')]
              : surface === 'choices' ? [...document.querySelectorAll('li.ex')].flatMap(node => [node.querySelector('.prompt'), ...node.querySelectorAll('.options>li>div')])
                : [...document.querySelectorAll('li.ex .body')]
          return {
            lang: document.documentElement.lang, h1: document.querySelector('h1').textContent,
            paragraphs: document.querySelectorAll('.para').length,
            questions: document.querySelectorAll('li.ex').length,
            options: document.querySelectorAll('.options>li').length,
            answers: document.querySelectorAll('.answer').length,
            multiple: document.querySelectorAll('[data-choice-mode="multiple"]').length,
            inputs: document.querySelectorAll('input,textarea,math-field').length,
            figures: [...document.querySelectorAll('.fig')].map(node => {
              const svg = node.querySelector('svg')
              const media = node.querySelector('.figure-media')
              const width = svg.getBoundingClientRect().width
              const scale = width / svg.viewBox.baseVal.width
              return { id: node.id, layout: node.dataset.figureLayout, mediaWidth: media.getBoundingClientRect().width,
                labels: [...svg.querySelectorAll('[data-label-id]')].map(label => parseFloat(label.getAttribute('font-size')) * scale),
                svgPaths: svg.querySelectorAll('path,line,polygon,circle,ellipse').length,
                scrollMax: node.scrollWidth - node.clientWidth }
            }),
            textMatches: nodes.length === expectedContent.length && nodes.every((node, index) => plain(node.innerHTML) === plain(expectedContent[index])),
            fonts: [...document.querySelectorAll('li.ex .body')].map(node => parseFloat(getComputedStyle(node).fontSize)),
            overflow: document.documentElement.scrollWidth - innerWidth,
            errors: [...document.querySelectorAll('.err,.katex-error')].map(node => node.textContent),
            clipped: [...document.querySelectorAll('h1,.para,.crumb,.prompt,.answer')].filter(node => node.scrollWidth > node.clientWidth + 2).map(node => node.textContent),
            formulaVerticalOverflows: [...document.querySelectorAll('.answer .sr-nb:has(.katex-display)')].filter(node => {
              const box = node.getBoundingClientRect()
              const formula = node.querySelector('.katex-html').getBoundingClientRect()
              return formula.top < box.top - 1 || formula.bottom > box.bottom + 1
            }).map(node => node.querySelector('annotation').textContent),
            formulaScrolls: [...document.querySelectorAll('.answer .sr-nb:has(.katex-display)')].map((node, index) => ({
              index, max: node.scrollWidth - node.clientWidth,
              clientWidth: node.clientWidth, overflow: getComputedStyle(node).overflowX,
            })),
          }
        }, { surface, expectedContent })
        assert.deepEqual(errors, [])
        assert.deepEqual(dom.errors, [])
        assert.deepEqual(dom.clipped, [])
        assert.deepEqual(dom.formulaVerticalOverflows, [])
        assert.ok(dom.overflow <= 1)
        assert.ok(dom.fonts.every(size => size >= 16))
        assert.equal(dom.textMatches, true)
        assert.equal(dom.paragraphs, 0)
        assert.equal(dom.questions, surface === 'text' ? 0 : 4)
        assert.equal(dom.answers, surface === 'answers' ? 4 : 0)
        assert.equal(dom.options, surface === 'choices' ? questions.reduce((n, question) => n + question.view.options.length, 0) : 0)
        assert.equal(dom.inputs, 0)
        assert.equal(dom.figures.length, surface === 'text' ? 0 : 2)
        for (const figure of dom.figures) {
          assert.ok(figure.svgPaths > 0)
          assert.ok(figure.labels.every(size => size >= 16), figure.id)
          if (figure.layout === 'scroll') assert.ok(Math.abs(figure.mediaWidth - 640) <= 1)
        }
        report.checks.push({ locale, surface, viewport, html: bind(file), dom })
        const name = `${locale}-${surface}-${viewport.width}`
        await recordImage(page, name, { locale, surface, viewport })
        if (viewport.width === 390 && surface !== 'text') {
          const formulas = page.locator('.answer .sr-nb:has(.katex-display)')
          for (const formula of dom.formulaScrolls.filter(item => item.max > 1)) {
            const reached = await formulas.nth(formula.index).evaluate(node => {
              node.scrollLeft = node.scrollWidth
              return { actual: node.scrollLeft, max: node.scrollWidth - node.clientWidth }
            })
            assert.equal(formula.overflow, 'auto')
            assert.ok(Math.abs(reached.actual - reached.max) <= 1)
            formula.scrollEnd = reached
          }
          const longest = dom.formulaScrolls.reduce((result, item) => item.max > (result?.max || 1) ? item : result, null)
          if (longest) await recordImage(page, `${name}-longest-formula-scroll-end`, {
            locale, surface, viewport, formulaIndex: longest.index,
            formulaScrollEnd: longest.scrollEnd,
          }, formulas.nth(longest.index))
          for (const figure of dom.figures.filter(item => item.scrollMax > 1)) {
            const element = page.locator(`#${figure.id}`)
            const reached = await element.evaluate(node => {
              node.scrollLeft = node.scrollWidth
              return { actual: node.scrollLeft, max: node.scrollWidth - node.clientWidth }
            })
            assert.ok(Math.abs(reached.actual - reached.max) <= 1)
            await recordImage(page, `${name}-${figure.id}-scroll-end`, {
              locale, surface, viewport, figure: figure.id, scrollEnd: reached,
            }, element)
          }
        }
        if (['text', 'exercises'].includes(surface)) {
          await page.locator('.jump').click()
          assert.equal(path.basename(new URL(page.url()).pathname), surface === 'text' ? 'exercises.html' : 'text.html')
        }
      }
    }
  }
  assert.equal(report.checks.length, 16)
  for (let index = 0; index < report.targets.length; index += 8)
    report.reviewBatches.push({ id: `batch-${report.reviewBatches.length + 1}`, targets: report.targets.slice(index, index + 8) })
  report.status = 'FIRST-SIXTEEN-SURFACE-DOM-CAPTURE-PASS-VISUAL-PENDING'
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
