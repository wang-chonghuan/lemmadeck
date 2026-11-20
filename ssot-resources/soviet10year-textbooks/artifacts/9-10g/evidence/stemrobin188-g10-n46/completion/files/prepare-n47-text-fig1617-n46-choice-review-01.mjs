import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const names = [
  'n47-modern-text-review-inputs-01', 'n47-fig1617-review-inputs-01', 'n46-choice-visual-review-inputs-01',
]
const inputs = names.map(name => {
  const file = path.join(tmp, name, 'manifest.json')
  return { manifest: bind(file), data: JSON.parse(fs.readFileSync(file, 'utf8')) }
})
const bindings = [...new Map(inputs.flatMap(input => [...input.data.bindings, input.manifest])
  .map(binding => [binding.path, binding])).values()]
for (const binding of bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
assert.equal(inputs.reduce((total, input) => total + input.data.imageOpensPlanned, 0), 8)
const output = path.join(tmp, 'n47-text-fig1617-n46-choice-review-inputs-01')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify({
  status: 'pending-single-independent-first-review',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6',
  modernText: inputs[0].manifest, figures: inputs[1].manifest, choiceVisual: inputs[2].manifest,
  bindings, imageOpensPlanned: 8, hardImageLimit: 8,
  firstN47ModernAndFig1617Review: true, firstN46ChoiceVisualReview: true,
  noN46MathematicalReviewRepeated: true, noSourceWholepageReviewRepeated: true,
  originalFailuresHoldsAndCountersPreserved: true, published: false,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, bindings: bindings.length, imageOpensPlanned: 8 }))
