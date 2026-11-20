import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {createRequire} from 'node:module'
import {pathToFileURL} from 'node:url'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const owned = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author')
if (process.cwd() !== cwd) throw Error('wrong cwd')
const require = createRequire(path.join(cwd, 'app/package.json'))
const {chromium} = require('playwright')
const svg = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-08.svg')
const png = path.join(owned, 'images/fig-g10-08-current-approved-svg.png')
fs.mkdirSync(path.dirname(png), {recursive: true})
if (fs.existsSync(png)) throw Error('image already exists')
const browser = await chromium.launch({headless: true})
try {
  const context = await browser.newContext({viewport: {width: 480, height: 560}, offline: true})
  const page = await context.newPage()
  await page.goto(pathToFileURL(svg).href, {waitUntil: 'load'})
  await page.locator('svg').screenshot({path: png})
  console.log(JSON.stringify({
    source: svg,
    sourceSha256: crypto.createHash('sha256').update(fs.readFileSync(svg)).digest('hex'),
    output: png,
    sha256: crypto.createHash('sha256').update(fs.readFileSync(png)).digest('hex'),
    browser: 'headless Chromium, offline context, local SVG only',
    mathLive: false,
    status: 'rasterized-current-approved-svg',
  }, null, 2))
} finally {
  await browser.close()
}
