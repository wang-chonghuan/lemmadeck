import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const repo = process.cwd()
assert.equal(repo, '/Users/yong/.codex/worktrees/00b1/lemmadeck')
const own = path.dirname(fileURLToPath(import.meta.url))
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1210-n98-fig226-first-author')
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('@playwright/test')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = (file) => ({ path: path.relative(repo, file), sha256: hash(file) })
const write = (name, data) => fs.writeFileSync(path.join(own, name), `${JSON.stringify(data, null, 2)}\n`)
const inputFiles = [
  path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-226.png'),
  path.join(own, 'source.inventory.json'),
  ...['fig-226.spec.json', 'fig-226.render.json', 'fig-226.svg', 'report.json',
    'FIRST/fig-226.spec.json', 'FIRST/fig-226.render.json', 'FIRST/fig-226.svg',
    'fig-226.actual-svg-preview.png'].map((name) => path.join(author, name)),
  ...['zh', 'en'].map((locale) => path.join(repo,
    `.intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author/${locale}/lesson.template.json`)),
  path.join(repo, 'app/src/styles/app.css'),
]
const inputsBefore = inputFiles.map(record)
const spec = JSON.parse(fs.readFileSync(path.join(author, 'fig-226.spec.json'), 'utf8'))
const render = JSON.parse(fs.readFileSync(path.join(author, 'fig-226.render.json'), 'utf8'))
assert.equal(hash(path.join(author, 'fig-226.spec.json')), render.spec.sha256)
assert.equal(hash(path.join(author, 'fig-226.svg')), render.output.svg.sha256)
assert.equal(hash(path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-226.png')), spec.source.image.sha256)
const first = JSON.parse(fs.readFileSync(path.join(author, 'FIRST/fig-226.spec.json'), 'utf8'))
const normalizedFirst = structuredClone(first)
normalizedFirst.objects.find((object) => object.id === 'origin-O1').labelPlacement.offset = [0, -10]
assert.deepEqual(spec, normalizedFirst)
const lesson = JSON.parse(fs.readFileSync(inputFiles.find((file) => file.endsWith('/zh/lesson.template.json')), 'utf8'))
assert.deepEqual(spec.source.authoritativeText.map((item) => item.text),
  lesson.prose.filter((block) => block.kind === 'p').map((block) => block.text))
const validation = spawnSync('python3', [
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  path.join(author, 'fig-226.spec.json'), '--stage', 'rendered', '--json',
], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
write('native-validation.json', {
  command: 'python3 .agents/skills/ld-s10y-image/scripts/validate_spec.py <unchanged current spec> --stage rendered --json',
  exitCode: validation.status,
  stdout: validation.stdout,
  stderr: validation.stderr,
})
assert.equal(validation.status, 0, validation.stderr || validation.stdout)

const css = fs.readFileSync(path.join(repo, 'app/src/styles/app.css'), 'utf8')
const svg = fs.readFileSync(path.join(author, 'fig-226.svg'), 'utf8')
const browser = await chromium.launch({
  headless: false,
  args: ['--disable-background-networking', '--disable-sync', '--no-first-run'],
})
const report = {
  schema: 'independent-figure-browser-evidence@1',
  ticket: 'STEMROBIN-181',
  figure: 'fig-226',
  authority: 'Unchanged current SVG inline in a restricted offline harness with the unmodified current product stylesheet and semantic CSS variables. Actual headed Chromium screenshots and pixel samples, not resvg raster. Not a live lesson route, DB check, publication or promotion.',
  renderer: { engine: 'Chromium', headed: true, version: browser.version(), executable: chromium.executablePath(),
    playwright: require.resolve('@playwright/test') },
  inputsBefore,
  firstToCurrentDiff: 'Only objects[origin-O1].labelPlacement.offset added as [0, -10]. No reviewer edits.',
  network: { externalAccessAllowed: false, blockedRequests: [] },
  observations: [],
  screenshots: [],
}
try {
  const context = await browser.newContext()
  await context.route('**/*', (route) => {
    report.network.blockedRequests.push(route.request().url())
    return route.abort()
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(String(error)))
  const cases = [
    { name: 'neutral-desktop', viewport: { width: 1440, height: 960 }, theme: 'neutral', surface: 'sr-read-fig', width: 900, capture: true },
    { name: 'accent-desktop', viewport: { width: 1440, height: 960 }, theme: 'accent', surface: 'sr-read-fig', width: 900, capture: true },
    { name: 'print-desktop', viewport: { width: 1440, height: 960 }, theme: 'neutral', surface: 'sr-read-fig', width: 640, print: true, capture: true },
    { name: 'neutral-mobile', viewport: { width: 390, height: 844 }, theme: 'neutral', surface: 'sr-read-fig', width: 358, captureMobile: true },
    { name: 'exercise-desktop', viewport: { width: 1440, height: 960 }, theme: 'neutral', surface: 'sr-ex-fig', width: 900 },
    { name: 'exercise-mobile', viewport: { width: 390, height: 844 }, theme: 'neutral', surface: 'sr-ex-fig', width: 358 },
  ]
  for (const item of cases) {
    await page.setViewportSize(item.viewport)
    await page.emulateMedia({ media: item.print ? 'print' : 'screen' })
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head>
      <body style="margin:0;font-size:16px;background:var(--sr-white)">
      <main class="${item.print ? 'sr-print-lesson' : ''}" style="width:${item.width}px;margin:16px;font-size:16px">
      <figure class="${item.surface}" data-figure-layout="scroll">
      <div class="sr-figure-media" data-figure-theme="${item.theme}"><div class="sr-figure-vector">${svg}</div></div>
      </figure></main></body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const observation = await page.evaluate(() => {
      const frame = document.querySelector('[data-figure-layout]')
      const media = document.querySelector('.sr-figure-media')
      const svgNode = media.querySelector('svg')
      const bounds = svgNode.getBoundingClientRect()
      const bbox = (node) => {
        const r = node.getBoundingClientRect()
        return { x: r.x - bounds.x, y: r.y - bounds.y, width: r.width, height: r.height }
      }
      const lines = [...svgNode.querySelectorAll('line')].map((node) => {
        const style = getComputedStyle(node)
        return {
          id: node.id,
          from: [node.x1.baseVal.value, node.y1.baseVal.value],
          to: [node.x2.baseVal.value, node.y2.baseVal.value],
          length: node.getTotalLength(),
          stroke: style.stroke,
          strokeWidth: Number.parseFloat(style.strokeWidth),
          opacity: style.opacity,
          strokeOpacity: style.strokeOpacity,
          display: style.display,
          visibility: style.visibility,
        }
      })
      const labels = [...svgNode.querySelectorAll('text')].map((node) => ({
        id: node.getAttribute('data-label-id'),
        text: node.textContent,
        bounds: bbox(node),
        finalTextPx: Number.parseFloat(getComputedStyle(node).fontSize) * Math.hypot(node.getScreenCTM().a, node.getScreenCTM().b),
        fill: getComputedStyle(node).fill,
      }))
      const visiblePoints = [...svgNode.querySelectorAll('ellipse')].filter((node) =>
        getComputedStyle(node).display !== 'none' && getComputedStyle(node).visibility === 'visible',
      ).map((node) => ({ id: node.id, at: [node.cx.baseVal.value, node.cy.baseVal.value], bounds: bbox(node) }))
      const heads = [...svgNode.querySelectorAll('[data-arrowhead-for]')].map((node) => ({
        shaft: node.getAttribute('data-arrowhead-for'), bounds: bbox(node), fill: getComputedStyle(node).fill,
      }))
      const labelCollisions = []
      for (let i = 0; i < labels.length; i++) {
        for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i].bounds
          const b = labels[j].bounds
          if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
            Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)) {
            labelCollisions.push([labels[i].id, labels[j].id])
          }
        }
      }
      const initialScroll = frame.scrollLeft
      frame.scrollLeft = frame.scrollWidth
      const maxScroll = frame.scrollWidth - frame.clientWidth
      const scrollEnd = frame.scrollLeft
      frame.scrollLeft = initialScroll
      const computed = getComputedStyle(media)
      return {
        mediaWidthPx: media.getBoundingClientRect().width,
        svgWidthPx: bounds.width,
        svgHeightPx: bounds.height,
        viewportContainerWidthPx: frame.clientWidth,
        maxScrollPx: maxScroll,
        scrollEndPx: scrollEnd,
        scrollEndReachable: Math.abs(scrollEnd - maxScroll) <= 1,
        minimumTextPx: Math.min(...labels.map((label) => label.finalTextPx)),
        lines, heads, labels, visiblePoints, labelCollisions,
        clippedLabels: labels.filter(({ bounds: b }) =>
          b.x < 0 || b.y < 0 || b.x + b.width > bounds.width || b.y + b.height > bounds.height).map((label) => label.id),
        semanticVariables: Object.fromEntries(['ink', 'muted', 'accent', 'accent-soft', 'grid', 'paper'].map((name) =>
          [name, computed.getPropertyValue(`--ld-figure-${name}`).trim()])),
      }
    })
    assert.equal(observation.mediaWidthPx, 640)
    assert.equal(observation.svgWidthPx, 640)
    assert.equal(observation.lines.length, 8)
    assert.equal(observation.heads.length, 8)
    assert.equal(observation.labels.length, 12)
    assert.equal(observation.minimumTextPx, 28)
    assert.deepEqual(observation.labelCollisions, [])
    assert.deepEqual(observation.clippedLabels, [])
    assert(observation.scrollEndReachable)
    assert(observation.lines.every((line) => line.length > 0 && line.strokeWidth >= 3 &&
      line.stroke !== 'none' && line.visibility === 'visible' && line.display !== 'none'))
    const line = (id) => observation.lines.find((node) => node.id === `ld-fig-226_ld-${id}`)
    assert.deepEqual(line('axis-X').from, [135, 245])
    assert.deepEqual(line('axis-X1').from, [270, 245])
    assert.equal(line('axis-X').to[1], line('axis-X1').to[1])
    assert(line('axis-X').to[0] < line('axis-X1').to[0])
    for (const id of ['axis-Y', 'axis-Y1']) assert(line(id).to[1] < line(id).from[1])
    for (const id of ['axis-Z', 'axis-Z1']) {
      assert(line(id).to[0] < line(id).from[0])
      assert(line(id).to[1] > line(id).from[1])
    }
    for (const id of ['velocity-v', 'velocity-v1']) {
      assert(line(id).to[0] > line(id).from[0])
      assert.equal(line(id).to[1], line(id).from[1])
    }
    assert.deepEqual(line('velocity-v').from, [270, 110])
    assert.deepEqual(line('velocity-v1').from, [392, 182])
    if (item.capture) {
      const screenshotPath = path.join(own, `${item.name}-actual-svg.png`)
      const screenshot = await page.locator('.sr-figure-media svg').screenshot({ path: screenshotPath, animations: 'disabled' })
      const pixels = await page.evaluate(async ({ image, lines }) => {
        const bitmap = new Image()
        bitmap.src = `data:image/png;base64,${image}`
        await bitmap.decode()
        const canvas = document.createElement('canvas')
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(bitmap, 0, 0)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        const paintedNear = (x, y) => {
          let count = 0
          for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) {
            const at = ((Math.round(y) + dy) * canvas.width + Math.round(x) + dx) * 4
            if (data[at + 3] > 0 && (data[at] < 220 || data[at + 1] < 220 || data[at + 2] < 220)) count++
          }
          return count
        }
        return {
          widthPx: bitmap.width,
          heightPx: bitmap.height,
          shafts: lines.map((line) => ({
            id: line.id,
            paintedSampleCounts: Array.from({ length: 9 }, (_, i) => {
              const t = 0.1 + i * 0.1
              return paintedNear(line.from[0] + t * (line.to[0] - line.from[0]),
                line.from[1] + t * (line.to[1] - line.from[1]))
            }),
          })),
        }
      }, { image: screenshot.toString('base64'), lines: observation.lines })
      assert.equal(pixels.widthPx, 640)
      assert.equal(pixels.heightPx, 400)
      assert(pixels.shafts.every((shaft) => shaft.paintedSampleCounts.every((count) => count > 0)))
      observation.actualScreenshotPixelChecks = pixels
      report.screenshots.push(record(screenshotPath))
    }
    if (item.captureMobile) {
      await page.locator('[data-figure-layout]').evaluate((node) => { node.scrollLeft = node.scrollWidth })
      const screenshotPath = path.join(own, `${item.name}-scroll-end.png`)
      await page.screenshot({ path: screenshotPath, animations: 'disabled' })
      report.screenshots.push(record(screenshotPath))
    }
    report.observations.push({ case: item.name, viewport: item.viewport, theme: item.theme,
      surface: item.surface, printMedia: Boolean(item.print), ...observation })
  }
  assert.deepEqual(errors, [])
  report.pageErrors = errors
  report.measurementStatus = 'pass'
} catch (error) {
  report.measurementStatus = 'fail'
  report.executionError = String(error)
  throw error
} finally {
  await browser.close()
  report.inputsAfter = inputFiles.map(record)
  report.inputsUnchanged = JSON.stringify(report.inputsBefore) === JSON.stringify(report.inputsAfter)
  write('browser-evidence.json', report)
}
assert(report.inputsUnchanged)
console.log(JSON.stringify({
  headed: true,
  measurementStatus: report.measurementStatus,
  mediaWidths: report.observations.map((item) => [item.case, item.mediaWidthPx]),
  shafts: 8,
  arrowheads: 8,
  labels: 12,
  minimumTextPx: 28,
  actualScreenshotPixelSamplesPass: true,
  screenshots: report.screenshots,
  inputsUnchanged: report.inputsUnchanged,
}, null, 2))
