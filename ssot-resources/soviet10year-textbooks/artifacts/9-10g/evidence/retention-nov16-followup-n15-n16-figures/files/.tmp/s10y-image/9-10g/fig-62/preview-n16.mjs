import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = process.cwd()
const base = path.join(root, '.tmp/s10y-image/9-10g')
const require = createRequire(path.join(root,'app/package.json'))
const { chromium } = require('playwright')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const cssPath = path.join(root,'app/src/styles/app.css')
const css = fs.readFileSync(cssPath,'utf8')
const routePath = path.join(root,'app/src/routes/_app/card.$id.tsx')
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH,
  chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file))
assert(executablePath)
const browser = await chromium.launch({ executablePath, headless: false })
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 })
  await context.route('**/*', route => route.abort())
  const page = await context.newPage()
  for (const number of [62,63,64,65]) {
    const id = `fig-${number}`, directory = path.join(base,id)
    const specPath = path.join(directory,`${id}.spec.json`)
    const svgPath = path.join(directory,`${id}.svg`)
    const renderPath = path.join(directory,`${id}.render.json`)
    const specBytes = fs.readFileSync(specPath), spec = JSON.parse(specBytes)
    const svgBytes = fs.readFileSync(svgPath), renderBytes = fs.readFileSync(renderPath)
    const render = JSON.parse(renderBytes)
    assert.equal(render.status,'pass')
    assert.equal(render.spec.sha256,hash(specBytes))
    assert.equal(render.output.svg.sha256,hash(svgBytes))
    const evidence = {
      schema: 'ticket-scratch/n16-figure-display@1', figure: id,
      scope: 'Headed offline current-CSS figure projection; not lesson/app acceptance or independent review.',
      launch: { headed: true, executablePath, isolatedProfile: true, network: 'blocked' },
      bindings: [
        { path: specPath, sha256: hash(specBytes) },
        { path: svgPath, sha256: hash(svgBytes) },
        { path: renderPath, sha256: hash(renderBytes) },
        { path: cssPath, sha256: hash(css) },
        { path: routePath, sha256: hash(fs.readFileSync(routePath)) },
      ],
      cases: [], independentReview: 'pending',
    }
    for (const viewport of [{ width: 1440, height: 960 },{ width: 390, height: 844 }]) {
      await page.setViewportSize(viewport)
      const columnWidth = viewport.width === 390 ? 346 : 720
      const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style>
        <style>body{margin:0;font-size:16px;background:var(--sr-white)}
        main{width:${columnWidth}px;margin:0 auto}figure{margin-inline:0}</style></head>
        <body><main>
        <div class="sr-read"><figure class="sr-read-fig" data-figure-layout="scroll" data-surface="prose">
        <div class="sr-figure-media" data-figure-purpose="instructional" data-figure-mode="deterministic" data-figure-theme="neutral">
        <div class="sr-figure-vector" aria-hidden="true">${svgBytes}</div></div></figure></div>
        <figure class="sr-ex-fig" data-figure-layout="scroll" data-surface="minimum-640">
        <div class="sr-figure-media" data-figure-purpose="instructional" data-figure-mode="deterministic" data-figure-theme="neutral">
        <div class="sr-figure-vector" aria-hidden="true">${svgBytes}</div></div></figure>
        </main></body></html>`
      const htmlPath = path.join(directory,`${id}.display-${viewport.width}.html`)
      assert(!fs.existsSync(htmlPath),'Do not overwrite display evidence')
      fs.writeFileSync(htmlPath,html)
      await page.setContent(html,{ waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      const metrics = await page.evaluate(() => {
        return [...document.querySelectorAll('figure')].map(figure => {
          const media = figure.querySelector('.sr-figure-media')
          const svg = media.querySelector('svg')
          const rect = svg.getBoundingClientRect()
          const labels = [...svg.querySelectorAll('text')].map(node => {
            const matrix = node.getScreenCTM(), box = node.getBBox()
            const corners = [[box.x,box.y],[box.x+box.width,box.y],
              [box.x,box.y+box.height],[box.x+box.width,box.y+box.height]]
              .map(([x,y]) => new DOMPoint(x,y).matrixTransform(matrix))
            return {
              id: node.getAttribute('data-label-id'), text: node.textContent,
              px: parseFloat(getComputedStyle(node).fontSize)*Math.hypot(matrix.a,matrix.b),
              clippedBySvg: corners.some(point => point.x < rect.left-.01 ||
                point.x > rect.right+.01 || point.y < rect.top-.01 || point.y > rect.bottom+.01),
              fill: getComputedStyle(node).fill,
            }
          })
          figure.scrollLeft = figure.scrollWidth
          const reachedEnd = Math.abs(figure.scrollLeft+figure.clientWidth-figure.scrollWidth) <= 1
          const scrollEnd = figure.scrollLeft
          figure.scrollLeft = 0
          return {
            surface: figure.dataset.surface,
            width: media.getBoundingClientRect().width, svgWidth: rect.width, svgHeight: rect.height,
            labels, minTextPx: Math.min(...labels.map(label => label.px)),
            scrollWidth: figure.scrollWidth, viewportWidth: figure.clientWidth, scrollEnd, reachedEnd,
          }
        })
      })
      for (const metric of metrics) {
        assert.equal(metric.labels.length,render.labels)
        assert(metric.minTextPx >= 16)
        assert(metric.labels.every(label => !label.clippedBySvg && label.fill !== 'none'))
        assert(metric.width >= 640)
        assert.equal(metric.width,metric.svgWidth)
        assert.equal(metric.reachedEnd,true)
      }
      const safety = metrics.find(metric => metric.surface === 'minimum-640')
      assert.equal(safety.width,640,'Actual fixed 640 media at default 16px parent')
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true)
      evidence.cases.push({ viewport, columnWidth, html: { path: htmlPath, sha256: hash(html) }, metrics })
      if (viewport.width === 1440) {
        // Exactly one raster per output. No source-sized PNG, mobile screenshot,
        // contact sheet, crop or additional raster is generated.
        const viewPath = path.join(directory,`${id}.view-640.png`)
        assert(!fs.existsSync(viewPath),'One output image only')
        const bytes = await page.locator('[data-surface="minimum-640"] .sr-figure-media').screenshot({
          path: viewPath, animations: 'disabled',
        })
        const pixels = await page.evaluate(async base64 => {
          const image = await createImageBitmap(new Blob([
            Uint8Array.from(atob(base64),c => c.charCodeAt(0)),
          ],{ type: 'image/png' }))
          const canvas = document.createElement('canvas')
          canvas.width = image.width; canvas.height = image.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(image,0,0)
          const data = ctx.getImageData(0,0,canvas.width,canvas.height).data
          let dark = 0, light = 0
          for (let index = 0; index < data.length; index += 4) {
            if (data[index] < 150 && data[index+1] < 150 && data[index+2] < 150) dark++
            if (data[index] > 240 && data[index+1] > 240 && data[index+2] > 240) light++
          }
          image.close()
          return { width: canvas.width, height: canvas.height, dark, light }
        },bytes.toString('base64'))
        assert.equal(pixels.width,640)
        assert(pixels.dark > 500 && pixels.light > pixels.width*pixels.height*.7)
        evidence.outputView = { path: viewPath, sha256: hash(bytes), pixels }
      }
      console.log(`${id} ${viewport.width}: ${metrics.map(metric => `${metric.surface} ${metric.width}px / labels ${metric.minTextPx}px`).join('; ')}`)
    }
    const evidencePath = path.join(directory,'display-evidence.json')
    assert(!fs.existsSync(evidencePath))
    fs.writeFileSync(evidencePath,`${JSON.stringify(evidence,null,2)}\n`)
  }
} finally {
  await browser.close()
}
