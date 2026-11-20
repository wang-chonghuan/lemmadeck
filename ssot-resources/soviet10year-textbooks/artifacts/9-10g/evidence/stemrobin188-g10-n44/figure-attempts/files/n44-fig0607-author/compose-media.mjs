import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n44-fig0607-author')
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const figures = ['fig-g10-06', 'fig-g10-07']
const snapshots = process.argv.slice(2)
if (process.cwd() !== root || snapshots.length !== 2 ||
    snapshots.some(value => !['first', 'repaired'].includes(value))) {
  throw new Error('Exact checkout and one snapshot per figure required')
}
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const inputs = figures.map((figure, index) => {
  const svg = path.join(own, snapshots[index], figure, `${figure}.svg`)
  return { figure, snapshot: snapshots[index], path: svg, sha256: hash(svg),
    contents: fs.readFileSync(svg, 'utf8') }
})
const executablePath = [
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(value => fs.existsSync(value))
if (!executablePath) throw new Error('Existing Chromium unavailable; no install authorized')
const browser = await chromium.launch({ executablePath, headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 324 }, deviceScaleFactor: 1 })
  await page.route('**/*', route => route.abort())
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;background:white}
    main{display:flex;gap:16px;padding:16px}
    section{width:300px;flex:none}
    section svg{display:block;width:300px;max-width:480px;height:auto}
  </style><main>${inputs.map(input =>
    `<section data-figure="${input.figure}">${input.contents}</section>`).join('')}</main>`)
  await page.evaluate(() => document.fonts.ready)
  const checks = await page.evaluate(() =>
    [...document.querySelectorAll('section')].map(section => {
      const svg = section.querySelector('svg')
      const rect = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const ctm = node.getScreenCTM()
        return { id: node.getAttribute('data-label-id'), text: node.textContent,
          px: Number(node.getAttribute('font-size')) * Math.hypot(ctm.a, ctm.b) }
      })
      const arrowheads = [...svg.querySelectorAll('[data-arrowhead-for]')]
        .map(node => node.getAttribute('data-arrowhead-for'))
      const dashed = [...svg.querySelectorAll('[stroke-dasharray]')]
        .filter(node => !node.closest('defs'))
        .map(node => ({ id: node.id, pattern: node.getAttribute('stroke-dasharray') }))
      return { figure: section.dataset.figure, mediaWidth: rect.width, mediaHeight: rect.height,
        minTextPx: Math.min(...labels.map(label => label.px)), labels, arrowheads, dashed,
        status: rect.width === 300 && labels.every(label => label.px >= 16) &&
          arrowheads.length === 4 ? 'pass' : 'fail' }
    }))
  const suffix = snapshots.every(value => value === 'first') ? 'first' : 'repaired'
  const png = path.join(own, `${suffix}-media-300.png`)
  const report = path.join(own, `${suffix}-media-300.checks.json`)
  if (fs.existsSync(png) || fs.existsSync(report)) throw new Error('Preserve prior media snapshot')
  await page.screenshot({ path: png, type: 'png', animations: 'disabled' })
  const payload = {
    schema: 'stemrobin-188/author-media-checks@1',
    note: 'Actual 300 px inline SVG composition; existing renderer SVGs only, no drawing regeneration.',
    inputs: inputs.map(({ contents, ...input }) => input),
    output: { path: png, sha256: hash(png) }, network: 'blocked',
    checks, status: checks.every(check => check.status === 'pass') ? 'pass' : 'fail',
  }
  fs.writeFileSync(report, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(JSON.stringify(payload, null, 2))
  if (payload.status !== 'pass') process.exitCode = 2
} finally {
  await browser.close()
}
