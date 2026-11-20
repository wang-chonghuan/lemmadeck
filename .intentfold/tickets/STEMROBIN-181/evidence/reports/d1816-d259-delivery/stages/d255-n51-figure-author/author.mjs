import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), repo, 'Use the exact active checkout.')
const work = path.join(repo, '.tmp/STEMROBIN-181/d1816-d255')
const evidence = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d255-n51-figure-author')
const old = path.join(repo, '.intentfold/tickets/STEMROBIN-181/evidence/figures/candidates/9p/9p-n51-figures')
const frozen = path.join(repo, '.intentfold/tickets/STEMROBIN-181/evidence/author-history/d015/9p-n51-frozen.lesson.template.json')
const sci = path.join(repo, '.intentfold/tickets/STEMROBIN-181/evidence/reports/9p-n51-science-review.json')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c1-s6-n51/lesson.json')
const image = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-88.png')
const tools = path.join(repo, '.agents/skills/ld-s10y-image')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const specFile = path.join(work, 'fig-88.spec.json')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: sha(fs.readFileSync(file)) })
const fullText = lesson => [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n')
const writable = file => {
  const absolute = path.resolve(file)
  assert([work, evidence].some(root => absolute.startsWith(`${root}/`)), `Out-of-scope write: ${file}`)
  return absolute
}
const save = (file, value) => {
  writable(file)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const copy = (from, to) => {
  writable(to)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
const bindingFile = path.join(evidence, 'protected-inputs.json')
const currentInputs = () => {
  for (const item of read(bindingFile).files) {
    assert.equal(bind(item.path).sha256, item.sha256, `Input changed: ${item.path}`)
  }
}
const run = (stage, executable, args) => {
  currentInputs()
  const started = new Date().toISOString()
  const env = {
    ...process.env,
    PYTHON: python,
    PYTHONDONTWRITEBYTECODE: '1',
    PLAYWRIGHT_HTML_OPEN: 'never',
  }
  delete env.PWDEBUG
  const result = spawnSync(executable, args, {
    cwd: repo, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  })
  const receipt = {
    stage, cwd: repo, executable, args, started, finished: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout, stderr: result.stderr,
  }
  save(path.join(evidence, 'receipts', `${stage}.json`), receipt)
  currentInputs()
  console.log(JSON.stringify(receipt, null, 2))
  assert.equal(result.status, 0, `Stop dependent work: ${stage} failed; receipt retained.`)
  return result
}

function prepare() {
  assert(!fs.existsSync(work), 'Scratch is new; do not replace another run.')
  const lesson = read(frozen)
  const review = read(sci)
  assert.equal(lesson.id, 'phy9-c1-s6-n51')
  assert.equal(lesson.exercise_count, 0)
  assert.equal(review.status, 'pass')
  assert.equal(bind(frozen).sha256, review.bindings.template.sha256)
  assert.equal(bind(raw).sha256, review.bindings.source.sha256)
  assert.deepEqual(read(raw), lesson.source.data)
  assert.equal(sha(fullText(lesson)), 'c2114e6477a4825e65f986f34e1c1e10bf26134984bd392a83b3798d3fa73885')
  assert.deepEqual(read(path.join(old, 'fig-88.spec.json')).source.authoritativeText, [
    { lesson: lesson.id, text: fullText(lesson) },
  ])
  const oldFiles = [
    'author-freeze.json', 'fig-88.spec.json', 'fig-88.initial.spec.json',
    'fig-88.render.json', 'fig-88.svg', 'fig-88.png', 'fig-88.context.json',
    'fig-88.repair-evidence.json', 'fig-88.attempts.json',
    'fig-88.render-command.json', 'fig-88.corrected-render-command.json',
    'fig-88.source-inventory.json', 'fig-88.author-assertions.json',
    'fig-88.author-pixel-observations.json', 'fig-88.preview-manifest.json',
    'fig-88.w640.png', 'fig-88.w331.png', 'fig-88.w342.png',
    ...['preservation.json', 'fig-88.spec.json', 'fig-88.render.json',
      'fig-88.svg', 'fig-88.png', 'fig-88.attempts.json', 'fig-88.render-command.json']
      .map(name => `fig-88.rejected-initial/${name}`),
  ].map(name => path.join(old, name))
  const contracts = [
    path.join(repo, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
    path.join(tools, 'SKILL.md'),
    ...['routing.md', 'figure-spec.md', 'quality-gate.md'].map(name => path.join(tools, 'references', name)),
    path.join(tools, 'assets/figure-spec.schema.json'),
    ...['build_context.py', 'validate_spec.py', 'render_spec.mjs', 'materialize_arrowheads.mjs']
      .map(name => path.join(tools, 'scripts', name)),
    path.join(repo, '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js'),
    path.join(repo, '.agents/skills/node_modules/jsxgraph/distrib/jsxgraph.css'),
  ]
  save(bindingFile, {
    role: 'AUTHOR', ticket: 'STEMROBIN-181', stage: 'd1816-d255',
    files: [frozen, sci, raw, image, ...contracts, ...oldFiles].map(bind),
    rule: 'Reference old evidence without modifying or duplicating the package.',
  })
  save(path.join(evidence, 'receipts', 'directory-probe.json'), {
    stage: 'read-only-directory-probe',
    cwd: repo,
    command: 'ls -ld .tmp/STEMROBIN-181/d1816-d255 .intentfold/tickets/STEMROBIN-181/tmp/d1816-d255-n51-figure-author .claude/skills/ld-s10y-lesson/.venv/bin/python .agents/skills/node_modules/playwright-core .agents/skills/node_modules/jsxgraph',
    exitCode: 1,
    diagnosis: 'Both user-requested new output directories did not exist. Existing runtime/dependencies were present. This is an expected directory-probe result, not a content failure.',
    stderr: 'ls: .intentfold/tickets/STEMROBIN-181/tmp/d1816-d255-n51-figure-author: No such file or directory\nls: .tmp/STEMROBIN-181/d1816-d255: No such file or directory',
    recovery: 'Created only the requested new directories; no failed producer was rerun.',
  })
  const cliLesson = path.join(work, 'context-root/9p/editions/modern-us-neutral/lessons/phy9-c1-s6-n51')
  copy(frozen, path.join(cliLesson, 'lesson.json'))
  copy(frozen, path.join(work, '9p-n51-frozen.lesson.template.json'))
  save(path.join(work, 'source.lesson.json'), lesson.source.data)
  save(path.join(cliLesson, 'exercises.json'), { exercises: [] })
  const sourceLink = path.join(work, 'context-root/9p/figures/fig-88.png')
  writable(sourceLink)
  fs.mkdirSync(path.dirname(sourceLink), { recursive: true })
  fs.symlinkSync(image, sourceLink)
  copy(path.join(old, 'fig-88.spec.json'), specFile)
  save(path.join(evidence, 'prepare.json'), {
    role: 'AUTHOR', status: 'prepared',
    approvedChineseText: bind(frozen), fullAuthoritativeTextSha256: sha(fullText(lesson)),
    originalRawLesson: bind(raw), originalRawReusedFrom: 'Frozen template source.data; compared structurally with the original raw lesson.',
    localRawProjection: bind(path.join(work, 'source.lesson.json')),
    localFrozenText: bind(path.join(work, '9p-n51-frozen.lesson.template.json')),
    cliLesson: bind(path.join(cliLesson, 'lesson.json')),
    cliSourceImageLink: { path: sourceLink, target: fs.readlinkSync(sourceLink), ...bind(sourceLink) },
    seedSpec: bind(specFile), retainedSeed: bind(path.join(old, 'fig-88.spec.json')),
    science: { evidence: bind(sci), status: 'existing-pass-reused', rerun: false },
  })
  console.log('Prepared only n51 frozen inputs and editable draft inside new scratch.')
}

function context() {
  const output = path.join(work, 'fig-88.context.native.json')
  run('build-context', python, [
    '-B', path.join(tools, 'scripts/build_context.py'),
    '--book', '9p', '--edition', 'modern-us-neutral', '--figure', 'fig-88',
    '--root', path.join(work, 'context-root'), '--output', output,
  ])
  const native = read(output)
  const lesson = read(frozen)
  assert.equal(native.lessons.length, 1)
  assert.equal(native.lessons[0].lesson, lesson.id)
  assert.equal(native.sourceImage.sha256, bind(image).sha256)
  assert(native.lessons[0].prose.length > 0)
  save(path.join(work, 'fig-88.context.json'), {
    ...native,
    sourceImage: { ...native.sourceImage, path: image },
    nativeCLI: bind(output),
    authoritativeRule: 'Unchanged approved Chinese title and all 10 prose/caption blocks are authoritative; original PNG supplies graph structure. Native CLI nearby text is supplemented with the complete frozen text, not substituted.',
    lessons: [{
      ...native.lessons[0], fullProse: lesson.prose,
      authoritativeText: fullText(lesson), originalRawLesson: bind(raw),
      frozenTemplate: bind(frozen),
    }],
    fullAuthoritativeTextSha256: sha(fullText(lesson)),
    existingChineseSCI: { evidence: bind(sci), status: 'existing-pass-reused', rerun: false },
  })
}

function validate() {
  assert.equal(read(specFile).source.authoritativeText[0].text, fullText(read(frozen)))
  const result = run('validate-draft', python, [
    '-B', path.join(tools, 'scripts/validate_spec.py'), specFile, '--stage', 'draft', '--json',
  ])
  save(path.join(work, 'fig-88.validation.json'), {
    ...JSON.parse(result.stdout), specBinding: bind(specFile),
  })
}

function render() {
  assert.equal(read(path.join(work, 'fig-88.validation.json')).specBinding.sha256, bind(specFile).sha256)
  run('native-render', process.execPath, [
    path.join(tools, 'scripts/render_spec.mjs'), '--spec', specFile,
    '--svg', path.join(work, 'fig-88.svg'),
    '--png', path.join(work, 'fig-88.png'),
    '--report', path.join(work, 'fig-88.render.json'),
  ])
  const result = read(path.join(work, 'fig-88.render.json'))
  assert.equal(result.status, 'pass')
  assert.equal(result.spec.sha256, bind(specFile).sha256)
  assert.equal(result.output.svg.sha256, bind(path.join(work, 'fig-88.svg')).sha256)
}

async function preview() {
  currentInputs()
  assert.equal(read(path.join(work, 'fig-88.render.json')).status, 'pass')
  const require = createRequire(path.join(repo, '.agents/skills/package.json'))
  const { chromium } = require('playwright-core')
  const executablePath = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, process.env.CHROME_PATH,
    chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find(file => file && fs.existsSync(file))
  assert(executablePath, 'Use the existing browser; do not download one.')
  const browser = await chromium.launch({ headless: true, executablePath })
  const started = new Date().toISOString()
  const views = []
  const requests = []
  try {
    const page = await browser.newPage({ viewport: { width: 640, height: 640 }, deviceScaleFactor: 1 })
    await page.route('**/*', route => {
      requests.push(route.request().url())
      return route.abort('blockedbyclient')
    })
    const svg = fs.readFileSync(path.join(work, 'fig-88.svg'), 'utf8')
    for (const width of [640, 331]) {
      await page.setViewportSize({ width, height: width })
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
        html,body{margin:0;width:100%;height:100%;background:#fff}
        #media{width:${width}px;max-width:640px;aspect-ratio:1}
        #media svg{width:100%;height:auto;display:block}
      </style></head><body><div id="media">${svg}</div></body></html>`)
      await page.evaluate(() => document.fonts.ready)
      const metrics = await page.evaluate(() => {
        const svg = document.querySelector('svg')
        const frame = svg.getBoundingClientRect()
        const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
          const box = node.getBoundingClientRect()
          const transform = node.getScreenCTM()
          const px = Number.parseFloat(getComputedStyle(node).fontSize) *
            Math.hypot(transform.a, transform.b)
          return {
            id: node.getAttribute('data-label-id'), text: node.textContent, px,
            box: { x: box.x, y: box.y, width: box.width, height: box.height },
            inside: box.x >= frame.x && box.y >= frame.y &&
              box.right <= frame.right && box.bottom <= frame.bottom,
          }
        })
        const paths = [...svg.querySelectorAll('path')].filter(node => !node.closest('defs'))
        return {
          width: frame.width, height: frame.height,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
          measuredMinPx: Math.min(...labels.map(label => label.px)), labels,
          curve: paths.filter(node => node.getAttribute('d')?.startsWith('M180,530'))
            .map(node => ({ d: node.getAttribute('d'), dash: getComputedStyle(node).strokeDasharray })),
        }
      })
      assert.equal(metrics.width, width)
      assert.equal(metrics.horizontalOverflow, false)
      assert.equal(metrics.labels.length, 15)
      assert(metrics.labels.every(label => label.inside && label.px >= 16))
      const output = path.join(work, `fig-88.w${width}.png`)
      writable(output)
      await page.locator('#media').screenshot({ path: output, animations: 'disabled' })
      views.push({ ...bind(output), width, metrics })
    }
    assert.equal(requests.length, 0, 'Preview must remain entirely offline.')
    save(path.join(work, 'fig-88.preview-manifest.json'), {
      role: 'AUTHOR', status: 'author-preview-metrics-complete-not-independent-review',
      layout: 'inline', purpose: 'instructional', maxWidthPx: 640, minTextPx: 16,
      mobileWidthBasis: 'Actual mobile inline media width 331px supplied by this production continuation; no network/product launch.',
      source: bind(image), spec: bind(specFile), render: bind(path.join(work, 'fig-88.render.json')),
      svg: bind(path.join(work, 'fig-88.svg')), nativePng: bind(path.join(work, 'fig-88.png')),
      views, networkRequests: requests,
    })
    save(path.join(evidence, 'receipts/preview.json'), {
      stage: 'offline-width-previews', cwd: repo, executablePath,
      started, finished: new Date().toISOString(), exitCode: 0,
      mode: 'headless-author-preview-not-headed-product-acceptance',
      widthChecks: [640, 331], networkRequests: requests,
    })
  } catch (error) {
    save(path.join(evidence, 'receipts/preview-failure.json'), {
      stage: 'offline-width-previews', cwd: repo, started,
      finished: new Date().toISOString(), exitCode: 1, error: error.message, completedViews: views,
    })
    throw error
  } finally {
    await browser.close()
  }
  currentInputs()
}

function freeze() {
  currentInputs()
  const spec = read(specFile)
  const baseline = read(path.join(old, 'fig-88.spec.json'))
  const lesson = read(frozen)
  const renderFile = path.join(work, 'fig-88.render.json')
  const validationFile = path.join(work, 'fig-88.validation.json')
  const manifestFile = path.join(work, 'fig-88.preview-manifest.json')
  const contextFile = path.join(work, 'fig-88.context.json')
  const sourceObservationFile = path.join(evidence, 'source-observation.json')
  const authorObservationFile = path.join(evidence, 'author-observation.json')
  const manifest = read(manifestFile)
  const observation = read(authorObservationFile)
  assert.equal(read(renderFile).status, 'pass')
  assert.equal(read(validationFile).status, 'pass')
  assert.equal(read(renderFile).spec.sha256, bind(specFile).sha256)
  assert.equal(read(validationFile).specBinding.sha256, bind(specFile).sha256)
  assert.equal(manifest.spec.sha256, bind(specFile).sha256)
  assert.equal(manifest.render.sha256, bind(renderFile).sha256)
  assert.equal(manifest.svg.sha256, bind(path.join(work, 'fig-88.svg')).sha256)
  assert.equal(manifest.nativePng.sha256, bind(path.join(work, 'fig-88.png')).sha256)
  assert.equal(read(contextFile).lessons[0].authoritativeText, fullText(lesson))
  assert.equal(spec.source.authoritativeText[0].text, fullText(lesson))
  assert.equal(spec.source.image.sha256, bind(image).sha256)
  assert.equal(read(sourceObservationFile).sourceSha256, bind(image).sha256)
  assert.deepEqual(spec.canvas, baseline.canvas)
  assert.deepEqual(spec.display, baseline.display)
  assert.deepEqual(spec.assertions, baseline.assertions)
  assert.deepEqual(spec.source.image, baseline.source.image)
  assert.deepEqual(spec.source.authoritativeText, baseline.source.authoritativeText)
  assert.equal(spec.objects.length, baseline.objects.length)
  const changed = []
  for (let index = 0; index < spec.objects.length; index++) {
    const actual = spec.objects[index]
    const before = baseline.objects[index]
    if (actual.id === 'schematic-note') {
      assert.deepEqual(before.at, [125, 30])
      assert.deepEqual(actual.at, [125, 25])
      assert.deepEqual({ ...actual, at: before.at }, before)
      changed.push({ id: actual.id, field: 'at', before: before.at, after: actual.at })
    } else assert.deepEqual(actual, before, `Unexpected rendering change: ${actual.id}`)
  }
  assert.equal(changed.length, 1)
  assert.equal(spec.source.inventory.length, 4)
  for (const group of spec.source.inventory) {
    const original = baseline.source.inventory.find(item => item.id === group.id)
    assert.deepEqual({ ...group, description: original.description }, original)
  }
  assert.equal(observation.imageOpenCount, observation.imageOpens.length)
  assert(observation.imageOpenCount <= 8)
  const imageOpens = observation.imageOpens.map(item => ({ ...item, ...bind(item.path) }))
  for (const view of manifest.views) assert.equal(bind(view.path).sha256, view.sha256)
  assert.equal(manifest.nativePng.sha256, manifest.views.find(view => view.width === 640).sha256)
  const retained = {
    originalFailureSpec: bind(path.join(old, 'fig-88.rejected-initial/fig-88.spec.json')),
    originalFailureRender: bind(path.join(old, 'fig-88.rejected-initial/fig-88.render.json')),
    originalFailureSvg: bind(path.join(old, 'fig-88.rejected-initial/fig-88.svg')),
    originalFailurePng: bind(path.join(old, 'fig-88.rejected-initial/fig-88.png')),
    originalFailureReceipt: bind(path.join(old, 'fig-88.rejected-initial/fig-88.render-command.json')),
    originalPreservation: bind(path.join(old, 'fig-88.rejected-initial/preservation.json')),
    originalAttempts: bind(path.join(old, 'fig-88.attempts.json')),
    historicalRepairedSpec: bind(path.join(old, 'fig-88.spec.json')),
    historicalSecondFailureRender: bind(path.join(old, 'fig-88.render.json')),
    historicalSecondFailureReceipt: bind(path.join(old, 'fig-88.corrected-render-command.json')),
    historicalRepairEvidence: bind(path.join(old, 'fig-88.repair-evidence.json')),
    historicalAuthorFreeze: bind(path.join(old, 'author-freeze.json')),
  }
  const repairAccounting = {
    invocation: 'Same STEMROBIN-181 production invocation; counts never reset.',
    historicalInitialRenderAttempts: 1,
    historicalInitialFailures: 1,
    historicalTargetedRepairs: read(path.join(old, 'fig-88.repair-evidence.json')).targetedRepairs,
    historicalSecondRenderFailures: 1,
    newTargetedDeterministicRepairs: 1,
    newNativeRenderAttempts: 1,
    newRenderFailures: 0,
    cumulativeTargetedRepairs: 2,
    cumulativeNativeRenderAttempts: 3,
    cumulativeFailedRenderResults: 2,
    executionRetries: 0,
    currentProducerFailures: 0,
    expectedMissingDirectoryProbe: 1,
    approvalBasis: 'Latest direct human clarification authorizes minimum additional ordinary reversible deterministic repairs; the historical no-further-repair note is not a permanent ban. A genuine source ambiguity would still HOLD.',
    historicalCountReconciliation: 'Initial attempts.json records targetedRepairs=0 before the historical O move; later repair-evidence.json and author-freeze.json record 1. Retain both; use the later count without rewriting history.',
    visibleChange: changed,
    provenanceChange: 'Rebuilt four source-based descriptions from personally opened source; moved the modern Schematic inventory entry to the separate modernAdditions observation. No object added or deleted.',
  }
  assert.equal(repairAccounting.historicalTargetedRepairs, 1)
  const authorAssertionsFile = path.join(work, 'fig-88.author-assertions.json')
  save(authorAssertionsFile, {
    role: 'AUTHOR', status: 'author-mechanical-evidence-not-independent-review',
    baseline: retained.historicalRepairedSpec, candidate: bind(specFile),
    unchanged: ['source.image', 'source.authoritativeText', 'canvas', 'display', 'assertions',
      '35 of 36 objects entirely; Schematic text/font/style preserved; its anchor only changed'],
    changedObjects: changed,
    sourceInventoryDescriptionsRefreshed: spec.source.inventory.map(group => group.id),
    modernAdditions: read(sourceObservationFile).modernAdditionsNotSourceData,
    pathAnchorCheck: {
      curve: 'source-curve',
      screenAnchors: ['source-O', 'source-A', 'source-B', 'source-C', 'source-D', 'source-E', 'source-K']
        .map(id => {
          const at = spec.objects.find(object => object.id === id).at
          return { id, userSpace: at, screenSpace: [at[0], 640 - at[1]] }
        }),
      svgPath: spec.objects.find(object => object.id === 'source-curve').d,
      geometryVerified: 'Path command endpoints match every recorded point; native executable displacement/connects assertions pass. Screen coordinates are nonquantitative layout.',
    },
    nativeAssertions: spec.assertions,
    nativeValidation: bind(validationFile), nativeRender: bind(renderFile),
    originalInputsUnchanged: bind(bindingFile),
  })
  const reportFile = path.join(evidence, 'report.json')
  const outputs = {
    sourceImage: bind(image), rawLesson: bind(raw),
    embeddedRawLesson: bind(path.join(work, 'source.lesson.json')),
    approvedChineseTemplate: bind(frozen),
    frozenTextCopy: bind(path.join(work, '9p-n51-frozen.lesson.template.json')),
    fullAuthoritativeTextSha256: sha(fullText(lesson)),
    chineseScienceReview: bind(sci),
    authoritativeContext: bind(contextFile),
    nativeCLIContext: bind(path.join(work, 'fig-88.context.native.json')),
    sourceObservation: bind(sourceObservationFile),
    spec: bind(specFile), validation: bind(validationFile),
    render: bind(renderFile), svg: bind(path.join(work, 'fig-88.svg')),
    png: bind(path.join(work, 'fig-88.png')),
    previewManifest: bind(manifestFile),
    previews: manifest.views.map(view => ({ path: view.path, sha256: view.sha256, width: view.width })),
    authorAssertions: bind(authorAssertionsFile),
    authorObservation: bind(authorObservationFile),
  }
  const receiptFiles = fs.readdirSync(path.join(evidence, 'receipts')).sort()
    .map(name => bind(path.join(evidence, 'receipts', name)))
  const report = {
    schema: 'STEMROBIN-181/figure-author-report@1',
    ticket: 'STEMROBIN-181', stage: 'd1816-d255', book: '9p', lesson: lesson.id, figure: 'fig-88',
    role: 'AUTHOR', status: 'author-candidate-ready-for-independent-review',
    outputs, retainedOriginalFailureAndCandidate: retained,
    repairAccounting, imageOpens, imageOpenCount: imageOpens.length, imageOpenLimit: 8,
    sourceInventory: 'Four source-bound groups in the spec; modern regularization/additions recorded separately.',
    gates: {
      sourcePixelComparison: 'author-performed-only',
      approvedChineseSCI: 'existing-PASS-reused-not-repeated',
      nativeDraftValidation: 'pass',
      nativeRender: 'pass',
      display: read(renderFile).displayChecks,
      actualOfflineInlineWidths: manifest.views.map(view => ({
        width: view.metrics.width, minTextPx: view.metrics.measuredMinPx,
        labelCount: view.metrics.labels.length, allLabelsInside: view.metrics.labels.every(label => label.inside),
        horizontalOverflow: view.metrics.horizontalOverflow,
      })),
      independentFigureReview: 'pending',
      independentReviewPASSRegistered: false,
      sourceAmbiguityHold: false,
      promoted: false,
    },
    preservation: { protectedInputs: bind(bindingFile), checkedUnchanged: true },
    receipts: receiptFiles,
    execution: {
      everyCommandCwd: repo, authorHelper: bind(path.join(evidence, 'author.mjs')),
      nativeContextCLIExplicitRoot: path.join(work, 'context-root'),
      paidCalls: 0, generatedImageCalls: 0, networkRequests: 0,
      otherAgents: 0, gitActions: 0, testsOrProductBuilds: 0,
      sourceOrCanonicalEdits: 0, meterWrites: 0, oldEvidenceEdits: 0,
      sharedCodeEdits: 0, databaseActions: 0, publishOrDeployActions: 0,
      imageResponsesToParent: 0, activeChildProcesses: [],
    },
    nextReviewerScope: 'Independent current fig-88 source/figure review only. Open the original and current preview/spec using these hashes; inspect exact curve, guides, label roles and 640/331px legibility. Do not repeat the existing Chinese SCI. No promotion until separate reviewer approval and normal affected-stage gates.',
    limitations: observation.limitations,
  }
  save(reportFile, report)
  save(path.join(evidence, 'author-freeze.json'), {
    schema: 'STEMROBIN-181/figure-author-freeze@1',
    ticket: 'STEMROBIN-181', stage: 'd1816-d255', book: '9p', lesson: lesson.id, figure: 'fig-88',
    role: 'AUTHOR', status: 'author-frozen-pending-independent-review',
    frozenAt: new Date().toISOString(), report: bind(reportFile),
    ...outputs, retainedOriginalFailureAndCandidate: retained,
    repairAccounting, imageOpens, imageOpenCount: imageOpens.length, imageOpenLimit: 8,
    receipts: receiptFiles, protectedInputs: bind(bindingFile),
    approvedChineseSCIReused: true, chineseSCIReruns: 0,
    independentReview: { status: 'pending', passRegisteredByAuthor: false },
    promoted: false, inFlightProcesses: [],
  })
  currentInputs()
  console.log(JSON.stringify({
    status: 'author-frozen-pending-independent-review',
    report: bind(reportFile), freeze: bind(path.join(evidence, 'author-freeze.json')),
    candidate: outputs.spec, repairAccounting, imageOpens: imageOpens.length,
  }, null, 2))
}

const stage = process.argv[2]
assert(['prepare', 'context', 'validate', 'render', 'preview', 'freeze'].includes(stage))
if (stage === 'prepare') prepare()
if (stage === 'context') context()
if (stage === 'validate') validate()
if (stage === 'render') render()
if (stage === 'preview') await preview()
if (stage === 'freeze') freeze()
