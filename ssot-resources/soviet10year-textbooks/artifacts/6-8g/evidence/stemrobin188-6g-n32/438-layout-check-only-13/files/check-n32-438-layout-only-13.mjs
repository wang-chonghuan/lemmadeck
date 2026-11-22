import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n32-438-layout-check-only-13')
fs.mkdirSync(own)
const candidate = path.join(tmp, 'n32-438-modern-submarkers-revision1-13/exercises.template.json')
const item = read(candidate).exercises.find(exercise => exercise.number === '438')
const argv = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-c',
  'import json,sys; sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools"); from edition import normalize_numbered_subparts,validate_numbered_subpart_layout; text=sys.stdin.read(); errors=validate_numbered_subpart_layout(text); print(json.dumps({"exercise":"438","errors":errors,"idempotent":normalize_numbered_subparts(text)==text})); sys.exit(bool(errors))',
]
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, input: item.text, encoding: 'utf8' })
const streams = {}
for (const name of ['stdout', 'stderr']) {
  const file = path.join(own, `layout.${name}`)
  fs.writeFileSync(file, result[name] ?? '', { flag: 'wx' })
  streams[name] = bind(file)
}
const receipt = path.join(own, 'execution.json')
save(receipt, {
  cwd: repo, argv, stdinField: 'exercise438.text', stdinSource: bind(candidate),
  startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, streams,
})
assert.equal(result.status, 0)
const checks = JSON.parse(result.stdout)
assert.equal(checks.idempotent, true)
assert.deepEqual(checks.errors, [])
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/438-layout-check-only-13',
  [bind(candidate), bind(receipt), ...Object.values(streams), bind(path.join(tmp, 'check-n32-438-layout-only-13.mjs'))],
  ['evidence/stemrobin188-6g-n32/438-modern-submarkers-revision1-13/retention.json'],
  {
    status: 'CHANGED438_LAYOUT_HELPER_PASS_ONLY_NOT_CONTENT_APPROVAL',
    checks, noFullAdaptFinalize: true, noFormulaOrNumericReplay: true,
    independentAffectedReviewPending: true, imageLoads: 0, activeExecSessions: [],
  },
)))
