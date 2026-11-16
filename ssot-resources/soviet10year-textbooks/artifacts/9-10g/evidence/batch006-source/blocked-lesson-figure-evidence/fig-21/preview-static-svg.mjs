import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '../../../../.agents/skills/node_modules/playwright-core/index.mjs'

const ownDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(ownDir, '../../../..')
const allowedFigures = ['fig-21', 'fig-22', 'fig-23']
const figureIds = process.argv[2] ? [process.argv[2]] : allowedFigures
if (figureIds.some(figure => !allowedFigures.includes(figure))) throw new Error('Figure outside author scope')
const executablePath = [
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(candidate => fs.existsSync(candidate))
if (!executablePath) throw new Error('Existing isolated Chromium executable unavailable')
if (process.env.PWDEBUG) throw new Error('PWDEBUG must be unset')
const sha256 = buffer => crypto.createHash('sha256').update(buffer).digest('hex')

// Snapshot the existing SVG only; this does not construct or rerender geometry.
const browser = await chromium.launch({ executablePath, headless: true })
try {
  const context = await browser.newContext({ offline: true, deviceScaleFactor: 1 })
  try {
    const page = await context.newPage()
    await page.route('**/*', route => route.abort())
    for (const figure of figureIds) {
      const directory = path.join(root, '.tmp/s10y-image/9-10g', figure)
      const specPath = path.join(directory, `${figure}.spec.json`)
      const svgPath = path.join(directory, `${figure}.svg`)
      const renderPath = path.join(directory, `${figure}.render.json`)
      const specBytes = fs.readFileSync(specPath)
      const svgBytes = fs.readFileSync(svgPath)
      const renderBytes = fs.readFileSync(renderPath)
      const spec = JSON.parse(specBytes)
      const render = JSON.parse(renderBytes)
      if (!['pass', 'fail'].includes(render.status)) throw new Error(`${figure}: unknown renderer status`)
      if (render.spec.sha256 !== sha256(specBytes)) throw new Error(`${figure}: stale spec binding`)
      if (render.output.svg.sha256 !== sha256(svgBytes)) throw new Error(`${figure}: stale SVG binding`)
      const views = []
      for (const [width, theme] of [[240, 'neutral'], [346, 'print']]) {
        const height = Math.ceil(width * spec.canvas.height / spec.canvas.width)
        await page.setViewportSize({ width, height })
        const ink = theme === 'print' ? '#000000' : '#15201f'
        const muted = theme === 'print' ? '#444444' : '#4c5a58'
        const soft = theme === 'print' ? '#888888' : '#8a9795'
        await page.setContent(`<!doctype html><meta charset="utf-8">
          <style>
            :root {
              --ld-figure-ink:${ink}; --ld-figure-muted:${muted};
              --ld-figure-accent:${ink}; --ld-figure-accent-soft:${soft};
              --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff;
            }
            html,body { margin:0; padding:0; background:#ffffff; }
            svg { display:block; width:${width}px; height:auto; }
          </style>${svgBytes.toString('utf8')}`)
        await page.evaluate(() => document.fonts.ready)
        const metrics = await page.evaluate(minTextPx => {
          const svg = document.querySelector('svg')
          const bounds = svg.getBoundingClientRect()
          const labels = [...svg.querySelectorAll('text')].map(node => {
            const matrix = node.getScreenCTM()
            const px = Number.parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b)
            const rect = node.getBoundingClientRect()
            const clipped = rect.left < bounds.left - 0.1 || rect.right > bounds.right + 0.1 ||
              rect.top < bounds.top - 0.1 || rect.bottom > bounds.bottom + 0.1
            return {
              id: node.getAttribute('data-label-id'), text: node.textContent, px, clipped,
              box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            }
          })
          const collisions = []
          for (let first = 0; first < labels.length; first += 1) {
            for (let second = first + 1; second < labels.length; second += 1) {
              const a = labels[first].box
              const b = labels[second].box
              if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
                  Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)) {
                collisions.push([labels[first].id, labels[second].id])
              }
            }
          }
          const failures = labels.filter(label => label.px + 0.01 < minTextPx || label.clipped)
          return {
            mediaWidthPx: bounds.width, mediaHeightPx: bounds.height,
            documentScrollWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth, labels, labelCollisions: collisions,
            measuredMinPx: Math.min(...labels.map(label => label.px)),
            failures, status: failures.length || collisions.length ? 'fail' : 'pass',
          }
        }, spec.display.minTextPx)
        const previewPath = path.join(directory, `${figure}.preview-${width}-${theme}.png`)
        await page.screenshot({ path: previewPath, type: 'png', animations: 'disabled' })
        views.push({
          width, theme, ...metrics,
          preview: { path: path.relative(root, previewPath), sha256: sha256(fs.readFileSync(previewPath)) },
        })
      }
      const evidence = {
        schema: 'scratch-static-svg-preview@1',
        figure,
        purpose: 'Author-only static SVG snapshot and CSS metrics, not independent approval or application acceptance. A failed renderer remains failed; screenshots are diagnostic evidence only.',
        browser: { isolated: true, headless: true, offline: true, persistentProfile: false, cdp: false },
        bindings: {
          spec: { path: path.relative(root, specPath), sha256: sha256(specBytes) },
          svg: { path: path.relative(root, svgPath), sha256: sha256(svgBytes) },
          render: { path: path.relative(root, renderPath), sha256: sha256(renderBytes) },
        },
        renderStatus: render.status,
        views,
        status: render.status === 'pass' && views.every(view => view.status === 'pass') ? 'pass' : 'fail',
      }
      fs.writeFileSync(path.join(directory, `${figure}.preview-metrics.json`), `${JSON.stringify(evidence, null, 2)}\n`)
      console.log(`${figure}: ${evidence.status}; ${views.map(view => `${view.width}/${view.theme} ${view.measuredMinPx.toFixed(2)}px`).join(', ')}`)
      if (evidence.status !== 'pass') process.exitCode = 2
    }
  } finally {
    await context.close()
  }
} finally {
  await browser.close()
}
