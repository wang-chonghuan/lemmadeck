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
const scratch = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp')
const lesson = 'alg6-c4-s1-n30'
const output = path.join(scratch, 'offline-evidence/6a')
const filename = `${lesson}-choices-390-stem-top.png`
assert(!fs.existsSync(path.join(output, filename)))
const browser = await chromium.launch({ headless: true })
let measurement
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(pathToFileURL(path.join(repo,
    '.tmp/ld-s10y-lesson/render/6a/modern-us-neutral', lesson, 'choices.html')).href)
  await page.evaluate(() => document.fonts.ready)
  const stem = page.locator('.choice-stem').first()
  await stem.scrollIntoViewIfNeeded()
  measurement = await stem.evaluate(node => {
    const bounds = node.getBoundingClientRect()
    return { text: node.innerText, top: bounds.top, bottom: bounds.bottom,
      viewportHeight: innerHeight,
      documentOverflow: document.documentElement.scrollWidth > innerWidth + 1 }
  })
  assert(measurement.text.trim().length > 0)
  assert(measurement.top >= 0 && measurement.bottom <= measurement.viewportHeight)
  assert.equal(measurement.documentOverflow, false)
  await page.screenshot({ path: path.join(output, filename) })
} finally {
  await browser.close()
}
fs.writeFileSync(path.join(output, 'batch15-stem-top-measurement.json'),
  JSON.stringify({ lesson, filename, measurement, additional_unique_combinations: 0,
    browser_channel: 'isolated explicit headless; closed' }, null, 2) + '\n',
  { flag: 'wx' })
console.log(JSON.stringify({ lesson, filename, measurement }))
