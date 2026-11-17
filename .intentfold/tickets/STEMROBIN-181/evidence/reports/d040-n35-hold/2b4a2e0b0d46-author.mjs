import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const parent = path.join(path.dirname(out), 'd039-10p-n35-author')
const bind = p => ({
  path: p,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),
})
const write = (name, value) => {
  const target = path.join(out, name)
  assert(!fs.existsSync(target), `Preserve existing file: ${target}`)
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`)
}
const freezeFile = bind(path.join(parent, 'prose-freeze.json'))
assert.equal(freezeFile.sha256, '81fc968e0b6d0d45ed4ee5a3a1227fbc5b1045b8e98da02b185470b8bb9f6cdb')
const freeze = JSON.parse(fs.readFileSync(freezeFile.path))
for (const language of freeze.frozen) {
  for (const key of ['template', 'exercisesTemplate', 'figuresTemplate', 'readingText']) {
    assert.equal(bind(language[key].path).sha256, language[key].sha256, `Stale ${key}`)
  }
}
assert.equal(bind(freeze.source.path).sha256, freeze.source.sha256)
const source = bind(path.join(parent, 'root/10p/figures/fig-63.png'))
assert.equal(source.sha256, '976cb5467dcf363266da274817d6f7918ce21d6f019575ea4dc563b5504010c6')
const duplicate = bind(path.join(parent, 'work/10p/pages/0100/figures/fig-63.png'))
assert.equal(duplicate.sha256, source.sha256)
const imageBytes = fs.readFileSync(source.path)
const sourceSize = { width: imageBytes.readUInt32BE(16), height: imageBytes.readUInt32BE(20) }
const authoritativeText = freeze.frozen.flatMap(language => {
  const template = JSON.parse(fs.readFileSync(language.template.path))
  return template.prose.filter(b => b.text?.trim()).map(b => ({
    lesson: `${freeze.card}:${language.language}`,
    text: b.text,
  }))
})

// Coordinates below use source-screen orientation; JSXGraph uses upward y.
const xy = (x, y) => [x, 610 - y]
const objects = []
const assertions = []
const inventory = []
const pixelGroups = []
const text = (id, value, x, y) => {
  objects.push({
    id, type: 'text', text: value, at: xy(x, y),
    fontSize: 16, fontWeight: 400, labelColor: 'ink',
    labelPlacement: { position: 'CENTER' },
  })
  return id
}
const group = (id, description, mapped, checks, pixels, values = []) => {
  inventory.push({ id, description, objects: mapped, assertions: checks })
  pixelGroups.push({ id, pixels, description, objects: mapped, assertions: checks, values })
}
const station = (id, x, kind, pixels) => {
  const bounds = [[x, 235], [x + 100, 235], [x + 100, 455], [x, 455]]
  objects.push({
    id, type: 'polygon', points: bounds.map(([a, b]) => xy(a, b)),
    stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1,
  })
  const name = text(`${id}-kind`, kind, x + 50, 370)
  const noun = text(`${id}-name`, 'transformer', x + 50, 394)
  const checkIds = [name, noun].map(label => {
    const aid = `${label}-inside`
    assertions.push({ id: aid, type: 'inside', point: label, container: id, margin: 20 })
    return aid
  })
  group(`${id}-source`, `Source rectangular ${kind.toLowerCase()} transformer; English translation of its interior label.`, [id, name, noun], checkIds, pixels)
}
station('step-up', 80, 'Step-up', [154, 70, 239, 289])
station('step-down-35', 220, 'Step-down', [437, 76, 514, 294])
station('step-down-6', 360, 'Step-down', [614, 79, 687, 296])
station('step-down-220', 500, 'Step-down', [783, 80, 857, 299])

const wirePair = (id, from, to, pixels, description, value, labelAt, transmission = false) => {
  const mapped = []
  const checkIds = []
  for (let i = 0; i < 2; i++) {
    const edge = `${id}-wire-${i + 1}`
    objects.push({
      id: edge, type: 'segment', from: xy(...from[i]), to: xy(...to[i]),
      stroke: 'ink', strokeWidth: 3,
    })
    const aid = `${edge}-connects`
    assertions.push({
      id: aid, type: 'connects', arrow: edge,
      from: xy(...from[i]), to: xy(...to[i]),
    })
    mapped.push(edge)
    checkIds.push(aid)
  }
  const parallel = `${id}-paired-conductors`
  assertions.push({
    id: parallel, type: 'parallel',
    a: xy(...from[0]), b: xy(...to[0]), c: xy(...from[1]), d: xy(...to[1]),
  })
  checkIds.push(parallel)
  if (Array.isArray(value)) {
    mapped.push(text(`${id}-voltage-number`, value[0], labelAt[0], labelAt[1]))
    mapped.push(text(`${id}-voltage-unit`, value[1], labelAt[0], labelAt[1] + 20))
  } else if (value) {
    mapped.push(text(`${id}-voltage`, value, ...labelAt))
  }
  if (transmission) {
    const x = labelAt[0]
    mapped.push(text(`${id}-line-kind`, 'Transmission', x, 170))
    mapped.push(text(`${id}-line-name`, 'line', x, 196))
  }
  group(id, description, mapped, checkIds, pixels, value ? [Array.isArray(value) ? value.join(' ') : value] : [])
}

objects.push({
  id: 'generator-symbol', type: 'circle', center: xy(30, 320), radius: 26,
  stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1,
})
objects.push({
  id: 'generator-ac-wave', type: 'svgPath',
  d: 'M 14 320 C 18 306 26 306 30 320 C 34 334 42 334 46 320',
  stroke: 'ink', strokeWidth: 3,
})
text('generator-name', 'Generator', 46, 242)
assertions.push({ id: 'one-generator', type: 'objectCount', objectType: 'circle', count: 1 })
group('generator', 'One circle containing an alternating-current wave; source generator label above it. No DC conversion apparatus is present.', ['generator-symbol', 'generator-ac-wave', 'generator-name'], ['one-generator'], [12, 83, 113, 215])

wirePair('generator-11', [[54, 310], [54, 330]], [[80, 310], [80, 330]],
  [76, 126, 155, 197], 'Paired generator output conductors enter the left edge of the step-up transformer; source label 11 kV.', '11 kV', [49, 276])
for (const [index, at] of [[1, [54, 310]], [2, [54, 330]]]) {
  assertions.push({
    id: `generator-terminal-${index}-on-circle`, type: 'pointOnCircle',
    point: xy(...at), center: xy(30, 320), radius: 26,
  })
  inventory.find(g => g.id === 'generator-11').assertions.push(`generator-terminal-${index}-on-circle`)
}
wirePair('transmission-110', [[180, 310], [180, 330]], [[220, 310], [220, 330]],
  [237, 131, 440, 246], 'Step-up transformer to first step-down transformer: two horizontal conductors, 110 kV, and one transmission-line label.', ['110', 'kV'], [200, 270], true)
wirePair('transmission-35', [[320, 310], [320, 330]], [[360, 310], [360, 330]],
  [511, 134, 618, 247], 'First to second step-down transformer: paired horizontal conductors, 35 kV, and one transmission-line label.', ['35', 'kV'], [340, 270], true)
wirePair('transmission-6', [[460, 310], [460, 330]], [[500, 310], [500, 330]],
  [684, 136, 787, 247], 'Second to third step-down transformer: paired horizontal conductors, 6 kV, and one transmission-line label.', ['6', 'kV'], [480, 270], true)

for (const stage of [
  { id: '35', x: 220, value: '35 kV', top: [494, 9, 601, 96], bottom: [485, 279, 591, 367] },
  { id: '6', x: 360, value: '6 kV', top: [667, 10, 752, 97], bottom: [666, 282, 762, 371] },
  { id: '220', x: 500, value: '220 V', top: [811, 10, 917, 95], bottom: [811, 285, 917, 376] },
]) {
  wirePair(`branch-${stage.id}-upper`,
    [[stage.x + 18, 235], [stage.x + 34, 235]],
    [[stage.x + 58, 125], [stage.x + 74, 125]], stage.top,
    `One upper diagonal paired branch leaves the ${stage.id === '220' ? '220 V' : stage.id + ' kV'} step-down transformer; both conductors connect to its top border and end openly. Source branch label ${stage.value}.`,
    stage.value, [stage.x + 66, 95])
  wirePair(`branch-${stage.id}-lower`,
    [[stage.x + 18, 455], [stage.x + 34, 455]],
    [[stage.x + 58, 535], [stage.x + 74, 535]], stage.bottom,
    `One lower diagonal paired branch leaves the same transformer; both conductors connect to its bottom border and end openly. Source branch label ${stage.value}.`,
    stage.value, [stage.x + 66, 565])
}
for (const output of [
  { id: 'upper', ys: [270, 284], label: null, pixels: [853, 87, 970, 108] },
  { id: 'middle', ys: [310, 330], label: 270, pixels: [853, 117, 967, 205] },
  { id: 'lower', ys: [420, 434], label: 382, pixels: [852, 237, 969, 294] },
]) {
  wirePair(`users-220-${output.id}`,
    output.ys.map(y => [600, y]), output.ys.map(y => [633, y]),
    output.pixels,
    `Separate ${output.id} horizontal paired output from the last transformer to users; ${output.label === null ? 'no separate voltage annotation is drawn on this upper horizontal pair in the source' : 'one source 220 V label belongs to this pair'}.`,
    output.label === null ? null : ['220', 'V'], [616.5, output.label])
}
text('users-name', 'Users', 610, 484)
group('users-label', 'One source users label at far right covers the three horizontal 220 V outputs. It does not identify extra users on the diagonal branches.', ['users-name'], [], [969, 147, 1000, 241])
assertions.push({ id: 'four-transformers', type: 'objectCount', objectType: 'polygon', count: 4 })
assertions.push({ id: 'twenty-six-conductors', type: 'objectCount', objectType: 'segment', count: 26 })
group('source-overview', 'One continuous left-to-right schematic, not separate subfigures: one generator; four transformer rectangles (one up, three down); 13 paired runs (26 conductors); six diagonal branch runs and three final user runs. No grid, plotted axes, circuit currents, station proper names, load icons, or additional voltage values occur.', [
  'generator-symbol', 'step-up', 'step-down-35', 'step-down-6', 'step-down-220',
], ['one-generator', 'four-transformers', 'twenty-six-conductors'], [0, 0, sourceSize.width, sourceSize.height])

const additions = [
  'Uniform clean rectangles and paired strokes; source left-to-right station order, upper/lower branch arrangement, and separate three right-hand output pairs are retained.',
  'Canvas has more vertical space than the source crop; transformer labels are horizontal two-line English text rather than vertical source text.',
  'Three main line voltages and two labeled right-hand output voltages split number/unit into two lines to preserve 16 px type at 640 px, without changing any given value or labeling the unlabeled upper output.',
  'Transmission-line labels moved above the inter-station runs; the shared Users label is placed below the right-hand output group rather than vertically at its edge.',
  'Only the AC wave is a deterministic cubic path; no free-form paths encode connections, labels, or measurements.',
]
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-63', mode: 'deterministic',
  description: 'Instructional schematic for tracing staged AC electrical-energy transmission and branching distribution, preserving all source transformer stages, paired connections, generator/user labels, and 12 source voltage labels. These source example levels are not universal standards.',
  source: { image: source, authoritativeText, inventory },
  canvas: { width: 640, height: 610, boundingBox: [0, 610, 640, 0], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
  objects, assertions, layout: { minLabelGap: 4 },
}
write('fig-63.spec.json', spec)
write('source-inventory.json', {
  schema: 'ld-s10y-image/bounded-pixel-inventory@1',
  figure: 'fig-63', sourceImage: { ...source, ...sourceSize },
  sourceOpened: true, imagesOpened: 1,
  observations: pixelGroups,
  sourceCounts: { subfigures: 1, generators: 1, stepUpTransformers: 1, stepDownTransformers: 3, conductorPairs: 13, diagonalBranchPairs: 6, finalUserPairs: 3, voltageLabels: 12, transmissionLineLabels: 3 },
  voltageMultiplicity: { '11 kV': 1, '110 kV': 1, '35 kV': 3, '6 kV': 3, '220 V': 4 },
  noAdditionalVoltageValues: true,
  pointRelationships: 'No independently marked or named source points; conductor endpoints are literal station-border/circle connection positions checked with connects, parallel, and pointOnCircle assertions. No extra endpoint dots are invented.',
  modernRegularization: additions, independentPixelReview: 'pending',
})
write('context.json', {
  schema: 'ld-s10y-image/context@1', book: '10p', edition: 'modern-us-neutral',
  figure: 'fig-63', card: freeze.card, ticket: freeze.ticket,
  sourceImage: { ...source, ...sourceSize }, proseFreeze: freezeFile,
  authoritativeRule: 'Frozen ZH/EN edition prose is authoritative; original PNG supplies figure structure. No answer key, source re-gate, or substantive science re-review is performed.',
  authoritativeText,
  bindings: freeze.frozen.map(l => ({ language: l.language, template: l.template, figuresTemplate: l.figuresTemplate, exercisesTemplate: l.exercisesTemplate, readingText: l.readingText })),
  sourceLesson: freeze.source, identicalSourceCrop: duplicate,
  routing: { mode: 'deterministic', renderer: 'JSXGraph', reason: 'Only exact wiring, apparatus rectangles, an AC symbol, and labels are needed; no semantic artwork generation is justified.', purpose: 'instructional' },
  display: { actualScrollMediaWidthPx: 640, mobileScrollMediaWidthPx: 640, widths: [640], minTextPx: 16, liveHeadedProduct: false, plannedEvidence: 'Read-only headless product-CSS figure fixture; no app/DB/template changes or browser windows.' },
  modernRegularization: additions,
})
write('input-bindings.json', {
  schema: 'ld-s10y-image/bounded-input-bindings@1', proseFreeze: freezeFile,
  sourceImage: source, duplicateImage: duplicate, sourceLesson: freeze.source,
  frozenText: freeze.frozen.map(l => ({ language: l.language, template: l.template, figuresTemplate: l.figuresTemplate, exercisesTemplate: l.exercisesTemplate, readingText: l.readingText })),
  skill: bind(path.resolve('.agents/skills/ld-s10y-image/SKILL.md')),
  routing: bind(path.resolve('.agents/skills/ld-s10y-image/references/routing.md')),
  contract: bind(path.resolve('.agents/skills/ld-s10y-image/references/figure-spec.md')),
  renderer: bind(path.resolve('.agents/skills/ld-s10y-image/scripts/render_spec.mjs')),
  validator: bind(path.resolve('.agents/skills/ld-s10y-image/scripts/validate_spec.py')),
})
console.log(`Authored ${objects.length} objects, ${assertions.length} assertions from original pixels.`)
