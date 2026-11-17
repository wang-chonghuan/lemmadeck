import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { root, save, saveJson, fileReceipt } from './common.mjs'

save('retain-seal.once', `${new Date().toISOString()}\n`)
const executable = process.execPath
const args = [path.join(root, 'command.mjs'), 'seal']
const cwd = process.cwd()
const program = fileReceipt(args[0])
const runtime = fileReceipt(executable)
const startedAt = new Date().toISOString()
const child = spawnSync(executable, args, { cwd, encoding: null, maxBuffer: 128 * 1024 * 1024 })
const endedAt = new Date().toISOString()
const stdout = save('commands/seal-launcher.stdout.raw', child.stdout || Buffer.alloc(0))
const stderr = save('commands/seal-launcher.stderr.raw', child.stderr || Buffer.alloc(0))
const receipt = saveJson('commands/seal-launcher.receipt.json', {
  executable, argv: [executable, ...args], cwd, startedAt, endedAt,
  exitStatus: child.status, signal: child.signal,
  error: child.error ? { message: child.error.message, code: child.error.code, stack: child.error.stack } : null,
  program, runtime, stdout, stderr,
  outerActualArgv: process.argv, outerProgram: fileReceipt(import.meta.filename),
})
if (child.status === 0 && !child.error) {
  const supplemental = [
    fileReceipt(path.join(root, 'complete-manifest.json')),
    fileReceipt(path.join(root, 'commands/seal.stdout.raw')),
    fileReceipt(path.join(root, 'commands/seal.stderr.raw')),
    fileReceipt(path.join(root, 'commands/seal.receipt.json')),
    stdout, stderr, receipt,
  ]
  const supplement = saveJson('supplement-manifest.json', {
    scope: 'Final immutable manifest plus every output produced after its inventory; no browser check rerun.',
    outputs: supplemental,
    completeManifestExclusionsCovered: true,
    selfReference: 'This supplement cannot recursively hash itself; its exact bytes/SHA256 are emitted by this actual finalizer.',
  })
  process.stdout.write(child.stdout || Buffer.alloc(0))
  process.stderr.write(child.stderr || Buffer.alloc(0))
  console.log(JSON.stringify({ supplement, finalizerReceipt: receipt }))
} else {
  process.stdout.write(child.stdout || Buffer.alloc(0))
  process.stderr.write(child.stderr || Buffer.alloc(0))
}
process.exitCode = child.status || (child.error ? 1 : 0)
