import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const dir = '.tmp/s10y-image/9-10g/fig-11'
const edition = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n4'
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = (file) => JSON.parse(fs.readFileSync(file))
const save = (name, data) => {
  const file = path.join(dir, name)
  assert(!fs.existsSync(file), `Preserve existing artifact: ${file}`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
}
const context = load(`${dir}/context.json`)
const lesson = load(`${edition}/lesson.json`)
const exercises = load(`${edition}/exercises.json`)
const figures = load(`${edition}/figures.json`)
assert.equal(context.figure, 'fig-11')
assert.equal(hash(context.sourceImage.path), '78d51e15df951d37f27e06a81d182a96e4762d7c7491e0917c5000e847843fb1')
assert.equal(context.sourceImage.sha256, hash(context.sourceImage.path))
assert.deepEqual(context.lessons.map((item) => item.lesson), ['geo910-c1-s1-n4'])
assert.deepEqual(context.lessons[0].exercises, [])
assert(exercises.exercises.every((item) => !item.figure_refs.includes('fig-11')))
assert(figures.figures.some((item) => item.id === 'fig-11'))
const texts = context.lessons[0].prose.flatMap((item) => item.nearbyText)
for (const ref of ['p0019#6', 'p0019#7', 'p0019#8']) {
  const block = lesson.prose.find((item) => item.kind === 'p' && item.source_refs.includes(ref))
  assert(block, ref)
  if (!texts.includes(block.text)) texts.unshift(block.text)
}
for (const text of texts) {
  assert(lesson.prose.some((block) => block.text === text), 'Modern top-level context only')
}
const text = (id, at, value) => ({
  id, type: 'text', at, text: value, fontSize: 44, fontWeight: 500,
  labelColor: 'ink', labelPlacement: { position: 'CENTER' },
})
const plane = (id, points) => ({
  id, type: 'polygon', points, stroke: 'muted', strokeWidth: 3,
  fill: 'accentSoft', fillOpacity: 0.1,
})
const line = (id, from, to) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 4, dash: 0,
})
const point = (id, at) => ({
  id, type: 'point', at, size: 6, strokeWidth: 2, stroke: 'ink', fill: 'ink',
})
const leftOutline = [[25, 95], [295, 140], [295, 400], [25, 355]]
const rightOutline = [[345, 95], [615, 140], [615, 400], [345, 355]]
const objects = [
  plane('left-alpha-outline', leftOutline),
  plane('right-alpha-outline', rightOutline),
  line('left-line-a', [90, 155], [90, 332]),
  line('left-line-b', [205, 166], [205, 350]),
  line('right-line-a', [475, 150], [475, 350]),
  point('left-M', [205, 215]),
  point('right-M', [475, 215]),
  text('left-alpha-label', [60, 140], '\u03b1'),
  text('left-a-label', [127, 279], 'a'),
  text('left-b-label', [240, 322], 'b'),
  text('left-M-label', [249, 210], 'M'),
  text('left-panel-label', [160, 45], 'a)'),
  text('right-alpha-label', [380, 140], '\u03b1'),
  text('right-a-label', [512, 308], 'a'),
  text('right-M-label', [520, 210], 'M'),
  text('right-panel-label', [480, 45], 'b)'),
]
const assertions = []
const pushInside = (id, member, container, margin) => {
  assertions.push({ id, type: 'inside', point: member, container, margin })
}
for (const side of ['left', 'right']) {
  const outline = `${side}-alpha-outline`
  pushInside(`${side}-M-inside`, `${side}-M`, outline, 30)
  pushInside(`${side}-M-label-inside`, `${side}-M-label`, outline, 28)
  pushInside(`${side}-alpha-label-inside`, `${side}-alpha-label`, outline, 28)
  pushInside(`${side}-a-label-inside`, `${side}-a-label`, outline, 28)
  const lines = side === 'left' ? ['left-line-a', 'left-line-b'] : ['right-line-a']
  for (const id of lines) {
    const object = objects.find((item) => item.id === id)
    assertions.push({ id: `${id}-extent-connected`, type: 'connects', arrow: id, from: object.from, to: object.to })
    pushInside(`${id}-lower-inside`, object.from, outline, 25)
    pushInside(`${id}-upper-inside`, object.to, outline, 25)
  }
  const vertices = side === 'left' ? leftOutline : rightOutline
  assertions.push(
    { id: `${side}-window-opposite-edges-1`, type: 'parallel', a: vertices[0], b: vertices[1], c: vertices[3], d: vertices[2] },
    { id: `${side}-window-opposite-edges-2`, type: 'parallel', a: vertices[0], b: vertices[3], c: vertices[1], d: vertices[2] },
  )
}
pushInside('left-b-label-inside', 'left-b-label', 'left-alpha-outline', 28)
assertions.push(
  { id: 'left-M-on-b', type: 'pointOnLine', point: 'left-M', a: [205, 166], b: [205, 350] },
  { id: 'right-M-on-a', type: 'pointOnLine', point: 'right-M', a: [475, 150], b: [475, 350] },
  { id: 'left-a-parallel-b', type: 'parallel', a: [90, 155], b: [90, 332], c: [205, 166], d: [205, 350] },
  { id: 'source-plane-count', type: 'objectCount', objectType: 'polygon', count: 2 },
  { id: 'source-point-count', type: 'objectCount', objectType: 'point', count: 2 },
  { id: 'source-visible-line-count', type: 'objectCount', objectType: 'segment', count: 3 },
  { id: 'source-label-count', type: 'objectCount', objectType: 'text', count: 9 },
)
const inventory = ['left', 'right'].map((side) => ({
  id: `${side}-source-panel`,
  description: side === 'left'
    ? 'Source panel a): alpha window, distinct parallel a/b, M on b not on a, labels alpha/a/b/M and a) below. Exact nonmembership and infinite-line coplanarity are supplementally executable in source-relations-check.json.'
    : 'Source panel b): alpha window, M on the sole line a, labels alpha/a/M and b) below. Semantic b=a alias has no second visible stroke or b label; executable alias check is in source-relations-check.json.',
  objects: objects.filter((item) => item.id.startsWith(`${side}-`)).map((item) => item.id),
  assertions: assertions.filter((item) => item.id.startsWith(`${side}-`)).map((item) => item.id),
}))
// One source point per panel: no invented visible anchors or multi-point claim.
const spec = {
  schema: 'ld-s10y-image/figure-spec@2',
  id: 'fig-11', mode: 'deterministic',
  description: 'Two independent schematic plane configurations from current n4 prose: left M notin a with b through M parallel to distinct a; right M in a with the course-permitted coincident b=a, shown by one a stroke/label. Chosen projected drawing windows, not source-measured angles or a relation between the panels.',
  source: {
    image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 },
    authoritativeText: [...new Set(texts)].map((value) => ({ lesson: lesson.id, text: value })),
    inventory,
  },
  canvas: { width: 640, height: 440, boundingBox: [0, 440, 640, 0], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths: [640, 346, 240] },
  objects, assertions, layout: { minLabelGap: 4 },
}
save('fig-11.spec.json', spec)
const panels = ['left', 'right'].map((side) => {
  const origin = side === 'left' ? [25, 95] : [345, 95]
  const world = ([x, y]) => {
    const u = (x - origin[0]) / 90
    return [u, (y - origin[1] - 15 * u) / 100, 0]
  }
  const members = objects.filter((item) => item.id.startsWith(`${side}-`))
  const lines = Object.fromEntries(members.filter((item) => item.type === 'segment')
    .map((item) => [item.id, { from: world(item.from), to: world(item.to) }]))
  return {
    id: side, independentLocalFrame: true,
    plane: { normal: [0, 0, 1], constant: 0 },
    projection: { origin, basis: [[90, 15], [0, 100], [40, 60]] },
    planeWindow: { object: `${side}-alpha-outline`, vertices: members.find((item) => item.type === 'polygon').points.map(world) },
    points: { [`${side}-M`]: world(members.find((item) => item.type === 'point').at) },
    lines,
    aliases: side === 'right' ? { b: 'right-line-a' } : {},
    sourcePoint: `${side}-M`,
    sourceContainingLine: side === 'left' ? 'left-line-b' : 'right-line-a',
  }
})
save('projection-model.json', {
  schema: 'ticket-scratch/projected-plane-model@1',
  figure: 'fig-11', panels,
  premise: 'Independent local affine schematic frames. Plane outlines are finite drawing windows, not boundaries of infinite planes; all coordinates/style regularization are author layout. The right alias uses exactly one geometric line and one a label.',
})
save('context-binding.json', {
  schema: 'ticket-scratch/durable-context-binding@1',
  figure: 'fig-11', lesson: lesson.id,
  context: { path: `${dir}/context.json`, sha256: hash(`${dir}/context.json`) },
  inputs: ['lesson.json', 'exercises.json', 'figures.json'].map((name) => ({
    path: `${edition}/${name}`, sha256: hash(`${edition}/${name}`),
  })),
  original: { path: context.sourceImage.path, sha256: hash(context.sourceImage.path) },
  inventory: { path: `${dir}/source-inventory.md`, sha256: hash(`${dir}/source-inventory.md`) },
  spec: { path: `${dir}/fig-11.spec.json`, sha256: hash(`${dir}/fig-11.spec.json`) },
  note: 'User authorized approved durable text as authority. Only modern top-level prose, not embedded faithful source.data, was bound. No exercise references this body figure.',
})
console.log(`fig-11 authored: ${objects.length} visible objects; ${assertions.length} native assertions; two source groups; right b is alias only`)
