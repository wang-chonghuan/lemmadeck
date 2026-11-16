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
const executablePath = [
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].find(candidate => fs.existsSync(candidate))
if (!executablePath) throw new Error('Existing Chromium executable unavailable')

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex')
const bind = file => ({
  path: path.relative(root, file),
  sha256: sha256(fs.readFileSync(file)),
})
const specPath = path.join(directory, 'spec.json')
const svgPath = path.join(directory, 'fig-03.svg')
const renderPath = path.join(directory, 'fig-03.render.json')
const contextPath = path.join(directory, 'context.json')
const modernPath = path.join(root,
  'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/' +
  'modern-us-neutral/lessons/ana10-c6-s1-n77/lesson.json',
)
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const render = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
const modern = JSON.parse(fs.readFileSync(modernPath, 'utf8'))
const fullText = modern.prose.map(item => item.text).filter(text => text.length)
const specText = spec.source.authoritativeText.map(item => item.text)
if (render.status !== 'pass') throw new Error('Renderer did not pass')
if (render.spec.sha256 !== bind(specPath).sha256) {
  throw new Error('Spec no longer matches successful render')
}
if (render.output.svg.sha256 !== bind(svgPath).sha256) {
  throw new Error('SVG no longer matches successful render')
}
if (JSON.stringify(fullText) !== JSON.stringify(specText)) {
  throw new Error('Complete approved prose differs from authoritativeText')
}

const svg = fs.readFileSync(svgPath, 'utf8')
const browser = await chromium.launch({ executablePath, headless: true })
const captures = []
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  await context.route('**/*', route => route.abort())
  const page = await context.newPage()
  for (const target of [
    { width: 240, theme: 'neutral', ink: '#15201f',
      filename: 'fig-03.neutral-240.preview.png' },
    { width: 346, theme: 'print', ink: '#111111',
      filename: 'fig-03.print-346.preview.png' },
  ]) {
    const height = Math.ceil(target.width * spec.canvas.height / spec.canvas.width)
    await page.setViewportSize({ width: target.width, height })
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
      <style>
        :root {
          --ld-figure-ink: ${target.ink};
          --ld-figure-muted: ${target.ink};
          --ld-figure-accent: ${target.ink};
          --ld-figure-accent-soft: #8a9795;
          --ld-figure-grid: #e3eae9;
          --ld-figure-paper: #ffffff;
        }
        html, body { margin: 0; background: #ffffff; overflow: hidden; }
        #media { width: ${target.width}px; }
        #media > svg { display: block; width: 100%; height: auto; }
      </style></head><body><div id="media">${svg}</div></body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const measurements = await page.evaluate(() => {
      const svg = document.querySelector('#media > svg')
      const rect = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM()
        const labelRect = node.getBoundingClientRect()
        return {
          id: node.getAttribute('data-label-id'),
          text: node.textContent,
          px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
          insideMedia: labelRect.left >= rect.left &&
            labelRect.top >= rect.top && labelRect.right <= rect.right &&
            labelRect.bottom <= rect.bottom,
        }
      })
      const visibleMarkers = [...svg.querySelectorAll('ellipse, circle')]
        .filter(node => {
          const style = getComputedStyle(node)
          return style.display !== 'none' && style.visibility !== 'hidden'
        })
      return {
        media: { width: rect.width, height: rect.height },
        labels,
        minTextPx: Math.min(...labels.map(label => label.px)),
        visiblePointMarkers: visibleMarkers.length,
      }
    })
    if (measurements.labels.length !== 6 ||
        measurements.minTextPx < spec.display.minTextPx ||
        measurements.labels.some(label => !label.insideMedia) ||
        measurements.visiblePointMarkers !== 0) {
      throw new Error(`Preview measurement failed: ${JSON.stringify(measurements)}`)
    }
    const output = path.join(directory, target.filename)
    await page.screenshot({
      path: output,
      type: 'png',
      animations: 'disabled',
      fullPage: true,
    })
    captures.push({
      theme: target.theme,
      requestedWidth: target.width,
      viewport: { width: target.width, height },
      measurements,
      output: bind(output),
    })
  }
  await context.close()
} finally {
  await browser.close()
}

const evidence = {
  schema: 'ld-s10y-image/author-preview-evidence@1',
  figure: spec.id,
  stage: 'author-capture-not-independent-review',
  browser: {
    dependency: 'existing playwright-core resolved from the official renderer',
    headless: true,
    isolatedContext: true,
    networkRequests: 'aborted',
    closed: true,
    pwdebug: 'unset by invocation',
    htmlAutoOpen: 'never',
  },
  bindings: {
    source: bind(path.join(root, spec.source.image.path)),
    inventory: bind(path.join(directory, 'source-inventory.md')),
    context: bind(contextPath),
    approvedModernLesson: bind(modernPath),
    spec: bind(specPath),
    svg: bind(svgPath),
    render: bind(renderPath),
    nativePreview: bind(path.join(directory, 'fig-03.preview.png')),
    captureScript: bind(fileURLToPath(import.meta.url)),
  },
  authoritativeText: {
    count: fullText.length,
    exactOrderAndText: true,
    canonicalTextArraySha256: sha256(JSON.stringify(fullText)),
  },
  actualRendererExecutions: 1,
  labelRepairs: 0,
  captures,
}
const evidencePath = path.join(directory, 'fig-03.author-display-evidence.json')
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
console.log(JSON.stringify({
  evidence: bind(evidencePath),
  previews: captures.map(capture => ({
    width: capture.requestedWidth,
    minTextPx: capture.measurements.minTextPx,
    output: capture.output,
  })),
  browserClosed: true,
}, null, 2))
