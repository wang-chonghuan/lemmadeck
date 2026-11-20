import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d089-n128-first-review')
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'))
const { proseOutline, proseFlow, sectionBreakIndices } = require('./htmlfrag.js')
const inputs = new Map()
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const read = p => JSON.parse(fs.readFileSync(path.resolve(root, p), 'utf8'))

function bind(p, expected, registry = inputs) {
  const absolute = path.resolve(root, p)
  const bytes = fs.readFileSync(absolute)
  const record = { path: absolute, sha256: sha(bytes), bytes: bytes.length }
  if (expected) assert.equal(record.sha256, expected, absolute)
  registry.set(absolute, record)
  return record
}

function checkBindings(value, registry = inputs) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    bind(value.path, value.sha256, registry)
  }
  Object.values(value).forEach(v => checkBindings(v, registry))
}

function writeOwn(name, value) {
  const target = path.join(own, name)
  assert.equal(path.dirname(target), own)
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`)
}

const ledger = read(path.join(own, 'image-ledger.json'))
assert.equal(ledger.opens.length, 8)
assert.equal(ledger.actualContextImageOpens, 8)
assert.equal(ledger.reopens + ledger.crops, 0)
ledger.opens.forEach(o => bind(o.path, o.sha256))
const authorPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d079-n128-author/author-freeze.json'
const repairPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d086-n128-fig290-affected-author/author-freeze.json'
const authorBinding = bind(authorPath, '8cc8e71bd663ca238150295de26cbb658de3285b874420f64bd50fcb96c69ab3')
const repairBinding = bind(repairPath, 'e21cb1d1df4c9e5ce30e5a7aca341ca27061cef1457b738bf3cb3b8653368343')
const author = read(authorPath)
const repair = read(repairPath)
const frozenBindings = new Map()
checkBindings(author, frozenBindings)
checkBindings(repair, frozenBindings)
assert.equal(frozenBindings.size, 119)
for (const [key, value] of frozenBindings) inputs.set(key, value)
const authorityPath = author.authority.live179SavedComments.path
const authority = read(authorityPath)
assert.ok(JSON.stringify(authority).includes('830251c5-4c6f-48af-9bae-6e3a22118c80'))
const reusedSourceApprovals = [
  bind('.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d076-source314315-raw281290/consumed.json'),
  bind('.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d081-source316317/consumed.json'),
]
assert.equal(read(reusedSourceApprovals[1].path).independentReviewerClosed, true)

const raw = read(author.isolatedAssembly.rawLesson.path)
const pages = new Map([314, 315, 316].map(n => [
  n, read(`ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0${n}/page.json`),
]))
const sourceText = ref => {
  const [, page, block] = ref.match(/^p(\d+)#(\d+)$/)
  return pages.get(Number(page)).blocks[Number(block) - 1].lines.join('').replaceAll('↵', '')
}
const compact = text => text.replace(/\s+/g, '')
const ownedRefs = raw.prose.flatMap(p => p.source_refs)
const expectedRefs = [
  ...[8, 9, 10].map(n => `p0314#${n}`),
  ...Array.from({ length: 13 }, (_, i) => `p0315#${i + 1}`),
  ...Array.from({ length: 9 }, (_, i) => `p0316#${i + 1}`),
]
assert.deepEqual([...ownedRefs].sort(), [...expectedRefs].sort())
assert.ok(sourceText('p0314#7').includes('128.'))
assert.ok(sourceText('p0316#10').includes('129.'))
raw.prose.forEach(p => {
  if (p.kind !== 'fig') assert.equal(compact(p.text), compact(p.source_refs.map(sourceText).join('')))
})
assert.equal(raw.prose.length, 22)
assert.deepEqual(raw.figures.map(f => f.id), ['fig-290', 'fig-291'])
assert.equal(read(author.isolatedAssembly.rawExercises.path).count, 0)
const mathTokens = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map(m => m[1] ?? m[2])
const localeChecks = author.templates.map(entry => {
  const doc = read(entry.lesson.path)
  assert.deepEqual(doc.source.data, raw)
  assert.deepEqual(doc.prose.map(p => p.source_refs), raw.prose.map(p => p.source_refs))
  const signatures = doc.prose.map((p, i) => {
    assert.equal(p.source_text, raw.prose[i].text)
    assert.deepEqual(mathTokens(p.text), mathTokens(raw.prose[i].text), `math block ${i}`)
    return { blockIndex: i, sourceRefs: p.source_refs, mathTokens: mathTokens(p.text), exact: true }
  })
  const paragraphs = proseOutline(doc.prose)
  const breaks = sectionBreakIndices(doc.prose, doc.section_breaks)
  assert.equal(paragraphs.length, 28)
  assert.deepEqual(breaks, [4, 15, 26])
  assert.equal(read(entry.exercises.path).count, 0)
  return {
    edition: entry.edition, lesson: bind(entry.lesson.path), exercises: bind(entry.exercises.path),
    manifest: bind(entry.figures.path), signatures, paragraphs: paragraphs.length,
    completeFlowEntries: proseFlow(doc.prose, doc.section_breaks).length,
    sectionBreaks: breaks.map(index => ({
      index, before: paragraphs[index - 1].text, after: paragraphs[index].text,
    })),
  }
})

const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0)
const minus = (a, b) => a.map((v, i) => v - b[i])
const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0]
const distance = (a, b) => Math.hypot(...minus(a, b))
function auditRelations(spec) {
  const objects = new Map(spec.objects.map(o => [o.id, o]))
  const point = id => {
    assert.ok(objects.has(id), id)
    return objects.get(id).at
  }
  const outcomes = spec.assertions.map(a => {
    const tolerance = a.tolerance ?? 1e-6
    let residual = 0
    if (a.type === 'connects') {
      const object = objects.get(a.arrow)
      assert.equal(object.from, a.from, a.id)
      assert.equal(object.to, a.to, a.id)
    } else if (a.type === 'displacement') {
      const delta = minus(point(a.to), point(a.from))
      residual = Math.max(Math.abs(delta[0] - a.dx), Math.abs(delta[1] - a.dy))
    } else if (a.type === 'collinear') {
      residual = Math.abs(cross2(minus(point(a.b), point(a.a)), minus(point(a.c), point(a.a))))
    } else if (a.type === 'parallel' || a.type === 'perpendicular') {
      const u = minus(point(a.b), point(a.a))
      const v = minus(point(a.d), point(a.c))
      residual = Math.abs(a.type === 'parallel' ? cross2(u, v) : dot(u, v))
    } else if (a.type === 'equalDistance') {
      residual = Math.abs(distance(point(a.a), point(a.b)) - distance(point(a.c), point(a.d)))
    } else if (a.type === 'pointOnCircle') {
      residual = Math.abs(distance(point(a.point), point(a.center)) - a.radius)
    } else {
      throw new Error(`Unhandled assertion ${a.type}`)
    }
    assert.ok(residual <= tolerance, `${a.id}: ${residual}`)
    return { id: a.id, type: a.type, status: 'PASS', residual }
  })
  for (const group of spec.source.inventory) {
    assert.ok(group.objects.every(id => objects.has(id)))
    assert.ok(group.assertions.every(id => spec.assertions.some(a => a.id === id)))
  }
  const [xmin, ymax, xmax, ymin] = spec.canvas.boundingBox
  for (const object of spec.objects) {
    if (object.type === 'point') {
      assert.ok(object.at[0] >= xmin && object.at[0] <= xmax)
      assert.ok(object.at[1] >= ymin && object.at[1] <= ymax)
    }
    if (object.type === 'circle') {
      const center = point(object.center)
      assert.ok(center[0] - object.radius >= xmin && center[0] + object.radius <= xmax)
      assert.ok(center[1] - object.radius >= ymin && center[1] + object.radius <= ymax)
    }
  }
  return outcomes
}
const currentFigures = [
  { id: 'fig-290', spec: repair.after.spec, svg: repair.after.svg, render: repair.after.render, preview: repair.after.preview },
  { id: 'fig-291', ...Object.fromEntries(['spec', 'svg', 'render'].map(k => [k, author.figures[1][k]])),
    preview: author.figures[1].previews[0].png },
].map(figure => {
  const spec = read(figure.spec.path)
  const render = read(figure.render.path)
  assert.equal(render.status, 'pass')
  assert.deepEqual(render.collisions, [])
  assert.equal(render.spec.sha256, figure.spec.sha256)
  assert.equal(render.output.svg.sha256, figure.svg.sha256)
  for (const context of spec.source.authoritativeText) {
    const entry = author.templates.find(t => t.edition === context.edition)
    const doc = read(entry.lesson.path)
    assert.equal(context.text, doc.prose.map(p => p.text).filter(Boolean).join('\n\n'))
  }
  const relations = auditRelations(spec)
  const physicalProjection = spec.projectionGeometry?.assertions.map(a => {
    const p = spec.projectionGeometry
    const result = dot(p[a.a], p[a.b])
    assert.equal(result, 0)
    return { id: a.id, status: 'PASS', dotProduct: result }
  }) ?? []
  return {
    id: figure.id, source: bind(spec.source.image.path, spec.source.image.sha256),
    spec: bind(figure.spec.path, figure.spec.sha256), svg: bind(figure.svg.path, figure.svg.sha256),
    render: bind(figure.render.path, figure.render.sha256), preview: bind(figure.preview.path, figure.preview.sha256),
    authoritativeLocaleContextsExact: true, relations, physicalProjection,
    labels: spec.objects.filter(o => o.type === 'text').map(o => ({ id: o.id, text: o.text })),
    display: spec.display, nativeDisplayChecks: render.displayChecks,
  }
})

const report = read(path.join(own, 'report.json'))
report.authorFreeze = authorBinding
report.affectedAuthorFreeze = repairBinding
report.reusedSourceApprovals = reusedSourceApprovals
report.independentChecks = {
  frozenInputFilesChecked: frozenBindings.size, hashMismatches: [],
  exactSourceReferenceInventory: ownedRefs, localeChecks, currentFigures,
  method: 'Read-only current-file hash/math/relationship/paragraph audit; no native producer, finalizer, renderer or record_review invocation',
}
report.findings.forEach(finding => {
  finding.hashBoundTargets = author.templates.map(entry => {
    const doc = read(entry.lesson.path)
    return {
      locale: doc.language, file: bind(entry.lesson.path),
      blocks: finding.proseBlockIndices.map(index => ({
        jsonPointer: `/prose/${index}/text`, text: doc.prose[index].text,
        textSha256: sha(doc.prose[index].text), sourceRefs: doc.prose[index].source_refs,
      })),
    }
  })
})
report.currentHashVerifiedInputs = [...inputs.values()]
writeOwn('report.json', report)

const displayInputs = new Map()
const resultPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d088-n126-display/result.json'
const promotionPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d088-n126-promotion/figure-bindings.json'
const resultBinding = bind(resultPath, undefined, displayInputs)
const promotionBinding = bind(promotionPath, undefined, displayInputs)
const result = read(resultPath)
const promotion = read(promotionPath)
assert.equal(result.status, 'pass')
assert.equal(result.requests.length, 0)
assert.equal(result.records.length, 4)
checkBindings(result, displayInputs)
checkBindings(promotion, displayInputs)
const displayChecks = result.records.map(record => {
  const doc = read(record.lesson.path)
  const outline = proseOutline(doc.prose)
  const flow = proseFlow(doc.prose, doc.section_breaks)
  assert.equal(doc.prose.length, 15)
  assert.equal(outline.length, 15)
  assert.equal(flow.length, 17)
  assert.equal(record.paragraphs, outline.length)
  assert.equal(record.sourceBlocks, doc.prose.length)
  assert.deepEqual(sectionBreakIndices(doc.prose, doc.section_breaks), [5, 11])
  assert.equal(flow.filter(p => p.kind === 'fig').length, 1)
  assert.equal(doc.exercise_count, 0)
  assert.equal(read(path.join(path.dirname(record.lesson.path), 'exercises.json')).count, 0)
  assert.ok(doc.prose[8].text.includes('①'))
  assert.ok(doc.prose[8].text.includes('1.'))
  assert.ok(record.geometry.boxes.every(box => box.x >= 0 && box.right <= record.viewport.width))
  assert.ok(record.geometry.indents.every(indent => indent === '0px'))
  assert.ok(record.geometry.minFontRatio >= 1.0999)
  const figure = record.figureChecks[0]
  assert.equal(figure.width, 640)
  assert.equal(figure.height, 640)
  assert.equal(figure.scrollEndReachable, true)
  assert.ok(Math.min(...figure.labelSizes) >= 16)
  const entry = promotion.records.find(p => p.edition === record.edition)
  assert.equal(figure.spec.sha256, entry.spec.sha256)
  const before = read(entry.candidateSpec.path)
  const after = read(entry.spec.path)
  assert.deepEqual(before.objects, after.objects)
  assert.deepEqual(before.assertions, after.assertions)
  assert.deepEqual(before.display, after.display)
  assert.equal(before.source.image.sha256, after.source.image.sha256)
  assert.equal(read(entry.review.path).status, 'pass')
  bind(path.join(path.dirname(record.lesson.path), 'exercises.json'), undefined, displayInputs)
  bind(path.join(path.dirname(record.lesson.path), 'adaptation.audit.json'), undefined, displayInputs)
  return {
    locale: record.locale, viewport: record.viewport,
    lesson: record.lesson, html: record.html, screenshot: record.screenshot,
    sourceEntries: doc.prose.length, sourcePEntries: doc.prose.filter(p => p.kind === 'p').length,
    proseParagraphs: outline.length, completeFlowEntries: flow.length,
    figureCount: 1, exerciseCount: 0, sectionBreaks: [5, 11],
    expected17ProseParagraphsMet: false, footnoteSourceRefs: doc.prose[8].source_refs,
    overflowFromCurrentNativeGeometry: false,
    fixedFigureWidthPx: figure.width, minimumFigureLabelPx: Math.min(...figure.labelSizes),
    scrollEndReachableFromSavedNativeCheck: true,
    promotedGeometryUnchanged: true,
    nativeReviewPassReused: true,
  }
})
const displayReport = read(path.join(own, 'n126-offline-display-report.json'))
displayReport.inputResult = resultBinding
displayReport.promotionBindings = promotionBinding
displayReport.independentCurrentBindingAndDisplayChecks = displayChecks
displayReport.currentHashVerifiedInputs = [...displayInputs.values()]
displayReport.findings[0].hashBoundTargets = displayChecks.map(record => ({
  locale: record.locale, viewport: record.viewport.name, lesson: record.lesson,
  result: resultBinding, observedProseParagraphs: 15, observedFullFlowEntries: 17,
}))
writeOwn('n126-offline-display-report.json', displayReport)

const ownBind = name => bind(path.join(own, name), undefined, new Map())
const common = {
  ticket: 'STEMROBIN-181', batch: 'D089', workdir: root,
  sealedAt: new Date().toISOString(), reviewerClosed: true,
  finish: 'review', grillMode: 'self', imageLedger: ownBind('image-ledger.json'),
  grill: ownBind('grill.md'), verificationScript: ownBind('verify.mjs'),
  combinedContextImageOpens: 8, imageReopens: 0, imageCrops: 0,
  remainingBatchImageBudget: 0, parentConsumptionPending: true,
  candidateRepair: false, nativeRecordReview: false, promotion: false,
  nativeRendererOrFinalizer: false, productOrGlobalMeterWrites: false,
  databaseCalls: 0, backendCalls: 0, paidCalls: 0, commits: 0, pushes: 0,
  otherChatMessages: 0, ownedRoot: own,
}
writeOwn('review-freeze.json', {
  schema: 'STEMROBIN-181/lesson-independent-first-review-freeze@1', ...common,
  lesson: 'phy9-c2-s6-n128', role: report.role, status: report.status,
  verdicts: report.verdicts, actionableFindings: ['R1', 'R2'],
  report: ownBind('report.json'), authorFreeze: authorBinding, affectedAuthorFreeze: repairBinding,
  currentFigures: currentFigures.map(({ relations, physicalProjection, ...rest }) => rest),
  sourceApprovalReuse: reusedSourceApprovals, n128ImageOpens: 4,
  fullOfflineLessonDisplayReviewed: false, wholeN128Approval: false,
  currentHashVerifiedInputs: [...inputs.values()],
})
writeOwn('n126-offline-display-review-freeze.json', {
  schema: 'STEMROBIN-181/offline-display-independent-review-freeze@1', ...common,
  lesson: 'phy9-c2-s6-n126', role: displayReport.role, status: displayReport.status,
  verdicts: displayReport.verdicts, actionableFindings: ['N126-DISPLAY-COUNT'],
  report: ownBind('n126-offline-display-report.json'), result: resultBinding,
  figurePromotionBindings: promotionBinding, n126OfflineImageOpens: 4,
  pixelChecks: 'PASS four screenshots',
  hold: 'Expected 17 prose paragraphs; actual 15 prose paragraphs and 17 full flow entries',
  noScienceOrSourceSemanticReplay: true, productAcceptance: false,
  currentHashVerifiedInputs: [...displayInputs.values()],
})
for (const name of ['report.json', 'review-freeze.json', 'image-ledger.json', 'grill.md',
  'n126-offline-display-report.json', 'n126-offline-display-review-freeze.json']) {
  console.log(JSON.stringify(ownBind(name)))
}
console.log(JSON.stringify({
  n128: report.status, n128Findings: ['R1', 'R2'], n128Figures: 'PASS',
  n126: displayReport.status, n126Pixels: 'PASS', n126Count: '15 prose / 17 full flow',
  imageOpens: 8, reopens: 0, crops: 0, n128FrozenInputs: frozenBindings.size,
  n126CurrentInputs: displayInputs.size,
}))
