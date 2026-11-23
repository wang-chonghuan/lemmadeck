import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), root)
const own = path.dirname(fileURLToPath(import.meta.url))
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n34'
const edition = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'))
const write = (name, data) => {
  const file = path.join(own, name)
  assert(!fs.existsSync(file), `Preserve existing evidence: ${file}`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
}
const inventory = read(path.join(own, 'source.inventory.json'))
for (const binding of [
  inventory.authoritativeLesson, inventory.authoritativeExercises,
  ...inventory.figures.map(figure => figure.source),
]) assert.equal(hash(binding.path), binding.sha256)
const lesson = read(inventory.authoritativeLesson.path)
const exercises = read(inventory.authoritativeExercises.path)
assert(lesson.prose.find(block => block.source_refs?.includes('p0160#2')).text.includes('\u540c\u4e00\u5e73\u9762'))
const authoritativeText = [
  {
    lesson: lesson.id,
    text: `Full approved immutable lesson snapshot (${inventory.authoritativeLesson.sha256}):\n${JSON.stringify(lesson)}`,
  },
  {
    lesson: lesson.id,
    text: `Full supplied exercise and original given-text snapshot (${inventory.authoritativeExercises.sha256}):\n${JSON.stringify(exercises)}`,
  },
]
const text = (id, at, value, fontSize = 26) => ({
  id, type: 'text', at, text: value, fontSize, fontWeight: 400,
  labelColor: 'ink', labelPlacement: { position: 'CENTER' },
})
const base = (id, description, canvas, display) => ({
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
  description,
  source: {
    image: inventory.figures.find(figure => figure.id === id).source,
    authoritativeText, inventory: [],
  },
  canvas: { ...canvas, background: 'paper' },
  display: { ...display, purpose: 'instructional', minTextPx: 16 },
  objects: [], assertions: [], layout: { minLabelGap: 2 },
})

function tableSpec() {
  const spec = base(
    'tbl-p0160-01',
    'Relation-property table: preserve all five relation headers and all fifteen signs. Parallelism is inclusive (coincident or disjoint lines in one plane) under approved p0160#2, not the later student definition. Historical infinity-over-equals identity remains UNKNOWN; preserve stacked form, not congruence. English property labels and completed borders are modern typography/framing.',
    { width: 640, height: 400, boundingBox: [0, 400, 640, 0] },
    { layout: 'scroll', widths: [640] },
  )
  const propertyGrid = {
    id: 'src-table-property-grid', type: 'grid', bounds: [16, 376, 204, 24],
    xStep: 188, yStep: 88, xOffset: 16, yOffset: 24, stroke: 'ink', strokeWidth: 1.5,
  }
  const relationGrid = {
    id: 'src-table-relation-grid', type: 'grid', bounds: [204, 376, 624, 24],
    xStep: 84, yStep: 88, xOffset: 204, yOffset: 24, stroke: 'ink', strokeWidth: 1.5,
  }
  spec.objects.push(propertyGrid, relationGrid)
  spec.assertions.push(
    { id: 'src-table-property-dimensions', type: 'gridDimensions', grid: propertyGrid.id, columns: 1, rows: 4 },
    { id: 'src-table-relation-dimensions', type: 'gridDimensions', grid: relationGrid.id, columns: 5, rows: 4 },
  )
  spec.source.inventory.push({
    id: 'src-table-grid',
    description: 'Six columns including a wider row-label column; four rows including a blank upper-left header. Five horizontal rules and five internal vertical rules observed; complete outer vertical borders are modern framing.',
    objects: [propertyGrid.id, relationGrid.id],
    assertions: ['src-table-property-dimensions', 'src-table-relation-dimensions'],
    requires: ['gridDimensions'],
  })
  const headers = [
    text('src-header-parallel', [246, 332], '\u2225', 32),
    text('src-header-perpendicular', [330, 332], '\u22a5', 32),
    text('src-header-identity-upper', [414, 351], '\u221e', 28),
    text('src-header-identity-equals', [414, 313], '=', 28),
    text('src-header-less', [498, 332], '<', 32),
    text('src-header-less-equal', [582, 332], '\u2264', 32),
  ]
  spec.objects.push(...headers)
  spec.source.inventory.push({
    id: 'src-table-headers',
    description: 'Left-to-right: parallel, perpendicular, UNKNOWN historical infinity-over-equals, strict less-than, less-than-or-equal. No congruence replacement. Upper-left cell stays blank.',
    objects: headers.map(object => object.id), assertions: [],
  })
  const observedSigns = inventory.figures[0].observedStructure.signs
  for (const [rowIndex, row] of ['reflexive', 'symmetric', 'transitive'].entries()) {
    const y = 244 - rowIndex * 88
    const rowLabel = text(`src-row-${row}`, [110, y], row[0].toUpperCase() + row.slice(1), 22)
    spec.objects.push(rowLabel)
    const signIds = [], assertionIds = []
    for (const [column, sign] of observedSigns[row].entries()) {
      const id = `src-sign-${row}-c${column + 1}`
      const x = 246 + column * 84
      spec.objects.push(text(id, [x, y], sign))
      const container = `src-cell-${row}-c${column + 1}`
      spec.objects.push({
        id: container, type: 'polygon',
        points: [[x - 42, y + 44], [x + 42, y + 44], [x + 42, y - 44], [x - 42, y - 44]],
        stroke: 'paper', strokeWidth: 1, opacity: 0, fill: 'paper', fillOpacity: 0,
      })
      const assertion = `${container}-inside`
      spec.assertions.push({ id: assertion, type: 'inside', point: id, container })
      signIds.push(id)
      assertionIds.push(assertion)
    }
    spec.source.inventory.push({
      id: `src-table-${row}`,
      description: `Observed ${row} row, left-to-right signs ${observedSigns[row].join(' ')}. English row label replaces source Chinese label and dot leaders. Every sign is bound to its individual cell.`,
      objects: [rowLabel.id, ...signIds], assertions: assertionIds,
    })
  }
  return spec
}

function bundlesSpec() {
  const spec = base(
    'fig-213',
    'Two examples of parallel-line equivalence classes in one plane: upper rising bundle of four plain-ended lines and lower horizontal bundle of four. No source labels, points, units or angle values. Continuous clean strokes, exact parallelism, spacing and all internal endpoint coordinates are modern deterministic drawing parameters, never source measurements. No perpendicularity, equal-length, or exhaustive-two-class claim.',
    { width: 640, height: 608, boundingBox: [0, 608, 640, 0] },
    { layout: 'inline', maxWidthPx: 640, widths: [640, 358, 331] },
  )
  for (const bundle of ['upper', 'lower']) {
    const lines = []
    const assertions = []
    for (let i = 0; i < 4; i++) {
      const from = bundle === 'upper' ? [80 + i * 18, 420 - i * 42] : [28, 216 - i * 42]
      const to = bundle === 'upper' ? [540 + i * 18, 580 - i * 42] : [584, 216 - i * 42]
      const line = {
        id: `src-${bundle}-line-${i + 1}`, type: 'segment', from, to,
        stroke: 'ink', strokeWidth: 3,
      }
      lines.push(line)
      spec.objects.push(line)
      const direction = `src-${bundle}-line-${i + 1}-direction`
      spec.assertions.push({
        id: direction, type: 'displacement', from, to,
        dx: to[0] - from[0], dy: to[1] - from[1],
      })
      assertions.push(direction)
    }
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const id = `src-${bundle}-parallel-${i + 1}-${j + 1}`
      spec.assertions.push({
        id, type: 'parallel',
        a: lines[i].from, b: lines[i].to, c: lines[j].from, d: lines[j].to,
      })
      assertions.push(id)
    }
    spec.source.inventory.push({
      id: `src-${bundle}-bundle`,
      description: bundle === 'upper'
        ? 'Source upper subfigure: four rising parallel strokes, plain ends staggered right in top-to-bottom order. No labels or dots. All six pairwise parallel facts checked.'
        : 'Source lower subfigure: four nearly horizontal parallel strokes, plain ends, top-to-bottom order below a blank separating gap. No labels or dots. All six pairwise parallel facts checked.',
      objects: lines.map(line => line.id), assertions,
    })
  }
  return spec
}

const specs = [tableSpec(), bundlesSpec()]
for (const spec of specs) write(`${spec.id}.spec.json`, spec)
const executions = []
for (const spec of specs) {
  const specFile = path.join(own, `${spec.id}.spec.json`)
  for (const [stage, command, argv] of [
    ['validate', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', specFile, '--stage', 'draft', '--json']],
    ['render', 'node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', specFile, '--svg', path.join(own, `${spec.id}.svg`), '--report', path.join(own, `${spec.id}.native-render.json`)]],
  ]) {
    const result = spawnSync(command, argv, { cwd: root, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
    const execution = { figure: spec.id, stage, cwd: root, command, argv, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
    executions.push(execution)
    write('execution.json', executions)
    if (result.status !== 0) {
      console.error(JSON.stringify(execution, null, 2))
      process.exit(1)
    }
    // Keep one cumulative record, while never overwriting an existing prior invocation.
    if (spec !== specs.at(-1) || stage !== 'render') fs.unlinkSync(path.join(own, 'execution.json'))
  }
  const native = read(path.join(own, `${spec.id}.native-render.json`))
  assert.equal(native.status, 'pass')
  const durable = structuredClone(native)
  durable.spec.path = `${edition}/${spec.id}.spec.json`
  durable.output.svg.path = `${edition}/${spec.id}.svg`
  write(`${spec.id}.render.json`, durable)
}
console.log(JSON.stringify({
  status: 'author-candidates-rendered',
  figures: specs.map(spec => ({ id: spec.id, spec: path.join(own, `${spec.id}.spec.json`), assertions: spec.assertions.length })),
  nativeExecutions: executions.length,
  metadataRebinding: 'Only native report spec/output paths changed to declared eventual durable edition paths; SVG bytes not edited. Original native reports retained.',
}, null, 2))
