import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(fileURLToPath(import.meta.url))
assert.equal(own, `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d708-n80-fig190191192-first-author`)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (name, value) => {
  const target = path.resolve(own, name)
  assert.ok(target.startsWith(`${own}/`) && !fs.existsSync(target))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`)
}
for (const id of ['fig-190', 'fig-191', 'fig-192']) {
  const first = `${own}/${id}/first`
  const failure = JSON.parse(fs.readFileSync(`${first}/outcome.json`, 'utf8'))
  assert.equal(failure.status, 'FAIL')
  const spec = JSON.parse(fs.readFileSync(`${first}/spec.json`, 'utf8'))
  const changes = []
  if (id === 'fig-190') {
    for (const label of ['A', 'B', 'A1']) {
      const obj = spec.objects.find(item => item.id === label)
      assert.equal(obj.labelPlacement.gap, 17)
      obj.labelPlacement.gap = 38
      changes.push({ object: label, field: 'labelPlacement.gap', before: 17, after: 38 })
    }
  } else {
    for (const item of spec.assertions.filter(item => item.type === 'objectCount')) {
      assert.ok(Number.isInteger(item.equals) && item.count === undefined)
      item.count = item.equals
      delete item.equals
      changes.push({ assertion: item.id, field: 'objectCount field', before: 'equals', after: 'count', value: item.count })
    }
    assert.equal(changes.length, 4)
  }
  write(`${id}/repair1/spec.json`, spec)
  write(`${id}/repair1/repair.receipt.json`, {
    id, attempt: 'repair1', maximumContentRepairs: 1, usedContentRepairs: 1,
    firstFailure: { path: `${first}/outcome.json`, sha256: hash(`${first}/outcome.json`) },
    firstSpec: { path: `${first}/spec.json`, sha256: hash(`${first}/spec.json`) },
    repairedSpec: { path: `${own}/${id}/repair1/spec.json`, sha256: hash(`${own}/${id}/repair1/spec.json`) },
    changes, geometryChanged: false, answerKeyUsed: false, promotion: false,
  })
}
console.log('Three sole repair1 candidates written; first FAIL receipts and outputs unchanged.')
