import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const [language, action] = process.argv.slice(2)
assert(['zh', 'en'].includes(language))
assert(['inspect', 'prepare', 'validate', 'draft-digest'].includes(action))
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const binding = read(path.join(out, 'source-binding.json'))
const item = binding.repositories.find(item => item.language === language)
const inputs = [
  ...binding.templates, binding.effectiveReview, ...binding.contracts,
  ...binding.repositories.flatMap(item => [item.temporaryBookIndex, ...item.templates.map(row => row.staged)]),
]
const verify = () => {
  for (const input of inputs) assert.equal(hash(input.path), input.sha256, input.path)
}
verify()
const prepare = path.join(root, '.agents/skills/ld-s10y-choice/scripts/prepare.py')
const validate = path.join(root, '.agents/skills/ld-s10y-choice/scripts/validate.py')
const draft = path.join(out, language, 'draft.json')
let command
if (action === 'inspect') {
  command = ['python3', '-B', prepare, 'inspect', '--repo', item.repo, '--book', item.book, '--lesson', item.lesson]
} else if (action === 'prepare') {
  command = ['python3', '-B', prepare, 'prepare', '--repo', item.repo, '--book', item.book, '--lesson', item.lesson,
    ...item.selectedSourceNumbers.flatMap(number => ['--exercise', number]), '--no-concepts', '--out', item.seedPath]
} else if (action === 'validate') {
  command = ['python3', '-B', validate, '--repo', item.repo, '--seed', item.seedPath, '--draft', draft]
} else {
  command = ['python3', '-B', prepare, 'digest', draft]
}
const folder = path.join(out, 'native-initial', language, action)
assert(!fs.existsSync(folder), 'Keep the first native attempt.')
fs.mkdirSync(folder, { recursive: true })
const startedUtc = new Date().toISOString()
const proc = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: out },
})
const stdout = path.join(folder, action === 'inspect' ? 'stdout.json' : 'stdout.txt')
const stderr = path.join(folder, 'stderr.txt')
fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
const receipt = path.join(folder, 'receipt.json')
fs.writeFileSync(receipt, `${JSON.stringify({
  command, startedUtc, finishedUtc: new Date().toISOString(),
  exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
  stdout: bound(stdout), stderr: bound(stderr),
  inputs: [item.temporaryBookIndex, ...item.templates.map(row => row.staged)],
  seed: fs.existsSync(item.seedPath) ? bound(item.seedPath) : null,
  draft: fs.existsSync(draft) ? bound(draft) : null,
  attempt: 1, automaticRetries: 0,
  noConcepts: true, fullTemplateTaskCount: 16, selectedSourceNumbers: item.selectedSourceNumbers,
  structureOnly: true, reviewSupplied: false,
  independentReview: 'PENDING-RAMAN', semanticPassClaim: false,
  newImages: 0, cumulativeImages: 24,
}, null, 2)}\n`, { flag: 'wx' })
verify()
console.log(JSON.stringify({ language, action, exitCode: proc.status, receipt: bound(receipt) }, null, 2))
process.exitCode = proc.status === 0 ? 0 : 1
