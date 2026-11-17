import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { root, repo, fileReceipt, save, saveJson } from './common.mjs'

save('run-once.lock', `${new Date().toISOString()}\n`)
fs.mkdirSync(path.join(root, 'runtime-temp'), { recursive: true })
const environment = { ...process.env, PWDEBUG: undefined, PLAYWRIGHT_HTML_OPEN: 'never',
  TMPDIR: path.join(root, 'runtime-temp'), DEBUG: 'pw:browser' }
delete environment.PWDEBUG
const commands = []
for (const name of ['freeze', 'browser-check']) {
  const executable = process.execPath
  const args = [path.join(root, `${name}.mjs`)]
  const cwd = path.join(repo, 'app')
  const startedAt = new Date().toISOString()
  const programBefore = fileReceipt(args[0])
  const runtimeBefore = fileReceipt(executable)
  const child = spawnSync(executable, args, { cwd, env: environment, encoding: null, maxBuffer: 64 * 1024 * 1024 })
  const endedAt = new Date().toISOString()
  const stdout = save(`commands/${name}.stdout.raw`, child.stdout || Buffer.alloc(0))
  const stderr = save(`commands/${name}.stderr.raw`, child.stderr || Buffer.alloc(0))
  const receipt = {
    executable, argv: [executable, ...args], cwd, startedAt, endedAt,
    exitStatus: child.status, signal: child.signal,
    error: child.error ? { name: child.error.name, message: child.error.message, stack: child.error.stack, code: child.error.code } : null,
    programBefore, runtimeBefore, programAfter: fileReceipt(args[0]),
    controlledEnvironment: { PWDEBUG: '(removed)', PLAYWRIGHT_HTML_OPEN: environment.PLAYWRIGHT_HTML_OPEN,
      TMPDIR: environment.TMPDIR, DEBUG: environment.DEBUG },
    stdout, stderr,
  }
  const commandReceipt = saveJson(`commands/${name}.receipt.json`, receipt)
  commands.push({ name, commandReceipt, exitStatus: child.status })
  process.stdout.write(child.stdout || Buffer.alloc(0))
  process.stderr.write(child.stderr || Buffer.alloc(0))
  if (child.status !== 0 || child.error) {
    process.exitCode = child.status || 1
    break
  }
}
const receipt = saveJson('execution-index.json', {
  runner: { argv: process.argv, cwd: process.cwd(), program: fileReceipt(import.meta.filename), runtime: fileReceipt(process.execPath) },
  commandCount: commands.length, commands, noReruns: true, endedAt: new Date().toISOString(),
})
console.log(JSON.stringify({ executionIndex: receipt }))
