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
const output = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/offline-evidence/5m')
const report = path.join(output, 'batch15-exercise-end-observations.json')
assert(!fs.existsSync(report))
const observations = []
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  for (const lesson of ['math5-c2-s1-n40', 'math5-c2-s1-n41']) {
    await page.goto(pathToFileURL(path.join(repo, '.tmp/ld-s10y-lesson/render/5m',
      'modern-us-neutral', lesson, 'exercises.html')).href)
    await page.evaluate(() => document.fonts.ready)
    const candidates = page.locator('li.ex').last().locator('.katex-html')
    const math = candidates.nth(lesson.endsWith('n40') ? 1 : 0)
    const handle = await math.evaluateHandle(node => {
      for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        if (parent.scrollWidth > parent.clientWidth + 1
          && ['auto', 'scroll'].includes(getComputedStyle(parent).overflowX)) return parent
      }
      return null
    })
    const region = handle.asElement()
    if (!region) {
      console.log(JSON.stringify(await math.evaluate(node => {
        const ancestors = []
        for (let parent = node; parent; parent = parent.parentElement) {
          ancestors.push({ class: parent.className, width: parent.clientWidth,
            scroll_width: parent.scrollWidth, overflow: getComputedStyle(parent).overflowX })
        }
        return { text: node.textContent, ancestors }
      })))
    }
    assert(region, 'The observed long source formula must have a scroll region')
    await region.scrollIntoViewIfNeeded()
    await region.evaluate(node => { node.scrollLeft = node.scrollWidth })
    const measurement = await math.evaluate(node => {
      let parent = node.parentElement
      while (!(parent.scrollWidth > parent.clientWidth + 1
        && ['auto', 'scroll'].includes(getComputedStyle(parent).overflowX))) parent = parent.parentElement
      return { text: node.textContent, left: parent.scrollLeft,
        max: parent.scrollWidth - parent.clientWidth,
        right: node.getBoundingClientRect().right,
        viewport_right: Math.min(innerWidth, parent.getBoundingClientRect().right) }
    })
    assert(Math.abs(measurement.left - measurement.max) <= 1)
    assert(measurement.right <= measurement.viewport_right + 1)
    const screenshot = `${lesson}-exercises-390-final-formula-end.png`
    await region.screenshot({ path: path.join(output, screenshot) })
    observations.push({ lesson, screenshot, ...measurement })
    await handle.dispose()
  }
  await context.close()
} finally {
  await browser.close()
}
fs.writeFileSync(report, JSON.stringify({ status: 'pass', observations,
  additional_unique_surface_combinations: 0, browser_closed: true }, null, 2) + '\n',
{ flag: 'wx' })
console.log(JSON.stringify({ report, additional_unique_surface_combinations: 0 }))
