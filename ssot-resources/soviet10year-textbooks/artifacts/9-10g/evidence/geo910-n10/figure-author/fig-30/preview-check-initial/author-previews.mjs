import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

delete process.env.PWDEBUG
const repo = process.cwd()
const require = createRequire(path.join(repo, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((file) => file && fs.existsSync(file))
assert.ok(executablePath, 'Existing Chromium executable required')

const browser = await chromium.launch({ executablePath, headless: true })
let failed = false
try {
  for (const number of [30, 31]) {
    const root = path.join(repo, `.tmp/s10y-image/9-10g/fig-${number}`)
    const specPath = path.join(root, 'spec.json')
    const svgPath = path.join(root, `fig-${number}.svg`)
    const renderPath = path.join(root, `fig-${number}.render.json`)
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
    const render = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
    const contextPath = path.join(root, 'context.json')
    const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'))
    assert.equal(render.spec.sha256, sha(specPath), 'Current spec binding')
    assert.equal(render.output.svg.sha256, sha(svgPath), 'Current SVG binding')
    assert.equal(sha(path.join(repo, spec.source.image.path)), spec.source.image.sha256, 'Current original PNG hash')
    assert.deepEqual(
      spec.source.authoritativeText.map((item) => item.text),
      context.lessons.flatMap((item) => item.prose.flatMap((block) => block.nearbyText)),
      'Complete official context text',
    )
    const svg = fs.readFileSync(svgPath, 'utf8')
    const screenshots = []
    for (const [width, theme] of [[240, 'neutral'], [346, 'print']]) {
      const height = Math.ceil(width * spec.canvas.height / spec.canvas.width)
      const page = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: 1,
      })
      await page.route('**/*', (route) => route.abort())
      const ink = theme === 'print' ? '#000000' : '#19211f'
      const muted = theme === 'print' ? '#000000' : '#53605c'
      await page.setContent(`<!doctype html><meta charset="utf-8">
        <style>
          :root { --ld-figure-ink:${ink}; --ld-figure-muted:${muted};
            --ld-figure-accent:${ink}; --ld-figure-accent-soft:#89948f;
            --ld-figure-grid:#dedfdd; --ld-figure-paper:#ffffff; }
          html,body { margin:0; padding:0; background:white; }
          #canvas { width:${width}px; }
          #canvas > svg { display:block; width:100%; height:auto; }
        </style><div id="canvas">${svg}</div>`)
      await page.evaluate((width) => {
        const node = document.querySelector('#canvas > svg')
        node.setAttribute('width', String(width))
        node.removeAttribute('height')
      }, width)
      await page.evaluate(() => document.fonts.ready)
      const measured = await page.evaluate(() => {
        const svg = document.querySelector('#canvas > svg')
        const canvas = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map((node) => {
          const matrix = node.getScreenCTM()
          const box = node.getBoundingClientRect()
          return {
            id: node.getAttribute('data-label-id'),
            text: node.textContent,
            px: Number.parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            clipped: box.left < canvas.left - 0.5 || box.top < canvas.top - 0.5 ||
              box.right > canvas.right + 0.5 || box.bottom > canvas.bottom + 0.5,
          }
        })
        return { canvas: { width: canvas.width, height: canvas.height }, labels }
      })
      const filename = `preview-${width}-${theme}.png`
      await page.locator('#canvas > svg').screenshot({ path: path.join(root, filename) })
      const errors = []
      if (Math.abs(measured.canvas.width - width) > 0.5) errors.push('Actual media width differs')
      if (Math.abs(measured.canvas.height - width * spec.canvas.height / spec.canvas.width) > 0.5) errors.push('Canvas aspect ratio differs')
      if (measured.labels.length !== render.labels.length) errors.push('Label count differs from renderer')
      if (measured.labels.some((item) => item.px < 16 - 0.01)) errors.push('Text below16px')
      if (measured.labels.some((item) => item.clipped)) errors.push('Clipped text')
      failed ||= errors.length > 0
      screenshots.push({
        filename, width, theme,
        sha256: sha(path.join(root, filename)),
        outcome: errors.length ? 'FAIL' : 'PASS_AUTHOR_DISPLAY_CHECK',
        errors, ...measured,
      })
      await page.close()
    }
    const files = ['context.json', 'author-source-inventory.md', 'spec.json',
      `fig-${number}.svg`, `fig-${number}.render.json`, 'preview-native.png',
      'first-render/spec.json', 'first-render/attempt.json']
    const report = {
      figure: spec.id,
      role: 'author evidence only; no independent review or promotion',
      firstCallExit: 1,
      firstCallStage: 'draft validation stopped before browser',
      repairCount: 1,
      repairScope: 'objectCount.equals -> objectCount.count only',
      onlyActualBrowserRenderExit: 0,
      rendererStatus: render.status,
      collisions: render.collisions,
      displayChecks: render.displayChecks,
      sourceHashCurrent: true,
      completeOfficialContextTextMatch: true,
      files: Object.fromEntries(files.map((file) => [file, sha(path.join(root, file))])),
      screenshots,
    }
    fs.writeFileSync(path.join(root, 'author-preview-report.json'), JSON.stringify(report, null, 2) + '\n')
    console.log(JSON.stringify(report, null, 2))
  }
} finally {
  await browser.close()
}
process.exitCode = failed ? 2 : 0
