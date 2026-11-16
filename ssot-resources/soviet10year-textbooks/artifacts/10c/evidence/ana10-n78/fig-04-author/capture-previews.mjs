import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(directory, '../../..')
const require = createRequire(
  path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
)
const { chromium } = require('playwright-core')
if (process.env.PWDEBUG) throw new Error('PWDEBUG must be unset')
const executablePath = [
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].find(candidate => fs.existsSync(candidate))
if (!executablePath) throw new Error('Existing isolated Chromium unavailable')

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({
  path: path.relative(root, file),
  sha256: sha256(fs.readFileSync(file)),
})
const specPath = path.join(directory, 'spec.json')
const svgPath = path.join(directory, 'fig-04.svg')
const renderPath = path.join(directory, 'fig-04.render.json')
const contextPath = path.join(directory, 'context.json')
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const render = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
const officialContext = JSON.parse(fs.readFileSync(contextPath, 'utf8'))
const expectedText = officialContext.lessons.flatMap(lesson =>
  lesson.prose.flatMap(prose => prose.nearbyText.map(text => ({
    lesson: lesson.lesson, text,
  }))),
)
if (JSON.stringify(spec.source.authoritativeText) !== JSON.stringify(expectedText)) {
  throw new Error('Complete official context differs from authoritativeText')
}
if (render.spec.sha256 !== bind(specPath).sha256 ||
    render.output.svg.sha256 !== bind(svgPath).sha256) {
  throw new Error('Current renderer bindings are stale')
}
const svg = fs.readFileSync(svgPath, 'utf8')
const captures = []
const browser = await chromium.launch({ executablePath, headless: true })
try {
  const context = await browser.newContext({ offline: true, deviceScaleFactor: 1 })
  try {
    await context.route('**/*', route => route.abort())
    const page = await context.newPage()
    for (const [width, theme] of [
      [640, 'neutral'], [240, 'neutral'], [346, 'print'],
    ]) {
      const height = Math.ceil(width * spec.canvas.height / spec.canvas.width)
      const ink = theme === 'print' ? '#111111' : '#15201f'
      await page.setViewportSize({ width, height })
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
        <style>
          :root {
            --ld-figure-ink:${ink}; --ld-figure-muted:${ink};
            --ld-figure-accent:${ink}; --ld-figure-accent-soft:#8a9795;
            --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff;
          }
          html,body { margin:0; padding:0; background:#ffffff; }
          #media { width:${width}px; }
          #media > svg { display:block; width:100%; height:auto; }
        </style></head><body><div id="media">${svg}</div></body></html>`)
      await page.evaluate(() => document.fonts.ready)
      const metrics = await page.evaluate(minTextPx => {
        const svg = document.querySelector('#media > svg')
        const bounds = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          const rect = node.getBoundingClientRect()
          return {
            id: node.getAttribute('data-label-id'),
            text: node.textContent,
            px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            insideMedia: rect.left >= bounds.left && rect.top >= bounds.top &&
              rect.right <= bounds.right && rect.bottom <= bounds.bottom,
          }
        })
        const visiblePointMarkers = [...svg.querySelectorAll('circle,ellipse')]
          .filter(node => {
            const style = getComputedStyle(node)
            return style.display !== 'none' && style.visibility !== 'hidden'
          }).length
        const failures = labels.filter(label =>
          label.px + 0.01 < minTextPx || !label.insideMedia,
        )
        return {
          mediaWidthPx: bounds.width, mediaHeightPx: bounds.height,
          labels, measuredMinPx: Math.min(...labels.map(label => label.px)),
          visiblePointMarkers, failures,
          status: failures.length || visiblePointMarkers ||
            labels.map(label => label.text).join('|') !== 'O|A|B|x/2|x/2'
            ? 'fail' : 'pass',
        }
      }, spec.display.minTextPx)
      const output = path.join(directory, `fig-04.${theme}-${width}.preview.png`)
      await page.screenshot({
        path: output, type: 'png', animations: 'disabled', fullPage: true,
      })
      captures.push({ width, theme, metrics, output: bind(output) })
    }
  } finally {
    await context.close()
  }
} finally {
  await browser.close()
}
const evidence = {
  schema: 'ld-s10y-image/author-preview-evidence@1',
  figure: spec.id,
  stage: 'author-capture-not-independent-review',
  browser: {
    headless: true, isolatedContext: true, offline: true,
    networkRequests: 'aborted', persistentProfile: false, cdp: false,
    closed: true, pwdebug: 'unset by invocation', htmlAutoOpen: 'never',
  },
  bindings: {
    source: bind(path.join(root, spec.source.image.path)),
    inventory: bind(path.join(directory, 'source-inventory.md')),
    context: bind(contextPath), spec: bind(specPath), svg: bind(svgPath),
    render: bind(renderPath), captureScript: bind(fileURLToPath(import.meta.url)),
    nativeRendererPreview: bind(path.join(directory, 'fig-04.preview.png')),
  },
  authoritativeText: { count: expectedText.length, exactOrderAndText: true },
  renderStatus: render.status,
  captures,
  status: render.status === 'pass' &&
    captures.every(capture => capture.metrics.status === 'pass') ? 'pass' : 'fail',
}
const evidencePath = path.join(directory, 'fig-04.author-display-evidence.json')
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
console.log(JSON.stringify({
  evidence: bind(evidencePath),
  status: evidence.status,
  captures: captures.map(capture => ({
    width: capture.width, theme: capture.theme,
    minTextPx: capture.metrics.measuredMinPx, output: capture.output,
  })),
  browserClosed: true,
}, null, 2))
if (evidence.status !== 'pass') process.exitCode = 2
