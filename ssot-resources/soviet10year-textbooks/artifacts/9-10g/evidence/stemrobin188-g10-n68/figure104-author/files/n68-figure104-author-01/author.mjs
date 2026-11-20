import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from '../retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n68-figure104-author-01')
const observationPath = path.join(output, 'source-observation-FIRST.json')
const action = process.argv[2]
const specPath = path.join(output, 'fig-g10-104.spec.json')
const raw = path.join(tmp, 'g10-n68/artifacts/9-10g')
const original = path.join(raw, 'figures/fig-g10-104.png')
function run(name, command, args) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024 })
  save(path.join(output, `${name}.command.json`), {
    command, args, cwd: repo, exitCode: result.status, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message,
    authorOnly: true, published: false,
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  console.log(result.stdout)
}
if (action === 'author') {
  assert.equal(read(observationPath).parentImagesAfterSource, 17)
  assert.equal(hash(original), 'ee54a3ddb1c9eaace5b93b958f4162f1d5882c5b9c14dd912d062f9f794cc692')
  fs.chmodSync(observationPath, 0o444)
  const inputs = [original, observationPath, path.join(raw, 'lessons/geo910-c2-s3-n68/lesson.json'),
    path.join(tmp, 'g10-n68/source-admission.json')]
  save(path.join(output, 'inputs-before.json'), { bindings: inputs.map(bind) })
  const O = [320, 120], A = [520, 120], B = [120, 120]
  const objects = []
  const assertions = []
  const hatchIds = []
  for (let c = -180; c <= 276; c += 24) {
    const discriminant = Math.sqrt(2 * 200 ** 2 - c ** 2)
    const left = (c - discriminant) / 2
    const right = Math.min((c + discriminant) / 2, c)
    if (right <= left) continue
    const from = [320 + left, 120 + c - left]
    const to = [320 + right, 120 + c - right]
    for (const endpoint of [from, to]) {
      assert.ok(endpoint[1] >= 120 - 1e-9)
      assert.ok((endpoint[0] - 320) ** 2 + (endpoint[1] - 120) ** 2 <= 200 ** 2 + 1e-7)
    }
    const id = `104-hatch-${String(hatchIds.length + 1).padStart(2, '0')}`
    hatchIds.push(id)
    objects.push({ id, type: 'segment', from, to, stroke: 'muted', strokeWidth: 1.6 })
    assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
  }
  const segment = (id, from, to, type = 'segment') => ({
    id, type, from, to, stroke: 'ink', strokeWidth: 3,
  })
  const arrows = [
    segment('104-i-direction', O, [420, 120], 'arrow'),
    segment('104-j-direction', O, [320, 240], 'arrow'),
  ]
  const point = (id, at, label, extra = {}) => ({
    id, type: 'point', at, label, visible: false, fontSize: 36,
    fontWeight: 500, labelColor: 'ink', ...extra,
  })
  const text = (id, at, content) => ({
    id, type: 'text', at, text: content, fontSize: 36, fontWeight: 500,
    labelColor: 'ink', labelPlacement: { position: 'CENTER' },
  })
  objects.push(
    point('104-O', O, 'O', { visible: true, size: 3, fill: 'ink', stroke: 'ink',
      labelPlacement: { position: 'SW', gap: 20 } }),
    point('104-A', A, 'A', { labelPlacement: { position: 'NE', gap: 18 } }),
    point('104-B', B, 'B', { labelPlacement: { position: 'NW', gap: 18 } }),
    { id: '104-upper-semicircle', type: 'arc', center: '104-O',
      start: '104-A', end: '104-B', stroke: 'ink', strokeWidth: 3 },
    segment('104-x-axis', [65, 120], [605, 120]),
    segment('104-y-axis', [320, 55], [320, 372]),
    ...arrows,
    text('104-B-coordinate', [115, 36], '(-R,0)'),
    text('104-A-coordinate', [530, 36], '(R,0)'),
    text('104-x-label', [585, 80], 'x'),
    text('104-y-label', [280, 358], 'y'),
    text('104-i-label', [385, 77], 'i\u20d7'),
    text('104-j-label', [272, 220], 'j\u20d7'),
  )
  const frameAssertions = [
    { id: '104-diameter-collinear', type: 'collinear', a: '104-B', b: '104-O', c: '104-A' },
    { id: '104-opposite-radii', type: 'equalDistance',
      a: '104-O', b: '104-B', c: '104-O', d: '104-A' },
    { id: '104-A-on-circle', type: 'pointOnCircle', point: '104-A', center: '104-O', radius: 200 },
    { id: '104-B-on-circle', type: 'pointOnCircle', point: '104-B', center: '104-O', radius: 200 },
    { id: '104-B-to-O', type: 'displacement', from: '104-B', to: '104-O', dx: 200, dy: 0 },
    { id: '104-O-to-A', type: 'displacement', from: '104-O', to: '104-A', dx: 200, dy: 0 },
    { id: '104-axes-perpendicular', type: 'perpendicular',
      a: [65, 120], b: [605, 120], c: [320, 55], d: [320, 372] },
    ...arrows.map(arrow => ({ id: `${arrow.id}-connects`, type: 'connects',
      arrow: arrow.id, from: arrow.from, to: arrow.to })),
  ]
  assertions.push(...frameAssertions)
  const lesson = read(inputs[2])
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: 'fig-g10-104', mode: 'deterministic',
    description: 'A source-faithful upper semicircle and hatched half-disk in one rectangular coordinate frame, used as the generating region in the sphere-volume proof. Radius is schematic; no answer or additional given data.',
    source: {
      image: bind(original),
      authoritativeText: [{ lesson: lesson.id, text: lesson.printed_title },
        ...lesson.prose.filter(item => item.text).map(item => ({ lesson: lesson.id, text: item.text }))],
      inventory: [
        { id: '104-semicircle-and-frame',
          description: read(observationPath).facts.slice(0, 6).join(' ')
            + ' Comma tuple notation and explicit i/j arrow accents are modern role bindings, not exact source-glyph PASS. Exact radius and regular spacing are schematic author regularization.',
          objects: ['104-O', '104-A', '104-B', '104-upper-semicircle', '104-x-axis', '104-y-axis',
            ...arrows.map(item => item.id), '104-B-coordinate', '104-A-coordinate',
            '104-x-label', '104-y-label', '104-i-label', '104-j-label'],
          assertions: frameAssertions.map(item => item.id), requires: ['pointRelationships'] },
        { id: '104-upper-half-disk-hatching',
          description: 'Down-right hatching fills only the closed upper half-disk. Intersections are solved exactly against the circle and baseline; regular spacing is not a source grid count.',
          objects: hatchIds, assertions: hatchIds.map(id => `${id}-connects`) },
      ],
    },
    canvas: { width: 640, height: 400, boundingBox: [0, 400, 640, 0],
      background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 480,
      widths: [480, 300], minTextPx: 16 },
    objects, assertions, layout: { minLabelGap: 4 },
  }
  save(path.join(output, 'fig-g10-104.spec-FIRST.json'), spec)
  fs.chmodSync(path.join(output, 'fig-g10-104.spec-FIRST.json'), 0o444)
  save(specPath, spec)
  save(path.join(output, 'draft-authoring.json'), {
    status: 'author-only-not-reviewed', spec: bind(specPath), observation: bind(observationPath),
    inputTextIsAdmittedRawProofPendingModernTextAuthor: true, hatchCount: hatchIds.length,
    hatchEndpointsCheckedAnalytically: true, parentImageLoads: 17,
    contentRepairsUsed: 0, glyphHoldsPreserved: true, published: false,
  })
} else if (action === 'validate') {
  run('draft-validate-FIRST', path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    ['-B', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', specPath, '--stage', 'draft', '--json'])
} else if (action === 'render') {
  assert.equal(read(path.join(output, 'draft-validate-FIRST.command.json')).exitCode, 0)
  run('render-FIRST', 'node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', specPath, '--svg', path.join(output, 'fig-g10-104.svg'),
    '--report', path.join(output, 'fig-g10-104.render.json')])
} else {
  assert.fail(action)
}
