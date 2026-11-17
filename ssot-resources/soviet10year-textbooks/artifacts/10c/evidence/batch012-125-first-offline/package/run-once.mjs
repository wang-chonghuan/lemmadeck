import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { root, repo, save, saveJson, fileReceipt } from './common.mjs'

save('execution-started.lock', `${new Date().toISOString()}\n`)
const receipt = { startedAt: new Date().toISOString(), argv: process.argv,
  cwd: process.cwd(), executions: [], noRerun: true }
for (const script of ['freeze-inputs.mjs', 'browser-check.mjs']) {
  const args = [path.join(root, script)]
  const startedAt = new Date().toISOString()
  const result = spawnSync(process.execPath, args, {
    cwd: path.join(repo, 'app'), encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, TMPDIR: path.join(root, 'runtime-temp') },
  })
  const item = { argv: [process.execPath, ...args], cwd: path.join(repo, 'app'),
    startedAt, endedAt: new Date().toISOString(), exit: result.status, signal: result.signal,
    error: result.error ? { name: result.error.name, message: result.error.message } : null,
    script: fileReceipt(args[0]), stdout: save(`${script}.stdout.txt`, result.stdout || ''),
    stderr: save(`${script}.stderr.txt`, result.stderr || '') }
  receipt.executions.push(item)
  console.log(JSON.stringify(item))
  if (result.status !== 0 || result.error || result.signal) {
    receipt.status = 'FAIL_STOP_NO_RETRY'
    process.exitCode = 1
    break
  }
}
receipt.status ||= 'PASS_COMMANDS_BROWSER_PENDING_NATIVE_VISUAL'
receipt.endedAt = new Date().toISOString()
console.log(JSON.stringify({ receipt: saveJson('command-receipts.json', receipt) }))
