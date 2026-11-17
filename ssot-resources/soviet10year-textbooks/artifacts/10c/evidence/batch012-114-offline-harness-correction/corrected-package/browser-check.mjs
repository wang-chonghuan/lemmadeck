import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { root, repo, lessonId, json, saveJson, fileReceipt } from './common.mjs'

const startedAt = new Date().toISOString()
const report = {
  status: 'INCOMPLETE_OFFLINE', visualStatus: 'NOT_YET_INSPECTED', lessonId,
  scope: 'First independent OFFLINE rendering only; no product UI/auth/quiz/DB/full-book acceptance.',
  startedAt, argv: process.argv, cwd: process.cwd(), browser: 'installed app Playwright isolated HEADLESS Chromium',
  authorization: 'One authorized harness correction and subsequent first ACTUAL browser observation; same continuous cap3, no new freeze/content PASS or retry loops.',
  inheritedHistoricalAttempt: 'Original package remains FAIL/UNKNOWN with lifetime0/24, untouched.',
  imagePlan: { lifetimeBefore: 0, batchLimit: 8, lifetimeLimit: 24, maximumNativeWidth: 2048,
    maximumNativeHeight: 4096,
    allocation: 'Capture native full text/empty exercises and all overflowing formula start/end elements. Before image loads, partition text by actual height and pack native exercise/endpoints into contact sheets; return UNKNOWN if eight usable loads cannot cover everything.',
    fullPageEvidence: 'Initially unopened; only chosen native projections count as model image loads', resizing: false },
  results: [], plannedImageLedger: [], browserClosed: false, contextsClosed: [],
}
let browser
let context
let activeSurface
try {
  const freeze = json('input-freeze.json')
  assert.equal(freeze.status, 'PASS_EXACT_INPUT_FREEZE')
  const lesson = json('inputs/lesson.json')
  const exercises = json('inputs/exercises.json')
  const figures = json('inputs/figures.json')
  const skillRequire = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/package.json'))
  const { proseFlow } = skillRequire('./tools/htmlfrag.js')
  const flow = proseFlow(lesson.prose, lesson.section_breaks).filter((block) => block.kind === 'p')
  report.expected = { paragraphs: flow.length, sectionBreaks: lesson.section_breaks,
    sectionIndices: flow.flatMap((item, index) => item.sectionBreak ? [index] : []),
    exercisesManifest: exercises, figuresManifest: figures,
    derivation: 'Existing proseFlow helper on frozen current JSON, assertion input only; no flow CLI/text review/math proof.' }
  assert.equal(exercises.count, 0, 'Frozen exercise count must be zero')
  assert.equal(exercises.exercises.length, 0, 'Frozen exercise entries must be empty')
  assert.equal(figures.figures.length, 0, 'Frozen figure entries must be empty')
  const require = createRequire(path.join(repo, 'app/package.json'))
  const { chromium } = require('playwright')
  report.runtime = { node: fileReceipt(process.execPath), nodeVersion: process.version,
    chromium: fileReceipt(chromium.executablePath()), playwrightPackage: fileReceipt(require.resolve('playwright/package.json')) }
  browser = await chromium.launch({ headless: true, downloadsPath: path.join(root, 'runtime-temp/downloads') })
  report.browserVersion = browser.version()
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    context = await browser.newContext({ viewport, deviceScaleFactor: 1, serviceWorkers: 'block', acceptDownloads: false })
    const events = { pageErrors: [], consoleErrors: [], networkRequests: [], failedRequests: [] }
    await context.route(/^https?:/, async (route) => {
      events.networkRequests.push(route.request().url())
      await route.abort()
    })
    const page = await context.newPage()
    page.on('pageerror', (error) => events.pageErrors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') events.consoleErrors.push(message.text()) })
    page.on('requestfailed', (request) => events.failedRequests.push({ url: request.url(), failure: request.failure() }))
    try {
      for (const kind of ['text', 'exercises']) {
        const file = path.join(root, 'inputs', `${kind}.html`)
        activeSurface = { kind, viewport, file, navigationUrl: pathToFileURL(file).href,
          screenshots: [], events }
        report.results.push(activeSurface)
        activeSurface.input = fileReceipt(file)
        await page.goto(activeSurface.navigationUrl, { waitUntil: 'load' })
        await page.evaluate(() => document.fonts.ready)
        await page.getByRole('heading', { level: 1 }).waitFor()
        activeSurface.geometry = await page.evaluate(() => {
          const rect = (element) => {
            const r = element.getBoundingClientRect()
            return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, right: r.right, bottom: r.bottom + scrollY }
          }
          const style = (element) => {
            const s = getComputedStyle(element)
            return { fontFamily: s.fontFamily, fontSize: s.fontSize, lineHeight: s.lineHeight,
              textIndent: s.textIndent, overflowX: s.overflowX, overflowY: s.overflowY,
              borderTopWidth: s.borderTopWidth, borderTopStyle: s.borderTopStyle, borderTopColor: s.borderTopColor,
              marginTop: s.marginTop, paddingTop: s.paddingTop }
          }
          const paragraphs = [...document.querySelectorAll('p.para')]
          return {
            viewport: { width: innerWidth, height: innerHeight }, docWidth: document.documentElement.scrollWidth,
            docHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
            title: document.querySelector('h1')?.textContent, heading: rect(document.querySelector('h1')),
            bodyText: document.body.innerText,
            paragraphs: paragraphs.map((element, index) => ({ index, text: element.innerText, rect: rect(element), style: style(element),
              section: element.classList.contains('section'),
              formulas: [...element.querySelectorAll('.katex')].map((formula) => ({
                tex: formula.querySelector('annotation')?.textContent, rect: rect(formula), style: style(formula),
                htmlRect: rect(formula.querySelector('.katex-html')),
              })),
            })),
            sections: paragraphs.flatMap((element, index) => element.classList.contains('section')
              ? [{ index, rect: rect(element), style: style(element),
                beforeVisible: paragraphs[index - 1]?.innerText, afterVisible: element.innerText }] : []),
            formulaWrappers: [...document.querySelectorAll('.nb')].map((element, index) => ({
              index, text: element.innerText, tex: [...element.querySelectorAll('annotation')].map((e) => e.textContent),
              rect: rect(element), clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
              style: style(element),
            })),
            proseMath: [...document.querySelectorAll('.prose-math')].map((element) => ({
              text: element.textContent, rect: rect(element), style: style(element),
            })),
            exercises: document.querySelectorAll('li.ex').length,
            figures: [...document.querySelectorAll('figure,.figure-media,img,svg')]
              .filter((element) => !element.closest('.katex')).length,
            intrinsicKaTeXSvg: [...document.querySelectorAll('svg')]
              .filter((element) => element.closest('.katex')).length,
            controls: [...document.querySelectorAll('input,textarea,select,button,[role="radio"],[role="checkbox"],[contenteditable="true"]')]
              .map((e) => ({ tag: e.tagName, type: e.getAttribute('type'), text: e.textContent })),
            errors: document.querySelectorAll('.err,.katex-error,.sr-tex-err').length,
            scripts: document.querySelectorAll('script').length,
            assets: [...document.querySelectorAll('img,link,script')].map((element) => element.src || element.href || ''),
            cssRemoteUrls: [...document.querySelectorAll('style')].flatMap((element) =>
              [...element.textContent.matchAll(/url\(['"]?(https?:[^)'"]+)/g)].map((match) => match[1])),
            fonts: [...document.fonts].map((font) => ({ family: font.family, style: font.style, weight: font.weight, status: font.status })),
            loadedKaTeXMain: document.fonts.check('18.656px KaTeX_Main', 'exp0123456789'),
            links: [...document.querySelectorAll('a')].map((a) => ({ text: a.innerText, href: a.getAttribute('href'), rect: rect(a) })),
          }
        })
        const fullFile = path.join(root, 'screenshots', `${kind}-${viewport.width}-full-unopened.png`)
        fs.mkdirSync(path.dirname(fullFile), { recursive: true })
        await page.screenshot({ path: fullFile, fullPage: true, scale: 'css' })
        activeSurface.fullPageUnopened = fileReceipt(fullFile)
        const height = activeSurface.geometry.docHeight
        const g = activeSurface.geometry
        assert.equal(g.viewport.width, viewport.width)
        assert(g.docWidth <= viewport.width + 1, 'Whole page horizontally overflows')
        assert.equal(g.errors, 0, 'Visible rendering error elements')
        assert.equal(g.figures, 0, 'Invented figure/media in zero-figure lesson')
        assert.equal(g.exercises, 0, 'Invented written exercise')
        assert.equal(g.controls.length, 0, 'Invented answer inputs or choices')
        assert.equal(g.scripts, 0, 'Self-contained HTML must not execute page scripts')
        assert.equal(g.assets.filter((url) => !url.startsWith('data:')).length, 0, 'Non-inline asset')
        assert.equal(g.cssRemoteUrls.length, 0, 'Remote CSS asset')
        assert(g.heading.width > 0 && g.heading.height > 0, 'Blank heading geometry')
        if (kind === 'text') {
          assert.equal(g.paragraphs.length, flow.length, 'Rendered paragraph count')
          assert.deepEqual(g.sections.map((section) => section.index), report.expected.sectionIndices)
          assert.equal(g.sections.length, 2, 'Both concept separators')
          assert(g.sections.every((section) => section.style.borderTopWidth === '1px'
            && section.style.borderTopStyle === 'solid'), 'Concept separator line absent')
          assert(g.paragraphs.every((row) => row.rect.x >= 0 && row.rect.right <= viewport.width + 1
            && row.rect.height > 0 && row.style.textIndent === '0px'), 'Paragraph geometry/indent')
          assert(g.paragraphs.slice(1).every((row, index) => row.rect.y >= g.paragraphs[index].rect.bottom - 1),
            'Paragraphs overlap or are out of vertical order')
          assert(g.formulaWrappers.every((row) => row.rect.x >= -1
            && row.rect.right <= viewport.width + 1 && row.rect.width > 0 && row.rect.height > 0
            && row.clientWidth > 0 && row.scrollWidth > 0), 'Formula containing wrapper clips/leaves page or is blank')
          assert(g.paragraphs.flatMap((row) => row.formulas).every((formula) =>
            formula.htmlRect.width > 0 && formula.htmlRect.height > 0), 'Formula content geometry is blank')
          activeSurface.scrollChecks = []
          for (const row of g.formulaWrappers.filter((row) => row.scrollWidth > row.clientWidth + 1)) {
            const wrapper = page.locator('.nb').nth(row.index)
            const start = await wrapper.evaluate((element) => {
              element.scrollLeft = 0
              return { actualScrollLeft: element.scrollLeft, clientWidth: element.clientWidth,
                scrollWidth: element.scrollWidth, pageWidth: document.documentElement.scrollWidth }
            })
            const startFile = path.join(root, 'screenshots', `formula-${viewport.width}-${row.index}-start.png`)
            await wrapper.screenshot({ path: startFile, scale: 'css' })
            const end = await wrapper.evaluate((element) => {
              element.scrollLeft = element.scrollWidth
              const actualScrollLeft = element.scrollLeft
              element.scrollLeft = element.scrollWidth + 1
              return { actualScrollLeft, saturatedEnd: element.scrollLeft,
                clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
                maxScrollLeft: element.scrollWidth - element.clientWidth,
                pageWidth: document.documentElement.scrollWidth }
            })
            const endFile = path.join(root, 'screenshots', `formula-${viewport.width}-${row.index}-end.png`)
            await wrapper.screenshot({ path: endFile, scale: 'css' })
            const reset = await wrapper.evaluate((element) => {
              element.scrollLeft = 0
              return { actualScrollLeft: element.scrollLeft, pageWidth: document.documentElement.scrollWidth }
            })
            activeSurface.scrollChecks.push({ wrapperIndex: row.index, tex: row.tex, wrapper: row.rect,
              start, end, reset, startScreenshot: fileReceipt(startFile), endScreenshot: fileReceipt(endFile),
              visibleEndpointStatus: 'NOT_YET_INSPECTED' })
            assert.equal(start.actualScrollLeft, 0, 'Formula scroll start unreachable')
            assert.equal(end.actualScrollLeft, end.saturatedEnd, 'Formula exact native saturated end unreachable')
            assert(Math.abs(end.actualScrollLeft - end.maxScrollLeft) <= 1,
              'Formula scroll end differs from measured native max by more than rounding')
            assert.equal(reset.actualScrollLeft, 0, 'Formula scroll reset unreachable')
            assert([start, end, reset].every((position) => position.pageWidth <= viewport.width + 1),
              'Formula scroll causes whole-page overflow')
          }
          await page.evaluate(() => window.scrollTo(0, 0))
          assert(g.loadedKaTeXMain, 'KaTeX Main font not loaded')
          assert(g.proseMath.every((row) => row.style.fontFamily.includes('KaTeX_Main')
            && Number.parseFloat(row.style.fontSize) >= Number.parseFloat(g.paragraphs[0].style.fontSize)),
          'Prose numeric/Latin characters use inconsistent or undersized font')
        } else {
          assert.equal(g.paragraphs.length, 0, 'Exercise view contains invented prose questions')
        }
        assert.deepEqual(events.pageErrors, [])
        assert.deepEqual(events.consoleErrors, [])
        assert.deepEqual(events.networkRequests, [])
        assert.deepEqual(events.failedRequests, [])
        activeSurface.assertionStatus = 'PASS_BROWSER_ONLY_NOT_VISUAL'
        activeSurface.events = structuredClone(events)
        console.log(JSON.stringify({ surface: `${kind}-${viewport.width}`, assertionStatus: activeSurface.assertionStatus,
          height, nativeCaptures: activeSurface.screenshots.map(({ path, sha256, clip }) => ({ path, sha256, clip })) }))
      }
    } finally {
      await context.close()
      report.contextsClosed.push(viewport)
      context = undefined
    }
  }
  report.status = 'PASS_OFFLINE_BROWSER_PENDING_VISUAL'
  report.loadedCommonJsFiles = Object.keys(require.cache).filter((file) => fs.statSync(file).isFile()).map(fileReceipt)
} catch (error) {
  report.status = error.name === 'VisualCoverageUnknown' ? 'UNKNOWN_OFFLINE_VISUAL_COVERAGE' : 'FAIL_OFFLINE_FIRST_BROWSER'
  report.error = { name: error.name, message: error.message, stack: error.stack, surface: activeSurface && {
    kind: activeSurface.kind, viewport: activeSurface.viewport, file: activeSurface.file } }
  if (activeSurface) activeSurface.assertionStatus = 'FAIL_STOP_NO_REPAIR_NO_RERUN'
  console.error(error.stack)
  process.exitCode = 1
} finally {
  if (context) {
    await context.close()
    report.contextsClosed.push('failure-finally')
  }
  if (browser) {
    await browser.close()
    report.browserClosed = true
  }
  const require = createRequire(path.join(repo, 'app/package.json'))
  report.loadedCommonJsFiles = Object.keys(require.cache).filter((file) => fs.statSync(file).isFile()).map(fileReceipt)
  report.endedAt = new Date().toISOString()
  const receipt = saveJson('browser-results.json', report)
  const ledger = saveJson('planned-image-ledger.json', { plannedBeforeAnyImageLoad: true, ...report.imagePlan,
    entries: report.plannedImageLedger })
  console.log(JSON.stringify({ status: report.status, report: receipt, ledger, browserClosed: report.browserClosed }))
}
