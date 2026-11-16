import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = process.cwd()
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const native = '.agents/skills/ld-s10y-image/scripts'
const lessonPath = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s3-n91/lesson.template.json'
const sciencePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n91-science-review.json'
const prosePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n91-prose-freeze.json'
const imagePath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-171.png'
const expected = {
  [lessonPath]: 'db008e8eccbfac6fdf4ef7f5ed22e619d1a3f694a6ae4eb6d17971f73f7b76d5',
  [sciencePath]: 'bc6a88b3d83ba5b67e9a6aa1687c2beb985fbe6be11e9f89919415d1d995b2a8',
  [prosePath]: 'b41fb14ceab3800bec7b73132c4ab49fc1c7422aa26d85c367d5aef770275407',
  [imagePath]: '475626450dfb5df4e39820f4adca6577f3742ab6a77fa1e8188b8795442d4878',
}
const sha = value => crypto.createHash('sha256').update(value).digest('hex')
const read = filename => fs.readFileSync(path.resolve(root, filename))
const json = filename => JSON.parse(read(filename))
const binding = filename => {
  const bytes = read(filename)
  return { path: path.resolve(root, filename), sha256: sha(bytes), bytes: bytes.length }
}
function put(filename, value) {
  const target = path.resolve(base, filename)
  assert.ok(target.startsWith(`${base}${path.sep}`))
  assert.ok(!fs.existsSync(target), `refusing to overwrite ${target}`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, typeof value === 'string' || Buffer.isBuffer(value)
    ? value : `${JSON.stringify(value, null, 2)}\n`)
}
function verifyInputs() {
  for (const [filename, hash] of Object.entries(expected)) {
    assert.equal(binding(filename).sha256, hash, `changed input: ${filename}`)
  }
  const lesson = json(lessonPath)
  const science = json(sciencePath)
  assert.equal(science.status, 'pass')
  assert.equal(science.checks.review.stage, 'INITIAL')
  assert.equal(science.bindings.lessonTemplate.sha256, expected[lessonPath])
  assert.equal(lesson.id, 'phy9-c2-s3-n91')
  assert.equal(lesson.exercise_count, 0)
  assert.equal(lesson.prose.length, 13)
  assert.equal(lesson.prose.filter(block => block.kind === 'p').length, 11)
  assert.equal(lesson.prose.filter(block => block.kind === 'cap').length, 1)
  return lesson
}
function textOf(lesson) {
  return [
    lesson.printed_title,
    ...lesson.prose.filter(block => ['p', 'cap'].includes(block.kind))
      .map(block => block.text),
  ].join('\n\n')
}
function run(name, executable, args) {
  const receipt = {
    name, cwd: root, executable, args,
    environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never' },
    startedAt: new Date().toISOString(),
    inputs: [
      binding(path.join(base, 'commands/author.mjs')),
      binding(args[0]),
      ...Object.keys(expected).map(binding),
      ...['spec/fig-171.spec.json', 'context/context.json']
        .map(filename => path.join(base, filename))
        .filter(filename => fs.existsSync(filename)).map(binding),
    ],
  }
  const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1' }
  delete env.PWDEBUG
  put(`commands/${name}.started.json`, receipt)
  const result = spawnSync(executable, args, { cwd: root, env, encoding: 'utf8' })
  put(`outputs/${name}.stdout.txt`, result.stdout || '')
  put(`outputs/${name}.stderr.txt`, result.stderr || '')
  put(`commands/${name}.json`, {
    ...receipt, completedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    stdout: binding(path.join(base, `outputs/${name}.stdout.txt`)),
    stderr: binding(path.join(base, `outputs/${name}.stderr.txt`)),
  })
  process.stdout.write(`${name}: exit ${result.status}\n${result.stdout || ''}${result.stderr || ''}`)
  return result.status
}
function prepare() {
  const lesson = verifyInputs()
  put('context/lesson.template.snapshot.json', read(lessonPath))
  put('context/science-review.snapshot.json', read(sciencePath))
  put('context/prose-freeze.snapshot.json', read(prosePath))
  put('context/input-bindings.json', Object.keys(expected).map(binding))
  const book = 'context/native-root/9p'
  put(`${book}/editions/modern-us-neutral/lessons/${lesson.id}/lesson.json`, read(lessonPath))
  put(`${book}/editions/modern-us-neutral/lessons/${lesson.id}/exercises.json`, {
    exercises: [],
  })
  const link = path.join(base, book, 'figures/fig-171.png')
  fs.mkdirSync(path.dirname(link), { recursive: true })
  fs.symlinkSync(path.resolve(root, imagePath), link)
  put('context/scaffold-policy.json', {
    lesson: 'Exact full current template bytes, renamed for the native context builder only.',
    exercises: 'Zero-item native scaffold; no exercise or answer data read or authored.',
    sourceImage: 'Symlink to the unchanged original PNG.',
    authoritativeCanonicalization: 'Native nearbyText is retained separately; canonical context and spec contain every current p/cap plus the exact printed title.',
  })
  assert.equal(run('build-context-initial', 'python3', [
    `${native}/build_context.py`, '--book', '9p', '--edition', 'modern-us-neutral',
    '--figure', 'fig-171', '--root', path.join(base, 'context/native-root'),
    '--output', path.join(base, 'context/native-context.json'),
  ]), 0)
  const nativeContext = json(path.join(base, 'context/native-context.json'))
  assert.equal(nativeContext.lessons.length, 1)
  assert.equal(nativeContext.lessons[0].lesson, lesson.id)
  assert.equal(nativeContext.lessons[0].title, lesson.printed_title)
  const authoritativeText = [{ lesson: lesson.id, text: textOf(lesson) }]
  const context = {
    ...nativeContext,
    sourceImage: { ...nativeContext.sourceImage, path: imagePath },
    lessonTemplate: binding(lessonPath),
    nativeContext: binding(path.join(base, 'context/native-context.json')),
    science: binding(sciencePath),
    proseFreeze: binding(prosePath),
    authoritativeText,
    lessons: [{
      lesson: lesson.id, title: lesson.printed_title,
      prose: [{
        figureLabel: lesson.prose.find(block => block.kind === 'fig').label,
        nearbyText: lesson.prose.filter(block => ['p', 'cap'].includes(block.kind)).map(block => block.text),
      }],
      exercises: [],
    }],
    completeProse: lesson.prose,
    scope: 'Author context only; no native normalization, prose-flow or science replay.',
  }
  put('context/context.json', context)
  const spec = json(path.join(base, 'spec/fig-171.definition.json'))
  const inventory = json(path.join(base, 'inventory/source-inventory.json'))
  const nativeAssertionIds = new Set(spec.assertions.map(item => item.id))
  spec.source = {
    image: { path: imagePath, sha256: expected[imagePath] },
    authoritativeText,
    inventory: inventory.sourceFacts.map(group => ({
      id: group.id, description: `${group.fact} ${group.pixels}`,
      objects: group.objects,
      assertions: group.assertions.filter(id => nativeAssertionIds.has(id)),
    })),
  }
  put('spec/fig-171.spec.json', spec)
  put('outputs/prepare-result.json', {
    status: 'pass', authoritativeBlocks: 13, pBlocks: 11, captions: 1,
    exercises: 0, canonicalPrintedTitle: lesson.printed_title,
    authoritativeTextSha256: sha(textOf(lesson)),
    noInputsEdited: Object.keys(expected).map(binding),
  })
}
function checkContracts() {
  const lesson = verifyInputs()
  const spec = json(path.join(base, 'spec/fig-171.spec.json'))
  const context = json(path.join(base, 'context/context.json'))
  const object = new Map(spec.objects.map(item => [item.id, item]))
  const checks = []
  function check(id, test) {
    test()
    checks.push({ id, status: 'pass' })
  }
  check('full-authoritative-text-contract', () => {
    assert.deepEqual(spec.source.authoritativeText, [{ lesson: lesson.id, text: textOf(lesson) }])
    assert.deepEqual(context.authoritativeText, spec.source.authoritativeText)
    assert.deepEqual(context.completeProse, lesson.prose)
    assert.equal(context.lessons[0].title, lesson.printed_title)
    assert.deepEqual(context.lessons[0].prose[0].nearbyText,
      lesson.prose.filter(block => ['p', 'cap'].includes(block.kind)).map(block => block.text))
  })
  for (const [id, labelId, text] of [
    ['zero-label-contract', 'origin-label', '0'],
    ['resistivity-label-contract', 'resistivity-label', '\u03c1'],
    ['temperature-label-contract', 'temperature-label', 't'],
    ['rho-zero-label-contract', 'rho-zero-label', '\u03c1\u2080'],
  ]) check(id, () => assert.equal(object.get(labelId).text, text))
  check('single-frame-contract', () => {
    assert.equal(spec.objects.filter(item => item.type === 'grid').length, 0)
    assert.equal(spec.objects.filter(item => item.type === 'axis').length, 0)
    assert.equal(spec.objects.filter(item => item.id.endsWith('-axis')).length, 2)
    assert.deepEqual(object.get('origin').at, [0, 0])
  })
  check('no-temperature-ticks-contract', () => {
    assert.ok(spec.objects.every(item => !item.ticks))
    assert.deepEqual(spec.objects.filter(item => item.type === 'text').map(item => item.text),
      ['\u03c1', 't', '0', '\u03c1\u2080'])
  })
  check('model-finite-solid-contract', () => {
    assert.equal(object.get('finite-model').type, 'segment')
    assert.equal(object.get('finite-model').dash, 0)
    assert.equal(object.get('finite-model').from, 'model-intercept')
    assert.equal(object.get('finite-model').to, 'model-end')
    assert.ok(!object.get('finite-model').lastArrow)
    assert.ok(!object.get('finite-model').firstArrow)
    assert.equal(spec.objects.filter(item => item.type === 'svgPath' || item.type === 'line').length, 0)
  })
  check('no-extrapolation-contract', () => {
    assert.deepEqual(object.get('model-intercept').at, [0, 1])
    assert.deepEqual(object.get('model-end').at, [4.25, 2.6])
    assert.deepEqual(spec.objects.filter(item => item.type === 'segment').map(item => item.id),
      ['intercept-guide', 'finite-model'])
    assert.ok(spec.objects.filter(item => item.type === 'point').every(item => item.visible === false))
  })
  check('semantic-colors-contract', () => {
    const roles = ['ink', 'muted', 'accent', 'accentSoft', 'grid', 'paper']
    for (const item of spec.objects) {
      for (const key of ['stroke', 'fill', 'labelColor']) {
        if (item[key]) assert.ok(roles.includes(item[key]))
      }
    }
  })
  check('actual-display-contract', () => {
    assert.deepEqual(spec.display, {
      layout: 'inline', purpose: 'instructional', maxWidthPx: 640,
      minTextPx: 16, widths: [640, 342, 331],
    })
    assert.ok(spec.objects.filter(item => item.type === 'text')
      .every(item => item.fontSize * 331 / spec.canvas.width >= 16))
  })
  const allIds = new Set([...spec.assertions.map(item => item.id), ...checks.map(item => item.id)])
  for (const group of json(path.join(base, 'inventory/source-inventory.json')).sourceFacts) {
    assert.ok(group.assertions.every(id => allIds.has(id)), `unexecuted source contract: ${group.id}`)
  }
  put('outputs/source-contracts.initial.json', { status: 'pass', checks })
}
function nativeRun() {
  checkContracts()
  const specPath = path.join(base, 'spec/fig-171.spec.json')
  const validate = run('validate-spec-initial', 'python3', [
    `${native}/validate_spec.py`, specPath, '--stage', 'draft', '--json',
  ])
  if (validate !== 0) process.exitCode = 1
  if (validate === 0) {
    const render = run('render-spec-initial', 'node', [
      `${native}/render_spec.mjs`, '--spec', specPath,
      '--svg', path.join(base, 'candidate/fig-171.svg'),
      '--report', path.join(base, 'candidate/fig-171.render.json'),
    ])
    if (render !== 0) process.exitCode = 1
  }
}
function previews() {
  assert.equal(verifyInputs().id, 'phy9-c2-s3-n91')
  assert.equal(json(path.join(base, 'candidate/fig-171.render.json')).status, 'pass')
  assert.equal(run('preview-capture-initial', 'node', [
    path.join(base, 'commands/capture-previews.mjs'),
  ]), 0)
}
function freeze() {
  verifyInputs()
  const render = json(path.join(base, 'candidate/fig-171.render.json'))
  const preview = json(path.join(base, 'outputs/preview-measurements.json'))
  const pixels = json(path.join(base, 'outputs/pixel-observations.json'))
  assert.equal(render.status, 'pass')
  assert.equal(preview.status, 'pass')
  assert.equal(pixels.imageOpens.total, 4)
  const files = []
  function collect(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filename = path.join(dir, entry.name)
      if (entry.isDirectory()) collect(filename)
      else if (!entry.isSymbolicLink()) files.push(binding(filename))
    }
  }
  collect(base)
  put('authored-freeze.json', {
    schema: 'd023/fig171-authored-freeze@1',
    ticket: 'STEMROBIN-181', batch: 'D023', lesson: 'phy9-c2-s3-n91', figure: 'fig-171',
    role: 'AUTHOR', status: 'authored-frozen-awaiting-fresh-independent-review',
    frozenAt: new Date().toISOString(),
    bindings: {
      source: binding(imagePath), lesson: binding(lessonPath),
      lessonSnapshot: binding(path.join(base, 'context/lesson.template.snapshot.json')),
      science: binding(sciencePath), proseFreeze: binding(prosePath),
      context: binding(path.join(base, 'context/context.json')),
      nativeContext: binding(path.join(base, 'context/native-context.json')),
      inventory: binding(path.join(base, 'inventory/source-inventory.json')),
      spec: binding(path.join(base, 'spec/fig-171.spec.json')),
      render: binding(path.join(base, 'candidate/fig-171.render.json')),
      svg: binding(path.join(base, 'candidate/fig-171.svg')),
      previewImages: [640, 342, 331].map(width => binding(path.join(base, `candidate/preview-${width}.png`))),
      commands: files.filter(item => item.path.startsWith(path.join(base, 'commands/'))),
    },
    evidence: files,
    nativeToolBindings: [
      `${native}/build_context.py`, `${native}/validate_spec.py`,
      `${native}/render_spec.mjs`, `${native}/materialize_arrowheads.mjs`,
      '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
      '.agents/skills/ld-s10y-image/SKILL.md',
      '.agents/skills/ld-s10y-image/references/routing.md',
      '.agents/skills/ld-s10y-image/references/figure-spec.md',
      '.agents/skills/ld-s10y-image/references/quality-gate.md',
    ].map(binding),
    sourceUnchanged: true, lessonUnchanged: true,
    counts: {
      imageOpens: pixels.imageOpens, repairCount: 0,
      buildContextRuns: 1, explicitValidateRuns: 1, renderRuns: 1,
      rendererInternalDraftValidation: 1, previewCaptureRuns: 1,
      scienceReplays: 0, normalizerReplays: 0, proseFlowReplays: 0,
    },
    display: {
      purpose: 'instructional', layout: 'inline', maxWidthPx: 640,
      actualMediaWidths: preview.previews.map(item => item.mediaWidth),
      measuredMinTextPx: preview.previews.map(item => ({ width: item.width, px: item.measuredMinTextPx })),
    },
    limitations: [
      'Author-only candidate, not an independent review or product acceptance.',
      'Isolated headless SVG previews using the existing app Playwright; no app route or headed product measurement.',
      'Physical slope, numeric endpoint temperatures/resistivities and calibrated finite interval are unspecified by the source and deliberately not assigned.',
      'Native nearby context is preserved separately and augmented with complete current authoritative lesson text, not replaced with a stale edition.',
      'The source rho0 interval-marker tips are small old-print strokes; the author records opposing-tip interpretation for fresh source-pixel review.',
      'No source edits, template promotion, native adapt finalization, review@1, Git, DB, full tests, children or other chats.',
      'The existing prose (9-5) formula-number layout observation remains unresolved and outside this figure author scope.',
    ],
  })
  console.log(JSON.stringify(binding(path.join(base, 'authored-freeze.json')), null, 2))
}
const action = process.argv[2]
if (action === 'prepare') prepare()
else if (action === 'native') nativeRun()
else if (action === 'previews') previews()
else if (action === 'freeze') freeze()
else throw new Error('Expected prepare, native, previews or freeze')
