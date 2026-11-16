import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const base = '.tmp/s10y-image/batch007/9-10g'
const lessonDir = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-t14'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const expected = {
  [`${lessonDir}/lesson.json`]: '1d3aba91bb9d4bc7afef929bc13c504deb280504b293dfb5b5457ff6d11c59ef',
  [`${lessonDir}/exercises.json`]: '4fe2de5b67d42e63ceb422b8da1d6d47dc68071de1cfca348ba1fe987d09b16f',
  [`${base}/fig-55/context.json`]: 'b5a9e30a78fc7444c8c71720118db94ee52ea6cc2c6eb0a33e6b2910d924661a',
  [`${base}/fig-56/context.json`]: 'e9a36dc98abe5fa24c9703b67215b8a6b7eee7029288803f3ce29cffb3d066a0',
}
for (const [file, sha] of Object.entries(expected)) assert.equal(hash(file), sha)
const exercises = JSON.parse(fs.readFileSync(`${lessonDir}/exercises.json`, 'utf8'))
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const mix = (a, b, t) => a.map((value, i) => value + (b[i] - value) * t)
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const sub = (a, b) => a.map((value, i) => value - b[i])
const hit = (a, b, c, d) => mix(a, b, cross(sub(c, a), sub(d, c)) / cross(sub(b, a), sub(d, c)))

function specFor(number, height) {
  const context = JSON.parse(fs.readFileSync(`${base}/fig-${number}/context.json`, 'utf8'))
  return {
    schema: 'ld-s10y-image/figure-spec@2', id: `fig-${number}`, mode: 'deterministic',
    description: number === 55
      ? 'All three source tetrahedron-section panels for the already-worked construction in exercise 133; c is triangle EFG with G on AD. Affine schematic, not metric data.'
      : 'Only the given projection points, feet, solid connectors and plane outlines for exercises 150 and 151; no construction or answer annotations. The displayed sample adds no universal generic-position assumption.',
    source: {
      image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 },
      authoritativeText: [
        ...JSON.parse(fs.readFileSync(`${lessonDir}/lesson.json`, 'utf8')).prose.map(item => ({
          lesson: exercises.lesson, text: item.text,
        })),
        ...exercises.exercises.filter(item => item.figure_refs.includes(`fig-${number}`)).map(item => ({
          lesson: exercises.lesson, exercise: item.number, text: item.text,
        })),
      ],
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper' },
    display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
    objects: [], assertions: [], layout: { minLabelGap: 2 },
  }
}

function panel(spec, prefix, points, yOffset, letter) {
  const objects = [], assertions = []
  const ids = Object.fromEntries(Object.keys(points).map(name => [name, `${prefix}-${name}`]))
  const coords = Object.fromEntries(Object.entries(points).map(([name, at]) => [name, [at[0], at[1] + yOffset]]))
  const addObject = item => { spec.objects.push(item); objects.push(item.id) }
  const addAssertion = item => { spec.assertions.push(item); assertions.push(item.id) }
  const edge = (name, from, to, dash = 0, strokeWidth = 2.2) => {
    const id = `${prefix}-${name}`
    addObject({ id, type: 'segment', from: ids[from], to: ids[to], stroke: 'ink', strokeWidth, dash })
    addAssertion({ id: `${id}-connects`, type: 'connects', arrow: id, from: ids[from], to: ids[to] })
  }
  const on = (point, a, b) => addAssertion({
    id: `${prefix}-${point}-on-${a}-${b}`, type: 'pointOnLine',
    point: ids[point], a: ids[a], b: ids[b], tolerance: 0.000001,
  })
  const label = (name, at, text) => addObject({
    id: `${prefix}-${name}`, type: 'text', at: [at[0], at[1] + yOffset], text,
    fontSize: 20, fontWeight: 500, labelPlacement: { position: 'CENTER' },
  })
  const addPoints = () => {
    for (const [name, at] of Object.entries(coords)) addObject({
      id: ids[name], type: 'point', at, label: name.replace('_1', '\u2081'),
      stroke: 'ink', fill: 'ink', size: 2.5, strokeWidth: 1, fontSize: 20, fontWeight: 500,
      ...(['A', 'D', 'K'].includes(name) ? {
        labelPlacement: { position: name === 'D' ? 'N' : 'S' },
      } : {}),
    })
    label('panel-label', [78, 455], `${letter})`)
  }
  return { ids, coords, objects, assertions, addObject, addAssertion, edge, on, label, addPoints }
}

const f55 = specFor(55, 1500)
const panelFacts = [
  ['a', 1000, 'Fourteen points, quadrilateral EFGH; E/AB F/AC H/BD G/CD; M/EF N/EH P/FG; DNN1 and DPP1; exterior K on NP, N1P1 and EF. Solid tetrahedron/front section edges; hidden BC/EF/HG/base guide dashed; section alpha and diagonal hatching. Latin a replaces source panel letter.'],
  ['b', 500, 'Eleven points, quadrilateral EFGH; E/AB F/AC H/BD G/CD; M/EF N/EH P/FG with NP parallel EF. No K/N1/P1. Solid front edges and dashed BC/EF/HG/NP; section alpha and hatching. Latin b replaces source panel letter.'],
  ['c', 0, 'Thirteen points, triangle EFG with G on AD, no H. E/AB F/AC M/EF N/EG P/FG; DNN1 DPP1; exterior K on NP/N1P1/EF. Solid front section/construction and dashed hidden BC/EF/base guide; alpha and hatching. Latin c replaces source panel letter.'],
]
for (const [letter, offset, description] of panelFacts) {
  const A = [325, 60], B = [120, 170], C = [550, 220], D = [330, 430]
  let E, F, G, H, N, P
  if (letter === 'c') {
    E = mix(A, B, 0.6); F = mix(A, C, 0.55); G = mix(A, D, 0.72)
    N = mix(E, G, 0.55); P = mix(F, G, 0.8)
  } else {
    E = mix(A, B, 0.4); F = mix(A, C, 1 / 3)
    H = mix(D, B, 0.7 / 2.2); G = mix(D, C, 0.7 / 2.7)
    if (letter === 'b') {
      // Equal barycentric D-coordinate makes NP genuinely parallel to base EF.
      N = mix(E, H, 0.48); P = mix(F, G, 0.48 * (1 - 0.7 / 2.2) / (1 - 0.7 / 2.7))
    } else {
      N = mix(E, H, 0.4); P = mix(F, G, 0.6)
    }
  }
  const points = { A, B, C, D, E, F, G, ...(H ? { H } : {}), M: mix(E, F, 0.47), N, P }
  if (letter !== 'b') {
    points.N_1 = hit(D, N, A, B)
    points.P_1 = hit(D, P, A, C)
    points.K = hit(N, P, E, F)
  }
  const p = panel(f55, `f55-${letter}`, points, offset, letter)
  const sectionNames = letter === 'c' ? ['E', 'F', 'G'] : ['E', 'F', 'G', 'H']
  const section = sectionNames.map(name => points[name])
  const alphaAt = letter === 'c' ? [320, 205] : [322, 227]
  // Source hatching is clipped to the section, with intentional blank label clearance.
  let hatchPath = ''
  for (let x = 150; x < 550; x += 18) {
    let run = []
    const flush = () => {
      if (run.length > 1) hatchPath += `M ${run[0][0]} ${1500 - run[0][1] - offset} L ${run.at(-1)[0]} ${1500 - run.at(-1)[1] - offset} `
      run = []
    }
    for (let y = 80; y < 425; y += 3) {
      const at = [x + (y - 80) * 0.45, y]
      const signs = section.map((a, i) => cross(sub(section[(i + 1) % section.length], a), sub(at, a)))
      const inside = signs.every(value => value >= 0) || signs.every(value => value <= 0)
      const clear = [...Object.values(points), alphaAt].every(anchor => Math.hypot(...sub(at, anchor)) > 42)
      if (inside && clear) run.push(at); else flush()
    }
    flush()
  }
  p.addObject({ id: `f55-${letter}-section-hatching`, type: 'svgPath', d: hatchPath.trim(), stroke: 'muted', strokeWidth: 1, fill: 'none' })
  p.edge('AB', 'A', 'B'); p.edge('AC', 'A', 'C'); p.edge('AD', 'A', 'D')
  p.edge('BD', 'B', 'D'); p.edge('CD', 'C', 'D'); p.edge('BC-hidden', 'B', 'C', 2)
  p.edge('EF-hidden', 'E', 'F', 2)
  if (letter === 'c') p.edge('EG', 'E', 'G')
  else { p.edge('EH', 'E', 'H'); p.edge('HG-hidden', 'H', 'G', 2) }
  p.edge('FG', 'F', 'G')
  if (letter !== 'b') {
    p.edge('D-N1', 'D', 'N_1', 0, 1.5); p.edge('D-P1', 'D', 'P_1', 0, 1.5)
    p.edge('K-N', 'K', 'N', 0, 1.5); p.edge('N-P', 'N', 'P', 0, 1.5)
    p.edge('K-N1', 'K', 'N_1', 0, 1.5); p.edge('N1-P1-hidden', 'N_1', 'P_1', 2, 1.5)
    p.edge('K-E', 'K', 'E', 0, 1.5)
    p.on('N_1', 'A', 'B'); p.on('P_1', 'A', 'C')
    p.on('N', 'D', 'N_1'); p.on('P', 'D', 'P_1')
    p.on('K', 'N', 'P'); p.on('K', 'N_1', 'P_1'); p.on('K', 'E', 'F')
  } else {
    p.edge('NP-hidden', 'N', 'P', 2, 1.5)
    p.addAssertion({ id: 'f55-b-NP-parallel-EF', type: 'parallel', a: p.ids.N, b: p.ids.P, c: p.ids.E, d: p.ids.F })
  }
  p.on('E', 'A', 'B'); p.on('F', 'A', 'C'); p.on('G', letter === 'c' ? 'A' : 'C', 'D')
  if (H) p.on('H', 'B', 'D')
  p.on('M', 'E', 'F'); p.on('N', 'E', letter === 'c' ? 'G' : 'H'); p.on('P', 'F', 'G')
  p.label('alpha', alphaAt, '\u03b1')
  p.addPoints()
  f55.source.inventory.push({
    id: `f55-source-panel-${letter}`, description, objects: p.objects,
    assertions: p.assertions, requires: ['pointRelationships'],
  })
}

const f56 = specFor(56, 800)
for (const [letter, offset, points, alphaAt] of [
  ['a', 400, { A: [470, 140], B: [270, 85], A_1: [398.75, 325.25], B_1: [213.75, 231.25] }, [83, 145]],
  ['b', 0, { A: [170, 140], B: [305, 75], C: [425, 135], A_1: [200, 340], B_1: [329, 235], C_1: [443, 255] }, [520, 122]],
]) {
  const p = panel(f56, `f56-${letter}`, points, offset, letter)
  const outline = Array.from({ length: 64 }, (_, i) => {
    const theta = 2 * Math.PI * i / 64
    return [320 + 270 * Math.cos(theta), offset + 140 + 90 * Math.sin(theta)]
  })
  p.addObject({ id: `f56-${letter}-plane`, type: 'polygon', points: outline, stroke: 'ink', strokeWidth: 2, fill: 'paper', fillOpacity: 0 })
  for (const name of Object.keys(points).filter(name => !name.includes('_'))) {
    p.edge(`${name}1-${name}`, `${name}_1`, name)
    p.addAssertion({ id: `f56-${letter}-${name}-inside-plane`, type: 'inside', point: p.ids[name], container: `f56-${letter}-plane` })
    if (name !== 'A') p.addAssertion({
      id: `f56-${letter}-${name}-projection-parallel`, type: 'parallel',
      a: p.ids.A_1, b: p.ids.A, c: p.ids[`${name}_1`], d: p.ids[name],
    })
  }
  p.label('alpha', alphaAt, '\u03b1')
  p.addPoints()
  // Place the panel labels inside their own 400-pixel bands.
  f56.objects.find(item => item.id === `f56-${letter}-panel-label`).at = [78, offset + 375]
  f56.source.inventory.push({
    id: `f56-source-panel-${letter}`,
    description: letter === 'a'
      ? 'Four original dots A1/B1/A/B; two solid parallel upper-to-foot connectors, plane alpha outline, Latin a. No joining AB/A1B1, extension, intersection, answer trace or metric mark.'
      : 'Six original dots A1/B1/C1/A/B/C; three solid parallel upper-to-foot connectors, plane alpha outline, Latin b. No triangle edges, foot edges, separator, intersection or answer trace.',
    objects: p.objects, assertions: p.assertions, requires: ['pointRelationships'],
  })
}

for (const spec of [f55, f56]) {
  const dir = `${base}/${spec.id}`
  assert.equal(fs.existsSync(`${dir}/spec.json`), false, 'Existing author output belongs to another invocation')
  fs.mkdirSync(`${dir}/evidence/inputs`, { recursive: true })
  fs.mkdirSync(`${dir}/evidence/tools`, { recursive: true })
  const inputFiles = [
    ...Object.keys(expected), spec.source.image.path,
    'tmp/geo910-t14-fig55-56-author.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '/Users/yong/.agents/skills/ips-chrome-background/SKILL.md',
  ]
  const inputs = inputFiles.map((file, i) => {
    const target = `${dir}/evidence/inputs/${String(i).padStart(2, '0')}-${path.basename(file)}`
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
    return { path: path.resolve(file), sha256: hash(file), copy: path.resolve(target), copySha256: hash(target) }
  })
  const toolFiles = [
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
    '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
    '.tmp/s10y-image/batch007/10c/n83-display-probes.mjs',
    '.tmp/s10y-image/batch007/10c/fig-10/display-probe.mjs',
    '.tmp/s10y-image/batch007/10c/fig-10/run-probe-once.mjs',
    '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js',
    '.agents/skills/node_modules/jsxgraph/distrib/jsxgraph.css',
  ]
  const tools = toolFiles.map(file => {
    const target = `${dir}/evidence/tools/${path.basename(file)}`
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
    return { path: path.resolve(file), sha256: hash(file), copy: path.resolve(target), copySha256: hash(target) }
  })
  write(`${dir}/spec.json`, spec)
  write(`${dir}/evidence/author-inputs.json`, {
    role: 'author-only', figure: spec.id, cwd: root, inputs, tools,
    sourceInventoryBeforeSpec: inputs.find(item => item.path.endsWith('geo910-t14-fig55-56-author.md')),
    modernAdditions: ['Vertical panel layout', 'Affine coordinates chosen for incidence, not source-fitted metric claims', '20px semantic-ink labels and consistent dots', 'Regularized rounded plane boundary for 56', 'Hatching label-clearance for 55'],
    unresolved: ['151 separator UNKNOWN; no guessed separator', '54 p-rho UNKNOWN and out of scope'],
    counts: {
      objects: spec.objects.length, assertions: spec.assertions.length,
      sourcePoints: spec.objects.filter(item => item.type === 'point').length,
      labels: spec.objects.filter(item => item.label || item.type === 'text').length,
      assertionTypes: Object.fromEntries([...new Set(spec.assertions.map(item => item.type))].map(type => [type, spec.assertions.filter(item => item.type === type).length])),
    },
  })
  console.log(`${spec.id}: authored ${spec.objects.length} objects; ${spec.assertions.length} assertions`)
}
