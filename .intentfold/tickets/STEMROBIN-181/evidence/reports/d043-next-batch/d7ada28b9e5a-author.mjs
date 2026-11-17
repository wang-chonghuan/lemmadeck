import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const ticket = path.dirname(path.dirname(owned))
const skill = path.join(workspace, '.agents/skills/ld-s10y-image')
const widths = [640, 358, 331, 310]
const hash = filename => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'))
const bind = filename => ({ path: path.resolve(filename), sha256: hash(filename) })
const target = relative => {
  const filename = path.resolve(owned, relative)
  assert(filename.startsWith(`${owned}/`), 'Write escaped assigned ownership.')
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  return filename
}
const write = (relative, data) => {
  const filename = target(relative)
  fs.writeFileSync(filename, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  return bind(filename)
}
const inputPaths = {
  repairFreeze: path.join(ticket, 'tmp/d042-10p-n37-text-repair/repair-freeze.json'),
  affectedReview: path.join(ticket, 'tmp/d042-10p-n37-science-affected-review.json'),
  consumedSource: path.join(ticket, 'evidence/reports/d040-source104-107-consumed.json'),
  zh: path.join(ticket, 'tmp/d042-10p-n37-text-repair/zh/lesson.template.json'),
  en: path.join(ticket, 'tmp/d042-10p-n37-text-repair/en/lesson.template.json'),
}
const expected = {
  repairFreeze: '040c999659a9c732a0039eae5c24b3c7fb8e72e56657321d9faa2e1d57800b79',
  affectedReview: 'efa24ec31ecda7949e6624040126e0972ad21473e137581c5c3c8f1acd3f202a',
  consumedSource: '27bb8ac0505451de28046ee5a3f9c254216aed69e535ba254ef1d3e2a2549ce5',
  zh: '26c8f916243d09116012f9df1c4145633895d594fba3e7f2a565b78b4381225c',
  en: 'ec308f4ff249d64d6045993732d55589214ac177b3ba7bd4100144a82378c63a',
}

function verifyInputs() {
  for (const [key, filename] of Object.entries(inputPaths)) {
    assert.equal(hash(filename), expected[key], `Changed authority: ${key}`)
  }
  const consumed = read(inputPaths.consumedSource)
  assert.equal(consumed.SOURCE, 'PASS')
  assert.equal(consumed.RAW, 'PASS')
  const inventory = read(path.join(owned, 'source-inventory.json'))
  for (const figure of inventory.figures) {
    assert.equal(hash(path.join(workspace, figure.source.path)), figure.source.sha256)
    assert(consumed.outputs.some(item =>
      item.path === figure.source.path && item.sha256 === figure.source.sha256))
  }
  return inventory
}

function authoritativeText() {
  return ['zh', 'en'].map(language => {
    const lesson = read(inputPaths[language])
    return {
      lesson: lesson.id,
      text: `Language: ${language}\n${lesson.printed_title}\n${lesson.prose.map(block =>
        block.kind === 'fig' ? `[${block.id}]` : block.text).join('\n\n')}`,
    }
  })
}

const point = (x, screenY) => [x, 360 - screenY]
const arrow = (id, from, to, strokeWidth = 4) => ({
  id, type: 'arrow', from: point(...from), to: point(...to),
  stroke: 'ink', strokeWidth,
})
const connection = object => ({
  id: `${object.id}-connection`, type: 'connects',
  arrow: object.id, from: object.from, to: object.to,
})
const label = (id, at, text) => ({
  id, type: 'text', at: point(...at), text,
  fontSize: 34, fontWeight: 400, labelColor: 'ink',
  labelPlacement: { position: 'CENTER', offset: [0, 0] },
})
const displacement = (id, from, to, dx, dy) => ({
  id, type: 'displacement', from: point(...from), to: point(...to), dx, dy,
})

function buildSpec(figure, texts) {
  const objects = []
  const assertions = []
  const inventory = []
  const addArrows = values => {
    objects.push(...values)
    assertions.push(...values.map(connection))
  }
  if (figure.id === 'fig-66') {
    addArrows([
      arrow('f66-propagation-arrow', [616, 210], [24, 210], 2.5),
      arrow('f66-vibration-up', [361, 210], [361, 110]),
      arrow('f66-vibration-down', [361, 210], [361, 326]),
    ])
    assertions.push(
      displacement('f66-propagation-leftward', [616, 210], [24, 210], -592, 0),
      displacement('f66-vibration-upward', [361, 210], [361, 110], 0, 100),
      displacement('f66-vibration-downward', [361, 210], [361, 326], 0, -116),
      {
        id: 'f66-perpendicular', type: 'perpendicular',
        a: point(616, 210), b: point(24, 210),
        c: point(361, 110), d: point(361, 326),
      },
    )
    // One qualitative cycle preserves the independently inventoried source topology.
    const samples = Array.from({ length: 81 }, (_, i) => {
      const t = i / 80
      return point(276 + 340 * t, 210 - 100 * Math.sin(2 * Math.PI * t))
        .map(value => Number(value.toFixed(6)))
    })
    const segments = samples.slice(1).map((to, i) => ({
      id: `f66-wave-${String(i).padStart(2, '0')}`,
      type: 'segment', from: samples[i], to, stroke: 'ink', strokeWidth: 3,
    }))
    objects.push(...segments)
    assertions.push(...segments.map(connection),
      { id: 'f66-wave-count', type: 'objectCount', objectType: 'segment', value: 80 },
      {
        id: 'f66-contacts-on-baseline', type: 'collinear',
        a: samples[0], b: samples[40], c: samples[80],
      },
      {
        id: 'f66-crest-on-vibration', type: 'pointOnLine',
        point: samples[20], a: point(361, 110), b: point(361, 326),
      },
      {
        id: 'f66-crest-is-up-tip', type: 'distance',
        a: samples[20], b: point(361, 110), value: 0,
      },
      {
        id: 'f66-contour-end-is-propagation-tail', type: 'distance',
        a: samples[80], b: point(616, 210), value: 0,
      },
    )
    objects.push(
      label('f66-vibration-text', [361, 50], 'Particle motion'),
      label('f66-propagation-text', [145, 150], 'Wave propagation'),
    )
    inventory.push(
      {
        id: 'f66-propagation',
        description: figure.facts[0].observation,
        objects: ['f66-propagation-arrow', 'f66-propagation-text'],
        assertions: ['f66-propagation-arrow-connection', 'f66-propagation-leftward'],
      },
      {
        id: 'f66-wave-contour',
        description: `${figure.facts[1].observation} Modern regularization: smooth qualitative single cycle, not calibrated measurement.`,
        objects: segments.map(item => item.id),
        assertions: [
          ...segments.map(item => `${item.id}-connection`),
          'f66-wave-count', 'f66-contacts-on-baseline',
          'f66-crest-on-vibration', 'f66-crest-is-up-tip',
          'f66-contour-end-is-propagation-tail',
        ],
      },
      {
        id: 'f66-vibration',
        description: figure.facts[2].observation,
        objects: ['f66-vibration-up', 'f66-vibration-down', 'f66-vibration-text'],
        assertions: [
          'f66-vibration-up-connection', 'f66-vibration-down-connection',
          'f66-vibration-upward', 'f66-vibration-downward', 'f66-perpendicular',
          'f66-crest-on-vibration', 'f66-crest-is-up-tip',
        ],
      },
      {
        id: 'f66-labels',
        description: `${figure.facts[3].observation} English equivalents only: Particle motion; Wave propagation.`,
        objects: ['f66-vibration-text', 'f66-propagation-text'],
        assertions: ['f66-label-count'],
      },
    )
  } else {
    addArrows([
      arrow('f67-propagation-arrow', [24, 210], [616, 210], 2.5),
      arrow('f67-vibration-left', [140, 210], [60, 210]),
      arrow('f67-vibration-right', [140, 210], [220, 210]),
    ])
    assertions.push(
      displacement('f67-propagation-rightward', [24, 210], [616, 210], 592, 0),
      displacement('f67-vibration-leftward', [140, 210], [60, 210], -80, 0),
      displacement('f67-vibration-rightward', [140, 210], [220, 210], 80, 0),
      {
        id: 'f67-parallel', type: 'parallel',
        a: point(24, 210), b: point(616, 210),
        c: point(60, 210), d: point(220, 210),
      },
      {
        id: 'f67-shared-baseline-left', type: 'pointOnLine',
        point: point(60, 210), a: point(24, 210), b: point(616, 210),
      },
      {
        id: 'f67-shared-baseline-center', type: 'pointOnLine',
        point: point(140, 210), a: point(24, 210), b: point(616, 210),
      },
      {
        id: 'f67-shared-baseline-right', type: 'pointOnLine',
        point: point(220, 210), a: point(24, 210), b: point(616, 210),
      },
    )
    objects.push(
      label('f67-vibration-text', [149, 145], 'Particle motion'),
      label('f67-propagation-text', [463, 145], 'Wave propagation'),
    )
    inventory.push(
      {
        id: 'f67-propagation',
        description: figure.facts[0].observation,
        objects: ['f67-propagation-arrow', 'f67-propagation-text'],
        assertions: ['f67-propagation-arrow-connection', 'f67-propagation-rightward'],
      },
      {
        id: 'f67-vibration',
        description: figure.facts[1].observation,
        objects: ['f67-vibration-left', 'f67-vibration-right', 'f67-vibration-text'],
        assertions: [
          'f67-vibration-left-connection', 'f67-vibration-right-connection',
          'f67-vibration-leftward', 'f67-vibration-rightward', 'f67-parallel',
          'f67-shared-baseline-left', 'f67-shared-baseline-center', 'f67-shared-baseline-right',
        ],
      },
      {
        id: 'f67-labels',
        description: `${figure.facts[2].observation} English equivalents only: Particle motion; Wave propagation.`,
        objects: ['f67-vibration-text', 'f67-propagation-text'],
        assertions: ['f67-label-count'],
      },
    )
  }
  assertions.push({
    id: `${figure.id.replace('fig-', 'f')}-label-count`,
    type: 'objectCount', objectType: 'text', value: 2,
  })
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id: figure.id, mode: 'deterministic',
    description: figure.id === 'fig-66'
      ? 'One source-bound transverse-wave schematic: leftward propagation, vertical two-ended particle motion through the crest, perpendicular directions and one shared crest/trough contour. No answer, added physical data or explanatory artwork.'
      : 'One source-bound longitudinal-wave direction schematic: rightward propagation and horizontal two-ended particle motion on one shared baseline. Preserve parallelism and collinearity without adding a spring, particles or answers.',
    source: { image: figure.source, authoritativeText: texts, inventory },
    canvas: {
      width: 640, height: 360, boundingBox: [0, 360, 640, 0],
      background: 'paper', keepAspectRatio: true,
    },
    display: {
      layout: 'inline', purpose: 'instructional', maxWidthPx: 640,
      minTextPx: 16, widths,
    },
    objects, assertions, layout: { minLabelGap: 6 },
  }
}

function run(id, executable, args) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd: workspace, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const receipt = {
    executable, args, cwd: workspace, startedAt,
    finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    error: result.error?.message ?? null,
  }
  write(id, receipt)
  return receipt
}

function prepare() {
  const inventory = verifyInputs()
  const text = authoritativeText()
  write('input-bindings.json', {
    schema: 'ld-s10y-image/bounded-author-inputs@1',
    ticket: 'STEMROBIN-181', book: '10p', lesson: 'phy10-c1-s5-n37',
    authoritative: Object.fromEntries(Object.entries(inputPaths).map(([key, filename]) => [key, bind(filename)])),
    sourceInventory: bind(path.join(owned, 'source-inventory.json')),
    sources: inventory.figures.map(item => bind(path.join(workspace, item.source.path))),
    tools: [
      'SKILL.md', 'references/routing.md', 'references/figure-spec.md',
      'references/quality-gate.md', 'assets/figure-spec.schema.json',
      'scripts/validate_spec.py', 'scripts/render_spec.mjs',
      'scripts/materialize_arrowheads.mjs', 'scripts/record_review.py',
    ].map(relative => bind(path.join(skill, relative))),
    existingSourceAndSciencePassConsumed: true,
    sourceGateRerun: false,
    noProductOrCanonicalModification: true,
  })
  write('image-ledger.initial.json', {
    maximum: 8, opened: inventory.figures.map((item, i) => ({
      sequence: i + 1, ...bind(path.join(workspace, item.source.path)),
      role: 'authoritative-original-PNG', tool: 'functions.view_image',
      firsthandObserved: true, beforeFigureSpec: true,
    })),
    opensSoFar: 2, reservedForRepair: 2,
  })
  for (const figure of inventory.figures) {
    write(`${figure.id}/initial/${figure.id}.spec.json`, buildSpec(figure, text))
  }
  console.log(JSON.stringify({ status: 'prepared', figures: inventory.figures.map(item => item.id), imageOpens: 2 }))
}

function render(figure, attempt) {
  verifyInputs()
  assert(['fig-66', 'fig-67'].includes(figure))
  assert(['initial', 'repair-1'].includes(attempt))
  if (attempt === 'repair-1') {
    assert(fs.existsSync(path.join(owned, figure, 'diagnosis.json')), 'Repair requires preserved diagnosis.')
  }
  const prefix = `${figure}/${attempt}`
  const spec = target(`${prefix}/${figure}.spec.json`)
  const validation = run(`${prefix}/validation-command.json`, 'python3', [
    path.join(skill, 'scripts/validate_spec.py'), spec, '--stage', 'rendered', '--json',
  ])
  let renderer = null
  if (validation.exitCode === 0) {
    for (const suffix of ['svg', 'png', 'render.json']) {
      assert(!fs.existsSync(target(`${prefix}/${figure}.${suffix}`)), 'Preserve prior native output.')
    }
    renderer = run(`${prefix}/render-command.json`, 'node', [
      path.join(skill, 'scripts/render_spec.mjs'), '--spec', spec,
      '--svg', target(`${prefix}/${figure}.svg`),
      '--png', target(`${prefix}/${figure}.png`),
      '--report', target(`${prefix}/${figure}.render.json`),
    ])
  }
  const report = target(`${prefix}/${figure}.render.json`)
  const status = validation.exitCode === 0 && renderer?.exitCode === 0
    && fs.existsSync(report) && read(report).status === 'pass' ? 'pass' : 'fail'
  write(`${prefix}/attempt.json`, {
    figure, attempt, status, validationExitCode: validation.exitCode,
    renderExitCode: renderer?.exitCode ?? null,
    spec: bind(spec), validation: bind(target(`${prefix}/validation-command.json`)),
    renderer: renderer ? bind(target(`${prefix}/render-command.json`)) : null,
    report: fs.existsSync(report) ? bind(report) : null,
    geometryRenderer: 'Existing ld-s10y-image JSXGraph renderer; internal offline rendering only, no app/browser session or server.',
    independentReview: 'pending', wholeCardApproval: false,
  })
  verifyInputs()
  console.log(JSON.stringify({ figure, attempt, status }))
}

function snapshots(figure, attempt) {
  assert(['fig-66', 'fig-67'].includes(figure))
  const prefix = `${figure}/${attempt}`
  const svg = target(`${prefix}/${figure}.svg`)
  const existingRequire = createRequire(path.join(workspace, '.claude/skills/ld-s10y-lesson/package.json'))
  const { Resvg } = existingRequire('@resvg/resvg-js')
  const original = fs.readFileSync(svg)
  const source = original.toString('utf8')
  // Raster-only neutral palette resolution; the native SVG stays byte-identical.
  const neutral = source
    .replaceAll('var(--ld-figure-ink, #15201f)', '#15201f')
    .replaceAll('var(--ld-figure-paper, #ffffff)', '#ffffff')
  const records = widths.map(width => {
    const filename = target(`${prefix}/snapshots/${figure}-${width}.png`)
    const png = new Resvg(neutral, {
      background: '#ffffff', fitTo: { mode: 'width', value: width },
      font: { loadSystemFonts: true, defaultFontFamily: 'Arial' },
    }).render().asPng()
    fs.writeFileSync(filename, png, { flag: 'wx' })
    return { width, ...bind(filename), openedByScript: false }
  })
  assert.equal(hash(svg), crypto.createHash('sha256').update(original).digest('hex'))
  write(`${prefix}/snapshots.json`, {
    figure, attempt, svg: bind(svg), snapshots: records,
    renderer: 'Existing @resvg/resvg-js from ld-s10y-lesson; raster-only, no geometry rerender or browser.',
    svgBytesUnchanged: true, newImageOpens: 0,
    actualTextBoundsAuthority: bind(target(`${prefix}/${figure}.render.json`)),
    wholeCardApproval: false,
  })
  console.log(JSON.stringify({ figure, attempt, snapshotsCreated: records.length, imageOpens: 0 }))
}

const [action, figure, attempt = 'initial'] = process.argv.slice(2)
assert(!fs.existsSync(path.join(owned, 'author-freeze.json')), 'Author freeze is immutable.')
if (action === 'prepare') prepare()
else if (action === 'render') render(figure, attempt)
else if (action === 'snapshots') snapshots(figure, attempt)
else throw new Error(`Unsupported action: ${action}`)
