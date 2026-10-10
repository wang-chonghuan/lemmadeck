import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'
import { assertFigurePixels } from '../tools/check_product.mjs'

const require = createRequire(new URL('../../../../app/package.json', import.meta.url))
const { chromium } = require('playwright')

test('figure pixels cover reachable strips and still reject empty media', async () => {
  const browser = await chromium.launch({ headless: false })
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await page.setContent(`
      <style>
        figure { margin: 0; width: 300px; height: 100px; overflow-x: auto; }
        svg { display: block; width: 1200px; height: 80px; }
      </style>
      <figure aria-label="End drawing"><svg viewBox="0 0 1200 80">
        <rect x="1140" y="20" width="40" height="40" fill="black"/>
      </svg></figure>
      <figure aria-label="Middle drawing"><svg viewBox="0 0 1200 80">
        <rect x="570" y="20" width="40" height="40" fill="black"/>
      </svg></figure>
      <figure aria-label="Empty drawing"><svg viewBox="0 0 1200 80"></svg></figure>
      <figure aria-label="Caption only" style="border:3px solid black;height:130px">
        <svg viewBox="0 0 1200 80"></svg><figcaption>Dark caption is not drawing</figcaption>
      </figure>
    `)
    for (const name of ['End drawing', 'Middle drawing']) {
      const figure = page.getByRole('figure', { name })
      await figure.evaluate(element => { element.scrollLeft = 100 })
      await assertFigurePixels(figure, page)
      assert.equal(await figure.evaluate(element => element.scrollLeft), 100)
    }
    const empty = page.getByRole('figure', { name: 'Empty drawing' })
    await assert.rejects(assertFigurePixels(empty, page), /no visible drawing/)
    assert.equal(await empty.evaluate(element => element.scrollLeft), 0)
    await assert.rejects(assertFigurePixels(page.getByRole('figure', { name: 'Caption only' }), page),
      /no visible drawing/)
  } finally {
    await browser.close()
  }
})
