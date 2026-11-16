import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const evidence = `${book}/evidence/batch007-n84-figures`
const authorFile = `${ticket}/ana10-n84-modern-figure-author.manifest.json`
const reviewFile = `${ticket}/ana10-n84-modern-figures-independent-review.md`
const probeReport = `${ticket}/ana10-n84-fig23-display-probe-author.md`
const probeManifest = `${ticket}/ana10-n84-fig23-display-probe/manifest.json`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
const [reviewHash, mode] = process.argv.slice(2)
assert.match(reviewHash || '', /^[0-9a-f]{64}$/, 'Supply the sole independent review SHA')
assert(['retain-only', 'promote-23'].includes(mode))
assert.equal(hash(reviewFile), reviewHash)
assert.equal(hash(authorFile), '48d06cc0c50cd0579f839a1826c3dd04986dd769260bee3ac01c22e72f386d65')
assert.equal(hash(probeReport), '4266982a53cf4c279cde8705f0b4c3e514df01424dacb564f80ccdd82fb5c84b')
assert.equal(hash(probeManifest), 'fa8d28be2b7c1be3a05893b9bf0c7cc2844fd5d5dece62aff9eebd8eccedfa95')
assert(!fs.existsSync(evidence), 'Preserve the first full figure checkpoint')
const author = read(authorFile)
const probe = read(probeManifest)
const bound = [
  author.report, ...author.inputs, ...author.firstAttemptFiles,
  probe.report, ...probe.inputFiles, ...probe.outputFiles,
]
for (const item of bound) assert.equal(hash(item.path), item.sha256, item.path)
const copied = []
const seen = new Set()
const copy = from => {
  const stat = fs.lstatSync(from)
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(from)) copy(path.join(from, entry))
    return
  }
  assert(stat.isFile(), from)
  if (seen.has(from)) return
  const to = path.join(evidence, 'workspace', from)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  seen.add(from)
  copied.push({ path: path.relative(evidence, to), sha256: hash(to) })
}
const files = [
  ...bound.map(item => item.path), authorFile, reviewFile,
  `${ticket}/ana10-n84-figures-independent-source-first.md`,
  probeReport, probeManifest, `${ticket}/ana10-n84-fig23-display-probe`,
  `${ticket}/prepare-n84-figure-contexts-once.mjs`,
  `${ticket}/n84-figure-contexts`,
  `${ticket}/retain-n84-figure-disposition.mjs`,
]
for (const file of files) assert(fs.existsSync(file), file)
for (const file of files) copy(file)

let promotion = null
if (mode === 'promote-23') {
  const first = `${ticket}/ana10-n84-modern-figure-author-evidence/fig-23`
  const stage = '.tmp/s10y-image/batch007/10c/fig-23-approved-staging'
  assert(!fs.existsSync(stage), 'No duplicate approval staging')
  const target = `${book}/editions/modern-us-neutral/figures`
  for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json']) {
    assert(!fs.existsSync(`${target}/fig-23.${suffix}`), suffix)
  }
  fs.mkdirSync(stage)
  for (const [from, name] of [
    [`${first}/spec.attempt-01.json`, 'spec.json'],
    [`${first}/fig-23.attempt-01.svg`, 'fig-23.svg'],
    [`${first}/render.attempt-01.json`, 'fig-23.render.json'],
  ]) {
    fs.copyFileSync(from, `${stage}/${name}`, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(from), hash(`${stage}/${name}`))
  }
  const operations = [
    {
      name: 'record',
      executable: '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      args: [
        '.agents/skills/ld-s10y-image/scripts/record_review.py',
        '--spec', `${stage}/spec.json`, '--render', `${stage}/fig-23.render.json`,
        '--output', `${stage}/fig-23.review.json`, '--status', 'pass',
        '--notes', `Sole Ptolemy StageB limited PASS, raw SHA ${reviewHash}; current source inventory, complete inverse-curve geometry, original/native SVG/PNG and existing fixed640 neutral/print/mobile-scroll evidence compared once. See ${evidence}/workspace/${reviewFile}. Original O/0 glyph and endpoint-marker optical limits remain; numeric0 is a disclosed modern annotation, not source decoding. Figure22 remains pre-spec HOLD, whole n84 blocked; no second semantic review.`,
      ],
    },
    {
      name: 'promote',
      executable: 'node',
      args: [`${ticket}/retain-approved-figures.mjs`, 'fig-23'],
      env: { ...process.env, FIGURE_BOOK: '10c', FIGURE_SCRATCH_DIR: stage },
    },
  ]
  for (const operation of operations) {
    const startedAtUtc = new Date().toISOString()
    const result = spawnSync(operation.executable, operation.args, {
      encoding: 'utf8', env: operation.env || process.env,
    })
    const prefix = `${ticket}/n84-fig23-${operation.name}`
    fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '')
    fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '')
    write(`${prefix}.command.json`, {
      executable: operation.executable, args: operation.args, cwd: process.cwd(),
      startedAtUtc, finishedAtUtc: new Date().toISOString(),
      exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    })
    for (const suffix of ['stdout.txt', 'stderr.txt', 'command.json']) copy(`${prefix}.${suffix}`)
    console.log(result.stdout)
    assert.equal(result.status, 0, 'Retain any first recording/promotion failure')
  }
  copy(stage)
  promotion = Object.fromEntries(['spec.json', 'svg', 'render.json', 'review.json']
    .map(suffix => {
      const file = `${target}/fig-23.${suffix}`
      return [suffix, { path: file, sha256: hash(file) }]
    }))
}
write(`${evidence}/retention.json`, {
  status: mode === 'promote-23' ? 'Figure23 sole-review-approved bytes promoted; figure22 pre-spec HOLD' : 'First figure package and sole independent disposition retained; no promotion',
  independentReview: { path: `workspace/${reviewFile}`, sha256: reviewHash },
  copied, promotion,
  limits: 'Figure22 unresolved original endpoint/short-projector/interval glyph prevents whole n84 finalize. No source erratum choice, whole-lesson display/finalize, formal answer, choice, complete count or production action.',
})
console.log(`${copied.length} n84 figure evidence files retained byte-identically; ${mode}`)
