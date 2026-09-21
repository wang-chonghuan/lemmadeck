import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  assertKeyboardCoverage,
  expectedFigureCoverage,
  visibleProseSelector,
} from '../tools/check_product.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const require = createRequire(path.join(root, 'app/package.json'))
const { chromium } = require('playwright-core')
const browser = await chromium.launch({ headless: false })
try {
  const page = await browser.newPage()
  await page.setContent('<article><input id="numeric-answer"><button>±</button></article>')
  await assert.rejects(() => assertKeyboardCoverage(page.locator('article')), /missing an enabled keyboard/)
  await page.setContent('<article><input id="numeric-answer"><button aria-controls="numeric-answer" aria-label="数学键盘"></button></article>')
  await assertKeyboardCoverage(page.locator('article'))
  await page.setContent('<article><input id="first"><input id="second"><button aria-controls="first" aria-label="数学键盘"></button></article>')
  await assert.rejects(() => assertKeyboardCoverage(page.locator('article')), /second/)
  await page.setContent(`
    <article class="sr-deck"><div class="sr-read"><div data-figure-id="fig-1">screen</div></div></article>
    <article data-testid="lesson-print"><div class="sr-read"><div data-figure-id="fig-1">print</div></div></article>
  `)
  assert.equal(await page.locator(visibleProseSelector).count(), 1)
  assert.equal(await page.locator('.sr-deck').locator('.sr-read [data-figure-id="fig-1"]').count(), 1)
  assert.deepEqual(
    expectedFigureCoverage(
      { prose: [{ kind: 'fig', id: 'prose-a' }, { kind: 'p' }, { kind: 'fig', id: 'shared' }] },
      [
        { figures: [{ id: 'exercise-a' }, { id: 'shared' }] },
        { figures: [] },
      ],
    ),
    {
      prose: ['prose-a', 'shared'],
      exercise: ['exercise-a', 'shared'],
      print: ['prose-a', 'shared', 'exercise-a'],
    },
  )
  console.log('PASS: missing keyboard and missing second-input keyboard are rejected')
} finally {
  await browser.close()
}
