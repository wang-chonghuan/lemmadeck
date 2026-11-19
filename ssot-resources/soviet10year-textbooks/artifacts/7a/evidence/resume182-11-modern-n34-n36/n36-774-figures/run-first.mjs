import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { base, root, hash, writeNew } from './author-graphs.mjs'

assert.equal(process.cwd(), root)
const runtime = path.join(base, 'runtime')
for (const directory of ['tmp', 'home', 'cache', 'config']) {
  fs.mkdirSync(path.join(runtime, directory), { recursive: true })
}
const env = {
  ...process.env,
  TMPDIR: `${path.join(runtime, 'tmp')}/`,
  HOME: path.join(runtime, 'home'),
  XDG_CACHE_HOME: path.join(runtime, 'cache'),
  XDG_CONFIG_HOME: path.join(runtime, 'config'),
  PYTHONDONTWRITEBYTECODE: '1',
  PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}
const findings = []
for (const kind of ['line', 'reciprocal']) {
  const id = `fig-choice-n36-774-${kind}`
  const spec = path.join(base, `${id}.spec.FIRST.json`)
  const outputs = {
    svg: path.join(base, `${id}.FIRST.svg`),
    render: path.join(base, `${id}.render.FIRST.json`),
    preview: path.join(base, `${id}.preview.FIRST.png`),
  }
  for (const file of Object.values(outputs)) assert.ok(!fs.existsSync(file), 'FIRST outputs cannot be overwritten')
  for (const stage of ['validate', 'render']) {
    const command = stage === 'validate' ? 'python3' : process.execPath
    const args = stage === 'validate'
      ? ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage', 'draft', '--json']
      : [
          '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
          '--spec', spec, '--svg', outputs.svg, '--report', outputs.render, '--png', outputs.preview,
        ]
    const receiptName = `${id}.${stage}.FIRST.receipt.json`
    assert.ok(!fs.existsSync(path.join(base, receiptName)), 'FIRST receipt already exists')
    const result = spawnSync(command, args, {
      cwd: root, env, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    })
    const receipt = writeNew(receiptName, {
      schema: 'n36-774/command-receipt@1', attempt: 'FIRST', figure: id, stage,
      cwd: root, command, args, spec: { path: spec, sha256: hash(spec) },
      exitCode: result.status, signal: result.signal,
      error: result.error?.message || null,
      stdout: result.stdout || '', stderr: result.stderr || '',
      filesPreservedAtCompletion: Object.entries(outputs)
        .filter(([, file]) => fs.existsSync(file))
        .map(([role, file]) => ({ role, path: file, sha256: hash(file) })),
      independentGraphGate: { owner: 'parent', status: 'pending' },
    })
    const finding = { figure: id, stage, exitCode: result.status, receipt, sha256: hash(receipt) }
    findings.push(finding)
    console.log(JSON.stringify(finding))
    if (result.status !== 0) {
      console.log(result.stdout || '')
      console.error(result.stderr || '')
      break
    }
  }
}
const receipt = writeNew('execution-summary.FIRST.json', {
  schema: 'n36-774/execution-summary@1', findings,
  policy: 'All FIRST receipts and produced assets are immutable. A first failure is preserved before any targeted spec repair.',
  parentOwnedIndependentGraphGate: 'pending',
})
console.log(JSON.stringify({ summary: receipt, sha256: hash(receipt) }))
