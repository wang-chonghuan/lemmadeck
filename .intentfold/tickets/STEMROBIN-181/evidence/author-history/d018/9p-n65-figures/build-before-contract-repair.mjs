import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const root = process.cwd()
const ticket = '.intentfold/tickets/STEMROBIN-181'
const work = '.tmp/STEMROBIN-181/9p-n65-figures'
const candidates = `${ticket}/evidence/figures/candidates/9p/9p-d018-n65-figures`
const template = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n65/lesson.template.json'
const manifest = template.replace('lesson.template.json', 'figures.template.json')
const science = `${ticket}/tmp/9p-n65-science-review.json`
const proseFreeze = `${ticket}/tmp/9p-n65-prose-freeze.json`
const inventoryPath = `${ticket}/tmp/d018-n65-figure-source-inventory.json`
const correctionPath = `${ticket}/tmp/d018-n65-fig110-atom-inventory-correction.json`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'
const frozen = '393e39c13b41f4e3ba6a28e87a99a5ddd6f1073c49428f2b9dbf7c6b2ee33d43'
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const bytes = typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`
  assert.equal(fs.existsSync(file), false, `Preserve existing evidence: ${file}`)
  fs.writeFileSync(file, bytes, { flag: 'wx' })
}
assert.equal(bind(template).sha256, frozen)
assert.equal(read(science).status, 'pass')
assert.equal(read(science).bindings.template.sha256, frozen)
assert.equal(bind(inventoryPath).sha256, 'a373ca582cd10483642320e6e4020fcad8cd249ca6ddbf17b132e2389f0355ef')
const lesson = read(template)
const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n')
const inventory = read(inventoryPath)
const correction = read(correctionPath)
assert.deepEqual(correction.correction.rowCountsTopToBottom, [3, 6, 7, 8, 7, 6, 5, 4])
const sourceFor = id => {
  const source = inventory.figures.find(item => item.id === id).source
  assert.equal(bind(source.path).sha256, source.sha256)
  return { path: source.path, sha256: source.sha256 }
}
const env = { ...process.env, PYTHON: path.join(root, python), PYTHONDONTWRITEBYTECODE: '1', PLAYWRIGHT_HTML_OPEN: 'never' }
delete env.PWDEBUG
delete process.env.PWDEBUG
process.env.PLAYWRIGHT_HTML_OPEN = 'never'
const run = (command, args, input) => {
  const result = spawnSync(command, args, { env, input, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
  return { exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
}

function plan() {
  writeNew(`${work}/figures.template.before.json`, fs.readFileSync(manifest, 'utf8'))
  assert.equal(bind(`${work}/figures.template.before.json`).sha256, read(proseFreeze).bindings.figuresTemplate.sha256)
  for (const id of ['tbl-p0163-01', 'fig-110']) {
    const result = run(python, ['-B', '-c', `
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context
p=json.load(sys.stdin)
image=Path(p['source']['path'])
assert build_context.sha256(image)==p['source']['sha256']
w,h=build_context.png_size(image)
blocks=[dict(b,label=b.get('label') or '') for b in p['lesson']['prose']]
near=build_context.prose_context(blocks,p['id'])
assert near
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['id'],
 'sourceImage':dict(p['source'],width=w,height=h),'suggestedSize':build_context.suggested_size(w,h),
 'authoritativeRule':'Complete science-passed frozen title and every current prose/caption text are authoritative. Source PNG supplies visual structure; no answer key.',
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],'prose':near,
 'fullProse':p['lesson']['prose'],'authoritativeText':p['fullText'],'exercises':[]}],
 'inputs':p['inputs'],'construction':'Existing build_context API on the complete frozen scratch lesson.'
},ensure_ascii=False))
`], JSON.stringify({ id, lesson, fullText, source: sourceFor(id), inputs: {
      source: sourceFor(id), lesson: bind(template), science: bind(science), proseFreeze: bind(proseFreeze),
      inventory: bind(inventoryPath), atomDetailCorrection: bind(correctionPath),
    } }))
    assert.equal(result.exitCode, 0, result.stderr)
    const context = JSON.parse(result.stdout)
    assert.equal(context.lessons[0].authoritativeText, fullText)
    assert.deepEqual(context.lessons[0].fullProse, lesson.prose)
    writeNew(`${work}/${id}/context.json`, context)
  }
  const prompt = `Create semantic ARTWORK ONLY for a layered contemporary instructional textbook illustration, not a portrait.
The supplied original PNG has two full-length people facing each other, left speaking and right listening. Preserve exactly two people and those roles. Use the complete current Chinese lesson below as semantic authority over source styling.
Use a 1536x1024 landscape canvas with a pure white background. Both figures are standing naturally with separated feet, arms lowered, no held object, no contact between the figures. Their full heads, hands, legs and shoes must remain inside the image with clear margins. Contemporary neutral everyday clothing, credible anatomy, natural subdued colors. No archival paper, old monochrome engraving, caricature, flags, costume, historical portrait identity or cultural stereotype.
Place the left figure mainly within x=5%..33% of the canvas and the right figure within x=67%..95%. Leave the middle x=35%..65% wholly white around face height. Heads are near y=12%..30%, with the speaking open mouth facing right near x=31%, y=23%; the other person faces left, with listening ear/head near x=69%, y=23%.
These percentages are ARTWORK PLACEMENT ONLY, not physical data, sound measurements or a scale. Keep the full-height visual relationship of the original, but do not copy its old cartoon style.
IMPORTANT: OMIT ALL sound marks and wave strokes from this artwork. The deterministic layer supplies the source schematic marks later. Do not generate air particles, arrows, rays, a line from mouth to ear, waveforms, speech bubbles, labels, letters, numbers, text, grids, ticks, times, distances or dimensions. No bulk air jet or visible plume. Only the two isolated people on white.
The source's sound strokes merely indicate propagation; they are not measured wave cycles and are not evidence that electromagnetic interactions require a mechanical medium.

COMPLETE FROZEN AUTHORITATIVE LESSON (title + ALL prose and captions):
${fullText}
`
  writeNew(`${work}/tbl-p0163-01/artwork.prompt.txt`, prompt)
  writeNew(`${work}/plan.json`, {
    template: bind(template), science: bind(science), inventory: bind(inventoryPath), correction: bind(correctionPath),
    beforeFiguresTemplate: { ...bind(`${work}/figures.template.before.json`), metadata: { original: manifest } },
    generatedOutput: `${candidates}/conversation.initial.png`,
    generatedMetadata: `${candidates}/conversation.initial.png.json`,
    candidateStatus: 'Unapproved durable author evidence only; not edition promotion.',
    authorRenderCalls: 0,
  })
  console.log(`Planned contexts and prompt: ${work}; candidate output ${candidates}/conversation.initial.png`)
}

function base(id, mode, height, description) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode, description,
    source: { image: sourceFor(id), authoritativeText: [{ lesson: lesson.id, text: fullText }], inventory: [] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper' },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths: [640, 331, 342] },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  }
}

function conversationSpec() {
  const id = 'tbl-p0163-01'
  const asset = `${candidates}/conversation.initial.png`
  const metadata = `${asset}.json`
  const generation = read(metadata)
  assert.equal(generation.output.path, asset)
  assert.equal(generation.output.sha256, bind(asset).sha256)
  const spec = base(id, 'hybrid', 427,
    'Two people in conversation with source schematic propagation strokes between speaker and listener. Air sound is a local mechanical process, not bulk air transport or a measured waveform. No physical scale, speed or elapsed time is shown.')
  spec.assets = [{ id: 'conversation-people', path: asset, metadata, role: 'artwork' }]
  spec.objects.push({ id: 'conversation-people-scene', type: 'image', asset: 'conversation-people', at: [0, 0], size: [640, 427] })
  const paths = [
    'M206,52 C209,55 209,61 206,65',
    'M223,69 C224,72 224,75 223,78',
    'M250,47 C256,52 257,68 251,75',
    'M310,40 C319,50 319,72 310,82',
    'M370,36 C382,49 382,72 370,86',
    'M430,36 C443,50 443,73 430,86',
  ]
  const ids = []
  for (const [index, d] of paths.entries()) {
    const objectId = `sound-source-stroke-${index + 1}`
    ids.push(objectId)
    spec.objects.push({ id: objectId, type: 'svgPath', d, stroke: 'muted', strokeWidth: 3, fill: 'none' })
  }
  spec.assertions.push(
    { id: 'one-semantic-conversation-scene', type: 'objectCount', objectType: 'image', count: 1 },
    { id: 'six-source-schematic-strokes', type: 'objectCount', objectType: 'svgPath', count: 6 },
    { id: 'no-invented-propagation-arrow', type: 'objectCount', objectType: 'arrow', count: 0 },
    { id: 'no-source-data-labels', type: 'objectCount', objectType: 'text', count: 0 },
  )
  spec.source.inventory = [
    { id: 'source-two-people', description: 'Source has exactly two full-length people, left speaking and right listening, separated and facing one another. Their heads/ears/mouths and two arms/legs each remain visible. Modern neutral anatomy and clothing replace source cartoon style; exact physical dimensions are not given.', objects: ['conversation-people-scene'], assertions: ['one-semantic-conversation-scene'] },
    { id: 'source-six-propagation-strokes', description: 'Six source ink strokes, two short nearest the mouth and four taller curved strokes. Modern regularization preserves their identities and qualitative inter-face placement, not measured wavelength, wave-cycle count, frequency or bulk air transport.', objects: ids, assertions: ['six-source-schematic-strokes', 'no-invented-propagation-arrow', 'no-source-data-labels'] },
  ]
  writeNew(`${work}/${id}/initial/${id}.spec.json`, spec)
  writeNew(`${work}/${id}/candidate-asset-binding.json`, {
    status: 'unapproved-candidate-retained-before-first-render',
    source: sourceFor(id), context: bind(`${work}/${id}/context.json`),
    asset: bind(asset), generation: bind(metadata),
    generationOutputPathMatchesAsset: true, assetPathsDependOnTmp: false,
    generationBytesModified: false,
    outputLayersRemainScratch: true, promotionPerformed: false,
  })
}

// Convex clipping is only a visible-silhouette construction, not physical atom reconstruction.
function clipConvex(subject, boundary) {
  let output = subject
  for (let edge = 0; edge < boundary.length; edge++) {
    const a = boundary[edge]
    const b = boundary[(edge + 1) % boundary.length]
    const cross = p => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
    const input = output
    output = []
    for (let index = 0; index < input.length; index++) {
      const p = input[index]
      const q = input[(index + 1) % input.length]
      const cp = cross(p)
      const cq = cross(q)
      if (cp >= -1e-9) output.push(p)
      if ((cp >= 0) !== (cq >= 0)) {
        const t = cp / (cp - cq)
        output.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])])
      }
    }
  }
  return output
}
const circleVertices = (cx, cy, radius, count = 96) => Array.from({ length: count }, (_, index) => {
  const angle = 2 * Math.PI * index / count
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
})

function threadSpec() {
  const id = 'fig-110'
  const h = 780
  const spec = base(id, 'deterministic', h,
    'A continuous thread suspends one load from one support. One enlargement leader points to a circular schematic microscopic arrangement with exactly the source eight rows of visible atomic glyphs, including clipped peripheral fragments. This is not a measured lattice, force-arrow diagram or proof of instantaneous action.')
  const xy = (x, y) => [40 + x * 1.6, h - (28 + y * 1.6)]
  const point = (name, x, y) => {
    spec.objects.push({ id: name, type: 'point', at: xy(x, y), visible: false })
    return name
  }
  const polygon = (name, points, style = {}) => {
    spec.objects.push({ id: name, type: 'polygon', points: points.map(([x, y]) => xy(x, y)), stroke: 'ink', fill: 'ink', fillOpacity: 1, strokeWidth: 1, ...style })
    return name
  }
  const upper = point('thread-upper-attachment', 45, 32)
  const lower = point('thread-lower-attachment', 45, 363)
  const sample = point('thread-sampled-region', 45, 286)
  const edge = point('enlargement-leader-frame-end', 159, 219)
  polygon('source-horizontal-support', [[14, 15], [80, 15], [80, 30], [14, 30]])
  polygon('source-upper-knot', [[41, 30], [49, 30], [51, 40], [45, 44], [40, 39]])
  spec.objects.push({ id: 'continuous-thread', type: 'segment', from: upper, to: lower, stroke: 'ink', strokeWidth: 3 })
  polygon('source-lower-knot', [[41, 355], [49, 355], [51, 365], [45, 369], [40, 364]])
  polygon('source-single-suspended-load', [[24, 363], [63, 363], [63, 422], [24, 422]], { fill: 'muted', strokeWidth: 2 })
  polygon('source-load-light-interior', [[30, 370], [36, 370], [36, 415], [30, 415]], { fill: 'paper', stroke: 'paper', strokeWidth: 0.5 })
  spec.objects.push({ id: 'single-enlargement-leader', type: 'arrow', from: sample, to: edge, stroke: 'ink', strokeWidth: 3 })
  spec.assertions.push(
    { id: 'thread-attachments-connected', type: 'connects', arrow: 'continuous-thread', from: upper, to: lower },
    { id: 'sample-on-suspended-thread', type: 'pointOnLine', point: sample, a: upper, b: lower },
    { id: 'leader-thread-to-detail', type: 'connects', arrow: 'single-enlargement-leader', from: sample, to: edge },
    { id: 'only-one-source-leader', type: 'objectCount', objectType: 'arrow', count: 1 },
  )
  const frame = circleVertices(250, 230, 93, 192)
  spec.objects.push({ id: 'atom-clip-container', type: 'polygon', points: frame.map(([x, y]) => xy(x, y)).reverse(), visible: false })
  const rows = [
    [140, [229, 254, 279]],
    [165, [190, 216, 242, 267, 293, 318]],
    [191, [176, 203, 229, 254, 279, 305, 329]],
    [217, [162, 187, 213, 240, 265, 291, 317, 341]],
    [242, [174, 200, 226, 252, 278, 304, 330]],
    [267, [184, 212, 238, 264, 291, 317]],
    [292, [197, 223, 250, 277, 303]],
    [317, [212, 238, 264, 290]],
  ]
  assert.deepEqual(rows.map(([, xs]) => xs.length), correction.correction.rowCountsTopToBottom)
  let count = 0
  for (const [row, [y, xs]] of rows.entries()) {
    const objects = []
    const centers = []
    const assertions = []
    for (const [column, x] of xs.entries()) {
      const glyphId = `atom-r${String(row + 1).padStart(2, '0')}-c${String(column + 1).padStart(2, '0')}`
      const visible = clipConvex(circleVertices(x, y, 12.2), frame)
      assert.ok(visible.length >= 3, `Source fragment lost: ${glyphId}`)
      assert.ok(visible.every(([px, py]) => Math.hypot(px - 250, py - 230) <= 93 + 1e-6))
      objects.push(polygon(glyphId, visible, { strokeWidth: 0.3 }))
      centers.push(point(`${glyphId}-construction-center`, x, y))
      const centroid = visible.reduce((sum, p) => [sum[0] + p[0] / visible.length, sum[1] + p[1] / visible.length], [0, 0])
      const insidePoint = point(`${glyphId}-visible-centroid`, ...centroid)
      const assertionId = `${glyphId}-visible-fragment-inside`
      spec.assertions.push({ id: assertionId, type: 'inside', point: insidePoint, container: 'atom-clip-container' })
      assertions.push(assertionId)
      count++
    }
    const rowAssertion = `source-row-${row + 1}-ordered-centers`
    spec.assertions.push({ id: rowAssertion, type: 'collinear', points: centers })
    assertions.push(rowAssertion)
    spec.source.inventory.push({
      id: `source-atomic-row-${row + 1}`,
      description: `Source visible row${row + 1}, top-to-bottom: ${xs.length} glyphs or peripheral fragments in left-to-right order. Count comes from the separately retained raw-pixel details, not a guessed lattice. Round contours and pixel layout are unmeasured schematic regularization; hidden centers are construction only. No unseen continuation is drawn outside the enlargement.`,
      objects, assertions,
    })
  }
  assert.equal(count, 46)
  spec.objects.push({ id: 'source-circular-enlargement-frame', type: 'circle', center: xy(250, 230), radius: 93 * 1.6, stroke: 'ink', strokeWidth: 3, fill: 'none' })
  spec.objects.push(
    { id: 'thread-English-label', type: 'text', at: xy(105, 135), text: 'Thread', fontSize: 34, labelPlacement: { position: 'CENTER' } },
    { id: 'load-English-label', type: 'text', at: xy(112, 395), text: 'Load', fontSize: 34, labelPlacement: { position: 'CENTER' } },
    { id: 'detail-English-label', type: 'text', at: xy(250, 100), text: 'Schematic detail', fontSize: 34, labelPlacement: { position: 'CENTER' } },
  )
  spec.assertions.push({ id: 'three-declared-English-labels', type: 'objectCount', objectType: 'text', count: 3 })
  spec.source.inventory.push(
    { id: 'source-connected-suspension', description: 'One upper horizontal support, two small attachment/knot regions, one continuous thread and one suspended load with a lighter interior stripe. No measured material, mass, dimension or force label is supplied. Modern Thread and Load labels merely name existing context-bound objects.', objects: ['source-horizontal-support', 'source-upper-knot', 'continuous-thread', 'source-lower-knot', 'source-single-suspended-load', 'source-load-light-interior', 'thread-English-label', 'load-English-label'], assertions: ['thread-attachments-connected', 'sample-on-suspended-thread'] },
    { id: 'source-one-magnification-leader', description: 'One source solid oblique enlargement leader runs from thread to the circular detail, never interpreted as a force arrow. The frame and gaps are schematic; Schematic detail is a justified English addition from the science-passed text, not a physical scale.', objects: ['single-enlargement-leader', 'source-circular-enlargement-frame', 'detail-English-label'], assertions: ['leader-thread-to-detail', 'only-one-source-leader', 'three-declared-English-labels'] },
  )
  writeNew(`${work}/${id}/initial/${id}.spec.json`, spec)
}

function renderFigure(id) {
  assert.ok(['fig-110', 'tbl-p0163-01'].includes(id))
  const dir = `${work}/${id}/initial`
  const report = `${dir}/${id}.render.json`
  assert.equal(fs.existsSync(`${dir}/native-command.json`), false, 'Do not repeat a native author attempt')
  const args = [renderer, '--spec', `${dir}/${id}.spec.json`, '--svg', `${dir}/${id}.svg`, '--report', report]
  if (id === 'tbl-p0163-01') args.push('--artwork', `${dir}/${id}.artwork.png`)
  const result = run('node', args)
  writeNew(`${dir}/native-command.json`, { command: ['node', ...args], ...result, authorAttempt: 1, repairUsed: 0 })
  console.log(result.stdout)
  if (result.exitCode !== 0) console.log(result.stderr.slice(0, 4000))
  console.log(`Native status: ${fs.existsSync(report) ? read(report).status : 'blocked-before-report'}`)
}

async function previews(id) {
  const dir = `${work}/${id}/initial`
  const spec = read(`${dir}/${id}.spec.json`)
  const report = read(`${dir}/${id}.render.json`)
  const require = createRequire(path.join(root, renderer))
  const { chromium } = require('playwright-core')
  const executablePath = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH, chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(file => fs.existsSync(file))
  assert.ok(executablePath, 'Existing headless renderer browser missing; no visible fallback')
  assert.equal(process.env.PWDEBUG, undefined)
  const browser = await chromium.launch({ executablePath, headless: true })
  const results = []
  try {
    const context = await browser.newContext({ deviceScaleFactor: 1 })
    const page = await context.newPage()
    const svg = fs.readFileSync(`${dir}/${id}.svg`, 'utf8')
    const artwork = id === 'tbl-p0163-01' ? fs.readFileSync(`${dir}/${id}.artwork.png`).toString('base64') : null
    for (const width of [640, 331, 342]) {
      const height = Math.ceil(width * spec.canvas.height / 640)
      const out = `${dir}/w${width}.png`
      assert.equal(fs.existsSync(out), false)
      await page.setViewportSize({ width, height })
      await page.setContent(`<!doctype html><style>:root{--ld-figure-ink:#1d2725;--ld-figure-muted:#5d6865;--ld-figure-accent:#1d2725;--ld-figure-accent-soft:#b0b8b5;--ld-figure-grid:#dde3e1;--ld-figure-paper:#fff}html,body{margin:0;background:white;width:100%;overflow:hidden}.figure{width:${width}px;height:${height}px;position:relative}svg,img{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:contain}</style><div class="figure">${artwork ? `<img src="data:image/png;base64,${artwork}" alt="">` : ''}${svg}</div>`)
      if (artwork) await page.locator('img').evaluate(image => image.decode())
      const metrics = await page.locator('svg').evaluate(element => ({
        width: element.getBoundingClientRect().width,
        labels: [...element.querySelectorAll('text')].map(node => ({
          text: node.textContent,
          px: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(node.getScreenCTM().a, node.getScreenCTM().b),
        })),
      }))
      assert.equal(metrics.width, width)
      assert.ok(metrics.labels.every(label => label.px >= 16), 'Actual label below16px; retain failure, no gate relaxation')
      await page.screenshot({ path: out, animations: 'disabled' })
      results.push({ width, height, png: bind(out), metrics, actuallyOpenedByAuthor: false })
    }
    await context.close()
  } finally {
    await browser.close()
  }
  writeNew(`${dir}/width-previews.json`, {
    kind: 'author-preview-not-independent-approval', spec: bind(`${dir}/${id}.spec.json`),
    render: bind(`${dir}/${id}.render.json`), nativeRenderStatus: report.status,
    isolatedHeadless: true, contextsClosed: true, browserClosed: true,
    PWDEBUGUnset: true, autoHtmlReportOpen: 'never', results,
  })
  console.log(`Saved three actual-width previews for ${id}; owned headless browser closed.`)
}

function freeze() {
  const figures = ['tbl-p0163-01', 'fig-110'].map(id => {
    const dir = `${work}/${id}/initial`
    const native = read(`${dir}/native-command.json`)
    const report = read(`${dir}/${id}.render.json`)
    const pixels = read(`${dir}/width-previews.json`)
    return {
      id, authorStatus: report.status === 'pass' ? 'rendered-awaiting-independent-review' : 'blocked',
      nativeStatus: report.status, authorAttempts: 1, repairUsed: 0, repairMaximum: 1,
      bindings: {
        source: sourceFor(id), lesson: bind(template), context: bind(`${work}/${id}/context.json`),
        spec: bind(`${dir}/${id}.spec.json`), svg: bind(`${dir}/${id}.svg`), render: bind(`${dir}/${id}.render.json`),
        nativeCommand: bind(`${dir}/native-command.json`), previews: bind(`${dir}/width-previews.json`),
        ...(id === 'tbl-p0163-01' ? { artwork: bind(`${dir}/${id}.artwork.png`), asset: bind(`${candidates}/conversation.initial.png`), generation: bind(`${candidates}/conversation.initial.png.json`), candidateBinding: bind(`${work}/${id}/candidate-asset-binding.json`) } : {}),
      },
      actualWidthPreviews: pixels.results,
      nativeCommand: native.command,
      independentReview: 'Pending Mencius; author has not approved or promoted this figure.',
    }
  })
  const report = {
    ticket: 'STEMROBIN-181', batch: 'D018', lesson: lesson.id, role: 'figure-author-only',
    status: figures.every(figure => figure.nativeStatus === 'pass') ? 'author-frozen-awaiting-independent-review' : 'author-frozen-with-blocker',
    lesson: bind(template), science: bind(science), proseFreeze: bind(proseFreeze),
    inventory: bind(inventoryPath), atomInventoryCorrection: bind(correctionPath),
    beforeFiguresTemplate: { ...bind(`${work}/figures.template.before.json`), metadata: { original: manifest } },
    currentFiguresTemplate: bind(manifest), figures,
    generationCalls: 1, generationUsageOrCost: 'Unknown if not supplied by native generation metadata; no fabricated amount.',
    reviewOrPromotionPerformed: false, sourceProseToolsAppDbGitEdited: false,
    browsersClosed: true, inFlightProcesses: [],
  }
  assert.equal(report.currentFiguresTemplate.sha256, report.beforeFiguresTemplate.sha256)
  writeNew(`${ticket}/tmp/d018-n65-figures-author-freeze.json`, report)
  console.log(JSON.stringify(bind(`${ticket}/tmp/d018-n65-figures-author-freeze.json`)))
}

const [action, id] = process.argv.slice(2)
if (action === 'plan') plan()
else if (action === 'specs') { conversationSpec(); threadSpec() }
else if (action === 'render') renderFigure(id)
else if (action === 'previews') await previews(id)
else if (action === 'freeze') freeze()
else throw new Error('Expected plan, specs, render <id>, previews <id>, or freeze')
