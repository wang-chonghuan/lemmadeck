import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

const root = import.meta.dirname
const oldRoot = path.join(path.dirname(root), 'production-modern10c114-first-offline-review')
const receipt = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }
}
const inherited = path.join(oldRoot, 'input-freeze.json')
const freezeBytes = fs.readFileSync(inherited)
assert.equal(createHash('sha256').update(freezeBytes).digest('hex'),
  'c4a3105e5d9b26e1d2969aacf8a70373e6148b85e1afd3f4571690859ea9e8d4')
const freeze = JSON.parse(freezeBytes)
assert.equal(freeze.status, 'PASS_EXACT_INPUT_FREEZE')
fs.writeFileSync(path.join(root, 'prepare-once.lock'), new Date().toISOString(), { flag: 'wx' })
const copies = []
const copy = (source, destination, expected) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  const actual = receipt(destination)
  if (expected) {
    assert.equal(actual.bytes, expected.bytes)
    assert.equal(actual.sha256, expected.sha256)
  }
  copies.push({ source, destination: actual, expectedBinding: expected || null })
}
copy(inherited, path.join(root, 'input-freeze.json'), { bytes: 14066,
  sha256: 'c4a3105e5d9b26e1d2969aacf8a70373e6148b85e1afd3f4571690859ea9e8d4' })
for (const input of freeze.inputs) copy(input.snapshot.path, path.join(root, 'inputs', input.name), input.snapshot)
copy(path.join(oldRoot, 'common.mjs'), path.join(root, 'common.mjs'))
copy(path.join(oldRoot, 'browser-check.mjs'), path.join(root, 'browser-check.mjs'), {
  bytes: 14853, sha256: '2c951446f6d639106f7c6cadad4dc5d5778803e516144d61edcdc5b346230d38' })
fs.writeFileSync(path.join(root, 'copy-bindings.json'), `${JSON.stringify({
  kind: 'Authorized byte-identical reuse/copy of already frozen inputs, NOT a new freeze/content PASS',
  inheritedFreeze: { path: inherited, bytes: freezeBytes.length,
    sha256: 'c4a3105e5d9b26e1d2969aacf8a70373e6148b85e1afd3f4571690859ea9e8d4' },
  copies, oldPackageHistoricalStatus: 'FAIL_OFFLINE_CHECK_EXECUTION, UNKNOWN browser/visual, lifetime0/24 unchanged',
}, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: 'COPIED_EXISTING_BINDINGS', files: copies.length,
  bindings: receipt(path.join(root, 'copy-bindings.json')) }))
