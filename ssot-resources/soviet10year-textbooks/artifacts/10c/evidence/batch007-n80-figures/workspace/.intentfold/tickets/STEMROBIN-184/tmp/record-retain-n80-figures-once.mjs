import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-n80-figures'
const author = `${ticket}/ana10-n80-modern-figures-author.hashes.json`
const review = `${ticket}/ana10-n80-modern-figures-independent-review.md`
const reviewHash = '006a9454da2230c1e57dc160a78f7378969bd69bb2807228ed69bb784d69eadd'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
assert.equal(hash(author), '4d887ee471d86f8d2d7b778d4ace28a9128482f94bd34af7e4db547b72735716')
assert.equal(hash(review), reviewHash)
assert(!fs.existsSync(evidence), 'Preserve any earlier retention')
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
const manifest = read(author)
for (const input of [manifest.report, ...manifest.inputs]) {
  assert.equal(hash(input.path), input.sha256)
  copy(input.path)
}
for (const file of [
  author, review, `${ticket}/ana10-n80-parent-figure-source-first.md`,
  `${ticket}/record-retain-n80-figures-once.mjs`,
  `${ticket}/retain-approved-figures.mjs`,
]) copy(file)
const promotions = []
for (const id of ['fig-10', 'fig-11']) {
  const first = `.tmp/s10y-image/batch007/10c/${id}`
  const stage = `${first}-approved-staging`
  assert(!fs.existsSync(stage), 'Recording is once per approved figure')
  copy(first)
  fs.mkdirSync(stage)
  for (const [from, name] of [
    [`${first}/spec.json`, 'spec.json'],
    [`${first}/figure.svg`, `${id}.svg`],
    [`${first}/figure.render.json`, `${id}.render.json`],
  ]) fs.copyFileSync(from, `${stage}/${name}`, fs.constants.COPYFILE_EXCL)
  for (const operation of [
    {
      name: 'record', executable: '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      args: ['-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
        '--spec', `${stage}/spec.json`, '--render', `${stage}/${id}.render.json`,
        '--output', `${stage}/${id}.review.json`, '--status', 'pass',
        '--notes', `Sole independent continuation limited PASS, SHA ${reviewHash}; see ${evidence}/workspace/${review}. Both original apparatuses, complete approved text, native outputs and existing neutral/print fixed640 and mobile-scroll evidence compared once. Source0/O optical identity remains UNKNOWN; modern0 is explicitly text-derived. Source55 interpretation HOLD still blocks whole n80 completion. No rerender or second semantic review.`],
    },
    {
      name: 'promote', executable: 'node',
      args: [`${ticket}/retain-approved-figures.mjs`, id],
      env: { ...process.env, FIGURE_BOOK: '10c', FIGURE_SCRATCH_DIR: stage },
    },
  ]) {
    const startedAtUtc = new Date().toISOString()
    const result = spawnSync(operation.executable, operation.args, {
      encoding: 'utf8', env: operation.env || process.env,
    })
    const prefix = `${ticket}/n80-${id}-${operation.name}`
    fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '')
    fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '')
    write(`${prefix}.command.json`, {
      executable: operation.executable, args: operation.args, cwd: process.cwd(),
      startedAtUtc, finishedAtUtc: new Date().toISOString(), exitCode: result.status,
      signal: result.signal, error: result.error?.message || null,
    })
    for (const suffix of ['stdout.txt', 'stderr.txt', 'command.json']) copy(`${prefix}.${suffix}`)
    console.log(result.stdout)
    assert.equal(result.status, 0, 'Preserve a recording/promotion failure')
  }
  copy(stage)
  const target = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/figures'
  promotions.push({
    id, outputs: ['spec.json', 'svg', 'render.json', 'review.json'].map(suffix => {
      const file = `${target}/${id}.${suffix}`
      return { path: file, sha256: hash(file) }
    }),
  })
}
write(`${evidence}/retention.json`, {
  status: 'Two limited-PASS figures retained and promoted; whole n80 NOT_COMPLETE',
  independentReview: { path: `workspace/${review}`, sha256: reviewHash },
  copied, promotions,
  limits: 'Source55 interpretation HOLD, original0/O optical UNKNOWN and unmeasured schematic regularization remain. First FAIL/sole repair preserved. No lesson finalize, whole display, answers, choices or production action.',
})
console.log(`${copied.length} immutable evidence files retained; two spec/SVG byte-identical promotions`)
