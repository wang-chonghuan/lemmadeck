import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
import path from 'node:path'
import { materializeArrowheads } from '../scripts/materialize_arrowheads.mjs'

const require = createRequire(path.resolve('app/package.json'))
const { chromium } = require('@playwright/test')

test('materialized arrowheads survive hidden duplicate marker definitions', async () => {
  const browser = await chromium.launch({ headless: false })
  try {
    const page = await browser.newPage()
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
      <defs><marker id="arrow" markerUnits="strokeWidth" markerWidth="10" markerHeight="10"
        refX="10" refY="5" orient="auto" viewBox="0 0 10 10">
        <path d="M0 0L10 5L0 10Z" /></marker></defs>
      <line id="shaft" x1="10" y1="60" x2="110" y2="60"
        stroke="#000000" stroke-width="2" marker-end="url(#arrow)" /></svg>`
    await page.setContent(`<div style="display:none">${svg}</div><main>${svg}</main>`)
    await page.addScriptTag({ content: `window.flatten = ${materializeArrowheads.toString()}` })
    const result = await page.evaluate(() => {
      const drawing = document.querySelector('main svg')
      window.flatten(drawing)
      const head = drawing.querySelector('[data-arrowhead-for]')
      const box = head.getBoundingClientRect()
      return {
        markers: drawing.querySelectorAll('[marker-end]').length,
        heads: drawing.querySelectorAll('[data-arrowhead-for]').length,
        width: box.width,
        height: box.height,
        transform: head.getAttribute('transform'),
      }
    })
    assert.equal(result.markers, 0)
    assert.equal(result.heads, 1)
    assert.equal(result.width, 20)
    assert.equal(result.height, 20)
    assert.equal(result.transform, 'translate(110 60) rotate(0) scale(2) translate(-10 -5)')
    await page.evaluate(() => {
      const drawing = document.querySelector('main svg')
      drawing.querySelector('defs').remove()
      window.flatten(drawing)
    })
    assert.equal(await page.locator('main [data-arrowhead-for]').count(), 1)
  } finally {
    await browser.close()
  }
})
