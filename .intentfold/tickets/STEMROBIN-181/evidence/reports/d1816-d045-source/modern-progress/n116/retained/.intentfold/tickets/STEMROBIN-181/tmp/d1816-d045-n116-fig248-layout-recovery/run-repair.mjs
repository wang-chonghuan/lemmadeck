import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), W)
const output = '.tmp/STEMROBIN-181/d1816-d045/n116-fig248-layout-recovery'
const evidence = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-fig248-layout-recovery'
const oldEvidence = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-b-figure-author'
const oldOutput = '.tmp/STEMROBIN-181/d1816-d045/n116-b-figure-author'
const oldFreezePath = `${oldEvidence}/author-freeze.json`
const oldFreeze = JSON.parse(fs.readFileSync(oldFreezePath, 'utf8'))
const oldFigure = oldFreeze.figures.find(figure => figure.id === 'fig-248')
const renderer = '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/render_spec.mjs'
const validator = '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
const round = Number(process.argv[3] || 1)
assert.ok(round === 1 || round === 2)
const candidateOutput = round === 1 ? output : `${output}/final`
const specPath = `${candidateOutput}/spec.json`
const svgPath = `${candidateOutput}/fig-248.svg`
const pngPath = `${candidateOutput}/fig-248.preview.png`
const reportPath = `${candidateOutput}/fig-248.render.json`
const scopePath = `${evidence}/${round === 1 ? 'scope-check' : 'final-scope-check'}.json`
const receiptPrefix = round === 1 ? 'fig-248-layout' : 'fig-248-layout-final'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(file.startsWith(`${output}/`) || file.startsWith(`${evidence}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}

function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = `${directory}/${entry.name}`
    return entry.isDirectory() ? files(file) : entry.isFile() ? [file] : []
  })
}

function verifyBindings(value) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    assert.equal(hash(value.path), value.sha256, `Binding changed: ${value.path}`)
  }
  for (const child of Object.values(value)) verifyBindings(child)
}

function commandReceipt(name, command) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(command[0], command.slice(1), {
    cwd: W,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  })
  const receipt = {
    schema: 'STEMROBIN-181/figure-command-receipt@1',
    workdir: W,
    command,
    startedAt,
    finishedAt: new Date().toISOString(),
    exitCode: result.status,
    signal: result.signal,
    error: result.error?.message || null,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  }
  write(`${evidence}/receipts/${name}.json`, receipt)
  console.log(JSON.stringify({ name, exitCode: receipt.exitCode, stdout: receipt.stdout, stderr: receipt.stderr }))
  return receipt
}

function scopeCheck() {
  const before = read(oldFigure.final.spec.path)
  const after = read(specPath)
  const selected = ['selected-n-pole', 'selected-s-pole', 'selected-b-label']
  assert.equal(after.objects.length, before.objects.length)
  const changes = []
  for (let index = 0; index < before.objects.length; index++) {
    const previous = before.objects[index]
    const current = after.objects[index]
    assert.equal(current.id, previous.id)
    if (selected.includes(previous.id)) {
      const { at: oldAt, ...oldRest } = previous
      const { at: newAt, ...newRest } = current
      assert.deepEqual(newRest, oldRest)
      assert.notDeepEqual(newAt, oldAt)
      changes.push({ id: previous.id, before: oldAt, after: newAt })
    } else {
      assert.deepEqual(current, previous)
    }
  }
  const { objects: oldObjects, ...oldRest } = before
  const { objects: newObjects, ...newRest } = after
  assert.deepEqual(newRest, oldRest)
  assert.equal(changes.length, 3)
  const draft = read(oldFreeze.authoritativeText.draft.path)
  assert.equal(after.source.authoritativeText[0].text, draft.en.join('\n\n'))
  assert.equal(crypto.createHash('sha256').update(draft.en.join('\n\n')).digest('hex'), oldFreeze.authoritativeText.completeENHash)
  assert.equal(crypto.createHash('sha256').update(draft.zh.join('\n\n')).digest('hex'), oldFreeze.authoritativeText.completeZHHash)
  return {
    schema: 'STEMROBIN-181/figure-layout-scope-check@1',
    role: 'AUTHOR mechanical scope check; not independent review',
    changes,
    changedFields: changes.map(change => `${change.id}.at`),
    allOtherSpecFieldsDeepEqual: true,
    completeBilingualTextUnchanged: true,
    sourceAndInventoryUnchanged: true,
    artworkAssetsUnchanged: true,
    allGeometryAssertionsAndVectorsUnchanged: true,
    displayAndLabelSizesUnchanged: true,
  }
}

const action = process.argv[2]
if (action === 'prepare') {
  verifyBindings(oldFreeze)
  assert.equal(hash(renderer), hash('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'))
  assert.equal(hash(renderer), oldFreeze.runtime.renderer.sha256)
  assert.equal(hash(validator), oldFreeze.runtime.validator.sha256)
  assert.equal(oldFigure.contentRepairRounds, 1)
  assert.equal(oldFigure.technicalRecoveries, 1)
  assert.equal(oldFigure.machineStatus, 'FAIL')
  const protectedFiles = [
    ...files(oldEvidence),
    ...files(oldOutput),
    oldFreeze.authoritativeText.draft.path,
    oldFreeze.authoritativeText.affectedReview.path,
    oldFigure.original.path,
    renderer,
    validator,
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
    '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/materialize_arrowheads.mjs',
    '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/ld-s10y-image/scripts/validate_spec.py',
    '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.intentfold/charter/engineering.md',
    '.intentfold/charter/operations.md',
  ]
  const baseline = {
    schema: 'STEMROBIN-181/figure-layout-input-binding@1',
    workdir: W,
    capturedAt: new Date().toISOString(),
    previousFreeze: binding(oldFreezePath),
    previousFigure: oldFigure,
    previousUsage: binding(`${oldEvidence}/author-usage.json`),
    protectedFiles: [...new Set(protectedFiles)].sort().map(binding),
    dependencySymlink: {
      path: '.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/node_modules',
      target: fs.readlinkSync('.tmp/STEMROBIN-181/d1816-d045/n117-figure-author/runtime/node_modules'),
      reusedWithoutChanges: true,
    },
    authorization: {
      basis: 'Current direct human instruction authorizes fig248-only deterministic label composition repair, retaining exact inherited counts and historical failures.',
      correctionDate: '2026-11-18',
      correctionReportedByHuman: 'direct18Nov correction retained in live181 comments forbids using internal one-repair counters as new human-approval or terminal barriers for diagnosed local deterministic fixes.',
      liveTicketRefetched: false,
      reasonNotRefetched: 'Current task forbids cloud/DB operations; no claim of a fresh live-ticket read.',
      independentReviewNotAuthorized: true,
    },
  }
  write(`${evidence}/input-binding.json`, baseline)
  fs.mkdirSync(output, { recursive: true })
  fs.copyFileSync(oldFigure.final.spec.path, specPath, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(specPath, 0o644)
  console.log(JSON.stringify({ spec: binding(specPath), protectedFiles: baseline.protectedFiles.length, dependencySymlink: baseline.dependencySymlink }))
} else if (action === 'run') {
  verifyBindings(read(`${evidence}/input-binding.json`))
  write(scopePath, scopeCheck())
  const validated = commandReceipt(`${receiptPrefix}-validate`, [
    'python3', validator, specPath, '--stage', 'draft', '--json',
  ])
  if (validated.exitCode !== 0) process.exit(validated.exitCode || 1)
  const rendered = commandReceipt(`${receiptPrefix}-render`, [
    'node', renderer, '--spec', specPath, '--svg', svgPath,
    '--png', pngPath, '--report', reportPath,
  ])
  if (fs.existsSync(reportPath)) console.log(JSON.stringify(read(reportPath)))
  process.exit(rendered.exitCode || 0)
} else if (action === 'prepare-next') {
  assert.equal(round, 2)
  verifyBindings(read(`${evidence}/input-binding.json`))
  write(`${evidence}/first-layout-failure-binding.json`, {
    schema: 'STEMROBIN-181/figure-layout-failure-binding@1',
    spec: binding(`${output}/spec.json`),
    svg: binding(`${output}/fig-248.svg`),
    bitmap: binding(`${output}/fig-248.preview.png`),
    render: binding(`${output}/fig-248.render.json`),
    receipts: [
      binding(`${evidence}/receipts/fig-248-layout-validate.json`),
      binding(`${evidence}/receipts/fig-248-layout-render.json`),
    ],
    outcome: read(`${output}/fig-248.render.json`),
    actualNewContentRepairRounds: 1,
    countsReset: false,
    diagnosis: 'S/B clear; N padded label footprint touches both the needle-tip and B-tail point clearance boxes. Move only N to the upper-right side of its needle tip between the circular traces, without changing geometry or sizes.',
  })
  fs.mkdirSync(candidateOutput, { recursive: true })
  fs.copyFileSync(`${output}/spec.json`, specPath, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(specPath, 0o644)
  console.log(JSON.stringify({ copiedWritableSpec: binding(specPath), firstFailureRetained: true }))
} else if (action === 'freeze') {
  assert.equal(round, 2)
  const baseline = read(`${evidence}/input-binding.json`)
  verifyBindings(baseline)
  assert.equal(fs.readlinkSync(baseline.dependencySymlink.path), baseline.dependencySymlink.target)
  assert.deepEqual(files(oldEvidence).sort(), baseline.protectedFiles.map(file => file.path).filter(file => file.startsWith(`${oldEvidence}/`)).sort())
  assert.deepEqual(files(oldOutput).sort(), baseline.protectedFiles.map(file => file.path).filter(file => file.startsWith(`${oldOutput}/`)).sort())
  verifyBindings(read(`${evidence}/first-layout-failure-binding.json`))
  assert.deepEqual(scopeCheck(), read(scopePath))
  const report = read(reportPath)
  verifyBindings(report)
  const observation = read(`${evidence}/author-observations.json`)
  verifyBindings(observation)
  const receiptFiles = [
    `${evidence}/receipts/fig-248-layout-validate.json`,
    `${evidence}/receipts/fig-248-layout-render.json`,
    `${evidence}/receipts/fig-248-layout-final-validate.json`,
    `${evidence}/receipts/fig-248-layout-final-render.json`,
  ]
  const receipts = receiptFiles.map(file => ({ ...binding(file), exitCode: read(file).exitCode, command: read(file).command }))
  const inheritedUsage = read(`${oldEvidence}/author-usage.json`)
  const usage = {
    schema: 'STEMROBIN-181/figure-layout-author-usage@1',
    inheritedAuthorUsage: binding(`${oldEvidence}/author-usage.json`),
    inheritedAuthorBatchUsage: inheritedUsage,
    newContentRepairRounds: 2,
    inheritedFig248ContentRepairRounds: oldFigure.contentRepairRounds,
    totalFig248ContentRepairRounds: oldFigure.contentRepairRounds + 2,
    newTechnicalRecoveries: 0,
    inheritedFig248TechnicalRecoveries: oldFigure.technicalRecoveries,
    totalFig248TechnicalRecoveries: oldFigure.technicalRecoveries,
    inheritedBilingualTextRepairRounds: inheritedUsage.inheritedBilingualTextRepairRounds,
    newTextRepairs: 0,
    newTextReviewReruns: 0,
    newExternalValidatorAttempts: 2,
    newNativeRendererAttempts: 2,
    newNativeInternalDraftValidationCalls: 2,
    newExternalValidatorFailures: receipts.filter(receipt => receipt.command[0] === 'python3' && receipt.exitCode !== 0).length,
    newNativeRendererFailures: receipts.filter(receipt => receipt.command[0] === 'node' && receipt.exitCode !== 0).length,
    cumulativeAuthorBatchFigureContentRepairRounds: inheritedUsage.figureContentRepairRounds + 2,
    cumulativeAuthorBatchExternalValidatorAttempts: inheritedUsage.externalValidatorAttempts + 2,
    cumulativeAuthorBatchNativeRendererAttempts: inheritedUsage.nativeRendererAttempts + 2,
    cumulativeAuthorBatchNativeRendererFailures: inheritedUsage.nativeRendererFailures + receipts.filter(receipt => receipt.command[0] === 'node' && receipt.exitCode !== 0).length,
    labelDiagnosticBrowserAttempts: 2,
    labelDiagnosticScreenshots: 0,
    firstDiagnosticBBoxSerializationEmpty: true,
    diagnosticSerializationRecovery: 1,
    newActualImageOpens: observation.imageUsage.actualImagesOpened,
    currentBatchImageOpens: observation.imageUsage.actualImagesOpened,
    currentContextImageOpens: observation.imageUsage.actualImagesOpened,
    priorAuthorContextImageOpens: inheritedUsage.imageOpensThisContext,
    noClaimPriorImageHistoryCleared: true,
    conservativeCombinedImageOpens: inheritedUsage.imageOpensThisContext + observation.imageUsage.actualImagesOpened,
    imageLimitPerBatch: 8,
    imageLimitPerContext: 24,
    countsReset: false,
    inheritedFailuresPreserved: true,
    independentReviews: 0,
    approvedFigures: 0,
    paidCalls: 0,
    modelCalls: 0,
    cloudOperations: 0,
    databaseOperations: 0,
    gitOperations: 0,
    otherChatOperations: 0,
    childAgents: 0,
    dependencyInstallsOrCopies: 0,
    runtimeEdits: 0,
    sourceWrites: 0,
    durableProductWrites: 0,
    indexWrites: 0,
    meterWrites: 0,
    manualSvgEdits: 0,
    recordReviewCalls: 0,
    promotionCalls: 0,
    receipts,
  }
  write(`${evidence}/author-usage.json`, usage)
  const preservation = {
    schema: 'STEMROBIN-181/figure-layout-preservation-receipt@1',
    checkedAt: new Date().toISOString(),
    inputBinding: binding(`${evidence}/input-binding.json`),
    protectedFileCount: baseline.protectedFiles.length,
    protectedFileHashesUnchanged: true,
    previousAuthorDirectoriesFileSetsUnchanged: true,
    rendererByteIdenticalToCanonicalAndOldFreeze: true,
    dependencySymlinkUnchanged: true,
    scopeCheck: binding(scopePath),
    notAFullWorktreeOrGitAudit: true,
    writesLimitedByHelperToOwnedDirectories: true,
  }
  write(`${evidence}/preservation-receipt.json`, preservation)
  const freeze = {
    schema: 'STEMROBIN-181/figure-author-freeze@1',
    ticket: 'STEMROBIN-181',
    batch: 'D045',
    book: '9p',
    lesson: 'phy9-c2-s5-n116',
    frozenAt: new Date().toISOString(),
    workdir: W,
    role: 'AUTHOR ONLY; not independent reviewer',
    scope: ['fig-248'],
    ownership: [output, evidence],
    status: 'AUTHOR-ONLY-FROZEN-NOT-SOURCE-APPROVED',
    approvalComplete: false,
    sourceFidelityApproved: false,
    independentReviewStatus: 'not-performed',
    promotable: false,
    previousFreeze: binding(oldFreezePath),
    previousFigure: oldFigure,
    inputBinding: binding(`${evidence}/input-binding.json`),
    authoritativeText: {
      ...oldFreeze.authoritativeText,
      textUnchanged: true,
      newTextRepairs: 0,
      textReviewReruns: 0,
      effectiveCurrentSCI: 'PASS-carried-forward',
      effectiveCurrentZHEN: 'PASS-carried-forward',
      unrelatedGap: {
        figure: 'fig-246',
        reason: 'Existing author freeze flags current text describing an Earth-field experiment while fig246 source contains a horseshoe magnet with S/N faces.',
        repairedOrReReviewedHere: false,
        notAFig248LabelRepair: true,
      },
    },
    original: binding(oldFigure.original.path),
    artwork: {
      mode: 'deterministic',
      assets: report.assets,
      sourceReusedUnchanged: true,
      naturalArtworkRequiredOrObtained: false,
    },
    runtime: {
      renderer: binding(renderer),
      canonicalRenderer: binding('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
      validator: binding(validator),
      dependencySymlink: baseline.dependencySymlink,
      installed: false,
      copied: false,
      edited: false,
    },
    final: {
      spec: binding(specPath),
      svg: binding(svgPath),
      render: binding(reportPath),
      bitmap: binding(pngPath),
      displayChecks: report.displayChecks,
    },
    machineStatus: report.status.toUpperCase(),
    collisions: report.collisions,
    nativeOutcomeIsSourceApproval: false,
    observations: binding(`${evidence}/author-observations.json`),
    firstLayoutFailure: binding(`${evidence}/first-layout-failure-binding.json`),
    labelClearanceDiagnostic: binding(`${evidence}/label-clearance-diagnostic.json`),
    labelDiagnosticScript: binding(`${evidence}/diagnose-labels.mjs`),
    scopeCheck: binding(scopePath),
    preservationReceipt: binding(`${evidence}/preservation-receipt.json`),
    usageReceipt: binding(`${evidence}/author-usage.json`),
    actualUsage: usage,
    inheritedContentRepairRounds: oldFigure.contentRepairRounds,
    newContentRepairRounds: 2,
    contentRepairRounds: oldFigure.contentRepairRounds + 2,
    inheritedTechnicalRecoveries: oldFigure.technicalRecoveries,
    newTechnicalRecoveries: 0,
    technicalRecoveries: oldFigure.technicalRecoveries,
    historicalNativeFailPreserved: true,
    originalFirstCandidateAndFailureReceipts: oldFigure.first,
    inheritedReceipts: oldFigure.receipts,
    receipts,
    authorScript: binding(`${evidence}/run-repair.mjs`),
    completionMeaning: 'Only the diagnosed selected N/S/B label anchors were changed. Native outcome and author observations are frozen for a future first independent figure review, not review or promotion.',
  }
  write(`${evidence}/author-freeze.json`, freeze)
  console.log(JSON.stringify({ freeze: binding(`${evidence}/author-freeze.json`), final: freeze.final, machineStatus: freeze.machineStatus, usage: { inheritedContentRepairRounds: freeze.inheritedContentRepairRounds, newContentRepairRounds: freeze.newContentRepairRounds, totalContentRepairRounds: freeze.contentRepairRounds, technicalRecoveries: freeze.technicalRecoveries, imageOpens: usage.newActualImageOpens } }, null, 2))
} else {
  throw new Error('Expected prepare, run or freeze')
}
