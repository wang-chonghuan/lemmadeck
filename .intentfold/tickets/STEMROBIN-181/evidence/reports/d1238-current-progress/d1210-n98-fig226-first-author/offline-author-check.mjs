import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
const require = createRequire(path.join(repo, '.agents/skills/package.json'))
const { chromium } = require('playwright-core')
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const evidence = (file) => ({
  path: path.relative(repo, path.join(root, file)),
  sha256: hash(path.join(root, file)),
})
const spec = read('fig-226.spec.json')
const first = read('FIRST/fig-226.spec.json')
const lessonFile = 'root/10p/editions/modern-us-neutral/lessons/phy10-c2-s4-n98/lesson.json'
const exerciseFile = 'root/10p/editions/modern-us-neutral/lessons/phy10-c2-s4-n98/exercises.json'
const lesson = read(lessonFile)
const context = read('context.json')
const inventory = read('source.inventory.json')
assert.equal(hash(path.join(root, lessonFile)), '7325e56da119f70dbb05295115544e127507d19138ec79aee8bf21c894d8c3f0')
assert.equal(hash(path.join(root, exerciseFile)), 'f4c916c262cfd3aa15dacf972deb4943d0c961cfab0a94dddaf389ef96ca2d26')
assert.equal(hash(path.join(root, 'source.inventory.json')), '57eb0331a3e60cadd755bc35ce6a462453dbc23334590f5595b7e7310953f8ec')
assert.equal(context.sourceImage.sha256, inventory.source.sha256)
assert.deepEqual([context.sourceImage.width, context.sourceImage.height], [508, 309])
assert.deepEqual(inventory.source.observed_pixel_extent, [508, 311])
assert.deepEqual(spec.source.authoritativeText.map((item) => item.text), lesson.prose.filter((block) => block.kind === 'p').map((block) => block.text))
assert.deepEqual(spec.assertions, first.assertions)
assert.deepEqual(spec.source, first.source)
const firstNormalized = structuredClone(first)
firstNormalized.objects.find((object) => object.id === 'origin-O1').labelPlacement.offset = [0, -10]
assert.deepEqual(spec, firstNormalized)
const arrows = spec.objects.filter((object) => object.type === 'arrow')
for (const arrow of arrows) {
  assert(spec.assertions.some((item) => item.type === 'connects' && item.arrow === arrow.id))
}
assert.equal(spec.assertions.some((item) => item.type === 'objectCount'), false)

const validation = spawnSync('python3', [
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  path.join(root, 'fig-226.spec.json'), '--stage', 'draft', '--json',
], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
assert.equal(validation.status, 0, validation.stdout || validation.stderr)
const validationReport = JSON.parse(validation.stdout)
fs.writeFileSync(path.join(root, 'spec-validation.json'), `${JSON.stringify(validationReport, null, 2)}\n`)

const cssFile = path.join(repo, 'app/src/styles/app.css')
const css = fs.readFileSync(cssFile, 'utf8')
const svg = fs.readFileSync(path.join(root, 'fig-226.svg'), 'utf8')
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: false,
  args: ['--disable-background-networking', '--disable-sync', '--no-first-run'],
})
const measurements = []
let blockedRequests = 0
try {
  const browserContext = await browser.newContext()
  await browserContext.route('**/*', (route) => {
    blockedRequests += 1
    return route.abort()
  })
  const page = await browserContext.newPage()
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 960 }]) {
    await page.setViewportSize(viewport)
    for (const surface of ['sr-read-fig', 'sr-ex-fig']) {
      await page.setContent(`<!doctype html><meta charset="utf-8">
        <style>${css}</style>
        <main style="width:300px;font-size:16px">
          <div class="${surface}" data-figure-layout="scroll">
            <div class="sr-figure-media">${svg}</div>
          </div>
        </main>`)
      const result = await page.evaluate(() => {
        const frame = document.querySelector('[data-figure-layout]')
        const media = document.querySelector('.sr-figure-media')
        const svgElement = media.querySelector('svg')
        const text = [...svgElement.querySelectorAll('text')].map((node) => {
          const matrix = node.getScreenCTM()
          return {
            id: node.getAttribute('data-label-id'),
            text: node.textContent,
            px: Number.parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b),
          }
        })
        const shafts = [...svgElement.querySelectorAll('line, path')].filter((node) =>
          /ld-(axis-|velocity-)/.test(node.id) && !node.closest('defs'),
        ).map((node) => ({
          id: node.id,
          stroke: getComputedStyle(node).stroke,
          strokeWidth: getComputedStyle(node).strokeWidth,
          visibility: getComputedStyle(node).visibility,
          length: typeof node.getTotalLength === 'function' ? node.getTotalLength() : null,
        }))
        frame.scrollLeft = frame.scrollWidth
        const maxScroll = frame.scrollWidth - frame.clientWidth
        return {
          containerWidthPx: frame.getBoundingClientRect().width,
          mediaWidthPx: media.getBoundingClientRect().width,
          svgWidthPx: svgElement.getBoundingClientRect().width,
          minimumTextPx: Math.min(...text.map((item) => item.px)),
          text,
          shafts,
          scrollLeft: frame.scrollLeft,
          maxScroll,
          scrollEndReachable: Math.abs(frame.scrollLeft - maxScroll) <= 1,
        }
      })
      assert.equal(result.mediaWidthPx, 640)
      assert.equal(result.svgWidthPx, 640)
      assert(result.minimumTextPx >= 16)
      assert(result.scrollEndReachable)
      assert.equal(result.text.length, 12)
      assert.equal(result.shafts.length, 8)
      assert(result.shafts.every((shaft) => shaft.stroke !== 'none' && shaft.length > 0 && shaft.visibility === 'visible'))
      measurements.push({ viewport, surface, ...result })
    }
  }
} finally {
  await browser.close()
}
const widthReport = {
  schema: 'figure-author-offline-width-check/v1',
  authority: 'Headed Chromium loads the unchanged candidate SVG with current product CSS. This is a restricted offline media-width harness, not a live card-page or complete-lesson acceptance check. The deliberately narrow 300 px host checks scroll-media independence from the containing column.',
  network: { allowed: false, blockedRequests },
  svg: evidence('fig-226.svg'),
  productCss: { path: path.relative(repo, cssFile), sha256: hash(cssFile) },
  measurements,
  measurementStatus: 'pass',
  visualApproval: false,
  independentFigureReview: 'pending',
}
fs.writeFileSync(path.join(root, 'offline-product-width.json'), `${JSON.stringify(widthReport, null, 2)}\n`)
console.log(JSON.stringify({
  exactContextCopies: true,
  frozenInventoryUnchanged: true,
  completeAuthoritativeProse: spec.source.authoritativeText.length,
  connectedSemanticArrows: arrows.length,
  relationshipAssertions: spec.assertions.length,
  repairChangesOnlyO1Offset: true,
  widths: measurements.map((item) => ({ viewport: item.viewport.width, surface: item.surface, media: item.mediaWidthPx, minimumText: item.minimumTextPx, shafts: item.shafts.length })),
  actualRasterPreviewAuthorObservation: 'fail: arrow shafts missing',
  independentFigureReview: 'pending',
}, null, 2))
