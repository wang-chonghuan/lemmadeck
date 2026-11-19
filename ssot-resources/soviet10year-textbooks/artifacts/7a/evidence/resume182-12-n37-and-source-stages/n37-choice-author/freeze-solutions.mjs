import fs from 'node:fs'
import crypto from 'node:crypto'
const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author'
if (process.cwd() !== root) throw new Error('Wrong cwd')
const file = `${base}/source-solutions.md`
const data = fs.readFileSync(file)
const record = {
  phase: 'independent solutions frozen before constructing options',
  path: file,
  sha256: crypto.createHash('sha256').update(data).digest('hex'),
  frozen_utc: new Date().toISOString(),
  source_exercises: 22,
  original_tasks: 100,
  options_exist_at_freeze: fs.existsSync(`${base}/authored-questions.json`),
}
if (record.options_exist_at_freeze) throw new Error('Options already exist')
fs.writeFileSync(`${base}/source-solutions.freeze.json`, JSON.stringify(record, null, 2) + '\n', {flag: 'wx'})
fs.chmodSync(file, 0o444)
console.log(JSON.stringify(record, null, 2))
