import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp'
const viewFile = `${root}/ana10-n79-choice-views.json`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(hash(viewFile), '6bae66d6b2b69d2368450a64571ed7a5216f05274012cce31d92681a355e4666')
const questions = JSON.parse(fs.readFileSync(viewFile, 'utf8'))
assert.equal(questions.length, 10)
assert.equal(questions.reduce((count, question) => count + question.view.options.length, 0), 45)
for (const question of questions) assert.deepEqual(Object.keys(question).sort(), ['id', 'view'])
const displayFile = `${root}/ana10-n79-choice-display-only.json`
assert(!fs.existsSync(displayFile), 'Preserve an existing display snapshot')
fs.writeFileSync(displayFile, JSON.stringify({ questions, new_figures: [] }, null, 2) + '\n')
console.log(execFileSync('node', [
  `${root}/render-choice-preview.mjs`, '10c', 'ana10-c6-s2-n79',
  `${root}/ana10-n79-choice-seed.json`, displayFile,
], {
  encoding: 'utf8',
  env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
}).trim())
