import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const own = path.dirname(new URL(import.meta.url).pathname)
const require = createRequire(path.join(root, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const figures = process.argv.slice(2)
if (!figures.length || process.cwd() !== root) throw new Error('Exact checkout and figure arguments required')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const candidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const executablePath = candidates.find(candidate => fs.existsSync(candidate))
if (!executablePath) throw new Error('Existing Chrome/Chromium unavailable')
const browser = await chromium.launch({ executablePath, headless: true })
try {
  for (const argument of figures) {
    const [figure, candidate] = argument.split(':')
    if (!/^fig-5[678]$/.test(figure) || !candidate) throw new Error('Expected fig-56:FIRST style argument')
    const folder = path.join(own, figure)
    const svgFile = path.join(folder, `${figure}-${candidate}.svg`)
    const reportFile = path.join(folder, `${figure}-${candidate}.render.json`)
    const png = path.join(folder, `${figure}-width640-${candidate}.png`)
    const receiptFile = path.join(folder, `preview-width640-${candidate}-receipt.json`)
    if (fs.existsSync(png) || fs.existsSync(receiptFile)) throw new Error('Preserve existing preview')
    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'))
    if (report.status !== 'pass') throw new Error(`Do not preview a failed candidate as completed: ${figure}`)
    const svg = fs.readFileSync(svgFile, 'utf8')
    const page = await browser.newPage({ viewport: { width: 640, height: 1600 }, deviceScaleFactor: 1 })
    await page.route('**/*', route => route.abort())
    await page.setContent(`<!doctype html><style>
      :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58;
        --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795;
        --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff; }
      html,body{margin:0;padding:0;background:white}
      #media{width:640px} svg{display:block;width:640px!important;height:auto!important}
    </style><div id="media">${svg}</div>`)
    const metrics = await page.locator('svg').evaluate(element => {
      const bounds = element.getBoundingClientRect()
      const labels = [...element.querySelectorAll('text')].map(label => {
        const matrix = label.getScreenCTM()
        return {
          text: label.textContent,
          sizePx: parseFloat(getComputedStyle(label).fontSize) * Math.hypot(matrix.a, matrix.b),
        }
      })
      return { width: bounds.width, height: bounds.height, labels,
        minimumTextPx: Math.min(...labels.map(label => label.sizePx)) }
    })
    if (metrics.width !== 640 || metrics.minimumTextPx < 16) throw new Error(`Width/readability failed: ${figure}`)
    await page.setViewportSize({ width: 640, height: Math.ceil(metrics.height) })
    await page.screenshot({ path: png, animations: 'disabled' })
    await page.locator('#media').evaluate(element => {
      element.style.width = '390px'
      element.style.overflowX = 'auto'
      element.scrollLeft = 10000
    })
    const scroll = await page.locator('#media').evaluate(element => ({
      clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
      scrollLeft: element.scrollLeft,
      reachesEnd: Math.abs(element.scrollWidth - element.clientWidth - element.scrollLeft) < 1,
    }))
    if (!scroll.reachesEnd || scroll.scrollWidth !== 640) throw new Error(`Scroll-end check failed: ${figure}`)
    fs.writeFileSync(receiptFile, JSON.stringify({
      figure, candidate, svg: { path: svgFile, sha256: sha(svgFile) },
      preview: { path: png, sha256: sha(png) },
      widthPx: 640, metrics, localScrollContainer: scroll,
      viewportEvidence: 'Offline SVG-only preview, not app or finalized lesson acceptance.',
      externalRequestsBlocked: true, independentApproval: false,
    }, null, 2) + '\n', { flag: 'wx' })
    console.log(JSON.stringify({ figure, candidate, png, minimumTextPx: metrics.minimumTextPx, scroll }))
    await page.close()
  }
} finally {
  await browser.close()
}
