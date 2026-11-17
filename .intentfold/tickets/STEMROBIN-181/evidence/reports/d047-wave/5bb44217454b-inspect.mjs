import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const base = path.join(workspace, '.intentfold/tickets/STEMROBIN-181/tmp')
const owned = path.join(base, 'd045-n39-affected-review-evidence')
const summaryPath = path.join(base, 'd045-n39-affected-review.json')
const resolve = (value) => path.resolve(workspace, value)
const load = (value) => JSON.parse(fs.readFileSync(resolve(value), 'utf8'))
const hash = (value) => crypto.createHash('sha256').update(fs.readFileSync(resolve(value))).digest('hex')
const binding = (value) => ({ path: resolve(value), sha256: hash(value) })
const write = (filename, value) => {
  const target = resolve(filename)
  assert(target.startsWith(`${owned}/`) || target === summaryPath, 'write ownership')
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`)
}
const require = createRequire(import.meta.url)
const htmlfrag = require(path.join(workspace, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const checked = new Map()
const bind = (record) => {
  const actual = binding(record.path)
  assert.equal(actual.sha256, record.sha256, `stale binding: ${actual.path}`)
  checked.set(actual.path, actual)
  return actual
}
const bindAll = (value) => {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') bind(value)
  for (const child of Object.values(value)) bindAll(child)
}
const run = (command, args, output) => {
  const child = spawnSync(command, args, {
    cwd: workspace, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const receipt = {
    command: [command, ...args], exitCode: child.status,
    stdout: child.stdout, stderr: child.stderr,
    ...(child.error ? { error: child.error.message } : {}),
  }
  write(path.join(owned, output), receipt)
  assert.equal(child.status, 0, `${output}: ${child.stderr}`)
  return receipt
}
const diff = (before, after, prefix = '') => {
  if (JSON.stringify(before) === JSON.stringify(after)) return []
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .flatMap((key) => diff(before[key], after[key], `${prefix}/${key}`))
  }
  return [{ path: prefix, before, after }]
}
const math = (text) => [...text.matchAll(/\$([^$]+)\$/g)].map((match) => match[1])
const expected = [
  ['d045-n39-text-repair/repair-freeze.json', '3220c430f340cb5d40213da415e6826a0990179e2d36b3f842a2bbd1a347febf'],
  ['d044-n39-science-review.json', 'fe9dd9140107edd1c5123a3287513144c9aa63cbb88fdf6e69a3d965534c0594'],
  ['d044-localized-reference-checks/resolution.json', '510c25f0297fcb98f3f422f7348ca2600d1b02015c7ae4f3cec5a9475f986c9e'],
  ['d044-10p-fig72-author/author-freeze.json', '762608d0645617c93a4d4af1c224e869f929b424274b1f8c44dbdc61f1ae29a6'],
  ['d045-fig72-context/context-resolution.json', 'fd8b61a3e9a655d402db1b30bc80b09743eea6072b61d9cc815ec293d699b0e0'],
]

if (process.argv.includes('--finalize')) {
  const inspected = load(path.join(owned, 'integrity.json'))
  assert.equal(inspected.status, 'pass')
  for (const record of inspected.bindings) bind(record)
  const judgment = load(path.join(owned, 'judgment.json'))
  bindAll(judgment.evidence)
  const figurePass = judgment.fig72.status === 'PASS' && judgment.fig72.findings.length === 0
  const notes = [
    'First independent review: fresh canonical source PNG inventoried before spec inspection.',
    'Compared current repaired ZH/EN text, both solid profiles, x/s/O axes, three crests and two troughs per curve,',
    'five intersections, origin behavior, right shift, lambda and Delta s spans, curve leaders, velocity and vector arrows.',
    'Opened media640 and both mobile start/end previews; all eight labels measure 20px and scrollLeft reaches 324/324.',
    'Original preview SVG hash equals current candidate exactly; byte identity is not source-fidelity evidence.',
    `Independent details: ${path.join(owned, 'judgment.json')} sha256=${hash(path.join(owned, 'judgment.json'))}.`,
    `Source inventory: ${path.join(owned, 'fig72-independent-source-inventory.json')} sha256=${hash(path.join(owned, 'fig72-independent-source-inventory.json'))}.`,
    'No fig70/71, choice, answer or full-card approval; no author repair or promotion.',
  ].join(' ')
  run(path.join(workspace, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
    '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', path.join(base, 'd045-fig72-context/fig-72.spec.json'),
    '--render', path.join(base, 'd045-fig72-context/fig-72.render.json'),
    '--output', path.join(owned, 'fig-72.review.json'),
    '--status', figurePass ? 'pass' : 'fail', '--notes', notes,
  ], 'record-review-command.json')
  const review = load(path.join(owned, 'fig-72.review.json'))
  assert.equal(review.schema, 'ld-s10y-image/review@1')
  assert.equal(review.status, figurePass ? 'pass' : 'fail')
  bindAll(review)
  const evidence = fs.readdirSync(owned).filter((name) => name !== 'inspect.mjs')
    .map((name) => binding(path.join(owned, name)))
  const report = {
    schema: 'STEMROBIN-181/independent-affected-text-and-first-figure-review@1',
    ticket: 'STEMROBIN-181', card: 'phy10-c1-s5-n39', workspace,
    reviewDate: '2026-11-17', completedAt: new Date().toISOString(),
    status: figurePass && judgment.ZHEN.status === 'PASS' ? 'PASS-BOUNDED-NOT-FULL-CARD' : 'HOLD',
    inputs: expected.map(([name]) => binding(path.join(base, name))),
    effectiveSCI: judgment.SCI,
    effectiveZHEN: judgment.ZHEN,
    affectedText: judgment.affectedText,
    closedOriginalFinding: {
      id: 'N39-ZHEN-READABILITY-01', severity: 'P2',
      status: judgment.ZHEN.status === 'PASS' ? 'CLOSED-BY-SOLE-REPAIR' : 'HOLD',
      originalReviewPreserved: true, originalNativeFailurePreserved: true,
    },
    currentTextHashes: ['zh', 'en'].map((language) => ({
      language,
      template: binding(path.join(base, `d045-n39-text-repair/frozen/${language}/lesson.template.json`)),
      prose: binding(path.join(base, `d045-n39-text-repair/frozen/${language}/prose.md`)),
    })),
    fig72: {
      ...judgment.fig72,
      source: binding(review.source.path),
      spec: binding(review.spec.path),
      svg: binding(review.outputs.svg.path),
      render: binding(review.render.path),
      independentNativeReview: binding(path.join(owned, 'fig-72.review.json')),
      nativeRecorderExecuted: true,
      renderedStageValidatorExecutedByNativeRecorder: true,
      independentRenderRerun: false,
      candidateRenderCommandReusedAndHashVerified: true,
      previewReceiptReusedAndHashVerified: true,
    },
    findings: judgment.findings,
    residualHold: judgment.findings.length ? 'HOLD-no-further-author-repair' : null,
    evidence, verificationScript: binding(import.meta.filename),
    scopeCompliance: {
      independentReviewOnly: true, writesRestrictedToOwnedPaths: true,
      imagesOpened: 4, imageBatchMax: 8, imageContextMax: 24,
      authorImageHistoryIncluded: false, imagePayloadReturned: false,
      originalLessonSourceTextReReview: false, unchangedTextOrTasksRereview: false,
      authorRepairsApplied: 0, furtherAuthorRepairRequested: false,
      sourceAuthorAppToolsCharterEdited: false, gitOperations: false,
      databaseOperations: false, ticketBackendEdits: false, messagesSent: false,
      nativeFinalizeRun: false, fullCardApproval: false, durablePromotion: false,
    },
    pending: ['fig-70 independent review', 'fig-71 independent review', 'choices', 'answers'],
  }
  for (const record of inspected.bindings) bind(record)
  write(summaryPath, report)
  console.log(JSON.stringify({
    status: report.status, SCI: report.effectiveSCI.status,
    ZHEN: report.effectiveZHEN.status, fig72: report.fig72.status,
    summary: binding(summaryPath), review: binding(path.join(owned, 'fig-72.review.json')),
    findings: report.findings,
  }, null, 2))
} else {
  for (const [name, sha256] of expected) bind({ path: path.join(base, name), sha256 })
  const repair = load(path.join(base, 'd045-n39-text-repair/repair-freeze.json'))
  const prior = load(path.join(base, 'd044-n39-science-review.json'))
  const originalAuthor = load(repair.originalAuthor.path)
  const context = load(path.join(base, 'd045-fig72-context/context-resolution.json'))
  const originalFigure = load(path.join(base, 'd044-10p-fig72-author/author-freeze.json'))
  const toolResolution = load(path.join(base, 'd044-localized-reference-checks/resolution.json'))
  bindAll(repair)
  bindAll(context)
  bindAll(originalFigure)
  bind(originalAuthor.input)
  bindAll(load(originalAuthor.input.path))
  bind(toolResolution.tool)
  bind(toolResolution.original)
  bind(toolResolution.affected)
  bind(toolResolution.results.find((item) => item.name === 'n39-native-affected').receipt)
  bind(toolResolution.results.find((item) => item.name === 'focused-contract').receipt)
  assert.equal(toolResolution.status, 'pass')
  assert.equal(prior.SCI.status, 'PASS')
  assert.equal(prior.ZHEN.semanticTranslationStatus, 'PASS')
  assert.equal(prior.findings[0].severity, 'P2')
  const native = load(repair.native.path)
  assert.equal(native.exitCode, 0)
  const nativePayload = JSON.parse(native.stdout)
  assert.equal(nativePayload.status, 'pass')
  assert.deepEqual(nativePayload.errors, [])
  assert.equal(load(repair.originalNativeFAIL.path).exitCode, 1)

  const differences = []
  const flows = []
  for (const language of ['zh', 'en']) {
    const oldFolder = path.join(base, `d044-10p-n39-author/frozen/${language}`)
    const newFolder = path.join(base, `d045-n39-text-repair/frozen/${language}`)
    const before = load(path.join(oldFolder, 'lesson.template.json'))
    const after = load(path.join(newFolder, 'lesson.template.json'))
    const authored = originalAuthor.authored.find((item) => item.language === language)
    for (const [field, filename] of [
      ['lesson', 'lesson.template.json'], ['exercises', 'exercises.template.json'],
      ['figures', 'figures.template.json'], ['prose', 'prose.md'], ['questions', 'questions.md'],
    ]) bind({ path: path.join(oldFolder, filename), sha256: authored[field].sha256 })
    const changes = diff(before, after)
    const indices = language === 'zh' ? [3] : [0, 1, 2, 3, 6, 7]
    const changedIndices = changes.filter((item) => /^\/prose\/\d+\/text$/.test(item.path))
      .map((item) => Number(item.path.split('/')[2]))
    assert.deepEqual(changedIndices, indices)
    for (const item of changes) {
      assert(/^\/prose\/\d+\/text$/.test(item.path)
        || (language === 'en' && /^\/section_breaks\/\d+\/(before|after)$/.test(item.path)),
      `unauthorized changed field: ${item.path}`)
    }
    assert.equal(before.section_breaks.length, after.section_breaks.length)
    for (const item of changes.filter((item) => item.path.startsWith('/section_breaks'))) {
      assert(before.prose.some((block, index) => indices.includes(index) && block.text.includes(item.before)))
      assert(after.prose.some((block, index) => indices.includes(index) && block.text.includes(item.after)))
    }
    for (const index of indices) assert.deepEqual(math(before.prose[index].text), math(after.prose[index].text))
    assert.deepEqual(before.source, after.source)
    assert.deepEqual(after.source.data,
      load(path.join(base, `d044-10p-n39-author/${language}/root/10p/lessons/phy10-c1-s5-n39/lesson.json`)))
    for (const filename of ['exercises.template.json', 'figures.template.json']) {
      assert(fs.readFileSync(path.join(oldFolder, filename)).equals(fs.readFileSync(path.join(newFolder, filename))))
      checked.set(path.join(newFolder, filename), binding(path.join(newFolder, filename)))
    }
    const nativeLanguage = nativePayload.languages.find((item) => item.language === language)
    assert.equal(nativeLanguage.template_sha256, hash(path.join(newFolder, 'lesson.template.json')))
    assert.deepEqual(nativeLanguage.errors, [])
    const currentFlow = JSON.parse(run(process.execPath, [
      '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json',
      path.join(newFolder, 'lesson.template.json'),
    ], `native-flow-${language}.json`).stdout)
    const captured = JSON.parse(load(path.join(base, `d045-n39-text-repair/flow-${language}.json`)).stdout)
    assert.deepEqual(currentFlow, captured)
    assert.deepEqual(currentFlow, nativeLanguage.paragraphs)
    const outline = htmlfrag.proseOutline(after.prose)
    assert.deepEqual(currentFlow.paragraphs, outline)
    const prose = fs.readFileSync(path.join(newFolder, 'prose.md'), 'utf8')
    assert.equal(prose.slice(prose.indexOf('\n\n') + 2),
      `${after.prose.map((block) => block.text).filter(Boolean).join('\n\n')}\n`)
    const group = currentFlow.paragraphs.filter((item) => indices.includes(item.blockIndex))
    for (const row of group.filter((item) => item.blockIndex !== 3)) {
      const lines = row.text.split('\n').filter(Boolean)
      assert(lines.length >= 2 && lines.length <= 3)
      assert(lines.every((line) => /[.!?]$/.test(line)), `incomplete sentence: ${row.text}`)
    }
    const formulaGroups = group.filter((item) => item.blockIndex === 3)
    assert.equal(formulaGroups.length, 2)
    assert(formulaGroups[0].text.includes('(4.1)'))
    assert(formulaGroups[1].text.includes('(4.2)'))
    assert(!formulaGroups.some((row) => /(?:so|that|所以)\s*$/.test(row.text)))
    assert.equal(currentFlow.paragraphs.length, language === 'zh' ? 12 : 13)
    assert.equal(currentFlow.resolvedBreaks.length, 5)
    differences.push({
      language, changedBlocks: indices, differences: changes,
      sourceMetadataAndBlockMetadataUnchanged: true,
      unchangedProseBlocksByteEquivalent: true, mathSignaturesUnchanged: true,
      exercisesAndFiguresByteIdentical: true,
    })
    flows.push({ language, affectedParagraphs: group, formulaIntroductionsJoined: true,
      nativeFlowMatchesCapturedFreeze: true, boundaryCount: 5 })
  }
  write(path.join(owned, 'frozen-differences.json'), { status: 'pass', languages: differences })
  write(path.join(owned, 'affected-native-flow.json'), { status: 'pass', languages: flows })

  const spec = load(context.spec.path)
  const oldSpec = load(context.originalSpec.path)
  const specDiff = diff(oldSpec, spec)
  assert.deepEqual(specDiff.map((item) => item.path),
    ['/source/authoritativeText/0/text', '/source/authoritativeText/7/text'])
  for (const [index, language] of [[0, 'zh'], [7, 'en']]) {
    assert.equal(spec.source.authoritativeText[index].text,
      fs.readFileSync(path.join(base, `d045-n39-text-repair/frozen/${language}/prose.md`), 'utf8'))
    const exercises = load(path.join(base, `d045-n39-text-repair/frozen/${language}/exercises.template.json`))
    for (let i = 0; i < 6; i++) assert.equal(
      spec.source.authoritativeText[index + 1 + i].text, exercises.exercises[i].text)
  }
  assert(fs.readFileSync(resolve(context.svg.path)).equals(
    fs.readFileSync(resolve(originalFigure.outputs.svg.path))))
  const render = load(context.render.path)
  bindAll(render.spec)
  bindAll(render.output)
  assert.equal(render.status, 'pass')
  assert.deepEqual(render.collisions, [])
  assert.equal(render.labels, 8)
  assert.equal(render.displayChecks[0].width, 640)
  assert(render.displayChecks[0].measuredMinPx >= 16)
  for (const name of ['validate-command.json', 'render-command.json']) {
    const filename = path.join(base, 'd045-fig72-context', name)
    const receipt = load(filename)
    assert.equal(receipt.exitCode, 0)
    assert(receipt.stdout.startsWith('PASS:'))
    assert(receipt.command.includes('.intentfold/tickets/STEMROBIN-181/tmp/d045-fig72-context/fig-72.spec.json'))
    checked.set(filename, binding(filename))
  }
  const objects = new Map(spec.objects.map((object) => [object.id, object]))
  const point = (id) => objects.get(id).at
  const wave = (prefix) => {
    const edges = spec.objects.filter((item) => item.id.startsWith(`${prefix}-edge-`))
      .sort((a, b) => Number(a.id.split('-').at(-1)) - Number(b.id.split('-').at(-1)))
    assert(edges.length > 0)
    edges.forEach((edge, i) => {
      assert.equal(edge.type, 'segment')
      assert.equal(edge.dash, 0)
      if (i) assert.equal(edges[i - 1].to, edge.from)
    })
    return [point(edges[0].from), ...edges.map((edge) => point(edge.to))]
  }
  const earlier = wave('source-wave-t')
  const later = wave('source-wave-later')
  const near = (actual, wanted) => assert(Math.abs(actual - wanted) < 1e-7, `${actual} != ${wanted}`)
  assert.deepEqual(earlier[0], [0, 0])
  assert(earlier[1][1] > 0 && later[0][1] < 0 && later[1][1] > later[0][1])
  assert(earlier.at(-1)[1] < 0 && later.at(-1)[1] > 0)
  assert.equal(earlier.at(-1)[0], later.at(-1)[0])
  assert.equal(earlier.at(-1)[0], 915)
  const extrema = (sequence) => sequence.filter((xy, i) => i > 0 && i < sequence.length - 1
    && (xy[1] - sequence[i - 1][1]) * (sequence[i + 1][1] - xy[1]) < 0)
  const eExtrema = extrema(earlier)
  const lExtrema = extrema(later)
  assert.equal(eExtrema.filter((xy) => xy[1] > 0).length, 3)
  assert.equal(lExtrema.filter((xy) => xy[1] > 0).length, 3)
  assert.equal(eExtrema.filter((xy) => xy[1] < 0).length, 2)
  assert.equal(lExtrema.filter((xy) => xy[1] < 0).length, 2)
  const shift = lExtrema[0][0] - eExtrema[0][0]
  assert(shift > 0)
  let matchedShiftSamples = 0
  for (const xy of earlier) {
    const counterpart = later.find((other) => Math.abs(other[0] - xy[0] - shift) < 1e-7)
    if (counterpart) { near(counterpart[1], xy[1]); matchedShiftSamples++ }
  }
  assert(matchedShiftSamples > 200)
  const expectedLabels = ['x', 's', 'O', '\u03bb', '\u0394s = v\u00b7\u0394t', 'v', 't', 't + \u0394t']
  assert.deepEqual(spec.objects.filter((item) => item.type === 'text').map((item) => item.text), expectedLabels)
  assert(spec.objects.filter((item) => item.type === 'text').every((item) => item.fontSize >= 16))
  assert(!spec.objects.some((item) => ['grid', 'axis', 'ticks'].includes(item.type)))
  assert(spec.objects.filter((item) => item.type === 'point' && item.visible).every((item) => item.size <= 0.1))
  for (const id of ['source-v-direction', 'source-v-vector-accent']) {
    const arrow = objects.get(id)
    assert(point(arrow.to)[0] > point(arrow.from)[0])
    near(point(arrow.to)[1], point(arrow.from)[1])
  }
  const tLeader = objects.get('source-t-leader')
  const lLeader = objects.get('source-later-leader')
  assert(tLeader.to.startsWith('wave-t-'))
  assert(lLeader.to.startsWith('wave-later-'))
  assert(point(tLeader.to)[0] > point(tLeader.from)[0])
  assert(point(lLeader.to)[0] < point(lLeader.from)[0])
  assert(point(tLeader.to)[1] > point(tLeader.from)[1])
  assert(point(lLeader.to)[1] > point(lLeader.from)[1])
  for (const [name, anchors] of [
    ['wavelength', ['source-wave-t-crest-1', 'source-wave-t-crest-2']],
    ['shift', ['source-wave-t-crest-3', 'source-wave-later-crest-3']],
  ]) for (let i = 0; i < 2; i++) {
    const guide = objects.get(`source-${name}-guide-${i}`)
    assert.equal(guide.from, anchors[i])
    near(point(guide.from)[0], point(guide.to)[0])
    near(point(`source-${name}-endpoint-${i}`)[0], point(anchors[i])[0])
  }
  near(point('source-wave-t-crest-2')[0] - point('source-wave-t-crest-1')[0],
    point('source-wave-t-crest-3')[0] - point('source-wave-t-crest-2')[0])
  for (let i = 1; i <= 5; i++) {
    assert.deepEqual(point(`source-wave-t-intersection-${i}`), point(`source-wave-later-intersection-${i}`))
    assert(point(`source-wave-t-intersection-${i}`)[1] * (i % 2 ? 1 : -1) > 0)
  }
  const preview = load(originalFigure.actualPreviewChecks.receipt.path)
  bindAll(preview.svg)
  assert.equal(preview.svg.sha256, hash(context.svg.path))
  assert.equal(preview.status, 'pass')
  assert.equal(preview.actualMediaWidth, 640)
  assert(preview.minActualTextPx >= 16)
  for (const row of preview.previews) {
    assert.equal(row.observed.mediaWidth, 640)
    assert.equal(row.observed.text.length, 8)
    assert(row.observed.text.every((label) => label.fontPx >= 16 && label.inside))
    assert.deepEqual(row.pageErrors, [])
    bind(row.screenshot)
    if (row.endScreenshot) bind(row.endScreenshot)
    if (row.scrollEnd) {
      assert.equal(row.scrollEnd.scrollLeft, row.scrollEnd.maxScrollLeft)
      assert.equal(row.scrollEnd.scrollLeft, 324)
    }
  }
  checked.set(path.join(owned, 'fig72-independent-source-inventory.json'),
    binding(path.join(owned, 'fig72-independent-source-inventory.json')))
  const geometry = {
    status: 'pass', specDifferences: specDiff,
    onlyAuthoritativeTextRebound: true, svgBytesIdenticalToPreviewCandidate: true,
    sourceInventoryGroupMappings: [
      ['shared-axes', 'source-shared-frame'], ['earlier-wave-t', 'source-wave-t'],
      ['later-wave-t-plus-dt', 'source-wave-later'],
      ['wave-relationships', 'source-five-curve-intersections'],
      ['wavelength-span', 'source-wavelength-span'],
      ['translation-span', 'source-right-shift-span'],
      ['velocity-and-vector-accent', 'source-velocity-and-vector-accent'],
      ['label-and-cultural-boundary', 'source-curve-identification'],
    ],
    earlierExtrema: eExtrema, laterExtrema: lExtrema,
    matchedRightShiftSamples: matchedShiftSamples, uncalibratedShift: shift,
    originBehaviorPreserved: true, fiveAlternatingIntersections: true,
    sourceFiniteEndpointsPreserved: true, bothSolidCurves: true,
    correctDimensionAnchorsAndLeaders: true, velocityAndVectorAccentRightward: true,
    noVisibleTicksGridsPointMarkersNumericGivensOrAnswers: true,
    minimumMeasuredTextPx: preview.minActualTextPx,
    actualMediaWidth: 640, mobileContainerWidth: 316,
    mobileEndReachable: true, mobileScrollLeft: 324, mobileMaxScrollLeft: 324,
    openedPreviewPaths: preview.previews.flatMap((row) => [row.screenshot, row.endScreenshot].filter(Boolean)),
    nativeRenderReceiptReused: true, previewReceiptReused: true,
    fullCardApproval: false,
  }
  write(path.join(owned, 'figure-geometry-and-preview-bindings.json'), geometry)
  for (const name of ['frozen-differences.json', 'affected-native-flow.json',
    'native-flow-zh.json', 'native-flow-en.json', 'figure-geometry-and-preview-bindings.json']) {
    const filename = path.join(owned, name)
    checked.set(filename, binding(filename))
  }
  write(path.join(owned, 'integrity.json'), {
    status: 'pass', bindings: [...checked.values()], validatedBindings: checked.size,
    originalNativeFAILPreserved: true, currentResolvedToolHashVerified: true,
    repairedNativePASSReceiptMatchesBothCurrentTemplates: true,
    affectedNativeFlowIndependentlyExecuted: true,
    entireSourcePhysicsOrTaskReviewRepeated: false, imagesOpenedByScript: 0,
  })
  console.log(JSON.stringify({
    status: 'pass', validatedBindings: checked.size,
    changedBlocks: differences.map((row) => ({ language: row.language, blocks: row.changedBlocks })),
    figure: { shiftMatches: matchedShiftSamples, labels: 8, minimumTextPx: preview.minActualTextPx,
      scrollEnd: '324/324', currentSpec: context.spec.sha256, currentSvg: context.svg.sha256 },
  }, null, 2))
}
