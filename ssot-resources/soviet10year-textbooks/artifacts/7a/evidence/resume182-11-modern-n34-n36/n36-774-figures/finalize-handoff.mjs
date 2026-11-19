import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { base, root, hash, writeNew } from './author-graphs.mjs'

assert.equal(process.cwd(), root)
const asset = (name, role) => {
  const file = path.join(base, name)
  assert.ok(fs.existsSync(file))
  return { role, path: file, sha256: hash(file) }
}
const pngDimensions = file => {
  const bytes = fs.readFileSync(file)
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG')
  const size = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  assert.deepEqual(size, { width: 640, height: 640 })
  return size
}
const figures = ['line', 'reciprocal'].map(kind => {
  const id = `fig-choice-n36-774-${kind}`
  const attempt = kind === 'line' ? 'REPAIR1' : 'FIRST'
  const spec = asset(`${id}.spec.${attempt}.json`, 'spec')
  const svg = asset(`${id}.${attempt}.svg`, 'svg')
  const render = asset(`${id}.render.${attempt}.json`, 'render')
  const preview = asset(`${id}.preview.${attempt}.png`, 'preview')
  const validation = asset(`${id}.validate.${attempt}.receipt.json`, 'validate_receipt')
  const renderReceipt = asset(`${id}.render.${attempt}.receipt.json`, 'render_receipt')
  const report = JSON.parse(fs.readFileSync(render.path, 'utf8'))
  assert.equal(report.status, 'pass')
  assert.equal(report.spec.sha256, spec.sha256)
  assert.equal(path.resolve(root, report.spec.path), spec.path)
  assert.equal(report.output.svg.sha256, svg.sha256)
  assert.equal(path.resolve(root, report.output.svg.path), svg.path)
  assert.equal(JSON.parse(fs.readFileSync(validation.path, 'utf8')).exitCode, 0)
  assert.equal(JSON.parse(fs.readFileSync(renderReceipt.path, 'utf8')).exitCode, 0)
  assert.deepEqual(report.collisions, [])
  assert.equal(report.displayChecks.length, 1)
  assert.equal(report.displayChecks[0].width, 640)
  assert.equal(report.displayChecks[0].measuredMinPx, 20)
  const current = JSON.parse(fs.readFileSync(spec.path, 'utf8'))
  const first = JSON.parse(fs.readFileSync(path.join(base, `${id}.spec.FIRST.json`), 'utf8'))
  assert.deepEqual(current.source, first.source)
  assert.deepEqual(current.assertions, first.assertions)
  for (const objectId of ['sqrt-curve', 'rhs-curve', 'instructional-grid', 'coordinate-frame']) {
    assert.deepEqual(
      current.objects.find(object => object.id === objectId),
      first.objects.find(object => object.id === objectId),
    )
  }
  const svgText = fs.readFileSync(svg.path, 'utf8')
  assert.ok(svgText.includes('--ld-figure-ink'))
  assert.ok(svgText.includes('--ld-figure-muted'))
  assert.ok(!/[\u0400-\u04ff\u3400-\u9fff]/.test(svgText))
  return {
    id, finalAttempt: attempt,
    assets: { spec, svg, render, preview },
    evidence: { validation, renderReceipt },
    browserPreview: {
      dimensions: pngDimensions(preview.path),
      producer: 'Existing render_spec.mjs --png; Chromium screenshot of the complete composite SVG with resolved --ld-figure-* CSS variables.',
      bareResvgUsed: false, actualViewCount: 1, displayWidthPx: 640,
    },
    mechanicalStatus: {
      validationExitCode: 0, renderReportStatus: report.status,
      collisions: report.collisions, measuredMinTextPx: 20,
      checkedProductWidths: [640],
    },
  }
})

const visual = writeNew('author-visual-observation.FINAL.json', {
  schema: 'n36-774/author-visual-observation@1',
  role: 'author', status: 'observed-no-visible-defect',
  inspectedBy: 'Author actually opened each final completed preview once with view_image detail=original.',
  figures: figures.map(figure => ({
    id: figure.id, preview: figure.assets.preview,
    observed: [
      'Complete 640x640 figure including top formula legend, all frame sides, rightmost x tick and bottommost y tick is visible.',
      'One shared grid and coordinate system contains the solid square-root curve and dashed right-hand-side curve.',
      'Formula legend stroke styles match the plotted curves; English formulas and numeric axes are readable.',
      'No intersection dot, solution coordinate label, projected intersection guide or cultural glyph is visible.',
      figure.id.endsWith('-line')
        ? 'The descending affine line extends across the frame; x=9 remains visible without emphasis. The four repaired labels are separated; x-axis 6 is deliberately lower to avoid the line.'
        : 'Half-unit cells are visible with integer numeric labels; the reciprocal curve reaches the top and right frame exactly and does not use an arbitrary near-zero cutoff.',
    ],
  })),
  usage: {
    plannedViews: 2, actualViews: 2, sourceImagesViewed: 0,
    failedFirstPreviewViewed: false,
    batchUsed: 2, batchLimit: 8, contextUsed: 2, contextLimit: 24,
    generatedPreviews: 3, note: 'The failed FIRST line preview is retained but was not loaded into image context.',
  },
  limitations: [
    'Author observation is not an independent review or approval.',
    'No application, publishing surface, theme-switching or scroll interaction was run under this offline authorization.',
    'Only the declared fixed 640px scroll-media width was rendered and viewed.',
  ],
  independentGraphGate: {
    owner: 'parent', status: 'not-performed-pending',
    selfPromoted: false, reviewPassFileCreated: false,
  },
})

const originalConstruction = JSON.parse(fs.readFileSync(path.join(base, 'mathematical-construction.FIRST.json'), 'utf8'))
const construction = writeNew('mathematical-construction.FINAL.json', {
  ...originalConstruction,
  originalConstructionReceipt: asset('mathematical-construction.FIRST.json', 'first_mathematical_receipt'),
  figures: originalConstruction.figures.map(figure => {
    const final = figures.find(item => item.id === figure.id)
    return {
      ...figure,
      specPath: final.assets.spec.path, specSha256: final.assets.spec.sha256,
      finalSvg: final.assets.svg,
      geometryPreservedFromFirstSpec: true,
      mathematicalValidation: 'All exact source equations, Bezier controls, reciprocal rational samples and analytic error bound remain unchanged after the label-only line repair.',
    }
  }),
  imageUsage: { planned: 2, viewed: 2, skillPerBatchLimit: 8, contextLimit: 24 },
  independentGraphGate: { owner: 'parent', status: 'pending', authorCannotPromote: true },
})

const preserved = fs.readdirSync(base)
  .filter(name => fs.statSync(path.join(base, name)).isFile())
  .filter(name => name.includes('FIRST') || name.includes('REPAIR1'))
  .sort()
  .map(name => asset(name, 'preserved_attempt_artifact'))
const handoff = writeNew('handoff.FINAL.json', {
  schema: 'n36-774/figure-handoff@1',
  ticket: 'STEMROBIN-182', choice: 'n36', sourceExercise: '774',
  soleCwd: root, ownerDirectory: base,
  authoredFigureCount: 2,
  figures,
  mathematicalConstruction: {
    role: 'mathematical_receipt', path: construction, sha256: hash(construction),
  },
  analyticSampleProvenance: asset('fig-choice-n36-774-reciprocal.samples.FIRST.json', 'exact_rational_samples'),
  authorVisual: { role: 'author_visual_observation', path: visual, sha256: hash(visual) },
  preservedAttempts: preserved,
  scripts: ['author-graphs.mjs', 'run-first.mjs', 'repair-line-once.mjs', 'finalize-handoff.mjs'].map(name => asset(name, 'script')),
  firstFailure: {
    figure: 'fig-choice-n36-774-line', stage: 'render', exitCode: 2,
    reason: 'Four axis/origin label collisions; validation and text-size checks had passed.',
    retained: true, targetedRepairs: 1, finalMechanicalStatus: 'pass',
  },
  writeScope: 'All authored specs, SVGs, renders, previews, evidence, scripts and browser temporary/home/cache/config directories were placed inside ownerDirectory. No existing external file was edited or reverted.',
  prohibitionsObserved: [
    'No .env reads', 'No network calls or installs', 'No database', 'No application reads or runs',
    'No Git operations', 'No publishing or promotion', 'No answer files or answer/author keys',
    'No cap3', 'No question or draft edits', 'No original images',
  ],
  independentGraphGate: {
    owner: 'parent', status: 'not-performed-pending',
    authorVisualIsIndependentPass: false,
    nextAction: 'Parent independently inspects the actual final graphs against original written774 and authoredBasis; author must not self-promote.',
  },
})
console.log(JSON.stringify({
  handoff: { path: handoff, sha256: hash(handoff) },
  mathematicalConstruction: { path: construction, sha256: hash(construction) },
  authorVisual: { path: visual, sha256: hash(visual) },
  finalAssets: figures.map(figure => ({ id: figure.id, assets: figure.assets })),
  reciprocalTotalErrorBoundPx: originalConstruction.figures[1].construction.rhs.error.totalBoundPx,
  imageUsage: { viewed: 2, batchLimit: 8, contextLimit: 24 },
  independentGraphGate: 'parent-owned pending',
}, null, 2))
