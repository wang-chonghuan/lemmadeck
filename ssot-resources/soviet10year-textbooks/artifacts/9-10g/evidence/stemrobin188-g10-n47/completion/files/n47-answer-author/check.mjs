import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-author')
if (process.cwd() !== repo) throw new Error('Wrong cwd')
const mode = process.argv[2]
const candidate = path.join(own, 'candidate/answer-keys.json')
const digest = crypto.createHash('sha256').update(fs.readFileSync(candidate)).digest('hex')
const freeze = JSON.parse(fs.readFileSync(path.join(own, 'evidence/first-candidate-freeze.json'), 'utf8'))
if (digest !== freeze.candidate.sha256) throw new Error('Frozen candidate changed')
const receipt = path.join(own, `evidence/${mode}-receipt.json`)
if (fs.existsSync(receipt)) throw new Error('Check already attempted; do not repeat a completed stage')
const tools = '.claude/skills/ld-s10y-answer/tools'
const exercises = path.join(own, 'artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s2-n47/exercises.json')
const commands = {
  structure: {
    executable: 'python3',
    args: ['-c', [
      'import json,sys',
      `sys.path.insert(0, ${JSON.stringify(path.join(repo, tools))})`,
      'import lesson_answers as k',
      `profile=k.load(k.MODERN_US_PROFILE)`,
      `doc,errors=k.validate_lesson(k.Path(${JSON.stringify(candidate)}),k.Path(${JSON.stringify(exercises)}),"9-10g","geo910-c2-s2-n47","modern-us-neutral",profile.get("forbidden_terms",[])+profile.get("forbidden_person_names",[]))`,
      'print(json.dumps({"status":"fail" if errors else "pass","errors":errors,"answerCount":len(doc["answers"]),"candidateStatus":doc["status"],"finalizeCalled":False,"gate2Approval":False},ensure_ascii=False,indent=2))',
      'sys.exit(2 if errors else 0)',
    ].join('\n')],
  },
  expected: {
    executable: 'node',
    args: [`${tools}/check_math_expressions.mjs`, candidate],
  },
  exact: {
    executable: 'node',
    args: [
      `${tools}/check_mathlive_exact.mjs`,
      '--answer-key', candidate,
      '--output', path.join(own, 'evidence/mathlive-exact.json'),
    ],
  },
}
const command = commands[mode]
if (!command) throw new Error('Use structure, expected or exact')
const result = spawnSync(command.executable, command.args, {
  cwd: repo,
  encoding: 'utf8',
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(own, 'runtime-tmp') },
  maxBuffer: 10 * 1024 * 1024,
})
let parsed = null
try { parsed = JSON.parse(result.stdout) } catch { /* Raw output is retained below. */ }
const output = {
  mode, ...command, cwd: repo,
  candidateSha256: digest,
  attempts: 1,
  exitCode: result.status,
  stdout: result.stdout, stderr: result.stderr,
  error: result.error?.message ?? null,
  parsed,
  authorSideOnly: true,
  gate2Approval: false,
  finalizeCalled: false,
  publishCalled: false,
}
fs.writeFileSync(receipt, `${JSON.stringify(output, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  mode, receipt, exitCode: result.status, status: parsed?.status,
  checked: parsed?.checked, caseCount: parsed?.caseCount,
  failures: parsed?.failures ?? parsed?.errors,
}, null, 2))
process.exitCode = result.status ?? 2
