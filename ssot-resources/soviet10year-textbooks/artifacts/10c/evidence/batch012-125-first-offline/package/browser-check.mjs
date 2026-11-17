import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { root, repo, lessonId, json, save, saveJson, fileReceipt } from './common.mjs'

save('browser-started.lock', `${new Date().toISOString()}\n`)
fs.mkdirSync(path.join(root, 'runtime-temp'), { recursive: true })
const report = {
  status: 'INCOMPLETE', visualStatus: 'NOT_OBSERVED', lessonId,
  startedAt: new Date().toISOString(), argv: process.argv, cwd: process.cwd(),
  scope: 'First independent OFFLINE only; no source-pixel/semantic repeat, product/quiz/DB acceptance or promotion.',
  imagePlan: fileReceipt(path.join(root, 'image-plan.md')),
  imageBudget: { batchBefore: 0, lifetimeBefore: 0, batchMaximum: 8, lifetimeMaximum: 24,
    parentPermanentConsumed: 24, returnImagePayloads: 0, resizing: false, reopens: false },
  surfaces: [], chosenScreenshots: [], contextsClosed: [], browserClosed: false,
}
const normalize = (text) => text.replace(/\s+/g, '')
const appRequire = createRequire(path.join(repo, 'app/package.json'))
const skillRequire = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/package.json'))
let browser
let context
let active
let events

function assertTrue(condition, message) { assert(condition, message) }
async function capture(page, filename, options, coverage) {
  if (report.chosenScreenshots.length >= 8) {
    const error = new Error('More than eight native pieces required for complete visual coverage')
    error.name = 'VisualCoverageUnknown'
    throw error
  }
  const target = path.join(root, 'screenshots', filename)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  assert(!fs.existsSync(target), 'Never overwrite a screenshot')
  await page.screenshot({ path: target, scale: 'css', ...options })
  const entry = { id: report.chosenScreenshots.length + 1, surface: active.id,
    ...fileReceipt(target), native: true, deviceScaleFactor: 1, resizing: false,
    coverage, plannedLoads: 1, actualLoads: 0, observation: 'NOT_OBSERVED' }
  report.chosenScreenshots.push(entry)
  active.screenshots.push(entry.id)
}

try {
  const snapshot = json('input-snapshot.json')
  assert.equal(snapshot.status, 'PASS_EXACT_SIX_INPUT_SNAPSHOT')
  for (const input of snapshot.entries) {
    assert.deepEqual(fileReceipt(input.snapshotReceipt.path), input.snapshotReceipt, 'Snapshot drift')
  }
  const lesson = json('inputs/lesson.json')
  const exercises = json('inputs/exercises.json')
  const figures = json('inputs/figures.json')
  const { proseFlow } = skillRequire('./tools/htmlfrag.js')
  const paragraphs = proseFlow(lesson.prose, lesson.section_breaks).filter((block) => block.kind === 'p')
  const sectionIndices = paragraphs.flatMap((block, index) => block.sectionBreak ? [index] : [])
  report.expected = { derivation: 'proseFlow on exact frozen JSON only; no new semantic review',
    paragraphs: paragraphs.map((block, index) => ({ index, text: block.text,
      sectionBreak: Boolean(block.sectionBreak),
      formulas: [...block.text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((match) => match[1] ?? match[2]) })),
    sectionIndices, sectionSides: lesson.section_breaks, title: lesson.printed_title,
    exerciseCount: exercises.count, figureCount: figures.figures.length }
  assert(paragraphs.length > 0, 'Empty derivation')
  assert.equal(lesson.id, lessonId)
  assert.equal(exercises.count, 0)
  assert.equal(exercises.exercises.length, 0)
  assert.equal(figures.figures.length, 0)
  assert.equal(lesson.exercise_count, 0)
  const { chromium } = appRequire('playwright')
  report.runtime = { nodeVersion: process.version, node: fileReceipt(process.execPath),
    chromium: fileReceipt(chromium.executablePath()),
    playwrightPackage: fileReceipt(appRequire.resolve('playwright/package.json')),
    proseFlowHelper: fileReceipt(skillRequire.resolve('./tools/htmlfrag.js')) }
  const launch = { headless: true, downloadsPath: path.join(root, 'runtime-temp/downloads'),
    args: ['--disable-background-networking', '--disable-component-update',
      '--disable-domain-reliability', '--disable-sync', '--no-pings',
      '--host-resolver-rules=MAP * ~NOTFOUND'] }
  report.launch = launch
  browser = await chromium.launch(launch)
  report.browserVersion = browser.version()
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    context = await browser.newContext({ viewport, deviceScaleFactor: 1,
      serviceWorkers: 'block', acceptDownloads: false })
    const allowedFiles = ['text', 'exercises'].map((kind) => pathToFileURL(path.join(root, 'inputs', `${kind}.html`)).href)
    await context.route(/^https?:/, async (route) => { await route.abort('blockedbyclient') })
    const page = await context.newPage()
    page.on('pageerror', (error) => events?.pageErrors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') events?.consoleErrors.push(message.text()) })
    page.on('request', (request) => events?.requests.push({ url: request.url(), type: request.resourceType() }))
    page.on('requestfailed', (request) => events?.failedRequests.push({ url: request.url(), failure: request.failure() }))
    for (const kind of ['text', 'exercises']) {
      events = { pageErrors: [], consoleErrors: [], requests: [], failedRequests: [] }
      active = { id: `${kind}-${viewport.width}`, kind, viewport,
        input: fileReceipt(path.join(root, 'inputs', `${kind}.html`)), screenshots: [], events,
        assertionStatus: 'RUNNING', scrollChecks: [] }
      report.surfaces.push(active)
      active.url = pathToFileURL(active.input.path).href
      await page.goto(active.url, { waitUntil: 'load' })
      await page.getByRole('heading', { level: 1 }).waitFor()
      await page.evaluate(async () => {
        await document.fonts.ready
        await document.fonts.load('18px KaTeX_Main', '0123456789')
        await document.fonts.ready
      })
      active.geometry = await page.evaluate(() => {
        const rect = (element) => {
          const r = element.getBoundingClientRect()
          return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height,
            right: r.right + scrollX, bottom: r.bottom + scrollY }
        }
        const style = (element) => {
          const s = getComputedStyle(element)
          return { fontFamily: s.fontFamily, fontSize: s.fontSize, lineHeight: s.lineHeight,
            textIndent: s.textIndent, overflowX: s.overflowX, overflowY: s.overflowY,
            borderTopWidth: s.borderTopWidth, borderTopStyle: s.borderTopStyle,
            borderTopColor: s.borderTopColor, display: s.display, visibility: s.visibility,
            opacity: s.opacity, whiteSpace: s.whiteSpace }
        }
        const proseSource = (node) => {
          if (node.nodeType === Node.TEXT_NODE) return node.textContent
          if (node.nodeType !== Node.ELEMENT_NODE) return ''
          if (node.matches('.katex')) {
            const tex = node.querySelector('annotation')?.textContent || ''
            return node.closest('.katex-display') ? `$$${tex}$$` : `$${tex}$`
          }
          if (node.tagName === 'BR') return '\n'
          return [...node.childNodes].map(proseSource).join('')
        }
        const fragments = (element) => {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
          const rows = []
          while (walker.nextNode()) {
            const node = walker.currentNode
            if (!node.textContent.trim() || node.parentElement.closest('.katex-mathml')) continue
            const s = style(node.parentElement)
            if (s.display === 'none' || s.visibility !== 'visible' || Number(s.opacity) === 0) continue
            const range = document.createRange()
            range.selectNodeContents(node)
            const boxes = [...range.getClientRects()].map((r) => ({ x: r.x + scrollX, y: r.y + scrollY,
              width: r.width, height: r.height, right: r.right + scrollX, bottom: r.bottom + scrollY }))
            rows.push({ text: node.textContent, style: s, boxes,
              math: Boolean(node.parentElement.closest('.katex-html')) })
          }
          return rows
        }
        const paras = [...document.querySelectorAll('p.para')]
        const wrappers = [...document.querySelectorAll('.nb')]
        return {
          viewport: { width: innerWidth, height: innerHeight },
          docWidth: document.documentElement.scrollWidth,
          docHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
          sheet: rect(document.querySelector('.sheet')), heading: { text: document.querySelector('h1').textContent,
            rect: rect(document.querySelector('h1')), style: style(document.querySelector('h1')) },
          bodyText: document.body.innerText,
          paragraphs: paras.map((element, index) => ({ index, sourceReconstructed: proseSource(element),
            visibleText: element.innerText, rect: rect(element), style: style(element),
            section: element.classList.contains('section'), rows: fragments(element),
            formulas: [...element.querySelectorAll('.katex')].map((formula) => ({
              tex: formula.querySelector('annotation')?.textContent,
              rect: rect(formula), style: style(formula),
              htmlRect: rect(formula.querySelector('.katex-html')),
              htmlStyle: style(formula.querySelector('.katex-html')), glyphs: fragments(formula),
              wrapperIndex: wrappers.indexOf(formula.closest('.nb')) })),
          })),
          sections: paras.flatMap((element, index) => element.classList.contains('section') ? [{
            index, rect: rect(element), style: style(element),
            before: proseSource(paras[index - 1]), after: proseSource(element),
          }] : []),
          formulaWrappers: wrappers.map((element, index) => ({
            index, rect: rect(element), style: style(element), clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth, scrollLeft: element.scrollLeft,
            tex: [...element.querySelectorAll('annotation')].map((node) => node.textContent),
          })),
          proseNumbers: [...document.querySelectorAll('.prose-math')].map((element) => ({
            text: element.textContent, rect: rect(element), style: style(element),
          })),
          allParagraphs: document.querySelectorAll('p').length,
          exercises: document.querySelectorAll('li.ex,ol.exercises,[data-exercise-id]').length,
          sourceFigures: [...document.querySelectorAll('figure,.figure-media,img,svg,canvas')]
            .filter((element) => !element.closest('.katex')).length,
          intrinsicKaTeXSvg: [...document.querySelectorAll('svg')].filter((element) => element.closest('.katex')).length,
          controls: [...document.querySelectorAll('input,textarea,select,option,button,[role="radio"],[role="checkbox"],[role="option"],[contenteditable="true"]')]
            .map((element) => ({ tag: element.tagName, type: element.getAttribute('type') })),
          errorElements: document.querySelectorAll('.err,.katex-error,.sr-tex-err').length,
          scripts: document.scripts.length,
          assetUrls: [...document.querySelectorAll('[src],[srcset],link[href],object[data],embed[src],iframe[src]')]
            .flatMap((element) => ['src', 'srcset', 'href', 'data'].filter((key) => element.hasAttribute(key))
              .map((key) => ({ tag: element.tagName, key, value: element.getAttribute(key) }))),
          cssUrls: [...document.querySelectorAll('style,[style]')].flatMap((element) =>
            [...(element.tagName === 'STYLE' ? element.textContent : element.getAttribute('style'))
              .matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map((match) => match[1])),
          cssImports: [...document.querySelectorAll('style')].flatMap((element) =>
            [...element.textContent.matchAll(/@import[^;]+/g)].map((match) => match[0])),
          fonts: [...document.fonts].map((font) => ({
            family: font.family, style: font.style, weight: font.weight, status: font.status,
          })),
          fontsReady: document.fonts.status,
          mainLoaded: document.fonts.check('18px KaTeX_Main', '0123456789'),
          links: [...document.querySelectorAll('a')].map((element) => ({
            text: element.innerText, href: element.getAttribute('href'), rect: rect(element),
          })),
        }
      })
      const g = active.geometry
      assert.equal(g.viewport.width, viewport.width)
      assert.equal(g.viewport.height, viewport.height)
      assert(g.docWidth <= viewport.width + 1, 'Whole-page horizontal overflow')
      assert(g.sheet.x >= 0 && g.sheet.right <= viewport.width + 1, 'Sheet leaves viewport')
      assert.equal(g.errorElements, 0, 'Math/render error')
      assert.equal(g.scripts, 0, 'Page scripts forbidden')
      assert.equal(g.sourceFigures, 0, 'Invented source figure')
      assert.equal(g.exercises, 0, 'Invented exercise')
      assert.equal(g.controls.length, 0, 'Invented input or option')
      assert.equal(g.assetUrls.filter((asset) => !asset.value.startsWith('data:')).length, 0, 'Non-inline asset')
      assert.equal(g.cssUrls.filter((url) => !url.startsWith('data:')).length, 0, 'External CSS asset')
      assert.equal(g.cssImports.length, 0, 'CSS imports forbidden')
      assert.equal(g.fontsReady, 'loaded')
      assert(g.mainLoaded && g.fonts.some((font) => font.family.replace(/["']/g, '') === 'KaTeX_Main'
        && font.status === 'loaded'), 'Actual KaTeX Main font not loaded')
      assert(g.heading.rect.width > 0 && g.heading.rect.height > 0, 'Blank heading')
      assert(g.heading.rect.x >= 0 && g.heading.rect.right <= viewport.width + 1, 'Heading overflows')
      assert.equal(g.heading.text, kind === 'text' ? lesson.printed_title : `${lesson.printed_title} · 习题`)
      assert.equal(g.links.length, 1, 'Unexpected offline navigation')
      assert.equal(g.links[0].href, kind === 'text' ? 'exercises.html' : 'text.html')
      assert(g.links[0].rect.x >= 0 && g.links[0].rect.right <= viewport.width + 1, 'Navigation overflows')
      if (kind === 'text') {
        assert.equal(g.paragraphs.length, paragraphs.length)
        assert.equal(g.allParagraphs, paragraphs.length)
        assert.deepEqual(g.sections.map((section) => section.index), sectionIndices)
        for (const [index, row] of g.paragraphs.entries()) {
          assert.equal(normalize(row.sourceReconstructed), normalize(paragraphs[index].text), `Paragraph ${index} exact text/order`)
          assert.equal(row.section, Boolean(paragraphs[index].sectionBreak))
          assert.equal(row.style.textIndent, '0px', `Paragraph ${index} indentation`)
          assert(row.style.visibility === 'visible' && Number(row.style.opacity) > 0 && row.style.display !== 'none', 'Hidden paragraph')
          assert(row.rect.x >= 0 && row.rect.right <= viewport.width + 1 && row.rect.height > 0, 'Paragraph bounding geometry')
          const previousBottom = index ? g.paragraphs[index - 1].rect.bottom : g.heading.rect.bottom
          assert(row.rect.y >= previousBottom - 1 && row.rect.bottom <= g.docHeight, 'Paragraph order/overlap/full visibility')
          assert(row.rows.length > 0, 'No visible paragraph glyphs')
          for (const fragment of row.rows) {
            for (const box of fragment.boxes) {
              assert(box.width > 0 && box.height > 0, 'Blank text range')
              assert(box.y >= row.rect.y - 2 && box.bottom <= row.rect.bottom + 2, 'Paragraph text vertically clipped')
              if (!fragment.math) assert(box.x >= row.rect.x - 1 && box.right <= row.rect.right + 1, 'Prose text clipped')
            }
          }
          assert.deepEqual(row.formulas.map((formula) => formula.tex), report.expected.paragraphs[index].formulas)
          for (const formula of row.formulas) {
            assert(formula.htmlRect.width > 0 && formula.htmlRect.height > 0 && formula.glyphs.length > 0, 'Blank formula')
            assert(formula.style.fontFamily.includes('KaTeX_Main'), 'Formula root font inconsistent')
            assert(Number.parseFloat(formula.style.fontSize) >= Number.parseFloat(row.style.fontSize), 'Formula undersized')
            assert(formula.htmlStyle.visibility === 'visible' && formula.htmlStyle.display !== 'none', 'Hidden formula')
            for (const glyph of formula.glyphs.filter((glyph) => /\d/.test(glyph.text))) {
              assert(glyph.style.fontFamily.includes('KaTeX_Main'), 'Formula number font inconsistent')
              assert(Number.parseFloat(glyph.style.fontSize) >= Number.parseFloat(row.style.fontSize), 'Formula number undersized')
            }
          }
        }
        for (const [index, section] of g.sections.entries()) {
          assert.equal(normalize(section.before), normalize(lesson.section_breaks[index].before))
          assert.equal(normalize(section.after), normalize(lesson.section_breaks[index].after))
          assert.equal(section.style.borderTopWidth, '1px')
          assert.equal(section.style.borderTopStyle, 'solid')
          assert(!['transparent', 'rgba(0, 0, 0, 0)'].includes(section.style.borderTopColor), 'Invisible separator')
        }
        const expectedNumbers = paragraphs.flatMap((block) =>
          [...block.text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, '').matchAll(/[A-Za-z0-9]+(?:\.[0-9]+)*/g)]
            .map((match) => match[0]))
        assert.deepEqual(g.proseNumbers.map((number) => number.text), expectedNumbers)
        for (const number of g.proseNumbers) {
          assert(number.style.fontFamily.includes('KaTeX_Main'), 'Prose number font inconsistent')
          assert(Number.parseFloat(number.style.fontSize) >= Number.parseFloat(g.paragraphs[0].style.fontSize), 'Prose number undersized')
          assert(number.rect.width > 0 && number.rect.height > 0 && number.rect.x >= 0
            && number.rect.right <= viewport.width + 1, 'Prose number not fully visible')
        }
        for (const wrapper of g.formulaWrappers) {
          assert(wrapper.rect.x >= -1 && wrapper.rect.right <= viewport.width + 1
            && wrapper.rect.width > 0 && wrapper.rect.height > 0 && wrapper.clientWidth > 0, 'Formula wrapper does not fit')
          if (wrapper.scrollWidth <= wrapper.clientWidth + 1) continue
          assert(['auto', 'scroll'].includes(wrapper.style.overflowX), 'Overflowing formula is not scrollable')
          const locator = page.locator('.nb').nth(wrapper.index)
          const positions = {}
          for (const position of ['start', 'end', 'reset']) {
            positions[position] = await locator.evaluate((element, position) => {
              element.scrollLeft = position === 'end' ? element.scrollWidth : 0
              const actual = element.scrollLeft
              if (position === 'end') element.scrollLeft = element.scrollWidth + 1
              const r = element.getBoundingClientRect()
              return { actual, saturated: element.scrollLeft, clientWidth: element.clientWidth,
                scrollWidth: element.scrollWidth, maximum: element.scrollWidth - element.clientWidth,
                pageWidth: document.documentElement.scrollWidth, rect: { x: r.x, y: r.y + scrollY,
                  width: r.width, height: r.height, right: r.right, bottom: r.bottom + scrollY } }
            }, position)
            if (position !== 'reset') {
              const r = positions[position].rect
              await capture(page, `${active.id}-formula-${wrapper.index}-${position}.png`,
                { clip: { x: Math.max(0, Math.floor(r.x)), y: Math.max(0, Math.floor(r.y)),
                  width: Math.min(viewport.width - Math.max(0, Math.floor(r.x)), Math.ceil(r.width) + 1),
                  height: Math.ceil(r.height) + 2 } },
                { wrapperIndex: wrapper.index, tex: wrapper.tex, endpoint: position })
            }
          }
          active.scrollChecks.push({ wrapperIndex: wrapper.index, tex: wrapper.tex, ...positions })
          assert.equal(positions.start.actual, 0, 'Exact formula start unreachable')
          assert.equal(positions.end.actual, positions.end.saturated, 'Exact saturated formula end unreachable')
          assert(Math.abs(positions.end.actual - positions.end.maximum) <= 1, 'Native formula end mismatch')
          assert.equal(positions.reset.actual, 0, 'Exact formula reset unreachable')
          assert(Object.values(positions).every((p) => p.pageWidth <= viewport.width + 1), 'Scroll creates page overflow')
        }
        assert(g.links[0].rect.y >= g.paragraphs.at(-1).rect.bottom - 1, 'Navigation overlaps final paragraph')
      } else {
        assert.equal(g.paragraphs.length, 0)
        assert.equal(g.allParagraphs, 0)
        assert.equal(g.formulaWrappers.length, 0)
        assert.equal(g.proseNumbers.length, 0)
      }
      assert.deepEqual(events.pageErrors, [])
      assert.deepEqual(events.consoleErrors, [])
      assert.deepEqual(events.failedRequests, [])
      assert.equal(events.requests.filter((request) =>
        !allowedFiles.includes(request.url) && !request.url.startsWith('data:')).length, 0, 'Non-inline/non-authorized request')
      active.assertionStatus = 'PASS_BROWSER'
      await page.evaluate(() => window.scrollTo(0, 0))
      if (g.docHeight <= 4096) {
        await capture(page, `${active.id}-native-full.png`, { fullPage: true },
          { fullPage: true, nativeWidth: viewport.width, nativeHeight: g.docHeight,
            paragraphs: g.paragraphs.map((row) => row.index), separators: g.sections.map((section) => section.index),
            emptyExerciseView: kind === 'exercises', heading: true, navigation: true })
      } else {
        let y = 0
        while (y < g.docHeight) {
          let end = Math.min(g.docHeight, y + 4096)
          if (end < g.docHeight) {
            const crossing = g.paragraphs.find((row) => row.rect.y < end && row.rect.bottom > end)
            if (crossing) end = Math.floor(crossing.rect.y) - 8
          }
          if (end <= y) {
            const error = new Error('Paragraph cannot be fully covered by a bounded native piece')
            error.name = 'VisualCoverageUnknown'
            throw error
          }
          const covered = g.paragraphs.filter((row) => row.rect.y >= y && row.rect.bottom <= end).map((row) => row.index)
          await capture(page, `${active.id}-native-y${y}.png`,
            { clip: { x: 0, y, width: viewport.width, height: end - y } },
            { fullPage: false, clip: { x: 0, y, width: viewport.width, height: end - y }, paragraphs: covered })
          y = end === g.docHeight ? end : Math.max(y + 1, end - 32)
        }
        const covered = new Set(report.chosenScreenshots.filter((shot) => shot.surface === active.id)
          .flatMap((shot) => shot.coverage.paragraphs || []))
        assert(g.paragraphs.every((row) => covered.has(row.index)), 'Native screenshot paragraph coverage incomplete')
      }
      console.log(JSON.stringify({ surface: active.id, status: active.assertionStatus,
        paragraphCount: g.paragraphs.length, separatorCount: g.sections.length,
        dimensions: [viewport.width, g.docHeight], overflowingFormulaWrappers: active.scrollChecks.length,
        nativeScreenshots: report.chosenScreenshots.filter((shot) => shot.surface === active.id) }))
    }
    await context.close()
    report.contextsClosed.push({ viewport, closedAt: new Date().toISOString() })
    context = undefined
  }
  report.status = 'PASS_BROWSER_PENDING_NATIVE_VISUAL'
} catch (error) {
  report.status = error.name === 'VisualCoverageUnknown' ? 'UNKNOWN_NATIVE_COVERAGE' : 'FAIL_BROWSER_STOP_NO_RETRY'
  report.error = { name: error.name, message: error.message, stack: error.stack, surface: active?.id }
  if (active) active.assertionStatus = 'FAIL_STOP_NO_REPAIR_NO_RERUN'
  console.error(error.stack)
  process.exitCode = 1
} finally {
  if (context) {
    await context.close()
    report.contextsClosed.push({ failureCleanup: true, closedAt: new Date().toISOString() })
  }
  if (browser) {
    await browser.close()
    report.browserClosed = true
    report.browserClosedAt = new Date().toISOString()
  }
  report.endedAt = new Date().toISOString()
  console.log(JSON.stringify({ status: report.status, browserClosed: report.browserClosed,
    report: saveJson('browser-results.json', report),
    ledger: saveJson('planned-image-ledger.json', { plannedBeforeAnyImageLoad: true,
      plan: report.imagePlan, budget: report.imageBudget, entries: report.chosenScreenshots }) }))
}
