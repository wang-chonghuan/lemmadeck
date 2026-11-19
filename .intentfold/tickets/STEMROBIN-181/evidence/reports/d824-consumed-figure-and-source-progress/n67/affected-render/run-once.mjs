import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(new URL(import.meta.url).pathname)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const nativeFile = path.join(ticket, 'tmp/d801-n67-bilingual-native/report.json')
const firstDisplayFile = path.join(ticket, 'tmp/d811-n67-first-independent-display-review/report.json')
const card = 'phy10-c2-s2-n67'
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
function save(f, value) {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const native = read(nativeFile)
assert.equal(native.status, 'BILINGUAL-NATIVE-FINALIZE-RENDER-PASS-FIRST-DISPLAY-PENDING')
assert.equal(read(firstDisplayFile).status, 'DISPLAY-FAIL')
const report = {
  ticket: 'STEMROBIN-181', card, status: 'AFFECTED-RENDER-STARTED',
  firstNative: bind(nativeFile), firstDisplayFailure: bind(firstDisplayFile),
  renderer: bind(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')),
  diagnosis: bind(path.join(ticket, 'tmp/d817-n67-formula-scrollbar/diagnosis.json')),
  finalizationReplayed: false, scienceTextAndFigureReviewsReplayed: false,
  contentRepairs: 0, renderingRepairs: 1, paidCalls: 0, imagesOpened: 0,
  outputs: [], checks: [], screenshots: [],
}
save(path.join(out, 'started.json'), report)
for (const packet of native.outputs) {
  for (const b of packet.nativeFiles) assert.equal(sha(path.resolve(repo, b.path)), b.sha256)
  const work = path.join(out, packet.locale, 'work')
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
    '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', packet.root, '--work', work]
  const r = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  save(path.join(out, 'calls', packet.locale + '-render.json'), {
    command, cwd: repo, exitCode: r.status, stdout: r.stdout, stderr: r.stderr,
  })
  assert.equal(r.status, 0, r.stderr || r.stdout)
  for (const b of packet.nativeFiles) assert.equal(sha(path.resolve(repo, b.path)), b.sha256)
  report.outputs.push({
    ...packet, work,
    html: ['text.html', 'exercises.html'].map(n => bind(path.join(work, 'render/10p/modern-us-neutral', card, n))),
  })
}
const browser = await chromium.launch({ channel: 'chrome', headless: false })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(String(e)))
  for (const packet of report.outputs) {
    for (const width of [390, 1440]) {
      const viewport = { width, height: width === 390 ? 844 : 960 }
      await page.setViewportSize(viewport)
      const html = packet.html.find(b => b.path.endsWith('/text.html'))
      await page.goto(pathToFileURL(path.resolve(repo, html.path)).href)
      await page.evaluate(() => document.fonts.ready)
      await page.locator('#fig-134').scrollIntoViewIfNeeded()
      const dom = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        katexErrors: [...document.querySelectorAll('.katex-error,.err')].map(n => n.textContent),
        wrappers: [...document.querySelectorAll('.nb')].map(n => {
          const r = n.getBoundingClientRect()
          return {
            tex: n.querySelector('annotation')?.textContent,
            x: getComputedStyle(n).overflowX, y: getComputedStyle(n).overflowY,
            clientHeight: n.clientHeight, scrollHeight: n.scrollHeight,
            clientWidth: n.clientWidth, scrollWidth: n.scrollWidth,
            contentFits: [...n.querySelectorAll('.katex-html .base,.katex-html .vlist-t')]
              .every(b => { const c = b.getBoundingClientRect(); return c.top >= r.top - 0.5 && c.bottom <= r.bottom + 0.5 }),
          }
        }),
        figure: (() => {
          const n = document.querySelector('#fig-134 svg')
          return {
            width: n.getBoundingClientRect().width,
            minTextPx: Math.min(...[...n.querySelectorAll('text')].filter(t => t.textContent.trim()).map(t => {
              const m = t.getScreenCTM()
              return parseFloat(getComputedStyle(t).fontSize) * Math.hypot(m.a, m.b)
            })),
          }
        })(),
      }))
      assert.deepEqual(errors, [])
      assert.deepEqual(dom.katexErrors, [])
      assert.ok(dom.overflow <= 1)
      assert.ok(dom.wrappers.every(w => w.y === 'hidden' && w.contentFits))
      assert.ok(dom.wrappers.every(w => w.scrollHeight <= w.clientHeight + 1))
      assert.ok(dom.figure.minTextPx >= 15.99)
      const file = path.join(out, 'screenshots', `${packet.locale}-text-${width}-figure.png`)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      await page.screenshot({ path: file })
      report.checks.push({ locale: packet.locale, viewport, html, dom })
      report.screenshots.push({ locale: packet.locale, viewport, ...bind(file) })
    }
  }
  // Narrow containers must still expose the full horizontal formula.
  await page.setContent('<style>.nb{display:inline-block;max-width:100%;overflow-x:auto;overflow-y:hidden;padding-block:.15em;vertical-align:middle;white-space:nowrap}.line{width:120px}.wide{display:inline-block;width:400px;height:32px}</style><div class="line"><span class="nb"><span class="wide">Wide formula</span></span></div>')
  const scroll = await page.locator('.nb').evaluate(n => {
    n.scrollLeft = n.scrollWidth
    return { clientWidth: n.clientWidth, scrollWidth: n.scrollWidth, end: n.scrollLeft, y: getComputedStyle(n).overflowY }
  })
  assert.ok(scroll.scrollWidth > scroll.clientWidth)
  assert.equal(scroll.end, scroll.scrollWidth - scroll.clientWidth)
  assert.equal(scroll.y, 'hidden')
  report.horizontalScrollNegativeCase = scroll
  report.status = 'AFFECTED-RENDER-FOUR-SURFACE-DOM-CAPTURE-PASS-VISUAL-PENDING'
  save(path.join(out, 'report.json'), report)
} catch (e) {
  save(path.join(out, 'FIRST-failure.json'), { status: 'FAIL', error: String(e.stack || e), report })
  throw e
} finally {
  await browser.close()
}
console.log(JSON.stringify({ status: report.status, report: bind(path.join(out, 'report.json')), screenshots: report.screenshots.length }))
