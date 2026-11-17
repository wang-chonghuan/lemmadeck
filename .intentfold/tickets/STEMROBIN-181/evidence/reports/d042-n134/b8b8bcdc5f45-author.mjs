import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const G = path.dirname(fileURLToPath(import.meta.url))
const OLD = path.join(path.dirname(G), 'author-freeze.json')
const R = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d042-9p-n134-text-repair`
const CARD = 'phy9-c2-s7-n134'
const SOURCE = `${W}/ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-302.png`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: file, sha256: sha(file) })
function writable(file) {
  assert(path.resolve(file).startsWith(`${G}/`), `Outside graph ownership: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  return file
}
function write(file, value) {
  assert(!fs.existsSync(file), `Retain existing attempt: ${file}`)
  fs.writeFileSync(writable(file), `${JSON.stringify(value, null, 2)}\n`)
}
function receipt(name, command, args, cwd = G) {
  const result = spawnSync(command, args, {
    cwd, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  write(`${G}/receipts/${name}.json`, {
    command, args, cwd, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  })
  assert.equal(result.status, 0, `${name}: ${result.stdout}\n${result.stderr}`)
}
assert.equal(sha(OLD), 'dbd3ac744e664cd90369852e2754767ca3fe1a7ebc8240e623013a92e1959d57')
assert.equal(sha(SOURCE), '7538bee19004dc7a30ffff84a9eb7c4c1c4e8cf50ef0b4902963408fe94e3592')
assert.equal(sha(`${R}/repair-freeze.json`), '9da166b8de42e7c673f219fae54a6a77ee4546536932838b7580bf31e07b3aef')
const repairFreeze = read(`${R}/repair-freeze.json`)
for (const language of repairFreeze.languages) {
  for (const item of [...language.templates, language.normalizedText, language.markdown]) {
    assert.equal(sha(item.path), item.sha256, `Changed repair input: ${item.path}`)
  }
}

if (process.argv[2] === 'render') {
  const objects = []
  const assertions = []
  const points = new Map()
  const named = new Map([
    ['source-o', [0, 0]], ['source-a', [4.6, 3]], ['source-a-prime', [-4.6, -3]],
    ['source-b', [0, 2.3]], ['source-b-prime', [0, -2.3]],
    ['source-c', [-1, 0]], ['source-c-prime', [1, 0]],
  ])
  const rounded = values => values.map(value => Number(value.toFixed(9)))
  function point(id, at, sourceNamed = false) {
    if (points.has(id)) {
      assert.deepEqual(points.get(id), rounded(at))
      return id
    }
    points.set(id, rounded(at))
    objects.push({
      id, type: 'point', at: rounded(at), visible: sourceNamed,
      size: 0.1, strokeWidth: 0.5, stroke: 'ink', fill: 'ink',
    })
    return id
  }
  for (const [id, at] of named) point(id, at, true)
  function edge(id, from, to, type = 'segment', strokeWidth = 3.5) {
    objects.push({ id, type, from, to, stroke: 'ink', strokeWidth })
    if (type === 'segment' || type === 'arrow') {
      assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
    }
    return id
  }
  function displacement(id, from, to) {
    const [a, b] = [points.get(from), points.get(to)]
    assertions.push({ id, type: 'displacement', from, to,
      dx: rounded([b[0] - a[0]])[0], dy: rounded([b[1] - a[1]])[0] })
    return id
  }
  point('axis-x-start', [-3.4, 0])
  point('axis-x-end', [3.4, 0])
  point('axis-y-start', [0, -3.7])
  point('axis-y-end', [0, 3.9])
  edge('source-horizontal-axis', 'axis-x-start', 'axis-x-end', 'axis', 3)
  edge('source-vertical-axis', 'axis-y-start', 'axis-y-end', 'arrow', 3)
  assertions.push(
    { id: 'source-c-o-c-prime-collinear', type: 'collinear',
      a: 'source-c', b: 'source-o', c: 'source-c-prime' },
    { id: 'source-b-o-b-prime-collinear', type: 'collinear',
      a: 'source-b', b: 'source-o', c: 'source-b-prime' },
    { id: 'source-axes-perpendicular', type: 'perpendicular',
      a: 'source-c', b: 'source-c-prime', c: 'source-b', d: 'source-b-prime' },
  )
  const namedPairs = [
    { a: 'source-a', b: 'source-a-prime' },
    { a: 'source-b', b: 'source-b-prime' },
    { a: 'source-c', b: 'source-c-prime' },
  ]
  assertions.push({
    id: 'source-named-states-central-symmetry', type: 'centralSymmetry',
    center: 'source-o', pairs: namedPairs,
  })
  const stateRelations = [
    displacement('source-o-to-a-positive-saturation', 'source-o', 'source-a'),
    displacement('source-a-to-b-field-reduction', 'source-a', 'source-b'),
    displacement('source-b-to-c-reverse-demagnetizing-field', 'source-b', 'source-c'),
    displacement('source-c-to-a-prime-reverse-saturation', 'source-c', 'source-a-prime'),
    displacement('source-a-prime-to-b-prime-field-removal', 'source-a-prime', 'source-b-prime'),
    displacement('source-b-prime-to-c-prime-forward-demagnetizing-field', 'source-b-prime', 'source-c-prime'),
    displacement('source-c-prime-to-a-forward-saturation', 'source-c-prime', 'source-a'),
  ]

  // Sample explicit schematic controls into native segments; every loop vertex has an opposite.
  function bezier(control, t) {
    const s = 1 - t
    return rounded([0, 1].map(axis => s ** 3 * control[0][axis]
      + 3 * s ** 2 * t * control[1][axis] + 3 * s * t ** 2 * control[2][axis]
      + t ** 3 * control[3][axis]))
  }
  const controls = [
    [[4.6, 3], [3.5, 3], [1, 2.65], [0, 2.3]],
    [[0, 2.3], [-0.8, 2.08], [-1, 1.15], [-1, 0]],
    [[-1, 0], [-1, -2.4], [-3.1, -3], [-4.6, -3]],
  ]
  const upper = []
  for (let span = 0; span < controls.length; span += 1) {
    for (let step = span ? 1 : 0; step <= 16; step += 1) {
      const index = span * 16 + step
      const id = ({ 0: 'source-a', 16: 'source-b', 32: 'source-c', 48: 'source-a-prime' })[index]
        ?? `loop-upper-vertex-${index}`
      point(id, bezier(controls[span], step / 16), named.has(id))
      upper.push(id)
    }
  }
  const lower = upper.map((id, index) => {
    const opposite = ({ 0: 'source-a-prime', 16: 'source-b-prime',
      32: 'source-c-prime', 48: 'source-a' })[index] ?? `loop-lower-vertex-${index}`
    point(opposite, points.get(id).map(value => -value), named.has(opposite))
    return opposite
  })
  assertions.push({
    id: 'loop-every-defining-vertex-central-symmetry', type: 'centralSymmetry',
    center: 'source-o', pairs: upper.map((id, index) => ({ a: id, b: lower[index] })),
  })
  const upperEdges = upper.slice(1).map((id, index) =>
    edge(`source-upper-branch-${index}`, upper[index], id))
  const lowerEdges = lower.slice(1).map((id, index) =>
    edge(`source-lower-branch-${index}`, lower[index], id))
  const initialControls = [
    [[0, 0], [0.4, 0.9], [0.9, 2.1], [1.8, 2.55]],
    [[1.8, 2.55], [2.6, 2.95], [3.7, 3], [4.6, 3]],
  ]
  const initial = []
  for (let span = 0; span < initialControls.length; span += 1) {
    for (let step = span ? 1 : 0; step <= 16; step += 1) {
      const index = span * 16 + step
      const id = index === 0 ? 'source-o' : index === 32 ? 'source-a'
        : `initial-vertex-${index}`
      point(id, bezier(initialControls[span], step / 16), named.has(id))
      initial.push(id)
    }
  }
  const initialEdges = initial.slice(1).map((id, index) =>
    edge(`source-initial-branch-${index}`, initial[index], id))
  const arrowDefinitions = [
    ['source-upper-leftward-arrow', upper, 8, 11],
    ['source-left-downward-arrow', upper, 24, 29],
    ['source-lower-rightward-arrow', lower, 8, 11],
    ['source-right-upward-arrow', lower, 24, 29],
    ['source-initial-upward-rightward-arrow', initial, 4, 8],
  ]
  for (const [id, sequence, from, to] of arrowDefinitions) {
    edge(id, sequence[from], sequence[to], 'arrow', 3.5)
    displacement(`${id}-direction`, sequence[from], sequence[to])
  }
  const labels = [
    ['source-I-label', 'I', [-0.55, 4.15], 40],
    ['source-B-label', 'B', [3.6, -0.8], 40],
    ['source-B-subscript-zero', '0', [4.28, -1.1], 34],
    ['source-o-label', 'o', [-0.5, -0.65], 34],
    ['source-a-label', 'a', [4.4, 2.15], 34],
    ['source-a-prime-label', 'a\u2032', [-4.75, -3.65], 34],
    ['source-b-label', 'b', [-0.6, 2.95], 34],
    ['source-b-prime-label', 'b\u2032', [0.6, -2.8], 34],
    ['source-c-label', 'c', [-1.5, 0.65], 34],
    ['source-c-prime-label', 'c\u2032', [1.65, -0.6], 34],
  ]
  for (const [id, text, at, fontSize] of labels) {
    objects.push({ id, type: 'text', text, at, fontSize, fontWeight: 400,
      labelColor: 'ink', labelPlacement: { position: 'CENTER' } })
  }
  assertions.push({ id: 'source-symbols-count', type: 'objectCount', objectType: 'text', count: 10 })
  const assertionIds = edges => edges.map(id => `${id}-connects`)
  const inventory = [
    {
      id: 'source-302-shared-frame-and-all-named-states',
      description: 'Previously opened original pixels: one shared I-versus-B_0 frame, origin o, positive/negative saturation a/a-prime, nonzero remanence b/b-prime on the vertical axis, and coercive crossings c/c-prime on the horizontal axis. Horizontal axis has no arrowhead; vertical axis has one upward arrowhead. No numeric ticks, units, grid, portrait or additional subfigures. Subpixel native point anchors lie within existing curve/axis strokes and add no visible location dots.',
      objects: [...named.keys(), 'source-horizontal-axis', 'source-vertical-axis',
        ...labels.map(item => item[0])],
      assertions: ['source-c-o-c-prime-collinear', 'source-b-o-b-prime-collinear',
        'source-axes-perpendicular', 'source-named-states-central-symmetry',
        'source-vertical-axis-connects', 'source-symbols-count', ...stateRelations],
      requires: ['pointRelationships'],
    },
    {
      id: 'source-302-decreasing-field-branch',
      description: 'Source upper/left branch proceeds from a through b at B_0=0, then c at I=0 and negative B_0, to a-prime. The upper arrow points left; the left steep-branch arrow points down. Preserve these states and order in the common frame. Smooth sampled controls and their uncalibrated coordinates are modern schematic regularization, not source measurements.',
      objects: ['source-a', 'source-b', 'source-c', 'source-a-prime', ...upperEdges,
        'source-upper-leftward-arrow', 'source-left-downward-arrow'],
      assertions: [...assertionIds(upperEdges), ...stateRelations.slice(1, 4),
        'source-upper-leftward-arrow-connects', 'source-left-downward-arrow-connects',
        'source-upper-leftward-arrow-direction', 'source-left-downward-arrow-direction'],
      requires: ['pointRelationships'],
    },
    {
      id: 'source-302-increasing-field-return-branch',
      description: 'Source lower/right branch proceeds from a-prime through b-prime at B_0=0, then c-prime at I=0 and positive B_0, and returns to a. The bottom arrow points right; the right steep-branch arrow points up. Return branch remains distinct from the initial magnetization branch.',
      objects: ['source-a-prime', 'source-b-prime', 'source-c-prime', 'source-a', ...lowerEdges,
        'source-lower-rightward-arrow', 'source-right-upward-arrow'],
      assertions: [...assertionIds(lowerEdges), ...stateRelations.slice(4),
        'source-lower-rightward-arrow-connects', 'source-right-upward-arrow-connects',
        'source-lower-rightward-arrow-direction', 'source-right-upward-arrow-direction'],
      requires: ['pointRelationships'],
    },
    {
      id: 'source-302-initial-magnetization-branch',
      description: 'One separate initial branch begins at o, increases up/right, and approaches the common positive saturation a. Its source arrow points up/right. It is not a third closed loop, continuation into the negative quadrant, or retraced remanence branch.',
      objects: ['source-o', 'source-a', ...initialEdges, 'source-initial-upward-rightward-arrow'],
      assertions: [...assertionIds(initialEdges), stateRelations[0],
        'source-initial-upward-rightward-arrow-connects',
        'source-initial-upward-rightward-arrow-direction'],
      requires: ['pointRelationships'],
    },
    {
      id: 'source-302-ideal-loop-symmetry',
      description: 'The source depicts opposing saturation/axis-crossing states and the current bilingual text explicitly describes an ideal loop symmetric about o. Modern regularization makes every defining loop vertex exactly centrally symmetric while retaining distinct initial magnetization. No opaque SVG path is used for the claimed symmetric loop.',
      objects: [...named.keys(), ...upperEdges, ...lowerEdges],
      assertions: ['source-named-states-central-symmetry', 'loop-every-defining-vertex-central-symmetry'],
      requires: ['pointRelationships'],
    },
  ]
  const authoritativeText = []
  for (const language of ['zh', 'en']) {
    const record = repairFreeze.languages.find(item => item.language === language)
    for (const item of [...record.templates, record.normalizedText, record.markdown]) {
      const output = `${G}/context/${language}/${path.basename(item.path)}`
      fs.copyFileSync(item.path, writable(output))
    }
    const lesson = read(`${G}/context/${language}/lesson.template.json`)
    authoritativeText.push({ lesson: CARD, text: lesson.printed_title })
    authoritativeText.push(...lesson.prose.filter(block => block.text?.trim())
      .map(block => ({ lesson: CARD, text: block.text })))
  }
  fs.copyFileSync(`${R}/display-title.json`, writable(`${G}/context/display-title.json`))
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: 'fig-302', mode: 'deterministic',
    description: 'Instructional hysteresis graph: inspect the source initial oa branch, directed closed a-b-c-a-prime-b-prime-c-prime-a cycle, nonzero remanence, coercive sign, common I/B_0 axes and ideal central symmetry. Schematic coordinates are not measured data; original symbols are preserved as native SVG vector text. No portrait, added numerical scale, physical unit, formula or answer annotation.',
    source: { image: bind(SOURCE), authoritativeText, inventory },
    canvas: { width: 640, height: 480, boundingBox: [-6.4, 4.8, 6.4, -4.8],
      background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640,
      widths: [316, 640], minTextPx: 16 },
    layout: { minLabelGap: 4 },
    objects, assertions,
  }
  write(`${G}/context/input-bindings.json`, {
    source: bind(SOURCE), previousBlockedFreeze: bind(OLD),
    originalTextFreeze: repairFreeze.authorFreeze,
    authoritativeTextFreeze: bind(`${R}/repair-freeze.json`),
    bindingStatus: 'current-repair-freeze-hash-bound-independent-review-pending',
    currentText: repairFreeze.languages.map(item => ({
      language: item.language,
      files: [...item.templates, item.normalizedText, item.markdown].map(record => ({
        original: record, frozen: bind(`${G}/context/${item.language}/${path.basename(record.path)}`),
      })),
    })),
    displayTitle: { original: repairFreeze.displayTitle, frozen: bind(`${G}/context/display-title.json`),
      purpose: 'Display-only sidecar; raw/native lesson identity is unchanged.' },
    sourceObservation: {
      reusedFrom: bind(OLD), sourceImageOpensThisInvocation: 0, originalImageOpens: 1,
      reason: 'Explicit routing correction; already inspected original is sufficient and hash is unchanged.',
    },
  })
  write(`${G}/context/geometry-definition.json`, {
    controls, initialControls, upper, lower, initial,
    arrows: arrowDefinitions.map(([id, sequence, from, to]) => ({
      id, from: sequence[from], to: sequence[to],
    })),
    sourceCoordinateStatus: 'Uncalibrated modern schematic fit; not newly supplied mathematical data.',
  })
  const stage = `${G}/initial`
  write(`${stage}/fig-302.spec.json`, spec)
  receipt('initial-validation', 'python3', [
    `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
    `${stage}/fig-302.spec.json`, '--stage', 'draft', '--json',
  ], stage)
  receipt('initial-render', 'node', [
    `${W}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
    '--spec', 'fig-302.spec.json', '--svg', 'fig-302.svg',
    '--report', 'fig-302.render.json', '--png', 'fig-302.full.png',
  ], stage)
  console.log(JSON.stringify({ status: 'initial-render-complete', stage,
    objects: objects.length, assertions: assertions.length }))
} else {
  throw new Error('Use render; initial attempts are never overwritten.')
}
