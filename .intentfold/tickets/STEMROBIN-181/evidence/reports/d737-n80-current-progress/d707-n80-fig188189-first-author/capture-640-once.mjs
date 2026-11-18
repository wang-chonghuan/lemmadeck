import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import crypto from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
if (process.cwd() !== repo) throw new Error('Wrong cwd')
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d707-n80-fig188189-first-author')
const require = createRequire(path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'))
const { chromium } = require('playwright-core')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const figures = [
  { id: 'fig-188', attempt: 'first' },
  { id: 'fig-189', attempt: 'repaired' },
]
const candidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const executablePath = candidates.find(p => fs.existsSync(p))
if (!executablePath) throw new Error('Native browser executable unavailable')
const receiptPath = path.join(own, 'actual-640.started.json')
fs.writeFileSync(receiptPath, `${JSON.stringify({ cwd: repo, figures, width: 640, rerender: false }, null, 2)}\n`, { flag: 'wx' })
const browser = await chromium.launch({ headless: true, executablePath })
const results = []
try {
  for (const figure of figures) {
    const stem = `${figure.id}.${figure.attempt}`
    const svg = path.join(own, `${stem}.svg`)
    const reportPath = path.join(own, `${stem}.render.json`)
    const report = JSON.parse(fs.readFileSync(reportPath))
    if (report.status !== 'pass') throw new Error(`${figure.id}: failed native render; dependent capture stopped`)
    const png = path.join(own, `${stem}.actual-640.png`)
    if (fs.existsSync(png)) throw new Error('Passed capture must not be replayed')
    const page = await browser.newPage({ viewport: { width: 660, height: 280 }, deviceScaleFactor: 1 })
    await page.setContent(`<html><body style="margin:0;background:white"><img alt="${figure.id}" style="display:block;width:640px;height:auto" src="data:image/svg+xml;base64,${fs.readFileSync(svg).toString('base64')}"></body></html>`)
    await page.locator('img').evaluate(async img => { await img.decode() })
    const bounds = await page.locator('img').boundingBox()
    if (Math.abs(bounds.width - 640) > 0.01 || Math.abs(bounds.height - 380 * 640 / 960) > 0.01) throw new Error('Actual media dimensions differ')
    const widthCheck = report.displayChecks.find(c => c.width === 640)
    if (!widthCheck || widthCheck.status !== 'pass' || widthCheck.measuredMinPx < 16) throw new Error('640 px text below contract')
    await page.locator('img').screenshot({ path: png })
    results.push({
      ...figure, status: 'pass', actualMediaBounds: bounds,
      nativeMinTextPx: widthCheck.measuredMinPx,
      svg: { path: svg, sha256: hash(svg) },
      render: { path: reportPath, sha256: hash(reportPath) },
      screenshot: { path: png, sha256: hash(png) },
      note: 'Existing native SVG displayed at actual scroll-media width; no FigureSpec rerender or product/card approval.',
    })
    await page.close()
  }
} finally {
  await browser.close()
}
fs.writeFileSync(path.join(own, 'actual-640.results.json'), `${JSON.stringify({ results, independentReview: false, wholeCardApproved: false }, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(results.map(r => ({ id: r.id, status: r.status, width: r.actualMediaBounds.width, minTextPx: r.nativeMinTextPx }))))
