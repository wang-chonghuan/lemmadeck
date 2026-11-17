import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const number = process.argv[2]
const reviewFile = process.argv[3]
const reviewSha = process.argv[4]
assert(['18', '19'].includes(number))
assert(reviewFile?.startsWith(`${ticket}/`) && /^[a-f0-9]{64}$/.test(reviewSha || ''))
const id = `geo910-c1-s2-n${number}`
const root = `${ticket}/n18-n19-production/n${number}-formal-answers`
const edition = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral'
const working = `.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/${id}`
const proseFile = `${ticket}/geo910-n18-n19-standard-answer-prose.json`
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: file, sha256: sha(file) })
const read = file => JSON.parse(fs.readFileSync(file))
assert.equal(sha(reviewFile), reviewSha)
assert(!fs.existsSync(root))
assert(!fs.existsSync(`${working}/answer-keys.template.json`))
assert(!fs.existsSync(`${edition}/lessons/${id}/answer-keys.json`))
const protectedFiles = ['lesson.json', 'exercises.json', 'figures.json']
  .map(file => `${edition}/lessons/${id}/${file}`)
const protectedRecords = protectedFiles.map(record)
if (number === '19') {
  const bindingFile = `${ticket}/geo910-n19-independent-answer-gate2-bindings.json`
  assert.equal(sha(bindingFile), '04d67cc455276900158e2814d2b223e185f925a317579099deec3a70f9c7a570')
  const binding = read(bindingFile)
  assert.equal(binding.decision, 'PASS')
  assert.equal(binding.lesson, id)
  assert.equal(binding.pass_count, 6)
  for (const name of ['lesson', 'exercises', 'figures']) {
    assert.equal(sha(`${edition}/lessons/${id}/${name}.json`), binding.bindings[`modern_${name}`].sha256)
  }
  const approved = read(proseFile).lessons[id]
  const valueSha = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')
  assert.equal(valueSha(approved), binding.bindings.candidate_prose.selected_parsed_value_sha256)
  assert.deepEqual(approved.map(answer => answer.exercise), binding.items.map(item => item.exercise))
  for (let index = 0; index < approved.length; index++) {
    assert.equal(valueSha(approved[index]), binding.items[index].candidate_record_sha256)
    assert.equal(createHash('sha256').update(approved[index].displayAnswer).digest('hex'),
      binding.items[index].display_answer_sha256)
  }
}
fs.mkdirSync(root)
const run = name => {
  const start = new Date().toISOString()
  const child = spawnSync('python3', [
    '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', name,
    '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', id,
  ], { encoding: 'utf8', env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' } })
  const command = { argv: child.spawnargs, cwd: process.cwd(), startedAtUtc: start,
    finishedAtUtc: new Date().toISOString(), exit: child.status, error: child.error?.message || null }
  for (const [file, value] of [
    [`${name}.stdout.txt`, child.stdout || ''], [`${name}.stderr.txt`, child.stderr || ''],
    [`${name}.command.json`, JSON.stringify(command, null, 2) + '\n'],
  ]) fs.writeFileSync(`${root}/${file}`, value, { flag: 'wx' })
  console.log(JSON.stringify(command))
  assert.equal(child.status, 0, `${name} failed; retain the first result`)
}
run('prepare')
const templateFile = `${working}/answer-keys.template.json`
const template = read(templateFile)
const candidate = structuredClone(template)
const approved = read(proseFile).lessons[id]
const written = read(`${edition}/lessons/${id}/exercises.json`).exercises
assert.deepEqual(candidate.answers.map(answer => answer.exercise), approved.map(answer => answer.exercise))
assert.deepEqual(candidate.answers.map(answer => answer.prompt), written.map(exercise => exercise.text))
for (let index = 0; index < candidate.answers.length; index++) {
  const answer = candidate.answers[index]
  assert.equal(answer.source, 'derived')
  assert.deepEqual(answer.figureEvidence, [])
  answer.displayAnswer = approved[index].displayAnswer
  answer.grading = 'ungraded'
  assert.deepEqual(answer.parts, [])
}
const candidateFile = `${working}/answer-keys.candidate.json`
fs.writeFileSync(candidateFile, JSON.stringify(candidate, null, 2) + '\n', { flag: 'wx' })
const target = `${edition}/lessons/${id}/answer-keys.json`
fs.copyFileSync(candidateFile, target, fs.constants.COPYFILE_EXCL)
assert.equal(sha(candidateFile), sha(target))
fs.writeFileSync(`${root}/binding.json`, JSON.stringify({
  status: 'APPROVED_DISPLAY_PROSE_BOUND_WITHOUT_NEW_MATH_REVIEW',
  lesson: id, prose: record(proseFile), review: record(reviewFile),
  template: record(templateFile), candidate: record(candidateFile), protectedRecords,
  gradingBasis: 'Read-only geometric constructions, vector reasoning and proofs retain complete standard prose. No scalar-zero surrogate or incomplete symbolic matching key is introduced; no interaction specification is produced.',
}, null, 2) + '\n', { flag: 'wx' })
run('finalize')
assert.deepEqual(protectedFiles.map(record), protectedRecords)
fs.writeFileSync(`${root}/completion.json`, JSON.stringify({
  status: 'FORMAL_ANSWERS_FINALIZED_NOT_WHOLE_LESSON',
  lesson: id, count: candidate.answers.length, grading: 'ungraded',
  formal: record(target), limits: 'No publisher, DB write, interaction or repeated semantic review.',
}, null, 2) + '\n', { flag: 'wx' })
