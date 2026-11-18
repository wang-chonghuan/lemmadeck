import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const cssPath = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssPath, 'utf8')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const pin = file => ({path: file, sha256: hash(file), bytes: fs.statSync(file).size})
const output = path.join(own, 'native-svg-browser-check.json')
assert(!fs.existsSync(output), 'No repeated browser check')
const browser = await chromium.launch({headless: true})
const observations = []
try {
  const context = await browser.newContext({deviceScaleFactor: 1})
  await context.route('**/*', route => route.abort())
  const page = await context.newPage()
  for (const n of [179, 180]) {
    const file = path.join(own, `fig-${n}.repair1.svg`)
    const bytes = fs.readFileSync(file, 'utf8')
    const initialHash = hash(file)
    const spec = JSON.parse(fs.readFileSync(path.join(own, `fig-${n}.repair1.spec.json`), 'utf8'))
    const model = JSON.parse(fs.readFileSync(path.join(own, `fig-${n}.physical-geometry.json`), 'utf8'))
    assert.equal(JSON.parse(fs.readFileSync(path.join(own, `fig-${n}.repair1.render.json`), 'utf8')).status, 'pass')
    for (const width of [640, 342, 331]) {
      await page.setViewportSize({width, height: Math.ceil(width * 520 / 640)})
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"></head><body><div id="figure" class="sr-figure-media">${bytes}</div></body></html>`)
      await page.evaluate(({css, width}) => {
        // Parse existing token/media CSS; constructed sheets never fetch @imports.
        const sheet = new CSSStyleSheet()
        sheet.replaceSync(css)
        document.adoptedStyleSheets = [sheet]
        const framing = new CSSStyleSheet()
        framing.replaceSync(`html,body{margin:0;width:${width}px;height:auto;overflow:visible;background:var(--sr-white)}#figure{margin:0;width:${width}px;max-width:none}#figure svg{display:block;width:100%;height:auto}`)
        document.adoptedStyleSheets = [sheet, framing]
      }, {css, width})
      await page.evaluate(() => document.fonts.ready)
      const state = await page.evaluate(({spec, model, width}) => {
        const svg = document.querySelector('#figure > svg')
        const rect = svg.getBoundingClientRect()
        const scale = svg.getScreenCTM()
        const texts = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          const r = node.getBoundingClientRect()
          return {id: node.getAttribute('data-label-id'), text: node.textContent,
            px: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b),
            x: r.x, y: r.y, width: r.width, height: r.height,
            fill: getComputedStyle(node).fill}
        })
        const collisions = []
        for (let i = 0; i < texts.length; i++) {
          const a = texts[i]
          if (a.x < -0.1 || a.y < -0.1 || a.x + a.width > rect.right + 0.1 || a.y + a.height > rect.bottom + 0.1)
            collisions.push({id: a.id, kind: 'clipped'})
          for (const b of texts.slice(i + 1)) {
            if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) &&
                Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y))
              collisions.push({a: a.id, b: b.id, kind: 'text-overlap'})
          }
        }
        const strokes = spec.objects.filter(o => o.type === 'segment' || o.type === 'arrow').map(o => {
          const node = document.getElementById(`ld-fig-${spec.id.split('-')[1]}_ld-${o.id}`)
          if (!node) return {id: o.id, missing: true}
          const style = getComputedStyle(node)
          return {id: o.id, stroke: style.stroke, px: parseFloat(style.strokeWidth) * Math.hypot(scale.a, scale.b),
            dash: node.getAttribute('stroke-dasharray'), expectedDash: !!o.dash,
            from: [node.x1.baseVal.value, node.y1.baseVal.value],
            to: [node.x2.baseVal.value, node.y2.baseVal.value]}
        })
        const arrowheads = [...svg.querySelectorAll('[data-arrowhead-for]')].map(node => ({
          line: node.getAttribute('data-arrowhead-for'),
          transform: node.getAttribute('transform'), fill: getComputedStyle(node).fill,
        }))
        const roleStyle = getComputedStyle(document.getElementById('figure'))
        const roles = Object.fromEntries(['ink', 'muted', 'accent', 'accent-soft', 'grid', 'paper'].map(role =>
          [role, roleStyle.getPropertyValue(`--ld-figure-${role}`).trim()]))
        return {figure: spec.id, cssWidth: width, rect: {width: rect.width, height: rect.height},
          texts, measuredMinPx: Math.min(...texts.map(t => t.px)), collisions,
          strokes, arrowheads, expectedArrowheads: model.expectedArrowheads, roles,
          sourceLabelsMatch: JSON.stringify(texts.map(t => t.text).sort()) === JSON.stringify([...model.expectedLabels].sort()),
          allSourceObjectsInSingleSVG: document.querySelectorAll('#figure svg').length === 1,
        }
      }, {spec, model, width})
      assert(Math.abs(state.rect.width - width) < 0.01)
      assert(state.measuredMinPx >= 16)
      if (width === 342) assert(state.measuredMinPx >= 17)
      assert.equal(state.sourceLabelsMatch, true)
      assert.equal(state.allSourceObjectsInSingleSVG, true)
      assert.equal(state.arrowheads.length, model.expectedArrowheads)
      assert.deepEqual(state.collisions, [])
      assert(state.strokes.every(s => !s.missing && s.stroke !== 'none' && s.stroke !== 'rgba(0, 0, 0, 0)' && s.px > 1))
      assert(state.strokes.every(s => s.expectedDash ? !!s.dash && s.dash !== 'none' : !s.dash || s.dash === 'none'))
      assert(Object.values(state.roles).every(Boolean))
      if (width !== 331) {
        const screenshot = path.join(own, `fig-${n}.repair1.${width === 640 ? 'full-native' : 'actual342'}.png`)
        assert(!fs.existsSync(screenshot), 'No repeated screenshot')
        const buffer = await page.locator('#figure > svg').screenshot({path: screenshot, animations: 'disabled'})
        const pixels = await page.evaluate(async data => {
          const bitmap = await createImageBitmap(new Blob([new Uint8Array(data)], {type: 'image/png'}))
          const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
          const ctx = canvas.getContext('2d')
          ctx.drawImage(bitmap, 0, 0)
          const rgba = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data
          let ink = 0, paper = 0
          for (let p = 0; p < rgba.length; p += 4) {
            if (Math.max(rgba[p], rgba[p + 1], rgba[p + 2]) < 190) ink++
            if (Math.min(rgba[p], rgba[p + 1], rgba[p + 2]) > 245) paper++
          }
          bitmap.close()
          return {width: canvas.width, height: canvas.height, ink, paper}
        }, [...buffer])
        assert(pixels.ink > 1000, 'Blank or missing-stroke screenshot')
        assert(pixels.paper > pixels.width * pixels.height * 0.5, 'Broken dark raster')
        state.screenshot = pin(screenshot)
        state.pixelCheck = pixels
      }
      state.status = 'AUTHOR-BROWSER-MECHANICAL-PASS-NOT-INDEPENDENT-DISPLAY'
      observations.push(state)
      assert.equal(hash(file), initialHash, 'Native SVG mutated')
    }
  }
} finally {
  await browser.close()
}
fs.writeFileSync(output, JSON.stringify({
  schema: 'd604/native-svg-browser-check@1',
  status: 'AUTHOR-MECHANICAL-CHECKS-PASS-INDEPENDENT-GATES-PENDING',
  engine: 'isolated headless Chromium', applicationCSS: pin(cssPath),
  sourceSVGBytesUnmodified: true, directResvgUsed: false, screenshotsCreated: 4,
  nativeRendererRerunByBrowserCheck: false, headedProductAcceptance: false,
  independentFIG: 'pending', independentDISPLAY: 'pending', fullcard: 'pending',
  observations,
}, null, 2) + '\n')
console.log(`Four exact native-SVG screenshots; six CSS-width observations; browser closed. ${output}`)
