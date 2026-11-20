import assert from 'node:assert/strict'
import { run } from './common.mjs'

const [name, ...argv] = process.argv.slice(2)
assert.ok(name && argv.length)
const receipt = run(name, argv)
console.log(JSON.stringify(receipt, null, 2))
process.exitCode = receipt.exitCode ?? 2
