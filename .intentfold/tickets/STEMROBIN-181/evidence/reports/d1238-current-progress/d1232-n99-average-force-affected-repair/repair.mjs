import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const author = path.join(path.dirname(own), 'd1212-n99-two-errata-repair')
const reviewFile = path.join(repo, 'tmp/d1224-n99-first-independent-text-review/report.json')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
assert.equal(read(reviewFile).findings.length, 1)
const outputs = []
for (const [locale, expected, before, after] of [
  ['zh', 'ed42df9098f72e5ada54311bce9fb20012532f4403a68b6b4b92b4badc478b60',
    '在连续时间的写法中，这就是 d(mv)/dt=F，各量的方向按向量处理。',
    '对于有限时间间隔，右侧的合力表示这段时间内的平均合力；合力恒定时，它就等于这个恒定的力。\n这一有限间隔的约定同样适用于前面的式 (8.7) 和 (8.8)。\n当时间间隔趋于零时，才得到瞬时关系 d(mv)/dt=F，各量的方向按向量处理。'],
  ['en', '7d25b646167f608c15b2cb90fd77d859760e22578b7f49ba7d22698f2ebe894d',
    'In continuous time, this is d(mv)/dt=F, with directions understood as vectors.',
    'For a finite time interval, the net force on the right means its average over that interval; if the force is constant, the average equals that constant force.\nThe same finite-interval convention applies to the earlier equations (8.7) and (8.8).\nAs the time interval tends to zero, the equation becomes the instantaneous relation d(mv)/dt=F, with directions understood as vectors.'],
]) {
  const input = path.join(author, locale, 'lesson.template.json')
  assert.equal(sha(input), expected)
  const original = read(input)
  const candidate = structuredClone(original)
  assert.equal(candidate.prose[14].text.split(before).length, 2)
  candidate.prose[14].text = candidate.prose[14].text.replace(before, after)
  const control = structuredClone(candidate)
  control.prose[14].text = original.prose[14].text
  assert.deepEqual(control, original)
  const lesson = save(path.join(own, locale, 'lesson.template.json'), candidate)
  const from = path.join(author, locale, 'exercises.template.json')
  const target = path.join(own, locale, 'exercises.template.json')
  fs.copyFileSync(from, target, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(target))
  outputs.push({ locale, original: bind(input), current: lesson, exercises: bind(target),
    change: { pointer: '/prose/14/text', before, after }, allOtherFieldsUnchanged: true })
}
save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', card: 'phy10-c2-s4-n99',
  status: 'N99-SCI-001-CLARIFIED-AFFECTED-REVIEW-PENDING',
  firstReview: bind(reviewFile), outputs, sourceAndErrataEdits: 0,
  sectionBreakChanges: 0, nativeExecutions: 0, parentImageOpens: 0,
  paidCalls: 0, completeCard: false,
})
