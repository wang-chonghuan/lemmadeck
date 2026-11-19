import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const first = path.join(tmp, 'd1264-n100-first-independent-text-review/report.json')
const review = read(first)
assert.equal(review.status, 'HOLD')
assert.equal(review.findings.length, 1)
assert.equal(review.findings[0].id, 'F01')
const source = path.join(tmp, 'd1259-n100-first-bilingual-text-author/en/lesson.template.json')
assert.equal(sha(source), review.findings[0].sha256)
const before = read(source)
assert.equal(before.title, 'Synchrocyclotron')
const after = { ...before, title: 'Proton Synchrotron' }
assert.deepEqual({ ...after, title: before.title }, before)
const candidate = save(path.join(own, 'en/lesson.template.json'), after)
save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s4-n100',
  status: 'TITLE-ONLY-SOLE-REPAIR-AFFECTED-REVIEW-PENDING',
  finding: 'F01', firstReview: bind(first), source: bind(source), candidate,
  delta: { pointer: '/title', before: before.title, after: after.title },
  sourceAndPrintedTitleUnchanged: true, otherTemplateFieldsUnchanged: true,
  semanticBodyReviewReplays: 0, nativePassReplays: 0, parentImageOpens: 0,
  contentRevisions: 1, paidCalls: 0, databaseWrites: false, completeCard: false,
})
console.log(JSON.stringify({ candidate, title: after.title }))
