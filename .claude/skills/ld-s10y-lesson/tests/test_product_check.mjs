import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  assertPublishedFigure,
  assertKeyboardCoverage,
  expectedFigureCoverage,
  sourceNumberForArtifact,
  visibleProseSelector,
} from '../tools/check_product.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const require = createRequire(path.join(root, 'app/package.json'))
const { chromium } = require('playwright-core')
const browser = await chromium.launch({ headless: false })
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'ld-product-check-'))
try {
  assert.equal(sourceNumberForArtifact({ number: '14' }), '14')
  assert.equal(sourceNumberForArtifact({ number: 'q1', source_number: null }), null)
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

  const edition = 'modern-us-neutral'
  const figures = path.join(fixture, 'editions', edition, 'figures')
  fs.mkdirSync(figures, { recursive: true })
  const svg = [
    '<svg viewBox="0 0 1024 400" xmlns="http://www.w3.org/2000/svg">',
    '<rect x="0" y="0" width="1024" height="400" fill="white"/>',
    '<path d="M 20 200 L 1004 200" stroke="black" stroke-width="8"/>',
    '<text x="100" y="180" font-size="32" fill="black">M</text>',
    '</svg>',
  ].join('')
  fs.writeFileSync(path.join(figures, 'fig-1.svg'), svg)
  fs.writeFileSync(path.join(figures, 'fig-1.spec.json'), JSON.stringify({
    display: { minTextPx: 16 },
  }))
  const asset = {
    id: 'fig-1',
    svg: 'figures/fig-1.svg',
    spec: 'figures/fig-1.spec.json',
  }
  await page.setContent(`
    <style>
      #figure { width: 640px; overflow-x: auto; }
      #figure svg { display: block; width: 100%; height: auto; }
    </style>
    <figure id="figure">${svg}</figure>
  `)
  const figure = page.locator('#figure')
  await assertPublishedFigure({
    figure,
    asset,
    book: fixture,
    edition,
    lesson: 'lesson-test',
    page,
  })
  await figure.evaluate(element => {
    element.style.width = '256px'
  })
  await assert.rejects(
    () => assertPublishedFigure({
      figure,
      asset,
      book: fixture,
      edition,
      lesson: 'lesson-test',
      page,
    }),
    /rendered SVG text 8\.00px is below 16px/,
  )
  console.log(
    'PASS: keyboard coverage and screen-scaled SVG text size are enforced',
  )
} finally {
  await browser.close()
  fs.rmSync(fixture, { recursive: true, force: true })
}
