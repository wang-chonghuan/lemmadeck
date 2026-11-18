import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const phase = process.argv[2] || 'first'
if (!['first', 'repair'].includes(phase)) throw new Error('Unsupported preview phase')
const figures = phase === 'first' ? ['fig-153', 'fig-154'] : ['fig-153']
const executable = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(file => file && fs.existsSync(file))
process.env.TMPDIR = path.join(root, 'runtime')
const browser = await chromium.launch({ executablePath: executable, headless: true })
const observations = []
try {
  for (const figure of figures) {
    const input = path.join(root, figure, `candidate.${phase}.svg`)
    const output = path.join(root, figure, `candidate.${phase}.342.png`)
    if (fs.existsSync(output)) throw new Error(`Refuse to overwrite preview: ${output}`)
    const page = await browser.newPage({ viewport: { width: 342, height: 342 }, deviceScaleFactor: 1 })
    await page.setContent('<html><head><style>html,body{margin:0;padding:0;background:white}svg{display:block;width:342px;height:auto}</style></head><body></body></html>')
    await page.locator('body').evaluate((body, svg) => { body.innerHTML = svg }, fs.readFileSync(input, 'utf8'))
    const measurements = await page.locator('svg').evaluate(svg => ({
      width: svg.getBoundingClientRect().width,
      height: svg.getBoundingClientRect().height,
      text: [...svg.querySelectorAll('text')].map(node => ({
        text: node.textContent,
        px: Number(node.getAttribute('font-size')) * Math.hypot(node.getScreenCTM().a, node.getScreenCTM().b),
      })),
    }))
    if (measurements.width !== 342 || measurements.text.some(item => item.px < 16)) {
      throw new Error(`Invalid preview transform for ${figure}`)
    }
    await page.locator('svg').screenshot({ path: output })
    observations.push({
      figure, phase, input: { path: input, sha256: sha(input) },
      output: { path: output, sha256: sha(output) }, measurements,
      source: 'SVG-only browser screenshot of existing native output; no JSXGraph rerender or determinism run.',
      acceptance: 'Author preview only. Not a headed app/full-card or independent DISPLAY review.',
    })
    await page.close()
  }
} finally {
  await browser.close()
}
fs.writeFileSync(path.join(root, `preview.${phase}.json`), `${JSON.stringify({
  phase, mediaWidthPx: 342, observations, browserClosed: true,
  command: { executable: 'node', args: [fileURLToPath(import.meta.url), phase] },
  exitCode: 0,
}, null, 2)}\n`, { flag: 'wx' })
console.log(`Preview ${phase}: ${figures.length} SVG screenshots at actual 342px media width; browser closed.`)
