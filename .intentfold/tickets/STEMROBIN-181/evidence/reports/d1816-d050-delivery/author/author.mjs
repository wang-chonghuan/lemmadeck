import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const evidence = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d050-n13-author')
const outputs = path.join(root, '.tmp/STEMROBIN-181/d1816-d050/n13-fig17-author')
const work = path.join(root, '.tmp/STEMROBIN-181/d1816-d050/n13-work/adapt/10p')
const lessonId = 'phy10-c1-s2-n13'
const template = (edition) => path.join(work, edition, 'lessons', lessonId, 'lesson.template.json')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = (file) => ({ path: file, sha256: sha(file) })
const write = (file, value) => {
  assert(file.startsWith(`${evidence}/`) || file.startsWith(`${outputs}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const receipt = (name, command, args, jsonOutput = true) => {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  const record = {
    role: 'AUTHOR',
    cwd: root,
    command: [command, ...args],
    exitCode: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    error: result.error?.message ?? null,
  }
  write(path.join(evidence, `${name}.receipt.json`), record)
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.stdout}`)
  return jsonOutput ? JSON.parse(result.stdout) : record
}
const nativeFlow = (file) => {
  const result = spawnSync('node', [
    path.join(root, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', file,
  ], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

const reusePath = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d050-n13-reuse/bindings.json')
assert.equal(sha(reusePath), 'affefd3b6737375964663368bd3580456384759a87dcac19a4ac2bc2724c165c')
const reuse = read(reusePath)
const zhPath = template('modern-us-neutral')
const enPath = template('modern-us-neutral-en')
const rawPath = path.join(root, reuse.source.path)
assert.equal(sha(zhPath), reuse.passedZhTemplate.sha256)
assert.equal(sha(rawPath), reuse.source.sha256)
const oldDirectory = path.join(root, '.intentfold/tickets/STEMROBIN-181/evidence/figures/failed/10p/fig-17')
const oldSpecPath = path.join(oldDirectory, 'fig-17.spec.json')
const specPath = path.join(outputs, 'fig-17.spec.json')
const phase = process.argv[2]

if (phase === 'outline') {
  write(path.join(evidence, 'en-prose-flow-before-anchors.json'), nativeFlow(enPath))
} else if (phase === 'normalize') {
  receipt('en-native-layout', path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
    path.join(evidence, 'validate_templates.py'), '--normalize-en-layout',
  ])
} else if (phase === 'validate') {
  receipt('validate-templates', path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
    path.join(evidence, 'validate_templates.py'),
  ])
} else if (phase === 'spec') {
  const old = read(oldSpecPath)
  const inventory = read(path.join(evidence, 'original-inventory.json'))
  const sourcePath = inventory.source.path
  assert.equal(sha(sourcePath), inventory.source.sha256)
  const zh = read(zhPath)
  const en = read(enPath)
  assert.equal(zh.prose.length, 14)
  assert.equal(en.prose.length, 14)
  assert.equal(en.prose.filter((block) => block.kind === 'p').length, 12)
  const changed = structuredClone(old)
  changed.source.image = binding(sourcePath)
  changed.source.authoritativeText = [zh, en].flatMap((document) =>
    document.prose.filter((block) => block.text).map((block) => ({
      lesson: lessonId,
      text: block.text,
    })))
  changed.source.inventory = inventory.groups.map((group) => {
    const previous = old.source.inventory.find((item) => item.id === group.id)
    assert(previous, group.id)
    return { ...structuredClone(previous), description: group.description }
  })
  changed.objects.find((object) => object.id === 'motor-disk-rim').fillOpacity = 0
  const objectChanges = changed.objects.flatMap((object, index) =>
    JSON.stringify(object) === JSON.stringify(old.objects[index]) ? [] : [{
      id: object.id, before: old.objects[index], after: object,
    }])
  assert.equal(objectChanges.length, 1)
  assert.equal(objectChanges[0].id, 'motor-disk-rim')
  const originalRim = structuredClone(objectChanges[0].before)
  originalRim.fillOpacity = 0
  assert.deepEqual(objectChanges[0].after, originalRim)
  assert.deepEqual(changed.assertions, old.assertions)
  assert.deepEqual(changed.canvas, old.canvas)
  assert.deepEqual(changed.display, old.display)
  write(specPath, changed)
  write(path.join(evidence, 'source-inventory-mapping.json'), {
    role: 'AUTHOR',
    source: binding(sourcePath),
    observations: binding(path.join(evidence, 'original-inventory.json')),
    inventory: changed.source.inventory,
    modernRegularizations: inventory.modernRegularizations,
  })
  write(path.join(evidence, 'bilingual-context.json'), {
    role: 'AUTHOR',
    source: binding(rawPath),
    templates: { zh: binding(zhPath), en: binding(enPath) },
    zh: { title: zh.title, prose: zh.prose, section_breaks: zh.section_breaks },
    en: { title: en.title, prose: en.prose, section_breaks: en.section_breaks },
  })
  write(path.join(evidence, 'localized-repair.json'), {
    role: 'AUTHOR',
    authorization: 'Direct human D050 instruction permits this localized visibility/layering repair despite the prior invocation repair limit.',
    historicalFailure: binding(path.join(root, reuse.originalFigureFailure.path)),
    oldSpec: binding(oldSpecPath),
    newSpec: binding(specPath),
    changes: objectChanges,
    assertionsUnchanged: true,
    canvasAndDisplayUnchanged: true,
    objectOrderUnchanged: true,
    sourceDirection: 'Counterclockwise; upward along the disk right side.',
    historicalFigureRepairRounds: reuse.historicalFigureRepairRounds,
    thisInvocationContentRepairs: 1,
    cumulativeKnownFigureRepairRounds: reuse.historicalFigureRepairRounds + 1,
    failedEvidenceOverwritten: false,
    independentApproval: false,
  })
} else if (phase === 'render') {
  const recoveryPath = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n117-figure-author/technical-runtime-recovery.json')
  const recovery = read(recoveryPath)
  const runtimeFiles = recovery.copied.map(({ source, runtime }) => {
    const sourcePath = path.join(root, source.path)
    const runtimePath = path.join(root, runtime.path)
    assert.equal(sha(sourcePath), source.sha256)
    assert.equal(sha(runtimePath), source.sha256)
    return { source: binding(sourcePath), runtime: binding(runtimePath) }
  })
  write(path.join(evidence, 'technical-runtime-reuse.json'), {
    role: 'AUTHOR',
    reason: 'Standard worktree .agents/skills/node_modules is absent. Reuse the explicitly authorized pre-existing byte-identical renderer runtime without attempting a dependency install or copying packages.',
    priorRecovery: binding(recoveryPath),
    files: runtimeFiles,
    dependencyRoot: recovery.dependencyRoot,
    dependencyInstalls: 0,
    packagesCopied: 0,
    rendererSourceChanged: false,
  })
  receipt('figure-draft-validation', path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
    path.join(root, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'), specPath, '--stage', 'draft', '--json',
  ])
  receipt('figure-render', 'node', [
    runtimeFiles[0].runtime.path,
    '--spec', specPath,
    '--svg', path.join(outputs, 'fig-17.svg'),
    '--png', path.join(outputs, 'fig-17.png'),
    '--report', path.join(outputs, 'fig-17.render.json'),
  ], false)
} else if (phase === 'previews') {
  const require = createRequire(path.join(
    root, '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/render_spec.mjs',
  ))
  const { chromium } = require('playwright-core')
  const executablePath = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    chromium.executablePath(),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean).find((candidate) => fs.existsSync(candidate))
  assert(executablePath, 'Existing Chrome/Chromium executable required')
  const browser = await chromium.launch({ headless: true, executablePath })
  const svgPath = path.join(outputs, 'fig-17.svg')
  const svg = fs.readFileSync(svgPath, 'utf8')
  const previews = []
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 })
    for (const width of [640, 331, 342]) {
      await page.setViewportSize({ width, height: Math.ceil(width * 800 / 960) })
      await page.setContent(`<style>html,body{margin:0;background:white}svg{display:block;width:${width}px;height:auto}</style>${svg}`)
      const filename = path.join(outputs, `fig-17.preview-${width}.png`)
      assert(!fs.existsSync(filename))
      await page.locator('svg').screenshot({ path: filename })
      previews.push({ width, ...binding(filename) })
    }
  } finally {
    await browser.close()
  }
  write(path.join(evidence, 'figure-preview-bindings.json'), {
    role: 'AUTHOR', svg: binding(svgPath), previews,
    method: 'Existing Playwright renders the unchanged generated SVG directly at each current CSS width, deviceScaleFactor 1; no app or edition render.',
    imagesOpened: 0,
  })
} else if (phase === 'freeze') {
  const en = read(enPath)
  const currentSpec = read(specPath)
  const currentContext = read(path.join(evidence, 'bilingual-context.json'))
  assert.equal(currentContext.templates.en.sha256, sha(enPath))
  assert.equal(currentContext.templates.zh.sha256, sha(zhPath))
  const expectedText = [read(zhPath), en].flatMap((document) =>
    document.prose.filter((block) => block.text).map((block) => ({ lesson: lessonId, text: block.text })))
  assert.deepEqual(currentSpec.source.authoritativeText, expectedText)
  const checks = read(path.join(evidence, 'validate-templates.receipt.json'))
  assert.equal(checks.exitCode, 0)
  const render = read(path.join(outputs, 'fig-17.render.json'))
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, sha(specPath))
  assert.equal(render.output.svg.sha256, sha(path.join(outputs, 'fig-17.svg')))
  const oldFiles = [
    ...reuse.previousFailedFigure.map((item) => path.join(root, item.path)),
    path.join(oldDirectory, 'lesson.template.json'),
    path.join(root, reuse.originalFigureFailure.path),
  ]
  for (const item of reuse.previousFailedFigure) assert.equal(sha(path.join(root, item.path)), item.sha256)
  assert.equal(sha(path.join(root, reuse.originalFigureFailure.path)), reuse.originalFigureFailure.sha256)
  const observationsPath = path.join(evidence, 'author-observations.json')
  const observations = read(observationsPath)
  write(path.join(evidence, 'author-freeze.json'), {
    schema: 'STEMROBIN-181/d050-n13-author-freeze@1',
    role: 'AUTHOR',
    ticket: 'STEMROBIN-181',
    batch: 'D050',
    cwd: root,
    lesson: lessonId,
    status: 'AUTHOR-COMPLETE-INDEPENDENT-REVIEW-PENDING',
    createdAt: new Date().toISOString(),
    bindings: {
      reuseProof: binding(reusePath),
      rawSource: binding(rawPath),
      rawExercises: binding(path.join(path.dirname(rawPath), 'exercises.json')),
      originalPng: binding(currentSpec.source.image.path),
      zhTemplateReadonly: binding(zhPath),
      enTemplate: binding(enPath),
      enExercisesReadonly: binding(path.join(path.dirname(enPath), 'exercises.template.json')),
      zhFiguresManifestReadonly: binding(path.join(path.dirname(zhPath), 'figures.template.json')),
      enFiguresManifestReadonly: binding(path.join(path.dirname(enPath), 'figures.template.json')),
      bilingualContext: binding(path.join(evidence, 'bilingual-context.json')),
      originalInventory: binding(path.join(evidence, 'original-inventory.json')),
      inventoryMapping: binding(path.join(evidence, 'source-inventory-mapping.json')),
      spec: binding(specPath),
      svg: binding(path.join(outputs, 'fig-17.svg')),
      render: binding(path.join(outputs, 'fig-17.render.json')),
      nativePng: binding(path.join(outputs, 'fig-17.png')),
      previews: read(path.join(evidence, 'figure-preview-bindings.json')).previews,
      observations: binding(observationsPath),
      technicalRuntimeReuse: binding(path.join(evidence, 'technical-runtime-reuse.json')),
      technicalParserRecovery: binding(path.join(evidence, 'technical-parser-recovery.json')),
      technicalPreviewRecovery: binding(path.join(evidence, 'technical-preview-recovery.json')),
      receipts: ['validate-templates', 'figure-draft-validation', 'figure-render'].map((name) =>
        binding(path.join(evidence, `${name}.receipt.json`))),
      nativeProseFlowBeforeAnchors: binding(path.join(evidence, 'en-prose-flow-before-anchors.json')),
      nativeNormalizationAndAnchorOutline: binding(path.join(evidence, 'en-native-layout.receipt.json')),
      nativeProseFlowFinal: binding(path.join(evidence, 'en-prose-flow-final.json')),
      mobileArrowCrop: binding(path.join(evidence, 'mobile-arrow-crop.json')),
      authorProgram: binding(path.join(evidence, 'author.mjs')),
      nativeTemplateCheckProgram: binding(path.join(evidence, 'validate_templates.py')),
    },
    text: {
      entries: en.prose.length,
      proseEntries: en.prose.filter((block) => block.kind === 'p').length,
      sectionAnchors: en.section_breaks,
      formulaSpans: ['$17$'],
      figureIds: en.figures.map((figure) => figure.id),
      questions: en.exercise_count,
      nativeValidation: 'pass',
      scientificTranslationReviewedByAuthorOnly: true,
      frozenZhAndSourceUnchanged: true,
      metadataNote: 'Chapter, section, printed title, page identities, and source snapshot retain raw Chinese for native identity preservation; locale en and modern title/prose/caption are English.',
    },
    figure: {
      repair: binding(path.join(evidence, 'localized-repair.json')),
      renderStatus: render.status,
      actualPixelsInspected: observations.imagesInspected.map((image) => ({
        ...image, ...binding(image.path),
      })),
      sourceDirection: 'Counterclockwise, upward on disk right side.',
      authorVisibilityObservation: observations.visibility,
      apparatusObjectsAndAssertionsUnchanged: true,
    },
    failHistory: {
      status: 'fail',
      originalDecisionStillPreserved: true,
      priorFiles: oldFiles.map(binding),
      previousScience: binding(path.join(root, reuse.previousScience.path)),
      previousLayout: binding(path.join(root, reuse.previousLayout.path)),
      repairLimitOverride: 'Direct current human instruction authorizes only this diagnosed repair; does not revoke the old FAIL or grant independent PASS.',
    },
    counters: {
      historicalFigureRepairRounds: reuse.historicalFigureRepairRounds,
      thisInvocationFigureContentRepairs: 1,
      cumulativeKnownFigureRepairRounds: reuse.historicalFigureRepairRounds + 1,
      figureDraftValidateCommands: 1,
      figureRenderCommands: 1,
      rendererInternalValidation: 1,
      previewWidthsRasterized: 3,
      sourceOriginalOpens: 1,
      oldImageReopens: 0,
      imagesOpened: observations.imagesInspected.length,
      imageBatchLimit: 8,
      imageContextLimit: 24,
      sourcePagesAdded: 0,
      sourcePageRereviews: 0,
      rawAssemblies: 0,
      prepareCalls: 0,
      zhScienceRereviews: 0,
      editionFinalizeCalls: 0,
      editionRenderCalls: 0,
      paidCalls: 0,
      dependencyInstalls: 0,
      packagesCopied: 0,
    },
    boundaries: {
      independentPassIssued: false,
      independentReviewPending: true,
      reviewAt1Issued: false,
      manifestsChanged: false,
      promoted: false,
      published: false,
      gitOrIndexTouched: false,
      meterTouched: false,
      databaseTouched: false,
      appStarted: false,
      otherChatsMessaged: false,
      otherLessonsChanged: false,
    },
  })
} else {
  throw new Error('Expected outline, spec, render, previews, or freeze')
}
