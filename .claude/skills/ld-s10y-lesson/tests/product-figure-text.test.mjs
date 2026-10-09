import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { assertActualFigureText } from '../tools/check_product.mjs'

const require = createRequire(new URL('../../../../app/package.json', import.meta.url))
const { chromium } = require('@playwright/test')

test('actual media scale accepts 16px text and rejects canvas-only 12px text', async () => {
  const browser = await chromium.launch({ headless: false })
  try {
    const page = await browser.newPage()
    await page.setContent('<figure><svg width="1160" height="100" viewBox="0 0 1160 100" style="width:640px"><text x="30" y="50" font-size="30">-44.5</text></svg></figure>')
    const figure = page.locator('figure')
    await assertActualFigureText(figure)
    await page.locator('text').evaluate(node => node.setAttribute('font-size', '22'))
    await assert.rejects(assertActualFigureText(figure), /below minimum/)
  } finally {
    await browser.close()
  }
})
