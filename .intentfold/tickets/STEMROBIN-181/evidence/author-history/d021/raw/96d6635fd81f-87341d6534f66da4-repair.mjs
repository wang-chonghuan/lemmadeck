import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const initial = path.join(repo, '.tmp/STEMROBIN-181/9p-d021-n83-fig158-159')
const initialFreezeFile = path.join(initial, 'author-freeze.json')
const expectedInitialHash = '535b1139546c6bee4e3de55c2c7a840189f6dc7a17834820dac568f441aef0f1'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => {
  const file = path.join(own, name)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const snapshot = (file, name) => {
  const output = path.join(own, name)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.copyFileSync(file, output, fs.constants.COPYFILE_EXCL)
  return { original: bind(file), snapshot: bind(output) }
}
const policy = {
  isolatedHeadless: true, userWindow: false, persistentProfile: false,
  userProfile: false, CDP: false, systemInput: false,
  PWDEBUGUnset: true, htmlAutoOpen: 'never',
}
const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never', PLAYWRIGHT_OPEN: 'never' }
delete env.PWDEBUG
delete env.PLAYWRIGHT_DEBUG
const initialFreeze = read(initialFreezeFile)
assert.equal(hash(initialFreezeFile), expectedInitialHash)
assert.equal(initialFreeze.repairCount, 0)
assert.deepEqual(initialFreeze.repairHistory, [])
const initialResult = initialFreeze.figureResults.find(item => item.id === 'fig-159')
assert.equal(initialResult.targetedRepairCount, 0)
assert.equal(initialResult.authorStatus, 'fail')
const initialSpecFile = path.join(initial, 'fig-159/initial/spec.json')
const initialContextFile = path.join(initial, 'fig-159/context.json')
const specFile = path.join(own, 'spec.json')
const svgFile = path.join(own, 'fig-159.svg')
const renderFile = path.join(own, 'render.json')
const accent = [
  { id: 'total-field-vector-accent-shaft', from: [308, 614], to: [332, 614] },
  { id: 'total-field-vector-accent-head-upper', from: [326, 618], to: [332, 614] },
  { id: 'total-field-vector-accent-head-lower', from: [326, 610], to: [332, 614] },
].map(item => ({ ...item, type: 'segment', stroke: 'ink', strokeWidth: 2.6 }))
const accentAssertions = accent.map(item => ({
  id: `${item.id}-connects`, type: 'connects', arrow: item.id, from: item.from, to: item.to,
}))

function verifyPreservation() {
  assert.equal(hash(initialFreezeFile), expectedInitialHash)
  initialFreeze.frozenFiles.forEach(item => assert.equal(hash(path.join(repo, item.path)), item.sha256, item.path))
  const tools = initialFreeze.frozenFiles.filter(item => item.path.includes('/inputs/tools/.agents/'))
    .map(item => {
      const original = path.join(repo, item.path.split('/inputs/tools/')[1])
      assert.equal(hash(original), item.sha256, original)
      return bind(original)
    })
  return { checkedFrozenFiles: initialFreeze.frozenFiles.length, allUnchanged: true,
    sharedToolsUnchanged: true, currentTools: tools, initialFreeze: bind(initialFreezeFile) }
}

function currentContext() {
  const checks = {}
  for (const [key, entry] of Object.entries({
    n80: initialFreeze.bindings.fullCorrectedN80,
    n83: initialFreeze.bindings.fullAuthorBoundN83,
  })) {
    const file = path.join(repo, entry.activeAtAuthorStart.path)
    const template = read(file)
    assert.deepEqual(template.prose, entry.fullProse, `${key}: full prose drift`)
    checks[key] = {
      lesson: entry.lesson, currentTemplate: bind(file),
      authorBoundTemplate: entry.authorBoundTemplate,
      proseFreeze: entry.proseFreeze, exercises: entry.exercises,
      fullProse: template.prose, authoritativeText: entry.authoritativeText,
      fullProseEqual: true,
      fullTemplateBytesEqual: hash(file) === entry.authorBoundTemplate.snapshot.sha256,
    }
  }
  assert.deepEqual(read(initialSpecFile).source.authoritativeText, checks.n83.authoritativeText)
  assert.deepEqual(read(initialContextFile).authoritativeText, checks.n83.authoritativeText)
  return checks
}

function verifyTargetedChange() {
  const before = read(initialSpecFile)
  const after = read(specFile)
  const restored = structuredClone(after)
  restored.objects = restored.objects.filter(item => !accent.some(addition => addition.id === item.id))
  restored.objects.find(item => item.id === 'total-field-vector').text = 'E\u20d7'
  restored.assertions = restored.assertions.filter(item => !accentAssertions.some(addition => addition.id === item.id))
  const inventory = restored.source.inventory.find(item => item.id === 'field-vector-label')
  inventory.objects = inventory.objects.filter(id => !accent.some(item => item.id === id))
  inventory.assertions = inventory.assertions.filter(id => !accentAssertions.some(item => item.id === id))
  assert.deepEqual(restored, before)
  assert.deepEqual(after.objects.filter(item => accent.some(addition => addition.id === item.id)), accent)
  assert.deepEqual(after.assertions.slice(before.assertions.length), accentAssertions)
  assert.equal(after.objects.filter(item => item.type === 'arrow').length, 6)
  assert.equal(after.objects.filter(item => item.type === 'text').length, 15)
  return {
    onlyOriginalObjectChange: 'total-field-vector.text: E + U+20D7 to ASCII E',
    originalObjectCount: before.objects.length, repairedObjectCount: after.objects.length,
    originalAssertionCount: before.assertions.length, repairedAssertionCount: after.assertions.length,
    allOriginalAssertionsUnchanged: true, allOtherOriginalObjectsUnchanged: true,
    originalCanvasDisplaySourceAndFullAuthoritativeTextUnchanged: true,
    addedObjects: accent, addedAssertions: accentAssertions,
    sourceFactChanges: [], newPhysicalObjects: [],
    representationChange: 'Existing source vector accent realized as three deterministic segments, not a seventh physical field arrow.',
    inventoryChanges: [{
      id: 'field-vector-label',
      addedObjects: accent.map(item => item.id),
      addedAssertions: accentAssertions.map(item => item.id),
      originalDescriptionUnchanged: true,
    }],
  }
}

function prepare() {
  const preservation = verifyPreservation()
  const context = currentContext()
  const inventory = read(path.join(own, 'source-inventory-independent.json'))
  assert.equal(inventory.source.fullImageLoadsThisContext, 1)
  const source = path.join(repo, inventory.source.path)
  assert.equal(hash(source), inventory.source.sha256)
  const snapshots = {
    initialAuthorHistory: snapshot(initialFreezeFile, 'inputs/initial-author-freeze.json'),
    exactFigureContext: snapshot(initialContextFile, 'context.json'),
    source: snapshot(source, 'inputs/fig-159.png'),
  }
  for (const [key, entry] of Object.entries(context)) {
    snapshots[key] = {
      template: snapshot(path.join(repo, entry.currentTemplate.path), `inputs/${key}/lesson.template.json`),
      exercises: snapshot(path.join(repo, entry.exercises.snapshot.path), `inputs/${key}/exercises.template.json`),
      proseFreeze: snapshot(path.join(repo, entry.proseFreeze.snapshot.path), `inputs/${key}/prose-freeze.json`),
    }
  }
  write('context-equality-start.json', { fullContextEquality: true, context, snapshots, preservation })
  const spec = read(initialSpecFile)
  spec.objects.find(item => item.id === 'total-field-vector').text = 'E'
  spec.objects.push(...accent)
  spec.assertions.push(...accentAssertions)
  const group = spec.source.inventory.find(item => item.id === 'field-vector-label')
  group.objects.push(...accent.map(item => item.id))
  group.assertions.push(...accentAssertions.map(item => item.id))
  write('spec.json', spec)
  const changes = verifyTargetedChange()
  write('inventory-comparison-and-repair.json', {
    independentSourceInventory: bind(path.join(own, 'source-inventory-independent.json')),
    sourceFactsAgreeWithInitialInventory: true,
    inventoryObservationAdditions: [
      'Explicitly distinguish rightward vector accent from the leftward physical field.',
      'Explicitly record absence of an instrument and other apparatus in fig-159.',
    ],
    sourceMapping: [
      { observed: 'parallel-plates', initialGroup: 'parallel-plates' },
      { observed: 'outward-leads', initialGroup: 'plate-side-leads' },
      { observed: 'total-charges', initialGroup: 'charge-labels' },
      { observed: 'charge-signs', initialGroups: ['negative-signs', 'positive-signs'] },
      { observed: 'field-lines', initialGroup: 'field-lines' },
      { observed: 'vector-notation', initialGroup: 'field-vector-label' },
    ].map(item => ({
      ...item,
      mappings: spec.source.inventory.filter(group => [item.initialGroup, ...(item.initialGroups || [])].includes(group.id)),
    })),
    modernAdditionsSeparateFromSourceFacts: inventory.modernAdditions,
    ...changes,
  })
  const geometry = read(path.join(initial, 'fig-159/initial/geometry.json'))
  write('geometry.json', {
    ...geometry, attempt: 'repair', context: bind(path.join(own, 'context.json')),
    sourceInventory: bind(path.join(own, 'source-inventory-independent.json')),
    objects: spec.objects.length, assertions: spec.assertions.length,
    expectedLabels: geometry.expectedLabels.map(text => text === 'E\u20d7' ? 'E' : text),
    vectorAccent: accent,
    sourceRegions: { ...geometry.sourceRegions, vectorAccent: [306, 40, 335, 52] },
  })
  console.log(JSON.stringify({ status: 'prepared', spec: bind(specFile), repairCount: 1, preservation }))
}

function native() {
  assert.ok(!fs.existsSync(path.join(own, 'native-calls.json')), 'No second native attempt')
  verifyPreservation()
  currentContext()
  verifyTargetedChange()
  const validator = path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
  const renderer = path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
  const calls = []
  const run = (name, command, argv, script) => {
    const result = spawnSync(command, argv, { cwd: repo, encoding: 'utf8', env })
    const call = { name, command, argv, cwd: repo, script: bind(script),
      exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
      status: result.status === 0 ? 'pass' : 'fail' }
    calls.push(call)
    write(`${name}-call.json`, call)
    return result
  }
  const draft = run('draft-validation', 'python3', [validator, specFile, '--stage', 'draft', '--json'], validator)
  write('draft-validation.json', JSON.parse(draft.stdout))
  let rendered
  if (draft.status === 0) {
    rendered = run('render', 'node', [renderer, '--spec', specFile, '--svg', svgFile, '--report', renderFile], renderer)
  }
  const passed = draft.status === 0 && rendered?.status === 0 && read(renderFile).status === 'pass'
  write('native-calls.json', {
    figure: 'fig-159', attempt: 'repair', repairCount: 1, status: passed ? 'pass' : 'fail', calls,
    counts: {
      explicitDraftValidation: 1, nativeRender: rendered ? 1 : 0,
      nativeRendererInternalDraftValidation: rendered ? 1 : 0, explicitRenderedValidation: 0,
    },
    browserPolicy: { ...policy, allClosed: Boolean(rendered), nativeRendererUnmodified: true },
  })
  assert.ok(passed, 'Single repair failed; no second repair authorized')
  console.log(JSON.stringify({ status: 'pass', spec: bind(specFile), svg: bind(svgFile), render: bind(renderFile) }))
}

async function widths() {
  assert.ok(!fs.existsSync(path.join(own, 'width-previews.json')), 'No second width run')
  verifyTargetedChange()
  const spec = read(specFile)
  const render = read(renderFile)
  const geometry = read(path.join(own, 'geometry.json'))
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(render.output.svg.sha256, hash(svgFile))
  assert.deepEqual(spec.display.widths, [640, 331, 342])
  const require = createRequire(path.join(repo, '.agents/skills/package.json'))
  const { chromium } = require('playwright-core')
  const executablePath = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH,
    chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean).find(file => fs.existsSync(file))
  assert.ok(executablePath)
  delete process.env.PWDEBUG
  delete process.env.PLAYWRIGHT_DEBUG
  process.env.PLAYWRIGHT_HTML_OPEN = 'never'
  const browser = await chromium.launch({ executablePath, headless: true })
  const checks = []
  try {
    for (const width of spec.display.widths) {
      const context = await browser.newContext({
        viewport: { width, height: Math.ceil(width * spec.canvas.height / spec.canvas.width) },
        deviceScaleFactor: 1,
      })
      try {
        const page = await context.newPage()
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
          html,body{margin:0;background:white}svg{display:block;width:${width}px;height:auto}
          </style></head><body>${fs.readFileSync(svgFile, 'utf8')}</body></html>`)
        const metrics = await page.locator('svg').evaluate(async (svg, input) => {
          await document.fonts.ready
          const rect = svg.getBoundingClientRect()
          const labels = [...svg.querySelectorAll('text')].map(node => {
            const matrix = node.getScreenCTM()
            const box = node.getBoundingClientRect()
            return { id: node.getAttribute('data-label-id'), text: node.textContent,
              actualFontPx: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
              box: { x: box.x, y: box.y, width: box.width, height: box.height } }
          })
          const painted = [...svg.querySelectorAll('line,path,polygon,ellipse,circle,rect,text')]
            .filter(node => !node.closest('defs') && getComputedStyle(node).visibility !== 'hidden' && getComputedStyle(node).display !== 'none')
            .filter(node => getComputedStyle(node).stroke !== 'none' || getComputedStyle(node).fill !== 'none')
          const outside = painted.filter(node => {
            const box = node.getBoundingClientRect()
            return box.left < -0.5 || box.top < -0.5 || box.right > rect.width + 0.5 || box.bottom > rect.height + 0.5
          }).map(node => node.id || node.getAttribute('data-label-id'))
          const nonsemanticPaints = painted.flatMap(node => ['stroke', 'fill'].map(name => ({ id: node.id, name, value: node.getAttribute(name) })))
            .filter(item => item.value && !['none', 'transparent'].includes(item.value) && !item.value.startsWith('var(--ld-figure-'))
          const arrows = [...svg.querySelectorAll('[data-arrowhead-for]')].map(head => {
            const line = document.getElementById(head.getAttribute('data-arrowhead-for'))
            return { line: line.id, from: [line.x1.baseVal.value, line.y1.baseVal.value],
              to: [line.x2.baseVal.value, line.y2.baseVal.value], explicitArrowhead: head.children.length > 0 }
          })
          const accentSegments = input.accent.map(item => {
            const line = document.getElementById(`ld-fig-159_ld-${item.id}`)
            const box = line.getBoundingClientRect()
            return { id: item.id, from: [line.x1.baseVal.value, line.y1.baseVal.value],
              to: [line.x2.baseVal.value, line.y2.baseVal.value], stroke: getComputedStyle(line).stroke,
              actualStrokePx: Number(line.getAttribute('stroke-width')) * input.width / input.canvasWidth,
              box: { x: box.x, y: box.y, width: box.width, height: box.height } }
          })
          const overlaps = []
          labels.forEach((a, index) => labels.slice(index + 1).forEach(b => {
            const x = Math.min(a.box.x + a.box.width, b.box.x + b.box.width) - Math.max(a.box.x, b.box.x)
            const y = Math.min(a.box.y + a.box.height, b.box.y + b.box.height) - Math.max(a.box.y, b.box.y)
            if (x > 0.1 && y > 0.1) overlaps.push([a.text, b.text])
          }))
          const canvas = document.createElement('canvas')
          canvas.width = input.width
          canvas.height = Math.ceil(rect.height)
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          const image = new Image()
          const serialized = new XMLSerializer().serializeToString(svg)
          image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(serialized)))}`
          await image.decode()
          ctx.drawImage(image, 0, 0, input.width, rect.height)
          const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data
          const dark = (x, y) => {
            const offset = (y * canvas.width + x) * 4
            return rgba[offset] < 180 && rgba[offset + 1] < 180 && rgba[offset + 2] < 180
          }
          let darkPixels = 0
          let borderDarkPixels = 0
          for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
            if (!dark(x, y)) continue
            darkPixels++
            if (x < 2 || y < 2 || x >= canvas.width - 2 || y >= canvas.height - 2) borderDarkPixels++
          }
          const regionPixels = {}
          for (const [name, [left, top, right, bottom]] of Object.entries(input.regions)) {
            const scale = input.width / input.canvasWidth
            let count = 0
            for (let y = Math.max(0, Math.floor(top * scale)); y < Math.min(canvas.height, Math.ceil(bottom * scale)); y++)
              for (let x = Math.max(0, Math.floor(left * scale)); x < Math.min(canvas.width, Math.ceil(right * scale)); x++)
                if (dark(x, y)) count++
            regionPixels[name] = count
          }
          return { media: { width: rect.width, height: rect.height }, labels, arrows, accentSegments,
            labelOverlaps: overlaps, outside, nonsemanticPaints, darkPixels, borderDarkPixels, regionPixels }
        }, { width, canvasWidth: spec.canvas.width, accent, regions: geometry.sourceRegions })
        assert.ok(Math.abs(metrics.media.width - width) < 0.01)
        assert.deepEqual(metrics.labels.map(item => item.text).sort(), geometry.expectedLabels.slice().sort())
        assert.ok(metrics.labels.every(item => item.actualFontPx >= 16 && !item.text.includes('\u20d7')))
        assert.deepEqual(metrics.labelOverlaps, [])
        assert.deepEqual(metrics.outside, [])
        assert.deepEqual(metrics.nonsemanticPaints, [])
        assert.ok(metrics.darkPixels > 1000)
        assert.equal(metrics.borderDarkPixels, 0)
        assert.ok(Object.values(metrics.regionPixels).every(count => count > 10))
        assert.equal(metrics.arrows.length, 6)
        assert.ok(metrics.arrows.every(item => item.explicitArrowhead && item.from[0] > item.to[0] && item.from[1] === item.to[1]))
        const e = metrics.labels.find(item => item.id === 'total-field-vector-label')
        metrics.accentSegments.forEach((item, index) => {
          assert.deepEqual(item.from, [accent[index].from[0], spec.canvas.height - accent[index].from[1]])
          assert.deepEqual(item.to, [accent[index].to[0], spec.canvas.height - accent[index].to[1]])
          assert.ok(item.box.y + item.box.height < e.box.y)
          assert.notEqual(item.stroke, 'none')
        })
        assert.ok(metrics.accentSegments[0].from[0] < metrics.accentSegments[0].to[0])
        assert.deepEqual(errors, [])
        const preview = path.join(own, `width-${width}.png`)
        assert.ok(!fs.existsSync(preview))
        await page.locator('svg').screenshot({ path: preview, animations: 'disabled' })
        const header = fs.readFileSync(preview).subarray(0, 24)
        assert.equal(header.readUInt32BE(16), width)
        checks.push({ widthPx: width, status: 'pass', preview: bind(preview),
          dimensionsPx: [header.readUInt32BE(16), header.readUInt32BE(20)], metrics, errors })
      } finally {
        await context.close()
      }
    }
  } finally {
    await browser.close()
  }
  write('width-previews.json', {
    schema: 'ld-s10y-image/author-width-previews@1', figure: 'fig-159', attempt: 'repair', status: 'pass',
    method: 'Existing helper pattern adapted only for fig-159 repair paths and separate deterministic accent segments. Exact native SVG at CSS widths 640/331/342; six physical arrows, source regions, accent direction/clearance/pixels, text, bounds and nonblank checks. Not independent approval.',
    browserPolicy: { ...policy, allContextsAndBrowserClosed: true }, executablePath,
    spec: bind(specFile), svg: bind(svgFile), render: bind(renderFile), checks,
    helperPattern: bind(path.join(initial, 'width-previews.mjs')),
  })
  console.log(JSON.stringify({ status: 'pass', previewCount: checks.length,
    previews: checks.map(item => ({ width: item.widthPx, ...item.preview })) }))
}

function freeze() {
  const observationsFile = path.join(own, 'author-repair-observations.json')
  const observations = read(observationsFile)
  const preservation = verifyPreservation()
  const context = currentContext()
  const changes = verifyTargetedChange()
  assert.equal(hash(path.join(own, 'inputs/initial-author-freeze.json')), expectedInitialHash)
  assert.equal(hash(path.join(own, 'context.json')), hash(initialContextFile))
  assert.equal(hash(path.join(repo, observations.originalSource.path)), observations.originalSource.sha256)
  assert.equal(hash(path.join(own, 'inputs/fig-159.png')), observations.originalSource.sha256)
  for (const key of ['n80', 'n83']) {
    assert.equal(hash(path.join(own, `inputs/${key}/lesson.template.json`)), context[key].authorBoundTemplate.snapshot.sha256)
    assert.equal(hash(path.join(own, `inputs/${key}/exercises.template.json`)), context[key].exercises.snapshot.sha256)
    assert.equal(hash(path.join(own, `inputs/${key}/prose-freeze.json`)), context[key].proseFreeze.snapshot.sha256)
  }
  const nativeCalls = read(path.join(own, 'native-calls.json'))
  const previews = read(path.join(own, 'width-previews.json'))
  assert.equal(nativeCalls.status, 'pass')
  assert.equal(previews.checks.length, 3)
  assert.deepEqual(observations.imageLedger.newWidthOpens.map(item => item.widthPx), [640, 331, 342])
  assert.equal(observations.imageLedger.currentContextLoadedImageTotal, 5)
  for (const check of previews.checks) {
    assert.equal(hash(path.join(repo, check.preview.path)), check.preview.sha256)
    const inspected = observations.widthObservations.find(item => item.widthPx === check.widthPx)
    assert.equal(inspected.loads, 1)
    assert.equal(inspected.sha256, check.preview.sha256)
  }
  assert.equal(read(renderFile).spec.sha256, hash(specFile))
  assert.equal(read(renderFile).output.svg.sha256, hash(svgFile))
  write('context-equality-final.json', { fullContextEquality: true, context, preservation })
  const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? files(file) : [bind(file)]
  })
  const authorPass = observations.widthObservations.every(item => item.status === 'pass')
  write('author-repair-freeze.json', {
    schema: 'ld-s10y-image/author-repair-freeze@1', ticket: 'STEMROBIN-181', batch: 'D021',
    figure: 'fig-159', figures: ['fig-159'], lesson: 'phy9-c2-s2-n83',
    stage: 'figure-author-repair', role: 'fresh affected-figure author only; never independent reviewer',
    status: authorPass ? 'pass' : 'fail', authorStatus: authorPass ? 'pass' : 'fail',
    ownedRoot: own,
    scope: 'One scratch-only repair of total-field-vector missing accent. No other figure, shared template, source, app, dependency, schema, DB, Git, full test, promotion, SCI or chat action.',
    repairCount: 1, repairLimit: 1, remainingRepairAllowance: 0,
    bindings: {
      originalSource: bind(path.join(repo, observations.originalSource.path)),
      sourceSnapshot: bind(path.join(own, 'inputs/fig-159.png')),
      initialAuthorFreeze: bind(initialFreezeFile),
      exactInitialHistorySnapshot: bind(path.join(own, 'inputs/initial-author-freeze.json')),
      exactInitialSpec: bind(initialSpecFile), exactInitialFigureResult: initialResult,
      originalInitialAuthorObservations: initialFreeze.bindings.authorObservations,
      originalInitialInventory: initialFreeze.bindings.sourceInventory,
      fullFigureContext: bind(path.join(own, 'context.json')),
      fullContextEqualityAtStart: bind(path.join(own, 'context-equality-start.json')),
      fullContextEqualityAtFreeze: bind(path.join(own, 'context-equality-final.json')),
      fullCorrectedN80: context.n80, fullAuthorBoundN83: context.n83,
      spec: bind(specFile), geometry: bind(path.join(own, 'geometry.json')),
      svg: bind(svgFile), render: bind(renderFile),
      nativeCalls: bind(path.join(own, 'native-calls.json')),
      draftValidation: bind(path.join(own, 'draft-validation.json')),
      widthEvidence: bind(path.join(own, 'width-previews.json')),
      authorObservations: bind(observationsFile),
      independentPixelInventory: bind(path.join(own, 'source-inventory-independent.json')),
      inventoryComparison: bind(path.join(own, 'inventory-comparison-and-repair.json')),
      repairHelper: bind(fileURLToPath(import.meta.url)),
    },
    fullContextEquality: true, sourceAndInitialHistoryPreservation: preservation,
    inventoryChanges: changes.inventoryChanges,
    inventoryObservationAdditions: read(path.join(own, 'inventory-comparison-and-repair.json')).inventoryObservationAdditions,
    modernAdditionsSeparate: read(path.join(own, 'source-inventory-independent.json')).modernAdditions,
    targetedChangeProof: changes,
    initialRepairHistory: initialFreeze.repairHistory,
    repairHistory: [{
      figure: 'fig-159', repairNumber: 1, initialAuthorFreeze: bind(initialFreezeFile),
      initialFailures: initialResult.initialFailures,
      repair: 'Remove unsupported combining U+20D7 from E text; realize the same rightward vector accent with three native deterministic segments.',
      spec: bind(specFile), svg: bind(svgFile), render: bind(renderFile),
      nativeStatus: 'pass', authorVisualStatus: authorPass ? 'pass' : 'fail',
      widthObservations: observations.widthObservations,
    }],
    nativeCallCounts: nativeCalls.counts, successfulWidthPreviewRuns: 1,
    widthHelperAttempts: 2, zeroOutputWidthHelperFailures: 1, newWidthPreviews: 3,
    widthHelperFailure: bind(path.join(own, 'width-helper-zero-output-failure.json')),
    previews: previews.checks.map(check => ({
      ...check.preview, widthPx: check.widthPx, dimensionsPx: check.dimensionsPx,
      actualFontMinPx: Math.min(...check.metrics.labels.map(item => item.actualFontPx)),
      authorInspection: observations.widthObservations.find(item => item.widthPx === check.widthPx),
    })),
    actualOutcome: observations.actualOutcome,
    imageLedger: observations.imageLedger,
    browserPolicy: { ...policy, allContextsAndBrowserClosed: true },
    independentReviewStatus: 'pending', independentModernGateRequired: true,
    independentApproval: false, promotable: false, promoted: false,
    remainingAuthorIssues: authorPass ? [] : observations.remainingAuthorIssues,
    pendingHandoff: ['Fresh independent reviewer must inspect these exact repair hashes; author visual pass is not independent approval. No second author repair is available.'],
    prohibitedOperationsPerformed: [],
    frozenFiles: files(own),
  })
  console.log(JSON.stringify({
    authorStatus: authorPass ? 'pass' : 'fail', freeze: bind(path.join(own, 'author-repair-freeze.json')),
    svg: bind(svgFile), spec: bind(specFile), render: bind(renderFile),
    loadedImages: 5, repairs: 1, fullContextEquality: true, independentReview: 'pending', promotion: false,
  }))
}

const action = process.argv[2]
if (action === 'prepare') prepare()
else if (action === 'native') native()
else if (action === 'widths') await widths()
else if (action === 'freeze') freeze()
else throw new Error('Expected prepare, native, widths or freeze')
