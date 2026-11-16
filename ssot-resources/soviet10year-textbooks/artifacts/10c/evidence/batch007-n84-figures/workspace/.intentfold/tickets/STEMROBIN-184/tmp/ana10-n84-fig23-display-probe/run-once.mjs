import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const output = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n84-fig23-display-probe')
const marker = path.join(output, 'attempt.started.json')
if (fs.existsSync(marker)) throw new Error('First mechanical probe already started; do not repeat')
const executable = process.execPath
const argv = [path.join(output, 'probe.mjs')]
const started = new Date().toISOString()
const command = {
  executable,
  argv,
  cwd: root,
  environment: { PWDEBUG: null, PLAYWRIGHT_HTML_OPEN: 'never' },
  launcherEnvironment: {
    PWDEBUGIsActuallyUnset: process.env.PWDEBUG === undefined,
    PLAYWRIGHT_HTML_OPEN: process.env.PLAYWRIGHT_HTML_OPEN || null,
  },
  started,
  outerInvocation: { executable: process.execPath, argv: process.argv.slice(1) },
}
fs.writeFileSync(marker, `${JSON.stringify(command, null, 2)}\n`)
const result = spawnSync(executable, argv, {
  cwd: root,
  env: process.env,
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
})
fs.writeFileSync(path.join(output, 'command.stdout.txt'), result.stdout || '')
fs.writeFileSync(path.join(output, 'command.stderr.txt'), result.stderr || '')
fs.writeFileSync(path.join(output, 'command.json'), `${JSON.stringify({
  ...command,
  finished: new Date().toISOString(),
  exit: result.status,
  signal: result.signal,
  error: result.error?.message || null,
}, null, 2)}\n`)
process.stdout.write(result.stdout || '')
process.stderr.write(result.stderr || '')
process.exitCode = result.status ?? 1
