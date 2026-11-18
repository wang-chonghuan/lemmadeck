import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d746-n79-fig186187-minimal-repair')
const historical = path.join(root, '.intentfold/tickets/STEMROBIN-181/evidence/reports/d706-current-progress/n79-fig186187-author')
const approved = path.join(root, '.intentfold/tickets/STEMROBIN-181/evidence/reports/d706-current-progress/n79-text-repair/candidates')
const ids = ['fig-186', 'fig-187']
if (process.cwd() !== root) throw new Error('Wrong checkout')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = (file) => ({ path: file, sha256: sha(file) })
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeOnce = (file, value) => {
  if (!file.startsWith(`${own}/`)) throw new Error('Outside owned directory')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const jsonHash = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')
const sourceFacts = {
  '186-a-source': 'The left panel has a left-facing rounded eye with an anterior bulge and posterior boundary. Three solid, approximately parallel upper, axial and lower rays travel rightward. After the eye front the outer rays converge, cross on the axis before the posterior boundary, and reach that boundary separated again; the axial ray stays straight. The panel is labelled Cyrillic a. No named point, dimension, angle, focus dot, grid or numerical given is present.',
  '186-b-source': 'The right panel has a left-facing rounded eye preceded by a vertical diverging-lens symbol: its top tip points down/inward and its bottom tip up/inward. Three solid parallel rays enter from the left; outer rays spread between lens and eye, then converge at the posterior axial boundary. Two dashed backward extensions meet an open axial point A left of the lens, which lies on the straight axial ray. The panel is labelled Cyrillic b. No other named point, dimension, angle, grid or numerical given is present.',
  '187-a-source': 'The upper panel has a left-facing rounded eye and three solid approximately parallel incident rays travelling rightward. The outer rays converge after the eye front but are still separate at the posterior boundary; their solid continuations meet on the axis just beyond it. A short axial rightward continuation remains. The panel is labelled Cyrillic a. No named point, dimension, angle, grid or numerical given is present. The current edition interprets the beyond-retina portions as hypothetical continuation, not light propagating through a living retina.',
  '187-b-source': 'The middle panel has a left-facing rounded eye preceded by a vertical converging-lens symbol: its top tip points up/outward and its bottom tip down/outward. Three solid approximately parallel rays enter from the left. The outer rays bend inward at the lens, are closer together on reaching the eye, and then converge at the posterior axial boundary; the axial ray stays straight. The panel is labelled Cyrillic b. No named point, dimension, angle, grid or numerical given is present.',
  '187-c-source': 'The lower panel has an open virtual-image point S1 left of the real axial object point S, both left of a converging spectacle lens and a left-facing rounded eye. The lens tips point up/outward and down/outward. Three solid upper, axial and lower rays leave S toward the right. Outer rays become less divergent after the lens and then converge through the eye at its posterior axial boundary. Two dashed backward extensions of the post-lens rays meet S1. A dimension line labelled d spans from a vertical drop below S1 to a drop at the eye front. The panel is labelled Cyrillic v. Only S, subscripted S1 and d are source labels; no 25 cm, angle, grid, power or other numerical given is printed.',
}
const additions = [
  'English a/b/c panel headings replace source Cyrillic panel labels; Figure 186 is stacked for readable 640 px media.',
  'Retina labels and boundary emphasis, focus explanations, qualification notes, and regularized eye outlines are modern additions, not source pixel text.',
  'Each schematic panel has its own non-quantitative scale; hidden assertion anchors do not become visible source dots.',
  'Figure 187(a) retains solid continuations but distinguishes them as hypothetical using muted color and an explicit note.',
  'Figure 187(c) retains S1 typography in English and adds conventional 25 cm, d > 25 cm and non-universal-near-point qualifiers from the approved edition, not the source pixels.',
]
const moves = {
  'fig-186': { 'model-qualifier': [28, 48], 'medical-qualifier': [28, 18], '186-a-focus-note': [325, 358] },
  'fig-187': { 'model-qualifier': [28, 48], 'medical-qualifier': [28, 18], '187-a-continuation-note': [290, 657] },
}

function prepare() {
  const oldReport = read(path.join(historical, 'report.json'))
  const history = { ticket: 'STEMROBIN-181', author: 'd746', role: 'author-only', preservedBeforeCandidates: true, report: binding(path.join(historical, 'report.json')), figures: [] }
  for (const id of ids) {
    const prior = oldReport.figures.find((f) => f.id === id)
    const revisions = []
    for (const [revision, key] of [['first', 'firstAttempt'], ['repair-1', 'soleRepair']]) {
      const folder = path.join(historical, id, revision)
      const spec = path.join(folder, 'spec.json')
      if (sha(spec) !== prior[key].spec.sha256) throw new Error(`Historical spec hash mismatch: ${id}/${revision}`)
      const files = fs.readdirSync(folder).filter((name) => fs.statSync(path.join(folder, name)).isFile()).sort().map((name) => binding(path.join(folder, name)))
      revisions.push({ revision, spec: binding(spec), files, status: revision === 'first' ? 'DRAFT-PASS; RENDER-EXECUTION-FAIL; NO-IMAGE' : 'DRAFT-PASS; RENDER-COLLISION-FAIL; MEDIA-PRODUCED' })
    }
    history.figures.push({ id, firstFailureRetained: true, revisions, historicalRepairsConsumed: 1, historicalRenderInvocations: 2, historicalStandaloneValidationInvocations: 2 })
  }
  writeOnce(path.join(own, 'preserved-history.json'), history)
  const texts = ['en', 'zh'].map((locale) => {
    const file = path.join(approved, locale, 'phy10-c2-s2-n79/lesson.template.json')
    const lesson = read(file)
    const blocks = lesson.prose.filter((p) => typeof p.text === 'string' && p.text.length)
    return { locale, file: binding(file), blocks, text: blocks.map((p) => p.text).join('\n\n') }
  })
  const inventory = { role: 'fresh author pixel inventory, not independent reviewer approval', originalOpens: 2, previewOpens: 0, imageLimit: 8, contextLimit: 24, additions, figures: [] }
  for (const id of ids) {
    const old = read(path.join(historical, id, 'repair-1/spec.json'))
    const source = path.join(root, old.source.image.path)
    if (sha(source) !== old.source.image.sha256) throw new Error('Source image hash mismatch')
    inventory.figures.push({
      id, source: binding(source), originalOpenedExactlyOnce: true,
      groups: old.source.inventory.map((g) => ({ id: g.id, description: sourceFacts[g.id], objects: g.objects, assertions: g.assertions, ...(g.requires ? { requires: g.requires } : {}) })),
      ambiguity: [], unnamedSourcePointsRealizedByRayIntersectionsAndHiddenAnchors: true,
    })
  }
  writeOnce(path.join(own, 'source-inventory.json'), inventory)
  writeOnce(path.join(own, 'input-bindings.json'), { root, approvedTextInputs: texts.map((t) => ({ locale: t.locale, ...t.file, nonemptyModernProseBlocks: t.blocks.length, modernTextSha256: jsonHash(t.text) })), sourceInventory: binding(path.join(own, 'source-inventory.json')), historicalPreservation: binding(path.join(own, 'preserved-history.json')) })
  for (const id of ids) {
    const beforePath = path.join(historical, id, 'repair-1/spec.json')
    const before = read(beforePath)
    const candidate = structuredClone(before)
    candidate.source.authoritativeText = texts.map((t) => ({ lesson: 'phy10-c2-s2-n79', text: t.text }))
    candidate.source.inventory = inventory.figures.find((f) => f.id === id).groups
    const changes = []
    for (const [objectId, at] of Object.entries(moves[id])) {
      const object = candidate.objects.find((o) => o.id === objectId)
      if (object.type !== 'text') throw new Error('Only text placement may change')
      changes.push({ object: objectId, field: 'at', before: object.at, after: at })
      object.at = at
    }
    const untouched = (spec) => spec.objects.filter((o) => !Object.hasOwn(moves[id], o.id))
    if (JSON.stringify(untouched(before)) !== JSON.stringify(untouched(candidate)) || JSON.stringify(before.assertions) !== JSON.stringify(candidate.assertions)) throw new Error('Geometry/assertion drift')
    const folder = path.join(own, id, 'repair-2')
    const specPath = path.join(folder, 'spec.json')
    writeOnce(specPath, candidate)
    writeOnce(path.join(folder, 'repair.delta.json'), {
      id, before: binding(beforePath), after: binding(specPath),
      currentInvocationCandidateRevisions: 1, cumulativeRepairRevisions: 2,
      technicalLensTipRepairRevisions: 1, currentMetadataAndLabelRepairRevisions: 1,
      reason: 'Direct new offline authorization permits ordinary deterministic defects despite the historical report prohibition. Preserve corrected 2 px lens-tip strokes; rebind stale complete bilingual text and clear identified deterministic padded-label collisions.',
      metadata: {
        field: 'source.authoritativeText', beforeSha256: jsonHash(before.source.authoritativeText), afterSha256: jsonHash(candidate.source.authoritativeText),
        rawChineseUsed: false, completeApprovedModernProseAndCaptions: true,
        paragraphsMatchedExactly: texts.map((t, i) => ({ locale: t.locale, blocks: t.blocks.length, exactJoinedProseMatch: candidate.source.authoritativeText[i].text === t.text, ...t.file })),
        fieldInventory: 'source.inventory', freshSourcePixelDescriptionsAndExistingMappings: true,
      },
      changes, noTextWordingChanges: true, geometryAndAssertionsByteEquivalentAsJSON: true,
      preservedGeometrySha256: jsonHash(untouched(candidate)), assertionsSha256: jsonHash(candidate.assertions),
      affectedStages: ['metadata/source binding', 'label layout', 'draft validation', 'native rendering', 'author native640 visual check'],
      independentReview: 'NOT-PERFORMED; CURRENT HASHES NEED REVIEW',
    })
  }
  console.log(JSON.stringify({ status: 'CANDIDATES-PREPARED', own, preservedHistory: binding(path.join(own, 'preserved-history.json')), specs: ids.map((id) => binding(path.join(own, id, 'repair-2/spec.json'))) }, null, 2))
}

function repairLabels() {
  const observationsPath = path.join(own, 'repair-2-author-observations.json')
  const observations = read(observationsPath)
  if (observations.authorVisualStatus !== 'FAIL') throw new Error('No affected author failure')
  const offsets = { 'fig-186': { id: '186-b-A', offset: [0, -35] }, 'fig-187': { id: '187-c-S', offset: [0, -28] } }
  for (const id of ids) {
    const priorFolder = path.join(own, id, 'repair-2')
    const priorSpec = path.join(priorFolder, 'spec.json')
    const before = read(priorSpec)
    const candidate = structuredClone(before)
    const target = candidate.objects.find((o) => o.id === offsets[id].id)
    const beforeOffset = target.labelPlacement.offset
    target.labelPlacement.offset = offsets[id].offset
    const withoutLabelOffset = (spec) => {
      const copy = structuredClone(spec)
      delete copy.objects.find((o) => o.id === offsets[id].id).labelPlacement.offset
      return copy
    }
    if (JSON.stringify(withoutLabelOffset(before)) !== JSON.stringify(withoutLabelOffset(candidate))) throw new Error('More than label offset changed')
    const folder = path.join(own, id, 'repair-3')
    const specPath = path.join(folder, 'spec.json')
    writeOnce(path.join(folder, 'previous-failure-preservation.json'), {
      authorFailure: binding(observationsPath), previousSpec: binding(priorSpec),
      previousFiles: fs.readdirSync(priorFolder).filter((name) => fs.statSync(path.join(priorFolder, name)).isFile()).sort().map((name) => binding(path.join(priorFolder, name))),
      previousNativeStatus: read(path.join(priorFolder, `${id}.render.json`)).status,
      previousAuthorStatus: 'FAIL',
      noPreviousFilesOverwritten: true,
    })
    writeOnce(specPath, candidate)
    writeOnce(path.join(folder, 'repair.delta.json'), {
      id, before: binding(priorSpec), after: binding(specPath),
      currentInvocationCandidateRevisions: 2, cumulativeRepairRevisions: 3,
      historicalTechnicalRepairRevisions: 1, currentMetadataAndLabelRepairRevisions: 1, currentAuthorLabelClearanceRepairRevisions: 1,
      reason: observations.figures.find((f) => f.id === id).finding,
      changes: [{ object: target.id, field: 'labelPlacement.offset', before: beforeOffset, after: target.labelPlacement.offset }],
      geometryAssertionsAndAuthoritativeTextUnchanged: true, allOtherFieldsUnchanged: true,
      affectedStages: ['label layout', 'draft validation', 'native rendering', 'author native640 visual check'],
      independentReview: 'NOT-PERFORMED; CURRENT HASHES NEED REVIEW',
    })
  }
  console.log(JSON.stringify({ status: 'LABEL-ONLY-CANDIDATES-PREPARED', specs: ids.map((id) => binding(path.join(own, id, 'repair-3/spec.json'))) }, null, 2))
}

function run(id, revision = 'repair-2') {
  if (!ids.includes(id)) throw new Error('Invalid figure')
  if (!['repair-2', 'repair-3'].includes(revision)) throw new Error('Invalid revision')
  const folder = path.join(own, id, revision)
  const receiptFile = path.join(folder, 'attempt.receipt.json')
  if (fs.existsSync(receiptFile)) throw new Error('Attempt already run')
  const runtime = path.join(own, 'runtime', id, revision)
  fs.mkdirSync(runtime, { recursive: true })
  const specPath = path.join(folder, 'spec.json')
  const receipt = { id, author: 'd746', revision, root, spec: binding(specPath), independentReview: 'NONE' }
  const call = (command, args, stage) => {
    const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: runtime } })
    const stdout = path.join(folder, `${stage}.stdout.txt`)
    const stderr = path.join(folder, `${stage}.stderr.txt`)
    fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' })
    fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' })
    receipt[stage] = { command, args, cwd: root, exitCode: result.status, signal: result.signal, ...(result.error ? { executionError: result.error.message } : {}), stdout: binding(stdout), stderr: binding(stderr) }
    return result.status === 0
  }
  const valid = call('python3', [path.join(root, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'), specPath, '--stage', 'draft', '--json'], 'validation')
  if (valid) {
    const rendered = call('node', [path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'), '--spec', specPath, '--svg', path.join(folder, `${id}.svg`), '--png', path.join(folder, `${id}.native640.png`), '--report', path.join(folder, `${id}.render.json`)], 'render')
    const reportPath = path.join(folder, `${id}.render.json`)
    receipt.status = rendered ? 'DRAFT-AND-NATIVE-RENDER-PASS' : fs.existsSync(reportPath) ? 'NATIVE-RENDER-GATE-FAIL' : 'RENDER-EXECUTION-FAIL-NOT-SCIENCE-VERDICT'
    if (fs.existsSync(reportPath)) receipt.report = binding(reportPath)
    receipt.nativeCalls = { standaloneValidation: 1, render: 1, rendererInternalValidation: 1 }
  } else {
    receipt.status = 'DRAFT-VALIDATION-FAIL'
    receipt.render = { status: 'NOT-RUN-DEPENDENT-STAGE-STOPPED' }
    receipt.nativeCalls = { standaloneValidation: 1, render: 0, rendererInternalValidation: 0 }
  }
  writeOnce(receiptFile, receipt)
  console.log(JSON.stringify(receipt, null, 2))
  if (receipt.status !== 'DRAFT-AND-NATIVE-RENDER-PASS') process.exitCode = 2
}

const [action, id, revision] = process.argv.slice(2)
if (action === 'prepare') prepare()
else if (action === 'repair-labels') repairLabels()
else if (action === 'run') run(id, revision)
else throw new Error('Expected prepare or run <figure>')
