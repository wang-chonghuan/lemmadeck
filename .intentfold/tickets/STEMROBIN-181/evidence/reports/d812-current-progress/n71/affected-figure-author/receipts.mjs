import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const W = path.dirname(fileURLToPath(import.meta.url))
const [mode] = process.argv.slice(2)
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert(file.startsWith(`${W}/`) && !fs.existsSync(file))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const files = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory()
    ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
const finals = [
  { id: 'fig-147', directory: path.join(W, 'round-2') },
  { id: 'fig-148', directory: path.join(W, 'round-3') },
]

if (mode === 'media') {
  const require = createRequire(path.join(R, '.agents/skills/package.json'))
  const { chromium } = require('playwright-core')
  const executablePath = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH,
    chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean).find(file => fs.existsSync(file))
  assert(executablePath)
  for (const { id, directory } of finals) {
    const native = read(path.join(directory, `${id}.render.json`))
    assert.equal(native.status, 'pass', 'Do not preview a failed dependent native candidate')
  }
  const browser = await chromium.launch({ executablePath, headless: true })
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 })
    for (const { id, directory } of finals) {
      const svgFile = path.join(directory, `${id}.svg`)
      const svgBytes = fs.readFileSync(svgFile)
      const checks = []
      for (const width of [342, 640]) {
        await page.setViewportSize({ width, height: 900 })
        await page.setContent(`<!doctype html><style>
          html,body { margin:0; background:white; }
          #media { display:block; width:${width}px; height:auto; }
          #measure { position:absolute; left:-10000px; width:${width}px; }
          #measure svg { display:block; width:${width}px; height:auto; }
        </style>
        <img id="media" alt="" src="data:image/svg+xml;base64,${svgBytes.toString('base64')}">
        <div id="measure">${svgBytes.toString('utf8')}</div>`)
        await page.locator('#media').evaluate(img => img.decode())
        await page.evaluate(() => document.fonts.ready)
        const measurement = await page.evaluate(() => {
          const rect = document.getElementById('media').getBoundingClientRect()
          const texts = [...document.querySelectorAll('#measure svg text')].map(node => {
            const matrix = node.getScreenCTM()
            return {
              id: node.getAttribute('data-label-id'), text: node.textContent,
              px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            }
          })
          return { width: rect.width, height: rect.height,
            minTextPx: Math.min(...texts.map(text => text.px)), texts }
        })
        const png = path.join(W, 'media', `${id}.${width}.png`)
        assert(!fs.existsSync(png))
        fs.mkdirSync(path.dirname(png), { recursive: true })
        await page.locator('#media').screenshot({ path: png, animations: 'disabled' })
        checks.push({
          actualCSSWidth: width, ...measurement, png: bind(png),
          status: measurement.width === width && measurement.minTextPx >= 16 ? 'PASS' : 'FAIL',
        })
      }
      write(path.join(W, 'media', `${id}.media.json`), {
        svg: bind(svgFile),
        nativeRender: bind(path.join(directory, `${id}.render.json`)),
        method: 'Same-byte native SVG as img at342/640 actual CSS widths; font screen-CTM of same-byte offscreen inline SVG.',
        checks, status: checks.every(check => check.status === 'PASS') ? 'PASS' : 'FAIL',
        pngsGeneratedButNotOpenedIntoModelContext: true,
        headless: true, headedProductMeasurementClaimed: false,
        originalCropsResizesOrRegeneration: 0,
        semanticReview: false, independentReview: false, fullDisplayApproval: false,
      })
      assert(checks.every(check => check.status === 'PASS'))
    }
    await page.close()
  } finally {
    await browser.close()
  }
  console.log(JSON.stringify({ media: finals.map(({ id }) =>
    bind(path.join(W, 'media', `${id}.media.json`))) }, null, 2))
} else if (mode === 'freeze') {
  const inputs = read(path.join(W, 'input-bindings.json'))
  for (const bound of inputs.previousEntireAuthorBundle) assert.equal(sha(bound.path), bound.sha256)
  for (const bound of inputs.originals) assert.equal(sha(bound.path), bound.sha256)
  for (const bound of Object.values(inputs.textBindings)) assert.equal(sha(bound.path), bound.sha256)
  for (const key of ['validator', 'renderer', 'textReview', 'sourceGlyphReview']) {
    assert.equal(sha(inputs[key].path), inputs[key].sha256)
  }
  const outputs = finals.map(({ id, directory }) => {
    const specFile = path.join(directory, `${id}.spec.json`)
    const svgFile = path.join(directory, `${id}.svg`)
    const renderFile = path.join(directory, `${id}.render.json`)
    const render = read(renderFile)
    const execution = read(path.join(directory, `${id}.native-execution.json`))
    const media = read(path.join(W, 'media', `${id}.media.json`))
    assert.equal(render.spec.sha256, sha(specFile))
    assert.equal(render.output.svg.sha256, sha(svgFile))
    assert.equal(render.status, 'pass')
    assert.equal(execution.status, 'PASS')
    assert.equal(media.status, 'PASS')
    assert.equal(render.collisions.length, 0)
    return {
      figure: id, spec: bind(specFile), svg: bind(svgFile), nativeReport: bind(renderFile),
      execution: bind(path.join(directory, `${id}.native-execution.json`)),
      context: bind(path.join(W, 'contexts', `${id}.context.json`)),
      source: inputs.originals.find(original => original.path.endsWith(`${id}.png`)),
      png342: media.checks[0].png, png640: media.checks[1].png,
      nativePNG640: bind(path.join(directory, `${id}.640.png`)),
      actualNativeStatus: render.status, actualNativeExit: execution.renderExit,
      nativeCollisions: render.collisions,
      actualDisplayChecks: render.displayChecks,
      independentFIG: 'HOLD_PENDING_PARENT_REVIEW',
      independentDISPLAY: 'HOLD_PENDING_PARENT_REVIEW',
      sourceFrame: 'HOLD_PENDING_PARENT_INDEPENDENT_SOURCE_AND_FRAME_REVIEW',
    }
  })
  const opens = {
    schema: 'd803-actual-image-opens@1',
    sequence: inputs.originals.map((original, i) => ({
      ordinal: i + 1, ...original, kind: 'canonical original reopen before draft use',
    })),
    new: 2, thisBatch: 2, batchLimit: 8, thisContext: 2, contextLimit: 24,
    sourceReopens: 2, sourceCrops: 0, previewOpens: 0,
    generatedPNGs: 7,
    generatedPNGsNotLoadedIntoModelContext: true,
    d441HistoricalContextLedger: { prior: 5, new: 6, cumulative: 11, limit: 24 },
    historicalLedgerUnchangedNotClaimedAsThisContextOrReset: true,
    parentImagesOpened: 0, imagePayloadsReturnedToParent: 0,
  }
  write(path.join(W, 'actual-opens.json'), opens)
  const report = {
    schema: 'd803-affected-figure-repair-report@1',
    ticket: 'STEMROBIN-181/181-3', date: '2026-11-18',
    root: W, status: 'REPAIRED_CANDIDATES_NATIVE_PASS_INDEPENDENT_REVIEW_PENDING',
    candidates: outputs,
    repairs: {
      prior: 1, new: 2, cumulative: 3,
      round2: { figures: ['fig-147', 'fig-148'], results: ['PASS', 'FAIL_F_LABEL_PADDING'] },
      round3: { figures: ['fig-148'], result: 'PASS', change: 'Only F-label offset +4px horizontally' },
      plan: bind(path.join(W, 'repair-plan.json')),
      round3Plan: bind(path.join(W, 'repair-round-3.json')),
      allFIRSTAndPreviousRepairsPreserved: true,
      round2NativeFAILPreserved: true,
      humanPermission: 'Ordinary reversible repair without extra count approval',
    },
    originalInventory: bind(path.join(W, 'source-inventory.json')),
    lowerGlyphC: {
      status: 'RETAINED_INDEPENDENT_SOURCE_OBSERVATION_PASS',
      authority: inputs.sourceGlyphReview,
      newPrimeHypothesis: false,
      historicalAuthorHypothesisAndUncertaintyUnmodified: true,
      sourcePixelPASSNotUsedAsModernFIGPASS: true,
    },
    SCI: 'INHERITED_D433_PASS_UNCHANGED', ZHEN: 'INHERITED_D433_PASS_UNCHANGED',
    textReview: inputs.textReview,
    currentAuthoritativeBilingualFiles: inputs.textBindings,
    changedSemanticText: 0, pointRayAssertionOrToleranceChanges: 0,
    mirrorConstruction: 'Source-style bowed silhouette through unchanged circular-model contact anchors. Peripheral outline/aperture is schematic, not newly inferred physical data. Exact-scale spherical frame is not certified; parent independent frame review pending.',
    inputBindings: bind(path.join(W, 'input-bindings.json')),
    inputAndPreviousBundleHashPreservationConfirmed: true,
    imageUsage: opens,
    nativeInvocations: { explicitDraft: 3, renderer: 3, rendererInternalDraft: 3 },
    limits: {
      writesOnlyInsideAuthorizedRoot: true,
      rendererOrValidatorModifications: 0,
      selfReview: 0, independentReviews: 0, recordReview: 0,
      canonicalOrIndexOrMeterWrites: 0, gitCommands: 0, databaseCommands: 0,
      publisherCalls: 0, deployCalls: 0, paidCalls: 0,
      newAgents: 0, messages: 0, worktrees: 0,
      fullCardApproval: false, fullDisplayApproval: false,
    },
  }
  write(path.join(W, 'report.json'), report)
  const toFreeze = files(W)
  toFreeze.forEach(file => fs.chmodSync(file, 0o444))
  const manifest = {
    schema: 'd803-frozen-candidate-manifest@1',
    root: W, report: bind(path.join(W, 'report.json')),
    candidates: outputs, newRepairs: 2, cumulativeRepairs: 3,
    imageOpens: 2, batchLimit: 8, contextOpens: 2, contextLimit: 24,
    files: toFreeze.map(file => ({ ...bind(file), mode: '0444' })),
    native: { fig147: 'PASS', fig148: 'PASS' },
    independentReview: 'PARENT_PENDING',
  }
  write(path.join(W, 'frozen-manifest.json'), manifest)
  fs.chmodSync(path.join(W, 'frozen-manifest.json'), 0o444)
  console.log(JSON.stringify({
    manifest: bind(path.join(W, 'frozen-manifest.json')),
    report: bind(path.join(W, 'report.json')),
    candidates: outputs, repairs: report.repairs,
    images: { new: 2, batchLimit: 8, context: 2, contextLimit: 24 },
  }, null, 2))
} else {
  throw new Error(`Unknown mode: ${mode}`)
}
