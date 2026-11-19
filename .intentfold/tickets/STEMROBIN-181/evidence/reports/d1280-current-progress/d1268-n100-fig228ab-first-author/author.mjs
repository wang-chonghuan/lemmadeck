import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), repo)
assert.equal(out, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1268-n100-fig228ab-first-author'))
const prep = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1257-n100-first-preparation')
const text = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1259-n100-first-bilingual-text-author')
const rawLesson = path.join(prep, 'root/10p/lessons/phy10-c2-s4-n100/lesson.json')
const rawExercises = path.join(prep, 'root/10p/lessons/phy10-c2-s4-n100/exercises.json')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const evidence = (file) => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const target = (name) => path.join(out, name)
function write(name, data) {
  const file = target(name)
  assert(file.startsWith(`${out}/`))
  assert(!fs.existsSync(file), `Refuse to overwrite FIRST evidence: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}
function checkInputs() {
  for (const item of read(target('input-freeze.json')).inputs) assert.equal(hash(item.path), item.sha256, item.path)
  if (fs.existsSync(target('title-context-addendum.json'))) {
    const item = read(target('title-context-addendum.json')).parent_current_english_candidate
    assert.equal(hash(item.path), item.sha256, item.path)
  }
}
function run(name, command, args) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  const receipt = { command, args, cwd: repo, exit_code: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null }
  write(`receipts/${name}.json`, receipt)
  return receipt
}
function pngDimensions(file) {
  const bytes = fs.readFileSync(file)
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG')
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)]
}

function draft() {
  const inventoryFile = target('source-inventory-FIRST.json')
  const routingFile = target('routing-FIRST.json')
  const inventory = read(inventoryFile)
  const authorReport = read(path.join(text, 'report.json'))
  const preparation = read(path.join(prep, 'report.json'))
  assert.equal(preparation.card, 'phy10-c2-s4-n100')
  assert.equal(authorReport.card, 'phy10-c2-s4-n100')
  assert.equal(read(rawExercises).count, 0)
  assert.equal(read(rawLesson).exercise_count, 0)
  assert.deepEqual(read(rawLesson).figures.map((figure) => figure.id), ['fig-228a', 'fig-228б'])
  for (const candidate of authorReport.current_candidates) {
    for (const kind of ['lesson', 'exercises']) assert.equal(hash(candidate[kind].path), candidate[kind].sha256)
  }
  const inputFiles = [
    path.join(prep, 'report.json'), rawLesson, rawExercises, path.join(prep, 'FIRST-failure.json'),
    path.join(text, 'report.json'), path.join(text, 'source-requirements-FIRST.json'),
    ...authorReport.current_candidates.flatMap((candidate) => [candidate.lesson.path, candidate.exercises.path]),
    ...inventory.figures.map((figure) => path.join(repo, figure.source.path)),
    inventoryFile, routingFile, target('FIRST-failure.json'), target('source-dimensions-addendum.json'),
    ...[
      '.agents/skills/ld-s10y-image/SKILL.md',
      '.agents/skills/ld-s10y-image/references/routing.md',
      '.agents/skills/ld-s10y-image/references/figure-spec.md',
      '.agents/skills/ld-s10y-image/references/quality-gate.md',
      '.agents/skills/ld-s10y-image/references/generation.md',
      '.claude/skills/ld-s10y-lesson/references/production-resume.md',
      '.claude/skills/ld-s10y-lesson/references/figure-generation.md',
      '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
      '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
      '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
      'app/src/styles/app.css',
    ].map((file) => path.join(repo, file)),
  ]
  for (const figure of inventory.figures) {
    const file = path.join(repo, figure.source.path)
    assert.equal(hash(file), figure.source.sha256)
    const expected = figure.id === 'fig-228б'
      ? read(target('source-dimensions-addendum.json')).actual_png_header_dimensions
      : [figure.source.width, figure.source.height]
    assert.deepEqual(pngDimensions(file), expected)
  }
  write('input-freeze.json', {
    schema: 'stemrobin/figure-author-input-freeze@1', ticket: 'STEMROBIN-181', card: 'phy10-c2-s4-n100',
    phase: 'FIRST', local_date: '2026-11-19', cwd: repo, branch_as_authorized: 'codex/STEMROBIN-181-textbooks',
    branch_verified_by_git: false, exclusive_write_root: out, frozen_before_figure_specs: true,
    inputs: inputFiles.map(evidence), existing_preparation_first_failure: evidence(path.join(prep, 'FIRST-failure.json')),
    sci_text_status_as_author_report: authorReport.status, independent_sci_text_approval_asserted: false,
    native_review_files_to_be_written: 0, promotion_authorized: false,
  })
  const authoritativeText = authorReport.current_candidates.flatMap((candidate) =>
    read(candidate.lesson.path).prose.filter((block) => ['p', 'cap'].includes(block.kind) && block.text)
      .map((block) => ({ lesson: `phy10-c2-s4-n100/${candidate.locale}/${block.source_refs.join(',')}`, text: block.text })))
  const polar = (radius, angle) => [radius * Math.cos(angle * Math.PI / 180), radius * Math.sin(angle * Math.PI / 180)]
  const objects = []
  const assertions = []
  const arc = (id, center, start, end, style = {}) => objects.push({ id, type: 'arc', center, start, end, stroke: 'ink', strokeWidth: 4, ...style })
  const segment = (id, from, to, style = {}) => objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 4, ...style })
  const connects = (id, object, from, to) => assertions.push({ id, type: 'connects', arrow: object, from, to })
  const onCircle = (id, point, center, radius) => assertions.push({ id, type: 'pointOnCircle', point, center, radius })
  const rectangle = (id, x0, y0, x1, y1) => objects.push({ id, type: 'polygon', points: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 1 })
  const label = (id, at, content) => objects.push({ id, type: 'text', at, text: content, fontSize: 30, fontWeight: 600, labelColor: 'ink', labelPlacement: { position: 'CENTER', offset: [0, 0] } })
  const inner = 2.75
  const outer = 3.35
  const orbit = 3.05
  for (const [quadrant, startAngle, endAngle] of [['ne', 10, 80], ['nw', 100, 170], ['sw', 190, 260], ['se', 280, 350]]) {
    for (const [role, radius] of [['inner', inner], ['outer', outer]]) {
      const start = polar(radius, startAngle)
      const end = polar(radius, endAngle)
      arc(`a-magnet-${quadrant}-${role}`, [0, 0], start, end)
      onCircle(`a-${quadrant}-${role}-start-on-circle`, start, [0, 0], radius)
      onCircle(`a-${quadrant}-${role}-end-on-circle`, end, [0, 0], radius)
    }
    segment(`a-magnet-${quadrant}-cap-start`, polar(inner, startAngle), polar(outer, startAngle))
    segment(`a-magnet-${quadrant}-cap-end`, polar(inner, endAngle), polar(outer, endAngle))
    arc(`a-orbit-${quadrant}`, [0, 0], polar(orbit, startAngle), polar(orbit, endAngle), { stroke: 'muted', strokeWidth: 4, dash: 2 })
    onCircle(`a-${quadrant}-orbit-start-on-circle`, polar(orbit, startAngle), [0, 0], orbit)
    onCircle(`a-${quadrant}-orbit-end-on-circle`, polar(orbit, endAngle), [0, 0], orbit)
  }
  for (const [side, startAngle, endAngle] of [['top', 80, 100], ['left', 170, 190], ['bottom', 260, 280], ['right', 350, 10]]) {
    segment(`a-straight-${side}`, polar(orbit, startAngle), polar(orbit, endAngle), { strokeWidth: 5 })
    connects(`a-${side}-route-joins`, `a-straight-${side}`, polar(orbit, startAngle), polar(orbit, endAngle))
  }
  assertions.push(
    { id: 'a-top-bottom-parallel', type: 'parallel', a: polar(orbit, 80), b: polar(orbit, 100), c: polar(orbit, 260), d: polar(orbit, 280) },
    { id: 'a-left-right-parallel', type: 'parallel', a: polar(orbit, 170), b: polar(orbit, 190), c: polar(orbit, 350), d: polar(orbit, 10) },
    { id: 'a-top-right-perpendicular', type: 'perpendicular', a: polar(orbit, 80), b: polar(orbit, 100), c: polar(orbit, 350), d: polar(orbit, 10) },
  )
  const x = polar(orbit, 170)[0]
  const q = polar(orbit, 10)[1]
  const center = [x - 0.8, -q]
  for (const [role, radius] of [['upper', 0.88], ['lower', 0.72]]) {
    const start = [center[0] + radius, center[1]]
    const end = [center[0], center[1] + radius]
    segment(`a-inlet-${role}`, [-5.7, end[1]], end)
    connects(`a-inlet-${role}-joins`, `a-inlet-${role}`, [-5.7, end[1]], end)
    arc(`a-inlet-bend-${role}`, center, start, end)
    onCircle(`a-inlet-bend-${role}-start-on-circle`, start, center, radius)
    onCircle(`a-inlet-bend-${role}-end-on-circle`, end, center, radius)
  }
  const inletY = center[1] + 0.8
  rectangle('a-inlet-coupling-outer', -5.25, inletY - 0.18, -4.97, inletY + 0.18)
  rectangle('a-inlet-coupling-inner', -4.72, inletY - 0.21, -4.3, inletY + 0.21)
  for (const [role, delta] of [['inner', -0.08], ['outer', 0.08]]) {
    const from = [-x + delta, -q]
    const to = [-x + 0.60 + delta, 0.68]
    segment(`a-extraction-${role}`, from, to)
    connects(`a-extraction-${role}-joins`, `a-extraction-${role}`, from, to)
  }
  assertions.push({ id: 'a-extraction-parallel', type: 'parallel', a: [-x - 0.08, -q], b: [-x + 0.52, 0.68], c: [-x + 0.08, -q], d: [-x + 0.68, 0.68] })
  rectangle('a-top-device', -0.43, 2.78, 0.43, 3.28)
  rectangle('a-bottom-device', -0.43, -3.28, 0.43, -2.78)
  for (const [side, y] of [['top', -x], ['bottom', x]]) {
    segment(`a-${side}-port-left`, [-0.62, y], [-0.43, y])
    segment(`a-${side}-port-right`, [0.43, y], [0.62, y])
  }
  assertions.push(
    { id: 'a-device-count', type: 'objectCount', objectType: 'polygon', count: 4 },
    { id: 'a-top-device-centered', type: 'inside', point: [0, -x], container: 'a-top-device' },
    { id: 'a-bottom-device-centered', type: 'inside', point: [0, x], container: 'a-bottom-device' },
  )
  label('a-acceleration-label', [0, 4.35], 'Accelerating device')
  segment('a-acceleration-leader', [-0.65, 4.0], [0, 3.08], { strokeWidth: 2 })
  connects('a-acceleration-leader-joins', 'a-acceleration-leader', [-0.65, 4.0], [0, 3.08])
  label('a-magnet-label', [-3.48, -3.7], 'Magnets')
  segment('a-magnet-leader', [-3.0, -3.34], polar(3.28, 225), { strokeWidth: 2 })
  connects('a-magnet-leader-joins', 'a-magnet-leader', [-3.0, -3.34], polar(3.28, 225))
  label('a-injection-label', [-4.8, 1.12], 'Injection')
  label('a-extraction-label', [4.38, 1.2], 'Beam extraction')
  assertions.push({ id: 'a-label-count', type: 'objectCount', objectType: 'text', count: 4 })
  const sourceA = inventory.figures[0]
  const specA = {
    schema: 'ld-s10y-image/figure-spec@2', id: sourceA.id, mode: 'deterministic',
    description: 'Inspect a generic proton-synchrotron ring schematic: four curved magnet sectors, straight regions, upper accelerating device, injection and extraction. Geometric regularization is a layout choice, not a measured historical facility plan.',
    source: {
      image: { path: path.join(repo, sourceA.source.path), sha256: sourceA.source.sha256 },
      authoritativeText,
      inventory: sourceA.groups.map((group) => ({ id: group.id, description: group.facts, objects: group.objects, assertions: group.assertions })),
    },
    canvas: { width: 960, height: 800, boundingBox: [-6, 5, 6, -5], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640] },
    objects, assertions, layout: { minLabelGap: 8 },
  }
  const sourceB = inventory.figures[1]
  const specB = {
    schema: 'ld-s10y-image/figure-spec@2', id: sourceB.id, mode: 'generated',
    description: 'Historical Dubna / Joint Institute for Nuclear Research accelerator interior, as identified by the current bilingual edition text. Preserve the source photographic scene in contemporary textbook artwork; no exact dimensions or apparatus counts are given. Generation is blocked, not replaced by deterministic geometry.',
    source: {
      image: { path: path.join(repo, sourceB.source.path), sha256: sourceB.source.sha256 },
      authoritativeText,
      inventory: sourceB.groups.map((group) => ({ id: group.id, description: `${group.facts} Future visual checks: ${group.planned_visual_assertions.join(', ')}. No artwork exists yet.`, objects: [], assertions: [] })),
    },
    canvas: { width: 1099, height: 464, boundingBox: [0, 464, 1099, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', minTextPx: 16, widths: [300, 352, 480] },
    objects: [], assertions: [],
  }
  write('FIRST/fig-228a.spec.json', specA)
  write('FIRST/fig-228б.spec.json', specB)
  console.log(JSON.stringify({ first_specs_written: [specA.id, specB.id], inputs: inputFiles.length, complete_authoritative_text_blocks: authoritativeText.length, figure_a_objects: objects.length, figure_a_assertions: assertions.length, b_generation: 'BLOCKED', image_opens_so_far: 2 }))
}

function render() {
  checkInputs()
  const a = run('fig-228a-validation-FIRST', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', target('FIRST/fig-228a.spec.json'), '--stage', 'draft', '--json'])
  assert.equal(a.exit_code, 0, a.stdout || a.stderr)
  const b = run('fig-228б-validation-FIRST', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', target('FIRST/fig-228б.spec.json'), '--stage', 'draft', '--json'])
  assert.notEqual(b.exit_code, 0, 'Unexpected identifier compatibility; do not generate in this author scope.')
  write('FIRST/fig-228б-failure.json', {
    figure: 'fig-228б', phase: 'FIRST', type: 'NATIVE-ID-CONTRACT-FAILURE',
    receipt: evidence(target('receipts/fig-228б-validation-FIRST.json')),
    generation_premise_separately_blocked: true, original_id_preserved: true,
    figure_content_repairs_used: 0, no_ascii_rename_or_validator_edit: true,
  })
  const rendered = run('fig-228a-render-FIRST', 'node', [
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', target('FIRST/fig-228a.spec.json'),
    '--svg', target('FIRST/fig-228a.svg'), '--png', target('FIRST/fig-228a.canvas.png'),
    '--report', target('FIRST/fig-228a.render.json'),
  ])
  if (rendered.exit_code !== 0) {
    write('FIRST/fig-228a-failure.json', { phase: 'FIRST', receipt: evidence(target('receipts/fig-228a-render-FIRST.json')), repairs_used: 0, first_outputs_preserved: true })
  }
  console.log(JSON.stringify({ a_exit: rendered.exit_code, a_stdout: rendered.stdout, b_exit: b.exit_code, b_stdout: b.stdout, b_generation_calls: 0 }))
}

async function inspect() {
  checkInputs()
  const svgFile = target('candidate/fig-228a.svg')
  const spec = read(target('candidate/fig-228a.spec.json'))
  assert.equal(read(target('candidate/fig-228a.render.json')).status, 'pass')
  const require = createRequire(path.join(repo, '.agents/skills/package.json'))
  const { chromium } = require('playwright-core')
  const cssFile = path.join(repo, 'app/src/styles/app.css')
  const css = fs.readFileSync(cssFile, 'utf8')
  const svg = fs.readFileSync(svgFile, 'utf8')
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false, args: ['--disable-background-networking', '--disable-sync', '--no-first-run'],
  })
  const measurements = []
  let blockedRequests = 0
  try {
    const context = await browser.newContext()
    await context.route('**/*', (route) => { blockedRequests += 1; return route.abort() })
    const page = await context.newPage()
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 960 }]) {
      await page.setViewportSize(viewport)
      for (const surface of ['sr-read-fig', 'sr-ex-fig']) {
        await page.setContent(`<!doctype html><meta charset="utf-8"><style>${css}</style>
          <main style="width:300px;font-size:16px"><figure class="${surface}" data-figure-layout="scroll">
          <div class="sr-figure-media">${svg}</div></figure></main>`)
        const geometryIds = spec.objects.filter((item) => ['arc', 'segment'].includes(item.type)).map((item) => item.id)
        const result = await page.evaluate(({ geometryIds }) => {
          const frame = document.querySelector('[data-figure-layout]')
          const media = document.querySelector('.sr-figure-media')
          const vector = media.querySelector('svg')
          frame.scrollLeft = frame.scrollWidth
          const labels = [...vector.querySelectorAll('text')].map((node) => {
            const matrix = node.getScreenCTM()
            const rect = node.getBoundingClientRect()
            return { id: node.getAttribute('data-label-id'), text: node.textContent, px: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b), box: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } }
          })
          const paths = [...vector.querySelectorAll('line, path')].filter((node) => !node.closest('defs') && geometryIds.some((id) => node.id.endsWith(`_ld-${id}`)))
            .map((node) => ({ id: node.id, stroke: getComputedStyle(node).stroke, length: node.getTotalLength?.() ?? null, visibility: getComputedStyle(node).visibility }))
          frame.scrollLeft = frame.scrollWidth
          const maxScroll = frame.scrollWidth - frame.clientWidth
          const vectorBox = vector.getBoundingClientRect()
          return {
            containerWidthPx: frame.getBoundingClientRect().width, mediaWidthPx: media.getBoundingClientRect().width,
            svgWidthPx: vectorBox.width, minimumTextPx: Math.min(...labels.map((label) => label.px)), labels, paths,
            labelBoundsWithinMedia: labels.every(({ box }) => box.x >= vectorBox.x && box.y >= vectorBox.y && box.x + box.width <= vectorBox.right && box.y + box.height <= vectorBox.bottom),
            scrollEndReachable: Math.abs(frame.scrollLeft - maxScroll) <= 1, maxScroll,
          }
        }, { geometryIds })
        assert.equal(result.mediaWidthPx, 640)
        assert.equal(result.svgWidthPx, 640)
        assert(result.minimumTextPx >= spec.display.minTextPx)
        assert.equal(result.labels.length, 4)
        assert(result.labelBoundsWithinMedia)
        assert(result.scrollEndReachable)
        assert.equal(result.paths.length, geometryIds.length)
        assert(result.paths.every((item) => item.stroke !== 'none' && item.length > 0 && item.visibility === 'visible'))
        measurements.push({ viewport, surface, ...result })
        if (viewport.width === 390 && surface === 'sr-read-fig') {
          await page.locator('.sr-figure-media').screenshot({ path: target('candidate/fig-228a.product-640.png'), animations: 'disabled' })
        }
      }
    }
    await context.close()
  } finally {
    await browser.close()
  }
  write('offline-product-width.json', {
    schema: 'figure-author-offline-width-check/v1',
    authority: 'Restricted headed Chromium harness loads the actual unchanged sole-repair SVG with current product CSS in narrow 300px hosts at mobile/desktop viewports. It is not a live n100 card render, complete-lesson acceptance or independent visual approval.',
    svg: evidence(svgFile), css: evidence(cssFile), declared_media_widths: spec.display.widths,
    network: { allowed: false, blockedRequests }, measurements,
    status: 'PASS-MECHANICAL-WIDTH-ONLY', independent_visual_review: 'PENDING',
    actual_product_snapshot: evidence(target('candidate/fig-228a.product-640.png')),
  })
  console.log(JSON.stringify({ widths: measurements.map((item) => ({ viewport: item.viewport.width, surface: item.surface, host: item.containerWidthPx, media: item.mediaWidthPx, text: item.minimumTextPx })), screenshots_written: 1, images_opened_by_script: 0 }))
}

function freeze() {
  checkInputs()
  const observation = read(target('author-observations.json'))
  const renderReport = read(target('candidate/fig-228a.render.json'))
  const ownFiles = [
    'source-inventory-FIRST.json', 'routing-FIRST.json', 'input-freeze.json', 'author.mjs',
    'FIRST-failure.json', 'source-dimensions-addendum.json', 'title-context-addendum.json',
    'FIRST/fig-228a.spec.json', 'FIRST/fig-228a.svg', 'FIRST/fig-228a.render.json', 'FIRST/fig-228a.canvas.png',
    'FIRST/fig-228a-failure.json', 'FIRST/fig-228б.spec.json', 'FIRST/fig-228б-failure.json',
    'FIRST/offline-width-harness-failure.json',
    'FIRST/offline-width-construction-objects-failure.json',
    'candidate/fig-228a.spec.json', 'candidate/fig-228a.svg', 'candidate/fig-228a.render.json',
    'candidate/fig-228a.canvas.png', 'candidate/fig-228a.product-640.png', 'repair.json', 'repair.mjs',
    'candidate/fig-228a.product-full-640.png', 'snapshot-recovery.mjs', 'snapshot-recovery.json',
    'receipts/fig-228a-validation-FIRST.json', 'receipts/fig-228б-validation-FIRST.json',
    'receipts/fig-228a-render-FIRST.json', 'receipts/fig-228a-render-SOLE-REPAIR.json', 'offline-product-width.json', 'author-observations.json',
  ]
  const freeze = {
    schema: 'stemrobin/modern-figure-author-freeze@1', ticket: 'STEMROBIN-181', card: 'phy10-c2-s4-n100',
    phase: 'FIRST', local_date: '2026-11-19', cwd: repo, branch_as_authorized: 'codex/STEMROBIN-181-textbooks',
    exclusive_write_root: out, inputs_unchanged_after_authoring: true,
    input_freeze: evidence(target('input-freeze.json')), candidates_and_evidence: ownFiles.map((name) => evidence(target(name))),
    routing: [{ id: 'fig-228a', mode: 'deterministic', native_render: renderReport.status }, { id: 'fig-228б', mode: 'generated', output: null, status: 'BLOCKED-GENERATION-PREMISE-AND-NATIVE-ID-CONTRACT' }],
    image_usage: observation.image_usage, first_figure_repairs_used: 1, maximum_targeted_figure_repairs: 1,
    original_preparation_first_failure_preserved: evidence(path.join(prep, 'FIRST-failure.json')),
    title_context_addendum: evidence(target('title-context-addendum.json')),
    independent_sci_text_gate: 'BODY-PASS-AS-DIRECTLY-SUPPLIED; F01 English title-only affected review UNDERWAY/HOLD', independent_visual_gate: 'PENDING',
    native_review_files: [], promoted_assets: [], complete_card: false,
  }
  write('author-freeze.json', freeze)
  const report = {
    schema: 'stemrobin/bounded-first-modern-figure-author-report@1',
    ticket: 'STEMROBIN-181', card: 'phy10-c2-s4-n100', phase: 'FIRST',
    status: 'FIRST-A-DETERMINISTIC-CANDIDATE-B-GENERATED-PLANNING-BLOCKED',
    cwd: repo, branch_as_authorized: 'codex/STEMROBIN-181-textbooks', exclusive_write_root: out,
    author_freeze: evidence(target('author-freeze.json')),
    source_inventory: evidence(target('source-inventory-FIRST.json')),
    routing: evidence(target('routing-FIRST.json')),
    sources: read(target('source-inventory-FIRST.json')).figures.map((figure) => ({ id: figure.id, owner: 'phy10-c2-s4-n100', ...evidence(path.join(repo, figure.source.path)) })),
    figure_a: {
      id: 'fig-228a', mode: 'deterministic', display: read(target('candidate/fig-228a.spec.json')).display,
      spec: evidence(target('candidate/fig-228a.spec.json')), svg: evidence(target('candidate/fig-228a.svg')),
      render: evidence(target('candidate/fig-228a.render.json')), render_status: renderReport.status,
      product_width: evidence(target('offline-product-width.json')),
      full_product_media_snapshot: evidence(target('candidate/fig-228a.product-full-640.png')),
      snapshot_technical_recovery: evidence(target('snapshot-recovery.json')),
      author_observation: observation.figure_a, independent_review: 'PENDING', promotable: false,
    },
    figure_b: {
      id: 'fig-228б', suffix: 'Cyrillic U+0431, preserved exactly', mode: 'generated', spec: evidence(target('FIRST/fig-228б.spec.json')),
      png: null, generation_metadata: null, generation_calls: 0,
      generation_premise: 'BLOCKED: semantic artwork required; network/model/paid operations forbidden and no authorized adequate modern artwork/metadata supplied.',
      native_id_failure: evidence(target('FIRST/fig-228б-failure.json')), silent_deterministic_fallback: false, promotable: false,
    },
    source_and_current_author_hashes_unchanged: true,
    first_failures_and_repairs: {
      inherited_preparation_first_failure: evidence(path.join(prep, 'FIRST-failure.json')),
      new_native_id_failures: 1, first_figure_layout_failures: 1,
      current_content_or_visual_failures: observation.figure_a.status === 'AUTHOR-OBSERVATION-READY-FOR-INDEPENDENT-GATE' ? 0 : 1,
      own_pre_spec_technical_first_failure: evidence(target('FIRST-failure.json')),
      pre_spec_dimension_metadata_technical_recoveries: 1,
      first_offline_width_harness_failure: evidence(target('FIRST/offline-width-harness-failure.json')),
      offline_width_construction_objects_failure: evidence(target('FIRST/offline-width-construction-objects-failure.json')),
      offline_width_harness_technical_recoveries: 2,
      clipped_snapshot_technical_recoveries: 1,
      figure_a_native_render_attempts: 2, figure_b_validation_attempts: 1,
      sole_targeted_figure_repair_limit: 1, figure_repairs_used: 1,
      counters_not_reset_and_first_evidence_not_overwritten: true,
    },
    usage: {
      ...observation.image_usage, images_authored: 4, source_images: 2, image_assets_opened: observation.image_usage.total_in_context,
      render_spec_calls: 2, generated_artwork_calls: 0, paid_calls: 0,
      native_independent_review_calls: 0, native_pass_replays: 0, adapt_finalize_calls: 0, promoted_assets: 0,
      db_operations: 0, env_operations: 0, git_operations: 0, network_operations: 0, chat_operations: 0,
      code_skill_dependency_application_edits: 0,
    },
    title_context_addendum: evidence(target('title-context-addendum.json')),
    independent_sci_text_review: 'BODY-PASS-AS-DIRECTLY-SUPPLIED; F01 English title-only affected review UNDERWAY/HOLD. No promotion/finalize attempted.',
    independent_visual_review: 'REQUIRED-LATER; no review@1 written or author self-promotion.',
    complete_card: false, others_preserved: true,
  }
  write('report.json', report)
  console.log(JSON.stringify({ report: evidence(target('report.json')), author_freeze: evidence(target('author-freeze.json')), image_count: observation.image_usage.total_in_context }))
}

const stage = process.argv[2]
if (stage === 'draft') draft()
else if (stage === 'render') render()
else if (stage === 'inspect') await inspect()
else if (stage === 'freeze') freeze()
else throw new Error('Use draft, render, inspect or freeze')
