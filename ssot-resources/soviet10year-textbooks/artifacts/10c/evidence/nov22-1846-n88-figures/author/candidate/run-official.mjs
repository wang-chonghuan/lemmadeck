import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck'
const owner = path.join(repo, '.tmp/stemrobin-184-six/n88-fig38-41-author/candidate')
const input = path.join(repo, '.tmp/stemrobin-184-six/n88-figure-text-release/input')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const skill = path.join(repo, '.agents/skills/ld-s10y-image')
const [stage, figure] = process.argv.slice(2)
assert.ok(['context', 'author', 'validate', 'render', 'package'].includes(stage))
assert.ok(['author', 'package'].includes(stage)
  ? figure === 'all'
  : ['fig-38', 'fig-39', 'fig-40', 'fig-41'].includes(figure))
const directory = ['author', 'package'].includes(stage) ? owner : path.join(owner, figure.replace('-', ''))
fs.mkdirSync(directory, { recursive: true })
const receiptPath = path.join(directory, `${stage}.execution.json`)
assert.ok(!fs.existsSync(receiptPath), `Stage already attempted: ${stage} ${figure}`)
const fileHash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, sha256: fileHash(file) })
const spec = path.join(directory, 'spec.json')
let command
let argv
let inputs
let outputs
if (stage === 'package') {
  command = python
  argv = [path.join(owner, 'package-candidates.py')]
  inputs = [
    binding(argv[0]),
    binding(path.join(owner, 'authoring-record.json')),
    ...[38, 39, 40, 41].map(n => binding(path.join(owner, `fig${n}/render.execution.json`))),
  ]
  outputs = [path.join(owner, 'text-report.md'), path.join(owner, 'hash-manifest.json')]
} else if (stage === 'author') {
  command = process.execPath
  argv = [path.join(owner, 'author-candidates.mjs')]
  const texts = path.join(input, '10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n88')
  inputs = [
    binding(argv[0]),
    binding(path.join(repo, '.tmp/stemrobin-184-six/n88-figure-text-release/manifest.json')),
    binding(path.join(owner, '../source-freeze/hash-manifest.json')),
    binding(path.join(texts, 'lesson.json')),
    binding(path.join(texts, 'exercises.json')),
  ]
  outputs = [
    path.join(owner, 'authoring-record.json'),
    ...[38, 39, 40, 41].flatMap(n => [
      path.join(owner, `fig${n}/spec.json`),
      path.join(owner, `fig${n}/mathematical-basis.json`),
    ]),
  ]
} else if (stage === 'context') {
  command = python
  argv = [
    path.join(skill, 'scripts/build_context.py'),
    '--root', input, '--book', '10c', '--edition', 'modern-us-neutral',
    '--figure', figure, '--output', path.join(directory, 'context.json'),
  ]
  const texts = path.join(input, '10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n88')
  inputs = [
    binding(path.join(repo, '.tmp/stemrobin-184-six/n88-figure-text-release/manifest.json')),
    binding(path.join(texts, 'lesson.json')),
    binding(path.join(texts, 'exercises.json')),
  ]
  outputs = [path.join(directory, 'context.json')]
} else if (stage === 'validate') {
  assert.equal(JSON.parse(fs.readFileSync(path.join(directory, 'context.execution.json'))).exitCode, 0)
  command = python
  argv = [path.join(skill, 'scripts/validate_spec.py'), spec, '--stage', 'draft', '--json']
  inputs = [binding(spec), binding(path.join(directory, 'context.json'))]
  outputs = []
} else {
  const validation = JSON.parse(fs.readFileSync(path.join(directory, 'validate.execution.json')))
  assert.equal(validation.exitCode, 0, 'Do not render a failed draft')
  assert.equal(fileHash(spec), validation.inputs.find(item => item.path === spec).sha256)
  command = process.execPath
  argv = [
    path.join(skill, 'scripts/render_spec.mjs'), '--spec', spec,
    '--svg', path.join(directory, `${figure}.svg`),
    '--png', path.join(directory, 'preview.png'),
    '--report', path.join(directory, 'render.json'),
  ]
  inputs = [binding(spec), binding(path.join(directory, 'validate.execution.json'))]
  outputs = [
    path.join(directory, `${figure}.svg`),
    path.join(directory, 'preview.png'),
    path.join(directory, 'render.json'),
  ]
}
for (const file of outputs) assert.ok(!fs.existsSync(file), `Refuse output overwrite: ${file}`)
const startedAt = new Date().toISOString()
const result = spawnSync(command, argv, {
  cwd: repo,
  env: { ...process.env, PYTHON: python },
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
  timeout: 180000,
})
const stdout = path.join(directory, `${stage}.stdout.txt`)
const stderr = path.join(directory, `${stage}.stderr.txt`)
fs.writeFileSync(stdout, result.stdout || '')
fs.writeFileSync(stderr, result.stderr || '')
const receipt = {
  schema: 'n88-figure-candidate-execution@1',
  figure, stage, command, argv, cwd: repo,
  startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal,
  error: result.error ? { code: result.error.code, message: result.error.message } : null,
  environmentOverrides: { PYTHON: python },
  inputs,
  executedScript: binding(argv[0]),
  streams: { stdout: binding(stdout), stderr: binding(stderr) },
  outputs: outputs.filter(file => fs.existsSync(file)).map(binding),
  technicalAccounting: {
    originalPngHeaderReads: stage === 'context' ? 1 : 0,
    sourcePngHashReadsInsideOfficialContext: stage === 'context' ? 1 : 0,
    newModelImagePayloads: 0,
    newPreviewPngs: outputs.filter(file => file.endsWith('.png') && fs.existsSync(file)).length,
    rendererInternalHeadlessOnly: stage === 'render',
    interactiveBrowserOrDisplay: false,
  },
  candidateOnly: true,
  approvalClaimed: false,
}
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`)
console.log(JSON.stringify({
  figure, stage, exitCode: result.status, receipt: binding(receiptPath),
  outputs: receipt.outputs,
}))
if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)
process.exitCode = result.status ?? 1
