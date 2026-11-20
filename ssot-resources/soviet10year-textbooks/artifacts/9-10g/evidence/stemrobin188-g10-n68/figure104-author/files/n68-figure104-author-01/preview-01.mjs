import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from '../retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const root = path.join(tmp, 'n68-figure104-author-01')
const specPath = path.join(root, 'fig-g10-104.repair01.spec.json')
const svgPath = path.join(root, 'fig-g10-104.repair01.svg')
const renderPath = path.join(root, 'fig-g10-104.repair01.render.json')
const spec = read(specPath)
const render = read(renderPath)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specPath))
assert.equal(render.output.svg.sha256, hash(svgPath))
assert.ok(!fs.existsSync(path.join(root, 'preview-request.json')))
save(path.join(root, 'preview-request.json'), {
  spec: bind(specPath), svg: bind(svgPath), render: bind(renderPath),
  widths: spec.display.widths, headless: true, remoteRequestsAllowed: false,
  parentImageLoadsBeforePreviews: 17, published: false,
})
const appRequire = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = appRequire('@playwright/test')
const browser = await chromium.launch({ headless: true })
const screenshots = []
try {
  const page = await browser.newPage({ serviceWorkers: 'block', deviceScaleFactor: 1 })
  const network = []
  await page.route('**/*', route => {
    network.push(route.request().url())
    return route.abort()
  })
  await page.setContent(`<!doctype html><html><head><style>
    :root{--ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;--ld-figure-accent:#15201f;
    --ld-figure-accent-soft:#8a9795;--ld-figure-grid:#e3eae9;--ld-figure-paper:#ffffff}
    html,body{margin:0;padding:0;background:#fff;overflow:hidden}
    svg{display:block;background:#fff}
    </style></head><body>${fs.readFileSync(svgPath, 'utf8')}</body></html>`)
  await page.evaluate(() => document.fonts.ready)
  for (const width of spec.display.widths) {
    const height = Math.ceil(spec.canvas.height * width / spec.canvas.width)
    await page.setViewportSize({ width, height })
    const metrics = await page.evaluate(({ width, minTextPx }) => {
      const svg = document.querySelector('svg')
      svg.setAttribute('width', String(width))
      svg.removeAttribute('height')
      svg.style.width = `${width}px`
      svg.style.height = 'auto'
      const bounds = svg.getBoundingClientRect()
      const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
        const rect = node.getBoundingClientRect()
        const matrix = node.getScreenCTM()
        const px = Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b)
        return { id: node.dataset.labelId, text: node.textContent, px,
          bounded: rect.left >= 0 && rect.top >= 0 && rect.right <= bounds.width + 0.1
            && rect.bottom <= bounds.height + 0.1, readable: px >= minTextPx }
      })
      return { width, height: bounds.height, labels }
    }, { width, minTextPx: spec.display.minTextPx })
    assert.equal(metrics.labels.length, render.labels)
    assert.ok(metrics.labels.every(item => item.bounded && item.readable))
    const screenshot = path.join(root, `fig-g10-104-${width}.png`)
    await page.screenshot({ path: screenshot })
    const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
    const args = ['-B', '-c', `
import json,sys
from PIL import Image
image=Image.open(sys.argv[1]).convert("RGB")
scale=float(sys.argv[2])/640
samples={"semicircle_top":(320,80),"horizontal_axis":(90,280),
         "vertical_axis":(320,45),"interior_hatch":(262,210)}
result={}
for name,(x,y) in samples.items():
    x,y=round(x*scale),round(y*scale)
    values=[image.getpixel((a,b)) for a in range(max(0,x-2),min(image.width,x+3))
            for b in range(max(0,y-2),min(image.height,y+3))]
    result[name]=any(max(value)<190 for value in values)
assert all(result.values()),result
print(json.dumps(result))
`, screenshot, String(width)]
    const pixels = spawnSync(command, args, { cwd: repo, encoding: 'utf8' })
    save(path.join(root, `${width}.pixel-check.command.json`), {
      command, args, cwd: repo, exitCode: pixels.status,
      stdout: pixels.stdout, stderr: pixels.stderr,
    })
    assert.equal(pixels.status, 0, pixels.stderr)
    save(path.join(root, `${width}.metrics.json`), {
      ...metrics, pixelSamples: JSON.parse(pixels.stdout), screenshot: bind(screenshot),
      spec: bind(specPath), svg: bind(svgPath), semanticApproval: false,
    })
    screenshots.push(bind(screenshot))
  }
  assert.deepEqual(network, [])
  save(path.join(root, 'preview-result.json'), {
    status: 'pass-mechanical-only-visual-inspection-pending', screenshots,
    rendererCalls: 0, geometryBytesUnchanged: true, published: false,
  })
} finally {
  await browser.close()
}
