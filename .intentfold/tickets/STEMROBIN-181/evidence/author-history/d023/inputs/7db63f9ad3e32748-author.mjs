import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d023-n90-fig170-author')
const lessonPath = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s3-n90/lesson.template.json'
const sciencePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n90-science-effective-review.json'
const correctionPath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n90-prose-correction-freeze.json'
const sourcePath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-170.png'
const native = '.agents/skills/ld-s10y-image/scripts'
const sha = value => crypto.createHash('sha256').update(value).digest('hex')
const absolute = value => path.isAbsolute(value) ? value : path.join(repo, value)
const read = value => JSON.parse(fs.readFileSync(absolute(value), 'utf8'))
const bind = value => ({ path: absolute(value), sha256: sha(fs.readFileSync(absolute(value))) })
const local = value => path.join(own, value)
const fullText = lesson => [lesson.printed_title, ...lesson.prose.map(block => block.text).filter(text => text.trim())].join('\n\n')

function put(relative, value) {
  const target = local(relative)
  assert(target.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}

function copy(from, relative) {
  const target = local(relative)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(absolute(from), target, fs.constants.COPYFILE_EXCL)
}

function command(id, program, args) {
  const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1' }
  delete env.PWDEBUG
  const start = new Date().toISOString()
  const result = spawnSync(program, args, { cwd: repo, env, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  const record = {
    id, program, args, cwd: repo, startedAt: start, endedAt: new Date().toISOString(),
    environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1' },
    status: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
  }
  put(`commands/${id}.json`, record)
  return record
}

function inputs() {
  const lesson = read(lessonPath)
  const science = read(sciencePath)
  const correction = read(correctionPath)
  assert.equal(bind(sciencePath).sha256, '163ed5d932d98171b1bb976481b34e8c350dea6de9d038e67d5c105d1ee27b53')
  assert.equal(bind(correctionPath).sha256, 'c281829766efd40e1aecdac14c3a4e70434027fc4970da464249dc2ffafacf26')
  assert.equal(science.decision.status, 'pass')
  assert.equal(science.decision.independentSCIPassed, true)
  assert.equal(bind(lessonPath).sha256, correction.bindings.lessonTemplate.sha256)
  assert.equal(lesson.id, 'phy9-c2-s3-n90')
  assert.equal(lesson.exercise_count, 0)
  assert.equal(lesson.prose.length, 19)
  return { lesson, science, correction }
}

function makeSpec(authority, inventory) {
  const objects = []
  const assertions = []
  const point = (id, at, visible = false) => objects.push({
    id, type: 'point', at, visible, size: 2, strokeWidth: 1, stroke: 'ink', fill: 'ink',
  })
  const text = (id, at, value) => objects.push({
    id, type: 'text', at, text: value, fontSize: 34, fontWeight: 600,
    labelColor: 'ink', labelPlacement: { position: 'CENTER' },
  })
  const fact = (id, type, fields) => assertions.push({ id, type, ...fields })
  const shift = (id, from, to, dx, dy) => fact(id, 'displacement', { from, to, dx, dy })
  const line = (id, from, to) => {
    objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 4 })
    fact(`join-${id}`, 'connects', { arrow: id, from, to })
  }
  const points = {
    'junction-1': [80, 290], 'junction-2': [560, 290],
    'open-left': [25, 290], 'open-right': [610, 290],
    'a-center': [180, 290], 'a-left': [125, 290], 'a-right': [235, 290],
    'r-left': [325, 290], 'r-right': [465, 290],
    'r-tl': [325, 310], 'r-tr': [465, 310], 'r-br': [465, 270], 'r-bl': [325, 270],
    'lower-left': [80, 90], 'lower-right': [560, 90],
    'v-center': [315, 90], 'v-left': [260, 90], 'v-right': [370, 90],
    'i-tail': [355, 360], 'i-head': [435, 360],
  }
  for (const [id, at] of Object.entries(points)) point(id, at, id.startsWith('junction-'))
  line('lead-left', 'open-left', 'junction-1')
  line('wire-1-a', 'junction-1', 'a-left')
  line('wire-a-r', 'a-right', 'r-left')
  line('wire-r-2', 'r-right', 'junction-2')
  line('lead-right', 'junction-2', 'open-right')
  line('wire-1-lower', 'junction-1', 'lower-left')
  line('wire-lower-v', 'lower-left', 'v-left')
  line('wire-v-lower', 'v-right', 'lower-right')
  line('wire-lower-2', 'lower-right', 'junction-2')
  objects.push({ id: 'ammeter', type: 'circle', center: 'a-center', radius: 55, stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 0 })
  objects.push({ id: 'voltmeter', type: 'circle', center: 'v-center', radius: 55, stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 0 })
  objects.push({ id: 'resistor', type: 'polygon', points: ['r-tl', 'r-tr', 'r-br', 'r-bl'], stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 0 })
  objects.push({ id: 'current-arrow', type: 'arrow', from: 'i-tail', to: 'i-head', stroke: 'accent', strokeWidth: 4 })
  text('junction-1-label', [80, 355], '1')
  text('junction-2-label', [560, 355], '2')
  text('ammeter-label', points['a-center'], 'A')
  text('voltmeter-label', points['v-center'], 'V')
  text('resistor-label', [395, 235], 'R')
  text('current-label', [395, 408], 'I')

  shift('junction-order', 'junction-1', 'junction-2', 480, 0)
  fact('upper-alignment', 'collinear', { a: 'open-left', b: 'a-left', c: 'open-right' })
  fact('lower-alignment', 'collinear', { a: 'lower-left', b: 'v-left', c: 'lower-right' })
  shift('left-drop', 'junction-1', 'lower-left', 0, -200)
  shift('right-drop', 'junction-2', 'lower-right', 0, -200)
  fact('branch-parallel', 'parallel', { a: 'junction-1', b: 'junction-2', c: 'lower-left', d: 'lower-right' })
  fact('branch-left-angle', 'perpendicular', { a: 'junction-1', b: 'lower-left', c: 'lower-left', d: 'v-left' })
  fact('branch-right-angle', 'perpendicular', { a: 'junction-2', b: 'lower-right', c: 'v-right', d: 'lower-right' })
  for (const prefix of ['a', 'v']) {
    fact(`${prefix}-left-contact`, 'pointOnCircle', { point: `${prefix}-left`, center: `${prefix}-center`, radius: 55 })
    fact(`${prefix}-right-contact`, 'pointOnCircle', { point: `${prefix}-right`, center: `${prefix}-center`, radius: 55 })
    shift(`${prefix}-diameter`, `${prefix}-left`, `${prefix}-right`, 110, 0)
    shift(`${prefix}-center`, `${prefix}-left`, `${prefix}-center`, 55, 0)
  }
  shift('a-before-r', 'a-right', 'r-left', 90, 0)
  shift('r-left-center', 'r-bl', 'r-left', 0, 20)
  shift('r-right-center', 'r-br', 'r-right', 0, 20)
  shift('r-top-horizontal', 'r-tl', 'r-tr', 140, 0)
  shift('r-bottom-horizontal', 'r-bl', 'r-br', 140, 0)
  shift('r-left-vertical', 'r-bl', 'r-tl', 0, 40)
  shift('r-right-vertical', 'r-br', 'r-tr', 0, 40)
  fact('r-top-bottom', 'parallel', { a: 'r-tl', b: 'r-tr', c: 'r-bl', d: 'r-br' })
  fact('r-corner', 'perpendicular', { a: 'r-tl', b: 'r-tr', c: 'r-tl', d: 'r-bl' })
  shift('r-between-junctions', 'r-right', 'junction-2', 95, 0)
  shift('v-below-a', 'a-center', 'v-center', 135, -200)
  shift('v-right-of-a', 'a-center', 'v-center', 135, -200)
  fact('current-connects', 'connects', { arrow: 'current-arrow', from: 'i-tail', to: 'i-head' })
  shift('current-rightward', 'i-tail', 'i-head', 80, 0)
  fact('current-parallel', 'parallel', { a: 'i-tail', b: 'i-head', c: 'junction-1', d: 'junction-2' })
  shift('current-above-r', 'r-left', 'i-tail', 30, 70)
  shift('label-1-above', 'junction-1', [80, 355], 0, 65)
  shift('label-2-above', 'junction-2', [560, 355], 0, 65)
  shift('label-r-below', 'r-left', [395, 235], 70, -55)
  shift('label-i-above', 'i-tail', [395, 408], 40, 48)
  fact('one-arrow', 'objectCount', { objectType: 'arrow', count: 1 })
  fact('two-meters', 'objectCount', { objectType: 'circle', count: 2 })
  fact('one-resistor', 'objectCount', { objectType: 'polygon', count: 1 })
  fact('six-labels', 'objectCount', { objectType: 'text', count: 6 })
  return {
    schema: 'ld-s10y-image/figure-spec@2', id: 'fig-170', mode: 'deterministic',
    description: 'A circuit section from point 1 to point 2 with an ammeter in series with the resistor, a voltmeter across the same two junctions, and rightward conventional current I. All exact distances are layout coordinates, not physical givens.',
    source: { image: bind(sourcePath), authoritativeText: authority, inventory: inventory.facts.map(({ id, description, objects: mapped, assertions: checked, requires }) => ({
      id, description, objects: mapped, assertions: checked, ...(requires ? { requires } : {}),
    })) },
    canvas: { width: 640, height: 440, boundingBox: [0, 440, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
    objects, assertions,
  }
}

function prepare() {
  const { lesson } = inputs()
  const inventory = read(local('inventory/source-pixels.json'))
  copy(lessonPath, 'context/lesson.template.json')
  copy(sciencePath, 'context/science-effective-review.json')
  copy(correctionPath, 'context/prose-correction-freeze.json')
  copy(sourcePath, 'context/input-root/9p/figures/fig-170.png')
  const projection = 'context/input-root/9p/editions/modern-us-neutral/lessons/phy9-c2-s3-n90'
  copy(lessonPath, `${projection}/lesson.json`)
  put(`${projection}/exercises.json`, { exercises: [] })
  put('context/inputs.json', {
    source: bind(sourcePath), lesson: bind(lessonPath), science: bind(sciencePath), correction: bind(correctionPath),
    exercisePolicy: 'Lesson declares zero exercises. Native context receives only an empty list; no question or answer files are read.',
    sourceInspection: inventory.inspection,
    authorityPolicy: 'Use exact printed_title plus all nonempty prose texts, in order, including every caption. Preserve native nearby selection separately; explicit complete-context supplementation is not a fallback.',
  })
  const run = command('initial-build-context', 'python3', [
    absolute(`${native}/build_context.py`), '--book', '9p', '--edition', 'modern-us-neutral',
    '--figure', 'fig-170', '--root', local('context/input-root'), '--output', local('context/native-context.json'),
  ])
  assert.equal(run.status, 0)
  const nativeContext = read(local('context/native-context.json'))
  assert.equal(nativeContext.lessons.length, 1)
  assert.equal(nativeContext.lessons[0].lesson, lesson.id)
  assert.equal(nativeContext.sourceImage.sha256, bind(sourcePath).sha256)
  const authority = [{ lesson: lesson.id, text: fullText(lesson) }]
  const context = {
    ...nativeContext,
    sourceImage: { ...bind(sourcePath), width: inventory.inspection.widthPx, height: inventory.inspection.heightPx },
    nativeContext: bind(local('context/native-context.json')),
    currentLesson: bind(lessonPath), lessonSnapshot: bind(local('context/lesson.template.json')),
    authoritativeText: authority, canonicalization: 'printed_title + every nonempty prose.text in order, joined by two newlines',
    lessons: [{
      ...nativeContext.lessons[0], fullProse: lesson.prose, authoritativeText: authority[0].text,
      prose: [{ figureLabel: '图170', nearbyText: lesson.prose.filter(block => block.text.trim()).map(block => block.text) }],
      exercises: [],
    }],
  }
  put('context/context.json', context)
  put('spec/initial/spec.json', makeSpec(authority, inventory))
  put('context/canonical-authority.json', { authoritativeText: authority, utf8Sha256: sha(fullText(lesson)) })
  console.log(JSON.stringify({ status: 'prepared', lesson: bind(lessonPath), source: bind(sourcePath), context: bind(local('context/context.json')), spec: bind(local('spec/initial/spec.json')) }, null, 2))
}

function build() {
  inputs()
  const render = command('initial-render-spec', 'node', [
    absolute(`${native}/render_spec.mjs`), '--spec', local('spec/initial/spec.json'),
    '--svg', local('svg/initial/fig-170.svg'), '--report', local('render/initial/render.json'),
  ])
  const validation = command('initial-validate-spec', 'python3', [
    absolute(`${native}/validate_spec.py`), local('spec/initial/spec.json'), '--stage', 'rendered', '--json',
  ])
  if (validation.stdout.trim()) put('render/initial/validation.json', JSON.parse(validation.stdout))
  console.log(JSON.stringify({ renderExit: render.status, validationExit: validation.status, repairCount: 0 }))
  process.exitCode = render.status || validation.status
}

async function preview() {
  inputs()
  assert.equal(read(local('render/initial/render.json')).status, 'pass')
  assert.equal(read(local('render/initial/validation.json')).status, 'pass')
  assert.equal(process.env.PWDEBUG, undefined)
  assert.equal(process.env.PLAYWRIGHT_HTML_OPEN, 'never')
  const require = createRequire(path.join(repo, 'app/package.json'))
  const { chromium } = require('playwright')
  const svg = fs.readFileSync(local('svg/initial/fig-170.svg'), 'utf8')
  const spec = read(local('spec/initial/spec.json'))
  const browser = await chromium.launch({ headless: true })
  const rows = []
  const errors = []
  try {
    for (const width of spec.display.widths) {
      const context = await browser.newContext({ viewport: { width, height: 480 }, deviceScaleFactor: 1 })
      const page = await context.newPage()
      page.on('pageerror', error => errors.push(error.message))
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
        html,body{margin:0;padding:0;background:white;}
        figure{margin:0;width:100%;max-width:${spec.display.maxWidthPx}px;}
        figure>svg{display:block;width:100%;height:auto;}
      </style></head><body><figure aria-label="Circuit section from point 1 to point 2">${svg}</figure></body></html>`)
      const metrics = await page.locator('figure').evaluate(figure => {
        const svg = figure.querySelector('svg')
        const box = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const m = node.getScreenCTM()
          const b = node.getBoundingClientRect()
          return {
            id: node.dataset.labelId, text: node.textContent,
            px: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(m.a, m.b),
            rect: { x: b.x, y: b.y, width: b.width, height: b.height },
            contained: b.left >= box.left && b.top >= box.top && b.right <= box.right && b.bottom <= box.bottom,
          }
        })
        const geometry = [...svg.querySelectorAll('path,line,polygon,circle,ellipse')].filter(node => {
          const b = node.getBoundingClientRect()
          return b.width > 0 || b.height > 0
        }).length
        return { actualWidth: box.width, actualHeight: box.height, labels, geometry, scrollWidth: document.documentElement.scrollWidth }
      })
      assert.equal(metrics.actualWidth, width)
      assert.equal(metrics.labels.length, 6)
      assert.deepEqual(metrics.labels.map(label => label.text).sort(), ['1', '2', 'A', 'I', 'R', 'V'].sort())
      assert(metrics.labels.every(label => label.px >= 16 && label.contained))
      assert(metrics.geometry > 12)
      assert.equal(metrics.scrollWidth, width)
      const screenshot = local(`previews/initial/w${width}.png`)
      fs.mkdirSync(path.dirname(screenshot), { recursive: true })
      assert(!fs.existsSync(screenshot))
      await page.locator('figure').screenshot({ path: screenshot })
      rows.push({ width, ...metrics, screenshot: bind(screenshot), status: 'pass' })
      await context.close()
    }
  } finally {
    await browser.close()
  }
  assert.equal(errors.length, 0)
  put('previews/initial/checks.json', {
    status: 'pass', scope: 'Isolated native SVG at the three requested actual inline media widths; not a whole lesson or live product acceptance.',
    browser: 'Existing app/node_modules/playwright Chromium, isolated headless contexts',
    environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never' },
    widths: rows, pageErrors: errors,
  })
  console.log(JSON.stringify({ status: 'pass', previews: rows.map(row => row.screenshot), minTextPx: Math.min(...rows.flatMap(row => row.labels.map(label => label.px))) }, null, 2))
}

function runPreview() {
  const run = command('initial-playwright-preview', 'node', [local('commands/author.mjs'), 'preview'])
  console.log(run.stdout)
  if (run.stderr) console.error(run.stderr)
  process.exitCode = run.status
}

function freeze() {
  const { lesson } = inputs()
  const spec = read(local('spec/initial/spec.json'))
  const context = read(local('context/context.json'))
  const report = read(local('render/initial/render.json'))
  const validation = read(local('render/initial/validation.json'))
  const previews = read(local('previews/initial/checks.json'))
  const observations = read(local('observations/author-observations.json'))
  assert.equal(report.status, 'pass')
  assert.equal(validation.status, 'pass')
  assert.equal(previews.status, 'pass')
  assert.equal(observations.status, 'author-pass-awaiting-independent-review')
  assert.deepEqual(spec.source.authoritativeText, [{ lesson: lesson.id, text: fullText(lesson) }])
  assert.deepEqual(context.authoritativeText, spec.source.authoritativeText)
  assert.deepEqual(context.lessons[0].fullProse, lesson.prose)
  assert.equal(context.lessons[0].authoritativeText, fullText(lesson))
  assert.equal(bind(local('context/lesson.template.json')).sha256, bind(lessonPath).sha256)
  assert.equal(report.spec.sha256, bind(local('spec/initial/spec.json')).sha256)
  assert.equal(report.output.svg.sha256, bind(local('svg/initial/fig-170.svg')).sha256)
  for (const group of spec.source.inventory) {
    assert(group.objects.every(id => spec.objects.some(object => object.id === id && object.visible !== false)))
    assert(group.assertions.every(id => spec.assertions.some(assertion => assertion.id === id)))
  }
  const symbols = Object.fromEntries(spec.objects.filter(object => object.type === 'text').map(object => [object.id, object.text]))
  assert.deepEqual(symbols, {
    'junction-1-label': '1', 'junction-2-label': '2', 'ammeter-label': 'A',
    'voltmeter-label': 'V', 'resistor-label': 'R', 'current-label': 'I',
  })
  assert.equal(spec.objects.filter(object => object.type === 'arrow').length, 1)
  assert(spec.objects.every(object => object.type !== 'svgPath'))
  const toolPaths = [
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
    `${native}/build_context.py`, `${native}/render_spec.mjs`, `${native}/validate_spec.py`,
    `${native}/materialize_arrowheads.mjs`,
  ]
  const commandFiles = fs.readdirSync(local('commands')).filter(file => file.endsWith('.json') || file.endsWith('.mjs')).map(file => bind(local(`commands/${file}`)))
  const freeze = {
    schema: 'd023/figure-author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D023',
    lesson: lesson.id, figure: 'fig-170', role: 'AUTHOR ONLY',
    status: 'author-pass-awaiting-independent-review', frozenAt: new Date().toISOString(),
    bindings: {
      source: bind(sourcePath), context: bind(local('context/context.json')), nativeContext: bind(local('context/native-context.json')),
      lessonCurrentFullTemplate: bind(lessonPath), lessonFullSnapshot: bind(local('context/lesson.template.json')),
      canonicalAuthority: bind(local('context/canonical-authority.json')),
      spec: bind(local('spec/initial/spec.json')), render: bind(local('render/initial/render.json')),
      svg: bind(local('svg/initial/fig-170.svg')), validation: bind(local('render/initial/validation.json')),
      science: bind(sciencePath), correctedProseFreeze: bind(correctionPath),
      scienceSnapshot: bind(local('context/science-effective-review.json')), correctedProseSnapshot: bind(local('context/prose-correction-freeze.json')),
      inventory: bind(local('inventory/source-pixels.json')), observations: bind(local('observations/author-observations.json')),
      inputs: bind(local('context/inputs.json')), previews: previews.widths.map(row => row.screenshot),
      previewChecks: bind(local('previews/initial/checks.json')), commands: commandFiles, contractsAndNativeTools: toolPaths.map(bind),
    },
    authority: {
      completeCanonicalTextEqualsCurrentPrintedTitleAndAllProse: true,
      fullTemplateAndFullProseBound: true, nonemptyPCapBlocks: lesson.prose.filter(block => ['p', 'cap'].includes(block.kind) && block.text.trim()).length,
      textUtf8Sha256: sha(fullText(lesson)), exercises: 0,
    },
    nativeCounts: {
      build_context: 1, render_spec: 1, validate_specExplicit: 1,
      validate_specEmbeddedInRenderer: 1, validate_specTotal: 2,
      isolatedPlaywrightPreview: 1, targetedRepairOverall: 0,
    },
    initialResults: { render: report.status, validation: validation.status, previews: previews.status, initialFailures: [], repairArtifacts: [] },
    imageOpens: { sourceOriginal: 1, previews: 3, total: 4, batchTotal: 4, contextTotal: 4, maximumBatch: 8, maximumContext: 24 },
    display: spec.display,
    result: {
      authorApprovalOnly: true, independentReviewerRequired: true, nativeReviewRecorded: false, promotableNow: false,
      reason: 'Author observed source pixels before drawing and all three previews once. Native checks and author observations pass; a separate fresh independent reviewer must still assess the frozen bindings.',
    },
    limits: {
      ownedRootOnly: own, noTemplateEdits: true, noPortraitWork: true, noSCIReplay: true,
      noNormalizeOrFlowOrSourceReplay: true, noPromotionOrRecordReviewOrAdaptFinalize: true,
      noGitDBFullTestsDependencyChangesChildrenOrOtherChats: true, noSvgEditsOrSilentFallback: true,
      noProductWidthMeasurement: 'Requested 640/331/342 media widths were tested directly; this scoped author task does not measure a headed/live app or perform whole-card acceptance.',
    },
  }
  put('authored-freeze.json', freeze)
  console.log(JSON.stringify({ status: freeze.status, freeze: bind(local('authored-freeze.json')), imageOpens: freeze.imageOpens, nativeCounts: freeze.nativeCounts, previews: freeze.bindings.previews }, null, 2))
}

const phase = process.argv[2]
if (phase === 'prepare') prepare()
else if (phase === 'build') build()
else if (phase === 'preview') await preview()
else if (phase === 'run-preview') runPreview()
else if (phase === 'freeze') freeze()
else throw new Error(`Unknown author phase: ${phase}`)
