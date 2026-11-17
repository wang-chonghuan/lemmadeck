import fs from 'node:fs'
import assert from 'node:assert/strict'
import path from 'node:path'
import { createRequire } from 'node:module'
import { root, repo, inputs, guidance, sha256, fileReceipt, save, saveJson } from './common.mjs'

const startedAt = new Date().toISOString()
const report = { status: 'INCOMPLETE', startedAt, inputs: [], guidance: [] }
try {
  // Read each supplied input exactly once, before parsing or browser consumption.
  const buffers = inputs.map((input) => {
    const bytes = fs.readFileSync(input.original)
    const actual = { path: input.original, bytes: bytes.length, sha256: sha256(bytes) }
    report.inputs.push({ ...input, actual })
    return bytes
  })
  for (let index = 0; index < inputs.length; index++) {
    assert.equal(report.inputs[index].actual.bytes, inputs[index].expectedBytes, inputs[index].name)
    assert.equal(report.inputs[index].actual.sha256, inputs[index].expectedSha256, inputs[index].name)
  }
  buffers.forEach((bytes, index) => {
    report.inputs[index].snapshot = save(`inputs/${inputs[index].name}`, bytes)
  })
  report.guidance = guidance.map(fileReceipt)
  const require = createRequire(path.join(repo, 'app/package.json'))
  const { chromium } = require('playwright')
  report.runtime = {
    node: fileReceipt(process.execPath),
    nodeVersion: process.version,
    versions: process.versions,
    platform: process.platform,
    architecture: process.arch,
    chromium: fileReceipt(chromium.executablePath()),
    playwrightPackage: fileReceipt(require.resolve('playwright/package.json')),
    loadedCommonJsFiles: Object.keys(require.cache).filter((file) => fs.statSync(file).isFile()).map(fileReceipt),
  }
  report.scripts = fs.readdirSync(root).filter((name) => name.endsWith('.mjs')).map((name) => fileReceipt(path.join(root, name)))
  report.status = 'PASS_EXACT_INPUT_FREEZE'
} catch (error) {
  report.status = 'FAIL_INPUT_FREEZE'
  report.error = { name: error.name, message: error.message, stack: error.stack }
  console.error(error.stack)
  process.exitCode = 1
} finally {
  report.endedAt = new Date().toISOString()
  const receipt = saveJson('input-freeze.json', report)
  console.log(JSON.stringify({ status: report.status, report: receipt, inputCount: report.inputs.length }))
}
