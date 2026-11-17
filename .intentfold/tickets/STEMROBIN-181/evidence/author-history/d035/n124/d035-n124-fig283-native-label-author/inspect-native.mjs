import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d035-n124-fig283-native-label-author')
const work = path.join(root, '.tmp/STEMROBIN-181/d035-n124-fig283-native-label')
const require = createRequire(path.join(root, 'app/package.json'))
const { chromium } = require('playwright')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const spec = JSON.parse(fs.readFileSync(path.join(work, 'fig-283.spec.json'), 'utf8'))
const labelIds = spec.objects.filter(object => object.type === 'text').map(object => `${object.id}-label`)
const observations = []
const errors = []
const inspectionFile = path.join(author, 'native-inspection.json')
if (fs.existsSync(inspectionFile)) {
  const initialFile = path.join(author, 'receipts/initial-native-inspection-fail.json')
  assert(!fs.existsSync(initialFile), 'Initial native failure receipt already frozen')
  fs.copyFileSync(inspectionFile, initialFile)
}
const browser = await chromium.launch({ headless: false })
try {
  for (const language of ['en', 'zh']) {
    const html = path.join(work, 'native', language, 'render/phy9-c2-s6-n124/text.html')
    for (const width of spec.display.widths) {
      const page = await browser.newPage({ viewport: { width: width + 32, height: 844 }, deviceScaleFactor: 2 })
      try {
        const pageErrors = []
        page.on('pageerror', error => pageErrors.push(error.message))
        await page.goto(pathToFileURL(html).href)
        await page.evaluate(() => document.fonts.ready)
        const figure = page.locator('figure[id="fig-283"]')
        await figure.scrollIntoViewIfNeeded()
        const observation = await figure.evaluate((element, ids) => {
          const svg = element.querySelector('svg')
          const bounds = svg.getBoundingClientRect()
          const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
            const style = getComputedStyle(node)
            const box = node.getBBox()
            const matrix = node.getScreenCTM()
            const rectangle = node.getBoundingClientRect()
            const corners = [[box.x, box.y], [box.x + box.width, box.y], [box.x, box.y + box.height], [box.x + box.width, box.y + box.height]]
              .map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix))
            const inCanvas = corners.every(point => point.x >= bounds.left && point.x <= bounds.right && point.y >= bounds.top && point.y <= bounds.bottom)
            const minPx = parseFloat(style.fontSize) * Math.hypot(matrix.a, matrix.b)
            return {
              id: node.getAttribute('data-label-id'), text: node.textContent, fontFamily: style.fontFamily,
              fontWeight: style.fontWeight, fontSize: style.fontSize, minPx, inCanvas,
              bbox: { x: box.x, y: box.y, width: box.width, height: box.height },
              screenRect: { x: rectangle.x, y: rectangle.y, width: rectangle.width, height: rectangle.height },
            }
          })
          const overlap = []
          for (let i = 0; i < labels.length; i += 1) {
            for (let j = i + 1; j < labels.length; j += 1) {
              const a = labels[i].screenRect
              const b = labels[j].screenRect
              if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y) overlap.push([labels[i].id, labels[j].id])
            }
          }
          return {
            figureWidth: bounds.width, figureHeight: bounds.height, vectorFontPolicy: svg.getAttribute('data-ld-vector-font'),
            labels, overlap, allExpectedLabels: ids.every(id => labels.some(label => label.id === id)),
            pageOverflow: document.documentElement.scrollWidth > innerWidth,
            errorElements: document.querySelectorAll('.err').length,
            fontFacesLoaded: [...document.fonts].filter(font => font.status === 'loaded').map(font => ({ family: font.family, weight: font.weight, style: font.style })),
          }
        }, labelIds)
        const cdp = await page.context().newCDPSession(page)
        await cdp.send('DOM.enable')
        await cdp.send('CSS.enable')
        const { root: documentNode } = await cdp.send('DOM.getDocument')
        for (const label of observation.labels) {
          const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: documentNode.nodeId, selector: `figure[id="fig-283"] text[data-label-id="${label.id}"]` })
          const platform = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
          label.platformFonts = platform.fonts
        }
        await cdp.detach()
        const screenshot = path.join(work, `fig-283.native-${language}-${width}.png`)
        await figure.screenshot({ path: screenshot })
        if (language === 'en' && width === 342) {
          await page.screenshot({ path: path.join(work, 'fig-283.native-en-342-context.png') })
        }
        observations.push({ language, width, viewportWidth: width + 32, htmlSha256: hash(html), screenshot: { path: screenshot, sha256: hash(screenshot) }, pageErrors, ...observation })
        assert(Math.abs(observation.figureWidth - width) < 0.1)
        assert.equal(observation.vectorFontPolicy, 'katex-main')
        assert(observation.allExpectedLabels)
        assert.equal(observation.labels.length, 3)
        assert.equal(observation.overlap.length, 0)
        assert(!observation.pageOverflow)
        assert.equal(observation.errorElements, 0)
        assert.equal(pageErrors.length, 0)
        for (const label of observation.labels) {
          assert(label.minPx >= spec.display.minTextPx)
          assert(label.inCanvas)
          assert(label.fontFamily.startsWith('KaTeX_Main'))
          if (label.text.includes('\u20d7')) {
            assert(label.platformFonts.some(font => font.familyName === 'KaTeX_Main' && font.isCustomFont && font.glyphCount === 2), `Missing native letter/accent cluster: ${label.id}`)
          } else {
            assert(label.platformFonts.some(font => font.glyphCount > 0), `Missing visible symbol font: ${label.id}`)
          }
        }
      } catch (error) {
        errors.push({ language, width, message: error.message })
      } finally {
        await page.close()
      }
    }
  }
  const bare = await browser.newPage({ viewport: { width: 640, height: 340 } })
  try {
    const svg = fs.readFileSync(path.join(work, 'fig-283.svg'), 'utf8')
    await bare.setContent(`<html><body style="margin:0">${svg}</body></html>`)
    const cdp = await bare.context().newCDPSession(bare)
    await cdp.send('DOM.enable')
    await cdp.send('CSS.enable')
    const { root: documentNode } = await cdp.send('DOM.getDocument')
    const bareFonts = []
    for (const id of labelIds) {
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: documentNode.nodeId, selector: `text[data-label-id="${id}"]` })
      const platform = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
      bareFonts.push({ id, fonts: platform.fonts })
    }
    observations.push({ surface: 'bare-renderer-font-diagnostic', bareFonts, glyphVisualStatus: 'FAIL-see-initial-bare-glyph-fail.json' })
    await cdp.detach()
  } finally {
    await bare.close()
  }
} finally {
  await browser.close()
  fs.writeFileSync(inspectionFile, `${JSON.stringify({
    schema: 'ld-s10y-image/native-author-inspection@1', figure: 'fig-283',
    status: errors.length ? 'fail' : 'pass-mechanical-only-await-pixel-inspection',
    headed: true, browser: 'Chromium from existing app Playwright',
    scope: 'Native offline render_lesson.js previews, not app/DB acceptance or independent review',
    initialCheckCorrection: 'The first run incorrectly required a custom KaTeX glyph for Greek alpha. The contract permits visible mathematical symbols via text and a font fallback. Only the two U+20D7 clusters require KaTeX_Main coverage. No spec, SVG, helper or lesson input was repaired.',
    specSha256: hash(path.join(work, 'fig-283.spec.json')), svgSha256: hash(path.join(work, 'fig-283.svg')),
    observations, errors, independentApproval: false,
  }, null, 2)}\n`)
}
assert.equal(errors.length, 0, JSON.stringify(errors))
console.log(JSON.stringify({ status: 'native-mechanical-pass-pixel-inspection-required', observations: observations.length, errors }))
