import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const scratch = path.dirname(fileURLToPath(import.meta.url))
const templatePath = path.join(root, '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n82/lesson.template.json')
const proseFreezePath = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n82-prose-freeze.json')
const expectedProseFreeze = 'b2bffdee4912bdb4aadd7b0c4949d1af7afd4a8b5b563282caf625fa2190cc98'
const skill = path.join(root, '.agents/skills/ld-s10y-image')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (p, data) => {
  if (!path.resolve(p).startsWith(scratch + path.sep)) throw new Error('write outside owned scratch')
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
}
const bind = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const snapshot = (p, target) => {
  if (!path.resolve(target).startsWith(scratch + path.sep)) throw new Error('copy outside owned scratch')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(p, target)
  return { current: bind(p), frozen: bind(target) }
}

function authority() {
  if (hash(proseFreezePath) !== expectedProseFreeze) throw new Error('prose freeze changed')
  const freeze = load(proseFreezePath)
  if (hash(templatePath) !== freeze.bindings.lessonTemplate.sha256) throw new Error('full current template differs from prose freeze')
  return load(templatePath)
}

function builder(id, height, description) {
  const objects = []
  const assertions = []
  const inventory = []
  const coords = (x, y) => [x, height - y]
  const obj = item => { objects.push(item); return item.id }
  const poly = (name, points, fill = 'paper', stroke = 'ink', sw = 2.4) => obj({
    id: name, type: 'polygon', points: points.map(([x, y]) => coords(x, y)),
    fill, fillOpacity: 1, stroke, strokeWidth: sw,
  })
  const rect = (name, x, y, w, h, fill = 'paper', stroke = 'ink', sw = 2.4) =>
    poly(name, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, stroke, sw)
  const ellipse = (name, x, y, rx, ry, fill = 'paper', stroke = 'ink', sw = 2.4) =>
    poly(name, Array.from({ length: 48 }, (_, i) => {
      const angle = i * Math.PI / 24
      return [x + rx * Math.cos(angle), y + ry * Math.sin(angle)]
    }), fill, stroke, sw)
  const circle = (name, x, y, r, fill = 'paper') => obj({
    id: name, type: 'circle', center: coords(x, y), radius: r,
    fill, fillOpacity: 1, stroke: 'ink', strokeWidth: 2.4,
  })
  const seg = (name, a, b, stroke = 'ink', sw = 3, semantic = false) => {
    obj({ id: name, type: 'segment', from: coords(...a), to: coords(...b), stroke, strokeWidth: sw })
    if (semantic) assertions.push({
      id: `${name}-connection`, type: 'connects', arrow: name, from: coords(...a), to: coords(...b),
    })
    return name
  }
  const text = (name, x, y, value, fontSize = 32) => obj({
    id: name, type: 'text', at: coords(x, y), text: value, fontSize,
    stroke: 'ink', labelPlacement: { position: 'CENTER', offset: [0, 0] },
  })
  const distance = (name, a, b, value) => assertions.push({
    id: name, type: 'distance', a: coords(...a), b: coords(...b), value, tolerance: 0.00001,
  })
  const parallel = (name, a, b, c, d) => assertions.push({
    id: name, type: 'parallel', a: coords(...a), b: coords(...b), c: coords(...c), d: coords(...d),
  })
  const inside = (name, x, y, container) => assertions.push({
    id: name, type: 'inside', point: coords(x, y), container, margin: 3,
  })
  const group = (sourceId, description, mapped, mappedAssertions = []) => inventory.push({
    id: sourceId, description, objects: mapped, assertions: mappedAssertions,
  })
  return {
    id, height, objects, assertions, inventory, coords, obj, poly, rect, ellipse, circle, seg, text,
    distance, parallel, inside, group,
    finish: () => ({
      schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
      source: {
        image: { path: path.join(scratch, id, 'source.png'), sha256: hash(path.join(scratch, id, 'source.png')) },
        authoritativeText: authority().prose.filter(p => p.text?.trim()).map(p => ({ lesson: 'phy9-c2-s2-n82', text: p.text })),
        inventory,
      },
      canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
      display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
      objects, assertions,
    }),
  }
}

function fig155() {
  const b = builder('fig-155', 810, 'Two source paper-capacitor packages with their terminals and mounting feet, plus an explicitly added winding detail from the complete frozen edition text.')
  const { poly, rect, ellipse, circle, seg, text, group, distance, inside } = b
  text('paper-heading', 320, 27, 'Paper capacitors')
  const feet = [
    poly('155-foot-left', [[104, 380], [177, 371], [183, 394], [110, 407]], 'muted'),
    poly('155-foot-right', [[275, 363], [335, 355], [342, 377], [282, 388]], 'muted'),
    ellipse('155-foot-hole', 133, 391, 12, 5),
  ]
  const caseIds = [
    poly('155-case-side', [[103, 141], [141, 161], [141, 385], [103, 365]], 'grid'),
    poly('155-case-front', [[141, 161], [341, 140], [341, 366], [141, 385]], 'paper'),
    poly('155-case-lid', [[103, 141], [139, 118], [337, 104], [357, 125], [341, 140], [141, 161]], 'grid'),
    seg('155-lid-seam', [142, 170], [336, 150], 'muted', 2),
    seg('155-bottom-seam', [144, 374], [336, 356], 'muted', 2),
  ]
  group('155-large-case', 'Upper independent rectangular case, perspective lid/side and body seams; no claim of a photographic reproduction.', caseIds)
  group('155-mounting-feet', 'Two mounting feet; left foot retains its hole.', feet)
  const terminals = []
  for (const [i, x, y] of [[1, 172, 119], [2, 290, 110]]) {
    terminals.push(ellipse(`155-insulator-${i}`, x, y, 21, 9, 'muted'))
    terminals.push(poly(`155-lug-${i}`, [[x - 8, y], [x - 8, y - 56], [x + 11, y - 60], [x + 11, y - 14], [x + 27, y - 6]], 'grid'))
    terminals.push(circle(`155-lug-eye-${i}`, x + 1, y - 44, 5))
  }
  distance('155-terminal-separation', [172, 119], [290, 110], Math.hypot(118, 9))
  group('155-top-terminals', 'Two separate upright eye lugs on individual insulating bases, not electrically connected.', terminals, ['155-terminal-separation'])
  rect('155-neutral-marking-panel', 163, 214, 151, 102, 'grid', 'muted', 1.8)
  text('155-panel-label', 239, 257, 'Paper')
  inside('155-marking-inside', 239, 257, '155-case-front')
  group('155-marking-panel', 'Source print occupies the front panel. Modern English identification replaces unreadable manufacturer lettering and emblem, not numerical ratings.', ['155-neutral-marking-panel', '155-panel-label'], ['155-marking-inside'])
  const small = [
    poly('155-axial-body', [[410, 329], [539, 296], [559, 309], [555, 350], [424, 384], [405, 370]], 'paper'),
    ellipse('155-axial-end', 417, 355, 14, 28, 'grid'),
    seg('155-axial-right-rim', [543, 303], [547, 351], 'muted', 2),
  ]
  const leads = [
    seg('155-axial-left-wire', [405, 355], [366, 377], 'ink', 4, true),
    seg('155-axial-right-wire', [559, 326], [600, 311], 'ink', 4, true),
  ]
  group('155-small-axial-case', 'Second separate short cylindrical package, tilted rising-right, visible end cap and sleeve rim.', small)
  group('155-axial-leads', 'One lead at each opposite end, independent of the larger case.', leads, leads.map(x => `${x}-connection`))
  poly('155-neutral-axial-panel', [[441, 327], [523, 306], [530, 335], [448, 356]], 'grid', 'muted', 1.5)
  group('155-small-markings', 'Source sleeve print retained as a neutral panel without invented ratings or Cyrillic.', ['155-neutral-axial-panel'])
  text('155-winding-title', 320, 455, 'Wound layers')
  const windingIds = [circle('155-winding-paper', 188, 648, 105, 'paper')]
  // Two interleaved spirals remain separated by paper throughout the detail.
  for (const [i, phase, role] of [[1, 0, 'ink'], [2, Math.PI, 'muted']]) {
    const points = Array.from({ length: 401 }, (_, j) => {
      const t = j / 400 * 6 * Math.PI
      const r = 9 + 4.5 * t
      return [188 + r * Math.cos(t + phase), 648 + r * Math.sin(t + phase)]
    })
    windingIds.push(b.obj({
      id: `155-foil-spiral-${i}`, type: 'svgPath',
      d: points.map(([x, y], j) => `${j ? 'L' : 'M'} ${x.toFixed(3)} ${y.toFixed(3)}`).join(' '),
      stroke: role, strokeWidth: 3, fill: 'paper', fillOpacity: 0,
    }))
  }
  for (const [name, y, fill] of [['foil-a', 535, 'ink'], ['paper-a', 542, 'paper'], ['foil-b', 557, 'muted'], ['paper-b', 564, 'paper']]) {
    windingIds.push(rect(`155-unwound-${name}`, 315, y, 252, name.startsWith('foil') ? 5 : 12, fill, name.startsWith('foil') ? fill : 'muted', 1.2))
  }
  text('155-foil-label', 441, 610, 'Metal foil')
  text('155-paper-label', 441, 686, 'Insulating paper')
  seg('155-foil-leader', [428, 585], [428, 559], 'muted', 1.8, true)
  seg('155-paper-leader', [508, 665], [508, 571], 'muted', 1.8, true)
  distance('155-foil-gap', [420, 540], [420, 557], 17)
  group('155-modern-winding-detail', 'MODERN ADDITION, not source pixels: enlarged roll and alternating two foil/paper strips derive from the full current edition paragraph. Winding size and turn count are schematic, not measured givens.', [...windingIds, '155-foil-label', '155-paper-label', '155-foil-leader', '155-paper-leader'], ['155-foil-gap', '155-foil-leader-connection', '155-paper-leader-connection'])
  return b
}

function fig156() {
  const b = builder('fig-156', 690, 'Complete open-frame air-variable capacitor: ribbed knob and spindle, bearings, fixed and rotating interleaving plate banks, two side posts, front connection post, open braced upper/lower frames and noncontact air gaps.')
  const { rect, poly, ellipse, seg, text, group, distance, parallel } = b
  text('156-heading', 320, 28, 'Air-variable capacitor')
  const lower = [
    poly('156-lower-frame', [[67, 502], [209, 468], [577, 519], [424, 564]], 'paper', 'ink', 4),
    poly('156-lower-open-left', [[102, 504], [209, 483], [220, 542]], 'paper', 'muted', 2),
    poly('156-lower-open-right', [[241, 489], [541, 520], [425, 548]], 'paper', 'muted', 2),
  ]
  group('156-lower-frame', 'Open lower frame preserves perimeter, diagonal braces and fastener locations.', lower)
  const posts = []
  for (const [i, x] of [[1, 75], [2, 568]]) {
    posts.push(rect(`156-side-post-${i}`, x - 8, 193, 16, 332, 'grid'))
    for (const y of [194, 224, 503, 535]) posts.push(ellipse(`156-side-collar-${i}-${y}`, x, y, 16, 6, 'muted'))
  }
  parallel('156-side-post-parallel', [75, 193], [75, 525], [568, 193], [568, 525])
  group('156-side-posts', 'Two complete side frame posts and upper/lower collars/fasteners.', posts, ['156-side-post-parallel'])
  const fixed = []
  const moving = []
  // Twelve layers are an explicit modern regularization, not an inferred source count.
  for (let i = 11; i >= 0; i--) {
    const y = 263 + i * 17
    fixed.push(poly(`156-fixed-plate-${i}`, [[91, y], [197, y - 18], [550, y + 15], [435, y + 41], [91, y + 7]], 'grid', 'muted', 1.7))
    fixed.push(seg(`156-fixed-edge-${i}`, [91, y + 7], [435, y + 41], 'ink', 1.9))
    const v = y + 8
    moving.push(poly(`156-moving-plate-${i}`, [[201, v - 13], [435, v + 60], [466, v + 42], [227, v - 20]], 'paper', 'ink', 1.8))
    moving.push(seg(`156-moving-edge-${i}`, [201, v - 13], [435, v + 60], 'muted', 1.7))
    distance(`156-layer-air-gap-${i}`, [307, y + 14], [307, y + 20], 6)
  }
  parallel('156-fixed-layer-parallel', [91, 263], [197, 245], [91, 280], [197, 262])
  parallel('156-moving-layer-parallel', [201, 258], [435, 331], [201, 275], [435, 348])
  group('156-fixed-bank', 'Fixed repeated thin plates supported by the frame. Twelve schematic layers preserve the many-layer source bank, not an original exact count.', fixed, ['156-fixed-layer-parallel'])
  group('156-rotating-bank', 'Second partial-overlap bank, projects front-right from shaft and interleaves rather than sitting apart from the fixed plates.', moving, ['156-moving-layer-parallel'])
  group('156-air-gaps', 'Clear spaces between thin plates; regularized illustration uses nonzero separation and no solid dielectric slab.', [...fixed, ...moving], Array.from({ length: 12 }, (_, i) => `156-layer-air-gap-${i}`))
  const front = [
    rect('156-front-post', 433, 335, 17, 234, 'grid'),
    ellipse('156-front-screw', 441.5, 332, 15, 7, 'muted'),
  ]
  for (let i = 0; i < 12; i++) front.push(ellipse(`156-front-spacer-${i}`, 441.5, 350 + i * 17, 13, 4, 'paper', 'muted', 1.6))
  front.push(ellipse('156-front-bottom-collar', 441.5, 569, 17, 6, 'muted'))
  group('156-front-post', 'Separate front-right connection/support post, top screw and spacer stack, projects below bottom frame.', front)
  const shaft = [
    rect('156-spindle', 199, 114, 14, 432, 'grid'),
    seg('156-knob-shaft-coupling', [206, 114], [206, 159], 'ink', 7, true),
  ]
  group('156-shaft', 'Vertical spindle mechanically couples knob to moving bank and lower bearing.', shaft, ['156-knob-shaft-coupling-connection'])
  const upper = [
    poly('156-upper-frame', [[69, 183], [207, 144], [576, 192], [432, 226]], 'paper', 'ink', 4),
    poly('156-upper-open-left', [[104, 182], [204, 160], [214, 209]], 'paper', 'muted', 2),
    poly('156-upper-open-right', [[239, 163], [538, 192], [431, 210]], 'paper', 'muted', 2),
  ]
  group('156-upper-frame', 'Open braced upper frame around shaft; retains triangular openings rather than a solid lid.', upper)
  const bearings = []
  for (const [i, y] of [[1, 168], [2, 245], [3, 531]]) {
    bearings.push(rect(`156-bearing-body-${i}`, 188, y - 15, 36, 25, 'grid'))
    bearings.push(ellipse(`156-bearing-collar-${i}`, 206, y + 11, 26, 8, 'muted'))
  }
  group('156-bearings', 'Upper/lower bearings and intermediate collar on central shaft.', bearings)
  const knob = [
    poly('156-knob-body', [[151, 89], [160, 114], [238, 124], [261, 105], [255, 80]], 'muted'),
    ellipse('156-knob-top', 206, 83, 55, 20, 'grid'),
  ]
  for (let i = 0; i < 6; i++) knob.push(seg(`156-knob-rib-${i}`, [162 + i * 15, 100], [165 + i * 15, 117], 'paper', 3))
  group('156-knob', 'Large domed/ribbed control knob retained above spindle.', knob)
  text('156-fixed-label', 148, 606, 'Fixed plates')
  text('156-moving-label', 463, 606, 'Moving plates')
  text('156-gap-label', 320, 662, 'Air gaps')
  seg('156-fixed-callout', [148, 580], [128, 464], 'muted', 1.7, true)
  seg('156-moving-callout', [483, 580], [484, 474], 'muted', 1.7, true)
  group('156-modern-identification', 'MODERN ADDITION: plain English labels identify both banks and their air dielectric; no invented numeric scale, settings or polarity.', ['156-fixed-label', '156-moving-label', '156-gap-label', '156-fixed-callout', '156-moving-callout'], ['156-fixed-callout-connection', '156-moving-callout-connection'])
  return b
}

function fig157() {
  const b = builder('fig-157', 740, 'Three source electrolytic-capacitor packages, not an electrolysis experiment: a tall can with bottom terminal/mount, a slanted axial cylinder with two leads, and a shorter can with threaded mounting stud and terminal.')
  const { poly, rect, ellipse, seg, text, group } = b
  text('157-heading', 320, 29, 'Electrolytic capacitors')
  const tall = [
    rect('157-tall-sleeve', 96, 127, 164, 354, 'paper'),
    ellipse('157-tall-top', 178, 127, 82, 25, 'grid'),
    ellipse('157-tall-bottom-rim', 178, 481, 82, 26, 'grid'),
    ellipse('157-tall-seal', 178, 493, 61, 17, 'paper'),
  ]
  const tallBase = [
    poly('157-tall-mount-nut', [[144, 510], [153, 495], [204, 495], [216, 513], [205, 533], [152, 533]], 'grid'),
    rect('157-tall-terminal-base', 166, 534, 25, 31, 'muted'),
    seg('157-tall-terminal-pin', [178, 565], [178, 598], 'ink', 5, true),
    ellipse('157-tall-pin-loop', 178, 600, 6, 13, 'paper'),
  ]
  group('157-tall-can', 'Tall left cylindrical can with upper closure, sleeve and rolled bottom flange.', tall)
  group('157-tall-base', 'Bottom seal, nut, terminal base and projecting axial pin/loop.', tallBase, ['157-tall-terminal-pin-connection'])
  const slender = [
    poly('157-slender-sleeve', [[420, 106], [455, 99], [507, 267], [470, 281]], 'paper'),
    ellipse('157-slender-upper-cap', 437, 106, 19, 12, 'grid'),
    seg('157-slender-lower-seal', [470, 278], [506, 267], 'muted', 2),
  ]
  const leads = [
    seg('157-upper-axial-wire-a', [437, 99], [424, 73], 'ink', 4, true),
    seg('157-upper-axial-wire-b', [424, 73], [402, 56], 'ink', 4, true),
    seg('157-lower-axial-wire-a', [489, 275], [503, 313], 'ink', 4, true),
    seg('157-lower-axial-wire-b', [503, 313], [501, 351], 'ink', 4, true),
    seg('157-lower-axial-wire-c', [501, 351], [481, 379], 'ink', 4, true),
  ]
  group('157-slender-can', 'Separate upper-right slender cylinder with tilted sleeve and end seals.', slender)
  group('157-slender-leads', 'One bent lead from each opposite end of axial package; no inter-package electrical wires.', leads, leads.map(x => `${x}-connection`))
  const short = [
    rect('157-short-sleeve', 399, 426, 159, 123, 'paper'),
    ellipse('157-short-top-rim', 478.5, 426, 79.5, 19, 'grid'),
    ellipse('157-short-top-seal', 478.5, 425, 61, 11, 'paper'),
    ellipse('157-short-bottom-rim', 478.5, 549, 79.5, 22, 'grid'),
  ]
  const shortBase = [
    poly('157-short-mount-nut', [[442, 573], [454, 558], [503, 558], [515, 576], [503, 592], [453, 592]], 'grid'),
    rect('157-threaded-mount-stud', 458, 592, 40, 62, 'grid'),
    seg('157-short-terminal', [478, 654], [478, 684], 'ink', 4, true),
  ]
  for (let i = 0; i < 7; i++) shortBase.push(seg(`157-thread-${i}`, [456, 598 + i * 8], [501, 594 + i * 8], 'muted', 2))
  group('157-short-can', 'Shorter lower-right upright can, upper cap/rim and lower rolled flange retained.', short)
  group('157-short-base', 'Bottom nut, threaded mounting stud with multiple ridges and separate narrow terminal extension.', shortBase, ['157-short-terminal-connection'])
  const panels = [
    rect('157-tall-neutral-panel', 119, 247, 117, 107, 'grid', 'muted', 1.5),
    poly('157-slender-neutral-panel', [[439, 154], [461, 148], [487, 234], [464, 241]], 'grid', 'muted', 1.2),
    rect('157-short-neutral-panel', 422, 459, 112, 61, 'grid', 'muted', 1.5),
  ]
  group('157-print', 'Neutral panels preserve print locations on all three sleeves. Source ratings are not task givens; no guessed manufacturer/type/date text or invented modern voltage/capacitance values.', panels)
  text('157-axial-label', 378, 334, 'Axial leads')
  seg('157-axial-callout', [453, 336], [494, 329], 'muted', 1.7, true)
  text('157-mount-label', 235, 664, 'Mounting stud')
  seg('157-stud-callout', [362, 647], [456, 627], 'muted', 1.7, true)
  group('157-modern-identification', 'MODERN ADDITION: English component labels, no fabricated terminal polarity and no experiment/cutaway.', ['157-axial-label', '157-axial-callout', '157-mount-label', '157-stud-callout'], ['157-axial-callout-connection', '157-stud-callout-connection'])
  return b
}

function prepare() {
  authority()
  const rawInventory = load(path.join(scratch, 'source-inventory.json'))
  const inputs = {
    lessonTemplate: snapshot(templatePath, path.join(scratch, 'inputs/lesson.template.json')),
    proseFreeze: snapshot(proseFreezePath, path.join(scratch, 'inputs/9p-n82-prose-freeze.json')),
  }
  for (const id of ['fig-155', 'fig-156', 'fig-157']) {
    inputs[id] = snapshot(path.join(root, `ssot-resources/soviet10year-textbooks/artifacts/9p/figures/${id}.png`), path.join(scratch, id, 'source.png'))
  }
  save(path.join(scratch, 'input-bindings.json'), inputs)
  for (const b of [fig155(), fig156(), fig157()]) {
    const specPath = path.join(scratch, b.id, 'initial/spec.json')
    if (fs.existsSync(specPath)) throw new Error('initial spec already exists; never restart an attempt')
    const spec = b.finish()
    save(specPath, spec)
    save(path.join(scratch, b.id, 'context.json'), {
      schema: 'ld-s10y-image/context@1', figure: b.id, book: '9p', edition: 'modern-us-neutral',
      sourceImage: inputs[b.id], completeLessonTemplate: authority(),
      authoritativeTextPolicy: 'Complete exact current lesson.template.json, not nearby-text truncation or stale durable edition; frozen byte-for-byte.',
      proseFreeze: inputs.proseFreeze, lessonTemplate: inputs.lessonTemplate,
      originalPixelInventory: rawInventory.figures[b.id],
      inventoryMapping: spec.source.inventory,
      routing: {
        mode: 'deterministic', renderer: 'existing JSXGraph renderer',
        rationale: 'Regularized source-preserving engineering geometry retains every visible package or apparatus component; no photograph is claimed and no generic icon substitutes for complex apparatus.',
        artworkGeneration: 'not needed', paidGenerationInvocations: 0, newSpend: 0,
        displayPurpose: 'instructional',
      },
    })
  }
}

function native(id, attempt) {
  authority()
  const dir = path.join(scratch, id, attempt)
  const spec = path.join(dir, 'spec.json')
  const historyPath = path.join(scratch, id, 'attempt-history.json')
  const history = fs.existsSync(historyPath) ? load(historyPath) : []
  if (history.some(h => h.attempt === attempt)) throw new Error('attempt already consumed')
  if (history.length >= 2 || (attempt === 'repair' && history.length !== 1)) throw new Error('repair budget exceeded')
  const args = [path.join(skill, 'scripts/render_spec.mjs'), '--spec', spec, '--svg', path.join(dir, `${id}.svg`), '--report', path.join(dir, 'render.json')]
  const env = { ...process.env }
  delete env.PWDEBUG
  const command = {
    command: ['node', ...args], cwd: root, attempt,
    validationPolicy: 'Exactly one native renderer invocation; renderer internally calls validate_spec.py once at draft stage.',
    browserPolicy: 'Isolated headless Chromium; PWDEBUG unset; no CDP, profile, visible windows, system input or HTML auto-open; native renderer closes browser in finally.',
    tools: [bind(path.join(skill, 'scripts/render_spec.mjs')), bind(path.join(skill, 'scripts/validate_spec.py'))],
  }
  save(path.join(dir, 'render-command.json'), command)
  const result = spawnSync(process.execPath, args, { cwd: root, env, encoding: 'utf8', timeout: 120000 })
  const report = fs.existsSync(path.join(dir, 'render.json')) ? load(path.join(dir, 'render.json')) : null
  const entry = {
    attempt, spec: bind(spec), exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
    nativeValidationInvocations: 1, nativeRenderInvocations: 1,
    status: result.status === 0 && report?.status === 'pass' ? 'native-pass-awaiting-independent-review' : 'native-fail',
    render: report ? bind(path.join(dir, 'render.json')) : null,
  }
  history.push(entry)
  save(historyPath, history)
  save(path.join(scratch, id, 'current-attempt.json'), { attempt, status: entry.status })
  console.log(JSON.stringify({ figure: id, ...entry }))
}

function repair156() {
  const id = 'fig-156'
  const history = load(path.join(scratch, id, 'attempt-history.json'))
  const repairDir = path.join(scratch, id, 'repair')
  if (history.length !== 1 || fs.existsSync(repairDir)) throw new Error('only one targeted repair is allowed')
  const spec = load(path.join(scratch, id, 'initial/spec.json'))
  const endpoint = [410, spec.canvas.height - 510.2]
  const leader = spec.objects.find(o => o.id === '156-moving-callout')
  const assertion = spec.assertions.find(a => a.id === '156-moving-callout-connection')
  const before = structuredClone({ leader, assertion })
  leader.to = endpoint
  assertion.to = endpoint
  save(path.join(repairDir, 'spec.json'), spec)
  save(path.join(repairDir, 'targeted-repair.json'), {
    figure: id, repairNumber: 1,
    trigger: 'Author inspection of initial 331px preview found Moving plates callout ended in fixed-bank region.',
    scope: 'Only moving-callout endpoint and its matching connects assertion; no plate geometry or source/authority changes.',
    before, after: { leader, assertion },
    priorPreview: bind(path.join(scratch, id, 'previews/w331.png')),
    limit: 'One targeted repair; if native or visual result still fails, stop figure.',
  })
}

async function previews(target) {
  const require = createRequire(path.join(root, 'app/package.json'))
  const { chromium } = require('playwright')
  delete process.env.PWDEBUG
  const browser = await chromium.launch({ headless: true })
  try {
    for (const id of target ? [target] : ['fig-155', 'fig-156', 'fig-157']) {
      const current = load(path.join(scratch, id, 'current-attempt.json'))
      if (current.status !== 'native-pass-awaiting-independent-review') continue
      const dir = path.join(scratch, id, current.attempt)
      const spec = load(path.join(dir, 'spec.json'))
      const svgPath = path.join(dir, `${id}.svg`)
      const previewDir = current.attempt === 'repair' ? path.join(dir, 'previews') : path.join(scratch, id, 'previews')
      const svg = fs.readFileSync(svgPath, 'utf8')
      const evidence = {
        figure: id, svg: bind(svgPath), spec: bind(path.join(dir, 'spec.json')),
        policy: 'Standalone isolated headless width preview, not headed product acceptance; all images saved without opening them in the author context.',
        viewportPolicy: 'viewport equals actual media width; inline SVG occupies exact 640/331/342 CSS px, maxWidth640; no scroll layout.',
        browser: { headless: true, PWDEBUG: 'unset', persistentProfile: false, CDP: false, sessionsClosed: true },
        errors: [], widths: [],
      }
      const context = await browser.newContext({ deviceScaleFactor: 1 })
      const page = await context.newPage()
      page.on('pageerror', e => evidence.errors.push(e.message))
      for (const width of [640, 331, 342]) {
        await page.setViewportSize({ width, height: Math.ceil(spec.canvas.height * width / 640) })
        await page.setContent(`<html><head><style>html,body{margin:0;padding:0;background:white}svg{display:block;width:100%;height:auto;max-width:640px}</style></head><body>${svg}</body></html>`)
        const metrics = await page.evaluate(() => {
          const svg = document.querySelector('svg')
          const rect = svg.getBoundingClientRect()
          return {
            mediaWidthPx: rect.width, mediaHeightPx: rect.height,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
            paths: svg.querySelectorAll('path,polygon,circle,ellipse,line').length,
            texts: [...svg.querySelectorAll('text')].map(t => {
              const matrix = t.getScreenCTM()
              const box = t.getBoundingClientRect()
              return {
                text: t.textContent,
                finalFontPx: parseFloat(getComputedStyle(t).fontSize) * Math.hypot(matrix.a, matrix.b),
                clipped: box.left < -0.2 || box.right > innerWidth + 0.2 || box.top < -0.2 || box.bottom > innerHeight + 0.2,
              }
            }),
          }
        })
        if (metrics.mediaWidthPx !== width || metrics.horizontalOverflow || !metrics.paths || metrics.texts.some(t => t.finalFontPx < 16 || t.clipped)) throw new Error(`${id} preview width ${width} failed: ${JSON.stringify(metrics)}`)
        const output = path.join(previewDir, `w${width}.png`)
        fs.mkdirSync(path.dirname(output), { recursive: true })
        await page.screenshot({ path: output, animations: 'disabled' })
        evidence.widths.push({ width, ...metrics, screenshot: bind(output), authorOpened: false })
      }
      await context.close()
      save(path.join(previewDir, 'width-previews.json'), evidence)
      console.log(JSON.stringify({ figure: id, widths: evidence.widths.map(w => ({ width: w.width, minText: Math.min(...w.texts.map(t => t.finalFontPx)), paths: w.paths })) }))
    }
  } finally {
    await browser.close()
  }
}

function freeze() {
  authority()
  const observations = load(path.join(scratch, 'author-observations.json'))
  if (observations.imageOpenHistory.length > 8 || observations.totalContextImageHistory > 24) throw new Error('image budget exceeded')
  for (const id of ['fig-155', 'fig-156', 'fig-157']) {
    const history = load(path.join(scratch, id, 'attempt-history.json'))
    for (const entry of history) {
      const command = load(path.join(scratch, id, entry.attempt, 'render-command.json'))
      for (const tool of command.tools) {
        if (hash(tool.path) !== tool.sha256) throw new Error(`native tool changed since invocation: ${tool.path}`)
      }
      const reportPath = path.join(scratch, id, entry.attempt, 'render.json')
      if (!fs.existsSync(reportPath)) continue
      const report = load(reportPath)
      if (hash(path.resolve(root, report.spec.path)) !== report.spec.sha256 ||
          hash(path.resolve(root, report.output.svg.path)) !== report.output.svg.sha256) {
        throw new Error(`${id} ${entry.attempt} render bindings changed`)
      }
    }
  }
  const tools = [
    'SKILL.md', 'references/routing.md', 'references/figure-spec.md', 'references/quality-gate.md',
    'assets/figure-spec.schema.json', 'scripts/build_context.py', 'scripts/render_spec.mjs',
    'scripts/validate_spec.py', 'scripts/materialize_arrowheads.mjs',
  ].map(p => snapshot(path.join(skill, p), path.join(scratch, 'frozen-tools', p)))
  for (const [name, p] of [
    ['jsxgraph-core.js', '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js'],
    ['jsxgraph.css', '.agents/skills/node_modules/jsxgraph/distrib/jsxgraph.css'],
    ['jsxgraph-package.json', '.agents/skills/node_modules/jsxgraph/package.json'],
    ['playwright-package.json', 'app/node_modules/playwright/package.json'],
    ['playwright-core-package.json', '.agents/skills/node_modules/playwright-core/package.json'],
  ]) tools.push(snapshot(path.join(root, p), path.join(scratch, 'frozen-tools/runtime', name)))
  const files = []
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(p)
      else if (entry.name !== 'author-freeze.json') files.push(bind(p))
    }
  }
  walk(scratch)
  save(path.join(scratch, 'author-freeze.json'), {
    schema: 'ld-s10y-image/author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D021',
    createdAt: new Date().toISOString(),
    figures: ['fig-155', 'fig-156', 'fig-157'],
    status: 'author-frozen-awaiting-independent-image-review',
    approval: { independentReview: 'not performed', selfApproval: false, promotable: false, reviewFileWritten: false },
    ownership: { onlyWritableRoot: scratch, noSharedEdits: true, sourceOrTemplateEdits: false, durablePromotion: false, adaptFinalize: false, scienceApproval: false, database: false, git: false, fullChecks: false },
    inputs: load(path.join(scratch, 'input-bindings.json')),
    completeContextPolicy: 'Full exact current lesson template and prose author freeze retained byte-for-byte; source PNGs copied unchanged; full edition text is present in each spec and context.',
    sourceInterpretation: '155 two paper-capacitor packages plus edition-derived winding addition; 156 full mechanical air-variable capacitor; 157 three electrolytic-capacitor packages, not an electrolysis experiment.',
    spend: { paidGenerationInvocations: 0, newSpend: 0, artworkRequired: false },
    observations,
    observationPolicy: 'width-previews.json authorOpened fields describe capture time; the final author image-open ledger in observations supersedes them. Full-width and342px images remain uninspected.',
    results: Object.fromEntries(['fig-155', 'fig-156', 'fig-157'].map(id => [id, {
      current: load(path.join(scratch, id, 'current-attempt.json')),
      history: load(path.join(scratch, id, 'attempt-history.json')),
      context: bind(path.join(scratch, id, 'context.json')),
      previews: bind(path.join(scratch, id, load(path.join(scratch, id, 'current-attempt.json')).attempt === 'repair' ? 'repair/previews/width-previews.json' : 'previews/width-previews.json')),
    }])),
    tools,
    runtime: { node: process.version, browserPolicy: 'All native renderer and width-preview sessions were isolated headless and closed; PWDEBUG unset.' },
    files: files.sort((a, b) => a.path.localeCompare(b.path)),
  })
  console.log(JSON.stringify(bind(path.join(scratch, 'author-freeze.json'))))
}

const [command, id, attempt = 'initial'] = process.argv.slice(2)
if (command === 'prepare') prepare()
else if (command === 'native') native(id, attempt)
else if (command === 'repair156') repair156()
else if (command === 'previews') await previews(id)
else if (command === 'freeze') freeze()
else throw new Error('Use prepare, native <figure> [initial|repair], previews, or freeze')
