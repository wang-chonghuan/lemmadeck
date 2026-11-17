import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { root, fileReceipt, save, saveJson } from './common.mjs'

if (process.argv.includes('--write-manifest')) {
  const files = []
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (entry.isFile()) files.push(fileReceipt(file))
      else throw new Error(`Unexpected non-file output: ${file}`)
    }
  }
  walk(root)
  const freeze = JSON.parse(fs.readFileSync(path.join(root, 'input-freeze.json'), 'utf8'))
  const browser = fs.existsSync(path.join(root, 'browser-results.json'))
    ? JSON.parse(fs.readFileSync(path.join(root, 'browser-results.json'), 'utf8')) : null
  const manifest = saveJson('complete-manifest.json', {
    scope: 'OFFLINE ONLY; immutable first observations and textual independent visual findings.',
    originalInputs: freeze.inputs.map(({ actual }) => actual), guidance: freeze.guidance,
    runtimeInputs: freeze.runtime, browserRuntimeInputs: browser?.runtime,
    browserLoadedCommonJsFiles: browser?.loadedCommonJsFiles || [],
    outputs: files, selfReference: 'This manifest and outer seal-command receipts are excluded to avoid recursive hashes; their hashes are emitted by the executing outer seal command.',
    createdAt: new Date().toISOString(),
  })
  console.log(JSON.stringify({ manifest, outputFiles: files.length }))
} else {
  save('seal-once.lock', `${new Date().toISOString()}\n`)
  const startedAt = new Date().toISOString()
  const executable = process.execPath
  const argv = [executable, import.meta.filename, '--write-manifest']
  const program = fileReceipt(import.meta.filename)
  const runtime = fileReceipt(executable)
  const child = spawnSync(executable, argv.slice(1), { cwd: process.cwd(), encoding: null })
  const endedAt = new Date().toISOString()
  const stdout = save('commands/seal.stdout.raw', child.stdout || Buffer.alloc(0))
  const stderr = save('commands/seal.stderr.raw', child.stderr || Buffer.alloc(0))
  const receipt = saveJson('commands/seal.receipt.json', {
    executable, argv, cwd: process.cwd(), startedAt, endedAt, exitStatus: child.status,
    signal: child.signal, error: child.error ? { message: child.error.message, stack: child.error.stack } : null,
    program, runtime, stdout, stderr, manifest: fileReceipt(path.join(root, 'complete-manifest.json')),
  })
  const supplement = saveJson('seal-supplement-manifest.json', {
    completeManifest: fileReceipt(path.join(root, 'complete-manifest.json')),
    finalOutputs: [stdout, stderr, receipt],
    selfReference: 'Hash of this supplement is returned as text by the actual seal process, not recursively embedded.',
  })
  process.stdout.write(child.stdout || Buffer.alloc(0))
  process.stderr.write(child.stderr || Buffer.alloc(0))
  console.log(JSON.stringify({ sealReceipt: receipt, supplement }))
  process.exitCode = child.status || (child.error ? 1 : 0)
}
