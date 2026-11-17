import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const outputRoot = path.dirname(fileURLToPath(import.meta.url))
const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const scripts = path.join(cwd, '.agents/skills/ld-s10y-image/scripts')
const receiptsPath = path.join(outputRoot, 'command-receipts.json')
const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' }
delete env.PWDEBUG
if (fs.existsSync(receiptsPath)) throw new Error('Refusing to overwrite first receipts')
const receipts = {
  schema: 'd179-author-command-receipts@1',
  cwd,
  scope: ['fig-120', 'fig-127'],
  environment: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never', headless: true, isolated: true },
  commands: [],
}
const run = (figure, kind, executable, args) => {
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, { cwd, env, encoding: 'utf8' })
  const entry = {
    figure, kind, executable, args, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal,
    stdout: result.stdout || '', stderr: result.stderr || '',
    error: result.error?.message || null,
  }
  receipts.commands.push(entry)
  fs.writeFileSync(receiptsPath, `${JSON.stringify(receipts, null, 2)}\n`)
  console.log(JSON.stringify(entry))
  return result.status
}
for (const figure of receipts.scope) {
  const directory = path.join(outputRoot, figure)
  const spec = path.join(directory, 'spec.json')
  const svg = path.join(directory, `${figure}.svg`)
  const png = path.join(directory, `${figure}.preview.png`)
  const report = path.join(directory, `${figure}.render.json`)
  if ([svg, png, report].some(file => fs.existsSync(file))) {
    throw new Error(`Refusing to overwrite first outputs for ${figure}`)
  }
  const draftExit = run(figure, 'first-draft', 'python3', [
    path.join(scripts, 'validate_spec.py'), spec, '--stage', 'draft', '--json',
  ])
  if (draftExit !== 0) continue
  run(figure, 'first-render', process.execPath, [
    path.join(scripts, 'render_spec.mjs'),
    '--spec', spec, '--svg', svg, '--png', png, '--report', report,
  ])
}
