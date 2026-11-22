import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'

const own = path.join(tmp, 'n32-formal-choice-seed-16')
const stage = process.argv[2]
assert.ok(['inspect', 'prepare'].includes(stage))
assert.equal(read(path.join(tmp, 'n32-install-15/record.json')).status,
  'N32_FIRST_NATIVE_OUTPUTS_INSTALLED_CHOICES_DISPLAY_PENDING')
if (stage === 'inspect') {
  assert.ok(!fs.existsSync(own))
  fs.mkdirSync(own)
} else {
  assert.equal(read(path.join(own, 'inspect.execution.json')).exitCode, 0)
  assert.ok(!fs.existsSync(path.join(own, 'seed.json')))
}
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const argv = [python, '-B', '.agents/skills/ld-s10y-choice/scripts/prepare.py',
  stage, '--repo', '.', '--book', '6-8g', '--lesson', 'geo68-c3-s1-n32']
if (stage === 'prepare') {
  for (const number of ['432', '433', '434', '435', '436', '437', '438', '439', '440'])
    argv.push('--exercise', number)
  for (const block of [1, 2, 6, 8, 15]) argv.push('--concept-block', String(block))
  argv.push('--out', path.join(own, 'seed.json'))
}
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
const streams = {}
for (const stream of ['stdout', 'stderr']) {
  const file = path.join(own, `${stage}.${stream}`)
  fs.writeFileSync(file, result[stream] ?? '', { flag: 'wx' })
  streams[stream] = bind(file)
}
const receiptFile = path.join(own, `${stage}.execution.json`)
save(receiptFile, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, streams,
  nativeInstallation: bind(path.join(tmp, 'n32-install-15/record.json')),
  sourceSolving: bind(path.join(tmp, 'receive-n32-choice-source-solving-16/record.json')),
  parentImageLoads: 0, wholeLessonApproved: false, published: false })
assert.equal(result.status, 0, result.stderr || result.stdout)
if (stage === 'inspect') {
  const inventory = JSON.parse(result.stdout)
  console.log(JSON.stringify({ receipt: bind(receiptFile), inventory }))
} else {
  console.log(JSON.stringify({ receipt: bind(receiptFile),
    seed: bind(path.join(own, 'seed.json')), stdout: result.stdout }))
}
