import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const scope = path.dirname(fileURLToPath(import.meta.url))
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const ref = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const check = read(path.join(scope, 'check.json'))
const decision = read(path.join(scope, 'visual-decision.json'))
const inventory = read(path.join(scope, 'source-inventory.json'))
const nativePath = path.join(scope, 'fig-227.review.json')
const native = read(nativePath)
for (const binding of check.bindings) assert.equal(hash(binding.path), binding.sha256)
assert.equal(hash(check.css.path), check.css.sha256)
for (const shot of check.screenshots) assert.equal(hash(shot.path), shot.sha256)
assert.equal(check.status, 'pass')
assert.equal(decision.status, 'pass')
assert.equal(native.status, 'pass')
assert.equal(check.browser.headless, false)
assert.equal(inventory.independence.authorMaterialReadAtInventoryTime, false)
const spec = read(native.spec.path)
const expand = pattern => {
  const match = pattern.match(/\{(\d+)\.\.(\d+)\}/)
  assert.ok(match)
  return Array.from({ length: Number(match[2]) - Number(match[1]) + 1 }, (_, i) =>
    pattern.replace(match[0], String(Number(match[1]) + i)))
}
const mapping = decision.sourceToCandidateMapping.map(group => {
  const objects = [...(group.objects || []), ...(group.objectIdPattern || []).flatMap(expand)]
  const assertions = [...(group.assertions || []), ...(group.assertionIdPattern || []).flatMap(expand)]
  assert.ok(inventory.inventory.some(item => item.id === group.independentGroup))
  for (const id of objects) assert.ok(spec.objects.some(item => item.id === id))
  for (const id of assertions) assert.ok(spec.assertions.some(item => item.id === id))
  const { objectIdPattern, assertionIdPattern, ...rest } = group
  return { ...rest, objects, assertions, idsResolve: true }
})
assert.equal(hash(native.source.path), native.source.sha256)
assert.equal(hash(native.spec.path), native.spec.sha256)
assert.equal(hash(native.render.path), native.render.sha256)
for (const output of Object.values(native.outputs)) assert.equal(hash(output.path), output.sha256)
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: repo, encoding: 'utf8' }).trim()
assert.equal(branch, 'codex/STEMROBIN-181-textbooks')
const authorReport = check.bindings.find(item => item.path.endsWith('/d1216-n99-fig227-first-author/report.json'))
assert.equal(authorReport.sha256, 'a9992dab71c4168a6128b85ca00a39f85707e645804801a950fffb24efbaf0ec')
const correctedCurrentText = check.bindings.filter(item => item.path.includes('/d1212-n99-two-errata-repair/'))
const openedImages = decision.usage.openedImagesInOrder.map((file, i) =>
  i === 0 ? { ordinal: 1, role: 'canonical-source-FIRST', ...ref(path.join(repo, file)) } :
    { ordinal: i + 1, role: path.basename(file, '.png'), ...ref(path.join(scope, file)) })
const report = {
  schema: 'stemrobin/first-independent-figure-review-report@1',
  ticket: 'STEMROBIN-181', batch: 'D037', lesson: 'phy10-c2-s4-n99', figure: 'fig-227',
  role: 'FIRST independent modern figure reviewer', status: 'pass',
  sealedAt: new Date().toISOString(), cwd: repo, branch, exclusiveWriteScope: scope,
  authorReport, source: ref(native.source.path), spec: ref(native.spec.path),
  render: ref(native.render.path), svg: ref(native.outputs.svg.path),
  nativeReview: ref(nativePath), correctedCurrentText,
  independentInventory: {
    ...ref(path.join(scope, 'source-inventory.json')),
    frozenBeforeAuthorReportSpecSvgOrSolution: true,
    groups: inventory.inventory,
    sourceToCandidateMapping: mapping,
  },
  verdicts: decision.verdicts, findings: decision.findings,
  declaredAdditions: decision.declaredAdditions, regularization: decision.regularization,
  verification: {
    ...ref(path.join(scope, 'check.json')), headedBrowser: check.browser,
    actualProductCss: check.css, figureRulesSha256: check.figureRulesSha256,
    geometry: check.geometry,
    surfaces: check.checks.map(item => ({
      mode: item.mode, viewport: item.viewport, mediaWidthPx: item.width,
      mediaHeightPx: item.height, status: item.status, labelCount: item.labels.length,
      minimumTextPx: Math.min(...item.labels.map(label => label.fontPx)),
      collisions: item.collisions, scroller: item.scroller, scrollEnd: item.scrollEnd,
      curveColor: item.curveColor, limitColor: item.limitColor,
      externalRequests: item.requests, pageErrors: item.errors,
    })),
    screenshots: check.screenshots,
    screenshotInspection: ref(path.join(scope, 'visual-decision.json')),
    candidateBindingsStillUnchangedAtSeal: true,
    technicalFailure: ref(path.join(scope, 'first-check-failure.json')),
    failureClassification: 'Hidden JSXGraph construction nodes counted by an overbroad DOM check; affected check repaired, no candidate change or producer replay.',
    nativeRecordCommand: {
      tool: '.agents/skills/ld-s10y-image/scripts/record_review.py',
      spec: native.spec.path, render: native.render.path, output: nativePath,
      status: 'pass', executedAfterIndependentVisualPass: true,
    },
  },
  usage: { ...decision.usage, openedImages, nativeRecordReviewCalls: 1 },
  approvalScope: 'Unchanged fig-227 candidate only: source fidelity, actual SVG scientific/figure/cultural review and native hash-bound review metadata in reviewer own scope.',
  gatesNotClaimed: {
    fullCard: false, fullRenderedLesson: false, independentLessonTextApproval: false,
    productionAppAcceptance: false, printPaginationApproval: false, figurePromotion: false,
    dbPublisherDeploy: false, backendTicketReadOrWrite: false,
  },
  artifacts: [
    'source-inventory.json', 'visual-decision.json', 'check.mjs', 'check.json',
    'first-check-failure.json', 'fig-227.review.json', 'seal-report.mjs',
  ].map(file => ref(path.join(scope, file))),
  nextStage: 'Parent may consume the textual report and current hashes. No images are returned, no full card or rendered lesson is approved, and no promotion is performed or authorized by this review.',
}
fs.writeFileSync(path.join(scope, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ status: report.status, report: ref(path.join(scope, 'report.json')),
  nativeReview: report.nativeReview, verdicts: Object.fromEntries(
    Object.entries(report.verdicts).map(([key, value]) => [key, value.status])),
  imageOpens: report.usage.imageOpens, imagesReturnedToParent: report.usage.imagesReturnedToParent,
  candidateUnchanged: true }, null, 2))
