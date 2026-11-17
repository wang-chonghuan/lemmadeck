import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = `${ticket}/production-trace10c-batch010`
assert(!fs.existsSync(output), 'Do not repeat this book-trace rebinding')
fs.mkdirSync(output)
const lessons = ['ana10-c6-s1-n75', 'ana10-c6-s1-n76', 'ana10-c6-s1-n77',
  'ana10-c6-s1-n78', 'ana10-c6-s2-n79', 'ana10-c6-s4-n91', 'ana10-c6-s4-n92']
const args = [`${ticket}/rebind-book-trace.py`, '10c', ...lessons]
fs.copyFileSync(`${ticket}/rebind-book-trace.py`, `${output}/rebind-book-trace-used.py`)
fs.copyFileSync(`${ticket}/rebind-choice-provenance-once.py`,
  `${output}/rebind-choice-provenance-used.py`)
const started = new Date().toISOString()
const result = spawnSync('python3', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
fs.writeFileSync(`${output}/command.json`, JSON.stringify({
  args, started, finished: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  limitation: 'Current trace binding only. Existing semantic and display checks reused.',
}, null, 2) + '\n')
fs.writeFileSync(`${output}/stdout.txt`, result.stdout ?? '')
fs.writeFileSync(`${output}/stderr.txt`, result.stderr ?? '')
for (const lesson of lessons) {
  const old = `${ticket}/provenance-before-current/10c/${lesson}/234a8ec5dea2`
  if (fs.existsSync(old)) fs.cpSync(old, `${output}/before/${lesson}`, { recursive: true })
  fs.cpSync(`ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/${lesson}/choice-set`,
    `${output}/after/${lesson}`, { recursive: true })
}
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
process.exitCode = result.status ?? 1
