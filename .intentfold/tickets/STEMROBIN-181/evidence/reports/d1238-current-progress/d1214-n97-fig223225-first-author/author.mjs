import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const card = 'phy10-c2-s4-n97'
const textRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1202-n97-first-bilingual-text-author')
const textDir = path.join(textRoot, 'work/adapt/10p/modern-us-neutral/lessons', card)
const contextRoot = path.join(root, 'context-root')
const imageScripts = path.join(repo, '.agents/skills/ld-s10y-image/scripts')
const sourceRelationAssertions = {
  223: {
    'k-axis-incidence': ['k-x-axis-connects', 'k-y-axis-connects', 'k-z-axis-connects'],
    'k1-axis-incidence': ['k1-x-axis-connects', 'k1-y-axis-connects', 'k1-z-axis-connects'],
    'shared-horizontal': ['k-x-right', 'k1-x-right', 'origins-shared-horizontal'],
    'frame-axis-parallels': ['frame-y-parallel', 'frame-z-parallel', 'k-y-vertical', 'k-z-down-left'],
    'axis-directions': ['k-x-axis-connects', 'k-y-axis-connects', 'k-z-axis-connects', 'k1-x-axis-connects', 'k1-y-axis-connects', 'k1-z-axis-connects'],
    'rod-endpoints': ['rod-ab-connects', 'rod-end-order'],
    'rod-longitudinal': ['rod-a-right-of-k1', 'rod-end-order', 'rod-longitudinal-to-motion'],
    'frame-motion': ['velocity-tail-on-k1-y', 'frame-velocity-connects', 'velocity-right', 'velocity-parallel-x'],
  },
  224: {
    'frame-incidence': ['k1-x-axis-connects', 'k1-y-axis-connects', 'k1-z-axis-connects'],
    'baseline-order': ['k1-x-right', 'rest-a-right-of-origin', 'rest-rod-end-order'],
    'rod-ends': ['rest-rod-ab-connects', 'rest-rod-end-order'],
    'outbound-direction': ['light-outbound-connects', 'outbound-rightward', 'outbound-covers-rest-length'],
    'return-direction': ['light-return-connects', 'return-leftward', 'return-covers-rest-length'],
    'optical-alignment': ['optical-outbound-longitudinal', 'optical-return-longitudinal', 'outbound-a-projection', 'outbound-b-projection', 'return-a-projection', 'return-b-projection'],
    'rest-length': ['proper-length-right-connects', 'proper-length-left-connects', 'proper-length-matches-rod', 'dimension-a-projection', 'dimension-b-projection'],
    'end-supports': ['a-apparatus-support-connects', 'b-mirror-support-connects', 'outbound-a-projection', 'outbound-b-projection', 'dimension-a-projection', 'dimension-b-projection'],
  },
  225: {
    'shared-frames': ['origins-shared-horizontal', 'frame-y-parallel', 'frame-z-parallel', 'k-x-axis-connects', 'k-y-axis-connects', 'k-z-axis-connects', 'k1-x-axis-connects', 'k1-y-axis-connects', 'k1-z-axis-connects'],
    'frame-motion': ['frame-velocity-connects', 'velocity-tail-on-k1-y', 'velocity-right'],
    'three-rod-endpairs': ['rod-a-b-connects', 'rod-a1-b1-connects', 'rod-a2-b2-connects', 'rod-a-b-length', 'rod-a1-b1-length', 'rod-a2-b2-length', 'same-rod-emission-reflection', 'same-rod-reflection-reception'],
    'successive-motion': ['a-outbound-motion', 'b-outbound-motion', 'a-return-motion', 'b-return-motion'],
    'outbound-span': ['outbound-distance-right-connects', 'outbound-distance-left-connects', 'outbound-emission-projection', 'outbound-reflection-projection', 'outbound-l-plus-shift1'],
    'first-motion-span': ['outbound-motion-right-connects', 'outbound-motion-left-connects', 'shift1-a-projection', 'shift1-a1-projection', 'shift1-v-tau1'],
    'second-motion-span': ['return-motion-right-connects', 'return-motion-left-connects', 'shift2-a1-projection', 'shift2-a2-projection', 'shift2-v-tau2'],
    'return-span': ['return-distance-right-connects', 'return-distance-left-connects', 'return-reflection-projection', 'return-reception-projection', 'return-l-minus-shift2'],
    'shared-reflection-guide': ['b1-shared-reflection-guide-connects', 'b1-on-common-reflection-guide', 'outbound-reflection-projection', 'return-reflection-projection'],
    'left-dimension-guides': ['a-emission-guide-connects', 'a1-shift-guide-connects', 'a2-reception-guide-connects', 'shift1-a-projection', 'shift1-a1-projection', 'shift2-a1-projection', 'shift2-a2-projection'],
  },
}
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const artifact = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const owned = file => {
  if (!path.resolve(file).startsWith(root + path.sep)) throw new Error(`Unowned output: ${file}`)
  return file
}
const write = (file, value) => {
  owned(file)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const copy = (from, to) => {
  owned(to)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
const native = (name, command, args) => {
  const result = spawnSync(command, args, {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: root },
    maxBuffer: 12 * 1024 * 1024,
  })
  const evidence = {
    name, command, args, cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr,
    error: result.error ? String(result.error) : null,
  }
  write(path.join(root, 'native', `${name}.json`), evidence)
  console.log(JSON.stringify({ name, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
  return result.status === 0
}

function prepare() {
  const bindings = [
    [path.join(textRoot, 'report.json'), '78586bb252c11ff53a5e1379be838d6cfcb2933133c6965eda93975fc418a3a1'],
    [path.join(textDir, 'zh/lesson.template.json'), 'aa05d46397b069e9353bde5a25191eeb5006116513eb3f5756c7709130b639f9'],
    [path.join(textDir, 'zh/exercises.template.json'), 'ed02c32857222bfb43935afb4442a9497502a8efe82758c9c2b310343f0aaf08'],
    [path.join(textDir, 'en/lesson.template.json'), 'e517b5ed1b1343a64a6e9a35a0193ff82f63fad9de1ef5c96ad8a04f1baee1a7'],
    [path.join(textDir, 'en/exercises.template.json'), '0d0b4b35fe0ace344ec8bcaeb3fd79dff7df10cd1464e1f82c06197a901a2ab6'],
  ]
  for (const [file, expected] of bindings) {
    if (hash(file) !== expected) throw new Error(`Authoritative binding changed: ${file}`)
  }
  const lessonDir = path.join(contextRoot, '10p/editions/modern-us-neutral/lessons', card)
  copy(bindings[0][0], path.join(root, 'text-input/report.json'))
  copy(bindings[1][0], path.join(lessonDir, 'lesson.json'))
  copy(bindings[2][0], path.join(lessonDir, 'exercises.json'))
  copy(bindings[3][0], path.join(root, 'text-input/en.lesson.template.json'))
  copy(bindings[4][0], path.join(root, 'text-input/en.exercises.template.json'))
  const exercises = read(path.join(lessonDir, 'exercises.json'))
  if (exercises.count !== 0 || exercises.exercises.length !== 0) throw new Error('Unexpected exercise count')
  const figures = []
  for (const number of [223, 224, 225]) {
    const figure = `fig-${number}`
    const batch = number === 223 ? 'd1118-source259-first-author' : 'd1119-source260-first-author'
    const page = number === 223 ? '0259' : '0260'
    const original = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp', batch, `work/10p/pages/${page}/figures/${figure}.png`)
    const frozen = path.join(root, `source-inventory/${figure}.frozen.json`)
    const image = path.join(contextRoot, `10p/figures/${figure}.png`)
    if (read(frozen).actualOpenOrdinal !== number - 222) throw new Error('Original-open sequence changed')
    copy(original, image)
    figures.push({ figure, original: artifact(original), image: artifact(image), inventory: artifact(frozen) })
  }
  write(path.join(root, 'source-inventory-freeze.json'), {
    schema: 'd037/first-figure-source-freeze@1',
    frozenBeforeSpecs: true,
    frozenPixelFactsNeverRewritten: true,
    actualOriginalOpens: 3,
    originalsOpenedIndependentlyInOrder: ['fig-223', 'fig-224', 'fig-225'],
    figures,
    textBindings: bindings.map(([file]) => artifact(file)),
    exerciseCount: 0,
  })
  for (const number of [223, 224, 225]) {
    if (!native(`fig-${number}.context.first`, 'python3', [
      path.join(imageScripts, 'build_context.py'), '--book', '10p', '--edition', 'modern-us-neutral',
      '--figure', `fig-${number}`, '--root', contextRoot,
      '--output', path.join(root, `contexts/fig-${number}.context.json`),
    ])) throw new Error('Context construction failed')
  }
}

function builder(number, height, description) {
  const figure = `fig-${number}`
  const zh = read(path.join(contextRoot, '10p/editions/modern-us-neutral/lessons', card, 'lesson.json'))
  const en = read(path.join(root, 'text-input/en.lesson.template.json'))
  const frozen = read(path.join(root, `source-inventory/${figure}.frozen.json`))
  const image = path.join(contextRoot, `10p/figures/${figure}.png`)
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: figure, mode: 'deterministic', description,
    source: {
      image: { path: image, sha256: hash(image) },
      authoritativeText: [zh, en].flatMap(lesson => lesson.prose
        .filter(block => block.kind === 'p' && block.text.trim())
        .map(block => ({ lesson: card, text: block.text }))),
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  }
  const points = new Map()
  const point = (id, x, y, label, position = 'N') => {
    const obj = { id, type: 'point', at: [x, height - y], visible: true, size: 1, strokeWidth: 1, stroke: 'ink', fill: 'ink' }
    if (label) Object.assign(obj, { label, fontSize: 20, labelPlacement: { position, gap: 8 } })
    spec.objects.push(obj)
    points.set(id, obj.at)
  }
  const text = (id, x, y, value, role = 'ink') => spec.objects.push({
    id, type: 'text', at: [x, height - y], text: value, fontSize: 20, fontWeight: 500,
    labelColor: role, labelPlacement: { position: 'CENTER' },
  })
  const relation = (id, type, values) => spec.assertions.push({ id, type, ...values })
  const edge = (id, from, to, type = 'segment', stroke = 'ink', strokeWidth = 2) => {
    spec.objects.push({ id, type, from, to, stroke, strokeWidth })
    relation(`${id}-connects`, 'connects', { arrow: id, from, to })
  }
  const displacement = (id, from, to, dx, screenDy) => relation(id, 'displacement', { from, to, dx, dy: -screenDy })
  const parallel = (id, a, b, c, d) => relation(id, 'parallel', { a, b, c, d })
  const equal = (id, a, b, c, d) => relation(id, 'equalDistance', { a, b, c, d })
  const polygon = (id, corners, fill = 'accentSoft') => spec.objects.push({
    id, type: 'polygon', points: corners.map(([x, y]) => [x, height - y]), fill, fillOpacity: 1,
    stroke: 'ink', strokeWidth: 2,
  })
  const doubleArrow = (id, from, to, x, y, label) => {
    edge(`${id}-right`, from, to, 'arrow', 'accent', 2)
    edge(`${id}-left`, to, from, 'arrow', 'accent', 2)
    text(`${id}-text`, x, y, label)
  }
  const finish = additions => {
    const sourcePointIds = frozen.panels.flatMap(panel => panel.points.map(p => p.id))
    const additionObjectIds = new Set(additions.flatMap(item => item.objects))
    const additionAssertionIds = new Set(additions.flatMap(item => item.assertions))
    spec.source.inventory = [{
      id: frozen.panels[0].id,
      description: frozen.panels.map(panel => [
        panel.description,
        ...panel.relationships.map(item => `${item.id}: ${item.fact}`),
        `Source labels: ${panel.labels.join(', ')}.`,
        `Absent in pixels: ${panel.absent.join(', ')}.`,
      ].join('\n')).join('\n'),
      objects: spec.objects.filter(obj => !additionObjectIds.has(obj.id)).map(obj => obj.id),
      assertions: spec.assertions.filter(item => !additionAssertionIds.has(item.id)).map(item => item.id),
      requires: ['pointRelationships'],
    }]
    for (const id of sourcePointIds) {
      if (!points.has(id)) throw new Error(`Missing frozen source point ${figure}/${id}`)
    }
    for (const panel of frozen.panels) {
      for (const sourceRelation of panel.relationships) {
        const ids = sourceRelationAssertions[number][sourceRelation.id]
        if (!ids?.length || ids.some(id => !spec.source.inventory[0].assertions.includes(id))) {
          throw new Error(`Unmapped frozen relationship: ${figure}/${sourceRelation.id}`)
        }
      }
    }
    write(path.join(root, `figures/${figure}/${figure}.first.spec.json`), spec)
    write(path.join(root, `figures/${figure}/author-additions.json`), {
      schema: 'd037/explicit-figure-modern-additions@1', figure,
      sourceInventory: artifact(path.join(root, `source-inventory/${figure}.frozen.json`)),
      commonRegularization: 'Clean vector strokes, semantic role colors, English/mathematical typography, small explicit source-anchor markers, and readable layout. No new numerical given is displayed.',
      additions,
    })
    write(path.join(root, `figures/${figure}/source-point-relationship-map.json`), {
      schema: 'd037/frozen-source-point-map@1', figure,
      frozenInventory: artifact(path.join(root, `source-inventory/${figure}.frozen.json`)),
      sourcePointMappings: sourcePointIds.map(id => ({
        sourcePoint: id, object: id, at: points.get(id),
        assertions: spec.assertions.filter(item => Object.values(item).includes(id) && !additionAssertionIds.has(item.id)).map(item => item.id),
      })),
      sourceRelationshipMappings: frozen.panels.flatMap(panel => panel.relationships.map(item => ({
        sourceRelationship: item.id, fact: item.fact, inventoryGroup: panel.id,
        assertions: sourceRelationAssertions[number][item.id],
      }))),
      spec: artifact(path.join(root, `figures/${figure}/${figure}.first.spec.json`)),
    })
  }
  return { spec, point, text, relation, edge, displacement, parallel, equal, polygon, doubleArrow, finish, height }
}

function frame(b, { originX, origin1X, baseline, yTop, zBottom, zDx, xTip, x1Tip, velocityY, velocityDx }) {
  const entries = [
    ['k', originX, ''], ['k1', origin1X, '1'],
  ].filter(([, x]) => x !== undefined)
  for (const [id, x, suffix] of entries) {
    b.point(`${id}-origin`, x, baseline, `O${suffix}`, 'SE')
    b.point(`${id}-x-tip`, id === 'k' ? xTip : x1Tip, baseline, `X${suffix}`, 'S')
    b.point(`${id}-y-tip`, x, yTop, `Y${suffix}`, 'W')
    b.point(`${id}-z-tip`, x - zDx, zBottom, `Z${suffix}`, 'E')
    for (const axis of ['x', 'y', 'z']) b.edge(`${id}-${axis}-axis`, `${id}-origin`, `${id}-${axis}-tip`, 'arrow', 'ink')
    b.text(`${id}-frame-name`, x - 25, (baseline + yTop) / 2, `K${suffix}`)
    b.displacement(`${id}-y-vertical`, `${id}-origin`, `${id}-y-tip`, 0, yTop - baseline)
    b.displacement(`${id}-z-down-left`, `${id}-origin`, `${id}-z-tip`, -zDx, zBottom - baseline)
    b.displacement(`${id}-x-right`, `${id}-origin`, `${id}-x-tip`, (id === 'k' ? xTip : x1Tip) - x, 0)
    b.relation(`${id}-transverse-y`, 'perpendicular', {
      a: `${id}-origin`, b: `${id}-x-tip`, c: `${id}-origin`, d: `${id}-y-tip`,
    })
  }
  if (originX !== undefined && origin1X !== undefined) {
    b.displacement('origins-shared-horizontal', 'k-origin', 'k1-origin', origin1X - originX, 0)
    b.parallel('frame-y-parallel', 'k-origin', 'k-y-tip', 'k1-origin', 'k1-y-tip')
    b.parallel('frame-z-parallel', 'k-origin', 'k-z-tip', 'k1-origin', 'k1-z-tip')
  }
  if (velocityY !== undefined) {
    b.point('velocity-tail', origin1X, velocityY)
    b.point('velocity-tip', origin1X + velocityDx, velocityY)
    b.edge('frame-velocity', 'velocity-tail', 'velocity-tip', 'arrow', 'accent', 3)
    b.text('velocity-label', origin1X + velocityDx / 2, velocityY - 21, 'v')
    b.relation('velocity-tail-on-k1-y', 'pointOnLine', { point: 'velocity-tail', a: 'k1-origin', b: 'k1-y-tip' })
    b.displacement('velocity-right', 'velocity-tail', 'velocity-tip', velocityDx, 0)
    b.parallel('velocity-parallel-x', 'velocity-tail', 'velocity-tip', 'k1-origin', 'k1-x-tip')
  }
}

function fig223() {
  const b = builder(223, 440, 'Longitudinal rod AB at rest in K1, moving along the shared X/X1 direction relative to K; transverse axes remain perpendicular. Two explicitly added synchronized K clocks show simultaneous endpoint measurement, not visual appearance.')
  frame(b, { originX: 100, origin1X: 210, baseline: 185, yTop: 35, zBottom: 345, zDx: 70, xTip: 535, x1Tip: 610, velocityY: 78, velocityDx: 55 })
  b.point('rod-a', 290, 185, 'A', 'NW')
  b.point('rod-b', 455, 185, 'B', 'NE')
  b.polygon('longitudinal-rod', [[290, 185], [455, 185], [455, 157], [290, 157]])
  b.edge('rod-ab', 'rod-a', 'rod-b')
  b.displacement('rod-a-right-of-k1', 'k1-origin', 'rod-a', 80, 0)
  b.displacement('rod-end-order', 'rod-a', 'rod-b', 165, 0)
  b.parallel('rod-longitudinal-to-motion', 'rod-a', 'rod-b', 'velocity-tail', 'velocity-tip')
  const beforeObjects = new Set(b.spec.objects.map(o => o.id))
  const beforeAssertions = new Set(b.spec.assertions.map(o => o.id))
  for (const [name, x] of [['a', 290], ['b', 455]]) {
    b.point(`k-clock-${name}`, x, 310)
    b.spec.objects.push({ id: `k-clock-${name}-face`, type: 'circle', center: `k-clock-${name}`, radius: 18, stroke: 'muted', strokeWidth: 2 })
    b.edge(`k-clock-${name}-hour`, `k-clock-${name}`, [x + 7, b.height - 310 + 5], 'segment', 'muted')
    b.edge(`k-clock-${name}-minute`, `k-clock-${name}`, [x, b.height - 310 + 13], 'segment', 'muted')
    b.text(`k-clock-${name}-reading`, x, 352, 't')
    b.displacement(`k-clock-${name}-endpoint-alignment`, `rod-${name}`, `k-clock-${name}`, 0, 125)
  }
  b.displacement('k-clocks-same-row', 'k-clock-a', 'k-clock-b', 165, 0)
  b.equal('k-clocks-endpoint-separation', 'rod-a', 'rod-b', 'k-clock-a', 'k-clock-b')
  b.text('k-clocks-simultaneous-label', 372, 390, 'K: same t')
  b.finish([{
    id: 'synchronized-k-clocks',
    basis: 'Current bilingual prose requires recording A and B simultaneously using K synchronized clocks. The source PNG has no clock faces. These matched schematic clocks are explicitly modern additions at the endpoint x coordinates, with equal readings t; they are not clocks at rest on the moving rod.',
    objects: b.spec.objects.filter(o => !beforeObjects.has(o.id)).map(o => o.id),
    assertions: b.spec.assertions.filter(o => !beforeAssertions.has(o.id)).map(o => o.id),
  }])
}

function fig224() {
  const b = builder(224, 340, 'Rest optical clock in frame K1: emission at rod endpoint A, rightward light to mirror B, leftward return to A, and proper length l0.')
  frame(b, { origin1X: 100, baseline: 180, yTop: 35, zBottom: 285, zDx: 60, x1Tip: 610 })
  b.point('rod-a', 190, 180, 'A', 'SW')
  b.point('rod-b', 475, 180, 'B', 'SE')
  b.polygon('rest-rod', [[190, 180], [475, 180], [475, 150], [190, 150]])
  b.edge('rest-rod-ab', 'rod-a', 'rod-b')
  for (const [id, x, y] of [
    ['outbound-left', 190, 95], ['outbound-right', 475, 95],
    ['return-right', 475, 120], ['return-left', 190, 120],
    ['length-left', 190, 265], ['length-right', 475, 265],
  ]) b.point(id, x, y)
  b.edge('light-outbound', 'outbound-left', 'outbound-right', 'arrow', 'accent', 3)
  b.edge('light-return', 'return-right', 'return-left', 'arrow', 'accent', 3)
  b.edge('a-apparatus-support', 'outbound-left', 'length-left')
  b.edge('b-mirror-support', 'outbound-right', 'length-right')
  b.doubleArrow('proper-length', 'length-left', 'length-right', 332.5, 242, 'l\u2080')
  b.displacement('rest-a-right-of-origin', 'k1-origin', 'rod-a', 90, 0)
  b.displacement('rest-rod-end-order', 'rod-a', 'rod-b', 285, 0)
  b.displacement('outbound-rightward', 'outbound-left', 'outbound-right', 285, 0)
  b.displacement('return-leftward', 'return-right', 'return-left', -285, 0)
  b.displacement('outbound-a-projection', 'rod-a', 'outbound-left', 0, -85)
  b.displacement('outbound-b-projection', 'rod-b', 'outbound-right', 0, -85)
  b.displacement('return-a-projection', 'rod-a', 'return-left', 0, -60)
  b.displacement('return-b-projection', 'rod-b', 'return-right', 0, -60)
  b.displacement('dimension-a-projection', 'rod-a', 'length-left', 0, 85)
  b.displacement('dimension-b-projection', 'rod-b', 'length-right', 0, 85)
  b.equal('proper-length-matches-rod', 'rod-a', 'rod-b', 'length-left', 'length-right')
  b.equal('outbound-covers-rest-length', 'rod-a', 'rod-b', 'outbound-left', 'outbound-right')
  b.equal('return-covers-rest-length', 'rod-a', 'rod-b', 'return-left', 'return-right')
  b.parallel('optical-outbound-longitudinal', 'rod-a', 'rod-b', 'outbound-left', 'outbound-right')
  b.parallel('optical-return-longitudinal', 'rod-a', 'rod-b', 'return-right', 'return-left')
  b.finish([])
}

function fig225() {
  const b = builder(225, 580, 'Moving longitudinal optical clock in shared K/K1 frames. Equal-length rod positions AB, A1B1 and A2B2 depict emission, reflection and reception. Preserve both rightward motion shifts, the common B1 reflection coordinate, outbound l + v tau1 and return l - v tau2. Vertical snapshot spacing is a time-layout convention, not transverse displacement.')
  frame(b, { originX: 95, origin1X: 195, baseline: 220, yTop: 35, zBottom: 470, zDx: 65, xTip: 575, x1Tip: 610, velocityY: 78, velocityDx: 50 })
  const rows = [
    ['a', 'b', 270, 450, 220, 'A', 'B', 'accentSoft'],
    ['a1', 'b1', 330, 510, 340, 'A\u2081', 'B\u2081', 'paper'],
    ['a2', 'b2', 366, 546, 460, 'A\u2082', 'B\u2082', 'paper'],
  ]
  for (const [a, c, ax, bx, y, al, bl, fill] of rows) {
    b.point(`rod-${a}`, ax, y, al, 'W')
    b.point(`rod-${c}`, bx, y, bl, 'E')
    b.polygon(`rod-${a}-${c}-body`, [[ax, y], [bx, y], [bx, y - 24], [ax, y - 24]], fill)
    b.edge(`rod-${a}-${c}`, `rod-${a}`, `rod-${c}`)
    b.displacement(`rod-${a}-${c}-length`, `rod-${a}`, `rod-${c}`, 180, 0)
  }
  for (const [id, x, y] of [
    ['outbound-start', 270, 165], ['outbound-reflection', 510, 165],
    ['shift1-left', 270, 285], ['shift1-right', 330, 285],
    ['shift2-left', 330, 405], ['shift2-right', 366, 405],
    ['return-reception', 366, 515], ['return-reflection', 510, 515],
  ]) b.point(id, x, y)
  b.edge('a-emission-guide', 'outbound-start', 'shift1-left', 'segment', 'muted')
  b.edge('a1-shift-guide', 'shift1-right', 'shift2-left', 'segment', 'muted')
  b.edge('a2-reception-guide', 'shift2-right', 'return-reception', 'segment', 'muted')
  b.edge('b1-shared-reflection-guide', 'outbound-reflection', 'return-reflection', 'segment', 'muted')
  b.doubleArrow('outbound-distance', 'outbound-start', 'outbound-reflection', 390, 142, 'l + v\u03c4\u2081')
  b.doubleArrow('outbound-motion', 'shift1-left', 'shift1-right', 300, 264, 'v\u03c4\u2081')
  b.doubleArrow('return-motion', 'shift2-left', 'shift2-right', 348, 384, 'v\u03c4\u2082')
  b.doubleArrow('return-distance', 'return-reception', 'return-reflection', 438, 538, 'l - v\u03c4\u2082')
  b.displacement('a-right-of-k1-origin', 'k1-origin', 'rod-a', 75, 0)
  b.equal('same-rod-emission-reflection', 'rod-a', 'rod-b', 'rod-a1', 'rod-b1')
  b.equal('same-rod-reflection-reception', 'rod-a1', 'rod-b1', 'rod-a2', 'rod-b2')
  for (const endpoint of ['a', 'b']) {
    b.displacement(`${endpoint}-outbound-motion`, `rod-${endpoint}`, `rod-${endpoint}1`, 60, 120)
    b.displacement(`${endpoint}-return-motion`, `rod-${endpoint}1`, `rod-${endpoint}2`, 36, 120)
  }
  b.displacement('outbound-emission-projection', 'rod-a', 'outbound-start', 0, -55)
  b.displacement('outbound-reflection-projection', 'rod-b1', 'outbound-reflection', 0, -175)
  b.displacement('return-reflection-projection', 'rod-b1', 'return-reflection', 0, 175)
  b.displacement('return-reception-projection', 'rod-a2', 'return-reception', 0, 55)
  b.displacement('shift1-a-projection', 'rod-a', 'shift1-left', 0, 65)
  b.displacement('shift1-a1-projection', 'rod-a1', 'shift1-right', 0, -55)
  b.displacement('shift2-a1-projection', 'rod-a1', 'shift2-left', 0, 65)
  b.displacement('shift2-a2-projection', 'rod-a2', 'shift2-right', 0, -55)
  b.displacement('outbound-l-plus-shift1', 'outbound-start', 'outbound-reflection', 240, 0)
  b.displacement('shift1-v-tau1', 'shift1-left', 'shift1-right', 60, 0)
  b.displacement('shift2-v-tau2', 'shift2-left', 'shift2-right', 36, 0)
  b.displacement('return-l-minus-shift2', 'return-reception', 'return-reflection', 144, 0)
  b.relation('b1-on-common-reflection-guide', 'pointOnLine', { point: 'rod-b1', a: 'outbound-reflection', b: 'return-reflection' })
  const before = new Set(b.spec.objects.map(o => o.id))
  b.text('emission-time', 370, 245, 't = 0', 'muted')
  b.text('reflection-time', 420, 365, 't = \u03c4\u2081', 'muted')
  b.text('reception-time', 465, 485, 't = \u03c4\u2081 + \u03c4\u2082', 'muted')
  const timeObjects = b.spec.objects.filter(o => !before.has(o.id)).map(o => o.id)
  const beforeLight = new Set(b.spec.objects.map(o => o.id))
  const beforeLightAssertions = new Set(b.spec.assertions.map(o => o.id))
  b.edge('outbound-light-direction-cue', [370, b.height - 108], [410, b.height - 108], 'arrow', 'accent', 3)
  b.text('outbound-light-speed', 440, 108, 'c', 'accent')
  b.edge('return-light-direction-cue', [460, b.height - 565], [420, b.height - 565], 'arrow', 'accent', 3)
  b.text('return-light-speed', 490, 565, 'c', 'accent')
  b.finish([{
    id: 'snapshot-event-times',
    basis: 'The complete current bilingual prose explicitly assigns emission at 0, reflection after tau1 and reception after tau1 + tau2. These same-row times are modern additions; all original A/B endpoint identities and four labelled source spans remain.',
    objects: timeObjects, assertions: [],
  }, {
    id: 'one-way-light-direction-cues',
    basis: 'Current bilingual prose specifies light traveling right from the emission coordinate A to the reflection coordinate B1 and left from B1 to the reception coordinate A2. Separate c-arrow cues express these directions; they do not replace or reinterpret the original double-ended dimensions.',
    objects: b.spec.objects.filter(o => !beforeLight.has(o.id)).map(o => o.id),
    assertions: b.spec.assertions.filter(o => !beforeLightAssertions.has(o.id)).map(o => o.id),
  }, {
    id: 'schematic-metric-regularization',
    basis: 'The scanned geometry is schematic, with no numerical lengths or times. Keep three equal rods, the ordered rightward shifts, all dimension endpoints and the shared B1 guide. Layout uses l = 180 units, v tau1 = 60 units, v tau2 = 36 units, so both one-way paths have the same c/v = 4. These are construction units only, never new displayed givens. Vertical row separation does not describe transverse motion.',
    objects: [], assertions: [],
  }])
}

function renderFirst() {
  for (const number of [223, 224, 225]) {
    const figure = `fig-${number}`
    const dir = path.join(root, 'figures', figure)
    const spec = path.join(dir, `${figure}.first.spec.json`)
    const validationPass = native(`${figure}.validate.first`, 'python3', [
      path.join(imageScripts, 'validate_spec.py'), spec, '--stage', 'draft', '--json',
    ])
    if (!validationPass) continue
    const renderPass = native(`${figure}.render.first`, 'node', [
      path.join(imageScripts, 'render_spec.mjs'), '--spec', spec,
      '--svg', path.join(dir, `${figure}.first.svg`),
      '--report', path.join(dir, `${figure}.first.render.json`),
    ])
    if (fs.existsSync(path.join(dir, `${figure}.first.svg`))) {
      native(`${figure}.raster.first`, 'node', [
        path.join(repo, '.claude/skills/ld-s10y-lesson/tools/svg_raster.js'),
        path.join(dir, `${figure}.first.svg`), path.join(dir, `${figure}.first.preview-640.png`), '640',
      ])
    }
    console.log(JSON.stringify({ figure, renderPass }))
  }
}

const action = process.argv[2]
if (action === 'author') {
  prepare()
  fig223()
  fig224()
  fig225()
} else if (action === 'native') {
  renderFirst()
} else {
  throw new Error('Use author or native')
}
