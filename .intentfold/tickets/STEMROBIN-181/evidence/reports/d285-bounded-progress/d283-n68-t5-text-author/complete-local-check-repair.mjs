import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { proseOutline } = require(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const before = read(path.join(out, 'retained-initial-check-fail/frozen/n68/en/lesson.template.json'))
const currentPath = path.join(out, 'frozen/n68/en/lesson.template.json')
assert.deepEqual(read(currentPath), before)
const texts = read(path.join(out, 'texts.json'))
const oldTexts = read(path.join(out, 'retained-initial-check-fail/texts.json'))
const expectedTexts = structuredClone(oldTexts)
expectedTexts.n68.prose[5].en = texts.n68.prose[5].en
assert.deepEqual(texts, expectedTexts)
const after = structuredClone(before)
const oldText = before.prose[5].text
const newText = texts.n68.prose[5].en
assert.equal(newText, oldText.replace(', as in equation 6.4.', ' (see equation 6.4).'))
after.prose[5].text = newText
const outline = proseOutline(after.prose)
after.section_breaks = after.section_breaks.map(boundary => {
  const previous = boundary.before
  const following = boundary.after.replace(oldText, newText)
  assert(outline.some((item, i) => i > 0 && outline[i - 1].text === previous && item.text === following))
  return { before: previous, after: following }
})
fs.writeFileSync(currentPath, `${JSON.stringify(after, null, 2)}\n`)
const folder = path.join(out, 'prose-flow-repair/n68/en')
fs.mkdirSync(folder, { recursive: true })
const command = ['node', path.join(root, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', currentPath]
const proc = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
const stdout = path.join(folder, 'stdout.txt')
const stderr = path.join(folder, 'stderr.txt')
fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
const receiptPath = path.join(folder, 'receipt.json')
fs.writeFileSync(receiptPath, `${JSON.stringify({
  command, exitCode: proc.status, authoredLesson: bound(currentPath),
  stdout: bound(stdout), stderr: bound(stderr), localRepairOnly: true,
  notARender: true, newImageOpens: 0,
}, null, 2)}\n`, { flag: 'wx' })
assert.equal(proc.status, 0)
const flow = JSON.parse(proc.stdout)
assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), after.section_breaks)
const registerPath = path.join(out, 'change-register.json')
const register = read(registerPath)
assert.deepEqual(register, read(path.join(out, 'retained-initial-check-fail/change-register.json')))
const change = register.changes.find(c => c.alias === 'n68' && c.language === 'en' && c.target === 'lesson.prose[5]')
assert.equal(change.authored_text, oldText)
change.authored_text = newText
const oldFlow = register.proseFlowReports.find(r => r.card === 'phy10-c2-s2-n68' && r.language === 'en')
oldFlow.retainedInitialReport = oldFlow.report
oldFlow.retainedInitialReceipt = oldFlow.receipt
oldFlow.report = bound(stdout)
oldFlow.receipt = bound(receiptPath)
oldFlow.boundariesFromNativeProseFlow = flow.boundaries
oldFlow.paragraphCount = flow.paragraphs.length
register.localMechanicalRepair = {
  count: 1, target: 'n68/en/lesson.prose[5]',
  before: ', as in equation 6.4.', after: ' (see equation 6.4).',
  sourceTextAndEquationNumberUnchanged: true, numeric_changes: [],
  reason: 'Existing NUMBER regexp excludes a decimal immediately followed by a sentence period; parenthesizing the existing equation citation preserves natural English and its value without modifying stable parsing code.',
  initialFAIL: bound(path.join(out, 'mechanical-text-check/stdout.json')),
  retainedInitialManifest: bound(path.join(out, 'retained-initial-check-fail/manifest.json')),
  candidateBeforeRepair: bound(path.join(out, 'retained-initial-check-fail/frozen/n68/en/lesson.template.json')),
  candidateAfterRepair: bound(currentPath), newImageOpens: 0,
}
fs.writeFileSync(registerPath, `${JSON.stringify(register, null, 2)}\n`)
console.log(JSON.stringify({ target: 'n68/en/lesson.prose[5]', equationReference: '6.4', paragraphCount: flow.paragraphs.length, changedBoundaryCount: 1, newImages: 0 }, null, 2))
