import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const file = `${ticket}/ana10-n79-choice-views-repaired.json`
assert.equal(hash(file), '87628a48b699fd305bb7679e1671de3551dad5c738dd3eb37890787c094e9c4c')
const questions = JSON.parse(fs.readFileSync(file, 'utf8'))
const before = JSON.parse(fs.readFileSync(`${ticket}/ana10-n79-choice-initial/ana10-n79-choice-views.json`, 'utf8'))
assert.equal(questions.length, 10)
const restored = structuredClone(questions)
for (const [questionIndex, optionIndex] of [[1, 4], [2, 3], [6, 4]]) {
  assert.notEqual(restored[questionIndex].view.options[optionIndex].text, before[questionIndex].view.options[optionIndex].text)
  restored[questionIndex].view.options[optionIndex].text = before[questionIndex].view.options[optionIndex].text
}
assert.deepEqual(restored, before)
for (const question of questions) assert.deepEqual(Object.keys(question).sort(), ['id', 'view'])
const displayFile = `${ticket}/ana10-n79-choice-display-only-repaired.json`
assert(!fs.existsSync(displayFile), 'Preserve existing display evidence')
fs.writeFileSync(displayFile, JSON.stringify({ questions, new_figures: [] }, null, 2) + '\n')
for (const id of ['q2', 'q3', 'q7']) {
  assert(!fs.existsSync(`${ticket}/offline/ana10-c6-s2-n79/choices-${id}-report.json`))
  console.log(execFileSync('node', [
    `${ticket}/render-choice-preview.mjs`, '10c', 'ana10-c6-s2-n79',
    `${ticket}/ana10-n79-choice-seed.json`, displayFile, id,
  ], { encoding: 'utf8', env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' } }).trim())
}
assert.equal(hash(`${ticket}/ana10-n79-choice-targeted-repair-evidence/before/display/choices-1440.png`), 'fb73496fd0e10049d13fad16be5613449854f36ce45a9c9774524c75a29688b1')
assert.equal(hash(`${ticket}/ana10-n79-choice-targeted-repair-evidence/before/display/choices-390.png`), 'c9b356738ae03effb4d06ae143275e91b1ef812cc514dad8162d31aa84a1b18c')
console.log('Changed-only q2/q3/q7 display completed; initial complete screenshots retained unchanged')
