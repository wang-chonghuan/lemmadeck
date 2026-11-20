import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, bind, hash, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const source = path.join(tmp, 'n66-choice-approved-01')
const review = path.join(tmp, 'n66-answer-choice-review-01/review.json')
assert.equal(read(review).outcome, 'pass')
assert.ok(!fs.existsSync(source))
fs.mkdirSync(source)
const bindings = [
  [path.join(tmp, 'n66-choice-author/seed.json'), 'seed.json'],
  [path.join(tmp, 'n66-choice-author/draft.json'), 'draft.json'],
  [review, 'review.json'],
].map(([from, name]) => {
  const to = path.join(source, name)
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  return { original: bind(from), copy: bind(to) }
})
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/retain_choices.py',
  '--repo', repo, '--book', '9-10g', '--lesson', 'geo910-c2-s3-n66', '--source', source]
const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8' })
save(path.join(source, 'retain.command.json'), {
  command, args, cwd: repo, exitCode: result.status,
  stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
})
assert.equal(result.status, 0, result.stderr || result.stdout)
bindings.forEach(item => assert.equal(hash(item.original.path), item.original.sha256))
const target = path.join(core, 'editions/modern-us-neutral/lessons/geo910-c2-s3-n66/choice-set')
save(path.join(source, 'result.json'), {
  status: 'reviewed-choice-snapshot-retained-offline', bindings,
  retained: ['seed.json', 'draft.json', 'review.json'].map(file => bind(path.join(target, file))),
  newFigureCount: 0, published: false, wholeLessonApproved: false,
})
console.log(JSON.stringify({ target, status: 'retained-offline', published: false }))
