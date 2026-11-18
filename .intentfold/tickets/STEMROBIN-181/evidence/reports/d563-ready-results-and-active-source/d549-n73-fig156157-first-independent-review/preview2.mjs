import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const author = path.join(tmp, 'd537-n73-first-modern-figure-author')
const contextRoot = path.join(tmp, 'd535-n73-first-figure-contexts')
const ids = ['fig-156', 'fig-157']
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = (file, expected) => ({
  path: file,
  sha256: hash(file),
  ...(expected ? { expectedSha256: expected, matchesExpected: hash(file) === expected } : {}),
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
  bytes: fs.statSync(file).size,
})
const json = (name, value) => fs.writeFileSync(
  path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' },
)

const freezeFile = path.join(author, 'author-freeze.json')
const reportFile = path.join(author, 'report.json')
const manifestFile = path.join(contextRoot, 'manifest.json')
const detached = [
  binding(freezeFile, 'deb0f8af88181e13438eb3b4ed243f2cf88e2ff60e945c4a46b28b98b1ffed7e'),
  binding(reportFile, '2f49f83facb5df1868f11ed83f802c2cf44f074d3246fd2165b9ae96273331b6'),
  binding(manifestFile, '98025ba46ba8227721246f58ca9882f834e79f896046e34907dc171f7bc28bb9'),
]
const freeze = read(freezeFile)
const frozenFiles = freeze.files.map(item => binding(item.path, item.sha256))
const manifest = read(manifestFile)
const contexts = manifest.contexts.filter(item => ids.includes(item.figure))
if (contexts.length !== 2) throw new Error('Expected exactly the two authorized figures')
const inputs = [
  manifest.fullEN, manifest.fullZH, manifest.textReview,
  ...contexts.flatMap(item => [item.originalImage, item.context]),
].map(item => binding(path.resolve(repo, item.path), item.sha256))
const candidates = ids.map(figure => ({
  figure,
  files: ['spec.json', 'render.json', `${figure}.svg`, `${figure}.png`].map(name => {
    const file = path.join(author, figure, 'after', name)
    const frozen = frozenFiles.find(item => item.path === file)
    if (!frozen) throw new Error(`Candidate absent from author freeze: ${file}`)
    return frozen
  }),
}))
const sourceInventory = binding(path.join(out, 'independent-inventory.json'))
const before = {
  schema: 'd549/current-inputs@1',
  phase: 'before-first-browser-preview',
  recordedAt: new Date().toISOString(),
  preImagePreflight: {
    performed: true,
    commandObservationTime: '2026-11-18T11:12:47.435Z',
    detachedHashesMatched: true,
    authorFilesChecked: 125,
    authorFileHashesMatched: true,
    authorFilesMode0444: true,
    scopedInputHashesMatched: true,
    sourceAndContextAndManifestMode: '0644',
    bilingualAndTextReviewMode: '0444',
  },
  detached,
  authorFreeze: {
    filesChecked: frozenFiles.length,
    allHashesMatch: frozenFiles.every(item => item.matchesExpected),
    allModes0444: frozenFiles.every(item => item.mode === '0444'),
    files: frozenFiles,
  },
  inputs,
  candidates,
  sourceInventory,
  inputModesAreRecordedNotAltered: true,
  authorREADYIsNotIndependentPASS: true,
}
json('inputs-current.before.json', before)
if (
  !detached.every(item => item.matchesExpected) ||
  !inputs.every(item => item.matchesExpected) ||
  !frozenFiles.every(item => item.matchesExpected && item.mode === '0444') ||
  sourceInventory.mode !== '0444'
) throw new Error('Input provenance changed before screenshot; preserve this first result')

const runtime = path.join(out, 'browser-tmp')
fs.mkdirSync(runtime, { recursive: true })
process.env.TMPDIR = runtime
const require = createRequire(path.join(repo, 'app/package.json'))
const { chromium } = require('playwright')
const executablePath = chromium.executablePath()
if (!fs.existsSync(executablePath)) throw new Error('Installed app Chromium is unavailable')
const browser = await chromium.launch({ executablePath, headless: true })
const previews = []
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    serviceWorkers: 'block',
  })
  await context.route('**/*', route => route.abort())
  for (const figure of ids) {
    const svgFile = path.join(author, figure, 'after', `${figure}.svg`)
    const svgBefore = binding(svgFile)
    const pngFile = path.join(out, `${figure}.preview2.browser-342.png`)
    if (fs.existsSync(pngFile)) throw new Error('First screenshot already exists; never overwrite')
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(String(error)))
    const svg = fs.readFileSync(svgFile, 'utf8')
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
      <style>
        html, body { margin: 0; background: white; }
        body { padding: 24px; }
        .preview2 { width: 342px; background: white; }
        .preview2 > svg { width: 100%; height: auto; display: block; }
      </style></head><body><div class="preview2">${svg}</div></body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const metrics = await page.locator('.preview2').evaluate(container => {
      const svg = container.querySelector('svg')
      const box = svg.getBoundingClientRect()
      return {
        containerWidthPx: container.getBoundingClientRect().width,
        svgWidthPx: box.width,
        svgHeightPx: box.height,
        labels: [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          const rect = node.getBoundingClientRect()
          return {
            id: node.dataset.labelId,
            text: node.textContent,
            screenFontPx: parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            computedFill: getComputedStyle(node).fill,
            bounds: { x: rect.x - box.x, y: rect.y - box.y, width: rect.width, height: rect.height },
          }
        }),
        strokes: [...svg.querySelectorAll('path,line,circle,ellipse,polygon,polyline')]
          .filter(node => !node.closest('defs') && getComputedStyle(node).display !== 'none')
          .map(node => ({
            id: node.id,
            computedStroke: getComputedStyle(node).stroke,
            computedFill: getComputedStyle(node).fill,
          })),
      }
    })
    if (metrics.containerWidthPx !== 342 || metrics.svgWidthPx !== 342) {
      throw new Error('Preview is not the authorized actual mobile width')
    }
    await page.locator('.preview2').screenshot({
      path: pngFile,
      type: 'png',
      animations: 'disabled',
      scale: 'css',
    })
    const header = fs.readFileSync(pngFile)
    const svgAfter = binding(svgFile)
    previews.push({
      figure,
      firstScreenshot: true,
      method: 'existing app Playwright isolated headless Chromium; unchanged frozen SVG inline; first element screenshot',
      renderer: { playwrightVersion: require('playwright/package.json').version, executablePath },
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      actualWidthPx: 342,
      svgBefore,
      svgAfter,
      svgBytesUnchanged: svgBefore.sha256 === svgAfter.sha256,
      png: { ...binding(pngFile), widthPx: header.readUInt32BE(16), heightPx: header.readUInt32BE(20) },
      metrics,
      pageErrors: errors,
      cssVariables: 'Original var() expressions and fallbacks are resolved by Chromium; no variables replaced or redefined.',
      screenshotCreatedButNotYetOpenedAtThisRecord: true,
    })
    await page.close()
  }
} finally {
  await browser.close()
}
const evidence = {
  schema: 'd549/first-mobile-preview2@1',
  recordedAt: new Date().toISOString(),
  figures: previews,
  browserClosed: true,
  screenshotsCreated: previews.length,
  resvgPreviewsCreated: 0,
  actualModelImageOpensAtGeneration: 4,
  noImageBudgetReset: true,
  methodCorrectionIsNotFigureRepair: true,
  sourceOrSpecOrSVGEdits: 0,
  nativeValidatorOrRendererReruns: 0,
  DISPLAY: 'pending-fullcard',
  fullcard: false,
  scope: 'Figure-only mobile observation apparatus, not integrated product or full-card DISPLAY acceptance.',
}
json('preview2-browser-evidence.json', evidence)
console.log(JSON.stringify({
  screenshotsCreated: previews.length,
  browserClosed: true,
  previews: previews.map(item => ({
    figure: item.figure, png: item.png,
    svgBytesUnchanged: item.svgBytesUnchanged,
    width: item.metrics.svgWidthPx,
    labelScreenPx: item.metrics.labels.map(label => label.screenFontPx),
  })),
}, null, 2))
