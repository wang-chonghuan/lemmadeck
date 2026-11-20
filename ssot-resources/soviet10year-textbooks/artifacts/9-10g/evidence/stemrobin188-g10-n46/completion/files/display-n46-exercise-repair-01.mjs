import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const { chromium } = createRequire(path.join(repo, 'app/package.json'))('playwright')
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const lesson = 'geo910-c2-s1-n46'
const target = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g',
  'editions/modern-us-neutral/lessons', lesson)
const render = path.join(tmp, 'g10-n46/work/render/9-10g/modern-us-neutral', lesson)
const output = path.join(tmp, 'n46-exercise-display-repair-01')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
assert.ok(!fs.existsSync(output))
assert.equal(json(path.join(tmp, 'n46-answer-symbol-repair-01/render-01/command.json')).exitCode, 0)
fs.mkdirSync(output)
const sourceBindings = ['lesson.json', 'exercises.json', 'figures.json'].map(name => bind(path.join(target, name)))
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport })
    await context.route(/^https?:/, route => route.abort())
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(pathToFileURL(path.join(render, 'exercises.html')).href)
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('li.ex').count(), 6)
    assert.equal(await page.locator('.err, .katex-error').count(), 0)
    const row = page.locator('#ex-36')
    const marker = (await row.locator('.no').textContent()).trim()
    const body = (await row.locator('.body').textContent()).trim()
    assert.equal(marker, '36.*')
    assert.ok(body.startsWith('利用上题的结果'))
    assert.ok(!body.startsWith('.'))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    assert.ok((await page.locator('#ex-39 .body').textContent()).includes('表面积'))
    const screenshot = path.join(output, `exercises-${viewport.width}.png`)
    await page.screenshot({ path: screenshot, fullPage: true })
    results.push({
      kind: 'exercises', viewport, screenshot: bind(screenshot),
      status: 'machine-pass-visual-pending', affectedNumber: '36', marker,
      bodyStart: body.slice(0, 24), allSixExercisesReachable: true,
    })
    assert.deepEqual(errors, [])
    await context.close()
  }
  for (const binding of sourceBindings) assert.equal(hash(binding.path), binding.sha256)
} finally {
  await browser.close()
  fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify({
    offline: true, headless: true, published: false, textSurfaceReused: true,
    sourceBindings, results, visualApproval: false,
  }, null, 2) + '\n', { flag: 'wx' })
}
console.log(JSON.stringify({ output, observations: results.length }))
