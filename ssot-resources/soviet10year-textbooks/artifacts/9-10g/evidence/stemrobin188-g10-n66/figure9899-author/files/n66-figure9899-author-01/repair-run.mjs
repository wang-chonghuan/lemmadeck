import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const W = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n66-figure9899-author-01')
const id = 'fig-g10-99'
assert.equal(process.cwd(), R)
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
function metadata(file) {
  const bytes = fs.readFileSync(file)
  return { path: file, sha256: hash(bytes), bytes: bytes.length, mode: (fs.statSync(file).mode & 0o7777).toString(8).padStart(4, '0') }
}
function write(file, value) {
  assert.ok(file.startsWith(`${W}/`))
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
  fs.chmodSync(file, 0o444)
  return metadata(file)
}
function receipt(stage, executable, args) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, { cwd: R, encoding: 'utf8', env: process.env, maxBuffer: 8 * 1024 * 1024 })
  return write(path.join(W, `${id}.${stage}-receipt.json`), {
    schema: 'stemrobin188-native-execution-receipt@1', figure: id, stage, cwd: R,
    executable, args, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error ? String(result.error) : null,
    stdout: result.stdout || '', stderr: result.stderr || '',
  })
}
if (process.argv[2] === 'preserve') {
  const report = load(path.join(W, `${id}.render.json`))
  assert.equal(report.status, 'fail')
  assert.deepEqual(report.collisions.map(c => c.id), ['99-b-label'])
  const preserved = []
  for (const [from, to] of [
    [`${id}.svg`, `${id}.render-FIRST-failed.svg`],
    [`${id}.render.json`, `${id}.render-FIRST-failed.json`],
  ]) {
    const source = path.join(W, from), destination = path.join(W, to)
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(destination, 0o444)
    assert.equal(metadata(source).sha256, metadata(destination).sha256)
    preserved.push({ originalPath: source, ...metadata(destination) })
  }
  console.log(JSON.stringify(write(path.join(W, `${id}.repair-before.json`), {
    schema: 'stemrobin188-targeted-author-repair@1', capturedAt: new Date().toISOString(),
    reason: 'Native render FIRST failed solely on 99-b-label stroke collision, score 10000. Preserve all geometry and source naming; move only its label 16 screen pixels down while remaining southeast of b.',
    repairNumber: 1, category: 'substantive-label-layout',
    currentBefore: metadata(path.join(W, `${id}.spec.json`)),
    first: metadata(path.join(W, `${id}.spec-FIRST.json`)),
    failedOutputs: preserved, independentVisualReview: false,
  }), null, 2))
} else if (process.argv[2] === 'run') {
  const currentPath = path.join(W, `${id}.spec.json`)
  const first = load(path.join(W, `${id}.spec-FIRST.json`))
  const current = load(currentPath)
  const expected = structuredClone(first)
  expected.objects.find(o => o.id === '99-b').labelPlacement.offset = [0, 16]
  assert.deepEqual(current, expected, 'Exactly the one authorized label-layout change is permitted')
  const validator = path.join(R, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')
  const renderer = path.join(R, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')
  const validation = receipt('draft-validate-repair1', 'python3', [validator, currentPath, '--stage', 'draft', '--json'])
  const results = { validation, spec: metadata(currentPath) }
  if (load(validation.path).exitCode === 0) {
    results.rendering = receipt('render-repair1', 'node', [
      renderer, '--spec', currentPath, '--svg', path.join(W, `${id}.svg`),
      '--report', path.join(W, `${id}.render.json`),
    ])
    results.svg = metadata(path.join(W, `${id}.svg`))
    results.render = metadata(path.join(W, `${id}.render.json`))
    results.renderStatus = load(results.render.path).status
  }
  console.log(JSON.stringify(write(path.join(W, `${id}.repair-after.json`), {
    schema: 'stemrobin188-targeted-author-repair-result@1', completedAt: new Date().toISOString(),
    figure: id, substantiveRepairs: 1, technicalRecoveries: 0,
    exactDelta: { object: '99-b', field: 'labelPlacement.offset', before: null, after: [0, 16] },
    geometryUnchanged: true, assertionsUnchanged: true, labelsAndFontSizeUnchanged: true,
    results, status: results.renderStatus === 'pass' ? 'native-draft-and-render-pass-author-only' : 'HOLD-after-single-repair',
    independentReviewAuthorized: false, renderedImagesLoadedIntoContext: 0,
  }), null, 2))
} else {
  throw new Error('Use preserve before the manual apply_patch, then run')
}
