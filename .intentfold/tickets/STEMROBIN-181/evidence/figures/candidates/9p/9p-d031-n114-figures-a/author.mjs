import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const skill = path.join(repo, '.agents/skills/ld-s10y-image')
const proseRoot = path.join(ticket, 'd031-n114-prose-author')
const lessonId = 'phy9-c2-s5-n114'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const copy = (source, target) => {
  assert.ok(target.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(source), hash(target))
  return { original: bind(source), snapshot: bind(target) }
}
const run = (name, command, args) => {
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  write(path.join(own, 'commands', `${name}.json`), {
    command: [command, ...args], exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
const frozenProse = path.join(ticket, '9p-n114-prose-freeze.json')
const science = path.join(ticket, '9p-n114-science-review.json')
assert.equal(hash(frozenProse), '200785cc8ef4675b8bc3f233202c5d6c2837781ba28b281757fd287548ed679e')
assert.equal(hash(science), '75456eabec7b4a666cd5e00db5b2c7f8791b902f96190f4a5f026cb19e0151b8')
assert.equal(read(science).status, 'PASS')
const freeze = read(frozenProse)
const zhPath = path.join(proseRoot, 'work/adapt/9p/modern-us-neutral/lessons', lessonId, 'lesson.template.json')
const enPath = path.join(proseRoot, 'english/lesson.json')
assert.equal(hash(zhPath), freeze.bindings.lessonTemplate.sha256)
assert.equal(hash(enPath), freeze.bindings.englishLesson.sha256)
const zh = read(zhPath)
const en = read(enPath)
const snapshots = [
  copy(zhPath, path.join(own, 'inputs/chinese.lesson.template.json')),
  copy(enPath, path.join(own, 'inputs/english.lesson.json')),
  copy(frozenProse, path.join(own, 'inputs/prose-freeze.json')),
  copy(science, path.join(own, 'inputs/science-review.json')),
]
for (const relative of [
  'SKILL.md', 'references/routing.md', 'references/figure-spec.md',
  'references/quality-gate.md', 'assets/figure-spec.schema.json',
  'scripts/build_context.py', 'scripts/validate_spec.py', 'scripts/render_spec.mjs',
  'scripts/materialize_arrowheads.mjs', 'scripts/record_review.py',
]) snapshots.push(copy(path.join(skill, relative), path.join(own, 'inputs/skill', relative)))
snapshots.push(copy(path.join(ticket, 'figure-preview.mjs'), path.join(own, 'inputs/figure-preview.mjs')))
snapshots.push(copy(
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
  path.join(own, 'inputs/render_lesson.js'),
))
const authoritativeText = [
  ...zh.prose.filter(block => block.text?.trim()).map(block => ({ lesson: lessonId, text: block.text })),
  ...en.prose.filter(block => block.text?.trim()).map(block => ({ lesson: lessonId, text: block.text })),
]
write(path.join(own, 'inputs/full-authoritative-text.json'), {
  rule: 'The complete frozen modern Chinese and English prose is authoritative. Pixels independently supply visual structure. No answer material used.',
  chinese: bind(zhPath), english: bind(enPath),
  chineseProse: zh.prose, englishProse: en.prose, authoritativeText,
})
const nativeRoot = path.join(own, 'context-root')
const nativeLesson = path.join(nativeRoot, '9p/editions/modern-us-neutral/lessons', lessonId)
write(path.join(nativeLesson, 'lesson.json'), en)
const exercises = path.join(proseRoot, 'english/exercises.json')
assert.equal(hash(exercises), freeze.bindings.englishExercises.sha256)
assert.equal(read(exercises).exercises.length, 0)
snapshots.push(copy(exercises, path.join(nativeLesson, 'exercises.json')))
const sourceDir = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures')
const inventories = [
  {
    id: 'fig-233', sourcePixelDimensions: [230, 622],
    sourceOpen: { sequence: 1, count: 1, method: 'view_image of durable original; no crop or prior inventory consulted' },
    facts: [
      'One apparatus scene. Two separate approximately vertical, straight flexible conductors occupy the upper part; left around x68, right around x130, from y20 to y305.',
      'Both upper ends have small dark terminal-like marks and are separated by white space; no connecting upper wire is visible.',
      'Lower endpoints near y305 continue into separate curved leads to a single box-shaped source below. The left lead bows left; the right lead bows right.',
      'The lower box has a perspective top and two front/side faces. Its top contains degraded dark strokes; no reliable printed identity or numerical value can be recovered.',
      'No unambiguous current-direction arrow or force-direction arrow is visible. The small protrusion on the left conductor is not identified as an arrow.',
      'No panels, grid, axis, numeric givens or legible external labels are present in the durable crop.',
    ],
    textResolution: [
      'Full Chinese and English prose identify the lower object generically as a power supply with two opposite terminals.',
      'The free ends are unconnected: open circuit, no steady current, and no clear attraction or repulsion in this experiment.',
    ],
    unknownPixels: [
      { region: 'power-box top, approximately x25..175 y400..469', status: 'unresolved', identity: null, note: 'Dark interior strokes and terminal-like marks; not decoded as cells, meters, controls, polarity glyphs or printed words.' },
      { region: 'left conductor near x69 y184 and enlarged end/joint marks', status: 'unresolved', identity: null, note: 'No current arrow inferred from isolated degraded protrusions.' },
    ],
    modernAdditions: [
      'Generic labelled two-terminal power-supply rectangle replaces the perspective shell; terminal geometry and bent lead routing are regularized, not claimed as original pixels.',
      'English Open circuit, No steady current and Power supply labels clarify conditions explicitly present in both authoritative languages.',
      'Visible clean joint dots, equal-height endpoints, semantic colors and enlarged line weights are readability regularizations, not apparatus additions.',
    ],
    prohibitedInferences: ['No guessed glyph identities or polarity signs', 'No current or force arrows', 'No switch, resistor, meter, calibration or new electrical branch'],
    mode: 'deterministic', reason: 'Neutral schematics preserve the two wires, open topology, parallel vertical portions and generic supply; semantic artwork adds no necessary identity.',
  },
  {
    id: 'fig-234', sourcePixelDimensions: [234, 646],
    sourceOpen: { sequence: 2, count: 1, method: 'view_image of durable original; no crop or prior inventory consulted' },
    facts: [
      'One apparatus scene. A short upper rectangular connector joins the upper endpoints of the two conductors near x80 and x142, with top horizontal section near y18.',
      'Two dashed roughly vertical lines from upper to lower joints near x78 and x137 record the straight initial positions.',
      'Two solid flexible conductors bow outward: the left to around x49, the right to around x156. Their lower ends return to joints near x74 and x137 at y328.',
      'A visible solid arrow on the left bowed conductor points downward around y180; a visible solid arrow on the right points upward around y180.',
      'Each lower joint continues by a separate curved lead to the one perspective power box below; the source-bound joined loop is closed through the upper connector.',
      'No horizontal force arrows are visible. Repelling motion is represented by outward bowed shapes relative to the dashed reference positions.',
      'The power-box top has degraded strokes, not reliable glyph identities or numeric givens. No panels, grid, axes or legible external labels are present.',
    ],
    textResolution: [
      'Full Chinese and English prose identify a wire joining the free ends to close the circuit and opposite currents in the two wires.',
      'The adjacent facing parallel current-carrying portions repel in this experiment; the text expressly excludes a direction-only rule for arbitrary whole circuits.',
    ],
    unknownPixels: [
      { region: 'power-box top, approximately x20..171 y427..490', status: 'unresolved', identity: null, note: 'No power-box glyph is identified as a meter, battery cell, polarity, switch or printed text.' },
      { region: 'small dark strokes outside lower-right lead near x217 y443..470', status: 'unresolved', identity: null, note: 'Retained as unresolved scan detail, not promoted to a current or force arrow.' },
    ],
    modernAdditions: [
      'Generic labelled two-terminal power-supply rectangle replaces the perspective box; exposed terminal positions and bent lead routing are regularized, not source glyph interpretations.',
      'Outward bowed wires are regularized as upper and lower diagonal shoulders with exact straight, vertical facing central sections; dashed initial positions, connector and each current direction are retained.',
      'English Closed circuit, Opposite currents, I and Power supply labels clarify authoritative prose and visible arrow roles; no numeric current, force or new apparatus is supplied.',
      'No added force arrows. Central outward displacement illustrates the observed repulsion without claiming that the entire displaced wires remain parallel.',
    ],
    prohibitedInferences: ['No guessed glyph identities or polarity signs', 'No source force-arrow claim', 'No added switch, meter, resistor or branch', 'Dashed positions are nonconducting comparison overlays, not extra wires'],
    mode: 'deterministic', reason: 'Current arrows, conductive topology, dashed reference state and facing parallel sections require exact deterministic geometry; neutral apparatus is sufficient.',
  },
]
write(path.join(own, 'source-inventory.json'), {
  schema: 'ld-s10y-image/independent-author-source-inventory@1',
  scope: 'Author source inventory, not independent figure approval',
  inspectedImages: 2, totalPlannedImages: 4,
  figures: inventories,
})

for (const inventory of inventories) {
  const id = inventory.id
  const original = path.join(sourceDir, `${id}.png`)
  const header = fs.readFileSync(original).subarray(0, 24)
  inventory.sourcePixelDimensions = [header.readUInt32BE(16), header.readUInt32BE(20)]
  const sourceSnapshot = copy(original, path.join(nativeRoot, '9p/figures', `${id}.png`))
  const directory = path.join(own, id, 'initial')
  fs.mkdirSync(directory, { recursive: true })
  run(`${id}-build-context`, 'python3', [
    path.join(skill, 'scripts/build_context.py'), '--book', '9p',
    '--edition', 'modern-us-neutral', '--figure', id,
    '--root', nativeRoot, '--output', path.join(directory, 'context.native.json'),
  ])
  const native = read(path.join(directory, 'context.native.json'))
  write(path.join(directory, 'context.complete.json'), {
    ...native, sourceImage: { ...native.sourceImage, ...bind(original) },
    completeAuthoritativeText: read(path.join(own, 'inputs/full-authoritative-text.json')),
    bindings: { proseFreeze: bind(frozenProse), independentSCI: bind(science), sourceSnapshot },
    note: 'Existing build_context tool ran on a private root containing the authoritative full English lesson; nearby-text selection is supplemented with ALL complete Chinese and English prose, not a shared draft or cropped excerpt.',
  })
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: id === 'fig-233'
      ? 'Two straight vertical flexible wires connected to a generic supply at their lower ends, with upper ends unconnected: open circuit and no steady current in the experiment.'
      : 'Closed circuit: left current downward, right current upward. Solid wires displaced outward from dashed initial positions, with exact facing parallel central portions; only those portions illustrate the observed repulsion.',
    source: { image: bind(original), authoritativeText, inventory: [] },
    canvas: { width: 640, height: 760, boundingBox: [0, 760, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
    assets: [], objects: [], assertions: [], layout: { minLabelGap: 6 },
  }
  const add = object => { spec.objects.push(object); return object.id }
  const assertion = item => { spec.assertions.push(item); return item.id }
  const point = (name, at) => add({ id: name, type: 'point', at, size: 4, strokeWidth: 1, stroke: 'ink', fill: 'ink' })
  const wires = [], references = [], currents = []
  const segment = (name, from, to, conducting = true) => {
    add({ id: name, type: 'segment', from, to, stroke: conducting ? 'ink' : 'muted', strokeWidth: conducting ? 4 : 2.5, ...(conducting ? {} : { dash: 2 }) })
    assertion({ id: `${name}-connects`, type: 'connects', arrow: name, from, to })
    ;(conducting ? wires : references).push(name)
  }
  const text = (name, at, value) => add({
    id: name, type: 'text', at, text: value, fontSize: 32, fontWeight: 500,
    labelColor: 'ink', labelPlacement: { position: 'CENTER' },
  })
  const supply = add({
    id: 'source-box', type: 'polygon', points: [[200, 170], [440, 170], [440, 50], [200, 50]],
    stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1,
  })
  point('source-left-terminal', [200, 130])
  point('source-right-terminal', [440, 130])
  point('left-upper-joint', [260, 620])
  point('left-lower-joint', [260, 260])
  point('right-upper-joint', [380, 620])
  point('right-lower-joint', [380, 260])
  text('supply-label', [320, 110], 'Power supply')
  text('circuit-label', [320, 712], id === 'fig-233' ? 'Open circuit' : 'Closed circuit')
  text('condition-label', [320, 668], id === 'fig-233' ? 'No steady current' : 'Opposite currents')
  for (const [side, route] of [
    ['left', ['left-lower-joint', [180, 225], [150, 190], [150, 130], 'source-left-terminal']],
    ['right', ['right-lower-joint', [460, 225], [490, 190], [490, 130], 'source-right-terminal']],
  ]) route.slice(0, -1).forEach((from, index) => segment(`${side}-lead-${index + 1}`, from, route[index + 1]))
  const sourceAssertions = [
    assertion({ id: 'source-terminals-separated', type: 'displacement', from: 'source-left-terminal', to: 'source-right-terminal', dx: 240, dy: 0 }),
    assertion({ id: 'supply-label-inside', type: 'inside', point: 'supply-label', container: supply }),
  ]
  const jointIds = ['left-upper-joint', 'left-lower-joint', 'right-upper-joint', 'right-lower-joint']
  const wireObjects = [...jointIds]
  const relationIds = [
    assertion({ id: 'upper-joints-separated', type: 'displacement', from: 'left-upper-joint', to: 'right-upper-joint', dx: 120, dy: 0 }),
    assertion({ id: 'lower-joints-separated', type: 'displacement', from: 'left-lower-joint', to: 'right-lower-joint', dx: 120, dy: 0 }),
  ]
  if (id === 'fig-233') {
    segment('left-straight-wire', 'left-upper-joint', 'left-lower-joint')
    segment('right-straight-wire', 'right-upper-joint', 'right-lower-joint')
    wireObjects.push('left-straight-wire', 'right-straight-wire')
    relationIds.push(
      'left-straight-wire-connects', 'right-straight-wire-connects',
      assertion({ id: 'straight-wires-parallel', type: 'parallel', a: 'left-upper-joint', b: 'left-lower-joint', c: 'right-upper-joint', d: 'right-lower-joint' }),
      assertion({ id: 'left-wire-vertical', type: 'displacement', from: 'left-upper-joint', to: 'left-lower-joint', dx: 0, dy: -360 }),
      assertion({ id: 'right-wire-vertical', type: 'displacement', from: 'right-upper-joint', to: 'right-lower-joint', dx: 0, dy: -360 }),
    )
  } else {
    for (const [side, x] of [['left', 210], ['right', 430]]) {
      point(`${side}-central-top`, [x, 560])
      point(`${side}-central-bottom`, [x, 320])
      segment(`${side}-upper-shoulder`, `${side}-upper-joint`, `${side}-central-top`)
      segment(`${side}-facing-wire`, `${side}-central-top`, `${side}-central-bottom`)
      segment(`${side}-lower-shoulder`, `${side}-central-bottom`, `${side}-lower-joint`)
      segment(`${side}-initial-position`, `${side}-upper-joint`, `${side}-lower-joint`, false)
      wireObjects.push(`${side}-central-top`, `${side}-central-bottom`,
        `${side}-upper-shoulder`, `${side}-facing-wire`, `${side}-lower-shoulder`, `${side}-initial-position`)
      relationIds.push(`${side}-upper-shoulder-connects`, `${side}-facing-wire-connects`,
        `${side}-lower-shoulder-connects`, `${side}-initial-position-connects`)
      const from = [x, side === 'left' ? 500 : 405]
      const to = [x, side === 'left' ? 405 : 500]
      const arrowId = `${side}-current`
      add({ id: arrowId, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 5 })
      currents.push(arrowId)
      relationIds.push(
        assertion({ id: `${arrowId}-connects`, type: 'connects', arrow: arrowId, from, to }),
        assertion({ id: `${arrowId}-direction`, type: 'displacement', from, to, dx: 0, dy: side === 'left' ? -95 : 95 }),
        assertion({ id: `${arrowId}-on-facing-wire`, type: 'collinear', points: [`${side}-central-top`, `${side}-central-bottom`, from, to] }),
      )
      wireObjects.push(arrowId)
      text(`${arrowId}-role-label`, [side === 'left' ? 170 : 470, 455], 'I')
    }
    segment('upper-connector-left', 'left-upper-joint', [260, 640])
    segment('upper-connector-middle', [260, 640], [380, 640])
    segment('upper-connector-right', [380, 640], 'right-upper-joint')
    relationIds.push(
      assertion({ id: 'initial-positions-parallel', type: 'parallel', a: 'left-upper-joint', b: 'left-lower-joint', c: 'right-upper-joint', d: 'right-lower-joint' }),
      assertion({ id: 'facing-sections-parallel', type: 'parallel', a: 'left-central-top', b: 'left-central-bottom', c: 'right-central-top', d: 'right-central-bottom' }),
      assertion({ id: 'facing-sections-separated', type: 'displacement', from: 'left-central-top', to: 'right-central-top', dx: 220, dy: 0 }),
      assertion({ id: 'left-outward-displacement', type: 'displacement', from: 'left-upper-joint', to: 'left-central-top', dx: -50, dy: -60 }),
      assertion({ id: 'right-outward-displacement', type: 'displacement', from: 'right-upper-joint', to: 'right-central-top', dx: 50, dy: -60 }),
      assertion({ id: 'currents-parallel-opposite', type: 'parallel', a: [210, 500], b: [210, 405], c: [430, 405], d: [430, 500] }),
    )
  }
  assertion({ id: 'current-arrow-count', type: 'objectCount', objectType: 'arrow', count: id === 'fig-233' ? 0 : 2 })
  spec.source.inventory = [
    {
      id: `${id}-power-source`,
      description: 'Source fact: one perspective box below the wires and two separate source-connected leads. Prose identifies a generic power supply. Modern addition: plain labelled rectangle and regularized exposed terminal geometry; degraded top glyphs remain unknown in source-inventory.json.',
      objects: ['source-box', 'source-left-terminal', 'source-right-terminal', 'supply-label'],
      assertions: sourceAssertions, requires: ['pointRelationships'],
    },
    {
      id: `${id}-vertical-conductors`,
      description: inventory.facts.slice(0, id === 'fig-233' ? 2 : 4).join(' ') +
        ' Modern regularization uses exact line geometry; Figure234 only central facing sections are parallel, not whole displaced wires.',
      objects: wireObjects, assertions: relationIds, requires: ['pointRelationships'],
    },
    {
      id: `${id}-conductive-topology`,
      description: id === 'fig-233'
        ? 'Separate lower leads to opposite supply terminals; free upper ends remain unjoined. No current arrows. Connectivity assertions preserve every physical wire edge; whole-network open condition is also graph-checked in author assertions.'
        : 'Upper rectangular connector joins the wire ends; lower leads return to opposite supply terminals. All physical edges are connected; left current is downward and right upward. Dashed initial positions are comparison overlays excluded from the conductive graph.',
      objects: wires,
      assertions: [...wires.map(name => `${name}-connects`), 'current-arrow-count'],
    },
  ]
  write(path.join(directory, 'spec.json'), spec)
  write(path.join(directory, 'assets.json'), {
    mode: 'deterministic', semanticArtwork: [], generationCalls: 0,
    source: bind(original), sourceSnapshot, nativePNG: path.join(directory, `${id}.native.png`),
    note: 'Native PNG is a preview only; publishable mode contract remains SVG + render + review + spec. No manifest edited or promoted.',
  })
  write(path.join(directory, 'geometry.json'), {
    figure: id, source: bind(original), inventory,
    wires, references, currents,
    sourceTerminals: ['source-left-terminal', 'source-right-terminal'],
    expectedLabels: spec.objects.filter(object => object.type === 'text').map(object => object.text),
    expectedTopology: id === 'fig-233' ? 'open-two-components' : 'closed-one-external-path',
    displayBasis: 'Instructional fixed-scroll640. Current product native preview CSS sets scroll .figure-media width40em at font-size16px =640px, independent of mobile viewport.',
    sourceInventory: bind(path.join(own, 'source-inventory.json')),
  })
}
write(path.join(own, 'preparation.json'), {
  scope: 'Bounded modern FIGURE AUTHOR for fig-233 and fig-234 only; same invocation, no setup',
  bindings: { proseFreeze: bind(frozenProse), independentSCI: bind(science), chinese: bind(zhPath), english: bind(enPath) },
  sharedModernContextAbsent: true, privateRoot: nativeRoot, snapshots,
  independentSourceInventory: bind(path.join(own, 'source-inventory.json')),
  imageAccounting: { sourceOpens: 2, outputOpens: 0, plannedTotal: 4, maxBatch: 8, maxContext: 24, noSourceReopens: true },
  repairBudget: { perFigure: 1, attempts: ['initial', 'repair-1'], initialFailureMustBeRetained: true, secondFailure: 'HOLD' },
})
console.log('Prepared2 private contexts and source-bound deterministic FigureSpecs; source opens2/4 planned.')
