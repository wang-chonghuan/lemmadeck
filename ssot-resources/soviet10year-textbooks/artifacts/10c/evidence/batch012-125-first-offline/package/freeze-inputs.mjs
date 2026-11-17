import assert from 'node:assert/strict'
import fs from 'node:fs'
import { inputs, root, save, saveJson, sha256, fileReceipt } from './common.mjs'

const report = { status: 'INCOMPLETE', startedAt: new Date().toISOString(),
  argv: process.argv, cwd: process.cwd(), ownedRoot: root, entries: [] }
try {
  for (const input of inputs) {
    const bytes = fs.readFileSync(input.source)
    const source = { path: input.source, bytes: bytes.length, sha256: sha256(bytes) }
    report.entries.push({ ...input, original: source })
    assert.equal(source.sha256, input.expectedSha256, `Exact authorized SHA mismatch: ${input.name}`)
    const snapshot = save(`inputs/${input.name}`, bytes)
    report.entries.at(-1).snapshotReceipt = snapshot
    assert.equal(snapshot.sha256, source.sha256)
    assert.equal(snapshot.bytes, source.bytes)
  }
  report.status = 'PASS_EXACT_SIX_INPUT_SNAPSHOT'
  report.imagePlan = fileReceipt(`${root}/image-plan.md`)
} catch (error) {
  report.status = 'FAIL_STOP_NO_RETRY'
  report.error = { name: error.name, message: error.message, stack: error.stack }
  console.error(error.stack)
  process.exitCode = 1
} finally {
  report.endedAt = new Date().toISOString()
  console.log(JSON.stringify({ status: report.status, receipt: saveJson('input-snapshot.json', report) }))
}
