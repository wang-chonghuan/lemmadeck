import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const card = 'phy10-c2-s4-n97'
const author = path.join(tmp, 'd1202-n97-first-bilingual-text-author/work/adapt/10p/modern-us-neutral/lessons', card)
const review = path.join(tmp, 'd1213-n97-first-independent-text-review/report.json')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
assert.equal(read(review).findings.length, 1)
const outputs = []
for (const [locale, expected, before, after] of [
  ['zh', 'aa05d46397b069e9353bde5a25191eeb5006116513eb3f5756c7709130b639f9',
    '棒在惯性参考系 $K_1$ 中静止', '硬质棒在惯性参考系 $K_1$ 中静止'],
  ['en', 'e517b5ed1b1343a64a6e9a35a0193ff82f63fad9de1ef5c96ad8a04f1baee1a7',
    'The rod is at rest in inertial frame $K_1$', 'The rigid rod is at rest in inertial frame $K_1$'],
]) {
  const input = path.join(author, locale, 'lesson.template.json')
  assert.equal(sha(input), expected)
  const original = read(input)
  const candidate = structuredClone(original)
  assert.equal(candidate.prose[0].text.split(before).length, 2)
  candidate.prose[0].text = candidate.prose[0].text.replace(before, after)
  const control = structuredClone(candidate)
  control.prose[0].text = original.prose[0].text
  assert.deepEqual(control, original)
  const output = save(path.join(own, locale, 'lesson.template.json'), candidate)
  const exercises = path.join(author, locale, 'exercises.template.json')
  const target = path.join(own, locale, 'exercises.template.json')
  fs.copyFileSync(exercises, target, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(target), sha(exercises))
  outputs.push({
    locale, original: bind(input), current: output, exercises: bind(target),
    change: { pointer: '/prose/0/text', before, after },
    allOtherFieldsUnchanged: true,
  })
}
const report = save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', card,
  status: 'F01-AFFECTED-TEXT-REPAIRED-INDEPENDENT-REVIEW-PENDING',
  firstReview: bind(review), outputs, substantiveRevision: 1,
  sourceEdits: 0, mathEdits: 0, nativeExecutions: 0, nativeReplays: 0,
  parentImageOpens: 0, paidCalls: 0, completeCard: false,
})
console.log(JSON.stringify({ report }))
