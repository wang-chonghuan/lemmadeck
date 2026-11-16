import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const base = '.tmp/s10y-image/batch007/10c'
const edition = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n80'
const inventory = '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n80-figure-author-source-inventory.md'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const expected = {
  [inventory]: 'e86b4c45e23b06655172e2e2f36c19e740a876fa245c1fdf89c7b6a9cde3d3c9',
  [`${edition}/lesson.json`]: '4fe86dbb51c4668aa69e60a229941318ac26500ff5dddde4b81e2d4b146f6d39',
  [`${edition}/exercises.json`]: '8a35b97edf24c8111f54c22ae5ec80b8a9d6dc516f19a2c84e86903e4b9db387',
  [`${base}/fig-10/context.json`]: '6b9be372f2841274913accc57898dcc274a2764c681f868e8ec5675831f80bbf',
  [`${base}/fig-11/context.json`]: 'bfe8af57730d8cc520c809f0ce39c63694bc66f45866aaed75ea955ed8fb4f92',
  'ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-10.png': 'f51e919518420811f91d74e077f174442ec2acdb35346a21914f7a96329b91ef',
  'ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-11.png': '4d30e4fe5c3590cc51cc90dace7b72e43a0ccfd23bfd56c6d50805c0b7aa135a',
}
for (const [file, sha256] of Object.entries(expected)) assert.equal(hash(file), sha256, file)
const lesson = JSON.parse(fs.readFileSync(`${edition}/lesson.json`, 'utf8'))
const exercises = JSON.parse(fs.readFileSync(`${edition}/exercises.json`, 'utf8'))
assert.equal(lesson.status, 'draft')
assert.equal(exercises.status, 'draft')
assert.equal(exercises.exercises.length, 8)
const authoritativeText = [
  ...lesson.prose.filter(item => item.text?.trim()).map(item => ({
    lesson: lesson.id, text: item.text,
  })),
  ...exercises.exercises.map(item => ({
    lesson: lesson.id, exercise: item.number, text: item.text,
  })),
]

function makeSpec(number, centerX) {
  const prefix = `f${number}`
  const objects = []
  const assertions = []
  const groups = []
  const id = suffix => `${prefix}-${suffix}`
  const segment = (suffix, from, to, strokeWidth = 3) => {
    objects.push({ id: id(suffix), type: 'segment', from, to, stroke: 'ink', strokeWidth })
    return id(suffix)
  }
  const relation = (suffix, type, fields) => {
    assertions.push({ id: id(`rel-${suffix}`), type, ...fields })
    return id(`rel-${suffix}`)
  }
  const group = (suffix, description, members, relations) => {
    groups.push({ id: id(`inventory-${suffix}`), description, objects: members, assertions: relations })
  }
  const wallY = 278
  const radius = 23
  const axisY = 94
  const center = [centerX, wallY]
  const leftContact = [centerX - radius, wallY]
  const rightContact = [centerX + radius, wallY]
  for (const [side, x, direction] of [['left', 44, -1], ['right', 596, 1]]) {
    const members = [
      segment(`${side}-support-face`, [x, 244], [x, 324], 4),
      segment(`${side}-support-caps-top`, [x, 324], [x + direction * 24, 324], 4),
      segment(`${side}-support-caps-bottom`, [x, 244], [x + direction * 24, 244], 4),
    ]
    for (let index = 0; index < 6; index += 1) {
      const y = 250 + index * 12
      members.push(segment(`${side}-support-hatching-${index}`, [x, y], [x + direction * 20, y + 10], 2))
    }
    const contact = [x, wallY]
    const rel = relation(`${side}-support-contact-on-face`, 'pointOnLine', {
      point: contact, a: [x, 244], b: [x, 324],
    })
    group(`${side}-support`, 'Source fixed support: vertical inner face, two outward caps and exterior hatching. Clean identical outlines and hatch spacing are unmeasured schematic regularization, not source dimensions.', members, [rel])
  }

  // Each continuous coil shares its literal endpoints with the two rendered leads.
  const springJoinChecks = []
  for (const [side, start, end, wallContact, ballContact] of [
    ['left', [65, 267], [centerX - 47, 267], [44, wallY], leftContact],
    ['right', [centerX + 47, 267], [575, 267], [596, wallY], rightContact],
  ]) {
    const pitch = (end[0] - start[0]) / 7
    const screenY = 360 - start[1]
    const chunks = [`M ${start[0]} ${screenY}`]
    const fmt = value => Number(value.toFixed(6))
    for (let index = 0; index < 7; index += 1) {
      const x = start[0] + index * pitch
      chunks.push(`C ${fmt(x - pitch * 0.12)} ${screenY - 45} ${fmt(x + pitch * 0.37)} ${screenY - 59} ${fmt(x + pitch * 0.50)} ${screenY - 28}`)
      chunks.push(`C ${fmt(x + pitch * 0.72)} ${screenY + 12} ${fmt(x + pitch * 0.88)} ${screenY + 9} ${fmt(x + pitch)} ${screenY}`)
    }
    objects.push({ id: id(`${side}-spring`), type: 'svgPath', d: chunks.join(' '), stroke: 'ink', strokeWidth: 3, fill: 'none' })
    const wallLead = side === 'left'
      ? segment('left-wall-lead', wallContact, start)
      : segment('right-wall-lead', end, wallContact)
    const ballLead = side === 'left'
      ? segment('left-ball-lead', end, ballContact)
      : segment('right-ball-lead', ballContact, start)
    const rels = [
      relation(`${side}-wall-contact`, 'connects', {
        arrow: wallLead, from: side === 'left' ? wallContact : end, to: side === 'left' ? start : wallContact,
      }),
      relation(`${side}-ball-contact`, 'connects', {
        arrow: ballLead, from: side === 'left' ? end : ballContact, to: side === 'left' ? ballContact : start,
      }),
      relation(`${side}-ball-boundary`, 'pointOnCircle', { point: ballContact, center, radius }),
    ]
    group(`${side}-spring`, 'Source continuous horizontal spring joins its fixed support to the only ball. Smooth seven-loop notation, level construction and exact side contacts are unmeasured schematic regularization; loop count and lengths are not source givens. svgPath joins are separately checked in the author probe, not claimed as connects assertions.', [id(`${side}-spring`), wallLead, ballLead, id('ball')], rels)
    springJoinChecks.push({
      path: id(`${side}-spring`),
      startScreen: [start[0], 360 - start[1]],
      endScreen: [end[0], 360 - end[1]],
      wallLead,
      ballLead,
    })
  }
  objects.push({ id: id('ball'), type: 'circle', center, radius, stroke: 'ink', strokeWidth: 3, fill: 'ink', fillOpacity: 1 })
  group('single-ball', 'Source has exactly one dark round ball; no visible center dot, second equilibrium ball, hook, force arrow or mass label. Ideal circle radius is a drawing parameter only.', [id('ball')], [
    relation('single-ball', 'objectCount', { objectType: 'circle', count: 1 }),
    id('rel-left-ball-boundary'), id('rel-right-ball-boundary'),
  ])
  objects.push({ id: id('position-axis'), type: 'arrow', from: [32, axisY], to: [608, axisY], stroke: 'ink', strokeWidth: 3 })
  objects.push({ id: id('axis-x-label'), type: 'text', at: [608, 59], text: 'x', fontSize: 26, fontWeight: 500, labelPlacement: { position: 'CENTER' } })
  group('position-axis', 'Source long horizontal axis has a right arrowhead and terminal axis-name x, separately retained from any position-value x. No automatic ticks or other axes.', [id('position-axis'), id('axis-x-label')], [
    relation('axis-right-arrow', 'connects', { arrow: id('position-axis'), from: [32, axisY], to: [608, axisY] }),
    relation('axis-horizontal', 'displacement', { from: [32, axisY], to: [608, axisY], dx: 576, dy: 0 }),
    relation('only-axis-arrow', 'objectCount', { objectType: 'arrow', count: 1 }),
  ])
  const markerTopY = 198
  const marker = segment('equilibrium-marker', [320, axisY], [320, markerTopY])
  objects.push({ id: id('equilibrium-label'), type: 'text', at: [320, 59], text: '0', fontSize: 26, fontWeight: 500, labelPlacement: { position: 'CENTER' } })
  const equilibriumRelations = [
    relation('reference-on-axis', 'pointOnLine', { point: [320, axisY], a: [32, axisY], b: [608, axisY] }),
    relation('reference-perpendicular', 'perpendicular', { a: [320, axisY], b: [320, markerTopY], c: [32, axisY], d: [608, axisY] }),
    relation('reference-unarrowed', 'connects', { arrow: marker, from: [320, axisY], to: [320, markerTopY] }),
  ]
  if (number === 10) equilibriumRelations.push(relation('equilibrium-alignment', 'collinear', {
    a: [320, axisY], b: [320, markerTopY], c: center,
  }))
  group('equilibrium-reference', 'Source upward, unarrowed vertical reference marker stays below the apparatus with a white gap. Its original hollow 0/O-like glyph is NOT decoded. Modern numeral 0 is explicitly text-derived from the approved sentence that equilibrium center coordinate x equals zero. Exact vertical projection is unmeasured schematic regularization.', [marker, id('equilibrium-label')], equilibriumRelations)
  if (number === 11) {
    const currentMarker = segment('displacement-marker', [centerX, axisY], [centerX, markerTopY])
    objects.push({ id: id('displacement-x-label'), type: 'text', at: [centerX, 59], text: 'x', fontSize: 26, fontWeight: 500, labelPlacement: { position: 'CENTER' } })
    group('current-reference', 'Source second unarrowed vertical marker lies right of equilibrium, approximately under the current ball, with its own position-value x. It is distinct from both equilibrium 0 and terminal axis x; exact alignment and positive example spacing are unmeasured schematic regularization, not a restriction to positive motion.', [currentMarker, id('displacement-x-label'), id('ball')], [
      relation('current-on-axis', 'pointOnLine', { point: [centerX, axisY], a: [32, axisY], b: [608, axisY] }),
      relation('current-perpendicular', 'perpendicular', { a: [centerX, axisY], b: [centerX, markerTopY], c: [32, axisY], d: [608, axisY] }),
      relation('current-unarrowed', 'connects', { arrow: currentMarker, from: [centerX, axisY], to: [centerX, markerTopY] }),
      relation('current-alignment', 'collinear', { a: [centerX, axisY], b: [centerX, markerTopY], c: center }),
      relation('separate-reference-markers', 'displacement', { from: [320, axisY], to: [centerX, axisY], dx: centerX - 320, dy: 0 }),
    ])
  }
  const context = JSON.parse(fs.readFileSync(`${base}/fig-${number}/context.json`, 'utf8'))
  return {
    spec: {
      schema: 'ld-s10y-image/figure-spec@2',
      id: `fig-${number}`,
      mode: 'deterministic',
      description: number === 10
        ? 'Instructional equilibrium apparatus with two fixed supports, two attached springs, one ball, one unarrowed position reference and a rightward x axis. All coordinates are unmeasured schematic regularization. Modern 0 is text-derived, not a source O/0 decoding.'
        : 'Instructional displaced apparatus with two fixed supports, longer left and shorter right attached springs, one right-shifted ball, two unarrowed position references and a rightward x axis. Equilibrium 0, current x and axis x remain distinct. All coordinates are unmeasured schematic regularization; modern 0 is text-derived, not a source O/0 decoding.',
      source: { image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 }, authoritativeText, inventory: groups },
      canvas: { width: 640, height: 360, boundingBox: [0, 360, 640, 0], background: 'paper', keepAspectRatio: true },
      display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
      objects,
      assertions,
      layout: { minLabelGap: 10 },
    },
    springJoinChecks,
  }
}

for (const [number, centerX] of [[10, 320], [11, 418]]) {
  const dir = `${base}/fig-${number}`
  for (const file of ['spec.json', 'author-inputs.json']) assert.equal(fs.existsSync(`${dir}/${file}`), false, `${file} already exists`)
  const { spec, springJoinChecks } = makeSpec(number, centerX)
  fs.writeFileSync(`${dir}/spec.json`, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
  fs.writeFileSync(`${dir}/author-inputs.json`, `${JSON.stringify({
    schema: 'n80/figure-author-inputs@1', role: 'author-only',
    cwd: root, inputs: expected, sourceReopenedInFreshBatch: 1,
    coordinates: 'Unmeasured schematic regularization; no force, equation, dimension or answer annotation.',
    notation: 'Modern 0 is derived only from approved equilibrium x equals zero prose, not source O/0 decoding.',
    source55: 'Parse HOLD unchanged; no formula edits.',
    springJoinChecks,
    spec: { path: `${dir}/spec.json`, sha256: hash(`${dir}/spec.json`) },
  }, null, 2)}\n`, { flag: 'wx' })
  console.log(`${spec.id}: authored ${spec.objects.length} objects, ${spec.assertions.length} assertions; ${hash(`${dir}/spec.json`)}`)
}
