import fs from 'node:fs/promises'
import path from 'node:path'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const output = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(path.join(repo, 'app/package.json'))
const {chromium} = require('playwright')
const asset = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-88.svg')
const svg = await fs.readFile(asset, 'utf8')
const browser = await chromium.launch({headless: true})
try {
  const context = await browser.newContext({viewport: {width: 500, height: 540}, deviceScaleFactor: 1})
  await context.route('**/*', route => route.abort())
  const page = await context.newPage()
  await page.setContent(`<html><body style="margin:10px;background:white">${svg}</body></html>`)
  await page.locator('svg').screenshot({path: path.join(output, 'fig-g10-88.current-render.png')})
  console.log(JSON.stringify({asset, screenshot: path.join(output, 'fig-g10-88.current-render.png'), headless: true, externalRequests: 'blocked'}))
} finally {
  await browser.close()
}
