import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const root = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/g10-n46')
const receipt = path.join(root, 'assemble-source-01')
const command = JSON.parse(fs.readFileSync(path.join(receipt, 'command.json'), 'utf8'))
assert.equal(command.exitCode, 1)
const source = path.join(root, 'artifacts/9-10g')
const output = path.join(receipt, 'generated-before-identity-repair')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const files = ['book.json', ...['lesson.json', 'lesson.md', 'exercises.json']
  .map(name => `lessons/geo910-c2-s1-n46/${name}`)]
const bindings = files.map(relative => {
  const from = path.join(source, relative)
  const to = path.join(output, relative)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  return { from, snapshot: to, sha256: hash(to) }
})
fs.writeFileSync(path.join(output, 'bindings.json'), JSON.stringify({
  status: 'preserved-failed-assembly-before-recovery',
  originalExitCode: 1, bindings, metadataNumber36StarPreserved: true,
  sourceApprovalChanged: false,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ files: bindings.length, failedExitPreserved: 1 }))
