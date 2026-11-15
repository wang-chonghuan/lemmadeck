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
const lesson = 'math5-c2-s1-n39'
const output = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/offline-evidence/5m')
const report = path.join(output, 'batch14-terminal-observations.json')
assert(!fs.existsSync(report))
const browser = await chromium.launch({ headless: true })
const observations = []
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto(pathToFileURL(path.join(repo, '.tmp/ld-s10y-lesson/render/5m',
    'modern-us-neutral', lesson, 'choices.html')).href)
  await page.evaluate(() => document.fonts.ready)
  const terminal = page.locator('.choice').last().locator('.choice-options>li').last()
  await terminal.scrollIntoViewIfNeeded()
  const bounds = await terminal.boundingBox()
  assert(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 844)
  const text = await terminal.innerText()
  assert(text.includes('7.3') && text.includes('3.4'))
  const screenshot = `${lesson}-choices-390-terminal-option.png`
  assert(!fs.existsSync(path.join(output, screenshot)))
  await page.screenshot({ path: path.join(output, screenshot) })
  observations.push({ lesson, target: 'last d option, both whole equations and roots',
    bounds, text, screenshot })
  await context.close()
} finally {
  await browser.close()
}
fs.writeFileSync(report, JSON.stringify({ status: 'pass',
  browser_channel: 'isolated explicit headless; closed',
  additional_unique_surface_combinations: 0, observations }, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ report, additional_unique_surface_combinations: 0,
  observations: observations.length }))
