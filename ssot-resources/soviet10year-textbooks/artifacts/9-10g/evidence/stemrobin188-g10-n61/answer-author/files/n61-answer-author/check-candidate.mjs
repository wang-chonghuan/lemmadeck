import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {spawnSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import {validateMathExpected} from '../../../../../.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const output = path.dirname(fileURLToPath(import.meta.url))
const successor = process.argv[2] === 'v2'
const candidate = path.join(output, `work/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n61/answer-keys.candidate${successor ? '.v2' : ''}.json`)
const template = path.join(output, 'work/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n61/answer-keys.template.json')
const exercises = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s3-n61/exercises.json')
const bytes = fs.readFileSync(candidate)
const hash = crypto.createHash('sha256').update(bytes).digest('hex')
if (!successor) {
  assert.equal(hash, 'f143fe03dcafc8c758fcd0c37c20825b2abecd48e3f8fb5fc4b20acd7dd2a660')
  assert.equal(fs.statSync(candidate).mode & 0o777, 0o444)
}
const doc = JSON.parse(bytes)
const sourceTemplate = JSON.parse(fs.readFileSync(template))
assert.deepEqual(doc.answers.map(a => a.exercise), sourceTemplate.answers.map(a => a.exercise))
assert.ok(doc.answers.every(a => a.source === 'derived'))
assert.ok(doc.answers.flatMap(a => a.parts).every(p => typeof p.label === 'string' && p.label.trim()))
const python = [
  'import importlib.util,json,sys',
  'from pathlib import Path',
  "spec=importlib.util.spec_from_file_location('lesson_answers',sys.argv[1])",
  'module=importlib.util.module_from_spec(spec)',
  'spec.loader.exec_module(module)',
  "document,errors=module.validate_lesson(Path(sys.argv[2]),Path(sys.argv[3]),'9-10g','geo910-c2-s3-n61','modern-us-neutral')",
  "print(json.dumps({'status':'fail' if errors else 'pass','errors':errors},ensure_ascii=False))",
  'sys.exit(2 if errors else 0)'
].join('\n')
const structuralRun = spawnSync('python3', ['-B', '-c', python, path.join(repo, '.claude/skills/ld-s10y-answer/tools/lesson_answers.py'), candidate, exercises], {cwd: repo, encoding: 'utf8'})
if (structuralRun.error) throw structuralRun.error
if (structuralRun.status !== 0) throw Error(structuralRun.stderr + structuralRun.stdout)
const structural = JSON.parse(structuralRun.stdout)
const parts = doc.answers.flatMap(a => a.parts)
const math = validateMathExpected(parts)
assert.equal(parts.filter(p => p.judge === 'exact').length, 0)
const report = {
  status: math.status,
  scope: 'minimal structure and current ComputeEngine Parse/numeric finite-real checks only',
  candidate: {path: candidate, sha256: hash, bytes: bytes.length, mode: (fs.statSync(candidate).mode & 0o777).toString(8).padStart(4, '0'), first: !successor},
  structural,
  math,
  counts: {
    exercises: doc.answers.length,
    auto: doc.answers.filter(a => a.grading === 'auto').length,
    ungraded: doc.answers.filter(a => a.grading === 'ungraded').length,
    parts: parts.length,
    numeric: parts.filter(p => p.judge === 'numeric').length,
    expression: parts.filter(p => p.judge === 'expression').length,
    exact: 0
  },
  formalFinalizeExecuted: false,
  mathliveKeyboardContractExecuted: false
}
fs.writeFileSync(path.join(output, successor ? 'verification.v2.json' : 'verification.first.json'), JSON.stringify(report, null, 2) + '\n', {flag: 'wx'})
console.log(JSON.stringify(report, null, 2))
process.exitCode = math.status === 'pass' ? 0 : 2
