import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const work = `${ticket}/production-modern10c97`
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const lesson = 'ana10-c7-s1-n97'
const directory = `${book}/editions/modern-us-neutral/lessons/${lesson}`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const selector = ['--book', '10c', '--edition', 'modern-us-neutral', '--lesson', lesson]
const mode = process.argv[2]
const commands = {
  finalize: [python, ['.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'adapt-finalize', ...selector, '--work', work]],
  validate: [python, ['.claude/skills/ld-s10y-lesson/tools/validate_publish.py',
    book, '--edition', 'modern-us-neutral', '--lesson', lesson]],
  render: [python, ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', ...selector]],
  check: ['node', [`${ticket}/offline-check.mjs`, '10c', lesson]],
  'answers-prepare': ['python3', ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
    'prepare', ...selector, '--work', `${ticket}/production-answers10c97`]],
}
assert(mode in commands, 'Expected a named first execution')
const output = `${work}/first-${mode}`
assert(!fs.existsSync(output), 'Do not overwrite or rerun a recorded execution')
fs.mkdirSync(output)
if (mode === 'finalize') {
  fs.cpSync(`${work}/adapt/10c/modern-us-neutral/lessons/${lesson}`,
    `${output}/before`, { recursive: true })
}
const [executable, args] = commands[mode]
const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' }
delete env.PWDEBUG
const started = new Date().toISOString()
const result = spawnSync(executable, args, { encoding: 'utf8', env, maxBuffer: 16 * 1024 * 1024 })
fs.writeFileSync(`${output}/command.json`, JSON.stringify({
  executable, args, started, finished: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
}, null, 2) + '\n')
fs.writeFileSync(`${output}/stdout.txt`, result.stdout ?? '')
fs.writeFileSync(`${output}/stderr.txt`, result.stderr ?? '')
if (mode === 'finalize' && fs.existsSync(directory)) {
  fs.cpSync(directory, `${output}/after`, { recursive: true })
}
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
process.exitCode = result.status ?? 1
