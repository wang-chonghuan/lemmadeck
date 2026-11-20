import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const read = (relative) => JSON.parse(fs.readFileSync(path.join(own, relative), 'utf8'))
const save = (relative, value, mode = 0o444) => {
  fs.writeFileSync(path.join(own, relative), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode })
  fs.chmodSync(path.join(own, relative), mode)
}
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const check = read('focused-author-check-01.json')
if (check.status !== 'PASS') throw new Error('Dependent flow binding stopped after focused failure')
const flowReceipt = read('receipts/prose-flow-01/command.json')
if (flowReceipt.exitCode !== 0) throw new Error('Cannot bind a failed prose flow')
const stdout = fs.readFileSync(path.join(own, 'receipts/prose-flow-01/stdout.txt'), 'utf8')
const paragraphs = []
const savedBoundaries = []
for (const line of stdout.split('\n')) {
  if (line.startsWith('    break: ')) {
    savedBoundaries.push(JSON.parse(line.slice('    break: '.length)))
  } else if (/^\[\d+\] /.test(line)) {
    const match = line.match(/^\[(\d+)\] (.*)$/)
    paragraphs.push({ index: Number(match[1]), text: match[2] })
  } else if (line && paragraphs.length) {
    paragraphs.at(-1).text += `\n${line}`
  }
}
if (!paragraphs.length || savedBoundaries.length !== paragraphs.length - 1) {
  throw new Error('Saved prose-flow stdout structure is incomplete')
}
const source = read('working/lesson.template.json')
const before = structuredClone(source)
const decisions = read('author-layout.json')
const switchRecords = []
for (const decision of decisions.plannedConceptSwitches) {
  const fromBlock = source.prose.find((block) => JSON.stringify(block.source_refs) === JSON.stringify(decision.fromSourceRefs))
  const toBlock = source.prose.find((block) => JSON.stringify(block.source_refs) === JSON.stringify(decision.toSourceRefs))
  if (!fromBlock || !toBlock) throw new Error('Concept-switch source binding missing')
  const matches = savedBoundaries.filter((boundary) => fromBlock.text.includes(boundary.before) && toBlock.text.includes(boundary.after))
  if (matches.length !== 1) throw new Error('Concept-switch must select one actual saved boundary')
  switchRecords.push({ ...decision, boundary: matches[0] })
}
source.section_breaks = switchRecords.map((record) => record.boundary)
const withoutAnchors = structuredClone(source)
withoutAnchors.section_breaks = before.section_breaks
if (JSON.stringify(withoutAnchors) !== JSON.stringify(before)) {
  throw new Error('Anchor insertion changed candidate content')
}
for (const boundary of source.section_breaks) {
  if (!savedBoundaries.some((saved) => JSON.stringify(saved) === JSON.stringify(boundary))) {
    throw new Error('Anchor not copied verbatim from saved tool output')
  }
}
fs.writeFileSync(path.join(own, 'working/lesson.template.json'), `${JSON.stringify(source, null, 2)}\n`)
save('prose-flow.saved.json', {
  schema: 'n61-saved-actual-prose-flow@1',
  commandReceipt: 'receipts/prose-flow-01/command.json',
  stdout: { path: 'receipts/prose-flow-01/stdout.txt', sha256: hash(stdout) },
  paragraphs, boundaries: savedBoundaries,
  source: 'Parsed only actual saved prose_flow stdout; boundaries copied verbatim, not recomputed from block/newline indices.',
})
save('anchor-binding.json', {
  schema: 'n61-author-saved-output-anchor-binding@1',
  status: 'PASS', method: 'Pure saved-output comparison, no post-anchor flow rerun',
  conceptSwitches: switchRecords,
  beforeSha256: hash(`${JSON.stringify(before, null, 2)}\n`),
  afterSha256: hash(fs.readFileSync(path.join(own, 'working/lesson.template.json'))),
  onlyChangedField: 'section_breaks',
  contentRepair: false,
  approvals: false,
})
console.log(JSON.stringify({ status: 'saved-flow-and-anchors-bound', paragraphs: paragraphs.length,
  savedBoundaries: savedBoundaries.length, conceptSwitches: switchRecords.length, flowReruns: 0 }, null, 2))
