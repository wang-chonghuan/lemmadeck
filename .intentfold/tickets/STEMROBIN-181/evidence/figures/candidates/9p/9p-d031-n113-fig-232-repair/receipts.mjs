import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const ticketTmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const freezePath = path.join(ticketTmp, 'd031-n113-fig-232-repair-author-freeze.json')
const originalFreeze = path.join(ticketTmp, 'd031-n113-figures-b-author-freeze.json')
const originalFailure = path.join(ticketTmp, 'd031-n113-figures-b-independent-review.json')
const freezeHash = 'e5b48516751cf3514006ed80ef5db43c09a43ab1c80e865f4eef9df50a5531ac'
const failureHash = '6d3886ea6ba548462c0cb557f7274f3d3eced4193e2a295f07365af9fff5da60'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const verify = record => {
  assert.equal(hash(record.path), record.sha256, record.path)
  assert.equal(fs.statSync(record.path).size, record.bytes, record.path)
  return record
}
assert.equal(hash(originalFreeze), freezeHash)
assert.equal(hash(originalFailure), failureHash)
const frozen = read(originalFreeze)
const original = frozen.figures.find(f => f.id === 'fig-232')
const priorBindings = original.finalBindings
const out = path.join(own, 'final')
const specFile = path.join(out, 'spec.json')
const inventoryFile = path.join(out, 'source-inventory.json')
const contextFile = path.join(out, 'complete-context.json')
const changesFile = path.join(own, 'changes-receipt.json')
const uncertainty = 'The small curved epsilon-like glyph below the original supply, approximately x=138..163, y=219..247 in the 334x255 PNG, remains unresolved. Its exact letter, alphabet, script form and variable identity are not asserted. The original PNG was actually reopened once in this fresh batch; no research or glyph-normalization authority was obtained or claimed.'
const addition = 'NEW modern functional English caption Supply identifies the existing high-voltage supply explicitly named in the complete example-2 question. It replaces the supplied E text only as a modern component annotation, not as a transcription, normalization or translation of the unresolved original glyph. No source variable, value, extra component, relationship or answer is asserted.'
const shaJson = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')
const diff = (before, after, pointer = '') => {
  if (JSON.stringify(before) === JSON.stringify(after)) return []
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap(key =>
      diff(before[key], after[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`))
  }
  return [{ pointer, before: before ?? null, after: after ?? null }]
}
const png = file => {
  const buffer = fs.readFileSync(file)
  assert.equal(buffer.subarray(1, 4).toString(), 'PNG')
  return { ...bind(file), width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}
const oldSnapshot = () => [
  bind(originalFreeze), bind(originalFailure),
  ...frozen.frozenFiles.map(verify),
  ...Object.values(priorBindings).map(verify),
]

const stage = process.argv[2]
if (stage === 'prepare') {
  assert.equal(fs.existsSync(freezePath), false)
  assert.equal(hash(path.join(own, 'before/spec.json')), priorBindings.spec.sha256)
  const snapshots = oldSnapshot()
  write(path.join(own, 'preservation-before.json'), { status: 'pass', records: snapshots })
  fs.copyFileSync(originalFreeze, path.join(own, 'inputs/original-author-freeze.json'), fs.constants.COPYFILE_EXCL)
  fs.copyFileSync(originalFailure, path.join(own, 'inputs/original-independent-failure.json'), fs.constants.COPYFILE_EXCL)
  fs.copyFileSync(priorBindings.context.path, path.join(own, 'before/complete-context.json'), fs.constants.COPYFILE_EXCL)
  const copiedBindings = { source: verify(priorBindings.source) }
  for (const key of ['lesson', 'english', 'exercises', 'englishExercises']) {
    const target = path.join(own, 'inputs', `${key}.json`)
    fs.copyFileSync(verify(priorBindings[key]).path, target, fs.constants.COPYFILE_EXCL)
    copiedBindings[key] = bind(target)
    assert.equal(copiedBindings[key].sha256, priorBindings[key].sha256)
  }
  const spec = read(specFile), before = read(path.join(own, 'before/spec.json'))
  const changes = diff(before, spec)
  assert.deepEqual(changes.map(c => c.pointer), [
    '/description', '/source/inventory/2/description',
    '/source/inventory/2/objects/9', '/objects/18/id', '/objects/18/text',
  ])
  const beforeLabel = before.objects[18], afterLabel = spec.objects[18]
  assert.equal(beforeLabel.id, 'supply-E')
  assert.equal(afterLabel.id, 'supply-caption')
  assert.equal(afterLabel.text, 'Supply')
  const withoutIdentity = object => {
    const { id, text, ...rest } = object
    return rest
  }
  assert.deepEqual(withoutIdentity(beforeLabel), withoutIdentity(afterLabel))
  assert.deepEqual(spec.objects.filter((_, i) => i !== 18), before.objects.filter((_, i) => i !== 18))
  assert.deepEqual(spec.assertions, before.assertions)
  assert.deepEqual(spec.source.authoritativeText, before.source.authoritativeText)
  const inventory = structuredClone(original.sourceInventory)
  const supply = inventory.items.find(item => item.id === '232-source-supply')
  supply.observation = supply.observation.replace('E is printed below.', 'A small curved epsilon-like glyph is visible below; its precise identity is unresolved.')
  supply.requirement = 'Preserve the abbreviated supply with two visible long-right pairs without claiming exactly two total cells. Map the existing supply group to supply-caption, the new functional English caption Supply grounded in the complete question, not to a claimed source variable or transcribed glyph.'
  supply.mapping = { objects: spec.source.inventory[2].objects, assertions: spec.source.inventory[2].assertions }
  inventory.visibleLabels = ['C', 'R', 'unresolved curved epsilon-like supply glyph']
  inventory.modernAdditions.push(addition)
  inventory.unresolvedPixels = uncertainty
  inventory.functionalCaption = {
    object: 'supply-caption', text: 'Supply', status: 'new-modern-annotation',
    basis: 'Complete example-2 question only; not the solution or glyph.',
    originalGlyphIdentity: null, variableDeclared: false, valueDeclared: false,
    sourceGroup: '232-source-supply',
    questionBindings: { zh: copiedBindings.exercises, en: copiedBindings.englishExercises },
  }
  write(inventoryFile, inventory)
  const context = read(priorBindings.context.path)
  assert.deepEqual(context.chineseCompleteLesson, read(copiedBindings.lesson.path))
  assert.deepEqual(context.englishCompleteLesson, read(copiedBindings.english.path))
  assert.deepEqual(context.chineseCompleteExercises, read(copiedBindings.exercises.path))
  assert.deepEqual(context.englishCompleteExercises, read(copiedBindings.englishExercises.path))
  context.bindings = { ...context.bindings, ...copiedBindings }
  context.sourceInventory = bind(inventoryFile)
  context.sourceObservation = inventory
  write(contextFile, context)
  const geometry = read(path.join(path.dirname(priorBindings.spec.path), 'geometry.json'))
  geometry.specifics.originalLabels = inventory.visibleLabels
  geometry.specifics.addedAnnotation = 'Supply abbreviation and new functional English caption only; no glyph transcription'
  geometry.expectedLabels = ['C', 'R', '...', 'Supply']
  geometry.modernAdditions = inventory.modernAdditions
  geometry.unknownPixels = uncertainty
  geometry.sourceInventory = bind(inventoryFile)
  geometry.completeContext = bind(contextFile)
  write(path.join(out, 'geometry.json'), geometry)
  write(changesFile, {
    status: 'pass', figure: 'fig-232', finding: 'FIG232-G1', role: 'author-only',
    originalSpec: priorBindings.spec, immutableCopy: bind(path.join(own, 'before/spec.json')),
    repairedSpec: bind(specFile), exactChangedFields: changes, changedFieldCount: changes.length,
    metadataChanges: {
      inventory: diff(original.sourceInventory, inventory),
      context: diff(read(priorBindings.context.path), context),
      geometry: diff(read(path.join(path.dirname(priorBindings.spec.path), 'geometry.json')), geometry),
    },
    invariants: {
      allCircuitGeometryUnchanged: true, allOtherLabelsUnchanged: true,
      allRelationshipsAndAssertionsUnchanged: true, noObjectsAddedOrRemoved: true,
      supplyLabelPlacementAndStyleUnchanged: true, authoritativeTextUnchanged: true,
      displayAndCanvasUnchanged: true, fullLessonsAndAllSolvedExamplesByteIdentical: true,
      geometrySha256: shaJson(spec.objects.filter((_, i) => i !== 18)),
      assertionsSha256: shaJson(spec.assertions),
      authoritativeTextSha256: shaJson(spec.source.authoritativeText),
    },
    sourceUncertainty: uncertainty, modernAddition: addition,
    authorization: 'The current human request permits modern functional English Supply or High-voltage supply grounded in the complete question. It does not authorize identifying or normalizing the unknown glyph.',
    repairCount: 1, remainingRepairs: 0, originalAuthorRepairCount: 0,
  })
  console.log('Prepared FIG232-only input copies, provenance, context and exact five-field spec change receipt.')
} else if (stage === 'record-review') {
  assert.equal(read(path.join(out, 'width-preview-report.json')).status, 'pass')
  assert.equal(read(path.join(out, 'author-assertions.json')).status, 'pass')
  const command = [
    path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    path.join(repo, '.agents/skills/ld-s10y-image/scripts/record_review.py'),
    '--spec', specFile, '--render', path.join(out, 'render.json'),
    '--output', path.join(out, 'author-review.json'), '--status', 'pass',
    '--notes', `AUTHOR ONLY; independent review pending. One targeted FIG232-G1 repair (repairCount 1, remaining 0). ${uncertainty} ${addition} Both complete Chinese/English lessons and all Chinese/English solved examples were read and retained byte-identically. Only the supply label ID/text and associated supply provenance metadata changed; position and 32px font are unchanged. All 26 objects, other labels, geometry, connections and assertions remain unchanged. Actual 640x520 normal/full-resolution final pixels were inspected once: Supply is readable below the source, C/R and the three-dot abbreviation remain clear, capacitor gap and source contacts remain intact; no answer, numeric datum, ion/current arrow or extra apparatus appears. Existing native helpers passed at fixed 640px media in actual narrower exercise containers at desktop 1440x960 and mobile 390x844, minimum text 32px and scroll ends reachable. Original freeze and independent failure evidence are preserved. SCI a737213742ab0bb257fe29a829b7c75f1e16d1bfcee376870208add938906fe7 is reused untouched, not rerun or extended. This is not independent, full-card, running-product, promotion or publication approval.`,
  ]
  assert.equal(fs.existsSync(path.join(out, 'author-review.json')), false)
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 180000 })
  write(path.join(out, 'record-author-review-command.json'), {
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null, role: 'author-only', pendingIndependent: true,
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  console.log(result.stdout)
} else if (stage === 'freeze') {
  const widths = read(path.join(out, 'width-preview-report.json'))
  const spec = read(specFile), render = read(path.join(out, 'render.json'))
  assert.equal(widths.status, 'pass')
  assert.equal(render.status, 'pass')
  assert.equal(read(path.join(out, 'author-review.json')).status, 'pass')
  assert.equal(read(path.join(out, 'draft-validation.json')).status, 'pass')
  const preserved = read(path.join(own, 'preservation-before.json')).records.map(verify)
  verify(widths.nativeHelper)
  verify(widths.previewHelper)
  write(path.join(own, 'preservation-after.json'), {
    status: 'pass', originalFreezeSha256: freezeHash, originalFailureSha256: failureHash,
    science: verify(priorBindings.science), originalFilesUntouched: true,
    sharedHelpersUntouched: true, checkedRecords: preserved,
  })
  const normal = png(path.join(out, 'fig-232.normal-preview-640.png'))
  const source = png(priorBindings.source.path)
  const native = png(path.join(out, 'fig-232.native.png'))
  const mobile = png(path.join(out, 'fig-232.mobile-container.png'))
  assert.equal(normal.width, 640)
  assert.equal(normal.height, 520)
  const ledger = {
    schema: 'ld-s10y-image/bounded-image-ledger@1', freshBatch: true,
    figure: 'fig-232', maximumImageOpens: 8, totalImageOpens: 2,
    sourceOpens: 1, finalNormalOpens: 1, nativeOpens: 0, mobileContainerOpens: 0,
    crops: 0, otherFigureOpens: 0, unusedBudget: 6,
    opens: [
      { ordinal: 1, kind: 'original', ...source, actuallyOpened: true, openCount: 1, tool: 'functions.view_image', detail: 'original', observation: uncertainty },
      { ordinal: 2, kind: 'final-normal-640', ...normal, actuallyOpened: true, openCount: 1, tool: 'functions.view_image', detail: 'original', alsoFullResolution: true, observation: 'Supply is legible beneath the existing source; C, R, three-dot abbreviation and unchanged circuit contacts are intact. No label clipping or new answer annotations.' },
    ],
    noOtherImageBatchUntilClosed: true, batchClosed: true,
  }
  write(path.join(own, 'image-open-ledger.json'), ledger)
  const finalBindings = {
    source: bind(priorBindings.source.path),
    context: bind(contextFile), lesson: bind(path.join(own, 'inputs/lesson.json')),
    english: bind(path.join(own, 'inputs/english.json')),
    exercises: bind(path.join(own, 'inputs/exercises.json')),
    englishExercises: bind(path.join(own, 'inputs/englishExercises.json')),
    spec: bind(specFile), render: bind(path.join(out, 'render.json')),
    svg: bind(path.join(out, 'fig-232.svg')),
  }
  for (const key of ['lesson', 'english', 'exercises', 'englishExercises'])
    assert.equal(finalBindings[key].sha256, priorBindings[key].sha256)
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
  const frozenFiles = [...walk(own), priorBindings.source.path, priorBindings.science.path].sort().map(bind)
  const freeze = {
    schema: 'ld-s10y-image/bounded-author-freeze@1',
    ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-n113', edition: 'modern-us-neutral',
    authorDate: '2026-11-17', role: 'figure-author-only', sameActiveInvocation: true,
    target: 'fig-232', ownedRoot: own, ownedFreeze: freezePath,
    status: 'author-pass-independent-pixel-pending', authorPass: true,
    pendingIndependent: true, independentPassClaimed: false,
    finalBindings, frozenFiles,
    originalFreeze: bind(originalFreeze), originalFreezeSha256: freezeHash,
    originalFailure: bind(originalFailure), originalFailureSha256: failureHash,
    originalFailureFinding: 'FIG232-G1', originalInitialHistory: original.initialHistory,
    originalInitialBindings: priorBindings, initialFailureEvidenceRetainedUnmodified: true,
    scienceReused: { ...verify(priorBindings.science), status: 'SCI-PASS', replay: false, freshResearch: false, changed: false },
    changesReceipt: bind(changesFile), exactChangedFields: read(changesFile).exactChangedFields,
    sourceInventory: bind(inventoryFile), sourceUncertainty: uncertainty,
    modernAnnotation: read(inventoryFile).functionalCaption,
    authorReview: bind(path.join(out, 'author-review.json')),
    validation: bind(path.join(out, 'draft-validation.json')),
    widthEvidence: bind(path.join(out, 'width-preview-report.json')),
    widthScope: widths.scope,
    widthReceipts: widths.measurements.map(m => ({
      viewport: m.viewport, container: m.container, status: m.status,
      actualMediaWidth: m.metrics.actualMediaWidth, actualMediaHeight: m.metrics.actualMediaHeight,
      containerWidth: m.metrics.containerWidth, containerClientWidth: m.metrics.containerClientWidth,
      exerciseBodyWidth: m.metrics.exerciseBodyWidth, actualMinimumTextPx: m.metrics.minTextPx,
      horizontalScrollMax: m.metrics.maxScroll, reachedScrollEnd: m.metrics.reachedScrollEnd,
    })),
    dimensionsReceipt: {
      source, canvas: spec.canvas,
      native: { ...native, actuallyOpened: false, openCount: 0, verification: 'PNG header and native renderer evidence only' },
      normal: { ...normal, actuallyOpened: true, openCount: 1, alsoFullResolution: true },
      mobileContainer: { ...mobile, actuallyOpened: false, openCount: 0, verification: 'PNG header and browser measurements only' },
    },
    display: spec.display, repairCount: 1, remainingRepairs: 0,
    repairCounts: { originalAuthorTargetedRepairs: 0, thisTargetedRepair: 1, totalTargetedRepairs: 1, remaining: 0, geometryRepairs: 0, furtherIterationsAllowed: false },
    imageledger: ledger,
    findings: [{ id: 'FIG232-G1', status: 'author-addressed-independent-pending', sourceIdentityResolved: false, resolution: addition }],
    preservation: bind(path.join(own, 'preservation-after.json')),
    actions: { repairs: 1, otherFigureEdits: 0, sharedTemplateEdits: 0, sharedEvidenceEdits: 0, sharedMeterEdits: 0, sharedToolEdits: 0, setup: 0, research: 0, scienceReplay: 0, promotion: 0, database: 0, commits: 0 },
    approvalLimits: { authorOnly: true, independentApproval: false, fullCardApproval: false, runningProductAcceptance: false, promotionApproval: false, publicationApproval: false, sourceGlyphIdentityNotAsserted: true },
  }
  write(freezePath, freeze)
  console.log(JSON.stringify({ status: freeze.status, freezePath, sha256: hash(freezePath), changedFields: freeze.exactChangedFields.map(c => c.pointer), imageOpens: 2, repairCount: 1, remaining: 0 }, null, 2))
} else {
  throw new Error('Expected prepare, record-review or freeze; no iterative repair stage exists.')
}
