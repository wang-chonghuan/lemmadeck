import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-n83-finalize-display'
const firstFile = `${ticket}/ana10-n83-finalize-display-completed.manifest.json`
const repairFile = `${ticket}/ana10-n83-heading-repair-author.manifest.json`
const parentFile = `${ticket}/ana10-n83-parent-offline-review.md`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const expectedParent = process.argv[2]
assert.match(expectedParent || '', /^[0-9a-f]{64}$/)
assert.equal(hash(parentFile), expectedParent)
assert.equal(hash(firstFile), 'f5a6629da73629eeae064c99733d003420f30f4756501ca6d8f76abe394e8d63')
assert.equal(hash(repairFile), '90ef74e19f5170aa54d2f6e1b96fb48a9eda4ff49d30a10e732521d1e558ed2a')
assert(!fs.existsSync(root), 'Preserve all first and affected evidence')
const first = read(firstFile)
const repair = read(repairFile)
const records = [first.report, repair.report, ...first.files, ...repair.files]
for (const record of records) assert.equal(hash(record.path), record.sha256, record.path)
const copied = []
const seen = new Set()
const copy = from => {
  const stat = fs.lstatSync(from)
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(from)) copy(path.join(from, entry))
    return
  }
  assert(stat.isFile(), from)
  const relative = path.relative(process.cwd(), path.resolve(from))
  assert(!relative.startsWith('..'), from)
  if (seen.has(relative)) return
  const to = path.join(root, 'workspace', relative)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  copied.push({ path: path.relative(root, to), sha256: hash(to) })
  seen.add(relative)
}
for (const file of [
  ...records.map(record => record.path), firstFile, repairFile, parentFile,
  `${ticket}/n83-finalize-display`,
  `${ticket}/ana10-n83-finalize-display-author.md`,
  `${ticket}/group-heading-render.test.mjs`,
  `${ticket}/retain-n83-finalize-display.mjs`,
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
]) copy(file)
for (const name of fs.readdirSync(ticket).filter(name => name.startsWith('group-heading-fixture-'))) {
  copy(`${ticket}/${name}`)
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'Sole initial and affected offline display PASS; original STOP/REVISE preserved',
  copied,
  parentReview: { path: `workspace/${parentFile}`, sha256: expectedParent },
  actualCommands: 'One bind, one adapt-finalize, one first render/offline check; one affected render/browser cycle. No finalize/full offline/table repetition.',
  focusedTests: { tests: 4, passed: 4, failed: 0, skipped: 0 },
  unchanged: 'Text HTML, other six group headings, all48 tasks, all19 JSON/index/figure bindings, and all72 first evidence files unchanged.',
  limits: '101 literal/semantic UNKNOWN remains. No formal answers/choices, complete count, commit/push or production action.',
}, null, 2) + '\n')
console.log(`${copied.length} n83 first/repair/display evidence files retained byte-identically`)
