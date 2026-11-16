import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const evidence = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/n83-finalize-display/heading-repair')
const htmlRoot = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/n83-finalize-display/native-render-heading-repair')
const { chromium } = createRequire(path.join(root, 'app/package.json'))('playwright')
const reportFile = path.join(evidence, 'heading-and-first-mobile-tails.json')
assert(!fs.existsSync(reportFile), 'Existing first affected-browser evidence must not be overwritten')
delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'

const report = {
  status: 'running',
  scope: 'affected g2 heading and first mobile horizontal math-tail reachability only',
  browser: { headless: true, persistentProfile: false, cdp: false, launches: 1, httpRequestsAborted: true, closed: false },
  heading: [],
  mobileMath: [],
  failure: null,
}
const save = () => fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n')
save()
let browser
let context
try {
  browser = await chromium.launch({ headless: true })
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    context = await browser.newContext({ viewport })
    await context.route(/^https?:/, route => route.abort())
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(pathToFileURL(path.join(htmlRoot, 'exercises.html')).href)
    await page.evaluate(() => document.fonts.ready)
    const heading = page.locator('.exgroup').first()
    const metrics = await heading.evaluate(element => {
      const rendered = element.querySelector('.katex-html')
      const box = element.getBoundingClientRect()
      return {
        visibleText: element.innerText,
        mathAnnotation: element.querySelector('annotation[encoding="application/x-tex"]')?.textContent,
        renderedMathText: rendered?.textContent,
        katexCount: element.querySelectorAll('.katex').length,
        errorCount: document.querySelectorAll('.err,.katex-error').length,
        rawVisibleMarkup: /[$\\]/.test(element.innerText),
        pageWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        box: { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height },
      }
    })
    const firstQuestion = await page.locator('#ex-71').boundingBox()
    const headingBox = await heading.boundingBox()
    assert(firstQuestion && headingBox, 'Heading and first task need actual boxes')
    const clip = {
      x: Math.max(0, Math.floor(headingBox.x - 8)),
      y: Math.max(0, Math.floor(headingBox.y - 8)),
      width: Math.min(viewport.width, Math.ceil(Math.max(headingBox.width, firstQuestion.width) + 16)),
      height: Math.ceil(firstQuestion.y + firstQuestion.height - headingBox.y + 16),
    }
    clip.width = Math.min(clip.width, viewport.width - clip.x)
    const screenshot = path.join(evidence, `heading-${viewport.width}.png`)
    await page.screenshot({ path: screenshot, clip })
    report.heading.push({ viewport, ...metrics, screenshot, pageErrors: errors.slice() })
    save()
    assert.equal(metrics.katexCount, 1, 'g2 must have one real KaTeX formula')
    assert.equal(metrics.mathAnnotation, '45^{\\circ}', 'Real formula must remain exactly 45 degrees')
    assert(/45/.test(metrics.renderedMathText) && /[°∘]/.test(metrics.renderedMathText), '45 and degree glyph must render')
    assert(!metrics.rawVisibleMarkup, 'No visible raw dollar or TeX in heading')
    assert.equal(metrics.errorCount, 0)
    assert(metrics.documentWidth <= metrics.pageWidth + 1, 'Affected page overflows')
    assert.deepEqual(errors, [])

    if (viewport.width === 390) {
      for (const kind of ['text', 'exercises']) {
        await page.goto(pathToFileURL(path.join(htmlRoot, `${kind}.html`)).href)
        await page.evaluate(() => document.fonts.ready)
        const candidates = await page.evaluate(() => {
          const elements = [...document.querySelectorAll('.nb, li.ex .body')]
          return elements.filter(element => {
            if (element.closest('.fig') || !element.querySelector('.katex-html')) return false
            const overflow = getComputedStyle(element).overflowX
            return ['auto', 'scroll'].includes(overflow) && element.scrollWidth > element.clientWidth + 1
          }).map((element, index) => {
            element.setAttribute('data-n83-tail-evidence', String(index))
            return {
              index,
              ownerTag: element.tagName,
              ownerClass: element.className,
              exerciseId: element.closest('li.ex')?.id || null,
              formulas: [...element.querySelectorAll('annotation[encoding="application/x-tex"]')].map(node => node.textContent),
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
            }
          })
        })
        const record = { kind, viewport, overflowContainerCount: candidates.length, containers: [], pageErrors: [] }
        report.mobileMath.push(record)
        save()
        for (const candidate of candidates) {
          const owner = page.locator(`[data-n83-tail-evidence="${candidate.index}"]`)
          await owner.scrollIntoViewIfNeeded()
          const tail = await owner.evaluate(element => {
            element.scrollLeft = element.scrollWidth - element.clientWidth
            const box = element.getBoundingClientRect()
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
            const glyphs = []
            let text
            while ((text = walker.nextNode())) {
              if (!text.parentElement?.closest('.katex-html')) continue
              for (let index = 0; index < text.length; index++) {
                const char = text.textContent[index]
                if (!char || /\s/.test(char)) continue
                const range = document.createRange()
                range.setStart(text, index)
                range.setEnd(text, index + 1)
                const rect = range.getBoundingClientRect()
                if (!rect.width || !rect.height) continue
                const style = getComputedStyle(text.parentElement)
                const transforms = []
                for (let ancestor = text.parentElement; ancestor && element.contains(ancestor); ancestor = ancestor.parentElement) {
                  const transform = getComputedStyle(ancestor).transform
                  if (transform !== 'none') transforms.push({ tag: ancestor.tagName, className: ancestor.className, cssMatrix: transform })
                }
                glyphs.push({
                  char,
                  left: rect.left,
                  right: rect.right,
                  top: rect.top,
                  bottom: rect.bottom,
                  width: rect.width,
                  height: rect.height,
                  cssFontSize: style.fontSize,
                  transforms,
                  screenMeasurement: 'native HTML Range.getBoundingClientRect; SVG CTM is not applicable to KaTeX HTML glyphs',
                })
              }
            }
            glyphs.sort((a, b) => b.right - a.right)
            const lastGlyph = glyphs[0] || null
            return {
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
              scrollLeft: element.scrollLeft,
              maxScrollLeft: element.scrollWidth - element.clientWidth,
              viewportWidth: innerWidth,
              documentWidth: document.documentElement.scrollWidth,
              container: { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height },
              lastMathematicalGlyphAtRightEdge: lastGlyph,
              glyphCount: glyphs.length,
              completeLastGlyphInsideContainer: Boolean(lastGlyph && lastGlyph.left >= box.left - 1 && lastGlyph.right <= box.right + 1
                && lastGlyph.top >= box.top - 1 && lastGlyph.bottom <= box.bottom + 1),
              annotations: [...element.querySelectorAll('annotation[encoding="application/x-tex"]')].map(node => node.textContent),
            }
          })
          const screenshot = path.join(evidence, `math-tail-${kind}-${candidate.index}.png`)
          await owner.screenshot({ path: screenshot })
          record.containers.push({ ...candidate, ...tail, screenshot })
          save()
          assert(Math.abs(tail.scrollLeft - tail.maxScrollLeft) <= 1, 'Actual formula scroll end is unreachable')
          assert(tail.completeLastGlyphInsideContainer, 'Complete final mathematical glyph is not inside its scroll container')
          assert(tail.documentWidth <= tail.viewportWidth + 1, 'Page overflows during formula-tail observation')
          await owner.evaluate(element => { element.scrollLeft = 0 })
        }
        record.pageErrors = errors.slice()
        save()
        assert.deepEqual(errors, [])
      }
    }
    await context.close()
    context = null
  }
  report.status = 'pass'
} catch (error) {
  report.status = 'fail'
  report.failure = { name: error.name, message: error.message, stack: error.stack }
  process.exitCode = 1
} finally {
  if (context) await context.close()
  if (browser) {
    await browser.close()
    report.browser.closed = true
  }
  save()
  console.log(JSON.stringify(report, null, 2))
}
