import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const { chromium } = await import(pathToFileURL(path.resolve('app/node_modules/playwright-core/index.mjs')).href)
const dir = '.intentfold/tickets/STEMROBIN-182/tmp/reviewer-5m-n38'
const seed = JSON.parse(fs.readFileSync(`${dir}/seed.json`, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
let browser
const evidence = []
try {
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1500, height: 1200 } })
  await context.route('**/*', route => route.abort())
  const page = await context.newPage()
  for (const figure of seed.figures) {
    const asset = figure.assets[0]
    assert.equal(hash(asset.path), asset.sha256)
    const artwork = figure.assets.find(item => item.path.endsWith('.artwork.png'))
    assert(artwork)
    assert.equal(hash(artwork.path), artwork.sha256)
    const data = fs.readFileSync(artwork.path).toString('base64')
    await page.setContent(`<html><body style="margin:0;background:white"><div style="position:relative;width:640px;height:600px"><img style="position:absolute;width:640px;height:600px" src="data:image/png;base64,${data}"><div style="position:absolute;inset:0">${fs.readFileSync(asset.path, 'utf8')}</div></div></body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const dimensions = await page.locator('svg').evaluate(element => ({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      viewBox: element.getAttribute('viewBox'),
      labels: [...element.querySelectorAll('text')].map(label => label.textContent),
    }))
    const screenshot = `${dir}/${figure.id}-complete.png`
    await page.screenshot({ path: screenshot, fullPage: true })
    evidence.push({ id: figure.id, asset: asset.path, sha256: asset.sha256,
      artwork: artwork.path, artwork_sha256: artwork.sha256, screenshot, dimensions })
  }
  await context.close()
} finally {
  if (browser) await browser.close()
}
fs.writeFileSync(`${dir}/source-figure-capture.json`, JSON.stringify({
  headless: true, PWDEBUG: null, report_open: 'never', browser_closed: true, evidence,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(evidence, null, 2))
