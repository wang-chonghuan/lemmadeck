import fs from 'node:fs'
import path from 'node:path'
import {createRequire} from 'node:module'
import {pathToFileURL} from 'node:url'
import {cwd, owned, core, bind, writeNew} from './run.mjs'

const require = createRequire(path.join(cwd, 'app/package.json'))
const {chromium} = require('playwright')
const results = []
const browser = await chromium.launch({headless: true})
try {
  const context = await browser.newContext({viewport: {width: 480, height: 400}, offline: true})
  const page = await context.newPage()
  for (const number of ['01', '02']) {
    const svg = path.join(core, `9-10g/editions/modern-us-neutral/figures/fig-g10-${number}.svg`)
    await page.goto(pathToFileURL(svg).href, {waitUntil: 'load'})
    const png = writeNew(`images/fig-g10-${number}-current.png`, await page.locator('svg').screenshot())
    results.push({source: bind(svg), output: bind(png)})
  }
} finally {
  await browser.close()
}
console.log(JSON.stringify({status: 'current-local-svg-rasterized', results,
  imageOpens: 0, network: false, offlineChromiumForRasterOnly: true,
  mathLiveExactCheck: false}, null, 2))
