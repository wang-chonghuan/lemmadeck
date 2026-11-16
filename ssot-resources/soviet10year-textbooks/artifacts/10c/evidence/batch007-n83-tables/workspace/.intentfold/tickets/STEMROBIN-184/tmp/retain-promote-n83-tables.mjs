import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const edition = `${book}/editions/modern-us-neutral`
const evidence = `${book}/evidence/batch007-n83-tables`
const review = `${ticket}/ana10-n83-modern-tables-independent-review.md`
const manifestFile = `${ticket}/ana10-n83-modern-tables-author.manifest.json`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
const expectedReview = process.argv[2]
assert.match(expectedReview || '', /^[0-9a-f]{64}$/, 'Supply the sole approved review raw SHA')
assert.equal(hash(review), expectedReview)
assert.equal(hash(manifestFile), '2a547aab638479a4657b91e3dd991d1bca985abe118e70b3ed69853c351e783a')
const manifest = read(manifestFile)
assert.equal(manifest.report.sha256, '61820d51f55708598a1fa82f9784b8c2a72cd3ebdd8d9a2c9c461f9a5b521b0a')
assert(!fs.existsSync(evidence), 'Do not overwrite a retained first package')
const inputs = [
  manifest.report, manifest.sourceInventory, ...manifest.approvedText,
  ...manifest.helpers, ...manifest.tables.flatMap(table => [
    table.source, table.context, ...table.packageFiles,
  ]),
]
for (const input of inputs) assert.equal(hash(input.path), input.sha256, input.path)
for (const table of manifest.tables) {
  const report = read(`${table.package}/table.render.json`)
  assert.equal(report.status, 'pass')
  assert.equal(table.renderAttempts, 1)
  assert.equal(table.specRepairs, 0)
  assert.equal(report.spec.sha256, hash(`${table.package}/spec.json`))
  assert.equal(report.output.svg.sha256, hash(`${table.package}/table.svg`))
  for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json']) {
    assert(!fs.existsSync(`${edition}/figures/${table.id}.${suffix}`), table.id)
  }
  assert(!fs.existsSync(`${table.package}/table.review.json`), table.id)
}

const copied = []
const copy = from => {
  const to = path.join(evidence, 'workspace', from)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  copied.push({ path: path.relative(evidence, to), sha256: hash(to) })
}
for (const from of new Set([
  ...inputs.map(input => input.path), manifestFile, review,
  `${ticket}/ana10-n83-tables-independent-source-first.md`,
  `${ticket}/retain-promote-n83-tables.mjs`,
])) copy(from)

const promotions = []
fs.mkdirSync(`${edition}/figures`, { recursive: true })
for (const table of manifest.tables) {
  const scratchReview = `${table.package}/table.review.json`
  const args = [
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${table.package}/spec.json`,
    '--render', `${table.package}/table.render.json`,
    '--output', scratchReview, '--status', 'pass',
    '--notes', `Sole Ptolemy independent StageB PASS, raw SHA ${expectedReview}; complete source inventory, current table cells/signs/physical grouping and existing full/theme/mobile-scroll evidence compared once. See ${evidence}/workspace/${review}. Alpha-shaped source glyph limitation remains; task101 parse/key UNKNOWN is not resolved. No rerender or second semantic review.`,
  ]
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args, { encoding: 'utf8' })
  const command = `${ticket}/n83-table-record-${table.id}`
  fs.writeFileSync(`${command}.stdout.txt`, result.stdout || '')
  fs.writeFileSync(`${command}.stderr.txt`, result.stderr || '')
  write(`${command}.command.json`, {
    executable: '.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    cwd: process.cwd(), startedAtUtc, finishedAtUtc: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
  })
  for (const suffix of ['stdout.txt', 'stderr.txt', 'command.json']) copy(`${command}.${suffix}`)
  console.log(result.stdout)
  assert.equal(result.status, 0, 'Keep any first recording failure')
  copy(scratchReview)
  const targets = Object.fromEntries(['spec.json', 'svg', 'render.json', 'review.json']
    .map(suffix => [suffix, `${edition}/figures/${table.id}.${suffix}`]))
  for (const [from, to] of [
    [`${table.package}/spec.json`, targets['spec.json']],
    [`${table.package}/table.svg`, targets.svg],
  ]) {
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(from), hash(to))
  }
  const render = read(`${table.package}/table.render.json`)
  const officialReview = read(scratchReview)
  render.spec.path = targets['spec.json']
  render.output.svg.path = targets.svg
  write(targets['render.json'], render)
  officialReview.spec.path = targets['spec.json']
  officialReview.render = { path: targets['render.json'], sha256: hash(targets['render.json']) }
  officialReview.outputs.svg.path = targets.svg
  officialReview.notes += ' Path-only promotion: source/spec/SVG bytes unchanged; render/output paths and dependent evidence hash rebound without rerender or repeated semantic review.'
  write(targets['review.json'], officialReview)
  promotions.push({ id: table.id, outputs: Object.fromEntries(
    Object.entries(targets).map(([name, file]) => [name, { path: file, sha256: hash(file) }]),
  ) })
}
write(`${evidence}/retention.json`, {
  status: 'Two sole-independent-approved table packages retained; spec/SVG bytes unchanged',
  independentReview: { path: `workspace/${review}`, sha256: expectedReview },
  copied, promotions,
  limits: 'Task101 parse/key UNKNOWN. No whole-lesson finalize, display, answer, choice or complete count here.',
})
console.log(`${copied.length} immutable evidence files retained; two table outputs promoted`)
