import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const nativeFile = path.join(tmp, 'd1277-n101-t11-first-native/t11/report.json')
const firstCapture = path.join(tmp, 'd1278-n101-t11-first-basic-display/t11/report.json')
const firstReview = path.join(tmp, 'd1288-t11-first-basic-display-review/report.json')
assert.equal(read(firstReview).status, 'HOLD')
const native = read(nativeFile)
const packet = native.outputs.en
const inputs = [bind(nativeFile), bind(firstCapture), bind(firstReview),
  ...packet.nativeFiles, ...packet.html]
for (const file of ['answer-keys.json', 'answer-keys.audit.json'])
  inputs.push(bind(path.join(packet.target, file)))
const command = ['node', '.claude/skills/ld-s10y-lesson/tools/render_lesson.js', packet.raw,
  '--edition', 'modern-us-neutral', '--lesson', native.card, '--out', path.join(own, 'render')]
const result = spawnSync(command[0], command.slice(1), {
  cwd: repo, encoding: 'utf8', timeout: 120000,
})
const call = save(path.join(own, 'render-AFFECTED-FIRST.json'), {
  command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
})
assert.equal(result.status, 0, result.stdout + result.stderr)
const oldText = packet.html.find(item => path.basename(item.path) === 'text.html')
const oldExercises = packet.html.find(item => path.basename(item.path) === 'exercises.html')
const text = path.join(own, 'render', native.card, 'text.html')
const exercises = path.join(own, 'render', native.card, 'exercises.html')
assert.equal(sha(text), oldText.sha256)
const oldMarkup = fs.readFileSync(oldExercises.path, 'utf8')
const newMarkup = fs.readFileSync(exercises, 'utf8')
const group = '<div class="exgroup">练习 11</div>'
assert.equal(oldMarkup.split(group).length, 2)
assert.equal(newMarkup, oldMarkup.replace(group, '<div class="exgroup">Exercise 11</div>'))
const checks = []
const screenshots = []
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(String(error)))
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto(pathToFileURL(exercises).href)
    await page.evaluate(async () => {
      await document.fonts.ready
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    })
    const dom = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      group: document.querySelector('.exgroup').textContent,
      questions: document.querySelectorAll('li.ex').length,
      errors: [...document.querySelectorAll('.err,.katex-error')].map(node => node.textContent),
      overflow: document.documentElement.scrollWidth - innerWidth,
      clipped: [...document.querySelectorAll('h1,.exgroup,li.ex,.jump')]
        .filter(node => node.scrollWidth > node.clientWidth + 2).map(node => node.textContent),
      inputs: document.querySelectorAll('input,textarea,math-field').length,
    }))
    assert.equal(dom.lang, 'en')
    assert.equal(dom.group, 'Exercise 11')
    assert.equal(dom.questions, 3)
    assert.equal(dom.inputs, 0)
    assert.deepEqual(dom.errors, [])
    assert.deepEqual(dom.clipped, [])
    assert.deepEqual(errors, [])
    assert.ok(dom.overflow <= 1)
    const file = path.join(own, 'screenshots', 'en-exercises-' + viewport.width + '.png')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    await page.screenshot({ path: file, fullPage: true })
    screenshots.push({ locale: 'en', surface: 'exercises', viewport, ...bind(file) })
    checks.push({ locale: 'en', surface: 'exercises', viewport, dom })
  }
} finally {
  await browser.close()
}
for (const item of inputs) assert.equal(sha(item.path), item.sha256)
save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', card: native.card,
  status: 'AFFECTED-TWO-EN-EXERCISE-DOM-PASS-VISUAL-PENDING',
  firstNative: bind(nativeFile), firstCapture: bind(firstCapture), firstReview: bind(firstReview),
  call, html: bind(exercises), unchangedEnglishText: oldText,
  checks, screenshots, inputs,
  nativeSourceAndAnswerBytesUnchanged: true, onlyVisibleGroupLabelChanged: true,
  unaffectedSixSurfaceEvidenceReused: true, scientificReviewReplays: 0,
  nativePassReplays: 0, authorContentRevisions: 0,
  toolRepair: 'Existing English exercise-group localization now handles a numbered exercise title.',
  parentImageOpens: 0, paidCalls: 0, databaseWrites: false, completeCard: false,
})
console.log(JSON.stringify({ status: 'AFFECTED-TWO-EN-EXERCISE-DOM-PASS-VISUAL-PENDING' }))
