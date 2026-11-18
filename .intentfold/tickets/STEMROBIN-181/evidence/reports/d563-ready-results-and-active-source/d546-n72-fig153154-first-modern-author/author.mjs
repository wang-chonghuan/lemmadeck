import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const relRoot = path.relative(workspace, root)
const tmp = '.intentfold/tickets/STEMROBIN-181/tmp'
const skill = '.agents/skills/ld-s10y-image'
const manifestPath = `${tmp}/d545-n72-first-figure-contexts/manifest.json`
const expectedManifest = 'bd710df2d9755652277dddc9e84d7f98d26683be943f45d621951f0907f2d372'
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const sha = file => hash(fs.readFileSync(file))
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const absolute = file => path.resolve(workspace, file)
const within = file => {
  const resolved = path.resolve(root, file)
  if (!resolved.startsWith(`${root}/`)) throw new Error(`Outside write scope: ${file}`)
  return resolved
}
const write = (file, value) => {
  const target = within(file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const relativeEvidence = file => `${relRoot}/${file}`
const evidence = file => ({ path: relativeEvidence(file), sha256: sha(within(file)), bytes: fs.statSync(within(file)).size })
const receipts = []
function command(id, executable, args, inputs = []) {
  const start = new Date().toISOString()
  fs.mkdirSync(within('runtime'), { recursive: true })
  const result = spawnSync(executable, args, {
    cwd: workspace,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: within('runtime') },
    maxBuffer: 16 * 1024 * 1024,
  })
  write(`commands/${id}.stdout.txt`, result.stdout || '')
  write(`commands/${id}.stderr.txt`, result.stderr || '')
  const receipt = {
    id, executable, args, cwd: workspace, startedAt: start, endedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    inputs: inputs.map(file => ({ path: file, sha256: sha(absolute(file)) })),
    stdout: evidence(`commands/${id}.stdout.txt`),
    stderr: evidence(`commands/${id}.stderr.txt`),
  }
  write(`commands/${id}.receipt.json`, receipt)
  receipts.push(receipt)
  console.log(`${id}: exit ${result.status}`)
  return result.status
}
function snapshot(files, stage) {
  return files.map((file, index) => {
    const bytes = fs.readFileSync(absolute(file))
    const output = `protected/${stage}/${String(index).padStart(2, '0')}-${path.basename(file)}`
    write(output, bytes.toString('base64'))
    return {
      path: file, sha256: hash(bytes), bytes: bytes.length,
      encoding: 'base64-original-bytes', snapshot: evidence(output),
    }
  })
}
const point = (id, at, size = 1) => ({ id, type: 'point', at, size, stroke: 'ink', fill: 'ink' })
const hidden = (id, at) => ({ id, type: 'point', at, visible: false })
const text = (id, at, value) => ({
  id, type: 'text', at, text: value, fontSize: 32, fontWeight: 500,
  labelColor: 'ink', labelPlacement: { position: 'CENTER' },
})
const segment = (id, from, to, style = {}) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, ...style,
})
const arrow = (id, from, to, style = {}) => ({
  id, type: 'arrow', from, to, stroke: 'accent', strokeWidth: 4, ...style,
})
const polygon = (id, points, style = {}) => ({
  id, type: 'polygon', points, stroke: 'muted', strokeWidth: 2,
  fill: 'accentSoft', fillOpacity: 0.15, ...style,
})
const connects = (id, object, from, to) => ({ id, type: 'connects', arrow: object, from, to })
const displacement = (id, from, to, dx, dy) => ({ id, type: 'displacement', from, to, dx, dy })
const normalAt = (center, endpoint, radius) => {
  const dx = endpoint[0] - center[0], dy = endpoint[1] - center[1]
  const length = Math.hypot(dx, dy)
  return [center[0] + radius * dx / length, center[1] + radius * dy / length]
}
function inventory(id, description, objects, assertions, requires = []) {
  return { id, description, objects, assertions, ...(requires.length ? { requires } : {}) }
}
function build153() {
  const o = [320, 320], i = [430, 580], t = [240, 60]
  const alpha = normalAt(o, i, 90), beta = normalAt(o, t, 90)
  const objects = [
    polygon('s153-medium-2', [[20, 320], [620, 320], [620, 30], [20, 30]], { stroke: 'paper', fillOpacity: 0.15 }),
    point('s153-b-left', [20, 320]), point('s153-b-right', [620, 320]),
    point('s153-n-up', [320, 580]), point('s153-n-down', [320, 60]),
    point('s153-i', i), point('s153-t', t), point('s153-o', o, 3),
    hidden('s153-alpha-n', [320, 410]), hidden('s153-alpha-i', alpha),
    hidden('s153-beta-n', [320, 230]), hidden('s153-beta-t', beta),
    segment('s153-boundary', 's153-b-left', 's153-b-right', { strokeWidth: 4 }),
    segment('s153-normal', 's153-n-up', 's153-n-down', { dash: 2, stroke: 'muted', strokeWidth: 2.5 }),
    arrow('s153-incident', 's153-i', 's153-o'),
    arrow('s153-refracted', 's153-o', 's153-t'),
    { id: 's153-alpha-arc', type: 'arc', center: 's153-o', start: 's153-alpha-i', end: 's153-alpha-n', stroke: 'ink', strokeWidth: 2.5 },
    { id: 's153-beta-arc', type: 'arc', center: 's153-o', start: 's153-beta-t', end: 's153-beta-n', stroke: 'ink', strokeWidth: 2.5 },
    text('s153-alpha', [354, 468], '\u03b1'),
    text('s153-beta', [297, 172], '\u03b2'),
    text('s153-medium-1-label', [110, 425], 'Medium 1'),
    text('s153-medium-2-label', [520, 200], 'Medium 2'),
    text('s153-incident-label', [514, 490], 'Incident'),
    text('s153-refracted-label', [135, 135], 'Refracted'),
    text('s153-normal-label', [220, 589], 'Normal'),
    text('s153-boundary-label', [520, 357], 'Boundary'),
    text('s153-o-label', [360, 290], 'O'),
  ]
  const assertions = [
    { id: 's153-o-on-boundary', type: 'pointOnLine', point: 's153-o', a: 's153-b-left', b: 's153-b-right' },
    { id: 's153-o-on-normal', type: 'pointOnLine', point: 's153-o', a: 's153-n-up', b: 's153-n-down' },
    { id: 's153-boundary-perpendicular-normal', type: 'perpendicular', a: 's153-b-left', b: 's153-b-right', c: 's153-n-up', d: 's153-n-down' },
    displacement('s153-horizontal-boundary', 's153-b-left', 's153-b-right', 600, 0),
    displacement('s153-vertical-normal', 's153-n-up', 's153-n-down', 0, -520),
    connects('s153-incident-connects', 's153-incident', 's153-i', 's153-o'),
    connects('s153-refracted-connects', 's153-refracted', 's153-o', 's153-t'),
    displacement('s153-incident-displacement', 's153-i', 's153-o', -110, -260),
    displacement('s153-refracted-displacement', 's153-o', 's153-t', -80, -260),
    { id: 's153-alpha-normal-end', type: 'pointOnLine', point: 's153-alpha-n', a: 's153-o', b: 's153-n-up' },
    { id: 's153-alpha-ray-end', type: 'pointOnLine', point: 's153-alpha-i', a: 's153-o', b: 's153-i' },
    { id: 's153-alpha-equal-radius', type: 'equalDistance', a: 's153-o', b: 's153-alpha-n', c: 's153-o', d: 's153-alpha-i' },
    { id: 's153-beta-normal-end', type: 'pointOnLine', point: 's153-beta-n', a: 's153-o', b: 's153-n-down' },
    { id: 's153-beta-ray-end', type: 'pointOnLine', point: 's153-beta-t', a: 's153-o', b: 's153-t' },
    { id: 's153-beta-equal-radius', type: 'equalDistance', a: 's153-o', b: 's153-beta-n', c: 's153-o', d: 's153-beta-t' },
    { id: 's153-lower-medium-label-inside', type: 'inside', point: 's153-medium-2-label', container: 's153-medium-2', margin: 20 },
  ]
  return {
    description: 'Define incidence and refraction angles from the normal to a common boundary. Preserve the source upper-right incident and lower-left refracted directions; do not add a reflected branch or angle values.',
    objects, assertions,
    inventory: [
      inventory('s153-boundary-normal', 'Observed horizontal boundary and vertical normal with a shared incidence location; upper/lower media have modern English identifiers. Tiny endpoint markers and exact layout coordinates are additions, not source given data.',
        ['s153-boundary', 's153-normal', 's153-o', 's153-b-left', 's153-b-right', 's153-n-up', 's153-n-down'],
        ['s153-o-on-boundary', 's153-o-on-normal', 's153-boundary-perpendicular-normal', 's153-horizontal-boundary', 's153-vertical-normal'], ['pointRelationships']),
      inventory('s153-ray-directions', 'Observed incident arrow approaches from upper-right; refracted arrow leaves down-left and nearer the downward normal. Endpoints are regularized anchors, not measured source points.',
        ['s153-incident', 's153-refracted', 's153-i', 's153-o', 's153-t'],
        ['s153-incident-connects', 's153-refracted-connects', 's153-incident-displacement', 's153-refracted-displacement'], ['pointRelationships']),
      inventory('s153-angles', 'Observed alpha and beta arcs are between the respective ray and the normal, not the horizontal surface. Construction endpoints have equal radius and lie on the corresponding source-derived lines.',
        ['s153-alpha-arc', 's153-beta-arc', 's153-alpha', 's153-beta'],
        ['s153-alpha-normal-end', 's153-alpha-ray-end', 's153-alpha-equal-radius', 's153-beta-normal-end', 's153-beta-ray-end', 's153-beta-equal-radius']),
    ],
  }
}
function build154() {
  const o = [310, 310], i = [490, 555], t = [205, 100], r = [130, 555]
  const beam = [[303.3, 313.35], [316.7, 306.65], [211.7, 96.65], [198.3, 103.35]]
  const objects = [
    polygon('s154-water-front', [[60, 310], [505, 310], [505, 90], [60, 90]]),
    polygon('s154-water-right', [[505, 310], [580, 360], [580, 140], [505, 90]], { fillOpacity: 0.23 }),
    polygon('s154-water-surface', [[60, 310], [505, 310], [580, 360], [135, 360]], { fillOpacity: 0.07 }),
    polygon('s154-front-frame', [[60, 420], [505, 420], [505, 90], [60, 90]], { fillOpacity: 0, stroke: 'ink', strokeWidth: 4 }),
    polygon('s154-right-frame', [[505, 420], [580, 470], [580, 140], [505, 90]], { fillOpacity: 0, stroke: 'ink', strokeWidth: 4 }),
    polygon('s154-top-frame', [[60, 420], [505, 420], [580, 470], [135, 470]], { fillOpacity: 0, stroke: 'ink', strokeWidth: 4 }),
    segment('s154-rear-left-upright', [135, 470], [135, 360], { strokeWidth: 3 }),
    point('s154-b-left', [60, 310]), point('s154-b-right', [505, 310]),
    point('s154-i', i), point('s154-o', o, 3), point('s154-t', t),
    point('s154-n-up', [310, 580]), point('s154-n-down', [310, 110]),
    hidden('s154-modern-r', r),
    segment('s154-boundary', 's154-b-left', 's154-b-right', { strokeWidth: 3 }),
    segment('s154-normal', 's154-n-up', 's154-n-down', { dash: 2, stroke: 'muted', strokeWidth: 2.5 }),
    polygon('s154-visible-water-beam', beam, { fill: 'paper', fillOpacity: 1, stroke: 'paper', strokeWidth: 2 }),
    arrow('s154-incident', 's154-i', 's154-o'),
    segment('s154-incident-companion', [500, 555], [320, 310], { dash: 2, stroke: 'muted', strokeWidth: 2 }),
    arrow('s154-refracted', 's154-o', 's154-t'),
    arrow('s154-modern-reflected', 's154-o', 's154-modern-r', { dash: 2, stroke: 'muted', strokeWidth: 3 }),
    text('s154-air-label', [95, 525], 'Air'),
    text('s154-water-label', [410, 200], 'Water'),
    text('s154-aquarium-label', [250, 40], 'Aquarium'),
    text('s154-incident-label', [540, 610], 'Incident'),
    text('s154-refracted-label', [160, 218], 'Refracted'),
    text('s154-modern-reflected-label', [105, 604], 'Reflected'),
    text('s154-normal-label', [392, 602], 'Normal'),
    text('s154-o-label', [347, 281], 'O'),
  ]
  const assertions = [
    { id: 's154-front-horizontal', type: 'parallel', a: [60, 420], b: [505, 420], c: [60, 90], d: [505, 90] },
    { id: 's154-front-vertical', type: 'parallel', a: [60, 420], b: [60, 90], c: [505, 420], d: [505, 90] },
    { id: 's154-front-right-angle', type: 'perpendicular', a: [60, 420], b: [505, 420], c: [60, 420], d: [60, 90] },
    { id: 's154-top-depth-parallel', type: 'parallel', a: [60, 420], b: [135, 470], c: [505, 420], d: [580, 470] },
    { id: 's154-side-vertical-parallel', type: 'parallel', a: [505, 420], b: [505, 90], c: [580, 470], d: [580, 140] },
    { id: 's154-o-on-boundary', type: 'pointOnLine', point: 's154-o', a: 's154-b-left', b: 's154-b-right' },
    displacement('s154-boundary-horizontal', 's154-b-left', 's154-b-right', 445, 0),
    { id: 's154-o-on-normal', type: 'pointOnLine', point: 's154-o', a: 's154-n-up', b: 's154-n-down' },
    { id: 's154-boundary-perpendicular-normal', type: 'perpendicular', a: 's154-b-left', b: 's154-b-right', c: 's154-n-up', d: 's154-n-down' },
    connects('s154-incident-connects', 's154-incident', 's154-i', 's154-o'),
    connects('s154-refracted-connects', 's154-refracted', 's154-o', 's154-t'),
    displacement('s154-incident-displacement', 's154-i', 's154-o', -180, -245),
    displacement('s154-refracted-displacement', 's154-o', 's154-t', -105, -210),
    { id: 's154-companion-parallel', type: 'parallel', a: 's154-i', b: 's154-o', c: [500, 555], d: [320, 310] },
    { id: 's154-t-in-water', type: 'inside', point: 's154-t', container: 's154-water-front', margin: 5 },
    { id: 's154-water-label-inside', type: 'inside', point: 's154-water-label', container: 's154-water-front', margin: 30 },
    connects('s154-modern-reflected-connects', 's154-modern-reflected', 's154-o', 's154-modern-r'),
    displacement('s154-modern-reflected-direction', 's154-o', 's154-modern-r', -180, 245),
    { id: 's154-modern-reflection-equal-length', type: 'equalDistance', a: 's154-o', b: 's154-i', c: 's154-o', d: 's154-modern-r' },
  ]
  return {
    description: 'Show the source wireframe aquarium, water boundary, and visible narrow incident/submerged beam. A dashed reflected direction and normal are explicitly modern, text-supported additions. No depicted projector or measuring hardware is invented; no angle or intensity values are source data.',
    objects, assertions,
    inventory: [
      inventory('s154-aquarium', 'Observed one perspective rectangular wireframe aquarium with front, receding right face, rear/top rim, uprights and bottom. Exact projection coordinates are regularized modern layout, not source measurements.',
        ['s154-front-frame', 's154-right-frame', 's154-top-frame', 's154-rear-left-upright'],
        ['s154-front-horizontal', 's154-front-vertical', 's154-front-right-angle', 's154-top-depth-parallel', 's154-side-vertical-parallel']),
      inventory('s154-water-boundary', 'Observed horizontal front water edge, receding water surface, and water below it on both faces. English medium labels, tint and O marker are additions; source hatching is not a calibrated lattice.',
        ['s154-water-front', 's154-water-right', 's154-water-surface', 's154-boundary', 's154-o', 's154-b-left', 's154-b-right'],
        ['s154-o-on-boundary', 's154-boundary-horizontal', 's154-t-in-water', 's154-water-label-inside'], ['pointRelationships']),
      inventory('s154-visible-beam', 'Observed narrow upper-right incident trace with adjacent dashed trace and more vertical down-left visible submerged band. The adjacent trace is not claimed to be a source reflected branch. Arrowheads, endpoint markers and numerical coordinates are modern aids.',
        ['s154-incident', 's154-incident-companion', 's154-refracted', 's154-visible-water-beam', 's154-i', 's154-o', 's154-t'],
        ['s154-incident-connects', 's154-refracted-connects', 's154-companion-parallel', 's154-incident-displacement', 's154-refracted-displacement', 's154-t-in-water'], ['pointRelationships']),
    ],
  }
}
async function main() {
  if (sha(absolute(manifestPath)) !== expectedManifest) throw new Error('Input manifest SHA mismatch')
  const manifest = read(absolute(manifestPath))
  const observedInventory = read(within('source.inventory.json'))
  const selected = manifest.contexts.filter(item => ['fig-153', 'fig-154'].includes(item.figure))
  if (selected.length !== 2) throw new Error('Expected exactly two bound figures')
  const protectedFiles = [
    manifestPath, manifest.fullEN.path, manifest.fullZH.path, manifest.textReview.path,
    ...selected.flatMap(item => [item.context.path, item.originalImage.path]),
    `${skill}/SKILL.md`, `${skill}/references/routing.md`, `${skill}/references/figure-spec.md`,
    `${skill}/references/quality-gate.md`, `${skill}/assets/figure-spec.schema.json`,
    `${skill}/scripts/validate_spec.py`, `${skill}/scripts/render_spec.mjs`,
    `${skill}/scripts/materialize_arrowheads.mjs`,
    '.agents/skills/node_modules/jsxgraph/package.json',
    '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js',
  ]
  for (const item of [manifest.fullEN, manifest.fullZH, manifest.textReview, ...selected.flatMap(item => [item.context, item.originalImage])]) {
    if (sha(absolute(item.path)) !== item.sha256) throw new Error(`Stale input: ${item.path}`)
  }
  const before = snapshot(protectedFiles, 'before')
  write('protected.before.json', { createdAt: new Date().toISOString(), files: before })
  const en = read(absolute(manifest.fullEN.path)), zh = read(absolute(manifest.fullZH.path))
  write('binding.json', {
    inputManifest: { path: manifestPath, sha256: expectedManifest },
    fullEN: manifest.fullEN, fullZH: manifest.fullZH, textReview: manifest.textReview,
    SCI: 'PASS-INHERITED-NOT-REPEATED', ZHEN: 'PASS-INHERITED-NOT-REPEATED',
    selected: selected.map(item => ({ figure: item.figure, context: item.context, source: item.originalImage })),
    sourceInventory: evidence('source.inventory.json'),
    writeScope: root, branch: 'codex/STEMROBIN-181-textbooks (ticket record only; no Git command)',
    userAuthorization: 'One-shot restored short first-modern author batch, context entry image count zero. Not a permanent A-D replacement. No other agents.',
  })
  for (const item of selected) {
    const fig = item.figure, authored = fig === 'fig-153' ? build153() : build154()
    const sourceObservation = observedInventory.source.find(source => source.figure === fig)
    const spec = {
      schema: 'ld-s10y-image/figure-spec@2', id: fig, mode: 'deterministic',
      description: authored.description,
      source: {
        image: item.originalImage,
        authoritativeText: [
          { lesson: manifest.card, text: en.prose.map(block => block.text).filter(Boolean).join('\n\n') },
          { lesson: manifest.card, text: zh.prose.map(block => block.text).filter(Boolean).join('\n\n') },
        ],
        inventory: authored.inventory,
      },
      canvas: { width: 640, height: 640, boundingBox: [0, 640, 640, 0], background: 'paper', keepAspectRatio: true },
      display: { purpose: 'instructional', layout: 'inline', widths: [331, 342, 640], minTextPx: 16, maxWidthPx: 640 },
      objects: authored.objects, assertions: authored.assertions,
      layout: { minLabelGap: 8 },
    }
    write(`${fig}/spec.first.json`, spec)
    write(`${fig}/routing.json`, {
      ...sourceObservation.routing, figure: fig, sourceObservation: evidence('source.inventory.json'),
      source: item.originalImage, context: item.context,
      modernAdditions: sourceObservation.modernAdditions,
      review: 'AUTHOR-OBSERVATION-ONLY-NOT-INDEPENDENT-FIG-OR-DISPLAY',
    })
    const specPath = relativeEvidence(`${fig}/spec.first.json`)
    command(`${fig}.draft.first`, 'python3', [`${skill}/scripts/validate_spec.py`, specPath, '--stage', 'draft', '--json'], [specPath])
    command(`${fig}.native.first`, 'node', [
      `${skill}/scripts/render_spec.mjs`, '--spec', specPath,
      '--svg', relativeEvidence(`${fig}/candidate.first.svg`),
      '--png', relativeEvidence(`${fig}/candidate.first.640.png`),
      '--report', relativeEvidence(`${fig}/native.first.json`),
    ], [specPath])
  }
  write('first-runs.json', {
    standaloneDraftInvocationsPerFigure: 1, nativeRenderInvocationsPerFigure: 1,
    rendererInternalDraftValidation: 'Unmodified native renderer internally validates draft once on each invocation; no extra standalone rerun was requested.',
    noDeterminismReruns: true, commands: receipts.map(receipt => evidence(`commands/${receipt.id}.receipt.json`)),
  })
  console.log('First-run evidence complete. No retry or promotion performed.')
}
main().catch(error => { console.error(error.stack); process.exitCode = 1 })
