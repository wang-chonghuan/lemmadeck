import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d848-n87-fig201202-first-author')
const card = 'phy10-c2-s3-n87'
const require = createRequire(path.join(R, 'app/package.json'))
const { chromium } = require('@playwright/test')
const postcss = require('postcss')
const checkRound = process.argv[2] || 'FIRST'
const { assertActualFigureText, assertFigurePixels } = await import(pathToFileURL(path.join(R, '.claude/skills/ld-s10y-lesson/tools/check_product.mjs')))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
function write(name, data) {
  const target = path.join(D, name)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  return target
}
const nativeCalls = []
for (const locale of ['zh', 'en']) {
  if (checkRound !== 'FIRST') {
    const receipt = path.join(D, 'calls', `offline-${locale}.json`)
    assert.equal(load(receipt).exitCode, 0)
    nativeCalls.push({ locale, path: receipt, sha256: hash(receipt), reused: true })
    continue
  }
  const book = path.join(D, 'context-root', locale, '10p')
  const figures = path.join(book, 'editions/modern-us-neutral/figures')
  fs.mkdirSync(figures, { recursive: true })
  for (const figure of ['fig-201', 'fig-202']) {
    const final = path.join(D, 'figures', figure, 'repair-2')
    assert.equal(load(path.join(final, `${figure}.render.json`)).status, 'pass')
    fs.symlinkSync(path.join(final, `${figure}.svg`), path.join(figures, `${figure}.svg`))
    fs.symlinkSync(path.join(final, 'spec.json'), path.join(figures, `${figure}.spec.json`))
  }
  const args = [
    '.claude/skills/ld-s10y-lesson/tools/render_lesson.js', book,
    '--out', path.join(D, 'offline', locale), '--edition', 'modern-us-neutral',
    '--lesson', card,
  ]
  const result = spawnSync('node', args, { cwd: R, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  const receipt = write(`calls/offline-${locale}.json`, {
    command: 'node', args, cwd: R, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  })
  nativeCalls.push({ locale, path: receipt, sha256: hash(receipt) })
  assert.equal(result.status, 0, `Native offline renderer failed for ${locale}`)
}

const cssPath = path.join(R, 'app/src/styles/app.css')
const parsedCss = postcss.parse(fs.readFileSync(cssPath, 'utf8'), { from: cssPath })
const removedImports = []
parsedCss.walkAtRules('import', node => {
  removedImports.push(node.params)
  node.remove()
})
const css = parsedCss.toString()
const cssProjection = path.join(D, 'display/product-css.no-import.css')
fs.writeFileSync(cssProjection, css, { flag: 'wx' })
const browser = await chromium.launch({ headless: false })
const report = {
  schema: 'd848/offline-product-figure-display@1',
  scope: 'Figure-author verification only; no DB-backed product acceptance, text approval, independent review, or exercise association change.',
  browser: { headed: true, deviceScaleFactor: 1, network: 'All requests blocked; local setContent and local styles only' },
  actualProductContract: {
    css: { path: cssPath, sha256: hash(cssPath) },
    cssProjection: { path: cssProjection, sha256: hash(cssProjection), removedImports, transformation: 'PostCSS AST removal of import nodes only; all product rules and tokens preserved byte-for-byte within remaining nodes.' },
    route: { path: path.join(R, 'app/src/routes/_app/card.$id.tsx'), sha256: hash(path.join(R, 'app/src/routes/_app/card.$id.tsx')) },
    media: 'FigureMedia: sr-figure-media, width:640px; max-width:100%; sr-figure-vector',
    prose: 'sr-read-fig; sr-read',
    exercise: 'sr-ex-fig inside sr-ex-body; original six exercises contain no referenced figures. This surface is a preventive standalone probe.',
    inline: 'Actual figure media widths measured at 331, 342, 640px, with minimum text >=16px.',
    scroll: 'Control-only probe uses native product 40em media width (640px at 16px), and verifies horizontal reachability. Authored specs remain inline.',
  },
  offlineCalls: nativeCalls, measurements: [], scrollControls: [], errors: [],
}
try {
  for (const locale of ['zh', 'en']) {
    const textPath = path.join(D, 'offline', locale, card, 'text.html')
    const exercisesPath = path.join(D, 'offline', locale, card, 'exercises.html')
    const exercisePage = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await exercisePage.route('**/*', route => route.abort())
    await exercisePage.setContent(fs.readFileSync(exercisesPath, 'utf8'))
    assert.equal(await exercisePage.locator('li.ex').count(), 6)
    assert.equal(await exercisePage.locator('figure').count(), 0)
    await exercisePage.close()
    for (const surface of ['prose', 'exercise-probe']) {
      for (const width of [331, 342, 640]) {
        const page = await browser.newPage({
          viewport: width === 640 ? { width: 1440, height: 960 } : { width: 390, height: 844 },
          deviceScaleFactor: 1,
        })
        await page.route('**/*', route => route.abort())
        const pageErrors = []
        page.on('pageerror', error => pageErrors.push(error.message))
        await page.setContent(fs.readFileSync(textPath, 'utf8'))
        await page.addStyleTag({ content: css })
        await page.addStyleTag({ content: `.sheet{width:${width}px;max-width:none;padding:0;margin:20px}.sr-read{font-size:16px}` })
        await page.evaluate(({ surface, width }) => {
          const sheet = document.querySelector('.sheet')
          sheet.classList.add('sr-read')
          for (const nativeFigure of [...document.querySelectorAll('figure.fig')]) {
            nativeFigure.className = surface === 'prose' ? 'sr-read-fig' : 'sr-ex-fig'
            nativeFigure.dataset.figureId = nativeFigure.id
            const media = nativeFigure.querySelector('.figure-media')
            media.className = 'sr-figure-media'
            const vector = document.createElement('div')
            vector.className = 'sr-figure-vector'
            vector.appendChild(media.querySelector('svg'))
            media.appendChild(vector)
            if (surface === 'exercise-probe') {
              const article = document.createElement('article')
              article.className = 'sr-ex'
              const number = document.createElement('div')
              number.className = 'sr-ex-n sr-num'
              const body = document.createElement('div')
              body.className = 'sr-ex-body'
              nativeFigure.replaceWith(article)
              article.append(number, body)
              body.append(nativeFigure)
              const columns = getComputedStyle(article).gridTemplateColumns.split(' ')
              const gap = Number.parseFloat(getComputedStyle(article).columnGap)
              article.style.width = `${width + Number.parseFloat(columns[0]) + gap}px`
            }
          }
        }, { surface, width })
        for (const figure of ['fig-201', 'fig-202']) {
          const locator = page.locator(`figure[data-figure-id="${figure}"]`)
          assert.equal(await locator.count(), 1)
          await assertActualFigureText(locator, 16)
          await assertFigurePixels(locator, page)
          const result = await locator.evaluate(element => {
            const svg = element.querySelector('svg')
            const media = element.querySelector('.sr-figure-media')
            const svgBox = svg.getBoundingClientRect()
            const labels = [...svg.querySelectorAll('text')].map(node => {
              const matrix = node.getScreenCTM()
              const rect = node.getBoundingClientRect()
              const scale = Math.min(Math.hypot(matrix.a, matrix.b), Math.hypot(matrix.c, matrix.d))
              return {
                text: node.textContent, px: Number.parseFloat(getComputedStyle(node).fontSize) * scale,
                insideSvg: rect.left >= svgBox.left - 0.1 && rect.right <= svgBox.right + 0.1 && rect.top >= svgBox.top - 0.1 && rect.bottom <= svgBox.bottom + 0.1,
              }
            })
            return {
              figureWidth: element.getBoundingClientRect().width, mediaWidth: media.getBoundingClientRect().width,
              svgWidth: svgBox.width, svgHeight: svgBox.height,
              overflowPx: Math.max(0, element.scrollWidth - element.clientWidth), labels,
            }
          })
          assert.ok(Math.abs(result.mediaWidth - width) < 0.1, `${surface} ${figure} media width is not ${width}`)
          assert.ok(result.labels.every(label => label.insideSvg), 'Text outside SVG')
          assert.equal(result.overflowPx, 0, 'Inline figure overflows')
          assert.ok(result.labels.every(label => /^[A-Za-z0-9 _]+$/.test(label.text)), 'Non-English visible figure label')
          let screenshot = null
          if (locale === 'en' && ((surface === 'prose' && width === 342) || (surface === 'exercise-probe' && width === 331))) {
            const output = path.join(D, 'display', `${figure}.${surface}.${width}.png`)
            fs.mkdirSync(path.dirname(output), { recursive: true })
            await locator.screenshot({ path: output })
            screenshot = { path: output, sha256: hash(output) }
          }
          report.measurements.push({ locale, surface, width, figure, status: 'pass', ...result, screenshot })
        }
        assert.deepEqual(pageErrors, [])
        if (locale === 'en' && width === 331) {
          await page.evaluate(() => {
            for (const element of document.querySelectorAll('figure[data-figure-id]')) {
              element.dataset.figureLayout = 'scroll'
              const media = element.querySelector('.sr-figure-media')
              media.style.removeProperty('width')
              media.style.removeProperty('max-width')
              media.style.fontSize = '16px'
            }
          })
          for (const figure of ['fig-201', 'fig-202']) {
            const locator = page.locator(`figure[data-figure-id="${figure}"]`)
            await assertActualFigureText(locator, 16)
            const result = await locator.evaluate(element => {
              const media = element.querySelector('.sr-figure-media')
              const start = element.scrollLeft
              element.scrollLeft = element.scrollWidth
              const end = element.scrollLeft
              const reachable = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1
              element.scrollLeft = start
              return { mediaWidth: media.getBoundingClientRect().width, containerWidth: element.clientWidth, scrollEnd: end, reachable }
            })
            assert.ok(Math.abs(result.mediaWidth - 640) < 0.1)
            assert.ok(result.scrollEnd > 0 && result.reachable)
            report.scrollControls.push({ surface, figure, status: 'pass', ...result })
          }
        }
        await page.close()
      }
    }
  }
  report.status = 'pass'
} catch (error) {
  report.status = 'fail'
  report.errors.push(error.stack || String(error))
} finally {
  await browser.close()
  const output = write(`display/report.${checkRound}.json`, report)
  console.log(`${report.status.toUpperCase()}: ${output}; ${report.measurements.length} inline measurements; ${report.scrollControls.length} scroll controls`)
}
if (report.status !== 'pass') process.exitCode = 2
