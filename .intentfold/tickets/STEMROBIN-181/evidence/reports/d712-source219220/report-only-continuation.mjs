import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const out = path.join(ticket, 'evidence/reports/d712-source219220')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const source = path.join(tmp, 'd702-source219220-affected-repair')
const indexPath = path.join(ticket, 'evidence/index.json')
const meterPath = path.join(ticket, 'production-meter.json')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const first = path.join(tmp, 'd699-source219220-first-review/report.json')
const text = path.join(tmp, 'd699-source219220-first-review/affected-text-report.json')
const figure = path.join(tmp, 'd704-source193-caption-affected-review/report.json')
assert.equal(sha(first), '6c3e6448cfca6b9d0a7b17e491ea357cfa270d5cb54922da863633d686127198')
assert.equal(sha(text), '04438462efd42c833e7491a3218e1c97dbed9a37b9271b76f2b36008c09ff688')
assert.equal(sha(figure), '84d868f103b71e2700ce96906c53e330fddbed2cab666dceacd531a960fb059b')
assert.equal(read(text).status, 'pass')
assert.equal(read(figure).status, 'pass')
const index = read(indexPath)
const meter = read(meterPath)
assert.ok(!fs.existsSync(path.join(out, 'consumed.json')))
assert.notEqual(meter.activeHumanDirection.nextSourceCheckpoints.source219220.status, 'PASS-CONSUMED')
const outputs = []
function copy(from, to) {
  if (fs.existsSync(to)) {
    assert.equal(sha(from), sha(to), `Partial promotion drift: ${to}`)
    return { path: path.relative(repo, to), sha256: sha(to) }
  }
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  return { path: path.relative(repo, to), sha256: sha(to) }
}
for (const number of [219, 220]) for (const name of ['page.md', 'page.json', 'audit.json']) {
  outputs.push(copy(path.join(source, 'root/10p/pages', `0${number}`, name), path.join(raw, 'pages', `0${number}`, name)))
}
for (const number of [193, 194]) for (const extension of ['png', 'svg']) {
  const name = `fig-${number}.${extension}`
  outputs.push(copy(path.join(source, 'work/10p/pages/0219/figures', name), path.join(raw, 'figures', name)))
}
function retain(from, name) {
  const existing = index.reports.find((row) => row.sha256 === sha(from) && fs.existsSync(path.resolve(repo, row.path)))
  if (existing) return existing
  const binding = { ...copy(from, path.join(out, name)), originalPath: path.relative(repo, from), batch: 'D033' }
  index.reports.push(binding)
  return binding
}
const firstReview = retain(first, 'first-review.json')
const affectedText = retain(text, 'affected-text-review.json')
const affectedFigure = retain(figure, 'affected-figure193-review.json')
function walk(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(folder, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}
const reviewFolder = path.join(tmp, 'd704-source193-caption-affected-review')
for (const file of walk(reviewFolder)) {
  if (file !== figure) retain(file, `figure193-review/${path.relative(reviewFolder, file)}`)
}
retain(path.join(tmp, 'd712-source219220-consume/first-attempt.mjs'), 'first-promotion-EISDIR.mjs')
retain(path.join(tmp, 'd712-source219220-consume/consume-once.mjs'), 'report-only-continuation.mjs')
const report = {
  ticket: 'STEMROBIN-181', status: 'SOURCE219220-EFFECTIVE-PASS-RAW193194SVG-PASS-CONSUMED',
  firstReview, affectedText, affectedFigure, outputs, sourcePagesAdded: 2, completeCardsAdded: 0,
  firstFAILPreserved: true, technicalUnsupportedFlagFAILPreserved: true,
  partialPromotionTechnicalRecovery: 'Accepted files copied before EISDIR while retaining nested preview directory. Same hashes reused, report retention corrected only; no native or source replay.',
  source219ProseUnchangedPASSReused: true, RAW194SVGUnchangedPASSReused: true,
  source218InitialHOLDUnchanged: true, sourceImagesFirstReview: 7, affectedVisualImages: 2,
  affectedTextImages: 0, databaseWrites: false,
}
const file = path.join(out, 'consumed.json')
fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
const consumed = { path: path.relative(repo, file), sha256: sha(file), batch: 'D033' }
index.reports.push(consumed)
meter.sourcePagesFinalized += 2
meter.currentCheckpoint.sourcePagesFinalized += 2
meter.currentCheckpoint.sourcePagesBasis += '; d712 SOURCE219textPASS/source220twocharactersaffectedPASS/RAW193captionpaddingaffectedPASS/RAW194SVGunchangedPASS composed consumed.'
meter.activeHumanDirection.currentImageCounts['181-3'] = 16
meter.activeHumanDirection.nextSourceCheckpoints.source219220 = { status: 'PASS-CONSUMED', consumed, SOURCE: 'PASS-EFFECTIVE', RAW: 'PASS-EFFECTIVE', SVG: 'PASS-EFFECTIVE', sourcePagesAdded: 2 }
meter.activeHumanDirection.ephemeralImageBatches.push(
  { id: '01a1f07a-e5ba-71a3-9674-1dea0efab6ee', batch: 'd699', scope: 'SOURCE219220-first-and-two-character-text-affected', actualImages: 7, maximumImages: 8, contextLimit: 24, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 },
  { id: '01a1f08d-6265-7693-a348-b017e10faec4', batch: 'd704', scope: 'RAW193-SVG193-caption-affected', actualImages: 2, maximumImages: 8, contextLimit: 24, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0 },
)
meter.currentCheckpoint.nextBatch.latestSourceConsumption = consumed
meter.currentCheckpoint.nextBatch.sourceTotals.pages = meter.currentCheckpoint.sourcePagesFinalized
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
fs.writeFileSync(meterPath, `${JSON.stringify(meter, null, 2)}\n`)
console.log(JSON.stringify({ consumed, sourcePages: meter.sourcePagesFinalized, parentImages: 16 }))
