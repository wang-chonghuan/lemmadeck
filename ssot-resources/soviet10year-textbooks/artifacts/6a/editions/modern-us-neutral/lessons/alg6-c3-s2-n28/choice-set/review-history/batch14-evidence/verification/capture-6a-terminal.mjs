import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const require = createRequire(path.join(process.cwd(), 'package.json'))
const { chromium } = require('@playwright/test')
const repo = path.resolve(process.cwd(), '..')
const output = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/offline-evidence/6a')
const lesson = 'alg6-c3-s2-n28'
const report = path.join(output, 'batch14-terminal-observations.json')
assert(!fs.existsSync(report))
const browser = await chromium.launch({ headless: true })
const observations = []
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto(pathToFileURL(path.join(repo, '.tmp/ld-s10y-lesson/render/6a',
    'modern-us-neutral', lesson, 'choices.html')).href)
  await page.evaluate(() => document.fonts.ready)
  const terminal = page.locator('.choice').last().locator('.choice-options>li').last()
  await terminal.scrollIntoViewIfNeeded()
  const bounds = await terminal.boundingBox()
  assert(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 844)
  assert((await terminal.innerText()).includes('City A'))
  const terminalScreenshot = `${lesson}-choices-390-terminal-option.png`
  await page.screenshot({ path: path.join(output, terminalScreenshot) })
  observations.push({ lesson, target: 'final C option, all five clauses', bounds,
    screenshot: terminalScreenshot })
  const tableQuestion = page.locator('.choice').nth(11)
  const bodies = tableQuestion.locator('.choice-option-body')
  assert.equal(await bodies.count(), 3)
  for (let index = 0; index < 3; index++) {
    const body = bodies.nth(index)
    const table = body.locator('table')
    assert.equal(await table.count(), 1)
    assert.equal(await table.locator('tr').count(), 8)
    const finalRow = table.locator('tr').last()
    assert.equal(await finalRow.locator('td').count(), 4)
    assert.equal(await table.locator('p').count(), 0)
    await body.scrollIntoViewIfNeeded()
    const screenshot = `${lesson}-choices-390-absolute-table-${index + 1}-complete.png`
    await body.screenshot({ path: path.join(output, screenshot) })
    observations.push({ lesson, target: `complete candidate ${index + 1} table and separate prose`,
      rows: 8, final_cells: await finalRow.locator('td').allTextContents(), screenshot })
  }
  await context.close()
} finally {
  await browser.close()
}
fs.writeFileSync(report, JSON.stringify({ status: 'pass',
  browser_channel: 'isolated explicit headless; closed',
  additional_unique_surface_combinations: 0, observations }, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ report, additional_unique_surface_combinations: 0,
  observations: observations.length }))
