import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const repo = process.cwd()
const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${tmp}/n19-caption-layout-repair`
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const id = 'geo910-c1-s2-n19'
const canonical = `.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/${id}`
const repaired = `${root}/render/${id}`
const renderer = '.claude/skills/ld-s10y-lesson/tools/render_lesson.js'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: file, sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file))
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
assert(!fs.existsSync(root), 'Only the first caption-layout repair')
assert.equal(hash(`${tmp}/n19-first-offline-display/report.md`),
  '8f4a3e21fd363e75d114ce402ba38cda229808ae79aa98fbcb17d602d69c2a9d')
assert.equal(hash(`${canonical}/text.html`), '1c5634e626d1965aafedd1f9f42b9e8505f0020997f58a7d5c1f5d5d0f9553c5')
const protectedFiles = ['lesson', 'exercises', 'figures', 'answer-keys'].map(name =>
  `${source}/editions/modern-us-neutral/lessons/${id}/${name}.json`)
protectedFiles.push(`${source}/book.json`)
for (const figure of ['75', '76']) {
  for (const extension of ['spec.json', 'svg', 'render.json', 'review.json']) {
    protectedFiles.push(`${source}/editions/modern-us-neutral/figures/fig-${figure}.${extension}`)
  }
}
const protectedRecords = protectedFiles.map(record)
fs.mkdirSync(root)
for (const name of ['text.html', 'exercises.html']) copy(`${canonical}/${name}`, `${root}/before/${name}`)
copy(renderer, `${root}/render_lesson.caption-repair.js`)
copy('.claude/skills/ld-s10y-lesson/tools/render_lesson.test.cjs', `${root}/render_lesson.caption-contracts.cjs`)
fs.writeFileSync(`${root}/before.json`, JSON.stringify({
  protectedRecords, finding: record(`${tmp}/n19-first-offline-display/report.md`),
}, null, 2) + '\n', { flag: 'wx' })
const run = (name, argv) => {
  const startedAtUtc = new Date().toISOString()
  const child = spawnSync(process.execPath, argv, {
    encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
  })
  for (const [suffix, data] of [['stdout.raw', child.stdout || ''], ['stderr.raw', child.stderr || '']]) {
    fs.writeFileSync(`${root}/${name}.${suffix}`, data, { flag: 'wx' })
  }
  const command = {
    executable: process.execPath, argv, cwd: repo, startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exit: child.status,
    signal: child.signal, error: child.error?.message || null, invocationCount: 1,
    renderer: record(renderer),
  }
  fs.writeFileSync(`${root}/${name}.command.json`, JSON.stringify(command, null, 2) + '\n', { flag: 'wx' })
  console.log(JSON.stringify(command))
  assert.equal(child.status, 0, `Retain first ${name} failure without rerunning completed phases`)
}
run('caption-contracts', ['--test', '--test-name-pattern=offline captions',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.test.cjs'])
run('render', [renderer, source, '--edition', 'modern-us-neutral',
  '--lesson', id, '--out', `${root}/render`])
assert.equal(hash(`${repaired}/exercises.html`), hash(`${root}/before/exercises.html`))
const withoutCaptions = html => html.replace(
  /<(?:div|figcaption) class="figcap">[\s\S]*?<\/(?:div|figcaption)>/g, '')
assert.equal(withoutCaptions(fs.readFileSync(`${repaired}/text.html`, 'utf8')),
  withoutCaptions(fs.readFileSync(`${root}/before/text.html`, 'utf8')),
  'Every noncaption HTML byte must remain unchanged')
delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const { chromium } = createRequire(path.join(repo, 'app/package.json'))('playwright')
const browser = await chromium.launch({ headless: true })
const observations = []
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport })
    await context.route(/^https?:/, route => route.abort())
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(pathToFileURL(path.join(repo, repaired, 'text.html')).href)
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('figure > figcaption.figcap').count(), 2)
    assert.equal(await page.locator('div.figcap,.err,.katex-error').count(), 0)
    const geometry = await page.evaluate(() => ({
      width: innerWidth, docWidth: document.documentElement.scrollWidth,
      figures: [...document.querySelectorAll('figure.fig')].map(figure => {
        const media = figure.querySelector('.figure-media').getBoundingClientRect()
        const caption = figure.querySelector('figcaption').getBoundingClientRect()
        const next = figure.nextElementSibling?.getBoundingClientRect()
        return {
          id: figure.id, label: figure.querySelector('figcaption').textContent.trim(),
          mediaBottom: media.bottom, captionTop: caption.top, captionBottom: caption.bottom,
          nextTop: next?.top ?? null,
        }
      }),
    }))
    assert(geometry.docWidth <= geometry.width + 1)
    assert.deepEqual(geometry.figures.map(figure => [figure.id, figure.label]),
      [['fig-75', '图 75'], ['fig-76', '图 76']])
    for (const figure of geometry.figures) {
      assert(figure.captionTop >= figure.mediaBottom - 1)
      assert(figure.captionTop - figure.mediaBottom < 24)
      assert(figure.nextTop === null || figure.captionBottom <= figure.nextTop + 1)
    }
    assert.deepEqual(errors, [])
    const screenshot = `${root}/text-${viewport.width}.png`
    await page.screenshot({ path: screenshot, fullPage: true })
    observations.push({ viewport, geometry, screenshot: record(screenshot) })
    await context.close()
  }
} finally {
  await browser.close()
}
for (const item of protectedRecords) assert.equal(hash(item.path), item.sha256)
fs.copyFileSync(`${repaired}/text.html`, `${canonical}/text.html`)
assert.equal(hash(`${canonical}/exercises.html`), hash(`${root}/before/exercises.html`))
const completion = {
  status: 'CAPTION_LAYOUT_MECHANICAL_PASS_VISUAL_PENDING',
  protectedRecords, observations, repairedText: record(`${canonical}/text.html`),
  exercisesUnchanged: record(`${canonical}/exercises.html`),
  unchangedHTMLOutsideCaptions: true,
  limits: 'Only caption binding changed; no modern/source/figure/answer math, finalize, old successful offline check, DB or publisher repeated. First display failure retained; new screenshot observation still required.',
}
fs.writeFileSync(`${root}/completion.json`, JSON.stringify(completion, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ status: completion.status, completion: record(`${root}/completion.json`) }))
