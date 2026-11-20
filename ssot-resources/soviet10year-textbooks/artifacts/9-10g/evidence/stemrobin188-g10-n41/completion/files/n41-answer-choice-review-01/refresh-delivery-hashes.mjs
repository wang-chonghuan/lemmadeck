import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
if (process.cwd() !== cwd) throw new Error('Exact cwd required')
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n41-answer-choice-review-01')
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const receipt = (p) => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const save = (name, value) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`)

// Only mechanically refresh this directory's delivery digests after the manuscript binding amendment.
const report = read('report.json')
report.outputs = report.outputs.map((x) => receipt(x.path))
save('report.json', report)
const mdPath = path.join(root, 'report.md')
const md = fs.readFileSync(mdPath, 'utf8').replace(
  /^(\/Users\/yong\/.*\/n41-answer-choice-review-01\/(?:review\.json|answer-review\.json|visual-observation\.json|report\.json)) SHA256 [0-9a-f]{64}$/gm,
  (_, p) => `${p} SHA256 ${hash(p)}`,
)
fs.writeFileSync(mdPath, md)
const delivery = read('output-hashes.json')
delivery.files = delivery.files.map((x) => receipt(x.path))
delivery.files.push(receipt(path.join(root, 'refresh-delivery-hashes.mjs')))
save('output-hashes.json', delivery)
console.log(JSON.stringify({
  outcome: report.outcome,
  outputs: delivery.files.filter((x) => /(?:review\.json|answer-review\.json|visual-observation\.json|report\.json|report\.md|FIRST-source-solutions\.json|PREKEY-true-sets\.json)$/.test(x.path)),
  manifest: receipt(path.join(root, 'output-hashes.json')),
  recorded_content_binding_problems: report.content_binding_problems,
  prior_catalogue_only_difference: report.bindings.filter((x) => !x.matches_expected && x.historical_trace_preserved),
  counters: report.counters,
}, null, 2))
