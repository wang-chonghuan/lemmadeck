import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const lane = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d193-n20-figures30-31-author')
const media = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d193/figures')
const input = JSON.parse(fs.readFileSync(path.join(lane, 'input-freeze.json')))
const receipt = (file) => {
  const absolute = path.resolve(cwd, file)
  const bytes = fs.readFileSync(absolute)
  return { path: absolute, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const write = (file, value) => {
  assert.ok(file.startsWith(`${lane}/`) || file.startsWith(`${media}/`))
  assert.ok(!fs.existsSync(file), `Refusing to replace ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const verify = (expected) => {
  assert.deepEqual(receipt(expected.path), expected)
  return expected
}
const bound = new Map()
const collect = (value) => {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && Number.isInteger(value.bytes) && typeof value.sha256 === 'string') {
    bound.set(value.path, verify(value))
  }
  for (const child of Object.values(value)) collect(child)
}
collect(input)
const contexts = input.contexts.map((entry) => JSON.parse(fs.readFileSync(entry.path)))
contexts.forEach(collect)
write(path.join(lane, 'input-bindings.json'), {
  schema: 'd193/input-bindings@1',
  inputFreeze: receipt(path.join(lane, 'input-freeze.json')),
  files: [...bound.values()],
  result: 'Exact path, byte length, and SHA256 agree with supplied immutable inputs.',
  preparationCallsReplayed: 0,
  textReviewReplayed: 0
})

function base(context, width, height, description) {
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id: context.figure,
    mode: 'deterministic',
    description,
    source: {
      image: { path: context.durableSourceImage.path, sha256: context.durableSourceImage.sha256 },
      authoritativeText: Object.values(context.languages).map((language) => ({
        lesson: context.lesson, text: language.fullText
      })),
      inventory: []
    },
    canvas: { width, height, boundingBox: [0, height, width, 0], keepAspectRatio: true, background: 'paper' },
    display: context.defaultDisplay,
    objects: [],
    assertions: [],
    layout: { minLabelGap: 4 }
  }
}
const group = (spec, id, description, objects, assertions) =>
  spec.source.inventory.push({ id, description, objects, assertions })
const count = (spec, id, objectType, value) =>
  spec.assertions.push({ id, type: 'objectCount', objectType, count: value })
const segment = (spec, id, from, to, width = 3.5, stroke = 'ink') => {
  spec.objects.push({ id, type: 'segment', from, to, stroke, strokeWidth: width, dash: 0 })
  const assertionId = `${id}-connection`
  spec.assertions.push({ id: assertionId, type: 'connects', arrow: id, from, to })
  return assertionId
}
const label = (spec, id, at, text, size = 28) =>
  spec.objects.push({ id, type: 'text', at, text, fontSize: size, fontWeight: 500, labelColor: 'ink', labelPlacement: { position: 'CENTER' } })

function circuit(context) {
  const spec = base(context, 640, 520, 'Ideal LC circuit: one coil and one capacitor in a single loop, with no external drive or extra branch. L and C are modern component-name additions from the frozen text, not source labels.')
  const wireAssertions = [
    segment(spec, 'source-top-lead', [170, 450], [480, 450]),
    segment(spec, 'source-right-upper-lead', [480, 450], [480, 280]),
    segment(spec, 'source-right-lower-lead', [480, 250], [480, 60]),
    segment(spec, 'source-bottom-lead', [480, 60], [170, 60]),
    segment(spec, 'source-left-lower-lead', [170, 60], [170, 150]),
    segment(spec, 'source-left-upper-lead', [170, 350], [170, 450])
  ]
  group(spec, 'source-loop', 'One rectangular circuit frame: upper and lower leads join the left coil to the right capacitor; no extra branches. The tiny lower-right scan break is regularized as a continuous ideal wire by the explicitly approved ideal LC text.', [
    'source-top-lead', 'source-right-upper-lead', 'source-right-lower-lead',
    'source-bottom-lead', 'source-left-lower-lead', 'source-left-upper-lead'
  ], wireAssertions)
  const coilAssertions = []
  for (let index = 0; index < 4; index++) {
    const id = `source-coil-lobe-${index + 1}`
    const center = [170, 325 - 50 * index]
    const start = [170, center[1] + 25]
    const end = [170, center[1] - 25]
    spec.objects.push({ id, type: 'arc', center, start, end, stroke: 'ink', strokeWidth: 3.5, dash: 0 })
    for (const [suffix, point] of [['upper', start], ['lower', end]]) {
      const assertionId = `${id}-${suffix}-on-circle`
      spec.assertions.push({ id: assertionId, type: 'pointOnCircle', point, center, radius: 25 })
      coilAssertions.push(assertionId)
    }
  }
  count(spec, 'source-four-lobes', 'arc', 4)
  coilAssertions.push('source-four-lobes')
  group(spec, 'source-coil', 'Exactly four consecutive left-bulging lobes, with shared consecutive endpoints and no core or adjustment arrow. Circular regularization of rounded source lobes is modern, not a radius calibration.', [1, 2, 3, 4].map((n) => `source-coil-lobe-${n}`), coilAssertions)
  const plateAssertions = [
    segment(spec, 'source-upper-plate', [455, 280], [505, 280], 6),
    segment(spec, 'source-lower-plate', [455, 250], [505, 250], 6)
  ]
  spec.assertions.push(
    { id: 'source-plates-parallel', type: 'parallel', a: [455, 280], b: [505, 280], c: [455, 250], d: [505, 250] },
    { id: 'source-upper-contact', type: 'pointOnLine', point: [480, 280], a: [455, 280], b: [505, 280] },
    { id: 'source-lower-contact', type: 'pointOnLine', point: [480, 250], a: [455, 250], b: [505, 250] },
    { id: 'source-plate-gap', type: 'displacement', from: [480, 250], to: [480, 280], dx: 0, dy: 30 }
  )
  group(spec, 'source-capacitor', 'Two parallel horizontal plates separated by a real gap; right upper/lower wires contact their respective plates, not each other. Plate dimensions are schematic, not source values.', ['source-upper-plate', 'source-lower-plate'], [...plateAssertions, 'source-plates-parallel', 'source-upper-contact', 'source-lower-contact', 'source-plate-gap'])
  label(spec, 'modern-inductance-name', [108, 250], 'L', 24)
  label(spec, 'modern-capacitance-name', [546, 265], 'C', 24)
  count(spec, 'no-source-or-added-arrows', 'arrow', 0)
  count(spec, 'no-source-or-added-point-markers', 'point', 0)
  count(spec, 'no-extra-scene-or-grid', 'image', 0)
  return spec
}

const graphModel = {
  width: 933, height: 350, originX: 67, originY: 184,
  chargeAmplitudeDrawingPx: 84, currentAmplitudeDrawingPx: 103,
  periodDrawingPx: 316, chargeEndX: 880, currentEndX: 831,
  samplingMaxDxPx: 0.5,
  qualification: 'Internal drawing coordinates only, not seconds, coulombs, amperes, measured amplitude ratio, or calibrated period. Independent vertical scales for different physical quantities; no values or scale marks rendered.'
}
const q = (x) => graphModel.chargeAmplitudeDrawingPx * Math.cos(2 * Math.PI * (x - graphModel.originX) / graphModel.periodDrawingPx)
const i = (x) => -graphModel.currentAmplitudeDrawingPx * Math.sin(2 * Math.PI * (x - graphModel.originX) / graphModel.periodDrawingPx)
function graph(context) {
  const spec = base(context, graphModel.width, graphModel.height, 'Charge and signed current in one shared uncalibrated time frame. The frozen ideal LC text justifies cosine charge from its positive maximum and negative-sine current from zero, with q prime equals i under the chosen plate-current convention. Source-identification labels are translated into English; no phase, period, or amplitude formula is printed.')
  const user = ([x, y]) => [x, graphModel.height - y]
  const axisAssertions = []
  for (const [id, from, to] of [
    ['source-time-axis', [24, 184], [918, 184]],
    ['source-ordinate-axis', [67, 318], [67, 22]]
  ]) {
    spec.objects.push({ id, type: 'arrow', from: user(from), to: user(to), stroke: 'ink', strokeWidth: 3, dash: 0 })
    const assertionId = `${id}-connection`
    spec.assertions.push({ id: assertionId, type: 'connects', arrow: id, from: user(from), to: user(to) })
    axisAssertions.push(assertionId)
  }
  label(spec, 'source-origin-label', user([43, 209]), 'O')
  label(spec, 'source-qi-label', user([35, 38]), 'q, i')
  label(spec, 'source-t-label', user([921, 216]), 't')
  count(spec, 'source-two-axis-arrows', 'arrow', 2)
  count(spec, 'source-no-tick-scale', 'axis', 0)
  count(spec, 'source-no-grid', 'grid', 0)
  group(spec, 'source-shared-axes', 'Single common time frame with two axis arrows, O, q/i and t; no numerical ticks, separate panels or calibration. The raster-slanted baseline is modernized to horizontal.', ['source-time-axis', 'source-ordinate-axis', 'source-origin-label', 'source-qi-label', 'source-t-label'], [...axisAssertions, 'source-two-axis-arrows', 'source-no-tick-scale', 'source-no-grid'])
  for (const [id, fn, end, strokeWidth, stroke] of [
    ['source-charge-curve', q, graphModel.chargeEndX, 5.5, 'ink'],
    ['source-current-curve', i, graphModel.currentEndX, 2.8, 'accent']
  ]) {
    const n = Math.ceil((end - graphModel.originX) / graphModel.samplingMaxDxPx)
    const screenVertices = Array.from({ length: n + 1 }, (_, index) => {
      const x = graphModel.originX + (end - graphModel.originX) * index / n
      return [x, graphModel.originY - fn(x)].map((v) => Number(v.toFixed(6)))
    })
    spec.objects.push({
      id, type: 'svgPath',
      d: screenVertices.map((at, index) => `${index ? 'L' : 'M'}${at[0]} ${at[1]}`).join(' '),
      stroke, strokeWidth, dash: 0, screenVertices
    })
  }
  count(spec, 'source-two-continuous-curves', 'svgPath', 2)
  group(spec, 'source-charge-curve', 'Thick solid charge curve: maximum-positive start at the vertical axis, descending first, three lower lobes and two later upper lobes, finite negative rising endpoint at the source horizontal extent x=880. Modern analytic smoothing uses the frozen cosine expression, not fabricated source calibration.', ['source-charge-curve'], ['source-two-continuous-curves'])
  group(spec, 'source-current-curve', 'Thin solid current curve: zero at origin, initially negative, three negative and two positive lobes, finite rising negative endpoint at source horizontal extent x=831, earlier than the charge endpoint. No dashed replacement or extension.', ['source-current-curve'], ['source-two-continuous-curves'])
  spec.assertions.push(
    { id: 'source-origin-on-time-baseline', type: 'pointOnLine', point: user([67, 184]), a: user([24, 184]), b: user([918, 184]) },
    { id: 'source-origin-on-ordinate', type: 'pointOnLine', point: user([67, 184]), a: user([67, 318]), b: user([67, 22]) },
    { id: 'source-charge-positive-origin', type: 'displacement', from: user([67, 184]), to: user([67, 100]), dx: 0, dy: 84 }
  )
  group(spec, 'source-phase-relation', 'Source sign/order relation is retained in one frame; exact analytic cosine/negative-sine smoothing and constant spacing are explicitly modern consequences of approved equations (2.10)-(2.11). No physical comparison of the displayed vertical amplitudes is implied. Executable path-bound phase/derivative/zero/extrema checks are in geometry-check.py, beyond these native frame assertions.', ['source-charge-curve', 'source-current-curve'], ['source-origin-on-time-baseline', 'source-origin-on-ordinate', 'source-charge-positive-origin'])
  label(spec, 'source-charge-label', user([844, 60]), 'Charge')
  label(spec, 'source-current-label', user([659, 318]), 'Current')
  const leaderAssertions = [
    segment(spec, 'source-charge-leader', user([783, 73]), user([735, graphModel.originY - q(735)]), 2),
    segment(spec, 'source-current-leader', user([717, 309]), user([750, graphModel.originY - i(750)]), 2)
  ]
  group(spec, 'source-curve-identification', 'Charge/Current translate the two source Chinese curve-identification labels. Both slanted leaders end on their intended curves and have no arrowheads. No new instructional annotation.', ['source-charge-label', 'source-current-label', 'source-charge-leader', 'source-current-leader'], leaderAssertions)
  count(spec, 'source-no-point-markers', 'point', 0)
  count(spec, 'source-five-labels', 'text', 5)
  return spec
}

for (const context of contexts) {
  const id = context.figure
  const attempt = path.join(media, id, 'attempt-1')
  const inventoryFile = path.join(lane, `${id}.source-inventory.json`)
  assert.ok(fs.existsSync(inventoryFile), 'Pixel inventory must exist before authoring.')
  const spec = id === 'fig-30' ? circuit(context) : graph(context)
  const specFile = path.join(attempt, 'spec.json')
  write(specFile, spec)
  if (id === 'fig-31') write(path.join(attempt, 'drawing-model.json'), graphModel)
  const questionFiles = input.drafts.filter((draft) => draft.source.path.endsWith('/exercises.template.json'))
  const questions = questionFiles.map((draft) => {
    const data = JSON.parse(fs.readFileSync(draft.source.path))
    return { input: verify(draft.source), questions: data.exercises.map(({ number, text, figure_refs }) => ({ number, text, figure_refs })) }
  })
  write(path.join(attempt, 'text-binding.json'), {
    schema: 'd193/text-binding@1', figure: id, role: 'author', review: false,
    completeInputContext: receipt(path.join(lane, `${id}.input-context.json`)),
    sourceImage: verify(context.durableSourceImage), sourceCarrierImage: verify(context.sourceImage),
    nativeContextReceipts: Object.values(context.nativeContexts).map(verify),
    frozenTexts: Object.entries(context.languages).map(([language, value]) => ({
      language, carrier: verify(value.lesson), fullText: value.fullText,
      fullTextUtf8Bytes: Buffer.byteLength(value.fullText),
      fullTextSha256: crypto.createHash('sha256').update(value.fullText).digest('hex')
    })),
    questions,
    sourceInventory: receipt(inventoryFile),
    existingTextApproval: verify(context.independentTextReview),
    renderingRoute: {
      selected: 'deterministic',
      reason: id === 'fig-30'
        ? 'Conventional coil/capacitor symbols and connected mathematical leads; no semantic artwork requiring a model.'
        : 'Exact axes, curve sign/phase relations, finite endpoints, and English labels. No semantic artwork.',
      hybridRequired: false, generatedRequired: false, paidCalls: 0, modelCalls: 0
    },
    sourceFactsVsModernChanges: id === 'fig-30' ? {
      sourceFacts: 'One coil with four left lobes, two separated parallel plates, one unbranched rectangular LC frame; no source labels.',
      modernChanges: [
        'Regularize the tiny scanned lower-right lead break as an ideal continuous wire; the approved ideal LC text requires a conducting loop and describes no switch.',
        'Equal circular coil lobes, level leads, equal parallel plate strokes: drafting regularization, not physical dimensions.',
        'L and C are modern component-name labels already named in approved text; no polarity, charge/current direction, or equation is added.'
      ]
    } : {
      sourceFacts: 'One uncalibrated graph; thick solid charge, thin solid current; initial positive charge and zero current becoming negative; source finite horizontal endpoints; O/q,i/t and two identification leaders.',
      modernChanges: [
        'Analytic cosine/negative-sine smoothing and constant repeated spacing are justified by the frozen ideal linear LC equations and chosen initial state, not inferred numerical data.',
        'Internal drawing period/amplitudes are fit parameters in pixels only; graph remains uncalibrated. Charge and current have different physical units and independently chosen visual ordinate scales.',
        'Level the slanted scanned baseline; translate the two Chinese identification labels into English.',
        'Retain source x=880 charge and x=831 current endpoint extents; smoothing regularizes their ordinate only, within the recorded pixel-landmark tolerance. No extra cycle or continuation arrow.'
      ],
      signConvention: "q is the signed selected-plate charge, positive i flows into that plate; q'=i. q(0) is maximum positive, i(0)=0, and i is initially negative.",
      prohibitedAdditionsAbsent: ['numeric calibration', 'period ticks', 'amplitude labels/formulas', 'phase-angle annotations', 'answer markings', 'damping envelope']
    },
    spec: receipt(specFile)
  })
  const args = [
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', specFile,
    '--svg', path.join(attempt, `${id}.svg`),
    '--png', path.join(attempt, `${id}.preview.png`),
    '--report', path.join(attempt, `${id}.render.json`)
  ]
  const start = new Date().toISOString()
  const result = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
  write(path.join(attempt, 'render-command.json'), {
    schema: 'd193/command-receipt@1', command: [process.execPath, ...args],
    cwd, startedAt: start, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
    error: result.error ? String(result.error) : null,
    attempt: 1, inheritedRepairs: 0, contentRepairs: 0,
    rendererInternalDraftValidation: 1,
    localRendererOnly: true, externalBrowserInteraction: 0, networkCalls: 0,
    permissionInterpretation: 'The explicitly required render_spec uses its bundled local headless rendering engine; no separate browser session, browser tools, URL navigation, or network generation is invoked.'
  })
  if (result.status !== 0) {
    console.log(JSON.stringify({ figure: id, status: 'HOLD', stage: 'render', receipt: path.join(attempt, 'render-command.json') }))
    continue
  }
  const resizeArgs = ['--resampleWidth', '640', path.join(attempt, `${id}.preview.png`), '--out', path.join(attempt, `${id}.media640.png`)]
  const resized = spawnSync('/usr/bin/sips', resizeArgs, { cwd, encoding: 'utf8' })
  write(path.join(attempt, 'preview-command.json'), {
    command: ['/usr/bin/sips', ...resizeArgs], cwd, exitCode: resized.status,
    stdout: resized.stdout, stderr: resized.stderr,
    contentRepairConsumed: false, purpose: 'Raster display preview at the native-checked 640 px media width, not a second figure render.'
  })
  console.log(JSON.stringify({ figure: id, renderExitCode: result.status, previewExitCode: resized.status, attempt }))
}
