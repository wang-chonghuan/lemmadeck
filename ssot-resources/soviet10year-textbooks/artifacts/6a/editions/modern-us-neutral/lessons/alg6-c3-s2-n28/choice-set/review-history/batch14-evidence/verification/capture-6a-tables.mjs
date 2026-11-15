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
const terminalScreenshot = `${lesson}-choices-390-terminal-option.png`
assert(fs.existsSync(path.join(output, terminalScreenshot)))
const observations = [{ lesson, target: 'final C option, all five clauses',
  screenshot: terminalScreenshot, reused: true,
  evidence: 'Earlier terminal capture succeeded and was actually opened before the subsequent mistaken four-column table assertion. Do not recapture or recheck this same terminal.' }]
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto(pathToFileURL(path.join(repo, '.tmp/ld-s10y-lesson/render/6a',
    'modern-us-neutral', lesson, 'choices.html')).href)
  await page.evaluate(() => document.fonts.ready)
  const bodies = page.locator('.choice').nth(11).locator('.choice-option-body')
  assert.equal(await bodies.count(), 3)
  for (let index = 0; index < 3; index++) {
    const body = bodies.nth(index)
    const table = body.locator('table')
    assert.equal(await table.count(), 1)
    assert.equal(await table.locator('tr').count(), 8)
    const finalRow = table.locator('tr').last()
    assert.equal(await finalRow.locator('td').count(), 3)
    assert.equal(await table.locator('p').count(), 0)
    await body.scrollIntoViewIfNeeded()
    const screenshot = `${lesson}-choices-390-absolute-table-${index + 1}-complete.png`
    assert(!fs.existsSync(path.join(output, screenshot)))
    await body.screenshot({ path: path.join(output, screenshot) })
    observations.push({ lesson, target: `complete candidate ${index + 1} table and separate prose`,
      rows: 8, columns: 3, final_cells: await finalRow.locator('td').allTextContents(), screenshot })
  }
  await context.close()
} finally {
  await browser.close()
}
fs.writeFileSync(report, JSON.stringify({ status: 'pass',
  browser_channel: 'isolated explicit headless; closed',
  additional_unique_surface_combinations: 0,
  earlier_failure: 'The source blank table has four columns; each completed candidate combines(a,b) in one column and has three. Only the mistaken new harness assertion was repaired; all source/draft/render bytes unchanged.',
  observations }, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ report, new_table_observations: 3,
  reused_terminal_observations: 1, additional_unique_surface_combinations: 0 }))
