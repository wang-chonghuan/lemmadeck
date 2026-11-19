import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181')
const D = path.join(T, 'tmp/d859-n86-fig200-disclosure-repair')
const A = path.join(T, 'tmp/d831-n86-fig200-first-author')
const I = path.join(T, 'tmp/d844-n86-fig200-first-independent-review')
const expectedReview = 'f73fcf76c335e9295c51c99b0670e14076696a66e440c3c6ae139282f2a712d7'
const specPath = path.join(D, 'frozen/fig-200.spec.json')
const svgPath = path.join(D, 'frozen/fig-200.svg')
const renderPath = path.join(D, 'frozen/fig-200.render.json')
const native = path.join(R, '.agents/skills/ld-s10y-image/scripts')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const inside = p => assert.ok(p.startsWith(`${D}/`), `Unauthorized write: ${p}`)
const write = (p, value) => {
  inside(p)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
}
const copy = (from, to) => {
  inside(to)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  fs.chmodSync(to, 0o600)
}
const filesUnder = p => fs.readdirSync(p, { withFileTypes: true }).flatMap(entry => {
  const child = path.join(p, entry.name)
  return entry.isDirectory() ? filesUnder(child) : entry.isFile() ? [child] : []
})
const unchanged = bindings => {
  for (const binding of bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
}
assert.equal(process.cwd(), R)
assert.equal(hash(path.join(I, 'report.json')), expectedReview)
const review = read(path.join(I, 'report.json'))
const original = read(path.join(A, 'frozen/fig-200.spec.json'))
assert.equal(review.status, 'FAIL')
assert.equal(review.blockingFindings.length, 1)
assert.equal(review.blockingFindings[0].id, 'FIG200-THIN-LAYER-MAGNIFICATION-DISCLOSURE')

if (process.argv[2] === 'prepare') {
  fs.mkdirSync(path.join(D, 'runtime-tmp'), { recursive: true })
  const contexts = read(path.join(A, 'context-bindings.json'))
  assert.deepEqual(contexts.completeApprovedBilingualText, original.source.authoritativeText)
  const priorFiles = [
    ...filesUnder(path.join(A, 'frozen')),
    ...filesUnder(path.join(A, 'attempts')),
    ...filesUnder(path.join(A, 'previews')),
    ...filesUnder(path.join(I, '.')),
    ...['report.json', 'context-bindings.json', 'source-inventory.json',
      'geometry-basis.json', 'display-verification.json',
      'FIRST-exploration-failure.json', 'FIRST-native-failure.json',
      'FIRST-render-failure.json', 'revision-1-repair.json', 'revision-2-repair.json']
      .map(name => path.join(A, name)),
    ...['render_spec.mjs', 'validate_spec.py', 'materialize_arrowheads.mjs']
      .map(name => path.join(native, name)),
    path.join(R, '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json'),
    path.join(R, '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js'),
    path.join(A, 'check-raster.py'),
    contexts.inputs.affectedTextClearance.path,
    original.source.image.path,
  ]
  for (const locale of ['zh', 'en']) {
    const context = contexts.contexts[locale]
    assert.equal(hash(context.path), context.sha256)
    copy(context.path, path.join(D, `frozen/source-contexts/${locale}.context.json`))
    const lesson = contexts.inputs.templates[locale].lesson
    assert.equal(hash(lesson.path), lesson.sha256)
    priorFiles.push(context.path, lesson.path)
  }
  for (const key of ['spec', 'svg', 'render']) {
    const input = review.bindings[key]
    assert.equal(hash(input.path), input.sha256)
  }
  copy(path.join(A, 'frozen/fig-200.spec.json'), specPath)
  write(path.join(D, 'frozen/authority-bilingual.json'), original.source.authoritativeText)
  write(path.join(D, 'input-bindings.json'), {
    schema: 'd859/disclosure-repair-inputs@1',
    root: R, authorizedWriteRoot: D, firstIndependentFail: bind(path.join(I, 'report.json')),
    original: review.bindings.originalSourcePng,
    approvedBilingualLessonBindings: Object.fromEntries(['zh', 'en'].map(locale => [
      locale, contexts.inputs.templates[locale].lesson,
    ])),
    completeAuthorityEntries: original.source.authoritativeText.length,
    sourcePixelReopenRequired: false,
    reason: 'Disclosure-only repair; reuse source observations and exact-geometry PASS from FIRST independent review. Source, physical model and approved text do not change.',
    preservedInputs: [...new Set(priorFiles)].map(bind),
    priorAuthorUsage: review.preservedAuthorUsageNotRecounted,
    priorIndependentUsage: review.actualUsage,
    noAnswerOrChoiceFilesRead: true,
  })
  console.log(JSON.stringify({ status: 'PREPARED-UNCHANGED-COPY', spec: bind(specPath) }))
} else if (process.argv[2] === 'retain-first-render') {
  const retained = path.join(D, 'attempts/disclosure-first-render')
  for (const name of ['fig-200.spec.json', 'fig-200.svg', 'fig-200.render.json', 'source-addition-mapping.json']) {
    const from = path.join(D, 'frozen', name)
    const to = path.join(retained, name)
    if (name === 'fig-200.spec.json') {
      copy(from, to)
    } else {
      inside(from)
      inside(to)
      fs.mkdirSync(path.dirname(to), { recursive: true })
      assert.equal(fs.existsSync(to), false)
      fs.renameSync(from, to)
    }
    fs.chmodSync(to, 0o444)
  }
  write(path.join(D, 'disclosure-layout-adjustment.json'), {
    schema: 'd859/affected-layout-adjustment@1',
    firstCandidate: bind(path.join(retained, 'fig-200.spec.json')),
    firstFailure: bind(path.join(D, 'FIRST-render-failure.json')),
    nativeFirstRender: bind(path.join(retained, 'fig-200.render.json')),
    diagnosis: 'The two new lines are too closely spaced after native label padding. The second line is the sole collision; geometry and all three minimum-font checks pass.',
    adjustment: {
      object: 'modern-not-to-scale-disclosure',
      path: '/objects/62/at/1', from: 10.9, to: 10.75,
      meaning: 'Increase separation between only the new disclosure lines in existing upper blank space.',
    },
    existingLabelsChanged: [], geometryChanged: [], assertionsChanged: [],
    sourceOrAuthorityChanged: false, maximumFurtherLayoutAdjustments: 0,
  })
  console.log(JSON.stringify({ status: 'FIRST-FAILED-CANDIDATE-RETAINED', retained }))
} else if (['render', 'render-recovery', 'verify'].includes(process.argv[2])) {
  const recovery = process.argv[2] === 'render-recovery'
  const verificationOnly = process.argv[2] === 'verify'
  const inputs = read(path.join(D, 'input-bindings.json'))
  unchanged(inputs.preservedInputs)
  const spec = read(specPath)
  assert.deepEqual(spec.source, original.source)
  assert.deepEqual(spec.canvas, original.canvas)
  assert.deepEqual(spec.display, original.display)
  assert.deepEqual(spec.layout, original.layout)
  assert.deepEqual(spec.assertions, original.assertions)
  assert.equal(spec.assertions.length, 23)
  assert.deepEqual(spec.objects.slice(0, original.objects.length), original.objects)
  const additions = spec.objects.slice(original.objects.length)
  assert.deepEqual(additions.map(o => o.id), [
    'modern-layer-magnification-disclosure', 'modern-not-to-scale-disclosure',
  ])
  assert.equal(additions.map(o => o.text).join(' '), 'Layer thickness enlarged; not to scale')
  assert.ok(additions.every(o => o.type === 'text' && o.fontSize === 32))
  const stripped = structuredClone(spec)
  stripped.description = original.description
  stripped.objects = stripped.objects.slice(0, original.objects.length)
  assert.deepEqual(stripped, original)
  if (!verificationOnly) write(path.join(D, 'frozen/source-addition-mapping.json'), {
    schema: 'd859/source-addition-mapping@1', figure: 'fig-200',
    classification: 'MODERN-LEARNER-VISIBLE-DISCLOSURE-NOT-ORIGINAL-SOURCE-FACT',
    visibleText: 'Layer thickness enlarged; not to scale',
    visibleLines: additions.map(o => ({ object: o.id, text: o.text, at: o.at, fontSize: o.fontSize })),
    repairRequest: {
      report: inputs.firstIndependentFail,
      finding: 'FIG200-THIN-LAYER-MAGNIFICATION-DISCLOSURE',
    },
    approvedTextBasis: {
      authorityFile: bind(path.join(D, 'frozen/authority-bilingual.json')),
      entryIndexesZeroBased: [1, 12],
      relationship: 'Both approved language passages describe a very thin air layer, h_k much smaller than r_k, and the unchanged exact right triangle.',
    },
    sourceRequirementsRetained: original.source.inventory.map(g => ({
      id: g.id, objects: g.objects, assertions: g.assertions,
    })),
    originalSource: original.source.image,
    sourceInventoryUnchanged: true, sourceSemanticsChanged: false,
    sourcePixelsReopened: 0, approvedBilingualAuthorityUnchanged: true,
    geometricObjectsChanged: [], existingLabelsChanged: [],
    assertionChanges: [], canvasChanges: [], displayChanges: [],
    affectedOnly: 'Two new renderer-owned English labels in existing blank space above the curvature center; description explicitly maps their IDs. No measured value, formula or answer is added.',
    spec: bind(specPath),
  })
  const env = {
    ...process.env, TMPDIR: path.join(D, 'runtime-tmp'),
    PYTHONDONTWRITEBYTECODE: '1',
  }
  const call = (name, command, args, script) => {
    const result = spawnSync(command, args, { cwd: R, encoding: 'utf8', env })
    const receipt = {
      schema: 'd859/local-call@1', cwd: R, command, args, script: bind(script),
      exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
      error: result.error?.message ?? null, paidCalls: 0,
    }
    write(path.join(D, `calls/${name}.json`), receipt)
    if (result.status !== 0) {
      write(path.join(D, `FIRST-${name}-failure.json`), receipt)
      throw new Error(`${name} failed; bounded repair stops without rewriting evidence.`)
    }
    return result
  }
  if (!verificationOnly) {
    const validator = path.join(native, 'validate_spec.py')
    const validation = call(recovery ? 'validate-spec-recovery' : 'validate-spec', 'python3', [validator, specPath, '--stage', 'draft', '--json'], validator)
    assert.equal(JSON.parse(validation.stdout).status, 'pass')
    const renderer = path.join(native, 'render_spec.mjs')
    call(recovery ? 'render-recovery' : 'render', process.execPath, [
      renderer, '--spec', specPath, '--svg', svgPath, '--report', renderPath,
    ], renderer)
  }
  const render = read(renderPath)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specPath))
  assert.equal(render.output.svg.sha256, hash(svgPath))
  assert.equal(render.objects, 63)
  assert.equal(render.labels, 10)
  assert.deepEqual(render.collisions, [])
  assert.deepEqual(render.displayChecks.map(c => [c.width, c.measuredMinPx, c.status]), [
    [331, 16.55, 'pass'], [342, 17.1, 'pass'], [640, 32, 'pass'],
  ])
  const require = createRequire(path.join(R, 'app/package.json'))
  const { chromium } = require('playwright')
  const svg = fs.readFileSync(svgPath, 'utf8')
  const oldSvg = fs.readFileSync(path.join(A, 'frozen/fig-200.svg'), 'utf8')
  const browser = await chromium.launch({ headless: true, env })
  const outputs = []
  let offlineRequestsAborted = 0
  const pageErrors = []
  try {
    const context = await browser.newContext({ deviceScaleFactor: 1 })
    await context.route('**/*', async route => {
      offlineRequestsAborted++
      await route.abort()
    })
    const page = await context.newPage()
    page.on('pageerror', error => pageErrors.push(error.message))
    for (const width of spec.display.widths) {
      await page.setViewportSize({ width, height: Math.ceil(width * 560 / 640) + 2 })
      await page.setContent(`<!doctype html><style>
        :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58; --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795; --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff; }
        html,body { margin:0; padding:0; background:#fff; }
        svg { width:${width}px; height:auto; display:block; }
      </style>${svg}`)
      await page.evaluate(() => document.fonts.ready)
      const measured = await page.evaluate(({ oldSvg }) => {
        const svg = document.querySelector('svg')
        const bounds = svg.getBoundingClientRect()
        const old = new DOMParser().parseFromString(oldSvg, 'image/svg+xml').documentElement
        const structural = node => ({
          tag: node.localName,
          attributes: [...node.attributes].map(a => [a.name, a.value]).sort((a, b) => a[0].localeCompare(b[0])),
          text: node.localName === 'text' ? node.textContent : null,
        })
        const geometry = root => [...root.querySelectorAll('line,path,polygon,polyline,circle,ellipse,rect')]
          .filter(node => !node.closest('defs')).map(structural)
        const originalLabels = root => [...root.querySelectorAll('text')].slice(0, 8)
          .map(structural)
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM()
          const rect = node.getBoundingClientRect()
          return {
            id: node.getAttribute('data-label-id'), text: node.textContent,
            px: Number.parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            insideMedia: rect.x >= bounds.x && rect.y >= bounds.y &&
              rect.right <= bounds.right && rect.bottom <= bounds.bottom,
          }
        })
        const overlaps = []
        for (let i = 0; i < labels.length; i++) {
          for (let j = i + 1; j < labels.length; j++) {
            const a = labels[i].bounds, b = labels[j].bounds
            if (Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 0.1 &&
                Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 0.1) {
              overlaps.push([labels[i].id, labels[j].id])
            }
          }
        }
        return {
          mediaWidth: bounds.width, mediaHeight: bounds.height,
          labels, minMeasuredTextPx: Math.min(...labels.map(l => l.px)), overlaps,
          disclosure: labels.slice(8).map(l => l.text).join(' '),
          geometrySvgNodesUnchanged: JSON.stringify(geometry(svg)) === JSON.stringify(geometry(old)),
          originalSvgLabelsUnchanged: JSON.stringify(originalLabels(svg)) === JSON.stringify(originalLabels(old)),
          unexpectedEmbeddedMedia: svg.querySelectorAll('image,script,foreignObject').length,
        }
      }, { oldSvg })
      assert.equal(measured.mediaWidth, width)
      assert.deepEqual(measured.labels.map(l => l.text), [
        'R', 'R', 'r', 'k', 'h', 'k', 'Lens', 'Glass plate',
        'Layer thickness enlarged;', 'not to scale',
      ])
      assert.ok(measured.labels.every(l => l.px >= 16 && l.insideMedia))
      assert.deepEqual(measured.overlaps, [])
      assert.equal(measured.geometrySvgNodesUnchanged, true)
      assert.equal(measured.originalSvgLabelsUnchanged, true)
      assert.equal(measured.unexpectedEmbeddedMedia, 0)
      const screenshot = path.join(D, `previews/fig-200-${width}.png`)
      inside(screenshot)
      fs.mkdirSync(path.dirname(screenshot), { recursive: true })
      assert.equal(fs.existsSync(screenshot), false)
      await page.locator('svg').screenshot({ path: screenshot, animations: 'disabled' })
      outputs.push({ width, status: 'pass', measured, screenshot: bind(screenshot) })
    }
    await context.close()
  } finally {
    await browser.close()
  }
  assert.deepEqual(pageErrors, [])
  assert.equal(offlineRequestsAborted, 0)
  const rasterScript = path.join(A, 'check-raster.py')
  const python = path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const raster = call('check-raster', python, [rasterScript, ...outputs.map(o => o.screenshot.path)], rasterScript)
  write(path.join(D, 'display-verification.json'), {
    schema: 'd859/author-offline-display-check@1', status: 'pass',
    evidenceClass: 'AUTHOR-ONLY-NOT-INDEPENDENT-REVIEW-NOT-WHOLE-CARD-ACCEPTANCE',
    spec: bind(specPath), svg: bind(svgPath), render: bind(renderPath),
    outputs, rasterChecks: JSON.parse(raster.stdout),
    offlineRequestsAborted, pageErrors, browserClosed: true,
    nativeRendererUnmodified: true, noSourceImagePixelReopens: true,
    noProductOrLessonServerStarted: true,
  })
  unchanged(inputs.preservedInputs)
  console.log(JSON.stringify({
    status: 'NATIVE-AND-AUTHOR-DISPLAY-PASS-PIXEL-INSPECTION-PENDING',
    outputs: outputs.map(o => ({ width: o.width, minTextPx: o.measured.minMeasuredTextPx, screenshot: o.screenshot })),
    spec: bind(specPath), svg: bind(svgPath), render: bind(renderPath),
  }, null, 2))
} else if (process.argv[2] === 'seal') {
  const inputs = read(path.join(D, 'input-bindings.json'))
  const display = read(path.join(D, 'display-verification.json'))
  const observations = read(path.join(D, 'author-observations.json'))
  assert.equal(observations.status, 'AUTHOR-PIXELS-PASS')
  assert.deepEqual(observations.views.map(v => [v.width, v.status]), [
    [331, 'PASS'], [342, 'PASS'], [640, 'PASS'],
  ])
  assert.equal(observations.actualUsage.imagesLoaded, 3)
  unchanged(inputs.preservedInputs)
  for (const output of display.outputs) {
    assert.equal(hash(output.screenshot.path), output.screenshot.sha256)
  }
  for (const key of ['spec', 'svg', 'render']) {
    assert.equal(hash(display[key].path), display[key].sha256)
  }
  const ownFilesBeforeReport = filesUnder(D).filter(p => !p.includes('/runtime-tmp/'))
  const report = {
    schema: 'ld-s10y-image/affected-author-repair@1',
    ticket: 'STEMROBIN-181', successor: '181-3', card: 'phy10-c2-s3-n86', figure: 'fig-200',
    date: '2026-11-19', root: R, authorizedWriteRoot: D,
    round: 'D859-DISCLOSURE-REPAIR-AFTER-FIRST-INDEPENDENT-FAIL',
    status: 'AUTHOR-REPAIR-PASS-AWAITING-SEPARATE-AFFECTED-INDEPENDENT-REVIEW',
    firstIndependentFail: inputs.firstIndependentFail,
    visibleText: 'Layer thickness enlarged; not to scale',
    changedSpecPaths: ['/description', '/objects/61', '/objects/62'],
    affectedObjects: ['modern-layer-magnification-disclosure', 'modern-not-to-scale-disclosure'],
    geometry: {
      status: 'PASS-RETAINED-AND-NATIVELY-VALIDATED', assertions: 23,
      assertionDefinitionsUnchanged: true, originalObjectsUnchanged: true,
      canvasAndDisplayUnchanged: true, actualSvgGeometryNodesUnchanged: true,
      existingSvgLabelsUnchanged: true, geometryChanges: [],
    },
    approvedBilingualText: {
      status: 'PASS-REUSED-NOT-REREVIEWED', authorityEntries: 22,
      sourceAuthoritativeTextUnchanged: true, sourceInventoryUnchanged: true,
      authorityFile: bind(path.join(D, 'frozen/authority-bilingual.json')),
      sourceContexts: ['zh', 'en'].map(locale => bind(path.join(D, `frozen/source-contexts/${locale}.context.json`))),
      approvedLessonBindings: inputs.approvedBilingualLessonBindings,
      noTextOrPhysicalModelChanges: true,
    },
    native: {
      specValidation: bind(path.join(D, 'calls/validate-spec-recovery.json')),
      render: bind(renderPath), renderCall: bind(path.join(D, 'calls/render-recovery.json')),
      renderer: read(renderPath).renderer, nativeRendererUnmodified: true,
      geometryAndLabelCollisions: [],
    },
    authorPixels: {
      status: 'PASS', observations: bind(path.join(D, 'author-observations.json')),
      displayVerification: bind(path.join(D, 'display-verification.json')),
      widths: display.outputs.map(o => ({
        width: o.width, minTextPx: o.measured.minMeasuredTextPx,
        screenshot: o.screenshot, status: 'AUTHOR-PASS',
      })),
    },
    sourceAdditionMapping: bind(path.join(D, 'frozen/source-addition-mapping.json')),
    finalAssets: { spec: bind(specPath), svg: bind(svgPath), render: bind(renderPath) },
    preservation: {
      inputManifest: bind(path.join(D, 'input-bindings.json')),
      preservedInputCount: inputs.preservedInputs.length, allPreservedInputsUnchanged: true,
      FIRSTFailuresRetainedInPlace: true, priorVersionsAndRepairsRetainedInPlace: true,
      priorAuthorSpecRevisions: 2, priorAuthorRenderLayoutRepairRounds: 1,
      priorAuthorImageLoads: 4, priorIndependentImageLoads: 4,
      thisRoundFirstNativeFail: bind(path.join(D, 'FIRST-render-failure.json')),
      thisRoundFirstCandidate: bind(path.join(D, 'attempts/disclosure-first-render/fig-200.spec.json')),
      thisRoundSingleLabelSpaceAdjustment: bind(path.join(D, 'disclosure-layout-adjustment.json')),
      evidencePackageCopies: 0,
    },
    priorAuthorUsageNotRecounted: inputs.priorAuthorUsage,
    priorIndependentUsageNotRecounted: inputs.priorIndependentUsage,
    actualUsage: {
      affectedAuthorRepairAssignments: 1, newSpecRevisions: 2, disclosureRepairRounds: 1,
      disclosureOnlyLabelSpaceAdjustments: 1,
      cumulativeAuthorSpecRevisions: 4, cumulativeAuthorRepairRounds: 3,
      geometricRelationshipRevisions: 0, existingLabelLayoutRevisions: 0,
      approvedTextRevisions: 0, sourceSemanticRevisions: 0,
      explicitNativeSpecValidationCalls: 2, nativeRenderCalls: 2,
      renderInternalSpecValidationCalls: 2, nativeFailedCalls: 1,
      technicalHelperFailures: 2, helperOnlyTechnicalRecoveries: 2,
      retainedTechnicalFailure: bind(path.join(D, 'FIRST-candidate-write-permission-failure.json')),
      retainedDisplayHelperFailure: bind(path.join(D, 'FIRST-display-helper-failure.json')),
      ordinaryReadOnlyProbeFailures: 1,
      ordinaryReadOnlyProbeFailure: 'Initial rg inventory included the not-yet-created authorized repair directory; no source/content failure or retry.',
      nativeBuildContextCalls: 0, offlineDisplayCheckInvocations: 2,
      rasterCheckInvocations: 1, headlessBrowserLaunches: 4,
      newScreenshots: 3, localRasterGenerations: 3,
      imagesLoaded: 3, sourceImagesLoaded: 0, previousOutputImagesLoaded: 0,
      newOutputImagesLoaded: 3, imageReopens: 0, imageBatches: 1,
      maxImagesInBatch: 3, imageBatchLimit: 8, contextImageLimit: 24,
      currentContextImageLoads: 3, cumulativeAuthorImageLoads: 7,
      totalLineageImageLoadsAcrossSeparateContexts: 11,
      fullTextRereviews: 0, sourceReviewsReplayed: 0,
      independentReviewAssignments: 0, recordReviewCalls: 0,
      paidCalls: 0, modelImageGenerationCalls: 0, answerOrChoiceFileReads: 0,
      meterReadsOrWrites: 0, canonicalWrites: 0, indexWrites: 0,
      repositoryCodeChanges: 0, databaseCalls: 0, publisherCalls: 0,
      deployCalls: 0, gitCalls: 0, fullTestsOrBuilds: 0,
      otherChatOperations: 0, branchOperations: 0, worktreeOperations: 0,
      declaredArtifactWritesOutsideAuthorizedRoot: 0,
    },
    plateV: {
      status: 'SOURCE-OBSERVED-SAVED-EVIDENCE-ROMAN-COLOR-PIPELINE-HOLD-RETAINED',
      scope: 'Untouched separate dependency. No bypass, native/FIG/display clearance or whole-card clearance.',
    },
    disposition: {
      independentReviewStatus: 'NOT-PERFORMED', recordReviewPerformed: false,
      canonicalOrSharedRecordsWritten: false, promotionApproved: false,
      publicationApproved: false, wholeN86Approved: false,
      nextStep: 'Separate authorized affected-only independent review of the frozen repair; stop here.',
    },
    frozenEvidence: ownFilesBeforeReport.map(bind),
    freeze: {
      fileMode: '0444', directoryMode: '0555',
      manifest: path.join(D, 'hashes.sha256'),
      reportOnlyNotIndependentApproval: true,
    },
  }
  write(path.join(D, 'report.json'), report)
  const manifestFiles = filesUnder(D).filter(p => !p.includes('/runtime-tmp/')).sort()
  const manifest = path.join(D, 'hashes.sha256')
  inside(manifest)
  fs.writeFileSync(manifest, manifestFiles.map(p => `${hash(p)}  ${path.relative(D, p)}`).join('\n') + '\n', {
    flag: 'wx', mode: 0o444,
  })
  unchanged(inputs.preservedInputs)
  for (const file of filesUnder(D)) fs.chmodSync(file, 0o444)
  const freezeDirs = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) freezeDirs(path.join(dir, entry.name))
    }
    fs.chmodSync(dir, 0o555)
  }
  freezeDirs(D)
  console.log(JSON.stringify({
    status: report.status, report: bind(path.join(D, 'report.json')),
    assets: report.finalAssets, sourceAdditionMapping: report.sourceAdditionMapping,
    manifest: bind(manifest), actualUsage: report.actualUsage,
  }, null, 2))
} else {
  throw new Error('Use prepare, render, retain-first-render, render-recovery, verify or seal.')
}
