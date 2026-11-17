import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const scripts = path.join(cwd, '.agents/skills/ld-s10y-image/scripts')
const spec = path.join(root, 'spec.repaired.json')
const svg = path.join(root, 'fig-127.repaired.svg')
const png = path.join(root, 'fig-127.repaired.preview.png')
const renderReport = path.join(root, 'fig-127.repaired.render.json')
const receiptsPath = path.join(root, 'command-receipts.json')
if ([svg, png, renderReport, receiptsPath].some(file => fs.existsSync(file))) {
  throw new Error('Refusing overwrite or a second repair run')
}
const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' }
delete env.PWDEBUG
const receipts = {
  schema: 'd189-fig127-sole-repair-command-receipts@1',
  cwd,
  figure: 'fig-127',
  repairCount: 1,
  environment: { PWDEBUG: 'unset', headless: true, isolated: true },
  commands: [],
}
const run = (kind, executable, args) => {
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, { cwd, env, encoding: 'utf8' })
  const entry = {
    kind, executable, args, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal,
    stdout: result.stdout || '', stderr: result.stderr || '',
    error: result.error?.message || null,
  }
  receipts.commands.push(entry)
  fs.writeFileSync(receiptsPath, `${JSON.stringify(receipts, null, 2)}\n`)
  console.log(JSON.stringify(entry))
  return result.status
}
const draftExit = run('sole-repair-draft', 'python3', [
  path.join(scripts, 'validate_spec.py'), spec, '--stage', 'draft', '--json',
])
if (draftExit !== 0) {
  process.exitCode = draftExit || 1
} else {
  const renderExit = run('sole-repair-render', process.execPath, [
    path.join(scripts, 'render_spec.mjs'),
    '--spec', spec, '--svg', svg, '--png', png, '--report', renderReport,
  ])
  process.exitCode = renderExit || 0
}
