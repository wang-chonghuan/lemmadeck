import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const freezePath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d031-n114-figures-b-author-freeze.json')
assert.ok(!fs.existsSync(freezePath), 'Never overwrite an author freeze')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha: hash(file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`) || path.resolve(file) === freezePath)
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const inputs = read(path.join(own, 'input-bindings.json'))
for (const key of ['chinese', 'english', 'science', 'firstPair', 'sourceInventory']) assert.equal(hash(inputs[key].path), inputs[key].sha256, key)
const inventory = read(inputs.sourceInventory.path)
const selected = [['fig-235', 'initial'], ['fig-236', 'repair-1'], ['fig-237', 'repair-1']]
const observations = {
  'fig-235': [
    'Final normal640 PNG was opened once at original detail. Because its canvas is 640 px, the same image is also the full-resolution view; no separate native image open was needed.',
    'Upper and lower horizontal rails have distinct feeder and conductor attachments. The single supply has two terminals, a long exterior upper feeder and a separate looping lower return. All physical wire joins are explicit and no center junction is introduced.',
    'Dashed reference positions at x360/x480 remain outside the inward solid middle portions at x400/x440. Both preserved current heads visibly point upward, attached to those distinct parallel solid portions. Their 40 px separation is positive and smaller than the 120 px reference separation.',
    'All labels, margins, solid wires, loop and endpoints fit the canvas. No horizontal force arrows, copied sign-like box glyphs, polarity labels, Cyrillic or decorative apparatus are present.',
  ],
  'fig-236': [
    'Final normal640 PNG was opened once at original detail and serves both native-resolution and normal-product-width visual inspection.',
    'Two vertical wires have separate free upper endpoints and four endpoint dots. Left switch has a raised blade ending near (142,415), apart from the contact at (180,455); the separated thin base is a mechanical shell, not a closing circuit edge.',
    'Left and right supplies have separate two-terminal return paths. Left source-to-switch, switch-to-upper-wire and lower return are complete but the switch gap remains open. Right source, vertical wire and both return leads form the other closed circuit; no cross-circuit wire appears.',
    'There is exactly one current arrow on the right wire. Its downward direction is a justified illustrative addition, not a claimed fig-236 source arrow. I = 0 refers only to the no-steady-current left circuit. No dashed references were added.',
    'The sole repair separates Power/supply lines to 56 px while retaining 32 px typography. Labels are now legible, in bounds and clear of each other; source glyphs are not reproduced.',
  ],
  'fig-237': [
    'Final normal640 PNG was opened once at original detail and provides both full-resolution and actual-normal-width inspection.',
    'Two separate conductors are visible through the pair: six over/under crossing gaps are deliberately rendered by a paper insulation underlay on the second member, without dots or electrical junctions at the crossings. Exact winding count/over-order are declared modern regularization, not source givens.',
    'The pair has separate upper and lower endpoints. Its upper turn closes the return path; its lower tails remain distinct and go to separate left-supply terminals. The small ambiguous source lower loop-like mark is not turned into a lower short. A short parallel reading window keeps the two currents separately legible.',
    'The left middle arrow points down, the right middle arrow up, and both carry equal I labels and equal-length arrow vectors. These two middle arrows are additions from the approved text. The source upward arrow on the right lower pair tail and source downward arrow on the independent other wire are retained, giving four current heads total.',
    'The single other wire and its outer upper/lower curled return leads remain in a separate two-terminal supply circuit. Supply outlines are nonconductive shells; physical joins are terminal/endpoint dots. No pair-to-single junction, force arrow, compass, zero-field claim, source glyph or cultural wording is added.',
    'Power/supply labels are clear after their sole spacing repair. All 32 px labels, endpoints, upper turn, braid strokes and return paths stay inside the 640 px canvas.',
  ],
}
const imageLog = []
for (const item of inventory.figures) {
  const source = path.join(repo, item.sourcePNG)
  assert.equal(hash(source), item.sha256)
  imageLog.push({
    sequence: imageLog.length + 1, figure: item.id, role: 'sourcePNG',
    ...bind(source), actuallyOpened: true, count: 1, tool: 'view_image', detail: 'high',
  })
}
const figures = []
for (const [id, attempt] of selected) {
  const out = path.join(own, id, attempt)
  const specFile = path.join(out, 'spec.json'), spec = read(specFile)
  const renderFile = path.join(out, 'render.json'), render = read(renderFile)
  const geometry = read(path.join(out, 'geometry.json'))
  const assertionsFile = path.join(out, 'author-assertions.json')
  const widthFile = path.join(out, 'width-preview-report.json'), width = read(widthFile)
  const historyFile = path.join(out, 'repair-history.json'), history = read(historyFile)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(read(assertionsFile).status, 'pass')
  assert.equal(width.status, 'pass')
  assert.equal(history.repairCount, attempt === 'initial' ? 0 : 1)
  for (const field of ['nativePNG', 'normal640PNG', 'svg', 'spec', 'render']) assert.equal(hash(width[field].path), width[field].sha256)
  const mobile = width.measurements.find(item => item.viewport.width === 390)
  assert.equal(mobile.metrics.actualMediaWidth, 640)
  assert.equal(mobile.metrics.containerWidth, 358)
  assert.equal(mobile.metrics.minTextPx, 32)
  assert.equal(mobile.metrics.maxScroll, 282)
  assert.equal(mobile.metrics.reachedScrollEnd, true)
  for (const failure of history.failures) {
    assert.equal(read(failure.render.path).status, 'fail')
    assert.equal(hash(failure.render.path), failure.render.sha256)
    assert.equal(hash(failure.command.path), failure.command.sha256)
  }
  if (history.initialNativePNG) assert.equal(hash(history.initialNativePNG.path), history.initialNativePNG.sha256)
  const sourceEntry = inventory.figures.find(item => item.id === id)
  const pixelFile = path.join(out, 'author-pixel-observations.json')
  const normalFile = width.normal640PNG.path
  write(pixelFile, {
    status: 'PASS', figure: id, authorOnly: true, independentApproval: false,
    sourcePNG: bind(spec.source.image.path), normal640PNG: bind(normalFile),
    fullResolutionAndNormalWidthInspectedTogether: true,
    nativePNGSeparatelyOpened: false,
    completeChineseBinding: inputs.chinese, completeEnglishBinding: inputs.english,
    comparedCompleteApprovedText: true,
    sourceInventory: sourceEntry, additions: geometry.additions,
    findings: [], observations: observations[id],
    visibleLabels: geometry.expectedLabels,
    mathematicalVisualCulturalAuthorChecks: 'PASS',
    limits: 'Unknown small source marks are left undecoded. Author inspection is not independent FIG approval or native finalization.',
  })
  imageLog.push({
    sequence: imageLog.length + 1, figure: id, role: 'finalNormal640PNGAndFullResolution',
    ...bind(normalFile), actuallyOpened: true, count: 1, tool: 'view_image', detail: 'original',
  })
  const reviewFile = path.join(out, 'author-review.json')
  assert.ok(!fs.existsSync(reviewFile))
  const reviewScript = path.join(repo, '.agents/skills/ld-s10y-image/scripts/record_review.py')
  const args = [
    reviewScript, '--spec', specFile, '--render', renderFile,
    '--output', reviewFile, '--status', 'pass',
    '--notes', `AUTHOR ONLY. Independently inventoried the durable source before drawing, read complete approved Chinese/English, inspected final 640 px PNG once as both full-resolution and normal media width. Native gates, all semantic connects/current/parallel relationships, conductive topology and insulated-crossing checks PASS; headed desktop/mobile artifact media is 640 px, actual mobile container 358 px, 32 px labels, scroll end reachable. Repairs ${history.repairCount}/1; initial failure artifacts retained. Small source glyphs undecoded; all additions declared. This is not independent FIG approval, science approval, promotion, full-card approval or running-app acceptance. Detailed observations: ${pixelFile}`,
  ]
  const command = spawnSync('python3', args, {
    cwd: repo, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  write(path.join(out, 'record-review-command.json'), {
    command: ['python3', ...args], exitCode: command.status, stdout: command.stdout, stderr: command.stderr,
  })
  assert.equal(command.status, 0, command.stdout + command.stderr)
  const review = read(reviewFile)
  assert.equal(review.status, 'pass')
  assert.equal(review.spec.sha256, hash(specFile))
  assert.equal(review.render.sha256, hash(renderFile))
  for (const output of Object.values(review.outputs)) assert.equal(hash(path.resolve(repo, output.path)), output.sha256)
  figures.push({
    id, status: 'PASS', authorStatus: 'PASS', attempt,
    sourcePNG: bind(spec.source.image.path),
    sourcePNGDimensions: (() => {
      const header = fs.readFileSync(spec.source.image.path).subarray(0, 24)
      return [header.readUInt32BE(16), header.readUInt32BE(20)]
    })(),
    spec: bind(specFile), svg: bind(width.svg.path), render: bind(renderFile),
    authorReview: bind(reviewFile), authorPixelObservations: bind(pixelFile),
    nativePNG: bind(width.nativePNG.path), normal640PNG: bind(normalFile),
    completeContext: bind(path.join(own, id, 'complete-context.json')),
    completeChineseBinding: inputs.chinese, completeEnglishBinding: inputs.english,
    display: spec.display, canvas: spec.canvas,
    widthEvidence: {
      ...bind(widthFile), status: 'PASS', fixedMediaWidthPx: 640,
      actualMobileContainerWidthPx: 358, mobileMaxScrollPx: 282,
      actualMinimumLabelPx: 32, scrollEndReachable: true,
      desktopViewport: [1440, 960], mobileViewport: [390, 844], headed: true,
      authorityLimit: width.scope,
    },
    authorAssertions: bind(assertionsFile),
    repairHistory: bind(historyFile), repairCount: history.repairCount,
    remainingRepairs: history.remainingRepairs, initialFailures: history.failures,
    initialNativePNG: history.initialNativePNG || null,
    sourceInventory: { ...bind(inputs.sourceInventory.path), entry: sourceEntry },
    sourceinventory: sourceEntry,
    additions: geometry.additions,
    independentApproval: false, promotionApproval: false,
  })
}
write(path.join(own, 'image-account.json'), {
  plannedImageOpens: 6, actualImageOpens: 6, maximumImageOpens: 8,
  sourceOpens: 3, finalNormal640Opens: 3, fullResolutionOpensSharedWithNormal: 3,
  nativeSeparateOpens: 0, initialFailureImageOpens: 0,
  reopens: 0, crops: 0, otherImages: 0, imagePayloadReturnedToParent: false,
  entries: imageLog,
})
write(path.join(own, 'live-ticket-read.json'), {
  ticket: 'STEMROBIN-181', backend: 'plane', project: 'lemmadeck',
  id: '7ebae0e0-c024-481d-8360-5b3d3bfdda79', sequence_id: 181,
  name: '\u8865\u9f50\u4e5d\u5341\u5e74\u7ea7\u7269\u7406\u53ca\u4e24\u518c\u6982\u7387\u7edf\u8ba1',
  readOn: '2026-11-16', via: 'Unchanged n-plane plane.sh GET/paginate helper',
  readOnly: true, backendWrites: 0,
  currentInvocation: 'Human explicitly resumes this bounded same-active-invocation author task; no setup, backend state change or ticket handoff is performed.',
  transport: 'GET requests returned HTTP 200. An initial jq shape error was corrected for reading paginated response objects; no write or figure retry occurred.',
})
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    assert.ok(!entry.isSymbolicLink(), 'Frozen owned artifacts must not contain mutable symlinks')
    return entry.isDirectory() ? files(file) : [file]
  })
}
const frozenFiles = files(own).sort().map(file => ({ ...bind(file), bytes: fs.statSync(file).size }))
for (const key of ['chinese', 'english', 'science', 'firstPair']) assert.equal(hash(inputs[key].path), inputs[key].sha256)
write(freezePath, {
  schema: 'ld-s10y-image/author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'd031-n114-figures-b', book: '9p',
  card: 'phy9-c2-s5-n114', frozenOn: '2026-11-16', status: 'PASS',
  authorStatus: 'PASS', authority: 'Bounded figure AUTHOR only',
  ownedRoot: own, ownedFreezePath: freezePath, frozenFiles, figures,
  completeChineseBinding: inputs.chinese, completeEnglishBinding: inputs.english,
  completeContext: figures.map(item => ({ id: item.id, ...item.completeContext })),
  reusedSCI: { ...inputs.science, status: 'PASS', newScienceApproval: false },
  previousPairIndependentPASS: { ...inputs.firstPair, status: 'PASS', scope: 'Existing fig-233/234 evidence only; images not opened and source inventories not reused as facts for this batch.' },
  imageAccount: bind(path.join(own, 'image-account.json')),
  imageOpenLog: imageLog, imageOpens: 6, imagesLoaded: 6,
  imageAccounting: {
    planned: 6, batchImageCount: 6, contextImageCount: 6, maxBatch: 8, maxContext: 24,
    sourceOpens: 3, normal640Opens: 3, fullResolutionInspectionSharedWithNormalOpens: 3,
    nativeSeparateOpens: 0, initialFailureImageOpens: 0, reopens: 0, crops: 0, otherImages: 0,
    imagePayloadReturnedToParent: false,
  },
  isolation: {
    sameActiveInvocation: true, newSetup: 0,
    projectWritesLimitedToOwnedRootAndFreezePath: true,
    sourceOrProseEdits: 0, priorFinalSpecOrMediaEdits: 0,
    otherOwnersFilesEditedOrReverted: 0, appEdits: 0, dependencyChanges: 0,
    databaseOperations: 0, charterEdits: 0, sharedModernWrites: 0,
    gitWrites: 0, backendWrites: 0, promotionOperations: 0,
    fullProjectTestOrBuildRuns: 0, appServerStarts: 0,
    allAuthorBrowserInstancesClosed: true,
  },
  independentApproval: false, fullCardApproval: false, newScienceApproval: false,
  nativeFinalizationApproval: false, promotionApproval: false, runningProductAcceptance: false,
  limits: 'Author PASS only. All outputs remain in the owned scratch root. Complete text, source PNGs, specs, render evidence, review previews and initial failures are hash-bound. Independent FIG approval and durable-output rebinding/finalization remain separate parent responsibilities. Do not promote these author paths or treat artifact CSS measurements as a live-app acceptance. Any failed later review must respect each figure remaining repair count.',
})
for (const item of frozenFiles) assert.equal(hash(item.path), item.sha)
console.log(JSON.stringify({
  statuses: figures.map(item => ({ id: item.id, authorStatus: item.authorStatus, repairs: item.repairCount })),
  frozenFiles: frozenFiles.length, imageOpens: 6, freezePath, sha256: hash(freezePath),
}, null, 2))
