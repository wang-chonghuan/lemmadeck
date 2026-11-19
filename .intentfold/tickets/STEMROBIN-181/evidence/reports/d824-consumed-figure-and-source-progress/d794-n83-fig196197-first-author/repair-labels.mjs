import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const O = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d794-n83-fig196197-first-author`
assert.equal(process.cwd(), R)
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const repairs = [
  {
    id: 'fig-196', previous: 'repair-1', next: 'repair-2', ordinal: 2,
    label: 'colour-name-6', at: [572, 245],
    diagnosis: 'First actual-640 author preview open (image open 3) shows Orange-yellow intersecting the thin receiving-wall outline. Native render passed because this thin edge is not included in its thick-geometry collision set. Move only the label right; retain the native pass and preview as historical evidence, not a source-fidelity certification.',
    evidence: 'fig-196/repair-1/fig-196.actual-640.png',
  },
  {
    id: 'fig-197', previous: 'repair-2', next: 'repair-3', ordinal: 3,
    label: 'white-image-label', at: [584, 260],
    diagnosis: 'Native render now executes but fails White image label collision with the vertical screen. Move only this label right into margin, keeping no-prism reference geometry and all source labels/contacts unchanged.',
    evidence: 'fig-197/repair-2/render.command.json',
  },
]
for (const repair of repairs) {
  const before = `${O}/${repair.id}/${repair.previous}/spec.json`
  const after = `${O}/${repair.id}/${repair.next}/spec.json`
  assert.ok(!fs.existsSync(after))
  const spec = JSON.parse(fs.readFileSync(before, 'utf8'))
  const label = spec.objects.find(o => o.id === repair.label)
  const old = label.at
  label.at = repair.at
  fs.mkdirSync(`${O}/${repair.id}/${repair.next}`, { recursive: true })
  fs.writeFileSync(after, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
  fs.writeFileSync(`${O}/${repair.id}/${repair.next}/repair.json`, `${JSON.stringify({
    ordinal: repair.ordinal, figure: repair.id,
    before: { path: before, sha256: hash(before) },
    after: { path: after, sha256: hash(after) },
    defectEvidence: { path: `${O}/${repair.evidence}`, sha256: hash(`${O}/${repair.evidence}`) },
    diagnosis: repair.diagnosis,
    change: { object: repair.label, property: 'at', before: old, after: label.at },
    sourceFactsChanged: false, cumulativeContentRepairs: repair.ordinal,
    approval: 'none', independentReview: false,
  }, null, 2)}\n`, { flag: 'wx' })
  console.log(`${repair.id} ${repair.next} ${hash(after)}`)
}
