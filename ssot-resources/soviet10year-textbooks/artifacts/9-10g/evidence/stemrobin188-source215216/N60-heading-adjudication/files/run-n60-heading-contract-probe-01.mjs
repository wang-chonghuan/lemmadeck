import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, bind, save } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'n60-heading-contract-probe-01')
assert.ok(!fs.existsSync(root), root)
fs.mkdirSync(root)
const source = path.join(tmp, 'source213215-author/artifacts/9-10g/pages/0215/page.json')
const toc = path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json')
const code = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/assemble.py')
const before = [source, toc, code].map(bind)
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const args = ['-B', path.join(tmp, 'probe-n60-heading-contract-01.py')]
const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
fs.writeFileSync(path.join(root, 'stdout.json'), result.stdout || '', { flag: 'wx' })
fs.writeFileSync(path.join(root, 'stderr.txt'), result.stderr || '', { flag: 'wx' })
save(path.join(root, 'command.json'), { command, args, cwd: repo,
  exitCode: result.status, error: result.error?.message, bindingsBefore: before,
  script: bind(args[1]), imageLoads: 0, nativeCalls: 0, assembleRunCalls: 0 })
assert.deepEqual([source, toc, code].map(bind), before)
assert.equal(result.status, 0, result.stderr)
const output = JSON.parse(result.stdout)
console.log(JSON.stringify({ root, status: output.status, id: output.mappedLesson.card_id,
  sourceEdited: false, independentAdjudicationPending: true }))
