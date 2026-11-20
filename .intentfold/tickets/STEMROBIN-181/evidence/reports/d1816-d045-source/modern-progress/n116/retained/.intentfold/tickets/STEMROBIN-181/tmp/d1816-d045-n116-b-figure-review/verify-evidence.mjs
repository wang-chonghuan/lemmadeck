import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const R = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-b-figure-review'
assert.equal(process.cwd(), W)

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'))
const hashBytes = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const hashFile = (path) => hashBytes(fs.readFileSync(path))
const verified = new Map()
function bind(ref) {
  assert.equal(hashFile(ref.path), ref.sha256, ref.path)
  verified.set(ref.path, ref.sha256)
}
function verifyReportRefs(value) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') bind(value)
  for (const nested of Object.values(value)) verifyReportRefs(nested)
}
function differences(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return []
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return [pointer]
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((key) =>
    differences(a[key], b[key], `${pointer}/${key}`))
}
const norm = (text) => text.replace(/\s+/g, ' ').trim()
const withoutWhitespace = (text) => text.replace(/\s+/g, '')
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]

const freezes = [
  {
    path: '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-b-figure-author/author-freeze.json',
    sha256: 'dac01e1bceb252b105af0595a6919ddcb1ebf31eecacb23a7b81926863b547b7',
  },
  {
    path: '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-context-repair/author-freeze.json',
    sha256: '492e98d30223155cf2587f7f71ab36c6cb1238ba3a3a5947e5b55e01b8c8dbeb',
  },
  {
    path: '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-fig248-layout-recovery/author-freeze.json',
    sha256: '31d83f8c60b20a1773dd54276c59e2c966f222ac86469d73e873697b35615844',
  },
]
freezes.forEach(bind)
const [author, text, recovered] = freezes.map((ref) => read(ref.path))
const textReport = read(`${R}/affected-text-report.json`)
const f248Report = read(`${R}/fig248-first-report.json`)
verifyReportRefs(textReport)
verifyReportRefs(f248Report)
for (const key of ['context', 'inventory', 'observations', 'authorConsistencyCheck']) bind(author[key])
for (const key of ['renderer', 'validator']) bind(author.runtime[key])
for (const key of ['inputBinding', 'observations']) bind(recovered[key])
for (const key of ['renderer', 'canonicalRenderer', 'validator']) bind(recovered.runtime[key])

const previousDraft = read(text.previousDraft.path)
const currentDraft = read(text.currentDraft.path)
assert.deepEqual(differences(previousDraft, currentDraft), ['/zh/5', '/en/5'])
const { proseOutline, sectionBreakIndices } =
  await import(`${W}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`)
for (const record of text.records) {
  bind(record.previousTemplate)
  bind(record.currentTemplate)
  const previous = read(record.previousTemplate.path)
  const current = read(record.currentTemplate.path)
  const approved = textReport.records.find((item) => item.locale === record.locale)
  assert.deepEqual(approved.currentTemplate, record.currentTemplate)
  assert.deepEqual(differences(previous, current), approved.changedTemplatePointers)
  assert.deepEqual(previous.prose.map((p, i) => i === 11 ? null : p),
    current.prose.map((p, i) => i === 11 ? null : p))
  const beforeBlock = structuredClone(previous.prose[11])
  const afterBlock = structuredClone(current.prose[11])
  delete beforeBlock.text
  delete afterBlock.text
  assert.deepEqual(beforeBlock, afterBlock)
  assert.deepEqual(previous.source, current.source)
  assert.deepEqual(current.source.data, read(text.source.path))
  assert.equal(norm(current.prose[11].text),
    norm(previous.prose[11].text.replace(record.before, record.after)))
  assert.equal(withoutWhitespace(current.prose[11].text),
    withoutWhitespace(currentDraft[record.locale][5]))
  assert.deepEqual(sectionBreakIndices(current.prose, current.section_breaks), [5, 11])
  assert.equal(proseOutline([current.prose[11]]).length, 2)
  assert.equal(approved.SCI.status, 'PASS')
  assert.equal(approved.ZHEN.status, 'PASS')
}

const targets = [
  ...author.figures.filter((f) => ['fig-246', 'fig-249'].includes(f.id)),
  { id: 'fig-248', original: recovered.original, final: recovered.final },
]
const geometryChecks = []
for (const figure of targets) {
  bind(figure.original)
  for (const key of ['spec', 'svg', 'render', 'bitmap']) bind(figure.final[key])
  const spec = read(figure.final.spec.path)
  const render = read(figure.final.render.path)
  assert.deepEqual(spec.source.image, figure.original)
  assert.deepEqual(render.spec, figure.final.spec)
  assert.deepEqual(render.output.svg, figure.final.svg)
  assert.equal(render.status, 'pass')
  assert.deepEqual(render.collisions, [])
  assert.equal(spec.source.authoritativeText[0].text, previousDraft.en.join('\n\n'))
  assert.notEqual(spec.source.authoritativeText[0].text, currentDraft.en.join('\n\n'))
  const objects = new Map(spec.objects.map((object) => [object.id, object]))
  const assertions = new Map(spec.assertions.map((item) => [item.id, item]))
  for (const group of spec.source.inventory) {
    group.objects.forEach((id) => assert.ok(objects.has(id), id))
    group.assertions.forEach((id) => assert.ok(assertions.has(id), id))
  }
  for (const item of spec.assertions.filter((item) => item.type === 'connects')) {
    assert.equal(objects.get(item.arrow).from, item.from)
    assert.equal(objects.get(item.arrow).to, item.to)
  }
  geometryChecks.push({
    figure: figure.id,
    status: 'PASS-LOCAL-REFERENCES-AND-HASHES-NOT-SOURCE-APPROVAL',
    embeddedCompleteENSHA256: hashBytes(spec.source.authoritativeText[0].text),
    correctedCompleteENSHA256: hashBytes(currentDraft.en.join('\n\n')),
  })
}
for (const figure of author.figures.filter((f) => ['fig-246', 'fig-249'].includes(f.id))) {
  const stage = figure.id === 'fig-246' ? 'repair' : 'first'
  figure.receipts.filter((receipt) => receipt.path.includes(stage)).forEach(bind)
}
recovered.receipts.filter((receipt) => receipt.path.includes('final')).forEach(bind)
assert.equal(recovered.inheritedContentRepairRounds, 1)
assert.equal(recovered.newContentRepairRounds, 2)
assert.equal(recovered.contentRepairRounds, 3)

const s248 = read(recovered.final.spec.path)
const o248 = new Map(s248.objects.map((object) => [object.id, object]))
const p = (id) => o248.get(id).at
const needleChecks = s248.objects.filter((object) => object.id.endsWith('-pivot')).map((pivot) => {
  const id = pivot.id.slice(0, -6)
  const dark = p(`${id}-end-a`)
  const radial = [pivot.at[0] - 320, (pivot.at[1] - 355) / 0.4]
  const direction = [dark[0] - pivot.at[0], (dark[1] - pivot.at[1]) / 0.4]
  assert.ok(Math.abs(dot(radial, direction)) < 1e-7, id)
  assert.ok(cross(radial, direction) > 0, id)
  const radius = id.includes('-outer-') ? 250 : 170
  assert.ok(Math.abs(Math.hypot(...radial) - radius) < 1e-7, id)
  return { id, radialDotDark: dot(radial, direction), radialCrossDarkZ: cross(radial, direction) }
})
assert.equal(needleChecks.length, 6)
const b = [p('selected-b-head')[0] - p('selected-b-tail')[0],
  p('selected-b-head')[1] - p('selected-b-tail')[1]]
const sn = [p('needle-outer-lower-left-end-a')[0] - p('needle-outer-lower-left-end-b')[0],
  p('needle-outer-lower-left-end-a')[1] - p('needle-outer-lower-left-end-b')[1]]
assert.ok(Math.abs(cross(b, sn)) < 1e-7)
assert.ok(dot(b, sn) > 0)
assert.ok(p('current-arrow-head')[1] > p('current-arrow-tail')[1])
assert.ok(p('screw-advance-head')[1] > p('screw-advance-tail')[1])
const head = p('screw-turn-head')
const tail = p('screw-turn-tail')
const screwRadial = [head[0] - 320, (head[1] - 98) * 70 / 26]
const screwDirection = [head[0] - tail[0], (head[1] - tail[1]) * 70 / 26]
assert.ok(cross(screwRadial, screwDirection) > 0)

const combinedPath = `${R}/report.json`
if (fs.existsSync(combinedPath)) {
  const combined = read(combinedPath)
  verifyReportRefs(combined)
  assert.equal(combined.imageUsage.actualImagesOpened, 6)
  assert.equal(combined.wholeLessonApproved, false)
  assert.equal(combined.recordReviewCalled, false)
}
// Hash reads and numerical checks do not load another image into the review context.
console.log(JSON.stringify({
  status: 'PASS-BOUND-EVIDENCE-AND-AFFECTED-SCOPE-VERIFICATION',
  workdir: W,
  protectedAndReferencedFilesVerified: verified.size,
  geometryChecks,
  f248WorldSpaceChecks: needleChecks,
  f248BAlongSToN: true,
  f248ScrewPositiveTurnAndAdvance: true,
  actualImageOpensByThisCommand: 0,
  nativeProducerReruns: 0,
  filesWrittenByThisCommand: 0,
  independentImageReviewVerdictsNotOverridden: true,
}, null, 2))
