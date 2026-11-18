import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const postcss = require('postcss')
const phase = process.argv[2]
if (!['before', 'after'].includes(phase)) throw new Error('expected before or after')
const cssFile = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssFile, 'utf8')
const cssHash = crypto.createHash('sha256').update(css).digest('hex')
const parsed = postcss.parse(css)
const selectors = [':root', '.sr-read', '.sr-read-fig', '.sr-figure-media', '.sr-figure-media svg']
const rules = []
parsed.walkRules(rule => {
  if (rule.parent.type !== 'root') return
  if (rule.selectors?.some(selector => selectors.includes(selector))) rules.push(rule.toString())
})
if (rules.length < 5) throw new Error('product media CSS extraction incomplete')
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(file => file && fs.existsSync(file))
if (!executablePath) throw new Error('no installed browser')
const browser = await chromium.launch({ executablePath, headless: false })
const figures = []
try {
  const page = await browser.newPage()
  for (const figure of ['fig-156', 'fig-157', 'fig-158', 'fig-159']) {
    const spec = JSON.parse(fs.readFileSync(path.join(root, figure, phase, 'spec.json'), 'utf8'))
    const svgFile = path.join(root, figure, phase, `${figure}.svg`)
    if (!fs.existsSync(svgFile)) {
      figures.push({ figure, status: 'fail', reason: 'native SVG absent' })
      continue
    }
    const svg = fs.readFileSync(svgFile, 'utf8')
    const widths = []
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport)
      await page.setContent(`<!doctype html><meta charset="utf-8">
        <style>${rules.join('\n')}
        html { background: white; } body { margin: 0; padding: 24px; }
        main { max-width: 1050px; margin: auto; } * { box-sizing: border-box; }
        </style><main class="sr-read"><figure class="sr-read-fig">
        <div class="sr-figure-media">${svg}</div></figure></main>`)
      const metrics = await page.evaluate(() => {
        const media = document.querySelector('.sr-figure-media')
        const svg = media.querySelector('svg')
        const box = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          const rect = node.getBoundingClientRect()
          return {
            id: node.dataset.labelId, text: node.textContent,
            px: parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            clipped: rect.left < box.left - .5 || rect.right > box.right + .5 || rect.top < box.top - .5 || rect.bottom > box.bottom + .5,
          }
        })
        return {
          width: box.width, height: box.height,
          mediaWidth: media.getBoundingClientRect().width,
          productProseFontSize: getComputedStyle(document.querySelector('.sr-read')).fontSize,
          minTextPx: Math.min(...labels.map(item => item.px)),
          labels, clipped: labels.filter(item => item.clipped),
          visibleGeometry: [...svg.querySelectorAll('path,line,circle,polygon')].filter(node => {
            if (node.closest('defs') || node.getAttribute('display') === 'none') return false
            const rect = node.getBoundingClientRect()
            return rect.width > 1 || rect.height > 1
          }).length,
        }
      })
      const declared = spec.display.widths.some(width => Math.abs(width - metrics.mediaWidth) < .1)
      widths.push({
        viewport, ...metrics, actualWidthDeclared: declared,
        status: declared && metrics.minTextPx >= 16 && !metrics.clipped.length && metrics.visibleGeometry > 0 ? 'pass' : 'fail',
      })
    }
    figures.push({ figure, status: widths.every(item => item.status === 'pass') ? 'pass' : 'fail', widths })
  }
} finally {
  await browser.close()
}
const report = {
  schema: 'd537/isolated-headed-figure-display@1', phase,
  status: figures.every(item => item.status === 'pass') ? 'pass' : 'fail',
  sourceCSS: { path: cssFile, sha256: cssHash }, renderer: 'installed app Playwright; headed Chromium',
  scope: 'Figure-only offline DOM; product prose/media rules with the user-provided 342px mobile inner budget (390px viewport minus 24px per side). Not an integrated card, DB, or final offline lesson acceptance.',
  screenshotsCreated: 0, modelImageOpens: 0, FIG: 'pending', fullcard: false, figures,
}
const text = `${JSON.stringify(report, null, 2)}\n`
fs.writeFileSync(path.join(root, `display-${phase}.json`), text, { flag: 'wx' })
fs.writeFileSync(path.join(root, `display-${phase}.stdout.txt`), text, { flag: 'wx' })
process.stdout.write(text)
process.exitCode = report.status === 'pass' ? 0 : 2
