import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(file.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const freezePath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n82-prose-freeze.json')
assert.equal(hash(freezePath), 'b2bffdee4912bdb4aadd7b0c4949d1af7afd4a8b5b563282caf625fa2190cc98')
const proseFreeze = read(freezePath)
const lessonFile = path.join(repo, proseFreeze.bindings.lessonTemplate.path)
const exerciseFile = path.join(repo, proseFreeze.bindings.exercisesTemplate.path)
assert.equal(hash(lessonFile), proseFreeze.bindings.lessonTemplate.sha256)
assert.equal(hash(exerciseFile), proseFreeze.bindings.exercisesTemplate.sha256)
const lesson = read(lessonFile)
assert.equal(lesson.id, 'phy9-c2-s2-n82')
assert.deepEqual(read(exerciseFile).exercises, [])
const fullText = lesson.prose.filter(block => block.kind === 'p' && block.text.trim())
  .map(block => ({ lesson: lesson.id, text: block.text }))
assert.ok(fullText.length > 0)
const inventoryFile = path.join(own, 'source-inventory.json')
const pixelInventory = read(inventoryFile)
const contracts = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/build_context.py',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
].map(file => bind(path.join(repo, file)))
const authority = {
  proseFreeze: bind(freezePath),
  lessonTemplate: bind(lessonFile),
  exercisesTemplate: bind(exerciseFile),
  pixelInventory: bind(inventoryFile),
}
const projection = path.join(own, 'native-input/9p')
const projectedLesson = path.join(projection, 'editions/modern-us-neutral/lessons', lesson.id)
fs.mkdirSync(projectedLesson, { recursive: true })
fs.mkdirSync(path.join(projection, 'figures'), { recursive: true })
fs.symlinkSync(lessonFile, path.join(projectedLesson, 'lesson.json'))
fs.symlinkSync(exerciseFile, path.join(projectedLesson, 'exercises.json'))
const contexts = []
for (const source of pixelInventory.imageLedger.opens) {
  const sourceFile = path.join(repo, source.path)
  assert.equal(hash(sourceFile), source.sha256)
  fs.symlinkSync(sourceFile, path.join(projection, `figures/${source.figure}.png`))
  const folder = path.join(own, source.figure)
  const contextPath = path.join(folder, 'context.native.json')
  fs.mkdirSync(folder, { recursive: true })
  const builder = path.join(repo, '.agents/skills/ld-s10y-image/scripts/build_context.py')
  const argv = [
    builder, '--book', '9p', '--edition', 'modern-us-neutral', '--figure', source.figure,
    '--root', path.dirname(projection), '--output', contextPath,
  ]
  const env = { ...process.env }
  delete env.PWDEBUG
  const result = spawnSync('python3', argv, { cwd: repo, encoding: 'utf8', env })
  write(path.join(folder, 'native-context-call.json'), {
    command: 'python3', argv, cwd: repo, script: bind(builder),
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    invocationOrdinal: 1, status: result.status === 0 ? 'pass' : 'fail',
    sourceAccess: 'PNG header and byte hash only, not an image context load.',
  })
  assert.equal(result.status, 0, result.stderr)
  const native = read(contextPath)
  assert.equal(native.sourceImage.sha256, source.sha256)
  assert.equal(native.lessons.length, 1)
  const context = {
    ...native,
    sourceImage: { ...native.sourceImage, path: source.path },
    nativeContext: bind(contextPath),
    frozenBindings: { ...authority, source: bind(sourceFile) },
    contextMethod: `One unmodified native build_context.py call over symlinked frozen inputs; augmented with the complete modern lesson template and all ${fullText.length} current modern paragraph blocks.`,
    fullLesson: lesson,
    lessons: [{ ...native.lessons[0], fullProse: lesson.prose, authoritativeText: fullText }],
  }
  write(path.join(folder, 'context.json'), context)
  contexts.push(bind(path.join(folder, 'context.json')))
}
write(path.join(own, 'authority-bindings.json'), {
  schema: 'ld-s10y-image/author-authority-bindings@1',
  authority, contexts, readContracts: contracts,
  proseFreezeAliasResolution: 'User T/9p-n82-prose-freeze.json resolved to .intentfold/tickets/STEMROBIN-181/tmp/9p-n82-prose-freeze.json by exact supplied SHA-256. No copied or edited authoritative file.',
  productWidths: [640, 331, 342],
  productWidthBasis: 'Actual media widths supplied by Main; isolated preview is not a new headed product measurement.',
})

function makeFigure(id, height, description) {
  const context = read(path.join(own, id, 'context.json'))
  const objects = []
  const assertions = []
  const points = {}
  const labels = {}
  const circuits = []
  const sourceGroups = []
  const addPoint = (name, x, y, visible = false) => {
    assert.ok(!points[name])
    points[name] = [x, height - y]
    objects.push({
      id: name, type: 'point', at: points[name], visible,
      ...(visible ? { size: 6, strokeWidth: 2, stroke: 'ink', fill: 'ink' } : {}),
    })
    return name
  }
  const addEdge = (name, from, to, strokeWidth = 4) => {
    objects.push({ id: name, type: 'segment', from, to, stroke: 'ink', strokeWidth })
    assertions.push({ id: `${name}-connects`, type: 'connects', arrow: name, from, to })
    circuits.push({ id: name, from, to })
    return name
  }
  const addText = (name, x, y, text) => {
    labels[name] = text
    objects.push({
      id: name, type: 'text', at: [x, height - y], text,
      fontSize: 34, fontWeight: 400, labelColor: 'ink',
      labelPlacement: { position: 'CENTER' },
    })
    return name
  }
  const addCapacitor = (name, xLeft, xRight, y, chargeY, titleY, leftChargeX, rightChargeX, q) => {
    const plateIds = []
    const pointIds = {}
    for (const [polarity, x] of [['positive', xLeft], ['negative', xRight]]) {
      pointIds[polarity] = {}
      for (const [location, dy] of [['top', -45], ['contact', 0], ['bottom', 45]]) {
        pointIds[polarity][location] = addPoint(`${name}-${polarity}-${location}`, x, y + dy)
      }
      plateIds.push(addEdge(`${name}-${polarity}-upper-plate`, pointIds[polarity].top, pointIds[polarity].contact, 8))
      plateIds.push(addEdge(`${name}-${polarity}-lower-plate`, pointIds[polarity].contact, pointIds[polarity].bottom, 8))
    }
    assertions.push({
      id: `${name}-plates-parallel`, type: 'parallel',
      a: pointIds.positive.top, b: pointIds.positive.bottom,
      c: pointIds.negative.top, d: pointIds.negative.bottom,
    })
    assertions.push({
      id: `${name}-gap-open`, type: 'distance',
      a: pointIds.positive.contact, b: pointIds.negative.contact, value: xRight - xLeft,
    })
    const index = name === 'cap1' ? '\u2081' : '\u2082'
    const labelIds = [
      addText(`${name}-label`, (xLeft + xRight) / 2, titleY, `C${index}`),
      addText(`${name}-positive-charge`, leftChargeX, chargeY, `+|${q}|`),
      addText(`${name}-negative-charge`, rightChargeX, chargeY, `-|${q}|`),
    ]
    return { plateIds, pointIds, labelIds }
  }
  const group = (name, description, ids, assertionIds) => {
    sourceGroups.push({ id: name, description, objects: ids, assertions: assertionIds })
  }
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: { image: context.frozenBindings.source, authoritativeText: fullText, inventory: sourceGroups },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
    objects, assertions, layout: { minLabelGap: 4 },
  }
  return { id, height, context, spec, objects, assertions, points, labels, circuits, sourceGroups, addPoint, addEdge, addText, addCapacitor, group }
}

const parallel = makeFigure('fig-153', 640,
  'Two capacitors in parallel between the same two conductors. Source charged-state signs and independent q_1/q_2 labels are preserved; no charge equality or derivation is added.')
const upper = parallel.addCapacitor('cap1', 306, 334, 175, 95, 42, 225, 405, 'q\u2081')
const lower = parallel.addCapacitor('cap2', 306, 334, 455, 545, 602, 225, 405, 'q\u2082')
for (const [name, x] of [['positive', 120], ['negative', 520]]) {
  parallel.addPoint(`${name}-top-corner`, x, 175)
  parallel.addPoint(`${name}-junction`, x, 315, true)
  parallel.addPoint(`${name}-bottom-corner`, x, 455)
  parallel.addPoint(`${name}-outer-terminal`, name === 'positive' ? 24 : 616, 315)
  const railIds = [
    parallel.addEdge(`${name}-upper-rail`, `${name}-top-corner`, `${name}-junction`),
    parallel.addEdge(`${name}-lower-rail`, `${name}-junction`, `${name}-bottom-corner`),
    parallel.addEdge(`${name}-upper-branch`, `${name}-top-corner`, upper.pointIds[name].contact),
    parallel.addEdge(`${name}-lower-branch`, `${name}-bottom-corner`, lower.pointIds[name].contact),
    parallel.addEdge(`${name}-external-lead`, `${name}-outer-terminal`, `${name}-junction`),
  ]
  parallel.group(`${name}-common-conductor`,
    pixelInventory.figures[0].groups.find(group => group.id === `${name}-common-conductor`).description,
    [...railIds, `${name}-junction`], railIds.map(id => `${id}-connects`))
}
for (const [cap, sourceGroup] of [[upper, pixelInventory.figures[0].groups[0]], [lower, pixelInventory.figures[0].groups[1]]]) {
  parallel.group(sourceGroup.id, `${sourceGroup.description} Uncalibrated clean layout replaces scan irregularities.`,
    [...cap.plateIds, ...cap.labelIds], [...cap.plateIds.map(id => `${id}-connects`), ...sourceGroup.nativeAssertions])
}
parallel.assertions.push({ id: 'source-six-labels', type: 'objectCount', objectType: 'text', count: 6 })
parallel.group('source-label-completeness', pixelInventory.figures[0].absence,
  Object.keys(parallel.labels), ['source-six-labels'])

const series = makeFigure('fig-154', 320,
  'Two capacitors connected in series with one isolated intermediate conductor. U_1, U_2, U_3 are node potentials, not three capacitors or equal voltage drops. Source equal-|q| charged state is interpreted only under the full frozen prose initial-neutral, no-leakage conditions.')
const first = series.addCapacitor('cap1', 146, 172, 135, 56, 270, 99, 219, 'q')
const second = series.addCapacitor('cap2', 468, 494, 135, 56, 270, 421, 541, 'q')
series.addPoint('left-outer-terminal', 24, 135)
series.addPoint('right-outer-terminal', 616, 135)
const leftLead = series.addEdge('left-external-lead', 'left-outer-terminal', first.pointIds.positive.contact)
const middleWire = series.addEdge('intermediate-wire', first.pointIds.negative.contact, second.pointIds.positive.contact)
const rightLead = series.addEdge('right-external-lead', second.pointIds.negative.contact, 'right-outer-terminal')
series.addText('potential-u1', 72, 205, 'U\u2081')
series.addText('potential-u2', 320, 205, 'U\u2082')
series.addText('potential-u3', 567, 205, 'U\u2083')
for (const [cap, sourceGroup] of [[first, pixelInventory.figures[1].groups[0]], [second, pixelInventory.figures[1].groups[1]]]) {
  series.group(sourceGroup.id, sourceGroup.description,
    [...cap.plateIds, ...cap.labelIds], [...cap.plateIds.map(id => `${id}-connects`), ...sourceGroup.nativeAssertions])
}
series.group('outer-leads-and-potentials', pixelInventory.figures[1].groups[2].description,
  [leftLead, rightLead, 'potential-u1', 'potential-u3'], [`${leftLead}-connects`, `${rightLead}-connects`])
series.group('isolated-intermediate-conductor',
  `${pixelInventory.figures[1].groups[3].description} Initial neutrality and no leakage are contextual conditions, not new graphical labels.`,
  [middleWire, 'potential-u2', ...first.plateIds.filter(id => id.includes('negative')), ...second.plateIds.filter(id => id.includes('positive'))],
  [`${middleWire}-connects`])
series.assertions.push({ id: 'source-nine-labels', type: 'objectCount', objectType: 'text', count: 9 })
series.group('source-label-completeness', pixelInventory.figures[1].absence,
  Object.keys(series.labels), ['source-nine-labels'])

for (const figure of [parallel, series]) {
  const out = path.join(own, figure.id, 'initial')
  write(path.join(out, 'spec.json'), figure.spec)
  write(path.join(out, 'geometry.json'), {
    schema: 'ld-s10y-image/author-circuit-geometry@1',
    figure: figure.id, points: figure.points, edges: figure.circuits, exactLabels: figure.labels,
    expectedConductors: figure.id === 'fig-153' ? [
      ['positive-outer-terminal', 'positive-junction', 'cap1-positive-contact', 'cap2-positive-contact'],
      ['negative-outer-terminal', 'negative-junction', 'cap1-negative-contact', 'cap2-negative-contact'],
    ] : [
      ['left-outer-terminal', 'cap1-positive-contact'],
      ['cap1-negative-contact', 'cap2-positive-contact'],
      ['cap2-negative-contact', 'right-outer-terminal'],
    ],
    expectedVisibleJunctions: figure.id === 'fig-153' ? ['positive-junction', 'negative-junction'] : [],
    sourceInventory: bind(inventoryFile),
    inventoryMapping: figure.sourceGroups,
    interpretation: pixelInventory.figures.find(item => item.id === figure.id).groups,
    modernRegularization: pixelInventory.figures.find(item => item.id === figure.id).modernRegularization,
    endpointMappingDecision: 'Plate strokes are split at shared hidden contact anchors. Every wire and plate half has a connects assertion. Native inventory maps visible strokes/text/dots, not invisible construction points; author graph checks derive and verify the full electrical components. Gap distances are uncalibrated layout clearances, not source measurements.',
  })
}
console.log(JSON.stringify({
  status: 'authored-not-independently-reviewed',
  authority, contexts,
  figures: [parallel, series].map(figure => ({
    id: figure.id, spec: bind(path.join(own, figure.id, 'initial/spec.json')),
    objectCount: figure.objects.length, assertionCount: figure.assertions.length,
  })),
}, null, 2))
