import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../../../..')
const ticketTmp = path.dirname(own)
const book = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p')
const skill = path.join(repo, '.agents/skills/ld-s10y-image')
const lessonId = 'phy9-c2-s3-n86'
const ids = ['fig-165', 'fig-166']
const expectedFreeze = 'c0322939652ee0f5f1454eb4823b8c41c89592144008e876f46da0124342a56b'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const evidence = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const local = relative => path.join(own, relative)
function write(file, value) {
  assert.ok(path.resolve(file).startsWith(`${own}/`), 'write escaped ownership')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
function copy(from, to) {
  assert.ok(path.resolve(to).startsWith(`${own}/`), 'copy escaped ownership')
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
  assert.equal(hash(from), hash(to))
  return { original: evidence(from), snapshot: evidence(to) }
}
const env = { ...process.env }
delete env.PWDEBUG
const receiptsFile = local('native-calls.json')
function native(name, executable, args, inputs, outputs) {
  const start = new Date().toISOString()
  const inputEvidence = inputs.map(evidence)
  const result = spawnSync(executable, args, { cwd: repo, env, encoding: 'utf8', timeout: 120000, maxBuffer: 4 * 1024 * 1024 })
  const receipt = {
    name, executable, argv: args, cwd: repo,
    environment: { PWDEBUG: 'unset', headless: true, isolated: true },
    startedAt: start, finishedAt: new Date().toISOString(),
    status: result.status, signal: result.signal, error: result.error?.message ?? null,
    inputs: inputEvidence, outputs: outputs.filter(fs.existsSync).map(evidence),
    stdout: result.stdout ?? '', stderr: result.stderr ?? ''
  }
  write(local(`receipts/${name}.json`), receipt)
  const calls = fs.existsSync(receiptsFile) ? read(receiptsFile) : []
  calls.push(receipt)
  write(receiptsFile, calls)
  console.log(`${name}: exit ${result.status}\n${result.stdout ?? ''}${result.stderr ?? ''}`)
  return result.status === 0
}
function text(id, at, value, fontSize = 32) {
  return { id, type: 'text', at, text: value, fontSize, fontWeight: 500, labelPlacement: { position: 'CENTER' }, labelColor: 'ink' }
}
function line(id, from, to, extra = {}) {
  return { id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, ...extra }
}
function arrow(id, from, to, extra = {}) {
  return { id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3.5, ...extra }
}
const connects = object => ({ id: `${object.id}-connects`, type: 'connects', arrow: object.id, from: object.from, to: object.to })
function displacement(id, from, to) {
  return { id, type: 'displacement', from, to, dx: to[0] - from[0], dy: to[1] - from[1] }
}
function makeSpec(id, height, objects, assertions) {
  const inventory = read(local('source-inventory.json')).figures[id]
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: id === 'fig-165'
      ? 'Compare opposite current directions in two separate conductors under one explicitly chosen left-to-right positive convention.'
      : 'Inspect particle drift through a full conductor: sections 1 and 2, cross-sectional area S, carrier charge q0, number density n, rightward vector v and the two-headed section spacing delta l.',
    source: {
      image: { path: path.join(book, `figures/${id}.png`), sha256: hash(path.join(book, `figures/${id}.png`)) },
      authoritativeText: read(local('inputs/complete-modern-text.json')),
      inventory: inventory.sourceFacts
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
    objects, assertions, layout: { minLabelGap: 4 }
  }
}
function spec165() {
  const height = 480
  const p = (x, y) => [x, height - y]
  const objects = []
  for (const [name, cy] of [['first', 180], ['second', 370]]) {
    const prefix = `165-${name}`
    objects.push(
      { id: `${prefix}-left-face`, type: 'svgPath', d: `M 110 ${cy - 38} A 22 38 0 1 0 110 ${cy + 38} A 22 38 0 1 0 110 ${cy - 38}`, stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 0 },
      line(`${prefix}-top`, p(110, cy - 38), p(530, cy - 38)),
      line(`${prefix}-bottom`, p(110, cy + 38), p(530, cy + 38)),
      { id: `${prefix}-right-end`, type: 'svgPath', d: `M 530 ${cy - 38} A 22 38 0 0 1 530 ${cy + 38}`, stroke: 'ink', strokeWidth: 3 }
    )
  }
  const positive = arrow('165-positive-arrow', p(420, 40), p(554, 40))
  const first = arrow('165-first-current', p(230, 180), p(390, 180), { strokeWidth: 4 })
  const second = arrow('165-second-current', p(390, 370), p(230, 370), { strokeWidth: 4 })
  objects.push(
    positive, first, second,
    text('165-positive-label', p(231, 40), 'Positive direction'),
    text('165-first-sign', p(320, 104), 'I > 0'),
    text('165-second-sign', p(320, 294), 'I < 0')
  )
  const assertions = [
    { ...connects(positive), id: '165-positive-connects' },
    displacement('165-positive-right', positive.from, positive.to),
    { ...connects(first), id: '165-first-current-connects' },
    displacement('165-first-current-right', first.from, first.to),
    { ...connects(second), id: '165-second-current-connects' },
    displacement('165-second-current-left', second.from, second.to),
    { id: '165-current-parallel', type: 'parallel', a: first.from, b: first.to, c: second.from, d: second.to },
    { id: '165-first-body-parallel', type: 'parallel', a: p(110, 142), b: p(530, 142), c: p(110, 218), d: p(530, 218) },
    { id: '165-second-body-parallel', type: 'parallel', a: p(110, 332), b: p(530, 332), c: p(110, 408), d: p(530, 408) },
    { id: '165-same-body-length', type: 'equalDistance', a: p(110, 142), b: p(530, 142), c: p(110, 332), d: p(530, 332) }
  ]
  return makeSpec('fig-165', height, objects, assertions)
}
function spec166() {
  const height = 600
  const p = (x, y) => [x, height - y]
  const left = 60, right = 578, s1 = 202, s2 = 470, top = 180, bottom = 330, cy = 255
  const objects = [
    { id: '166-left-face', type: 'svgPath', d: `M ${left} ${top} A 22 75 0 1 0 ${left} ${bottom} A 22 75 0 1 0 ${left} ${top}`, stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 0 },
    line('166-top', p(left, top), p(right, top)),
    line('166-bottom', p(left, bottom), p(right, bottom)),
    { id: '166-right-end', type: 'svgPath', d: `M ${right} ${top} A 22 75 0 0 1 ${right} ${bottom}`, stroke: 'ink', strokeWidth: 3 }
  ]
  // Clip each deterministic hatch chord algebraically to the oval.
  for (let i = 0; i < 6; i++) {
    const offset = -50 + i * 20
    const slope = -1.8
    const a = 1 / 22 ** 2 + slope ** 2 / 75 ** 2
    const b = 2 * slope * offset / 75 ** 2
    const c = offset ** 2 / 75 ** 2 - 1
    const d = Math.sqrt(b * b - 4 * a * c)
    const x1 = (-b - d) / (2 * a), x2 = (-b + d) / (2 * a)
    objects.push(line(`166-left-hatch-${i}`, p(left + x1, cy + slope * x1 + offset), p(left + x2, cy + slope * x2 + offset), { strokeWidth: 2 }))
  }
  for (const [name, x, numeral] of [['section1', s1, '1'], ['section2', s2, '2']]) {
    objects.push(
      { id: `166-${name}-back`, type: 'svgPath', d: `M ${x} ${top} A 22 75 0 0 0 ${x} ${bottom}`, stroke: 'muted', strokeWidth: 3, dash: 2 },
      { id: `166-${name}-front`, type: 'svgPath', d: `M ${x} ${top} A 22 75 0 0 1 ${x} ${bottom}`, stroke: 'ink', strokeWidth: 3 },
      line(`166-${name}-axis`, p(x, top), p(x, bottom), { stroke: 'muted', strokeWidth: 2, dash: 2 }),
      line(`166-${name}-extension`, p(x, bottom), p(x, 554), { stroke: 'muted', strokeWidth: 2 }),
      text(`166-${name}-label`, p(x, 135), numeral)
    )
  }
  const drift = arrow('166-drift-arrow', p(285, cy), p(414, cy), { strokeWidth: 4 })
  const vector = arrow('166-drift-vector-accent', p(325, 169), p(348, 169), { strokeWidth: 2 })
  const dimensionLeft = arrow('166-dimension-left', p(336, 540), p(s1, 540), { strokeWidth: 3 })
  const dimensionRight = arrow('166-dimension-right', p(336, 540), p(s2, 540), { strokeWidth: 3 })
  const area = line('166-area-leader', p(80, 148), p(60, top), { stroke: 'muted', strokeWidth: 2 })
  objects.push(
    { id: '166-drift-origin', type: 'point', at: drift.from, size: 4, stroke: 'ink', fill: 'ink' },
    drift, vector, dimensionLeft, dimensionRight, area,
    text('166-drift-label', p(337, 208), 'v'),
    text('166-length-label', p(336, 500), '\u0394l'),
    text('166-area-label', p(80, 120), 'S'),
    text('166-charge-label', p(336, 385), 'q\u2080: particle charge'),
    text('166-density-label', p(336, 445), 'n: number density')
  )
  const volume = { id: '166-inspected-volume', type: 'polygon', points: [p(s1, top), p(s2, top), p(s2, bottom), p(s1, bottom)], stroke: 'paper', strokeWidth: 0.01, fill: 'paper', fillOpacity: 0 }
  objects.unshift(volume)
  const assertions = [
    { id: '166-body-parallel', type: 'parallel', a: p(left, top), b: p(right, top), c: p(left, bottom), d: p(right, bottom) },
    displacement('166-left-before-section1', p(left, cy), p(s1, cy)),
    displacement('166-section2-before-right-end', p(s2, cy), p(right, cy)),
    displacement('166-section1-before-section2', p(s1, cy), p(s2, cy)),
    { id: '166-section-axes-parallel', type: 'parallel', a: p(s1, top), b: p(s1, bottom), c: p(s2, top), d: p(s2, bottom) },
    { id: '166-section1-transverse', type: 'perpendicular', a: p(s1, top), b: p(s1, bottom), c: p(left, cy), d: p(right, cy) },
    { id: '166-section2-transverse', type: 'perpendicular', a: p(s2, top), b: p(s2, bottom), c: p(left, cy), d: p(right, cy) },
    { id: '166-same-section-height', type: 'equalDistance', a: p(s1, top), b: p(s1, bottom), c: p(s2, top), d: p(s2, bottom) },
    { ...connects(drift), id: '166-drift-connects' },
    displacement('166-drift-right', drift.from, drift.to),
    { id: '166-drift-origin-in-volume', type: 'inside', point: '166-drift-origin', container: volume.id, margin: 10 },
    { id: '166-drift-tip-in-volume', type: 'inside', point: drift.to, container: volume.id, margin: 10 },
    { ...connects(vector), id: '166-vector-connects' },
    displacement('166-vector-right', vector.from, vector.to),
    { id: '166-drift-parallel-body', type: 'parallel', a: drift.from, b: drift.to, c: p(left, top), d: p(right, top) },
    { ...connects(dimensionLeft), id: '166-left-dimension-connects' },
    { ...connects(dimensionRight), id: '166-right-dimension-connects' },
    displacement('166-left-dimension-direction', dimensionLeft.from, dimensionLeft.to),
    displacement('166-right-dimension-direction', dimensionRight.from, dimensionRight.to),
    { id: '166-dimension-section-length', type: 'equalDistance', a: p(s1, 540), b: p(s2, 540), c: p(s1, cy), d: p(s2, cy) },
    displacement('166-section1-witness-alignment', p(s1, bottom), p(s1, 554)),
    displacement('166-section2-witness-alignment', p(s2, bottom), p(s2, 554)),
    { id: '166-dimension-parallel-body', type: 'parallel', a: p(s1, 540), b: p(s2, 540), c: p(left, top), d: p(right, top) },
    { ...connects(area), id: '166-area-leader-connects' }
  ]
  return makeSpec('fig-166', height, objects, assertions)
}
function prepare() {
  const freezePath = path.join(ticketTmp, '9p-n86-prose-freeze.json')
  assert.equal(hash(freezePath), expectedFreeze, 'wrong frozen prose receipt')
  const freeze = read(freezePath)
  const snapshots = [copy(freezePath, local('inputs/prose-freeze.json'))]
  for (const entry of freeze.templates) {
    assert.equal(hash(entry.snapshot.path), entry.snapshot.sha256)
    assert.equal(hash(entry.active.path), entry.active.sha256, 'live template differs from freeze')
    const basename = path.basename(entry.snapshot.path)
    snapshots.push(copy(entry.snapshot.path, local(`inputs/${basename}`)))
    snapshots.push(copy(entry.snapshot.path, local(`native-root/9p/editions/modern-us-neutral/lessons/${lessonId}/${basename.replace('.template', '')}`)))
  }
  const lesson = read(local('inputs/lesson.template.json'))
  const complete = lesson.prose.filter(block => ['p', 'cap'].includes(block.kind) && block.text.trim()).map(block => ({ lesson: lessonId, text: block.text }))
  write(local('inputs/complete-modern-text.json'), complete)
  snapshots.push(copy(freeze.sources[0].snapshot.path, local('inputs/source-lesson.json')))
  for (const id of ids) {
    const original = path.join(book, `figures/${id}.png`)
    snapshots.push(copy(original, local(`native-root/9p/figures/${id}.png`)))
  }
  const files = [
    'SKILL.md', 'references/routing.md', 'references/figure-spec.md', 'references/quality-gate.md', 'references/generation.md',
    'assets/figure-spec.schema.json', 'scripts/build_context.py', 'scripts/validate_spec.py', 'scripts/render_spec.mjs', 'scripts/materialize_arrowheads.mjs'
  ]
  for (const file of files) snapshots.push(copy(path.join(skill, file), local(`inputs/skill/${file}`)))
  write(local('preparation.json'), { ticket: 'STEMROBIN-181', batch: 'D022', ownedRoot: own, snapshots, inventory: evidence(local('source-inventory.json')), authoritativeText: evidence(local('inputs/complete-modern-text.json')), role: 'author-only, no independent approval' })
  for (const id of ids) {
    const output = local(`${id}/context.native.json`)
    assert.ok(native(`${id}-build-context`, 'python3', [
      path.join(skill, 'scripts/build_context.py'), '--book', '9p', '--edition', 'modern-us-neutral', '--figure', id,
      '--root', local('native-root'), '--output', output
    ], [local(`native-root/9p/figures/${id}.png`), local(`native-root/9p/editions/modern-us-neutral/lessons/${lessonId}/lesson.json`), local(`native-root/9p/editions/modern-us-neutral/lessons/${lessonId}/exercises.json`)], [output]))
    const context = read(output)
    assert.equal(context.lessons.length, 1)
    assert.equal(context.lessons[0].lesson, lessonId)
    write(local(`${id}/context.complete.json`), {
      schema: 'd022/complete-figure-context@1', nativeContext: evidence(output), proseFreeze: evidence(local('inputs/prose-freeze.json')),
      originalImage: evidence(path.join(book, `figures/${id}.png`)),
      fullModernLesson: evidence(local('inputs/lesson.template.json')), completeAuthoritativeText: complete,
      sourceInventory: read(local('source-inventory.json')).figures[id],
      note: 'Native context nearbyText is preserved unchanged. Complete frozen edition prose is supplied here and in FigureSpec; no answer key is used.'
    })
  }
  for (const spec of [spec165(), spec166()]) {
    write(local(`${spec.id}/draft.spec.json`), spec)
    copy(local(`${spec.id}/draft.spec.json`), local(`${spec.id}/spec.json`))
  }
}
function renderOne(id) {
  const prefix = local(id), spec = path.join(prefix, 'spec.json')
  const svg = path.join(prefix, `${id}.svg`), report = path.join(prefix, `${id}.render.json`)
  const draftOk = native(`${id}-validate-draft`, 'python3', [path.join(skill, 'scripts/validate_spec.py'), spec, '--stage', 'draft', '--json'], [spec], [])
  if (!draftOk) return
  const ok = native(`${id}-render-initial`, 'node', [path.join(skill, 'scripts/render_spec.mjs'), '--spec', spec, '--svg', svg, '--report', report], [spec, path.join(skill, 'scripts/render_spec.mjs'), path.join(skill, 'scripts/materialize_arrowheads.mjs')], [svg, report])
  if (!ok) return
  native(`${id}-validate-rendered`, 'python3', [path.join(skill, 'scripts/validate_spec.py'), spec, '--stage', 'rendered', '--json'], [spec, path.join(book, `figures/${id}.png`)], [])
}
function repair166() {
  const id = 'fig-166'
  assert.ok(!fs.existsSync(local(`${id}/repair.json`)), 'the one targeted repair has already been used')
  const originals = ['spec.json', 'fig-166.svg', 'fig-166.render.json'].map(file => copy(local(`${id}/${file}`), local(`${id}/initial-failed/${file}`)))
  const specFile = local(`${id}/spec.json`)
  const spec = read(specFile)
  const label = spec.objects.find(object => object.id === '166-density-label')
  assert.deepEqual(label.at, [336, 170])
  label.at = [336, 155]
  write(specFile, spec)
  write(local(`${id}/repair.json`), {
    reason: 'Initial native renderer reported a label-label collision only for n: number density. Move its anchor down 15 canvas px, from screen y=430 to y=445. All geometry, directions, other labels, display contract and renderer remain unchanged.',
    originalArtifacts: originals, repairedSpec: evidence(specFile), usedRepairs: 1
  })
  const svg = local(`${id}/${id}.svg`), report = local(`${id}/${id}.render.json`)
  if (!native(`${id}-validate-repair`, 'python3', [path.join(skill, 'scripts/validate_spec.py'), specFile, '--stage', 'draft', '--json'], [specFile], [])) return
  if (!native(`${id}-render-targeted-repair`, 'node', [path.join(skill, 'scripts/render_spec.mjs'), '--spec', specFile, '--svg', svg, '--report', report], [specFile, path.join(skill, 'scripts/render_spec.mjs'), path.join(skill, 'scripts/materialize_arrowheads.mjs')], [svg, report])) return
  native(`${id}-validate-rendered`, 'python3', [path.join(skill, 'scripts/validate_spec.py'), specFile, '--stage', 'rendered', '--json'], [specFile, path.join(book, `figures/${id}.png`)], [])
}
async function previews() {
  const { chromium } = await import(path.join(repo, '.agents/skills/node_modules/playwright-core/index.mjs'))
  assert.equal(process.env.PWDEBUG, undefined, 'preview must run with PWDEBUG unset')
  const browser = await chromium.launch({ headless: true })
  const reports = []
  try {
    const context = await browser.newContext({ deviceScaleFactor: 1 })
    const page = await context.newPage()
    for (const id of ids) {
      const svgFile = local(`${id}/${id}.svg`)
      assert.equal(read(local(`${id}/${id}.render.json`)).status, 'pass')
      const spec = read(local(`${id}/spec.json`))
      for (const width of [640, 342]) {
        const height = Math.ceil(spec.canvas.height * width / spec.canvas.width)
        await page.setViewportSize({ width, height })
        const errors = []
        const onError = error => errors.push(error.message)
        page.on('pageerror', onError)
        await page.setContent('<!doctype html><html><head><style>html,body{margin:0;background:white}svg{display:block;width:100%;height:auto}</style></head><body></body></html>')
        await page.locator('body').evaluate((body, markup) => { body.innerHTML = markup }, fs.readFileSync(svgFile, 'utf8'))
        const measurements = await page.locator('svg').evaluate(svg => ({
          width: svg.getBoundingClientRect().width,
          height: svg.getBoundingClientRect().height,
          labels: [...svg.querySelectorAll('text')].map(node => {
            const m = node.getScreenCTM(), rect = node.getBoundingClientRect()
            return { text: node.textContent, px: Number(node.getAttribute('font-size')) * Math.hypot(m.a, m.b), rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } }
          }),
          arrowheads: [...svg.querySelectorAll('[data-arrowhead-for]')].map(node => node.getAttribute('data-arrowhead-for'))
        }))
        assert.equal(measurements.width, width)
        assert.equal(errors.length, 0)
        assert.ok(measurements.labels.every(item => item.px >= 16 && item.rect.x >= 0 && item.rect.y >= 0 && item.rect.x + item.rect.width <= width && item.rect.y + item.rect.height <= height))
        assert.equal(measurements.arrowheads.length, id === 'fig-165' ? 3 : 4)
        const png = local(`${id}/preview-${width}.png`)
        await page.screenshot({ path: png, type: 'png', animations: 'disabled' })
        page.off('pageerror', onError)
        reports.push({ figure: id, width, viewport: { width, height }, svg: evidence(svgFile), png: evidence(png), measurements, pageErrors: errors, status: 'pass' })
      }
    }
    await context.close()
  } finally {
    await browser.close()
  }
  write(local('preview-report.json'), { role: 'producer preview, not independent acceptance', method: 'isolated headless Playwright of native SVG, setContent only; no HTML file opened', widthsOpened: [640, 342], reports })
}
function freeze() {
  const observations = read(local('producer-observations.json'))
  const candidates = ids.map(id => ({
    id, status: 'rendered-old-text-candidate-awaiting-main-SCI-rebinding-and-independent-review',
    contextNative: evidence(local(`${id}/context.native.json`)), contextComplete: evidence(local(`${id}/context.complete.json`)),
    draftSpec: evidence(local(`${id}/draft.spec.json`)), finalSpec: evidence(local(`${id}/spec.json`)),
    render: evidence(local(`${id}/${id}.render.json`)), svg: evidence(local(`${id}/${id}.svg`)),
    previews: [640, 342].map(width => evidence(local(`${id}/preview-${width}.png`))),
    renderAttempts: read(receiptsFile).filter(call => call.name.startsWith(`${id}-render-`)).length,
    targetedRepairs: fs.existsSync(local(`${id}/repair.json`)) ? 1 : 0,
    ...(fs.existsSync(local(`${id}/repair.json`)) ? { repair: evidence(local(`${id}/repair.json`)) } : {}),
    nativeStatus: read(local(`${id}/${id}.render.json`)).status
  }))
  for (const candidate of candidates) assert.equal(candidate.nativeStatus, 'pass')
  const unchanged = [
    ...read(local('preparation.json')).snapshots.filter(item => !item.original.path.startsWith(`${own}/`))
  ].map(item => ({ ...item.original, unchanged: hash(item.original.path) === item.original.sha256 }))
  const changedInputs = unchanged.filter(item => !item.unchanged)
  for (const id of ids) {
    const original = path.join(book, `figures/${id}.png`)
    assert.equal(hash(original), read(local(`${id}/spec.json`)).source.image.sha256, 'source PNG changed')
  }
  write(local('author-freeze.json'), {
    schema: 'd022/figure-author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D022', lesson: lessonId,
    status: 'native-successful-old-text-candidates-awaiting-SCI86-1-rebinding-and-independent-review', producerOnly: true,
    independentApproval: false, completeCards: false, promotion: false, ownedRoot: own,
    proseFreeze: evidence(local('inputs/prose-freeze.json')), suppliedProseFreezeSha256: expectedFreeze,
    completeModernText: evidence(local('inputs/complete-modern-text.json')),
    sourceText: evidence(local('inputs/source-lesson.json')),
    inventory: evidence(local('source-inventory.json')), preparation: evidence(local('preparation.json')),
    authorScript: evidence(fileURLToPath(import.meta.url)),
    nativeCalls: evidence(receiptsFile), nativeReceipts: read(receiptsFile).map(item => evidence(local(`receipts/${item.name}.json`))),
    previewReport: evidence(local('preview-report.json')), producerObservations: evidence(local('producer-observations.json')),
    candidates, imageOpens: observations.imageOpens.map(item => ({ ...item, ...evidence(item.path) })),
    imageOpenCount: observations.imageOpens.length, externalBoundInputs: unchanged, changedExternalInputsAtFreeze: changedInputs,
    scienceCorrection: observations.scienceCorrection,
    restrictions: 'No independent review or native review@1 pass, no source/page/template/manifest/index edits, no promotion/adapt-finalize/DB/Git/full tests/children/other chats. Only owned scratch writes. Actual 640/342 previews; 331 validated by native displayChecks without additional image opens.',
    candidateMetadataPolicy: 'All render metadata paths refer to the actual scratch candidate outputs and the OLD complete modern text frozen under supplied SHA c0322939652ee0f5f1454eb4823b8c41c89592144008e876f46da0124342a56b. They are not durable publication metadata. Main owns SCI86-1 corrected-text binding and independent approval. The author does not claim that these old-context specs already include the correction, does not reread source images, and does not rerender because prose changed.'
  })
  console.log(`Author freeze: ${local('author-freeze.json')}`)
}
const phase = process.argv[2]
if (phase === 'prepare') prepare()
else if (phase === 'render') renderOne(process.argv[3])
else if (phase === 'repair166') repair166()
else if (phase === 'previews') await previews()
else if (phase === 'freeze') freeze()
else throw new Error(`Unknown author phase: ${phase}`)
